import { ButtonBuilder } from '@discordjs/builders';
import { RowComponent } from '@seedcord/http';
import { ButtonStyle } from 'discord-api-types/v10';

import { VersionsNavId } from '#components/versions/view';
import { GROUP_NAMES } from '#lib/packages';

import type { VersionsView } from '#components/versions/view';

export class GroupTabs extends RowComponent<'button'> {
    constructor(view: VersionsView) {
        super('button');

        this.instance.addComponents(
            GROUP_NAMES.map((tab) =>
                new ButtonBuilder()
                    .setCustomId(VersionsNavId.encode({ ...view, tab }))
                    .setLabel(tab)
                    .setStyle(tab === view.tab ? ButtonStyle.Danger : ButtonStyle.Secondary)
            )
        );
    }
}
