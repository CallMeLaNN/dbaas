import type { Router } from "express"
// Load the extra props in Request
import "../../declaration/express/index"

import type ExtensionContext from "../ExtensionContext"

type RegisterEndpoint = (router: Router, context: ExtensionContext) => void

export default RegisterEndpoint
