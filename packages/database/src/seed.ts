import { prisma } from "./client";

import type { User } from "@prisma/client";

const DEFAULT_USERS = [
  {
    name: "Tim Apple",
    email: "tim@apple.com",
    tenantId: "US",
  },
  {
    name: "John",
    email: "john@apple.com",
    tenantId: "US",
  },
  {
    name: "Elizabeth",
    email: "beth@apple.com",
    tenantId: "UK",
  },
  {
    name: "Doe",
    email: "doe@apple.com",
    tenantId: "UK",
  },
] as Array<Partial<User>>;

(async () => {
  try {
    await Promise.all(
      DEFAULT_USERS.map((user) =>
        prisma.user.upsert({
          where: {
            email: user.email!,
          },
          update: {
            ...user,
          },
          create: {
            ...user,
          },
        })
      )
    );
  } catch (error) {
    console.error(error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
})();
