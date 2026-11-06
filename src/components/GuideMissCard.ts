import { ButtonBuilder } from '@discordjs/builders';
import { BuilderComponent, currentTime, Emojis } from '@seedcord/http';
import { ButtonStyle } from 'discord-api-types/v10';

import type { AskedSearch } from '#plugins/Search';
import type { APIUser } from 'discord-api-types/v10';

export interface GuideMissReport extends AskedSearch {
    lookingFor: string;
    user: APIUser;
}

// gotta make sure no pings
const withoutMentions = (text: string): string => text.replaceAll('@', '@\u200B');

export class GuideMissCard extends BuilderComponent<'container'> {
    constructor({ question, section: { page, heading, url }, lookingFor, user }: GuideMissReport) {
        super('container');

        this.instance.addTextDisplayComponents((text) =>
            text.setContent(
                `**${user.username}** didn't find what they needed${Emojis.Dot}<t:${currentTime()}:R>\n>>> ${withoutMentions(question)}`
            )
        );

        if (lookingFor) {
            this.instance.addTextDisplayComponents((text) =>
                text.setContent(`-# they were looking for\n>>> ${withoutMentions(lookingFor)}`)
            );
        }

        this.instance
            .addSeparatorComponents((separator) => separator)
            .addSectionComponents((section) =>
                section
                    .addTextDisplayComponents((text) =>
                        text.setContent(`-# sent them to\n**${heading ? `${page}${Emojis.Caret}${heading}` : page}**`)
                    )
                    .setButtonAccessory(new ButtonBuilder().setURL(url).setLabel('Open').setStyle(ButtonStyle.Link))
            )
            .addTextDisplayComponents((text) => text.setContent(`-# user id \`${user.id}\``));
    }
}
