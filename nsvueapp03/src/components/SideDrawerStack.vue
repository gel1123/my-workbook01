<template>
  <StackLayout ~drawerContent backgroundColor="#ffffff">
    <Label class="drawer-header" text="Drawer" />
    <Label class="drawer-item" text="Item 1" @tap="onClickLink1()" />
    <Label class="drawer-item" text="Item 2" @tap="onClickLink2()" />
    <Label class="drawer-item" text="Item 3" @tap="onClickLink3()" />
  </StackLayout>
</template>

<script lang="ts">
import { NativeScriptVue } from "nativescript-vue";

interface IData {}
interface IMethods extends IData {
  onClickLink1(): void;
  onClickLink2(): void;
  onClickLink3(): void;
}
interface ISideDrawerStack {
  name: string;
  data(): IData;
  methods: IMethods;
}
const SideDrawerStack: ISideDrawerStack = {
  name: "side-drawer-stack",
  data() {
    return {};
  },
  methods: {
    onClickLink1() {
      (this as IMethods & NativeScriptVue).$emit("onNav", "page1");
    },
    onClickLink2() {
      (this as IMethods & NativeScriptVue).$emit("onNav", "page2");
    },
    onClickLink3() {
      (this as IMethods & NativeScriptVue).$emit("onNav", "page3");
    },
  },
};
export default SideDrawerStack;
</script>

<style scoped>
.drawer-header {
  padding: 50 16 16 16;
  margin-bottom: 16;
  background-color: #53ba82;
  color: #ffffff;
  font-size: 24;
}

.drawer-item {
  padding: 8 16;
  color: #333333;
  font-size: 16;
}
</style>
