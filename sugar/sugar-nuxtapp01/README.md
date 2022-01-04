### 注意
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
