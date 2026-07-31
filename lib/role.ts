import type { Role } from "../types/champion";

export const ROLE_INDEX = {
  TOP: 0,
  JG: 1,
  MID: 2,
  ADC: 3,
  SUP: 4,
} as const satisfies Record<Role, number>;