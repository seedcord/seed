import { currentTime, Notice } from '@seedcord/http';
import { ComponentType } from 'discord-api-types/v10';

import type { ReplyResponse } from '@seedcord/http';

abstract class TextNotice extends Notice {
    public override render(): ReplyResponse {
        return { components: [{ type: ComponentType.TextDisplay, content: this.message }] };
    }
}

export class NoSearchResults extends TextNotice {
    constructor() {
        super('**Nothing found.** Try different words.');
    }
}

export class NoGuideMatch extends TextNotice {
    constructor() {
        super('Nothing in the guide matches that message.');
    }
}

export class AskedSearchGone extends TextNotice {
    constructor() {
        super('**This search is too old to report.** Run it again if you still want to.');
    }
}

export class GuideSectionGone extends TextNotice {
    constructor() {
        super("That section isn't in the guide anymore.");
    }
}

export class GuideOutOfAllowance extends TextNotice {
    constructor(retryAfterSeconds: number) {
        super(`Guide search is out for today. Try again **<t:${currentTime() + retryAfterSeconds}:R>**.`);
    }
}

export class UnknownCommand extends TextNotice {
    constructor(name: string) {
        super(`\`${name}\` isn't one of my commands. Pick one from the suggestions.`);
    }
}

export class NoImagesInMessage extends TextNotice {
    constructor() {
        super("That message doesn't have any images.");
    }
}
