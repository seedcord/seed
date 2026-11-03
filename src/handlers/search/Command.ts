import { Cooldown, Gated, SlashHandler, SlashRoute } from '@seedcord/http';
import { MessageFlags } from 'discord-api-types/payloads';

import { NoSearchResults } from '#lib/notices';

@Gated(Cooldown('1m', { limit: 10 }))
@SlashRoute('search/guide', 'search/docs')
export class Search extends SlashHandler<'search/guide' | 'search/docs'> {
    public async execute(): Promise<void> {
        const hits = await this.match({
            'search/docs': (options) =>
                this.core.search.docsHits(options.getString('query'), {
                    kind: options.getString('kind'),
                    transport: options.getString('transport'),
                    prerelease: options.getBoolean('prerelease')
                }),
            'search/guide': (options) => this.core.search.guideHits(options.getString('question'))
        });

        const link = hits[0]?.url;
        if (!link) throw new NoSearchResults();

        const url = this.options.getBoolean('suppress-embed') ? `<${link}>` : link;
        const ping = this.options.getUser('ping');

        // sending content because i need the link to embed
        await this.api.interactions.reply(this.event.id, this.event.token, {
            content: ping ? `<@${ping.id}> ${url}` : url,
            flags: this.options.getBoolean('public') ? undefined : MessageFlags.Ephemeral
        });
    }
}
