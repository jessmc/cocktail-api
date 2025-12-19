import { useLoaderData, useNavigate } from "react-router";
import type { LoaderFunctionArgs } from "react-router";
import SearchForm from "~/components/SearchForm";
import DrinkList from "~/components/DrinkList";
import { searchByName, searchByIngredient, type SearchResponse } from "~/api/cocktailApi";

type SearchType = "name" | "ingredient";

export async function loader({ request }: LoaderFunctionArgs) {
  const url = new URL(request.url);
  const query = url.searchParams.get('q');
  const rawType = url.searchParams.get("type");

  const type: SearchType =
    rawType === "ingredient" || rawType === "name"
      ? rawType
      : "name";


  if (!query) {
    return {
      drinks: null,
      query: "",
      type,
      total: 0,
      page: 1,
    } satisfies {
      drinks: SearchResponse["drinks"];
      query: string;
      type: "name" | "ingredient";
      total: number;
      page: number;
    };
  }

  const data =
    type === "ingredient"
      ? await searchByIngredient(query)
      : await searchByName(query);

  // pagination
  const PAGE_SIZE = 10;
  const pageParam = Number(url.searchParams.get("page") ?? "1");
  const page = Number.isNaN(pageParam) || pageParam < 1 ? 1 : pageParam;

  const rawDrinks = data.drinks;

  // normalize
  const allDrinks = Array.isArray(rawDrinks) ? rawDrinks : [];

  const total = allDrinks.length;

  const totalPages = Math.ceil(total / PAGE_SIZE);

  const safePage =
    totalPages === 0 ? 1 : Math.min(page, totalPages);

  const start = (safePage - 1) * PAGE_SIZE;
  const paginatedDrinks = allDrinks.slice(start, start + PAGE_SIZE);


  return {
    drinks: paginatedDrinks,
    query,
    type,
    total,
    page: safePage,
  } satisfies {
    drinks: SearchResponse["drinks"];
    query: string;
    type: "name" | "ingredient";
    total: number;
    page: number;
  };
}

export default function Index() {

  const { drinks, total, page, query, type } = useLoaderData() as {
    drinks: SearchResponse["drinks"];
    total: number;
    page: number;
    query: string;
    type: "name" | "ingredient";
  };

  const navigate = useNavigate();

  function searchByName(value: string) {
    navigate(`/?q=${encodeURIComponent(value)}&type=name`);
  }

  function searchByIngredient(value: string) {
    navigate(`/?q=${encodeURIComponent(value)}&type=ingredient`);
  }

  const isNameSearch = type === "name";
  const isIngredientSearch = type === "ingredient";

  const totalPages = Math.ceil(total / 12);

  function goToPage(nextPage: number) {
    navigate(
      `/?q=${encodeURIComponent(query)}&type=${type}&page=${nextPage}`
    );
  }

  return (
    <div>
      <h1>Cocktail Search</h1>
      <div style={{ display: "flex", gap: "1rem" }}>
        <SearchForm
          label="Search drinks by name"
          placeholder="Margarita"
          value={isNameSearch ? query : ""}
          onSearch={searchByName}
        />

        <SearchForm
          label="Search drinks by ingredient"
          placeholder="Gin"
          value={isIngredientSearch ? query : ""}
          onSearch={searchByIngredient}
        />
      </div>

      <DrinkList drinks={drinks}/>

      {totalPages > 1 && (
        <div>
          <button disabled={page <= 1} onClick={() => goToPage(page - 1)}>
            Previous
          </button>

          <span>
            Page {page} of {totalPages}
          </span>

          <button
            disabled={page >= totalPages}
            onClick={() => goToPage(page + 1)}
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
}
