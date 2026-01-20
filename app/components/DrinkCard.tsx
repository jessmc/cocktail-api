import { Link, useLocation } from "react-router";
import type { DrinkSummary } from "~/api/cocktailApi";
import styles from "./DrinkCard.module.scss";


interface DrinkCardProps {
    drink: DrinkSummary;
}

export default function DrinkCard({drink}: DrinkCardProps) {
    const location = useLocation();

    return (
        <article className={styles.card}>
            <Link
                to={`/drink/${drink.idDrink}${location.search}`}
                className={styles.card}
      >
                <img 
                src={drink.strDrinkThumb}
                alt={drink.strDrink}
                width={180}
                loading="lazy"
                />
                <h3> {drink.strDrink}</h3>
            </Link>
        </article>
    )
}