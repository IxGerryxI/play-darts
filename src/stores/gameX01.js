import { defineStore } from 'pinia';
import { ref, computed, watch } from 'vue';
import { usePlayer } from '@/composables/usePlayer.js';

export const useGameX01Store = defineStore('gameX01', () => {
    // State
    const round = ref(1);
    const currentPlayerIndex = ref(0);
    const players = ref([]);
    const doubleIn = ref(false);
    const doubleOut = ref(true);
    const name = ref('501');

    // Getters
    const currentPlayer = computed(() => players.value[currentPlayerIndex.value]);

    // Actions
    function initialize(playerNames, { doubleIn: di = false, doubleOut: dout = true } = {}, score = 501) {
        currentPlayerIndex.value = 0;
        players.value = playerNames.map(name => usePlayer(name, score));
        doubleIn.value = di;
        doubleOut.value = dout;
        name.value = score.toString();

        return this;
    }

    function nextPlayer() {
        checkEndGame();
        if (currentPlayerIndex.value === players.value.length - 1) {
            round.value++;
            currentPlayerIndex.value = 0;
        } else {
            currentPlayerIndex.value += 1;
        }
        if (currentPlayer.value.score === 0) {
            nextPlayer();
        }
    }

    function checkEndGame() {
        if (currentPlayer.value.score < 0) {
            currentPlayer.value.nullifyLastRound();
        } else if (currentPlayer.value.score === 0) {
            const endedWithDouble = currentPlayer.value.lastRound.throws.filter(t => !!t).slice(-1)[0]?.startsWith('D');
            if (doubleOut.value && !endedWithDouble) {
                currentPlayer.value.nullifyLastRound();
            }
        }
    }

    return {
        // State
        round,
        currentPlayerIndex,
        players,
        doubleIn,
        doubleOut,
        name,

        // Getters
        currentPlayer,

        // Actions
        initialize,
        nextPlayer
    };
});
