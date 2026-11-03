import { ButtonBuilder } from '@discordjs/builders';
import { RowComponent } from '@seedcord/http';
import { ButtonStyle } from 'discord-api-types/v10';

import { EmojiPageId, LAST_PAGE } from '#components/emojis/view';

import type { EmojiScope } from '#lib/emojiStore';
import type { PageView } from '@seedcord/http';

export class PageButtons extends RowComponent<'button'> {
    constructor(scope: EmojiScope, { page, hasPrev, hasNext }: PageView<unknown>) {
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
