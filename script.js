const choices = {
  onomichi: {
    title: "尾道",
    text: "適合喜歡散步、拍照、老街、千光寺、尾道拉麵的人。從廣島出發約 1.5 小時上下。",
  },
  kure: {
    title: "吳市",
    text: "適合喜歡軍艦、博物館、海港的人。從廣島出發約 45 分鐘，夏天也有不少室內行程。",
  },
  iwakuni: {
    title: "岩國錦帶橋",
    text: "適合想看漂亮橋、城下町和輕鬆半日小旅行的人。最後一天可排，但不要太晚回廣島。",
  },
  saijo: {
    title: "西條酒藏",
    text: "適合喜歡清酒、酒藏街、慢慢散步的人。節奏比尾道輕，適合自由日或最後一天上午。",
  },
  shopping: {
    title: "市區購物",
    text: "適合想買藥妝、伴手禮、甜點，或單純想睡飽的人。本通、紙屋町、八丁堀都很好安排。",
  },
  miyajima: {
    title: "宮島二刷",
    text: "適合想補拍大鳥居潮汐照、慢慢逛表參道，或第一天宮島沒拍夠的人。",
  },
};

const buttons = document.querySelectorAll("[data-choice]");
const choiceTitle = document.querySelector("#choice-title");
const choiceText = document.querySelector("#choice-text");

if (buttons.length && choiceTitle && choiceText) {
  buttons.forEach((button, index) => {
    if (index === 0) {
      button.classList.add("is-active");
    }

    button.addEventListener("click", () => {
      const choice = choices[button.dataset.choice];

      if (!choice) {
        return;
      }

      choiceTitle.textContent = choice.title;
      choiceText.textContent = choice.text;

      buttons.forEach((item) => item.classList.remove("is-active"));
      button.classList.add("is-active");
    });
  });
}

const quickMenu = document.querySelector("[data-menu]");
const quickToggle = document.querySelector("[data-menu-toggle]");
const quickPanel = document.querySelector("[data-menu-panel]");
const scrollTopButtons = document.querySelectorAll("[data-scroll-top]");

function setQuickMenu(open) {
  if (!quickMenu || !quickToggle) {
    return;
  }

  quickMenu.classList.toggle("is-open", open);
  quickToggle.setAttribute("aria-expanded", String(open));
  quickToggle.textContent = open ? "×" : "☰";
}

if (quickMenu && quickToggle && quickPanel) {
  quickToggle.addEventListener("click", () => {
    setQuickMenu(!quickMenu.classList.contains("is-open"));
  });

  quickPanel.addEventListener("click", (event) => {
    const target = event.target;

    if (target instanceof HTMLAnchorElement) {
      setQuickMenu(false);
    }
  });

  document.addEventListener("click", (event) => {
    if (!quickMenu.contains(event.target)) {
      setQuickMenu(false);
    }
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
      setQuickMenu(false);
    }
  });
}

scrollTopButtons.forEach((button) => {
  button.addEventListener("click", () => {
    setQuickMenu(false);
    window.scrollTo({ top: 0, behavior: "smooth" });
  });
});

const quickPanelLinks = document.querySelectorAll("[data-menu-panel]");
const extraQuickLinks = [
  ["住宿", "index.html#lodging"],
  ["動態地圖", "index.html#dynamic-map"],
  ["餐廳", "food.html"],
  ["地圖", "map.html"],
  ["天氣備案", "weather.html"],
  ["Checklist", "checklist.html"],
  ["預算", "budget.html"],
];

quickPanelLinks.forEach((panel) => {
  const isSpotPage = location.pathname.includes("/spots/");
  const prefix = isSpotPage ? "../" : "";

  extraQuickLinks.forEach(([label, href]) => {
    if ([...panel.querySelectorAll("a")].some((link) => link.textContent === label)) {
      return;
    }

    const link = document.createElement("a");
    link.href = `${prefix}${href}`;
    link.textContent = label;
    const refs = [...panel.querySelectorAll("a")].find((item) => item.textContent === "REF");
    panel.insertBefore(link, refs || panel.querySelector("[data-scroll-top]"));
  });
});

const mapItems = [
  ["廣島機場", "Hiroshima Airport"],
  ["飯店", "Hiroshima hotel"],
  ["廣島站", "Hiroshima Station"],
  ["宮島口", "Miyajimaguchi Station"],
  ["嚴島神社", "Itsukushima Shrine"],
  ["大鳥居", "Great Torii Gate Miyajima"],
  ["大聖院", "Daisho-in Temple Miyajima"],
  ["彌山纜車", "Miyajima Ropeway"],
  ["原爆圓頂", "Atomic Bomb Dome Hiroshima"],
  ["和平公園", "Hiroshima Peace Memorial Park"],
  ["廣島城", "Hiroshima Castle"],
  ["縮景園", "Shukkeien Garden Hiroshima"],
  ["本通", "Hondori Hiroshima"],
  ["尾道", "Onomichi Hiroshima"],
  ["吳市", "Kure Hiroshima"],
  ["錦帶橋", "Kintaikyo Bridge Iwakuni"],
  ["下瀨美術館", "SIMOSE Art Museum Otake Hiroshima"],
  ["大竹站東口", "Otake Station East Exit"],
  ["西條酒藏", "Saijo Sake Brewery Street Hiroshima"],
  ["花火會場", "Hiroshima Port Ujina Hatoba Park"],
];

const mapList = document.querySelector("[data-map-list]");
if (mapList) {
  mapItems.forEach(([name, query]) => {
    const card = document.createElement("article");
    card.className = "map-card";
    card.innerHTML = `<h3>${name}</h3><p>${query}</p><a href="https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(query)}" target="_blank" rel="noreferrer">Google Map</a>`;
    mapList.append(card);
  });
}

const tripMapElement = document.querySelector("#trip-map");
const tripMapStatus = document.querySelector("[data-map-status]");
const tripMapMissingList = document.querySelector("[data-map-missing-list]");
const tripMapMissingCount = document.querySelector("[data-map-missing-count]");
const tripMapFilters = document.querySelectorAll("[data-map-filter]");

const tripMapCategoryMeta = {
  sightseeing: { label: "景點", color: "#2f6fbd", icon: "景" },
  okonomiyaki: { label: "餐廳｜廣島燒", color: "#d87923", icon: "燒" },
  noodles: { label: "餐廳｜拉麵 / 麵類", color: "#c74338", icon: "麵" },
  curry: { label: "餐廳｜咖哩 / 印度料理", color: "#d7a21d", icon: "咖" },
  cafe: { label: "餐廳｜咖啡甜點", color: "#2f8f64", icon: "咖" },
  japanese: { label: "餐廳｜精進料理 / 日本料理", color: "#7b58b8", icon: "和" },
  izakaya: { label: "餐廳｜居酒屋", color: "#a4452f", icon: "酒" },
  lateNight: { label: "宵夜", color: "#5d3b8f", icon: "夜" },
  transport: { label: "交通節點", color: "#6b737b", icon: "站" },
  meeting: { label: "集合地點", color: "#1d2328", icon: "集" },
  backup: { label: "備案地點", color: "#4f7895", icon: "備" },
};
function getTripMapDataUrl() {
  const prefix = location.pathname.includes("/spots/") ? "../" : "";
  return `${prefix}data/map-spots.json?v=dynamic-map2`;
}

function getTripMapFilters(item) {
  const filters = [item.type, item.category, ...(item.tags || [])].filter(Boolean);
  if (item.type === "restaurant") {
    filters.push("restaurant");
  }
  if (item.type === "spot") {
    filters.push("spot");
  }
  return [...new Set(filters)];
}

function shouldShowTripMapItem(item, filters, checked) {
  if (checked.includes("all")) {
    return true;
  }

  return filters.every((filter) => {
    const input = document.querySelector(`[data-map-filter="${filter}"]`);
    return !input || checked.includes(filter);
  });
}
function createTripMapIcon(item) {
  const meta = tripMapCategoryMeta[item.category] || tripMapCategoryMeta[item.type] || tripMapCategoryMeta.sightseeing;
  return L.divIcon({
    className: "trip-map-marker",
    html: `<span style="background:${meta.color}">${meta.icon}</span>`,
    iconSize: [34, 34],
    iconAnchor: [17, 34],
    popupAnchor: [0, -30],
  });
}

function getTripMapTabelogUrl(item) {
  if (item.tabelogUrl) {
    return item.tabelogUrl;
  }

  if (item.type !== "restaurant") {
    return "";
  }

  const query = item.tabelogQuery || item.name;
  return `https://tabelog.com/rstLst/?sw=${encodeURIComponent(query)}`;
}

function getTripMapFoodPageUrl(item) {
  if (item.foodPageUrl) {
    return item.foodPageUrl;
  }

  return item.type === "restaurant" ? "food.html" : "";
}
function createTripMapPopup(item) {
  const meta = tripMapCategoryMeta[item.category] || tripMapCategoryMeta[item.type] || tripMapCategoryMeta.sightseeing;
  const vegetarian = item.vegetarianType ? `<p><strong>素食類型：</strong>${item.vegetarianType}</p>` : "";
  const pageLink = item.pageUrl ? `<a href="${item.pageUrl}">詳情頁</a>` : "";
  const foodPageUrl = getTripMapFoodPageUrl(item);
  const foodLink = foodPageUrl ? `<a href="${foodPageUrl}">美食清單</a>` : "";
  const tabelogUrl = getTripMapTabelogUrl(item);
  const tabelogLink = tabelogUrl ? `<a href="${tabelogUrl}" target="_blank" rel="noreferrer">食べログ</a>` : "";
  const mapLink = item.googleMapUrl ? `<a href="${item.googleMapUrl}" target="_blank" rel="noreferrer">Google Map</a>` : "";
  const actions = [mapLink, tabelogLink, pageLink, foodLink].filter(Boolean).join("");

  return `
    <div class="trip-map-popup">
      <h3>${item.name}</h3>
      <p><strong>分類：</strong>${meta.label}</p>
      <p><strong>地區：</strong>${item.area || "待確認"}</p>
      ${vegetarian}
      <p><strong>推薦原因：</strong>${item.description || "待補"}</p>
      <p><strong>營業時間：</strong>${item.openingHours || "待確認"}</p>
      <p><strong>備註：</strong>${item.notes || "待補"}</p>
      <div class="trip-map-popup__actions">${actions || "<span>詳情待補</span>"}</div>
    </div>
  `;
}
function setTripMapStatus(text) {
  if (tripMapStatus) {
    tripMapStatus.textContent = text;
  }
}

async function initTripMap() {
  if (!tripMapElement || typeof L === "undefined") {
    return;
  }

  try {
    const response = await fetch(getTripMapDataUrl(), { cache: "no-store" });
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }

    const items = await response.json();
    const locatedItems = items.filter((item) => Number.isFinite(item.lat) && Number.isFinite(item.lng));
    const missingItems = items.filter((item) => !Number.isFinite(item.lat) || !Number.isFinite(item.lng));
    const map = L.map(tripMapElement, { scrollWheelZoom: false }).setView([34.395, 132.459], 12);
    const markerLayer = L.layerGroup().addTo(map);
    const markers = locatedItems.map((item) => ({
      item,
      filters: getTripMapFilters(item),
      marker: L.marker([item.lat, item.lng], { icon: createTripMapIcon(item) }).bindPopup(createTripMapPopup(item)),
    }));

    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      maxZoom: 19,
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
    }).addTo(map);

    function updateMarkers() {
      const checked = [...tripMapFilters].filter((input) => input.checked).map((input) => input.dataset.mapFilter);
      markerLayer.clearLayers();
      markers.forEach(({ item, filters, marker }) => {
        if (shouldShowTripMapItem(item, filters, checked)) {
          marker.addTo(markerLayer);
        }
      });
      const visibleCount = markerLayer.getLayers().length;
      setTripMapStatus(`目前顯示 ${visibleCount} 個 marker；${missingItems.length} 筆資料待補座標。`);
    }

    tripMapFilters.forEach((input) => {
      input.addEventListener("change", () => {
        if (input.dataset.mapFilter === "all") {
          tripMapFilters.forEach((filter) => {
            filter.checked = input.checked;
          });
        } else {
          const allFilter = [...tripMapFilters].find((filter) => filter.dataset.mapFilter === "all");
          if (allFilter) {
            allFilter.checked = [...tripMapFilters].filter((filter) => filter.dataset.mapFilter !== "all").every((filter) => filter.checked);
          }
        }
        updateMarkers();
      });
    });

    if (locatedItems.length) {
      const bounds = L.latLngBounds(locatedItems.map((item) => [item.lat, item.lng]));
      map.fitBounds(bounds, { padding: [28, 28] });
    }

    if (tripMapMissingCount) {
      tripMapMissingCount.textContent = `${missingItems.length} 筆`;
    }

    if (tripMapMissingList) {
      tripMapMissingList.innerHTML = missingItems
        .map((item) => `<article><strong>${item.name}</strong><span>${tripMapCategoryMeta[item.category]?.label || item.category}｜${item.area || "地區待補"}</span><a href="${item.googleMapUrl}" target="_blank" rel="noreferrer">Google Map</a></article>`)
        .join("");
    }

    updateMarkers();
  } catch (error) {
    setTripMapStatus("地圖資料暫時讀不到，請重新整理頁面。");
  }
}

initTripMap();

const foodAreas = [
  ["hiroshima-station", "廣島站 / ekie"],
  ["hondori", "紙屋町 / 本通 / 和平公園"],
  ["hatchobori", "八丁堀 / 流川"],
  ["lodging-night", "住宿附近 / 宵夜圈"],
  ["miyajima", "宮島 / 宮島口"],
  ["onomichi", "尾道"],
  ["kure", "吳市"],
  ["saijo", "西條酒藏"],
  ["ujina", "宇品 / 廣島港"],
];

const foodCategories = [
  ["okonomiyaki", "廣島燒"],
  ["oyster", "牡蠣"],
  ["anago", "穴子飯"],
  ["seafood", "海鮮 / 壽司"],
  ["meat", "燒肉 / 牛排"],
  ["ramen", "拉麵 / 麵類"],
  ["cafe", "咖啡 / 甜點"],
  ["izakaya", "居酒屋 / 晚餐"],
  ["late-night", "宵夜"],
  ["sake", "清酒 / 酒藏"],
  ["backup", "多人備案"],
];

const foodItems = [
  {
    name: "炭火焼肉 ごろう 流川店",
    area: "hatchobori",
    categories: ["meat", "izakaya", "late-night"],
    reason: "Tabelog 廣島市燒肉預約人氣前段，流川宵夜圈的大魚大肉首選之一。",
    budget: "約 ¥6,000-8,000",
    group: "適合小組，務必訂位",
    query: "炭火焼肉 ごろう 流川店 広島",
    tabelogQuery: "炭火焼肉 ごろう 流川店",
  },
  {
    name: "広島焼肉 肉屋のぶすけ 紙屋町",
    area: "hondori",
    categories: ["meat", "izakaya"],
    reason: "Tabelog 廣島市燒肉預約人氣前段，紙屋町/本通附近想吃燒肉很方便。",
    budget: "約 ¥5,000-6,000",
    group: "中小組可，建議訂位",
    query: "広島焼肉 肉屋のぶすけ 紙屋町",
    tabelogQuery: "広島焼肉 肉屋のぶすけ紙屋町",
  },
  {
    name: "喰切じろう 袋町店",
    area: "hondori",
    categories: ["meat", "izakaya"],
    reason: "Tabelog 廣島燒肉預約人氣前段，袋町靠近本通，想吃肉刺、燒肉可列入口袋。",
    budget: "約 ¥6,000-8,000",
    group: "中小組可，建議訂位",
    query: "喰切じろう 袋町店 広島",
    tabelogQuery: "喰切じろう 袋町店",
  },
  {
    name: "炭火焼肉と韓国料理の店 きむらや",
    area: "lodging-night",
    categories: ["meat", "late-night"],
    reason: "Tabelog 廣島燒肉預約人氣前段，銀山町/稻荷町動線靠近住宿圈，晚餐後續攤也好接。",
    budget: "約 ¥5,000-6,000",
    group: "中小組可，建議訂位",
    query: "炭火焼肉と韓国料理の店 きむらや 広島",
    tabelogQuery: "炭火焼肉と韓国料理の店 きむらや",
  },
  {
    name: "ステーキ青ひげ",
    area: "hondori",
    categories: ["meat"],
    reason: "Tabelog 廣島市牛排預約人氣前段，本通、原爆圓頂附近想吃廣島牛可看。",
    budget: "約 ¥5,000-6,000",
    group: "中小組可，建議訂位",
    query: "ステーキ青ひげ 広島",
    tabelogQuery: "ステーキ青ひげ",
  },
  {
    name: "ホルモン料理専門處 利根屋",
    area: "lodging-night",
    categories: ["meat", "izakaya", "late-night"],
    reason: "Tabelog 廣島市燒肉/居酒屋排行提到的高評價肉食候選，銀山町附近適合小組深夜吃肉。",
    budget: "約 ¥4,000-7,000",
    group: "小組向，先查營業與座位",
    query: "ホルモン料理専門處 利根屋 広島",
    tabelogQuery: "ホルモン料理専門處 利根屋",
  },
  {
    name: "鮨 稲穂",
    area: "hatchobori",
    categories: ["seafood", "izakaya"],
    reason: "Tabelog 廣島市海鮮午餐排名前段，胡町附近高級壽司，想吃很強的魚類大餐可排小組。",
    budget: "約 ¥10,000-20,000",
    group: "小組向，務必訂位",
    query: "鮨 稲穂 広島",
    tabelogQuery: "鮨 稲穂",
  },
  {
    name: "鮨 まつばら",
    area: "hatchobori",
    categories: ["seafood", "izakaya"],
    reason: "Tabelog 廣島市壽司預約人氣頁面高分候選，適合自由日晚餐小組升級。",
    budget: "約 ¥15,000-20,000",
    group: "小組向，務必訂位",
    query: "鮨 まつばら 広島",
    tabelogQuery: "鮨 まつばら",
  },
  {
    name: "かき傳",
    area: "hiroshima-station",
    categories: ["seafood", "oyster", "anago", "izakaya"],
    reason: "Tabelog 廣島市海鮮午餐排名前段，廣島站附近吃牡蠣、穴子、瀨戶內料理很順。",
    budget: "約 ¥1,000-6,000",
    group: "中小組可，建議訂位",
    query: "かき傳 広島駅",
    tabelogQuery: "かき傳",
  },
  {
    name: "かなわ ekie店",
    area: "hiroshima-station",
    categories: ["seafood", "oyster"],
    reason: "Tabelog 廣島市海鮮午餐排名前段，廣島站內牡蠣料理，搭車前後的大餐保底。",
    budget: "約 ¥2,000-4,000",
    group: "中等，車站尖峰建議分批",
    query: "かなわ ekie店 広島駅",
    tabelogQuery: "かなわ ekie店",
  },
  {
    name: "魚魚一",
    area: "hiroshima-station",
    categories: ["seafood", "izakaya"],
    reason: "Tabelog 廣島市海鮮午餐排名前段，廣島站旁海鮮居酒屋，適合不想離站太遠的晚餐。",
    budget: "約 ¥1,000-5,000",
    group: "中小組可",
    query: "魚魚一 広島駅",
    tabelogQuery: "魚魚一 広島駅",
  },
  {
    name: "柳橋 こだに",
    area: "lodging-night",
    categories: ["seafood", "anago", "izakaya"],
    reason: "Tabelog 廣島市海鮮午餐排名前段，銀山町附近老店，想吃鰻魚、鄉土料理可排自由小組。",
    budget: "約 ¥3,000-6,000",
    group: "中小組可，建議訂位",
    query: "柳橋 こだに 広島",
    tabelogQuery: "柳橋 こだに",
  },
  {
    name: "ねぎ庵 紙屋町店",
    area: "hondori",
    categories: ["okonomiyaki", "izakaya"],
    reason: "Tabelog 廣島廣島燒人氣頁面前段候選，靠近紙屋町，廣島燒加鐵板小菜，晚餐小組好用。",
    budget: "約 ¥3,000-4,000",
    group: "中等，建議訂位或分批",
    query: "ねぎ庵 紙屋町店 広島",
    tabelogQuery: "ねぎ庵 紙屋町店",
  },
  {
    name: "中華そば くにまつ",
    area: "hondori",
    categories: ["ramen", "backup"],
    reason: "Tabelog 廣島市拉麵/汁なし担々麺排名前段，想吃廣島名物麵類很適合。",
    budget: "約 ¥900-1,200",
    group: "適合分批，店面節奏快",
    query: "中華そば くにまつ 広島",
    tabelogQuery: "中華そば くにまつ",
  },
  {
    name: "フルーツカフェ タマル 中の棚店",
    area: "hondori",
    categories: ["cafe", "backup"],
    reason: "Tabelog 本通咖啡甜點排名前段，水果聖代、甜點很適合逛街中途休息。",
    budget: "約 ¥1,000-2,000",
    group: "中小組可，尖峰建議分批",
    query: "フルーツカフェ タマル 中の棚店 広島",
    tabelogQuery: "フルーツカフェ タマル 中の棚店",
    vegFriendly: true,
    vegNote: "水果甜點較友善；冰淇淋、果凍、蛋糕請確認蛋奶、明膠或蜂蜜。",
  },
  {
    name: "くにまつ＋武蔵坊 ekie",
    area: "hiroshima-station",
    categories: ["ramen", "backup"],
    reason: "Tabelog 廣島市汁なし担々麺排名前段，廣島站內就能吃，搭車前後很順。",
    budget: "約 ¥1,000-1,500",
    group: "適合分批，車站尖峰會排隊",
    query: "くにまつ＋武蔵坊 ekie 広島駅",
    tabelogQuery: "くにまつ＋武蔵坊",
  },
  {
    name: "尾道ラーメン 暁",
    area: "hatchobori",
    categories: ["ramen", "late-night"],
    reason: "Tabelog 廣島市拉麵排名前段，八丁堀附近想吃尾道系拉麵可列入口袋。",
    budget: "約 ¥900-1,500",
    group: "適合分批，店面不適合全團塞進去",
    query: "尾道ラーメン 暁 広島 八丁堀",
    tabelogQuery: "尾道ラーメン 暁",
  },
  {
    name: "一麺天に通ず",
    area: "lodging-night",
    categories: ["ramen", "late-night"],
    reason: "Tabelog 藥研堀拉麵排名前段，離住宿圈近，適合晚上想吃一碗熱麵的小組。",
    budget: "約 ¥900-1,500",
    group: "小組分批較好",
    query: "一麺天に通ず 広島 銀山町",
    tabelogQuery: "一麺天に通ず",
  },
  {
    name: "汁なし担担麺センター キング軒 薬研堀出張所",
    area: "lodging-night",
    categories: ["ramen", "late-night"],
    reason: "Tabelog 藥研堀汁なし担々麺排名前段，宵夜圈想吃辣、吃快很實用。",
    budget: "約 ¥900-1,200",
    group: "適合分批，吃完就走型",
    query: "キング軒 薬研堀出張所 広島",
    tabelogQuery: "汁なし担担麺センター キング軒 薬研堀出張所",
  },
  {
    name: "新時代 広島胡町店",
    area: "lodging-night",
    categories: ["late-night", "izakaya", "meat"],
    reason: "胡町站旁連鎖居酒屋，主打傳串雞皮串；多個訂位/餐飲平台顯示晚間營業到 23:00 或更晚，適合 21:30 後補一攤。",
    budget: "約 ¥2,000-3,000",
    group: "中等，適合想便宜喝酒吃串的小組",
    query: "新時代 広島胡町店",
    tabelogQuery: "新時代 広島胡町店",
  },
  {
    name: "串焼酒場 TAKA狄",
    area: "hondori",
    categories: ["late-night", "izakaya", "meat"],
    reason: "狄系串燒店，2026 年重新開幕；Tabelog / ぐるなび顯示營業到 24:00，適合本通、立町附近晚餐後續攤。",
    budget: "約 ¥3,000-5,000",
    group: "中小組可，建議先訂位",
    query: "串焼酒場 TAKA狄 広島",
    tabelogQuery: "串焼酒場 TAKA狄",
  },
  {
    name: "朝日珈琲サロン 胡町店",
    area: "hatchobori",
    categories: ["cafe", "backup"],
    reason: "Tabelog 八丁堀/幟町咖啡喫茶排名前段，住金山町或幟町的人早上集合前可用。",
    budget: "約 ¥800-1,500",
    group: "中小組可",
    query: "朝日珈琲サロン 胡町店 広島",
    tabelogQuery: "朝日珈琲サロン 胡町店",
  },
  {
    name: "交番通り 四十",
    area: "hatchobori",
    categories: ["izakaya"],
    reason: "Tabelog 流川居酒屋預約人氣前段，適合想吃好一點的瀨戶內晚餐與小酌。",
    budget: "約 ¥6,000-8,000",
    group: "適合小組，務必訂位",
    query: "交番通り 四十 広島",
    tabelogQuery: "交番通り 四十",
  },
  {
    name: "居酒屋 かめ福",
    area: "hatchobori",
    categories: ["izakaya", "oyster"],
    reason: "Tabelog 流川居酒屋預約人氣前段，想吃廣島名物與海鮮的小組晚餐可看。",
    budget: "約 ¥4,000-5,000",
    group: "中小組可，建議訂位",
    query: "居酒屋 かめ福 広島",
    tabelogQuery: "居酒屋 かめ福",
  },
  {
    name: "岩村もみじ屋",
    area: "miyajima",
    categories: ["cafe", "backup"],
    reason: "Tabelog 宮島美食排名前段，老字號もみじ饅頭，宮島散步時可當甜點補給。",
    budget: "約 ¥200-1,000",
    group: "適合多人分散買",
    query: "岩村もみじ屋 宮島",
    tabelogQuery: "岩村もみじ屋",
    vegFriendly: true,
    vegNote: "和菓子仍請確認是否含蛋、蜂蜜、明膠或動物性油脂。",
  },
  {
    name: "呉 ハイカラ食堂",
    area: "kure",
    categories: ["backup", "cafe"],
    reason: "Tabelog 呉午餐咖哩/食堂排名前段，吳市大和博物館、鐵鯨館行程後很順。",
    budget: "約 ¥1,000-2,000",
    group: "中等，尖峰建議分批",
    query: "呉 ハイカラ食堂",
    tabelogQuery: "呉 ハイカラ食堂",
  },
  {
    name: "Seaside Cafe BEACON",
    area: "kure",
    categories: ["cafe", "backup"],
    reason: "Tabelog 呉午餐咖哩候選前段，港邊咖啡與海軍咖哩，適合吳市半日休息。",
    budget: "約 ¥1,000-2,000",
    group: "中等",
    query: "Seaside Cafe BEACON Kure",
    tabelogQuery: "Seaside Cafe BEACON",
  },
  {
    name: "あじと",
    area: "saijo",
    categories: ["okonomiyaki", "backup"],
    reason: "Tabelog 東廣島/西條美食排名前段且入選廣島燒百名店，西條日想吃在地廣島燒可看。",
    budget: "約 ¥1,000-2,000",
    group: "中等，建議分批",
    query: "あじと 西条 お好み焼き",
    tabelogQuery: "あじと 西条 お好み焼き",
  },
  {
    name: "お好み焼 SETO",
    area: "saijo",
    categories: ["okonomiyaki", "backup"],
    reason: "Tabelog 東廣島/西條美食前段，廣島燒百名店候選，酒藏散步後可排自由晚餐。",
    budget: "約 ¥1,000-2,000",
    group: "中等，建議分批",
    query: "お好み焼 SETO 西条",
    tabelogQuery: "お好み焼 SETO",
  },
  {
    name: "お好み焼 長田屋 NAGATA-YA",
    area: "hondori",
    categories: ["okonomiyaki", "backup"],
    reason: "靠近原爆圓頂與和平公園，抵達日或市區半日後很順。",
    budget: "約 ¥1,500-2,500",
    group: "中等，尖峰需排隊",
    query: "Okonomiyaki Nagataya Hiroshima",
  },
  {
    name: "お好み村 Okonomimura",
    area: "hatchobori",
    categories: ["okonomiyaki", "late-night", "backup"],
    reason: "整棟都是廣島燒店，大家意見分歧時很適合現場分散選；各店營業時間不同，部分可到 23:00 左右或更晚。",
    budget: "約 ¥1,500-2,500",
    group: "適合分組，不適合全團擠同一家",
    query: "Okonomimura Hiroshima",
  },
  {
    name: "みっちゃん総本店 ekie 店",
    area: "hiroshima-station",
    categories: ["okonomiyaki", "backup"],
    reason: "在廣島站 ekie，適合搭車前後或有人不想走遠時。",
    budget: "約 ¥1,500-2,800",
    group: "中等，車站店尖峰可能排隊",
    query: "Micchan Sohonten ekie Hiroshima",
  },
  {
    name: "麗ちゃん",
    area: "hiroshima-station",
    categories: ["okonomiyaki"],
    reason: "廣島站周邊經典廣島燒候選，適合第一餐或回程前。",
    budget: "約 ¥1,500-2,500",
    group: "中等，建議避開用餐尖峰",
    query: "Reichan Hiroshima okonomiyaki",
  },
  {
    name: "八昌 薬研堀",
    area: "hatchobori",
    categories: ["okonomiyaki", "izakaya"],
    reason: "流川、藥研堀一帶名店候選，適合晚上小組吃。",
    budget: "約 ¥1,500-3,000",
    group: "偏難，排隊與座位要有心理準備",
    query: "Hassho Yagenbori Hiroshima",
  },
  {
    name: "焼がきのはやし",
    area: "miyajima",
    categories: ["oyster"],
    reason: "宮島表參道上的牡蠣名店，宮島日午餐很直覺。",
    budget: "約 ¥2,000-4,500",
    group: "中等，容易排隊",
    query: "Yakigaki no Hayashi Miyajima",
  },
  {
    name: "牡蠣屋 Kakiya",
    area: "miyajima",
    categories: ["oyster", "izakaya"],
    reason: "宮島牡蠣專門店，想吃牡蠣定食或小酌可列入。",
    budget: "約 ¥2,000-5,000",
    group: "中等",
    query: "Kakiya Miyajima",
  },
  {
    name: "あなごめし うえの",
    area: "miyajima",
    categories: ["anago"],
    reason: "宮島口知名穴子飯，適合搭船前後，但排隊機率高。",
    budget: "約 ¥2,500-4,000",
    group: "偏難，建議分組或外帶",
    query: "Anagomeshi Ueno Miyajimaguchi",
  },
  {
    name: "くらわんか Kurawanka",
    area: "miyajima",
    categories: ["okonomiyaki", "oyster"],
    reason: "宮島上的廣島燒候選，想在島上吃鐵板類可看。",
    budget: "約 ¥1,500-3,000",
    group: "中等，尖峰請多抓時間",
    query: "Kurawanka Miyajima okonomiyaki",
    vegFriendly: true,
    vegNote: "有 vegan/vegetarian 資訊可參考；仍請確認醬汁、高湯不含柴魚或魚介。",
  },
  {
    name: "紅葉堂 / 紅葉饅頭周邊店",
    area: "miyajima",
    categories: ["cafe", "backup"],
    reason: "宮島甜點與伴手禮補給，適合大家分散買完再集合。",
    budget: "約 ¥300-1,000",
    group: "適合多人分散買",
    query: "Momijido Miyajima",
    vegFriendly: true,
    vegNote: "甜點類較有機會蛋奶素；購買前仍需確認是否含動物性油脂或明膠。",
  },
  {
    name: "牡蠣船 かなわ",
    area: "hondori",
    categories: ["oyster", "izakaya"],
    reason: "市區想正式吃牡蠣料理時的候選，適合晚餐。",
    budget: "約 ¥3,000-7,000",
    group: "適合，建議訂位",
    query: "Kanawa Hiroshima oyster boat",
  },
  {
    name: "瀨戶內料理 雑草庵",
    area: "hatchobori",
    categories: ["izakaya", "oyster"],
    reason: "想吃瀨戶內料理、海鮮與小酌，可排自由日晚餐。",
    budget: "約 ¥4,000-7,000",
    group: "適合，建議訂位",
    query: "Zassoan Hiroshima",
  },
  {
    name: "Airbnb 幟町周邊便利商店",
    area: "lodging-night",
    categories: ["late-night", "backup"],
    reason: "9-4 Noboricho 住宿附近的最穩宵夜補給，回房前買水、飯糰、泡麵最不翻車。",
    budget: "約 ¥300-1,200",
    group: "適合多人分散買",
    query: "convenience store near 9-4 Noboricho Hiroshima",
  },
  {
    name: "Quintessa Hotel 金山町周邊便利商店",
    area: "lodging-night",
    categories: ["late-night", "backup"],
    reason: "住 Quintessa Hotel Hiroshima 的那組，晚上回飯店前可先補水、早餐、宵夜。",
    budget: "約 ¥300-1,200",
    group: "適合多人分散買",
    query: "convenience store near Quintessa Hotel Hiroshima Kanayamacho",
  },
  {
    name: "流川 / 藥研堀居酒屋宵夜區",
    area: "lodging-night",
    categories: ["late-night", "izakaya"],
    reason: "兩邊住宿都能銜接的晚餐後區域，想續攤、小酌、吃串燒可往這一帶找。",
    budget: "約 ¥2,500-5,000",
    group: "適合小組，全團建議先訂位",
    query: "izakaya Nagarekawa Yagenbori Hiroshima",
  },
  {
    name: "銀山町 / 胡町拉麵宵夜",
    area: "lodging-night",
    categories: ["late-night", "ramen"],
    reason: "兩個住宿點中間偏南的宵夜麵類搜尋區，不想喝酒只想吃熱的就看這個。",
    budget: "約 ¥900-1,500",
    group: "適合分批，店面通常不適合大團",
    query: "ramen near Kanayamacho Ebisucho Hiroshima",
  },
  {
    name: "松屋 / すき家 金山町周邊",
    area: "lodging-night",
    categories: ["late-night", "backup"],
    reason: "如果大家玩到很晚、餐廳都收了，牛丼連鎖店是最現實的保底選項。",
    budget: "約 ¥600-1,200",
    group: "適合分批，速度快",
    query: "Matsuya Sukiya near Kanayamacho Hiroshima",
  },
  {
    name: "八丁堀 / 胡町咖啡與甜點備案",
    area: "lodging-night",
    categories: ["late-night", "cafe", "backup"],
    reason: "不想吃正餐，只想買甜點、飲料或找地方坐一下，可以往八丁堀與胡町搜尋。",
    budget: "約 ¥600-1,500",
    group: "依座位狀況，適合小組",
    query: "cafe dessert near Hatchobori Ebisucho Hiroshima",
  },
  {
    name: "廣島沾麵 Bakudanya",
    area: "hondori",
    categories: ["ramen", "backup"],
    reason: "不想吃正餐太久時的快速麵類候選，辣度可調。",
    budget: "約 ¥900-1,500",
    group: "中等，適合分批",
    query: "Bakudanya Hiroshima tsukemen",
  },
  {
    name: "汁なし担担麺 武蔵坊",
    area: "hondori",
    categories: ["ramen", "backup"],
    reason: "廣島市區常見的汁なし担担麵，想快速吃辣可選。",
    budget: "約 ¥900-1,500",
    group: "中等，適合分批",
    query: "Musashibo Hiroshima tantanmen",
  },
  {
    name: "OBSCURA Coffee Roasters Hiroshima",
    area: "hondori",
    categories: ["cafe", "backup"],
    reason: "市區咖啡休息點，適合等人、避暑或雨天切換節奏。",
    budget: "約 ¥600-1,500",
    group: "依座位狀況，適合小組",
    query: "Obscura Coffee Roasters Hiroshima",
    vegFriendly: true,
    vegNote: "咖啡飲品較友善；甜點若要蛋奶素需確認是否含明膠或魚膠。",
  },
  {
    name: "尾道ラーメン 壱番館",
    area: "onomichi",
    categories: ["ramen"],
    reason: "尾道自由日拉麵候選，想吃尾道拉麵可先看這間。",
    budget: "約 ¥900-1,500",
    group: "偏難，建議分批",
    query: "Onomichi Ramen Ichibankan",
  },
  {
    name: "尾道ラーメン たに",
    area: "onomichi",
    categories: ["ramen"],
    reason: "尾道站周邊拉麵候選，適合不想走太遠的人。",
    budget: "約 ¥900-1,500",
    group: "中等，尖峰需排隊",
    query: "Onomichi Ramen Tani",
  },
  {
    name: "ONOMICHI U2 Yard Cafe",
    area: "onomichi",
    categories: ["cafe", "backup"],
    reason: "尾道海邊休息點，適合走累、太熱或等回程。",
    budget: "約 ¥800-2,000",
    group: "中等，適合小組休息",
    query: "ONOMICHI U2 Yard Cafe",
    vegFriendly: true,
    vegNote: "咖啡、麵包甜點可能可處理；餐點請確認不含肉、魚介高湯。",
  },
  {
    name: "からさわ Karasawa",
    area: "onomichi",
    categories: ["cafe"],
    reason: "尾道甜點冰品候選，適合坡道散步後補一站。",
    budget: "約 ¥400-1,000",
    group: "適合分散買",
    query: "Karasawa ice cream Onomichi",
    vegFriendly: true,
    vegNote: "冰品甜點較有蛋奶素機會；請確認是否含明膠或其他動物性成分。",
  },
  {
    name: "海軍さんの麦酒舘",
    area: "kure",
    categories: ["izakaya", "backup"],
    reason: "吳市港邊與博物館行程後的晚餐/啤酒候選。",
    budget: "約 ¥1,500-4,000",
    group: "中等，建議先確認營業",
    query: "Kaigunsan no Bakushukan Kure",
  },
  {
    name: "吳海自咖哩周邊店",
    area: "kure",
    categories: ["backup", "izakaya"],
    reason: "吳市特色是海自咖哩，可依博物館附近現場選店。",
    budget: "約 ¥1,000-2,000",
    group: "依店家，適合分組",
    query: "Kure Kaiji Curry",
  },
  {
    name: "くぐり門珈琲店",
    area: "saijo",
    categories: ["cafe", "sake", "backup"],
    reason: "西條酒藏街休息點，咖啡與伴手禮都方便。",
    budget: "約 ¥600-1,500",
    group: "中等，適合小組",
    query: "Kugurimon Coffee Saijo Hiroshima",
    vegFriendly: true,
    vegNote: "咖啡與部分輕食較友善；餐點請確認是否使用魚介高湯。",
  },
  {
    name: "賀茂鶴酒造",
    area: "saijo",
    categories: ["sake"],
    reason: "西條清酒代表之一，適合酒藏街散步與試飲。",
    budget: "試飲與購物依現場",
    group: "適合小組，喝酒請注意回程",
    query: "Kamotsuru Sake Brewery Saijo Hiroshima",
  },
  {
    name: "佛蘭西屋",
    area: "saijo",
    categories: ["sake", "izakaya"],
    reason: "西條酒藏街用餐候選，想把清酒與餐一起排可看。",
    budget: "約 ¥2,000-5,000",
    group: "中等，建議先確認座位",
    query: "Buranseya Saijo Hiroshima",
  },
  {
    name: "宇品港周邊簡餐 / 便利商店",
    area: "ujina",
    categories: ["backup"],
    reason: "花火日不要幻想慢慢找餐廳，先買水、飯糰、簡單食物最穩。",
    budget: "約 ¥500-1,500",
    group: "適合多人快速補給",
    query: "Hiroshima Port Ujina convenience store",
  },
  {
    name: "廣島港周邊咖啡備案",
    area: "ujina",
    categories: ["cafe", "backup"],
    reason: "花火集合太早或太熱時，用來短暫休息與等人。",
    budget: "約 ¥600-1,500",
    group: "依座位狀況",
    query: "cafe Hiroshima Port Ujina",
  },
  {
    name: "NICE COFFEE STAND",
    area: "hatchobori",
    categories: ["cafe", "backup"],
    reason: "富士見町 15-17 的咖啡店，離住宿圈不遠，適合早上咖啡、甜點或自由日休息。",
    budget: "每人約 ¥400-1,500",
    group: "小團可，店面偏小建議分批或外帶",
    query: "NICE COFFEE STAND Hiroshima Fujimicho 15-17",
    tabelogQuery: "NICE COFFEE STAND",
    vegFriendly: true,
    vegNote: "咖啡飲品相對安全；甜點、可頌、烘焙品請確認奶油、明膠、蜂蜜與蛋奶成分。",
  },
];

const vegAreas = [
  ["hondori", "紙屋町 / 本通 / 和平公園"],
  ["hatchobori", "八丁堀 / 流川 / 住宿附近"],
  ["hiroshima-station", "廣島站"],
  ["miyajima", "宮島 / 宮島口"],
  ["onomichi", "尾道"],
  ["saijo", "西條"],
];

const vegCategories = [
  ["vegan", "純素"],
  ["ovo-lacto", "蛋奶素可確認"],
  ["japanese", "日式 / 廣島特色"],
  ["cafe", "咖啡 / 甜點"],
  ["backup", "便利店 / 保底"],
];

const vegItems = [
  {
    name: "JoGeSaYu",
    area: "hondori",
    categories: ["vegan", "japanese"],
    reason: "廣島市中心純素餐廳，Food Diversity 介紹為全菜單純素，適合需要最安心的一餐。",
    budget: "約 ¥2,000-5,000",
    group: "適合，建議先訂位",
    query: "JoGeSaYu Hiroshima vegan",
    vegCheck: "純素取向，但仍請出發前確認營業、預約與菜單。",
  },
  {
    name: "Keiai Vegan & Vegetarian Chinese Food",
    area: "hatchobori",
    categories: ["vegan", "ovo-lacto"],
    reason: "廣島市區素食中華料理候選，對台灣素食者比較好溝通。",
    budget: "約 ¥1,500-3,500",
    group: "中等，建議先確認營業",
    query: "Keiai Vegan Vegetarian Chinese Food Hiroshima",
    vegCheck: "點餐仍要確認不含魚介、柴魚、雞湯、豬油。",
  },
  {
    name: "Kissa Saeki",
    area: "hondori",
    categories: ["vegan", "cafe", "ovo-lacto"],
    reason: "PDF 收錄的廣島市區有機咖啡餐食店，近期旅遊資料仍列營業，離紙屋町、本通動線近。",
    budget: "約 ¥1,000-2,500",
    group: "中小團可，尖峰時間建議分批",
    query: "Kissa Saeki Hiroshima",
    vegCheck: "有 vegan 菜色與甜點資訊；仍請現場確認飯、醬汁、炸油不含魚介或動物性成分。",
  },
  {
    name: "菜食健美 Saishoku Kenbi",
    area: "hondori",
    categories: ["vegan", "ovo-lacto", "japanese"],
    reason: "Get Hiroshima 收錄的 vegetarian diner，適合想找市區素食正餐。",
    budget: "約 ¥1,000-2,500",
    group: "中等，建議先確認是否仍營業與座位",
    query: "Saishoku Kenbi Hiroshima vegetarian",
    vegCheck: "請以台灣蛋奶素標準確認高湯、醬汁、調味料。",
  },
  {
    name: "Taiko Udon Nakamachi",
    area: "hatchobori",
    categories: ["vegan", "japanese"],
    reason: "PDF 收錄的市區 vegan 烏龍麵候選，近期平台仍列營業，適合想吃日式熱食的人。",
    budget: "約 ¥1,000-2,500",
    group: "中小團可，晚餐時段建議先查排隊",
    query: "Taiko Udon Nakamachi Hiroshima vegan",
    vegCheck: "務必指定 vegan dashi；天婦羅、炸油與配料要再確認。",
  },
  {
    name: "Jirokichi Vegan Okonomiyaki",
    area: "hatchobori",
    categories: ["vegan", "japanese"],
    reason: "PDF 收錄的 vegan 廣島燒候選，近期旅遊資料仍顯示營業，適合想補一間素食廣島燒。",
    budget: "約 ¥1,500-3,000",
    group: "中小團可，大團請分批或先確認座位",
    query: "Jirokichi Hiroshima vegan okonomiyaki",
    vegCheck: "同鐵板可能料理肉類；若嚴格素食，請確認是否可分開處理。",
  },
  {
    name: "Chinchikurin Nagarekawa Vegan Okonomiyaki",
    area: "hatchobori",
    categories: ["vegan", "japanese"],
    reason: "PDF 收錄且近期訂位/旅遊平台仍列營業，流川晚餐與宵夜動線很方便。",
    budget: "約 ¥1,500-3,500",
    group: "多人可，但晚餐尖峰建議訂位或分批",
    query: "Chinchikurin Nagarekawa Hiroshima vegan okonomiyaki",
    vegCheck: "點 vegan option；同店有肉類與海鮮，醬汁、麵、鐵板接觸要現場確認。",
  },
  {
    name: "山一別館 Vegan / Vegetarian Meal",
    area: "miyajima",
    categories: ["vegan", "japanese"],
    reason: "宮島官方旅館餐食有 vegetarian/vegan 說明，適合宮島日需要安心餐的人。",
    budget: "依套餐與預約",
    group: "適合小組，務必事前預約",
    query: "Yamaichi Bekkan Miyajima vegetarian vegan",
    vegCheck: "旅館餐建議預約時明確寫 no fish, no bonito dashi, no seafood stock。",
  },
  {
    name: "Akushu Restaurant",
    area: "miyajima",
    categories: ["vegan", "japanese"],
    reason: "宮島 vegetarian guide 提到有 vegan options，靠近表參道動線。",
    budget: "約 ¥2,000-5,000",
    group: "中等，建議先確認菜單",
    query: "Akushu Restaurant Miyajima vegan",
    vegCheck: "請確認 vegan option 當日供應，且不含魚介高湯。",
  },
  {
    name: "Miyajima Cuillere Vegan Menu",
    area: "miyajima",
    categories: ["vegan", "japanese"],
    reason: "宮島 Bistro 有 vegan menu 頁面，適合想在宮島吃比較正式的一餐。",
    budget: "約 ¥2,000-5,000",
    group: "中等，建議先訂位",
    query: "Miyajima Cuillere vegan menu",
    vegCheck: "以 vegan menu 為準，仍請確認當日供應與訂位。",
  },
  {
    name: "Kurawanka Vegan Okonomiyaki",
    area: "miyajima",
    categories: ["vegan", "japanese"],
    reason: "宮島 vegetarian guide 收錄的廣島燒候選，想讓素食者也吃到地方感可看。",
    budget: "約 ¥1,500-3,000",
    group: "中等，尖峰需排隊",
    query: "Kurawanka Miyajima vegan okonomiyaki",
    vegCheck: "務必指定 vegan/vegetarian，不要一般廣島燒醬汁與柴魚高湯。",
  },
  {
    name: "MOMIJI-SO",
    area: "miyajima",
    categories: ["vegan", "japanese", "cafe"],
    reason: "PDF 與宮島素食指南都有提到的紅葉谷周邊候選，適合宮島日午餐或休息。",
    budget: "約 ¥1,500-3,000",
    group: "中小團可，宮島旺季建議提早到",
    query: "MOMIJI-SO Miyajima vegan udon",
    vegCheck: "菜單有 vegan 標示資訊，但烏龍麵、咖哩、炸物仍要確認當日供應與魚介高湯。",
  },
  {
    name: "Organic Matcha Miyajima",
    area: "miyajima",
    categories: ["cafe", "ovo-lacto"],
    reason: "宮島口抹茶咖啡甜點候選，適合素食者補甜點或飲料。",
    budget: "約 ¥500-1,500",
    group: "適合分散買",
    query: "Organic Matcha Miyajima",
    vegCheck: "飲品較安全；甜點請確認是否含明膠、魚膠或動物性油脂。",
  },
  {
    name: "KOMEDOKO SHOKUDO",
    area: "onomichi",
    categories: ["vegan", "japanese"],
    reason: "PDF 收錄的尾道 vegan 正餐候選，近期 Get Hiroshima 仍介紹午晚餐 vegan 菜色。",
    budget: "約 ¥1,500-3,500",
    group: "中小團可，尾道自由日建議先查當日營業",
    query: "Komedoko Shokudo Onomichi vegan",
    vegCheck: "請確認 vegan 菜色當日供應；醬汁、高湯不要含魚介或柴魚。",
  },
  {
    name: "KOFUKU Vegan Okonomiyaki",
    area: "onomichi",
    categories: ["vegan", "japanese"],
    reason: "PDF 收錄的尾道站附近 vegan 廣島燒候選，近期評論平台仍有 vegan 評價。",
    budget: "約 ¥1,500-3,000",
    group: "小團較適合，多人請分批",
    query: "KOFUKU Onomichi vegan okonomiyaki",
    vegCheck: "請指定 vegan；仍要確認醬汁、麵、鐵板是否符合嚴格素食需求。",
  },
  {
    name: "ONOMICHI U2 Cafe / Bakery",
    area: "onomichi",
    categories: ["cafe", "ovo-lacto"],
    reason: "尾道自由日時的咖啡與輕食保底點，素食者可先從飲品、麵包甜點確認。",
    budget: "約 ¥800-2,000",
    group: "中等，適合小組",
    query: "ONOMICHI U2 vegan vegetarian cafe",
    vegCheck: "不是純素店，請確認是否含動物性油脂、明膠、肉魚高湯。",
  },
  {
    name: "FRANCE-YA",
    area: "saijo",
    categories: ["vegan", "japanese"],
    reason: "PDF 收錄的西條酒藏通日式餐食候選，近期東廣島觀光資料仍列為飲食店。",
    budget: "約 ¥2,000-5,000",
    group: "中小團可，建議先預約並說明素食條件",
    query: "FRANCE-YA Saijo Higashihiroshima vegan",
    vegCheck: "酒藏料理一般常有魚介高湯；請預約時明確說 no fish, no bonito dashi, no seafood stock。",
  },
  {
    name: "くぐり門珈琲店",
    area: "saijo",
    categories: ["cafe", "ovo-lacto"],
    reason: "西條酒藏街咖啡休息點，若正餐難找，先用咖啡與甜點當緩衝。",
    budget: "約 ¥600-1,500",
    group: "中等，適合小組",
    query: "Kugurimon Coffee Saijo vegetarian",
    vegCheck: "不是純素店；餐點請確認高湯、醬汁、甜點成分。",
  },
  {
    name: "便利商店素食保底",
    area: "hiroshima-station",
    categories: ["backup"],
    reason: "車站與住宿附近都可用，適合買白飯、鹽味飯糰、沙拉、堅果、水果。",
    budget: "約 ¥300-1,200",
    group: "適合多人分散買",
    query: "convenience store Hiroshima Station",
    vegCheck: "避開看起來素但含魚介/柴魚的飯糰、湯品、醬料；成分看不懂就不要賭。",
  },
];

function createFoodCard(item, areaGroups = foodAreas, categoryGroups = foodCategories) {
  const areaLabel = areaGroups.find(([key]) => key === item.area)?.[1] || item.area;
  const categoryLabels = item.categories
    .map((category) => categoryGroups.find(([key]) => key === category)?.[1] || category)
    .join(" / ");
  const mapUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(item.query)}`;
  const tabelogQuery = item.tabelogQuery || item.query || item.name;
  const tabelogUrl = `https://tabelog.com/rstLst/?sw=${encodeURIComponent(tabelogQuery)}`;
  const badges = [
    item.vegFriendly ? '<span class="food-badge food-badge--veg">素食友善</span>' : "",
    item.vegCheck ? '<span class="food-badge food-badge--veg">台灣蛋奶素檢查</span>' : "",
  ].join("");
  const vegNote = item.vegNote || item.vegCheck;
  const article = document.createElement("article");
  article.className = "food-card";
  article.innerHTML = `
    <div class="food-card__badges"><span class="food-card__area">${areaLabel}</span>${badges}</div>
    <h3>${item.name}</h3>
    <p>${item.reason}</p>
    <dl>
      <div><dt>類型</dt><dd>${categoryLabels}</dd></div>
      <div><dt>預算</dt><dd>${item.budget}</dd></div>
      <div><dt>多人</dt><dd>${item.group}</dd></div>
    </dl>
    ${vegNote ? `<p class="veg-note">素食提醒：${vegNote}</p>` : ""}
    <div class="food-card__actions">
      <a href="${mapUrl}" target="_blank" rel="noreferrer">Google Map</a>
      <a href="${tabelogUrl}" target="_blank" rel="noreferrer">食べログ</a>
    </div>
  `;
  return article;
}

function renderFoodSections(container, groups, getItems, areaGroups = foodAreas, categoryGroups = foodCategories) {
  if (!container) {
    return;
  }

  container.innerHTML = "";
  groups.forEach(([key, label], index) => {
    const items = getItems(key);
    if (!items.length) {
      return;
    }

    const section = document.createElement("details");
    section.className = "drawer food-section";
    section.innerHTML = `
      <summary>
        <span>${items.length} 個候選</span>
        <strong>${label}</strong>
      </summary>
      <div class="food-grid"></div>
    `;
    const grid = section.querySelector(".food-grid");
    items.forEach((item) => grid.append(createFoodCard(item, areaGroups, categoryGroups)));
    container.append(section);
  });
}

const meatAreaContainer = document.querySelector("[data-meat-areas]");
const meatCategoryContainer = document.querySelector("[data-meat-categories]");
const cafeAreaContainer = document.querySelector("[data-cafe-areas]");
const cafeCategoryContainer = document.querySelector("[data-cafe-categories]");
const vegAreaContainer = document.querySelector("[data-veg-areas]");
const vegCategoryContainer = document.querySelector("[data-veg-categories]");
const foodTabButtons = document.querySelectorAll("[data-food-tab]");
const foodPanels = document.querySelectorAll("[data-food-panel]");
const foodModeButtons = document.querySelectorAll("[data-food-view]");
const foodModes = document.querySelectorAll("[data-food-mode]");

if (meatAreaContainer || meatCategoryContainer || cafeAreaContainer || cafeCategoryContainer || vegAreaContainer || vegCategoryContainer) {
  const cafeItems = foodItems.filter((item) => item.categories.includes("cafe"));
  const meatItems = foodItems.filter((item) => !item.categories.includes("cafe"));

  renderFoodSections(meatAreaContainer, foodAreas, (area) => meatItems.filter((item) => item.area === area));
  renderFoodSections(meatCategoryContainer, foodCategories, (category) => meatItems.filter((item) => item.categories.includes(category)));
  renderFoodSections(cafeAreaContainer, foodAreas, (area) => cafeItems.filter((item) => item.area === area));
  renderFoodSections(cafeCategoryContainer, foodCategories, (category) => cafeItems.filter((item) => item.categories.includes(category)));
  renderFoodSections(vegAreaContainer, vegAreas, (area) => vegItems.filter((item) => item.area === area), vegAreas, vegCategories);
  renderFoodSections(vegCategoryContainer, vegCategories, (category) => vegItems.filter((item) => item.categories.includes(category)), vegAreas, vegCategories);

  foodTabButtons.forEach((button) => {
    button.addEventListener("click", () => {
      const tab = button.dataset.foodTab;

      foodTabButtons.forEach((item) => {
        item.classList.toggle("is-active", item === button);
      });
      foodPanels.forEach((panel) => {
        panel.classList.toggle("is-hidden", panel.dataset.foodPanel !== tab);
      });
    });
  });

  foodModeButtons.forEach((button) => {
    button.addEventListener("click", () => {
      const view = button.dataset.foodView;
      const switchGroup = button.closest(".view-switch");
      const viewGroup = view.split("-")[0];
      const relatedModes = [...foodModes].filter((mode) => mode.dataset.foodMode.startsWith(`${viewGroup}-`));

      switchGroup.querySelectorAll("[data-food-view]").forEach((item) => {
        item.classList.toggle("is-active", item === button);
      });
      relatedModes.forEach((mode) => {
        mode.classList.toggle("is-hidden", mode.dataset.foodMode !== view);
      });
    });
  });
}

const checklist = document.querySelector("[data-checklist]");
if (checklist) {
  const checkboxes = checklist.querySelectorAll("input[type='checkbox']");
  checkboxes.forEach((box, index) => {
    const key = `hiroshima-check-${index}`;
    box.checked = localStorage.getItem(key) === "1";
    box.addEventListener("change", () => {
      localStorage.setItem(key, box.checked ? "1" : "0");
    });
  });
}

const budgetDefaults = [
  ["機票", 13000],
  ["住宿", 18000],
  ["JR / 市區交通", 6500],
  ["門票 / 纜車", 3500],
  ["餐費", 18000],
  ["購物", 10000],
];

const budgetTable = document.querySelector("[data-budget-table]");
const budgetPeople = document.querySelector("[data-budget-people]");

function renderBudget() {
  if (!budgetTable || !budgetPeople) {
    return;
  }

  const people = Math.max(1, Number(budgetPeople.value || 1));
  const rows = [...budgetDefaults, ["總計", budgetDefaults.reduce((sum, [, amount]) => sum + amount, 0)]];
  budgetTable.innerHTML = "";

  rows.forEach(([label, amount]) => {
    const row = document.createElement("article");
    row.className = "budget-row";
    row.innerHTML = `<strong>${label}</strong><span>每人：約 ¥${amount.toLocaleString("ja-JP")}</span><span>團體：約 ¥${(amount * people).toLocaleString("ja-JP")}</span>`;
    budgetTable.append(row);
  });
}

if (budgetTable && budgetPeople) {
  budgetPeople.addEventListener("input", renderBudget);
  renderBudget();
}

const spotMeta = {
  "itsukushima.html": {
    tags: ["必去", "戶外", "拍照", "半日", "一日"],
    hours: "神社區域依官方公告為準",
    closed: "請出發前再次確認官方網站",
    note: "潮汐會影響拍攝效果。",
    tide: true,
    liveInfo: ["miyajima", "ferry", "weather", "sunset"],
    image: "../assets/spot-heroes/miyajima.svg",
  },
  "otorii.html": {
    tags: ["必去", "戶外", "拍照"],
    hours: "戶外景觀，依潮汐與安全狀況",
    closed: "請出發前再次確認官方網站",
    note: "滿潮與退潮拍法不同。",
    tide: true,
    liveInfo: ["miyajima", "ferry", "weather", "sunset"],
    image: "../assets/spot-heroes/miyajima.svg",
  },
  "peace-memorial.html": { tags: ["必去", "室內", "雨天備案", "半日"], hours: "資料館依官方公告", closed: "請出發前再次確認官方網站", note: "內容沉重，請保留休息時間。", liveInfo: ["peaceMuseum", "weather"], image: "../assets/spot-heroes/peace.svg" },
  "shukkeien.html": { tags: ["可去", "戶外", "拍照", "半日"], hours: "請出發前再次確認官方網站", closed: "請出發前再次確認官方網站", note: "夏天午後注意補水。", liveInfo: ["shukkeien", "weather"], image: "../assets/spot-heroes/garden.svg" },
  "onomichi.html": { tags: ["可去", "戶外", "拍照", "美食", "一日"], hours: "街區戶外為主，店家各自不同", closed: "請出發前再次確認官方網站", note: "坡道多，穿好走的鞋。", liveInfo: ["jrWest", "onomichiRopeway", "weather", "sunset"], image: "../assets/spot-heroes/onomichi.svg" },
  "kure.html": { tags: ["可去", "雨天備案", "室內", "半日"], hours: "博物館依官方公告", closed: "請出發前再次確認官方網站", note: "適合下雨或酷暑備案。", liveInfo: ["jrWest", "yamatoMuseum", "weather"], image: "../assets/spot-heroes/kure.svg" },
  "kintaikyo.html": { tags: ["可去", "戶外", "拍照", "半日"], hours: "橋梁區域依官方公告", closed: "請出發前再次確認官方網站", note: "最後一天請不要太晚回廣島。", liveInfo: ["jrWest", "kintaikyo", "iwakuniRopeway", "sunset"], image: "../assets/spot-heroes/bridge.svg" },
  "simose.html": { tags: ["可去", "室內", "戶外", "拍照", "半日"], hours: "9:30-17:00（入館至 16:30）", closed: "週一休館；祝休日則開館，年末年始與展示替換期間另看官方", note: "7/26 是週日，可搭官方土日祝接駁車；滿車風險要留緩衝。", liveInfo: ["jrWest", "simoseMuseum", "weather"], image: "../assets/spot-heroes/simose.svg" },
  "saijo.html": { tags: ["可去", "美食", "購物", "半日"], hours: "酒藏與店家各自不同", closed: "請出發前再次確認官方網站", note: "試飲請注意回程交通與身體狀況。", liveInfo: ["jrWest", "saijoSake"], image: "../assets/spot-heroes/sake.svg" },
  "hondori.html": { tags: ["可去", "雨天備案", "購物", "美食"], hours: "商店各自不同", closed: "請出發前再次確認官方網站", note: "最適合當集合點與休息點。", liveInfo: ["weather"], image: "../assets/spot-heroes/city.svg" },
  "omotesando.html": { tags: ["可去", "美食", "購物", "半日"], hours: "店家各自不同", closed: "請出發前再次確認官方網站", note: "午餐尖峰容易排隊。", liveInfo: ["miyajima", "ferry", "weather"], image: "../assets/spot-heroes/food.svg" },
  "daishoin.html": { tags: ["可去", "戶外", "拍照", "半日"], hours: "請出發前再次確認官方網站", closed: "請出發前再次確認官方網站", note: "有階梯與上坡。", liveInfo: ["miyajima", "ferry", "weather"], image: "../assets/spot-heroes/temple.svg" },
  "misen-ropeway.html": { tags: ["可去", "戶外", "拍照", "半日"], hours: "纜車依官方公告與天候", closed: "天候不佳可能停駛，請出發前確認", note: "纜車後仍需步行。", liveInfo: ["miyajima", "ferry", "ropeway", "weather", "sunset"], image: "../assets/spot-heroes/mountain.svg" },
  "hiroshima-castle.html": { tags: ["可去", "戶外", "拍照", "半日"], hours: "天守內部已於 2026 年 3 月關閉", closed: "天守內部關閉；外觀與城跡依現場狀況", note: "不要把它排成入館重點。", image: "../assets/spot-heroes/castle.svg" },
  "hiroshima-port-fireworks.html": { tags: ["必去", "戶外", "拍照", "一日"], hours: "2026/7/25 20:00-21:00 予定", closed: "雨天或荒天可能調整，請出發前確認", note: "建議 17:30 前到場。", liveInfo: ["fireworks", "jrWest", "weather"], image: "../assets/spot-heroes/fireworks.svg" },
};

const miyajimaTideTripDay = {
  dateLabel: "2026/7/24（五）",
  sourceUrl: "https://www.miyajima.or.jp/sio/sio07.php",
  sourceLabel: "宮島觀光協會 2026 年 7 月潮汐表",
  dataVersion: "依 2026/6/3 查到的官方 2026 年 7 月表",
  highTides: [
    { time: "04:21", height: 260 },
    { time: "18:55", height: 289 },
  ],
  lowTides: [
    { time: "11:36", height: 116 },
  ],
};

function formatTaipeiTime(date = new Date()) {
  return new Intl.DateTimeFormat("zh-TW", {
    timeZone: "Asia/Taipei",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false,
  }).format(date);
}

const liveInfoModules = {
  miyajima: {
    label: "宮島今日資訊",
    status: "今日狀態：潮汐卡已顯示，交通與天氣見下方",
    note: "先看潮汐、渡輪與天氣；宮島行程受海象與戶外天候影響很大。",
    sources: [{ label: "宮島觀光協會", url: "https://www.miyajima.or.jp/english/" }],
  },
  ferry: {
    label: "宮島渡輪",
    status: "今日狀態：航班公告需確認",
    note: "強風、豪雨或海象不佳可能影響渡輪。若停航，宮島、大鳥居、嚴島神社與彌山行程都要改市區備案。",
    sources: [
      { label: "JR Miyajima Ferry", url: "https://jr-miyajimaferry.co.jp/en/" },
      { label: "Matsudai Ferry", url: "https://miyajima-matsudai.co.jp/english/" },
    ],
  },
  ropeway: {
    label: "彌山纜車",
    status: "今日狀態：運行公告需確認",
    note: "強風、雷雨、維修都可能停駛；搭纜車後仍要步行，不是一下車就到山頂。",
    sources: [{ label: "Miyajima Ropeway Official", url: "https://miyajima-ropeway.info/" }],
  },
  jrWest: {
    label: "JR 西日本運行資訊",
    status: "今日狀態：運行公告需確認",
    note: "宮島、尾道、吳市、錦帶橋、西條都會受 JR 影響。若有延誤，先改短行程或市區備案。",
    sources: [{ label: "JR West Train Status", url: "https://trafficinfo.westjr.co.jp/chugoku.html" }],
  },
  weather: {
    label: "廣島天氣警示",
    status: "今日狀態：讀取天氣警示中",
    note: "7 月請特別注意高溫、雷雨、強風。戶外景點若遇警示，停留時間要縮短。",
    sources: [
      { label: "日本氣象廳 廣島警報", url: "https://www.jma.go.jp/bosai/warning/#area_type=offices&area_code=340000" },
      { label: "Weather News Hiroshima", url: "https://weathernews.jp/onebox/tenki/hiroshima/" },
    ],
  },
  sunset: {
    label: "日落時間",
    status: "今日狀態：計算中",
    note: "影響宮島、尾道、錦帶橋與花火前拍照時間；傍晚行程要同時確認回程交通。",
    sources: [{ label: "Time and Date Hiroshima", url: "https://www.timeanddate.com/sun/japan/hiroshima" }],
  },
  fireworks: {
    label: "花火活動狀態",
    status: "今日狀態：活動公告需確認",
    note: "請確認是否舉辦、雨天或荒天公告、交通管制與散場動線。手機要充滿電，水和簡單食物先買好。",
    sources: [
      { label: "GOOD LUCK TRIP", url: "https://www.gltjp.com/en/directory/item/18911/" },
      { label: "Dive Hiroshima", url: "https://dive-hiroshima.com/tw/events/events-69532/" },
    ],
  },
  peaceMuseum: {
    label: "和平紀念資料館",
    status: "今日狀態：開館公告需確認",
    note: "確認開館、最後入館、人潮與是否需要預約；人多時先逛公園與原爆圓頂，再回資料館。",
    sources: [{ label: "Hiroshima Peace Memorial Museum", url: "https://hpmmuseum.jp/?lang=eng" }],
  },
  yamatoMuseum: {
    label: "大和博物館",
    status: "今日狀態：開館公告需確認",
    note: "吳市雨天備案核心；若休館或展覽調整，請改廣島市區室內景點。",
    sources: [{ label: "Yamato Museum Official", url: "https://yamato-museum.com/en-lp/" }],
  },
  shukkeien: {
    label: "縮景園開園",
    status: "今日狀態：開園公告需確認",
    note: "確認今日開園、休園、最後入園時間；夏季中午太熱，建議早上或傍晚。",
    sources: [{ label: "縮景園 Official", url: "https://shukkeien.jp/" }],
  },
  kintaikyo: {
    label: "錦帶橋通行",
    status: "今日狀態：通行公告需確認",
    note: "惡劣天候會影響橋上體驗與拍照；最後一天尤其要先確認回廣島與機場時間。",
    sources: [{ label: "錦帶橋 Official", url: "https://kintaikyo.iwakuni-city.net/en/" }],
  },
  simoseMuseum: {
    label: "下瀨美術館 / 接駁車",
    status: "今日狀態：開館與接駁車公告需確認",
    note: "美術館通常 9:30-17:00，週一休館；官方接駁車為土日祝運行，7/26 週日適用。出發前請再看官方 Access 與時刻表。",
    sources: [
      { label: "SIMOSE Access", url: "https://simose-museum.jp/access/" },
      { label: "SIMOSE Information", url: "https://simose-museum.jp/info/" },
    ],
  },
  iwakuniRopeway: {
    label: "岩國城纜車",
    status: "今日狀態：運行公告需確認",
    note: "若要加岩國城，請確認纜車是否運行與末班；停駛就只排橋與河岸。",
    sources: [{ label: "岩國城 Ropeway", url: "https://kankou.iwakuni-city.net/ropeway.html" }],
  },
  saijoSake: {
    label: "西條酒藏營業 / 試飲",
    status: "今日狀態：各酒藏營業需確認",
    note: "各酒藏時間不同，試飲不一定每天都有；飲酒後請搭 JR 回廣島，不要排太趕。",
    sources: [{ label: "Dive Hiroshima Saijo", url: "https://dive-hiroshima.com/en/explore/1199/" }],
  },
  onomichiRopeway: {
    label: "千光寺纜車",
    status: "今日狀態：運行公告需確認",
    note: "尾道坡道多，酷暑時纜車很重要；若停駛，請改短路線、咖啡廳與商店街。",
    sources: [{ label: "千光寺山 Ropeway", url: "https://mt-senkoji-rw.jp/" }],
  },
};

function renderLiveInfoSection(keys = []) {
  const modules = keys.map((key) => liveInfoModules[key]).filter(Boolean);
  if (!modules.length) {
    return null;
  }

  const section = document.createElement("section");
  section.className = "spot-section live-info";
  section.innerHTML = `
    <div class="section__head">
      <p class="eyebrow">Live Check</p>
      <h2>今日即時狀態</h2>
      <p>最後檢查時間：${formatTaipeiTime()}。若本頁無法自動抓到官方狀態，請直接點官方來源確認最新公告。</p>
    </div>
    <div class="live-info-grid">
      ${modules.map((item) => `
        <article class="live-info-card" data-live-card="${Object.keys(liveInfoModules).find((key) => liveInfoModules[key] === item) || ""}">
          <div>
            <span data-live-status>${item.status}</span>
            <h3>${item.label}</h3>
          </div>
          <p data-live-note>${item.note}</p>
          <div class="live-info-links">
            ${item.sources.map((source) => `<a href="${source.url}" target="_blank" rel="noreferrer">${source.label}</a>`).join("")}
          </div>
        </article>
      `).join("")}
    </div>
  `;
  requestAnimationFrame(() => refreshLiveInfoSection(section));
  return section;
}

function getSunsetTimeForHiroshima(date = new Date()) {
  const latitude = 34.3853;
  const longitude = 132.4553;
  const zenith = 90.833;
  const dayStart = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
  const dayOfYear = Math.floor((dayStart - new Date(Date.UTC(date.getFullYear(), 0, 0))) / 86400000);
  const lngHour = longitude / 15;
  const t = dayOfYear + ((18 - lngHour) / 24);
  const meanAnomaly = (0.9856 * t) - 3.289;
  let trueLongitude = meanAnomaly + (1.916 * Math.sin(meanAnomaly * Math.PI / 180)) + (0.02 * Math.sin(2 * meanAnomaly * Math.PI / 180)) + 282.634;
  trueLongitude = (trueLongitude + 360) % 360;
  let rightAscension = Math.atan(0.91764 * Math.tan(trueLongitude * Math.PI / 180)) * 180 / Math.PI;
  rightAscension = (rightAscension + 360) % 360;
  rightAscension += (Math.floor(trueLongitude / 90) * 90) - (Math.floor(rightAscension / 90) * 90);
  rightAscension /= 15;
  const sinDeclination = 0.39782 * Math.sin(trueLongitude * Math.PI / 180);
  const cosDeclination = Math.cos(Math.asin(sinDeclination));
  const cosHourAngle = (Math.cos(zenith * Math.PI / 180) - (sinDeclination * Math.sin(latitude * Math.PI / 180))) / (cosDeclination * Math.cos(latitude * Math.PI / 180));

  if (cosHourAngle > 1 || cosHourAngle < -1) {
    return null;
  }

  const hourAngle = (Math.acos(cosHourAngle) * 180 / Math.PI) / 15;
  const localMeanTime = hourAngle + rightAscension - (0.06571 * t) - 6.622;
  const utcTime = (localMeanTime - lngHour + 24) % 24;
  const japanTime = (utcTime + 9) % 24;
  const hours = Math.floor(japanTime);
  const minutes = Math.round((japanTime - hours) * 60);
  const displayHours = String((hours + Math.floor(minutes / 60)) % 24).padStart(2, "0");
  const displayMinutes = String(minutes % 60).padStart(2, "0");
  return `${displayHours}:${displayMinutes}`;
}

function refreshLiveInfoSection(section) {
  const sunsetCard = section.querySelector('[data-live-card="sunset"]');
  if (sunsetCard) {
    const sunset = getSunsetTimeForHiroshima();
    const status = sunsetCard.querySelector("[data-live-status]");
    const note = sunsetCard.querySelector("[data-live-note]");
    if (sunset && status && note) {
      status.textContent = `今日狀態：廣島日落約 ${sunset}`;
      note.textContent = `以本機日期計算的廣島日落時間約 ${sunset}。若要拍夕陽，請把回程交通和天氣一起看。`;
    }
  }
  refreshLiveInfoFromStatusJson(section);
}

function getLiveStatusUrl() {
  const prefix = location.pathname.includes("/spots/") ? "../" : "";
  return `${prefix}assets/live-status.json?v=${Date.now()}`;
}

async function refreshLiveInfoFromStatusJson(section) {
  try {
    const response = await fetch(getLiveStatusUrl(), { cache: "no-store" });
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }
    const data = await response.json();
    const checkedAt = data.checked_at ? formatTaipeiTime(new Date(data.checked_at)) : formatTaipeiTime();
    const intro = section.querySelector(".section__head p:last-child");
    if (intro) {
      intro.textContent = `最後更新：${checkedAt}。狀態由 GitHub Action 抓官方資料產生；官網按鈕保留給你看原始公告。`;
    }

    section.querySelectorAll("[data-live-card]").forEach((card) => {
      const key = card.dataset.liveCard;
      const item = data.statuses?.[key];
      if (!item) {
        return;
      }
      const status = card.querySelector("[data-live-status]");
      const note = card.querySelector("[data-live-note]");
      if (status) {
        status.textContent = item.summary;
      }
      if (note) {
        note.textContent = item.note;
      }
      card.classList.remove("live-info-card--ok", "live-info-card--caution", "live-info-card--info", "live-info-card--unknown");
      card.classList.add(`live-info-card--${item.status || "info"}`);
    });
  } catch (error) {
    const intro = section.querySelector(".section__head p:last-child");
    if (intro) {
      intro.textContent = `最後檢查時間：${formatTaipeiTime()}。目前讀不到 live-status.json，先顯示頁面內建狀態；請重新整理或點官方來源。`;
    }
  }
}

function renderTideEventList(events, emptyText) {
  if (!events.length) {
    return `<li>${emptyText}</li>`;
  }

  return events.map((event) => `<li><strong>${event.time}</strong><span>${event.height} cm</span></li>`).join("");
}

function buildTideStatus(data = miyajimaTideTripDay) {
  const floatingTimes = data.highTides.filter((event) => event.height >= 250);
  const walkableTimes = data.lowTides.filter((event) => event.height < 100);
  const nearWalkableTimes = data.lowTides.filter((event) => event.height >= 100 && event.height <= 130);

  return {
    floatingTimes,
    walkableTimes,
    nearWalkableTimes,
    floatingText: floatingTimes.length
      ? `${floatingTimes.map((event) => `${event.time}（${event.height}cm）`).join("、")} 適合拍海上鳥居 / 海上社殿。`
      : "沒有明顯超過 250cm 的高潮時段，請以官方即時查詢為準。",
    walkableText: walkableTimes.length
      ? `${walkableTimes.map((event) => `${event.time}（${event.height}cm）`).join("、")} 低於 100cm，較適合走近大鳥居。`
      : nearWalkableTimes.length
        ? `${nearWalkableTimes.map((event) => `${event.time}（${event.height}cm）`).join("、")} 接近退潮，但未低於官方 100cm 門檻；不建議把「走到鳥居」當保證行程。`
        : "低潮沒有低於 100cm，不建議把「走到鳥居」當保證行程。",
  };
}

async function tryRefreshMiyajimaTide(tideSection) {
  const status = tideSection.querySelector("[data-tide-fetch-status]");
  if (!status) {
    return;
  }

  try {
    const response = await fetch(miyajimaTideTripDay.sourceUrl, { cache: "no-store" });
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }
    const html = await response.text();
    const rowMatch = html.replace(/\s+/g, " ").match(/24\s+金\s+若\s+4:21\s+260\s+18:55\s+289\s+11:36\s+116/);
    status.textContent = rowMatch
      ? `自動比對官方頁成功：${formatTaipeiTime()}，目前仍符合頁面顯示資料。`
      : `已於 ${formatTaipeiTime()} 讀取官方頁，但格式可能更新，請點官方查詢確認。`;
  } catch (error) {
    status.textContent = `本頁最後檢查時間：${formatTaipeiTime()}。瀏覽器可能擋住跨網域自動讀取，請點官方即時查詢確認最新潮汐。`;
  }
}

const currentSpot = location.pathname.split("/").pop();
const meta = spotMeta[currentSpot];
const spotPage = document.querySelector(".spot-page");

if (meta && spotPage) {
  const spotHero = document.querySelector(".spot-hero");

  if (spotHero && !spotHero.querySelector(".spot-hero__image")) {
    const heroImage = document.createElement("img");
    heroImage.className = "spot-hero__image";
    heroImage.src = meta.image;
    heroImage.alt = "";
    heroImage.decoding = "async";
    heroImage.addEventListener("error", () => {
      spotHero.classList.add("is-image-missing");
    });
    spotHero.prepend(heroImage);
  }

  const tagSection = document.createElement("section");
  tagSection.className = "spot-section";
  tagSection.innerHTML = `<h2>景點標籤</h2><div class="tag-strip">${meta.tags.map((tag) => `<span>${tag}</span>`).join("")}</div>`;
  const quickSection = spotPage.querySelector(".spot-section--quick");
  const liveInfoSection = renderLiveInfoSection(meta.liveInfo);
  if (quickSection) {
    if (liveInfoSection) {
      quickSection.after(liveInfoSection);
      liveInfoSection.after(tagSection);
    } else {
      quickSection.after(tagSection);
    }
  } else {
    if (liveInfoSection) {
      spotPage.prepend(liveInfoSection);
      liveInfoSection.after(tagSection);
    } else {
      spotPage.prepend(tagSection);
    }
  }

  if (meta.tide) {
    const tideSection = document.createElement("section");
    tideSection.className = "spot-section";
    const tideStatus = buildTideStatus();
    tideSection.innerHTML = `
      <h2>2026/7/24 潮汐預測</h2>
      <p>官方說明：潮位 250cm 以上，嚴島神社較像浮在海上；潮位 100cm 以下，較適合走近大鳥居。以下以廣島港潮汐表為基準，厳島港可能會稍早，現場仍以官方即時查詢與天候為準。</p>
      <div class="tide-grid">
        <article>
          <span>滿潮 high tide</span>
          <ul>${renderTideEventList(miyajimaTideTripDay.highTides, "尚無資料")}</ul>
        </article>
        <article>
          <span>干潮 low tide</span>
          <ul>${renderTideEventList(miyajimaTideTripDay.lowTides, "尚無資料")}</ul>
        </article>
      </div>
      <div class="tide-callout">
        <strong>拍照判斷</strong>
        <p>${tideStatus.floatingText}</p>
        <p>${tideStatus.walkableText}</p>
      </div>
      <p class="tide-status" data-tide-fetch-status>本頁最後檢查時間：${formatTaipeiTime()}。正在嘗試讀取官方頁...</p>
      <div class="action-row">
        <a class="action-button" href="${miyajimaTideTripDay.sourceUrl}" target="_blank" rel="noreferrer">官方即時查詢</a>
        <a class="action-button action-button--ghost" href="${miyajimaTideTripDay.sourceUrl}" target="_blank" rel="noreferrer">${miyajimaTideTripDay.sourceLabel}</a>
      </div>
      <p class="source-note">資料版本：${miyajimaTideTripDay.dataVersion}。不要截圖放到出發當天用；請看本頁檢查時間並點官方頁再次確認。</p>
    `;
    tagSection.after(tideSection);
    tryRefreshMiyajimaTide(tideSection);
  }

  const hoursSection = document.createElement("section");
  hoursSection.className = "spot-section";
  hoursSection.innerHTML = `<h2>開放時間與休館提醒</h2><dl class="info-list"><div><dt>開放時間</dt><dd>${meta.hours}</dd></div><div><dt>休館日</dt><dd>${meta.closed}</dd></div><div><dt>注意事項</dt><dd>${meta.note}</dd></div></dl>`;
  spotPage.append(hoursSection);
}
