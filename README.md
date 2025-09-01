# restomatic

Automatic REST on top of Node.js + SQLite + Express.

## Installation

```sh
npm i -g @carlosjimenohernandez/restomatic
```

## Features

- REST operations:
   - select: at `/api/v1/data/select`
   - insert: at `/api/v1/data/insert?token=admin`
   - update: at `/api/v1/data/update?token=admin`
   - delete: at `/api/v1/data/delete?token=admin`
   - createTable: at `/api/v1/data/createTable?token=admin`
   - createColumn: at `/api/v1/data/createColumn?token=admin`
   - removeTable: at `/api/v1/data/removeTable?token=admin`
   - removeColumn: at `/api/v1/data/removeColumn?token=admin`
- Static files: `/static/...`
   - to load js, css, images, etc.
- Dynamic templates: `/template/...`
   - to load custom [`ejs`](https://github.com/mde/ejs)-rendered content.

## Dependencies

This is part of the `package.json`:

```json
  "dependencies": {
    "better-sqlite3": "^12.2.0",
    "body-parser": "^2.2.0",
    "ejs": "^3.1.10",
    "express": "^5.1.0",
    "multer": "^2.0.2",
    "sqlstring": "^2.3.3"
  }
```

## Usage

You have 2 options to run `restomatic`:

  - From **command line**
  - From **node.js script**

Both are explained below.

### Usage from command line

From command line you can:

```sh
npx restomatic
  --port "9090"             # Port to listen
  --models "models.js"      # Models to import
  --routes "routes.js"      # Routes to include beside defaults
  --token "admin"           # Token for advanced operations
  --database "test.sqlite"  # File for database
```

### Usage from node.js script

From a node.js script you can:

```js
const restomaticInstance = await require("@carlosjimenohernandez/restomatic").create({
    port: "9090",
    models: "models.js",
    routes: "routes.js",
    token: "admin",
    database: "test.sqlite",
});
```

You can also import it:

```js
import Restomatic from "@carlosjimenohernandez/restomatic";

const restomaticInstance = await Restomatic.create({
    port: "9090",
    models: "models.js",
    routes: "routes.js",
    token: "admin",
    database: "test.sqlite",
});
```

## Parameters

The previous calls overstand some meaningful parameters, which are explained below.

### Parameter `port`

You specify the port number which must open the instance.

### Parameter `token`

The `token` parameter is used to filter advanced operations that require permissions, like:
  - `/api/v1/data/insert`
  - `/api/v1/data/update`
  - `/api/v1/data/delete`
  - `/api/v1/data/create-table`
  - `/api/v1/data/create-column`
  - `/api/v1/data/remove-table`
  - `/api/v1/data/remove-column`

You have to provide directly the string that can match the `token` parameter on the request, either by, in his order:
  - `request.headers.token`
  - `request.body.token`
  - `request.query.token`

### Parameter `database`

You specify the file that will be used (or created) as `sqlite` database.

### Parameter `models`

On `models.js` you must have something like:

```js
module.exports = {
  individuals: {
    columns: {
      nombre: { sql: "VARCHAR(255) UNIQUE", },
      edad:   { sql: "VARCHAR(255)", },
      tipo:   { sql: "VARCHAR(255)", },
      padre:  { sql: "INTEGER REFERENCES individuals(id)" }
    }
  }
};
```

### Parameter `routes`

On `routes.js` you will want to have something like:

```js
Restomatic.router.use("/path", function(request, response) {
    try {
        return response.success({
            message: "Your message",
            note: "This method is injected by «XXX.create-application.js»'
        });
    } catch(error) {
        return response.success(new Error("This method is injected by «XXX.create-application.js» too"));
    }
});
```

And a REST is set up for you automatically.

## Operations

The following titles describe the common operations enabled by default on `/api/v1/data/{operation}` path of the application.

  - **Select data** at `/api/v1/data/select`
     - Parameter `from`: **String**
        - with the name of the table
     - Parameter `where`: **Array**
        - with the conditions
     - Parameter `order`: **Array**
        - with the columns in order
        - Can use `!` to reverse the order
     - Parameter `page`: **Integer**
        - with the page
        - Starts on `1`
     - Parameter `items`: **Integer**
        - Defaults to `100`
  - **Insert data** at `/api/v1/data/insert`
     - Parameter `into`: **String**
        - with the name of the table
     - Parameter `values`: **Array | Object**
        - with the values for the new object/s
  - **Update data** at `/api/v1/data/update`
     - Parameter `from`: **String**
        - with the name of the table
     - Parameter `where`: **Array**
        - with the conditions
     - Parameter `set`: **Object**
        - with the new values
  - **Delete data** at `/api/v1/data/delete`
     - Parameter `from`: **String**
        - with the name of the table
     - Parameter `where`: **Array**
        - with the conditions

Also, you can alter the schema by the following operations:

  - **Create table** at `/api/v1/data/createTable`
     - Parameter `table`: **String**
        - with the name of the table
     - Parameter `content`: **String**
        - with the SQLite code of the table
  - **Create column** at `/api/v1/data/createColumn`
     - Parameter `table`: **String**
        - with the name of the table
     - Parameter `column`: **String**
        - with the name of the column
     - Parameter `content`: **String**
        - with the SQLite code of the column
  - **Remove table** at `/api/v1/data/removeTable`
     - Parameter `table`: **String**
        - with the name of the table
  - **Remove column** at `/api/v1/data/removeColumn`
     - Parameter `table`: **String**
        - with the name of the table
     - Parameter `column`: **String**
        - with the name of the column

### Select data

You can select (**without** admin token):

```js
const res = await fetch("http://127.0.0.1:9090/api/v1/data/select", {
    method: "POST",
    headers: {"Content-Type": "application/json"},
    body: JSON.stringify({
        token: "none", // This is not required for select operations
        from: "individuals",
        where: [
            ["id", "is not null"],
            ["id", "!=", "1000"],
            ["id", ">=", "1"],
            ["id", ">", "0"],
            ["id", "<", "1000"],
            ["id", "<=", "1000"],
            ["id", "like", "%"],
            ["id", "not like", "x%"],
            ["id", "in", [1,2,3]],
            ["id", "not in", [4,5,6]],
        ],
        order: ["!id"]    // with ! for DESC [endant]
        page: 1,          // defaults to 1
        items: 100,       // defaults to 100
    })
});
console.log(await res.json());
```

### Insert data

Once running, you can insert **with** admin token:

```js
const res = await fetch("http://127.0.0.1:9090/api/v1/data/insert", {
    method: "POST",
    headers: {"Content-Type": "application/json"},
    body: JSON.stringify({
        token: "admin", // This has to match with provided cmd token
        into: "individuals",
        values: [{
            nombre: "Carlos Jimeno Hernández",
            edad: 35
        }, {
            nombre: "Ada Jimeno Hernández",
            edad: 9,
        }, {
            nombre: "Gatito Jimeno Hernández",
            edad: 4,
        }]
    })
});
console.log(await res.json());
```

### Update data

You can update **with** admin token:

```js
const res = await fetch("http://127.0.0.1:9090/api/v1/data/select", {
    method: "POST",
    headers: {"Content-Type": "application/json"},
    body: JSON.stringify({
        token: "admin", // This has to match with provided cmd token
        from: "individuals",
        set: {
            tipo: "Familiar"
        },
        where: [
            ["id", "is not null"],
            ["id", "!=", "1000"],
            ["id", ">=", "1"],
            ["id", ">", "0"],
            ["id", "<", "1000"],
            ["id", "<=", "1000"],
            ["id", "like", "%"],
            ["id", "not like", "x%"],
            ["id", "in", [1,2,3]],
            ["id", "not in", [4,5,6]],
        ]
    })
});
console.log(await res.json());
```

### Delete data

You can delete **with** admin token:

```js
const res = await fetch("http://127.0.0.1:9090/api/v1/data/delete", {
    method: "POST",
    headers: {"Content-Type": "application/json"},
    body: JSON.stringify({
        token: "admin", // This has to match with provided cmd token
        from: "individuals",
        where: [
            ["id", "is null"],
            ["id", "!=", "1000"],
            ["id", ">=", "1"],
            ["id", ">", "0"],
            ["id", "<", "1000"],
            ["id", "<=", "1000"],
            ["id", "like", "%"],
            ["id", "not like", "x%"],
            ["id", "in", [1,2,3]],
            ["id", "not in", [4,5,6]],
        ]
    })
});
console.log(await res.json());
```

### Create table

For example, using GET:

`http://127.0.0.1:9090/api/v1/data/createTable?token=admin&table=lote`

Or using POST:

```js
const res = await fetch("http://127.0.0.1:9090/api/v1/data/createTable", {
    method: "POST",
    headers: {"Content-Type": "application/json"},
    body: JSON.stringify({
        token: "admin", // This has to match with provided cmd token
        table: "lote",
        content: `
            numero INTEGER UNIQUE NOT NULL,
            contenedor INTEGER REFERENCES lote(id)
        `
    })
});
console.log(await res.json());
```

### Create column

For example:

```js
const res = await fetch("http://127.0.0.1:9090/api/v1/data/createColumn", {
    method: "POST",
    headers: {"Content-Type": "application/json"},
    body: JSON.stringify({
        token: "admin", // This has to match with provided cmd token
        table: "lote",
        column: "identificador",
        content: `VARCHAR(255) NOT NULL`
    })
});
console.log(await res.json());
```

### Remove table

For example:

```js
const res = await fetch("http://127.0.0.1:9090/api/v1/data/removeTable", {
    method: "POST",
    headers: {"Content-Type": "application/json"},
    body: JSON.stringify({
        token: "admin", // This has to match with provided cmd token
        table: "lote",
    })
});
console.log(await res.json());
```

### Remove column

For example:

```js
const res = await fetch("http://127.0.0.1:9090/api/v1/data/removeTable", {
    method: "POST",
    headers: {"Content-Type": "application/json"},
    body: JSON.stringify({
        token: "admin", // This has to match with provided cmd token
        table: "lote",
        column: "identificador",
    })
});
console.log(await res.json());
```

## Other features

Below are listed other features the tool offers automatically.

  - Static content
  - Dynamic content

### Static content

You can access the files under `src/static` by:

`http://127.0.0.1/static/whatever.txt`

### Dynamic content

You can access the files under `src/template` by:

`http://127.0.0.1/static/whatever.ejs`

They will always be rendered as [`ejs`](https://github.com/mde/ejs) files.

You can access the following variables:
   - `request`
   - `response`
   - `Restomatic`

You can use this snippet to force some mime-type when rendering and serving a file, and so, load `css` or `html` or any, but dynamically:

```html
<% response.type("html") %>
<% response.type("css") %>
<% response.type("js") %>
```

