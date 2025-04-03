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

// Route to manage subscription (add or update)
router.post('/manage-subscription', subsController.manageSubscription);

// Route to get the active subscription for a given type
router.get('/get-active-subscription', subsController.getActiveSubscription);

router.post('/register', subsController.clientRegistration);


module.exports = router;