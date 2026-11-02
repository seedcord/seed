import { Cooldown, Gated, SlashHandler, SlashRoute } from '@seedcord/http';

import { VersionsCard } from '#components/versions/VersionsCard';
import { fetchGroup } from '#lib/packages';

@Gated(Cooldown('1m', { limit: 10 }))
@SlashRoute('versions')
export class Versions extends SlashHandler<'versions'> {
    public async execute(): Promise<void> {
        await this.defer();

        const card = new VersionsCard({ tab: 'Core', channel: 'latest' }, await fetchGroup('Core'));
        await this.edit({ components: [card.component] });
    }
}
