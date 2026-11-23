import { StringSelectMenuBuilder } from '@discordjs/builders';
import { CustomId, RowComponent } from '@seedcord/http';

import { sectionContext, sectionName } from '#lib/text';

import type { GuideResult } from '@seedcord/docs-search';

export const SectionPickId = new CustomId('section-pick').snowflake('authorId');

export class SectionPicker extends RowComponent<'menu_string'> {
    constructor(authorId: string, sections: readonly GuideResult[]) {
        super('menu_string');

        this.instance.addComponents(
            new StringSelectMenuBuilder()
                .setCustomId(SectionPickId.encode({ authorId }))
                .setPlaceholder('Pick a section to send')
                .addOptions(
                    sections.map((section) => ({
                        label: sectionName(section),
                        description: sectionContext(section),
                        value: section.path
                    }))
                )
        );
    }
}
