# restomatic

Automatic REST on top of Node.js + SQLite + Express.

## Installation

```sh
npm i -g @carlosjimenohernandez/restomatic
```

## Usage

From command line you can:

```sh
npx restomatic
  --port 9090             # Port to listen
  --models models.js      # Models to import
  --database test.sqlite  # File for database
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

And a REST is set up for you automatically.

## Test

Once running, you can insert:

```js
const res = await fetch("http://127.0.0.1:9090/api/v1/data/insert", {
    method: "POST",
    headers: {"Content-Type": "application/json"},
    body: JSON.stringify({
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

You can select:

```js
const res = await fetch("http://127.0.0.1:9090/api/v1/data/select", {
    method: "POST",
    headers: {"Content-Type": "application/json"},
    body: JSON.stringify({
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

You can update:

```js
const res = await fetch("http://127.0.0.1:9090/api/v1/data/select", {
    method: "POST",
    headers: {"Content-Type": "application/json"},
    body: JSON.stringify({
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

You can delete:

```js
const res = await fetch("http://127.0.0.1:9090/api/v1/data/delete", {
    method: "POST",
    headers: {"Content-Type": "application/json"},
    body: JSON.stringify({
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

## Features

There is a builder that groups all the code in 1 javascript file (`restomatic.js`) which is the one executed by the command line.

It is not though to work as API because:

> The parameters are always taken from `process.argv`.

Also, take into account that:

> No auth. No permissions system. No magic tokens. This is an unusable REST API that can make the job from internal networks. This is not usable for public projects where anyone can flood your database with one simple loop.

But.

> In non-hostile environments, like internal scraps or fast demos, you can use it to do the job.

Also, note that:

> It is a good starting point for:
>
> - an authentication and authorization system
>    - with groups
>    - with users
>    - with permissions
> - a template-driven page builder
> - more complex systems

But, as it own, it is only a simple REST that is automatically set up around SQLite database.

