import { Entity } from 'dexie'
import type AppDB from './AppDB'

export default class Model extends Entity<AppDB> {
  id!: number
  name!: string
  parameterSize?: string
  isCloud?: boolean
}

export type ModelData = Omit<Model, 'table' | 'db'>
export type ModelInput = Omit<ModelData, 'id'>
