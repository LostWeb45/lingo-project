import { CategoriesList, Container, Title } from "@/components/shared";
import React from "react";

export default async function CategoriesPage() {
  return (
    <Container>
      <Title text={"Категории"} className="font-semibold" />
      <CategoriesList className="mt-[27px]" />
    </Container>
  );
}
