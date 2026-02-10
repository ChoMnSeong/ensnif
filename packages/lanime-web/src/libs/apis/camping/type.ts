import { IReview } from "../review/type"

export interface ICamping {
  campingID: number
  recommend: number
  mainImage: string
  images: string[]
  placeName: string
  country: string
  address: string
  number: string
  period: string[]
  homepage: string | null
  content: string
  facility: ("electron" | "hot water" | "playground" | "pool" | "exercise facility" | "store")[]
  like: boolean
  like_count: number
  reviews: IReview[]
}

export interface ICampingResponse {
  length: number
  data: ICamping[]
}

export interface ICampingBest {
  campingID: number
  placeName: string
  mainImage: string
}

export interface ICampingBestResponse {
  data: ICampingBest[]
}
