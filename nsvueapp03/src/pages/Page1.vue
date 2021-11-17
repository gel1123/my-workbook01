<template>
  <Page>
    <!-- 参考：/node_modules/nativescript-ui-sidedrawer/index.d.ts -->
    <AppHeader @clickMenu="$refs.drawer.nativeView.toggleDrawerState()" />
    <RadSideDrawer ref="drawer">
      <SideDrawerStack @onNav="nav" />
      <WrapLayout ~mainContent>
        <Label
          class="message"
          :text="msg"
          col="0"
          row="0"
          @tap="reloadMsg"
          textWrap="true"
        />
      </WrapLayout>
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
import app from "@/main";

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
      msg: "tap!",
    };
  },
  methods: {
    reloadMsg() {

      let powerListener: any;

      startPowerUpdates((powerinfo:any)=>{
        this.msg = `${JSON.stringify(powerinfo, null, 4)}`;
        stopPowerUpdates();
      });

      function stopPowerUpdates() {
        if (powerListener) {
          app.android.unregisterBroadcastReceiver(
            android.content.Intent.ACTION_BATTERY_CHANGED
          );
          powerListener = undefined;
        }
      }
      function startPowerUpdates(callback: Function) {
        powerListener = app.android.registerBroadcastReceiver(
          android.content.Intent.ACTION_BATTERY_CHANGED,
          function onReceiveCallback(context, intent) {
            callback({
              plugged: intent.getIntExtra(
                android.os.BatteryManager.EXTRA_PLUGGED,
                -1
              ),
              percent:
                (intent.getIntExtra(android.os.BatteryManager.EXTRA_LEVEL, -1) /
                  intent.getIntExtra(
                    android.os.BatteryManager.EXTRA_SCALE,
                    -1
                  )) *
                100,
              level: intent.getIntExtra(
                android.os.BatteryManager.EXTRA_LEVEL,
                -1
              ),
              scale: intent.getIntExtra(
                android.os.BatteryManager.EXTRA_SCALE,
                -1
              ),
              health: intent.getIntExtra(
                android.os.BatteryManager.EXTRA_HEALTH,
                0
              ),
              icon_small: intent.getIntExtra(
                android.os.BatteryManager.EXTRA_ICON_SMALL,
                0
              ),
              present: intent
                .getExtras()
                .getBoolean(android.os.BatteryManager.EXTRA_PRESENT),
              status: intent.getIntExtra(
                android.os.BatteryManager.EXTRA_STATUS,
                0
              ),
              technology: intent
                .getExtras()
                .getString(android.os.BatteryManager.EXTRA_TECHNOLOGY),
              temperature: intent.getIntExtra(
                android.os.BatteryManager.EXTRA_TEMPERATURE,
                0
              ),
              voltage: intent.getIntExtra(
                android.os.BatteryManager.EXTRA_VOLTAGE,
                0
              ),
            });
          }
        );
      }
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
  text-align: left;
  font-size: 20;
  margin: 20;
}
</style>
