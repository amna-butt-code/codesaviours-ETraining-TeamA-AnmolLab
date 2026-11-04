import "dotenv/config";
import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import { User, Test, Branch, LabPackage, Faq, Post } from "./models/index.js";

const tests = [["Complete Blood Count", "CBC", "Hematology", 500, false], ["ESR", "ESR", "Hematology", 350, false], ["Blood Group", "BG", "Hematology", 300, false], ["Peripheral Blood Film", "PBF", "Hematology", 700, false], ["Reticulocyte Count", "RET", "Hematology", 600, false], ["Liver Function Tests", "LFT", "Biochemistry", 1500, false], ["Renal Function Tests", "RFT", "Biochemistry", 1400, false], ["Lipid Profile", "LIP", "Biochemistry", 1800, true], ["HbA1c", "HBA1C", "Diabetes", 1600, false], ["Fasting Blood Sugar", "FBS", "Diabetes", 350, true], ["Random Blood Sugar", "RBS", "Diabetes", 350, false], ["Thyroid Profile", "THY", "Hormones", 2200, false], ["TSH", "TSH", "Hormones", 1000, false], ["Vitamin D", "VITD", "Vitamins", 2500, false], ["Vitamin B12", "B12", "Vitamins", 1800, false], ["Urine Complete Examination", "UCE", "Urine", 450, false], ["Urine Culture", "UC", "Microbiology", 1200, false], ["Stool Complete Examination", "SCE", "Microbiology", 500, false], ["Serum Calcium", "CA", "Biochemistry", 600, false], ["Serum Uric Acid", "UA", "Biochemistry", 600, false], ["Serum Electrolytes", "SE", "Biochemistry", 900, false], ["Creatinine", "CRE", "Biochemistry", 500, false], ["Urea", "UREA", "Biochemistry", 500, false], ["Bilirubin Total", "BILT", "Biochemistry", 550, false], ["SGPT / ALT", "ALT", "Biochemistry", 550, false], ["SGOT / AST", "AST", "Biochemistry", 550, false], ["Alkaline Phosphatase", "ALP", "Biochemistry", 600, false], ["Albumin", "ALB", "Biochemistry", 500, false], ["Protein Total", "TP", "Biochemistry", 600, false], ["CRP", "CRP", "Immunology", 1200, false], ["ASO Titre", "ASO", "Immunology", 800, false], ["Rheumatoid Factor", "RF", "Immunology", 900, false], ["H. pylori Antigen", "HPA", "Microbiology", 1600, false], ["Dengue NS1", "DNS1", "Serology", 1800, false], ["Dengue IgG/IgM", "DENG", "Serology", 1500, false], ["Malaria Parasite", "MP", "Microbiology", 700, false], ["Hepatitis B Surface Antigen", "HBSAG", "Serology", 900, false], ["Anti HCV", "HCV", "Serology", 1000, false], ["HIV Screening", "HIV", "Serology", 1200, false], ["Widal Test", "WID", "Serology", 700, false], ["Pregnancy Test (Blood)", "BHCG", "Hormones", 1000, false], ["Prolactin", "PRL", "Hormones", 1200, false], ["FSH", "FSH", "Hormones", 1100, false], ["LH", "LH", "Hormones", 1100, false], ["Testosterone", "TESTO", "Hormones", 1500, false], ["Estradiol", "E2", "Hormones", 1500, false], ["PSA", "PSA", "Hormones", 1600, false], ["Iron Studies", "IRON", "Biochemistry", 1800, false], ["Ferritin", "FER", "Biochemistry", 1400, false], ["Calcium", "CAL", "Biochemistry", 600, false], ["Magnesium", "MG", "Biochemistry", 700, false], ["Phosphate", "PHOS", "Biochemistry", 650, false], ["Amylase", "AMY", "Biochemistry", 1000, false], ["Lipase", "LIPASE", "Biochemistry", 1100, false], ["PT / INR", "PTINR", "Coagulation", 900, false], ["APTT", "APTT", "Coagulation", 900, false], ["D-Dimer", "DD", "Coagulation", 2200, false], ["Reticulocyte Count", "RET2", "Hematology", 600, false], ["Blood Culture", "BC", "Microbiology", 2500, false], ["Semen Analysis", "SA", "Pathology", 1000, false], ["Stool Occult Blood", "FOBT", "Pathology", 700, false]];
await mongoose.connect(process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/anmol_lab");
await Promise.all([User.deleteMany({}), Test.deleteMany({}), Branch.deleteMany({}), LabPackage.deleteMany({}), Faq.deleteMany({}), Post.deleteMany({})]);
const testDocs = await Test.insertMany(tests.map(([name, code, category, price, fastingRequired]) => ({
  name, code, category, price, fastingRequired, samplePrice: true,
  preparation: fastingRequired ? "Sample preparation may require fasting. Confirm exact duration with Anmol Lab." : "No fasting requirement listed in this sample dataset; confirm with the lab.",
  reportTime: "Sample estimate: confirm with Anmol Lab"
})));
const [admin, staff, doctor, patient] = await Promise.all([
  ["Admin","admin@anmol.test","Admin123!","admin"],["Lab Staff","staff@anmol.test","Staff123!","staff"],
  ["Demo Doctor","doctor@anmol.test","Doctor123!","doctor"],["Demo Patient","patient@anmol.test","Patient123!","patient"]
].map(async ([name,email,password,role]) => User.create({ name,email,password:await bcrypt.hash(password,12),role })));
const branches = await Branch.insertMany([{name:"Anmol Health Care Lab – Main Branch",address:"Sultani Chowk, Gulshan Muhammad Abad, Faisalabad",phone:"0316-6474766 / 0321-6671476",openingHours:"Please contact the laboratory to confirm current timings"}]);
const byCode = Object.fromEntries(testDocs.map(t => [t.code,t._id]));
await LabPackage.create([
 {name:"Sample Full Body Checkup",description:"Illustrative package; confirm included tests and price with the lab.",tests:[byCode.CBC,byCode.LFT,byCode.RFT,byCode.LIP],price:4500,samplePrice:true},
 {name:"Sample Diabetes Screening",description:"Illustrative package; confirm included tests and price with the lab.",tests:[byCode.FBS,byCode.HBA1C],price:1700,samplePrice:true}
]);
await Faq.insertMany([
 {question:"Do I need to fast before a test?",answer:"Preparation depends on the test. Check the test details and confirm with the laboratory."},
 {question:"Can I book home sample collection?",answer:"The website supports a home collection request. Coverage and charges must be confirmed by the lab."},
 {question:"How can I download my report?",answer:"Sign in to your patient portal and open My Reports when the report is ready."}
]);
await Post.create({title:"Preparing for a Laboratory Test",slug:"preparing-for-a-laboratory-test",excerpt:"General preparation guidance.",body:"Always follow the instructions provided by your doctor and the laboratory. Preparation varies by test.",published:true});
console.log("Seed complete. Demo users:",admin.email,staff.email,doctor.email,patient.email);
await mongoose.disconnect();
