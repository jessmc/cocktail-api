import { Link, useLocation } from "react-router";
import type { DrinkSummary } from "~/api/cocktailApi";
import styles from "./DrinkCard.module.scss";

interface DrinkCardProps {
    drink: DrinkSummary;
    index?: number;
}

export default function DrinkCard({ drink, index = 0 }: DrinkCardProps) {
    const location = useLocation();

    return (
        <article 
            className={styles.card}
            style={{ animationDelay: `${index * 60}ms` }}
        >
            <Link to={`/drink/${drink.idDrink}${location.search}`}>
                <img
                    src={drink.strDrinkThumb}
                    alt={drink.strDrink}
                    loading="lazy"
                />
                <div className={styles.body}>
                    <h3>{drink.strDrink}</h3>
                    <span className={styles.cta}>View details →</span>
                </div>
            </Link>
        </article>
    );
}