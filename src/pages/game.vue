<template>
  <div class="game-page" v-if="currentGame.name">
    <v-card class="game-card">
      <!-- Header -->
      <v-card-title class="d-flex align-center justify-space-between pa-4">

        <!-- Game Info -->
        <div class="d-flex align-center mr-6">
          <div class="d-flex flex-column">
            <span class="text-caption text-medium-emphasis">Game</span>
            <span class="text-h6">{{ name }}</span>
          </div>
        </div>

        <!-- Round Info -->
        <div class="d-flex align-center">
          <div class="d-flex flex-column">
            <span class="text-caption text-medium-emphasis">Round</span>
            <span class="text-h6 text-center">{{ round }}</span>
          </div>
        </div>

        <!-- Exit Button -->
        <v-btn color="error" variant="tonal" @click="endGame" class="ml-4" icon="mdi-exit-to-app">
        </v-btn>
      </v-card-title>

      <v-divider></v-divider>

      <v-card-text class="d-flex flex-column flex-grow-1 pa-0">
        <div class="d-flex flex-sm-column flex-md-row-reverse align-md-start flex-grow-1">
          <!-- Current Player Card -->
          <div v-if="currentPlayer" class="current-player-card-wrapper">
            <div class="current-player-card pa-6 text-center">
              <div class="text-h5 mb-1">{{ currentPlayer.name }}</div>
              <div class="d-flex flex-column align-center">
                <div class="text-h2 font-weight-bold">{{ currentPlayer.score }}</div>
                <div class="text-caption text-medium-emphasis">{{ currentRound.score }}</div>
              </div>

              <!-- Throw Inputs -->
              <div class="d-flex justify-space-between gap-2 mb-4 mt-6">
                <throw-input v-for="i in 3" :key="i" :is-active="activeInputIndex === i" class="flex-grow-1"
                  :modelValue="currentThrows[i - 1]" @update:modelValue="onThrowInput(i, $event)"
                  @activate="activeInputIndex = i" @enter="enterThrow(i)"></throw-input>
              </div>

              <v-btn color="primary" block size="large" @click="submitThrows" class="submit-button">
                Nächster Spieler
                <v-icon icon="mdi-arrow-right"></v-icon>
              </v-btn>
            </div>
          </div>

          <!-- Players List & History Wrapper -->
          <div class="content-wrapper">
            <!-- Players List -->
            <div class="players-list">
              <div class="text-subtitle-1 mb-2">Spieler</div>
              <v-card variant="tonal" class="mb-4">
                <v-list density="compact">
                  <v-list-item v-for="player in players" :key="player.name"
                    :class="{ 'player-active': player.name === currentPlayer.name }" class="player-item">
                    <template v-slot:prepend>
                      <v-icon v-if="player.name === currentPlayer.name" color="primary" icon="mdi-account" />
                      <v-icon v-else icon="mdi-account-outline" />
                    </template>
                    <v-list-item-title>{{ player.name }}</v-list-item-title>
                    <v-list-item-subtitle class="text-right">
                      <span class="text-h6">{{ player.score }}</span>
                    </v-list-item-subtitle>
                  </v-list-item>
                </v-list>
              </v-card>
            </div>

            <!-- Round History -->
            <div v-if="false" class="round-history">
              <div class="text-subtitle-1 mb-2">Rundenverlauf</div>
              <v-card variant="tonal">
                <v-list>
                  <v-list-item v-for="(round, index) in game.rounds" :key="index">
                    <v-list-item-title>Runde {{ round.round }}</v-list-item-title>
                    <v-list-item-subtitle class="d-flex gap-2">
                      <span v-for="(score, i) in round.throws" :key="i" class="dart-score">
                        {{ score }}
                      </span>
                    </v-list-item-subtitle>
                    <v-list-item-subtitle class="text-right">
                      {{ round.total }}
                    </v-list-item-subtitle>
                  </v-list-item>
                  <v-list-item v-if="!roundHistory.length">
                    <v-list-item-title class="text-medium-emphasis">No rounds played
                      yet</v-list-item-title>
                  </v-list-item>
                </v-list>
              </v-card>
            </div>
          </div>
        </div>
      </v-card-text>
    </v-card>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useAppStore } from '@/stores/app';
import { storeToRefs } from 'pinia';
import throwInput from '@/components/ThrowInput.vue';

const router = useRouter();
const appStore = useAppStore();

const { currentGame } = storeToRefs(appStore);
const { players, name } = currentGame.value;

const currentPlayer = computed(() => {
  return currentGame.value.currentPlayer;
});

onMounted(() => {
  if (!currentGame.value.name) {
    router.push('/');
  }
});

const round = computed(() => {
  return currentGame.value.round;
});

const currentRound = computed(() => {
  return currentPlayer.value.getRound(round.value);
});
const currentThrows = computed(() => {
  return currentRound.value.throws;
});
const activeInputIndex = ref(1); // Track which input is active (1-3)

/**
 * Handles when a throw input value changes
 * @param {number} index - The 1-indexed position of the throw input
 * @param {string} value - The new value of the throw input
 */
function onThrowInput(index, value) {
  // console.log('onThrowInput', index, value);
  currentPlayer.value.addThrow(round.value, index, value);
}

/**
 * 
 * @param index {Number} The 1-indexed position of the throw input
 */
function enterThrow(index) {
  const result = currentPlayer.value.checkOverThrown();
  console.log('enterThrow', index, result)
  if(!result) focusNextInput(0)
  else focusNextInput(index);
  
}

function focusNextInput(index) {
  activeInputIndex.value = index + 1;
  if (activeInputIndex.value > 3) {
    submitThrows();
  }
}

function submitThrows() {
  currentGame.value.nextPlayer()
  focusNextInput(0);
}

function endGame() {
  router.push('/');
}
</script>

<style scoped>
.game-page {
  height: 100%;
  width: 100%;
  padding: 16px;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
}

.game-card {
  flex: 1;
  display: flex;
  flex-direction: column;
  border-radius: 8px;
  overflow: hidden;
  background-color: var(--surface);
  box-shadow: 0 2px 4px -1px rgba(0, 0, 0, 0.2),
    0 4px 5px 0 rgba(0, 0, 0, 0.14),
    0 1px 10px 0 rgba(0, 0, 0, 0.12);
}

.current-player-card-wrapper {
  width: 100%;
  display: flex;
  justify-content: center;
  padding: 0 16px;
}

.current-player-card {
  background-color: rgba(var(--v-theme-primary), 0.08);
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 180px;
  width: 100%;
  max-width: 500px;
  /* Adjust this value as needed */
  border-radius: 8px;
  margin: 16px 0;
  padding: 24px 16px !important;
}

.submit-button {
  max-width: 300px;
  margin: 0 auto;
  margin-top: 16px;
}

.content-wrapper {
  width: 100%;
  max-width: 800px;
  /* Wider than the player card */
  margin: 0 auto;
  padding: 0 16px;
  flex: 1;
  display: flex;
  flex-direction: column;
  flex: 1 0 100%
}

.players-list,
.round-history {
  width: 100%;
}

.player-item {
  transition: background-color 0.2s ease;
}

.player-active {
  background-color: rgba(var(--v-theme-primary), 0.05);
}

.dart-score {
  background: rgba(255, 255, 255, 0.1);
  border-radius: 4px;
  padding: 2px 6px;
  font-family: monospace;
}

.v-list-item {
  min-height: 48px;
}

.v-list-item__content {
  padding: 8px 0;
}

/* Responsive adjustments */
@media (max-width: 600px) {
  .game-page {
    padding: 0;
  }

  .game-card {
    border-radius: 0;
  }
}

.gap-2 {
  gap: 8px;
}
</style>
