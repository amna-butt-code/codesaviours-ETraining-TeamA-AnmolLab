import mongoose from "mongoose";

const { Schema, model } = mongoose;

const userSchema = new Schema({
  name: { type: String, required: true, trim: true },
  email: { type: String, required: true, unique: true, lowercase: true, trim: true },
  password: { type: String, required: true, select: false },
  phone: String,
  role: { type: String, enum: ["patient", "doctor", "staff", "admin"], default: "patient" },
  active: { type: Boolean, default: true },
  referredPatients: [{ type: Schema.Types.ObjectId, ref: "User" }]
}, { timestamps: true });

const testSchema = new Schema({
  name: { type: String, required: true, trim: true },
  code: { type: String, required: true, unique: true },
  category: { type: String, required: true },
  sampleType: { type: String, default: "Blood" },
  preparation: { type: String, default: "No special preparation stated; confirm with the lab." },
  fastingRequired: { type: Boolean, default: false },
  reportTime: { type: String, default: "Within 24 hours (sample estimate)" },
  price: { type: Number, required: true, min: 0 },
  salePrice: { type: Number, min: 0 },
  active: { type: Boolean, default: true },
  samplePrice: { type: Boolean, default: true }
}, { timestamps: true });

const packageSchema = new Schema({
  name: { type: String, required: true },
  description: String,
  tests: [{ type: Schema.Types.ObjectId, ref: "Test" }],
  price: { type: Number, required: true },
  active: { type: Boolean, default: true },
  samplePrice: { type: Boolean, default: true }
}, { timestamps: true });

const branchSchema = new Schema({
  name: { type: String, required: true },
  address: String,
  phone: String,
  openingHours: String,
  mapUrl: String,
  active: { type: Boolean, default: true }
}, { timestamps: true });

const bookingSchema = new Schema({
  bookingCode: { type: String, unique: true, required: true },
  patient: { type: Schema.Types.ObjectId, ref: "User", required: true },
  patientName: String,
  patientPhone: String,
  tests: [{ test: { type: Schema.Types.ObjectId, ref: "Test" }, name: String, price: Number }],
  packages: [{ package: { type: Schema.Types.ObjectId, ref: "LabPackage" }, name: String, price: Number }],
  total: { type: Number, required: true },
  collectionType: { type: String, enum: ["branch", "home"], required: true },
  branch: { type: Schema.Types.ObjectId, ref: "Branch" },
  address: String,
  area: String,
  slotDate: Date,
  slotTime: String,
  status: { type: String, enum: ["Booked", "Sample collected", "Processing", "Report ready", "Completed", "Cancelled"], default: "Booked" },
  paymentMethod: { type: String, enum: ["cash_on_visit", "cash_on_collection"], default: "cash_on_visit" },
  consent: { type: Boolean, required: true }
}, { timestamps: true });

const reportSchema = new Schema({
  booking: { type: Schema.Types.ObjectId, ref: "Booking", required: true },
  patient: { type: Schema.Types.ObjectId, ref: "User", required: true },
  originalName: String,
  storedName: { type: String, required: true },
  mimeType: String,
  uploadedBy: { type: Schema.Types.ObjectId, ref: "User" }
}, { timestamps: true });

const messageSchema = new Schema({
  name: String, email: String, phone: String, message: { type: String, required: true },
  status: { type: String, enum: ["new", "read", "resolved"], default: "new" }
}, { timestamps: true });

const postSchema = new Schema({
  title: String, slug: { type: String, unique: true }, excerpt: String, body: String, published: { type: Boolean, default: false }
}, { timestamps: true });

const faqSchema = new Schema({ question: String, answer: String, active: { type: Boolean, default: true } }, { timestamps: true });

export const User = model("User", userSchema);
export const Test = model("Test", testSchema);
export const LabPackage = model("LabPackage", packageSchema);
export const Branch = model("Branch", branchSchema);
export const Booking = model("Booking", bookingSchema);
export const Report = model("Report", reportSchema);
export const Message = model("Message", messageSchema);
export const Post = model("Post", postSchema);
export const Faq = model("Faq", faqSchema);
