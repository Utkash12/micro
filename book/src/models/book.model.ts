import {Entity, model, property} from '@loopback/repository';

@model()
export class Book extends Entity {
  @property({
    type: 'string',
    id: true,
    generated: false,
    required: true,
  })
  bookId: string;

  @property({
    type: 'string',
    required: true,
  })
  bookTitle: string;

  @property({
    type: 'number',
    required: true,
  })
  bookPrice: number;

  @property({
    type: 'string',
    required: true,
  })
  bookIsbn: string;

  @property({
    type: 'string',
    required: true,
  })
  bookPublishDate: string;

  @property({
    type: 'string',
    required: true,
  })
  bookAuthorId: string;

  @property({
    type: 'string',
    required: true,
  })
  bookCategoryId: string;


  constructor(data?: Partial<Book>) {
    super(data);
  }
}

export interface BookRelations {
  // describe navigational properties here
}

export type BookWithRelations = Book & BookRelations;
