import Image from "next/image";
import { FileDown, BookOpen } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Book } from "@/types/prisma";

export function BookCard({ book }: { book: Book }) {
  return (
    <div className="group bg-card rounded-xl border border-border/50 overflow-hidden hover:shadow-xl hover:shadow-primary/5 transition-all duration-300 flex flex-col h-full">
      <div className="relative aspect-[3/4] overflow-hidden bg-muted/30">
        {book.coverImage ? (
          <Image 
            src={book.coverImage} 
            alt={book.title} 
            fill 
            className="object-cover group-hover:scale-105 transition-transform duration-500"
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center bg-primary/5">
            <BookOpen className="size-12 text-primary/20" />
          </div>
        )}
      </div>
      <div className="p-5 flex-grow flex flex-col">
        <h4 className="font-bold text-lg KhmerOS line-clamp-2 mb-4 group-hover:text-primary transition-colors leading-snug">
          {book.title}
        </h4>
        
        <div className="flex items-center justify-end mt-auto pt-4 border-t border-border/50">
          <a href={`/api/download?url=${encodeURIComponent(book.fileUrl)}&name=${encodeURIComponent(book.title)}`} target="_blank" rel="noreferrer">
            <Button size="sm" variant="outline" className="gap-2 h-9 rounded-lg border-primary/20 hover:border-primary/50 text-primary hover:bg-primary/5 transition-all group-hover:border-primary">
              <FileDown className="size-3.5" />
              <span className="KhmerOS text-xs">ទាញយក</span>
            </Button>
          </a>
        </div>
      </div>
    </div>
  );
}
