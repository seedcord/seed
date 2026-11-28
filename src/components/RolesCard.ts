import { ButtonBuilder } from '@discordjs/builders';
import { BuilderComponent, CustomId, Emojis } from '@seedcord/http';
import { ButtonStyle, SeparatorSpacingSize } from 'discord-api-types/v10';

import { records, ROLE_IDS } from '#lib/roles';

import type { RoleKey } from '#lib/roles';

export const RolesRefreshId = new CustomId('roles-refresh');

export const WHERE_TO_CLAIM = 'Get them from **Linked Roles** in the server menu.';

export class RolesCard extends BuilderComponent<'container'> {
    constructor(verifyUrl: string) {
        super('container');

        this.instance
            .addTextDisplayComponents((text) => text.setContent(RolesCard.about()))
            .addSeparatorComponents((separator) => separator.setSpacing(SeparatorSpacingSize.Large))
            .addSectionComponents(
                (section) =>
                    section
                        .addTextDisplayComponents((text) => text.setContent(WHERE_TO_CLAIM))
                        .setButtonAccessory(
                            new ButtonBuilder().setURL(verifyUrl).setLabel('Connect').setStyle(ButtonStyle.Link)
                        ),
                (section) =>
                    section
                        .addTextDisplayComponents((text) => text.setContent('Just got your first PR merged?'))
                        .setButtonAccessory(
                            new ButtonBuilder()
                                .setCustomId(RolesRefreshId.encode({}))
                                .setLabel('Refresh')
                                .setStyle(ButtonStyle.Secondary)
                        )
            );
    }

    private static about(): string {
        const lines = (Object.keys(records) as RoleKey[]).map(
            (key) => `<@&${ROLE_IDS[key]}>${Emojis.Dot}${records[key].description}`
        );
        return ['## Roles', ...lines].join('\n');
    }
}
