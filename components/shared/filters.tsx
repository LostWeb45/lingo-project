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
import { Category } from "@prisma/client";

interface Props {
  className?: string;
}

const priceOptions = [
  { label: "Любая цена", value: "any" },
  { label: "До 1000₽", value: "0-1000" },
  { label: "1000₽–3000₽", value: "1000-3000" },
  { label: "Больше 3000₽", value: "3000+" },
];

const ageOptions = [
  { label: "Любой возраст", value: "any" },
  { label: "14+", value: "14" },
  { label: "16+", value: "16" },
  { label: "18+", value: "18" },
];

export const Filters: React.FC<Props> = ({ className }) => {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [price, setPrice] = useState(searchParams.get("price") || "any");
  const [category, setCategory] = useState(
    searchParams.get("categoryId") || "any"
  );
  const [age, setAge] = useState(searchParams.get("age") || "any");
  const [categories, setCategories] = useState<Category[]>([]);

  useEffect(() => {
    fetch("/api/categories")
      .then((res) => res.json())
      .then(setCategories)
      .catch((err) => console.error("Ошибка при загрузке категорий:", err));
  }, []);

  const updateParams = (updates: Record<string, string | null>) => {
    const params = new URLSearchParams(searchParams.toString());
    Object.entries(updates).forEach(([key, value]) =>
      value ? params.set(key, value) : params.delete(key)
    );
    router.push(`?${params.toString()}`);
  };

  const handlePriceChange = (value: string) => {
    setPrice(value);
    if (value === "any") {
      updateParams({ minPrice: null, maxPrice: null });
    } else {
      const [minPrice, maxPrice] =
        value === "3000+" ? ["3000", "20000"] : value.split("-");
      updateParams({ minPrice, maxPrice });
    }
  };

  const handleChange = (
    key: string,
    value: string,
    setter: (val: string) => void
  ) => {
    setter(value);
    updateParams({ [key]: value === "any" ? null : value });
  };

  const handleReset = () => {
    setPrice("any");
    setCategory("any");
    setAge("any");
    router.push(window.location.pathname);
  };

  const allFiltersDefault =
    price === "any" && category === "any" && age === "any";

  return (
    <div
      className={cn("flex justify-between items-center gap-[30px]", className)}
    >
      <div className="flex items-center flex-wrap gap-4">
        {/* Название */}
        <SearchIvent />
        {/* Цена */}
        <Select value={price} onValueChange={handlePriceChange}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Цена" />
          </SelectTrigger>
          <SelectContent>
            {priceOptions.map((opt) => (
              <SelectItem key={opt.value} value={opt.value}>
                {opt.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {/* Категория */}
        <Select
          value={category}
          onValueChange={(v) => handleChange("categoryId", v, setCategory)}
        >
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Категория" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="any">Все категории</SelectItem>
            {categories.map((c) => (
              <SelectItem key={c.id} value={String(c.id)}>
                {c.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {/* Возраст */}
        <Select
          value={age}
          onValueChange={(v) => handleChange("age", v, setAge)}
        >
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Возраст" />
          </SelectTrigger>
          <SelectContent>
            {ageOptions.map((opt) => (
              <SelectItem key={opt.value} value={opt.value}>
                {opt.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {!allFiltersDefault && (
          <span
            onClick={handleReset}
            className="text-sm  text-[#1D3C6A] underline-offset-2 cursor-pointer hover:underline transition"
          >
            Сбросить
          </span>
        )}
      </div>
      <div className="font-[18px] text-[#333333]">187 событий</div>
    </div>
  );
};
