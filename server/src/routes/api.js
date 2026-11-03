import { Router } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import fs from "fs";
import path from "path";
import { z } from "zod";
import { User, Test, LabPackage, Branch, Booking, Report, Message, Post, Faq } from "../models/index.js";
import { protect, allowRoles } from "../middleware/auth.js";
import { reportUpload } from "../middleware/upload.js";

const router = Router();
const cookieOptions = () => ({ httpOnly: true, sameSite: "lax", secure: process.env.COOKIE_SECURE === "true", maxAge: 24 * 60 * 60 * 1000 });
const makeToken = (user) => jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRES_IN || "1d" });

router.get("/health", (req, res) => res.json({ status: "ok", service: "Anmol Lab API" }));

// Authentication
router.post("/auth/register", async (req, res) => {
  const schema = z.object({ name: z.string().min(2), email: z.string().email(), password: z.string().min(8), phone: z.string().optional() });
  const data = schema.parse(req.body);
  const exists = await User.findOne({ email: data.email.toLowerCase() });
  if (exists) return res.status(409).json({ message: "Email already registered" });
  const user = await User.create({ ...data, password: await bcrypt.hash(data.password, 12), role: "patient" });
  res.cookie("token", makeToken(user), cookieOptions()).status(201).json({ user: safeUser(user) });
});
router.post("/auth/login", async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email: String(email).toLowerCase() }).select("+password");
  if (!user || !user.active || !(await bcrypt.compare(password || "", user.password))) return res.status(401).json({ message: "Email or password is incorrect" });
  res.cookie("token", makeToken(user), cookieOptions()).json({ user: safeUser(user) });
});
router.post("/auth/logout", (req, res) => res.clearCookie("token", { httpOnly: true, sameSite: "lax", secure: process.env.COOKIE_SECURE === "true" }).json({ message: "Logged out" }));
router.get("/auth/me", protect, (req, res) => res.json({ user: safeUser(req.user) }));
function safeUser(user) { return { id: user._id, name: user.name, email: user.email, phone: user.phone, role: user.role }; }

// Public catalogue
router.get("/tests", async (req, res) => {
  const filter = { active: true };
  if (req.query.category) filter.category = req.query.category;
  if (req.query.fasting === "true") filter.fastingRequired = true;
  if (req.query.q) filter.$or = [{ name: { $regex: req.query.q, $options: "i" } }, { code: { $regex: req.query.q, $options: "i" } }];
  const tests = await Test.find(filter).sort({ name: 1 }).limit(200);
  res.json({ tests });
});
router.get("/tests/:id", async (req, res) => {
  const test = await Test.findOne({ _id: req.params.id, active: true });
  if (!test) return res.status(404).json({ message: "Test not found" });
  res.json({ test });
});
router.get("/packages", async (req, res) => res.json({ packages: await LabPackage.find({ active: true }).populate("tests", "name code price") }));
router.get("/branches", async (req, res) => res.json({ branches: await Branch.find({ active: true }) }));
router.get("/posts", async (req, res) => res.json({ posts: await Post.find({ published: true }).sort({ createdAt: -1 }) }));
router.get("/faqs", async (req, res) => res.json({ faqs: await Faq.find({ active: true }) }));

// Contact
router.post("/messages", async (req, res) => {
  const data = z.object({ name: z.string().min(2), email: z.string().email(), phone: z.string().optional(), message: z.string().min(5).max(2000) }).parse(req.body);
  await Message.create(data);
  res.status(201).json({ message: "Your message has been received" });
});

// Booking: server calculates prices; never trusts client totals.
router.post("/bookings", protect, allowRoles("patient"), async (req, res) => {
  const schema = z.object({
    testIds: z.array(z.string()).default([]), packageIds: z.array(z.string()).default([]),
    collectionType: z.enum(["branch", "home"]), branchId: z.string().optional(),
    address: z.string().optional(), area: z.string().optional(), slotDate: z.string(),
    slotTime: z.string(), patientName: z.string().min(2), patientPhone: z.string().min(6),
    paymentMethod: z.enum(["cash_on_visit", "cash_on_collection"]).default("cash_on_visit"),
    consent: z.literal(true)
  });
  const data = schema.parse(req.body);
  if (!data.testIds.length && !data.packageIds.length) return res.status(400).json({ message: "Select at least one test or package" });
  if (data.collectionType === "branch" && !data.branchId) return res.status(400).json({ message: "Select a branch" });
  if (data.collectionType === "home" && (!data.address || !data.area)) return res.status(400).json({ message: "Home address and area are required" });
  const tests = await Test.find({ _id: { $in: data.testIds }, active: true });
  const packages = await LabPackage.find({ _id: { $in: data.packageIds }, active: true });
  if (tests.length !== data.testIds.length || packages.length !== data.packageIds.length) return res.status(400).json({ message: "One or more selected items are unavailable" });
  if (data.collectionType === "branch" && !(await Branch.exists({ _id: data.branchId, active: true }))) return res.status(400).json({ message: "Branch unavailable" });
  const packageTestIds = new Set(packages.flatMap(p => p.tests.map(id => String(id))));
  const uniqueTests = tests.filter(t => !packageTestIds.has(String(t._id)));
  const total = uniqueTests.reduce((sum, t) => sum + (t.salePrice ?? t.price), 0) + packages.reduce((sum, p) => sum + p.price, 0) + (data.collectionType === "home" ? 0 : 0);
  const booking = await Booking.create({
    bookingCode: `ANM-${Date.now().toString().slice(-8)}`, patient: req.user._id, patientName: data.patientName,
    patientPhone: data.patientPhone, tests: uniqueTests.map(t => ({ test: t._id, name: t.name, price: t.salePrice ?? t.price })),
    packages: packages.map(p => ({ package: p._id, name: p.name, price: p.price })),
    total, collectionType: data.collectionType, branch: data.branchId || undefined, address: data.address,
    area: data.area, slotDate: new Date(data.slotDate), slotTime: data.slotTime, paymentMethod: data.paymentMethod, consent: true
  });
  res.status(201).json({ booking });
});
router.get("/bookings/mine", protect, allowRoles("patient"), async (req, res) => res.json({ bookings: await Booking.find({ patient: req.user._id }).populate("branch").sort({ createdAt: -1 }) }));
router.get("/bookings", protect, allowRoles("admin", "staff"), async (req, res) => {
  const filter = req.query.status ? { status: req.query.status } : {};
  res.json({ bookings: await Booking.find(filter).populate("patient", "name email phone").populate("branch").sort({ createdAt: -1 }) });
});
router.patch("/bookings/:id/status", protect, allowRoles("admin", "staff"), async (req, res) => {
  const allowed = ["Booked", "Sample collected", "Processing", "Report ready", "Completed", "Cancelled"];
  if (!allowed.includes(req.body.status)) return res.status(400).json({ message: "Invalid status" });
  const booking = await Booking.findByIdAndUpdate(req.params.id, { status: req.body.status }, { new: true });
  if (!booking) return res.status(404).json({ message: "Booking not found" });
  res.json({ booking });
});

// Reports are private and authorized on every request.
router.post("/reports/:bookingId", protect, allowRoles("admin", "staff"), (req, res, next) => {
  reportUpload(req, res, async err => {
    if (err) return next(err);
    if (!req.file) return res.status(400).json({ message: "Upload a PDF, JPG or PNG report (maximum 5 MB)" });
    const booking = await Booking.findById(req.params.bookingId);
    if (!booking) { fs.unlinkSync(req.file.path); return res.status(404).json({ message: "Booking not found" }); }
    const report = await Report.create({ booking: booking._id, patient: booking.patient, originalName: req.file.originalname, storedName: path.basename(req.file.path), mimeType: req.file.mimetype, uploadedBy: req.user._id });
    booking.status = "Report ready"; await booking.save();
    res.status(201).json({ report: { id: report._id, originalName: report.originalName }, message: "Report uploaded" });
  });
});
router.get("/reports/mine", protect, allowRoles("patient"), async (req, res) => res.json({ reports: await Report.find({ patient: req.user._id }).populate("booking", "bookingCode createdAt") }));
router.get("/reports/:id/download", protect, async (req, res) => {
  const report = await Report.findById(req.params.id).populate("booking");
  if (!report) return res.status(404).json({ message: "Report not found" });
  const allowed = req.user.role === "admin" || req.user.role === "staff" ||
    (req.user.role === "patient" && String(report.patient) === String(req.user._id)) ||
    (req.user.role === "doctor" && req.user.referredPatients.some(id => String(id) === String(report.patient)));
  if (!allowed) return res.status(403).json({ message: "You are not authorized to access this report" });
  const filePath = path.resolve("storage", report.storedName);
  if (!fs.existsSync(filePath)) return res.status(404).json({ message: "Report file missing" });
  res.download(filePath, report.originalName || "lab-report");
});

// Family profiles
router.get("/family", protect, allowRoles("patient"), (req, res) => res.json({ family: req.user.familyMembers || [] }));
router.post("/family", protect, allowRoles("patient"), async (req, res) => {
  const { name, relation } = z.object({ name: z.string().min(2), relation: z.string().min(2) }).parse(req.body);
  req.user.familyMembers = [...(req.user.familyMembers || []), { name, relation }];
  await req.user.save();
  res.status(201).json({ family: req.user.familyMembers });
});

// Admin management
router.get("/admin/summary", protect, allowRoles("admin"), async (req, res) => {
  const [bookings, tests, reports, messages, revenue] = await Promise.all([
    Booking.countDocuments(), Test.countDocuments(), Report.countDocuments(), Message.countDocuments({ status: "new" }),
    Booking.aggregate([{ $match: { status: { $ne: "Cancelled" } } }, { $group: { _id: null, total: { $sum: "$total" } } }])
  ]);
  res.json({ bookings, tests, reports, newMessages: messages, revenueEstimate: revenue[0]?.total || 0 });
});
router.post("/admin/tests", protect, allowRoles("admin"), async (req, res) => res.status(201).json({ test: await Test.create(req.body) }));
router.patch("/admin/tests/:id", protect, allowRoles("admin"), async (req, res) => {
  const test = await Test.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
  if (!test) return res.status(404).json({ message: "Test not found" });
  res.json({ test });
});
router.delete("/admin/tests/:id", protect, allowRoles("admin"), async (req, res) => {
  await Test.findByIdAndUpdate(req.params.id, { active: false });
  res.json({ message: "Test deactivated" });
});
router.get("/admin/messages", protect, allowRoles("admin"), async (req, res) => res.json({ messages: await Message.find().sort({ createdAt: -1 }) }));
router.patch("/admin/messages/:id", protect, allowRoles("admin"), async (req, res) => res.json({ message: await Message.findByIdAndUpdate(req.params.id, { status: req.body.status }, { new: true }) }));

// Optional AI assistant; no diagnosis or result interpretation.
router.post("/ai/chat", protect, async (req, res) => {
  const prompt = z.string().min(2).max(1000).parse(req.body.message);
  if (!process.env.GROQ_API_KEY) return res.json({ reply: "The AI assistant is not configured yet. You can ask the lab team about test prices, preparation, timings and bookings. This assistant does not give medical advice." });
  const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
    method: "POST", headers: { "Authorization": `Bearer ${process.env.GROQ_API_KEY}`, "Content-Type": "application/json" },
    body: JSON.stringify({ model: process.env.GROQ_MODEL || "llama-3.3-70b-versatile", messages: [
      { role: "system", content: "You are Anmol Lab's general information assistant. Answer only general questions about laboratory services. Never diagnose, recommend treatment, or interpret personal results. If asked about symptoms or results, advise consulting a qualified doctor. State that you do not give medical advice." },
      { role: "user", content: prompt }
    ], temperature: 0.2 })
  });
  if (!response.ok) return res.status(502).json({ message: "AI service temporarily unavailable" });
  const payload = await response.json();
  res.json({ reply: payload.choices?.[0]?.message?.content || "Please contact the lab for help." });
});

export default router;
