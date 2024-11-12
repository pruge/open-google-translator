import translateText from "./api/translate_api";
import SUPPORTED_LANGUAGES from "./utils/languages";

export const translate = async ({
    listOfWordsToTranslate,
    fromLanguage,
    toLanguage,
}: {
    listOfWordsToTranslate: string[];
    fromLanguage: string;
    toLanguage: string;
}) => {
    var translatedData = await translateText({
        listOfWordsToTranslate: listOfWordsToTranslate,
        translateFrom: fromLanguage,
        translateTo: toLanguage,
    });
    return translatedData;
};
export const supportedLanguages = () => {
    return SUPPORTED_LANGUAGES;
};
