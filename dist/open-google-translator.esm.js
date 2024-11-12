function oo(a) {
  for (var b = [], c = 0, d = 0; d < a.length; d++) {
    var e = a.charCodeAt(d);
    128 > e ? b[c++] = e : (2048 > e ? b[c++] = e >> 6 | 192 : (55296 == (e & 64512) && d + 1 < a.length && 56320 == (a.charCodeAt(d + 1) & 64512) ? (e = 65536 + ((e & 1023) << 10) + (a.charCodeAt(++d) & 1023), b[c++] = e >> 18 | 240, b[c++] = e >> 12 & 63 | 128) : b[c++] = e >> 12 | 224, b[c++] = e >> 6 & 63 | 128), b[c++] = e & 63 | 128);
  }
  return b;
}
function jq(a, b) {
  for (var c = 0; c < b.length - 2; c += 3) {
    var d = b.charAt(c + 2);
    d = "a" <= d ? d.charCodeAt(0) - 87 : Number(d);
    d = "+" == b.charAt(c + 1) ? a >>> d : a << d;
    a = "+" == b.charAt(c) ? a + d & 4294967295 : a ^ d;
  }
  return a;
}
function generateFinalToken(sentenceToTranslate) {
  var a = sentenceToTranslate.join("");
  var b = ["471414", "523112976"], c = Number(b[0]) || 0;
  a = oo(a);
  for (var d = c, e = 0; e < a.length; e++) d += a[e], d = jq(d, "+-a^+6");
  d = jq(d, "+-3^+b+-f");
  d ^= Number(b[1]) || 0;
  0 > d && (d = (d & 2147483647) + 2147483648);
  b = d % 1e6;
  return b.toString() + "." + (b ^ c);
}
function constructTranslationUrl({
  translateFrom,
  translateTo,
  generatedToken
}) {
  const baseUrl = "https://translate.googleapis.com/translate_a/t";
  const queryParams = new URLSearchParams({
    client: "te",
    v: "1.0",
    sl: translateFrom,
    tl: translateTo,
    tk: generatedToken
  });
  return `${baseUrl}?${queryParams.toString()}`;
}
function getHeaders() {
  const headers = new Headers();
  headers.append("accept", "*/*");
  headers.append("Content-Type", "application/x-www-form-urlencoded");
  return headers;
}
function getEncodedBody({ phrases }) {
  const urlencodedBody = new URLSearchParams();
  phrases.forEach((phrase) => urlencodedBody.append("q", phrase));
  return urlencodedBody;
}
async function translateText({ listOfWordsToTranslate = [], translateFrom = "en", translateTo = "en" }) {
  var _result = listOfWordsToTranslate.map((originalPhrase) => ({
    original: originalPhrase,
    translation: originalPhrase
  }));
  if (translateFrom === translateTo) {
    return _result;
  }
  var generatedToken = generateFinalToken(listOfWordsToTranslate);
  const url = constructTranslationUrl({
    generatedToken,
    translateFrom,
    translateTo
  });
  const headers = getHeaders();
  const urlencodedBody = getEncodedBody({
    phrases: listOfWordsToTranslate
  });
  const requestOptions = {
    method: "POST",
    headers,
    body: urlencodedBody,
    redirect: "follow"
  };
  try {
    const response = await fetch(url, requestOptions);
    var resp = await response.json();
    const translatedText = (index) => Array.isArray(resp[index]) ? resp[index][0] : resp[index];
    _result = listOfWordsToTranslate.map((originalPhrase, index) => ({
      original: originalPhrase,
      translation: resp[index].length == 0 ? originalPhrase : translatedText(index)
    }));
  } catch (error) {
    console.error("Error:", error);
  }
  return _result;
}
const SUPPORTED_LANGUAGES = {
  af: "Afrikaans",
  sq: "Albanian",
  am: "Amharic",
  ar: "Arabic",
  hy: "Armenian",
  az: "Azerbaijani",
  eu: "Basque",
  be: "Belarusian",
  bn: "Bengali",
  bs: "Bosnian",
  bg: "Bulgarian",
  ca: "Catalan",
  ceb: "Cebuano",
  ny: "Chichewa",
  "zh-cn": "Chinese Simplified",
  "zh-tw": "Chinese Traditional",
  co: "Corsican",
  hr: "Croatian",
  cs: "Czech",
  da: "Danish",
  nl: "Dutch",
  en: "English",
  eo: "Esperanto",
  et: "Estonian",
  tl: "Filipino",
  fi: "Finnish",
  fr: "French",
  fy: "Frisian",
  gl: "Galician",
  ka: "Georgian",
  de: "German",
  el: "Greek",
  gu: "Gujarati",
  ht: "Haitian Creole",
  ha: "Hausa",
  haw: "Hawaiian",
  iw: "Hebrew",
  hi: "Hindi",
  hmn: "Hmong",
  hu: "Hungarian",
  is: "Icelandic",
  ig: "Igbo",
  id: "Indonesian",
  ga: "Irish",
  it: "Italian",
  ja: "Japanese",
  jw: "Javanese",
  kn: "Kannada",
  kk: "Kazakh",
  km: "Khmer",
  ko: "Korean",
  ku: "Kurdish (Kurmanji)",
  ky: "Kyrgyz",
  lo: "Lao",
  la: "Latin",
  lv: "Latvian",
  lt: "Lithuanian",
  lb: "Luxembourgish",
  mk: "Macedonian",
  mg: "Malagasy",
  ms: "Malay",
  ml: "Malayalam",
  mt: "Maltese",
  mi: "Maori",
  mr: "Marathi",
  mn: "Mongolian",
  my: "Myanmar (Burmese)",
  ne: "Nepali",
  no: "Norwegian",
  ps: "Pashto",
  fa: "Persian",
  pl: "Polish",
  pt: "Portuguese",
  pa: "Punjabi",
  ro: "Romanian",
  ru: "Russian",
  sm: "Samoan",
  gd: "Scots Gaelic",
  sr: "Serbian",
  st: "Sesotho",
  sn: "Shona",
  sd: "Sindhi",
  si: "Sinhala",
  sk: "Slovak",
  sl: "Slovenian",
  so: "Somali",
  es: "Spanish",
  su: "Sundanese",
  sw: "Swahili",
  sv: "Swedish",
  tg: "Tajik",
  ta: "Tamil",
  te: "Telugu",
  th: "Thai",
  tr: "Turkish",
  uk: "Ukrainian",
  ur: "Urdu",
  uz: "Uzbek",
  vi: "Vietnamese",
  cy: "Welsh",
  xh: "Xhosa",
  yi: "Yiddish",
  yo: "Yoruba",
  zu: "Zulu"
};
const translate = async ({
  listOfWordsToTranslate,
  fromLanguage,
  toLanguage
}) => {
  var translatedData = await translateText({
    listOfWordsToTranslate,
    translateFrom: fromLanguage,
    translateTo: toLanguage
  });
  return translatedData;
};
const supportedLanguages = () => {
  return SUPPORTED_LANGUAGES;
};
export {
  supportedLanguages,
  translate
};
