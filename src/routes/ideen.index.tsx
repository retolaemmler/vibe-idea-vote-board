import { createFileRoute, redirect } from "@tanstack/react-router";

// Former "Alle Ideen" page – now part of the dashboard. Keep old links working.
export const Route = createFileRoute("/ideen/")({
  beforeLoad: () => {
    throw redirect({ to: "/", hash: "alle-ideen", statusCode: 301 });
  },
});
