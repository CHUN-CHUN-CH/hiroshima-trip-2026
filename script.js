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
  spotPage.prepend(tagSection);

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
