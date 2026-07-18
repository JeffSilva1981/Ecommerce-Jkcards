import axios from "axios";
import type {
  PokemonCardDetails,
  PokemonCardSearchResult,
  SelectedPokemonCard,
} from "../types/pokemonCard";

export const POKEMON_CARDS_PAGE_SIZE = 24;

const tcgDexApi = axios.create({
  baseURL: "https://api.tcgdex.net/v2/pt",
  timeout: 15000,
});

function createImageUrl(
  baseImageUrl?: string,
  quality: "low" | "high" = "high",
) {
  if (!baseImageUrl) {
    return "";
  }

  return `${baseImageUrl}/${quality}.webp`;
}

export async function searchPokemonCards(
  name: string,
  page = 1,
): Promise<PokemonCardSearchResult[]> {
  const normalizedName = name.trim();

  if (normalizedName.length < 2) {
    return [];
  }

  const response = await tcgDexApi.get<
    PokemonCardSearchResult[]
  >("/cards", {
    params: {
      name: normalizedName,
      "pagination:page": page,
      "pagination:itemsPerPage":
        POKEMON_CARDS_PAGE_SIZE,
    },
  });

  return response.data ?? [];
}

export async function getPokemonCardById(
  id: string,
): Promise<PokemonCardDetails> {
  const response =
    await tcgDexApi.get<PokemonCardDetails>(
      `/cards/${encodeURIComponent(id)}`,
    );

  return response.data;
}

export async function selectPokemonCard(
  id: string,
): Promise<SelectedPokemonCard> {
  const card = await getPokemonCardById(id);

  return {
    externalId: card.id,
    name: card.name,
    localId: card.localId,
    setName:
      card.set?.name ?? "Coleção não informada",
    rarity: card.rarity,
    description: card.description,
    illustrator: card.illustrator,
    imageUrl: createImageUrl(card.image, "high"),
  };
}

export function getPokemonCardThumbnail(
  image?: string,
) {
  return createImageUrl(image, "low");
}