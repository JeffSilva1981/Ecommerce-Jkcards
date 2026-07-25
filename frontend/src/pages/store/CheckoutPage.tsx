import { useMutation } from "@tanstack/react-query";
import { MapPin, Store, Truck } from "lucide-react";
import { type ChangeEvent, useMemo, useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { createOrder } from "../../api/ordersApi";
import { Button } from "../../components/Button";
import { Input } from "../../components/Input";
import { Panel } from "../../components/Panel";
import { useAuthStore } from "../../stores/authStore";
import { useCartStore } from "../../stores/cartStore";
import { useShippingStore } from "../../stores/shippingStore";
import type { ShippingAddress } from "../../types/order";
import { formatCurrency } from "../../utils/currency";

type AddressErrors = Partial<Record<keyof ShippingAddress, string>>;

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
    .map((item) =>
      `${item.productId}:${item.quantity}`
    )
    .join("|");
}

export function CheckoutPage() {
  const navigate = useNavigate();
  const user = useAuthStore((state) => state.user);
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated());

  const {
    items,
    clear,
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
      ? formatPostalCode(
          selectedShipping.destinationPostalCode
        )
      : "",
    street: "",
    number: "",
    complement: "",
    neighborhood: "",
    city: "",
    state: "",
  });

  const [errors, setErrors] = useState<AddressErrors>({});

  const cartSignature = useMemo(
    () => createCartSignature(items),
    [items]
  );

  const validSelectedShipping =
    deliveryMethod === "SHIPPING" &&
    selectedShipping?.cartSignature === cartSignature
      ? selectedShipping
      : null;

  const productsTotal = totalPrice();

  const orderTotal =
    productsTotal +
    (validSelectedShipping?.price ?? 0);

  const mutation = useMutation({
    mutationFn: () => {
      const orderItems = items.map((item) => ({
        productId: item.productId,
        quantity: item.quantity,
      }));

      if (isPickup) {
        return createOrder({
          items: orderItems,
          shipping: {
            method: "PICKUP",
          },
        });
      }

      if (!validSelectedShipping) {
        throw new Error(
          "A valid shipping option is required."
        );
      }

      return createOrder({
        items: orderItems,
        shippingAddress: {
          ...address,
          postalCode: normalizePostalCode(
            address.postalCode
          ),
          state: address.state
            .trim()
            .toUpperCase(),
          complement:
            address.complement?.trim() ||
            undefined,
        },
        shipping: {
          method: "SHIPPING",
          serviceId:
            validSelectedShipping.serviceId,
        },
      });
    },

    onSuccess: (order) => {
      clear();
      clearShipping();
      selectDeliveryMethod("SHIPPING");

      if (order.payment?.checkoutUrl) {
        window.location.assign(
          order.payment.checkoutUrl
        );
        return;
      }

      navigate(`/pedidos/${order.id}`);
    },
  });

  function handleChange(
    event: ChangeEvent<HTMLInputElement>
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

    if (
      phoneDigits.length < 10 ||
      phoneDigits.length > 11
    ) {
      nextErrors.recipientPhone =
        "Informe um telefone válido com DDD.";
    }

    if (
      normalizePostalCode(
        address.postalCode
      ).length !== 8
    ) {
      nextErrors.postalCode =
        "Informe um CEP válido.";
    }

    if (address.street.trim().length < 3) {
      nextErrors.street =
        "Informe o nome da rua.";
    }

    if (!address.number.trim()) {
      nextErrors.number =
        "Informe o número do endereço.";
    }

    if (
      address.neighborhood.trim().length < 2
    ) {
      nextErrors.neighborhood =
        "Informe o bairro.";
    }

    if (address.city.trim().length < 2) {
      nextErrors.city =
        "Informe a cidade.";
    }

    if (
      !/^[A-Za-z]{2}$/.test(
        address.state.trim()
      )
    ) {
      nextErrors.state =
        "Informe a sigla do estado.";
    }

    setErrors(nextErrors);

    return Object.keys(nextErrors).length === 0;
  }

  function handleConfirmOrder() {
    if (!isPickup && !validateAddress()) {
      return;
    }

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

  if (items.length === 0) {
    return (
      <Navigate
        to="/carrinho"
        replace
      />
    );
  }

  if (!isPickup && !validSelectedShipping) {
    return (
      <Navigate
        to="/carrinho"
        replace
      />
    );
  }

  return (
    <section className="mx-auto max-w-5xl space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-white">
          Finalizar pedido
        </h1>

        <p className="mt-2 text-sm text-slate-400">
          {isPickup
            ? "Revise os dados da retirada antes do pagamento."
            : "Informe o endereço de entrega e revise os dados antes do pagamento."}
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-[1fr_360px]">
        <div className="space-y-6">
          {isPickup ? (
            <Panel className="p-5">
              <div className="flex items-start gap-3">
                <div className="grid size-10 shrink-0 place-items-center rounded-lg bg-emerald-400/10 text-emerald-300">
                  <Store size={20} />
                </div>

                <div>
                  <h2 className="text-xl font-bold text-white">
                    Retirada na loja
                  </h2>

                  <p className="mt-1 text-sm text-slate-400">
                    Não será necessário informar um
                    endereço de entrega.
                  </p>
                </div>
              </div>

              <div className="mt-5 rounded-lg border border-emerald-400/30 bg-emerald-400/10 p-4">
                <div className="flex items-start gap-3">
                  <MapPin
                    size={20}
                    className="mt-0.5 shrink-0 text-emerald-300"
                  />

                  <div>
                    <p className="font-semibold text-white">
                      JKCards
                    </p>

                    <p className="mt-1 text-sm text-slate-300">
                      Rua Camargo Fleury, nº 75
                    </p>

                    <p className="text-sm text-slate-300">
                      Sorocaba/SP
                    </p>

                    <p className="mt-3 text-xs text-slate-400">
                      Após a confirmação do pagamento,
                      aguarde nosso contato antes de
                      comparecer ao local.
                    </p>
                  </div>
                </div>
              </div>
            </Panel>
          ) : (
            <Panel className="p-5">
              <div className="flex items-start gap-3">
                <div className="grid size-10 shrink-0 place-items-center rounded-lg bg-skybrand/10 text-skysoft">
                  <MapPin size={20} />
                </div>

                <div>
                  <h2 className="text-xl font-bold text-white">
                    Endereço de entrega
                  </h2>

                  <p className="mt-1 text-sm text-slate-400">
                    O pedido será enviado para este
                    endereço.
                  </p>
                </div>
              </div>

              <div className="mt-5 grid gap-4 sm:grid-cols-2">
                <div className="sm:col-span-2">
                  <Input
                    label="Nome do destinatário"
                    name="recipientName"
                    value={address.recipientName}
                    onChange={handleChange}
                    autoComplete="name"
                    error={errors.recipientName}
                  />
                </div>

                <Input
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
                  label="CEP"
                  name="postalCode"
                  value={address.postalCode}
                  readOnly
                  autoComplete="postal-code"
                  className="cursor-not-allowed opacity-70"
                  error={errors.postalCode}
                />

                <div className="sm:col-span-2">
                  <Input
                    label="Rua"
                    name="street"
                    value={address.street}
                    onChange={handleChange}
                    autoComplete="address-line1"
                    error={errors.street}
                  />
                </div>

                <Input
                  label="Número"
                  name="number"
                  value={address.number}
                  onChange={handleChange}
                  autoComplete="address-line2"
                  error={errors.number}
                />

                <Input
                  label="Complemento"
                  name="complement"
                  value={
                    address.complement ?? ""
                  }
                  onChange={handleChange}
                  placeholder="Apartamento, bloco ou referência"
                  error={errors.complement}
                />

                <Input
                  label="Bairro"
                  name="neighborhood"
                  value={address.neighborhood}
                  onChange={handleChange}
                  error={errors.neighborhood}
                />

                <Input
                  label="Cidade"
                  name="city"
                  value={address.city}
                  onChange={handleChange}
                  autoComplete="address-level2"
                  error={errors.city}
                />

                <Input
                  label="Estado"
                  name="state"
                  value={address.state}
                  onChange={handleChange}
                  autoComplete="address-level1"
                  placeholder="SP"
                  maxLength={2}
                  error={errors.state}
                />
              </div>
            </Panel>
          )}

          <Panel className="p-5">
            <h2 className="text-xl font-bold text-white">
              Itens do pedido
            </h2>

            <div className="mt-5 space-y-4">
              {items.map((item) => (
                <div
                  key={item.productId}
                  className="flex items-center justify-between gap-4 border-b border-line pb-4 last:border-b-0 last:pb-0"
                >
                  <div>
                    <p className="font-semibold text-white">
                      {item.name}
                    </p>

                    <p className="text-sm text-slate-400">
                      {item.quantity} x{" "}
                      {formatCurrency(item.price)}
                    </p>
                  </div>

                  <p className="font-bold text-gold">
                    {formatCurrency(
                      item.price * item.quantity
                    )}
                  </p>
                </div>
              ))}
            </div>
          </Panel>
        </div>

        <Panel className="h-fit p-5">
          <h2 className="text-xl font-bold text-white">
            Resumo do pedido
          </h2>

          <div className="mt-5 space-y-3 text-sm text-slate-300">
            <div className="flex justify-between">
              <span>Produtos</span>
              <span>
                {formatCurrency(productsTotal)}
              </span>
            </div>

            <div className="flex justify-between">
              <span>
                {isPickup ? "Retirada" : "Frete"}
              </span>

              <span>
                {isPickup
                  ? "Grátis"
                  : formatCurrency(
                      validSelectedShipping?.price ?? 0
                    )}
              </span>
            </div>

            {isPickup ? (
              <div className="rounded-md border border-emerald-400/30 bg-emerald-400/10 p-3">
                <div className="flex items-start gap-3">
                  <Store
                    size={18}
                    className="mt-0.5 shrink-0 text-emerald-300"
                  />

                  <div>
                    <p className="font-semibold text-white">
                      Retirada na loja
                    </p>

                    <p className="mt-1 text-xs text-slate-400">
                      Rua Camargo Fleury, nº 75
                    </p>

                    <p className="text-xs text-slate-400">
                      Sorocaba/SP
                    </p>
                  </div>
                </div>
              </div>
            ) : validSelectedShipping ? (
              <div className="rounded-md border border-line bg-white/5 p-3">
                <div className="flex items-start gap-3">
                  <Truck
                    size={18}
                    className="mt-0.5 shrink-0 text-skysoft"
                  />

                  <div>
                    <p className="font-semibold text-white">
                      {
                        validSelectedShipping.carrier
                      }
                    </p>

                    <p className="mt-1 text-xs text-slate-400">
                      {
                        validSelectedShipping.serviceName
                      }
                    </p>

                    <p className="mt-1 text-xs text-slate-500">
                      Entrega estimada em{" "}
                      {
                        validSelectedShipping.deliveryDays
                      }{" "}
                      {validSelectedShipping.deliveryDays ===
                      1
                        ? "dia útil"
                        : "dias úteis"}
                    </p>
                  </div>
                </div>
              </div>
            ) : null}

            <div className="flex justify-between border-t border-line pt-3 text-lg font-bold text-white">
              <span>Total</span>
              <span>
                {formatCurrency(orderTotal)}
              </span>
            </div>
          </div>

          {mutation.isError ? (
            <p className="mt-4 rounded-md border border-red-400/30 bg-red-400/10 p-3 text-sm text-red-200">
              Não foi possível criar o pedido.
              Confira os dados e tente novamente.
            </p>
          ) : null}

          <Button
            className="mt-5 w-full"
            disabled={mutation.isPending}
            onClick={handleConfirmOrder}
          >
            {mutation.isPending
              ? "Criando pedido..."
              : "Confirmar e efetuar pagamento"}
          </Button>
        </Panel>
      </div>
    </section>
  );
}