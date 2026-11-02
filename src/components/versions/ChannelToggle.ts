import { ButtonBuilder } from '@discordjs/builders';
import { Emojis, RowComponent } from '@seedcord/http';
import { ButtonStyle } from 'discord-api-types/v10';

import { otherChannel, VersionsNavId } from '#components/versions/view';

import type { VersionsView } from '#components/versions/view';

export class ChannelToggle extends RowComponent<'button'> {
    constructor(view: VersionsView) {
        super('button');

        const channel = otherChannel(view.channel);

        this.instance.addComponents(
            new ButtonBuilder()
                .setCustomId(VersionsNavId.encode({ ...view, channel }))
                .setLabel(`Show ${channel} versions`)
                .setEmoji(channel === 'latest' ? Emojis.Latest : Emojis.Next)
                .setStyle(ButtonStyle.Secondary)
        );
    }
}
