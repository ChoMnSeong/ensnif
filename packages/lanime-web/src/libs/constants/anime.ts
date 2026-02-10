export type AnimeStatus = "upcoming" | "airing" | "finished";
export type AnimeType = "TVA" | "OVA" | "ONA" | "MOVIE";

export const statusLabelMap = {
  upcoming: "방영 예정",
  airing: "방영 중",
  finished: "방영 완료",
} as const;

export const typeLabelMap = {
  TVA: "TV 애니메이션",
  OVA: "OVA (비디오)",
  ONA: "ONA (온라인)",
  MOVIE: "극장판",
} as const;
