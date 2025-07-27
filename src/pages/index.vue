<template>
    <div class="d-flex justify-center pa-4">

        <v-card class="game-card" max-width="600" width="100%" style="margin: 20px 0;">
            <div v-if="currentGame.name" class="pa-6">
                <v-btn @click="router.push('/game')" class="fill-width" color="warning">Weiter</v-btn>
            </div>
            <v-toolbar color="primary" dark>
                <v-toolbar-title>Start a New Game</v-toolbar-title>
            </v-toolbar>

            <v-card-text class="pa-6">
                <v-form @submit.prevent="startGame" class="game-form">
                    <!-- Game Type Selection -->
                    <v-select v-model="gameType" :items="gameTypes" label="Game" variant="outlined"
                        density="comfortable" class="mb-4" required item-title="title" item-value="value"
                        return-object></v-select>

                    <!-- Game Options -->
                    <v-card variant="outlined" class="mb-6" v-if="gameType && gameType.options">
                        <v-card-title class="text-subtitle-1">Optionen</v-card-title>
                        <v-card-text class="d-flex flex-wrap">
                            <div v-for="(option) in gameType.options" :key="option.key">
                                <v-checkbox v-model="option.value" :label="option.key" density="comfortable"
                                    class="mr-8 mb-0" hide-details>
                                    <template v-slot:label>
                                        <div class="d-flex flex-column">
                                            <span>{{ option.key }}</span>
                                            <span class="text-caption text-medium-emphasis">{{ option.description
                                                }}</span>
                                        </div>
                                    </template>
                                </v-checkbox>
                            </div>
                        </v-card-text>
                    </v-card>

                    <!-- Player Management -->
                    <v-card variant="outlined" class="mb-6">
                        <v-card-title class="text-subtitle-1">Spieler</v-card-title>
                        <v-card-text class="pa-0">
                            <div class="player-list-container">
                                <div v-for="(player, index) in players" :key="index"
                                    class="d-flex align-center pa-3 border-b">
                                    <v-text-field v-model="players[index]" :label="`Player ${index + 1}`"
                                        variant="outlined" density="comfortable"
                                        :rules="[v => !!v || 'Player name is required']" required hide-details="auto"
                                        class="mr-2"></v-text-field>
                                    <v-btn v-if="players.length > 2" icon variant="text" color="error" size="small"
                                        @click="removePlayer(index)">
                                        <v-icon>mdi-close</v-icon>
                                    </v-btn>
                                </div>
                            </div>

                            <v-btn color="primary" rounded="lg" @click="addPlayer" class="my-2 mx-3 fill-width"
                                icon="mdi-plus">
                            </v-btn>
                        </v-card-text>
                    </v-card>

                    <!-- Start Game Button -->
                    <div class="text-center">
                        <v-btn type="submit" color="primary" size="large" :disabled="!isFormValid" :loading="isLoading"
                            class="px-8">
                            Start Game
                        </v-btn>
                    </div>
                </v-form>
            </v-card-text>
        </v-card>
    </div>
</template>
<script setup>
import { ref, computed } from 'vue';
import { useRouter } from 'vue-router';
import { useAppStore } from '@/stores/app';
import { useGameX01Store } from '@/stores/gameX01';
import { storeToRefs } from 'pinia';

const router = useRouter();
const appStore = useAppStore();

const { currentGame } = storeToRefs(appStore);

// Game types
const gameTypes = [
    { title: '301', value: 301, options: [{ key: 'DoubleIn', value: ref(false), description: 'Ein Double ist erforderlich, um zu beginnen.' }, { key: 'DoubleOut', value: ref(true), description: 'Ein Double ist erforderlich, um zu gewinnen.' }], store: useGameX01Store },
    { title: '501', value: 501, options: [{ key: 'DoubleIn', value: ref(false), description: 'Ein Double ist erforderlich, um zu beginnen.' }, { key: 'DoubleOut', value: ref(true), description: 'Ein Double ist erforderlich, um zu gewinnen.' }], store: useGameX01Store },
];
const gameType = ref(gameTypes[0]);

// Game state
const players = ref(['Player 1', 'Player 2']);
const isLoading = ref(false);

// Form validation
const isFormValid = computed(() => {
    return (
        players.value.length >= 2 &&
        players.value.every(name => name.trim() !== '')
    );
});
// Add a new player
function addPlayer() {
    const playerNumber = players.value.length + 1;
    players.value.push(`Player ${playerNumber}`);
};

// Remove a player
function removePlayer(index) {
    if (players.value.length > 2) {
        players.value.splice(index, 1);
    }
};

// Start the game
async function startGame() {
    if (!isFormValid.value) return;

    isLoading.value = true;

    try {
        // Prepare game options
        const options = gameType.value.options.reduce((acc, option) => {
            acc[option.key] = option.value.value;
            return acc;
        }, {});

        // Create game instance
        const game = gameType.value.store().initialize(players.value, options, gameType.value.value);
        // Save game to store
        console.log(game)
        appStore.setGame(game);

        // Navigate to game page
        router.push({ name: 'game' });
    } catch (error) {
        console.error('Error starting game:', error);
    } finally {
        isLoading.value = false;
    }
};
</script>

<style scoped>
.game-card {
    width: 100%;
    max-width: 600px;
    margin: 0 auto;
    display: flex;
    flex-direction: column;
    background-color: #1E1E1E !important;
}

.player-list-container {
    border-top: 1px solid rgba(255, 255, 255, 0.1);
    border-bottom: 1px solid rgba(255, 255, 255, 0.1);
    background-color: rgba(255, 255, 255, 0.02);
    border-radius: 4px;
    margin: 8px 0;
    flex: 1 1 auto;
    min-height: 0;
}

/* Ensure the main content takes full height */
:deep(.v-main) {
    min-height: 100vh;
    display: flex;
    flex-direction: column;
}

.border-b {
    border-bottom: 1px solid rgba(0, 0, 0, 0.05);
}

.border-b:last-child {
    border-bottom: none;
}

/* Custom styling for the game options checkboxes */
:deep(.v-selection-control) {
    align-items: flex-start;
}

:deep(.v-selection-control__input) {
    margin-top: 2px;
}

/* Ensure proper spacing for player input fields */
:deep(.v-field) {
    flex-grow: 1;
}

/* Add some spacing between form sections */
.v-card-text {
    padding: 24px;
}

/* Responsive adjustments */
@media (max-width: 600px) {
    .v-card-text {
        padding: 16px;
    }

    :deep(.v-selection-control) {
        margin-bottom: 8px;
    }
}

.fill-width {
    width: 100% !important;
    width: fill-available !important;
    width: -moz-available !important;
    width: -webkit-fill-available !important;
}
</style>
