// Fields in a ContactItem(Schema)

export interface ContactItem {
  userId: string
  todoId: string
  createdAt: string
  name: string
  address: string
  contactNumber: number
  done: boolean
  attachmentUrl?: string
}
