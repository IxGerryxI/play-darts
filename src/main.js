import { createApp } from 'vue';
import App from './App.vue';
import router from './router';
import { createPinia } from 'pinia';
import { createVuetify } from 'vuetify';
import * as components from 'vuetify/components';
import * as directives from 'vuetify/directives';
import '@mdi/font/css/materialdesignicons.css';
import 'vuetify/styles';
import './assets/main.css';

// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAcH7fsGaPAEHsMg3rigYwkjMwMbxkWzAo",
  authDomain: "my-misc-sites.firebaseapp.com",
  projectId: "my-misc-sites",
  storageBucket: "my-misc-sites.firebasestorage.app",
  messagingSenderId: "658878510783",
  appId: "1:658878510783:web:2eabeec18e3e8d6debb80a",
  measurementId: "G-6NEMX9VK6B"
};

// Initialize Firebase
const firebaseapp = initializeApp(firebaseConfig);
const analytics = getAnalytics(firebaseapp);

// Create Vuetify instance
const vuetify = createVuetify({
  components,
  directives,
  theme: {
    defaultTheme: 'dark',
    themes: {
      dark: {
        dark: true,
        colors: {
          primary: '#1976D2',
          secondary: '#424242',
          accent: '#82B1FF',
          error: '#FF5252',
          info: '#2196F3',
          success: '#4CAF50',
          warning: '#FFC107',
        },
      },
    },
  },
});

// Create app
const app = createApp(App);

// Use plugins
app.use(router);
app.use(createPinia());
app.use(vuetify);

// Mount the app
app.mount('#app');
