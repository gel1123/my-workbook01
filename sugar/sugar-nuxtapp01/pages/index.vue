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
  // ----------------- ここからSSR用 ---------------
const { data } = await useFetch('https://dripcafe.ti-da.net/index.xml');
xml.value = (data.value ? data.value : "") as string;
  // ----------------- ここまでSSR用 ---------------
  // ----------------- ここからSSG用 ---------------
  // SSGでCORSの壁を突破したいなら、下記のように仲介役を挟む必要がある
  // 参考：https://www.to-r.net/media/note-rss/
  // var $config = useRuntimeConfig();
  // const endpoint: string = $config.rssEndpoint; //<= https://dripcafe.ti-da.net/index.xml からRSS取得
  // const res = await fetch(endpoint);
  // if (res.ok) {
  //   xml.value = await res.text();
  // }
  // ----------------- ここまでSSG用 ---------------
// </==================== 手続き処理 ====================>

// <==================== hook ====================>
onMounted(async () => {
  setRssItems(xml.value);
});
// </==================== hook ====================>

</script>
<template>
  <Favicons/>
  <Title>{{title}}</Title>
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

        <!-- <div class="story body">
          <h2 class="story__heading">{{title}}のこだわり</h2>
          <div class="story__body text--minimum">
            ストーリー、こだわり、価値観などブランドイメージを伝える
          </div>
        </div> -->

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
        <div class="gallery body">
          <h2 class="gallery__heading">Gallery</h2>
          <div class="gallery__body">
            <Gallery @show-picture="showPicture" />
          </div>
        </div>
        <div class="blog body bottom">
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
    width: 30%;
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