interface PackageEntry {
    name: string;
    description: string;
}

export const PACKAGE_GROUPS = {
    Core: [
        { name: 'seedcord', description: 'CLI and dev server' },
        { name: '@seedcord/http', description: 'HTTP transport' },
        { name: '@seedcord/gateway', description: 'Gateway transport' },
        { name: '@seedcord/core', description: 'Shared foundation' }
    ],
    Libs: [
        { name: '@seedcord/errors', description: 'Typed errors' },
        { name: '@seedcord/logger', description: 'Channelled logging' },
        { name: '@seedcord/types', description: 'Shared types' },
        { name: '@seedcord/utils', description: 'Small helpers' },
        { name: '@seedcord/custom-id', description: 'Typed custom IDs' },
        { name: '@seedcord/rate-limiter', description: 'Rate limiting' },
        { name: '@seedcord/event-emitter', description: 'Event emitter' }
    ],
    Plugins: [
        { name: '@seedcord/plugin-mongoose', description: 'MongoDB plugin' },
        { name: '@seedcord/plugin-kysely-postgres', description: 'Postgres plugin' }
    ],
    Tools: [
        { name: '@seedcord/eslint-config', description: 'ESLint config' },
        { name: '@seedcord/eslint-plugin', description: 'ESLint rules' },
        { name: '@seedcord/tsconfig', description: 'TypeScript config' }
    ]
} as const satisfies Record<string, readonly PackageEntry[]>;

export type PackageGroup = keyof typeof PACKAGE_GROUPS;

export const GROUP_NAMES = ['Core', 'Libs', 'Plugins', 'Tools'] as const satisfies readonly PackageGroup[];

export const CHANNELS = ['latest', 'next'] as const;

export type Channel = (typeof CHANNELS)[number];

interface PublishedVersion {
    version: string;
    publishedAt: number;
}

export interface PackageVersions extends PackageEntry {
    shortName: string;
    latest: PublishedVersion | undefined;
    next: PublishedVersion | undefined;
}

interface ResolvedTag {
    name: string;
    specifier: string;
    version: string | null;
    publishedAt: string | null;
}

function isNewer(version: string, than: string): boolean {
    const parts = (value: string): number[] => (value.split('-')[0] ?? '').split('.').map(Number);
    const theirs = parts(than);
    for (const [index, part] of parts(version).entries()) {
        const other = theirs[index] ?? 0;
        if (part !== other) return part > other;
    }
    return false;
}

function publishedTag(tags: readonly ResolvedTag[], name: string, specifier: string): PublishedVersion | undefined {
    const tag = tags.find((candidate) => candidate.name === name && candidate.specifier === specifier);
    return tag?.version && tag.publishedAt
        ? { version: tag.version, publishedAt: Date.parse(tag.publishedAt) }
        : undefined;
}

// fast-npm-meta caches for 15 minutes
export async function fetchGroup(group: PackageGroup): Promise<PackageVersions[]> {
    const entries: readonly PackageEntry[] = PACKAGE_GROUPS[group];
    const specs = entries.flatMap(({ name }) => [name, `${name}@next`]).join('+');
    const response = await fetch(`https://npm.antfu.dev/${specs}`);
    const tags = await response.json<ResolvedTag[]>();

    return entries.map(({ name, description }) => {
        const latest = publishedTag(tags, name, 'latest');
        const next = publishedTag(tags, name, 'next');
        return {
            name,
            description,
            shortName: name.replace('@seedcord/', '').replace('plugin-', ''),
            latest,
            next: next && latest && isNewer(next.version, latest.version) ? next : undefined
        };
    });
}
