import Dexie, { type EntityTable } from 'dexie'
import Message from './Message'
import Model from './Model'
import Session from './Session'

export default class AppDB extends Dexie {
  sessions!: EntityTable<Session, 'id'>
  messages!: EntityTable<Message, 'id'>
  models!: EntityTable<Model, 'id'>

  constructor() {
    super('ollama')
    this.version(1).stores({
      models: '++id, name, parameterSize, isCloud',
      sessions: '++id, title, lastModel, createdAt, updatedAt',
      messages: '++id, sessionId, role, content, thinking, createdAt, updatedAt',
    })

    this.sessions.mapToClass(Session)
    this.messages.mapToClass(Message)
    this.models.mapToClass(Model)
  }
}
