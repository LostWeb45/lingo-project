import { Container, EventList, Filters, Title } from "@/components/shared";
import React from "react";

interface Props {
  params: { id: string };
  className?: string;
}

export default function EventPage({ params }: Props) {
  //   const { id } = await params;

  return <Container>{params.id}</Container>;
}
