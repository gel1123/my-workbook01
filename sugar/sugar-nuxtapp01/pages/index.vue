<script lang="ts" setup>
const title = "DRIP Cafe"
const at = "@TOYOSAKI - Okinawa"
</script>
<template>
  <div class="root">
    <div class="body">
      <div class="top">
        <h1 class="top__title">{{title}} {{at}}</h1>
        <div class="top__description">
          <p>
            DRIP CAFEのCOFFEEは一杯一杯ドリップしてお出ししているので
            いつでも新鮮なコーヒーをお楽しみいただけます。
          </p>
          <p>
            他にも沖縄で育った琉球紅茶シリーズ、
            夏にはかかせないスムージードリンクなどもございます。
          </p>
          <p>
            人気のビスケットとご一緒にCOFFEEタイムをお楽しみ下さい。
          </p>
        </div>
      </div>
      <div class="about">
        <h2 class="about__heading">{{title}}について</h2>
        <div class="about__shop-info">
          <h3 class="about__shop-info__heading">店舗情報</h3>
          <table>
            <tr>
              <td>営業時間</td>
              <td>：12時00分～18時30分</td>
            </tr>
            <tr>
              <td>定休日</td>
              <td>：水曜日</td>
            </tr>
          </table>
          <div class="about__address">
            <h4 class="about__address__heading">住所</h4>
            <p>〒901-0225 沖縄県豊見城市豊崎１−４１１<br>
            豊崎ライフスタイルセンター TOMITON 1階</p>
            <div class="about__address__map">
              <iframe 
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d57291.284168778!2d127.66559968824788!3d26.173726798606367!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f1!3m3!1m2!1s0x34e5680b5774aceb%3A0x69e998bd1e2abe73!2sDRIP%20CAFE!5e0!3m2!1sja!2sjp!4v1641312151258!5m2!1sja!2sjp"
                width="90%" height="200px" style="border:0;" loading="lazy"></iframe>
            </div>
          </div>
        </div>
      </div>
      <div class="menu">
        <h2 class="menu__heading">メニュー紹介</h2>
        <div class="menu__body">
          メニュー画像
        </div>
      </div>
      <div class="story">
        <h2 class="story__heading">{{title}}のこだわり</h2>
        <div class="story__body text--minimum">
          ストーリー、こだわり、価値観などブランドイメージを伝える
        </div>
      </div>
      <div class="blog">
        <h2 class="blog__heading">{{title}}'s Blog</h2>
        <div class="blog__body">
          最新記事の切り抜き
        </div>
      </div>
    </div>
  </div>
  <footer>
    © 2022 DRIP CAFE
  </footer>
</template>
<style scoped>
.body {
  box-sizing: border-box;
  width: 100%;
  padding: 0px 10px;
}
.top {
  margin: 16px auto;
  padding: 50px 8px;
  border: 1px solid rgb(200, 200, 200);
}
.top__title {
  text-align: center;
  font-size: larger;
  margin-bottom: 40px;
}
.about__address__map {
  margin: 4px auto;
}
.menu__body, .story__body, .blog__body {
  height: 200px;
  width: 90%;
  line-height: 200px;
  text-align: center;
  border: 1px solid rgb(200, 200, 200);
}
.text--minimum {
  font-size: xx-small;
}
footer {
  margin: 30px 0 10px 0;
  text-align: center;
  font-size: smaller;
  color: rgb(100, 100, 100);;
}
footer hr {
  border: 1px dashed rgb(200, 200, 200);
}
</style>