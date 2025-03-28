import {inject} from '@loopback/core';
import {DefaultCrudRepository} from '@loopback/repository';
import {AuthorDataSource} from '../datasources';
import {Author, AuthorRelations} from '../models';

export class AuthorRepository extends DefaultCrudRepository<
  Author,
  typeof Author.prototype.bookAuthorId,
  AuthorRelations
> {
  constructor(
    @inject('datasources.author') dataSource: AuthorDataSource,
  ) {
    super(Author, dataSource);
  }
}
