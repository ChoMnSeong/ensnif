import { IUser } from "../auth/type"

export interface IReviewRequest {
  content: string
}

export interface IReview {
  id: number
  content: string
  user: IUser
}
