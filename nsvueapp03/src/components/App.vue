<template>
  <Page>
    <Frame id="app-frame">
      <Page1 />
      <Page2 />
      <Page3 />
    </Frame>
  </Page>
</template>

<script lang="ts">
import Page1 from "@/pages/Page1.vue";
import Page2 from "@/pages/Page2.vue";
import Page3 from "@/pages/Page3.vue";
interface IApp {
  name: string;
  components: any;
}
const App: IApp = {
  name: "App",
  components: { Page1, Page2, Page3 },
};
export default App;
</script>