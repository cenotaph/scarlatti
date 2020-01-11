'use strict'

const { Model } = require('objection')

class Promotion extends Model {
  // Table name is the only required property.
  static get tableName() {
    return 'promotions'
  }

  // Optional JSON schema. This is not the database schema! Nothing is generated
  // based on this. This is only used for validation. Whenever a model instance
  // is created it is checked against this schema. http://json-schema.org/.
  // static get jsonSchema() {
  //   return {
  //     type: 'object',
  //     required: ['name'],

  //     properties: {
  //       id: { type: 'integer' },
  //       book_id: { type: ['integer', 'null'] },
  //       price: { type: 'float' },
  //       sku: { type: 'string' },
  //       currency: { type: 'string', minLength: 3, maxLength: 3 }
  //     }
  //   }
  // }

  // This object defines the relations to other models.

}

module.exports = Promotion
