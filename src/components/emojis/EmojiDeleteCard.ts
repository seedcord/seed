import { ButtonBuilder, StringSelectMenuBuilder } from '@discordjs/builders';
import { BuilderComponent, CustomId, RowComponent } from '@seedcord/http';
import { ButtonStyle } from 'discord-api-types/v10';

import { EMOJI_SCOPES } from '#lib/emojiStore';

import type { EmojiScope, StoredEmoji } from '#lib/emojiStore';

export const EmojiDeleteId = new CustomId('emoji-delete').oneOf('scope', EMOJI_SCOPES).int('page');
export const EmojiPageId = new CustomId('emoji-page').oneOf('scope', EMOJI_SCOPES).int('page');

// discord caps a select menu at 25 options
const PAGE_SIZE = 25;

const newestFirst = (a: StoredEmoji, b: StoredEmoji): number => (BigInt(b.id) > BigInt(a.id) ? 1 : -1);

class EmojiPicker extends RowComponent<'menu_string'> {
    constructor(scope: EmojiScope, page: number, emojis: readonly StoredEmoji[]) {
        super('menu_string');

        this.instance.addComponents(
            new StringSelectMenuBuilder()
                .setCustomId(EmojiDeleteId.encode({ scope, page }))
                .setPlaceholder('Pick emojis to delete')
                .setMaxValues(emojis.length)
                .addOptions(
                    emojis.map(({ id, name, animated }) => ({
                        label: name,
                        value: id,
                        emoji: { id, name, animated }
                    }))
                )
        );
    }
}

class PageButtons extends RowComponent<'button'> {
    constructor(scope: EmojiScope, page: number, pageCount: number) {
        super('button');

        this.instance.addComponents(
            new ButtonBuilder()
                .setCustomId(EmojiPageId.encode({ scope, page: page - 1 }))
                .setLabel('← Newer')
                .setStyle(ButtonStyle.Secondary)
                .setDisabled(page === 0),
            new ButtonBuilder()
                .setCustomId(EmojiPageId.encode({ scope, page: page + 1 }))
                .setLabel('Older →')
                .setStyle(ButtonStyle.Secondary)
                .setDisabled(page >= pageCount - 1)
        );
    }
}

export class EmojiDeleteCard extends BuilderComponent<'container'> {
    constructor(scope: EmojiScope, requestedPage: number, emojis: readonly StoredEmoji[]) {
        super('container');

        const pageCount = Math.ceil(emojis.length / PAGE_SIZE);
        const page = Math.min(requestedPage, Math.max(pageCount - 1, 0));
        const shown = [...emojis].sort(newestFirst).slice(page * PAGE_SIZE, (page + 1) * PAGE_SIZE);

        this.instance.addTextDisplayComponents((text) =>
            text.setContent(
                `## Delete ${scope} emojis\n-# ${emojis.length} left · page ${page + 1} of ${Math.max(pageCount, 1)}`
            )
        );

        if (shown.length > 0) {
            this.instance.addActionRowComponents(new EmojiPicker(scope, page, shown).component);
        }
        if (pageCount > 1) {
            this.instance.addActionRowComponents(new PageButtons(scope, page, pageCount).component);
        }
    }
}
