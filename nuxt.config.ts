// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  ssr: true,
  buildDir: 'dist',

  devtools: { enabled: true },
  modules: ['dayjs-nuxt'],
})
