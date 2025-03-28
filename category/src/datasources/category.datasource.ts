import {inject, lifeCycleObserver, LifeCycleObserver} from '@loopback/core';
import {juggler} from '@loopback/repository';

const config = {
  name: 'category',
  connector: 'postgresql',
  url: 'postgres://postgres:164@KrishnaNagar@localhost/category',
  host: 'localhost',
  port: 5432,
  user: 'postgres',
  password: '164@KrishnaNagar',
  database: 'category'
};

// Observe application's life cycle to disconnect the datasource when
// application is stopped. This allows the application to be shut down
// gracefully. The `stop()` method is inherited from `juggler.DataSource`.
// Learn more at https://loopback.io/doc/en/lb4/Life-cycle.html
@lifeCycleObserver('datasource')
export class CategoryDataSource extends juggler.DataSource
  implements LifeCycleObserver {
  static dataSourceName = 'category';
  static readonly defaultConfig = config;

  constructor(
    @inject('datasources.config.category', {optional: true})
    dsConfig: object = config,
  ) {
    super(dsConfig);
  }
}
