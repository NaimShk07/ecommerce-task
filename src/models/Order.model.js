const mongoose = require('mongoose');

const orderItemSchema = new mongoose.Schema({
  item: { type: mongoose.Schema.Types.ObjectId, ref: 'Item', required: true },
  quantity: { type: Number, required: true },
  price: { type: Number, required: true },
});

const orderSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    items: [orderItemSchema],
    status: {
      type: String,
      enum: ['Pending', 'Shipped', 'Delivered', 'Cancelled'],
      default: 'Pending',
      index: true, // index for filtering
    },
    totalPrice: { type: Number, required: true },
  },
  { timestamps: true }
);

// Index createdAt for faster sorting/filtering
orderSchema.index({ createdAt: -1 });

module.exports = mongoose.model('Order', orderSchema);
