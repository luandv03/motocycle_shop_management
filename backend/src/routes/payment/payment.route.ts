import { Router } from "express";
import moment from "moment";

import { PaymentController } from "../../controllers/payment/payment.controller";

const paymentRoutes: Router = Router();
const paymentController = new PaymentController();

// momo wallet
paymentRoutes.get(
    "/momo/create_payment_url",
    paymentController.createPaymentWithMomo
);

// momo pay url
paymentRoutes.get("/momo/return_url", paymentController.paymentWithMomoReturn);

// Kiểm tra trạng thái giao dịch MoMo
paymentRoutes.get(
    "/momo/check_status",
    paymentController.checkMomoTransactionStatus
);

export default paymentRoutes;
