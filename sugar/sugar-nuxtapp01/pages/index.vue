<script lang="ts" setup>
import Favicons from '~~/components/favicons.vue';
import Logo from '~~/components/simple-logo.vue';
import Jumbotron1 from '~~/components/jumbotron.vue';
import Gallery from '~~/components/gallery.vue';
import Modal1 from '~~/components/modal.vue';

// <==================== 型情報 ====================>
interface RssItem {
  pubDate: string;
  title: string;
  enclosure: {
    url: string;
  };
  summary: string;
  link: string;
}
// </==================== 型情報 ====================>

// <==================== 定数 ====================>
const title = "Drip Cafe";
// </==================== 定数 ====================>

// <==================== 関数 ====================>
/** RSSのItemタグ内から必要な情報を収集して返却する */
const getItem = ($item: Element | null) => {
  if (!$item) return null;
  const date = new Date($item.querySelector("pubDate")!.textContent!);
  const item: RssItem = {
    pubDate: `${date.getMonth()-0+1}/${date.getDate()} ${date.getHours()}:${date.getMinutes()}`,
    title: $item.querySelector("title")!.textContent!,
    enclosure: {
      url: $item.querySelector("enclosure")?.getAttribute("url") || ""
    },
    summary: `${$item.querySelector("description")!.textContent!.slice(0, 50)}......`,
    link: $item.querySelector("link")!.textContent!
  };
  return item;
}
/**
 * RSS(XML) をもとに、初期表示に必要な情報を収集してセットする.
 * なおDOMParserはブラウザ固有なので、この関数はフロントで実行させるべき。
 */
const setRssItems = (xml: string | undefined | null) => {
  if (!xml) return;
  const parser = new DOMParser();
  const parsed = parser.parseFromString(xml, "application/xml");
  const $item1 = parsed.querySelector("item");
  const $item2 = parsed.querySelector("item+item");
  const $item3 = parsed.querySelector("item+item+item");
  const item1: RssItem | null = getItem($item1);
  const item2: RssItem | null = getItem($item2);
  const item3: RssItem | null = getItem($item3);
  item1 && rssItems.push(item1);
  item2 && rssItems.push(item2);
  item3 && rssItems.push(item3);
}
/** Galleryコンポーネントの画像クリック時に発火 */
const showPicture = (src: string) => {
  modalSrc.value = src;
}
/** 上記で開いたモーダルの外縁部クリック時に発火 */
const closePicture = () => {
  modalSrc.value = "";
}
// </==================== 関数 ====================>

// <==================== ref || reactive ====================>
/** 画面に出力するために抽出したRSS情報 */
const rssItems: RssItem[] = reactive([]);
/** RSS本体のXML */
let xml  = ref("");
/** モーダルに表示する画像のsrc */
const modalSrc = ref("");
// </==================== ref || reactive ====================>

// <==================== 手続き処理 ====================>
const $config = useRuntimeConfig();
const siteUrl = $config.siteUrl;
  // ----------------- ここからSSR用 ---------------
if (useState<string>("xmlValue").value) {
  xml = useState<string>("xmlValue");
} else {
  const { data } = await useFetch('https://dripcafe.ti-da.net/index.xml');
  xml.value = (data.value ? data.value : "") as string;
  useState<string>("xmlValue", () => {
    return xml.value;
  });
}
  // ----------------- ここまでSSR用 ---------------
  // ----------------- ここからSSG用 ---------------
  // SSGでCORSの壁を突破したいなら、下記のように仲介役を挟む必要がある
  // 参考：https://www.to-r.net/media/note-rss/
  // const endpoint: string = $config.rssEndpoint; //<= https://dripcafe.ti-da.net/index.xml からRSS取得
  // const res = await fetch(endpoint);
  // if (res.ok) {
  //   xml.value = await res.text();
  // }
  // ----------------- ここまでSSG用 ---------------
// </==================== 手続き処理 ====================>

// <==================== hook ====================>
onMounted(async () => {
  // RSS
  setRssItems(xml.value);
  // レイアウト演出
  window.addEventListener('scroll', () => {
    const element = document.querySelector("a");
    const rect = element?.getBoundingClientRect();
    const isInView = rect && 0 < rect.bottom && rect.top < window.innerHeight;
    if (isInView) {
      !element?.classList?.contains("inView") && element?.classList.add("inView");
    } else {
      element?.classList?.contains("inView") && element?.classList.remove("inView");
    }
  });
});
// </==================== hook ====================>

</script>
<template>
  <Favicons/>
  <Title>{{title}}</Title>
  <!-- SEO -->
  <Meta name="description" content="自家焙煎珈琲と手作り氷ぜんざいが人気のワゴンカフェです。一杯一杯丁寧にいれたコーヒーをお楽しみいただけます。ほかにもコーヒーベースの甘くて美味しい飲み物や、手作りの焼き菓子もあるので、ちょっと一息つきたいときにぜひお立ち寄りください。" />
  <!-- OGP -->
  <Meta property="og:site_name" content="Drip Cafe" />
  <Meta property="og:title" content="Drip Cafe" />
  <Meta property="og:description" content="自家焙煎珈琲と手作り氷ぜんざいが人気のワゴンカフェです。一杯一杯丁寧にいれたコーヒーをお楽しみいただけます。ほかにもコーヒーベースの甘くて美味しい飲み物や、手作りの焼き菓子もあるので、ちょっと一息つきたいときにぜひお立ち寄りください。" />
  <Meta property="og:type" content="website" />
  <Meta property="og:url" :content="siteUrl" />
  <Meta property="og:image" :content="'/img/ogp01_630-1200.jpeg'" />
  <Meta name="twitter:card" content="summary" />
  <Meta name="twitter:site" :content="siteUrl" />
  <Meta name="twitter:image" :content="'/img/ogp01_630-1200.jpeg'" />
  <Body>
    <Modal1 v-if="modalSrc" :src="modalSrc" @close-picture="closePicture"/>
    <div class="wrapper_wrapper">
      <div class="wrapper">
        <div class="top">
          <Logo/>
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
          <Jumbotron1 />
        </div>

        <div class="about body">
          <h2 class="about__heading">{{title}}について</h2>
          <div class="about__shop-info">
            <div>
              <p>豊崎ライフスタイルセンターTOMITONの1階で営業しています。自家焙煎珈琲と手作り氷ぜんざいが人気のワゴンカフェです。</p>
              <p>一杯一杯丁寧にいれたコーヒーをお楽しみいただけます。青緑色ベースの大きなワゴンが目印です！</p>
              <p style="font-size: medium;">
                <a href="/about" style="color: cornflowerblue;">当店についてもっと知りたい方はこちら >></a>
              </p>
            </div>
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
              <h3 class="about__address__heading">所在地</h3>
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
        <div class="gallery body">
          <h2 class="gallery__heading">Gallery</h2>
          <div class="gallery__body">
            <Gallery @show-picture="showPicture" />
          </div>
        </div>
        <div class="blog body bottom" v-if="rssItems.length > 0">
          <h2 class="blog__heading">{{title}}'s Blog</h2>
          <div class="blog__body">
            <div class="blog__item_wrapper">
              <div class="blog__item" v-for="item in rssItems" :v-key="item.link">
                <div class="blog__item_child" style="display: flex;">
                  <div class="blog__item__text_wrapper" v-if="item.enclosure.url" style="width: 50%; margin: 8px 8px; align-items: center;">
                    <p style="font-size: small; margin: 0 0 6px 0;">{{item.title}} ({{item.pubDate}})</p>
                    <p style="font-size: small;">{{item.summary}}<a :href="item.link" target="_blank" rel="noopener noreferrer">続き</a></p>
                  </div>
                  <div class="blog__item__text_wrapper" v-if="!item.enclosure.url" style="width: 100%; margin: 8px 8px; align-items: center;">
                    <p style="font-size: small; margin: 0 0 6px 0;">{{item.title}} ({{item.pubDate}})</p>
                    <p style="font-size: small;">{{item.summary}}<a :href="item.link" target="_blank" rel="noopener noreferrer">続き</a></p>
                  </div>
                  <div class="blog__item__img_wrapper" v-if="item.enclosure.url" style="width: 50%; margin: auto 8px; align-items: center;">
                    <img :src="item.enclosure.url" 
                      style="height: 80%; width: 80%; object-fit: cover; object-position: 50% 50%;"/>
                  </div>
                </div>
              </div>
            </div>
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
.inView {
  animation: anime01 1s ease-out 0s 1 forwards;
}
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
.gallery {
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
.story__body, .blog__body {
  border: 1px solid rgb(200, 200, 200);
  padding: 16px;
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
  .blog__item {
    width: 33%;
  }
  .blog__item_wrapper {
    display: flex;
    justify-content: center;
  }
  .blog__item__text_wrapper, .blog__item__img_wrapper {
    width: 90%!important;
  }
  .blog__item_child {
    display: block!important;
  }
}
</style>