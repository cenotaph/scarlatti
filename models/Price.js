'use strict'

const { Model } = require('objection')

class Price extends Model {
  // Table name is the only required property.
  static get tableName() {
    return 'prices'
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
  static get relationMappings() {
    // One way to prevent circular references
    // is to require the model classes here.
    const Book = require('./Book')

    return {
      owner: {
        relation: Model.BelongsToOneRelation,

        // The related model. This can be either a Model subclass constructor or an
        // absolute file path to a module that exports one.
        modelClass: Book,

        join: {
          from: 'prices.book_id',
          to: 'books.id'
        }
      }
    }
  }
}

module.exports = Price
