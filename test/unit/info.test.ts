/* eslint-disable @typescript-eslint/no-explicit-any */
// file deepcode ignore no-any: any needed
import { PersistenceInfo } from '../../source/database/persistenceInfo';
import { Journaly, SenderReceiver } from 'journaly';

test('add and read array and find object', async (done) => {
  const journaly = Journaly.newJournaly() as SenderReceiver<any>;
  let info = new PersistenceInfo(
    {
      uri: 'postgres://user:password@host:54321/database',
    },
    journaly
  );
  expect(info).toMatchObject({
    connectionType: 'postgres',
    uri: 'postgres://user:password@host:54321/database',
    user: 'user',
    password: 'password',
    host: 'host',
    port: 54321,
    database: 'database',
  });
  info = new PersistenceInfo(
    {
      username: 'user',
      password: 'password',
      host: 'host',
      port: 54321,
      database: 'database',
    },
    journaly
  );
  expect(info).toMatchObject({
    uri: 'user:password@host:54321/database',
    user: 'user',
    password: 'password',
    host: 'host',
    port: 54321,
    database: 'database',
  });
  info = new PersistenceInfo(
    {
      uri: 'postgres://ibujvmgywggbqw:75e721b104549ea59dd29a076f50a6c77fc594e21e218663429bf657565f1a93@ec2-52-202-185-87.compute-1.amazonaws.com:5432/d581o8c7v3jv65',
    },
    journaly
  );
  expect(info).toMatchObject({
    uri: 'postgres://ibujvmgywggbqw:75e721b104549ea59dd29a076f50a6c77fc594e21e218663429bf657565f1a93@ec2-52-202-185-87.compute-1.amazonaws.com:5432/d581o8c7v3jv65',
    connectionType: 'postgres',
    user: 'ibujvmgywggbqw',
    password:
      '75e721b104549ea59dd29a076f50a6c77fc594e21e218663429bf657565f1a93',
    host: 'ec2-52-202-185-87.compute-1.amazonaws.com',
    port: 5432,
    database: 'd581o8c7v3jv65',
  });
  info = new PersistenceInfo(
    {
      uri: 'mongodb+srv://mongo:47zzs4V00j9WJWZk@clusterwhaletest-4zkss.mongodb.net/test?retryWrites=true&w=majority',
    },
    journaly
  );
  expect(info).toMatchObject({
    uri: 'mongodb+srv://mongo:47zzs4V00j9WJWZk@clusterwhaletest-4zkss.mongodb.net/test?retryWrites=true&w=majority',
    connectionType: 'mongodb+srv',
    user: 'mongo',
    password: '47zzs4V00j9WJWZk',
    host: 'clusterwhaletest-4zkss.mongodb.net',
    database: 'test',
    options: 'retryWrites=true&w=majority',
  });

  info = new PersistenceInfo(
    {
      uri: 'user:password@host:54321/database',
    },
    journaly
  );
  expect(info).toMatchObject({
    uri: 'user:password@host:54321/database',
    user: 'user',
    password: 'password',
    host: 'host',
    port: 54321,
    database: 'database',
  });

  info = new PersistenceInfo(
    {
      uri: 'host:54321/database',
    },
    journaly
  );
  expect(info).toMatchObject({
    uri: 'host:54321/database',
    host: 'host',
    port: 54321,
    database: 'database',
  });

  info = new PersistenceInfo(
    {
      uri: 'user:password@host/database',
    },
    journaly
  );
  expect(info).toMatchObject({
    uri: 'user:password@host/database',
    user: 'user',
    password: 'password',
    host: 'host',
    database: 'database',
  });

  info = new PersistenceInfo(
    {
      uri: 'user:password@host:54321',
    },
    journaly
  );
  expect(info).toMatchObject({
    uri: 'user:password@host:54321',
    user: 'user',
    password: 'password',
    host: 'host',
    port: 54321,
  });

  info = new PersistenceInfo(
    {
      uri: 'user:password@host',
    },
    journaly
  );
  expect(info).toMatchObject({
    uri: 'user:password@host',
    user: 'user',
    password: 'password',
    host: 'host',
  });

  info = new PersistenceInfo(
    {
      uri: 'host:54321',
    },
    journaly
  );
  expect(info).toMatchObject({
    uri: 'host:54321',
    host: 'host',
    server: 'host',
    port: 54321,
  });

  info = new PersistenceInfo(
    {
      connectionType: 'connection',
      options: 'options',
      username: 'user',
      password: 'password',
      host: 'host',
      port: 54321,
      database: 'database',
    },
    journaly
  );
  expect(info).toMatchObject({
    uri: 'connection://user:password@host:54321/database?options',
    connectionType: 'connection',
    options: 'options',
    password: 'password',
    host: 'host',
    port: 54321,
    database: 'database',
    user: 'user',
  });

  done();
});
