<script lang="ts" setup>
const path = useRoute().path;
</script>
<template>
<div class="bread_root">
    <ul itemscope itemtype="https://schema.org/BreadcrumbList">
        <li itemprop="itemListElement" itemscope itemtype="https://schema.org/ListItem">
            <a itemprop="item" href="/"><span  itemprop="name">TOP</span></a><meta itemprop="position" content="1" />
        </li>
        <li v-if="path==='/about'" class="current">
            <a itemprop="item" href="/about"><span  itemprop="name">About Drip Cafe</span></a><meta itemprop="position" content="2" />
        </li>
        <li v-if="path==='/recruit'" class="current">
            <a itemprop="item" href="/recruit"><span  itemprop="name">Recruit</span></a><meta itemprop="position" content="2" />
        </li>
    </ul>
</div>
</template>
<style scoped>
.bread_root {
  background-color: rgba(223, 186, 85, 0.513);
  width: 100%;
  padding: 8px 0;
}
ul{
  overflow: hidden;
  width: 100%;
  list-style: none;
  margin: 0 auto;
  padding: 0px;
  font-size: smaller;
}
 
ul li{
  float: left;
  margin: 0 .5em 0 1em;
}
 
ul a{
  background: rgba(255, 255, 255, 0.6);
  padding: .2em 1em;
  float: left;
  text-decoration: none;
  color: #444;
  text-shadow: 0 1px 0 rgba(255, 255, 255, 0.6);
  position: relative;
}
 
ul a:hover{
  background: white;
}
 
ul a::before{
  content: "";
  position: absolute;
  top: 50%;
  margin-top: -1.5em;
  border-width: 1.5em 0 1.5em 1em;
  border-style: solid;
  border-color: rgba(255, 255, 255, 0.6) rgba(255, 255, 255, 0.6) rgba(255, 255, 255, 0.6) transparent;
  left: -1em;
}
 
ul a:hover::before{
  border-color: whitesmoke white white transparent;
}
 
ul a::after{
  content: "";
  position: absolute;
  top: 50%;
  margin-top: -1.5em;
  border-top: 1.5em solid transparent;
  border-bottom: 1.5em solid transparent;
  border-left: 1em solid rgba(255, 255, 255, 0.6);
  right: -1em;
}
 
ul a:hover::after{
  border-left-color: white;
}
 
ul .current,
ul .current:hover{
  background: none;
  font-weight: 500;
}
ul .current span {
  color: #5e5e5ed3;
}
 
ul .current::after,
ul .current::before{
  content: normal;
}
</style>