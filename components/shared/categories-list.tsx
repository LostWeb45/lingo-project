"use client";

import React, { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import { CategoryItem } from "./category-item";
import { Skeleton } from "../ui/skeleton";
import axios from "axios";

interface Props {
  className?: string;
}

interface Category {
  id: number;
  name: string;
  image: string | null;
  eventsCount: number;
}

export const CategoriesList: React.FC<Props> = ({ className }) => {
  const [categories, setCategories] = useState<Category[] | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await axios.get<Category[]>("/api/categories");
        setCategories(res.data);
      } catch (error) {
        console.error("Ошибка загрузки категорий", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  return (
    <div
      className={cn(
        "grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5",
        className
      )}
    >
      {loading
        ? Array.from({ length: 6 }).map((_, index) => (
            <Skeleton key={index} className="h-[105px] rounded-[1px]" />
          ))
        : categories?.map((category) => (
            <CategoryItem
              key={category.id}
              title={category.name}
              imageUrl={category.image || "/placeholder.png"}
              id={category.id}
              eventsCount={category.eventsCount}
            />
          ))}
    </div>
  );
};
