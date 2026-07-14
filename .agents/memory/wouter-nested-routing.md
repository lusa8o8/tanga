---
name: Wouter nested routing — absolute paths
description: Inside a Wouter nest context, all Link hrefs and setLocation calls must use the ~ prefix to navigate to absolute paths, or they resolve relative to the nest base.
---

## The rule

Any `<Link href="...">` or `setLocation("...")` call inside a Wouter `<Route path="..." nest>` context resolves **relative to the nest base**, not the site root. To navigate to an absolute path from within a nest, prefix with `~`:

```tsx
// WRONG — inside /admin nest, this becomes /admin/admin/books
<Link href="/admin/books">...</Link>
setLocation("/admin/books")

// CORRECT — ~ makes it absolute
<Link href="~/admin/books">...</Link>
setLocation("~/admin/books")
```

**Why:** Wouter's `nest` prop scopes all child routing to the matched prefix. This is intentional for relative child routes, but every cross-nest or cross-tree navigation must be absolute.

**How to apply:** Whenever generating admin pages that sit inside `<Route path="/admin" nest>`, prefix every href and setLocation with `~` for paths that start with `/admin`. Child-relative paths (e.g. just `/books` inside the nest) are fine without `~`.

Also: `<Route path="/" nest>` is required for public routes to match sub-paths like `/catalog` — without `nest`, only exactly `/` is matched in a `<Switch>`.
