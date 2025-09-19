import { Provider } from '@nestjs/common';
import { MongoClient, Db } from 'mongodb';
import { mongoConfig } from 'src/config';

export const MONGO_CLIENT = 'MONGO_CLIENT';
export const MONGO_DB = 'MONGO_DB';

export const mongoProvider: Provider[] = [
  {
    provide: MONGO_CLIENT,
    useFactory: async () => {
      if (!mongoConfig.uri) return;
      const client = new MongoClient(mongoConfig.uri);
      await client.connect();
      return client;
    },
  },
  {
    provide: MONGO_DB,
    useFactory: async (client: MongoClient): Promise<Db> => {
      return await client.db();
    },
    inject: [MONGO_CLIENT],
  },
];
