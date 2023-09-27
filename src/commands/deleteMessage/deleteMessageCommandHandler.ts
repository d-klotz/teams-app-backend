import { Activity, TurnContext } from "botbuilder";
import {
    CommandMessage,
    TeamsFxBotCommandHandler,
    TriggerPatterns,
} from "@microsoft/teamsfx";

export class DeleteMessageCommandHandler implements TeamsFxBotCommandHandler {
    triggerPatterns: TriggerPatterns = "delete message";

    async handleCommandReceived(
        context: TurnContext,
        message: CommandMessage
    ): Promise<string | Partial<Activity> | void> {

        const activityId = context.activity.replyToId;
        await context.deleteActivity(activityId)
    }
}
