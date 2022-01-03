<template>
  <section>
    <NuxtLogo/>
    <h1 class="title">{{title}}</h1>
    <h2 class="subtitle">{{subtitle}}</h2>
  </section>
</template>

<script lang="ts">
import Vue from 'vue'
interface IData {
  title: string
}
export default Vue.extend({
  name: 'IndexPage',
  data(): IData {
    return {
      title: 'Nuxt * TypeScript'
    }
  },
  computed: {
    subtitle(): string {
      return `"${this.title}" は Nuxt.js + TypeScript の型定義について学習するためのプロジェクトです`
    }
  }
})
</script>
