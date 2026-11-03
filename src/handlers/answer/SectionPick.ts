import { StringMenuHandler, StringMenuRoute } from '@seedcord/http';

import { SectionPickId } from '#components/SectionPicker';
import { GuideSectionGone } from '#lib/notices';

@StringMenuRoute(SectionPickId)
export class SectionPick extends StringMenuHandler<[typeof SectionPickId]> {
    public async execute(): Promise<void> {
        const [path] = this.values;
        const section = path === undefined ? undefined : await this.core.search.guideSection(path);

        if (!section) throw new GuideSectionGone();

        await this.update('Sent.');
        await this.api.interactions.followUp(this.event.application_id, this.event.token, {
            // sending content because i need the link to embed
            content: `<@${this.params.authorId}> ${section.url}`
        });
    }
}
