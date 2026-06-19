const orders = globalThis.__orders || (globalThis.__orders = []);

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PATCH, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();

  if (req.method === 'POST') {
    const { orderId, customer, items, grossAmount, paymentMethod, paymentStatus, taxAmount } = req.body;
    if (!orderId || !customer || !items?.length) return res.status(400).json({ error: 'Data tidak lengkap' });

    const order = {
      orderId,
      customer,
      items,
      grossAmount,
      taxAmount: taxAmount || 0,
      paymentMethod,
      paymentStatus,
      kitchenStatus: 'baru',
      createdAt: new Date().toISOString()
    };
    orders.push(order);
    return res.status(201).json({ ok: true, order });
  }

  if (req.method === 'PATCH') {
    const { orderId, kitchenStatus, paymentStatus } = req.body;
    const order = orders.find(o => o.orderId === orderId);
    if (!order) return res.status(404).json({ error: 'Order tidak ditemukan' });
    if (kitchenStatus) order.kitchenStatus = kitchenStatus;
    if (paymentStatus) order.paymentStatus = paymentStatus;
    return res.status(200).json({ ok: true, order });
  }

  if (req.method === 'GET') {
    return res.status(200).json({ orders: [...orders].reverse() });
  }

  return res.status(405).json({ error: 'Method not allowed' });
}
