const SubscriptionService = require("../services/subscriptionService");
const Responses = require("../helpers/response");

const createSubscription = async (req, res) => {
  try {
      console.log("Received Payload:", req.body);

      const result = await SubscriptionService.addSubs(req.body);

      if (result?.alreadyExists) {
          return Responses.failResponse(req, res, null, 'Subscription name already exists!', 400);
      }

      if (result?.descRequired) {
          return Responses.failResponse(req, res, null, 'At least one description is required!', 400);
      }

      if (result?.message) {
          return Responses.failResponse(req, res, null, result.message, 400);
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


// API to Add/Manage Subscription
const manageSubscription = async (req, res) => {
  try {
    const { name, effectFromDate, sellingPrice, discountPrice, maxUser, validityInDays } = req.body;
    
    // Call the service to manage the subscription
    const newSubscription = await SubscriptionService.manageSubscription({
      name,
      effectFromDate,
      sellingPrice,
      discountPrice,
      maxUser,
      validityInDays
    });

    return res.status(200).json({ success: true, message: 'Subscription added successfully', data: newSubscription });
  } catch (error) {
    console.error(error);
    return res.status(400).json({ error: true, message: error.message });
  }
};

// API to get the nearest active subscription for a given subscription type
const getActiveSubscription = async (req, res) => {
  try {
    const { subscriptionType } = req.query;

    // Call the service to get the active subscription
    const activeSubscription = await SubscriptionService.getActiveSubscription(subscriptionType);

    return res.status(200).json({ success: true, data: activeSubscription });
  } catch (error) {
    console.error(error);
    return res.status(400).json({ error: true, message: error.message });
  }
};


const clientRegistration = async (req, res) => {
  try {
    const { name, email, subscriptionName, code } = req.body;

    // Validate required fields
    if (!name || !email || !subscriptionName) {
      return res.status(400).json({ error: true, message: 'Name, Email, and Subscription Type are required' });
    }

    // Call service function
    const newClient = await SubscriptionService.clientRegistration({ name, email, subscriptionName, code });

    return res.status(201).json({ success: true, message: 'Client registered successfully', data: newClient });
  } catch (error) {
    console.error(error);
    return res.status(400).json({ error: true, message: error.message });
  }
};



  module.exports = {
    createSubscription,
    getSubscriptions,
    activateSubscription,
    deactivateSubscription,
    getActiveSubscription,
    manageSubscription,
    clientRegistration
  }