import { Match } from '../model/match';
import { Summoner } from '../model/summoner';
import { LolApiWrapper } from '../external/riot/lol-api-wrapper';
import { MatchScraper } from '../external/opgg/scraper/match-scraper';
import { Region } from '../external/enum/region';

export class PlayerService {
    private apiClient: LolApiWrapper;
    private scoreScraper: MatchScraper;

    public constructor() {
        this.apiClient = new LolApiWrapper();
        this.scoreScraper = new MatchScraper(Region.NA);
    }

    public async getAverageScore(playerSummonerName: string, numberOfGames: number): Promise<number> {
        const summoner = await this.getSummoner(playerSummonerName);
        const matches = await this.apiClient.getMatchlistByAccountId(summoner.accountId, numberOfGames);

        const scores = await Promise.all(
            matches.map((match) => {
                return this.scoreScraper.getOpScore(playerSummonerName, match.gameId);
            }),
        );

        return scores.reduce((total, score) => total + score) / numberOfGames;
    }

    private async getSummoner(playerSummonerName: string): Promise<Summoner> {
        return await this.apiClient.getSummonerByName(playerSummonerName);
    }
}
