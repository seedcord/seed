import { BuilderComponent, Emojis } from '@seedcord/http';

import { ChannelToggle } from '#components/versions/ChannelToggle';
import { GroupTabs } from '#components/versions/GroupTabs';
import { VersionRow } from '#components/versions/VersionRow';

import type { VersionsView } from '#components/versions/view';
import type { PackageVersions } from '#lib/packages';

export class VersionsCard extends BuilderComponent<'container'> {
    constructor(view: VersionsView, packages: readonly PackageVersions[]) {
        super('container');

        this.instance
            .addTextDisplayComponents((text) =>
                text.setContent(`## ${Emojis[view.tab].toString()} ${view.tab} · ${packages.length} packages`)
            )
            .addActionRowComponents(new GroupTabs(view).component)
            .addSeparatorComponents((separator) => separator)
            .addSectionComponents(packages.map((pkg) => new VersionRow(pkg, view).component))
            .addSeparatorComponents((separator) => separator)
            .addActionRowComponents(new ChannelToggle(view).component);
    }
}
