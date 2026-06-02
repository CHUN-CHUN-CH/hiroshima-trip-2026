# 2026 廣島朋友旅行手冊

這是一個手機優先的靜態旅行網站，用來整理 2026/7/23-7/29 廣島多人旅行行程。

網站重點是讓朋友在手機上快速查看：

- 每日行程與集合時間
- 必集合、半自由、自由活動安排
- 景點介紹與歷史背景
- 點到點交通摘要
- Google Map 導航
- 官方網站與參考來源
- 餐廳清單
- 地圖總覽
- 天氣備案
- 行前 Checklist
- 預算估算

公開網站：

```text
https://chun-chun-ch.github.io/hiroshima-trip-2026/
```

## 專案結構

```text
.
├── index.html
├── styles.css
├── script.js
├── site.webmanifest
├── food.html
├── map.html
├── weather.html
├── checklist.html
├── budget.html
├── assets/
│   ├── apple-touch-icon.png
│   ├── favicon-32.png
│   ├── icon-192.png
│   └── icon-512.png
└── spots/
    ├── itsukushima.html
    ├── peace-memorial.html
    ├── shukkeien.html
    ├── onomichi.html
    ├── kure.html
    ├── kintaikyo.html
    ├── saijo.html
    ├── hondori.html
    ├── otorii.html
    ├── omotesando.html
    ├── daishoin.html
    ├── misen-ropeway.html
    ├── hiroshima-castle.html
    └── hiroshima-port-fireworks.html
```

## 首頁內容

`index.html` 是主要入口，包含：

- Hero 首頁視覺
- 先看這裡
- 旅行重點
- 每日行程抽屜
- 每日集合資訊卡
- 景點總覽卡片
- 交通摘要
- 自由活動選單
- 主要 REF
- 右下角快捷選單

行程中提到的景點會先連到本站內的景點頁，不會直接跳 Google Map。

## 景點頁

所有景點頁都放在 `spots/` 資料夾。

每個景點頁至少包含：

- 返回首頁
- 景點名稱
- 簡介
- 為什麼值得去
- 建議停留時間
- 交通方式
- Google Map 導航
- 官方網站或參考來源
- 全站快捷選單
- 景點標籤
- 開放時間與休館提醒

目前景點頁包含：

- 嚴島神社
- 原爆圓頂 / 和平紀念公園
- 縮景園
- 尾道
- 吳市
- 岩國錦帶橋
- 西條酒藏
- 本通
- 大鳥居
- 宮島表參道
- 大聖院
- 彌山纜車
- 廣島城
- 廣島港 / 宇品 / 花火大會

## Phase 2 新增頁面

- `food.html`：餐廳清單，包含廣島燒、牡蠣、穴子飯、尾道拉麵、咖啡店、居酒屋。
- `map.html`：景點與交通節點 Google Map 總覽。
- `weather.html`：雨天、酷暑、很累時的備案。
- `checklist.html`：行前 Checklist，可在手機上打勾。
- `budget.html`：每人與團體預算估算。

## Phase 2 新增功能

- 每天行程上方有集合資訊卡。
- 快捷選單加入餐廳、地圖、天氣備案、Checklist、預算。
- 嚴島神社與大鳥居頁新增潮汐拍攝提醒。
- 所有景點頁會顯示標籤、開放時間、休館日與注意事項。
- 花火頁補充集合時間、到場時間、散場動線、便利商店、廁所與回市區提醒。
- 景點 Hero 支援依景點套用不同代表圖片。

## 手機版設計重點

這個網站以手機閱讀為優先：

- topbar 在手機上可水平滑動，不硬塞按鈕
- 行程用抽屜收合，避免頁面太長
- 卡片、按鈕、快捷選單都有較大的點擊面積
- 右下角快捷選單可快速跳到主要區塊
- 景點頁內容分區清楚，避免一頁塞太多資訊
- CSS 設定避免橫向捲動

## 本機預覽

這是純靜態網站，可以直接打開 `index.html`。

如果要用本機伺服器預覽，可在專案根目錄啟動任一靜態伺服器，例如：

```powershell
python -m http.server 4173
```

然後開：

```text
http://127.0.0.1:4173/
```

## GitHub Pages 部署

目前公開網站使用 GitHub Pages，部署來源是：

```text
Branch: gh-pages
Folder: /root
```

更新流程：

```powershell
git add .
git commit -m "Update Hiroshima trip site"
git push origin master
git switch gh-pages
git merge master
git push origin gh-pages
git switch master
```

GitHub Pages 更新通常需要 1-3 分鐘。

## 注意事項

- 新增景點時，請在 `spots/` 建立獨立 HTML 頁面。
- 首頁行程若提到景點，請連到本站內部景點頁，而不是直接連 Google Map。
- 景點頁裡再放 Google Map 導航與 REF。
- 修改 `script.js` 時要保留容錯，避免景點頁沒有首頁元素時報錯。
- 廣島城頁已註明：天守內部已於 2026 年 3 月關閉，行程應以外觀與城跡為主。
