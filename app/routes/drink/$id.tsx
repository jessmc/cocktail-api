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

    // transform ingredients + measures into an array
    const ingredients: Ingredient[] = [];
    for (let i = 1; i <= 15; i++) {
        const ingredient = drink[`strIngredient${i}`];
        const measure = drink[`strMeasure${i}`];
        if (ingredient) {
        ingredients.push({ ingredient, measure: measure ?? undefined });
        }
    }

    return ({
    ...drink,
    ingredients,
    } as unknown) as DrinkPageData;

}

export default function DrinkPage() {
    const drink = useLoaderData() as DrinkPageData;
    const location = useLocation();
    const backTo = location.search ? `/${location.search}` : "/";

    return (
        <div className={styles.page}>
            <Link to={backTo} className={styles.back}>
        ← Back to search
      </Link>
            <h1 className={styles.title}>{drink.strDrink}</h1>
            <img
                src={drink.strDrinkThumb ?? ""}
                
                className={styles.image}
            />

            <section className={styles.ingredients}>
                <h2>Ingredients</h2>
                <ul>
                {drink.ingredients.map(({ ingredient, measure }) => (
                    <li key={ingredient}>
                    {ingredient} {measure && `- ${measure}`}
                    </li>
                ))}
                </ul>
            </section>

            {drink.strInstructions && (
                <section className={styles.instructions}>
                <h2>Instructions</h2>
                <p>{drink.strInstructions}</p>
                </section>
            )}

            <section className={styles.info}>
                {drink.strCategory && <p>Category: {drink.strCategory}</p>}
                {drink.strAlcoholic && <p>Type: {drink.strAlcoholic}</p>}
            </section>
        </div>

        
    )
}