import { QUESTION_LENGTH } from '@seedcord/docs-search';
import { Cooldown, Gated, MessageContextMenuHandler, MessageContextMenuRoute } from '@seedcord/http';

import { SectionPicker } from '#components/SectionPicker';
import { cutAtWord, outOfAllowanceNotice } from '#lib/text';

@Gated(Cooldown('1m', { limit: 10 }))
@MessageContextMenuRoute('Answer with docs')
export class AnswerWithDocs extends MessageContextMenuHandler<'Answer with docs'> {
    public async execute(): Promise<void> {
        await this.defer();

        const { author, content } = this.target;
        const answer = await this.core.search.guideAnswer(cutAtWord(content, QUESTION_LENGTH.max));

        if ('retryAfterSeconds' in answer) {
            await this.edit(outOfAllowanceNotice(answer.retryAfterSeconds));
            return;
        }

        if (answer.hits.length === 0) {
            await this.edit('No guide section matches that message.');
            return;
        }

        await this.edit({ components: [new SectionPicker(author.id, answer.hits).component] });
    }
}
