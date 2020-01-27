'use strict'

const { Model } = require('objection')

class Author extends Model {
  // Table name is the only required property.
  static get tableName() {
    return 'authors'
  }

  // Optional JSON schema. This is not the database schema! Nothing is generated
  // based on this. This is only used for validation. Whenever a model instance
  // is created it is checked against this schema. http://json-schema.org/.
  // static get jsonSchema() {
  //   return {
  //     type: 'object',
  //     required: ['firstName', 'lastName'],

  //     properties: {
  //       id: { type: 'integer' },
  //       parentId: { type: ['integer', 'null'] },
  //       firstName: { type: 'string', minLength: 1, maxLength: 255 },
  //       lastName: { type: 'string', minLength: 1, maxLength: 255 },
  //       age: { type: 'number' },

  //       address: {
  //         type: 'object',
  //         properties: {
  //           street: { type: 'string' },
  //           city: { type: 'string' },
  //           zipCode: { type: 'string' }
  //         }
  //       }
  //     }
  //   }
  // }

  // Modifiers are reusable query snippets that can be used in various places.
  static get modifiers() {
    return {
      // Our example modifier is a a semi-dumb fuzzy name match. We split the
      // name into pieces using whitespace and then try to partially match
      // each of those pieces to both the `firstName` and the `lastName`
      // fields.
      searchByName(query, name) {
        // This `where` simply creates parentheses so that other `where`
        // statements don't get mixed with the these.
        query.where(query => {
          for (const namePart of name.trim().split(/\s+/)) {
            for (const column of ['firstName', 'lastName']) {
              query.orWhereRaw('lower(??) like ?', [column, namePart.toLowerCase() + '%'])
            }
          }
        })
      }
    }
  }

  // This object defines the relations to other models.
  static get relationMappings() {
    // One way to prevent circular references
    // is to require the model classes here.
    const Book = require('./Book')

    return {
      prices: {
        relation: Model.HasManyRelation,
        // The related model. This can be either a Model subclass constructor or an
        // absolute file path to a module that exports one.
        modelClass: Book,
        join: {
          from: 'author.id',
          to: 'books.author_id'
        }
      } 
    }
  }
}

module.exports = Author
