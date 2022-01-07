## 開発中のメモなど

### Nuxt3導入時の注意点
2022-01-04時点では、Nuxt3の[Issue#2599](https://github.com/nuxt/framework/issues/2599)により、 `npx nuxi init projectname` でプロジェクトを作成した直後 `npm install` すると、正常にNuxt3アプリケーションが起動しない。

この対策として、package.jsonを下記のように変更する

#### before

```
{
  "private": true,
  "scripts": {
    "dev": "nuxi dev",
    "build": "nuxi build",
    "start": "node .output/server/index.mjs"
  },
  "devDependencies": {
    "nuxt3": "latest"
  }
}
```

#### after

```
{
  "private": true,
  "scripts": {
    "dev": "nuxi dev",
    "build": "nuxi build",
    "start": "node .output/server/index.mjs"
  },
  "devDependencies": {
    "nuxt3": "latest"
  },
  "resolutions": {
    "resolve": "1.20.0"
  }
}
```

上記のresolutionsは依存パッケージのバージョン固定を行う。yarnでのみ使えるオプションであり、npmでは無理っぽい気配。なので、このプロジェクトのパッケージマネージャにはyarnを用いる。

### script setup における ref, reactive
script setupでは data にアクセスできない（コンポーネント作成前の「セットアップ」としての仕組みだから）。
代わりに ref や reactive を用いてテンプレートとの動的な連携を行う。
refはプリミティブな値に、reactiveはオブジェクトに適用する。

[参考にさせていただいた記事](https://edge-labo.com/vue3-composition-api/)
