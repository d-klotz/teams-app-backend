import { Activity, CardFactory, MessageFactory, TurnContext } from "botbuilder";
import {
    CommandMessage,
    TeamsFxBotCommandHandler,
    TriggerPatterns,
} from "@microsoft/teamsfx";
import { AdaptiveCards } from "@microsoft/adaptivecards-tools";
import createTicket from "./createTicket.json";

export class CreateTicketCommandHandler implements TeamsFxBotCommandHandler {
    triggerPatterns: TriggerPatterns = "create ticket";

    async handleCommandReceived(
        context: TurnContext,
        message: CommandMessage
    ): Promise<string | Partial<Activity> | void> {

        const cardJson = AdaptiveCards.declare(createTicket).render();
        return MessageFactory.attachment(CardFactory.adaptiveCard(cardJson));
    }
}
