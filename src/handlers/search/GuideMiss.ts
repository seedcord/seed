import { ButtonHandler, ButtonRoute, Cooldown, Gated, ModalHandler, ModalRoute } from '@seedcord/http';

import { GuideMissButton, GuideMissId } from '#components/GuideMissButton';
import { GuideMissFormId, GuideMissModal, LOOKING_FOR_INPUT } from '#components/GuideMissModal';
import { AskedSearchGone } from '#lib/notices';

@ButtonRoute(GuideMissId)
export class GuideMiss extends ButtonHandler<[typeof GuideMissId]> {
    public async execute(): Promise<void> {
        await this.showModal(new GuideMissModal(this.params.searchId).component);
    }
}

@Gated(Cooldown('1m', { limit: 10 }))
@ModalRoute(GuideMissFormId)
export class GuideMissForm extends ModalHandler<[typeof GuideMissFormId]> {
    public async execute(): Promise<void> {
        const { searchId } = this.params;

        await this.deferUpdate();

        const search = await this.core.search.askedSearch(searchId);
        if (!search) throw new AskedSearchGone();

        this.core.bus.publish('guideMiss', {
            ...search,
            lookingFor: this.fields.getTextInputValue(LOOKING_FOR_INPUT),
            user: this.user
        });

        await this.api.interactions.editReply(this.event.application_id, this.event.token, {
            components: [new GuideMissButton(searchId, true).component.toJSON()]
        });
    }
}
