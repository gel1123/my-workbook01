<template>
  <img alt="Vue logo" src="./assets/logo.png" @click="onClickImg">
  <p>{{altMsg}}</p>
  <HelloWorld msg="Welcome to Your Vue.js + TypeScript App"/>
</template>

<script lang="ts">
import { Options, Vue } from 'vue-class-component';
import HelloWorld from './components/HelloWorld.vue';

// Vue2における @Component に相当
@Options({
  components: {
    HelloWorld,
  },
})
export default class App extends Vue {
  altMsg: string = "Click the logo mark!";

  onClickImg({target}: {target: HTMLImageElement}) {
    this.altMsg = `"alt" is ${target.alt}`;
  }
}
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
