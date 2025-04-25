import { getUserSession } from "@/lib/get-user-session";
import { prisma } from "@/prisma/prisma-client";
import { Prisma } from "@prisma/client";
import { hashSync } from "bcryptjs";

export async function updateUserInfo(body: Prisma.UserCreateInput) {
  try {
    const currentUser = await getUserSession();

    if (!currentUser) {
      throw new Error("Пользователь не найден");
    }

    await prisma.user.update({
      where: {
        id: Number(currentUser.id),
      },
      data: {
        name: body.name,
        email: body.email,
        password: hashSync(body.password, 10),
      },
    });
  } catch (err) {
    console.log("Error [UPDATE_USER]", err);
    throw err;
  }
}
