import { useState } from "react";

// ─── DESIGN TOKENS ────────────────────────────────────────────────────────────
// Palette: Deep forest green (#0A3D2E) anchors trust + local roots.
// Saffron (#F5A623) pulls from Kenyan market energy — maize, sunset, vitenge fabric.
// Crisp white surfaces. Slate text. Coral for alerts only.
// Signature element: category tiles use a diagonal color-slash accent,
// echoing the bold fabric cuts seen in Gikomba market stalls.

const T = {
  primary: "#0A3D2E",
  primaryMid: "#145C44",
  primaryLight: "#1E7A5A",
  accent: "#F5A623",
  accentSoft: "#FFF8E7",
  accentDark: "#C4841A",
  coral: "#E84040",
  coralSoft: "#FFF0F0",
  success: "#1E9B5A",
  successSoft: "#E8F5EE",
  surface: "#F6F7F5",
  card: "#FFFFFF",
  text: "#1A2320",
  textMid: "#4A5550",
  textMuted: "#8A9490",
  border: "#E2E8E4",
  borderStrong: "#C8D4CF",
  overlay: "rgba(10,61,46,0.55)",
};

// ─── TRANSLATIONS ─────────────────────────────────────────────────────────────
const LANG = {
  en: {
    appTagline: "Your local market, online.",
    searchPlaceholder: "Search in",
    allTowns: "All Towns",
    categories: "Categories",
    nearYou: "Near You",
    seeAll: "See All",
    conciergeTitle: "Can't find what you need?",
    conciergeDesc: "Tell us what you want — we'll find it for you within 3–6 hours.",
    conciergeBtn: "Make a Request",
    conciergeLabel: "Special Request",
    conciergeInput: "e.g. Newborn socks, size 0-3 months, budget Ksh 300. I'm in Nakuru CBD.",
    conciergeTown: "Your Town",
    conciergeSubmit: "Send Request",
    conciergeSuccess: "Request Received!",
    conciergeSuccessDesc: "We'll call or WhatsApp you within 3–6 hours.",
    conciergeAnother: "Make Another Request",
    verified: "Verified",
    boosted: "Boosted",
    buyNow: "Buy Now",
    buyerProtection: "Buyer protection fee",
    total: "Total",
    orderSummary: "Order Summary",
    item: "Item",
    payViaMpesa: "Pay via M-Pesa",
    mpesaSteps: "Lipa Na M-Pesa instructions",
    mpesaNumber: "Your M-Pesa number",
    mpesaCode: "M-Pesa confirmation code",
    confirmPayment: "Confirm Payment",
    orderPlaced: "Order Placed!",
    orderDesc: "The seller has been notified. You'll receive your item soon. Confirm receipt to release payment to seller.",
    orderId: "Order ID",
    backHome: "Back to Home",
    postListing: "Post a Listing",
    itemTitle: "Title",
    itemTitlePlaceholder: "e.g. Levi's Jeans Waist 34 Grade A",
    price: "Price (Ksh)",
    description: "Description",
    descPlaceholder: "Describe clearly — condition, size, colour, defects if any...",
    category: "Category",
    town: "Town",
    boostListing: "Boost this listing",
    boostDesc: "Appear at the top of search for 7 days — Ksh 100",
    publish: "Publish",
    publishFree: "Publish — Free",
    publishBoosted: "Publish + Boost — Ksh 100",
    listingNote: "All listings are reviewed before going live.",
    chatWith: "Chat with",
    chatPlaceholder: "Type a message...",
    chatPrivacyNote: "Phone numbers stay private. Chat safely inside KaziApa.",
    chatLimit: "You've reached your 5 free messages today.",
    upgradeNow: "Upgrade now →",
    myListings: "My Listings",
    myOrders: "My Orders",
    myChats: "My Chats",
    verifiedBadge: "Get Verified Seller Badge",
    verifiedBadgeDesc: "Build buyer trust. Show ✓ on all your listings.",
    verifiedBadgePrice: "Ksh 200 one-time",
    upgradePlan: "Upgrade Plan",
    settings: "Settings",
    language: "Language",
    switchLang: "Switch to Kiswahili",
    trust: "KaziApa protects you: Money is held securely until you confirm receipt.",
    sellerDash: "Seller Dashboard",
    totalSales: "Total Sales",
    activeListings: "Active Listings",
    pendingOrders: "Pending Orders",
    earnings: "Earnings (Ksh)",
    respondTimer: "Respond within",
    markSold: "Mark as Sold",
    confirmAvail: "Confirm Available",
    adminPanel: "Admin Panel",
    disputes: "Disputes",
    pendingVerif: "Pending Verification",
    flagged: "Flagged Sellers",
    resolve: "Resolve",
    approve: "Approve",
    suspend: "Suspend",
    upgradeTitle: "Unlock More on KaziApa",
    upgradeSubtitle: "Free plan: 5 messages/day. Upgrade for more.",
    daily: "Daily Pass",
    weekly: "Weekly Plan",
    dailyPrice: "Ksh 20 / day",
    weeklyPrice: "Ksh 50 / week",
    maybeLater: "Maybe Later",
    freePlan: "Free Plan",
    home: "Home",
    browse: "Browse",
    post: "Post",
    profile: "Profile",
    seller: "Seller",
    admin: "Admin",
    noResults: "Nothing here yet.",
    noResultsDesc: "Try a different town or make a special request.",
    stepVerify: "Review",
    stepPay: "Pay",
    stepConfirm: "Confirm",
    allCategories: "All",
  },
  sw: {
    appTagline: "Soko lako la karibu, mtandaoni.",
    searchPlaceholder: "Tafuta katika",
    allTowns: "Miji Yote",
    categories: "Aina",
    nearYou: "Karibu Nawe",
    seeAll: "Ona Zote",
    conciergeTitle: "Hupati unachotafuta?",
    conciergeDesc: "Tuambie unataka nini — tutakutafutia ndani ya masaa 3–6.",
    conciergeBtn: "Omba Maalum",
    conciergeLabel: "Ombi Maalum",
    conciergeInput: "Mfano: Socks za newborn, saizi 0-3 miezi, bajeti Ksh 300. Niko Nakuru CBD.",
    conciergeTown: "Mji Wako",
    conciergeSubmit: "Tuma Ombi",
    conciergeSuccess: "Ombi Limepokelewa!",
    conciergeSuccessDesc: "Tutakupigia simu au kukutumia WhatsApp ndani ya masaa 3–6.",
    conciergeAnother: "Omba Kingine",
    verified: "Amethibitishwa",
    boosted: "Imeboostwa",
    buyNow: "Nunua Sasa",
    buyerProtection: "Ada ya ulinzi wa mnunuzi",
    total: "Jumla",
    orderSummary: "Muhtasari wa Agizo",
    item: "Bidhaa",
    payViaMpesa: "Lipa kupitia M-Pesa",
    mpesaSteps: "Maelekezo ya Lipa Na M-Pesa",
    mpesaNumber: "Nambari yako ya M-Pesa",
    mpesaCode: "Nambari ya uthibitisho wa M-Pesa",
    confirmPayment: "Thibitisha Malipo",
    orderPlaced: "Agizo Limefanywa!",
    orderDesc: "Muuzaji amearifiwa. Bidhaa itafika hivi karibuni. Thibitisha kupokea ili tumlipe muuzaji.",
    orderId: "Nambari ya Agizo",
    backHome: "Rudi Nyumbani",
    postListing: "Weka Tangazo",
    itemTitle: "Jina",
    itemTitlePlaceholder: "Mfano: Levi's Jeans Waist 34 Grade A",
    price: "Bei (Ksh)",
    description: "Maelezo",
    descPlaceholder: "Eleza vizuri — hali, ukubwa, rangi, kasoro zozote...",
    category: "Aina",
    town: "Mji",
    boostListing: "Piga Boost Tangazo",
    boostDesc: "Onekana juu ya wote kwa siku 7 — Ksh 100",
    publish: "Chapisha",
    publishFree: "Chapisha — Bure",
    publishBoosted: "Chapisha + Boost — Ksh 100",
    listingNote: "Matangazo yote yanakaguliwa kabla ya kuonekana.",
    chatWith: "Zungumza na",
    chatPlaceholder: "Andika ujumbe...",
    chatPrivacyNote: "Nambari za simu zinabaki siri. Zungumza salama ndani ya KaziApa.",
    chatLimit: "Umefika kikomo cha ujumbe 5 bure leo.",
    upgradeNow: "Upgrade sasa →",
    myListings: "Matangazo Yangu",
    myOrders: "Maagizo Yangu",
    myChats: "Mazungumzo Yangu",
    verifiedBadge: "Pata Beji ya Muuzaji Aliyethibitishwa",
    verifiedBadgeDesc: "Jenga imani na wanunuzi. Onyesha ✓ kwenye matangazo yako yote.",
    verifiedBadgePrice: "Ksh 200 mara moja",
    upgradePlan: "Boresha Mpango",
    settings: "Mipangilio",
    language: "Lugha",
    switchLang: "Badili kwa English",
    trust: "KaziApa inakuLinda: Pesa inashikiliwa salama hadi uthibitishe kupokea bidhaa.",
    sellerDash: "Dashibodi ya Muuzaji",
    totalSales: "Mauzo Yote",
    activeListings: "Matangazo Hai",
    pendingOrders: "Maagizo Yanayosubiri",
    earnings: "Mapato (Ksh)",
    respondTimer: "Jibu ndani ya",
    markSold: "Weka Kama Imeuzwa",
    confirmAvail: "Thibitisha Ipo",
    adminPanel: "Dashibodi ya Msimamizi",
    disputes: "Migogoro",
    pendingVerif: "Inasubiri Uthibitisho",
    flagged: "Wauzaji Walioflagiwa",
    resolve: "Tatua",
    approve: "Idhinisha",
    suspend: "Simamisha",
    upgradeTitle: "Fungua Zaidi kwenye KaziApa",
    upgradeSubtitle: "Mpango bure: ujumbe 5/siku. Boresha kwa zaidi.",
    daily: "Leseni ya Siku",
    weekly: "Mpango wa Wiki",
    dailyPrice: "Ksh 20 / siku",
    weeklyPrice: "Ksh 50 / wiki",
    maybeLater: "Labda Baadaye",
    freePlan: "Mpango Bure",
    home: "Nyumbani",
    browse: "Tafuta",
    post: "Weka",
    profile: "Mimi",
    seller: "Muuzaji",
    admin: "Msimamizi",
    noResults: "Hakuna kitu hapa bado.",
    noResultsDesc: "Jaribu mji mwingine au fanya ombi maalum.",
    stepVerify: "Kagua",
    stepPay: "Lipa",
    stepConfirm: "Thibitisha",
    allCategories: "Zote",
  },
};

// ─── DATA ─────────────────────────────────────────────────────────────────────
const CATEGORIES = [
  { id: "mitumba", en: "Mitumba", sw: "Mitumba", sub: "Secondhand Clothes", icon: "👕", color: "#0A3D2E" },
  { id: "shamba", en: "Shamba", sw: "Shamba", sub: "Farm Produce", icon: "🌽", color: "#1E7A5A" },
  { id: "vitu", en: "Goods", sw: "Vitu", sub: "General Items", icon: "📦", color: "#2471A3" },
  { id: "kazi", en: "Jobs", sw: "Kazi", sub: "Jobs & Gigs", icon: "💼", color: "#6C3483" },
  { id: "nyumba", en: "Rentals", sw: "Nyumba", sub: "Rooms & Houses", icon: "🏠", color: "#B7410E" },
  { id: "fundi", en: "Services", sw: "Fundi", sub: "Fundis & Pros", icon: "🔧", color: "#0E6655" },
];

const TOWNS = ["Nairobi", "Nakuru", "Kisumu", "Mombasa", "Eldoret", "Thika", "Nyeri", "Machakos", "Kitale", "Webuye", "Malindi", "Garissa"];

const LISTINGS = [
  { id: 1, category: "mitumba", title: "Levi's Slim Fit Jeans", price: 850, town: "Nakuru", seller: "Grace Wanjiru", verified: true, boosted: true, icon: "👖", desc: "Grade A, Waist 34, no defects. Straight from bale.", rating: 4.9, sales: 47, code: "NKR-JNS-001" },
  { id: 2, category: "shamba", title: "Fresh Tomatoes 10kg", price: 400, town: "Nakuru", seller: "James Mkulima", verified: false, boosted: false, icon: "🍅", desc: "Farm fresh, harvested this morning.", rating: 4.7, sales: 23, code: "NKR-SHM-002" },
  { id: 3, category: "fundi", title: "Plumber – All Repairs", price: 500, town: "Nakuru", seller: "Ochieng Fundi", verified: true, boosted: false, icon: "🔧", desc: "10 years experience. Same-day response.", rating: 4.8, sales: 61, code: "NKR-FND-003" },
  { id: 4, category: "kazi", title: "Shop Attendant Needed", price: 15000, town: "Nairobi", seller: "Westlands Supermart", verified: true, boosted: true, icon: "💼", desc: "Full time, Mon–Sat. Experience preferred.", rating: 4.6, sales: 0, code: "NBI-KZI-004" },
  { id: 5, category: "nyumba", title: "1-Bedroom House to Let", price: 8000, town: "Kisumu", seller: "Agent Kamau", verified: false, boosted: false, icon: "🏠", desc: "Near town centre. Water and security included.", rating: 4.3, sales: 12, code: "KSM-NYM-005" },
  { id: 6, category: "vitu", title: "Samsung TV 32\"", price: 12000, town: "Kisumu", seller: "Electronics Hub", verified: true, boosted: false, icon: "📺", desc: "Good condition. Remote and bracket included.", rating: 4.7, sales: 8, code: "KSM-VTU-006" },
  { id: 7, category: "mitumba", title: "Ralph Lauren Polo XL", price: 550, town: "Nairobi", seller: "Gikomba Picks", verified: true, boosted: true, icon: "👔", desc: "Grade A, clean, no wear marks.", rating: 5.0, sales: 92, code: "NBI-JNS-007" },
  { id: 8, category: "shamba", title: "Sukuma Wiki Bundle ×3", price: 50, town: "Nakuru", seller: "Shamba Fresh", verified: false, boosted: false, icon: "🥬", desc: "3 large bundles. Picked fresh daily.", rating: 4.5, sales: 134, code: "NKR-SHM-008" },
  { id: 9, category: "mitumba", title: "Nike Sneakers Size 42", price: 1200, town: "Mombasa", seller: "Coast Threads", verified: true, boosted: false, icon: "👟", desc: "Grade A, barely worn, original laces.", rating: 4.8, sales: 29, code: "MBA-JNS-009" },
  { id: 10, category: "fundi", title: "Electrician – Wiring & Repairs", price: 800, town: "Eldoret", seller: "Cheruiyot Electric", verified: true, boosted: true, icon: "⚡", desc: "Licensed. Fast, clean work guaranteed.", rating: 4.9, sales: 55, code: "ELD-FND-010" },
];

const DISPUTES = [
  { id: "D001", buyer: "Peter K.", seller: "Grace Wanjiru", item: "Levi's Jeans", amount: 850, issue: "Wrong size sent — received 32, ordered 34.", status: "open" },
  { id: "D002", buyer: "Aisha M.", seller: "James Mkulima", item: "Tomatoes 10kg", amount: 400, issue: "Only 7kg delivered.", status: "open" },
];

const PENDING_VERIF = [
  { id: "V001", name: "Mary Njeri", town: "Thika", category: "Mitumba", idNo: "24567891", phone: "0712345678" },
  { id: "V002", name: "Hassan Omar", town: "Mombasa", category: "Vitu", idNo: "31289456", phone: "0723456789" },
];

// ─── HELPERS ──────────────────────────────────────────────────────────────────
function Stars({ rating }) {
  return (
    <span style={{ color: T.accent, fontSize: 11 }}>
      {"★".repeat(Math.floor(rating))}{"☆".repeat(5 - Math.floor(rating))}
      <span style={{ color: T.textMuted, marginLeft: 3 }}>{rating}</span>
    </span>
  );
}

function Badge({ children, color = T.primary, bg = T.accentSoft }) {
  return (
    <span style={{ background: bg, color, fontSize: 10, fontWeight: 700, padding: "2px 8px", borderRadius: 20, letterSpacing: 0.3 }}>
      {children}
    </span>
  );
}

function Tag({ t, lang }) {
  return t[lang] || t["en"];
}

// ─── LISTING CARD ─────────────────────────────────────────────────────────────
function ListingCard({ listing, onClick, lang }) {
  const cat = CATEGORIES.find(c => c.id === listing.category);
  return (
    <div onClick={onClick} style={{
      background: T.card, borderRadius: 14, marginBottom: 10, cursor: "pointer",
      border: listing.boosted ? `1.5px solid ${T.accent}` : `1px solid ${T.border}`,
      boxShadow: listing.boosted ? `0 2px 12px rgba(245,166,35,0.18)` : "0 1px 4px rgba(0,0,0,0.05)",
      overflow: "hidden", display: "flex"
    }}>
      {/* Color slash accent — signature element */}
      <div style={{ width: 6, flexShrink: 0, background: cat?.color || T.primary, borderRadius: "14px 0 0 14px" }} />
      <div style={{ padding: "12px 14px 12px 12px", flex: 1, minWidth: 0 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 8 }}>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 6, flexWrap: "wrap", marginBottom: 3 }}>
              {listing.boosted && <Badge color={T.accentDark} bg={T.accentSoft}>⚡ Boosted</Badge>}
              {listing.verified && <Badge color={T.success} bg={T.successSoft}>✓ {lang === "sw" ? "Amethibitishwa" : "Verified"}</Badge>}
            </div>
            <div style={{ fontWeight: 700, color: T.text, fontSize: 14, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{listing.title}</div>
            <div style={{ fontSize: 11, color: T.textMuted, marginTop: 2 }}>📍 {listing.town} · {listing.seller}</div>
            <div style={{ marginTop: 4 }}><Stars rating={listing.rating} /></div>
          </div>
          <div style={{ textAlign: "right", flexShrink: 0 }}>
            <div style={{ fontSize: 16, fontWeight: 800, color: T.primary }}>Ksh {listing.price.toLocaleString()}</div>
            <div style={{ fontSize: 11, color: T.textMuted }}>{listing.sales > 0 ? `${listing.sales} sold` : "New"}</div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── MAIN APP ─────────────────────────────────────────────────────────────────
export default function KaziApa() {
  const [lang, setLang] = useState("en");
  const [screen, setScreen] = useState("onboard"); // onboard|home|browse|listing|checkout|chat|post|profile|seller|admin
  const [town, setTown] = useState("All");
  const [catFilter, setCatFilter] = useState(null);
  const [search, setSearch] = useState("");
  const [activeListing, setActiveListing] = useState(null);
  const [browseTab, setBrowseTab] = useState("listings"); // listings|concierge
  const [checkStep, setCheckStep] = useState(1);
  const [showUpgrade, setShowUpgrade] = useState(false);
  const [userPlan, setUserPlan] = useState("free");
  const [chatMsgs, setChatMsgs] = useState([{ from: "seller", text: "Hi! Thanks for your interest. How can I help?" }]);
  const [chatInput, setChatInput] = useState("");
  const [postForm, setPostForm] = useState({ title: "", cat: "mitumba", price: "", town: "Nairobi", desc: "", boost: false });
  const [conciergeText, setConciergeText] = useState("");
  const [conciergeTown, setConciergeTown] = useState("Nakuru");
  const [conciergeDone, setConciergeDone] = useState(false);
  const [respondTimers, setRespondTimers] = useState({ 1: 14, 2: 7 });
  const [activeNav, setActiveNav] = useState("home");
  const [userRole, setUserRole] = useState("buyer"); // buyer|seller|admin
  const [toast, setToast] = useState(null);

  const tr = LANG[lang];

  function showToast(msg, type = "success") {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 2800);
  }

  function nav(s, navKey) {
    setScreen(s);
    if (navKey) setActiveNav(navKey);
  }

  const filtered = LISTINGS.filter(l => {
    const matchTown = town === "All" || l.town === town;
    const matchCat = catFilter ? l.category === catFilter : true;
    const matchSearch = search ? l.title.toLowerCase().includes(search.toLowerCase()) || l.town.toLowerCase().includes(search.toLowerCase()) : true;
    return matchTown && matchCat && matchSearch;
  });

  const boosted = filtered.filter(l => l.boosted);
  const regular = filtered.filter(l => !l.boosted);
  const sorted = [...boosted, ...regular];

  // ── ONBOARDING ──────────────────────────────────────────────────────────────
  if (screen === "onboard") return (
    <div style={{ fontFamily: "'Segoe UI', system-ui, sans-serif", background: T.primary, minHeight: "100vh", maxWidth: 430, margin: "0 auto", display: "flex", flexDirection: "column", justifyContent: "space-between", padding: 32 }}>
      <div style={{ marginTop: 40 }}>
        <div style={{ fontSize: 38, fontWeight: 900, color: T.accent, letterSpacing: -1 }}>KaziApa</div>
        <div style={{ fontSize: 18, color: "rgba(255,255,255,0.85)", marginTop: 8, lineHeight: 1.4 }}>{tr.appTagline}</div>
        <div style={{ marginTop: 40, display: "flex", flexDirection: "column", gap: 12 }}>
          {[{ icon: "🔒", text: lang === "sw" ? "Malipo salama — pesa inashikiliwa hadi upokee bidhaa." : "Safe payments — money held until you confirm receipt." },
            { icon: "✓", text: lang === "sw" ? "Wauzaji waliohakikishwa na ID halisi." : "Sellers verified with real ID checks." },
            { icon: "📍", text: lang === "sw" ? "Soko la mji wako — haraka, karibu, ya kuamini." : "Your town's market — fast, local, trusted." },
          ].map((f, i) => (
            <div key={i} style={{ display: "flex", gap: 12, alignItems: "flex-start" }}>
              <span style={{ fontSize: 22 }}>{f.icon}</span>
              <span style={{ color: "rgba(255,255,255,0.75)", fontSize: 14, lineHeight: 1.5 }}>{f.text}</span>
            </div>
          ))}
        </div>
      </div>
      <div>
        <div style={{ display: "flex", gap: 8, marginBottom: 20 }}>
          {["en", "sw"].map(l => (
            <div key={l} onClick={() => setLang(l)} style={{ flex: 1, textAlign: "center", padding: "10px 0", borderRadius: 10, background: lang === l ? T.accent : "rgba(255,255,255,0.1)", color: lang === l ? T.primary : "#fff", fontWeight: 700, fontSize: 14, cursor: "pointer" }}>
              {l === "en" ? "English" : "Kiswahili"}
            </div>
          ))}
        </div>
        <button onClick={() => { setScreen("home"); setActiveNav("home"); }} style={{ width: "100%", padding: 16, background: T.accent, color: T.primary, border: "none", borderRadius: 14, fontSize: 16, fontWeight: 800, cursor: "pointer" }}>
          {lang === "sw" ? "Anza Sasa →" : "Get Started →"}
        </button>
        <div style={{ display: "flex", justifyContent: "center", gap: 20, marginTop: 20 }}>
          {[["buyer", lang === "sw" ? "Ninunuzi" : "I'm a Buyer"], ["seller", lang === "sw" ? "Ninauzaji" : "I'm a Seller"], ["admin", "Admin"]].map(([role, label]) => (
            <div key={role} onClick={() => setUserRole(role)} style={{ fontSize: 12, color: userRole === role ? T.accent : "rgba(255,255,255,0.5)", fontWeight: userRole === role ? 700 : 400, cursor: "pointer", borderBottom: userRole === role ? `1px solid ${T.accent}` : "none", paddingBottom: 1 }}>{label}</div>
          ))}
        </div>
      </div>
    </div>
  );

  return (
    <div style={{ fontFamily: "'Segoe UI', system-ui, sans-serif", background: T.surface, minHeight: "100vh", maxWidth: 430, margin: "0 auto", position: "relative", paddingBottom: 72 }}>

      {/* ── TOAST ── */}
      {toast && (
        <div style={{ position: "fixed", top: 16, left: "50%", transform: "translateX(-50%)", zIndex: 200, background: toast.type === "success" ? T.success : T.coral, color: "#fff", borderRadius: 10, padding: "10px 20px", fontSize: 13, fontWeight: 600, boxShadow: "0 4px 16px rgba(0,0,0,0.18)", whiteSpace: "nowrap" }}>
          {toast.msg}
        </div>
      )}

      {/* ── UPGRADE MODAL ── */}
      {showUpgrade && (
        <div style={{ position: "fixed", inset: 0, background: T.overlay, zIndex: 150, display: "flex", alignItems: "flex-end", justifyContent: "center" }} onClick={() => setShowUpgrade(false)}>
          <div style={{ background: T.card, borderRadius: "22px 22px 0 0", padding: "28px 20px 36px", width: "100%", maxWidth: 430 }} onClick={e => e.stopPropagation()}>
            <div style={{ textAlign: "center", marginBottom: 22 }}>
              <div style={{ fontSize: 40 }}>⚡</div>
              <div style={{ fontSize: 18, fontWeight: 800, color: T.text, marginTop: 8 }}>{tr.upgradeTitle}</div>
              <div style={{ fontSize: 13, color: T.textMuted, marginTop: 4 }}>{tr.upgradeSubtitle}</div>
            </div>
            {[{ plan: "daily", label: tr.daily, price: tr.dailyPrice, perks: ["Unlimited messages", "Priority support"], color: T.primaryLight },
              { plan: "weekly", label: tr.weekly, price: tr.weeklyPrice, perks: ["Unlimited messages", "List up to 20 items", "1 free boost"], color: T.primary }
            ].map(p => (
              <div key={p.plan} onClick={() => { setUserPlan(p.plan); setShowUpgrade(false); showToast(`Upgraded to ${p.label}!`); }}
                style={{ background: p.color, borderRadius: 14, padding: "14px 18px", marginBottom: 12, cursor: "pointer", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <div>
                  <div style={{ color: "#fff", fontWeight: 700, fontSize: 15 }}>{p.label}</div>
                  {p.perks.map(pk => <div key={pk} style={{ color: "rgba(255,255,255,0.75)", fontSize: 12 }}>✓ {pk}</div>)}
                </div>
                <div style={{ color: T.accent, fontWeight: 800, fontSize: 16 }}>{p.price}</div>
              </div>
            ))}
            <div style={{ background: T.accentSoft, borderRadius: 14, padding: "14px 18px", marginBottom: 16, border: `1px solid ${T.accent}`, cursor: "pointer" }} onClick={() => { setShowUpgrade(false); showToast("Verified badge request sent!"); }}>
              <div style={{ fontWeight: 700, color: T.text, fontSize: 14 }}>{tr.verifiedBadge}</div>
              <div style={{ fontSize: 12, color: T.textMuted, marginTop: 2 }}>{tr.verifiedBadgeDesc}</div>
              <div style={{ color: T.accentDark, fontWeight: 800, marginTop: 6, fontSize: 14 }}>{tr.verifiedBadgePrice}</div>
            </div>
            <button onClick={() => setShowUpgrade(false)} style={{ width: "100%", padding: 13, borderRadius: 12, border: `1px solid ${T.border}`, background: T.card, color: T.textMuted, fontSize: 14, cursor: "pointer" }}>{tr.maybeLater}</button>
          </div>
        </div>
      )}

      {/* ══════════════════════════════════════════════════════════════════════
          HOME
      ══════════════════════════════════════════════════════════════════════ */}
      {screen === "home" && (
        <div>
          {/* Header */}
          <div style={{ background: T.primary, padding: "20px 16px 18px", borderRadius: "0 0 22px 22px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
              <div>
                <div style={{ color: T.accent, fontSize: 24, fontWeight: 900, letterSpacing: -0.5 }}>KaziApa</div>
                <div style={{ color: "rgba(255,255,255,0.6)", fontSize: 12 }}>{tr.appTagline}</div>
              </div>
              <div style={{ display: "flex", gap: 8 }}>
                <div onClick={() => setShowUpgrade(true)} style={{ background: T.accent, borderRadius: 20, padding: "5px 13px", fontSize: 12, fontWeight: 700, color: T.primary, cursor: "pointer" }}>⚡ {lang === "sw" ? "Boresha" : "Upgrade"}</div>
                <div onClick={() => setLang(lang === "en" ? "sw" : "en")} style={{ background: "rgba(255,255,255,0.12)", borderRadius: 20, padding: "5px 10px", fontSize: 11, color: "#fff", cursor: "pointer", fontWeight: 600 }}>{lang === "en" ? "SW" : "EN"}</div>
              </div>
            </div>
            {/* Town pills */}
            <div style={{ display: "flex", gap: 6, overflowX: "auto", paddingBottom: 2 }}>
              {["All", ...TOWNS.slice(0, 8)].map(t => (
                <div key={t} onClick={() => setTown(t)} style={{ background: town === t ? T.accent : "rgba(255,255,255,0.12)", color: town === t ? T.primary : "#fff", borderRadius: 20, padding: "5px 14px", fontSize: 12, fontWeight: 600, whiteSpace: "nowrap", cursor: "pointer", flexShrink: 0 }}>
                  {t === "All" ? tr.allTowns : t}
                </div>
              ))}
            </div>
          </div>

          {/* Search */}
          <div style={{ padding: "14px 16px 4px" }}>
            <div style={{ background: T.card, borderRadius: 13, padding: "11px 14px", display: "flex", alignItems: "center", gap: 8, border: `1px solid ${T.border}`, boxShadow: "0 1px 4px rgba(0,0,0,0.05)" }}>
              <span style={{ fontSize: 16 }}>🔍</span>
              <input value={search} onChange={e => setSearch(e.target.value)} placeholder={`${tr.searchPlaceholder} ${town === "All" ? tr.allTowns : town}...`}
                style={{ border: "none", outline: "none", flex: 1, fontSize: 14, color: T.text, background: "transparent" }} />
              {search && <span onClick={() => setSearch("")} style={{ color: T.textMuted, cursor: "pointer", fontSize: 18, lineHeight: 1 }}>×</span>}
            </div>
          </div>

          {/* Concierge banner */}
          <div style={{ margin: "14px 16px 4px", background: `linear-gradient(130deg, ${T.primary} 0%, ${T.primaryMid} 100%)`, borderRadius: 16, padding: "16px 18px", cursor: "pointer", border: `1px solid ${T.primaryLight}` }}
            onClick={() => { nav("browse", "browse"); setBrowseTab("concierge"); }}>
            <div style={{ color: T.accent, fontSize: 10, fontWeight: 700, letterSpacing: 1.2, marginBottom: 5 }}>CONCIERGE SERVICE</div>
            <div style={{ color: "#fff", fontWeight: 800, fontSize: 15 }}>{tr.conciergeTitle}</div>
            <div style={{ color: "rgba(255,255,255,0.65)", fontSize: 12, marginTop: 3 }}>{tr.conciergeDesc} →</div>
          </div>

          {/* Categories */}
          <div style={{ padding: "16px 16px 4px" }}>
            <div style={{ fontSize: 13, fontWeight: 800, color: T.text, marginBottom: 12, letterSpacing: 0.2 }}>{tr.categories}</div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 9 }}>
              {CATEGORIES.map(cat => (
                <div key={cat.id} onClick={() => { setCatFilter(cat.id); nav("browse", "browse"); setBrowseTab("listings"); }}
                  style={{ background: T.card, borderRadius: 13, padding: "14px 8px 10px", textAlign: "center", cursor: "pointer", border: `1px solid ${T.border}`, position: "relative", overflow: "hidden" }}>
                  <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 4, background: cat.color, borderRadius: "13px 13px 0 0" }} />
                  <div style={{ fontSize: 26, marginBottom: 5 }}>{cat.icon}</div>
                  <div style={{ fontSize: 12, fontWeight: 800, color: cat.color }}>{lang === "sw" ? cat.sw : cat.en}</div>
                  <div style={{ fontSize: 10, color: T.textMuted, marginTop: 1 }}>{cat.sub}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Recent listings */}
          <div style={{ padding: "16px 16px 0" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
              <div style={{ fontSize: 13, fontWeight: 800, color: T.text }}>{tr.nearYou}{town !== "All" ? ` — ${town}` : ""}</div>
              <div onClick={() => { setCatFilter(null); nav("browse", "browse"); setBrowseTab("listings"); }} style={{ fontSize: 12, color: T.primaryLight, cursor: "pointer", fontWeight: 600 }}>{tr.seeAll} →</div>
            </div>
            {sorted.slice(0, 4).map(l => (
              <ListingCard key={l.id} listing={l} lang={lang} onClick={() => { setActiveListing(l); nav("listing", "browse"); }} />
            ))}
          </div>
        </div>
      )}

      {/* ══════════════════════════════════════════════════════════════════════
          BROWSE
      ══════════════════════════════════════════════════════════════════════ */}
      {screen === "browse" && (
        <div>
          <div style={{ background: T.primary, padding: "16px 16px 0", borderRadius: "0 0 18px 18px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 12 }}>
              <div onClick={() => { nav("home", "home"); setCatFilter(null); }} style={{ color: "#fff", fontSize: 22, cursor: "pointer", lineHeight: 1 }}>←</div>
              <div style={{ color: "#fff", fontWeight: 800, fontSize: 16, flex: 1 }}>
                {catFilter ? (lang === "sw" ? CATEGORIES.find(c => c.id === catFilter)?.sw : CATEGORIES.find(c => c.id === catFilter)?.en) : (lang === "sw" ? "Vitu Vyote" : "All Listings")}
                {town !== "All" ? ` — ${town}` : ""}
              </div>
              <div onClick={() => setLang(lang === "en" ? "sw" : "en")} style={{ background: "rgba(255,255,255,0.12)", borderRadius: 16, padding: "4px 10px", fontSize: 11, color: "#fff", cursor: "pointer" }}>{lang === "en" ? "SW" : "EN"}</div>
            </div>
            <div style={{ display: "flex", gap: 6, paddingBottom: 14 }}>
              <div onClick={() => setBrowseTab("listings")} style={{ background: browseTab === "listings" ? T.accent : "rgba(255,255,255,0.12)", color: browseTab === "listings" ? T.primary : "#fff", borderRadius: 20, padding: "5px 16px", fontSize: 12, fontWeight: 700, cursor: "pointer" }}>
                {lang === "sw" ? "Matangazo" : "Listings"}
              </div>
              <div onClick={() => setBrowseTab("concierge")} style={{ background: browseTab === "concierge" ? T.accent : "rgba(255,255,255,0.12)", color: browseTab === "concierge" ? T.primary : "#fff", borderRadius: 20, padding: "5px 16px", fontSize: 12, fontWeight: 700, cursor: "pointer" }}>
                {lang === "sw" ? "Ombi Maalum" : "Special Request"}
              </div>
            </div>
          </div>

          {browseTab === "listings" && (
            <div style={{ padding: "14px 16px" }}>
              {/* Search + town */}
              <div style={{ display: "flex", gap: 8, marginBottom: 12 }}>
                <div style={{ flex: 1, background: T.card, borderRadius: 11, padding: "9px 12px", display: "flex", alignItems: "center", gap: 6, border: `1px solid ${T.border}` }}>
                  <span>🔍</span>
                  <input value={search} onChange={e => setSearch(e.target.value)} placeholder={lang === "sw" ? "Tafuta..." : "Search..."}
                    style={{ border: "none", outline: "none", flex: 1, fontSize: 13, background: "transparent", color: T.text }} />
                </div>
                <select value={town} onChange={e => setTown(e.target.value)} style={{ background: T.card, border: `1px solid ${T.border}`, borderRadius: 11, padding: "9px 10px", fontSize: 12, color: T.text }}>
                  <option value="All">{tr.allTowns}</option>
                  {TOWNS.map(t => <option key={t}>{t}</option>)}
                </select>
              </div>
              {/* Cat pills */}
              <div style={{ display: "flex", gap: 6, overflowX: "auto", paddingBottom: 10, marginBottom: 4 }}>
                <div onClick={() => setCatFilter(null)} style={{ background: !catFilter ? T.primary : T.card, color: !catFilter ? "#fff" : T.textMuted, borderRadius: 20, padding: "5px 14px", fontSize: 12, fontWeight: 600, whiteSpace: "nowrap", cursor: "pointer", border: `1px solid ${T.border}`, flexShrink: 0 }}>{tr.allCategories}</div>
                {CATEGORIES.map(cat => (
                  <div key={cat.id} onClick={() => setCatFilter(catFilter === cat.id ? null : cat.id)}
                    style={{ background: catFilter === cat.id ? cat.color : T.card, color: catFilter === cat.id ? "#fff" : T.textMuted, borderRadius: 20, padding: "5px 14px", fontSize: 12, fontWeight: 600, whiteSpace: "nowrap", cursor: "pointer", border: `1px solid ${T.border}`, flexShrink: 0 }}>
                    {cat.icon} {lang === "sw" ? cat.sw : cat.en}
                  </div>
                ))}
              </div>
              {boosted.length > 0 && <div style={{ fontSize: 10, fontWeight: 700, color: T.accentDark, marginBottom: 8, letterSpacing: 0.8 }}>⚡ FEATURED</div>}
              {sorted.length === 0 ? (
                <div style={{ textAlign: "center", padding: "50px 20px", color: T.textMuted }}>
                  <div style={{ fontSize: 44 }}>🔍</div>
                  <div style={{ fontWeight: 700, fontSize: 15, marginTop: 12, color: T.text }}>{tr.noResults}</div>
                  <div style={{ fontSize: 13, marginTop: 6 }}>{tr.noResultsDesc}</div>
                  <button onClick={() => setBrowseTab("concierge")} style={{ marginTop: 16, background: T.primary, color: "#fff", border: "none", borderRadius: 10, padding: "10px 22px", fontSize: 13, fontWeight: 700, cursor: "pointer" }}>{tr.conciergeBtn}</button>
                </div>
              ) : sorted.map((l, i) => (
                <div key={l.id}>
                  {i === boosted.length && boosted.length > 0 && regular.length > 0 && (
                    <div style={{ fontSize: 10, fontWeight: 700, color: T.textMuted, margin: "10px 0 8px", letterSpacing: 0.8 }}>{lang === "sw" ? "ZOTE" : "ALL LISTINGS"}</div>
                  )}
                  <ListingCard listing={l} lang={lang} onClick={() => { setActiveListing(l); nav("listing", "browse"); }} />
                </div>
              ))}
            </div>
          )}

          {browseTab === "concierge" && (
            <div style={{ padding: "20px 16px" }}>
              <div style={{ background: T.accentSoft, borderRadius: 14, padding: 16, marginBottom: 18, border: `1px solid ${T.accent}` }}>
                <div style={{ fontWeight: 800, color: T.text, fontSize: 15, marginBottom: 4 }}>{tr.conciergeLabel}</div>
                <div style={{ fontSize: 13, color: T.textMuted, lineHeight: 1.5 }}>{tr.conciergeDesc}</div>
              </div>
              {conciergeDone ? (
                <div style={{ textAlign: "center", padding: "30px 0" }}>
                  <div style={{ fontSize: 56 }}>✅</div>
                  <div style={{ fontSize: 18, fontWeight: 800, color: T.text, marginTop: 14 }}>{tr.conciergeSuccess}</div>
                  <div style={{ fontSize: 14, color: T.textMuted, marginTop: 8, lineHeight: 1.5 }}>{tr.conciergeSuccessDesc}</div>
                  <button onClick={() => { setConciergeDone(false); setConciergeText(""); }} style={{ marginTop: 22, background: T.primary, color: "#fff", border: "none", borderRadius: 12, padding: "12px 28px", fontSize: 14, fontWeight: 700, cursor: "pointer" }}>{tr.conciergeAnother}</button>
                </div>
              ) : (
                <>
                  <div style={{ marginBottom: 14 }}>
                    <label style={{ fontSize: 12, fontWeight: 700, color: T.text, display: "block", marginBottom: 7 }}>{tr.conciergeTown}</label>
                    <select value={conciergeTown} onChange={e => setConciergeTown(e.target.value)} style={{ width: "100%", padding: "11px 13px", borderRadius: 11, border: `1px solid ${T.border}`, fontSize: 14, color: T.text, background: T.card }}>
                      {TOWNS.map(t => <option key={t}>{t}</option>)}
                    </select>
                  </div>
                  <div style={{ marginBottom: 18 }}>
                    <label style={{ fontSize: 12, fontWeight: 700, color: T.text, display: "block", marginBottom: 7 }}>{lang === "sw" ? "Unataka nini?" : "What do you need?"}</label>
                    <textarea value={conciergeText} onChange={e => setConciergeText(e.target.value)} placeholder={tr.conciergeInput} rows={5}
                      style={{ width: "100%", padding: "11px 13px", borderRadius: 11, border: `1px solid ${T.border}`, fontSize: 14, color: T.text, resize: "none", boxSizing: "border-box", background: T.card }} />
                  </div>
                  <button onClick={() => { if (conciergeText.trim()) { setConciergeDone(true); showToast(tr.conciergeSuccess); } }}
                    style={{ width: "100%", padding: 15, background: T.primary, color: "#fff", border: "none", borderRadius: 13, fontSize: 15, fontWeight: 800, cursor: "pointer" }}>
                    {tr.conciergeSubmit} →
                  </button>
                </>
              )}
            </div>
          )}
        </div>
      )}

      {/* ══════════════════════════════════════════════════════════════════════
          LISTING DETAIL
      ══════════════════════════════════════════════════════════════════════ */}
      {screen === "listing" && activeListing && (() => {
        const cat = CATEGORIES.find(c => c.id === activeListing.category);
        return (
          <div>
            <div style={{ background: T.primary, padding: "16px", display: "flex", alignItems: "center", gap: 10 }}>
              <div onClick={() => nav("browse", "browse")} style={{ color: "#fff", fontSize: 22, cursor: "pointer" }}>←</div>
              <div style={{ color: "#fff", fontWeight: 700, fontSize: 15, flex: 1, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{activeListing.title}</div>
            </div>
            <div style={{ padding: 16 }}>
              {/* Image area */}
              <div style={{ background: T.border, borderRadius: 18, height: 200, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 90, marginBottom: 16, position: "relative", overflow: "hidden" }}>
                {activeListing.icon}
                <div style={{ position: "absolute", top: 12, left: 12, display: "flex", gap: 6, flexWrap: "wrap" }}>
                  {activeListing.boosted && <Badge color={T.accentDark} bg="rgba(255,248,231,0.95)">⚡ Boosted</Badge>}
                  {activeListing.verified && <Badge color={T.success} bg="rgba(232,245,238,0.95)">✓ Verified</Badge>}
                </div>
                <div style={{ position: "absolute", bottom: 12, right: 12, background: cat?.color, color: "#fff", borderRadius: 8, padding: "3px 10px", fontSize: 11, fontWeight: 700 }}>{lang === "sw" ? cat?.sw : cat?.en}</div>
              </div>
              {/* Info card */}
              <div style={{ background: T.card, borderRadius: 16, padding: 16, marginBottom: 12, border: `1px solid ${T.border}` }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 8 }}>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 18, fontWeight: 800, color: T.text }}>{activeListing.title}</div>
                    <div style={{ fontSize: 12, color: T.textMuted, marginTop: 3 }}>📍 {activeListing.town} · #{activeListing.code}</div>
                    <div style={{ marginTop: 6 }}><Stars rating={activeListing.rating} /><span style={{ fontSize: 11, color: T.textMuted, marginLeft: 6 }}>{activeListing.sales} {lang === "sw" ? "zimeuzwa" : "sold"}</span></div>
                  </div>
                  <div style={{ fontSize: 22, fontWeight: 900, color: T.primary }}>Ksh {activeListing.price.toLocaleString()}</div>
                </div>
                <div style={{ marginTop: 12, fontSize: 13, color: T.textMid, lineHeight: 1.6 }}>{activeListing.desc}</div>
              </div>
              {/* Seller card */}
              <div style={{ background: T.card, borderRadius: 16, padding: 14, marginBottom: 14, border: `1px solid ${T.border}`, display: "flex", alignItems: "center", gap: 12 }}>
                <div style={{ width: 46, height: 46, borderRadius: "50%", background: T.primary, display: "flex", alignItems: "center", justifyContent: "center", color: T.accent, fontWeight: 800, fontSize: 20 }}>
                  {activeListing.seller[0]}
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 700, color: T.text, fontSize: 14 }}>{activeListing.seller}</div>
                  {activeListing.verified && <div style={{ fontSize: 11, color: T.success, fontWeight: 600 }}>✓ {tr.verified} Seller</div>}
                </div>
                <button onClick={() => nav("chat", "browse")} style={{ background: T.surface, border: `1px solid ${T.border}`, borderRadius: 10, padding: "8px 14px", fontSize: 13, fontWeight: 700, color: T.primary, cursor: "pointer" }}>
                  💬 {lang === "sw" ? "Zungumza" : "Chat"}
                </button>
              </div>
              {/* Trust notice */}
              <div style={{ background: T.successSoft, borderRadius: 13, padding: 13, marginBottom: 16, fontSize: 12, color: "#145A36", lineHeight: 1.5 }}>
                🔒 {tr.trust}
              </div>
              <button onClick={() => { setCheckStep(1); nav("checkout", "browse"); }} style={{ width: "100%", padding: 16, background: T.primary, color: "#fff", border: "none", borderRadius: 14, fontSize: 16, fontWeight: 800, cursor: "pointer" }}>
                {tr.buyNow} — Ksh {(activeListing.price + 50).toLocaleString()}
              </button>
              <div style={{ textAlign: "center", fontSize: 11, color: T.textMuted, marginTop: 6 }}>
                Ksh {activeListing.price.toLocaleString()} + Ksh 50 {tr.buyerProtection}
              </div>
            </div>
          </div>
        );
      })()}

      {/* ══════════════════════════════════════════════════════════════════════
          CHECKOUT
      ══════════════════════════════════════════════════════════════════════ */}
      {screen === "checkout" && activeListing && (
        <div>
          <div style={{ background: T.primary, padding: "16px", display: "flex", alignItems: "center", gap: 10 }}>
            <div onClick={() => nav("listing", "browse")} style={{ color: "#fff", fontSize: 22, cursor: "pointer" }}>←</div>
            <div style={{ color: "#fff", fontWeight: 700, fontSize: 15 }}>{lang === "sw" ? "Malipo Salama" : "Secure Checkout"}</div>
          </div>
          <div style={{ padding: 16 }}>
            {/* Step indicator */}
            <div style={{ display: "flex", alignItems: "center", marginBottom: 24 }}>
              {[tr.stepVerify, tr.stepPay, tr.stepConfirm].map((s, i) => (
                <div key={s} style={{ display: "flex", alignItems: "center", flex: 1 }}>
                  <div style={{ display: "flex", flexDirection: "column", alignItems: "center", flex: 1 }}>
                    <div style={{ width: 30, height: 30, borderRadius: "50%", background: checkStep > i ? T.success : checkStep === i + 1 ? T.primary : T.border, color: checkStep >= i + 1 ? "#fff" : T.textMuted, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 13, fontWeight: 800 }}>
                      {checkStep > i ? "✓" : i + 1}
                    </div>
                    <div style={{ fontSize: 10, color: checkStep === i + 1 ? T.primary : T.textMuted, marginTop: 4, fontWeight: checkStep === i + 1 ? 700 : 400 }}>{s}</div>
                  </div>
                  {i < 2 && <div style={{ width: 30, height: 2, background: checkStep > i + 1 ? T.success : T.border, marginBottom: 14, flexShrink: 0 }} />}
                </div>
              ))}
            </div>

            {checkStep === 1 && (
              <div>
                <div style={{ background: T.card, borderRadius: 14, padding: 16, marginBottom: 14, border: `1px solid ${T.border}` }}>
                  <div style={{ fontWeight: 800, color: T.text, marginBottom: 14, fontSize: 15 }}>{tr.orderSummary}</div>
                  {[[tr.item, `Ksh ${activeListing.price.toLocaleString()}`], [tr.buyerProtection, "Ksh 50"]].map(([k, v]) => (
                    <div key={k} style={{ display: "flex", justifyContent: "space-between", marginBottom: 10, fontSize: 14 }}>
                      <span style={{ color: T.textMid }}>{k}</span><span style={{ fontWeight: 600 }}>{v}</span>
                    </div>
                  ))}
                  <div style={{ borderTop: `1px solid ${T.border}`, paddingTop: 10, display: "flex", justifyContent: "space-between", fontSize: 16, fontWeight: 900 }}>
                    <span>{tr.total}</span><span style={{ color: T.primary }}>Ksh {(activeListing.price + 50).toLocaleString()}</span>
                  </div>
                </div>
                <div style={{ background: T.successSoft, borderRadius: 12, padding: 13, marginBottom: 16, fontSize: 12, color: "#145A36", lineHeight: 1.5 }}>
                  ✅ {lang === "sw" ? "Pesa yako inashikiliwa salama na KaziApa hadi bidhaa iwasilishwe." : "Your money is held securely by KaziApa until you confirm delivery."}
                </div>
                <button onClick={() => setCheckStep(2)} style={{ width: "100%", padding: 15, background: T.primary, color: "#fff", border: "none", borderRadius: 13, fontSize: 15, fontWeight: 800, cursor: "pointer" }}>
                  {lang === "sw" ? "Endelea →" : "Continue →"}
                </button>
              </div>
            )}

            {checkStep === 2 && (
              <div>
                <div style={{ background: T.card, borderRadius: 14, padding: 16, marginBottom: 14, border: `1px solid ${T.border}` }}>
                  <div style={{ fontWeight: 800, color: T.text, marginBottom: 14, fontSize: 15 }}>{tr.payViaMpesa}</div>
                  <div style={{ background: T.surface, borderRadius: 11, padding: 14, marginBottom: 14, fontSize: 13, color: T.textMid, lineHeight: 2 }}>
                    <div>1. Go to <strong>M-Pesa → Lipa Na M-Pesa → Pay Bill</strong></div>
                    <div>2. Business No: <strong style={{ color: T.primary }}>522522</strong></div>
                    <div>3. Account: <strong style={{ color: T.primary }}>KAZI{activeListing.id}ORD</strong></div>
                    <div>4. Amount: <strong style={{ color: T.primary }}>Ksh {(activeListing.price + 50).toLocaleString()}</strong></div>
                  </div>
                  {[{ label: tr.mpesaNumber, placeholder: "07XXXXXXXX" }, { label: tr.mpesaCode, placeholder: "QHX1234ABC" }].map(f => (
                    <div key={f.label} style={{ marginBottom: 12 }}>
                      <label style={{ fontSize: 12, fontWeight: 700, color: T.text, display: "block", marginBottom: 6 }}>{f.label}</label>
                      <input placeholder={f.placeholder} style={{ width: "100%", padding: "11px 13px", borderRadius: 11, border: `1px solid ${T.border}`, fontSize: 14, boxSizing: "border-box", color: T.text }} />
                    </div>
                  ))}
                </div>
                <button onClick={() => { setCheckStep(3); showToast(lang === "sw" ? "Malipo yamepokelewa!" : "Payment confirmed!"); }}
                  style={{ width: "100%", padding: 15, background: T.success, color: "#fff", border: "none", borderRadius: 13, fontSize: 15, fontWeight: 800, cursor: "pointer" }}>
                  {tr.confirmPayment} ✓
                </button>
              </div>
            )}

            {checkStep === 3 && (
              <div style={{ textAlign: "center", padding: "20px 0" }}>
                <div style={{ fontSize: 68 }}>🎉</div>
                <div style={{ fontSize: 22, fontWeight: 900, color: T.text, marginTop: 16 }}>{tr.orderPlaced}</div>
                <div style={{ fontSize: 14, color: T.textMid, marginTop: 10, lineHeight: 1.6, padding: "0 10px" }}>{tr.orderDesc}</div>
                <div style={{ background: T.accentSoft, borderRadius: 13, padding: 14, margin: "20px 0", border: `1px solid ${T.accent}` }}>
                  <div style={{ fontSize: 12, color: T.textMuted }}>{tr.orderId}</div>
                  <div style={{ fontSize: 16, fontWeight: 900, color: T.primary, marginTop: 4 }}>KAZI-{activeListing.id}-{Date.now().toString().slice(-5)}</div>
                </div>
                <button onClick={() => { nav("home", "home"); setCheckStep(1); }} style={{ width: "100%", padding: 15, background: T.primary, color: "#fff", border: "none", borderRadius: 13, fontSize: 15, fontWeight: 800, cursor: "pointer" }}>
                  {tr.backHome}
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ══════════════════════════════════════════════════════════════════════
          CHAT
      ══════════════════════════════════════════════════════════════════════ */}
      {screen === "chat" && (
        <div style={{ display: "flex", flexDirection: "column", height: "100vh" }}>
          <div style={{ background: T.primary, padding: "14px 16px", display: "flex", alignItems: "center", gap: 12 }}>
            <div onClick={() => nav("listing", "browse")} style={{ color: "#fff", fontSize: 22, cursor: "pointer" }}>←</div>
            <div style={{ width: 40, height: 40, borderRadius: "50%", background: T.accent, display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 800, color: T.primary, fontSize: 18 }}>
              {activeListing?.seller[0]}
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ color: "#fff", fontWeight: 700, fontSize: 14 }}>{activeListing?.seller}</div>
              {activeListing?.verified && <div style={{ fontSize: 11, color: T.accent }}>✓ Verified</div>}
            </div>
            <div style={{ background: "rgba(255,255,255,0.1)", borderRadius: 8, padding: "4px 10px", fontSize: 11, color: "#fff" }}>
              {userPlan === "free" ? `${Math.max(0, 5 - chatMsgs.filter(m => m.from === "me").length)} left` : "∞"}
            </div>
          </div>
          {userPlan === "free" && chatMsgs.filter(m => m.from === "me").length >= 5 && (
            <div style={{ background: T.accentSoft, padding: "10px 16px", display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: `1px solid ${T.accent}` }}>
              <div style={{ fontSize: 12, color: T.text }}>{tr.chatLimit}</div>
              <div onClick={() => setShowUpgrade(true)} style={{ fontSize: 12, fontWeight: 800, color: T.primary, cursor: "pointer" }}>{tr.upgradeNow}</div>
            </div>
          )}
          <div style={{ flex: 1, overflowY: "auto", padding: 16, display: "flex", flexDirection: "column", gap: 8 }}>
            <div style={{ textAlign: "center", fontSize: 11, color: T.textMuted, background: T.surface, borderRadius: 8, padding: "6px 12px", alignSelf: "center" }}>
              🔒 {tr.chatPrivacyNote}
            </div>
            {chatMsgs.map((msg, i) => (
              <div key={i} style={{ display: "flex", justifyContent: msg.from === "me" ? "flex-end" : "flex-start" }}>
                <div style={{ background: msg.from === "me" ? T.primary : T.card, color: msg.from === "me" ? "#fff" : T.text, borderRadius: msg.from === "me" ? "16px 16px 4px 16px" : "16px 16px 16px 4px", padding: "10px 14px", maxWidth: "76%", fontSize: 14, lineHeight: 1.4, border: msg.from === "me" ? "none" : `1px solid ${T.border}` }}>
                  {msg.text}
                </div>
              </div>
            ))}
          </div>
          <div style={{ padding: "10px 16px 16px", background: T.card, borderTop: `1px solid ${T.border}`, display: "flex", gap: 8 }}>
            <input value={chatInput} onChange={e => setChatInput(e.target.value)}
              placeholder={tr.chatPlaceholder}
              disabled={userPlan === "free" && chatMsgs.filter(m => m.from === "me").length >= 5}
              style={{ flex: 1, padding: "11px 15px", borderRadius: 24, border: `1px solid ${T.border}`, fontSize: 14, outline: "none", background: T.surface, color: T.text }}
              onKeyDown={e => {
                if (e.key === "Enter" && chatInput.trim() && !(userPlan === "free" && chatMsgs.filter(m => m.from === "me").length >= 5)) {
                  const newMsgs = [...chatMsgs, { from: "me", text: chatInput }];
                  setChatMsgs(newMsgs);
                  setChatInput("");
                  setTimeout(() => setChatMsgs(prev => [...prev, { from: "seller", text: lang === "sw" ? "Asante kwa ujumbe wako! Nitakujibu hivi karibuni." : "Thanks for your message! I'll get back to you shortly." }]), 1200);
                }
              }} />
            <button onClick={() => {
              if (chatInput.trim() && !(userPlan === "free" && chatMsgs.filter(m => m.from === "me").length >= 5)) {
                const newMsgs = [...chatMsgs, { from: "me", text: chatInput }];
                setChatMsgs(newMsgs); setChatInput("");
                setTimeout(() => setChatMsgs(prev => [...prev, { from: "seller", text: lang === "sw" ? "Asante! Nitakujibu hivi karibuni." : "Thanks! I'll reply shortly." }]), 1200);
              }
            }} style={{ width: 44, height: 44, borderRadius: "50%", background: T.primary, border: "none", color: "#fff", fontSize: 20, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}>↑</button>
          </div>
        </div>
      )}

      {/* ══════════════════════════════════════════════════════════════════════
          POST LISTING
      ══════════════════════════════════════════════════════════════════════ */}
      {screen === "post" && (
        <div>
          <div style={{ background: T.primary, padding: "16px", display: "flex", alignItems: "center", gap: 10 }}>
            <div onClick={() => nav("home", "home")} style={{ color: "#fff", fontSize: 22, cursor: "pointer" }}>←</div>
            <div style={{ color: "#fff", fontWeight: 700, fontSize: 15 }}>{tr.postListing}</div>
          </div>
          <div style={{ padding: 16 }}>
            {[
              { label: tr.itemTitle, field: "title", placeholder: tr.itemTitlePlaceholder, type: "text" },
              { label: tr.price, field: "price", placeholder: "850", type: "number" },
            ].map(f => (
              <div key={f.field} style={{ marginBottom: 14 }}>
                <label style={{ fontSize: 12, fontWeight: 700, color: T.text, display: "block", marginBottom: 7 }}>{f.label}</label>
                <input value={postForm[f.field]} onChange={e => setPostForm({ ...postForm, [f.field]: e.target.value })} type={f.type} placeholder={f.placeholder}
                  style={{ width: "100%", padding: "11px 13px", borderRadius: 11, border: `1px solid ${T.border}`, fontSize: 14, color: T.text, boxSizing: "border-box", background: T.card }} />
              </div>
            ))}
            <div style={{ marginBottom: 14 }}>
              <label style={{ fontSize: 12, fontWeight: 700, color: T.text, display: "block", marginBottom: 7 }}>{tr.description}</label>
              <textarea value={postForm.desc} onChange={e => setPostForm({ ...postForm, desc: e.target.value })} placeholder={tr.descPlaceholder} rows={4}
                style={{ width: "100%", padding: "11px 13px", borderRadius: 11, border: `1px solid ${T.border}`, fontSize: 14, color: T.text, resize: "none", boxSizing: "border-box", background: T.card }} />
            </div>
            <div style={{ marginBottom: 14 }}>
              <label style={{ fontSize: 12, fontWeight: 700, color: T.text, display: "block", marginBottom: 7 }}>{tr.category}</label>
              <select value={postForm.cat} onChange={e => setPostForm({ ...postForm, cat: e.target.value })} style={{ width: "100%", padding: "11px 13px", borderRadius: 11, border: `1px solid ${T.border}`, fontSize: 14, color: T.text, background: T.card }}>
                {CATEGORIES.map(c => <option key={c.id} value={c.id}>{c.icon} {lang === "sw" ? c.sw : c.en} — {c.sub}</option>)}
              </select>
            </div>
            <div style={{ marginBottom: 18 }}>
              <label style={{ fontSize: 12, fontWeight: 700, color: T.text, display: "block", marginBottom: 7 }}>{tr.town}</label>
              <select value={postForm.town} onChange={e => setPostForm({ ...postForm, town: e.target.value })} style={{ width: "100%", padding: "11px 13px", borderRadius: 11, border: `1px solid ${T.border}`, fontSize: 14, color: T.text, background: T.card }}>
                {TOWNS.map(t => <option key={t}>{t}</option>)}
              </select>
            </div>
            {/* Boost toggle */}
            <div style={{ background: T.accentSoft, borderRadius: 14, padding: 16, marginBottom: 18, border: `1px solid ${T.accent}` }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <div>
                  <div style={{ fontWeight: 700, color: T.text, fontSize: 14 }}>⚡ {tr.boostListing}</div>
                  <div style={{ fontSize: 12, color: T.textMuted, marginTop: 2 }}>{tr.boostDesc}</div>
                </div>
                <div onClick={() => setPostForm({ ...postForm, boost: !postForm.boost })}
                  style={{ width: 48, height: 26, borderRadius: 13, background: postForm.boost ? T.accent : T.border, position: "relative", cursor: "pointer", transition: "background 0.2s", flexShrink: 0 }}>
                  <div style={{ width: 20, height: 20, borderRadius: "50%", background: "#fff", position: "absolute", top: 3, left: postForm.boost ? 25 : 3, transition: "left 0.2s", boxShadow: "0 1px 3px rgba(0,0,0,0.2)" }} />
                </div>
              </div>
            </div>
            <button onClick={() => { showToast(lang === "sw" ? "Tangazo lako limesent kwa ukaguzi!" : "Listing sent for review!"); setPostForm({ title: "", cat: "mitumba", price: "", town: "Nairobi", desc: "", boost: false }); nav("home", "home"); }}
              style={{ width: "100%", padding: 16, background: T.primary, color: "#fff", border: "none", borderRadius: 14, fontSize: 15, fontWeight: 800, cursor: "pointer", marginBottom: 8 }}>
              {postForm.boost ? tr.publishBoosted : tr.publishFree}
            </button>
            <div style={{ textAlign: "center", fontSize: 11, color: T.textMuted }}>{tr.listingNote}</div>
          </div>
        </div>
      )}

      {/* ══════════════════════════════════════════════════════════════════════
          PROFILE
      ══════════════════════════════════════════════════════════════════════ */}
      {screen === "profile" && (
        <div>
          <div style={{ background: T.primary, padding: "22px 16px 18px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
              <div style={{ width: 58, height: 58, borderRadius: "50%", background: T.accent, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 28, fontWeight: 800, color: T.primary }}>A</div>
              <div>
                <div style={{ color: "#fff", fontWeight: 800, fontSize: 18 }}>Araff Mtumba</div>
                <div style={{ color: "rgba(255,255,255,0.6)", fontSize: 12 }}>Nakuru · {userPlan === "free" ? tr.freePlan : userPlan === "daily" ? `Daily ⚡` : `Weekly ⚡`}</div>
                <div style={{ marginTop: 4, display: "flex", gap: 6 }}>
                  {["buyer", "seller", "admin"].map(r => (
                    <div key={r} onClick={() => setUserRole(r)} style={{ background: userRole === r ? T.accent : "rgba(255,255,255,0.12)", color: userRole === r ? T.primary : "#fff", borderRadius: 12, padding: "2px 10px", fontSize: 11, fontWeight: 700, cursor: "pointer" }}>
                      {r === "buyer" ? (lang === "sw" ? "Mnunuzi" : "Buyer") : r === "seller" ? (lang === "sw" ? "Muuzaji" : "Seller") : "Admin"}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
          <div style={{ padding: 16 }}>
            {[
              { icon: "📦", label: tr.myListings, action: () => { nav("browse", "browse"); } },
              { icon: "🛒", label: tr.myOrders, action: () => {} },
              { icon: "💬", label: tr.myChats, action: () => {} },
              { icon: "📊", label: lang === "sw" ? "Dashibodi ya Muuzaji" : "Seller Dashboard", action: () => nav("seller", "profile"), highlight: userRole === "seller" },
              { icon: "🛡️", label: lang === "sw" ? "Dashibodi ya Msimamizi" : "Admin Panel", action: () => nav("admin", "profile"), highlight: userRole === "admin" },
              { icon: "✓", label: tr.verifiedBadge, action: () => setShowUpgrade(true), accent: true },
              { icon: "⚡", label: tr.upgradePlan, action: () => setShowUpgrade(true), accent: true },
              { icon: "🌍", label: tr.language, action: () => setLang(lang === "en" ? "sw" : "en"), sub: tr.switchLang },
            ].map((item, i) => (
              <div key={i} onClick={item.action}
                style={{ background: T.card, borderRadius: 13, padding: "14px 16px", marginBottom: 8, display: "flex", alignItems: "center", gap: 13, cursor: "pointer", border: item.accent ? `1px solid ${T.accent}` : item.highlight ? `1px solid ${T.primary}` : `1px solid ${T.border}` }}>
                <span style={{ fontSize: 20 }}>{item.icon}</span>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 14, fontWeight: item.accent || item.highlight ? 700 : 500, color: item.accent ? T.accentDark : item.highlight ? T.primary : T.text }}>{item.label}</div>
                  {item.sub && <div style={{ fontSize: 11, color: T.textMuted, marginTop: 1 }}>{item.sub}</div>}
                </div>
                <span style={{ color: T.textMuted, fontSize: 16 }}>›</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ══════════════════════════════════════════════════════════════════════
          SELLER DASHBOARD
      ══════════════════════════════════════════════════════════════════════ */}
      {screen === "seller" && (
        <div>
          <div style={{ background: T.primary, padding: "16px", display: "flex", alignItems: "center", gap: 10 }}>
            <div onClick={() => nav("profile", "profile")} style={{ color: "#fff", fontSize: 22, cursor: "pointer" }}>←</div>
            <div style={{ color: "#fff", fontWeight: 700, fontSize: 15 }}>{tr.sellerDash}</div>
          </div>
          <div style={{ padding: 16 }}>
            {/* Stats */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 18 }}>
              {[[tr.totalSales, "127", "🛍️"], [tr.activeListings, "8", "📋"], [tr.pendingOrders, "3", "⏳"], [tr.earnings, "42,500", "💰"]].map(([label, val, icon]) => (
                <div key={label} style={{ background: T.card, borderRadius: 14, padding: 16, border: `1px solid ${T.border}` }}>
                  <div style={{ fontSize: 22 }}>{icon}</div>
                  <div style={{ fontSize: 22, fontWeight: 900, color: T.primary, marginTop: 6 }}>{val}</div>
                  <div style={{ fontSize: 11, color: T.textMuted, marginTop: 2 }}>{label}</div>
                </div>
              ))}
            </div>
            {/* Pending orders with response timer */}
            <div style={{ fontWeight: 800, color: T.text, fontSize: 14, marginBottom: 12 }}>
              {lang === "sw" ? "Maagizo Yanayosubiri Uthibitisho" : "Orders Awaiting Confirmation"}
            </div>
            {[{ id: 1, item: "Levi's Jeans", buyer: "Peter K.", amount: 850 }, { id: 2, item: "Polo Shirt XL", buyer: "Aisha M.", amount: 550 }].map(order => (
              <div key={order.id} style={{ background: T.card, borderRadius: 14, padding: 16, marginBottom: 10, border: `1.5px solid ${respondTimers[order.id] < 5 ? T.coral : T.border}` }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 10 }}>
                  <div>
                    <div style={{ fontWeight: 700, color: T.text, fontSize: 14 }}>{order.item}</div>
                    <div style={{ fontSize: 12, color: T.textMuted }}>by {order.buyer} · Ksh {order.amount}</div>
                  </div>
                  <div style={{ textAlign: "right" }}>
                    <div style={{ fontSize: 10, color: T.textMuted }}>{tr.respondTimer}</div>
                    <div style={{ fontSize: 16, fontWeight: 900, color: respondTimers[order.id] < 5 ? T.coral : T.primary }}>{respondTimers[order.id]}m</div>
                  </div>
                </div>
                <div style={{ display: "flex", gap: 8 }}>
                  <button onClick={() => { showToast(lang === "sw" ? "Imethibitishwa!" : "Confirmed!"); setRespondTimers(t => ({ ...t, [order.id]: 0 })); }}
                    style={{ flex: 1, padding: "9px 0", background: T.success, color: "#fff", border: "none", borderRadius: 10, fontSize: 13, fontWeight: 700, cursor: "pointer" }}>
                    {tr.confirmAvail} ✓
                  </button>
                  <button onClick={() => showToast(lang === "sw" ? "Imewekwa kama imeuzwa" : "Marked as sold", "error")}
                    style={{ flex: 1, padding: "9px 0", background: T.surface, color: T.textMid, border: `1px solid ${T.border}`, borderRadius: 10, fontSize: 13, fontWeight: 700, cursor: "pointer" }}>
                    {tr.markSold}
                  </button>
                </div>
              </div>
            ))}
            {/* My listings */}
            <div style={{ fontWeight: 800, color: T.text, fontSize: 14, margin: "18px 0 12px" }}>{tr.myListings}</div>
            {LISTINGS.filter(l => l.seller === "Grace Wanjiru" || l.seller === "Gikomba Picks").map(l => (
              <ListingCard key={l.id} listing={l} lang={lang} onClick={() => { setActiveListing(l); nav("listing", "browse"); }} />
            ))}
          </div>
        </div>
      )}

      {/* ══════════════════════════════════════════════════════════════════════
          ADMIN PANEL
      ══════════════════════════════════════════════════════════════════════ */}
      {screen === "admin" && (
        <div>
          <div style={{ background: T.primary, padding: "16px", display: "flex", alignItems: "center", gap: 10 }}>
            <div onClick={() => nav("profile", "profile")} style={{ color: "#fff", fontSize: 22, cursor: "pointer" }}>←</div>
            <div style={{ color: "#fff", fontWeight: 700, fontSize: 15 }}>{tr.adminPanel}</div>
            <div style={{ marginLeft: "auto", background: T.coral, borderRadius: 12, padding: "2px 10px", fontSize: 11, color: "#fff", fontWeight: 700 }}>
              {DISPUTES.filter(d => d.status === "open").length + PENDING_VERIF.length} {lang === "sw" ? "vitu" : "items"}
            </div>
          </div>
          <div style={{ padding: 16 }}>
            {/* Stats */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 8, marginBottom: 20 }}>
              {[[lang === "sw" ? "Wauzaji" : "Sellers", "24", "👥"], [lang === "sw" ? "Bidhaa" : "Listings", "183", "📋"], [lang === "sw" ? "Mauzo Leo" : "Sales Today", "12", "💳"]].map(([label, val, icon]) => (
                <div key={label} style={{ background: T.card, borderRadius: 12, padding: 12, textAlign: "center", border: `1px solid ${T.border}` }}>
                  <div style={{ fontSize: 20 }}>{icon}</div>
                  <div style={{ fontSize: 20, fontWeight: 900, color: T.primary }}>{val}</div>
                  <div style={{ fontSize: 10, color: T.textMuted }}>{label}</div>
                </div>
              ))}
            </div>

            {/* Disputes */}
            <div style={{ fontWeight: 800, color: T.text, fontSize: 14, marginBottom: 12 }}>
              🚨 {tr.disputes} ({DISPUTES.filter(d => d.status === "open").length})
            </div>
            {DISPUTES.filter(d => d.status === "open").map(d => (
              <div key={d.id} style={{ background: T.card, borderRadius: 14, padding: 16, marginBottom: 10, border: `1.5px solid ${T.coral}` }}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
                  <div style={{ fontWeight: 700, color: T.text, fontSize: 14 }}>#{d.id} — {d.item}</div>
                  <div style={{ fontSize: 13, fontWeight: 700, color: T.primary }}>Ksh {d.amount}</div>
                </div>
                <div style={{ fontSize: 12, color: T.textMuted, marginBottom: 4 }}>Buyer: {d.buyer} · Seller: {d.seller}</div>
                <div style={{ fontSize: 13, color: T.coral, marginBottom: 12, background: T.coralSoft, borderRadius: 8, padding: "6px 10px" }}>{d.issue}</div>
                <div style={{ display: "flex", gap: 8 }}>
                  <button onClick={() => showToast(`Dispute ${d.id} resolved — refund issued`)}
                    style={{ flex: 1, padding: 9, background: T.success, color: "#fff", border: "none", borderRadius: 9, fontSize: 12, fontWeight: 700, cursor: "pointer" }}>
                    ✓ {lang === "sw" ? "Rudisha Pesa" : "Refund Buyer"}
                  </button>
                  <button onClick={() => showToast(`Dispute ${d.id} — payment released to seller`)}
                    style={{ flex: 1, padding: 9, background: T.primary, color: "#fff", border: "none", borderRadius: 9, fontSize: 12, fontWeight: 700, cursor: "pointer" }}>
                    → {lang === "sw" ? "Lipa Muuzaji" : "Release to Seller"}
                  </button>
                </div>
              </div>
            ))}

            {/* Pending verifications */}
            <div style={{ fontWeight: 800, color: T.text, fontSize: 14, margin: "20px 0 12px" }}>
              🔍 {tr.pendingVerif} ({PENDING_VERIF.length})
            </div>
            {PENDING_VERIF.map(v => (
              <div key={v.id} style={{ background: T.card, borderRadius: 14, padding: 16, marginBottom: 10, border: `1px solid ${T.border}` }}>
                <div style={{ fontWeight: 700, color: T.text, fontSize: 14 }}>{v.name}</div>
                <div style={{ fontSize: 12, color: T.textMuted, marginTop: 3 }}>{v.town} · {v.category} · ID: {v.idNo} · {v.phone}</div>
                <div style={{ display: "flex", gap: 8, marginTop: 12 }}>
                  <button onClick={() => showToast(`${v.name} approved as Verified Seller ✓`)}
                    style={{ flex: 1, padding: 9, background: T.success, color: "#fff", border: "none", borderRadius: 9, fontSize: 12, fontWeight: 700, cursor: "pointer" }}>
                    ✓ {tr.approve}
                  </button>
                  <button onClick={() => showToast(`${v.name} application rejected`, "error")}
                    style={{ flex: 1, padding: 9, background: T.surface, color: T.coral, border: `1px solid ${T.coral}`, borderRadius: 9, fontSize: 12, fontWeight: 700, cursor: "pointer" }}>
                    ✗ {lang === "sw" ? "Kataa" : "Reject"}
                  </button>
                </div>
              </div>
            ))}

            {/* Flagged sellers */}
            <div style={{ fontWeight: 800, color: T.text, fontSize: 14, margin: "20px 0 12px" }}>🚩 {tr.flagged}</div>
            <div style={{ background: T.card, borderRadius: 14, padding: 16, border: `1px solid ${T.border}` }}>
              <div style={{ fontWeight: 700, color: T.text }}>Fake Goods Seller</div>
              <div style={{ fontSize: 12, color: T.textMuted, marginTop: 2 }}>Nairobi · 3 complaints · Mitumba</div>
              <div style={{ display: "flex", gap: 8, marginTop: 12 }}>
                <button onClick={() => showToast("Seller suspended", "error")} style={{ flex: 1, padding: 9, background: T.coralSoft, color: T.coral, border: `1px solid ${T.coral}`, borderRadius: 9, fontSize: 12, fontWeight: 700, cursor: "pointer" }}>
                  {tr.suspend}
                </button>
                <button onClick={() => showToast("Warning sent to seller")} style={{ flex: 1, padding: 9, background: T.surface, color: T.textMid, border: `1px solid ${T.border}`, borderRadius: 9, fontSize: 12, fontWeight: 700, cursor: "pointer" }}>
                  {lang === "sw" ? "Tuma Onyo" : "Warn"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── BOTTOM NAV ──────────────────────────────────────────────────────── */}
      {screen !== "chat" && (
        <div style={{ position: "fixed", bottom: 0, left: "50%", transform: "translateX(-50%)", width: "100%", maxWidth: 430, background: T.card, borderTop: `1px solid ${T.border}`, display: "flex", zIndex: 50, boxShadow: "0 -2px 12px rgba(0,0,0,0.07)" }}>
          {[
            { icon: "🏠", labelEn: "Home", labelSw: "Nyumbani", s: "home", key: "home" },
            { icon: "🔍", labelEn: "Browse", labelSw: "Tafuta", s: "browse", key: "browse" },
            { icon: "➕", labelEn: "Post", labelSw: "Weka", s: "post", key: "post" },
            { icon: "👤", labelEn: "Profile", labelSw: "Mimi", s: "profile", key: "profile" },
          ].map(n => (
            <div key={n.key} onClick={() => { nav(n.s, n.key); if (n.s === "browse") { setCatFilter(null); setBrowseTab("listings"); } }}
              style={{ flex: 1, padding: "10px 0 8px", textAlign: "center", cursor: "pointer" }}>
              <div style={{ fontSize: 22 }}>{n.icon}</div>
              <div style={{ fontSize: 10, color: activeNav === n.key ? T.primary : T.textMuted, fontWeight: activeNav === n.key ? 800 : 400, marginTop: 2 }}>
                {lang === "sw" ? n.labelSw : n.labelEn}
              </div>
              {activeNav === n.key && <div style={{ width: 18, height: 3, background: T.primary, borderRadius: 2, margin: "3px auto 0" }} />}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
