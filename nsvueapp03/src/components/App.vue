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
interface IMethods {}
interface IApp {
  name: string;
  components: object;
  methods: IMethods;
}
const App: IApp = {
  name: "app",
  components: { Page1, Page2, Page3 },
  methods: {},
};
export default App;
</script>