import { defineNuxtConfig } from 'nuxt3'

// https://v3.nuxtjs.org/docs/directory-structure/nuxt.config

/**
 * TypeScriptのstrictモードを有効にする  
 * [参考記事：Nuxt3の新しい機能](https://zenn.dev/azukiazusa/articles/nuxt3-new-features)
 * 
 * なおNuxt3の開発にあたっては、VSCodeの拡張機能の設定を下記のようにすべき
 * + Vetur：無効化
 * + Volar：有効化（Vue3に対応）
 */
export default defineNuxtConfig({
    typescript: {
        strict: true
    },
    css: ['~/assets/css/style.css'],
    publicRuntimeConfig: {
        rssEndpoint: process.env.RSS_ENDPOINT
    },
    ssr: true, //<= ビルドモードの指定。trueなら SSR or SSG. falseなら SPA. デフォルトでtrue.
    target: 'server' //<= ビルドモードの指定。'server'なら SSR. 'static'なら SSG or SPA. デフォルトで 'server'.
})
