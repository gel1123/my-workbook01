<template>
  <div class="hello">
    <h1>{{ computedMsg }}</h1>
    <p>
      For a guide and recipes on how to configure / customize this project,<br>
      check out the
      <a href="https://cli.vuejs.org" target="_blank" rel="noopener">vue-cli documentation</a>.
    </p>
    <h3>Installed CLI Plugins</h3>
    <ul>
      <li><a href="https://github.com/vuejs/vue-cli/tree/dev/packages/%40vue/cli-plugin-typescript" target="_blank" rel="noopener">typescript</a></li>
    </ul>
    <h3>Essential Links</h3>
    <ul>
      <li><a href="https://vuejs.org" target="_blank" rel="noopener">Core Docs</a></li>
      <li><a href="https://forum.vuejs.org" target="_blank" rel="noopener">Forum</a></li>
      <li><a href="https://chat.vuejs.org" target="_blank" rel="noopener">Community Chat</a></li>
      <li><a href="https://twitter.com/vuejs" target="_blank" rel="noopener">Twitter</a></li>
      <li><a href="https://news.vuejs.org" target="_blank" rel="noopener">News</a></li>
    </ul>
    <h3>Ecosystem</h3>
    <ul>
      <li><a href="https://router.vuejs.org" target="_blank" rel="noopener">vue-router</a></li>
      <li><a href="https://vuex.vuejs.org" target="_blank" rel="noopener">vuex</a></li>
      <li><a href="https://github.com/vuejs/vue-devtools#vue-devtools" target="_blank" rel="noopener">vue-devtools</a></li>
      <li><a href="https://vue-loader.vuejs.org" target="_blank" rel="noopener">vue-loader</a></li>
      <li><a href="https://github.com/vuejs/awesome-vue" target="_blank" rel="noopener">awesome-vue</a></li>
    </ul>
  </div>
</template>

<script lang="ts">
import { defineComponent, Prop, PropType } from 'vue';

interface Data {
  d3: string
}

export default defineComponent({
  name: 'HelloWorld',
  /**
   * data() は次のみっつの方法で型を付与する
   *  1. 初期値による型推論に頼る
   *  2. 型アサーションを用いる（asキーワード）
   *  3. type or interface を定義して、型アノテーション（型注釈）で付与する
   */
  data():Data {
    return {
      d3: "data3",
    }
  },
  /**
   * Vueコンポーネントのpropsは、
   * 直接型定義するのではなく、定義したい型のネイティブコンストラクタ
   * を使って型の定義を行う。
   * こうすることでコンポーネント内部で推論が効くようになる。
   */
  props: {
    /** 必須でないならこう書く */
    msg: String, // 複数の型を
    /** 必須ならこう書く */
    requiredMsg: {
      type: String,
      required: true
    },
    /** number | string 型の変数ならこう書く */
    numOrStr: [String, Number],
    /**
     * Objectはネイティブコンストラクタでは情報不足。
     * なので、PropType<T>型をインポートして、[型アサーション](https://typescript-jp.gitbook.io/deep-dive/type-system/type-assertion)
     * と generics で補足する。
     * 
     * ただしこの方法は親から得た値が型誤りであってもコンパイルエラーを得られない。
     * これを解決するには...（TODO：学習後追記）
     */
    obj: {
      type: Object as PropType<{ name: string }>,
      required: true
    },
    /**
     * Arrayもネイティブコンストラクタでは情報が不足するので、PropType<T>[] で補足。
     * Objectと同じ課題を抱えていることに注意。
     */
    arr: {
      type: Array as PropType<{ member: string }[]>,
      required: true
    }
  },
  computed: {
    computedMsg(): string {
      // 余談： ?? は Null結合演算子 (Nullish Coalescing Operator)
      return `${this.msg ?? "none"}
       | ${this.requiredMsg}
       | ${this.numOrStr ?? "none"}
       | ${this.obj?.name ?? "none"}
       | ${this.arr?.reduce((e1,e2) => ({member: e1.member+"_"+e2.member})).member ?? "none"}
       | ${this.d3}`
    }
  },
});
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
h3 {
  margin: 40px 0 0;
}
ul {
  list-style-type: none;
  padding: 0;
}
li {
  display: inline-block;
  margin: 0 10px;
}
a {
  color: #42b983;
}
</style>
