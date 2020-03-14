import { DatabaseInfo } from "../../database/databaseInfo";

test("add and read array and find object", async done => {
  let info = new DatabaseInfo({
    uri: "postgres://user:password@host:54321/database"
  });
  expect(info).toEqual({
    uri: "postgres://user:password@host:54321/database",
    user: "user",
    username: "user",
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
    user: "user",
    username: "user",
    password: "password",
    host: "host",
    port: 54321,
    database: "database"
  });

  done();
});
