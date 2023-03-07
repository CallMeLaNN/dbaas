import type { Accountability } from "@directus/shared/types"
import { InvalidCredentialsException, ItemsService } from "directus"
import type { AbstractServiceOptions } from "directus/types/services"
import type { Request } from "express"

import type { ActionHookContext } from "../types/RegisterHook/ActionHookHandler.js"
import type { FilterHookContext } from "../types/RegisterHook/FilterHookHandler.js"

export interface User {
  id: string
  role: string
  status: string
}
export interface Role {
  id: string
  admin_access: boolean
  app_access: boolean
}

async function getUserAccountability(
  reqOrFilterCtxOrActionCtx: Request | FilterHookContext | ActionHookContext,
  userId: string,
): Promise<Accountability | undefined> {
  const options: AbstractServiceOptions = {
    schema: reqOrFilterCtxOrActionCtx.schema,
    knex:
      "database" in reqOrFilterCtxOrActionCtx
        ? reqOrFilterCtxOrActionCtx.database
        : undefined,
    accountability: { role: null, admin: true },
  }

  const userService = new ItemsService<User>("directus_users", options)
  const roleService = new ItemsService<Role>("directus_roles", options)

  const [user] = await userService.readByQuery({
    filter: {
      id: { _eq: userId },
      status: { _eq: "active" },
    },
    limit: 1,
  })
  if (!user) {
    throw new InvalidCredentialsException("User not found")
  }

  const [role] = await roleService.readByQuery({
    filter: {
      id: { _eq: user.role },
    },
    limit: 1,
  })

  const accountability: Accountability = {
    user: user.id,
    role: user.role ? user.role : null,
    admin: role?.admin_access,
    app: role?.app_access,
  }

  return accountability
}

export default getUserAccountability
