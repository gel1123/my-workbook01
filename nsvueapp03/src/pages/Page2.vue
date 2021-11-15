<template>
  <Page>
    <ActionBar>
      <GridLayout width="100%" columns="auto, *">
        <Label
          text="MENU"
          @tap="$refs.drawer.nativeView.showDrawer()"
          col="0"
        />
        <Label class="title" text="---- page.2 ----" col="1" />
      </GridLayout>
    </ActionBar>

    <RadSideDrawer ref="drawer">
      <StackLayout ~drawerContent backgroundColor="#ffffff">
        <Label class="drawer-header" text="Drawer" />
        <Label class="drawer-item" text="Item 1" @tap="onClickLink1()" />
        <Label class="drawer-item" text="Item 2" @tap="onClickLink2()" />
        <Label class="drawer-item" text="Item 3" @tap="onClickLink3()" />
      </StackLayout>

      <GridLayout ~mainContent columns="*" rows="*">
        <Label class="message" :text="msg" col="0" row="0" />
      </GridLayout>
    </RadSideDrawer>
  </Page>
</template>

<script lang="ts">
import { NativeScriptVue } from "nativescript-vue";
import { VueConstructor } from "vue";
import Page1 from "@/pages/Page1.vue";
import Page3 from "@/pages/Page3.vue";

interface IData {
  msg?: string;
}
interface IMethods extends IData {
  onClickLink1(): void;
  onClickLink2(): void;
  onClickLink3(): void;
}
interface IApp {
  data(): IData;
  methods: IMethods;
}
const Page2: IApp = {
  data() {
    return {
      msg: "Hello World!",
    };
  },
  methods: {
    onClickLink1() {
      (this as IMethods & NativeScriptVue).$navigateTo(
        Page1 as IApp & VueConstructor,
        { frame: "app-frame" }
      );
    },
    onClickLink2() {
      (this as IMethods & NativeScriptVue).$navigateTo(
        Page2 as IApp & VueConstructor,
        { frame: "app-frame" }
      );
    },
    onClickLink3() {
      (this as IMethods & NativeScriptVue).$navigateTo(
        Page3 as IApp & VueConstructor,
        { frame: "app-frame" }
      );
    },
  },
};
export default Page2;
</script>

<style scoped>
ActionBar {
  background-color: #53ba82;
  color: #ffffff;
}

.title {
  text-align: left;
  padding-left: 16;
}

.message {
  vertical-align: center;
  text-align: center;
  font-size: 20;
  color: #333333;
}

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
