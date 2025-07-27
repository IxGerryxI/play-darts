/**
 * Class representing a Player in a dart game.
 */
export class Player {
    /**
     * Create a new Player instance.
     * @param {string} name - Display name of the player
     */
    constructor(name, score, round) {
        this.name = name;
        this.startScore = score;
        this.round = round;
    }

    rounds = [];
    get totalScore() { return this.rounds.reduce((acc, round) => acc + round.throws.reduce((acc, t) => acc + this.getThrowValue(t), 0), 0) }
    get score() { return this.startScore - this.totalScore }

    /**
     * Get the current round.
     * @returns {Object} The current round
     */
    getRound(round) {
        this.rounds[round] = this.rounds[round] || { throws: [] }
        return this.rounds[round]
    }

    /**
     * 
     * @param {String} value 
     * @returns 
     */
    getThrowValue(value) {
        if (value[0] !== 'D' && value[0] !== 'T') return +value;

        const multiplier = value[0] === 'D' ? 2 : value[0] === 'T' ? 3 : 1;
        const score = +value.slice(1);
        return score * multiplier;
    }
}