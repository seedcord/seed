import type { GuideResult } from '@seedcord/docs-search';

export const CHOICE_MAX_LENGTH = 100;

const pluralRules = new Intl.PluralRules('en');

export function countOf(count: number, one: string, other: string): string {
    return `${count} ${pluralRules.select(count) === 'one' ? one : other}`;
}

function cutAtWord(text: string, maxLength: number): string {
    return text.length <= maxLength ? text : text.slice(0, maxLength).replace(/\s+\S*$/, '');
}

export function fitChoiceName(name: string): string {
    return name.length <= CHOICE_MAX_LENGTH ? name : `${cutAtWord(name, CHOICE_MAX_LENGTH - 1)}…`;
}

export function sectionName({ page, heading }: GuideResult): string {
    return fitChoiceName(heading ? `${page} › ${heading}` : page);
}
