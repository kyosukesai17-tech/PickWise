export type Role = "TOP" | "JG" | "MID" | "ADC" | "SUP";

export interface Champion {
  id: string;
  name: string;
  image: string;
  roles: Role[];
}