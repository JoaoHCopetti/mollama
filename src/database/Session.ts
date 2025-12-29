import type { Model } from '@/types'
import { Entity } from 'dexie'
import type AppDB from './AppDB'

export default class Session extends Entity<AppDB> {
  id!: number
  lastModel!: Model
  title!: string
  createdAt!: string
  updatedAt!: string
}

type SessionData = Omit<Session, 'table' | 'db'>
type SessionInput = Omit<SessionData, 'id'>

export type { SessionData, SessionInput }
