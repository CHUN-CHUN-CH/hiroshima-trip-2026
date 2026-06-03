import { mkdir, writeFile } from "node:fs/promises";

const checkedAt = new Date();
const checkedAtIso = checkedAt.toISOString();

const SOURCES = {
  jmaWarning: "https://www.jma.go.jp/bosai/warning/data/warning/340000.json",
  jrWest: "https://trafficinfo.westjr.co.jp/chugoku.html",
  ropeway: "https://miyajima-ropeway.info/",
  jrFerry: "https://jr-miyajimaferry.co.jp/en/",
  matsudaiFerry: "https://miyajima-matsudai.co.jp/english/",
  fireworks: "https://www.gltjp.com/en/directory/item/18911/",
};

const STATUS = {
  ok: "ok",
  caution: "caution",
  info: "info",
  unknown: "unknown",
};

function entry(status, summary, note, source) {
  return {
    status,
    summary,
    note,
    source,
    checked_at: checkedAtIso,
  };
}

async function fetchText(url, timeoutMs = 15000) {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), timeoutMs);
  try {
    const response = await fetch(url, {
      signal: controller.signal,
      headers: {
        "User-Agent": "hiroshima-trip-live-status/1.0",
      },
    });
    const text = await response.text();
    return { ok: response.ok, status: response.status, text };
  } catch (error) {
    return { ok: false, status: 0, text: "", error: error.message };
  } finally {
    clearTimeout(timeout);
  }
}

function stripHtml(text) {
  return text
    .replace(/<script[\s\S]*?<\/script>/gi, " ")
    .replace(/<style[\s\S]*?<\/style>/gi, " ")
    .replace(/<[^>]+>/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function includesAny(text, patterns) {
  return patterns.some((pattern) => text.includes(pattern));
}

async function checkWeather() {
  const result = await fetchText(SOURCES.jmaWarning);
  if (!result.ok) {
    return entry(
      STATUS.unknown,
      "今日狀態：天氣警示讀取失敗",
      "無法讀取日本氣象廳警報 JSON，請點官方來源確認高溫、雷雨、強風。",
      SOURCES.jmaWarning,
    );
  }

  try {
    const data = JSON.parse(result.text);
    const active = [];
    const collect = (node) => {
      if (!node || typeof node !== "object") return;
      if (Array.isArray(node)) {
        node.forEach(collect);
        return;
      }
      if (Array.isArray(node.warnings)) {
        node.warnings.forEach((warning) => {
          const status = warning.status || "";
          const name = warning.name || warning.kind || warning.warning || "";
          if (status && !["解除", "発表警報・注意報はなし"].includes(status)) {
            active.push(name || status);
          }
        });
      }
      Object.values(node).forEach(collect);
    };
    collect(data);
    const names = [...new Set(active)].filter(Boolean).slice(0, 5);
    if (names.length) {
      return entry(
        STATUS.caution,
        `今日狀態：廣島有天氣警報/注意報（${names.join("、")}）`,
        "戶外景點請縮短停留，宮島、尾道、錦帶橋、花火行程尤其要保守。",
        SOURCES.jmaWarning,
      );
    }
    return entry(
      STATUS.ok,
      "今日狀態：日本氣象廳目前未列明顯警報/注意報",
      "仍請出發前再看氣溫、雷雨與強風。7 月戶外行程要補水、防曬。",
      SOURCES.jmaWarning,
    );
  } catch (error) {
    return entry(
      STATUS.unknown,
      "今日狀態：天氣警示格式讀取失敗",
      "日本氣象廳資料格式可能改變，請點官方來源確認。",
      SOURCES.jmaWarning,
    );
  }
}

async function checkJrWest() {
  const result = await fetchText(SOURCES.jrWest);
  if (!result.ok) {
    return entry(
      STATUS.unknown,
      "今日狀態：JR West 讀取失敗",
      "無法讀取中國地區運行資訊，請出發前確認宮島、尾道、吳市、西條與岩國路線。",
      SOURCES.jrWest,
    );
  }
  const text = stripHtml(result.text);
  if (includesAny(text, ["現在、運行情報はありません", "運行情報はありません"])) {
    return entry(
      STATUS.ok,
      "今日狀態：JR West 中國地區目前未列運行異常",
      "宮島、尾道、吳市、西條與岩國仍請出發前再看一次班次。",
      SOURCES.jrWest,
    );
  }
  if (includesAny(text, ["遅れ", "運転見合わせ", "運転取り止め", "運休", "運転休止", "振替輸送"])) {
    return entry(
      STATUS.caution,
      "今日狀態：JR West 中國地區有運行資訊",
      "可能有延誤或停駛，請先看受影響路線，再決定是否改市區備案。",
      SOURCES.jrWest,
    );
  }
  return entry(
    STATUS.info,
    "今日狀態：JR West 頁面已更新，請確認路線細節",
    "抓到官方頁但無法自動判斷是否影響你們路線，請點來源看山陽線、吳線、山陽新幹線等。",
    SOURCES.jrWest,
  );
}

async function checkRopeway() {
  const result = await fetchText(SOURCES.ropeway);
  if (!result.ok) {
    return entry(
      STATUS.unknown,
      "今日狀態：彌山纜車讀取失敗",
      "無法讀取纜車官方頁，請出發前確認是否因強風、雷雨或維修停駛。",
      SOURCES.ropeway,
    );
  }
  const text = stripHtml(result.text);
  if (includesAny(text, ["運休", "休止", "運転見合わせ", "運行休止", "強風のため運休"])) {
    return entry(
      STATUS.caution,
      "今日狀態：彌山纜車官方頁出現停駛/休止關鍵字",
      "請先改宮島平地行程：嚴島神社、表參道、大聖院、紅葉谷公園。",
      SOURCES.ropeway,
    );
  }
  if (includesAny(text, ["通常通り運行", "運行中", "営業中"])) {
    return entry(
      STATUS.ok,
      "今日狀態：彌山纜車官方頁顯示運行中",
      "仍要確認末班時間；搭完纜車後到山頂還要步行。",
      SOURCES.ropeway,
    );
  }
  return entry(
    STATUS.info,
    "今日狀態：彌山纜車官方頁已更新，需看詳細公告",
    "未抓到明確正常/停駛字樣。若要上山，請點官方來源確認。",
    SOURCES.ropeway,
  );
}

async function checkFerry() {
  const [jr, matsudai] = await Promise.all([
    fetchText(SOURCES.jrFerry),
    fetchText(SOURCES.matsudaiFerry),
  ]);
  const combined = `${stripHtml(jr.text || "")} ${stripHtml(matsudai.text || "")}`;
  if (!jr.ok && !matsudai.ok) {
    return entry(
      STATUS.unknown,
      "今日狀態：宮島渡輪讀取失敗",
      "兩家渡輪官方頁都無法讀取，請出發前人工確認。",
      SOURCES.jrFerry,
    );
  }
  if (includesAny(combined, ["欠航", "運休", "休航", "運航見合わせ", "強風", "荒天"])) {
    return entry(
      STATUS.caution,
      "今日狀態：宮島渡輪官方頁出現停航/天候關鍵字",
      "宮島整天行程可能受影響，請先確認 JR Ferry 與 Matsudai Ferry。",
      SOURCES.jrFerry,
    );
  }
  return entry(
    STATUS.ok,
    "今日狀態：宮島渡輪未抓到停航關鍵字",
    "仍請出發前確認末班船與海象；強風豪雨時要保守。",
    SOURCES.jrFerry,
  );
}

function checkSunset() {
  return entry(
    STATUS.ok,
    "今日狀態：日落時間由前端即時計算",
    "頁面會依目前日期計算廣島日落時間；夕陽拍照請搭配天氣與回程班次。",
    "https://www.timeanddate.com/sun/japan/hiroshima",
  );
}

function checkFireworks() {
  const japanNow = new Date(checkedAt.toLocaleString("en-US", { timeZone: "Asia/Tokyo" }));
  const month = japanNow.getMonth() + 1;
  const day = japanNow.getDate();
  if (month !== 7 || day !== 25) {
    return entry(
      STATUS.info,
      "今日狀態：花火活動日尚未到",
      "活動日 2026/7/25 當天請確認是否舉辦、交通管制、雨天或荒天公告。",
      SOURCES.fireworks,
    );
  }
  return entry(
    STATUS.info,
    "今日狀態：今天是花火活動日，請查看官方公告",
    "出門前先確認是否舉辦與交通管制；散場回程會比平常久。",
    SOURCES.fireworks,
  );
}

function manualStatus(key, summary, note, source) {
  return [key, entry(STATUS.info, summary, note, source)];
}

const statuses = Object.fromEntries([
  ["weather", await checkWeather()],
  ["jrWest", await checkJrWest()],
  ["ropeway", await checkRopeway()],
  ["ferry", await checkFerry()],
  ["sunset", checkSunset()],
  ["fireworks", checkFireworks()],
  manualStatus("miyajima", "今日狀態：潮汐已由頁面顯示，渡輪與天氣同步檢查", "宮島行程請一起看潮汐、渡輪、天氣與日落。", "https://www.miyajima.or.jp/english/"),
  manualStatus("peaceMuseum", "今日狀態：資料館營業狀態需看官方公告", "和平紀念資料館可能有人潮與最後入館時間，出發前請看官方頁。", "https://hpmmuseum.jp/?lang=eng"),
  manualStatus("yamatoMuseum", "今日狀態：大和博物館營業狀態需看官方公告", "吳市雨天備案核心，若休館請改市區室內景點。", "https://yamato-museum.com/en-lp/"),
  manualStatus("shukkeien", "今日狀態：縮景園開園狀態需看官方公告", "庭園受高溫、雨勢與臨時休園影響，請確認最後入園時間。", "https://shukkeien.jp/"),
  manualStatus("kintaikyo", "今日狀態：錦帶橋通行狀態需看官方公告", "惡劣天候可能影響橋梁體驗；最後一天請先保回程。", "https://kintaikyo.iwakuni-city.net/en/"),
  manualStatus("iwakuniRopeway", "今日狀態：岩國城纜車狀態需看官方公告", "若停駛，就只排錦帶橋與河岸散步。", "https://kankou.iwakuni-city.net/ropeway.html"),
  manualStatus("saijoSake", "今日狀態：各酒藏營業與試飲需個別確認", "西條酒藏時間不一致，試飲不一定每天開放。", "https://dive-hiroshima.com/en/explore/1199/"),
  manualStatus("onomichiRopeway", "今日狀態：千光寺纜車狀態需看官方公告", "尾道坡道多，若纜車停駛請改短路線與咖啡廳。", "https://mt-senkoji-rw.jp/"),
]);

const output = {
  checked_at: checkedAtIso,
  generated_by: "scripts/update-live-status.mjs",
  statuses,
};

await mkdir("assets", { recursive: true });
await writeFile("assets/live-status.json", `${JSON.stringify(output, null, 2)}\n`, "utf8");
console.log(`Updated assets/live-status.json at ${checkedAtIso}`);
