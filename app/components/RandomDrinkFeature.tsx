import { Link, useLocation } from "react-router";
import type { DrinkDetails } from "~/api/cocktailApi";
import styles from "./RandomDrinkFeature.module.scss";

interface RandomDrinkFeatureProps {
    drink: DrinkDetails;
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

export default function RandomDrinkFeature({ drink }: RandomDrinkFeatureProps) {
    const location = useLocation();
    const ingredients = getIngredients(drink);

    return (
        <div className={styles.wrapper}>
            <p className={styles.label}>✦ Drink of the moment</p>
            <div className={styles.feature}>
                <Link
                    to={`/drink/${drink.idDrink}${location.search}`}
                    className={styles.imageLink}
                >
                    <img
                        src={drink.strDrinkThumb}
                        alt={drink.strDrink}
                        className={styles.image}
                    />
                </Link>

                <div className={styles.details}>
                    <div className={styles.meta}>
                        {drink.strCategory && <span className={styles.tag}>{drink.strCategory}</span>}
                        {drink.strAlcoholic && <span className={styles.tag}>{drink.strAlcoholic}</span>}
                    </div>

                    <Link
                        to={`/drink/${drink.idDrink}${location.search}`}
                        className={styles.nameLink}
                    >
                        <h2 className={styles.name}>{drink.strDrink}</h2>
                    </Link>

                    {drink.strInstructions && (
                        <p className={styles.instructions}>{drink.strInstructions}</p>
                    )}

                    {ingredients.length > 0 && (
                        <div className={styles.ingredients}>
                            <h4 className={styles.ingredientsTitle}>Ingredients</h4>
                            <ul className={styles.ingredientList}>
                                {ingredients.map(({ ingredient, measure }) => (
                                    <li key={ingredient} className={styles.ingredientItem}>
                                        <span className={styles.ingredientName}>{ingredient}</span>
                                        {measure && <span className={styles.measure}>{measure.trim()}</span>}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
