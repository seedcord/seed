import { ButtonHandler, ButtonRoute } from '@seedcord/http';

import { VersionsCard } from '#components/versions/VersionsCard';
import { VersionsNavId } from '#components/versions/view';
import { fetchGroup } from '#lib/packages';

@ButtonRoute(VersionsNavId)
export class VersionsNav extends ButtonHandler<[typeof VersionsNavId]> {
    public async execute(): Promise<void> {
        await this.deferUpdate();

        const { tab, channel } = this.params;
        const card = new VersionsCard({ tab, channel }, await fetchGroup(tab));
        await this.edit({ components: [card.component] });
    }
}
