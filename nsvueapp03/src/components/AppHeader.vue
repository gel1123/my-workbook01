<template>
  <ActionBar>
    <GridLayout width="100%" columns="auto, *">
      <Label text="MENU" @tap="ontap" col="0" />
      <Label class="title" text="---- header ----" col="1" />
    </GridLayout>
  </ActionBar>
</template>

<script lang="ts">
import { NativeScriptVue } from "nativescript-vue";

interface IData {}
interface IMethods extends IData {
  ontap(): void;
}
export interface IAppHeader {
  name: string;
  components: object;
  data(): IData;
  methods: IMethods;
}
const AppHeader: IAppHeader = {
  name: "action-header",
  components: {},
  data() {
    return {
      msg: "Hello World!",
    };
  },
  methods: {
    ontap() {
      (this as IMethods & NativeScriptVue).$emit("clickMenu");
    },
  },
};
export default AppHeader;
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
</style>
