export type Lang = "ar" | "en" | "fr";

export type HouseId = "development" | "video_editing" | "drawing" | "design";

export type RoleId =
  | "events_management"
  | "external_relations"
  | "sesc_coffee"
  | "server_management"
  | "acting"
  | "photography";

export interface HatResult {
  personality_type: string;
  personality_paragraph: string;
  primary_house: { id: HouseId; name: string; reason: string };
  alternative_role: { id: RoleId; name: string; reason: string };
  first_quest: string;
}

/** What the n8n webhook returns */
export type HatResponse =
  | { status: "asking"; language: Lang | null; message: string }
  | { status: "decided"; language: Lang; message: string; result: HatResult }
  | { status: "error"; code: string; language: Lang | null; message: string };

/** What the chat UI renders */
export interface ChatMessage {
  id: string;
  from: "hat" | "student";
  text: string;
}
