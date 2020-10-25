/**
 * Internal representation of a league of legends match.
 */
export class Match {
    gameId: number;
    queue: number;
    timestamp: number;

    constructor(gameId: number, queue: number, timestamp: number) {
        this.gameId = gameId;
        this.queue = queue;
        this.timestamp = timestamp;
    }
}
