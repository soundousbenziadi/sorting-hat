import type { HouseId } from "../types";

import developmentImg from "../assets/houses/development.png";
import videoEditingImg from "../assets/houses/videoEditing.png";
import drawingImg from "../assets/houses/drawing.png";
import designImg from "../assets/houses/design.png";

export interface HouseTheme {
  image: string;
  bg: string;
  border: string;
  glow: string;
  gradient: string;
}

export const HOUSES: Record<HouseId, HouseTheme> = {
  development: {
    image: developmentImg,
    bg: "bg-department3",
    border: "border-department3",
    glow: "shadow-[0_0_70px_-10px_var(--color-department3)]",
    gradient: "from-department3/40",
  },
  video_editing: {
    image: videoEditingImg,
    bg: "bg-department1",
    border: "border-department1",
    glow: "shadow-[0_0_70px_-10px_var(--color-department1)]",
    gradient: "from-department1/40",
  },
  drawing: {
    image: drawingImg,
    bg: "bg-department4",
    border: "border-department4",
    glow: "shadow-[0_0_70px_-10px_var(--color-department4)]",
    gradient: "from-department4/40",
  },
  design: {
    image: designImg,
    bg: "bg-department2",
    border: "border-department2",
    glow: "shadow-[0_0_70px_-10px_var(--color-department2)]",
    gradient: "from-department2/40",
  },
};

export function getHouseTheme(id: string): HouseTheme {
  return HOUSES[id as HouseId] ?? HOUSES.development;
}
