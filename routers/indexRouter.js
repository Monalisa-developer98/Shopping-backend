const express = require("express");
const app = express();
const BASE_PATH = "V1";

const authRouter = require("./authRouter");
const productRouter = require("./productRouter");
const couponRouter = require("./couponRouter");
// const orderRouter = require("./orderRouter");
const cartRouter = require("./cartRouter");

app.use(`/${BASE_PATH}/auth`, authRouter);
app.use(`/${BASE_PATH}/products`, productRouter);
app.use(`/${BASE_PATH}/coupon`, couponRouter);
// app.use(`/${BASE_PATH}/orders`, orderRouter);
app.use(`/${BASE_PATH}/cart`, cartRouter);

module.exports = app;