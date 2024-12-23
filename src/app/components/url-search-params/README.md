# Instant Search Params Demo

In this demo, we'll use the `useOptimistic` hook to implement optimistic updates for our search params. The reason why we do that is we need to update the URL asap while our page (a server component) makes a roundtrip to the server to render the new URL.

When we do the `router.push`, this behavior is exactly how normal links work in the browser. When you click a link, the browser keeps the current page rendered while it goes off and fetches the next page.

So, it makes a lot of sense that navigations in Next.js are marked as transitions.
