import { parseQuestion } from '@seedcord/docs-search';
import { AutocompleteHandler, AutocompleteRoute } from '@seedcord/http';

import type { GuideResult, ReferenceSearchResult, SearchResultKind } from '@seedcord/docs-search';
import type { APIApplicationCommandOptionChoice } from 'discord-api-types/v10';

const CHOICE_MAX_LENGTH = 100;

const INSTANCE_MEMBER_KINDS = new Set<SearchResultKind>(['constructor', 'method', 'property']);

function fitChoiceName(name: string): string {
    if (name.length <= CHOICE_MAX_LENGTH) return name;
    return `${name.slice(0, CHOICE_MAX_LENGTH - 1).replace(/\s+\S*$/, '')}…`;
}

function askChoices(input: string): APIApplicationCommandOptionChoice<string>[] {
    const question = parseQuestion(input);
    if (!question || question.length > CHOICE_MAX_LENGTH) return [];
    return [{ name: fitChoiceName(`Ask: ${question}`), value: question }];
}

function symbolName({ action, name, qualifiedName }: ReferenceSearchResult): string {
    return INSTANCE_MEMBER_KINDS.has(action.kind) ? qualifiedName.replace(`.${name}`, `#${name}`) : qualifiedName;
}

function docsChoice(result: ReferenceSearchResult): APIApplicationCommandOptionChoice<string> {
    const packageName = result.packageName.replace('@seedcord/', '');
    return {
        name: fitChoiceName(
            `${symbolName(result)} · ${packageName} - ${result.action.description ?? result.action.kind}`
        ),
        value: result.action.id
    };
}

function guideChoice({ page, heading, path }: GuideResult): APIApplicationCommandOptionChoice<string> {
    return { name: fitChoiceName(heading ? `${page} › ${heading}` : page), value: path };
}

@AutocompleteRoute('search/docs')
export class DocsAutocomplete extends AutocompleteHandler<'search/docs'> {
    public async execute(): Promise<void> {
        const filter = { kind: this.options.getString('kind'), transport: this.options.getString('transport') };
        await this.respond(this.core.search.docs(this.focused.value, filter).map(docsChoice));
    }
}

@AutocompleteRoute('search/guide')
export class GuideAutocomplete extends AutocompleteHandler<'search/guide'> {
    public async execute(): Promise<void> {
        const { value } = this.focused;
        const results = await this.core.search.guide(value);
        await this.respond([...results.map(guideChoice), ...askChoices(value)]);
    }
}
