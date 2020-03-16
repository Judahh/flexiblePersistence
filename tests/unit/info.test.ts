import { DatabaseInfo } from "../../database/databaseInfo";

test("add and read array and find object", async done => {
  let info = new DatabaseInfo({
    uri: "postgres://user:password@host:54321/database"
  });
  expect(info).toEqual({
    connectionType: "postgres",
    uri: "postgres://user:password@host:54321/database",
    user: "user",
    password: "password",
    host: "host",
    port: 54321,
    database: "database"
  });
  info = new DatabaseInfo({
    username: "user",
    password: "password",
    host: "host",
    port: 54321,
    database: "database"
  });
  expect(info).toEqual({
    uri: "user:password@host:54321/database",
    user: "user",
    password: "password",
    host: "host",
    port: 54321,
    database: "database"
  });
  info = new DatabaseInfo({
    uri:
      "postgres://ibujvmgywggbqw:75e721b104549ea59dd29a076f50a6c77fc594e21e218663429bf657565f1a93@ec2-52-202-185-87.compute-1.amazonaws.com:5432/d581o8c7v3jv65"
  });
  expect(info).toEqual({
    uri:
      "postgres://ibujvmgywggbqw:75e721b104549ea59dd29a076f50a6c77fc594e21e218663429bf657565f1a93@ec2-52-202-185-87.compute-1.amazonaws.com:5432/d581o8c7v3jv65",
    connectionType: "postgres",
    user: "ibujvmgywggbqw",
    password:
      "75e721b104549ea59dd29a076f50a6c77fc594e21e218663429bf657565f1a93",
    host: "ec2-52-202-185-87.compute-1.amazonaws.com",
    port: 5432,
    database: "d581o8c7v3jv65"
  });
  info = new DatabaseInfo({
    uri:
      "mongodb+srv://mongo:47zzs4V00j9WJWZk@clusterwhaletest-4zkss.mongodb.net/test?retryWrites=true&w=majority"
  });
  expect(info).toEqual({
    uri:
      "mongodb+srv://mongo:47zzs4V00j9WJWZk@clusterwhaletest-4zkss.mongodb.net/test?retryWrites=true&w=majority",
    connectionType: "mongodb+srv",
    user: "mongo",
    password: "47zzs4V00j9WJWZk",
    host: "clusterwhaletest-4zkss.mongodb.net",
    database: "test",
    options: "retryWrites=true&w=majority"
  });

  info = new DatabaseInfo({
    uri: "user:password@host:54321/database"
  });
  expect(info).toEqual({
    uri: "user:password@host:54321/database",
    user: "user",
    password: "password",
    host: "host",
    port: 54321,
    database: "database"
  });

  info = new DatabaseInfo({
    uri: "host:54321/database"
  });
  expect(info).toEqual({
    uri: "host:54321/database",
    host: "host",
    port: 54321,
    database: "database"
  });

  info = new DatabaseInfo({
    uri: "user:password@host/database"
  });
  expect(info).toEqual({
    uri: "user:password@host/database",
    user: "user",
    password: "password",
    host: "host",
    database: "database"
  });

  info = new DatabaseInfo({
    uri: "user:password@host:54321"
  });
  expect(info).toEqual({
    uri: "user:password@host:54321",
    user: "user",
    password: "password",
    host: "host",
    port: 54321
  });

  info = new DatabaseInfo({
    uri: "user:password@host"
  });
  expect(info).toEqual({
    uri: "user:password@host",
    user: "user",
    password: "password",
    host: "host"
  });

  info = new DatabaseInfo({
    uri: "host:54321"
  });
  expect(info).toEqual({
    uri: "host:54321",
    host: "host",
    port: 54321
  });

  info = new DatabaseInfo({
    connectionType: "connection",
    options: "options",
    username: "user",
    password: "password",
    host: "host",
    port: 54321,
    database: "database"
  });
  expect(info).toEqual({
    uri: "connection://user:password@host:54321/database?options",
    connectionType: "connection",
    options: "options",
    password: "password",
    host: "host",
    port: 54321,
    database: "database",
    user: "user"
  });

  done();
});
