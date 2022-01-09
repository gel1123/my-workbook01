<script lang="ts" setup>
interface Props {
    src: string
}
interface Emits {
    (e: "close-picture"): void
}
const $emit = defineEmits<Emits>();
const onClickRoot = (e:MouseEvent) => {
    const target = e.target as HTMLElement;
    if (target.id === "root" || target.id === "content-wrapper") {
        $emit("close-picture");
    }
}
const {src} = defineProps<Props>();
</script>
<template>
    <div id="root" @click="onClickRoot">
        <div id="content-wrapper">
            <img :src="src">
        </div>
    </div>
</template>
<style scoped>
#root {
    position: fixed;
    background-color: rgba(100, 100, 100, 0.75);
    height: 100vh;
    width: 100vw;
    z-index: 999;
    opacity: 0;
    animation: anime01 0.3s ease-out 0s 1 forwards;
}
@keyframes anime01 {
  0% { opacity: 0 }
  100% { opacity: 1 }
}
#content-wrapper {
    position: fixed;
    top: 20%;
    left: 5%;
    width: 90%;
    background-color: rgba(255, 255, 255, 0.8);
    display: flex;
    box-sizing: border-box;
}
img {
    justify-content: center;
    width: 90%;
    margin: 32px auto;
    object-fit: cover;
}
@media screen and (min-width: 450px) {
    #content-wrapper {
        top: 5%;
        width: 100%;
        height: 90%;
        max-width: 90%;
        max-height: 90%;
        margin: auto;
        background-color: rgba(255, 255, 255, 0);
    }
    img {
        justify-content: center;
        height: 90%;
        width: auto;
        margin: auto;
        object-fit: cover;
        padding: 16px;
        background-color: rgba(255, 255, 255, 0.8);
    }
}
</style>