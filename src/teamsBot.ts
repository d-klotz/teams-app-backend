import {
  Activity, CardFactory,
  InvokeResponse, MessageFactory,
  StatusCodes,
  TeamsActivityHandler, TeamsChannelAccount, TeamsInfo,
  TurnContext
} from "botbuilder";

import downloadSupportApplicationButton from "./cards/downloadSupportApplicationButton.json";
import waitingForUserToDownloadApplication from './cards/waitingForUserToDownloadApplication.json'
import {AdaptiveCards} from "@microsoft/adaptivecards-tools";


export class TeamsBot extends TeamsActivityHandler {

  private REDIRECT_DOMAIN = 'daniel.rathole.anamneasy.de/api/notification'
  constructor() {
    super();
  }


  //when we use auto-refresh cards, as soon as the card is rendered, an invoke request is sent to the bot backend, with
  // a specific activity name.
  async onInvokeActivity(context: TurnContext): Promise<InvokeResponse> {
    const activity: Activity = context.activity;

    if (activity.name === "adaptiveCard/action") {
      return await this.renderViewsForAgentAndEndUser(activity, context);
    }
    // other ifs in here for other invoke activities
  }

  private async renderViewsForAgentAndEndUser(activity: Activity, context: TurnContext) {
    const action = activity.value.action;

    if (action.verb === "renderDownloadSupportApplication") {
      const {endUser, agent} = await this.extractEndUserAndAgent(context);

      await this.updateCardForAgent(context);
      return this.updateCardForEndUser(this.REDIRECT_DOMAIN, agent.id, endUser.name);
    }
  }

  private async extractEndUserAndAgent(context: TurnContext) {
    let endUser: TeamsChannelAccount;
    let agent: TeamsChannelAccount;
    const result = await TeamsInfo.getPagedMembers(context)
    result.members.forEach(member => {

      const endUserId = context.activity.from.id;
      if (member.id === endUserId) {
        endUser = member
        return
      }

      agent = member
    });
    return {endUser, agent};
  }

  private async updateCardForAgent(context: TurnContext) {
    const activity = MessageFactory.attachment(CardFactory.adaptiveCard(waitingForUserToDownloadApplication));
    activity.id = context.activity.replyToId;
    await context.updateActivity(activity)
  }

  private updateCardForEndUser(redirectDomain, agentId, endUserName) {
    const redirectUrl = `https://${redirectDomain}?agentId=${agentId}&userName=${endUserName}`
    const cardJson = AdaptiveCards.declare(downloadSupportApplicationButton).render({ redirectUrl });
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
