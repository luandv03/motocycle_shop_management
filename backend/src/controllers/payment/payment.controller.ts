import { Request, Response } from "express";
import https from "https";
import crypto from "crypto";
import axios from "axios";

import { Invoice } from "../../models/Invoice";
import { getSocketIO } from "../../config/socket";

// 🕰️ Lấy thời gian hiện tại
const now = new Date();

// 📆 Trích xuất thông tin
const hours = now.getHours().toString().padStart(2, "0");
const day = now.getDate().toString().padStart(2, "0");
const month = (now.getMonth() + 1).toString().padStart(2, "0"); // tháng bắt đầu từ 0
const year = now.getFullYear();

// 🧵 Tạo chuỗi định dạng: HH:MM - DD/MM/YYYY
const timeString = `${hours}${day}${month}${year}`;

export class PaymentController {
    // ############ MOMO ###########
    // ############ MOMO ###########
    async createPaymentWithMomo(
        request: Request,
        response: Response
    ): Promise<any> {
        try {
            const accessKey = "F8BBA842ECF85";
            const secretKey = "K951B6PE1waDMi640xX08PD3vg6EkVlz";
            const orderInfo = "pay with MoMo";
            const partnerCode = "MOMO";
            // const redirectUrl = "https://webhook.site/b3088a6a-2d17-4f8d-a383-71389a6c600b";
            const redirectUrl =
                "http://localhost:5000/api/payments/momo/return_url";
            const ipnUrl = redirectUrl;
            // "https://webhook.site/b3088a6a-2d17-4f8d-a383-71389a6c600b";
            const requestType = "payWithMethod";
            const amount = request.query.total_mount;
            const orderId = partnerCode + request.query.invoice_id + timeString;
            const requestId = orderId;
            const extraData = "";
            const paymentCode =
                "T8Qii53fAXyUftPV3m9ysyRhEanUs9KlOPfHgpMR0ON50U10Bh+vZdpJU7VY4z+Z2y77fJHkoDc69scwwzLuW5MzeUKTwPo3ZMaB29imm6YulqnWfTkgzqRaion+EuD7FN9wZ4aXE1+mRt0gHsU193y+yxtRgpmY7SDMU9hCKoQtYyHsfFR5FUAOAKMdw2fzQqpToei3rnaYvZuYaxolprm9+/+WIETnPUDlxCYOiw7vPeaaYQQH0BF0TxyU3zu36ODx980rJvPAgtJzH1gUrlxcSS1HQeQ9ZaVM1eOK/jl8KJm6ijOwErHGbgf/hVymUQG65rHU2MWz9U8QUjvDWA==";
            const orderGroupId = "";
            const autoCapture = true;
            const lang = "vi";

            //before sign HMAC SHA256 with format
            //accessKey=$accessKey&amount=$amount&extraData=$extraData&ipnUrl=$ipnUrl&orderId=$orderId&orderInfo=$orderInfo&partnerCode=$partnerCode&redirectUrl=$redirectUrl&requestId=$requestId&requestType=$requestType
            const rawSignature =
                "accessKey=" +
                accessKey +
                "&amount=" +
                amount +
                "&extraData=" +
                extraData +
                "&ipnUrl=" +
                ipnUrl +
                "&orderId=" +
                orderId +
                "&orderInfo=" +
                orderInfo +
                "&partnerCode=" +
                partnerCode +
                "&redirectUrl=" +
                redirectUrl +
                "&requestId=" +
                requestId +
                "&requestType=" +
                requestType;
            //puts raw signature

            var signature = crypto
                .createHmac("sha256", secretKey)
                .update(rawSignature)
                .digest("hex");

            //json object send to MoMo endpoint
            const requestBody = JSON.stringify({
                partnerCode: partnerCode,
                partnerName: "Test",
                storeId: "MomoTestStore",
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

            const options = {
                hostname: "test-payment.momo.vn",
                port: 443,
                path: "/v2/gateway/api/create",
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Content-Length": Buffer.byteLength(requestBody),
                },
            };

            //Send the request and get the response
            const req = https.request(options, (res) => {
                res.setEncoding("utf8");
                res.on("data", (body) => {
                    const da = JSON.parse(body);

                    console.log("Response body: ", da);

                    const url = new URL(da.payUrl);
                    const sid = url.searchParams.get("t");

                    if (!sid) {
                        throw new Error("SID (t param) not found in payUrl");
                    }

                    const qrCode = `momo://app?action=payWithApp&isScanQR=true&serviceType=qr&sid=${encodeURIComponent(
                        sid
                    )}&v=3.0`;

                    console.log("QR Code: ", qrCode);

                    console.log("Response: ", da);

                    response.status(200).json({
                        statusCode: 200,
                        message: "SUCCESS",
                        data: qrCode,
                    });

                    // response.redirect(da.payUrl);
                });
                res.on("end", () => {
                    console.log("No more data in response.");
                });
            });

            req.on("error", (e) => {
                console.log(`problem with request: ${e.message}`);
            });

            req.write(requestBody);
            req.end("Request end!");
        } catch (error) {
            response.status(500).json({
                statusCode: 500,
                message: "INTERNAL_ERROR_SERVER",
                error,
            });
        }
    }

    async paymentWithMomoReturn(req: Request, res: Response): Promise<any> {
        try {
            const {
                partnerCode,
                orderId,
                requestId,
                amount,
                orderType,
                transId,
                resultCode,
                message,
                payType,
                signature,
            } = req.query;
            // save into db

            // Extract the actual invoice ID from orderId (remove MOMO prefix)
            const invoiceId =
                typeof orderId === "string"
                    ? orderId.replace(/^MOMO/, "")
                    : undefined;

            console.log("Invoice ID: ", invoiceId);
            // Tìm hóa đơn có id là orderId
            const invoice = invoiceId
                ? await Invoice.findByPk(invoiceId)
                : null;

            console.log("Invoice ID: ", invoiceId);
            console.log("Result Code: ", resultCode);

            if (!invoice) {
                // Emit payment failure event via Socket.IO
                const io = getSocketIO();
                io.emit("payment_status", {
                    success: false,
                    invoiceId: invoiceId,
                    message: "Invoice not found",
                });

                return res.status(404).json({
                    statusCode: 404,
                    message: "Invoice not found",
                });
            }

            // Cập nhật trạng thái hóa đơn thành "Đã thanh toán"
            if (resultCode === "0") {
                invoice.status = "Đã thanh toán";
                await invoice.save();

                // Emit payment success event via Socket.IO
                const io = getSocketIO();
                io.emit("payment_status", {
                    success: true,
                    invoiceId: invoiceId,
                    message: "Payment successful",
                    transId: transId,
                });

                console.log("Payment successful");
            } else {
                // Emit payment failure event via Socket.IO
                const io = getSocketIO();
                io.emit("payment_status", {
                    success: false,
                    invoiceId: invoiceId,
                    message: message || "Payment failed",
                    resultCode: resultCode,
                });

                console.log("Payment failed");
            }

            res.status(200).json({
                statusCode: 200,
                message: "Success",
            });
        } catch (error) {
            // Emit payment error event via Socket.IO
            const io = getSocketIO();
            io.emit("payment_status", {
                success: false,
                message: "Server error during payment processing",
                error: error instanceof Error ? error.message : "Unknown error",
            });

            res.status(500).json({
                statusCode: 500,
                message: "INTERNAL_ERROR_SERVER",
                error,
            });
        }
    }

    // Kiểm tra trạng thái giao dịch của MoMo
    async checkMomoTransactionStatus(
        req: Request,
        res: Response
    ): Promise<any> {
        try {
            // Lấy thông tin từ query params
            const { invoice_id } = req.query;

            if (!invoice_id) {
                return res.status(400).json({
                    statusCode: 400,
                    message: "Missing invoice_id parameter",
                });
            }

            // Tìm hóa đơn trong cơ sở dữ liệu
            const invoice = await Invoice.findByPk(invoice_id as string);
            if (!invoice) {
                return res.status(404).json({
                    statusCode: 404,
                    message: "Invoice not found",
                });
            }

            // 🧾 Thông tin cố định
            const accessKey = "F8BBA842ECF85";
            const secretKey = "K951B6PE1waDMi640xX08PD3vg6EkVlz";
            const partnerCode = "MOMO";

            // 🎯 Thông tin giao dịch cần check
            const requestId = `CHECK_${Date.now()}`; // unique request id for each check
            const orderId = partnerCode + invoice_id + timeString; // phải trùng khi tạo giao dịch

            // ✍️ Tạo raw signature
            const rawSignature = `accessKey=${accessKey}&orderId=${orderId}&partnerCode=${partnerCode}&requestId=${requestId}`;
            const signature = crypto
                .createHmac("sha256", secretKey)
                .update(rawSignature)
                .digest("hex");

            // 🚀 Gọi API kiểm tra trạng thái
            const payload = {
                partnerCode,
                requestId,
                orderId,
                lang: "vi",
                signature,
            };

            console.log(
                "Checking MoMo transaction status for invoice:",
                invoice_id
            );
            console.log("With payload:", payload);

            const response = await axios.post(
                "https://test-payment.momo.vn/v2/gateway/api/query",
                payload,
                {
                    headers: { "Content-Type": "application/json" },
                }
            );

            console.log("✅ Transaction result:", response.data);

            // Xử lý kết quả và gửi phản hồi
            if (response.data.resultCode === 0) {
                // Nếu giao dịch thành công và hóa đơn chưa được cập nhật
                if (invoice.status !== "Đã thanh toán") {
                    // Cập nhật trạng thái hóa đơn
                    invoice.status = "Đã thanh toán";
                    await invoice.save();

                    // Thông báo qua Socket.IO
                    const io = getSocketIO();
                    io.emit("payment_status", {
                        success: true,
                        invoiceId: invoice_id,
                        message: "Payment successful (verified by check)",
                        transId: response.data.transId || response.data.orderId,
                    });
                }

                return res.status(200).json({
                    statusCode: 200,
                    message: "Transaction successful",
                    data: response.data,
                    paid: true,
                    invoice_status: invoice.status,
                });
            } else {
                return res.status(200).json({
                    statusCode: 200,
                    message: "Transaction not completed or failed",
                    data: response.data,
                    paid: false,
                    invoice_status: invoice.status,
                });
            }
        } catch (error) {
            console.error("❌ Error checking transaction:", error);
            return res.status(500).json({
                statusCode: 500,
                message: "Error checking transaction status",
                error: error instanceof Error ? error.message : "Unknown error",
            });
        }
    }
}
