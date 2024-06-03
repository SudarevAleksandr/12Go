// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  ssr: true,
  buildDir: 'dist',
  app: {
    baseURL: '/12Go/', // Добавляем префикс ко всем ссылкам
    //baseURL: '/.output/public/', // Добавляем префикс ко всем ссылкам
  },
  nitro: {
    prerender: {
      routes: ['/'], // Указываем главную страницу для предварительного рендеринга
    },
    output: {
      dir: '.output', // Указываем директорию для вывода сборки
    },
  },
  devtools: { enabled: true },
  modules: ['dayjs-nuxt'],
})
