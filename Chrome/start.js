// TODO: fix the problem with long reviews collapse,
// TODO: add dynamic target language
const sourceLang = "auto";
const targetLang = "en";

const detectLanguage = async (text) => {
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

const createTranslateSpan = (translatedReview) => {
  const span = document.createElement("span");
  const childSpan = document.createElement("span");
  const p = document.createElement("p");

  p.innerText = translatedReview;
  childSpan.innerText = translatedReview;
  childSpan.style.color = "#40bcf4";
  childSpan.style.fontStyle = "italic";
  childSpan.style.display = "block";
  childSpan.style.marginBottom = "5px";
  childSpan.innerHTML = "Translated Review :";

  span.classList.add("body-text");
  span.appendChild(childSpan);
  span.appendChild(p);
  return span;
};

const appendTranslatedReview = async (reviewTextDiv) => {
  const reviewText = await reviewTextDiv.innerText;
  const translatedText = await fetchTranslation(reviewText);
  const span = createTranslateSpan(translatedText);
  reviewTextDiv.after(span);
};

const createButton = () => {
  const a = document.createElement("a");
  a.appendChild(document.createTextNode("Transalte Review"));
  a.href = "javascript:void(0);";
  a.classList.add("js-reveal");
  a.style.color = "#40bcf4";
  a.style.fontSize = "15px";
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
