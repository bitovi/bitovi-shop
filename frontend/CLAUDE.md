## Frontend context and constraints

### API and environment
- In frontend code, call API endpoints with `/api/...` paths. Do not hardcode backend URLs.
- Build and test main flows against the real backend whenever possible.

### UX and styling
- Keep UI behavior obvious. Avoid hidden auto-actions that are hard to explain.
- Stick to the current styling approach: plain CSS files next to components.
- Use design tokens only: colors, spacing, radius and type come from the CSS variables in `src/styles.css`. No raw hex values or hand-picked pixel spacing.

### Contracts and dependencies
- Reuse types and data shapes from `shared/` instead of redefining them in frontend files.
- Avoid new frontend packages when a small local utility can do the job.
