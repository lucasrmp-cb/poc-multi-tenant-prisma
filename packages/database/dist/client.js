"use strict";
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __reExport = (target, mod, secondTarget) => (__copyProps(target, mod, "default"), secondTarget && __copyProps(secondTarget, mod, "default"));
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// src/client.ts
var client_exports = {};
__export(client_exports, {
  filterTenantData: () => filterTenantData,
  prisma: () => prisma,
  setupTenant: () => setupTenant
});
module.exports = __toCommonJS(client_exports);
var import_client = require("@prisma/client");
__reExport(client_exports, require("@prisma/client"), module.exports);
var globalForPrisma = global;
var currentTenant = null;
var setupTenant = (newTenant) => {
  currentTenant = newTenant;
};
var filterTenantData = import_client.Prisma.defineExtension((client) => {
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
          args = args;
          return query({
            ...args,
            where: {
              ...args.where ?? {},
              tenantId: currentTenant
            }
          });
        }
      }
    }
  });
});
var prisma = globalForPrisma.prisma || new import_client.PrismaClient().$extends(filterTenantData);
if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  filterTenantData,
  prisma,
  setupTenant,
  ...require("@prisma/client")
});
