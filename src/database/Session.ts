import { Entity } from 'dexie'
import type AppDB from './AppDB'
import type { ModelData } from './Model'

export default class Session extends Entity<AppDB> {
  id!: number
  lastModel!: ModelData
  title!: string
  createdAt!: string
  updatedAt!: string
}

export type SessionData = Omit<Session, 'table' | 'db'>
export type SessionInput = Omit<SessionData, 'id'>
