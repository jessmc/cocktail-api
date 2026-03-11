import { type RouteConfig, index, route } from "@react-router/dev/routes";

export default [
  index("routes/_index.tsx"),
  route("drink/:id", "routes/drink/$id.tsx"),
  route("test/api", "routes/test.api.jsx"),
] satisfies RouteConfig;