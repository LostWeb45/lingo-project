import React from "react";
import { cn } from "@/lib/utils";
import Link from "next/link";

interface Props {
  title: string;
  imageUrl: string;
  id: number; // Теперь используем id, а не slug
  eventsCount: number;
  className?: string;
}

export const CategoryItem: React.FC<Props> = ({
  title,
  imageUrl,
  id,
  eventsCount,
  className,
}) => {
  return (
    <Link className={cn(className)} href={`/categories/${id}`}>
      {" "}
      {/* Ссылка теперь на /categories/[id] */}
      <div className="flex h-[105px] bg-[#F5F6FA] transition">
        <img src={imageUrl} alt={title} className="w-full h-40 object-cover" />
        <div className="p-4">
          <h2 className="text-xl font-semibold">{title}</h2>
          <p>
            {eventsCount} {eventsCount === 1 ? "событие" : "событий"}
          </p>
        </div>
      </div>
    </Link>
  );
};
