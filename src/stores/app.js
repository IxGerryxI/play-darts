import { defineStore } from 'pinia';
import { ref } from 'vue';

export const useAppStore = defineStore('app', () => {
  const currentGame = ref({});

  function setGame(game) {
    currentGame.value = game;
  }

  return {
    currentGame,
    setGame,
  };
});
