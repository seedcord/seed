import { Envapter } from 'envapt';

const ORG = 'seedcord';
const REPO = `${ORG}/seedcord`;

async function github(path: string): Promise<Response> {
    return await fetch(`https://api.github.com${path}`, {
        headers: {
            accept: 'application/vnd.github+json',
            authorization: `Bearer ${Envapter.getRequired('GITHUB_TOKEN', 'string')}`,
            'user-agent': 'seed' // github needs a user agent apparently
        }
    });
}

async function failed(response: Response): Promise<never> {
    throw new Error(`GitHub answered ${response.status}: ${await response.text()}`);
}

const PUBLIC_MEMBER = 204;
const NOT_PUBLIC_MEMBER = 404;

export async function isPublicOrgMember(login: string): Promise<boolean> {
    const response = await github(`/orgs/${ORG}/public_members/${encodeURIComponent(login)}`);
    if (response.status === PUBLIC_MEMBER) return true;
    if (response.status === NOT_PUBLIC_MEMBER) return false;
    return await failed(response);
}

export async function hasMergedPullRequest(login: string): Promise<boolean> {
    const query = `repo:${REPO} is:pr is:merged author:${login}`;
    const response = await github(`/search/issues?per_page=1&q=${encodeURIComponent(query)}`);
    if (!response.ok) return await failed(response);
    const { total_count: merged } = await response.json<{ total_count: number }>();
    return merged > 0;
}
