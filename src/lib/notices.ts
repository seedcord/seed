import { currentTime, Notice } from '@seedcord/http';

export class NoSearchResults extends Notice {
    constructor() {
        super('No results found. Try a different query.');
    }
}

export class NoGuideMatch extends Notice {
    constructor() {
        super('No guide section matches that message.');
    }
}

export class GuideSectionGone extends Notice {
    constructor() {
        super('That section no longer exists.');
    }
}

export class GuideOutOfAllowance extends Notice {
    constructor(retryAfterSeconds: number) {
        super(`The guide search is out of its daily allowance. Try again <t:${currentTime() + retryAfterSeconds}:R>.`);
    }
}

export class UnknownCommand extends Notice {
    constructor(name: string) {
        super(`I don't have a \`${name}\` command. Pick one from the suggestions.`);
    }
}

export class NoImagesInMessage extends Notice {
    constructor() {
        super("That message doesn't have any images.");
    }
}
