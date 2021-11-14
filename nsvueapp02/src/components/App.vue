<template>
  <Page>
    <ActionBar title="Welcome to NativeScript-Vue!" />
    <label class="mdi" text="home" />
    <label class="mdi" text="favorite_border" />
    <label class="mdi" text="person_outline" />
  </Page>
</template>

<script lang="ts">
export default {
  data() {
    return {
      msg: "Hello World!",
    };
  },
};
</script>

<style scoped>
ActionBar {
  background-color: #53ba82;
  color: #ffffff;
}

.message {
  vertical-align: center;
  text-align: center;
  font-size: 20;
  color: #333333;
}
</style>
