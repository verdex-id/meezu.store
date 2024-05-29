export function emailText(orderCode, price, expireTime) {
  const text = `
Pesanan pelanggan

Total Tagihan: Rp ${price}

Untuk memastikan pesanan Anda diproses, harap segera melakukan pembayaran. Untuk detail informasi dan pembayaran, silahkan cek pesanan anda.

Cek pesanan: ${process.env.BASE_URL}/payment/${orderCode}

Berlaku sampai: ${expireTime}

Terima kasih, 
Tim kami AKUDAV DUASATU WIJAYA
`;

  return text;
}

export function emailHTML(orderCode, price, expireTime) {
  const html = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Pesanan pelanggan</title>
</head>
<body>
    <div style="background-color: #C8EDFF; border-radius: 32px; text-align: center; padding: 12px; font-family: Arial, sans-serif;">
        <header>
            <img src="https://raw.githubusercontent.com/yogawan/akudav/main/akudav.png" alt="logo" style="width: 128px;">
        </header>
        <div style="border: 1px solid #00000035; padding: 12px; border-radius: 24px;">
            <h1>Pesanan pelanggan</h1>
            <p style="color: #00000085;">Total Tagihan</p>
            <h2 style="max-width: 500px; margin: 0 auto;padding:24px;border-radius:16px;border:1px solid #00000025;background-color:#bbe8ff">Rp ${price}</h2>
            <p style="color: #00000085;">Untuk memastikan pesanan Anda diproses, harap segera melakukan pembayaran. Untuk detail informasi dan pembayaran, silahkan cek pesanan anda</p>
            <div style="margin-top: 32px; margin-bottom: 32px;">
                <a href="${process.env.BASE_URL}/payment/${orderCode}" style="background-color: #FE5D8F; padding: 16px 24px; border-radius: 12px; text-decoration: none; color: #FFFFFF;">Cek Pesanan</a>
            </div>
            <p style="color: #00000085;">Berlaku sampai: <span style="color: #3995BF;">${expireTime}</span></p>
        </div>
        <footer>
            <p style="color: #00000085;">Terima kasih, <br> tim kami</p>
            <img src="https://raw.githubusercontent.com/yogawan/akudav/main/company.png" alt="company" style="width: 128px; margin-top: 8px; margin-bottom: 16px;">
        </footer>
    </div>
</body>
</html>`;

  return html;
}
