const Subscription = require("../models/subscriptionModel");
const moment = require('moment');
const SubscriptionPlan = require('../models/subscriptionPlanModel');
const Client = require('../models/userModel');
const Coupon = require('../models/couponModel');



const addSubs = async (data) => {
  console.log("Received in addSubs:", data);

  if (
    !data?.subscriptions ||
    !Array.isArray(data.subscriptions) ||
    data.subscriptions.length === 0
  ) {
    return { descRequired: true };
  }

  const groupedSubscriptions = {};

  for (const sub of data.subscriptions) {
    if (!sub?.name?.trim() || !sub?.description?.trim() || !sub?.id) {
      return {
        message:
          "Name, description, and id are required for all subscriptions!",
      };
    }

    const subName = sub.name.trim();
    const subDescription = {
      id: sub.id,
      description: sub.description.trim(),
    };

    if (!groupedSubscriptions[subName]) {
      groupedSubscriptions[subName] = [];
    }
    groupedSubscriptions[subName].push(subDescription);
  }

  const savedSubscriptions = [];

  for (const name in groupedSubscriptions) {
    const descriptions = groupedSubscriptions[name];

    if (descriptions.length === 0) {
      return {
        message: `Subscription '${name}' must have at least one description!`,
      };
    }
    const existingSub = await Subscription.findOne({ name });

    if (existingSub) {
      return { alreadyExists: true };
    }
    const newSub = new Subscription({
      name,
      descriptions,
    });

    const result = await newSub.save();
    savedSubscriptions.push(result);
  }
  return savedSubscriptions;
};

const getSubscriptions = async () => {
  const subscriptions = await Subscription.find();
  return subscriptions;
};

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



// Utility function to calculate nearest effect date for a subscription type
const getNearestEffectDate = async (name) => {
  const today = moment().startOf('day');
  const subscriptions = await Subscription.find({ name }).sort({ effectFromDate: 1 });

  if (subscriptions.length === 0) return null;

  // Loop through subscriptions and find the nearest effectFromDate
  let nearestSubscription = null;
  for (let subscription of subscriptions) {
    const effectFromDate = moment(subscription.effectFromDate);
    if (effectFromDate.isSameOrAfter(today)) {
      nearestSubscription = subscription;
      break;
    }
  }

  return nearestSubscription;
};

// Service to manage subscription
const manageSubscription = async ({ name, effectFromDate, sellingPrice, discountPrice, maxUser, validityInDays }) => {
  const today = moment().startOf('day');
  const effectFrom = moment(effectFromDate).startOf('day');

  sellingPrice = parseFloat(sellingPrice);
discountPrice = parseFloat(discountPrice);

  // Validation: Selling price should be less than discount price
  if (sellingPrice >= discountPrice) {
    throw new Error('Selling price should be less than discount price');
  }

  // Validation: Check if a subscription already exists with the same effectFromDate
  const existingSubscription = await Subscription.findOne({ 
    name,
    effectFromDate: { $gte: today } 
  });

  if (name) {
    throw new Error('A subscription with this effectFromDate already exists');
  }

  // Validation: Only one record should be active at a time for the subscription type
  const activeSubscription = await getNearestEffectDate(name);
  if (activeSubscription) {
    const existingEffectFrom = moment(activeSubscription.effectFromDate).format('YYYY-MM-DD');
    if (effectFrom.isSameOrBefore(today)) {
      throw new Error(`Subscription for ${name} already exists with effect from ${existingEffectFrom}`);
    }
  }

  // Save new subscription
  const newSubscription = new Subscription({
    name,
    effectFromDate: effectFromDate,
    sellingPrice,
    discountPrice,
    maxUser,
    validityInDays
  });

  await newSubscription.save();
  return newSubscription;
};

// Service to get the nearest active subscription for a given subscription type
const getActiveSubscription = async (name) => {
  const activeSubscription = await getNearestEffectDate(name);
  if (!activeSubscription) {
    throw new Error('No active subscription found for this type');
  }

  return activeSubscription;
};



const clientRegistration = async ({ name, email, subscriptionName, code }) => {
  // Check if email already exists
  const existingClient = await Client.findOne({ email });
  if (existingClient) {
    throw new Error('Email already registered');
  }

  // Fetch subscription details
  const subscription = await Subscription.findOne({ name: subscriptionName });
  if (!subscription) {
    throw new Error('Invalid subscription type');
  }

  let finalPrice = subscription.sellingPrice; // Default price
  let appliedCoupon = null;

  // If a coupon is provided, validate and apply it
  if (code) {
    const coupon = await Coupon.findOne({ code: code });

    if (!coupon) {
      throw new Error('Invalid coupon code');
    }

    // Check if the coupon is expired
    const now = new Date();
    if (now < coupon.startsFrom || now > coupon.endsOn) {
      throw new Error('Coupon has expired');
    }

    // Calculate discount based on coupon type
    let discountAmount = 0;
    if (coupon.type === 'flat') {
      discountAmount -= coupon.value;
    } else if (coupon.type === 'percentage') {
      discountAmount = (subscription.sellingPrice * coupon.value) / 100;
    }

    // Ensure discount doesn't exceed the selling price
    discountAmount = Math.min(discountAmount, subscription.sellingPrice);

    // Calculate final price after applying discount
    finalPrice = subscription.sellingPrice - discountAmount;

    appliedCoupon = {
      code: code,
      discountAmount,
      appliedOn: now
    };
  }

  // Save new client
  const newClient = new Client({
    name,
    email,
    subscriptionType: subscriptionName,
    price: finalPrice, // Store final price (discounted or original)
    appliedCoupon: appliedCoupon || undefined // Store only if coupon applied
  });

  await newClient.save();
  return newClient;
};


employee registration
const Employee = require('..modelsEmployee');
const Client = require('..modelsClient');
const Subscription = require('..modelsSubscription');

const addEmployee = async ({ clientEmail, empName, empEmail, mobileNumber, bloodGroup, empCode }) = {
   Fetch client by email
  const client = await Client.findOne({ email clientEmail });
  if (!client) {
    throw new Error('Client not found');
  }

   Validate subscription existence and expiry
  const subscription = await Subscription.findOne({ name client.subscriptionType });
  if (!subscription) {
    throw new Error('Subscription not found');
  }

  const now = new Date();
  if (now  subscription.endsOn) {
    throw new Error('Subscription has expired');
  }

   Calculate remaining subscription days
  const remainingDays = Math.ceil((subscription.endsOn - now)  (1000  60  60  24));

   Check the number of employees added
  const employeeCount = await Employee.countDocuments({ clientEmail });
  if (employeeCount = subscription.maxUsers) {
    throw new Error(`You can add up to ${subscription.maxUsers} employees only.`);
  }

   Validate email format
  const emailRegex = ^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+.[a-zA-Z]{2,}$;
  if (!emailRegex.test(empEmail)) {
    throw new Error('Invalid email format');
  }

   Validate mobile number format (10 digits)
  const mobileRegex = ^d{10}$;
  if (!mobileRegex.test(mobileNumber)) {
    throw new Error('Mobile number must be 10 digits');
  }

   Check if email or mobile number is already associated
  const existingEmployeeWithEmail = await Employee.findOne({ empEmail });
  const existingEmployeeWithMobile = await Employee.findOne({ mobileNumber });

  if (existingEmployeeWithEmail && existingEmployeeWithEmail.mobileNumber !== mobileNumber) {
    throw new Error('This email is associated with another mobile number.');
  }

  if (existingEmployeeWithMobile && existingEmployeeWithMobile.empEmail !== empEmail) {
    throw new Error('This mobile number is associated with another email.');
  }

   Create new employee
  const newEmployee = new Employee({
    clientEmail,
    empName,
    empEmail,
    mobileNumber,
    bloodGroup,
    empCode
  });

  await newEmployee.save();
  return { newEmployee, subscriptionName subscription.name, remainingDays };
};


const employeeService = require('..servicesemployeeService');

const addEmployee = async (req, res) = {
  try {
     Fetch client email from localStorage (Assuming frontend sends it in the request)
    const clientEmail = req.body.clientEmail;
    if (!clientEmail) {
      return res.status(400).json({ error true, message 'Client email is required' });
    }

    const { empName, empEmail, mobileNumber, bloodGroup, empCode } = req.body;

     Validate required fields
    if (!empName  !empEmail  !mobileNumber  !bloodGroup  !empCode) {
      return res.status(400).json({ error true, message 'All fields are required' });
    }

     Call service function
    const { newEmployee, subscriptionName, remainingDays } = await employeeService.addEmployee({
      clientEmail,
      empName,
      empEmail,
      mobileNumber,
      bloodGroup,
      empCode
    });

    return res.status(201).json({
      success true,
      message 'Employee added successfully',
      data {
        newEmployee,
        subscriptionName,
        remainingDays
      }
    });
  } catch (error) {
    console.error(error);
    return res.status(400).json({ error true, message error.message });
  }
};

module.exports = { addEmployee };

 Route to add an employee
router.post('add-employee', employeeController.addEmployee);



 remaiing days
const SubscriptionPlan = require('..modelsSubscriptionPlan');
const Client = require('..modelsClient');

const getRemainingSubscriptionDays = async (clientEmail) = {
   Find client by email
  const client = await Client.findOne({ email clientEmail });
  if (!client) {
    throw new Error('Client not found');
  }

   Find subscription plan based on client's subscription type
  const subscriptionPlan = await SubscriptionPlan.findOne({ subscription client.subscriptionType });
  if (!subscriptionPlan) {
    throw new Error('Subscription plan not found');
  }

   Calculate expiration date
  const expirationDate = new Date(subscriptionPlan.effectFromDate);
  expirationDate.setDate(expirationDate.getDate() + subscriptionPlan.validityInDays);

   Calculate remaining days
  const today = new Date();
  const remainingDays = Math.ceil((expirationDate - today)  (1000  60  60  24));

  return {
    subscriptionName client.subscriptionType,
    remainingDays remainingDays  0  remainingDays  0,  Ensure non-negative values
    expirationDate expirationDate.toISOString(),
    isActive remainingDays  0
  };
};

module.exports = { getRemainingSubscriptionDays };



const subscriptionService = require('..servicessubscriptionService');

const getRemainingSubscriptionDays = async (req, res) = {
  try {
     Extract client email from request
    const clientEmail = req.body.clientEmail;
    if (!clientEmail) {
      return res.status(400).json({ error true, message 'Client email is required' });
    }

     Fetch remaining subscription days
    const subscriptionData = await subscriptionService.getRemainingSubscriptionDays(clientEmail);

    return res.status(200).json({
      success true,
      message 'Subscription details fetched successfully',
      data subscriptionData
    });
  } catch (error) {
    console.error(error);
    return res.status(400).json({ error true, message error.message });
  }
};

module.exports = { getRemainingSubscriptionDays };

import { useEffect, useState } from react;
import { useNavigate } from react-router-dom;

const Dashboard = () = {
  const [subscription, setSubscription] = useState(null);
  const navigate = useNavigate();

  useEffect(() = {
    const checkSubscription = async () = {
      const clientEmail = localStorage.getItem(clientEmail);

      if (!clientEmail) {
        navigate(login);  Redirect to login if email not found
        return;
      }

      try {
        const response = await fetch(httplocalhost5000apisubscriptionremaining-days, {
          method POST,
          headers { Content-Type applicationjson },
          body JSON.stringify({ clientEmail }),
        });

        const data = await response.json();

        if (data.success) {
          setSubscription(data.data);

          if (data.data.remainingDays === 0) {
            navigate(nosubscription);  Redirect if subscription expired
          }
        } else {
          console.error(Error, data.message);
          navigate(nosubscription);  Redirect if any error occurs
        }
      } catch (error) {
        console.error(Error fetching subscription, error);
        navigate(nosubscription);  Redirect if fetch fails
      }
    };

    checkSubscription();
  }, [navigate]);

  return (
    div
      {subscription  (
        h2Subscription {subscription.subscriptionName}h2
      )  (
        pLoading...p
      )}
    div
  );
};

export default Dashboard;




module.exports = {
  addSubs,
  getSubscriptions,
  activateSubscriptionService,
  deactivateSubscriptionService,
  manageSubscription,
  getActiveSubscription,
  clientRegistration
};
