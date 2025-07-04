const crypto = require('crypto');
const moment = require('moment');
const axios = require('axios');
const Order = require('../models/Order'); 
const { VNPay, ignoreLogger, ProductCode, VnpLocale, dateFormat } = require('vnpay');

const createZaloOrder = async (req, res) => {
    try {
        const { amount, orderId } = req.body;

        if (!amount || !orderId) {
            return res.status(400).json({ message: 'Thiếu orderId hoặc amount' });
        }

        const app_id = process.env.ZALO_APP_ID;
        const key1 = process.env.ZALO_KEY1;
        const create_order_url = process.env.ZALO_CREATE_ORDER_URL;

        const transID = Math.floor(Math.random() * 1000000);
        const embed_data = {};
        const items = [];

        const order = {
            app_id: app_id,
            app_trans_id: `${moment().format('YYMMDD')}_${transID}`,
            app_user: 'demo_user',
            app_time: Date.now(),
            amount: amount,
            item: JSON.stringify(items),
            description: `Thanh toán đơn hàng #${orderId}`,
            embed_data: JSON.stringify(embed_data),
            bank_code: '',
            callback_url: '', // Có thể để rỗng
        };

        // ✅ Tạo MAC
        const data =
            app_id +
            '|' +
            order.app_trans_id +
            '|' +
            order.app_user +
            '|' +
            order.amount +
            '|' +
            order.app_time +
            '|' +
            order.embed_data +
            '|' +
            order.item;

        order.mac = crypto.createHmac('sha256', key1).update(data).digest('hex');
        console.log('📤 Payload gửi lên ZaloPay:', order);

        // ✅ Gọi API ZaloPay bằng `application/x-www-form-urlencoded`
        const response = await axios({
            method: 'POST',
            url: create_order_url,
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            data: new URLSearchParams(order).toString(),
        });

        console.log('📨 ZaloPay response:', response.data);

        if (response.data.return_code === 1) {
            return res.json({ order_url: response.data.order_url });
        } else {
            return res.status(400).json({
                message: 'ZaloPay trả về lỗi',
                detail: response.data,
            });
        }
    } catch (err) {
        console.error('ZaloPay error:', err.response?.data || err.message);
        res.status(500).json({ message: 'ZaloPay lỗi', error: err.message });
    }
};

const createMomoOrder = async (req, res) => {
    const { amountOrder, idOrder } = req.body;

    if (!amountOrder || !idOrder) {
        return res.status(400).json({ message: 'Thiếu orderId hoặc amount' });
    }

    var accessKey = 'F8BBA842ECF85';
    var secretKey = 'K951B6PE1waDMi640xX08PD3vg6EkVlz';
    var orderInfo = `thanh toan ${idOrder}`;
    var partnerCode = 'MOMO';
var redirectUrl = 'http://localhost:5000/api/payment/momo/callback';
    var ipnUrl = 'http://localhost:5000/api/payment/momo/callback';
    var requestType = 'payWithMethod';
    var amount = amountOrder;
    var orderId = partnerCode + new Date().getTime();
    var requestId = orderId;
    var extraData = '';
    var paymentCode =
        'T8Qii53fAXyUftPV3m9ysyRhEanUs9KlOPfHgpMR0ON50U10Bh+vZdpJU7VY4z+Z2y77fJHkoDc69scwwzLuW5MzeUKTwPo3ZMaB29imm6YulqnWfTkgzqRaion+EuD7FN9wZ4aXE1+mRt0gHsU193y+yxtRgpmY7SDMU9hCKoQtYyHsfFR5FUAOAKMdw2fzQqpToei3rnaYvZuYaxolprm9+/+WIETnPUDlxCYOiw7vPeaaYQQH0BF0TxyU3zu36ODx980rJvPAgtJzH1gUrlxcSS1HQeQ9ZaVM1eOK/jl8KJm6ijOwErHGbgf/hVymUQG65rHU2MWz9U8QUjvDWA==';
    var orderGroupId = '';
    var autoCapture = true;
    var lang = 'vi';

    //before sign HMAC SHA256 with format
    //accessKey=$accessKey&amount=$amount&extraData=$extraData&ipnUrl=$ipnUrl&orderId=$orderId&orderInfo=$orderInfo&partnerCode=$partnerCode&redirectUrl=$redirectUrl&requestId=$requestId&requestType=$requestType
    var rawSignature =
        'accessKey=' +
        accessKey +
        '&amount=' +
        amount +
        '&extraData=' +
        extraData +
        '&ipnUrl=' +
        ipnUrl +
        '&orderId=' +
        orderId +
        '&orderInfo=' +
        orderInfo +
        '&partnerCode=' +
        partnerCode +
        '&redirectUrl=' +
        redirectUrl +
        '&requestId=' +
        requestId +
        '&requestType=' +
        requestType;
    //puts raw signature
    console.log('--------------------RAW SIGNATURE----------------');
    console.log(rawSignature);
    //signature
    const crypto = require('crypto');
    var signature = crypto.createHmac('sha256', secretKey).update(rawSignature).digest('hex');
    console.log('--------------------SIGNATURE----------------');
    console.log(signature);

    //json object send to MoMo endpoint
    const requestBody = JSON.stringify({
        partnerCode: partnerCode,
        partnerName: 'Test',
        storeId: 'MomoTestStore',
        requestId: requestId,
        amount: amount,
        orderId: orderId,
        orderInfo: orderInfo,
        redirectUrl: redirectUrl,
        ipnUrl: ipnUrl,
        lang: lang,
        requestType: requestType,
        autoCapture: autoCapture,
        extraData: extraData,
        orderGroupId: orderGroupId,
        signature: signature,
    });
    //Create the HTTPS objects
    const https = require('https');
    const options = {
        hostname: 'test-payment.momo.vn',
        port: 443,
        path: '/v2/gateway/api/create',
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Content-Length': Buffer.byteLength(requestBody),
        },
    };
    //Send the request and get the response
    const req2 = https.request(options, (res2) => {
        console.log(`Status: ${res2.statusCode}`);
        console.log(`Headers: ${JSON.stringify(res2.headers)}`);
res2.setEncoding('utf8');
        res2.on('data', (body) => {
            console.log('Body: ');
            console.log(body);
            console.log('resultCode: ');
            console.log(JSON.parse(body).resultCode);
            return res.status(200).json({
                status: 'success',
                payUrl: JSON.parse(body).payUrl,
                message: JSON.parse(body).message,
            });
        });
        res2.on('end', () => {
            console.log('No more data in response.');
        });
    });

    req2.on('error', (e) => {
        console.log(`problem with request: ${e.message}`);
    });
    // write data to request body
    console.log('Sending....');
    req2.write(requestBody);
    req2.end();
};


const createVNPAYOder = async (req, res) => {
    const { amountOrder, idOrder } = req.body;
    const vnpay = new VNPay({
        tmnCode: 'GULKO9FP',
        secureSecret: 'O9WTQBZVY5IT646J2GCM7AT9SGUHTPYF',
        vnpayHost: 'https://sandbox.vnpayment.vn',
        testMode: true, // tùy chọn
        hashAlgorithm: 'SHA512', // tùy chọn
        loggerFn: ignoreLogger, // tùy chọn
    });

    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const vnpayResponse = await vnpay.buildPaymentUrl({
        vnp_Amount: amountOrder, //
        vnp_IpAddr: '127.0.0.1', //
        vnp_TxnRef: `${idOrder}`, // Sử dụng paymentId thay vì singlePaymentId
        vnp_OrderInfo: `${idOrder} `,
        vnp_OrderType: ProductCode.Other,
        vnp_ReturnUrl: `http://localhost:5000/api/payment/vnpay/callback`, //
        vnp_Locale: VnpLocale.VN, // 'vn' hoặc 'en'
        vnp_CreateDate: dateFormat(new Date()), // tùy chọn, mặc định là hiện tại
        vnp_ExpireDate: dateFormat(tomorrow), // tùy chọn
    });
    return res.status(200).json({
        status: 'success',
        message: 'Tạo đơn hàng thành công',
        data: {
            vnpayUrl: vnpayResponse,
        },
    });
};

const callbackMomo = async (req, res) => {
    const { partnerCode, orderId, orderInfo, amount, transId, errorCode, message } = req.query;
};



const callbackVNPAY = async (req, res) => {
    const { vnp_ResponseCode, vnp_TxnRef } = req.query;
};


module.exports = { createZaloOrder, createMomoOrder, callbackMomo, createVNPAYOder, callbackVNPAY };