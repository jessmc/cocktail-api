import { type RouteConfig, index, route } from "@react-router/dev/routes";

export default [
  index("routes/_index.tsx"),

  route("search/name", "routes/search.name.jsx"),

  route("search/ingredient", "routes/search.ingredient.jsx"),

  route("drink/:id", "routes/drink/$id.tsx"),

  route("test/api", "routes/test.api.jsx"),

] satisfies RouteConfig;
