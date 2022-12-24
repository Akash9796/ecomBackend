const Order = require("../models/orderModel");
const ErrorHandler = require("../utils/errorhandler");
const catchAsyncErrors = require("../middleware/catchAsyncErrors");
const Product = require("../models/productModel");

//Create new Order _________________________________________

exports.newOrder = catchAsyncErrors(async (req, res, next) => {
  const {
    shippingInfo,
    paymentInfo,
    orderInfo,
    itemsPrice,
    taxPrice,
    shippingPrice,
    totalPrice,
  } = req.body;

  const order = await Order.create({
    shippingInfo,
    paymentInfo,
    orderInfo,
    itemsPrice,
    taxPrice,
    shippingPrice,
    totalPrice,
    paidAt: Date.now(),
    user: req.user._id,
  });

  res.status(201).json({
    success: true,
    order,
  });
});

//Get Single Orders _________________________________________

exports.getSingleOrder = catchAsyncErrors(async (req, res, next) => {
  const order = await Order.findById(req.params.id).populate(
    "user",
    "name email"
  );

  if (!order) {
    return next(new ErrorHandler("Order not found this Id", 404));
  }
  res.status(200).json({
    success: "true",
    order,
  });
});
//Get logged in user Orders _________________________________________

exports.myOrders = catchAsyncErrors(async (req, res, next) => {
  const orders = await Order.find({ user: req.user._id });

  res.status(200).json({
    success: "true",
    orders,
  });
});
//Get all Orders by admin _________________________________________

exports.getAllOrders = catchAsyncErrors(async (req, res, next) => {
  const orders = await Order.find();

  let totalAmount = 0;

  orders.forEach((order) => {
    totalAmount += order.totalPrice;
  });

  res.status(200).json({
    success: "true",
    totalAmount,
    orders,
  });
});
//Update Any Order Status by admin _________________________________________

exports.updateOrder = catchAsyncErrors(async (req, res, next) => {
  const order = await Order.findById(req.params.id);

  if (!order) {
    return next(new ErrorHandler("Order not found this Id", 404));
  }

  if (order.orderStatus === "Delivered") {
    return next(new ErrorHandler("You have already delivered this order", 404));
  }

  order.orderInfo.forEach(
    async (order) => await updateStock(order.product, order.quantity)
  );

  order.orderStatus = req.body.status;

  if (req.body.status === "Delivered") {
    order.deliveredAt = Date.now();
  }

  await order.save({ validateBeforeSave: false });

  res.status(200).json({
    success: "true",
  });
});

async function updateStock(id, quantity) {
  const product = await Product.findById(id);

  product.Stock > 0 ? (product.Stock -= quantity) : 0;

  await product.save({ validateBeforeSave: false });
}

//Delete Order by admin _________________________________________

exports.deleteOrder = catchAsyncErrors(async (req, res, next) => {
  const order = await Order.findById(req.params.id);

  if (!order) {
    return next(new ErrorHandler("Order not found this Id", 404));
  }

  await order.remove();

  res.status(200).json({
    success: "true",
  });
});
