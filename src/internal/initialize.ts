import { HelloWorldCommandHandler } from "../commands/helloWorld/helloworldCommandHandler";
import { BotBuilderCloudAdapter } from "@microsoft/teamsfx";
import ConversationBot = BotBuilderCloudAdapter.ConversationBot;
import config from "./config";
import {CreateTicketCommandHandler} from "../commands/createTicket/createTicketCommandHandler";
import {ProcessTicketCommandHandler} from "../commands/proccessTicket/processTicketCommandHandler";
import {DeleteMessageCommandHandler} from "../commands/deleteMessage/deleteMessageCommandHandler";
import {RemoteSessionCommandHandler} from "../commands/remoteSession/remoteSessionCommandHandler";

// Create the command bot and register the command handlers for your app.
// You can also use the commandApp.command.registerCommands to register other commands
// if you don't want to register all of them in the constructor
export const commandApp =  new ConversationBot({
  // The bot id and password to create CloudAdapter.
  // See https://aka.ms/about-bot-adapter to learn more about adapters.
  adapterConfig: {
    MicrosoftAppId: config.botId,
    MicrosoftAppPassword: config.botPassword,
    MicrosoftAppType: "MultiTenant",
  },
  command: {
    enabled: true,
    commands: [
      new HelloWorldCommandHandler(),
      new CreateTicketCommandHandler(),
      new ProcessTicketCommandHandler(),
      new RemoteSessionCommandHandler(),
      new DeleteMessageCommandHandler(),
    ],
  },
  notification: {
    enabled: true
  }
});
