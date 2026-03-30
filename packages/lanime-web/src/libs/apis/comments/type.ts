export interface IComment {
    commentId: string
    profileId: string
    profileName: string
    avatarUrl: string | null
    content: string
    replyCount: number
    createdAt: string
    updatedAt: string
    parentCommentId: string | null
}

export interface ICommentListResponse {
    comments: IComment[]
    totalCount: number
    page: number
    limit: number
}

export interface ICreateCommentRequest {
    content: string
    parentCommentId?: string
}

export interface IUpdateCommentRequest {
    content: string
}
