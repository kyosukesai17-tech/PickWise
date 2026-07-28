export type Role =
  | "TOP"
  | "JG"
  | "MID"
  | "ADC"
  | "SUP";

export interface Champion {
  id: string;
  name: string;
  roles: Role[];
  image: string;
}