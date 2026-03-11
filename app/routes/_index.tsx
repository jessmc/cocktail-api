import { useLoaderData, useNavigate } from "react-router";
import type { LoaderFunctionArgs } from "react-router";
import SearchForm from "~/components/SearchForm";
import DrinkList from "~/components/DrinkList";
import { searchByName, searchByIngredient, getRandomDrink, type SearchResponse, type DrinkDetails } from "~/api/cocktailApi";
import styles from "~/components/_index.module.scss";

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
    const randomDrink = await getRandomDrink();
    return {
      drinks: null,
      query: "",
      type,
      total: 0,
      page: 1,
      randomDrink,
    } satisfies {
      drinks: SearchResponse["drinks"];
      query: string;
      type: "name" | "ingredient";
      total: number;
      page: number;
      randomDrink: DrinkDetails | null;
    };
  }

  const data =
    type === "ingredient"
      ? await searchByIngredient(query)
      : await searchByName(query);

  const PAGE_SIZE = 10;
  const pageParam = Number(url.searchParams.get("page") ?? "1");
  const page = Number.isNaN(pageParam) || pageParam < 1 ? 1 : pageParam;

  const allDrinks = Array.isArray(data.drinks) ? data.drinks : [];
  const total = allDrinks.length;
  const totalPages = Math.ceil(total / PAGE_SIZE);
  const safePage = totalPages === 0 ? 1 : Math.min(page, totalPages);
  const start = (safePage - 1) * PAGE_SIZE;
  const paginatedDrinks = allDrinks.slice(start, start + PAGE_SIZE);

  return {
    drinks: paginatedDrinks,
    query,
    type,
    total,
    page: safePage,
    randomDrink: null,
  } satisfies {
    drinks: SearchResponse["drinks"];
    query: string;
    type: "name" | "ingredient";
    total: number;
    page: number;
    randomDrink: DrinkDetails | null;
  };
}

export default function Index() {
  const { drinks, total, page, query, type, randomDrink } = useLoaderData() as {
    drinks: SearchResponse["drinks"];
    total: number;
    page: number;
    query: string;
    type: "name" | "ingredient";
    randomDrink: DrinkDetails | null;
  };

  const navigate = useNavigate();

  function handleSearch(value: string, searchType: SearchType) {
    navigate(`/?q=${encodeURIComponent(value)}&type=${searchType}`);
  }

  const PAGE_SIZE = 10;
  const totalPages = Math.ceil(total / PAGE_SIZE);

  function goToPage(nextPage: number) {
    navigate(`/?q=${encodeURIComponent(query)}&type=${type}&page=${nextPage}`);
  }

  return (
    <div className={`${styles.page} page-fade`}>
      <h1 className="title">The Thirsty Endpoint</h1>
      <p className={styles.description}>Search for a drink by Name or Ingredient. Or <a href="/">click here</a> to see a random drink.</p>

      <SearchForm
        onSearch={handleSearch}
        nameValue={type === "name" ? query : ""}
        ingredientValue={type === "ingredient" ? query : ""}
        activeType={type}
      />

      <DrinkList drinks={drinks} randomDrink={randomDrink} searchKey={`${query}-${type}-${page}`} />

      {totalPages > 1 && (
        <div className={styles.pagination}>
          <button
            className={styles.pageBtn}
            disabled={page <= 1}
            onClick={() => goToPage(page - 1)}
          >
            ← Prev
          </button>

          <span className={styles.pageInfo}>
            {page} / {totalPages}
          </span>

          <button
            className={styles.pageBtn}
            disabled={page >= totalPages}
            onClick={() => goToPage(page + 1)}
          >
            Next →
          </button>
        </div>
      )}

      <p className={styles.description}>✦ Big thanks to <a href="https://www.thecocktaildb.com/">The Cocktail DB</a> ✦</p>
    </div>
  );
}