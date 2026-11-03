import { Cooldown, Gated, SlashHandler, SlashRoute } from '@seedcord/http';
import { MessageFlags } from 'discord-api-types/payloads';

import { outOfAllowanceNotice } from '#lib/text';

import type { GuideAnswer, ReferenceSearchResult } from '@seedcord/docs-search';

type SearchResult = GuideAnswer | { hits: ReferenceSearchResult[] };

@Gated(Cooldown('1m', { limit: 10 }))
@SlashRoute('search/guide', 'search/docs')
export class Search extends SlashHandler<'search/guide' | 'search/docs'> {
    public async execute(): Promise<void> {
        const answer = await this.match<SearchResult>({
            'search/docs': (options) =>
                this.core.search.docsAnswer(options.getString('query'), {
                    kind: options.getString('kind'),
                    transport: options.getString('transport'),
                    prerelease: options.getBoolean('prerelease')
                }),
            'search/guide': (options) => this.core.search.guideAnswer(options.getString('question'))
        });

        if ('retryAfterSeconds' in answer) {
            await this.reply(outOfAllowanceNotice(answer.retryAfterSeconds));
            return;
        }

        const link = answer.hits[0]?.url;

        if (!link) {
            await this.reply('No results found. Try a different query.');
            return;
        }

        const url = this.options.getBoolean('suppress-embed') ? `<${link}>` : link;
        const ping = this.options.getUser('ping');

        // sending content because i need the link to embed
        await this.api.interactions.reply(this.event.id, this.event.token, {
            content: ping ? `<@${ping.id}> ${url}` : url,
            flags: this.options.getBoolean('public') ? undefined : MessageFlags.Ephemeral
        });
    }
}
