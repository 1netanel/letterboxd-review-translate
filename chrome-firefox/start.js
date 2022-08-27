const sourceLang = "auto";
const targetLang = "en";

const detectLanguage = async (text) => {
  // TODO: change from chrome to more generic option

  const obj = await chrome.i18n.detectLanguage(text);
  return obj.isReliable ? obj.languages[0].language : targetLang;
};

const fetchTranslation = async (textToTranslate) => {
  const url = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=${sourceLang}&tl=${targetLang}&dt=t&q=${encodeURI(
    textToTranslate
  )}`;
  const res = await fetch(url);
  const json = await res.json();

  const results = json[0];
  const translatedText = results.map((line) => line[0]).join();
  return translatedText;
};

const appendTranslatedReview = async (reviewTextDiv) => {
  const reviewText = await reviewTextDiv.innerText;
  const translatedText = await fetchTranslation(reviewText);
  // TODO: append translateion in a better way
  reviewTextDiv.innerText += `\n\n${translatedText}\n`;
};

const createButton = () => {
  const a = document.createElement("a");
  a.appendChild(document.createTextNode("Transalte Review"));
  a.href = "javascript:void(0);";
  a.classList.add("js-reveal");
  a.style.color = "#bcd";
  a.style.fontFamily = "TiemposTextWeb-Regular, Georgia, serif";
  return a;
};

const main = async () => {
  const reviews = document.getElementsByClassName("film-detail");

  for (const review of reviews) {
    const reviewTextDiv = review.querySelector(".body-text");
    const reviewText = await reviewTextDiv.innerText;
    const reviewLangauge = await detectLanguage(reviewText);

    if (reviewLangauge !== targetLang) {
      const a = createButton();
      a.onclick = () => appendTranslatedReview(reviewTextDiv);
      reviewTextDiv.after(a);
    }
  }
};

main();
