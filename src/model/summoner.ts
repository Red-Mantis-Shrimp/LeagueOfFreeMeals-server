/**
 * Internal representation of a league of legends summoner.
 */
export class Summoner {
    readonly summonerName: string;
    readonly accountId: string;

    constructor(summonerName: string, accountId: string) {
        this.summonerName = summonerName;
        this.accountId = accountId;
    }
}
