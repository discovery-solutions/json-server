export const PORT = 3501;
export const DB = "test-database";

export const POST = {
  name: "post",
  alias: "Post",
  fields: {
    title: {
      type: "string",
      required: true
    },
    body: {
      type: "string",
      required: true
    }
  },
  permission: {
    insert: false,
    update: false,
    delete: false,
    list: true,
    get: true,
  }
}

export const AUTH = {
  type: "jwt",
  fields: ["email", "password"],
  secret: "MY-SECRET-FOR-AUTH",
  permission: {
    "*": {
      insert: true,
      update: true,
      delete: true,
      list: true,
      get: true,
    }
  }
}

export const USER = {
  name: "user",
  alias: "User",
  auth: AUTH,
  fields: {
    name: {
      type: "string",
      required: true
    },
    email: {
      type: "string",
      required: true
    },
    password: {
      type: "string",
      required: true
    },
  }
}

export const JSON_EXAMPLE = {
  name: "test-server",
  config: {
    port: PORT,
    type: "rest",
    format: "json"
  },
  database: {
    type: "custom",
    key: DB,
    name: DB,
  },
  entities: [USER, POST]
};
