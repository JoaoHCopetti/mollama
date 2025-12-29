import Dexie, { type EntityTable } from 'dexie'
import Message from './Message'
import Session from './Session'
import SystemPrompt from './SystemPrompt'

const DATABASE_NAME = 'mollama'

export default class AppDB extends Dexie {
  sessions!: EntityTable<Session, 'id'>
  messages!: EntityTable<Message, 'id'>
  systemPrompts!: EntityTable<SystemPrompt, 'id'>

  constructor() {
    super(DATABASE_NAME)

    this.version(1).stores({
      sessions: `
        ++id,
        title,
        lastModel,
        createdAt,
        updatedAt
      `,
      messages: `
        ++id,
        sessionId,
        user,
        assistant,
        system,
        role,
        createdAt,
        updatedAt
      `,
      systemPrompts: `
        ++id,
        title,
        content,
        createdAt,
        updatedAt
      `,
    })

    this.sessions.mapToClass(Session)
    this.messages.mapToClass(Message)
    this.systemPrompts.mapToClass(SystemPrompt)
  }
}
