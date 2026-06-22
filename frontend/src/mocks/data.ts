import type { Category } from "../types/category";
import type { DashboardSummary } from "../types/dashboard";
import type { Order } from "../types/order";
import type { Product } from "../types/product";
import type { User } from "../types/user";

export const mockCategories: Category[] = [
  { id: 1, name: "Boosters" },
  { id: 2, name: "Decks" },
  { id: 3, name: "Sleeves" },
  { id: 4, name: "Singles" },
];

export const mockProducts: Product[] = [
  {
    id: 1,
    name: "Booster Eclipse Azul",
    description:
      "Booster lacrado com selecao premium para colecionadores e jogadores competitivos.",
    price: 29.9,
    imgUrl:
      "https://images.unsplash.com/photo-1613771404721-1f92d799e49f?auto=format&fit=crop&w=900&q=80",
    stockQuantity: 12,
    categories: [mockCategories[0]],
  },
  {
    id: 2,
    name: "Deck JKCards Arena",
    description:
      "Deck pronto para jogar com cartas balanceadas, caixa protetora e guia rapido.",
    price: 119.9,
    imgUrl:
      "https://images.unsplash.com/photo-1610890716171-6b1bb98ffd09?auto=format&fit=crop&w=900&q=80",
    stockQuantity: 8,
    categories: [mockCategories[1]],
  },
  {
    id: 3,
    name: "Sleeves Premium Gold",
    description:
      "Pacote com 100 sleeves foscas de alta durabilidade para proteger cartas raras.",
    price: 39.9,
    imgUrl:
      "https://images.unsplash.com/photo-1606167668584-78701c57f13d?auto=format&fit=crop&w=900&q=80",
    stockQuantity: 20,
    categories: [mockCategories[2]],
  },
  {
    id: 4,
    name: "Carta Lendaria Aurora",
    description:
      "Carta avulsa para colecao, com acabamento holografico e condicao near mint.",
    price: 249.9,
    imgUrl:
      "https://images.unsplash.com/photo-1596464716127-f2a82984de30?auto=format&fit=crop&w=900&q=80",
    stockQuantity: 1,
    categories: [mockCategories[3]],
  },
  {
    id: 5,
    name: "Bundle Iniciante",
    description:
      "Kit com booster, sleeves, deck box e cartas selecionadas para comecar a jogar.",
    price: 179.9,
    imgUrl:
      "https://images.unsplash.com/photo-1618336753974-aae8e04506aa?auto=format&fit=crop&w=900&q=80",
    stockQuantity: 5,
    categories: [mockCategories[0], mockCategories[2]],
  },
  {
    id: 6,
    name: "Deck Box Midnight",
    description:
      "Deck box rigida com acabamento preto fosco e detalhe azul para ate 100 cartas.",
    price: 54.9,
    imgUrl:
      "https://images.unsplash.com/photo-1580247817119-c6c9a3f47f5f?auto=format&fit=crop&w=900&q=80",
    stockQuantity: 0,
    categories: [mockCategories[2]],
  },
];

export const mockUsers: User[] = [
  {
    id: 1,
    name: "Cliente JKCards",
    email: "cliente@jkcards.com",
    phone: "11999990000",
    birthDate: "1995-05-20",
    roles: ["ROLE_OPERATOR"],
  },
  {
    id: 2,
    name: "Admin JKCards",
    email: "admin@jkcards.com",
    phone: "11988880000",
    birthDate: "1990-02-10",
    roles: ["ROLE_OPERATOR", "ROLE_ADMIN"],
  },
];

export const mockOrders: Order[] = [
  {
    id: 101,
    moment: "2026-06-06T13:00:00Z",
    status: "WAITING_PAYMENT",
    client: { id: 1, name: "Cliente JKCards" },
    payment: null,
    items: [
      {
        productId: 1,
        name: "Booster Eclipse Azul",
        price: 29.9,
        quantity: 2,
        imgUrl: mockProducts[0].imgUrl,
        subTotal: 59.8,
      },
      {
        productId: 3,
        name: "Sleeves Premium Gold",
        price: 39.9,
        quantity: 1,
        imgUrl: mockProducts[2].imgUrl,
        subTotal: 39.9,
      },
    ],
    total: 99.7,
  },
  {
    id: 102,
    moment: "2026-06-05T18:30:00Z",
    status: "PAID",
    client: { id: 2, name: "Admin JKCards" },
    payment: { id: 102, moment: "2026-06-05T19:05:00Z" },
    items: [
      {
        productId: 4,
        name: "Carta Lendaria Aurora",
        price: 249.9,
        quantity: 1,
        imgUrl: mockProducts[3].imgUrl,
        subTotal: 249.9,
      },
    ],
    total: 249.9,
  },
];

export const mockDashboard: DashboardSummary = {
  ordersCount: 34,
  grossRevenue: 8630.4,
  netRevenue: 5120.2,
  averageTicket: 253.84,
  byStatus: [
    { status: "WAITING_PAYMENT", count: 8 },
    { status: "PAID", count: 15 },
    { status: "SHIPPED", count: 6 },
    { status: "DELIVERED", count: 4 },
    { status: "CANCELED", count: 1 },
  ],
};