'use strict'

const { Model } = require('objection')

class Order extends Model {
  // Table name is the only required property.
  static get tableName() {
    return 'orders'
  }

  // Optional JSON schema. This is not the database schema! Nothing is generated
  // based on this. This is only used for validation. Whenever a model instance
  // is created it is checked against this schema. http://json-schema.org/.
  static get jsonSchema() {
    return {
      type: 'object',
      required: ['name', 'address1', 'email', 'city', 'country', 'postcode', 'phone', 'order_details', 'amount', 'shipping', 'currency', 'order_details'],

      properties: {
        id: { type: 'integer' },
        name: { type: 'string' },
        address1: { type: 'string' },
        address2: { type: 'string' },
        city: { type: 'string' },
        state: { type: 'string' },
        phone: { type: 'string' },
        email: { type: 'string' },
        postcode: { type: 'string' },
        country: { type: 'string', minLength: 2, maxLength: 2 },
        customer_reference_id: { type: 'string' },
        amount: { type: 'float' },
        shipping: { type: 'float'},
        order_details: { type: 'object' },
        currency: { type: 'string', minLength: 3, maxLength: 3 },
        stripe_id: { type: 'string'},
        shipped: { type: 'boolean' }
      }
    }
  }

  // This object defines the relations to other models.

}

module.exports = Order
