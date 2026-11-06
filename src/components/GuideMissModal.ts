import { BuilderComponent, CustomId } from '@seedcord/http';
import { TextInputStyle } from 'discord-api-types/v10';

export const GuideMissFormId = new CustomId('guide-miss-form').snowflake('searchId');

export const LOOKING_FOR_INPUT = 'looking-for';

const LOOKING_FOR_MAX_LENGTH = 1000;

export class GuideMissModal extends BuilderComponent<'modal'> {
    constructor(searchId: string) {
        super('modal');

        this.instance
            .setCustomId(GuideMissFormId.encode({ searchId }))
            .setTitle('Not what you needed?')
            .addTextDisplayComponents((text) =>
                text.setContent('Your question and the page you got are sent over to the guide authors.')
            )
            .addLabelComponents((label) =>
                label
                    .setLabel('What were you looking for?')
                    .setDescription('Optional, but it makes the page much easier to fix.')
                    .setTextInputComponent((input) =>
                        input
                            .setCustomId(LOOKING_FOR_INPUT)
                            .setStyle(TextInputStyle.Paragraph)
                            .setRequired(false)
                            .setMaxLength(LOOKING_FOR_MAX_LENGTH)
                    )
            );
    }
}
