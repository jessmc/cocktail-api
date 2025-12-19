import DrinkCard from "./DrinkCard";
import type { DrinkSummary } from "~/api/cocktailApi";
import styles from "./DrinkList.module.scss";


interface DrinkListProps {
    drinks: DrinkSummary[] | null;
}

export default function DrinkList({drinks}: DrinkListProps) {
    if (!Array.isArray(drinks) || drinks.length === 0) {
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