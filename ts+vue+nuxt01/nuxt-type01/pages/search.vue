<template>
  <section>
    <NuxtLogo/>
    <h1 class="title">{{title}}</h1>
    <p class="description">{{description}}</p>
    <hr>
    <p>記事の最終更新日時：{{updated_at}}</p>
    <p>記事の作成日時：{{created_at}}</p>
  </section>
</template>

<script lang="ts">
import { Context } from '@nuxt/types'
import Vue from 'vue'
interface IData {
  title: string;
  itemId: string;
}
interface AsyncData {
  created_at: string;
  updated_at: string;
  title: string;
  itemId: string;
}
export default Vue.extend({
  name: 'IndexPage',
  data(): IData {
    return {
      title: 'Nuxt * TypeScript',
      itemId: ''
    }
  },
  computed: {
    description(): string {
      return `この記事（ID：${this.itemId}）の情報は次の通りです`
    }
  },
  /**
   * Nuxtでは、サーバーサイドレンダリングを行うフレームワークである都合上、
   * 外部リソースの取得を行う関数を別で持つ必要があるっぽい
   * これには asyncData hook と Fetch hook のふたつの選択肢がある。
   * このコンポーネントにアクセスするときは、ほかのフックと同様に
   * これらのhook が動作して、定義した処理を実行する。
   * 
   * 
   * asyncDataは名前の通り、非同期で行われる。
   * 引数のContext型のインスタンスには、サーバーサイドでしか取得できないオブジェクトが含まれる。
   */
  async asyncData({query, $axios}: Context): Promise<AsyncData> {
    const itemId = query["item_id"]
    const {data} = await $axios.get<AsyncData>(`https://qiita.com/api/v2/items/${itemId}`)
    data.itemId = ''+itemId
    return data
  }
})
</script>
