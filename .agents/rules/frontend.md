---
trigger: model_decision
description: This rules was used for creating any backend codes
---

<RULE[frontend]>

# Frontend Specific Rules

- **Frontend Data Access & ID Usage:** Only data models directly accessible as resources by the frontend MUST include a `uuid` field for external access. For frontend-accessible entities, the frontend MUST strictly use the `uuid` instead of the internal `id` to reference records. Internal relational data or backend-only entities do not require a `uuid`.
- **API Fetching:** All frontend API requests MUST route through a centralized `fetch` helper function.
- **Data Fetching Hooks:** TanStack Query hooks MUST be organized by entity and separated by action, placing each hook in its own file (e.g., `services/user/useGetUser.ts`, `services/user/useCreateUser.ts`).
- **Styling:** For component styling, the project MUST always use Emotion (`@emotion/react` and `@emotion/styled`). TailwindCSS or Vanilla CSS modules are prohibited unless explicitly authorized.
- **Component Colocation:** Components exclusively used by a single page must be colocated with that page rather than placed in a global components directory. For example, if a `RegisterForm` is only used on the `/register` route, it MUST be structured as:
  - `src/routes/register/index.tsx`
  - `src/routes/register/components/RegisterForm.tsx`
- **Form Management:** For managing form state, use `react-hook-form`. Create a wrapper for all form components (`ControlWrapper`). Every form input component (like `TextField`) MUST use this wrapper internally. When building forms, pass the `control` object from `useForm` directly to these input components, as shown in the example below:

  **Form Usage Example:**

  ```tsx
  import { useForm } from 'react-hook-form'
  import { TextField } from '#/components/ui/form/text-input'

  export default function LoginForm({ onSubmit }) {
    const { control, handleSubmit } = useForm<LoginFormType>({ ... })

    return (
      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
        <TextField control={control} name="email" label="Email" type="email" />
      </form>
    )
  }
  ```

</RULE[frontend]>
