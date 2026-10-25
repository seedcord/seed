import { GuideSearch, ReferenceSearch } from '@seedcord/docs-search';
import { Plugin } from '@seedcord/http';

import type { GuideSearchResult, ReferenceSearchResult, SearchResults } from '@seedcord/docs-search';

export class Search extends Plugin {
    private readonly guideSearch = new GuideSearch(undefined, { pages: 25, rows: 25 });
    private readonly referenceSearch = new ReferenceSearch();

    declare referenceIndex: SearchResults;

    public async init(): Promise<void> {
        this.referenceIndex = await this.referenceSearch.results();
    }

    public async guide(query: string): Promise<GuideSearchResult[]> {
        return await this.guideSearch.search(query);
    }

    public docs(query: string): ReferenceSearchResult[] {
        const LIMIT = 25;
        return this.referenceIndex.rank(query, 'all', LIMIT);
    }
}
