import React, { useEffect, useMemo, useState, createContext, useContext } from "react";
import { Routes, Route, Link, NavLink, useNavigate } from "react-router-dom";
import { Activity, Search, Menu, X, ArrowRight, Clock, MapPin, Phone, ShieldCheck, FlaskConical, CalendarCheck, FileText, MessageCircle, LogOut, UserCircle, Stethoscope, LayoutDashboard } from "lucide-react";
import api from "./api";

const AuthContext = createContext(null);
const useAuth = () => useContext(AuthContext);
const money = n => `Rs. ${Number(n || 0).toLocaleString("en-PK")}`;

function AuthProvider({children}) {
  const [user,setUser] = useState(null);
  const [loading,setLoading] = useState(true);
  useEffect(()=>{ api.get("/auth/me").then(r=>setUser(r.data.user)).catch(()=>setUser(null)).finally(()=>setLoading(false)); },[]);
  const login = async (email,password)=>{ const r=await api.post("/auth/login",{email,password}); setUser(r.data.user); return r.data.user; };
  const logout = async ()=>{ await api.post("/auth/logout"); setUser(null); };
  return <AuthContext.Provider value={{user,loading,login,logout,setUser}}>{children}</AuthContext.Provider>;
}
function Header(){
  const {user,logout}=useAuth(); const [open,setOpen]=useState(false);
  const links=[["Home","/"],["About","/about"],["Tests","/tests"],["Packages","/packages"],["Home Sampling","/home-sampling"],["Branches","/branches"],["For Doctors","/doctors"],["Blog","/blog"],["FAQ","/faq"],["Contact","/contact"]];
  return <header className="header"><div className="topline"><span><Phone size={13}/> <a href="tel:+923166474766">0316-6474766</a> · <a href="tel:+923216671476">0321-6671476</a></span><span><MapPin size={13}/> Sultani Chowk, Gulshan Muhammad Abad, Faisalabad</span><span>Precision in Every Test Care in every Patient</span></div><div className="navwrap"><Link to="/" className="brand"><img src="/anmol-health-care-lab-logo.png" alt="Anmol Health Care Lab"/><span>ANMOL <b>LAB</b><small>ANMOL HEALTH CARE LAB</small></span></Link><button className="mobile-toggle" onClick={()=>setOpen(!open)} aria-label="Toggle menu">{open?<X/>:<Menu/>}</button><nav className={open?"nav open":"nav"}>{links.map(([n,p])=><NavLink key={p} to={p} onClick={()=>setOpen(false)}>{n}</NavLink>)}</nav><div className="navactions"><Link className="btn btn-outline small" to="/reports">Download Report</Link><Link className="btn btn-primary small" to="/book">Book a Test</Link>{user?<button className="icon-btn" title="Logout" onClick={()=>logout()}><LogOut size={18}/></button>:<Link className="login-link" to="/login">Login</Link>}</div></div></header>
}
function Footer(){return <footer className="footer"><div className="container footergrid"><div><div className="brand inverse"><img src="/anmol-health-care-lab-logo.png" alt="Anmol Health Care Lab"/><span>ANMOL <b>LAB</b><small>ANMOL HEALTH CARE LAB</small></span></div><p>Precision in Every Test Care in every Patient. Clear information, convenient booking and secure access to laboratory reports.</p></div><div><h4>Explore</h4><Link to="/tests">Tests</Link><Link to="/packages">Health packages</Link><Link to="/branches">Branches</Link><Link to="/contact">Contact</Link></div><div><h4>Patient support</h4><Link to="/book">Book a test</Link><Link to="/reports">Download report</Link><Link to="/faq">FAQs</Link><Link to="/privacy">Privacy policy</Link></div><div><h4>Contact Anmol Lab</h4><p>Sultani Chowk, Gulshan Muhammad Abad, Faisalabad</p><p><a href="tel:+923166474766">0316-6474766</a><a href="tel:+923216671476">0321-6671476</a></p><p><a href="mailto:anmollaboratory@gmail.com">anmollaboratory@gmail.com</a></p><p><a href="https://www.anmolhealthcarelab.pk" target="_blank" rel="noreferrer">www.anmolhealthcarelab.pk</a></p></div></div><div className="copyright">© {new Date().getFullYear()} Anmol Health Care Lab. Test prices and preparation details are subject to confirmation by the laboratory.</div></footer>}
function Layout({children}){return <><Header/>{children}<Footer/><a className="whatsapp" href="https://wa.me/923166474766" target="_blank" rel="noreferrer" aria-label="WhatsApp"><MessageCircle/></a></>}
function SectionTitle({eyebrow,title,sub}){return <div className="section-title"><span className="eyebrow">{eyebrow}</span><h2>{title}</h2>{sub&&<p>{sub}</p>}</div>}
function Home(){
 const [q,setQ]=useState(""); const [tests,setTests]=useState([]);
 useEffect(()=>{api.get("/tests").then(r=>setTests(r.data.tests.slice(0,6))).catch(()=>{});},[]);
 return <><section className="hero"><div className="container hero-grid"><div><span className="eyebrow light">PRECISION IN EVERY TEST</span><h1>Precision in every test. <em>Care in every patient.</em></h1><p>Welcome to Anmol Health Care Lab. Explore laboratory tests, request home sample collection and access your reports through a secure patient account.</p><div className="hero-actions"><Link className="btn btn-white" to="/tests">Explore tests <ArrowRight size={17}/></Link><Link className="btn btn-ghost" to="/book">Book a test</Link></div><div className="trustline"><ShieldCheck/> Clear test information <span>•</span> Convenient booking <span>•</span> Secure reports</div></div><div className="hero-card"><div className="hero-card-icon"><FlaskConical size={34}/></div><h3>What test are you looking for?</h3><form className="searchbox" onSubmit={e=>{e.preventDefault();location.href=`/tests?q=${encodeURIComponent(q)}`}}><Search/><input value={q} onChange={e=>setQ(e.target.value)} placeholder="Search CBC, thyroid, vitamin D..."/><button>Search</button></form><div className="popular"><span>Popular searches</span><div>{["CBC","LFT","HbA1c","Vitamin D"].map(x=><Link key={x} to={`/tests?q=${x}`}>{x}</Link>)}</div></div></div></div></section><section className="section"><div className="container"><SectionTitle eyebrow="OUR SERVICES" title="Your lab journey, made easier" sub="Everything you need to prepare, book and access your reports."/><div className="feature-grid">{[[FlaskConical,"Explore tests","Browse common tests with preparation and sample price information.","/tests"],[CalendarCheck,"Easy booking","Choose a branch visit or request home sample collection.","/book"],[FileText,"Online reports","Access your reports securely through your patient account.","/reports"]].map(([Icon,t,d,l])=><Link to={l} className="feature-card" key={t}><span><Icon/></span><h3>{t}</h3><p>{d}</p><b>Learn more <ArrowRight size={15}/></b></Link>)}</div></div></section><section className="section soft"><div className="container"><SectionTitle eyebrow="POPULAR TESTS" title="Find the test you need" sub="Prices shown are sample values for development and must be confirmed by the client."/><div className="test-grid">{tests.map(t=><TestCard key={t._id} test={t}/>)}</div><div className="center"><Link className="btn btn-primary" to="/tests">View all tests <ArrowRight size={16}/></Link></div></div></section><section className="section"><div className="container split"><div><span className="eyebrow">HOME SAMPLE COLLECTION</span><h2>Testing convenience, at your doorstep.</h2><p>Request a home collection by sharing your area, address and preferred time. Coverage and charges will be confirmed by the laboratory.</p><Link className="btn btn-primary" to="/home-sampling">Request home sampling</Link></div><div className="sample-art"><div className="sample-circle"><Activity size={70}/></div><div className="sample-note"><ShieldCheck/> Your information is handled securely</div></div></div></section></>
}
function TestCard({test}){return <article className="test-card"><div className="test-card-top"><span className="pill">{test.category}</span><span className="test-code">{test.code}</span></div><h3>{test.name}</h3><p>{test.preparation}</p><div className="test-meta"><span><Clock size={14}/> {test.reportTime}</span><strong>{money(test.salePrice??test.price)}</strong></div><small className="sample-label">Sample price — confirm with lab</small><Link to="/book" state={{testId:test._id}} className="text-link">Book this test <ArrowRight size={15}/></Link></article>}
function Tests(){const [tests,setTests]=useState([]),[q,setQ]=useState(new URLSearchParams(location.search).get("q")||""),[category,setCategory]=useState("");const [loading,setLoading]=useState(true);
 useEffect(()=>{setLoading(true);api.get("/tests",{params:{q,category:category||undefined}}).then(r=>setTests(r.data.tests)).catch(()=>setTests([])).finally(()=>setLoading(false));},[q,category]);
 const categories=[...new Set(tests.map(t=>t.category))];
 return <main className="page"><div className="container"><SectionTitle eyebrow="TEST DIRECTORY" title="Find a laboratory test" sub="Search by test name or code. Preparation and prices are sample information until verified by Anmol Lab."/><div className="filters"><div className="input-icon"><Search/><input value={q} onChange={e=>setQ(e.target.value)} placeholder="Search tests or codes..."/></div><select value={category} onChange={e=>setCategory(e.target.value)}><option value="">All categories</option>{categories.map(c=><option key={c}>{c}</option>)}</select></div>{loading?<p>Loading tests...</p>:tests.length?<div className="test-grid">{tests.map(t=><TestCard key={t._id} test={t}/>)}</div>:<div className="empty">No tests found. Try another search.</div>}</div></main>}
function Packages(){const [items,setItems]=useState([]);useEffect(()=>{api.get("/packages").then(r=>setItems(r.data.packages)).catch(()=>{});},[]);return <main className="page"><div className="container"><SectionTitle eyebrow="HEALTH PACKAGES" title="Choose a health package" sub="Illustrative packages. Included tests and prices require client confirmation."/><div className="package-grid">{items.map(p=><article className="package-card" key={p._id}><span className="pill">HEALTH CHECK</span><h3>{p.name}</h3><p>{p.description}</p><strong>{money(p.price)}</strong><small>Sample package price</small><h4>Included tests</h4><ul>{p.tests?.map(t=><li key={t._id}>{t.name}</li>)}</ul><Link className="btn btn-primary full" to="/book">Book package</Link></article>)}</div></div></main>}
function GenericPage({title,eyebrow,children}){return <main className="page"><div className="container narrow"><SectionTitle eyebrow={eyebrow||"ANMOL LAB"} title={title}/>{children}</div></main>}
function About(){return <GenericPage title="About Anmol Health Care Lab" eyebrow="WHO WE ARE"><div className="prose"><p>Anmol Health Care Lab is a medical diagnostic laboratory based in Sultani Chowk, Gulshan Muhammad Abad, Faisalabad. The laboratory tagline is “Precision in Every Test Care in every Patient.”</p><p>This website helps visitors explore the test catalogue, review health packages, request a booking and access reports through secure accounts. Detailed laboratory history, equipment information, quality procedures and operating hours have not been provided yet and should be added after confirmation by the laboratory.</p><h2>Our laboratory team</h2><div className="team-grid"><article><h3>Consultant Pathologists</h3><p><b>Dr. M. Nadeem</b><br/>MBBS, M.Phil (Histopath)</p><p><b>Dr. M. Iqbal Ahmad</b><br/>MBBS, MCPS, M.Phil (Histopath)</p><p><b>Dr. Adeel Iqbal</b><br/>MBBS, MCPS, M.Phil (Histopath)</p></article><article><h3>Microbiologist</h3><p><b>Amara Khalid</b><br/>M.Phil Microbiology, U.A.F.</p><h3>Technologist</h3><p><b>AD Chaudhary</b><br/>BS-MLT, U.O.L (LHR).</p><h3>Lab Technician</h3><p><b>Ibrahim Raza Attari</b><br/>P.M.F., LHR (Punjab) PK</p></article></div><p className="muted">Staff names and qualifications are transcribed from the supplied laboratory letterhead. Please verify spelling and credentials before public launch.</p></div></GenericPage>}
function Branches(){const [branches,setBranches]=useState([]);useEffect(()=>{api.get("/branches").then(r=>setBranches(r.data.branches)).catch(()=>{});},[]);return <GenericPage title="Our branches" eyebrow="VISIT US"><div className="stack">{branches.map(b=><div className="info-card" key={b._id}><h3>{b.name}</h3><p><MapPin/> {b.address||"Sultani Chowk, Gulshan Muhammad Abad, Faisalabad"}</p><p><Phone/> {b.phone||"0316-6474766 / 0321-6671476"}</p><p><Clock/> {b.openingHours||"Timings to be confirmed"}</p></div>)}</div></GenericPage>}
function HomeSampling(){return <GenericPage title="Home sample collection" eyebrow="AT YOUR CONVENIENCE"><div className="prose"><p>Request a home collection through the booking form. Please provide your complete address and area. Coverage and charges must be confirmed by the laboratory before the visit.</p><Link className="btn btn-primary" to="/book">Start booking</Link></div></GenericPage>}
function Doctors(){return <GenericPage title="Services for doctors" eyebrow="FOR DOCTORS"><div className="prose"><p>Registered doctors can access reports for patients referred to them, subject to authorization and patient privacy requirements.</p><Link to="/login" className="btn btn-primary">Doctor login</Link></div></GenericPage>}
function Blog(){const [posts,setPosts]=useState([]);useEffect(()=>{api.get("/posts").then(r=>setPosts(r.data.posts)).catch(()=>{});},[]);return <GenericPage title="Health information" eyebrow="BLOG"><div className="stack">{posts.map(p=><article className="info-card" key={p._id}><h3>{p.title}</h3><p>{p.excerpt}</p><p>{p.body}</p></article>)}</div></GenericPage>}
function FAQ(){const [faqs,setFaqs]=useState([]);useEffect(()=>{api.get("/faqs").then(r=>setFaqs(r.data.faqs)).catch(()=>{});},[]);return <GenericPage title="Frequently asked questions" eyebrow="HELP CENTRE"><div className="stack">{faqs.map(f=><details className="faq" key={f._id}><summary>{f.question}</summary><p>{f.answer}</p></details>)}</div></GenericPage>}
function Contact(){const [form,setForm]=useState({name:"",email:"",phone:"",message:""}),[msg,setMsg]=useState("");const submit=async e=>{e.preventDefault();try{const r=await api.post("/messages",form);setMsg(r.data.message);setForm({name:"",email:"",phone:"",message:""});}catch(e){setMsg(e.response?.data?.message||"Could not send message");}};return <GenericPage title="Contact Anmol Health Care Lab" eyebrow="WE ARE HERE TO HELP"><div className="contact-details"><p><MapPin/> Sultani Chowk, Gulshan Muhammad Abad, Faisalabad</p><p><Phone/> <a href="tel:+923166474766">0316-6474766</a> · <a href="tel:+923216671476">0321-6671476</a></p><p><FileText/> <a href="mailto:anmollaboratory@gmail.com">anmollaboratory@gmail.com</a></p><p><Activity/> <a href="https://www.anmolhealthcarelab.pk" target="_blank" rel="noreferrer">www.anmolhealthcarelab.pk</a></p></div><form className="form-card" onSubmit={submit}><Field label="Your name"><input required value={form.name} onChange={e=>setForm({...form,name:e.target.value})}/></Field><Field label="Email"><input required type="email" value={form.email} onChange={e=>setForm({...form,email:e.target.value})}/></Field><Field label="Phone (optional)"><input value={form.phone} onChange={e=>setForm({...form,phone:e.target.value})}/></Field><Field label="Message"><textarea required rows="4" value={form.message} onChange={e=>setForm({...form,message:e.target.value})}/></Field><button className="btn btn-primary">Send message</button>{msg&&<p className="notice">{msg}</p>}</form></GenericPage>}
function Field({label,children}){return <label className="field"><span>{label}</span>{children}</label>}
function Login(){const {login,user}=useAuth(),nav=useNavigate();const [email,setEmail]=useState(""),[password,setPassword]=useState(""),[error,setError]=useState("");if(user)return <GenericPage title="You are signed in"><Link to="/portal" className="btn btn-primary">Open portal</Link></GenericPage>;const submit=async e=>{e.preventDefault();try{const u=await login(email,password);nav(u.role==="admin"?"/admin":u.role==="staff"?"/staff":u.role==="doctor"?"/doctor":"/portal");}catch(e){setError(e.response?.data?.message||"Login failed");}};return <GenericPage title="Welcome back" eyebrow="ACCOUNT LOGIN"><form className="form-card" onSubmit={submit}><Field label="Email"><input type="email" required value={email} onChange={e=>setEmail(e.target.value)}/></Field><Field label="Password"><input type="password" required value={password} onChange={e=>setPassword(e.target.value)}/></Field><button className="btn btn-primary full">Login</button>{error&&<p className="error">{error}</p>}<p className="muted">New patient? <Link to="/register">Create an account</Link></p></form></GenericPage>}
function Register(){const [form,setForm]=useState({name:"",email:"",phone:"",password:""}),[error,setError]=useState("");const {setUser}=useAuth(),nav=useNavigate();const submit=async e=>{e.preventDefault();try{const r=await api.post("/auth/register",form);setUser(r.data.user);nav("/portal");}catch(e){setError(e.response?.data?.message||"Registration failed");}};return <GenericPage title="Create your patient account"><form className="form-card" onSubmit={submit}>{Object.entries({name:"Full name",email:"Email",phone:"Phone",password:"Password"}).map(([k,l])=><Field key={k} label={l}><input required={k!=="phone"} type={k==="email"?"email":k==="password"?"password":"text"} value={form[k]} onChange={e=>setForm({...form,[k]:e.target.value})}/></Field>)}<button className="btn btn-primary full">Create account</button>{error&&<p className="error">{error}</p>}</form></GenericPage>}
function Book(){const {user}=useAuth(),nav=useNavigate(),[tests,setTests]=useState([]),[branches,setBranches]=useState([]),[selected,setSelected]=useState([]),[form,setForm]=useState({collectionType:"branch",branchId:"",address:"",area:"",slotDate:"",slotTime:"09:00",patientName:user?.name||"",patientPhone:user?.phone||"",consent:false}),[message,setMessage]=useState("");useEffect(()=>{api.get("/tests").then(r=>setTests(r.data.tests)).catch(()=>{});api.get("/branches").then(r=>setBranches(r.data.branches)).catch(()=>{});},[]);const toggle=id=>setSelected(s=>s.includes(id)?s.filter(x=>x!==id):[...s,id]);const submit=async e=>{e.preventDefault();if(!user)return nav("/login");try{const r=await api.post("/bookings",{...form,testIds:selected,packageIds:[],consent:form.consent});setMessage(`Booking confirmed: ${r.data.booking.bookingCode}`);setSelected([]);}catch(e){setMessage(e.response?.data?.message||"Booking failed");}};return <main className="page"><div className="container"><SectionTitle eyebrow="ONLINE BOOKING" title="Book your laboratory test" sub="Select tests and your preferred collection method."/><form className="booking-layout" onSubmit={submit}><div className="form-card"><h3>1. Select tests</h3><div className="select-tests">{tests.map(t=><label key={t._id} className="check-row"><input type="checkbox" checked={selected.includes(t._id)} onChange={()=>toggle(t._id)}/><span>{t.name}<small>{t.code}</small></span><b>{money(t.salePrice??t.price)}</b></label>)}</div><h3>2. Collection method</h3><div className="radio-row"><label><input type="radio" checked={form.collectionType==="branch"} onChange={()=>setForm({...form,collectionType:"branch"})}/> Visit a branch</label><label><input type="radio" checked={form.collectionType==="home"} onChange={()=>setForm({...form,collectionType:"home"})}/> Home collection</label></div>{form.collectionType==="branch"?<Field label="Choose branch"><select required value={form.branchId} onChange={e=>setForm({...form,branchId:e.target.value})}><option value="">Select branch</option>{branches.map(b=><option key={b._id} value={b._id}>{b.name}</option>)}</select></Field>:<><Field label="Area"><input required value={form.area} onChange={e=>setForm({...form,area:e.target.value})}/></Field><Field label="Full address"><textarea required value={form.address} onChange={e=>setForm({...form,address:e.target.value})}/></Field></>}<h3>3. Preferred date and time</h3><div className="two-fields"><Field label="Date"><input type="date" required min={new Date().toISOString().slice(0,10)} value={form.slotDate} onChange={e=>setForm({...form,slotDate:e.target.value})}/></Field><Field label="Time"><input type="time" required value={form.slotTime} onChange={e=>setForm({...form,slotTime:e.target.value})}/></Field></div><h3>4. Patient details</h3><Field label="Patient name"><input required value={form.patientName} onChange={e=>setForm({...form,patientName:e.target.value})}/></Field><Field label="Phone"><input required value={form.patientPhone} onChange={e=>setForm({...form,patientPhone:e.target.value})}/></Field><label className="consent"><input type="checkbox" checked={form.consent} onChange={e=>setForm({...form,consent:e.target.checked})}/> I agree to the privacy policy and consent to the use of my information to process this booking.</label><button className="btn btn-primary full">Confirm booking</button>{message&&<p className="notice">{message}</p>}</div><aside className="summary-card"><h3>Booking summary</h3><p>{selected.length} test(s) selected</p><p>Final total is calculated securely by the server.</p><small>Sample prices only. Actual availability and slot capacity must be confirmed with the lab.</small></aside></form></div></main>}
function PortalShell({title,children}){const {user,loading}=useAuth();if(loading)return <GenericPage title="Loading account..."/>;if(!user)return <GenericPage title="Please log in"><Link className="btn btn-primary" to="/login">Login</Link></GenericPage>;return <main className="page"><div className="container"><SectionTitle eyebrow={`${user.role.toUpperCase()} PORTAL`} title={title}/>{children}</div></main>}
function PatientPortal(){const [bookings,setBookings]=useState([]),[reports,setReports]=useState([]);useEffect(()=>{api.get("/bookings/mine").then(r=>setBookings(r.data.bookings)).catch(()=>{});api.get("/reports/mine").then(r=>setReports(r.data.reports)).catch(()=>{});},[]);return <PortalShell title="Your health activity"><div className="dashboard-grid"><div className="panel"><h3>My bookings</h3>{bookings.map(b=><div className="list-row" key={b._id}><div><b>{b.bookingCode}</b><small>{new Date(b.slotDate).toLocaleDateString()} · {b.collectionType}</small></div><span className="pill">{b.status}</span></div>)}{!bookings.length&&<p className="muted">No bookings yet.</p>}</div><div className="panel"><h3>My reports</h3>{reports.map(r=><div className="list-row" key={r._id}><span>{r.originalName||"Lab report"}</span><a href={`${import.meta.env.VITE_API_URL||"http://localhost:5000/api"}/reports/${r._id}/download`} target="_blank" rel="noreferrer">Download</a></div>)}{!reports.length&&<p className="muted">No reports available yet.</p>}</div></div></PortalShell>}
function Reports(){return <PortalShell title="Download your report"><div className="prose"><p>Sign in to your patient portal to see reports attached to your account. Reports are private and access is checked by the server.</p><Link className="btn btn-primary" to="/portal">Open patient portal</Link></div></PortalShell>}

function Staff() {
  const [bookings, setBookings] = useState([]);
  const [uploadingBooking, setUploadingBooking] = useState(null);

  const refresh = () =>
    api.get("/bookings")
      .then(r => setBookings(r.data.bookings))
      .catch(error => console.error("Could not load bookings:", error));

  useEffect(() => {
    refresh();
  }, []);

  const uploadReport = async (e, bookingId) => {
    e.preventDefault();

    const form = e.currentTarget;
    const formData = new FormData(form);
    const file = formData.get("report");

    if (!file || file.size === 0) {
      alert("Please select a report file.");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      alert("File size must not exceed 5 MB.");
      return;
    }

    try {
      setUploadingBooking(bookingId);

      await api.post(`/reports/${bookingId}`, formData);

      alert("Report uploaded successfully!");

      form.reset();
      await refresh();

    } catch (error) {
      alert(
        error.response?.data?.message ||
        "Could not upload report."
      );
    } finally {
      setUploadingBooking(null);
    }
  };

  return (
    <PortalShell title="Today's bookings and collections">
      <div className="panel staff-dashboard">

        {bookings.length === 0 ? (
          <p>No bookings available.</p>
        ) : (
          bookings.map(b => (
            <div className="list-row" key={b._id}>

              <div>
                <b>{b.bookingCode} · {b.patientName}</b>
                <small>{b.slotTime} · {b.collectionType}</small>
              </div>

              <select
                value={b.status}
                onChange={async e => {
                  try {
                    await api.patch(
                      `/bookings/${b._id}/status`,
                      { status: e.target.value }
                    );

                    await refresh();
                  } catch (error) {
                    alert(
                      error.response?.data?.message ||
                      "Could not update booking status."
                    );
                  }
                }}
              >
                {[
                  "Booked",
                  "Sample collected",
                  "Processing",
                  "Report ready",
                  "Completed",
                  "Cancelled"
                ].map(s => (
                  <option key={s}>{s}</option>
                ))}
              </select>

              {b.status === "Processing" && (
                <form
                  className="staff-report-upload"
                  onSubmit={e => uploadReport(e, b._id)}
                >
                  <label>Upload Patient Report</label>

                  <input
                    type="file"
                    name="report"
                    accept=".pdf,.jpg,.jpeg,.png"
                    required
                  />

                  <button
                    type="submit"
                    disabled={uploadingBooking === b._id}
                  >
                    {uploadingBooking === b._id
                      ? "Uploading..."
                      : "Upload Report"}
                  </button>

                  <small>
                    PDF, JPG or PNG · Maximum 5 MB
                  </small>
                </form>
              )}

            </div>
          ))
        )}

      </div>
    </PortalShell>
  );
}


function Admin() {
  const emptyTestForm = {
    name: "",
    code: "",
    category: "",
    sampleType: "Blood",
    preparation: "",
    fastingRequired: false,
    reportTime: "Within 24 hours (sample estimate)",
    price: "",
    salePrice: "",
    samplePrice: true
  };

  const [summary, setSummary] = useState(null);
  const [tests, setTests] = useState([]);
  const [packages, setPackages] = useState([]);

  const [branches, setBranches] = useState([]);
  
const [faqs, setFaqs] = useState([]);

const emptyFaqForm = {
  question: "",
  answer: ""
};

const emptyPostForm = {
  title: "",
  slug: "",
  excerpt: "",
  body: "",
  published: false
};

const [posts, setPosts] = useState([]);
const [postForm, setPostForm] = useState(emptyPostForm);
const [editingPost, setEditingPost] = useState(null);
const [savingPost, setSavingPost] = useState(false);
// Doctor-Patient Referral Management
const [doctors, setDoctors] = useState([]);
const [referralPatients, setReferralPatients] = useState([]);
const [selectedDoctor, setSelectedDoctor] = useState("");
const [selectedPatient, setSelectedPatient] = useState("");
const [savingReferral, setSavingReferral] = useState(false);


const [faqForm, setFaqForm] = useState(emptyFaqForm);
const [editingFaq, setEditingFaq] = useState(null);
const [savingFaq, setSavingFaq] = useState(false);


const emptyBranchForm = {
  name: "",
  address: "",
  phone: "",
  openingHours: "",
  mapUrl: ""
};

const [branchForm, setBranchForm] = useState(emptyBranchForm);
const [editingBranch, setEditingBranch] = useState(null);
const [savingBranch, setSavingBranch] = useState(false);

const emptyPackageForm = {
  name: "",
  description: "",
  tests: [],
  price: "",
  samplePrice: true
};

const [packageForm, setPackageForm] = useState(emptyPackageForm);
const [editingPackage, setEditingPackage] = useState(null);
const [savingPackage, setSavingPackage] = useState(false);
  const [bookings, setBookings] = useState([]);
  const [reportFiles, setReportFiles] = useState({});
  const [uploadingBooking, setUploadingBooking] = useState(null);

  const [testForm, setTestForm] = useState(emptyTestForm);
  const [editingTest, setEditingTest] = useState(null);
  const [savingTest, setSavingTest] = useState(false);
  const [testSearch, setTestSearch] = useState("");
const [testCategory, setTestCategory] = useState("All");

  const refreshBookings = async () => {
    try {
      const r = await api.get("/bookings");
      setBookings(r.data.bookings);
    } catch (error) {
      console.error("Could not load bookings:", error);
    }
  };

  const refreshTests = async () => {
    try {
      const r = await api.get("/tests");
      setTests(r.data.tests);
    } catch (error) {
      console.error("Could not load tests:", error);
    }
  };
  const refreshPackages = async () => {
  try {
    const r = await api.get("/admin/packages");
    setPackages(r.data.packages);
  } catch (error) {
    console.error("Could not load packages:", error);
  }
};
const refreshBranches = async () => {
  try {
    const r = await api.get("/admin/branches");
    setBranches(r.data.branches);
  } catch (error) {
    console.error("Could not load branches:", error);
  }
};

const refreshFaqs = async () => {
  try {
    const r = await api.get("/admin/faqs");
    setFaqs(r.data.faqs);
  } catch (error) {
    console.error("Could not load FAQs:", error);
  }
};

const refreshPosts = async () => {
  try {
    const r = await api.get("/admin/posts");
    setPosts(r.data.posts);
  } catch (error) {
    console.error("Could not load posts:", error);
  }
};
const refreshReferrals = async () => {
  try {
    const r = await api.get("/admin/referrals");

    setDoctors(r.data.doctors || []);
    setReferralPatients(r.data.patients || []);
  } catch (error) {
    console.error("Could not load referrals:", error);
  }
};
const assignPatient = async (e) => {
  e.preventDefault();

  if (!selectedDoctor || !selectedPatient) {
    alert("Please select both a doctor and a patient.");
    return;
  }

  try {
    setSavingReferral(true);

    await api.post("/admin/referrals", {
      doctorId: selectedDoctor,
      patientId: selectedPatient
    });

    alert("Patient assigned successfully!");

    setSelectedPatient("");
    await refreshReferrals();
  } catch (error) {
    alert(error.response?.data?.message || "Could not assign patient.");
  } finally {
    setSavingReferral(false);
  }
};

const removeReferral = async (doctorId, patientId) => {
  if (!window.confirm("Are you sure you want to remove this referral?")) {
    return;
  }

  try {
    await api.delete(`/admin/referrals/${doctorId}/${patientId}`);

    alert("Referral removed successfully!");
    await refreshReferrals();
  } catch (error) {
    alert(error.response?.data?.message || "Could not remove referral.");
  }
};

const handlePostChange = (e) => {
  const { name, value, type, checked } = e.target;

  setPostForm(prev => ({
    ...prev,
    [name]: type === "checkbox" ? checked : value
  }));
};

const savePost = async (e) => {
  e.preventDefault();

  try {
    setSavingPost(true);

    if (editingPost) {
      await api.patch(`/admin/posts/${editingPost}`, postForm);
      alert("Post updated successfully!");
    } else {
      await api.post("/admin/posts", postForm);
      alert("New post added successfully!");
    }

    setPostForm(emptyPostForm);
    setEditingPost(null);
    await refreshPosts();
  } catch (error) {
    alert(error.response?.data?.message || "Could not save post.");
  } finally {
    setSavingPost(false);
  }
};

const startEditingPost = (post) => {
  setEditingPost(post._id);

  setPostForm({
    title: post.title || "",
    slug: post.slug || "",
    excerpt: post.excerpt || "",
    body: post.body || "",
    published: post.published ?? false
  });
};

const cancelPostEditing = () => {
  setEditingPost(null);
  setPostForm(emptyPostForm);
};

const unpublishPost = async (postId) => {
  if (!window.confirm("Are you sure you want to unpublish this post?")) {
    return;
  }

  try {
    await api.delete(`/admin/posts/${postId}`);
    alert("Post unpublished successfully!");
    await refreshPosts();
  } catch (error) {
    alert(error.response?.data?.message || "Could not unpublish post.");
  }
};



const handleFaqChange = (e) => {
  const { name, value } = e.target;

  setFaqForm(prev => ({
    ...prev,
    [name]: value
  }));
};

const saveFaq = async (e) => {
  e.preventDefault();

  try {
    setSavingFaq(true);

    if (editingFaq) {
      await api.patch(`/admin/faqs/${editingFaq}`, faqForm);
      alert("FAQ updated successfully!");
    } else {
      await api.post("/admin/faqs", faqForm);
      alert("New FAQ added successfully!");
    }

    setFaqForm(emptyFaqForm);
    setEditingFaq(null);

    await refreshFaqs();

  } catch (error) {
    alert(error.response?.data?.message || "Could not save FAQ.");
  } finally {
    setSavingFaq(false);
  }
};

const startEditingFaq = (faq) => {
  setEditingFaq(faq._id);

  setFaqForm({
    question: faq.question || "",
    answer: faq.answer || ""
  });
};

const cancelFaqEditing = () => {
  setEditingFaq(null);
  setFaqForm(emptyFaqForm);
};

const deactivateFaq = async (faqId) => {
  if (!window.confirm("Are you sure you want to deactivate this FAQ?")) {
    return;
  }

  try {
    await api.delete(`/admin/faqs/${faqId}`);
    alert("FAQ deactivated successfully!");
    await refreshFaqs();
  } catch (error) {
    alert(error.response?.data?.message || "Could not deactivate FAQ.");
  }
};




const handleBranchChange = (e) => {
  const { name, value } = e.target;

  setBranchForm(prev => ({
    ...prev,
    [name]: value
  }));
};

const saveBranch = async (e) => {
  e.preventDefault();

  try {
    setSavingBranch(true);

    if (editingBranch) {
      await api.patch(`/admin/branches/${editingBranch}`, branchForm);
      alert("Branch updated successfully!");
    } else {
      await api.post("/admin/branches", branchForm);
      alert("New branch added successfully!");
    }

    setBranchForm(emptyBranchForm);
    setEditingBranch(null);

    await refreshBranches();

  } catch (error) {
    alert(error.response?.data?.message || "Could not save branch.");
  } finally {
    setSavingBranch(false);
  }
};

const startEditingBranch = (branch) => {
  setEditingBranch(branch._id);

  setBranchForm({
    name: branch.name || "",
    address: branch.address || "",
    phone: branch.phone || "",
    openingHours: branch.openingHours || "",
    mapUrl: branch.mapUrl || ""
  });
};

const cancelBranchEditing = () => {
  setEditingBranch(null);
  setBranchForm(emptyBranchForm);
};

const deactivateBranch = async (branchId) => {
  if (!window.confirm("Are you sure you want to deactivate this branch?")) {
    return;
  }

  try {
    await api.delete(`/admin/branches/${branchId}`);
    alert("Branch deactivated successfully!");
    await refreshBranches();
  } catch (error) {
    alert(error.response?.data?.message || "Could not deactivate branch.");
  }
};



  const refreshSummary = async () => {
    try {
      const r = await api.get("/admin/summary");
      setSummary(r.data);
    } catch (error) {
      console.error("Could not load summary:", error);
    }
  };

  useEffect(() => {
  refreshSummary();
  refreshTests();
  refreshBookings();
  refreshPackages();
  refreshBranches();
  refreshFaqs();
  refreshPosts();
  refreshReferrals();
}, []);

  const updateStatus = async (bookingId, status) => {
    try {
      await api.patch(`/bookings/${bookingId}/status`, { status });
      await refreshBookings();
    } catch (error) {
      alert(error.response?.data?.message || "Could not update booking status.");
    }
  };

  const uploadReport = async (bookingId) => {
    const file = reportFiles[bookingId];

    if (!file) {
      alert("Please select a report file first.");
      return;
    }

    const formData = new FormData();
    formData.append("report", file);

    try {
      setUploadingBooking(bookingId);

      const response = await api.post(`/reports/${bookingId}`, formData);

      alert(response.data.message || "Report uploaded successfully!");

      setReportFiles(prev => ({
        ...prev,
        [bookingId]: null
      }));

      await refreshBookings();
      await refreshSummary();
    } catch (error) {
      alert(error.response?.data?.message || "Report upload failed.");
    } finally {
      setUploadingBooking(null);
    }
  };

  const handleTestChange = (e) => {
    const { name, value, type, checked } = e.target;

    setTestForm(prev => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value
    }));
  };

  const saveTest = async (e) => {
    e.preventDefault();

    try {
      setSavingTest(true);

      const data = {
        ...testForm,
        price: Number(testForm.price),
        salePrice: testForm.salePrice === ""
          ? undefined
          : Number(testForm.salePrice)
      };

      if (editingTest) {
        await api.patch(`/admin/tests/${editingTest}`, data);
        alert("Test updated successfully!");
      } else {
        await api.post("/admin/tests", data);
        alert("New test added successfully!");
      }

      setTestForm(emptyTestForm);
      setEditingTest(null);

      await refreshTests();
      await refreshSummary();
    } catch (error) {
      alert(error.response?.data?.message || "Could not save test.");
    } finally {
      setSavingTest(false);
    }
  };

  const startEditing = (test) => {
    setEditingTest(test._id);

    setTestForm({
      name: test.name || "",
      code: test.code || "",
      category: test.category || "",
      sampleType: test.sampleType || "Blood",
      preparation: test.preparation || "",
      fastingRequired: test.fastingRequired || false,
      reportTime: test.reportTime || "",
      price: test.price ?? "",
      salePrice: test.salePrice ?? "",
      samplePrice: test.samplePrice ?? true
    });
  };

  const cancelEditing = () => {
    setEditingTest(null);
    setTestForm(emptyTestForm);
  };

  const deactivateTest = async (testId) => {
  if (!window.confirm("Are you sure you want to deactivate this test?")) {
    return;
  }

  try {
    await api.delete(`/admin/tests/${testId}`);
    alert("Test deactivated successfully!");
    await refreshTests();
  } catch (error) {
    alert(error.response?.data?.message || "Could not deactivate test.");
  }
};
const handlePackageChange = (e) => {
  const { name, value } = e.target;

  setPackageForm(prev => ({
    ...prev,
    [name]: value
  }));
};

const togglePackageTest = (testId) => {
  setPackageForm(prev => ({
    ...prev,
    tests: prev.tests.includes(testId)
      ? prev.tests.filter(id => id !== testId)
      : [...prev.tests, testId]
  }));
};
const savePackage = async (e) => {
  e.preventDefault();

  if (packageForm.tests.length === 0) {
    alert("Please select at least one test for this package.");
    return;
  }

  try {
    setSavingPackage(true);

    const data = {
      ...packageForm,
      price: Number(packageForm.price)
    };

    if (editingPackage) {
      await api.patch(`/admin/packages/${editingPackage}`, data);
      alert("Package updated successfully!");
    } else {
      await api.post("/admin/packages", data);
      alert("New package added successfully!");
    }

    setPackageForm(emptyPackageForm);
    setEditingPackage(null);

    await refreshPackages();
    await refreshSummary();
  } catch (error) {
    alert(error.response?.data?.message || "Could not save package.");
  } finally {
    setSavingPackage(false);
  }
};
const startEditingPackage = (pkg) => {
  setEditingPackage(pkg._id);

  setPackageForm({
    name: pkg.name || "",
    description: pkg.description || "",
    tests: pkg.tests?.map(test =>
      typeof test === "string" ? test : test._id
    ) || [],
    price: pkg.price ?? "",
    samplePrice: pkg.samplePrice ?? true
  });
};

const cancelPackageEditing = () => {
  setEditingPackage(null);
  setPackageForm(emptyPackageForm);
};
const deactivatePackage = async (packageId) => {
  if (!window.confirm("Are you sure you want to deactivate this package?")) {
    return;
  }

  try {
    await api.delete(`/admin/packages/${packageId}`);
    alert("Package deactivated successfully!");
    await refreshPackages();
  } catch (error) {
    alert(error.response?.data?.message || "Could not deactivate package.");
  }
};
const categories = [
  "All",
  ...new Set(tests.map(test => test.category).filter(Boolean))
];

const filteredTests = tests.filter(test => {
  const search = testSearch.toLowerCase();

  const matchesSearch =
    (test.name || "").toLowerCase().includes(search) ||
    (test.code || "").toLowerCase().includes(search);

  const matchesCategory =
    testCategory === "All" || test.category === testCategory;

  return matchesSearch && matchesCategory;
});
  return (
    <PortalShell title="Laboratory administration">

      <div className="stats">
        {summary && [
          ["Bookings", summary.bookings],
          ["Tests", summary.tests],
          ["Reports", summary.reports],
          ["Revenue estimate", money(summary.revenueEstimate)]
        ].map(([k, v]) => (
          <div className="stat" key={k}>
            <small>{k}</small>
            <b>{v}</b>
          </div>
        ))}
      </div>

      {/* Booking Management */}

      <div className="panel test-management">
        <h3>All patient bookings</h3>
        <p className="muted">
          View booking details and update booking status.
        </p>

        {bookings.length === 0 ? (
          <p>No bookings found.</p>
        ) : (
          bookings.map(b => (
            <div className="list-row" key={b._id}>
              <div>
                <b>
                  {b.bookingCode} · {b.patientName || b.patient?.name || "Patient"}
                </b>

                <small>
                  Phone: {b.patientPhone || b.patient?.phone || "Not provided"}
                </small>

                <small>
                  Date: {b.slotDate ? new Date(b.slotDate).toLocaleDateString() : "Not set"}
                  {" · "}
                  Time: {b.slotTime || "Not set"}
                </small>

                <small>
                  Collection: {b.collectionType === "home" ? "Home collection" : "Branch"}
                  {b.branch?.name ? ` · ${b.branch.name}` : ""}
                </small>

                {b.address && <small>Address: {b.address}</small>}

                <small>
                  Tests: {b.tests?.map(t => t.name).join(", ") || "None"}
                </small>

                <small>
                  Packages: {b.packages?.map(p => p.name).join(", ") || "None"}
                </small>

                <small>Total: {money(b.total)}</small>

                <div>
                  <label>Upload patient report:</label>

                  <input
                    type="file"
                    accept=".pdf,.jpg,.jpeg,.png"
                    onChange={e =>
                      setReportFiles(prev => ({
                        ...prev,
                        [b._id]: e.target.files?.[0] || null
                      }))
                    }
                  />

                  <button
                    type="button"
                    disabled={uploadingBooking === b._id}
                    onClick={() => uploadReport(b._id)}
                  >
                    {uploadingBooking === b._id ? "Uploading..." : "Upload Report"}
                  </button>
                </div>
              </div>

              <select
                value={b.status}
                onChange={e => updateStatus(b._id, e.target.value)}
              >
                {[
                  "Booked",
                  "Sample collected",
                  "Processing",
                  "Report ready",
                  "Completed",
                  "Cancelled"
                ].map(status => (
                  <option key={status} value={status}>
                    {status}
                  </option>
                ))}
              </select>
            </div>
          ))
        )}
      </div>

      {/* Test Management */}

      <div className="panel test-management">
        <h3>Test catalog management</h3>
        <p className="muted">
          Add new laboratory tests or update existing tests.
        </p>

        <form onSubmit={saveTest}>

          <h4>{editingTest ? "Edit test" : "Add new test"}</h4>

          <label>Test name</label>
          <input
            name="name"
            value={testForm.name}
            onChange={handleTestChange}
            placeholder="e.g. Complete Blood Count"
            required
          />

          <label>Test code</label>
          <input
            name="code"
            value={testForm.code}
            onChange={handleTestChange}
            placeholder="e.g. CBC001"
            required
          />

          <label>Category</label>
          <input
            name="category"
            value={testForm.category}
            onChange={handleTestChange}
            placeholder="e.g. Blood Test"
            required
          />

          <label>Sample type</label>
          <input
            name="sampleType"
            value={testForm.sampleType}
            onChange={handleTestChange}
            placeholder="e.g. Blood"
          />

          <label>Preparation instructions</label>
          <textarea
            name="preparation"
            value={testForm.preparation}
            onChange={handleTestChange}
            placeholder="Enter preparation instructions"
          />

          <label>
            <input
              type="checkbox"
              name="fastingRequired"
              checked={testForm.fastingRequired}
              onChange={handleTestChange}
            />
            Fasting required
          </label>

          <label>Report time</label>
          <input
            name="reportTime"
            value={testForm.reportTime}
            onChange={handleTestChange}
            placeholder="e.g. Within 24 hours"
          />

          <label>Original price (Rs.)</label>
          <input
            type="number"
            name="price"
            value={testForm.price}
            onChange={handleTestChange}
            min="0"
            required
          />

          <label>Sale price (Rs.)</label>
          <input
            type="number"
            name="salePrice"
            value={testForm.salePrice}
            onChange={handleTestChange}
            min="0"
            placeholder="Optional"
          />

          <label>
            <input
              type="checkbox"
              name="samplePrice"
              checked={testForm.samplePrice}
              onChange={handleTestChange}
            />
            Sample price
          </label>

          <div>
            <button type="submit" disabled={savingTest}>
              {savingTest
                ? "Saving..."
                : editingTest
                  ? "Update Test"
                  : "Add Test"}
            </button>

            {editingTest && (
              <button type="button" onClick={cancelEditing}>
                Cancel
              </button>
            )}
          </div>
        </form>
      </div>

      
{/* Existing Test List */}

<div className="panel test-management">
  <h3>Existing laboratory tests ({filteredTests.length})</h3>

  <p className="muted">
    Search and filter your laboratory tests.
  </p>

  {/* Search and category filters */}

  <div className="test-filters">
    <input
      type="text"
      placeholder="Search by test name or code..."
      value={testSearch}
      onChange={e => setTestSearch(e.target.value)}
    />

    <select
      value={testCategory}
      onChange={e => setTestCategory(e.target.value)}
    >
      {categories.map(category => (
        <option key={category} value={category}>
          {category}
        </option>
      ))}
    </select>

    <button
      type="button"
      onClick={() => {
        setTestSearch("");
        setTestCategory("All");
      }}
    >
      Clear Filters
    </button>
  </div>

  {/* Filtered tests */}

  {filteredTests.length === 0 ? (
    <p>No matching tests found.</p>
  ) : (
    filteredTests.map(t => (
      <div className="list-row" key={t._id}>
        <div>
          <b>{t.name}</b>

          <small>Code: {t.code} · Category: {t.category}</small>
          <small>Sample: {t.sampleType}</small>

          <small>
            Price: {money(t.price)}
            {t.salePrice != null ? ` · Sale: ${money(t.salePrice)}` : ""}
          </small>

          <small>
            Fasting: {t.fastingRequired ? "Required" : "Not required"}
          </small>

          <button
            type="button"
            onClick={() => startEditing(t)}
          >
            Edit
          </button>

          <button
            type="button"
            onClick={() => deactivateTest(t._id)}
          >
            Deactivate
          </button>
        </div>
      </div>
    ))
  )}
</div>
{/* Package Management */}

<div className="panel test-management">
  <h3>Package Management</h3>
  <p className="muted">
    Create packages by selecting laboratory tests and setting a package price.
  </p>

  <form onSubmit={savePackage}>
    <h4>{editingPackage ? "Edit Package" : "Add New Package"}</h4>

    <label>Package name</label>
    <input
      name="name"
      value={packageForm.name}
      onChange={handlePackageChange}
      placeholder="e.g. Complete Health Package"
      required
    />

    <label>Description</label>
    <textarea
      name="description"
      value={packageForm.description}
      onChange={handlePackageChange}
      placeholder="Enter package description"
    />

    <label>Package price (Rs.)</label>
    <input
      type="number"
      name="price"
      value={packageForm.price}
      onChange={handlePackageChange}
      min="0"
      required
    />

    <label>
      <input
        type="checkbox"
        checked={packageForm.samplePrice}
        onChange={e =>
          setPackageForm(prev => ({
            ...prev,
            samplePrice: e.target.checked
          }))
        }
      />
      Sample price
    </label>

    <h4>Select tests for this package</h4>

    {tests.length === 0 ? (
      <p>No active tests available.</p>
    ) : (
      tests.map(test => (
        <label key={test._id} style={{ display: "block" }}>
          <input
            type="checkbox"
            checked={packageForm.tests.includes(test._id)}
            onChange={() => togglePackageTest(test._id)}
          />
          {test.name} — {money(test.price)}
        </label>
      ))
    )}

    <button type="submit" disabled={savingPackage}>
      {savingPackage
        ? "Saving..."
        : editingPackage
          ? "Update Package"
          : "Add Package"}
    </button>

    {editingPackage && (
      <button type="button" onClick={cancelPackageEditing}>
        Cancel
      </button>
    )}
  </form>

  <hr />

  <h4>Existing Packages ({packages.length})</h4>

  {packages.length === 0 ? (
    <p>No packages found.</p>
  ) : (
    packages.map(pkg => (
      <div className="list-row" key={pkg._id}>
        <div>
          <b>{pkg.name}</b>

          <small>{pkg.description || "No description"}</small>

          <small>
            Price: {money(pkg.price)}
          </small>

          <small>
            Tests: {pkg.tests?.map(test => test.name).join(", ") || "None"}
          </small>

          <small>
            Status: {pkg.active ? "Active" : "Inactive"}
          </small>

          {pkg.active && (
            <>
              <button
                type="button"
                onClick={() => startEditingPackage(pkg)}
              >
                Edit
              </button>

              <button
                type="button"
                onClick={() => deactivatePackage(pkg._id)}
              >
                Deactivate
              </button>
            </>
          )}
        </div>
      </div>
    ))
  )}
</div>


<div className="panel branch-management">
  <h2>Branch Management</h2>

  <form onSubmit={saveBranch}>
    <h3>{editingBranch ? "Update Branch" : "Add New Branch"}</h3>

    <input
      name="name"
      placeholder="Branch Name"
      value={branchForm.name}
      onChange={handleBranchChange}
      required
    />

    <input
      name="address"
      placeholder="Branch Address"
      value={branchForm.address}
      onChange={handleBranchChange}
    />

    <input
      name="phone"
      placeholder="Phone Number"
      value={branchForm.phone}
      onChange={handleBranchChange}
    />

    <input
      name="openingHours"
      placeholder="Opening Hours"
      value={branchForm.openingHours}
      onChange={handleBranchChange}
    />

    <input
      name="mapUrl"
      placeholder="Google Maps URL"
      value={branchForm.mapUrl}
      onChange={handleBranchChange}
    />

    <button type="submit" disabled={savingBranch}>
      {savingBranch
        ? "Saving..."
        : editingBranch
        ? "Update Branch"
        : "Add Branch"}
    </button>

    {editingBranch && (
      <button type="button" onClick={cancelBranchEditing}>
        Cancel
      </button>
    )}
  </form>

  <hr />

  <h3>Existing Branches</h3>

  {branches.length === 0 ? (
    <p>No branches found.</p>
  ) : (
    branches.map(branch => (
      <div className="list-row" key={branch._id}>
        <div>
          <b>{branch.name}</b>

          <small>{branch.address || "No address"}</small>
          <small>Phone: {branch.phone || "Not provided"}</small>
          <small>Opening Hours: {branch.openingHours || "Not provided"}</small>
          <small>Status: {branch.active ? "Active" : "Inactive"}</small>

          {branch.active && (
            <>
              <button
                type="button"
                onClick={() => startEditingBranch(branch)}
              >
                Edit
              </button>

              <button
                type="button"
                onClick={() => deactivateBranch(branch._id)}
              >
                Deactivate
              </button>
            </>
          )}
        </div>
      </div>
    ))
  )}
</div>

<div className="panel faq-management">
  <h2>FAQ Management</h2>

  <form onSubmit={saveFaq}>
    <h3>{editingFaq ? "Update FAQ" : "Add New FAQ"}</h3>

    <input
      name="question"
      placeholder="Enter FAQ Question"
      value={faqForm.question}
      onChange={handleFaqChange}
      required
    />

    <textarea
      name="answer"
      placeholder="Enter FAQ Answer"
      value={faqForm.answer}
      onChange={handleFaqChange}
      required
      rows="4"
    />

    <button type="submit" disabled={savingFaq}>
      {savingFaq
        ? "Saving..."
        : editingFaq
        ? "Update FAQ"
        : "Add FAQ"}
    </button>

    {editingFaq && (
      <button type="button" onClick={cancelFaqEditing}>
        Cancel
      </button>
    )}
  </form>

  <hr />

  <h3>Existing FAQs</h3>

  {faqs.length === 0 ? (
    <p>No FAQs found.</p>
  ) : (
    faqs.map(faq => (
      <div className="list-row" key={faq._id}>
        <div>
          <b>{faq.question}</b>
          <p>{faq.answer}</p>

          <small>
            Status: {faq.active ? "Active" : "Inactive"}
          </small>

          {faq.active && (
            <>
              <button
                type="button"
                onClick={() => startEditingFaq(faq)}
              >
                Edit
              </button>

              <button
                type="button"
                onClick={() => deactivateFaq(faq._id)}
              >
                Deactivate
              </button>
            </>
          )}
        </div>
      </div>
    ))
  )}
</div>

<div className="panel post-management">
  <h2>Blog / Post Management</h2>

  <form onSubmit={savePost}>
    <h3>{editingPost ? "Update Post" : "Add New Post"}</h3>

    <input
      name="title"
      placeholder="Post Title"
      value={postForm.title}
      onChange={handlePostChange}
      required
    />

    <input
      name="slug"
      placeholder="URL Slug (e.g. benefits-of-blood-tests)"
      value={postForm.slug}
      onChange={handlePostChange}
      required
    />

    <textarea
      name="excerpt"
      placeholder="Short Description"
      value={postForm.excerpt}
      onChange={handlePostChange}
      rows="3"
    />

    <textarea
      name="body"
      placeholder="Write Full Blog Content"
      value={postForm.body}
      onChange={handlePostChange}
      rows="7"
      required
    />

    <label>
      <input
        type="checkbox"
        name="published"
        checked={postForm.published}
        onChange={handlePostChange}
      />
      Publish this post
    </label>

    <button type="submit" disabled={savingPost}>
      {savingPost
        ? "Saving..."
        : editingPost
        ? "Update Post"
        : "Add Post"}
    </button>

    {editingPost && (
      <button type="button" onClick={cancelPostEditing}>
        Cancel
      </button>
    )}
  </form>

  <hr />

  <h3>Existing Posts</h3>

  {posts.length === 0 ? (
    <p>No posts found.</p>
  ) : (
    posts.map(post => (
      <div className="list-row" key={post._id}>
        <div>
          <b>{post.title}</b>
          <p>{post.excerpt}</p>
          <small>Slug: {post.slug}</small>
          <small>
            Status: {post.published ? "Published" : "Unpublished"}
          </small>

          <button
            type="button"
            onClick={() => startEditingPost(post)}
          >
            Edit
          </button>

          {post.published && (
            <button
              type="button"
              onClick={() => unpublishPost(post._id)}
            >
              Unpublish
            </button>
          )}
        </div>
      </div>
    ))
  )}
</div>
<div className="panel referral-management">
  <h2>Doctor-Patient Referral Management</h2>

  <form onSubmit={assignPatient}>
    <h3>Assign Patient to Doctor</h3>

    <label>Select Doctor</label>
    <select
      value={selectedDoctor}
      onChange={e => setSelectedDoctor(e.target.value)}
      required
    >
      <option value="">Select Doctor</option>
      {doctors.map(doctor => (
        <option key={doctor._id} value={doctor._id}>
          {doctor.name} ({doctor.email})
        </option>
      ))}
    </select>

    <label>Select Patient</label>
    <select
      value={selectedPatient}
      onChange={e => setSelectedPatient(e.target.value)}
      required
    >
      <option value="">Select Patient</option>
      {referralPatients.map(patient => (
  <option key={patient._id} value={patient._id}>
    {patient.name} ({patient.email})
  </option>
))}
    </select>

    <button type="submit" disabled={savingReferral}>
      {savingReferral ? "Assigning..." : "Assign Patient"}
    </button>
  </form>

  <hr />

  <h3>Existing Doctor Referrals</h3>

  {doctors.length === 0 ? (
    <p>No active doctors found.</p>
  ) : (
    doctors.map(doctor => (
      <div className="list-row" key={doctor._id}>
        <div>
          <b>{doctor.name}</b>
          <small>{doctor.email}</small>

          {doctor.referredPatients?.length === 0 ? (
            <p>No patients assigned.</p>
          ) : (
            doctor.referredPatients?.map(patient => (
              <div key={patient._id}>
                <p>
                  {patient.name} ({patient.email})
                </p>

                <button
                  type="button"
                  onClick={() => removeReferral(doctor._id, patient._id)}
                >
                  Remove Referral
                </button>
              </div>
            ))
          )}
        </div>
      </div>
    ))
  )}
</div>


    </PortalShell>
  );
}


function Doctor() {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const refreshReports = async () => {
    try {
      setLoading(true);
      setError("");

      const r = await api.get("/doctor/reports");
      setReports(r.data.reports || []);
    } catch (err) {
      setError(err.response?.data?.message || "Could not load referred patient reports.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    refreshReports();
  }, []);

  const downloadReport = async (report) => {
    try {
      const response = await api.get(
        `/reports/${report._id}/download`,
        { responseType: "blob" }
      );

      const url = window.URL.createObjectURL(response.data);
      const link = document.createElement("a");

      link.href = url;
      link.download = report.originalName || "lab-report";
      document.body.appendChild(link);
      link.click();
      link.remove();

      window.URL.revokeObjectURL(url);
    } catch (err) {
      alert("Could not download this report.");
    }
  };

  return (
    <PortalShell title="Referred Patient Reports">
  <div className="doctor-dashboard">
      <div className="panel">
        <h2>Referred Patient Reports</h2>

        <button type="button" onClick={refreshReports}>
          Refresh Reports
        </button>

        {loading ? (
          <p>Loading reports...</p>
        ) : error ? (
          <p>{error}</p>
        ) : reports.length === 0 ? (
          <p>No reports are currently available for your referred patients.</p>
        ) : (
          reports.map(report => (
            <div className="list-row" key={report._id}>
              <div>
                <b>{report.patient?.name || "Patient"}</b>
                <p>{report.patient?.email}</p>
                <small>
                  Booking: {report.booking?.bookingCode || "N/A"}
                </small>
                <small>
                  Report: {report.originalName}
                </small>
              </div>

              <button
                type="button"
                onClick={() => downloadReport(report)}
              >
                Download Report
              </button>
            </div>
          ))
        )}
      </div>
        </div>
    </PortalShell>
  );
}


function AIChat() {
  const { user } = useAuth();

  const [message, setMessage] = useState("");
  const [answer, setAnswer] = useState("");
  const [loading, setLoading] = useState(false);

  const send = async (e) => {
    e.preventDefault();

    if (!user) {
      setAnswer("Please log in to use the assistant.");
      return;
    }

    if (!message.trim() || loading) return;

    setLoading(true);
    setAnswer("");

    try {
      const r = await api.post("/ai/chat", {
        message: message.trim()
      });

      setAnswer(r.data.reply || "Please contact the lab for help.");
      setMessage("");
    } catch {
      setAnswer("The assistant is temporarily unavailable. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="chat-widget">
      <details className="ai-chat">
        <summary className="ai-chat-header">
          <MessageCircle size={20} />
          <span>Ask Anmol AI</span>
          <span className="ai-status">Online</span>
        </summary>

        <div className="ai-chat-panel">

          <div className="ai-chat-welcome">
            <div className="ai-avatar">
              <MessageCircle size={22} />
            </div>

            <div>
              <h3>Anmol Health Care Lab</h3>
              <p>How can I help you today?</p>
            </div>
          </div>

          <div className="ai-chat-content">

            {answer && (
              <div className="ai-answer-section">
                <div className="ai-message-label">
                  Anmol AI
                </div>

                <div className="ai-answer">
                  {answer}
                </div>
              </div>
            )}

            {loading && (
              <div className="ai-loading">
                <span></span>
                <span></span>
                <span></span>
                <small>Preparing your answer...</small>
              </div>
            )}

          </div>

          <form className="ai-chat-form" onSubmit={send}>
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Ask about tests, preparation or booking..."
              rows={2}
              maxLength={1000}
              required
              disabled={loading}
            />

            <button
              type="submit"
              className="btn btn-primary ai-send-btn"
              disabled={loading || !message.trim()}
            >
              {loading ? "Sending..." : "Send"}
            </button>
          </form>

          <p className="ai-disclaimer">
            This assistant provides general laboratory information,
            not medical advice.
          </p>

        </div>
      </details>
    </div>
  );
}
function App(){return <AuthProvider><Layout><Routes><Route path="/" element={<Home/>}/><Route path="/about" element={<About/>}/><Route path="/tests" element={<Tests/>}/><Route path="/packages" element={<Packages/>}/><Route path="/home-sampling" element={<HomeSampling/>}/><Route path="/branches" element={<Branches/>}/><Route path="/doctors" element={<Doctors/>}/><Route path="/blog" element={<Blog/>}/><Route path="/faq" element={<FAQ/>}/><Route path="/contact" element={<Contact/>}/><Route path="/login" element={<Login/>}/><Route path="/register" element={<Register/>}/><Route path="/book" element={<Book/>}/><Route path="/portal" element={<PatientPortal/>}/><Route path="/reports" element={<Reports/>}/><Route path="/staff" element={<Staff/>}/><Route path="/admin" element={<Admin/>}/><Route path="/doctor" element={<Doctor/>}/><Route path="/privacy" element={<GenericPage title="Privacy policy"><p>Replace this template with a policy reviewed and approved by the client.</p></GenericPage>}/><Route path="*" element={<GenericPage title="Page not found"><Link to="/" className="btn btn-primary">Return home</Link></GenericPage>}/></Routes><AIChat/></Layout></AuthProvider>}
export default App;
