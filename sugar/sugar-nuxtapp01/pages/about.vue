<script lang="ts" setup>
import Bread1 from '~~/components/bread.vue';
const $config = useRuntimeConfig();
const siteUrl = $config.siteUrl;
let position01 = ref(10);
let position02 = ref(0);
onMounted(async() => {
    window.addEventListener('scroll', () => {
        const y = window.scrollY/window.document.documentElement.scrollHeight*100;
        position01.value = 10+y*0.3;
        position02.value = y*0.7;
    });
});
</script>
<template>
    <Title>Drip Cafe</Title>
    <Favicons/>
    <!-- SEO -->
    <Meta name="description" content="Drip Cafeでは自家焙煎にこだわっています。豆の特徴、焙煎の度合い。試行錯誤の末、それらの要素がよく調和するオリジナルブレンドをご提供しています。沖縄南部の観光スポットあしびなーの隣「豊崎ライフセンターTOMITON」で営業中です！" />
    <!-- OGP -->
    <Meta property="og:site_name" content="Drip Cafe" />
    <Meta property="og:title" content="Drip Cafe" />
    <Meta property="og:description" content="Drip Cafeでは自家焙煎にこだわっています。豆の特徴、焙煎の度合い。試行錯誤の末、それらの要素がよく調和するオリジナルブレンドをご提供しています。沖縄南部の観光スポットあしびなーの隣「豊崎ライフセンターTOMITON」で営業中です！" />
    <Meta property="og:type" content="article" />
    <Meta property="og:url" :content="`${siteUrl}/about`" />
    <Meta property="og:image" :content="`${siteUrl}/img/about/about01.jpg`" />
    <Meta name="twitter:site" :content="`${siteUrl}/about`" />
    <Meta name="twitter:card" content="summary_large_image" />
    <Meta name="twitter:title" content="Drip Cafe" />
    <Meta name="twitter:description" content="Drip Cafeでは自家焙煎にこだわっています。豆の特徴、焙煎の度合い。試行錯誤の末、それらの要素がよく調和するオリジナルブレンドをご提供しています。沖縄南部の観光スポットあしびなーの隣「豊崎ライフセンターTOMITON」で営業中です！" />
    <Meta name="twitter:image" :content="`${siteUrl}/img/about/about01.jpg`" />
    <Body>
        <div class="wrapper_wrapper">
            <div class="wrapper">
                <h2>About Drip Cafe</h2>
                <Bread1/>
                <div class="contents">
                    <h3>Drip Cafeってどんなお店？</h3>
                    <img class="imgtype1" :src="'/img/about/about01.jpg'" />
                    <div>
                        <p>自家焙煎珈琲と手作り氷ぜんざいが人気のワゴンカフェです。一杯一杯丁寧にいれたコーヒーをお楽しみいただけます。</p>
                        <p>ほかにもコーヒーベースの甘くて美味しい飲み物や、手作りの焼き菓子もあるので、ちょっと一息つきたいときにぜひお立ち寄りください</p>
                    </div>
                </div>
                <div class="contents">
                    <h3>どこにあるの？</h3>
                    <div>
                        <p>沖縄南部の観光スポット「あしびなー」の隣にあるTOMITONという総合ショッピングセンター1階でやってます。</p>
                        <p>青緑色ベースの大きなワゴンが目印です！ TOMITONの入り口すぐのところにあります。</p>
                    </div>
                </div>
                <div class="contents">
                    <h3>当店のこだわり</h3>
                    <div class="flex">
                        <img class="imgtype2" :src="'/img/square/square02.jpg'"
                            :style="`object-position:${position01}%`"/>
                        <div>
                            <br>
                            <p>Drip Cafeでは自家焙煎にこだわっています。</p>
                            <br>
                            <p>豆の特徴、</p>
                            <p>焙煎の度合い。</p>
                            <br>
                            <p>試行錯誤の末、それらの要素がよく調和するオリジナルブレンドをご提供しています。</p>
                            <br>
                            <p>ホットコーヒーは香り中心の豆を使用し、酸味、苦味のバランスの良い仕上がりに。</p>
                            <p>アイスコーヒーは酸味少なくコクがあり、また後味はスッキリと仕上げました。</p>
                        </div>
                    </div>
                </div>
                <div class="contents">
                    <h3>ロゴマークについて</h3>
                    <img class="imgtype3" :src="'/img/simple-logo_110-265.png'" />
                    <div>
                        <p>人気の自家焙煎珈琲と、手作りの氷ぜんざいをモチーフに、ドリップと氷の結晶で形作りました。</p>
                        <p>苦味は控え目で程良いコクのあるコーヒーと、押麦をつかった少しとろみのあるぜんざいをお楽しみください。</p>
                    </div>
                </div>
                <div class="contents">
                    <h3>もっとメニューを教えて！</h3>
                    <img class="imgtype4" :src="'/img/square/square01.jpg'"
                        :style="`object-position:0% ${position02}%`"/>
                    <div>
                        <p>当店では珈琲以外にも、色々な飲み物やスイーツをお楽しみいただけます。</p>
                        <p>ほんのり甘酸っぱいハニーレモンスカッシュや、バターを使った卵不使用のビスケット、ホイップを載せた黒糖やキャラメルのカフェオレなどがございます。</p>
                        <p>また期間限定メニューも取りそろえており、ほうじラテや抹茶ラテ、カフェオレゼリーなどその時期ならではのメニューもお楽しみいただけます。</p>
                        <p></p>
                    </div>
                </div>
                <div class="contents">
                    <h3></h3>
                    <div>
                        <p></p>
                        <p></p>
                    </div>
                </div>
            </div>
        </div>
        <footer>
          © 2022 Drip Cafe
        </footer>
    </Body>
</template>
<style scoped>
.wrapper {
  padding: 16px 10px 24px;
  opacity: 0;
  animation: anime01 1s ease-out 0s 1 forwards;
}
@keyframes anime01 {
  0% { opacity: 0 }
  100% { opacity: 1 }
}
footer {
  margin: 0;
  padding: 4px 0 4px 0;
  text-align: center;
  font-size: smaller;
  color: rgb(100, 100, 100);;
  background-color: rgb(240, 240, 240);
}
.imgtype1 {
    object-fit: cover;
    width: 100%;
    height: 80px;
}
.imgtype2 {
    object-fit: cover;
    width: 40%;
    height: 400px;
    position: float;
}
.imgtype3 {
    width: 100%;
}
.imgtype4 {
    object-fit: cover;
    object-position: 0%;
    width: 100%;
    height: 150px;
}
.flex .imgtype2 {
    margin: 4px 8px;
}
.flex p {
    margin: 0 0 8px 0;
}
.flex {
    display: flex;
}
h2 {
    text-align: center;
}
@media screen and (min-width: 450px) {
  .wrapper {
    max-width: 600px;
    margin: auto;
  }
  .wrapper_wrapper {
    margin: auto;
    max-width: 650px;
    padding: 0 20px;
    background-color: white;
  }
  footer {
    max-width: 690px;
    margin: 0 auto;
  }
}
</style>