import { Plugin } from '@seedcord/http';

import { fetchAllVersions } from '#lib/packages';

import type { GroupedVersions, PackageGroup, PackageVersions } from '#lib/packages';

const CACHE_MS = 300_000;

export class Versions extends Plugin {
    private cache: { groups: GroupedVersions; expiresAt: number } | undefined;

    // loads on the first /versions
    public init(): void {}

    public async group(tab: PackageGroup): Promise<PackageVersions[]> {
        if (!this.cache || Date.now() >= this.cache.expiresAt) {
            this.cache = { groups: await fetchAllVersions(), expiresAt: Date.now() + CACHE_MS };
        }
        return this.cache.groups[tab];
    }
}
