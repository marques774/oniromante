import { GoogleGenAI, Type, Schema } from "@google/genai";
import { DailyInsights, DreamEntry, DreamAnalysis, NightEnergy, SymbolDefinition, ArtStyle } from "../types";

const apiKey = process.env.API_KEY || '';

const ai = new GoogleGenAI({ apiKey });

// System instruction for the Dream Interpreter Chat
const CHAT_SYSTEM_INSTRUCTION = `
Você é o "Oniromante", uma inteligência artificial mística, empática e sábia.
Atue como um "Mentor dos Sonhos".
1. Ao interpretar: Aprofunde-se nos símbolos. Pergunte sobre cores e sentimentos.
2. Suporte: Se o usuário estiver ansioso, sugira calma.
3. Estilo: Use metáforas oníricas (mar, estrelas, labirintos).
4. Respostas curtas e poéticas.
`;

export const createChatSession = () => {
  return ai.chats.create({
    model: 'gemini-3-pro-preview',
    config: {
      systemInstruction: CHAT_SYSTEM_INSTRUCTION,
      temperature: 0.7,
    }
  });
};

const dailyInsightsSchema: Schema = {
  type: Type.OBJECT,
  properties: {
    motivation: { type: Type.STRING },
    luckyNumber: { type: Type.INTEGER },
    luckyColor: { type: Type.STRING },
    wordOfDay: { type: Type.STRING },
    wordMeaning: { type: Type.STRING },
  },
  required: ["motivation", "luckyNumber", "luckyColor", "wordOfDay", "wordMeaning"],
};

export const fetchDailyInsights = async (): Promise<DailyInsights | null> => {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash', 
      contents: 'Gere insights místicos e motivacionais para o dia de hoje.',
      config: {
        responseMimeType: 'application/json',
        responseSchema: dailyInsightsSchema,
        temperature: 1,
      }
    });

    const text = response.text;
    if (!text) return null;
    return JSON.parse(text) as DailyInsights;
  } catch (error) {
    console.error("Error fetching daily insights:", error);
    return null;
  }
};

const dreamAnalysisSchema: Schema = {
  type: Type.OBJECT,
  properties: {
    title: { type: Type.STRING },
    summary: { type: Type.STRING },
    characters: { type: Type.ARRAY, items: { type: Type.STRING } },
    places: { type: Type.ARRAY, items: { type: Type.STRING } },
    emotions: { type: Type.ARRAY, items: { type: Type.STRING } },
    symbols: { type: Type.ARRAY, items: { type: Type.STRING } },
    isNightmare: { type: Type.BOOLEAN },
    analysis: {
      type: Type.OBJECT,
      properties: {
        spiritual: { type: Type.STRING },
        psychological: { type: Type.STRING },
        cultural: { type: Type.STRING },
        ritual: {
            type: Type.OBJECT,
            properties: {
                title: { type: Type.STRING },
                steps: { type: Type.ARRAY, items: { type: Type.STRING } }
            }
        },
        dailyTheme: { type: Type.STRING },
        emotionalAlert: { type: Type.STRING },
        emotionsList: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              name: { type: Type.STRING },
              intensity: { type: Type.INTEGER, description: "0 to 10" },
              meaning: { type: Type.STRING }
            }
          }
        },
        emotionalBalanceTip: { type: Type.STRING }
      }
    },
    socialCaption: { type: Type.STRING, description: "Legenda curta e poética para Instagram/TikTok" }
  },
  required: ["title", "summary", "characters", "places", "emotions", "symbols", "analysis", "isNightmare"]
};

export const analyzeDreamRaw = async (rawText: string): Promise<Partial<DreamEntry> | null> => {
    try {
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: `Analise o relato de sonho. Estruture os dados, extraia emoções com intensidade e gere recomendações de equilíbrio:\n\n"${rawText}"`,
            config: {
                responseMimeType: 'application/json',
                responseSchema: dreamAnalysisSchema,
                temperature: 0.5
            }
        });

        const text = response.text;
        if (!text) return null;
        return JSON.parse(text);
    } catch (error) {
        console.error("Error analyzing dream:", error);
        return null;
    }
}

export const generateDreamImage = async (summary: string, style: ArtStyle = 'surreal'): Promise<string | null> => {
    try {
        const stylePrompts: Record<ArtStyle, string> = {
            'fantasy': 'Epic high fantasy digital art, magical atmosphere',
            'surreal': 'Surrealist masterpiece, Salvador Dali style, dreamlike',
            'watercolor': 'Soft watercolor painting, ethereal, bleeding colors',
            'cyberpunk': 'Cyberpunk neon noir, futuristic, vaporwave aesthetics',
            'minimalist': 'Minimalist abstract art, geometric shapes, clean lines',
            'oil': 'Classical oil painting, texture, dramatic lighting'
        };

        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash-image',
            contents: {
                parts: [
                    { text: `${stylePrompts[style]}. Visual representation of: ${summary}. High quality, artistic.` }
                ]
            }
        });

        for (const part of response.candidates?.[0]?.content?.parts || []) {
            if (part.inlineData) {
                return `data:${part.inlineData.mimeType};base64,${part.inlineData.data}`;
            }
        }
        return null;
    } catch (error) {
        console.error("Error generating dream image:", error);
        return null;
    }
}

const symbolSchema: Schema = {
  type: Type.OBJECT,
  properties: {
    name: { type: Type.STRING },
    meaning: { type: Type.STRING },
    psychological: { type: Type.STRING },
    spiritual: { type: Type.STRING },
    cultural: { type: Type.STRING },
    advice: { type: Type.STRING }
  }
};

export const lookupSymbol = async (symbol: string): Promise<SymbolDefinition | null> => {
  try {
     const response = await ai.models.generateContent({
       model: 'gemini-2.5-flash',
       contents: `Explique o simbolismo de "${symbol}" nos sonhos.`,
       config: {
         responseMimeType: 'application/json',
         responseSchema: symbolSchema
       }
     });
     return JSON.parse(response.text || '{}');
  } catch (e) {
    return null;
  }
}

const nightEnergySchema: Schema = {
    type: Type.OBJECT,
    properties: {
        message: { type: Type.STRING },
        breathing: { type: Type.STRING, description: "Instrução curta de respiração (ex: Inspire 4s, Segure 4s)" },
        intention: { type: Type.STRING, description: "Frase para repetir antes de dormir" },
        theme: { type: Type.STRING, enum: ['stars', 'moon', 'void', 'calm'] }
    }
};

export const generateNightEnergy = async (mood: string): Promise<NightEnergy | null> => {
    try {
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: `O usuário está se sentindo "${mood}". Gere uma mensagem poética de "Boa Noite" e preparação para o sono.`,
            config: {
                responseMimeType: 'application/json',
                responseSchema: nightEnergySchema
            }
        });
        return JSON.parse(response.text || '{}');
    } catch (e) {
        return null;
    }
}
