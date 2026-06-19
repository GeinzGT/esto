// api/create-transaction.js
// Vercel Serverless Function — Server Key aman di sini, tidak terlihat user

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  try {
    const { customer, items, grossAmount, taxAmount } = req.body;

    if (!customer?.name || !customer?.email || !customer?.phone)
      return res.status(400).json({ error: 'Data customer tidak lengkap' });
    if (!items?.length || !grossAmount)
      return res.status(400).json({ error: 'Data order tidak valid' });

    const orderId = 'ORDER-' + Date.now() + '-' + Math.random().toString(36).substr(2, 5).toUpperCase();

    const itemDetails = items.map(item => ({
      id: String(item.id),
      price: item.price,
      quantity: item.quantity,
      name: item.name
    }));

    if (taxAmount && taxAmount > 0) {
      itemDetails.push({
        id: 'TAX-PPN',
        price: taxAmount,
        quantity: 1,
        name: 'PPN 10%'
      });
    }

    const payload = {
      transaction_details: { order_id: orderId, gross_amount: grossAmount },
      customer_details: { first_name: customer.name, email: customer.email, phone: customer.phone },
      item_details: itemDetails
    };

    const serverKey = process.env.MIDTRANS_SERVER_KEY;
    if (!serverKey) return res.status(500).json({ error: 'Server key tidak dikonfigurasi' });

    const authString = Buffer.from(serverKey + ':').toString('base64');

    const midtransRes = await fetch('https://app.midtrans.com/snap/v1/transactions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Basic ${authString}`
      },
      body: JSON.stringify(payload)
    });

    const data = await midtransRes.json();

    if (!midtransRes.ok) {
      console.error('Midtrans error:', data);
      return res.status(midtransRes.status).json({ error: data?.error_messages?.[0] || 'Gagal membuat transaksi' });
    }

    return res.status(200).json({ token: data.token, redirect_url: data.redirect_url });

  } catch (err) {
    console.error('Server error:', err);
    return res.status(500).json({ error: 'Internal server error' });
  }
}
