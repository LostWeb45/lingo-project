"use client";

import React, { useState } from "react";
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

interface Props {
  className?: string;
}

export const Filters: React.FC<Props> = ({ className }) => {
  const router = useRouter();
  const searchParams = useSearchParams();

  // Инициализация параметров из URL
  const [price, setPrice] = useState<string>(
    searchParams.get("price") || "any"
  );
  const [category, setCategory] = useState<string>(
    searchParams.get("categoryId") || "any"
  );
  const [age, setAge] = useState<string>(searchParams.get("age") || "any");

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
      maxPrice = "any";
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
      params.set("categoryId", value); // Теперь используем categoryId
    }

    router.push(`?${params.toString()}`);
    setCategory(value);
  };

  const handleAgeChange = (value: string) => {
    const params = new URLSearchParams(searchParams.toString());

    if (value === "any") {
      params.delete("age");
    } else {
      params.set("age", value); // Передаем минимальный возраст
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
            <SelectItem value="1">Концерты</SelectItem> {/* ID категории 1 */}
            <SelectItem value="2">Выставки</SelectItem> {/* ID категории 2 */}
            <SelectItem value="3">Спорт</SelectItem> {/* ID категории 3 */}
          </SelectContent>
        </Select>
        {/* Фильтр по возрасту */}
        <Select value={age} onValueChange={handleAgeChange}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Возраст" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="any">Любой возраст</SelectItem>
            <SelectItem value="20">20+</SelectItem> {/* Возраст 20+ */}
            <SelectItem value="30">30+</SelectItem> {/* Возраст 30+ */}
            <SelectItem value="40">40+</SelectItem> {/* Возраст 40+ */}
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
