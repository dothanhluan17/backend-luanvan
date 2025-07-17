const crypto = require('crypto');
const moment = require('moment');
const axios = require('axios');
const Order = require('../models/Order'); 
const { VNPay, ignoreLogger, ProductCode, VnpLocale, dateFormat } = require('vnpay');


// const createMomoOrder = async (req, res) => {
//     const { amountOrder, idOrder } = req.body;

//     if (!amountOrder || !idOrder) {
//         return res.status(400).json({ message: 'Thiếu orderId hoặc amount' });
//     }

//     var accessKey = 'F8BBA842ECF85';
//     var secretKey = 'K951B6PE1waDMi640xX08PD3vg6EkVlz';
//     var orderInfo = `thanh toan ${idOrder}`;
//     var partnerCode = 'MOMO';
// var redirectUrl = 'http://localhost:5000/api/payment/momo/callback';
//     var ipnUrl = 'http://localhost:5000/api/payment/momo/callback';
//     var requestType = 'payWithMethod';
//     var amount = amountOrder;
//     var orderId = partnerCode + new Date().getTime();
//     var requestId = orderId;
//     var extraData = '';
//     var paymentCode =
//         'T8Qii53fAXyUftPV3m9ysyRhEanUs9KlOPfHgpMR0ON50U10Bh+vZdpJU7VY4z+Z2y77fJHkoDc69scwwzLuW5MzeUKTwPo3ZMaB29imm6YulqnWfTkgzqRaion+EuD7FN9wZ4aXE1+mRt0gHsU193y+yxtRgpmY7SDMU9hCKoQtYyHsfFR5FUAOAKMdw2fzQqpToei3rnaYvZuYaxolprm9+/+WIETnPUDlxCYOiw7vPeaaYQQH0BF0TxyU3zu36ODx980rJvPAgtJzH1gUrlxcSS1HQeQ9ZaVM1eOK/jl8KJm6ijOwErHGbgf/hVymUQG65rHU2MWz9U8QUjvDWA==';
//     var orderGroupId = '';
//     var autoCapture = true;
//     var lang = 'vi';

//     //before sign HMAC SHA256 with format
//     //accessKey=$accessKey&amount=$amount&extraData=$extraData&ipnUrl=$ipnUrl&orderId=$orderId&orderInfo=$orderInfo&partnerCode=$partnerCode&redirectUrl=$redirectUrl&requestId=$requestId&requestType=$requestType
//     var rawSignature =
//         'accessKey=' +
//         accessKey +
//         '&amount=' +
//         amount +
//         '&extraData=' +
//         extraData +
//         '&ipnUrl=' +
//         ipnUrl +
//         '&orderId=' +
//         orderId +
//         '&orderInfo=' +
//         orderInfo +
//         '&partnerCode=' +
//         partnerCode +
//         '&redirectUrl=' +
//         redirectUrl +
//         '&requestId=' +
//         requestId +
//         '&requestType=' +
//         requestType;
//     //puts raw signature
//     console.log('--------------------RAW SIGNATURE----------------');
//     console.log(rawSignature);
//     //signature
//     const crypto = require('crypto');
//     var signature = crypto.createHmac('sha256', secretKey).update(rawSignature).digest('hex');
//     console.log('--------------------SIGNATURE----------------');
//     console.log(signature);

//     //json object send to MoMo endpoint
//     const requestBody = JSON.stringify({
//         partnerCode: partnerCode,
//         partnerName: 'Test',
//         storeId: 'MomoTestStore',
//         requestId: requestId,
//         amount: amount,
//         orderId: orderId,
//         orderInfo: orderInfo,
//         redirectUrl: redirectUrl,
//         ipnUrl: ipnUrl,
//         lang: lang,
//         requestType: requestType,
//         autoCapture: autoCapture,
//         extraData: extraData,
//         orderGroupId: orderGroupId,
//         signature: signature,
//     });
//     //Create the HTTPS objects
//     const https = require('https');
//     const options = {
//         hostname: 'test-payment.momo.vn',
//         port: 443,
//         path: '/v2/gateway/api/create',
//         method: 'POST',
//         headers: {
//             'Content-Type': 'application/json',
//             'Content-Length': Buffer.byteLength(requestBody),
//         },
//     };
//     //Send the request and get the response
//     const req2 = https.request(options, (res2) => {
//         console.log(`Status: ${res2.statusCode}`);
//         console.log(`Headers: ${JSON.stringify(res2.headers)}`);
// res2.setEncoding('utf8');
//         res2.on('data', (body) => {
//             console.log('Body: ');
//             console.log(body);
//             console.log('resultCode: ');
//             console.log(JSON.parse(body).resultCode);
//             return res.status(200).json({
//                 status: 'success',
//                 payUrl: JSON.parse(body).payUrl,
//                 message: JSON.parse(body).message,
//             });
//         });
//         res2.on('end', () => {
//             console.log('No more data in response.');
//         });
//     });

//     req2.on('error', (e) => {
//         console.log(`problem with request: ${e.message}`);
//     });
//     // write data to request body
//     console.log('Sending....');
//     req2.write(requestBody);
//     req2.end();
// };
const createMomoOrder = async (req, res) => {
    const { amountOrder, idOrder } = req.body;

    if (!amountOrder || !idOrder) {
        return res.status(400).json({ message: 'Thiếu orderId hoặc amount' });
    }

    var accessKey = 'F8BBA842ECF85';
    var secretKey = 'K951B6PE1waDMi640xX08PD3vg6EkVlz';
    var orderInfo = idOrder; // Sử dụng idOrder làm orderInfo
    var partnerCode = 'MOMO';
    var redirectUrl = 'http://localhost:5000/api/payment/momo/callback';
    var ipnUrl = 'http://localhost:5000/api/payment/momo/callback';
    var requestType = 'payWithMethod';
    var amount = amountOrder;
    var orderId = idOrder; // SỬA: dùng đúng orderId của đơn hàng
    var requestId = orderId;
    var extraData = '';
    var paymentCode = '...'; // giữ nguyên
    var orderGroupId = '';
    var autoCapture = true;
    var lang = 'vi';

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

    const crypto = require('crypto');
    var signature = crypto.createHmac('sha256', secretKey).update(rawSignature).digest('hex');

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

    const req2 = https.request(options, (res2) => {
        res2.setEncoding('utf8');
        res2.on('data', (body) => {
            return res.status(200).json({
                status: 'success',
                payUrl: JSON.parse(body).payUrl,
                message: JSON.parse(body).message,
            });
        });
    });

    req2.on('error', (e) => {
        console.log(`problem with request: ${e.message}`);
    });

    req2.write(requestBody);
    req2.end();
};

// const createVNPAYOder = async (req, res) => {
//     const { amountOrder, idOrder } = req.body;
//     const vnpay = new VNPay({
//         tmnCode: 'GULKO9FP',
//         secureSecret: 'O9WTQBZVY5IT646J2GCM7AT9SGUHTPYF',
//         vnpayHost: 'https://sandbox.vnpayment.vn',
//         testMode: true, // tùy chọn
//         hashAlgorithm: 'SHA512', // tùy chọn
//         loggerFn: ignoreLogger, // tùy chọn
//     });

//     const tomorrow = new Date();
//     tomorrow.setDate(tomorrow.getDate() + 1);
//     const vnpayResponse = await vnpay.buildPaymentUrl({
//         vnp_Amount: amountOrder, //
//         vnp_IpAddr: '127.0.0.1', //
//         vnp_TxnRef: `${idOrder}`, // Sử dụng paymentId thay vì singlePaymentId
//         vnp_OrderInfo: `${idOrder} `,
//         vnp_OrderType: ProductCode.Other,
//         vnp_ReturnUrl: `http://localhost:5000/api/payment/vnpay/callback`, //
//         vnp_Locale: VnpLocale.VN, // 'vn' hoặc 'en'
//         vnp_CreateDate: dateFormat(new Date()), // tùy chọn, mặc định là hiện tại
//         vnp_ExpireDate: dateFormat(tomorrow), // tùy chọn
//     });
//     return res.status(200).json({
//         status: 'success',
//         message: 'Tạo đơn hàng thành công',
//         data: {
//             vnpayUrl: vnpayResponse,
//         },
//     });
// };

// const callbackMomo = async (req, res) => {
//     const { partnerCode, orderId, orderInfo, amount, transId, errorCode, message } = req.query;
//     console.log('--- MoMo Callback ---');
//     console.log('orderInfo:', orderInfo);
// };
const createVNPAYOder = async (req, res) => {
    const { amountOrder, idOrder } = req.body;
    const vnpay = new VNPay({
        tmnCode: 'GULKO9FP',
        secureSecret: 'O9WTQBZVY5IT646J2GCM7AT9SGUHTPYF',
        vnpayHost: 'https://sandbox.vnpayment.vn',
        testMode: true,
        hashAlgorithm: 'SHA512',
        loggerFn: ignoreLogger,
    });

    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const vnpayResponse = await vnpay.buildPaymentUrl({
        vnp_Amount: amountOrder,
        vnp_IpAddr: '127.0.0.1',
        vnp_TxnRef: `${idOrder}`, // orderId của đơn hàng
        vnp_OrderInfo: `${idOrder}`,
        vnp_OrderType: ProductCode.Other,
        vnp_ReturnUrl: `http://localhost:5000/api/payment/vnpay/callback`,
        vnp_Locale: VnpLocale.VN,
        vnp_CreateDate: dateFormat(new Date()),
        vnp_ExpireDate: dateFormat(tomorrow),
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
    const { orderId, errorCode, resultCode } = req.query;
    console.log('--- MoMo Callback ---');
    console.log('orderId nhận được:', orderId);
    console.log('errorCode nhận được:', errorCode);
    console.log('resultCode nhận được:', resultCode);

    // Sử dụng resultCode nếu errorCode không có
    const isSuccess = errorCode === '0' || resultCode === '0';

    try {
        if (isSuccess) {
            const updatedOrder = await Order.findOneAndUpdate(
                { orderId: orderId },
                { isPaid: true, paidAt: new Date(), status: 'confirmed' },
                { new: true }
            );
            console.log('Kết quả cập nhật đơn hàng:', updatedOrder);

            if (updatedOrder) {
                return res.redirect(`http://localhost:5173/Confirmation?orderId=${updatedOrder.orderId}`);
            } else {
                console.log('Không tìm thấy đơn hàng với orderId:', orderId);
                return res.status(404).json({ message: 'Không tìm thấy đơn hàng' });
            }
        } else {
            console.log('Giao dịch MoMo thất bại với errorCode/resultCode:', errorCode, resultCode);
            return res.redirect(`http://localhost:5173/checkout?payment=failed`);
        }
    } catch (error) {
        console.error('Lỗi server momo callback:', error);
        return res.status(500).json({ message: 'Lỗi server momo callback' });
    }
};


// const callbackVNPAY = async (req, res) => {
//     const { vnp_ResponseCode, vnp_TxnRef } = req.query;
//     console.log('--- VNPAY Callback ---');
//     console.log('vnp_TxnRef:', vnp_TxnRef);
// };
const callbackVNPAY = async (req, res) => {
    const { vnp_ResponseCode, vnp_TxnRef } = req.query;
    console.log('--- VNPAY Callback ---');
    console.log('vnp_TxnRef:', vnp_TxnRef);
    console.log('vnp_ResponseCode:', vnp_ResponseCode);

    try {
        if (vnp_ResponseCode === '00') {
            const updatedOrder = await Order.findOneAndUpdate(
                { orderId: vnp_TxnRef },
                { isPaid: true, paidAt: new Date(), status: 'confirmed' },
                { new: true }
            );
            console.log('Kết quả cập nhật đơn hàng:', updatedOrder);

            if (updatedOrder) {
                return res.redirect(`http://localhost:5173/confirmation?orderId=${updatedOrder.orderId}`);
            } else {
                console.log('Không tìm thấy đơn hàng với orderId:', vnp_TxnRef);
                return res.status(404).json({ message: 'Không tìm thấy đơn hàng' });
            }
        } else {
            console.log('Giao dịch VNPAY thất bại với vnp_ResponseCode:', vnp_ResponseCode);
            return res.redirect(`http://localhost:5173/checkout?payment=failed`);
        }
    } catch (error) {
        console.error('Lỗi server vnpay callback:', error);
        return res.status(500).json({ message: 'Lỗi server vnpay callback' });
    }
};


module.exports = {createMomoOrder, callbackMomo, createVNPAYOder, callbackVNPAY };