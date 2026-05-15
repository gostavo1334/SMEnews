import { getBooks } from "@/app/actions/book-actions";
import { BookCard } from "@/components/books/book-card";
import { Download, BookOpen } from "lucide-react";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "បណ្ណាល័យសៀវភៅ | SME NEWS",
  description: "ទាញយកសៀវភៅ ឯកសារ និងចំណេះដឹងផ្សេងៗដែលពាក់ព័ន្ធនឹងសហគ្រិនភាព និងការធ្វើអាជីវកម្ម",
};

export default async function DownloadsPage() {
  const books = await getBooks();

  return (
    <div className="lg:col-span-2 space-y-10">

      {/* Grid Section */}
      <div>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold font-heading flex items-center gap-2">
            <BookOpen className="size-5 text-primary" />
            សៀវភៅទាំងអស់ ({books.length})
          </h2>
          <div className="h-px flex-grow mx-4 bg-border/50 hidden sm:block" />
        </div>

        {books.length === 0 ? (
          <div className="text-center py-24 bg-muted/10 rounded-[2rem] border border-dashed border-border/50">
            <div className="bg-muted/20 size-20 rounded-full flex items-center justify-center mx-auto mb-6">
              <Download className="size-10 text-muted-foreground/30" />
            </div>
            <h3 className="text-xl font-bold KhmerOS mb-2">មិនទាន់មានសៀវភៅនៅឡើយទេ</h3>
            <p className="text-muted-foreground KhmerOS">សូមរង់ចាំ និងតាមដានការអាប់ដេតថ្មីៗ</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
            {books.map((book) => (
              <BookCard key={book.id} book={book} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
