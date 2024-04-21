export default defineContentScript({
  matches: ['*://*.google.com/*'],
  main() {
    console.log(import.meta.env.VITE_WEB_APP_URL);
  },

});
