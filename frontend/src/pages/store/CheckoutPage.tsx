import { useMutation, useQuery } from "@tanstack/react-query";
import { isAxiosError } from "axios";
import {
  CreditCard,
  MapPin,
  ShieldCheck,
  Store,
  Truck,
} from "lucide-react";
import {
  type ChangeEvent,
  useEffect,
  useRef,
  useState,
} from "react";
import { Link, Navigate, useNavigate } from "react-router-dom";
import { createOrder } from "../../api/ordersApi";
import { getProductById } from "../../api/productsApi";
import { Input } from "../../components/Input";
import { storeConfig } from "../../config/storeConfig";
import { useAuthStore } from "../../stores/authStore";
import {
  type CartItem,
  getCartItemMaxQuantity,
  useCartStore,
} from "../../stores/cartStore";
import { useShippingStore } from "../../stores/shippingStore";
import type { ShippingAddress } from "../../types/order";
import type { Product } from "../../types/product";
import { formatCurrency } from "../../utils/currency";

type AddressErrors = Partial<
  Record<keyof ShippingAddress, string>
>;

type ProductValidation = {
  products: Product[];
  issues: string[];
  priceChanged: boolean;
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

async function validateProducts(
  items: CartItem[],
): Promise<ProductValidation> {
  const products: Product[] = [];
  const issues: string[] = [];
  let priceChanged = false;

  if (items.length === 0) {
    return {
      products,
      issues: ["O carrinho está vazio."],
      priceChanged,
    };
  }

  const results = await Promise.allSettled(
    items.map((item) => getProductById(item.productId)),
  );

  results.forEach((result, index) => {
    const item = items[index];

    if (result.status === "rejected") {
      const unavailable =
        isAxiosError(result.reason) &&
        result.reason.response?.status === 404;

      issues.push(
        unavailable
          ? `${item.name}: produto indisponível. Remova-o do carrinho.`
          : `${item.name}: não foi possível verificar o produto. Tente novamente.`,
      );
      return;
    }

    const product = result.value;

    if (product.id !== item.productId) {
      issues.push(`${item.name}: não foi possível verificar o produto.`);
      return;
    }

    products.push(product);

    if (product.available !== true) {
      issues.push(`${item.name}: produto indisponível.`);
      return;
    }

    if (
      !Number.isSafeInteger(item.quantity) ||
      item.quantity <= 0
    ) {
      issues.push(`${item.name}: quantidade inválida.`);
      return;
    }

    if (!Number.isFinite(product.price) || product.price <= 0) {
      issues.push(`${item.name}: preço indisponível.`);
      return;
    }

    const maximum = getCartItemMaxQuantity(product);

    if (maximum <= 0) {
      issues.push(`${item.name}: produto sem disponibilidade para compra.`);
    } else if (item.quantity > maximum) {
      issues.push(
        `${item.name}: a quantidade máxima permitida agora é ${maximum}. Ajuste o carrinho.`,
      );
    }

    if (item.price !== product.price) {
      priceChanged = true;
    }
  });

  return { products, issues, priceChanged };
}

function getOrderErrorMessage(error: unknown) {
  if (error instanceof Error && !isAxiosError(error)) {
    return error.message;
  }

  return (
    "Não foi possível criar o pedido. Confira os dados e atualize " +
    "o carrinho antes de tentar novamente."
  );
}

export function CheckoutPage() {
  const navigate = useNavigate();
  const submittingRef = useRef(false);

  const user = useAuthStore((state) => state.user);
  const isAuthenticated = useAuthStore(
    (state) => state.isAuthenticated(),
  );

  const {
    items,
    clear,
    syncProduct,
    totalPrice,
  } = useCartStore();

  const {
    deliveryMethod,
    selectedShipping,
    selectDeliveryMethod,
    clearShipping,
  } = useShippingStore();

  const isPickup = deliveryMethod === "PICKUP";

  const [address, setAddress] = useState<ShippingAddress>({
    recipientName: user?.name ?? "",
    recipientPhone: user?.phone ?? "",
    postalCode: selectedShipping
      ? formatPostalCode(selectedShipping.destinationPostalCode)
      : "",
    street: "",
    number: "",
    complement: "",
    neighborhood: "",
    city: "",
    state: "",
  });

  const [errors, setErrors] = useState<AddressErrors>({});

  const cartSignature = createCartSignature(items);

  const validSelectedShipping =
    deliveryMethod === "SHIPPING" &&
    selectedShipping?.cartSignature === cartSignature &&
    selectedShipping.destinationPostalCode ===
      normalizePostalCode(address.postalCode)
      ? selectedShipping
      : null;

  const validationQuery = useQuery({
    queryKey: ["checkout-products", cartSignature],
    queryFn: () =>
      validateProducts(
        useCartStore.getState().items.map((item) => ({ ...item })),
      ),
    enabled: isAuthenticated && items.length > 0,
    staleTime: 0,
    refetchOnMount: "always",
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
    retry: false,
  });

  useEffect(() => {
    const validation = validationQuery.data;

    if (!validation) {
      return;
    }

    validation.products.forEach(syncProduct);
  }, [validationQuery.data, syncProduct]);

  const validationIssues = validationQuery.data?.issues ?? [];
  const priceChanged = validationQuery.data?.priceChanged ?? false;

  const productsValid =
    validationQuery.isSuccess &&
    !validationQuery.isFetching &&
    validationIssues.length === 0 &&
    !priceChanged;

  const productsTotal = totalPrice();
  const orderTotal =
    productsTotal + (validSelectedShipping?.price ?? 0);

  const mutation = useMutation({
    mutationFn: async () => {
      const snapshot = useCartStore
        .getState()
        .items.map((item) => ({ ...item }));

      const snapshotSignature = createCartSignature(snapshot);
      const shippingSnapshot = useShippingStore.getState();
      const method = shippingSnapshot.deliveryMethod;
      const shipping = shippingSnapshot.selectedShipping;

      const validation = await validateProducts(snapshot);
      validation.products.forEach(syncProduct);

      if (validation.issues.length > 0) {
        throw new Error(validation.issues.join(" "));
      }

      if (validation.priceChanged) {
        clearShipping();
        throw new Error(
          "O preço de um ou mais produtos mudou. Volte ao carrinho para revisar os valores e a entrega.",
        );
      }

      const latestShipping = useShippingStore.getState();

      if (
        createCartSignature(useCartStore.getState().items) !==
          snapshotSignature ||
        latestShipping.deliveryMethod !== method ||
        latestShipping.selectedShipping !== shipping
      ) {
        throw new Error(
          "O carrinho ou a entrega mudou durante a verificação. Revise os dados antes de continuar.",
        );
      }

      const orderItems = snapshot.map((item) => ({
        productId: item.productId,
        quantity: item.quantity,
      }));

      if (method === "PICKUP") {
        return createOrder({
          items: orderItems,
          shipping: { method: "PICKUP" },
        });
      }

      if (
        !shipping ||
        shipping.cartSignature !== snapshotSignature ||
        shipping.destinationPostalCode !==
          normalizePostalCode(address.postalCode)
      ) {
        throw new Error(
          "Volte ao carrinho e selecione uma opção de frete válida.",
        );
      }

      return createOrder({
        items: orderItems,
        shippingAddress: {
          ...address,
          recipientName: address.recipientName.trim(),
          recipientPhone: address.recipientPhone.trim(),
          postalCode: normalizePostalCode(address.postalCode),
          street: address.street.trim(),
          number: address.number.trim(),
          neighborhood: address.neighborhood.trim(),
          city: address.city.trim(),
          state: address.state.trim().toUpperCase(),
          complement: address.complement?.trim() || undefined,
        },
        shipping: {
          method: "SHIPPING",
          serviceId: shipping.serviceId,
        },
      });
    },

    onSuccess: (order) => {
      clear();
      clearShipping();
      selectDeliveryMethod("SHIPPING");

      if (order.payment?.checkoutUrl) {
        window.location.assign(order.payment.checkoutUrl);
        return;
      }

      navigate(`/pedidos/${order.id}`);
    },

    onSettled: () => {
      submittingRef.current = false;
    },
  });

  function handleChange(
    event: ChangeEvent<HTMLInputElement>,
  ) {
    const { name, value } = event.target;
    let nextValue = value;

    if (name === "recipientPhone") {
      nextValue = value
        .replace(/[^0-9()+\-\s]/g, "")
        .slice(0, 20);
    }

    if (name === "state") {
      nextValue = value
        .replace(/[^a-zA-Z]/g, "")
        .slice(0, 2)
        .toUpperCase();
    }

    setAddress((current) => ({
      ...current,
      [name]: nextValue,
    }));

    setErrors((current) => ({
      ...current,
      [name]: undefined,
    }));
  }

  function validateAddress() {
    const nextErrors: AddressErrors = {};
    const phoneDigits =
      address.recipientPhone.replace(/\D/g, "");

    if (address.recipientName.trim().length < 3) {
      nextErrors.recipientName =
        "Informe o nome completo do destinatário.";
    }

    if (phoneDigits.length < 10 || phoneDigits.length > 11) {
      nextErrors.recipientPhone =
        "Informe um telefone válido com DDD.";
    }

    if (normalizePostalCode(address.postalCode).length !== 8) {
      nextErrors.postalCode = "Informe um CEP válido.";
    }

    if (address.street.trim().length < 3) {
      nextErrors.street = "Informe o nome da rua.";
    }

    if (!address.number.trim()) {
      nextErrors.number = "Informe o número do endereço.";
    }

    if (address.neighborhood.trim().length < 2) {
      nextErrors.neighborhood = "Informe o bairro.";
    }

    if (address.city.trim().length < 2) {
      nextErrors.city = "Informe a cidade.";
    }

    if (!/^[A-Za-z]{2}$/.test(address.state.trim())) {
      nextErrors.state = "Informe a sigla do estado.";
    }

    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  }

  function handleConfirmOrder() {
    if (
      submittingRef.current ||
      mutation.isPending ||
      !productsValid ||
      (!isPickup && !validSelectedShipping)
    ) {
      return;
    }

    if (!isPickup && !validateAddress()) {
      return;
    }

    submittingRef.current = true;
    mutation.mutate();
  }

  if (!isAuthenticated) {
    return (
      <Navigate
        to="/login"
        replace
        state={{ from: "/checkout" }}
      />
    );
  }

  // Mantém a tela durante o redirecionamento para o pagamento.
  if (mutation.isSuccess) {
    return (
      <section className="relative left-1/2 w-screen -translate-x-1/2 bg-[#f4f7fb] px-4 py-16">
        <div className="mx-auto max-w-lg rounded-2xl border border-slate-200 bg-white p-8 text-center shadow-sm">
          <h1 className="text-2xl font-black text-[#00102D]">
            Pedido criado
          </h1>
          <p className="mt-3 text-slate-600">
            Redirecionando para continuar...
          </p>
          <Link
            to={`/pedidos/${mutation.data.id}`}
            className="mt-5 inline-block font-bold text-sky-700"
          >
            Ver meu pedido
          </Link>
        </div>
      </section>
    );
  }

  if (items.length === 0) {
    return <Navigate to="/carrinho" replace />;
  }

  const canConfirm =
    productsValid &&
    !mutation.isPending &&
    (isPickup || validSelectedShipping !== null);

  return (
    <section className="relative left-1/2 w-screen -translate-x-1/2 bg-[#f4f7fb]">
      <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:px-8 lg:py-14">
        <div>
          <span className="text-sm font-bold uppercase tracking-wider text-sky-600">
            Última etapa
          </span>
          <h1 className="mt-2 text-3xl font-black text-[#00102D] sm:text-4xl">
            Finalizar pedido
          </h1>
          <p className="mt-2 text-sm text-slate-500">
            {isPickup
              ? "Revise os dados da retirada antes do pagamento."
              : "Informe o endereço de entrega e revise os dados antes do pagamento."}
          </p>
        </div>

        <div className="mt-6 space-y-3" aria-live="polite">
          {validationQuery.isFetching ? (
            <p className="rounded-xl border border-sky-200 bg-sky-50 p-4 text-sm text-sky-800">
              Verificando disponibilidade, estoque e limites dos produtos...
            </p>
          ) : null}

          {validationQuery.isError ? (
            <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
              <p>Não foi possível verificar os produtos.</p>
              <button
                type="button"
                disabled={mutation.isPending}
                onClick={() => void validationQuery.refetch()}
                className="mt-3 font-bold underline"
              >
                Tentar novamente
              </button>
            </div>
          ) : null}

          {validationIssues.length > 0 ? (
            <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
              <p className="font-bold">Revise os produtos:</p>
              <ul className="mt-2 list-disc space-y-1 pl-5">
                {validationIssues.map((issue, index) => (
                  <li key={`${index}-${issue}`}>{issue}</li>
                ))}
              </ul>
              <Link
                to="/carrinho"
                className="mt-3 inline-block font-bold underline"
              >
                Voltar ao carrinho
              </Link>
            </div>
          ) : null}

          {priceChanged ? (
            <div className="rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-800">
              <p>
                Os preços foram atualizados. Volte ao carrinho para
                revisar os valores e a entrega antes de continuar.
              </p>
              <Link
                to="/carrinho"
                className="mt-3 inline-block font-bold underline"
              >
                Revisar carrinho
              </Link>
            </div>
          ) : null}

          {!isPickup && !validSelectedShipping ? (
            <div className="rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-800">
              <p>Selecione um frete válido antes de finalizar.</p>
              <Link
                to="/carrinho"
                className="mt-3 inline-block font-bold underline"
              >
                Escolher frete no carrinho
              </Link>
            </div>
          ) : null}
        </div>

        <div className="mt-8 grid gap-6 lg:grid-cols-[1fr_360px]">
          <div className="space-y-6">
            {isPickup ? (
              <div className="rounded-2xl border border-emerald-200 bg-white p-5 shadow-sm sm:p-6">
                <div className="flex items-start gap-3">
                  <div className="grid size-11 shrink-0 place-items-center rounded-xl bg-emerald-100 text-emerald-700">
                    <Store size={21} />
                  </div>
                  <div>
                    <h2 className="text-xl font-black text-[#00102D]">
                      Retirada na loja
                    </h2>
                    <p className="mt-1 text-sm text-slate-500">
                      Não será necessário informar um endereço de entrega.
                    </p>
                  </div>
                </div>

                <div className="mt-5 rounded-xl border border-emerald-200 bg-emerald-50 p-4">
                  <div className="flex items-start gap-3">
                    <MapPin
                      size={20}
                      className="mt-0.5 shrink-0 text-emerald-700"
                    />
                    <div>
                      <p className="font-bold text-[#00102D]">
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
              </div>
            ) : (
              <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
                <div className="flex items-start gap-3">
                  <div className="grid size-11 shrink-0 place-items-center rounded-xl bg-sky-100 text-sky-700">
                    <MapPin size={21} />
                  </div>
                  <div>
                    <h2 className="text-xl font-black text-[#00102D]">
                      Endereço de entrega
                    </h2>
                    <p className="mt-1 text-sm text-slate-500">
                      O pedido será enviado para este endereço.
                    </p>
                  </div>
                </div>

                <fieldset
                  disabled={mutation.isPending}
                  className="mt-5 grid gap-4 sm:grid-cols-2"
                >
                  <div className="sm:col-span-2">
                    <Input
                      variant="light"
                      label="Nome do destinatário"
                      name="recipientName"
                      value={address.recipientName}
                      onChange={handleChange}
                      autoComplete="name"
                      error={errors.recipientName}
                    />
                  </div>

                  <Input
                    variant="light"
                    label="Telefone"
                    name="recipientPhone"
                    value={address.recipientPhone}
                    onChange={handleChange}
                    inputMode="tel"
                    autoComplete="tel"
                    placeholder="(15) 99999-9999"
                    error={errors.recipientPhone}
                  />

                  <Input
                    variant="light"
                    label="CEP"
                    name="postalCode"
                    value={address.postalCode}
                    readOnly
                    autoComplete="postal-code"
                    className="cursor-not-allowed bg-slate-100 text-slate-500"
                    error={errors.postalCode}
                  />

                  <div className="sm:col-span-2">
                    <Input
                      variant="light"
                      label="Rua"
                      name="street"
                      value={address.street}
                      onChange={handleChange}
                      autoComplete="address-line1"
                      error={errors.street}
                    />
                  </div>

                  <Input
                    variant="light"
                    label="Número"
                    name="number"
                    value={address.number}
                    onChange={handleChange}
                    error={errors.number}
                  />

                  <Input
                    variant="light"
                    label="Complemento"
                    name="complement"
                    value={address.complement ?? ""}
                    onChange={handleChange}
                    autoComplete="address-line2"
                    placeholder="Apartamento, bloco ou referência"
                    error={errors.complement}
                  />

                  <Input
                    variant="light"
                    label="Bairro"
                    name="neighborhood"
                    value={address.neighborhood}
                    onChange={handleChange}
                    error={errors.neighborhood}
                  />

                  <Input
                    variant="light"
                    label="Cidade"
                    name="city"
                    value={address.city}
                    onChange={handleChange}
                    autoComplete="address-level2"
                    error={errors.city}
                  />

                  <Input
                    variant="light"
                    label="Estado"
                    name="state"
                    value={address.state}
                    onChange={handleChange}
                    autoComplete="address-level1"
                    placeholder="SP"
                    maxLength={2}
                    error={errors.state}
                  />
                </fieldset>
              </div>
            )}

            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
              <h2 className="text-xl font-black text-[#00102D]">
                Itens do pedido
              </h2>

              <div className="mt-5 space-y-4">
                {items.map((item) => (
                  <div
                    key={item.productId}
                    className="flex items-center justify-between gap-4 border-b border-slate-200 pb-4 last:border-b-0 last:pb-0"
                  >
                    <div className="flex min-w-0 items-center gap-3">
                      <div className="flex size-14 shrink-0 items-center justify-center rounded-lg bg-slate-50 p-2">
                        {item.imgUrl ? (
                          <img
                            src={item.imgUrl}
                            alt={item.name}
                            className="max-h-full max-w-full object-contain"
                          />
                        ) : null}
                      </div>

                      <div className="min-w-0">
                        <p className="truncate font-bold text-[#00102D]">
                          {item.name}
                        </p>
                        <p className="text-sm text-slate-500">
                          {item.quantity} x {formatCurrency(item.price)}
                        </p>
                        {item.maxQuantityPerOrder != null ? (
                          <p className="mt-1 text-xs text-sky-700">
                            Limite por pedido: {item.maxQuantityPerOrder}
                          </p>
                        ) : null}
                      </div>
                    </div>

                    <p className="shrink-0 font-black text-[#00102D]">
                      {formatCurrency(item.price * item.quantity)}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <aside className="h-fit rounded-2xl border border-slate-200 bg-white p-5 shadow-sm lg:sticky lg:top-60">
            <h2 className="text-xl font-black text-[#00102D]">
              Resumo do pedido
            </h2>

            <div className="mt-5 space-y-3 text-sm text-slate-600">
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
                      : "Selecione no carrinho"}
                </span>
              </div>

              {isPickup ? (
                <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-3">
                  <div className="flex items-start gap-3">
                    <Store
                      size={18}
                      className="mt-0.5 shrink-0 text-emerald-700"
                    />
                    <div>
                      <p className="font-bold text-[#00102D]">
                        Retirada na loja
                      </p>
                      <p className="mt-1 text-xs text-slate-500">
                        {storeConfig.address.street}
                      </p>
                      <p className="text-xs text-slate-500">
                        {storeConfig.address.city}/
                        {storeConfig.address.shortState}
                      </p>
                    </div>
                  </div>
                </div>
              ) : validSelectedShipping ? (
                <div className="rounded-xl border border-slate-200 bg-slate-50 p-3">
                  <div className="flex items-start gap-3">
                    <Truck
                      size={18}
                      className="mt-0.5 shrink-0 text-sky-700"
                    />
                    <div>
                      <p className="font-bold text-[#00102D]">
                        {validSelectedShipping.carrier}
                      </p>
                      <p className="mt-1 text-xs text-slate-500">
                        {validSelectedShipping.serviceName}
                      </p>
                      <p className="mt-1 text-xs text-slate-400">
                        Entrega estimada em{" "}
                        {validSelectedShipping.deliveryDays}{" "}
                        {validSelectedShipping.deliveryDays === 1
                          ? "dia útil"
                          : "dias úteis"}
                      </p>
                    </div>
                  </div>
                </div>
              ) : null}

              <div className="flex justify-between border-t border-slate-200 pt-4 text-lg font-black text-[#00102D]">
                <span>Total estimado</span>
                <span>{formatCurrency(orderTotal)}</span>
              </div>
            </div>

            <div className="mt-5 space-y-3 border-t border-slate-200 pt-5">
              <div className="flex items-center gap-3 text-sm font-semibold text-slate-600">
                <ShieldCheck size={19} className="text-sky-600" />
                Ambiente seguro
              </div>
              <div className="flex items-center gap-3 text-sm font-semibold text-slate-600">
                <CreditCard size={19} className="text-sky-600" />
                Pagamento processado com segurança
              </div>
            </div>

            {mutation.isError ? (
              <p
                role="alert"
                className="mt-4 rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-600"
              >
                {getOrderErrorMessage(mutation.error)}
              </p>
            ) : null}

            <button
              type="button"
              disabled={!canConfirm}
              onClick={handleConfirmOrder}
              className="mt-5 min-h-12 w-full rounded-xl bg-sky-500 px-5 py-3 text-sm font-bold text-white shadow-md shadow-sky-500/20 transition hover:bg-sky-600 disabled:cursor-not-allowed disabled:bg-slate-300 disabled:text-slate-500 disabled:shadow-none"
            >
              {mutation.isPending
                ? "Verificando e criando pedido..."
                : validationQuery.isFetching
                  ? "Verificando produtos..."
                  : "Confirmar e efetuar pagamento"}
            </button>

            {!mutation.isPending ? (
              <Link
                to="/carrinho"
                className="mt-4 block text-center text-sm font-bold text-sky-700 hover:underline"
              >
                Voltar ao carrinho
              </Link>
            ) : null}
          </aside>
        </div>
      </div>
    </section>
  );
}