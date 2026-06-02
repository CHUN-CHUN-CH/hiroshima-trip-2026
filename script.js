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
const title = document.querySelector("#choice-title");
const text = document.querySelector("#choice-text");

buttons.forEach((button, index) => {
  if (index === 0) {
    button.classList.add("is-active");
  }

  button.addEventListener("click", () => {
    const choice = choices[button.dataset.choice];
    title.textContent = choice.title;
    text.textContent = choice.text;

    buttons.forEach((item) => item.classList.remove("is-active"));
    button.classList.add("is-active");
  });
});
