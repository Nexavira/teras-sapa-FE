# Implementation conventions

## Forms and schemas

- Place form components in the feature's `-schema` folder.
- Place each form's Zod schema in a sibling `-utils` folder at the same directory level as `-schema`. Despite its name, `-schema` contains form components; `-utils` contains validation schemas.
- Export the schema, its inferred form type (`z.infer<typeof schema>`), and initial form values from the schema module.
- Use the schema with `zodResolver` in React Hook Form and use the inferred type for form values.
- Keep field names aligned with the schema and API request body.

Example:

```text
src/routes/login/
  -schema/LoginForm.tsx
  -utils/-login-schema.ts
  index.tsx
```

## Services and API types

- Mutation services must import their request body type inferred from the corresponding schema in `-utils`; do not duplicate request body interfaces in service files.
- When a mutation needs additional request fields, compose a request schema from the form schema in `-utils` and infer its type there.
- Place GET service response types in the top-level `src/types` folder and import them into services. Use the shared `ApiResponse` envelope where applicable.
- Keep registration and OTP services separate. Sending or resending OTP must use the send-OTP endpoint, not repeat registration.
