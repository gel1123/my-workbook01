<template>
  <Page>
    <!-- 参考：/node_modules/nativescript-ui-sidedrawer/index.d.ts -->
    <AppHeader @clickMenu="$refs.drawer.nativeView.toggleDrawerState()" />
    <RadSideDrawer ref="drawer">
      <SideDrawerStack @onNav="nav" />
      <GridLayout ~mainContent columns="*" rows="*">
        <Label class="message" :text="msg" col="0" row="0" />
      </GridLayout>
    </RadSideDrawer>
  </Page>
</template>

<script lang="ts">
import SideDrawerStack from "@/components/SideDrawerStack.vue";
import AppHeader from "@/components/AppHeader.vue";
import { NativeScriptVue } from "nativescript-vue";
import { VueConstructor } from "vue";
import Page1, { IPage1 } from "@/pages/Page1.vue";
import Page2, { IPage2 } from "@/pages/Page2.vue";

interface IData {
  msg?: string;
}
interface IMethods extends IData {
  nav(page: string): void;
}
export interface IPage3 {
  name: string;
  components: object;
  data(): IData;
  methods: IMethods;
}
const Page3: IPage3 = {
  name: "page3",
  components: { SideDrawerStack, AppHeader },
  data() {
    return {
      msg: "here is page.3",
    };
  },
  methods: {
    nav(page) {
      switch (page) {
        case "page1":
          (this as IMethods & NativeScriptVue).$navigateTo(
            Page1 as IPage1 & VueConstructor,
            { frame: "app-frame", clearHistory: true }
          );
          break;
        case "page2":
          (this as IMethods & NativeScriptVue).$navigateTo(
            Page2 as IPage2 & VueConstructor,
            { frame: "app-frame", clearHistory: true }
          );
          break;
        case "page3":
          (this as IMethods & NativeScriptVue).$navigateTo(
            Page3 as IPage3 & VueConstructor,
            { frame: "app-frame", clearHistory: true }
          );
          break;
        default:
          break;
      }
    },
  },
};
export default Page3;
</script>

<style scoped>
.message {
  vertical-align: center;
  text-align: center;
  font-size: 20;
  color: blue;
}
</style>
