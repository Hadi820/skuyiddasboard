export interface Client {
  id: string
  name: string
  email?: string
  phone?: string
  company?: string
  address?: string
}

export const clientsData: Client[] = [
  {
    id: "client-1",
    name: "John Doe",
    email: "john.doe@email.com",
    phone: "+62812-3456-7890",
    company: "PT. Example Corp",
    address: "Jl. Contoh No. 123, Jakarta",
  },
]
