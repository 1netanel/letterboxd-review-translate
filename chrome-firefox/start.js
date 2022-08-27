const sourceLang = 'auto';
const targetLang = 'en';

const fetchTranslation = async (textToTranslate) => {
  const url = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=${sourceLang}&tl=${targetLang}&dt=t&q=${encodeURI(textToTranslate)}`
  const res = await fetch(url);
  const json = await res.json();

  const results = json[0];
  const translatedText = results.map(line => line[0]).join()
  return translatedText;
}

const appendTranslatedReview = async (reviewTextDiv) => {
  const reviewText = await reviewTextDiv.innerText
  const translatedText = await fetchTranslation(reviewText);
  reviewTextDiv.innerText = translatedText;
}

const createButton = () => {
  const a = document.createElement('a');
  a.appendChild(document.createTextNode("Transalte Review"));
  a.href = "javascript:void(0);"
  return a;
}

const reviewList = document.querySelector(".viewings-list > ul");
const reviews = reviewList.children;

const appendTransalteButtons = () => {
  for (const review of reviews) {
    const reviewTextDiv = review.querySelector(".body-text");
    const a = createButton();
    a.onclick = () => { appendTranslatedReview(reviewTextDiv) };
    reviewTextDiv.after(a);
  }
}

appendTransalteButtons()

