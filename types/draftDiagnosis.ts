export type DiagnosisStatus = "WARNING" | "CAUTION" | "GOOD";

export type DraftDiagnosisItem = Readonly<{
  id: string;
  label: string;
  description?: string;
  status: DiagnosisStatus;
}>;
