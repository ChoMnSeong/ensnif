import { CommonResponse } from "../../types/type";

export interface AdData {
  id: string;
  webImageURL: string;
  logoImageURL: string;
  linkURL: string;
}

export interface AdListResponse extends CommonResponse {
  data: AdData[];
}
