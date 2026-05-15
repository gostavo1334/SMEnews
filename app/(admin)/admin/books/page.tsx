'use server'

import { getBooks } from '@/app/actions/book-actions'
import BooksClient from './books-client'

export default async function AdminBooksPage() {
  const books = await getBooks()
  return <BooksClient initialBooks={books as any} />
}
