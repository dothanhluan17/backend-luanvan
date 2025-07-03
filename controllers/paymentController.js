const crypto = require("crypto");
const moment = require("moment");
const axios = require("axios");

const createZaloOrder = async (req, res) => {
  try {
    const { amount, orderId } = req.body;

    if (!amount || !orderId) {
      return res.status(400).json({ message: "Thiếu orderId hoặc amount" });
    }

    const app_id = process.env.ZALO_APP_ID;
    const key1 = process.env.ZALO_KEY1;
    const create_order_url = process.env.ZALO_CREATE_ORDER_URL;

    const transID = Math.floor(Math.random() * 1000000);
    const embed_data = {};
    const items = [];

    const order = {
      app_id: app_id,
      app_trans_id: `${moment().format("YYMMDD")}_${transID}`,
      app_user: "demo_user",
      app_time: Date.now(),
      amount: amount,
      item: JSON.stringify(items),
      description: `Thanh toán đơn hàng #${orderId}`,
      embed_data: JSON.stringify(embed_data),
      bank_code: "",
      callback_url: "", // Có thể để rỗng
    };

    // ✅ Tạo MAC
    const data =
      app_id +
      "|" +
      order.app_trans_id +
      "|" +
      order.app_user +
      "|" +
      order.amount +
      "|" +
      order.app_time +
      "|" +
      order.embed_data +
      "|" +
      order.item;

    order.mac = crypto.createHmac("sha256", key1).update(data).digest("hex");
    console.log("📤 Payload gửi lên ZaloPay:", order);

    // ✅ Gọi API ZaloPay bằng `application/x-www-form-urlencoded`
    const response = await axios({
      method: "POST",
      url: create_order_url,
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      data: new URLSearchParams(order).toString(),
    });

    console.log("📨 ZaloPay response:", response.data);

    if (response.data.return_code === 1) {
      return res.json({ order_url: response.data.order_url });
    } else {
      return res.status(400).json({
        message: "ZaloPay trả về lỗi",
        detail: response.data,
      });
    }
  } catch (err) {
    console.error("ZaloPay error:", err.response?.data || err.message);
    res.status(500).json({ message: "ZaloPay lỗi", error: err.message });
  }
};

module.exports = { createZaloOrder };
