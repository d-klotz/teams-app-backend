import { Activity, CardFactory, MessageFactory, TurnContext } from "botbuilder";
import {
    CommandMessage,
    TeamsFxBotCommandHandler,
    TriggerPatterns,
} from "@microsoft/teamsfx";
import { AdaptiveCards } from "@microsoft/adaptivecards-tools";
import processTicket from "./processTicket.json";

export class ProcessTicketCommandHandler implements TeamsFxBotCommandHandler {
    triggerPatterns: TriggerPatterns = "process ticket";

    async handleCommandReceived(
        context: TurnContext,
        message: CommandMessage
    ): Promise<string | Partial<Activity> | void> {

        //used to replace the variables in processTicket.json
        const cardData = {
            summary: context.activity.value.summary,
            details: context.activity.value.details,
        };

        const cardJson = AdaptiveCards.declare(processTicket).render(cardData);

        //replaces the original form by a card
        const activity = MessageFactory.attachment(CardFactory.adaptiveCard(cardJson));
        activity.id = context.activity.replyToId;
        await context.updateActivity(activity)
    }
}
