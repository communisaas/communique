import { signOut } from "$lib/data/auth"
import type { Actions } from "./$types"
export const actions: Actions = { default: signOut }