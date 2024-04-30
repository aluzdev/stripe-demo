import { serve } from '@hono/node-server'
import { Hono } from 'hono'
import "dotenv/config"

import Stripe from 'stripe'
import { HTTPException } from 'hono/http-exception'
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {apiVersion: '2023-10-16'})

stripe.checkout.sessions
const app = new Hono()

app.get('/', (c) => {
  return c.text('Hello Hono!')
})

app.post('/', (c) => {
  return c.text('Hello Hono!')
})

app.post('/checkout', async (c)=> {
  try {
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items:[
        {
          price: 'price_1PBPizRpqLuCaibXK5KdVfsa',
          quantity: 1
        }
      ],
      mode: 'payment',
      success_url: 'http://localhost:3000/success',
      cancel_url: 'http://localhost:3000/cancel'
    })
    return c.json(session)
  } catch (error: any) {
    throw new HTTPException(500, {message: error?.message})
  }
})

app.get('/success', (c)=> {
  return c.text('Success!')
})

app.get('/cancel', (c)=> {
  return c.text('Canceled!')
})

const port = 3000
console.log(`Server is running on port http://localhost:${port}`)

serve({
  fetch: app.fetch,
  port
})
