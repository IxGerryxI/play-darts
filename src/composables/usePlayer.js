import { ref, computed } from 'vue';
import { useAppStore } from '@/stores/app.js';
import { storeToRefs } from 'pinia';

/**
 * Composable function representing a Player in a dart game.
 * @param {string} name - Display name of the player
 * @param {number} startScore - Starting score for the player
 * @returns {object} Player methods and properties
 */
export function usePlayer(name, startScore) {
    const appStore = useAppStore();
    const { currentGame } = storeToRefs(appStore);
    const rounds = ref([]);

    const totalScore = computed(() => {
        return rounds.value.reduce((acc, round) => {
            return acc + round.score;
        }, 0);
    });

    const score = computed(() => startScore - totalScore.value);
    const lastRound = computed(() => rounds.value[rounds.value.length - 1]);

    /**
     * Get or create a round
     * @param {number} roundNum - The round number to get
     * @returns {object} The round object
     */
    function getRound(roundNum) {
        if (rounds.value[roundNum]) return rounds.value[roundNum];

        rounds.value.push({ throws: [], score: 0 });
        return getRound(roundNum);
    }

    function addThrow(roundNum, throwNum, throwValue) {
        // console.log('addThrow', roundNum, throwNum, throwValue);
        getRound(roundNum).throws[throwNum - 1] = throwValue;
        getRound(roundNum).score = getRound(roundNum).throws.reduce((acc, t) => acc + getThrowValue(t), 0);
    }

    function checkOverThrown() {
        if (score.value < 0) {
            nullifyLastRound();
            currentGame.value.nextPlayer();
            return false;
        }
        return true;
    }

    /**
     * Calculate the numeric value of a throw
     * @param {string} value - The throw value (e.g., '20', 'D20', 'T20')
     * @returns {number} The calculated score
     */
    function getThrowValue(value) {
        if (value[0] !== 'D' && value[0] !== 'T') return +value;

        const multiplier = value[0] === 'D' ? 2 : value[0] === 'T' ? 3 : 1;
        const score = +value.slice(1);
        return score * multiplier;
    }

    /**
     * 
     */
    function nullifyLastRound() {
        lastRound.value.score = 0;
        console.log('nullifyLastRound', lastRound.value.score);
    }

    return {
        name,
        startScore,
        rounds,
        totalScore,
        score,
        lastRound,
        getRound, addThrow, nullifyLastRound, checkOverThrown
    };
}
