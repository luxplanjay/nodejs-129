Update `docs/openapi.json` to match the current code. The code is the source of truth.

If `docs/openapi.json` does not exist, stop and tell the user to run `prompts/openapi-create.md` instead.

Write all changes according to the "Specification rules" section of `prompts/openapi-create.md`. Read that section first.

## Step 1: Compare the code with the specification

Scan the routes, router mounts, controllers, celebrate/Joi schemas, and middleware. Follow the returned data into services, Mongoose models, and pagination helpers.

Find these differences:

- Endpoints that are not in the specification
- Paths in the specification that are not in the code
- Endpoints that moved or were renamed. Do not treat these as a removal and an addition.
- Changed request schemas: fields, types, constraints
- Changed response codes and response bodies
- Changed middleware: authentication, validation, file upload
- Changed route prefixes and router mounts
- Tags and `components.schemas` that nothing uses after these changes

## Step 2: Get approval

Show the list of proposed changes, grouped by endpoint. Include each conflict between manual text and the code.

Stop and wait for the user to approve the list. Do not edit files before approval.

## Step 3: Update the specification

Apply only the approved changes:

- Add new endpoints with full request and response schemas.
- Remove deleted endpoints.
- For moved or renamed endpoints, change the path and keep the manual text.
- Update changed schemas, response codes, tags, and security requirements.
- Remove the unused tags and `components.schemas`.

## Step 4: Verify

1. Run `npx @redocly/cli lint docs/openapi.json`. Fix all errors.
2. Compare the routes in the code with the paths in the specification, in both directions. Each route must be in the specification, and each path must be in the code.
3. Start the app. Confirm that `/api-docs/` returns `200` and that the Swagger UI page loads the specification.

## Step 5: Report

Tell the user:

- What changed, and the result of each check in Step 4
- Each item that you could not determine from the code
- Each problem with the Swagger UI integration

## Rules

- Update the existing file. Do not regenerate it, and keep its key order and formatting, so that the diff stays small.
- Do not change an endpoint if its specification already matches the code.
- Keep manual text: descriptions, examples, notes. If manual text conflicts with the code, the structure follows the code. Show the conflict in Step 2, and let the user decide about the text.
- Do not change the Swagger UI integration or install packages. If the integration is broken or missing, report the problem.
