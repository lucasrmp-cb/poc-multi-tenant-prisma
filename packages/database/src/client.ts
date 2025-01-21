import { Prisma, PrismaClient } from "@prisma/client";
const globalForPrisma = global as unknown as { prisma: PrismaClient };

let currentTenant: string | null = null;

export const setupTenant = (newTenant: string) => {
  currentTenant = newTenant;
};

export const filterTenantData = Prisma.defineExtension((client) => {
  return client.$extends({
    name: "filterTenant",
    query: {
      $allModels: {
        $allOperations({ args, query, operation }) {
          if (!currentTenant) {
            throw new Error("Tenant not setup");
          }

          if (operation === "create") {
            return query(args);
          }

          args = args as Extract<typeof args, { where: unknown }>;

          return query({
            ...args,
            where: {
              ...((args.where as unknown) ?? {}),
              tenantId: currentTenant,
            },
          });
        },
      },
    },
  });
});

export const prisma =
  globalForPrisma.prisma || new PrismaClient().$extends(filterTenantData);

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;

export * from "@prisma/client";
