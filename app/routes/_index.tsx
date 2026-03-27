import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router";
import SearchForm from "~/components/SearchForm";
import DrinkList from "~/components/DrinkList";
import {
  searchByName,
  searchByIngredient,
  getRandomDrink,
  type SearchResponse,
  type DrinkDetails,
} from "~/api/cocktailApi";
import styles from "~/components/_index.module.scss";

type SearchType = "name" | "ingredient";

const PAGE_SIZE = 10;

export default function Index() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const query = searchParams.get("q") ?? "";
  const rawType = searchParams.get("type");
  const type: SearchType =
    rawType === "ingredient" || rawType === "name" ? rawType : "name";
  const pageParam = Number(searchParams.get("page") ?? "1");
  const page = Number.isNaN(pageParam) || pageParam < 1 ? 1 : pageParam;

  const [drinks, setDrinks] = useState<SearchResponse["drinks"]>(null);
  const [randomDrink, setRandomDrink] = useState<DrinkDetails | null>(null);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);

    async function fetchData() {
      if (!query) {
        const random = await getRandomDrink();
        if (!cancelled) {
          setRandomDrink(random);
          setDrinks(null);
          setTotal(0);
          setLoading(false);
        }
        return;
      }

      const data =
        type === "ingredient"
          ? await searchByIngredient(query)
          : await searchByName(query);

      if (!cancelled) {
        const allDrinks = Array.isArray(data.drinks) ? data.drinks : [];
        const totalCount = allDrinks.length;
        const totalPages = Math.ceil(totalCount / PAGE_SIZE);
        const safePage = totalPages === 0 ? 1 : Math.min(page, totalPages);
        const start = (safePage - 1) * PAGE_SIZE;
        const paginated = allDrinks.slice(start, start + PAGE_SIZE);

        setDrinks(paginated as SearchResponse["drinks"]);
        setTotal(totalCount);
        setRandomDrink(null);
        setLoading(false);
      }
    }

    fetchData();
    return () => { cancelled = true; };
  }, [query, type, page]);

  function handleSearch(value: string, searchType: SearchType) {
    navigate(`/?q=${encodeURIComponent(value)}&type=${searchType}`);
  }

  const totalPages = Math.ceil(total / PAGE_SIZE);

  function goToPage(nextPage: number) {
    navigate(`/?q=${encodeURIComponent(query)}&type=${type}&page=${nextPage}`);
  }

  return (
    <div className={`${styles.page} page-fade`}>
      <h1 className="title">The Thirsty Endpoint</h1>
      <p className={styles.description}>
        Search for a drink by Name or Ingredient. Or{" "}
        <a href="/">click here</a> to see a random drink.
      </p>

      <SearchForm
        onSearch={handleSearch}
        nameValue={type === "name" ? query : ""}
        ingredientValue={type === "ingredient" ? query : ""}
        activeType={type}
      />

      {loading ? (
        <p style={{ textAlign: "center", marginTop: "2rem" }}>Loading...</p>
      ) : (
        <DrinkList
          drinks={drinks}
          randomDrink={randomDrink}
          searchKey={`${query}-${type}-${page}`}
        />
      )}

      {!loading && totalPages > 1 && (
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

      <p className={styles.description}>
        ✦ Big thanks to{" "}
        <a href="https://www.thecocktaildb.com/">The Cocktail DB</a> ✦
      </p>
    </div>
  );
}