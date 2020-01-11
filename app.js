const Koa = require('koa')
const cors = require('@koa/cors')
const KoaRouter = require('koa-router')
const bodyParser = require('koa-bodyparser')
const dotenv = require('dotenv')
dotenv.config()
const Knex = require('knex')
const knexConfig = require('./knexfile')
const registerApi = require('./api')
const { Model, ForeignKeyViolationError, ValidationError } = require('objection')
// const jwt = require('koa-jwt')
// const unless = require('koa-unless');

// Initialize knex.
const knex = Knex(knexConfig.development)

// Bind all Models to a knex instance. If you only have one database in
// your server this is all you have to do. For multi database systems, see
// the Model.bindKnex() method.
Model.knex(knex)

const router = new KoaRouter()
const app = new Koa()
app.use(cors())
// Register our REST API.
registerApi(router)

app.use(errorHandler)
app.use(bodyParser())
app.use(router.routes())
app.use(router.allowedMethods())


// app.use(jwt({ secret: process.env.API_KEY }).unless({ path: [/^\/api/] }))

// // Unprotected middleware
// app.use(function(ctx, next){
//   if (!ctx.url.match(/^\/api/)) {
//     ctx.body = 'unprotected\n'
//   } else {
//     return next();
//   }
// });

// // Protected middleware
// app.use(function(ctx){
//   if (ctx.url.match(/^\/api/)) {
//     ctx.body = 'protected\n'
//   }
// });

const server = app.listen(8641, () => {
  console.log('Scarlatti Tilt api listening at port %s', server.address().port)
})

// Error handling.
//
// NOTE: This is not a good error handler, this is a simple one. See the error handing
//       recipe for a better handler: http://vincit.github.io/objection.js/#error-handling
async function errorHandler(ctx, next) {
  try {
    await next()
  } catch (err) {
    if (err instanceof ValidationError) {
      ctx.status = 400
      ctx.body = {
        error: 'ValidationError',
        errors: err.data
      }
    } else if (err instanceof ForeignKeyViolationError) {
      ctx.status = 409
      ctx.body = {
        error: 'ForeignKeyViolationError'
      }
    } else {
      ctx.status = 500
      console.log(err.message)
      ctx.body = {
        error: 'InternalServerError',
        message: err.message || {}
      }
    }
  }
}
