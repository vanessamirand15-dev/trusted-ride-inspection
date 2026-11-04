import { QueryClient } from "@tanstack/react-query";
import { createRouter, rootRouteId } from "@tanstack/react-router";
import { describe, expect, it } from "vitest";

import { routeTree } from "@/routeTree.gen";

// Match routes without running loaders or rendering: loaders may need a server or
// network the test run lacks, and jsdom never loads the stylesheets React waits on.
describe("App routing", () => {
  it('keeps Quick Login outside real customer guards without moving protected bookings', () => {
    const router = createRouter({ routeTree, context: { queryClient: new QueryClient() } });
    const ids = router.matchRoutes('/demo').map(match => match.routeId);
    expect(ids.at(-1)).toBe('/demo');
    expect(ids).not.toContain('/_authenticated');
    expect(router.matchRoutes('/account/settings').map(match => match.routeId)).toContain('/_authenticated/_buyer');
  });
  it("matches a page for / instead of falling back to not found", () => {
    const router = createRouter({ routeTree, context: { queryClient: new QueryClient() } });

    const matches = router.matchRoutes("/");

    expect(matches.at(-1)?.routeId).not.toBe(rootRouteId);
  });
  it('places bookings behind both authentication and profile completion', () => {
    const router = createRouter({ routeTree, context: { queryClient: new QueryClient() } });
    const ids = router.matchRoutes('/bookings').map(match => match.routeId);
    expect(ids).toContain('/_authenticated');
    expect(ids).toContain('/_authenticated/_buyer');
  });
  it('requires authentication and profile completion before new inspections', () => {
    const router = createRouter({ routeTree, context: { queryClient: new QueryClient() } });
    const ids = router.matchRoutes('/book').map(match => match.routeId);
    expect(ids).toContain('/_authenticated');
    expect(ids).toContain('/_authenticated/_buyer');
  });
});
