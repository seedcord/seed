import { QUESTION_LENGTH } from '@seedcord/docs-search';
import { Cooldown, Gated, MessageContextMenuHandler, MessageContextMenuRoute } from '@seedcord/http';

import { SectionPicker } from '#components/SectionPicker';
import { NoGuideMatch } from '#lib/notices';
import { cutAtWord } from '#lib/text';

@Gated(Cooldown('1m', { limit: 10 }))
@MessageContextMenuRoute('Answer with docs')
export class AnswerWithDocs extends MessageContextMenuHandler<'Answer with docs'> {
    public async execute(): Promise<void> {
        await this.defer();

        const { author, content } = this.target;
        const hits = await this.core.search.guideHits(cutAtWord(content, QUESTION_LENGTH.max));
        if (hits.length === 0) throw new NoGuideMatch();

        await this.edit({ components: [new SectionPicker(author.id, hits).component] });
    }
}
