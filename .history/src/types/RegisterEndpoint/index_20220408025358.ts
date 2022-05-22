import type { Router } from "express"

import type ExtensionContext from "../ExtensionContext"

type RegisterEndpoint = (router: Router, context: ExtensionContext) => void

export default RegisterEndpoint
