const express = require("express");
const router = express.Router();
const subsController = require("../controllers/subscriptionController");

// admin can create coupon
router.post(
  "/add-subs",
  subsController.createSubscription
);
router.get('/subscriptions', subsController.getSubscriptions);

// Route to activate a subscription
router.put("/activate/:subscriptionId", subsController.activateSubscription);

// Route to deactivate a subscription
router.put("/deactivate/:subscriptionId", subsController.deactivateSubscription);

module.exports = router;