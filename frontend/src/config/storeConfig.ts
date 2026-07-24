const whatsappNumber = "5515988233584";

const whatsappMessage = encodeURIComponent(
  "Olá! Vim pelo site JKCards e gostaria de tirar uma dúvida.",
);

export const storeConfig = {
  name: "JKCards",
  description: "E-commerce de cards e produtos colecionáveis.",

  email: "contato.jkcards@gmail.com",

  address: {
    street: "Rua Camargo Fleury, nº 75",
    city: "Sorocaba",
    state: "São Paulo",
    shortState: "SP",
  },

  social: {
    instagram: "https://www.instagram.com/jkcardsstore",
    youtube: "",
    whatsapp: `https://wa.me/${whatsappNumber}?text=${whatsappMessage}`,
  },

  startedIn: 2020,
} as const;