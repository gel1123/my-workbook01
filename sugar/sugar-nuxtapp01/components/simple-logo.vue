<template>
  <div class="logo">
    <!-- v-bindなしで書くと、ビルド時に .output/public/_nuxt ディレクトリをコンテキストとみなして404になる -->
    <!-- そのため、回避すべく v-bind:src="'文字列'" にしている. -->
    <img :src="'/img/simple-logo_110-265.png'" />
  </div>
</template>
<style scoped>
.cover {
  width: 100%;
  position: absolute;
}
img {
  width: 100%;
  object-fit: cover;
}
</style>

