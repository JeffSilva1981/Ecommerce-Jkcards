export type PokemonCardSearchResult = {
  id: string;
  localId: string;
  name: string;
  image?: string;
};

export type PokemonCardSet = {
  id: string;
  name: string;
  cardCount?: {
    official: number;
    total: number;
  };
};

export type PokemonCardVariants = {
  normal?: boolean;
  reverse?: boolean;
  holo?: boolean;
  firstEdition?: boolean;
  wPromo?: boolean;
};

export type PokemonCardDetails = {
  id: string;
  localId: string;
  name: string;
  image?: string;
  description?: string;
  rarity?: string;
  illustrator?: string;
  category?: string;
  hp?: number;
  types?: string[];
  stage?: string;
  regulationMark?: string;
  set: PokemonCardSet;
  variants?: PokemonCardVariants;
};

export type SelectedPokemonCard = {
  externalId: string;
  name: string;
  localId: string;
  setName: string;
  rarity?: string;
  description?: string;
  illustrator?: string;
  imageUrl: string;
};