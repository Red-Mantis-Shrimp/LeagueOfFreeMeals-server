import axios, { AxiosResponse } from 'axios';
import { HttpClient } from '../../../http/http-client';
import cheerio from 'cheerio';
import { Region } from '../../enum/region';

// TO-DO: elegantly convert instead of hardcode
const SUMMONER_TO_OP_GG_ID_MAP: Record<string, string> = {
    Asmir9990: '28676086',
    Bluegoldfish: '21183068',
    Crendez: '23815851',
    KnightHulk: '34769851',
    Sec: '31390656',
};
const CONTENT_ROW_SELECTOR = '.Content > .Row';
const SUMMONER_NAME_TEXT_FIELD_SELECTOR = '.SummonerName.Cell > a';
const OPSCORE_TEXT_FIELD_SELECTOR = '.OPScore.Text';

/**
 * Scrapes a match on OP.GG for data
 */
export class MatchScraper extends HttpClient {
    public constructor(region: Region) {
        super(MatchScraper.getMatchUrl(region));
    }

    /**
     * Returns a map of op score keyed by summoner name for the provided game and summoner id.
     *
     * @param gameId game id
     * @param summonerId summoner id
     */
    public async getOpScore(summonerName: string, gameId: number): Promise<number> {
        const opScoreBySummonerName = await this.getOPScoreBySummonerName(gameId, summonerName);

        return opScoreBySummonerName.get(summonerName);
    }

    /**
     * Returns a map of op score keyed by summoner name for the provided game and summoner id.
     *
     * @param gameId game id
     * @param summonerId summoner id
     */
    public async getOPScoreBySummonerName(gameId: number, summonerName: string): Promise<Map<string, number>> {
        const summonerId = SUMMONER_TO_OP_GG_ID_MAP[summonerName];
        const matchWebpage = await this.getMatchWebpage(gameId, summonerId);
        const $ = cheerio.load(matchWebpage);

        const test: Map<string, number> = new Map();

        $(CONTENT_ROW_SELECTOR).each((index, element) => {
            const summonerNameCell = $(element).find(SUMMONER_NAME_TEXT_FIELD_SELECTOR);
            // summoner name is wrapped in <a> tag, which also contains hidden span values for rank, which we need to remove
            const name = summonerNameCell.clone().children().remove().end().text().trim(); //https://stackoverflow.com/a/8851526
            const score = $(element).find(OPSCORE_TEXT_FIELD_SELECTOR).text();

            test.set(name, parseInt(score));
        });

        return test;
    }

    private async getMatchWebpage(gameId: number, summonerId: string): Promise<string> {
        const response = await this.instance.get(`/gameId=${gameId}&summonerId=${summonerId}`);
        return response.data;
    }

    private static getMatchUrl(region: Region) {
        return `https://${region}.op.gg/summoner/matches/ajax/detail`;
    }
}
