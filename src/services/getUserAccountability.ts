import type { Accountability } from "@directus/shared/types"
import getDatabase from "directus/database/index"
import type { Request } from "express"
import type { Knex } from "knex"

import Role from "../declaration/knex/Role.js"
import User from "../declaration/knex/User.js"
import type { ActionHookContext } from "../types/RegisterHook/ActionHookHandler.js"
import type { FilterHookContext } from "../types/RegisterHook/FilterHookHandler.js"

async function getUserAccountability(
  reqOrFilterCtxOrActionCtx: Request | FilterHookContext | ActionHookContext,
  userId: string,
): Promise<Accountability | undefined> {
  let db: Knex
  if ("database" in reqOrFilterCtxOrActionCtx) {
    db = reqOrFilterCtxOrActionCtx.database
  } else {
    db = getDatabase.default()
  }

  type Result =
    | Pick<User & Role, "id" | "role" | "admin_access" | "app_access">
    | undefined

  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment -- `result` have the correct type. Eslint can't lint first()
  const result: Result = await db("directus_users")
    .select(
      db.ref("id").withSchema("directus_users"),
      db.ref("role").withSchema("directus_users"),
      db.ref("admin_access").withSchema("directus_roles"),
      db.ref("app_access").withSchema("directus_roles"),
    )
    .leftJoin("directus_roles", "directus_users.role", "directus_roles.id")
    .where({
      id: userId,
      status: "active",
    })
    // .where("directus_users.id", "=", userId)
    .first()

  const accountability: Accountability | undefined = result
    ? {
        user: result.id,
        role: result.role,
        admin: result.admin_access,
        app: result.app_access,
      }
    : undefined

  console.log(`📣 : accountability:`, accountability)
  return accountability
}

export default getUserAccountability
