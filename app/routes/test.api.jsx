import { useLoaderData } from "react-router";
import { searchByName, searchByIngredient, getDrinkById } from "../api/cocktailApi.ts";

export async function loader() {
    const [nameData, ingredientData, drinkData] = await Promise.all([
        searchByName('margarita'),
        searchByIngredient('gin'),
        getDrinkById('11007'),
    ]);

    return {nameData, ingredientData, drinkData};
}

export default function ApiTest() {
   const {nameData, ingredientData, drinkData} = useLoaderData();

   return (
    <div style={{padding:'1rem'}}>
    <h1> API Test Page </h1>

    <section>
        <h2>Search by Name → "margarita"</h2>
        <pre>{JSON.stringify(nameData, null, 2)}</pre>
    </section>

    <section>
        <h2>Search by Ingredient → "gin"</h2>
        <pre>{JSON.stringify(ingredientData, null, 2)}</pre>
    </section>

    <section>
        <h2>Lookup Drink by ID → "11007"</h2>
        <pre>{JSON.stringify(drinkData, null, 2)}</pre>
    </section>
    </div>
   );
}