//Fields in a request to update a single TODO item.

export interface UpdateContactRequest {
  name: string
  address: string
  contactNumber: number
  contacted: boolean
}