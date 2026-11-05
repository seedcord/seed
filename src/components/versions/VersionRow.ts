import { ButtonBuilder } from '@discordjs/builders';
import { BuilderComponent, Emojis, toEpochSeconds } from '@seedcord/http';
import { ButtonStyle } from 'discord-api-types/v10';

import type { VersionsView } from '#components/versions/view';
import type { PackageVersions } from '#lib/packages';

const NPMX_PACKAGE_URL = 'https://npmx.dev/package';

export class VersionRow extends BuilderComponent<'section'> {
    constructor(pkg: PackageVersions, { channel }: VersionsView) {
        super('section');

        const published = pkg[channel];
        const released = published ? `${Emojis.Dot}<t:${toEpochSeconds(published.publishedAt)}:R>` : '';

        this.instance
            .addTextDisplayComponents((text) =>
                text.setContent(`**${pkg.shortName}**\n-# ${pkg.description}${released}`)
            )
            .setButtonAccessory(
                new ButtonBuilder()
                    .setURL(`${NPMX_PACKAGE_URL}/${pkg.name}${published ? `/v/${published.version}` : ''}`)
                    .setLabel(published ? published.version.replace('-next', '-n') : `no ${channel}`)
                    .setStyle(ButtonStyle.Link)
                    .setDisabled(published === undefined)
            );
    }
}
