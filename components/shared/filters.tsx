"use client";

import React, { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import { useRouter, useSearchParams } from "next/navigation";
import { SearchIvent } from "./search-ivent";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";

interface Category {
  id: number;
  name: string;
}

interface Props {
  className?: string;
}

export const Filters: React.FC<Props> = ({ className }) => {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [price, setPrice] = useState<string>(
    searchParams.get("price") || "any"
  );
  const [category, setCategory] = useState<string>(
    searchParams.get("categoryId") || "any"
  );
  const [age, setAge] = useState<string>(searchParams.get("age") || "any");
  const [categories, setCategories] = useState<Category[]>([]);

  useEffect(() => {
    async function fetchCategories() {
      try {
        const response = await fetch("/api/categories");
        const data = await response.json();
        setCategories(data);
      } catch (error) {
        console.error("Ошибка при загрузке категорий:", error);
      }
    }

    fetchCategories();
  }, []);

  const handleFilterChange = (key: string, value: string) => {
    const params = new URLSearchParams(searchParams.toString());

    if (value === "any" || value === "all") {
      params.delete(key);
    } else {
      params.set(key, value);
    }

    router.push(`?${params.toString()}`);
  };

  const handlePriceChange = (value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    let minPrice = "any";
    let maxPrice = "any";

    if (value === "0-1000") {
      minPrice = "0";
      maxPrice = "1000";
    } else if (value === "1000-3000") {
      minPrice = "1000";
      maxPrice = "3000";
    } else if (value === "3000+") {
      minPrice = "3000";
      maxPrice = "20000";
    }

    if (value === "any") {
      params.delete("minPrice");
      params.delete("maxPrice");
    } else {
      params.set("minPrice", minPrice);
      params.set("maxPrice", maxPrice);
    }

    router.push(`?${params.toString()}`);
    setPrice(value);
  };

  const handleCategoryChange = (value: string) => {
    const params = new URLSearchParams(searchParams.toString());

    if (value === "any") {
      params.delete("categoryId");
    } else {
      params.set("categoryId", value);
    }

    router.push(`?${params.toString()}`);
    setCategory(value);
  };

  const handleAgeChange = (value: string) => {
    const params = new URLSearchParams(searchParams.toString());

    if (value === "any") {
      params.delete("age");
    } else {
      params.set("age", value);
    }

    router.push(`?${params.toString()}`);
    setAge(value);
  };

  const handleReset = () => {
    setPrice("any");
    setCategory("any");
    setAge("any");
    router.push(window.location.pathname);
  };

  // Проверяем, если все фильтры на дефолтных значениях
  const allFiltersDefault =
    price === "any" && category === "any" && age === "any";

  return (
    <div
      className={cn("flex justify-between items-center gap-[30px]", className)}
    >
      <div className="flex flex-wrap gap-4">
        <SearchIvent /> {/* Компонент поиска */}
        {/* Фильтр по цене */}
        <Select value={price} onValueChange={handlePriceChange}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Цена" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="any">Любая цена</SelectItem>
            <SelectItem value="0-1000">До 1000₽</SelectItem>
            <SelectItem value="1000-3000">1000₽–3000₽</SelectItem>
            <SelectItem value="3000+">Больше 3000₽</SelectItem>
          </SelectContent>
        </Select>
        {/* Фильтр по категории */}
        <Select value={category} onValueChange={handleCategoryChange}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Категория" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="any">Все категории</SelectItem>
            {categories.map((category) => (
              <SelectItem key={category.id} value={category.id.toString()}>
                {category.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {/* Фильтр по возрасту */}
        <Select value={age} onValueChange={handleAgeChange}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Возраст" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="any">Любой возраст</SelectItem>
            <SelectItem value="14">14+</SelectItem>
            <SelectItem value="16">16+</SelectItem>
            <SelectItem value="18">18+</SelectItem>
          </SelectContent>
        </Select>
        {/* Кнопка сбросить */}
        {!allFiltersDefault && (
          <Button variant="outline" onClick={handleReset}>
            Сбросить фильтры
          </Button>
        )}
      </div>

      <div className="font-[18px] text-[#333333]">187 событий</div>
    </div>
  );
};
