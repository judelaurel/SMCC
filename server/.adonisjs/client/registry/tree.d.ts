/* eslint-disable prettier/prettier */
import type { routes } from './index.ts'

export interface ApiDefinition {
  login: typeof routes['login']
  register: typeof routes['register']
  logout: typeof routes['logout']
  me: typeof routes['me']
}
