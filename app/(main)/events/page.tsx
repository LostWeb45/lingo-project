import { Container, EventList, Filters, Title } from "@/components/shared";
import React from "react";

interface Props {
  className?: string;
}

export default function CategoriesPage() {
  return (
    <Container>
      <Title text={"Все события"} className="font-semibold" />
      <Filters className="mt-[27px]" />
      <EventList />
    </Container>
  );
}
