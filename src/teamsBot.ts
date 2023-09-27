import {
  Activity, CardFactory,
  InvokeResponse, MessageFactory,
  StatusCodes,
  TeamsActivityHandler, TeamsInfo,
  TurnContext
} from "botbuilder";

import downloadSupportApplicationButton from "./cards/downloadSupportApplicationButton.json";
import waitingForUserToDownloadApplication from './cards/waitingForUserToDownloadApplication.json'
import {AdaptiveCards} from "@microsoft/adaptivecards-tools";


export class TeamsBot extends TeamsActivityHandler {
  constructor() {
    super();
  }

  async onInvokeActivity(context: TurnContext): Promise<InvokeResponse> {
    const activity: Activity = context.activity;

    if (activity.name === "adaptiveCard/action") {

      const action = activity.value.action;

      if (action.verb === "renderDownloadSupportApplication") {
        const cardProps = {
          endUserId : undefined
        }

        if (context.activity.conversation.isGroup) {
          const result = await TeamsInfo.getPagedMembers(context)
          result.members.forEach(member => {

            if (member.id === context.activity.from.id) {
              return

            }
            cardProps.endUserId = member.id
          });
        }

        //updates the agent's view
        const activity = MessageFactory.attachment(CardFactory.adaptiveCard(waitingForUserToDownloadApplication));
        activity.id = context.activity.replyToId;
        await context.updateActivity(activity)

        //updates the user's view
        const cardJson = AdaptiveCards.declare(downloadSupportApplicationButton).render(cardProps);
        const cardResponse = {
          statusCode: StatusCodes.OK,
          type: 'application/vnd.microsoft.card.adaptive',
          value: cardJson
        };
        return {
          status: StatusCodes.OK,
          body: cardResponse
        };
      }
    }
  }
}
