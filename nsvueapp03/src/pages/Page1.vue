<template>
  <Page>
    <!-- 参考：/node_modules/nativescript-ui-sidedrawer/index.d.ts -->
    <AppHeader @clickMenu="$refs.drawer.nativeView.toggleDrawerState()" />
    <RadSideDrawer ref="drawer">
      <SideDrawerStack @onNav="nav" />
      <GridLayout ~mainContent columns="*" rows="*">
        <Label
          class="message"
          :text="msg"
          col="0"
          row="0"
          @tap="reloadMsg"
          textWrap="true"
        />
      </GridLayout>
    </RadSideDrawer>
  </Page>
</template>

<script lang="ts">
import SideDrawerStack from "@/components/SideDrawerStack.vue";
import AppHeader from "@/components/AppHeader.vue";
import { NativeScriptVue } from "nativescript-vue";
import { VueConstructor } from "vue";
import Page2, { IPage2 } from "@/pages/Page2.vue";
import Page3, { IPage3 } from "@/pages/Page3.vue";
// import p from "nativescript-powerinfo";

/****************************
 * ## How to access Native API
 * Utils.android
        .getApplicationContext()
        .getSystemService(android.content.Context.POWER_SERVICE)
 ****************************/

interface IData {
  msg?: string;
}
interface IMethods extends IData {
  reloadMsg(): void;
  nav(page: string): void;
}
export interface IPage1 {
  name: string;
  components: object;
  data(): IData;
  methods: IMethods;
}
const Page1: IPage1 = {
  name: "page1",
  components: { SideDrawerStack, AppHeader },
  data() {
    return {
      msg: "hoge",
    };
  },
  methods: {
    reloadMsg() {
      const intent = new android.content.Intent(
        android.content.Intent.ACTION_VIEW
      );
      const powerinfo = {
        plugged: intent.getIntExtra(
          android.os.BatteryManager.EXTRA_PLUGGED,
          -1
        ),
        percent:
          (intent.getIntExtra(android.os.BatteryManager.EXTRA_LEVEL, -1) /
            intent.getIntExtra(android.os.BatteryManager.EXTRA_SCALE, -1)) *
          100,
        level: intent.getIntExtra(android.os.BatteryManager.EXTRA_LEVEL, -1),
        scale: intent.getIntExtra(android.os.BatteryManager.EXTRA_SCALE, -1),
        health: intent.getIntExtra(android.os.BatteryManager.EXTRA_HEALTH, 0),
        icon_small: intent.getIntExtra(
          android.os.BatteryManager.EXTRA_ICON_SMALL,
          0
        ),
        present: intent
          .getExtras()
          ?.getBoolean(android.os.BatteryManager.EXTRA_PRESENT),
        status: intent.getIntExtra(android.os.BatteryManager.EXTRA_STATUS, 0),
        technology: intent
          .getExtras()
          ?.getString(android.os.BatteryManager.EXTRA_TECHNOLOGY),
        temperature: intent.getIntExtra(
          android.os.BatteryManager.EXTRA_TEMPERATURE,
          0
        ),
        voltage: intent.getIntExtra(android.os.BatteryManager.EXTRA_VOLTAGE, 0),
      };
      this.msg = `Battery: ${powerinfo.percent}%`;
    },
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
export default Page1;
</script>

<style scoped>
.message {
  vertical-align: center;
  text-align: center;
  font-size: 20;
  color: red;
}
</style>
