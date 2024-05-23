const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

// Constants
const SALT_ROUNDS = 8;

// Transaction schema for recording user transactions
const transactionSchema = new mongoose.Schema({
  date: { type: Date, required: true, get: (date) => date.toISOString() },
  amount: { type: Number, required: true },
  description: { type: String, required: true },
  merchantName: { type: String, required: true },
  merchantNameInArabic: { type: String, required: true },
  category: { type: String, required: true },
});

// Schema for user spendings
const spendingSchema = new mongoose.Schema({
  date: { type: Date, required: true, get: (date) => date.toISOString() },
  amount: { type: Number, required: true },
  description: { type: String, required: true },
  category: { type: String, required: true },
});

// Appointment schema to manage user appointments
const appointmentSchema = new mongoose.Schema({
  fullname: { type: String, required: true },
  nationalID: { type: String, required: true},
  accountNumber: { type: String, required: true },
  serviceType: { type: String, required: true },
  appointmentDate: {
    type: Date,
    required: true,
    get: (date) => date.toISOString(),
  },
});

// User schema definition
const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  password: {
    type: String,
    required: true,
    minlength: 8,
    validate: {
      validator: function (v) {
        return /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[^a-zA-Z\d]).{8,}$/.test(v);
      },
      message: (props) =>
        `${props.value} is not a valid password! Must contain one uppercase, one lowercase, one number, and one special character.`,
    },
  },
  accountBalance: { type: Number, default: 0 },
  accountNumber: { type: String, required: true, unique: true },
  transactions: [transactionSchema],
  spendings: [spendingSchema],
  appointments: [appointmentSchema],
});

// Adding indexes to optimize queries
userSchema.index({ username: 1 }); // Index for username
userSchema.index({ accountNumber: 1 }); // Index for account number

// Pre-save hook to hash the password before saving
userSchema.pre("save", async function (next) {
  if (this.isModified("password")) {
    try {
      this.password = await bcrypt.hash(this.password, SALT_ROUNDS);
    } catch (error) {
      return next(error);
    }
  }
  next();
});

// Method to compare hashed passwords
userSchema.methods.comparePassword = function (candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

// Handle save errors, specifically duplicate entries
userSchema.post("save", function (error, doc, next) {
  if (error.name === "MongoError" && error.code === 11000) {
    next(new Error("There was a duplicate key error"));
  } else {
    next(error);
  }
});

module.exports = mongoose.model("User", userSchema);
