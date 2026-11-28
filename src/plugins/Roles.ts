import { LinkedRoles } from '@seedcord/plugin-linked-roles';
import { ConnectionService } from 'discord-api-types/v10';

import { hasMergedPullRequest, isPublicOrgMember } from '#lib/github';
import { records } from '#lib/roles';
import { rolesResultPage } from '#src/pages/RolesResult';

export const Roles = LinkedRoles.with({
    records,
    scopes: ['connections'],
    keepTokens: true,
    values: async ({ asUser }) => {
        const accounts = await asUser.connections();
        const github = accounts.find((account) => account.type === ConnectionService.GitHub && account.verified);
        if (!github) {
            return { refuse: "I couldn't find a GitHub account on your Discord. Add it in Settings → Connections." };
        }

        const [member, contributor] = await Promise.all([
            isPublicOrgMember(github.name),
            hasMergedPullRequest(github.name)
        ]);
        return { platformName: 'GitHub', platformUsername: github.name, metadata: { member, contributor } };
    },
    onResult: rolesResultPage
});
