import axios, { AxiosResponse } from 'axios';
import { HttpClient } from '../../http/http-client';
import cheerio from 'cheerio';
import { Region } from '../enum/region';

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
    public async getOPScoreBySummonerName(
        gameId: string,
        summonerId: string,
    ): Promise<{ name: string; score: number }[]> {
        const matchWebpage = await this.getMatchWebpage(gameId, summonerId);
        const $ = cheerio.load(matchWebpage);

        const opScoreBySummonerName = $(CONTENT_ROW_SELECTOR)
            .map((index, element) => {
                const summonerNameCell = $(element).find(SUMMONER_NAME_TEXT_FIELD_SELECTOR);
                return {
                    // summoner name is wrapped in <a> tag, which also contains hidden span values for rank, which we need to remove
                    name: summonerNameCell.clone().children().remove().end().text().trim(), //https://stackoverflow.com/a/8851526
                    score: $(element).find(OPSCORE_TEXT_FIELD_SELECTOR).text(),
                };
            })
            .get();

        return opScoreBySummonerName;
    }

    private async getMatchWebpage(gameId: string, summonerId: string): Promise<string> {
        const response = await this.instance.get(`/gameId=${gameId}&summonerId=${summonerId}`);
        return response.data;
    }

    private static getMatchUrl(region: Region) {
        return `https://${region}.op.gg/summoner/matches/ajax/detail`;
    }
}
