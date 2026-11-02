import { currentTime } from '@seedcord/http';

import type { GuideResult } from '@seedcord/docs-search';

export const CHOICE_MAX_LENGTH = 100;

export function cutAtWord(text: string, maxLength: number): string {
    return text.length <= maxLength ? text : text.slice(0, maxLength).replace(/\s+\S*$/, '');
}

export function fitChoiceName(name: string): string {
    return name.length <= CHOICE_MAX_LENGTH ? name : `${cutAtWord(name, CHOICE_MAX_LENGTH - 1)}…`;
}

export function sectionName({ page, heading }: GuideResult): string {
    return fitChoiceName(heading ? `${page} › ${heading}` : page);
}

export function outOfAllowanceNotice(retryAfterSeconds: number): string {
    return `The guide search is out of its daily allowance. Try again <t:${currentTime() + retryAfterSeconds}:R>.`;
}
