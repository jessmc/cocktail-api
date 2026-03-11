import { useLoaderData, Link, useLocation } from "react-router";
import type { LoaderFunctionArgs } from "react-router";
import type { DrinkDetails } from "~/api/cocktailApi";
import { getDrinkById } from "~/api/cocktailApi";
import styles from "./DrinkPage.module.scss";

// Derived type for ingredients
interface Ingredient {
  ingredient: string;
  measure?: string;
}

// Page data type: extends DrinkDetails without conflicting 'ingredients'
type DrinkPageData = Omit<DrinkDetails, "ingredients"> & { ingredients: Ingredient[] };


export async function loader({params}: LoaderFunctionArgs) {
    const { id } = params;
    if (!id) throw new Error("No drink ID provided.");

    const drink: DrinkDetails = await getDrinkById(id);
    const ingredients = getIngredients(drink);

    return ({
    ...drink,
    ingredients
    } as unknown) as DrinkPageData;

}

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
    const drink = useLoaderData() as DrinkPageData;
    const location = useLocation();
    const backTo = location.search ? `/${location.search}` : "/";
    

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

        <p className={styles.description}>✦ Big thanks to <a href="https://www.thecocktaildb.com/">The Cocktail DB</a> ✦</p>
    </div>
);
}