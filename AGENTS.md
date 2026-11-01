<!-- LOVABLE:BEGIN -->
> [!IMPORTANT]
> This project is connected to [Lovable](https://lovable.dev). Avoid rewriting
> published git history — force pushing, or rebasing/amending/squashing commits
> that are already pushed — as it rewrites history on Lovable's side and the
> user will likely lose their project history.
>
> Commits you push to the connected branch sync back to Lovable and show up in
> the editor, so keep the branch in a working state.
<!-- LOVABLE:END -->

## Application architecture
- Account and booking flows are a frontend-only demonstration using a shared React provider and sessionStorage, never real authentication or server authorization; this keeps sample data isolated to the browser tab without implying production accounts.
- Booking lifecycle rules and sample entities live in a browser-safe domain module with tests so lists and details use the same statuses and ownership rules.
