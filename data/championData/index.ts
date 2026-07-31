import { championDataAD } from "./A-D";
import { championDataEH } from "./E-H";
import { championDataIL } from "./I-L";
import { championDataMP } from "./M-P";
import { championDataQT } from "./Q-T";
import { championDataUZ } from "./U-Z";
import { defaultChampionData } from "./default";

export const championData = {
  ...championDataAD,
  ...championDataEH,
  ...championDataIL,
  ...championDataMP,
  ...championDataQT,
  ...championDataUZ,
};

export { defaultChampionData };
