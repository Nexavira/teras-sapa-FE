import { http, HttpResponse } from 'msw'

export const mswHandlers = {
  products: [
    http.get('https://api.example.com/products', () =>
      HttpResponse.json({ items: [{ id: 'p1', name: 'Example', price: 42 }] }),
    ),
  ],
}
