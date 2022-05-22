# DBaaS

> Database as a service. Expose db to REST and GraphQL.

Provide wrapper, tooling and configuration to ease Node.js development with auto generated API for database and highly customizable extensions.

Simply create table and column to generate the API and add custom extension whenever required.

## Features

- Common configuration like tsconfig, gulpfile and eslintrc
- Fully TypeScript support for custom extensions
- Auto restart for every file save
- Graceful shutdown and close database connection

## Installation

```sh
npm i -S dbaas
yarn add dbaas
```

## Usage

### Declare models

```ts
interface Post {
  id: number
  title: string
  content: string
}
declare module "dbaas" {
  interface Models {
    posts: Post
    // add all models here
  }
}
```

### Create custom endpoints

#### src/extensions/endpoints/post/index.ts

```ts
import { RegisterEndpoint } from "dbaas"

const registerEndpoint: RegisterEndpoint = (router, ctx) => {
  /** GET /post/ */
  router.get("/", (_, res) => {
    res.send("ok")
  })
}
export default registerEndpoint
```

### Create action and filter hooks

#### src/extensions/hooks/post/index.ts

```ts
import { RegisterHook } from "dbaas"

const registerHook: RegisterHook = function ({ filter, action }, ctx) {
  // The `posts` string below is type checked so no mistake and better suggestions
  filter("posts.items.update", async (input) => {
    // prevent from update fields when status changed to review
    return input
  })
  action("posts.items.update", async (input) => {
    // or capture dateApproved when status change to approved
  })
}
export default registerHook
```

### Extend gulpfile

#### gulpfile.js

```js
const defaultGulpFile = require("./node_modules/dbaas/dist/gulpfile.js")
module.exports = {
  ...defaultGulpFile,
}
```

Then simply run like this `yarn gulp start`

## Creating API

Create table and column from database first. All REST and GraphQL API auto generated from the table and column.

Follow the example.env and create .env that will be loaded by `dotenv` to connect to the database.

## Future projects

- Custom workflow for hooks and automation
