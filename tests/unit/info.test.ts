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
  info = new DatabaseInfo({
    uri:
      "postgres://ibujvmgywggbqw:75e721b104549ea59dd29a076f50a6c77fc594e21e218663429bf657565f1a93@ec2-52-202-185-87.compute-1.amazonaws.com:5432/d581o8c7v3jv65"
  });
  expect(info).toEqual({
    uri:
      "postgres://ibujvmgywggbqw:75e721b104549ea59dd29a076f50a6c77fc594e21e218663429bf657565f1a93@ec2-52-202-185-87.compute-1.amazonaws.com:5432/d581o8c7v3jv65",
    user: "ibujvmgywggbqw",
    username: "ibujvmgywggbqw",
    password:
      "75e721b104549ea59dd29a076f50a6c77fc594e21e218663429bf657565f1a93",
    host: "ec2-52-202-185-87.compute-1.amazonaws.com",
    port: 5432,
    database: "d581o8c7v3jv65"
  });

  done();
});
