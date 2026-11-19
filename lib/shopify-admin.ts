type OrderInput = {
  fullName: string;
  phone: string;
  address: string;
  lines: { variantId: string; quantity: number }[];
  deliveryFee: number;
};

const MUTATION = `mutation orderCreate($order: OrderCreateOrderInput!) {
  orderCreate(order: $order) {
    order { id name }
    userErrors { field message }
  }
}`;

let cached: { token: string; expiresAt: number } | null = null;

/** Gets a temporary Admin token from the app's client id and secret (valid about 24 hours). */
async function getAdminToken(domain: string) {
  if (cached && cached.expiresAt > Date.now() + 60_000) return cached.token;

  const clientId = process.env.SHOPIFY_CLIENT_ID;
  const clientSecret = process.env.SHOPIFY_CLIENT_SECRET;
  if (!clientId || !clientSecret) throw new Error("SHOPIFY_CLIENT_ID or SHOPIFY_CLIENT_SECRET is missing");

  const res = await fetch(`https://${domain}/admin/oauth/access_token`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ client_id: clientId, client_secret: clientSecret, grant_type: "client_credentials" }),
    cache: "no-store",
  });
  if (!res.ok) throw new Error(`Shopify token request failed (${res.status})`);

  const json = (await res.json()) as { access_token: string; expires_in?: number };
  cached = { token: json.access_token, expiresAt: Date.now() + (json.expires_in ?? 86_000) * 1000 };
  return cached.token;
}

/** Server only. Creates an unpaid (cash on delivery) order in Shopify with the Admin API. */
export async function createShopifyOrder(input: OrderInput) {
  const domain = process.env.SHOPIFY_STORE_DOMAIN?.replace(/^https?:\/\//, "").replace(/\/$/, "");
  if (!domain) throw new Error("SHOPIFY_STORE_DOMAIN is missing");
  const token = await getAdminToken(domain);

  const [firstName, ...rest] = input.fullName.split(" ");
  const order = {
    lineItems: input.lines,
    phone: input.phone,
    shippingAddress: {
      firstName,
      lastName: rest.join(" ") || "-",
      address1: input.address,
      city: "Casablanca",
      countryCode: "MA",
      phone: input.phone,
    },
    shippingLines: [
      {
        title: "Delivery (Casablanca)",
        priceSet: { shopMoney: { amount: input.deliveryFee.toFixed(2), currencyCode: "MAD" } },
      },
    ],
    financialStatus: "PENDING",
    tags: ["COD", "website"],
    note: "Cash on delivery. Order placed on the website.",
  };

  const res = await fetch(`https://${domain}/admin/api/2025-01/graphql.json`, {
    method: "POST",
    headers: { "Content-Type": "application/json", "X-Shopify-Access-Token": token },
    body: JSON.stringify({ query: MUTATION, variables: { order } }),
    cache: "no-store",
  });
  if (!res.ok) throw new Error(`Shopify admin request failed (${res.status})`);

  const json = await res.json();
  const errors = json.errors ?? json.data?.orderCreate?.userErrors;
  if (errors?.length) throw new Error(`Shopify order error: ${JSON.stringify(errors)}`);
  return json.data.orderCreate.order as { id: string; name: string };
}
