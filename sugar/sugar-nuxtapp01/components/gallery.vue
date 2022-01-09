<script lang="ts" setup>
const srcList = [
    "/img/square/square01.jpg",
    "/img/square/square02.jpg",
    "/img/square/square03.jpg",
    "/img/square/square04.jpg",
    "/img/square/square05.jpg",
    "/img/square/square06.jpg",
    "/img/square/square07.jpg",
    "/img/square/square08.jpg"
];
/** Vue3におけるEmit定義は [こちら](https://zenn.dev/azukiazusa/articles/676d88675e4e74#emit) の記事参照 */
interface Emits {
    (e: "show-picture", value: string): void
}
const $emit = defineEmits<Emits>();
const onClick = ({target}: {target: EventTarget | null}) => {
    const src = (target as HTMLImageElement).src;
    $emit("show-picture", src);
}
</script>
<template>
    <div id="root">
        <div v-for="src in srcList">
            <img :src="src" @click="onClick"/>
        </div>
    </div>
</template>
<style scoped>
img {
    height: 90px;
    padding: 4px;
    border: 1px solid rgb(200, 200, 200);
    margin: 0 2px;
}
div {
    box-sizing: border-box;
}
#root {
    width: 100%;
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
}
</style>