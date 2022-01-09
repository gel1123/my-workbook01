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
    if (target.id === "root") {
        $emit("close-picture");
    }
}
const {src} = defineProps<Props>();
</script>
<template>
    <div id="root" @click="onClickRoot">
        <div id="content">
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
#content {
    position: fixed;
    top: 20%;
    width: 90%;
    left: 5%;
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
</style>