
import { GoogleGenAI } from "@google/genai";
import { Language } from '../types';

if (!process.env.API_KEY) {
  console.warn("API_KEY environment variable not set. Using a mock service.");
}

const ai = process.env.API_KEY ? new GoogleGenAI({ apiKey: process.env.API_KEY }) : null;

const languageMap: { [key in Language]: string } = {
  [Language.EN]: 'English',
  [Language.SW]: 'Swahili',
  [Language.SO]: 'Somali',
};

const mockTranslate = async (text: string, targetLanguage: Language): Promise<string> => {
    await new Promise(res => setTimeout(res, 500));
    return `[Mock Translated to ${languageMap[targetLanguage]}] ${text}`;
};

const mockSummarize = async (text: string): Promise<string> => {
    await new Promise(res => setTimeout(res, 1000));
    return `[Mock Summary] This is a summarized version of the provided text, highlighting key points and findings. The document discusses important community topics and suggests actions.`;
};

const mockGenerateInsight = async (data: string): Promise<string> => {
    await new Promise(res => setTimeout(res, 1500));
    return `[Mock AI Insight] Based on the data, a key trend is the increasing demand for vocational training. We recommend exploring partnerships with local trade schools.`;
};

export const translateText = async (text: string, targetLanguage: Language): Promise<string> => {
  if (!ai) return mockTranslate(text, targetLanguage);
  try {
    const prompt = `Translate the following text to ${languageMap[targetLanguage]}: "${text}"`;
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
    });
    return response.text;
  } catch (error) {
    console.error("Error translating text:", error);
    return `Error: Could not translate.`;
  }
};

export const summarizeText = async (text: string): Promise<string> => {
    if (!ai) return mockSummarize(text);
    try {
        const prompt = `Provide a concise, one-paragraph summary of the following text: "${text}"`;
        const response = await ai.models.generateContent({
          model: 'gemini-2.5-flash',
          contents: prompt,
        });
        return response.text;
    } catch (error) {
        console.error("Error summarizing text:", error);
        return `Error: Could not generate summary.`;
    }
};

export const generateInsight = async (data: string): Promise<string> => {
    if (!ai) return mockGenerateInsight(data);
    try {
        const prompt = `Analyze the following community data and identify a key trend or insight. Provide a concise, actionable summary (2-3 sentences): "${data}"`;
        const response = await ai.models.generateContent({
          model: 'gemini-2.5-flash',
          contents: prompt,
        });
        return response.text;
    } catch (error) {
        console.error("Error generating insight:", error);
        return `Error: Could not generate insight.`;
    }
};
