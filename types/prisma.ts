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
  emailVerified: Date | string | null | any
  image: string | null
}

export type PostWithRelations = Post & {
  category?: Category | null
  author?: User | null
}
