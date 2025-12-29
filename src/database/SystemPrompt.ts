import { Entity } from 'dexie'
import type AppDB from './AppDB'

export default class SystemPrompt extends Entity<AppDB> {
  id!: number
  title!: string
  content!: string
  createdAt!: string
  updatedAt!: string
}

type SystemPromptData = Omit<SystemPrompt, 'table' | 'db'>
type SystemPromptInput = Omit<SystemPromptData, 'id'>

export type { SystemPromptData, SystemPromptInput }
