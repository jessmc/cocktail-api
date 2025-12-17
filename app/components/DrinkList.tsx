import DrinkCard from "./DrinkCard";
import type { DrinkSummary } from "~/api/cocktailApi";
import styles from "./DrinkList.module.scss";


interface DrinkListProps {
    drinks: DrinkSummary[] | null;
}

export default function DrinkList({drinks}: DrinkListProps) {
    if (!drinks) {
        return <p className={styles.empty}>Start searching for drinks!</p>;
    }

    if (drinks.length === 0) {
        return <p className={styles.empty}>No drinks found.</p>;
    }

    return (
        <div className={styles.grid}>
            {drinks.map((drink) => (
                <DrinkCard key={drink.idDrink} drink={drink} />
            ))}
        </div>
    )
}