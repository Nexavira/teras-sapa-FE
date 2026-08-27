---
trigger: model_decision
description: This rules was used for creating any backend codes
---

<RULE[backend]>

# Backend Specific Rules

- **CQRS Backend:** The backend MUST use CQRS (Command Query Responsibility Segregation), strictly separating read operations (queries) from write operations (commands/actions).
- **Database Schema Organization:** Database schemas MUST be separated by their domain or purpose into individual files (e.g., `src/db/schemas/auth.ts`, `src/db/schemas/todos.ts`). All schema files must be exported from a central entry point (e.g., `src/db/schemas/index.ts`) to avoid mixing all schemas into a single file.

</RULE[backend]>
