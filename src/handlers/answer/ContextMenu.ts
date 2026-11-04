import { questionFromText } from '@seedcord/docs-search';
import { Cooldown, Gated, MessageContextMenuHandler, MessageContextMenuRoute } from '@seedcord/http';

import { SectionPicker } from '#components/SectionPicker';
import { NoGuideMatch } from '#lib/notices';

import type { APIAttachment } from 'discord-api-types/v10';

// default long text pasted filename when discord converts it
const PASTE_FILE_NAME = 'message.txt';

async function pastedText(attachments: readonly APIAttachment[]): Promise<string> {
    const paste = attachments.find(({ filename }) => filename === PASTE_FILE_NAME);
    if (!paste) return '';

    const response = await fetch(paste.url);
    if (!response.ok) throw new Error(`Discord answered ${response.status} for the pasted text.`);
    return await response.text();
}

@Gated(Cooldown('1m', { limit: 10 }))
@MessageContextMenuRoute('Answer with docs')
export class AnswerWithDocs extends MessageContextMenuHandler<'Answer with docs'> {
    public async execute(): Promise<void> {
        await this.defer();

        const { author, content, attachments } = this.target;
        const { question } = questionFromText(`${content}\n${await pastedText(attachments)}`);
        const hits = question ? await this.core.search.guideHits(question) : [];
        if (hits.length === 0) throw new NoGuideMatch();

        await this.edit({ components: [new SectionPicker(author.id, hits).component] });
    }
}
