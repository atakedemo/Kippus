# Kippus
web3×AIハッカソンに向けて作成

## ディレクトリ構造
```
├── backend                     : クラウド(AWS)でのサーバー実装
│   ├── aws         : AWS上に構築したAPIのロジック（Lambda Pythonで実装）
│   ├── oracle      : Chainlinkのノード設定
│   └── the-graph   : the Graphによるインデックス作成
├── contract        : スマコンの実装
│   ├── contracts   : スマコンのソースコード(Solidity)
│   ├── scripts     : デプロイ用のソースコード
│   └── test
├── frontend         : フロントエンド(Next.js + ethers.js)
└── ai-training      : AIのアルゴリズム（機械学習による価格最適化）
```

## 環境情報
|分類|項目|値|
|---|---|---|
|Network|使用するチェーン|Polygon Mumbai|
|Contract Address|チケットNFT(ERC1155)|0x565a38C71AeAc5Ed9c439E300B26Cc86e630b881|
|Contract Address|トークンの払い戻し ※Chainlink実行|0x01eDd650139d0857318c5733587F86E8Dde8396B|
|Contract Address|NFT発行 ※Chainlink実行|0x5060c712355225850C90390AB4e379C0938384fA|
|Wallet Adress|Tx実行サーバーのアドレス ※AWS KMSで管理|0x54d3B05E28cB78204e1171DeC088698eb829523d|