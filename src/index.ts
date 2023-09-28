import express from 'express';
import { commandApp } from "./internal/initialize";
import { TeamsBot } from "./teamsBot";
import supportApplicationIsBeingDownloaded from './cards/supportApplicationIsBeingDownloaded.json'
import {AdaptiveCards} from "@microsoft/adaptivecards-tools";

const app = express();
const port = process.env.PORT || 3100;
app.use(express.json());

const teamsBot = new TeamsBot();
app.post("/api/messages", async (req, res) => {
    console.log('Endpoint was hit!')
    await commandApp.requestHandler(req, res, async (context) => {
        await teamsBot.run(context);
    });
});

app.get("/api/notification", async (req, res) => {
    console.log('Endpoint was hit via notification!')
    const { agentId, userName } = req.query;


    let agent = undefined
    const targets =  await commandApp.notification.getPagedInstallations()
    for (const target of targets.data) {
        if (target.type == 'Group') {
            agent = await commandApp.notification
                .findMember(async (member) => member.account.id == agentId
            )
        }
    }

    const cardData = {
        userName
    }
    const cardJson = AdaptiveCards.declare(supportApplicationIsBeingDownloaded).render(cardData);
    await agent.sendAdaptiveCard(cardJson)

    return res.redirect(307, 'https://google.com/');

})

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
