import { Activity, CardFactory, MessageFactory, TurnContext, TeamsInfo } from "botbuilder";
import {
    CommandMessage,
    TeamsFxBotCommandHandler,
    TriggerPatterns,
} from "@microsoft/teamsfx";
import { AdaptiveCards } from "@microsoft/adaptivecards-tools";
import remoteSessionCard from "./remoteSession.json";

export class RemoteSessionCommandHandler implements TeamsFxBotCommandHandler {
    triggerPatterns: TriggerPatterns = "remote session";

    async handleCommandReceived(
        context: TurnContext,
        message: CommandMessage
    ): Promise<string | Partial<Activity> | void> {

        const cardProps = {
            usersIds: [],
        }

        if (context.activity.conversation.isGroup) {
            const result = await TeamsInfo.getPagedMembers(context)
            result.members.forEach(member => {

                if (member.id === context.activity.from.id) {
                    return

                }
                cardProps.usersIds.push(member.id)
            });
        }

        const cardJson = AdaptiveCards.declare(remoteSessionCard).render(cardProps);

        await context.sendActivity({ attachments: [CardFactory.adaptiveCard(cardJson)] });
    }
}
