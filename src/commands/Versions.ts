import { BuilderComponent, RegisterCommand } from '@seedcord/http';

import { COMMAND_CONTEXTS, COMMAND_INSTALL_TYPES } from '#lib/commandScope';

@RegisterCommand()
export class Versions extends BuilderComponent<'command'> {
    constructor() {
        super('command');

        this.instance
            .setName('versions')
            .setDescription('Look up seedcord package versions')
            .setContexts(...COMMAND_CONTEXTS)
            .setIntegrationTypes(...COMMAND_INSTALL_TYPES);
    }
}
