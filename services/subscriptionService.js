const Subscription = require("../models/subscriptionModel");

const addSubs = async (data) => {
    console.log("🟢 Received in addSubs:", data);

    if (!data?.subscriptions || !Array.isArray(data.subscriptions) || data.subscriptions.length === 0) {
        return { descRequired: true };
    }

    const savedSubscriptions = [];

    for (const sub of data.subscriptions) {
        if (!sub?.name?.trim() || !sub?.description?.trim()) {
            return { message: "Name and description are required for all subscriptions!" };
        }

        const existingSub = await Subscription.findOne({ name: sub.name });
        if (existingSub) {
            return { alreadyExit: true };
        }

        const newSub = new Subscription({
            name: sub.name.trim(),
            description: sub.description.trim(),
        });

        const result = await newSub.save();
        savedSubscriptions.push(result);
    }

    return savedSubscriptions;  
};

const getSubscriptions = async() => {
    const subscriptions = await Subscription.find();
    return subscriptions
}

// Service function to activate a subscription
const activateSubscriptionService = async (subscriptionId) => {
    const subscription = await Subscription.findById(subscriptionId);
  
    if (!subscription) {
      throw new Error("Subscription not found");
    }
  
    if (subscription.isActive) {
      throw new Error("Subscription is already active");
    }
  
    subscription.isActive = true;
    return await subscription.save();
  };
  
  // Service function to deactivate a subscription
  const deactivateSubscriptionService = async (subscriptionId) => {
    const subscription = await Subscription.findById(subscriptionId);
  
    if (!subscription) {
      throw new Error("Subscription not found");
    }
  
    if (!subscription.isActive) {
      throw new Error("Subscription is already inactive");
    }
  
    subscription.isActive = false;
    return await subscription.save();
  };

module.exports = {
    addSubs,
    getSubscriptions,
    activateSubscriptionService,
    deactivateSubscriptionService
};
