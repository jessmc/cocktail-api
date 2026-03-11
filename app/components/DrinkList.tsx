import DrinkCard from "./DrinkCard";
import type { DrinkSummary, DrinkDetails } from "~/api/cocktailApi";
import RandomDrinkFeature from "./RandomDrinkFeature";
import styles from "./DrinkList.module.scss";


interface DrinkListProps {
    drinks: DrinkSummary[] | null;
    randomDrink?: DrinkDetails | null;
    searchKey?: string;
}

export default function DrinkList({drinks, randomDrink, searchKey}: DrinkListProps) {
    // no search yet -- show the random drink
    if (drinks === null) {
        if (!randomDrink) return <p>Loading...</p>;
        return <RandomDrinkFeature drink={randomDrink} />;
    }

    // if no drinks found in search
    if (drinks.length === 0) {
        return <p>No drinks found.</p>;
    }

    // return the list of drinks from search results
    return (
        <div className={styles.grid} key={searchKey}>
            {drinks.map((drink, i) => (
                <DrinkCard key={drink.idDrink} drink={drink} index={i} />
            ))}
        </div>
    )
}