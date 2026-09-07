import { useMutation } from "@tanstack/react-query";
import { isAxiosError } from "axios";
import {
  ArrowLeft,
  Calculator,
  MapPin,
  Minus,
  Plus,
  RefreshCw,
  Store,
  Trash2,
  Truck,
} from "lucide-react";
import {
  type ChangeEvent,
  type FormEvent,
  useEffect,
  useState,
} from "react";
import { Link } from "react-router-dom";
import { getProductById } from "../../api/productsApi";
import { calculateShippingQuotes } from "../../api/shippingApi";
import { storeConfig } from "../../config/storeConfig";
import {
  type CartItem,
  getCartItemMaxQuantity,
  useCartStore,
} from "../../stores/cartStore";
import { useShippingStore } from "../../stores/shippingStore";
import type { ShippingQuote } from "../../types/shipping";
import { formatCurrency } from "../../utils/currency";

type ProductCheck = "ready" | "unavailable" | "error";

type ValidationState = {
  key: string;
  checks: Record<number, ProductCheck>;
};

type QuoteRequest = {
  key: string;
  destinationPostalCode: string;
  items: Array<{
    productId: number;
    quantity: number;
  }>;
};

function normalizePostalCode(value: string) {
  return value.replace(/\D/g, "").slice(0, 8);
}

function formatPostalCode(value: string) {
  const normalized = normalizePostalCode(value);

  return normalized.length <= 5
    ? normalized
    : `${normalized.slice(0, 5)}-${normalized.slice(5)}`;
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

function getItemProblem(
  item: CartItem,
  check: ProductCheck | undefined,
) {
  if (!check) {
    return "Verificando disponibilidade, preço e estoque...";
  }

  if (check === "error") {
    return "Não foi possível verificar este produto. Atualize o carrinho para tentar novamente.";
  }

  if (check === "unavailable" || item.available !== true) {
    return "Este produto não está disponível. Remova-o para continuar.";
  }

  if (!Number.isFinite(item.price) || item.price <= 0) {
    return "Este produto está com o preço indisponível.";
  }

  if (
    !Number.isSafeInteger(item.quantity) ||
    item.quantity <= 0
  ) {
    return "Quantidade inválida. Remova o produto e adicione-o novamente.";
  }

  if ((item.stockQuantity ?? 0) <= 0) {
    return "Produto esgotado. Remova-o para continuar.";
  }

  if (
    item.maxQuantityPerOrder != null &&
    item.quantity > item.maxQuantityPerOrder
  ) {
    return `O limite deste produto é de ${item.maxQuantityPerOrder} unidade(s) por pedido. Reduza a quantidade.`;
  }

  if (item.quantity > getCartItemMaxQuantity(item)) {
    return `Há somente ${item.stockQuantity ?? 0} unidade(s) em estoque. Reduza a quantidade.`;
  }

  return null;
}

export function CartPage() {
  const {
    items,
    increment,
    decrement,
    removeItem,
    syncProduct,
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

  const [postalCodeError, setPostalCodeError] =
    useState<string | null>(null);

  const [refreshVersion, setRefreshVersion] = useState(0);
  const [validation, setValidation] =
    useState<ValidationState | null>(null);

  const productIdsKey = [...new Set(
    items.map((item) => item.productId),
  )]
    .sort((first, second) => first - second)
    .join(",");

  const validationKey = `${productIdsKey}:${refreshVersion}`;
  const cartSignature = createCartSignature(items);
  const normalizedPostalCode = normalizePostalCode(postalCode);

  // Inclui os preços para não reaproveitar cotações após
  // uma atualização dos valores dos produtos.
  const pricingSignature = [...items]
    .sort((first, second) => first.productId - second.productId)
    .map((item) => `${item.productId}:${item.price}`)
    .join("|");

  const quoteKey = [
    validationKey,
    cartSignature,
    pricingSignature,
    normalizedPostalCode,
    deliveryMethod,
  ].join(";");

  const checkingProducts =
    items.length > 0 && validation?.key !== validationKey;

  const currentChecks =
    validation?.key === validationKey
      ? validation.checks
      : {};

  const productsValid =
    items.length > 0 &&
    !checkingProducts &&
    items.every(
      (item) =>
        getItemProblem(item, currentChecks[item.productId]) === null,
    );

  useEffect(() => {
    let cancelled = false;

    // Uma nova verificação exige uma nova escolha de frete.
    clearShipping();

    const ids = productIdsKey
      ? productIdsKey.split(",").map(Number)
      : [];

    if (ids.length === 0) {
      setValidation({
        key: validationKey,
        checks: {},
      });
      return;
    }

    async function validateProducts() {
      const results = await Promise.allSettled(
        ids.map((id) => getProductById(id)),
      );

      if (cancelled) {
        return;
      }

      const checks: Record<number, ProductCheck> = {};

      results.forEach((result, index) => {
        const productId = ids[index];

        if (result.status === "fulfilled") {
          if (result.value.id !== productId) {
            checks[productId] = "error";
            return;
          }

          syncProduct(result.value);
          checks[productId] = result.value.available
            ? "ready"
            : "unavailable";
          return;
        }

        checks[productId] =
          isAxiosError(result.reason) &&
          result.reason.response?.status === 404
            ? "unavailable"
            : "error";
      });

      setValidation({
        key: validationKey,
        checks,
      });
    }

    void validateProducts();

    return () => {
      cancelled = true;
    };
  }, [
    productIdsKey,
    validationKey,
    syncProduct,
    clearShipping,
  ]);

  // Ao voltar para a aba, consulta novamente os produtos.
  useEffect(() => {
    function refreshProducts() {
      setRefreshVersion((current) => current + 1);
    }

    window.addEventListener("focus", refreshProducts);

    return () => {
      window.removeEventListener("focus", refreshProducts);
    };
  }, []);

  useEffect(() => {
    if (
      selectedShipping &&
      (
        !productsValid ||
        selectedShipping.cartSignature !== cartSignature ||
        selectedShipping.destinationPostalCode !== normalizedPostalCode
      )
    ) {
      clearShipping();
    }
  }, [
    selectedShipping,
    productsValid,
    cartSignature,
    normalizedPostalCode,
    clearShipping,
  ]);

  const quoteMutation = useMutation({
    mutationFn: async (request: QuoteRequest) => {
      const quotes = await calculateShippingQuotes({
        destinationPostalCode: request.destinationPostalCode,
        items: request.items,
      });

      return {
        key: request.key,
        quotes,
      };
    },
  });

  const quoteResult =
    quoteMutation.data?.key === quoteKey
      ? quoteMutation.data
      : null;

  const quotes = productsValid
    ? quoteResult?.quotes ?? []
    : [];

  const quoteError =
    quoteMutation.isError &&
    quoteMutation.variables?.key === quoteKey;

  const validSelectedShipping =
    productsValid &&
    deliveryMethod === "SHIPPING" &&
    selectedShipping?.cartSignature === cartSignature &&
    selectedShipping.destinationPostalCode === normalizedPostalCode
      ? selectedShipping
      : null;

  const isPickup = deliveryMethod === "PICKUP";

  function handlePostalCodeChange(
    event: ChangeEvent<HTMLInputElement>,
  ) {
    setPostalCode(formatPostalCode(event.target.value));
    setPostalCodeError(null);
    clearShipping();
    quoteMutation.reset();
  }

  function handleRefreshProducts() {
    clearShipping();
    quoteMutation.reset();
    setRefreshVersion((current) => current + 1);
  }

  function handleCalculateShipping(
    event: FormEvent<HTMLFormElement>,
  ) {
    event.preventDefault();

    if (normalizedPostalCode.length !== 8) {
      setPostalCodeError("Informe um CEP com 8 números.");
      return;
    }

    if (!productsValid || quoteMutation.isPending) {
      return;
    }

    setPostalCodeError(null);
    clearShipping();

    quoteMutation.mutate({
      key: quoteKey,
      destinationPostalCode: normalizedPostalCode,
      items: items.map((item) => ({
        productId: item.productId,
        quantity: item.quantity,
      })),
    });
  }

  function handleSelectShipping(quote: ShippingQuote) {
    if (
      !productsValid ||
      deliveryMethod !== "SHIPPING" ||
      quoteMutation.isPending ||
      !quoteResult
    ) {
      return;
    }

    selectShipping(
      quote,
      normalizedPostalCode,
      cartSignature,
    );
  }

  function handleDeliveryMethod(
    method: "SHIPPING" | "PICKUP",
  ) {
    clearShipping();
    quoteMutation.reset();
    selectDeliveryMethod(method);
  }

  function handleIncrement(productId: number) {
    if (!increment(productId)) {
      alert(
        "Não é possível aumentar a quantidade. Confira o estoque e o limite por pedido.",
      );
    }
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
    productsValid &&
    !quoteMutation.isPending &&
    (isPickup || validSelectedShipping !== null);

  return (
    <section className="relative left-1/2 w-screen -translate-x-1/2 bg-[#f4f7fb]">
      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8 lg:py-14">
        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
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

          <button
            type="button"
            onClick={handleRefreshProducts}
            disabled={checkingProducts || quoteMutation.isPending}
            className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 text-sm font-bold text-sky-700 transition hover:bg-sky-50 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <RefreshCw
              size={17}
              className={checkingProducts ? "animate-spin" : ""}
            />
            {checkingProducts ? "Atualizando..." : "Atualizar carrinho"}
          </button>
        </div>

        <div
          aria-live="polite"
          className="mb-5 rounded-xl border border-sky-200 bg-sky-50 p-4 text-sm text-sky-800"
        >
          {checkingProducts
            ? "Verificando os preços, a disponibilidade e o estoque dos produtos..."
            : productsValid
              ? "Produtos atualizados. Confira os valores antes de continuar."
              : "Revise os avisos dos produtos abaixo para continuar com o pedido."}
        </div>

        <div className="grid gap-6 lg:grid-cols-[1fr_380px]">
          <div className="space-y-5">
            <div className="space-y-3">
              {items.map((item) => {
                const check = currentChecks[item.productId];
                const problem = getItemProblem(item, check);
                const maximum = getCartItemMaxQuantity(item);

                const canIncrement =
                  check === "ready" &&
                  !problem &&
                  item.quantity < maximum;

                return (
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

                      {check === "ready" ? (
                        <div className="mt-2 space-y-1 text-xs text-slate-500">
                          <p>
                            Estoque: {item.stockQuantity ?? 0} unidade(s)
                          </p>
                          <p>
                            {item.maxQuantityPerOrder == null
                              ? "Sem limite por pedido, respeitando o estoque."
                              : `Limite por pedido: ${item.maxQuantityPerOrder} unidade(s).`}
                          </p>
                        </div>
                      ) : null}

                      {problem ? (
                        <p
                          className={`mt-3 rounded-lg p-3 text-sm ${
                            !check
                              ? "bg-sky-50 text-sky-700"
                              : "bg-red-50 text-red-700"
                          }`}
                        >
                          {problem}
                        </p>
                      ) : item.quantity >= maximum ? (
                        <p className="mt-2 text-xs font-semibold text-amber-700">
                          Quantidade máxima disponível para este pedido.
                        </p>
                      ) : null}

                      <div className="mt-4 flex flex-wrap items-center gap-2">
                        <div className="flex h-10 items-center overflow-hidden rounded-xl border border-slate-300">
                          <button
                            type="button"
                            onClick={() => decrement(item.productId)}
                            aria-label={`Diminuir quantidade de ${item.name}`}
                            className="grid size-10 place-items-center text-slate-600 transition hover:bg-slate-100 hover:text-slate-950"
                          >
                            <Minus size={16} />
                          </button>

                          <span className="min-w-10 text-center text-sm font-bold text-slate-900">
                            {item.quantity}
                          </span>

                          <button
                            type="button"
                            onClick={() => handleIncrement(item.productId)}
                            disabled={!canIncrement}
                            aria-label={`Aumentar quantidade de ${item.name}`}
                            className="grid size-10 place-items-center text-slate-600 transition hover:bg-slate-100 hover:text-slate-950 disabled:cursor-not-allowed disabled:opacity-30"
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
                );
              })}
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
                  onClick={() => handleDeliveryMethod("SHIPPING")}
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
                  onClick={() => handleDeliveryMethod("PICKUP")}
                  className={`rounded-xl border p-4 text-left transition ${
                    isPickup
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
                        Retirada gratuita em {storeConfig.address.city}/
                        {storeConfig.address.shortState}.
                      </p>
                    </div>
                  </div>
                </button>
              </div>
            </div>

            {!isPickup ? (
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
                    disabled={!productsValid || quoteMutation.isPending}
                    className="inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-sky-500 px-5 text-sm font-bold text-white transition hover:bg-sky-600 disabled:cursor-not-allowed disabled:bg-slate-300 sm:mt-7"
                  >
                    <Calculator size={17} />
                    {quoteMutation.isPending ? "Calculando..." : "Calcular"}
                  </button>
                </form>

                {quoteError ? (
                  <p className="mt-4 rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-600">
                    Não foi possível calcular o frete. Confira o CEP,
                    atualize o carrinho e tente novamente.
                  </p>
                ) : null}

                {!quoteMutation.isPending &&
                productsValid &&
                quoteResult &&
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
                        validSelectedShipping?.serviceId === quote.serviceId;

                      return (
                        <button
                          key={`${quote.serviceId}-${quote.serviceName}`}
                          type="button"
                          disabled={quoteMutation.isPending}
                          onClick={() => handleSelectShipping(quote)}
                          className={`flex w-full items-center gap-4 rounded-xl border p-4 text-left transition disabled:opacity-50 ${
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
                      Após a confirmação do pagamento, envie uma mensagem
                      no WhatsApp para agendar a retirada.
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
                {checkingProducts
                  ? "Verificando produtos..."
                  : !productsValid
                    ? "Revise os produtos"
                    : quoteMutation.isPending
                      ? "Calculando frete..."
                      : "Selecione o frete"}
              </button>
            )}

            {!productsValid ? (
              <p className="mt-3 text-xs text-slate-500">
                O total inclui os itens exibidos. Resolva os avisos
                antes de finalizar.
              </p>
            ) : null}
          </aside>
        </div>
      </div>
    </section>
  );
}