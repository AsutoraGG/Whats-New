# Whats-New
ファイルサイズが増えた、減ったか or 作られたか、削除されたかを確認します

https://github.com/AsutoraGG/Whats-New/assets/76235964/5f555c67-3a0c-4997-b53f-feba65c37ccb

# 原神アセット用機能
vX.xからプラス.1バージョンになる前(更新される前のバージョン)に必ず`Genshin Impact game\GenshinImpact_Data\StreamingAssets\AssetBundles\blocks`を[AssetStudio(YarikStudio)](https://nightly.link/yarik0chka/YarikStudio/workflows/build/main?preview 
)を使い`Misic -> AssetMapType=Json -> put assetmap name -> BuildAssetMap`をしてください。またそれともう一つ最新バージョンもBuildAssetMapしといてください。名前は適当でいいです。    

## 使い方　　
まずsrcフォルダーに`input`フォルダーを作る -> 前バージョン（更新する前のバージョン）のAssetMapファイル(.json)をinputフォルダーに**1.json**として保存する  　
また最新バージョン（更新されたバージョン）のを2.jsonとして
-> 起動し設定をとりあえずやり画面が変わったら"[5]"のを実行する。(これにはかなり時間がかかります） -> 終わったら"[6]"を実行しクリップボードにコピーされるので　　 　
AssetStudio内のAssetBrowserを使い最新バージョンのAssetMap（`Misic -> BuildMap`)を入れ**Container**にペーストしてください。これで新しく追加されたもののみを
取得することが可能です。   
