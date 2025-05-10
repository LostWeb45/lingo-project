import { prisma } from "@/prisma/prisma-client";
import { NextRequest, NextResponse } from "next/server";
import { Prisma } from "@prisma/client";

export async function GET(request: NextRequest) {
  const query = request.nextUrl.searchParams.get("query") || "";
  const minPrice = request.nextUrl.searchParams.get("minPrice");
  const maxPrice = request.nextUrl.searchParams.get("maxPrice");
  const categoryId = request.nextUrl.searchParams.get("categoryId");
  const townId = request.nextUrl.searchParams.get("townId");
  const statusId = request.nextUrl.searchParams.get("statusId");
  const age = request.nextUrl.searchParams.get("age");
  const availableOnly =
    request.nextUrl.searchParams.get("availableOnly") === "true";
  const limit = parseInt(request.nextUrl.searchParams.get("limit") || "9");
  const offset = parseInt(request.nextUrl.searchParams.get("offset") || "0");

  const filters = {
    title: {
      contains: query,
      mode: "insensitive" as Prisma.QueryMode,
    },
    archive: false,
    ...(minPrice &&
      maxPrice && {
        price: { gte: parseInt(minPrice), lte: parseInt(maxPrice) },
      }),
    ...(categoryId && { categoryId: parseInt(categoryId) }),
    ...(townId && { townId: parseInt(townId) }),
    ...(statusId && { statusId: parseInt(statusId) }),
    ...(age && { age: { lte: parseInt(age) } }),
  };

  const events = await prisma.event.findMany({
    where: filters,
    orderBy: { startDate: "asc" },
    include: {
      participants: true,
      createdBy: true,
      category: true,
      town: true,
      status: true,
      images: true,
    },
    skip: offset,
    take: limit * 2,
  });

  const rawEvents = await prisma.event.findMany({
    where: filters,
    orderBy: { startDate: "asc" },
    include: {
      participants: true,
      createdBy: true,
      category: true,
      town: true,
      status: true,
      images: true,
    },
    skip: offset,
    take: limit * 2,
  });

  const filteredEvents = availableOnly
    ? rawEvents.filter(
        (event) =>
          !event.participantsCount ||
          event.participants.length < event.participantsCount
      )
    : rawEvents;

  return NextResponse.json({
    events: filteredEvents.slice(0, limit),
    hasMore: rawEvents.length > limit,
  });
}
