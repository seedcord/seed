import { cn, MAIN_CONTENT_ID, PosterButton, tw } from '@seedcord/ui';
import { ApplicationIntegrationType } from 'discord-api-types/v10';

import { Page } from './Page';

import type { ReactNode } from 'react';

const INSTALLS = [
    { label: 'Add to server', type: ApplicationIntegrationType.GuildInstall, variant: 'solid' },
    { label: 'Add to my apps', type: ApplicationIntegrationType.UserInstall, variant: 'outline' }
] as const;

const HEADING = tw`font-display text-[clamp(2.9rem,7vw,5.75rem)] leading-[0.94] font-semibold tracking-tight text-balance text-(--seed-dark)`;
const BLURB = tw`mt-7 max-w-xl text-lg/snug font-medium text-pretty text-(--seed-dark)/85 md:text-xl`;

export function Landing({ applicationId }: { applicationId: string }): ReactNode {
    return (
        <Page title="seed, the seedcord bot" description="Search the seedcord guide and docs from Discord.">
            <main
                id={MAIN_CONTENT_ID}
                className={cn('flex flex-1 flex-col items-center justify-center px-5 py-12 text-center')}
            >
                <h1 className={HEADING}>
                    The guide and docs, <span className={cn('text-(--flesh-deep)')}>in Discord</span>.
                </h1>
                <p className={BLURB}>
                    Search the seedcord guide and docs right from Discord. Ask in your own words or look up a symbol by
                    name.
                </p>
                <div className={cn('mt-8 flex flex-wrap justify-center gap-3')}>
                    {INSTALLS.map(({ label, type, variant }) => (
                        <PosterButton key={type} variant={variant}>
                            <a
                                href={`https://discord.com/oauth2/authorize?client_id=${applicationId}&integration_type=${type}`}
                            >
                                {label}
                            </a>
                        </PosterButton>
                    ))}
                </div>
            </main>
        </Page>
    );
}
