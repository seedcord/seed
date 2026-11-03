import { parseQuestion } from '@seedcord/docs-search';
import { AutocompleteHandler, AutocompleteRoute } from '@seedcord/http';

import { CHOICE_MAX_LENGTH, fitChoiceName, sectionName } from '#lib/text';

import type { GuideResult, ReferenceSearchResult, SearchResultKind } from '@seedcord/docs-search';
import type { APIApplicationCommandOptionChoice } from 'discord-api-types/v10';

const INSTANCE_MEMBER_KINDS = new Set<SearchResultKind>(['constructor', 'method', 'property']);

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

function guideChoice(section: GuideResult): APIApplicationCommandOptionChoice<string> {
    return { name: sectionName(section), value: section.path };
}

@AutocompleteRoute('search/docs')
export class DocsAutocomplete extends AutocompleteHandler<'search/docs'> {
    public async execute(): Promise<void> {
        const results = await this.core.search.docs(this.focused.value, {
            kind: this.options.getString('kind'),
            transport: this.options.getString('transport'),
            prerelease: this.options.getBoolean('prerelease')
        });
        await this.respond(results.map(docsChoice));
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
