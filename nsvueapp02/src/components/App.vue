<template>
  <Page>
    <ActionBar title="Welcome to NativeScript-Vue!" />
    <StackLayout>
      <Label class="mdi" text="home" />
      <Label class="mdi" text="favorite_border" />
      <Label class="mdi" text="person_outline" />
      <Carousel
        indicatorColor="#ffffff"
        :finite="true"
        :bounce="false"
        :showIndicator="true"
        verticalAlignment="top"
        android:indicatorAnimation="swap"
        color="white"
      >
        <CarouselItem id="slide1" verticalAlignment="middle">
          <image src="~/assets/images/NativeScript-Vue.png" stretch="aspectFit" />
        </CarouselItem>
        <CarouselItem
          id="slide2"
          backgroundColor="#6497b1"
          verticalAlignment="middle"
        >
          <label
            text="Banner 2"
            backgroundColor="#500000"
            horizontalAlignment="center"
          />
        </CarouselItem>
        <CarouselItem
          id="slide3"
          backgroundColor="#005b96"
          verticalAlignment="middle"
        >
          <label
            text="Banner 3"
            backgroundColor="#500000"
            horizontalAlignment="center"
          />
        </CarouselItem>
      </Carousel>
    </StackLayout>
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
