import DrinkCard from "./DrinkCard";
import type { DrinkSummary, DrinkDetails } from "~/api/cocktailApi";
import RandomDrinkFeature from "./RandomDrinkFeature";
import styles from "./DrinkList.module.scss";


interface DrinkListProps {
    drinks: DrinkSummary[] | null;
    randomDrink?: DrinkDetails | null;
}

export default function DrinkList({drinks, randomDrink}: DrinkListProps) {
    // no search yet -- show the random drink
    if (drinks === null) {
        if (!randomDrink) return <p>Loading...</p>;
        return <RandomDrinkFeature drink={randomDrink} />;
    }

    if (drinks.length === 0) {
        return <p>No drinks found.</p>;
    }

    return (
        <div className={styles.grid}>
            {drinks.map((drink) => (
                <DrinkCard key={drink.idDrink} drink={drink} />
            ))}
        </div>
    )
}