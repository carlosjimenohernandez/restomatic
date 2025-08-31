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

From command line you can:

```sh
npx restomatic
  --port "9090"             # Port to listen
  --models "models.js"      # Models to import
  --routes "routes.js"      # Routes to include beside defaults
  --token "admin"           # Token for advanced operations
  --database "test.sqlite"  # File for database
```

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

## Test

Once running, you can insert (**with** admin token):

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

You can update (**with** admin token):

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

You can delete (**with** admin token):

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

