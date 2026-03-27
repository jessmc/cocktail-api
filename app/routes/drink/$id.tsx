import { useState, useEffect } from "react";
import { Link, useLocation, useParams } from "react-router";
import type { DrinkDetails } from "~/api/cocktailApi";
import { getDrinkById } from "~/api/cocktailApi";
import styles from "./DrinkPage.module.scss";

interface Ingredient {
  ingredient: string;
  measure?: string;
}

type DrinkPageData = Omit<DrinkDetails, "ingredients"> & { ingredients: Ingredient[] };

function getIngredients(drink: DrinkDetails): { ingredient: string; measure: string | null }[] {
  const ingredients = [];
  for (let i = 1; i <= 15; i++) {
    const ingredient = drink[`strIngredient${i}`];
    const measure = drink[`strMeasure${i}`];
    if (ingredient) {
      ingredients.push({ ingredient, measure: measure ?? null });
    }
  }
  return ingredients;
}

export default function DrinkPage() {
  const { id } = useParams();
  const location = useLocation();
  const backTo = location.search ? `/${location.search}` : "/";

  const [drink, setDrink] = useState<DrinkPageData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) {
      setError("No drink ID provided.");
      setLoading(false);
      return;
    }

    let cancelled = false;

    async function fetchDrink() {
      try {
        const data: DrinkDetails = await getDrinkById(id!);
        if (!cancelled) {
          setDrink({ ...data, ingredients: getIngredients(data) } as unknown as DrinkPageData);
          setLoading(false);
        }
      } catch (e) {
        if (!cancelled) {
          setError("Could not load drink.");
          setLoading(false);
        }
      }
    }

    fetchDrink();
    return () => { cancelled = true; };
  }, [id]);

  if (loading) return <p style={{ textAlign: "center", marginTop: "2rem" }}>Loading...</p>;
  if (error || !drink) return <p style={{ textAlign: "center", marginTop: "2rem" }}>{error ?? "Drink not found."}</p>;

  return (
    <div className={`${styles.page} page-fade`}>
      <a href="/">
        <h1 className="site-title">The Thirsty Endpoint</h1>
      </a>

      <Link to={backTo} className={styles.back}>
        ← Back to search
      </Link>

      <div className={styles.feature}>
        <img
          src={drink.strDrinkThumb ?? ""}
          className={styles.image}
        />

        <div className={styles.details}>
          <div className={styles.meta}>
            {drink.strCategory && <span className={styles.tag}>{drink.strCategory}</span>}
            {drink.strAlcoholic && <span className={styles.tag}>{drink.strAlcoholic}</span>}
          </div>

          <h2 className={styles.title}>{drink.strDrink}</h2>

          {drink.ingredients.length > 0 && (
            <div className={styles.ingredients}>
              <h4 className={styles.sectionLabel}>Ingredients</h4>
              <ul className={styles.ingredientList}>
                {drink.ingredients.map(({ ingredient, measure }) => (
                  <li key={ingredient} className={styles.ingredientItem}>
                    <span className={styles.ingredientName}>{ingredient}</span>
                    {measure && <span className={styles.measure}>{measure.trim()}</span>}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {drink.strInstructions && (
            <div className={styles.instructions}>
              <h4 className={styles.sectionLabel}>Instructions</h4>
              <p>{drink.strInstructions}</p>
            </div>
          )}
        </div>
      </div>

      <p className={styles.description}>
        ✦ Big thanks to <a href="https://www.thecocktaildb.com/">The Cocktail DB</a> ✦
      </p>
    </div>
  );
}