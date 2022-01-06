<template>
  <div class="logo">
    <div class="cover c01"></div>
  </div>
</template>
<style scoped>
.cover {
  width: 100%;
  position: absolute;
}
.c01 { left:  0%; background-color: rgba(230, 255, 255, 0.2); height: 180px;}
.logo {
  width: 100%;
  height: 180px;
  background-size: cover;
  /* border: 1px solid rgb(200, 200, 200); */
  background-image: url(/img/simple-logo_180-260.png);
  background-color: rgba(255, 255, 255, 0);
  background-blend-mode:lighten;
  background-repeat: no-repeat;
  background-position: center;
}
</style>