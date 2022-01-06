<script lang="ts" setup>
import Favicons from '~~/components/favicons.vue';
import Logo from '~~/components/simple-logo.vue';
import { onMounted } from 'vue';
const title = "Drip Cafe";
interface RssItem {
  pubDate: string;
  title: string;
  enclosure: {
    url: string;
  };
  summary: string;
  link: string;
}
const rssItems: RssItem[] = [];

// mounted hook
onMounted(async () => {
  // CORSの壁を突破するために、下記の参考記事のように仲介役を挟む必要がある（SSGのためサーバ側でやらない。未実装）
  // 参考：https://www.to-r.net/media/note-rss/
  const res = await fetch('https://dripcafe.ti-da.net/index.xml', {mode: "cors"});
  if (!res.ok) return;
  const xml = await res.text();
  const parser = new DOMParser();
  const parsed = parser.parseFromString(xml, "text/xml");
  parsed.querySelector
  console.log("parsed", parsed);
  const $item1 = parsed.querySelector("item");
  const $item2 = parsed.querySelector("item+item");
  const $item3 = parsed.querySelector("item+item+item");
  const getItem = ($item: Element | null) => {
    if (!$item) return null;
    const item: RssItem = {
      pubDate: $item.querySelector("pubData")!.textContent!,
      title: $item.querySelector("title")!.textContent!,
      enclosure: {
        url: $item.querySelector("enclosure")!.getAttribute("url")!
      },
      summary: $item.querySelector("description")!.textContent!,
      link: $item.querySelector("link")!.textContent!
    };
    return item;
  };
  const item1: RssItem | null = getItem($item1);
  const item2: RssItem | null = getItem($item2);
  const item3: RssItem | null = getItem($item3);
  item1 && rssItems.push(item1);
  item2 && rssItems.push(item2);
  item3 && rssItems.push(item3);
});
</script>
<template>
  <Favicons/>
  <Title>{{title}}</Title>
  <Body>
    <div class="wrapper">
      <div class="top">
        <Logo />
        <div class="top__description">
          <p>
            Drip CafeのCOFFEEは一杯一杯ドリップしてお出ししているので
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
      <div class="story body">
        <h2 class="story__heading">{{title}}のこだわり</h2>
        <div class="story__body text--minimum">
          ストーリー、こだわり、価値観などブランドイメージを伝える
        </div>
      </div>
      <div class="about body">
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
      <div class="menu body">
        <h2 class="menu__heading">メニュー紹介</h2>
        <div class="menu__body">
          メニュー画像
        </div>
      </div>
      <div class="blog body bottom">
        <h2 class="blog__heading">{{title}}'s Blog</h2>
        <div class="blog__body">
          <div v-for="item in rssItems">
            <p>{{item.pubDate}}</p>
            <p>{{item.title}}</p>
            <img :src="item.enclosure?.url" />
            <p>{{item.summary}}</p>
            <p>{{item.link}}</p>
          </div>
        </div>
      </div>
    </div>
  </Body>
  <footer>
    © 2022 Drip Cafe
  </footer>
</template>
<style scoped>
.wrapper {
  opacity: 0;
  animation: anime01 1s ease-out 0s 1 forwards;
}
@keyframes anime01 {
  0% { opacity: 0 }
  100% { opacity: 1 }
}
.body {
  box-sizing: border-box;
  width: 100%;
  padding: 16px 10px 24px;
}
.story {
  background-color: rgba(255, 255, 255, 0);
}
.about {
  background-color: rgba(255, 255, 255, 0);
}
.menu {
  background-color: rgba(255, 255, 255, 0);
}
.blog {
  background-color: rgba(255, 255, 255, 0);
}
.bottom.body {
  padding-bottom: 40px;
}
.top {
  margin: 0px auto 16px;
  /* padding: 50px 0; */
  /* border: 1px solid rgb(200, 200, 200); */
}
.top__title {
  text-align: center;
  font-size: larger;
  /* margin-bottom: 40px; */
}
.top__description {
  padding: 0 8px;
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
  margin: 0;
  padding: 4px 0 4px 0;
  text-align: center;
  font-size: smaller;
  color: rgb(100, 100, 100);;
  background-color: rgb(240, 240, 240);
}
</style>