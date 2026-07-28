export type Role = "TOP" | "JG" | "MID" | "ADC" | "SUP";

export interface Champion {
  id: string;      // Ahri
  key: string;     // 103
  name: string;    // アーリ
  image: string;   // Ahri.png
  roles: Role[];
}