import type { Router } from "express"
// Load the extra props in Request
import "../../declaration/express/index.js"

import type ExtensionContext from "../ExtensionContext.js"

type RegisterEndpoint = (router: Router, context: ExtensionContext) => void

export default RegisterEndpoint
