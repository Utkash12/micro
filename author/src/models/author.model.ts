import {Entity, model, property} from '@loopback/repository';

@model()
export class Author extends Entity {
  @property({
    type: 'string',
    id: true,
    generated: false,
    required: true,
  })
  bookAuthorId: string;

  @property({
    type: 'string',
    required: true,
  })
  bookAuthorName: string;


  constructor(data?: Partial<Author>) {
    super(data);
  }
}

export interface AuthorRelations {
  // describe navigational properties here
}

export type AuthorWithRelations = Author & AuthorRelations;
