import { useMutation } from "@tanstack/react-query";
import {
  ArrowLeft,
  Calculator,
  MapPin,
  Minus,
  Plus,
  Store,
  Trash2,
  Truck,
} from "lucide-react";
import {
  type ChangeEvent,
  type FormEvent,
  useEffect,
  useMemo,
  useState,
} from "react";
import { Link } from "react-router-dom";
import { calculateShippingQuotes } from "../../api/shippingApi";
import { storeConfig } from "../../config/storeConfig";
import { useCartStore } from "../../stores/cartStore";
import { useShippingStore } from "../../stores/shippingStore";
import type { ShippingQuote } from "../../types/shipping";
import { formatCurrency } from "../../utils/currency";

function normalizePostalCode(value: string) {
  return value.replace(/\D/g, "").slice(0, 8);
}

function formatPostalCode(value: string) {
  const normalized = normalizePostalCode(value);

  if (normalized.length <= 5) {
    return normalized;
  }

  return `${normalized.slice(0, 5)}-${normalized.slice(5)}`;
}

function createCartSignature(
  items: Array<{
    productId: number;
    quantity: number;
  }>,
) {
  return [...items]
    .sort((first, second) => first.productId - second.productId)
    .map((item) => `${item.productId}:${item.quantity}`)
    .join("|");
}

export function CartPage() {
  const {
    items,
    increment,
    decrement,
    removeItem,
    totalItems,
    totalPrice,
  } = useCartStore();

  const {
    deliveryMethod,
    selectedShipping,
    selectDeliveryMethod,
    selectShipping,
    clearShipping,
  } = useShippingStore();

  const [postalCode, setPostalCode] = useState(
    selectedShipping
      ? formatPostalCode(selectedShipping.destinationPostalCode)
      : "",
  );

  const [quotes, setQuotes] = useState<ShippingQuote[]>([]);
  const [postalCodeError, setPostalCodeError] = useState<string | null>(null);

  const cartSignature = useMemo(
    () => createCartSignature(items),
    [items],
  );

  const validSelectedShipping =
    deliveryMethod === "SHIPPING" &&
    selectedShipping?.cartSignature === cartSignature
      ? selectedShipping
      : null;

  const isPickup = deliveryMethod === "PICKUP";

  useEffect(() => {
    if (
      selectedShipping &&
      selectedShipping.cartSignature !== cartSignature
    ) {
      clearShipping();
      setQuotes([]);
    }
  }, [cartSignature, clearShipping, selectedShipping]);

  const quoteMutation = useMutation({
    mutationFn: () =>
      calculateShippingQuotes({
        destinationPostalCode: normalizePostalCode(postalCode),
        items: items.map((item) => ({
          productId: item.productId,
          quantity: item.quantity,
        })),
      }),

    onSuccess: (result) => {
      setQuotes(result);

      if (result.length === 0) {
        clearShipping();
      }
    },

    onError: (error) => {
      console.error("Erro ao calcular frete:", error);
      setQuotes([]);
      clearShipping();
    },
  });

  function handlePostalCodeChange(event: ChangeEvent<HTMLInputElement>) {
    const nextPostalCode = formatPostalCode(event.target.value);

    setPostalCode(nextPostalCode);
    setPostalCodeError(null);
    setQuotes([]);

    if (
      selectedShipping &&
      normalizePostalCode(nextPostalCode) !==
        selectedShipping.destinationPostalCode
    ) {
      clearShipping();
    }
  }

  function handleCalculateShipping(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const normalizedPostalCode = normalizePostalCode(postalCode);

    if (normalizedPostalCode.length !== 8) {
      setPostalCodeError("Informe um CEP com 8 números.");
      return;
    }

    if (items.length === 0) {
      return;
    }

    selectDeliveryMethod("SHIPPING");
    setPostalCodeError(null);
    clearShipping();
    quoteMutation.mutate();
  }

  function handleSelectShipping(quote: ShippingQuote) {
    selectShipping(
      quote,
      normalizePostalCode(postalCode),
      cartSignature,
    );
  }

  if (items.length === 0) {
    return (
      <section className="relative left-1/2 w-screen -translate-x-1/2 bg-[#f4f7fb]">
        <div className="mx-auto flex min-h-[480px] max-w-7xl items-center justify-center px-4 py-16 sm:px-6 lg:px-8">
          <div className="w-full max-w-lg rounded-2xl border border-slate-200 bg-white p-8 text-center shadow-sm">
            <div className="mx-auto grid size-16 place-items-center rounded-full bg-sky-50 text-sky-600">
              <Store size={28} />
            </div>

            <h1 className="mt-5 text-3xl font-black text-[#00102D]">
              Carrinho vazio
            </h1>

            <p className="mt-3 text-slate-500">
              Escolha alguns produtos na vitrine para montar seu pedido.
            </p>

            <Link
              to="/produtos"
              className="mt-6 inline-flex min-h-11 items-center justify-center gap-2 rounded-xl bg-sky-500 px-5 py-2.5 text-sm font-bold text-white transition hover:bg-sky-600"
            >
              <ArrowLeft size={18} />
              Ver produtos
            </Link>
          </div>
        </div>
      </section>
    );
  }

  const productsTotal = totalPrice();

  const orderPreviewTotal =
    productsTotal + (validSelectedShipping?.price ?? 0);

  const canCheckout =
    isPickup || validSelectedShipping !== null;

  return (
    <section className="relative left-1/2 w-screen -translate-x-1/2 bg-[#f4f7fb]">
      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8 lg:py-14">
        <div className="mb-8">
          <span className="text-sm font-bold uppercase tracking-wider text-sky-600">
            Seu pedido
          </span>

          <h1 className="mt-2 text-3xl font-black text-[#00102D] sm:text-4xl">
            Carrinho
          </h1>

          <p className="mt-2 text-sm text-slate-500">
            Confira os produtos e escolha a forma de entrega.
          </p>
        </div>

        <div className="grid gap-6 lg:grid-cols-[1fr_380px]">
          <div className="space-y-5">
            <div className="space-y-3">
              {items.map((item) => (
                <article
                  key={item.productId}
                  className="flex flex-col gap-4 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:flex-row"
                >
                  <div className="flex size-28 shrink-0 items-center justify-center rounded-xl bg-slate-50 p-3">
                    {item.imgUrl ? (
                      <img
                        src={item.imgUrl}
                        alt={item.name}
                        className="max-h-full max-w-full object-contain"
                      />
                    ) : (
                      <span className="text-center text-xs text-slate-400">
                        Imagem indisponível
                      </span>
                    )}
                  </div>

                  <div className="min-w-0 flex-1">
                    <h2 className="font-bold text-[#00102D]">
                      {item.name}
                    </h2>

                    <p className="mt-1 text-sm font-semibold text-slate-500">
                      {formatCurrency(item.price)} por unidade
                    </p>

                    <div className="mt-4 flex flex-wrap items-center gap-2">
                      <div className="flex h-10 items-center overflow-hidden rounded-xl border border-slate-300">
                        <button
                          type="button"
                          onClick={() => decrement(item.productId)}
                          aria-label="Diminuir quantidade"
                          className="grid size-10 place-items-center text-slate-600 transition hover:bg-slate-100 hover:text-slate-950"
                        >
                          <Minus size={16} />
                        </button>

                        <span className="min-w-10 text-center text-sm font-bold text-slate-900">
                          {item.quantity}
                        </span>

                        <button
                          type="button"
                          onClick={() => increment(item.productId)}
                          aria-label="Aumentar quantidade"
                          className="grid size-10 place-items-center text-slate-600 transition hover:bg-slate-100 hover:text-slate-950"
                        >
                          <Plus size={16} />
                        </button>
                      </div>

                      <button
                        type="button"
                        onClick={() => removeItem(item.productId)}
                        className="inline-flex h-10 items-center gap-2 rounded-xl px-3 text-sm font-bold text-red-600 transition hover:bg-red-50"
                      >
                        <Trash2 size={17} />
                        Remover
                      </button>
                    </div>
                  </div>

                  <p className="font-black text-[#00102D] sm:text-right">
                    {formatCurrency(item.price * item.quantity)}
                  </p>
                </article>
              ))}
            </div>

            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
              <h2 className="text-xl font-black text-[#00102D]">
                Como você deseja receber?
              </h2>

              <p className="mt-1 text-sm text-slate-500">
                Escolha entre entrega no endereço ou retirada pessoalmente.
              </p>

              <div className="mt-5 grid gap-3 sm:grid-cols-2">
                <button
                  type="button"
                  onClick={() => selectDeliveryMethod("SHIPPING")}
                  className={`rounded-xl border p-4 text-left transition ${
                    deliveryMethod === "SHIPPING"
                      ? "border-sky-500 bg-sky-50"
                      : "border-slate-200 bg-white hover:border-sky-300"
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <div className="grid size-11 shrink-0 place-items-center rounded-xl bg-sky-100 text-sky-700">
                      <Truck size={21} />
                    </div>

                    <div>
                      <p className="font-bold text-[#00102D]">
                        Receber no endereço
                      </p>

                      <p className="mt-1 text-sm text-slate-500">
                        Consulte valores e prazos pelo CEP.
                      </p>
                    </div>
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => selectDeliveryMethod("PICKUP")}
                  className={`rounded-xl border p-4 text-left transition ${
                    deliveryMethod === "PICKUP"
                      ? "border-emerald-500 bg-emerald-50"
                      : "border-slate-200 bg-white hover:border-emerald-300"
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <div className="grid size-11 shrink-0 place-items-center rounded-xl bg-emerald-100 text-emerald-700">
                      <Store size={21} />
                    </div>

                    <div>
                      <p className="font-bold text-[#00102D]">
                        Retirar na loja
                      </p>

                      <p className="mt-1 text-sm text-slate-500">
                        Retirada gratuita em Sorocaba/SP.
                      </p>
                    </div>
                  </div>
                </button>
              </div>
            </div>

            {deliveryMethod === "SHIPPING" ? (
              <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                <div className="flex items-start gap-3">
                  <div className="grid size-11 shrink-0 place-items-center rounded-xl bg-sky-100 text-sky-700">
                    <Truck size={21} />
                  </div>

                  <div>
                    <h2 className="text-xl font-black text-[#00102D]">
                      Calcular frete
                    </h2>

                    <p className="mt-1 text-sm text-slate-500">
                      Informe o CEP para consultar transportadoras e prazos.
                    </p>
                  </div>
                </div>

                <form
                  onSubmit={handleCalculateShipping}
                  className="mt-5 flex flex-col gap-3 sm:flex-row sm:items-start"
                >
                  <div className="flex-1">
                    <label
                      htmlFor="postalCode"
                      className="text-sm font-bold text-slate-700"
                    >
                      CEP de entrega
                    </label>

                    <input
                      id="postalCode"
                      value={postalCode}
                      onChange={handlePostalCodeChange}
                      inputMode="numeric"
                      autoComplete="postal-code"
                      placeholder="00000-000"
                      maxLength={9}
                      className={`mt-2 h-11 w-full rounded-xl border bg-white px-4 text-sm text-slate-900 outline-none transition focus:ring-4 ${
                        postalCodeError
                          ? "border-red-400 focus:border-red-400 focus:ring-red-100"
                          : "border-slate-300 focus:border-sky-400 focus:ring-sky-100"
                      }`}
                    />

                    {postalCodeError ? (
                      <p className="mt-2 text-sm text-red-600">
                        {postalCodeError}
                      </p>
                    ) : null}
                  </div>

                  <button
                    type="submit"
                    disabled={quoteMutation.isPending}
                    className="inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-sky-500 px-5 text-sm font-bold text-white transition hover:bg-sky-600 disabled:cursor-not-allowed disabled:bg-slate-300 sm:mt-7"
                  >
                    <Calculator size={17} />

                    {quoteMutation.isPending
                      ? "Calculando..."
                      : "Calcular"}
                  </button>
                </form>

                {quoteMutation.isError ? (
                  <p className="mt-4 rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-600">
                    Não foi possível calcular o frete. Confira o CEP e tente
                    novamente.
                  </p>
                ) : null}

                {!quoteMutation.isPending &&
                quoteMutation.isSuccess &&
                quotes.length === 0 ? (
                  <p className="mt-4 rounded-xl border border-amber-200 bg-amber-50 p-3 text-sm text-amber-700">
                    Nenhuma opção de entrega foi encontrada para esse CEP.
                  </p>
                ) : null}

                {quotes.length > 0 ? (
                  <div className="mt-5 space-y-3">
                    <p className="text-sm font-bold text-slate-700">
                      Escolha uma opção de entrega:
                    </p>

                    {quotes.map((quote) => {
                      const selected =
                        validSelectedShipping?.serviceId === quote.serviceId &&
                        validSelectedShipping.destinationPostalCode ===
                          normalizePostalCode(postalCode);

                      return (
                        <button
                          key={`${quote.serviceId}-${quote.serviceName}`}
                          type="button"
                          onClick={() => handleSelectShipping(quote)}
                          className={`flex w-full items-center gap-4 rounded-xl border p-4 text-left transition ${
                            selected
                              ? "border-sky-500 bg-sky-50"
                              : "border-slate-200 hover:border-sky-300"
                          }`}
                        >
                          {quote.carrierPicture ? (
                            <div className="flex size-12 shrink-0 items-center justify-center rounded-lg bg-white p-2">
                              <img
                                src={quote.carrierPicture}
                                alt={quote.carrier}
                                className="max-h-full max-w-full object-contain"
                              />
                            </div>
                          ) : (
                            <div className="grid size-12 shrink-0 place-items-center rounded-lg bg-sky-100 text-sky-700">
                              <Truck size={20} />
                            </div>
                          )}

                          <div className="min-w-0 flex-1">
                            <p className="font-bold text-[#00102D]">
                              {quote.carrier}
                            </p>

                            <p className="text-sm text-slate-500">
                              {quote.serviceName}
                            </p>

                            <p className="mt-1 text-xs text-slate-400">
                              Entrega estimada em {quote.deliveryDays}{" "}
                              {quote.deliveryDays === 1
                                ? "dia útil"
                                : "dias úteis"}
                            </p>
                          </div>

                          <div className="text-right">
                            <p className="font-black text-[#00102D]">
                              {formatCurrency(quote.price)}
                            </p>

                            <span className="mt-1 block text-xs text-slate-500">
                              {selected ? "Selecionado" : "Selecionar"}
                            </span>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                ) : null}
              </div>
            ) : (
              <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-5">
                <div className="flex items-start gap-3">
                  <div className="grid size-11 shrink-0 place-items-center rounded-xl bg-emerald-100 text-emerald-700">
                    <MapPin size={21} />
                  </div>

                  <div>
                    <h2 className="text-xl font-black text-[#00102D]">
                      Local de retirada
                    </h2>

                    <p className="mt-2 text-sm font-bold text-slate-700">
                      {storeConfig.name}
                    </p>

                    <p className="mt-1 text-sm text-slate-600">
                      {storeConfig.address.street}
                    </p>

                    <p className="text-sm text-slate-600">
                      {storeConfig.address.city}/
                      {storeConfig.address.shortState}
                    </p>

                    <p className="mt-3 text-xs leading-5 text-slate-500">
                      Após a confirmação do pagamento, envie uma mensagem no
                      WhatsApp para agendar a retirada.
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>

          <aside className="h-fit rounded-2xl border border-slate-200 bg-white p-5 shadow-sm lg:sticky lg:top-60">
            <h2 className="text-xl font-black text-[#00102D]">
              Resumo
            </h2>

            <div className="mt-5 space-y-3 text-sm text-slate-600">
              <div className="flex justify-between">
                <span>Itens</span>
                <span className="font-bold text-slate-900">
                  {totalItems()}
                </span>
              </div>

              <div className="flex justify-between">
                <span>Produtos</span>
                <span className="font-bold text-slate-900">
                  {formatCurrency(productsTotal)}
                </span>
              </div>

              <div className="flex justify-between">
                <span>{isPickup ? "Retirada" : "Frete"}</span>

                <span className="font-bold text-slate-900">
                  {isPickup
                    ? "Grátis"
                    : validSelectedShipping
                      ? formatCurrency(validSelectedShipping.price)
                      : "A calcular"}
                </span>
              </div>

              {isPickup ? (
                <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-3 text-xs">
                  <p className="font-bold text-emerald-700">
                    Retirada na loja
                  </p>

                  <p className="mt-1 text-slate-500">
                    {storeConfig.address.street} •{" "}
                    {storeConfig.address.city}/
                    {storeConfig.address.shortState}
                  </p>
                </div>
              ) : null}

              {validSelectedShipping ? (
                <div className="rounded-xl border border-slate-200 bg-slate-50 p-3 text-xs">
                  <p className="font-bold text-[#00102D]">
                    {validSelectedShipping.carrier}
                  </p>

                  <p className="mt-1 text-slate-500">
                    {validSelectedShipping.serviceName} •{" "}
                    {validSelectedShipping.deliveryDays}{" "}
                    {validSelectedShipping.deliveryDays === 1
                      ? "dia útil"
                      : "dias úteis"}
                  </p>
                </div>
              ) : null}

              <div className="flex justify-between border-t border-slate-200 pt-4 text-lg font-black text-[#00102D]">
                <span>Total estimado</span>
                <span>{formatCurrency(orderPreviewTotal)}</span>
              </div>
            </div>

            {canCheckout ? (
              <Link
                to="/checkout"
                className="mt-5 flex min-h-12 w-full items-center justify-center rounded-xl bg-sky-500 px-5 py-3 text-sm font-bold text-white shadow-md shadow-sky-500/20 transition hover:bg-sky-600"
              >
                Finalizar pedido
              </Link>
            ) : (
              <button
                type="button"
                disabled
                className="mt-5 min-h-12 w-full cursor-not-allowed rounded-xl bg-slate-300 px-5 py-3 text-sm font-bold text-slate-500"
              >
                Selecione o frete
              </button>
            )}
          </aside>
        </div>
      </div>
    </section>
  );
}