<template>
  <section>
    <NuxtLogo/>
    <form method="GET" action="/search">
      <label>
        Qiitaの記事IDを入力
        <input name="item_id" value="c55fe0815572a0cd8278" placeholder="Qiitaの記事IDを入力"/>
      </label>
      <input type="submit" value="submit"/>
    </form>
  </section>
</template>

<script lang="ts">
import Vue from 'vue'
interface IData {
}
export default Vue.extend({
  name: 'IndexPage',
  data(): IData {
    return {
    }
  },
  computed: {
  },
})
</script>
