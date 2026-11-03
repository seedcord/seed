import { env } from 'cloudflare:workers';

import {
    ALL_PACKAGES,
    GUIDE_SECTIONS_PATH,
    GuideMatches,
    guideResult,
    loadOnce,
    parseQuestion,
    readJson,
    ReferenceSearch
} from '@seedcord/docs-search';
import { Plugin } from '@seedcord/http';

import type {
    GuideAnswer,
    GuideResult,
    GuideSection,
    GuideService,
    KindFilter,
    ReferenceSearchResult,
    SearchResults
} from '@seedcord/docs-search';

type Transport = 'http' | 'gateway';

interface DocsFilter {
    kind: KindFilter | null;
    transport: Transport | null;
    prerelease: boolean | null;
}

const MAX_CHOICES = 25;

const OTHER_TRANSPORT_PACKAGE: Record<Transport, string> = {
    http: '@seedcord/gateway',
    gateway: '@seedcord/http'
};

const guideWorker = (): Fetcher & GuideService => env.GUIDE as Fetcher & GuideService;

export class Search extends Plugin {
    private readonly referenceSearch = new ReferenceSearch();

    private readonly prereleaseIndex = loadOnce(() => this.referenceSearch.results(null, ALL_PACKAGES, true));

    private readonly guideIndex = loadOnce(async () => {
        const sections = await readJson<GuideSection[]>(GUIDE_SECTIONS_PATH, (path) =>
            guideWorker().fetch(`https://seedcord.org/guide${path}`)
        );
        return {
            matches: new GuideMatches(sections),
            byPath: new Map(sections.map((section) => [section.path, guideResult(section, { by: 'meaning' })]))
        };
    });

    declare referenceIndex: SearchResults;

    public async init(): Promise<void> {
        this.referenceIndex = await this.referenceSearch.results();
    }

    public async guide(query: string): Promise<GuideResult[]> {
        const { matches } = await this.guideIndex();
        return matches.match(query);
    }

    public async guideSection(path: string): Promise<GuideResult | undefined> {
        const { byPath } = await this.guideIndex();
        return byPath.get(path);
    }

    public async guideAnswer(query: string): Promise<GuideAnswer> {
        const picked = await this.guideSection(query);
        if (picked) return { hits: [picked] };

        const question = parseQuestion(query);
        return question ? await guideWorker().ask(question) : { hits: [] };
    }

    public async docs(query: string, { kind, transport, prerelease }: DocsFilter): Promise<ReferenceSearchResult[]> {
        const hidden = transport && OTHER_TRANSPORT_PACKAGE[transport];
        const index = await this.docsIndex(prerelease);
        return index
            .rank(query, kind ?? 'all', Infinity)
            .filter((result) => result.packageName !== hidden)
            .slice(0, MAX_CHOICES);
    }

    public async docsAnswer(query: string, filter: DocsFilter): Promise<{ hits: ReferenceSearchResult[] }> {
        const index = await this.docsIndex(filter.prerelease);
        const picked = index.get(query);
        return { hits: picked ? [picked] : await this.docs(query, filter) };
    }

    private async docsIndex(prerelease: boolean | null): Promise<SearchResults> {
        return prerelease ? await this.prereleaseIndex() : this.referenceIndex;
    }
}
