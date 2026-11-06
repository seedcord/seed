import { ButtonBuilder } from '@discordjs/builders';
import { CustomId, RowComponent } from '@seedcord/http';
import { ButtonStyle } from 'discord-api-types/v10';

export const GuideMissId = new CustomId('guide-miss').snowflake('searchId');

export class GuideMissButton extends RowComponent<'button'> {
    constructor(searchId: string, sent = false) {
        super('button');

        this.instance.addComponents(
            new ButtonBuilder()
                .setCustomId(GuideMissId.encode({ searchId }))
                .setLabel(sent ? 'Sent, thanks' : 'Not what I needed')
                .setStyle(ButtonStyle.Secondary)
                .setDisabled(sent)
        );
    }
}
