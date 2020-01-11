'use strict'

const Book = require('./models/Book')
const Price = require('./models/Price')
const Rate = require('./models/Rate')
const Order = require('./models/Order')
const Promotion = require('./models/Promotion')


const dotenv = require('dotenv')
dotenv.config({debug: true})

const stripe = require('stripe')(process.env.STRIPE_KEY)
const endpointSecret = process.env.STRIPE_SECRET
module.exports = router => {
  /**
   * Create a new Person.
   *
   * Because we use `insertGraph` you can pass relations with the person and they
   * also get inserted and related to the person. If all you want to do is insert
   * a single person, `insertGraph` and `allowGraph` can be replaced by
   * `insert(ctx.request.body)`.
   */

  router.post('/check_promotion/:id', async ctx => {
    ctx.body = await Promotion.query()
      .where('book_id', ctx.params.id)  
      .where('code', ctx.request.query.code)

  })



  router.post('/stripehook', async ctx => {
    const sig = ctx.request.header['stripe-signature'];

     let event;

     try {
       event = stripe.webhooks.constructEvent(ctx.request.rawBody, sig, endpointSecret)
       // console.log('event is: ')
       // console.log(JSON.stringify(event))

     } catch (err) {
       console.log(err)
       ctx.body = err.message
     }

     // Handle the checkout.session.completed event
     if (event.type === 'checkout.session.completed') {
       const session = event.data.object;
       let stripeId = session.id
       const numUpdated = await Order.query()
         .patch({stripe_id: stripeId})
         .where('customer_reference_id', session.client_reference_id)

      }

      // Return a response to acknowledge receipt of the event
      ctx.body = {received: true}
  })

  // router.post('/books', async ctx => {
  //   // insertGraph can run multiple queries. It's a good idea to
  //   // run it inside a transaction.
  //   const insertedGraph = await Book.transaction(async trx => {
  //     const insertedGraph = await Book.query(trx)
  //       // For security reasons, limit the relations that can be inserted.
  //       .allowGraph('[prices]')
  //       .insertGraph(ctx.request.body)

  //     return insertedGraph
  //   })

  //   ctx.body = insertedGraph
  // })

  /**
   * Fetch multiple Persons.
   *
   * The result can be filtered using various query parameters:
   *
   *  select:          a list of fields to select for the Persons
   *  name:            fuzzy search by name
   *  hasPets:         only select Persons that have one or more pets
   *  isActor:         only select Persons that are actors in one or more movies
   *  withGraph:       return a graph of relations with the results
   *  orderBy:         sort the result using this field.
   *
   *  withPetCount:    return Persons with a `petCount` column that holds the
   *                   number of pets the person has.
   *
   *  withMovieCount:  return Persons with a `movieCount` column that holds the
   *                   number of movies the person has acted in.
   */

  router.get('/rates', async ctx => {
    ctx.body = await Rate.query()
  })

  router.get('/books', async ctx => {
    const query = Book.query()

    if (ctx.query.select) {
      query.select(ctx.query.select)
    }

    if (ctx.query.name) {
      // The fuzzy name search has been defined as a reusable
      // modifier. See the Person model.
      query.modify('searchByTitle', ctx.query.title)
    }
    if (ctx.query.withGraph) {
      query
        // For security reasons, limit the relations that can be fetched.
        .allowGraph('[prices]')
        .withGraphFetched(ctx.query.withGraph)
    }

    if (ctx.query.orderBy) {
      query.orderBy(ctx.query.orderBy)
    }


    // You can uncomment the next line to see the SQL that gets executed.
    // query.debug();

    ctx.body = await query
  })



  // /**
  //  * Insert a new child for a person.
  //  */
  // router.post('/books/:id/prices', async ctx => {
  //   const bookId = parseInt(ctx.params.id)

  //   const child = await Book.relatedQuery('prices')
  //     .for(bookId)
  //     .insert(ctx.request.body)

  //   ctx.body = child
  // })



  router.get('/sku/:id', async ctx => {
    const query = await Price.query()
      .where('sku', ctx.params.id)


    if (ctx.query.select) {
      query.select(ctx.query.select)
    }

    const price = await query

    const book = await Book.query()
      .findById(price[0].book_id)
      .withGraphFetched('[prices]')
    ctx.body = await book
  })

  router.get('/prices/:id', async ctx => {
    const query = await Price.query()
      .findById(ctx.params.id)
      .withGraphFetched('[book]')

    if (ctx.query.select) {
      query.select(ctx.query.select)
    }


    ctx.body = await query
  })


  router.get('/books/:id', async ctx => {
    const query = await Book.query()
      .findById(ctx.params.id)
      .withGraphFetched('[prices]')

    if (ctx.query.select) {
      query.select(ctx.query.select)
    }

    if (ctx.query.name) {
      // The fuzzy name search has been defined as a reusable
      // modifier. See the Person model.
      query.modify('searchByTitle', ctx.query.title)
    }

    ctx.body = await query
  })

  router.get('/api/orders', async ctx => {
    if (ctx.request.header['authorization'] === 'Api-Key ' + process.env.API_KEY) {
      ctx.body = await Order.query()
    } else {
      ctx.status = 403
      ctx.body = {"error": "Incorrect API key"}
    }
  })

  router.post('/api/order', async ctx => {
    if (ctx.request.header['authorization'] === 'Api-Key ' + process.env.API_KEY) {
      const insertedGraph = await Order.transaction(async trx => {

        const insertedGraph = await Order.query(trx)
          .insert(ctx.request.body)





        return insertedGraph
      })
      ctx.body = insertedGraph
    } else {

      ctx.status = 403
      ctx.body = {"error": "Incorrect API key, should be " + process.env.API_KEY}
    }

  })


}
