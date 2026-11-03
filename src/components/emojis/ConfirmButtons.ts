import { ButtonBuilder } from '@discordjs/builders';
import { RowComponent } from '@seedcord/http';
import { ButtonStyle } from 'discord-api-types/v10';

import { EmojiDeleteId, EmojiPageId } from '#components/emojis/view';
import { countOf } from '#lib/text';

import type { EmojiView } from '#components/emojis/view';

export class ConfirmButtons extends RowComponent<'button'> {
    constructor(view: EmojiView, pickedCount: number) {
        super('button');

        this.instance.addComponents(
            new ButtonBuilder()
                .setCustomId(EmojiDeleteId.encode(view))
                .setLabel(`Delete ${countOf(pickedCount, 'emoji', 'emojis')}`)
                .setStyle(ButtonStyle.Danger),
            new ButtonBuilder().setCustomId(EmojiPageId.encode(view)).setLabel('Cancel').setStyle(ButtonStyle.Secondary)
        );
    }
}
