<template>
  <img alt="Vue logo" src="./assets/logo.png"
    @click="onClickElement">
  <div>
    <input v-model="d1" />
    <p>data1 is "{{d1}}"</p>
    <p>data2 is {{JSON.stringify(d2)}}</p>
    <p>computedFunc1 is "{{computedFunc1}}"</p>
  </div>
  <HelloWorld
    :msg="'hello!'"
    :requiredMsg="'required'"
    :numOrStr="0"
    :obj="{name: 'objName'}"
    :arr="[{member:'mem1'},{member:'mem2'}]"/>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import HelloWorld from './components/HelloWorld.vue';

export default defineComponent({
  name: 'App',
  /**
   * data() は次のみっつの方法で型を付与する
   *  1. 初期値による型推論に頼る
   *  2. 型アサーションを用いる（asキーワード）
   *  3. type or interface を定義して、型アノテーション（型注釈）で付与する
   */
  data() {
    return {
      d1: "",
      d2: null as null | Array<string>
    }
  },
  /**
   * 算出プロパティcomputedの動作する仕組みについては、
   * 次の記述がわかりやすい
   * 参考にさせていただいた [こちら](https://ics.media/entry/200716/) の記事から引用）
   * 
   * ```
   * 依存を検知できなかったcomputedは2度と実行されない
   * ```
   * 
   * ```
   * 前述したように、Vue.jsのcomputedはメソッド呼び出しとは異なり、必要になった時だけ再計算をしてくれる優れものです。しかしその方法自体は決して魔法ではありません。
   * Vue.jsが依存を検出する仕組みの考え方はシンプルです。基本的にはcomputedを 実際に呼び出して、その結果アクセスされた変数（dataのプロパティやprops等のリアクティブな変数）をすべて記録しているだけ です。 一度計算されたcomputedの値はキャッシュされますが、依存しているとマークされた変数が変更されると、そのタイミングでキャッシュも無効化されます。
   * ```
   * 
   */
  computed: {
    computedFunc1(): string {
      this.d2 = this.d1.split("")
      return this.d2.join("_");
    }
  },
  methods: {
    /**
     * イベントハンドラとして定義したmethodsの型定義は、
     * イベント発火時に渡される Event型 のうち、
     * 必要なものだけを抜き出して型注釈してやるのがベスト。
     * 
     * もし Event型 でまるごと型注釈してしまうと、
     * 必要なプロパティに到達するまでに instanceOf演算子を利用するなどして
     * 型の絞り込み処理を行う必要が生じてしまう。
     */
    onClickElement({target}: {target: HTMLImageElement}) {
      this.d1 = `this img's width is ${target.width}, height is ${target.height}`;
    }
  },
  components: {
    HelloWorld
  }
});
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
