import express from 'express';
import { commandApp } from "./internal/initialize";
import { TeamsBot } from "./teamsBot";
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
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
