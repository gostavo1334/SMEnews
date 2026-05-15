export interface Category {
  id: number
  name: string
  slug: string
}

export interface Post {
  id: number
  title: string
  slug: string
  content?: string
  featuredImage?: string | null
  published?: boolean
  publishedAt: Date | string
  createdAt: Date | string
  updatedAt?: Date | string
  viewCount?: number
  seoTitle?: string | null
  metaDesc?: string | null
  categoryId?: number | null
  authorId?: number | null
}

export interface Advertisement {
  id: number
  title: string
  position: string
  imageUrl: string
  linkUrl: string | null
  active: boolean
  createdAt: Date | string
  updatedAt: Date | string
}

export interface User {
  id: number
  name: string | null
  email: string | null
  emailVerified: Date | string | null
  image: string | null
}

export type PostWithRelations = Post & {
  category?: Category | null
  author?: User | null
}

export interface Report {
  id: number
  postId: number
  reason: string
  status: string
  createdAt: Date | string
  post: {
    title: string
    slug: string
  }
}

export interface Book {
  id: number
  title: string
  coverImage: string
  fileUrl: string
  createdAt: Date | string
}
