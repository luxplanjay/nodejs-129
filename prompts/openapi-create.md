Analyze this Express.js codebase. Create the OpenAPI 3.0 specification at `docs/openapi.json` and serve it with Swagger UI at `/api-docs`.

If `docs/openapi.json` already exists, stop and tell the user to run `prompts/openapi-sync.md` instead.

## Step 1: Explore the codebase

- Find all route definitions (`app.get`, `router.post`, `router.route()`, and so on).
- Find how routers are mounted in the app entry point, and the full path of each route.
- Find all controllers and their handler functions.
- Find all celebrate/Joi validation schemas. They define the request params, query, body, headers, and cookies of each endpoint.
- Find all middleware applied to each route: authentication, validation, file upload.
- Find the app-level 404 handler, error handler, and celebrate `errors()` middleware.
- Find what each endpoint returns. Read the controller, then follow the data into services, Mongoose models (including `toJSON` transforms and fields hidden from output), and pagination helpers.

## Step 2: Write the specification

Create `docs/openapi.json` according to the "Specification rules" section. It must include:

- `openapi: "3.0.3"`
- An `info` block. Get the title, description, and version from `package.json` if they are available.
- `servers: [{ "url": "/" }]`, so that Swagger UI sends requests to the origin that serves it.
- `components.securitySchemes` for the authentication that the code uses.
- All endpoints, grouped with tags. Derive the tags from router file names or route prefixes.
- For each endpoint:
  - HTTP method and full path
  - Summary and description, inferred from handler names and logic
  - Path, query, header, and cookie parameters, and the request body
  - All response codes, with a schema for each response body
  - Security requirements, where authentication middleware applies
- `components.schemas` for all reusable schemas.

## Step 3: Serve Swagger UI

- Install `swagger-ui-express` in `dependencies`, not in `devDependencies`.
- In the app entry point, read `docs/openapi.json` with the method that the project already uses for JSON files. This project uses ES modules, so `require()` is not available.
- Register `app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(spec))`.
- Register this route before the 404 handler, before the error handler, and before any app-level authentication middleware.

## Step 4: Verify

1. Run `npx @redocly/cli lint docs/openapi.json`. Fix all errors.
2. Compare the routes in the code with the paths in the specification, in both directions. Each route must be in the specification, and each path must be in the code.
3. Start the app. Confirm that `/api-docs/` returns `200` and that the Swagger UI page loads the specification.

## Step 5: Report

Tell the user:

- The number of documented endpoints, and the result of each check in Step 4
- Each item that you could not determine from the code (see "Specification rules")

## Specification rules

### Sources

- Read the actual code and Joi schemas. Do not use JSDoc or comment annotations.
- Do not write placeholder schemas. Each request schema must reflect the real Joi validation, and each response schema must reflect the real returned data.
- If you cannot determine something from the code, do not invent it. Describe only what you can confirm, and add the item to your report.
- Document endpoints that have no celebrate validation. Infer what you can from the handler code.

### Scope

- Do not change business logic, routes, validation, or models.
- Do not read `.env` files. If you need the name of a configuration value, use `.env.example` or the code.

### Paths

- Write each path with its full mount prefix.
- Convert Express path parameters to OpenAPI syntax: `/:id` becomes `/{id}`.

### Joi to OpenAPI

- `.required()`: list the field in `required` (for parameters, set `required: true`).
- `.default(value)`: `default`
- `Joi.string()`: `type: string`
- `Joi.number().integer()`: `type: integer`
- `Joi.array().items(Joi.string())`: `type: array`, `items: { type: string }`
- `Joi.object()`: nested object schema
- `Joi.alternatives()`: `oneOf`
- `.min()` and `.max()`: choose the keyword from the type.
  - String: `minLength`, `maxLength`
  - Number: `minimum`, `maximum`
  - Array: `minItems`, `maxItems`
- `.pattern()`: `pattern`
- `.valid()`: `enum`
- `.email()`: `format: email`
- `.allow(null)`: `nullable: true`
- `.custom()`, `.when()`, and other rules with no OpenAPI keyword: read the rule and state it in the field `description`. For example, a `.custom()` validator that calls `isValidObjectId` means that the value must be a valid MongoDB ObjectId.

### Responses

Document each status code that the endpoint can return, from all sources:

- The handler: success codes and direct error responses
- Services and helpers: errors made with `http-errors`
- Validation: the celebrate `errors()` response (`400` by default), if the route has validation. Read the real body shape from the code or the installed package.
- Authentication middleware: for example, `401`
- The app-level error handler: `500`

Also:

- Do not put a `content` block on a response that has no body, such as `204`.
- Do not include fields that the code removes from the output, such as a password hash.
- Document the `Set-Cookie` response header on endpoints that set cookies.

### Cookie authentication

- Define the scheme as `type: apiKey`, `in: cookie`. Set `name` to the cookie that the authentication middleware reads.
- Document each other cookie that an endpoint reads as an `in: cookie` parameter, or in its `description`.
- State in the scheme `description` that Swagger UI "Try it out" does not support cookie authentication.

### File uploads

- For routes that use `multer`, set the request body content type to `multipart/form-data`.
- Document each file field as `type: string`, `format: binary`. Joi does not describe these fields, so get them from the `multer` middleware call.
