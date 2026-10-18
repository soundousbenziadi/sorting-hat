import type { HatResponse } from "../types";

const API_URL = import.meta.env.VITE_HAT_API_URL as string;

export class HatNetworkError extends Error {
  code: string;

  constructor(code: string) {
    super(code);
    this.code = code;
  }
}

interface Payload {
  sessionId: string;
  message: string;
  turn: number;
}

export async function sendToHat(payload: Payload): Promise<HatResponse> {
  let res: Response;
  try {
    res = await fetch(API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
      signal: AbortSignal.timeout(30_000),
    });
  } catch {
    throw new HatNetworkError("network");
  }

  if (!res.ok) throw new HatNetworkError(`http_${res.status}`);

  const data = await res.json().catch(() => null);
  if (!data || typeof data.status !== "string") {
    throw new HatNetworkError("bad_response");
  }
  return data as HatResponse;
}
