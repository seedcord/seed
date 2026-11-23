import { ButtonBuilder } from '@discordjs/builders';
import { DISCORD_URL } from '@seedcord/brand';
import { CustomId, RowComponent } from '@seedcord/http';
import { ButtonStyle } from 'discord-api-types/v10';

export const GuideMissId = new CustomId('guide-miss').snowflake('searchId');

export class GuideMissButton extends RowComponent<'button'> {
    constructor(searchId: string) {
        super('button');

        this.instance.addComponents(
            new ButtonBuilder()
                .setCustomId(GuideMissId.encode({ searchId }))
                .setLabel('Not what I needed')
                .setStyle(ButtonStyle.Secondary)
        );
    }
}

export class SupportServerButton extends RowComponent<'button'> {
    constructor() {
        super('button');

        this.instance.addComponents(
            new ButtonBuilder()
                .setURL(DISCORD_URL)
                .setLabel('Thanks! Ask in the support server')
                .setStyle(ButtonStyle.Link)
        );
    }
}
