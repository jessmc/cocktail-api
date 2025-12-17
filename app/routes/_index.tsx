import { useLoaderData, useNavigate } from "react-router";
import type { LoaderFunctionArgs } from "react-router";
import SearchForm from "~/components/SearchForm";
import DrinkList from "~/components/DrinkList";
import { searchByName, searchByIngredient, type SearchResponse } from "~/api/cocktailApi";

type SearchType = "name" | "ingredient";

export async function loader({ request }: LoaderFunctionArgs) {
  const url = new URL(request.url);
  const query = url.searchParams.get('q');
  const rawType = url.searchParams.get("type");

  const type: SearchType =
    rawType === "ingredient" || rawType === "name"
      ? rawType
      : "name";


  if (!query) {
    return {
      drinks: null,
      query: "",
      type,
    } satisfies {
      drinks: SearchResponse["drinks"];
      query: string;
      type: "name" | "ingredient";
    };
  }

  const data =
    type === "ingredient"
      ? await searchByIngredient(query)
      : await searchByName(query);

  return {
    drinks: data.drinks,
    query,
    type,
  } satisfies {
    drinks: SearchResponse["drinks"];
    query: string;
    type: "name" | "ingredient";
  };
}

export default function Index() {

  const { drinks, query, type } = useLoaderData() as {
    drinks: SearchResponse['drinks'];
    query: string;
    type: "name" | "ingredient";
  };

  const navigate = useNavigate();

  function searchByName(value: string) {
    navigate(`/?q=${encodeURIComponent(value)}&type=name`);
  }

  function searchByIngredient(value: string) {
    navigate(`/?q=${encodeURIComponent(value)}&type=ingredient`);
  }

  return (
    <div>
      <h1>Cocktail Search</h1>
      <div style={{ display: "flex", gap: "1rem" }}>
        <SearchForm
          label="Search drinks by name"
          placeholder="Margarita"
          onSearch={searchByName}
        />

        <SearchForm
          label="Search drinks by ingredient"
          placeholder="Gin"
          onSearch={searchByIngredient}
        />
      </div>

      <DrinkList drinks={drinks}/>
    </div>
  );
}
