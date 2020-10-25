import { Match } from '../../model/match';
import { Summoner } from '../../model/summoner';
import { LolApi } from 'twisted';
import { Regions } from 'twisted/dist/constants';
import { MatchQueryDTO } from 'twisted/dist/models-dto';
import { QueueType } from '../enum/queue-type';

const DEFAULT_REGION = Regions.AMERICA_NORTH; // TODO: support multiple regions
const MAX_RANGE = 100;
const SUPPORTED_QUEUE_TYPES = [
    QueueType.BLIND_PICK_SUMMONERS_RIFT,
    QueueType.CLASH_SUMMONERS_RIFT,
    QueueType.DRAFT_SUMMONERS_RIFT,
    QueueType.RANKED_FLEX_SUMMONERS_RIFT,
];

export class LolApiWrapper {
    private apiClient: LolApi;

    public constructor() {
        this.apiClient = new LolApi();
    }

    /**
     * Get summoner info based on summoner name.
     *
     * @param summonerName summoner name
     */
    public async getSummonerByName(summonerName: string): Promise<Summoner> {
        const summoner = (await this.apiClient.Summoner.getByName(summonerName, DEFAULT_REGION)).response;

        return new Summoner(summoner.name, summoner.accountId);
    }

    /**
     * Get list of matches for the account.
     *
     * @param accountId encrypted account id.
     */
    public async getMatchlistByAccountId(accountId: string, maxNumberOfMatches: number): Promise<Match[]> {
        const allMatches: Match[] = [];

        while (allMatches.length < maxNumberOfMatches) {
            const query = this.buildMatchlistQuery(allMatches.length, maxNumberOfMatches);
            const matchlist = (await this.apiClient.Match.list(accountId, DEFAULT_REGION, query)).response;
            matchlist.matches.forEach((matchListingMatches) => {
                allMatches.push(
                    new Match(matchListingMatches.gameId, matchListingMatches.queue, matchListingMatches.timestamp),
                );
            });
        }

        return allMatches;
    }

    private buildMatchlistQuery(numberOfMatchesQueried: number, maxNumberOfMatches: number) {
        const query = new MatchQueryDTO();
        query.beginIndex = numberOfMatchesQueried;
        query.queue = SUPPORTED_QUEUE_TYPES;

        if (maxNumberOfMatches - numberOfMatchesQueried > MAX_RANGE) {
            return query;
        }

        query.endIndex = Math.min(maxNumberOfMatches, numberOfMatchesQueried + MAX_RANGE);

        return query;
    }
}
