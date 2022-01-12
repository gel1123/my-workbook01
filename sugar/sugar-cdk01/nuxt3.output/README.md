下記コマンドでnuxt3のビルド資材をここに持って来る。

ただし、serverディレクトリ直下の「edge.mjs」は Nuxt3のLambda向けリソースをLambda@Edge向け
リソースに置き換えるためにこのリポジトリで管理している資材であり、
このファイルは置き換えない。

```
# ※ちなみに -f を無効化する「-i」オプションがcpエイリアスに設定されているので、
# エイリアスを無視するために、cpコマンドの前にバックスラッシュを配置している。
% \cp -rf ~/my-repo/my-workbook01/sugar/sugar-nuxtapp01/.output/* ~/my-repo/my-workbook01/sugar/sugar-cdk01/nuxt3.output
```
