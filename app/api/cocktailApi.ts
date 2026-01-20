// Basic drink returned from search/filter endpoints
export interface DrinkSummary {
    idDrink: string;
    strDrink: string;
    strDrinkThumb: string;
}

// Full drink details returned from lookup.php
export interface DrinkDetails extends DrinkSummary {
    strInstructions: string | null;
    strCategory: string | null;
    strAlcoholic: string | null;
    [key: string] : string | null; // allows strIngredient1..15, strMeasure1..15
}

export interface SearchResponse {
    drinks: DrinkSummary[] | null;
}

export interface DrinkDetailsResponse {
    drinks: DrinkDetails[] | null;
}

const BASE_URL = "https://www.thecocktaildb.com/api/json/v1/1";

export async function searchByName(
  query: string
): Promise<SearchResponse> {
  const res = await fetch(`${BASE_URL}/search.php?s=${query}`);
  return res.json();
}

export async function searchByIngredient(
  query: string
): Promise<SearchResponse> {
  const res = await fetch(`${BASE_URL}/filter.php?i=${query}`);
  return res.json();
}

export async function getDrinkById(id: string): Promise<DrinkDetails> {
  const res = await fetch(
    `https://www.thecocktaildb.com/api/json/v1/1/lookup.php?i=${id}`
  );
  const data = await res.json();

  const drink = data.drinks?.[0];

  if (!drink) throw new Error("Drink not found");

  return {
    ...drink,
    strInstructions: drink.strInstructions ?? null,
    strCategory: drink.strCategory ?? null,
    strAlcoholic: drink.strAlcoholic ?? null,
    idDrink: drink.idDrink ?? "",
  } satisfies DrinkDetails;
}