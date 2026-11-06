import { ButtonBuilder } from '@discordjs/builders';
import { BuilderComponent, currentTime, Emojis } from '@seedcord/http';
import { ButtonStyle } from 'discord-api-types/v10';

import type { AskedSearch } from '#plugins/Search';
import type { APIUser } from 'discord-api-types/v10';

export interface GuideMissReport extends AskedSearch {
    lookingFor: string;
    user: APIUser;
}

// gotta make sure no pings. also i'm p sure there's a
// better layout for this card but i just can't find one that "hits"
const withoutMentions = (text: string): string => text.replaceAll('@', '@\u200B');

export class GuideMissCard extends BuilderComponent<'container'> {
    constructor({ question, section: { page, heading, url }, lookingFor, user }: GuideMissReport) {
        super('container');

        this.instance
            .addTextDisplayComponents((text) =>
                text.setContent(
                    `-# **${user.username}** asked${Emojis.Dot}<t:${currentTime()}:R>\n>>> ${withoutMentions(question)}`
                )
            )
            .addSectionComponents((section) =>
                section
                    .addTextDisplayComponents((text) =>
                        text.setContent(`-# i answered\n> **${heading ? `${page}${Emojis.Caret}${heading}` : page}**`)
                    )
                    .setButtonAccessory(new ButtonBuilder().setURL(url).setLabel('Open').setStyle(ButtonStyle.Link))
            );

        if (lookingFor) {
            this.instance.addTextDisplayComponents((text) =>
                text.setContent(`-# but they wanted\n>>> ${withoutMentions(lookingFor)}`)
            );
        }

        this.instance
            .addSeparatorComponents((separator) => separator)
            .addTextDisplayComponents((text) => text.setContent(`-# user id \`${user.id}\``));
    }
}
