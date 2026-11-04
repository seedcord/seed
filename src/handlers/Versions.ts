import { ButtonHandler, ButtonRoute, Cooldown, Gated, SlashHandler, SlashRoute } from '@seedcord/http';

import { VersionsCard } from '#components/versions/VersionsCard';
import { VersionsNavId } from '#components/versions/view';

@Gated(Cooldown('1m', { limit: 10 }))
@SlashRoute('versions')
export class Versions extends SlashHandler<'versions'> {
    public async execute(): Promise<void> {
        await this.defer();
        const card = new VersionsCard({ tab: 'Core', channel: 'latest' }, await this.core.versions.group('Core'));
        await this.edit({ components: [card.component] });
    }
}

@ButtonRoute(VersionsNavId)
export class VersionsNav extends ButtonHandler<[typeof VersionsNavId]> {
    public async execute(): Promise<void> {
        await this.deferUpdate();
        const { tab, channel } = this.params;
        const card = new VersionsCard({ tab, channel }, await this.core.versions.group(tab));
        await this.update({ components: [card.component] });
    }
}
