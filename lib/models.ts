export type AIModel = {
  id: string;
  name: string;
  provider: string;
  description: string;
};

export const models: AIModel[] = [
  {
    id: "gc/gemini-3.1-pro-preview",
    name: "Gemini 3.1 Pro Preview",
    provider: "Google",
    description: "Strong general-purpose reasoning and writing",
  },
];

export const defaultModel = process.env.AI_MODEL || models[0].id;

export function getModel(id: string) {
  return models.find((model) => model.id === id);
}
