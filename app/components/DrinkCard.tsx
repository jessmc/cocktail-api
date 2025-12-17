import { Link } from "react-router";
import type { DrinkSummary } from "~/api/cocktailApi";
import styles from "./DrinkCard.module.scss";


interface DrinkCardProps {
    drink: DrinkSummary;
}

export default function DrinkCard({drink}: DrinkCardProps) {
    return (
        <article className={styles.card}>
            <Link to={`/drink/${drink.idDrink}`}>
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