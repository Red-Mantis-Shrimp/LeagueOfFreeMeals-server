import express from 'express';
const app = express();
const port = 8080; // default port to listen
import axios from 'axios';
import request from 'request';
import { Accounts } from './enum/accounts';

const baseURL = 'https://na1.api.riotgames.com/';
const apiKey = 'RGAPI-71775a09-8b6e-4b31-ac79-e6979f802ecf';

app.get('/', (req, res) => {
    res.send('Hello I got the home for you');
});
// define a route handler for the default home page
app.get('/api/matches/:id', (req, res) => {
    request(`${baseURL}lol/match/v4/matches/${req.params.id}?api_key=${apiKey}`, (error, response, body) => {
        if (!error && response.statusCode === 200) {
            res.send(body);
        } else {
            res.status(400).json({ msg: error });
        }
    });
});

app.get('/api/matchlists/by-account/:account', (req, res) => {
    if (req.params.account in Accounts) {
        const account = (Accounts as any)[req.params.account];
        request(
            `${baseURL}lol/match/v4/matchlists/by-account/${account}?api_key=${apiKey}`,
            (error, response, body) => {
                if (!error && response.statusCode === 200) {
                    res.send(body);
                } else {
                    res.status(400).json({ msg: error });
                }
            },
        );
    } else {
        res.status(403).json({ msg: 'invalid account' });
    }
});

const fillGamesMap = (matches: any, gamesMap: any) => {
    for (const match of matches) {
        if (!(gamesMap as any)[match.gameId]) {
            (gamesMap as any)[match.gameId] = 1;
        } else {
            const val = (gamesMap as any)[match.gameId] + 1;
            (gamesMap as any)[match.gameId] = val;
        }
    }
    return gamesMap;
};

// start the Express server
// app.listen(port, () => {
//     // tslint:disable-next-line:no-console
//     console.log(`server started at http://localhost:${port}`);
// });

app.listen(port);

export default app;
