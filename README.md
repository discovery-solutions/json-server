# JSON Server

[Versão em português 🇧🇷](README-PT.md)

This library allows you to create multiple API servers with minimum amount of code or setup, using a JSON configuration.

The generated API can handle simple CRUD of entities to authentication, and much more. Check the documentation bellow.

## Parameters

| Parameter Key  | Description             | Required | Default Value |
| :------------- | :---------------------- | :------- | :------------ |
| [name](#name)  | The server project name | true     |  |
| [config](#config) | Setup of the servers    | true     |  |
| [database](#database) | Database setup          | false    | native |
| [entities](#entities) | Entities for CRUD features | true  |  |

### name

The simplest of all the parameters, just an identifyer for your project. This should be an string, like the example below:

```js
const server = new Server({
  name: "my-server"
});
```

### config

This could a simple object for one server, or an array of objects for multiple servers configuration.

| Key            | Description    | Type or Options | Required |
| :------------- | :------------- | :-------------- | : ------ |
| ```port``` | number of the port the server should run | ```number``` | ```true``` |
| ```database``` | the database key the server should use | ```string``` | ```true``` |
| ```format``` | format of the responses | ```json```, ```csv``` | |
| ```type``` | type of the server | ```rest```, ```socket``` | |
| ```request``` | settings for requests | ```object``` | |

#### **Complete example:**

```js
const server = new Server({
  // ...
  config: {
    port: 3500,
    type: "rest",
    format: "json",
    database: "my-db-1",
    request: {
      limit: 10,
    },
  }
});
```

#### **Multiple servers example**
```js
const server = new Server({
  // ...
  config: [{
    port: 3501,
    type: "rest",
    database: "my-db-1",
    format: "json",
  }, {
    port: 3501,
    type: "socket",
    database: "my-db-2",
    format: "csv",
  }]
});
```
