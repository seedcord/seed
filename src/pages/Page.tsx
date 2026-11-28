import { cn, GithubIcon, PosterButton, PosterNav, SkipLink } from '@seedcord/ui';

import stylesheet from './styles.css?url';

import type { ReactNode } from 'react';

const REPO_URL = 'https://github.com/seedcord/seed';

function RepoButton(): ReactNode {
    return (
        <PosterButton variant="ink">
            <a href={REPO_URL}>
                <GithubIcon variant="mark" size={20} aria-hidden />
                GitHub
            </a>
        </PosterButton>
    );
}

interface PageProps {
    title: string;
    description: string;
    children: ReactNode;
}

export function Page({ title, description, children }: PageProps): ReactNode {
    return (
        <html lang="en">
            <head>
                <meta charSet="utf-8" />
                <meta name="viewport" content="width=device-width, initial-scale=1" />
                <title>{title}</title>
                <meta name="description" content={description} />
                <link rel="icon" type="image/png" href="/icon.png" />
                <link rel="stylesheet" href={stylesheet} />
            </head>
            <body className={cn('flex flex-col')}>
                <SkipLink />
                <PosterNav tag="bot" actions={<RepoButton />} />
                {children}
            </body>
        </html>
    );
}
