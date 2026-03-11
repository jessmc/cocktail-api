import { Link, useLocation } from "react-router";
import type { DrinkSummary } from "~/api/cocktailApi";
import styles from "./DrinkCard.module.scss";

interface DrinkCardProps {
    drink: DrinkSummary;
}

export default function DrinkCard({ drink }: DrinkCardProps) {
    const location = useLocation();

    return (
        <article className={styles.card}>
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