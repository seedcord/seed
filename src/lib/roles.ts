import { RecordType } from '@seedcord/plugin-linked-roles';

import type { LinkedRoleRecords, RoleConnection } from '@seedcord/plugin-linked-roles';
import type { Snowflake } from 'discord-api-types/v10';

export const records = {
    member: {
        type: RecordType.BooleanEqual,
        name: 'member',
        description: 'Shows up as a public member of the seedcord org on GitHub'
    },
    contributor: {
        type: RecordType.BooleanEqual,
        name: 'contributor',
        description: 'Has a merged PR in the seedcord monorepo'
    }
} as const satisfies LinkedRoleRecords;

export type RoleKey = keyof typeof records;

export const ROLE_IDS: Record<RoleKey, Snowflake> = {
    member: '1558722805435207700',
    contributor: '1555909245894004796'
};

const MISSING: Record<RoleKey, string> = {
    member: "Not showing as a public org member. If you're in the org, make it public on GitHub.",
    contributor: "You don't have a merged PR in the seedcord monorepo yet."
};

export interface RoleLine {
    name: string;
    has: boolean;
    missing: string;
}

export function roleLines({ metadata }: RoleConnection<typeof records>): RoleLine[] {
    return (Object.keys(records) as RoleKey[]).map((key) => ({
        name: records[key].name,
        has: metadata[key],
        missing: MISSING[key]
    }));
}
