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

export async function searchByName(name: string): Promise<SearchResponse> {
    const res = await fetch(`${BASE_URL}/search.php?s=${name}`);
    if (!res.ok) throw new Error('Failed to fetch cocktails by name.');
    return res.json();
}

export async function searchByIngredient(ingredient: string): Promise<SearchResponse> {
    const res = await fetch(`${BASE_URL}/filter.php?i=${ingredient}`);
    if (!res.ok) throw new Error('Failed to fetch ingredient');
    return res.json();
}

export async function getDrinkById(id: string): Promise<DrinkDetailsResponse> {
    const res = await fetch(`${BASE_URL}/lookup.php?i=${id}`);
    if (!res.ok) throw new Error('Failed to fetch drink details');
    return res.json();
}