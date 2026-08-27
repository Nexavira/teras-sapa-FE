<RULE[global]>

# Global Architecture and Standards

- **Headless Architecture:** The frontend (page builder) and backend (product management) MUST be entirely separated and communicate purely through APIs.
- **Code Quality:** All code MUST adhere to strict quality standards, including consistent formatting, static typing (TypeScript), and modular design to ensure maintainability and readability.
- **Testing Standards:** Robust testing practices MUST be followed, incorporating Unit, Integration, and E2E tests. Testing is non-negotiable for critical paths. Red-Green-Refactor cycle or TDD SHOULD be employed where practical.
- **Performance:** The system MUST be highly performant. The frontend builder must render efficiently without lag, and the CQRS backend must be optimized for fast API responses.
- **User Experience:** The platform MUST provide a seamless, highly intuitive, and aesthetically consistent user experience.
  </RULE[global]>
