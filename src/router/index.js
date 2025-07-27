import { createRouter, createWebHistory } from 'vue-router';
import Index from '../pages/index.vue';
import Game from '../pages/game.vue';

const routes = [
    {
        path: '/',
        name: 'home',
        component: Index,
    },
    {
        path: '/game',
        name: 'game',
        component: Game,
    }
];

const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes,
    scrollBehavior(to, from, savedPosition) {
        if (savedPosition) {
            return savedPosition;
        } else {
            return { top: 0, behavior: 'smooth' };
        }
    }
});

export default router;
