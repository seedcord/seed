import { ButtonBuilder, StringSelectMenuBuilder } from '@discordjs/builders';
import { BuilderComponent, CustomId, paginate, RowComponent } from '@seedcord/http';
import { ButtonStyle } from 'discord-api-types/v10';

import { EMOJI_SCOPES } from '#lib/emojiStore';

import type { EmojiScope, StoredEmoji } from '#lib/emojiStore';
import type { PageView } from '@seedcord/http';

// discord allows an app 2000 emojis, at 25 a page
const LAST_PAGE = 79;

export const EmojiDeleteId = new CustomId('emoji-delete').oneOf('scope', EMOJI_SCOPES).int('page', 0, LAST_PAGE);
export const EmojiPageId = new CustomId('emoji-page').oneOf('scope', EMOJI_SCOPES).int('page', 0, LAST_PAGE);

// discord caps a select menu at 25 options
const PAGE_SIZE = 25;

const newestFirst = (a: StoredEmoji, b: StoredEmoji): number => (BigInt(b.id) > BigInt(a.id) ? 1 : -1);

class EmojiPicker extends RowComponent<'menu_string'> {
    constructor(scope: EmojiScope, { items, page }: PageView<StoredEmoji>) {
        super('menu_string');

        this.instance.addComponents(
            new StringSelectMenuBuilder()
                .setCustomId(EmojiDeleteId.encode({ scope, page }))
                .setPlaceholder('Pick emojis to delete')
                .setMaxValues(items.length)
                .addOptions(
                    items.map(({ id, name, animated }) => ({
                        label: name,
                        value: id,
                        emoji: { id, name, animated }
                    }))
                )
        );
    }
}

class PageButtons extends RowComponent<'button'> {
    constructor(scope: EmojiScope, { page, hasPrev, hasNext }: PageView<StoredEmoji>) {
        super('button');

        this.instance.addComponents(
            new ButtonBuilder()
                .setCustomId(EmojiPageId.encode({ scope, page: Math.max(0, page - 1) }))
                .setLabel('← Newer')
                .setStyle(ButtonStyle.Secondary)
                .setDisabled(!hasPrev),
            new ButtonBuilder()
                .setCustomId(EmojiPageId.encode({ scope, page: Math.min(page + 1, LAST_PAGE) }))
                .setLabel('Older →')
                .setStyle(ButtonStyle.Secondary)
                .setDisabled(!hasNext)
        );
    }
}

export class EmojiDeleteCard extends BuilderComponent<'container'> {
    constructor(scope: EmojiScope, page: number, emojis: readonly StoredEmoji[]) {
        super('container');

        const view = paginate([...emojis].sort(newestFirst), page, PAGE_SIZE);

        this.instance.addTextDisplayComponents((text) =>
            text.setContent(
                `## Delete ${scope} emojis\n-# ${emojis.length} left · page ${view.page + 1} of ${view.totalPages ?? 1}`
            )
        );

        if (view.items.length > 0) {
            this.instance.addActionRowComponents(new EmojiPicker(scope, view).component);
        }
        if (view.hasPrev || view.hasNext) {
            this.instance.addActionRowComponents(new PageButtons(scope, view).component);
        }
    }
}
