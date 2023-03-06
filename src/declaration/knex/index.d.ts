import User from "./User.js"
import Role from "./Role.js"

declare module "knex/types/tables" {
  interface Tables {
    directus_users: User
    directus_roles: Role
  }
}
