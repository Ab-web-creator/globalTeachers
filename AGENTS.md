<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

## Component structure

- Keep page files focused on importing and composing section components in display order.
- Use sections as the main component boundary. Keep section-specific cards, copy, notes, and illustrations inside the section file; small local helpers are fine when they avoid repetition.
- Extract deeper components only for elements shared across sections or substantial interactive controls and animations. Keep content data and hooks in dedicated modules where useful.
- Keep code readable; do not shorten files by compressing code or splitting a section into many tiny component files.

## SVG assets

- Keep SVG markup and path data in `app/components/svg`, grouped into icons, illustrations, masks, and data modules.
- Export SVG components by descriptive names through `app/components/svg/index.ts`. Use names that describe the graphic, with `Icon`, `Illustration`, or `Mask` where appropriate.
- Import SVG components into sections instead of embedding raw SVG markup. Keep interaction state in the owning UI component and pass it to the SVG when needed.
- Keep standalone `.svg` files in `public/svg`, grouped by purpose. Export their public URLs from `app/components/svg/assets.ts`; CSS may reference those URLs directly.

## Tailwind CSS

- In content sections, use `mt-7` (28px) between the main heading and its description. Keep spacing between subsequent paragraphs separate.
- Use a 40px gap (`mt-10` or equivalent) before main card grids.
- Normal content sections use `py-12 sm:py-16 lg:py-20` for vertical padding.

- Use the `brand-50` through `brand-950` color scale defined in `app/globals.css` for brand colors. Primary teal is `brand-500`; prefer utilities such as `bg-brand-500` and `hover:bg-brand-600` over hardcoded teal values.
- Always prefer standard Tailwind utilities over arbitrary values, such as `rounded-3xl` instead of `rounded-[24px]` and `leading-normal` instead of `leading-[1.5]`.
- Use the built-in typography and spacing scales wherever possible; reserve arbitrary values for custom colors or layouts without a suitable standard utility.
