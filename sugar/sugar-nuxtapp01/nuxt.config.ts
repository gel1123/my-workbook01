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
    }
})
