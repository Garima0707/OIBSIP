const Payment = require("../models/Payment");

const getPaymentStats = async (req, res) => {
  try {
    const payments = await Payment.find();

    const stats = {
      total: payments.length,
      success: payments.filter(p => p.status === "success").length,
      failed: payments.filter(p => p.status === "failed").length,
      revenue: payments
        .filter(p => p.status === "success")
        .reduce((sum, p) => sum + p.amount, 0),
    };

    res.status(200).json({ stats, payments });
  } catch (err) {
    console.error("Error getting payment stats:", err);
    res.status(500).json({ error: "Internal server error" });
  }
};
module.exports = { getPaymentStats };
