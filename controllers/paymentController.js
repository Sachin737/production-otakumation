import braintree from "braintree";
import orderModel from "../models/orderModel.js";
import dotenv from "dotenv";

dotenv.config();

// BRAINTREE PAYMENT GATEWAY
var gateway = new braintree.BraintreeGateway({
  environment: braintree.Environment.Sandbox,
  merchantId: process.env.BRAINTREE_MERCHANT_ID,
  publicKey: process.env.BRAINTREE_PUBLIC_KEY,
  privateKey: process.env.BRAINTREE_PRIVATE_KEY,
});

// gen token
const generateTokenController = async (req, res) => {
  try {
    await gateway.clientToken.generate({}, (error, response) => {
      if (error) {
        res.status(500).send({
          success: false,
          error,
        });
      } else {
        res.status(200).send({
          success: true,
          response,
        });
      }
    });
  } catch (err) {
    console.log(err);
    res.status(500).send({
      success: false,
      message: "Error in generating braintree token",
      err,
    });
  }
};

//  payments
const btPaymentController = async (req, res) => {
  try {
    const { cart, nonce } = req.body;

    let totalPrice = 0;
    cart.map((el) => {
      totalPrice += el.price;
    });

    let Transaction = gateway.transaction.sale(
      {
        amount: totalPrice,
        paymentMethodNonce: nonce,
        options: {
          submitForSettlement: true,
        },
      },

      function (error, result) {
        if (result) {
          const myOrder = new orderModel({
            products: cart,
            buyer: req.user._id,
            payment: result,
          }).save();
          res.json({ ok: true });
        } else {
          res.status(500).send(error);
        }
      }
    );
  } catch (err) {
    console.log(err);
    res.status(500).send({
      success: false,
      message: "Error in completing payment",
      err,
    });
  }
};

export { generateTokenController, btPaymentController };
