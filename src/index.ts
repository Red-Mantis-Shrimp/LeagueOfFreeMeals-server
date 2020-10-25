import express from 'express';
import axios from 'axios';
import cors from 'cors';
import request from 'request';
import { Accounts } from './enum/accounts';
import { PlayerService } from './service/player-service';

const baseURL = 'https://na1.api.riotgames.com/';
const app = express();
const port = 8080; // default port to listen

app.use(cors());

app.get('/', (req, res) => {
    res.send('Hello I got the home for you');
});

app.get('/score/:player', async (req, res) => {
    const service = new PlayerService();

    const result = await service.getAverageScore(req.params.player, 10);

    res.json({ score: result });
});

app.listen(port);

export default app;
