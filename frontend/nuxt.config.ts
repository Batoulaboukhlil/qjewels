
export default defineNuxtConfig({
  compatibilityDate: '2024-04-03',
  css: ['~/assets/css/main.css'],
  devtools: { enabled: true },

  postcss: {
    plugins: {
      tailwindcss: {},
      autoprefixer: {},
    },
  },

  modules: ['@nuxt/image', '@nuxt/icon', '@pinia/nuxt'],
  
  runtimeConfig: {
    public: {
      API_URL: process.env.API_URL
    }
  }

})