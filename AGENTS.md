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
- Seller inspections reuse the demo account and booking wizard with a saved booking purpose; the dedicated seller area filters owned seller requests without adding a separate transaction or identity-verification system.
- Mock financial screens share a presentation-only component; financial inputs remain in transient forms and never enter browser storage, booking records or backend requests, keeping simulated banking separate from real inspector accounts.
- Account and booking flows are a frontend-only demonstration using a shared React provider and sessionStorage, never real authentication or server authorization; this keeps sample data isolated to the browser tab without implying production accounts.
- Booking lifecycle rules and sample entities live in a browser-safe domain module with tests so lists and details use the same statuses and ownership rules.
- The completed sample booking's report is a presentation-only component with condition, history, and photo views; fictional findings remain separate from lifecycle data and never imply verified records.
- Inspection packages come from one browser-safe catalog shared by home, pricing and booking controls, with price and coverage tests, so offered packages stay consistent.
- The public Honda sample report is independent of account booking reports so fictional preview findings never change booking lifecycle records.
