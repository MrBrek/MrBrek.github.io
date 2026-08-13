import { getModel } from "./models";

export class AIServiceError extends Error {
  status: number;
  code: string;

  constructor(message: string, code: string, status = 502) {
    super(message);
    this.name = "AIServiceError";
    this.code = code;
    this.status = status;
  }
}

const REQUEST_TIMEOUT_MS = 90_000;

export function getAIConfig() {
  const baseUrl = process.env.AI_BASE_URL?.replace(/\/$/, "");
  const apiKey = process.env.AI_API_KEY;
  if (!baseUrl || !apiKey) {
    throw new AIServiceError("AI service is not configured.", "not_configured", 503);
  }
  return { baseUrl, apiKey };
}

export async function requestAIStream(input: {
  model: string;
  messages: Array<{ role: string; content: string }>;
  signal?: AbortSignal;
}) {
  const config = getAIConfig();
  if (!getModel(input.model)) {
    throw new AIServiceError("The selected model is not available.", "invalid_model", 400);
  }

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);
  const abort = () => controller.abort();
  input.signal?.addEventListener("abort", abort, { once: true });

  try {
    const response = await fetch(`${config.baseUrl}/chat/completions`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "text/event-stream",
        Authorization: `Bearer ${config.apiKey}`,
      },
      body: JSON.stringify({ model: input.model, messages: input.messages, stream: true }),
      signal: controller.signal,
    });

    if (!response.ok) {
      if (response.status === 401 || response.status === 403) {
        throw new AIServiceError("The AI service rejected the configured credentials.", "invalid_key", 502);
      }
      if (response.status === 429) {
        throw new AIServiceError("The AI service is rate limited. Try again shortly.", "provider_rate_limit", 429);
      }
      if (response.status === 400) {
        throw new AIServiceError("The AI service rejected this request.", "provider_bad_request", 502);
      }
      throw new AIServiceError("The AI service returned an unexpected error.", "provider_error", 502);
    }
    if (!response.body) {
      throw new AIServiceError("The AI service returned an empty response.", "empty_response", 502);
    }
    return response;
  } catch (error) {
    if (error instanceof AIServiceError) throw error;
    if (error instanceof DOMException && error.name === "AbortError") {
      throw new AIServiceError("The AI service request timed out.", "timeout", 504);
    }
    throw new AIServiceError("Couldn't connect to the AI service.", "network_error", 502);
  } finally {
    clearTimeout(timeout);
    input.signal?.removeEventListener("abort", abort);
  }
}

export async function checkAIHealth() {
  const config = getAIConfig();
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 4_000);
  try {
    const response = await fetch(`${config.baseUrl}/models`, {
      headers: { Accept: "application/json", Authorization: `Bearer ${config.apiKey}` },
      signal: controller.signal,
      cache: "no-store",
    });
    if (response.status === 401 || response.status === 403) {
      return { connected: false, message: "Credentials rejected" };
    }
    return response.ok
      ? { connected: true, message: "Connected" }
      : { connected: false, message: "Service unavailable" };
  } catch (error) {
    return {
      connected: false,
      message: error instanceof DOMException && error.name === "AbortError" ? "Timed out" : "Unavailable",
    };
  } finally {
    clearTimeout(timeout);
  }
}
