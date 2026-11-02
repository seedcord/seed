import { KIND_FILTERS, QUESTION_LENGTH } from '@seedcord/docs-search';
import { BuilderComponent, RegisterCommand } from '@seedcord/http';
import { ApplicationIntegrationType, InteractionContextType } from 'discord-api-types/v10';

@RegisterCommand()
export class Search extends BuilderComponent<'command'> {
    constructor() {
        super('command');

        this.instance
            .setName('search')
            .setDescription('Search for symbols or documentation')
            .addSubcommand(new DocsSearch().component)
            .addSubcommand(
                new SubSearch(
                    'guide',
                    'Ask the guide a question',
                    'question',
                    'Ask anything and press Enter, or pick a section'
                ).component
            )
            .setContexts(
                InteractionContextType.BotDM,
                InteractionContextType.Guild,
                InteractionContextType.PrivateChannel
            )
            .setIntegrationTypes(ApplicationIntegrationType.GuildInstall, ApplicationIntegrationType.UserInstall);
    }
}

class SubSearch extends BuilderComponent<'subcommand'> {
    constructor(name: string, description: string, inputName: string, inputDescription: string) {
        super('subcommand');

        this.instance
            .setName(name)
            .setDescription(description)
            .addStringOption((o) =>
                o
                    .setName(inputName)
                    .setDescription(inputDescription)
                    .setRequired(true)
                    .setAutocomplete(true)
                    .setMinLength(QUESTION_LENGTH.min)
                    .setMaxLength(QUESTION_LENGTH.max)
            )
            .addBooleanOption((o) =>
                o.setName('public').setDescription('Make the search result public').setRequired(false)
            )
            .addUserOption((o) =>
                o.setName('ping').setDescription('Ping a user with the search result').setRequired(false)
            )
            .addBooleanOption((o) =>
                o.setName('suppress-embed').setDescription('Hide the link preview').setRequired(false)
            );
    }
}

class DocsSearch extends SubSearch {
    constructor() {
        super('docs', 'Search the reference docs', 'query', 'The query to search for');

        this.instance
            .addStringOption((o) =>
                o
                    .setName('kind')
                    .setDescription('Only search this kind of symbol')
                    .setRequired(false)
                    .addChoices(KIND_FILTERS.map(({ label, value }) => ({ name: label, value })))
            )
            .addStringOption((o) =>
                o
                    .setName('transport')
                    .setDescription("The transport you use to hide the other's results")
                    .setRequired(false)
                    .addChoices({ name: 'http', value: 'http' }, { name: 'gateway', value: 'gateway' })
            );
    }
}
