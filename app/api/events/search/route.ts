import { prisma } from "@/prisma/prisma-client";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const query = request.nextUrl.searchParams.get("query") || "";
  const minPrice = request.nextUrl.searchParams.get("minPrice");
  const maxPrice = request.nextUrl.searchParams.get("maxPrice");
  const categoryId = request.nextUrl.searchParams.get("categoryId");
  const townId = request.nextUrl.searchParams.get("townId");
  const statusId = request.nextUrl.searchParams.get("statusId");
  const age = request.nextUrl.searchParams.get("age");

  const minPriceInt = minPrice ? parseInt(minPrice) : undefined;
  const maxPriceInt = maxPrice ? parseInt(maxPrice) : undefined;
  const categoryIdInt = categoryId ? parseInt(categoryId) : undefined;
  const townIdInt = townId ? parseInt(townId) : undefined;
  const statusIdInt = statusId ? parseInt(statusId) : undefined;
  const ageInt = age ? parseInt(age) : undefined;

  const events = await prisma.event.findMany({
    where: {
      title: {
        contains: query,
        mode: "insensitive",
      },
      archive: false,
      ...(minPriceInt &&
        maxPriceInt && {
          price: {
            gte: minPriceInt,
            lte: maxPriceInt,
          },
        }),
      ...(categoryIdInt && {
        categoryId: categoryIdInt,
      }),
      ...(townIdInt && {
        townId: townIdInt,
      }),
      ...(statusIdInt && {
        statusId: statusIdInt,
      }),
      ...(ageInt && {
        age: {
          lte: ageInt,
        },
      }),
    },
    take: 5,
    orderBy: {
      startDate: "asc",
    },
    include: {
      category: true,
      town: true,
      status: true,
      images: true,
    },
  });

  return NextResponse.json(events);
}
