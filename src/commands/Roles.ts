import { BuilderComponent, RegisterCommand } from '@seedcord/http';

import { SEEDCORD_GUILD_ID } from '#lib/commandScope';

@RegisterCommand('guild', [SEEDCORD_GUILD_ID])
export class Roles extends BuilderComponent<'command'> {
    constructor() {
        super('command');

        this.instance.setName('roles').setDescription('Get the org member and contributor roles');
    }
}
