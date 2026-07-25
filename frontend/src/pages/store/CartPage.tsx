import { useMutation } from "@tanstack/react-query";
import {
  Calculator,
  Minus,
  Plus,
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
import { Button } from "../../components/Button";
import { EmptyState } from "../../components/EmptyState";
import { Input } from "../../components/Input";
import { Panel } from "../../components/Panel";
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
  }>
) {
  return [...items]
    .sort((first, second) =>
      first.productId - second.productId
    )
    .map(
      (item) =>
        `${item.productId}:${item.quantity}`
    )
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
    selectedShipping,
    selectShipping,
    clearShipping,
  } = useShippingStore();

  const [postalCode, setPostalCode] = useState(
    selectedShipping
      ? formatPostalCode(
          selectedShipping.destinationPostalCode
        )
      : ""
  );

  const [quotes, setQuotes] = useState<
    ShippingQuote[]
  >([]);

  const [postalCodeError, setPostalCodeError] =
    useState<string | null>(null);

  const cartSignature = useMemo(
    () => createCartSignature(items),
    [items]
  );

  const validSelectedShipping =
    selectedShipping?.cartSignature ===
    cartSignature
      ? selectedShipping
      : null;

  useEffect(() => {
    if (
      selectedShipping &&
      selectedShipping.cartSignature !==
        cartSignature
    ) {
      clearShipping();
      setQuotes([]);
    }
  }, [
    cartSignature,
    clearShipping,
    selectedShipping,
  ]);

  const quoteMutation = useMutation({
    mutationFn: () =>
      calculateShippingQuotes({
        destinationPostalCode:
          normalizePostalCode(postalCode),

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
      console.error(
        "Erro ao calcular frete:",
        error
      );

      setQuotes([]);
      clearShipping();
    },
  });

  function handlePostalCodeChange(
    event: ChangeEvent<HTMLInputElement>
  ) {
    const nextPostalCode = formatPostalCode(
      event.target.value
    );

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

  function handleCalculateShipping(
    event: FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    const normalizedPostalCode =
      normalizePostalCode(postalCode);

    if (normalizedPostalCode.length !== 8) {
      setPostalCodeError(
        "Informe um CEP com 8 numeros."
      );
      return;
    }

    if (items.length === 0) {
      return;
    }

    setPostalCodeError(null);
    clearShipping();
    quoteMutation.mutate();
  }

  function handleSelectShipping(
    quote: ShippingQuote
  ) {
    selectShipping(
      quote,
      normalizePostalCode(postalCode),
      cartSignature
    );
  }

  if (items.length === 0) {
    return (
      <EmptyState
        title="Carrinho vazio"
        description="Escolha alguns produtos na vitrine para montar seu pedido."
        action={
          <Link to="/produtos">
            <Button>Ver produtos</Button>
          </Link>
        }
      />
    );
  }

  const productsTotal = totalPrice();

  const orderPreviewTotal =
    productsTotal +
    (validSelectedShipping?.price ?? 0);

  return (
    <section className="grid gap-6 lg:grid-cols-[1fr_380px]">
      <div className="space-y-4">
        <h1 className="text-3xl font-bold text-white">
          Carrinho
        </h1>

        {items.map((item) => (
          <Panel
            key={item.productId}
            className="flex gap-4 p-4"
          >
            <div className="flex size-24 shrink-0 items-center justify-center rounded-md bg-white p-2">
              <img
                src={item.imgUrl}
                alt={item.name}
                className="max-h-full max-w-full object-contain"
              />
            </div>

            <div className="min-w-0 flex-1">
              <h2 className="font-semibold text-white">
                {item.name}
              </h2>

              <p className="mt-1 text-sm text-slate-400">
                {formatCurrency(item.price)}
              </p>

              <div className="mt-4 flex flex-wrap items-center gap-2">
                <Button
                  variant="secondary"
                  onClick={() =>
                    decrement(item.productId)
                  }
                  icon={<Minus size={16} />}
                >
                  Diminuir
                </Button>

                <span className="rounded-md border border-line px-3 py-2 text-sm font-semibold">
                  {item.quantity}
                </span>

                <Button
                  variant="secondary"
                  onClick={() =>
                    increment(item.productId)
                  }
                  icon={<Plus size={16} />}
                >
                  Aumentar
                </Button>

                <Button
                  variant="danger"
                  onClick={() =>
                    removeItem(item.productId)
                  }
                  icon={<Trash2 size={16} />}
                >
                  Remover
                </Button>
              </div>
            </div>

            <p className="hidden text-right font-bold text-gold sm:block">
              {formatCurrency(
                item.price * item.quantity
              )}
            </p>
          </Panel>
        ))}

        <Panel className="p-5">
          <div className="flex items-start gap-3">
            <div className="grid size-10 shrink-0 place-items-center rounded-lg bg-skybrand/10 text-skysoft">
              <Truck size={20} />
            </div>

            <div>
              <h2 className="text-xl font-bold text-white">
                Calcular frete
              </h2>

              <p className="mt-1 text-sm text-slate-400">
                Informe o CEP de entrega para consultar
                as transportadoras e os prazos.
              </p>
            </div>
          </div>

          <form
            className="mt-5 flex flex-col gap-3 sm:flex-row sm:items-end"
            onSubmit={handleCalculateShipping}
          >
            <div className="flex-1">
              <Input
                label="CEP de entrega"
                value={postalCode}
                onChange={handlePostalCodeChange}
                inputMode="numeric"
                autoComplete="postal-code"
                placeholder="00000-000"
                maxLength={9}
                error={postalCodeError ?? undefined}
              />
            </div>

            <Button
              type="submit"
              icon={<Calculator size={17} />}
              disabled={quoteMutation.isPending}
            >
              {quoteMutation.isPending
                ? "Calculando..."
                : "Calcular"}
            </Button>
          </form>

          {quoteMutation.isError ? (
            <p className="mt-4 rounded-md border border-red-400/30 bg-red-400/10 p-3 text-sm text-red-200">
              Não foi possível calcular o frete. Confira
              o CEP e tente novamente.
            </p>
          ) : null}

          {!quoteMutation.isPending &&
          quoteMutation.isSuccess &&
          quotes.length === 0 ? (
            <p className="mt-4 rounded-md border border-yellow-400/30 bg-yellow-400/10 p-3 text-sm text-yellow-200">
              Nenhuma opção de entrega foi encontrada
              para esse CEP.
            </p>
          ) : null}

          {quotes.length > 0 ? (
            <div className="mt-5 space-y-3">
              <p className="text-sm font-semibold text-slate-200">
                Escolha uma opção de entrega:
              </p>

              {quotes.map((quote) => {
                const selected =
                  validSelectedShipping?.serviceId ===
                    quote.serviceId &&
                  validSelectedShipping
                    .destinationPostalCode ===
                    normalizePostalCode(postalCode);

                return (
                  <button
                    key={`${quote.serviceId}-${quote.serviceName}`}
                    type="button"
                    onClick={() =>
                      handleSelectShipping(quote)
                    }
                    className={`flex w-full items-center gap-4 rounded-lg border p-4 text-left transition ${
                      selected
                        ? "border-skybrand bg-skybrand/10"
                        : "border-line bg-white/5 hover:border-skybrand/60 hover:bg-white/10"
                    }`}
                  >
                    {quote.carrierPicture ? (
                      <div className="flex size-12 shrink-0 items-center justify-center rounded-md bg-white p-2">
                        <img
                          src={quote.carrierPicture}
                          alt={quote.carrier}
                          className="max-h-full max-w-full object-contain"
                        />
                      </div>
                    ) : (
                      <div className="grid size-12 shrink-0 place-items-center rounded-md bg-skybrand/10 text-skysoft">
                        <Truck size={20} />
                      </div>
                    )}

                    <div className="min-w-0 flex-1">
                      <p className="font-semibold text-white">
                        {quote.carrier}
                      </p>

                      <p className="text-sm text-slate-400">
                        {quote.serviceName}
                      </p>

                      <p className="mt-1 text-xs text-slate-500">
                        Entrega estimada em{" "}
                        {quote.deliveryDays}{" "}
                        {quote.deliveryDays === 1
                          ? "dia útil"
                          : "dias úteis"}
                      </p>
                    </div>

                    <div className="text-right">
                      <p className="font-bold text-gold">
                        {formatCurrency(quote.price)}
                      </p>

                      <span className="mt-1 block text-xs text-slate-400">
                        {selected
                          ? "Selecionado"
                          : "Selecionar"}
                      </span>
                    </div>
                  </button>
                );
              })}
            </div>
          ) : null}
        </Panel>
      </div>

      <Panel className="h-fit p-5">
        <h2 className="text-xl font-bold text-white">
          Resumo
        </h2>

        <div className="mt-5 space-y-3 text-sm text-slate-300">
          <div className="flex justify-between">
            <span>Itens</span>
            <span>{totalItems()}</span>
          </div>

          <div className="flex justify-between">
            <span>Produtos</span>
            <span>
              {formatCurrency(productsTotal)}
            </span>
          </div>

          <div className="flex justify-between">
            <span>Frete</span>

            <span>
              {validSelectedShipping
                ? formatCurrency(
                    validSelectedShipping.price
                  )
                : "A calcular"}
            </span>
          </div>

          {validSelectedShipping ? (
            <div className="rounded-md border border-line bg-white/5 p-3 text-xs">
              <p className="font-semibold text-white">
                {validSelectedShipping.carrier}
              </p>

              <p className="mt-1 text-slate-400">
                {validSelectedShipping.serviceName} ·{" "}
                {validSelectedShipping.deliveryDays}{" "}
                {validSelectedShipping.deliveryDays === 1
                  ? "dia útil"
                  : "dias úteis"}
              </p>
            </div>
          ) : null}

          <div className="flex justify-between border-t border-line pt-3 text-lg font-bold text-white">
            <span>Total estimado</span>
            <span>
              {formatCurrency(orderPreviewTotal)}
            </span>
          </div>
        </div>

        {validSelectedShipping ? (
          <Link to="/checkout" className="mt-5 block">
            <Button className="w-full">
              Finalizar pedido
            </Button>
          </Link>
        ) : (
          <Button
            className="mt-5 w-full"
            disabled
          >
            Selecione o frete
          </Button>
        )}
      </Panel>
    </section>
  );
}