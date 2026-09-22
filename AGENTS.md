<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

## Component structure

- Always keep files short by extracting cohesive UI sections and reusable elements into focused components wherever possible.
- Keep page files focused on composing components; put supporting content and interaction logic in small, dedicated modules or components.
- Reduce file length through component extraction, not by compressing readable code onto fewer lines.

## Tailwind CSS

- Use the `brand-50` through `brand-950` color scale defined in `app/globals.css` for brand colors. Primary teal is `brand-500`; prefer utilities such as `bg-brand-500` and `hover:bg-brand-600` over hardcoded teal values.
- Always prefer standard Tailwind utilities over arbitrary values, such as `rounded-3xl` instead of `rounded-[24px]` and `leading-normal` instead of `leading-[1.5]`.
- Use the built-in typography and spacing scales wherever possible; reserve arbitrary values for custom colors or layouts without a suitable standard utility.
