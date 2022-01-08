<template>
    <div class="jumbotron">
        <img src="/img/jumbotron01_700-1100.jpeg">
    </div>
</template>
<style scoped>
.jumbotron {
    height: 100%;
    width: 100%;
    overflow: hidden;
}
img {
    height: 500px;
    width: 100%;
    object-fit: cover;
    object-position: 0% top;
    animation: 10s ease-in 1s 1 forwards slide;
}
@keyframes slide {
    0% { object-position: 0% top; }
    100% { object-position: 100% top; }
}
</style>