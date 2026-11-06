import { Cooldown, Gated, SlashHandler, SlashRoute } from '@seedcord/http';
import { MessageFlags } from 'discord-api-types/payloads';

import { GuideMissButton } from '#components/GuideMissButton';
import { NoSearchResults } from '#lib/notices';

@Gated(Cooldown('1m', { limit: 10 }))
@SlashRoute('search/guide', 'search/docs')
export class Search extends SlashHandler<'search/guide' | 'search/docs'> {
    public async execute(): Promise<void> {
        const { link, typed } = await this.match({
            'search/docs': async (options) => {
                const hits = await this.core.search.docsHits(options.getString('query'), {
                    kind: options.getString('kind'),
                    transport: options.getString('transport'),
                    prerelease: options.getBoolean('prerelease')
                });
                return { link: hits[0]?.url, typed: null };
            },
            'search/guide': async (options) => {
                const question = options.getString('question');
                const [section] = await this.core.search.guideHits(question);
                return {
                    link: section?.url,
                    typed: section && section.path !== question ? { question, section } : null
                };
            }
        });
        if (!link) throw new NoSearchResults();

        const url = this.options.getBoolean('suppress-embed') ? `<${link}>` : link;
        const ping = this.options.getUser('ping');
        const isPublic = this.options.getBoolean('public');

        const canReportMiss = typed !== null && !isPublic;

        // sending content because i need the link to embed
        await this.api.interactions.reply(this.event.id, this.event.token, {
            content: ping ? `<@${ping.id}> ${url}` : url,
            components: canReportMiss ? [new GuideMissButton(this.event.id).component.toJSON()] : [],
            flags: isPublic ? undefined : MessageFlags.Ephemeral
        });

        if (canReportMiss) await this.core.search.rememberSearch(this.event.id, typed);
    }
}
