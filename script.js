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
  ["ramen", "拉麵 / 麵類"],
  ["cafe", "咖啡 / 甜點"],
  ["izakaya", "居酒屋 / 晚餐"],
  ["late-night", "宵夜"],
  ["sake", "清酒 / 酒藏"],
  ["backup", "多人備案"],
];

const foodItems = [
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
    categories: ["okonomiyaki", "backup"],
    reason: "整棟都是廣島燒店，大家意見分歧時很適合現場分散選。",
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
    section.open = index === 0;
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

const foodAreaContainer = document.querySelector("[data-food-areas]");
const foodCategoryContainer = document.querySelector("[data-food-categories]");
const vegAreaContainer = document.querySelector("[data-veg-areas]");
const vegCategoryContainer = document.querySelector("[data-veg-categories]");
const foodModeButtons = document.querySelectorAll("[data-food-view]");
const foodModes = document.querySelectorAll("[data-food-mode]");

if (foodAreaContainer || foodCategoryContainer || vegAreaContainer || vegCategoryContainer) {
  renderFoodSections(foodAreaContainer, foodAreas, (area) => foodItems.filter((item) => item.area === area));
  renderFoodSections(foodCategoryContainer, foodCategories, (category) => foodItems.filter((item) => item.categories.includes(category)));
  renderFoodSections(vegAreaContainer, vegAreas, (area) => vegItems.filter((item) => item.area === area), vegAreas, vegCategories);
  renderFoodSections(vegCategoryContainer, vegCategories, (category) => vegItems.filter((item) => item.categories.includes(category)), vegAreas, vegCategories);

  foodModeButtons.forEach((button) => {
    button.addEventListener("click", () => {
      const view = button.dataset.foodView;
      const switchGroup = button.closest(".view-switch");
      const isVegView = view.startsWith("veg-");
      const relatedModes = [...foodModes].filter((mode) => mode.dataset.foodMode.startsWith("veg-") === isVegView);

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
    image: "../assets/spot-heroes/miyajima.svg",
  },
  "otorii.html": {
    tags: ["必去", "戶外", "拍照"],
    hours: "戶外景觀，依潮汐與安全狀況",
    closed: "請出發前再次確認官方網站",
    note: "滿潮與退潮拍法不同。",
    tide: true,
    image: "../assets/spot-heroes/miyajima.svg",
  },
  "peace-memorial.html": { tags: ["必去", "室內", "雨天備案", "半日"], hours: "資料館依官方公告", closed: "請出發前再次確認官方網站", note: "內容沉重，請保留休息時間。", image: "../assets/spot-heroes/peace.svg" },
  "shukkeien.html": { tags: ["可去", "戶外", "拍照", "半日"], hours: "請出發前再次確認官方網站", closed: "請出發前再次確認官方網站", note: "夏天午後注意補水。", image: "../assets/spot-heroes/garden.svg" },
  "onomichi.html": { tags: ["可去", "戶外", "拍照", "美食", "一日"], hours: "街區戶外為主，店家各自不同", closed: "請出發前再次確認官方網站", note: "坡道多，穿好走的鞋。", image: "../assets/spot-heroes/onomichi.svg" },
  "kure.html": { tags: ["可去", "雨天備案", "室內", "半日"], hours: "博物館依官方公告", closed: "請出發前再次確認官方網站", note: "適合下雨或酷暑備案。", image: "../assets/spot-heroes/kure.svg" },
  "kintaikyo.html": { tags: ["可去", "戶外", "拍照", "半日"], hours: "橋梁區域依官方公告", closed: "請出發前再次確認官方網站", note: "最後一天請不要太晚回廣島。", image: "../assets/spot-heroes/bridge.svg" },
  "saijo.html": { tags: ["可去", "美食", "購物", "半日"], hours: "酒藏與店家各自不同", closed: "請出發前再次確認官方網站", note: "試飲請注意回程交通與身體狀況。", image: "../assets/spot-heroes/sake.svg" },
  "hondori.html": { tags: ["可去", "雨天備案", "購物", "美食"], hours: "商店各自不同", closed: "請出發前再次確認官方網站", note: "最適合當集合點與休息點。", image: "../assets/spot-heroes/city.svg" },
  "omotesando.html": { tags: ["可去", "美食", "購物", "半日"], hours: "店家各自不同", closed: "請出發前再次確認官方網站", note: "午餐尖峰容易排隊。", image: "../assets/spot-heroes/food.svg" },
  "daishoin.html": { tags: ["可去", "戶外", "拍照", "半日"], hours: "請出發前再次確認官方網站", closed: "請出發前再次確認官方網站", note: "有階梯與上坡。", image: "../assets/spot-heroes/temple.svg" },
  "misen-ropeway.html": { tags: ["可去", "戶外", "拍照", "半日"], hours: "纜車依官方公告與天候", closed: "天候不佳可能停駛，請出發前確認", note: "纜車後仍需步行。", image: "../assets/spot-heroes/mountain.svg" },
  "hiroshima-castle.html": { tags: ["可去", "戶外", "拍照", "半日"], hours: "天守內部已於 2026 年 3 月關閉", closed: "天守內部關閉；外觀與城跡依現場狀況", note: "不要把它排成入館重點。", image: "../assets/spot-heroes/castle.svg" },
  "hiroshima-port-fireworks.html": { tags: ["必去", "戶外", "拍照", "一日"], hours: "2026/7/25 20:00-21:00 予定", closed: "雨天或荒天可能調整，請出發前確認", note: "建議 17:30 前到場。", image: "../assets/spot-heroes/fireworks.svg" },
};

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
  if (quickSection) {
    quickSection.after(tagSection);
  } else {
    spotPage.prepend(tagSection);
  }

  if (meta.tide) {
    const tideSection = document.createElement("section");
    tideSection.className = "spot-section";
    tideSection.innerHTML = "<h2>潮汐拍攝提醒</h2><p>滿潮適合拍海上鳥居，退潮可走近鳥居。未來可在這裡放 2026/7/24 的宮島潮汐資料。</p>";
    tagSection.after(tideSection);
  }

  const hoursSection = document.createElement("section");
  hoursSection.className = "spot-section";
  hoursSection.innerHTML = `<h2>開放時間與休館提醒</h2><dl class="info-list"><div><dt>開放時間</dt><dd>${meta.hours}</dd></div><div><dt>休館日</dt><dd>${meta.closed}</dd></div><div><dt>注意事項</dt><dd>${meta.note}</dd></div></dl>`;
  spotPage.append(hoursSection);
}
