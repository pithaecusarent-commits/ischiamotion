const baseUrl = (
  process.env.SMOKE_BASE_URL ||
  process.env.NEXT_PUBLIC_SITE_URL ||
  "http://localhost:3000"
).replace(/\/$/, "");

const routes = [
  "/",
  "/it",
  "/en",
  "/admin/login",
  "/renter",
  "/renter/login",
  "/renter/register",
  "/auth/callback",
  "/auth/forgot-password",
  "/auth/update-password",
  "/it/noleggio-scooter-ischia",
  "/it/noleggio-auto-ischia",
  "/it/noleggio-gommoni-ischia",
  "/it/noleggio-barche-ischia",
  "/it/beach-club-ischia",
  "/en/ischia-beach-club",
  "/it/barca-con-skipper-ischia",
];

const validStatuses = new Set([200, 301, 302, 303, 307, 308]);

function routeUrl(route) {
  return new URL(route, `${baseUrl}/`).toString();
}

async function checkRoute(route) {
  const url = routeUrl(route);

  try {
    const response = await fetch(url, {
      method: "GET",
      redirect: "manual",
      headers: {
        "user-agent": "IschiaMotion smoke test",
      },
    });

    return {
      route,
      status: response.status,
      ok: validStatuses.has(response.status),
    };
  } catch (error) {
    return {
      route,
      status: "fetch failed",
      ok: false,
      error: error instanceof Error ? error.message : String(error),
    };
  }
}

const results = await Promise.all(routes.map(checkRoute));
const failures = results.filter((result) => !result.ok);

console.log(`Smoke test base URL: ${baseUrl}`);
for (const result of results) {
  const status = String(result.status).padEnd(12, " ");
  const marker = result.ok ? "OK " : "ERR";
  const suffix = result.error ? ` - ${result.error}` : "";
  console.log(`${marker} ${status} ${result.route}${suffix}`);
}

if (failures.length > 0) {
  console.error(`Smoke test failed: ${failures.length} route(s) did not return an allowed status.`);
  process.exit(1);
}

console.log("Smoke test passed.");
