const SubscriptionService = require("../services/subscriptionService");
const Responses = require("../helpers/response");

const createSubscription = async (req, res) => {
    try {
      console.log("🟢 Received Payload:", req.body);
  
      const result = await SubscriptionService.addSubs(req.body);
  
      if (result?.alreadyExit) {
        return Responses.failResponse(req, res, null, 'Subscription already exists!', 400);
      }
  
      if (result?.descRequired) {
        return Responses.failResponse(req, res, null, 'At least one description is required!', 400);
      }
  
      return Responses.successResponse(req, res, result, 'Subscription created successfully!', 201);
    } catch (error) {
      return res.status(500).json({ error: true, message: error.message });
    }
  };
  

const getSubscriptions = async (req, res) => {
    try {
      const subscriptions = await SubscriptionService.getSubscriptions();
  
      if (!subscriptions.length) {
        return Responses.failResponse(req, res, null, 'No subscriptions found', 404);
      }
  
      return Responses.successResponse(req, res, subscriptions, 'Subscriptions retrieved successfully', 200);
    } catch (error) {
      return res.status(500).json({ error: true, message: error.message });
    }
  };

// Controller function to activate a subscription
const activateSubscription = async (req, res) => {
  const { subscriptionId } = req.params;

  const subscription = await SubscriptionService.activateSubscriptionService(subscriptionId);

  res.status(200).json({
    success: true,
    message: "Subscription activated successfully",
    data: subscription,
  });
}

// Controller function to deactivate a subscription
const deactivateSubscription = async (req, res) => {
  const { subscriptionId } = req.params;

  const subscription = await SubscriptionService.deactivateSubscriptionService(subscriptionId);

  res.status(200).json({
    success: true,
    message: "Subscription deactivated successfully",
    data: subscription,
  });
}


  module.exports = {
    createSubscription,
    getSubscriptions,
    activateSubscription,
    deactivateSubscription
  }