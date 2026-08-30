type WhatsAppOrderItem = {
  name?: string;
  quantity?: number;
  price?: number;
};

type WhatsAppOrder = {
  order_number: string;
  customer_name: string;
  customer_phone: string;
  total: number;
  items?: WhatsAppOrderItem[];
};

function getEnv() {
  return {
    token: process.env.WHATSAPP_ACCESS_TOKEN,
    phoneNumberId: process.env.WHATSAPP_PHONE_NUMBER_ID,
    adminPhone: process.env.WHATSAPP_ADMIN_PHONE,
  };
}

function formatPKR(value: number) {
  return `PKR ${Number(value || 0).toLocaleString("en-PK")}`;
}

export async function sendNewOrderWhatsAppNotification(
  order: WhatsAppOrder,
) {
  const {
    token,
    phoneNumberId,
    adminPhone,
  } = getEnv();

  // WhatsApp is optional. Never let a notification failure
  // break a successfully-created order.
  if (!token || !phoneNumberId || !adminPhone) {
    console.info(
      "WhatsApp order notification skipped: WhatsApp credentials are not configured.",
    );
    return;
  }

  const baseUrl =
    process.env.NEXT_PUBLIC_SITE_URL ||
    "https://boutique-store.fk-boutique.workers.dev";

  const adminOrderUrl =
    `${baseUrl}/admin/orders/${encodeURIComponent(order.order_number)}`;

  const lines = [
    "🛍️ *NEW ORDER — F&K Boutique*",
    "",
    `Order: *${order.order_number}*`,
    `Customer: ${order.customer_name}`,
    `Phone: ${order.customer_phone}`,
    `Total: *${formatPKR(order.total)}*`,
    "",
    `View order: ${adminOrderUrl}`,
  ];

  if (order.items?.length) {
    lines.splice(
      4,
      0,
      "",
      "*Items:*",
      ...order.items.map(
        (item) =>
          `• ${item.name || "Product"} × ${item.quantity || 1}`,
      ),
    );
  }

  const response = await fetch(
    `https://graph.facebook.com/v23.0/${phoneNumberId}/messages`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        messaging_product: "whatsapp",
        to: adminPhone.replace(/\D/g, ""),
        type: "text",
        text: {
          preview_url: true,
          body: lines.join("\n"),
        },
      }),
    },
  );

  if (!response.ok) {
    const errorText = await response.text();

    console.error(
      "WhatsApp order notification failed:",
      response.status,
      errorText,
    );

    return;
  }

  console.info(
    `WhatsApp order notification sent for ${order.order_number}.`,
  );
}
