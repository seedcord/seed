import { AutocompleteHandler, AutocompleteRoute, SlashHandler, SlashRoute } from '@seedcord/http';
import { MessageFlags } from 'discord-api-types/payloads';

import type { GuideSearchResult, ReferenceSearchResult } from '@seedcord/docs-search';
import type { APIApplicationCommandOptionChoice } from 'discord-api-types/v10';

@SlashRoute('search/guide', 'search/docs')
export class GuideSearch extends SlashHandler<'search/guide' | 'search/docs'> {
    public async execute(): Promise<void> {
        const { query, unhide, ping } = await this.match({
            'search/docs': (options) => ({
                query: options.getString('query'),
                unhide: options.getBoolean('public'),
                ping: options.getUser('ping')
            }),
            'search/guide': (options) => ({
                query: options.getString('query'),
                unhide: options.getBoolean('public'),
                ping: options.getUser('ping')
            })
        });

        let url = query;

        if (!url.startsWith('https://seedcord.org/')) {
            const results = await this.search(query);

            if (results.length === 0 || !results[0]?.url) {
                await this.reply('No results found. Try a different query.');
                return;
            }

            url = results[0].url;
        }

        let output = '';
        if (ping) output = `<@${ping.id}> `;
        output = output + url;

        await this.api.interactions.reply(this.event.id, this.event.token, {
            content: output,
            flags: unhide ? undefined : MessageFlags.Ephemeral
        });
    }

    private async search(query: string): Promise<GuideSearchResult[] | ReferenceSearchResult[]> {
        return this.routeId === 'slash:search/guide' ? this.core.search.guide(query) : this.core.search.docs(query);
    }
}

@AutocompleteRoute('search/guide', 'search/docs')
export class GuideAutocomplete extends AutocompleteHandler<'search/guide' | 'search/docs'> {
    public async execute(): Promise<void> {
        const query = this.options.getString('query');
        if (!query) return await this.respond([]);

        const result = await this.search(query);

        const guideSeen = new Set<string>();

        const choices: APIApplicationCommandOptionChoice<string>[] = result
            .filter((item) => {
                if (!this.isGuideResult(item)) return true;
                const url = item.url.replace('https://seedcord.org/guide/', '');
                if (guideSeen.has(url)) return false;
                guideSeen.add(url);
                return true;
            })
            .map((item) => {
                const name = this.isGuideResult(item)
                    ? `${item.url.replace('https://seedcord.org/guide/', '')}`
                    : `${item.name} | ${item.packageName.replace('@seedcord/', '')}`;

                return {
                    name: name,
                    value: item.url
                };
            });

        if (choices.length === 0) return await this.respond([]);

        await this.match({
            query: (_value, respond) => respond(choices)
        });
    }

    private async search(query: string): Promise<GuideSearchResult[] | ReferenceSearchResult[]> {
        return this.route === 'search/guide' ? this.core.search.guide(query) : this.core.search.docs(query);
    }

    private isGuideResult(obj: GuideSearchResult | ReferenceSearchResult): obj is GuideSearchResult {
        return 'type' in obj;
    }
}
