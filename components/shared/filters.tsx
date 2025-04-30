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

  const [price, setPrice] = useState<string>(
    searchParams.get("price") || "any"
  );
  const [category, setCategory] = useState<string>(
    searchParams.get("category") || "all"
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

  const handleReset = () => {
    setPrice("any");
    setCategory("all");
    setAge("any");
    router.push(window.location.pathname);
  };

  // Проверяем, если все фильтры на дефолтных значениях
  const allFiltersDefault =
    price === "any" && category === "all" && age === "any";

  return (
    <div
      className={cn("flex justify-between items-center gap-[30px]", className)}
    >
      <div className="flex flex-wrap gap-4">
        <SearchIvent />

        {/* Фильтр по цене */}
        <Select
          value={price}
          onValueChange={(value) => {
            setPrice(value);
            handleFilterChange("price", value);
          }}
        >
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
        <Select
          value={category}
          onValueChange={(value) => {
            setCategory(value);
            handleFilterChange("category", value);
          }}
        >
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Категория" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Все категории</SelectItem>
            <SelectItem value="concert">Концерты</SelectItem>
            <SelectItem value="exhibition">Выставки</SelectItem>
            <SelectItem value="sports">Спорт</SelectItem>
          </SelectContent>
        </Select>

        {/* Фильтр по возрасту */}
        <Select
          value={age}
          onValueChange={(value) => {
            setAge(value);
            handleFilterChange("age", value);
          }}
        >
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Возраст" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="any">Любой возраст</SelectItem>
            <SelectItem value="0-12">0–12 лет</SelectItem>
            <SelectItem value="13-18">13–18 лет</SelectItem>
            <SelectItem value="18+">18+</SelectItem>
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
