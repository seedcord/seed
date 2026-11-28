import { DISCORD_URL } from '@seedcord/brand';
import { assertNever } from '@seedcord/http';
import { cn, Icon, MAIN_CONTENT_ID, PosterButton, tw } from '@seedcord/ui';
import { Check, X } from 'lucide-react';

import { SEEDCORD_GUILD_ID } from '#lib/commandScope';
import { roleLines } from '#lib/roles';

import { html } from './html';
import { Page } from './Page';

import type { RoleLine, records } from '#lib/roles';
import type { LinkedRolesResult } from '@seedcord/plugin-linked-roles';
import type { ReactNode } from 'react';

interface ResultCopy {
    status: number;
    heading: string;
    text: string;
    lines?: RoleLine[];
    action: { label: string; href: string };
}

// the linked roles plugin serves this route
const TRY_AGAIN = { label: 'Try again', href: '/linked-roles/verify' };

function copyFor(result: LinkedRolesResult<typeof records>): ResultCopy {
    switch (result.kind) {
        case 'connected': {
            return {
                status: 200,
                heading: 'Connected',
                text: 'Go back to Discord and press Finish to get your roles.',
                lines: roleLines(result.connection),
                action: { label: 'Open Discord', href: `https://discord.com/channels/${SEEDCORD_GUILD_ID}` }
            };
        }
        case 'refused': {
            return { status: 200, heading: 'Link GitHub first', text: result.message, action: TRY_AGAIN };
        }
        case 'denied': {
            return {
                status: 400,
                heading: 'Cancelled',
                text: "Nothing changed. Try again if you didn't mean to cancel.",
                action: TRY_AGAIN
            };
        }
        case 'invalid': {
            return {
                status: 400,
                heading: 'This link expired',
                text: 'Open it again from Discord if you need to.',
                action: TRY_AGAIN
            };
        }
        case 'failed': {
            return {
                status: 500,
                heading: 'Something broke',
                text: "Let me know in the seedcord server and I'll fix it.",
                action: { label: 'Open the server', href: DISCORD_URL }
            };
        }
        default: {
            return assertNever(result);
        }
    }
}

const HEADING = tw`font-display text-[clamp(2.4rem,5vw,4rem)] leading-[0.94] font-semibold tracking-tight text-balance text-(--seed-dark)`;
const TEXT = tw`mt-6 max-w-lg text-lg/snug font-medium text-pretty text-(--seed-dark)/85`;

const HAS = { icon: Check, tone: tw`text-(--rind-deep)` };
const LACKS = { icon: X, tone: tw`text-(--flesh-deep)` };

function RoleList({ lines }: { lines: RoleLine[] }): ReactNode {
    return (
        <ul className={cn('mt-8 flex flex-col gap-3 text-left')}>
            {lines.map(({ name, has, missing }) => {
                const { icon, tone } = has ? HAS : LACKS;
                return (
                    <li key={name} className={cn('font-medium text-(--seed-dark)')}>
                        <span className={cn('flex items-center gap-2')}>
                            <Icon icon={icon} size={22} className={tone} />
                            <span className={cn('font-display text-xl font-semibold')}>{name}</span>
                        </span>
                        {has ? null : <p className={cn('ms-7.5 text-sm text-(--seed-dark)/70')}>{missing}</p>}
                    </li>
                );
            })}
        </ul>
    );
}

function RolesResult({ heading, text, lines, action }: ResultCopy): ReactNode {
    return (
        <Page
            title={`${heading} · seed`}
            description="Get the org member and contributor roles in the seedcord server."
        >
            <main
                id={MAIN_CONTENT_ID}
                className={cn('flex flex-1 flex-col items-center justify-center px-5 py-12 text-center')}
            >
                <h1 className={HEADING}>{heading}</h1>
                {lines ? <RoleList lines={lines} /> : null}
                <p className={TEXT}>{text}</p>
                <PosterButton variant="solid" wrapperClassName={cn('mt-8')}>
                    <a href={action.href}>{action.label}</a>
                </PosterButton>
            </main>
        </Page>
    );
}

export function rolesResultPage(result: LinkedRolesResult<typeof records>): Response {
    const copy = copyFor(result);
    return html(<RolesResult {...copy} />, copy.status);
}
