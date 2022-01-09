<script lang="ts" setup>
const src = ref("/img/jumbotron01_700-1100.jpeg");
const switchSrc = () => {
    const srcList = [
        "/img/jumbotron01_700-1100.jpeg",
        "/img/jumbotron02_700-1100.jpeg"
    ];
    const beforeIndex = srcList.indexOf(src.value)
    if (srcList.length-1 === beforeIndex) {
        src.value = srcList[0];
    } else {
        src.value = srcList[beforeIndex+1];
    }
}
</script>
<template>
    <div class="jumbotron">
        <img :src="src" 
            @animationiteration="switchSrc">
    </div>
</template>
<style scoped>
.jumbotron {
    height: 100%;
    width: 100%;
    overflow: hidden;
}
img {
    height: 400px;
    width: 100%;
    object-fit: cover;
    object-position: 0% top;
    animation: 20s ease-in 1s infinite forwards slide;
    opacity: 0;
}
@keyframes slide {
      0% { opacity: 0; object-position:   0% top; }
     10% { opacity: 1; object-position:   0% top; }
     90% { opacity: 1; object-position:  90% top; }
    100% { opacity: 0; object-position: 100% top; }
}
</style>