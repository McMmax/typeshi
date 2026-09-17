// https://nuxt.com/docs/api/configuration/nuxt-config
const base = process.env.NUXT_APP_BASE_URL || '/typeshi/'
const cleanBase = base.endsWith('/') ? base : `${base}/`

export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  ssr: true,
  app: {
    baseURL: cleanBase,
    buildAssetsDir: '/_nuxt/',
    head: {
      title: 'typeshi — Max\'s Personal Blog & Notes',
      htmlAttrs: { lang: 'en', 'data-theme': 'dark' },
      meta: [
        { charset: 'utf-8' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
        {
          name: 'description',
          content: 'Personal engineering blog and dev notes by Max (McMmax). Writing about software architecture, minimalism, and frontend design.',
        },
        { name: 'theme-color', content: '#060709' },
      ],
      link: [
        { rel: 'icon', type: 'image/svg+xml', href: `${cleanBase}favicon.svg` },
        { rel: 'preconnect', href: 'https://fonts.googleapis.com' },
        { rel: 'preconnect', href: 'https://fonts.gstatic.com', crossorigin: '' },
        {
          rel: 'stylesheet',
          href: 'https://fonts.googleapis.com/css2?family=Chakra+Petch:wght@400;500;600;700&family=Rajdhani:wght@500;600;700&family=JetBrains+Mono:wght@400;500;700&family=Inter:wght@400;500;600;700&display=swap',
        },
      ],
    },
  },
  css: [
    '~/assets/css/umbrella.css',
  ],
  nitro: {
    preset: 'github-pages',
    prerender: {
      crawlLinks: true,
      routes: ['/', '/about', '/tags', '/404.html'],
    },
  },
  typescript: {
    strict: true,
    typeCheck: false,
  },
})
