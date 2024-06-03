// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  ssr: false,
  buildDir: 'dist',

  devtools: { enabled: true },
  modules: ['dayjs-nuxt'],
})
