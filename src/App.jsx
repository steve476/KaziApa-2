import { useState, useEffect, useRef, Fragment } from "react";
import { createClient } from "@supabase/supabase-js";
import AboutUs from './AboutUs';
import WhyKaziApa from './WhyKaziApa';
import './AboutPages.css';

// ─── SUPABASE ────────────────────────────────────────────────────────────────
const SUPABASE_URL = "https://dalaawxoiecrmfwxwrdn.supabase.co";
const SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRhbGFhd3hvaWVjcm1md3h3cmRuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODE1MTg1NjksImV4cCI6MjA5NzA5NDU2OX0.vl3NdmbF4suNoSeDXLwksYIhx8V-TddrKT0ZShHZwws";
// Login token (issued by /api/verify-otp after a correct OTP). When present and not expired it is sent with
// database requests (REST only) so the database knows which phone number is asking. Without it, requests use the public key as before.
function getLoginToken() {
  try {
    const t = JSON.parse(localStorage.getItem("kaziapa_token") || "null");
    if (t && t.token && t.exp && t.exp > Math.floor(Date.now()/1000) + 60) return t.token;
  } catch(e) {}
  return null;
}
const sb = createClient(SUPABASE_URL, SUPABASE_KEY, {
  global: {
    fetch: (url, opts = {}) => {
      try {
        const tok = getLoginToken();
        if (tok && String(url).includes("/rest/v1/")) {
          const h = new Headers(opts.headers || {});
          h.set("Authorization", "Bearer " + tok);
          return fetch(url, { ...opts, headers: h });
        }
      } catch(e) {}
      return fetch(url, opts);
    }
  }
});

// ─── DESIGN TOKENS ───────────────────────────────────────────────────────────
const T = {
  primary:"#0066CC",primaryMid:"#0055AA",primaryLight:"#3385D6",primarySoft:"#E8F2FF",
  accent:"#F5A623",accentSoft:"#FFF8E7",accentDark:"#C4841A",
  coral:"#E84040",coralSoft:"#FFF0F0",
  success:"#1E9B5A",successSoft:"#E8F5EE",
  surface:"#F5F8FF",card:"#FFFFFF",
  text:"#0A1628",textMid:"#3A4A5C",textMuted:"#7A8A9C",
  border:"#DCE8F5",overlay:"rgba(0,51,102,0.6)",
};

const ROLE_LABELS = { property_manager:"Property Manager", caretaker:"Caretaker", accountant:"Accountant" };
const ROLE_DESCRIPTIONS = {
  property_manager: "Full access — properties, tenants, payments, maintenance, settings. Can't manage the team.",
  caretaker: "Views tenants and units, handles maintenance requests. No payment or financial access.",
  accountant: "Views and confirms payments, records manual entries. No property or maintenance access.",
};

const CATEGORIES = [
  { id:"mitumba",en:"Mitumba", sw:"Mitumba", subSw:"Nguo za Mitumba", sub:"Secondhand Clothes",icon:"👕",color:"#0066CC" },
  { id:"shamba", en:"Shamba",  sw:"Shamba",  subSw:"Shamba na Ardhi", sub:"Farm & Land",        icon:"🌽",color:"#1E9B5A" },
  { id:"vitu",   en:"Goods",   sw:"Vitu",    subSw:"Vitu vya Kawaida", sub:"General Items",      icon:"📦",color:"#C2680A" },
  { id:"kazi",   en:"Jobs",    sw:"Kazi",    subSw:"Kazi na Vibarua", sub:"Jobs & Gigs",        icon:"💼",color:"#6C3483" },
  { id:"nyumba", en:"Housing", sw:"Nyumba",  subSw:"Nyumba na Mawakala", sub:"Rentals & Agents",   icon:"🏠",color:"#0E8F8A" },
  { id:"fundi",  en:"Services",sw:"Fundi",   subSw:"Mafundi na Wataalamu", sub:"Fundis & Pros",      icon:"🔧",color:"#1A5276" },
  { id:"usafiri",en:"Transport",sw:"Usafiri",subSw:"Boda, Teksi na Zaidi", sub:"Boda, Taxi & More",  icon:"🏍️",color:"#B5385A" },
];
const SW = {
 "Home": "Nyumbani",
 "Browse": "Vinjari",
 "Requests": "Maombi",
 "Post": "Weka",
 "Profile": "Wasifu",
 "Search item or town...": "Tafuta bidhaa au mji...",
 "Upgrade": "Boresha",
 "CONCIERGE SERVICE": "HUDUMA MAALUM",
 "Can't find what you need?": "Huwezi kupata unachohitaji?",
 "Tell us — we'll find it within 3–6 hours. →": "Tuambie — tutakipata ndani ya saa 3–6. →",
 "Need something sourced or done?": "Unahitaji kitu kitafutwe au kifanywe?",
 "Shopping, fashion sourcing, event photography & more. →": "Ununuzi, mitindo, picha za matukio na zaidi. →",
 "MY MARKET": "SOKO LANGU",
 "Find your local market": "Tafuta soko lako la karibu",
 "Gikomba, Kibuye, and 60+ markets across Kenya": "Gikomba, Kibuye, na masoko zaidi ya 60 kote Kenya",
 "MY HOOD": "MTAA WANGU",
 "Find your estate or area": "Tafuta mtaa au eneo lako",
 "Notices, jobs & requests just for your hood": "Matangazo, kazi na maombi ya mtaa wako",
 "Explore KaziApa": "Gundua KaziApa",
 "Find what you need, closer to home.": "Pata unachohitaji, karibu na nyumbani.",
 "7 categories": "Makundi 7",
 "Latest Listings": "Bidhaa Mpya",
 "See All →": "Ona Zote →",
 "No listings yet.": "Hakuna bidhaa bado.",
 "No opportunities posted here yet. Be the first to help your community.": "Hakuna fursa zilizowekwa hapa bado. Kuwa wa kwanza kusaidia jamii yako.",
 "All Listings": "Bidhaa Zote",
 "Listings": "Bidhaa",
 "Special Request": "Ombi Maalum",
 "Town...": "Mji...",
 "📍 Locating...": "📍 Inatafuta...",
 "✕ Nearest": "✕ Karibu zaidi",
 "📍 Near Me": "📍 Karibu Nami",
 "All": "Zote",
 "Nothing here yet.": "Hakuna kitu hapa bado.",
 "Make a Request": "Weka Ombi",
 "Post a Listing": "Weka Bidhaa",
 "Title": "Kichwa",
 "Price (Ksh)": "Bei (Ksh)",
 "Description": "Maelezo",
 "Category": "Aina",
 "Your Town / Area": "Mji / Eneo Lako",
 "Publish — Free": "Chapisha — Bure",
 "Listings go live immediately on KaziApa.": "Bidhaa zinaonekana mara moja kwenye KaziApa.",
 "WhatsApp Notifications": "Arifa za WhatsApp",
 "My Kiosk": "Kioski Yangu",
 "My Chats": "Mazungumzo Yangu",
 "My Listings": "Bidhaa Zangu",
 "My Orders": "Oda Zangu",
 "Housing & Rentals": "Nyumba na Pango",
 "Upgrade Plan": "Boresha Mpango",
 "Get Verified Badge": "Pata Alama ya Uthibitisho",
 "Language": "Lugha",
 "Community Guidelines": "Miongozo ya Jamii",
 "Privacy Policy": "Sera ya Faragha",
 "Terms & Conditions": "Masharti na Vigezo",
 "About KaziApa": "Kuhusu KaziApa",
 "Why KaziApa": "Kwa Nini KaziApa",
 "Contact Us": "Wasiliana Nasi",
 "Log Out": "Toka",
 "Admin Panel": "Paneli ya Msimamizi"
};
const tr = (lang, s) => (lang==="sw" && SW[s]) ? SW[s] : s;
const CAT_COLOR = Object.fromEntries(CATEGORIES.map(c=>[c.id,c.color]));
const CAT_ICON  = Object.fromEntries(CATEGORIES.map(c=>[c.id,c.icon]));

const PHONE_RGX   = /(\+?254|0)[17]\d{8}|\b07\d{8}\b|\b01\d{8}\b/g;
const ADMIN_PHONES = ["0768761424"]; // only these phone numbers see the Admin Panel
const CONTACT_RGX = /(@[\w]+|wa\.me|whatsapp|instagram|facebook|nipe.*nambari|number yangu)/i;
const DEAL_RGX    = /\b(sawa|deal|nataka|nimechukua|confirmed|bei sawa|niko tayari|agreed)\b/i;

const RIDERS = [
  { id:1,name:"Brian M.",  stage:"Kibuye Stage",    town:"Kisumu", rating:4.8,trips:234,available:true },
  { id:2,name:"Kevin O.",  stage:"Kondele Stage",   town:"Kisumu", rating:4.9,trips:187,available:true },
  { id:3,name:"Peter N.",  stage:"Westlands Stage", town:"Nairobi",rating:5.0,trips:89, available:true },
  { id:4,name:"Hassan A.", stage:"Nyali Stage",     town:"Mombasa",rating:4.6,trips:156,available:true },
  { id:5,name:"James K.",  stage:"Nakuru CBD",      town:"Nakuru", rating:4.7,trips:312,available:true },
];
const BUS = [
  { name:"Bus Parcel (Standard)", price:250, time:"Same/Next day" },
];
const DELIVERY_ZONES = [
  { id:"same",     label:"Same Stage / Area",     price:50,  time:"15–30 mins" },
  { id:"cbd",      label:"Within Town CBD",        price:100, time:"30–60 mins" },
  { id:"outskirts",label:"Outskirts / Estate",     price:150, time:"45–90 mins" },
  { id:"parcel",   label:"Bus Parcel (Other Town)",price:250, time:"Same/Next day" },
];

// ─── HELPERS ─────────────────────────────────────────────────────────────────
function Stars({ rating,size=11 }) {
  return <span style={{ color:T.accent,fontSize:size }}>{"★".repeat(Math.floor(rating||0))}{"☆".repeat(5-Math.floor(rating||0))}<span style={{ color:T.textMuted,marginLeft:3 }}>{rating||"New"}</span></span>;
}
function Pill({ children,color=T.primary,bg=T.primarySoft }) {
  return <span style={{ background:bg,color,fontSize:10,fontWeight:700,padding:"2px 8px",borderRadius:20 }}>{children}</span>;
}
function Btn({ children,onClick,color=T.primary,text="#fff",style={},disabled=false }) {
  return <button onClick={onClick} disabled={disabled} style={{ padding:"13px 0",width:"100%",background:disabled?"#ccc":color,color:text,border:"none",borderRadius:13,fontSize:15,fontWeight:800,cursor:disabled?"default":"pointer",...style }}>{children}</button>;
}
function Icon({ n, s=16, c="currentColor", fill="none", style={} }) {
  const P = {
    zap:<polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/>,
    phone:<><rect x="5" y="2" width="14" height="20" rx="2" ry="2"/><line x1="12" y1="18" x2="12.01" y2="18"/></>,
    unlock:<><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 9.9-1"/></>,
    lock:<><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></>,
    card:<><rect x="1" y="4" width="22" height="16" rx="2" ry="2"/><line x1="1" y1="10" x2="23" y2="10"/></>,
    check:<polyline points="20 6 9 17 4 12"/>,
    checkCircle:<><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></>,
    star:<polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>,
    alert:<><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></>,
    boost:<><polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/><polyline points="17 6 23 6 23 12"/></>,
    gift:<><polyline points="20 12 20 22 4 22 4 12"/><rect x="2" y="7" width="20" height="5"/><line x1="12" y1="22" x2="12" y2="7"/><path d="M12 7H7.5a2.5 2.5 0 0 1 0-5C11 2 12 7 12 7z"/><path d="M12 7h4.5a2.5 2.5 0 0 0 0-5C13 2 12 7 12 7z"/></>,
    home:<><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></>,
    search:<><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></>,
    clipboard:<><path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"/><rect x="8" y="2" width="8" height="4" rx="1" ry="1"/></>,
    plus:<><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></>,
    user:<><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></>,
    bell:<><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/></>,
    chat:<path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>,
    pin:<><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></>,
    chevron:<polyline points="9 18 15 12 9 6"/>,
    arrow:<><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></>,
  };
  return <svg width={s} height={s} viewBox="0 0 24 24" fill={fill} stroke={c} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ verticalAlign:"-0.2em", flexShrink:0, ...style }}>{P[n]}</svg>;
}
function CatImg({ id, emoji, size=44 }) {
  const [bad,setBad] = useState(false);
  if (bad) return <div style={{ fontSize:Math.round(size*0.62),lineHeight:1,height:size,display:"flex",alignItems:"center",justifyContent:"center" }}>{emoji}</div>;
  return <img src={`/cats/${id}.webp`} alt="" width={size} height={size} loading="lazy" decoding="async" onError={()=>setBad(true)} style={{ display:"block",margin:"0 auto",objectFit:"contain",maxWidth:"100%",filter:"saturate(1.12) contrast(1.03)" }} />;
}
function BannerArt({ name, size=64 }) {
  const [bad,setBad] = useState(false);
  if (bad) return null;
  return <img src={`/banners/${name}.webp`} alt="" width={size} height={size} loading="lazy" decoding="async" onError={()=>setBad(true)} style={{ display:"block",objectFit:"contain",flexShrink:0 }} />;
}
function CatCard({ cat, label, sub, onClick }) {
  return (
    <div role="button" tabIndex={0} aria-label={`${label} — ${sub||cat.sub}`} className="ka-press ka-category-card ka-category-3d" onClick={onClick}
      onKeyDown={e=>{ if (e.key==="Enter"||e.key===" ") { e.preventDefault(); onClick(); } }}
      style={{ background:`linear-gradient(145deg,#FFFFFF 0%,${cat.color}0D 100%)`,border:`1px solid ${cat.color}35`,borderRadius:19,padding:"12px 6px 11px",textAlign:"center",cursor:"pointer",position:"relative",minHeight:122,boxSizing:"border-box",boxShadow:"0 7px 0 rgba(14,39,70,.035),0 10px 22px rgba(18,47,82,.08),inset 0 1px 0 #fff",overflow:"hidden" }}>
      <div aria-hidden="true" style={{ position:"absolute",width:62,height:62,borderRadius:"50%",top:4,left:"50%",transform:"translateX(-50%)",background:`radial-gradient(circle at 28% 20%,#FFFFFF 0%,${cat.color}20 45%,${cat.color}08 100%)`,border:`1px solid ${cat.color}20`,boxShadow:`inset 0 3px 7px rgba(255,255,255,.95),inset 0 -5px 9px ${cat.color}12,0 5px 10px rgba(15,35,60,.07)` }} />
      <div style={{ position:"absolute",top:8,right:7,color:cat.color,opacity:0.7,display:"flex" }}><Icon n="chevron" s={12} /></div>
      <div style={{ position:"relative",zIndex:1,margin:"0 auto 7px",height:56,width:60,display:"flex",alignItems:"center",justifyContent:"center",filter:"drop-shadow(0 8px 5px rgba(15,35,60,0.22))" }}>
        <CatImg id={cat.id} emoji={cat.icon} size={48} />
      </div>
      <div style={{ fontSize:12.5,fontWeight:850,color:T.text,letterSpacing:-0.15 }}>{label}</div>
      <div style={{ fontSize:10,color:T.textMuted,marginTop:3,lineHeight:1.25 }}>{sub||cat.sub}</div>
      <div aria-hidden="true" style={{ position:"absolute",bottom:0,left:"20%",right:"20%",height:3,borderRadius:"5px 5px 0 0",background:`linear-gradient(90deg,${cat.color}30,${cat.color}95,${cat.color}30)` }} />
    </div>
  );
}
function ListingSkeleton({ count=4 }) {
  return (
    <div aria-hidden="true">
      <style>{`@keyframes kaShimmer{0%,100%{opacity:.55}50%{opacity:1}}@media (prefers-reduced-motion:reduce){.ka-skel{animation:none!important}}`}</style>
      {Array.from({ length:count }).map((_,i)=>(
        <div key={i} className="ka-skel" style={{ display:"flex",gap:10,alignItems:"center",background:T.card,border:`1px solid ${T.border}`,borderRadius:14,padding:"10px 12px 10px 13px",marginBottom:10,animation:"kaShimmer 1.2s ease-in-out infinite" }}>
          <div style={{ width:80,height:80,borderRadius:8,background:T.border,flexShrink:0 }} />
          <div style={{ flex:1 }}>
            <div style={{ height:12,width:"70%",background:T.border,borderRadius:6,marginBottom:9 }} />
            <div style={{ height:10,width:"45%",background:T.border,borderRadius:6,marginBottom:14 }} />
            <div style={{ height:14,width:"35%",background:T.border,borderRadius:6,marginLeft:"auto" }} />
          </div>
        </div>
      ))}
    </div>
  );
}

// Consistent empty / error message used across screens
function StateMessage({ icon="📦", title, text, actionLabel, onAction, tone="neutral" }) {
  return (
    <div role={tone==="error"?"alert":undefined} style={{ textAlign:"center",padding:"40px 20px",color:T.textMuted }}>
      <div style={{ fontSize:44 }}>{icon}</div>
      <div style={{ marginTop:12,fontWeight:800,fontSize:15,color:T.text }}>{title}</div>
      {text && <div style={{ fontSize:13,marginTop:6,lineHeight:1.5 }}>{text}</div>}
      {actionLabel && <button onClick={onAction} style={{ marginTop:16,background:T.primary,color:"#fff",border:"none",borderRadius:10,padding:"10px 22px",fontSize:13,fontWeight:700,cursor:"pointer" }}>{actionLabel}</button>}
    </div>
  );
}

// Skeleton rows for chat lists while loading
function ChatSkeleton({ count=4 }) {
  return (
    <div aria-hidden="true">
      <style>{`@keyframes kaShimmer{0%,100%{opacity:.55}50%{opacity:1}}@media (prefers-reduced-motion:reduce){.ka-skel{animation:none!important}}`}</style>
      {Array.from({ length:count }).map((_,i)=>(
        <div key={i} className="ka-skel" style={{ display:"flex",gap:12,alignItems:"center",background:T.card,border:`1px solid ${T.border}`,borderRadius:14,padding:14,marginBottom:10,animation:"kaShimmer 1.4s ease-in-out infinite" }}>
          <div style={{ width:42,height:42,borderRadius:"50%",background:T.border,flexShrink:0 }} />
          <div style={{ flex:1 }}>
            <div style={{ height:12,width:"45%",background:T.border,borderRadius:6,marginBottom:8 }} />
            <div style={{ height:10,width:"65%",background:T.border,borderRadius:6,marginBottom:7 }} />
            <div style={{ height:10,width:"85%",background:T.border,borderRadius:6 }} />
          </div>
        </div>
      ))}
    </div>
  );
}

// ───────── Seller availability + 24-hour status ─────────
// Seller availability for listing cards (filled by App after listings load)
const presenceStore = { map:{} };
const AVAIL = {
  available: { label:"Available today", dot:"🟢", color:"#16a34a" },
  busy:      { label:"Busy",            dot:"🟡", color:"#B7791F" },
  closed:    { label:"Closed",          dot:"🔴", color:"#dc2626" },
};
function timeAgo(iso) {
  const ms = Date.now() - Date.parse(iso);
  if(!(ms>=0)) return "";
  const m = Math.floor(ms/60000);
  if(m < 2) return "just now";
  if(m < 60) return `${m}m ago`;
  const h = Math.floor(m/60);
  if(h < 24) return `${h}h ago`;
  return `${Math.floor(h/24)}d ago`;
}
// Availability is only trusted for 24 hours, so an old "Available" never misleads buyers
function availabilityOf(u) {
  if(!u?.availability || !u.availability_updated_at) return null;
  if(Date.now() - Date.parse(u.availability_updated_at) > 24*3600*1000) return null;
  return AVAIL[u.availability] ? { key:u.availability, ...AVAIL[u.availability] } : null;
}
function compressImageFile(file, MAX=900, q=0.8) {
  return new Promise(resolve=>{
    const reader = new FileReader();
    reader.onload = e => {
      const img = new Image();
      img.onload = () => {
        const c = document.createElement("canvas");
        let w = img.width, h = img.height;
        if(w > MAX) { h = Math.round(h*MAX/w); w = MAX; }
        if(h > MAX) { w = Math.round(w*MAX/h); h = MAX; }
        c.width = w; c.height = h;
        c.getContext("2d").drawImage(img,0,0,w,h);
        c.toBlob(b=>resolve(b),"image/jpeg",q);
      };
      img.onerror = () => resolve(null);
      img.src = e.target.result;
    };
    reader.onerror = () => resolve(null);
    reader.readAsDataURL(file);
  });
}

// Small "🟢 Available today · Active 2h ago" line for a seller
function SellerPresence({ phone, light }) {
  const [u,setU] = useState(null);
  useEffect(()=>{
    if(!phone) return;
    let on = true;
    (async ()=>{
      try {
        const { data } = await sb.from("users").select("availability,availability_updated_at,last_active").eq("phone",phone).single();
        if(on) setU(data||null);
      } catch(e) {}
    })();
    return ()=>{ on = false; };
  },[phone]);
  const a = availabilityOf(u);
  const act = u?.last_active ? timeAgo(u.last_active) : "";
  if(!a && !act) return null;
  return (
    <div style={{ fontSize:11,marginTop:2,display:"flex",gap:8,flexWrap:"wrap" }}>
      {a && <span style={{ color:light?"#fff":a.color,fontWeight:700 }}>{a.dot} {a.label}</span>}
      {act && <span style={{ color:light?"rgba(255,255,255,0.7)":T.textMuted }}>Active {act}</span>}
    </div>
  );
}

// Post a 24-hour status (photo and/or short text)
function StatusComposer({ phone, name, town, avatar, onClose, onPosted, showToast }) {
  const [file,setFile] = useState(null);
  const [preview,setPreview] = useState("");
  const [caption,setCaption] = useState("");
  const [busy,setBusy] = useState(false);
  async function post() {
    if(busy) return;
    if(!file && !caption.trim()) { showToast("Add a photo or some text first","error"); return; }
    setBusy(true);
    try {
      const nowIso = new Date().toISOString();
      const { data:mine } = await sb.from("statuses").select("id").eq("seller_phone",phone).gt("expires_at",nowIso);
      if((mine||[]).length >= 5) { showToast("You already have 5 active statuses. Delete one first.","error"); setBusy(false); return; }
      let image_url = null;
      if(file) {
        const blob = await compressImageFile(file);
        if(!blob) throw new Error("image");
        const nm = `status-${phone}-${Date.now()}.jpg`;
        const { error:upErr } = await sb.storage.from("kaziapa-photos").upload(nm, blob, { contentType:"image/jpeg" });
        if(upErr) throw upErr;
        image_url = sb.storage.from("kaziapa-photos").getPublicUrl(nm).data.publicUrl;
      }
      const { error } = await sb.from("statuses").insert({ seller_phone:phone, seller_name:name, seller_avatar:avatar||null, town:town||null, image_url, caption:caption.trim()||null });
      if(error) throw error;
      showToast("Status posted — visible for 24 hours ✅");
      onPosted();
    } catch(e) {
      showToast("Couldn't post your status. Check your connection and try again.","error");
      setBusy(false);
    }
  }
  return (
    <div role="dialog" aria-modal="true" style={{ position:"fixed",inset:0,background:"rgba(10,22,40,0.6)",zIndex:10000,display:"flex",alignItems:"flex-end",justifyContent:"center" }} onClick={onClose}>
      <div onClick={e=>e.stopPropagation()} style={{ background:"#fff",borderRadius:"20px 20px 0 0",padding:20,width:"100%",maxWidth:430,maxHeight:"90vh",overflowY:"auto" }}>
        <div style={{ fontSize:17,fontWeight:800,color:T.text }}>Add to your status</div>
        <div style={{ fontSize:12,color:T.textMuted,marginTop:4 }}>Shows to everyone for 24 hours — great for today's stock or prices.</div>
        <label style={{ display:"block",marginTop:14,border:`2px dashed ${T.border}`,borderRadius:14,textAlign:"center",cursor:"pointer",overflow:"hidden",background:T.surface }}>
          {preview
            ? <img src={preview} alt="" style={{ width:"100%",maxHeight:260,objectFit:"cover",display:"block" }} />
            : <div style={{ padding:"30px 10px",color:T.textMuted,fontSize:13 }}>📷 Tap to add a photo</div>}
          <input type="file" accept="image/*" style={{ display:"none" }} onChange={e=>{ const f=e.target.files?.[0]; if(f){ setFile(f); setPreview(URL.createObjectURL(f)); } }} />
        </label>
        <textarea value={caption} maxLength={140} onChange={e=>setCaption(e.target.value)} placeholder="e.g. Fresh roses in, Ksh 1,800 per bunch" rows={3}
          style={{ width:"100%",marginTop:12,border:`1px solid ${T.border}`,borderRadius:12,padding:12,fontSize:14,boxSizing:"border-box",resize:"none",fontFamily:"inherit" }} />
        <div style={{ fontSize:11,color:T.textMuted,textAlign:"right" }}>{caption.length}/140</div>
        <div style={{ display:"flex",gap:10,marginTop:10 }}>
          <button onClick={onClose} style={{ flex:1,padding:"12px 0",background:T.surface,color:T.text,border:`1px solid ${T.border}`,borderRadius:10,fontSize:14,fontWeight:700,cursor:"pointer" }}>Cancel</button>
          <button onClick={post} disabled={busy} style={{ flex:2,padding:"12px 0",background:T.primary,color:"#fff",border:"none",borderRadius:10,fontSize:14,fontWeight:700,cursor:"pointer",opacity:busy?0.7:1 }}>{busy ? "Posting..." : "Post status"}</button>
        </div>
      </div>
    </div>
  );
}

// Full-screen status viewer: tap right = next, left = back, auto-advances
function StatusViewer({ group, phone, onClose, onSeen, onChat, onDelete, onReport, onReply }) {
  const [idx,setIdx] = useState(0);
  const [dlg,setDlg] = useState(null);
  const [typing,setTyping] = useState(false);
  const [reply,setReply] = useState("");
  const items = group.items;
  const cur = items[Math.min(idx, items.length-1)];
  const mine = group.seller_phone === phone;
  useEffect(()=>{ if(cur) onSeen(cur.id); },[cur?.id]);
  useEffect(()=>{
    if(dlg || typing || !cur) return;
    const t = setTimeout(()=>{ if(idx < items.length-1) setIdx(idx+1); else onClose(); }, 6000);
    return ()=>clearTimeout(t);
  },[idx, dlg, typing, items.length]);
  if(!cur) return null;
  const go = (d) => { const n = idx + d; if(n < 0) return; if(n >= items.length) { onClose(); return; } setIdx(n); };
  return (
    <div role="dialog" aria-modal="true" style={{ position:"fixed",inset:0,background:"#0A1628",zIndex:10001,display:"flex",flexDirection:"column",maxWidth:430,margin:"0 auto" }}>
      <style>{"@keyframes kzbar{from{width:0}to{width:100%}}"}</style>
      <div style={{ display:"flex",gap:4,padding:"10px 12px 0" }}>
        {items.map((it,i)=>(
          <div key={it.id} style={{ flex:1,height:3,borderRadius:2,background:"rgba(255,255,255,0.3)",overflow:"hidden" }}>
            <div key={i===idx?`a${idx}`:`s${i}`} style={{ height:"100%",background:"#fff",width:i<idx?"100%":i===idx?undefined:"0%",animation:i===idx&&!dlg&&!typing?"kzbar 6s linear forwards":"none" }} />
          </div>
        ))}
      </div>
      <div style={{ display:"flex",alignItems:"center",gap:10,padding:"12px 14px" }}>
        <div style={{ width:38,height:38,borderRadius:"50%",background:T.accent,display:"flex",alignItems:"center",justifyContent:"center",fontWeight:800,color:"#fff",overflow:"hidden",flexShrink:0 }}>
          {group.seller_avatar ? <img src={group.seller_avatar} alt="" style={{ width:"100%",height:"100%",objectFit:"cover" }} /> : (group.seller_name||"?")[0]?.toUpperCase()}
        </div>
        <div style={{ flex:1,minWidth:0 }}>
          <div style={{ color:"#fff",fontWeight:700,fontSize:14 }}>{mine ? "Your status" : group.seller_name}</div>
          <div style={{ color:"rgba(255,255,255,0.65)",fontSize:11 }}>{group.town ? `${group.town} · ` : ""}{timeAgo(cur.created_at)}</div>
        </div>
        <div onClick={onClose} aria-label="Close" style={{ color:"#fff",fontSize:26,cursor:"pointer",padding:"0 6px" }}>✕</div>
      </div>
      <div style={{ flex:1,position:"relative",display:"flex",alignItems:"center",justifyContent:"center",overflow:"hidden" }}>
        {cur.image_url
          ? <img src={cur.image_url} alt="" style={{ maxWidth:"100%",maxHeight:"100%",objectFit:"contain" }} />
          : <div style={{ padding:30,color:"#fff",fontSize:22,fontWeight:700,textAlign:"center",lineHeight:1.4 }}>{cur.caption}</div>}
        <div onClick={()=>go(-1)} style={{ position:"absolute",left:0,top:0,bottom:0,width:"35%" }} />
        <div onClick={()=>go(1)} style={{ position:"absolute",right:0,top:0,bottom:0,width:"65%" }} />
      </div>
      <div style={{ padding:"12px 16px 18px",background:"rgba(0,0,0,0.35)" }}>
        {cur.image_url && cur.caption && <div style={{ color:"#fff",fontSize:15,lineHeight:1.45,marginBottom:12 }}>{cur.caption}</div>}
        {!mine && (
          <div style={{ display:"flex",gap:8,marginBottom:10 }}>
            <input value={reply} maxLength={200} onChange={e=>setReply(e.target.value)} onFocus={()=>setTyping(true)} onBlur={()=>setTyping(false)}
              placeholder={`Reply to ${group.seller_name?.split(" ")[0] || "seller"}...`}
              style={{ flex:1,minWidth:0,padding:"11px 14px",borderRadius:22,border:"1px solid rgba(255,255,255,0.4)",background:"rgba(255,255,255,0.12)",color:"#fff",fontSize:14,outline:"none" }} />
            <button onClick={()=>{ if(reply.trim()) onReply(cur, reply.trim()); }} disabled={!reply.trim()}
              style={{ padding:"0 18px",borderRadius:22,border:"none",background:reply.trim()?T.primary:"rgba(255,255,255,0.2)",color:"#fff",fontSize:14,fontWeight:700,cursor:reply.trim()?"pointer":"default" }}>Send</button>
          </div>
        )}
        <div style={{ display:"flex",gap:10 }}>
          {mine ? (
            <button onClick={()=>setDlg({ title:"Delete this status?", text:"It will be removed for everyone.", okLabel:"Delete", onOk:()=>{ setDlg(null); onDelete(cur); } })} style={{ flex:1,padding:"12px 0",background:"rgba(255,255,255,0.15)",color:"#fff",border:"none",borderRadius:10,fontSize:14,fontWeight:700,cursor:"pointer" }}>🗑 Delete</button>
          ) : (<>
            <button onClick={()=>onChat(cur)} style={{ flex:2,padding:"12px 0",background:T.primary,color:"#fff",border:"none",borderRadius:10,fontSize:14,fontWeight:700,cursor:"pointer" }}>💬 Message {group.seller_name?.split(" ")[0]}</button>
            <button onClick={()=>setDlg({ title:"Report this status?", text:"Only report content that is fake, a scam, or against the rules. It will be hidden for you.", okLabel:"Report", onOk:()=>{ setDlg(null); onReport(cur); } })} style={{ flex:1,padding:"12px 0",background:"rgba(255,255,255,0.15)",color:"#fff",border:"none",borderRadius:10,fontSize:14,fontWeight:700,cursor:"pointer" }}>🚩 Report</button>
          </>)}
        </div>
      </div>
      {dlg && <ConfirmDialog {...dlg} onCancel={()=>setDlg(null)} />}
    </div>
  );
}

// In-app confirmation dialog (shows "KaziApa" styling instead of the browser's "kaziapa.co.ke says")
function ConfirmDialog({ title, text, okLabel="OK", cancelLabel="Cancel", onOk, onCancel }) {
  return (
    <div role="dialog" aria-modal="true" onClick={onCancel} style={{ position:"fixed",inset:0,background:"rgba(10,22,40,0.55)",zIndex:10000,display:"flex",alignItems:"center",justifyContent:"center",padding:24 }}>
      <div onClick={e=>e.stopPropagation()} style={{ background:"#fff",borderRadius:18,padding:22,width:"100%",maxWidth:340,boxShadow:"0 10px 40px rgba(0,0,0,0.3)" }}>
        <div style={{ fontSize:17,fontWeight:800,color:T.text }}>{title}</div>
        <div style={{ fontSize:14,color:T.textMid,marginTop:10,lineHeight:1.55 }}>{text}</div>
        <div style={{ display:"flex",gap:10,marginTop:20 }}>
          <button onClick={onCancel} style={{ flex:1,padding:"12px 0",background:T.surface,color:T.text,border:`1px solid ${T.border}`,borderRadius:10,fontSize:14,fontWeight:700,cursor:"pointer" }}>{cancelLabel}</button>
          <button onClick={onOk} style={{ flex:1,padding:"12px 0",background:T.primary,color:"#fff",border:"none",borderRadius:10,fontSize:14,fontWeight:700,cursor:"pointer" }}>{okLabel}</button>
        </div>
      </div>
    </div>
  );
}

// KaziApa-styled replacements for the browser's confirm / prompt / alert popups
// (those show "kaziapa.co.ke says" and can be blocked inside installed apps).
const dialogHost = { open:null };
function askConfirm(text, opts = {}) {
  return new Promise(resolve => {
    if(!dialogHost.open) { resolve(window.confirm(text)); return; }
    dialogHost.open({ type:"confirm", text, okLabel:opts.okLabel||"Yes", resolve });
  });
}
function askPrompt(text, opts = {}) {
  return new Promise(resolve => {
    if(!dialogHost.open) { resolve(window.prompt(text)); return; }
    dialogHost.open({ type:"prompt", text, okLabel:opts.okLabel||"Send", resolve });
  });
}
function askNotice(text) {
  if(!dialogHost.open) { window.alert(text); return; }
  dialogHost.open({ type:"notice", text, okLabel:"OK", resolve:()=>{} });
}
function DialogHost() {
  const [d,setD] = useState(null);
  const [val,setVal] = useState("");
  useEffect(()=>{
    dialogHost.open = (x)=>{ setVal(""); setD(x); };
    return ()=>{ dialogHost.open = null; };
  },[]);
  if(!d) return null;
  const finish = (v) => { const r = d.resolve; setD(null); r(v); };
  const cancelValue = d.type==="prompt" ? null : false;
  return (
    <div role="dialog" aria-modal="true" onClick={()=>finish(d.type==="notice" ? undefined : cancelValue)} style={{ position:"fixed",inset:0,background:"rgba(10,22,40,0.55)",zIndex:10002,display:"flex",alignItems:"center",justifyContent:"center",padding:24 }}>
      <div onClick={e=>e.stopPropagation()} style={{ background:"#fff",borderRadius:18,padding:22,width:"100%",maxWidth:340,boxShadow:"0 10px 40px rgba(0,0,0,0.3)" }}>
        <div style={{ fontSize:16,fontWeight:800,color:T.text,lineHeight:1.4 }}>{d.text}</div>
        {d.type==="prompt" && (
          <input autoFocus value={val} onChange={e=>setVal(e.target.value)} maxLength={300}
            style={{ width:"100%",marginTop:14,padding:"12px 14px",borderRadius:10,border:`1px solid ${T.border}`,fontSize:14,boxSizing:"border-box" }} />
        )}
        <div style={{ display:"flex",gap:10,marginTop:20 }}>
          {d.type!=="notice" && <button onClick={()=>finish(d.type==="prompt" ? null : false)} style={{ flex:1,padding:"12px 0",background:T.surface,color:T.text,border:`1px solid ${T.border}`,borderRadius:10,fontSize:14,fontWeight:700,cursor:"pointer" }}>Cancel</button>}
          <button onClick={()=>finish(d.type==="prompt" ? (val.trim() || null) : d.type==="confirm" ? true : undefined)} style={{ flex:1,padding:"12px 0",background:T.primary,color:"#fff",border:"none",borderRadius:10,fontSize:14,fontWeight:700,cursor:"pointer" }}>{d.okLabel}</button>
        </div>
      </div>
    </div>
  );
}
function Field({ label,value,onChange,placeholder,type="text",rows }) {
  const s = { width:"100%",padding:"11px 13px",borderRadius:11,border:`1px solid ${T.border}`,fontSize:14,color:T.text,boxSizing:"border-box",background:T.card,outline:"none" };
  return (
    <div style={{ marginBottom:14 }}>
      <label style={{ fontSize:12,fontWeight:700,color:T.text,display:"block",marginBottom:7 }}>{label}</label>
      {rows ? <textarea value={value} onChange={e=>onChange(e.target.value)} placeholder={placeholder} rows={rows} style={{ ...s,resize:"none" }} />
             : <input value={value} onChange={e=>onChange(e.target.value)} placeholder={placeholder} type={type} style={s} />}
    </div>
  );
}
function BackHeader({ title,onBack,right }) {
  return (
    <div style={{ background:T.primary,padding:"16px",display:"flex",alignItems:"center",gap:10 }}>
      <div onClick={onBack} style={{ color:"#fff",fontSize:22,cursor:"pointer" }}>←</div>
      <div style={{ color:"#fff",fontWeight:700,fontSize:15,flex:1 }}>{title}</div>
      {right}
    </div>
  );
}

// ─── PHOTO UPLOAD ────────────────────────────────────────────────────────────
function MarketPicker({ marketId, marketName, onPick, label="Tag to a Market (optional)" }) {
  const [q, setQ] = useState(marketName || "");
  const [results, setResults] = useState([]);
  const [open, setOpen] = useState(false);

  async function search(text) {
    setQ(text);
    if(!text.trim()) { setResults([]); onPick(null,""); return; }
    const { data } = await sb.from("markets").select("id,name,town,county,type,level").eq("status","ACTIVE").ilike("name",`%${text}%`).limit(6);
    setResults(data||[]);
    setOpen(true);
  }

  return (
    <div style={{ marginBottom:14,position:"relative" }}>
      <label style={{ fontSize:12,fontWeight:700,color:T.text,display:"block",marginBottom:7 }}>{label}</label>
      <input value={q} onChange={e=>search(e.target.value)} onFocus={()=>{ if(results.length) setOpen(true); }} placeholder="Type a market name, then tap it below..."
        style={{ width:"100%",padding:"11px 13px",borderRadius:11,border:`1px solid ${T.border}`,fontSize:14,color:T.text,background:T.card }} />
      {!marketId && <div style={{ fontSize:11,color:T.textMuted,marginTop:4 }}>Tap a suggestion to tag it — typing alone won't tag it</div>}
      {marketId && <div style={{ fontSize:11,color:T.success,marginTop:4,fontWeight:700 }}>✅ Tagged to {marketName}</div>}
      {open && results.length>0 && (
        <div style={{ position:"absolute",top:"100%",left:0,right:0,background:T.card,border:`1px solid ${T.border}`,borderRadius:11,marginTop:4,zIndex:20,maxHeight:200,overflowY:"auto" }}>
          {results.map(m=>(
            <div key={m.id} onClick={()=>{ onPick(m.id,m.name); setQ(m.name); setOpen(false); }} style={{ padding:"10px 13px",borderBottom:`1px solid ${T.border}`,cursor:"pointer",fontSize:13 }}>
              {m.name} <span style={{ color:T.textMuted,fontSize:11 }}>{m.type==="hood" ? `— 🏘️ ${(m.level||"").toLowerCase()}, ${m.county||""}` : `— ${m.town||m.county||""}`}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function HoodPicker({ hoodId, hoodName, onPick, label="Tag to a Hood (optional)" }) {
  const [q, setQ] = useState(hoodName || "");
  const [results, setResults] = useState([]);
  const [open, setOpen] = useState(false);

  async function search(text) {
    setQ(text);
    if(!text.trim()) { setResults([]); onPick(null,""); return; }
    const { data } = await sb.from("markets").select("id,name,level,county").eq("type","hood").eq("status","ACTIVE").ilike("name",`%${text}%`).limit(6);
    setResults(data||[]);
    setOpen(true);
  }

  return (
    <div style={{ marginBottom:14,position:"relative" }}>
      <label style={{ fontSize:12,fontWeight:700,color:T.text,display:"block",marginBottom:7 }}>{label}</label>
      <input value={q} onChange={e=>search(e.target.value)} onFocus={()=>{ if(results.length) setOpen(true); }} placeholder="Type your estate or area..."
        style={{ width:"100%",padding:"11px 13px",borderRadius:11,border:`1px solid ${T.border}`,fontSize:14,color:T.text,background:T.card }} />
      {!hoodId && <div style={{ fontSize:11,color:T.textMuted,marginTop:4 }}>Tap a suggestion to tag it — typing alone won't tag it</div>}
      {hoodId && <div style={{ fontSize:11,color:T.success,marginTop:4,fontWeight:700 }}>✅ Tagged to {hoodName}</div>}
      {open && results.length>0 && (
        <div style={{ position:"absolute",top:"100%",left:0,right:0,background:T.card,border:`1px solid ${T.border}`,borderRadius:11,marginTop:4,zIndex:20,maxHeight:200,overflowY:"auto" }}>
          {results.map(h=>(
            <div key={h.id} onClick={()=>{ onPick(h.id,h.name); setQ(h.name); setOpen(false); }} style={{ padding:"10px 13px",borderBottom:`1px solid ${T.border}`,cursor:"pointer",fontSize:13 }}>
              {h.name} <span style={{ color:T.textMuted,fontSize:11 }}>— {h.level.toLowerCase()}, {h.county}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function PhotoUploader({ photos,setPhotos,maxPhotos=5 }) {
  const fileRef = useRef();
  const cameraRef = useRef();
  const [uploading,setUploading] = useState(false);
  const [progress,setProgress]  = useState(0);

  // Compress image before upload — reduces 3MB photo to ~150KB
  async function compressImage(file) {
    return new Promise((resolve)=>{
      const reader = new FileReader();
      reader.onload = (e)=>{
        const img = new Image();
        img.onload = ()=>{
          const canvas = document.createElement("canvas");
          const MAX = 900; // max width/height in pixels
          let w = img.width, h = img.height;
          if(w > MAX) { h = Math.round(h * MAX / w); w = MAX; }
          if(h > MAX) { w = Math.round(w * MAX / h); h = MAX; }
          canvas.width = w; canvas.height = h;
          canvas.getContext("2d").drawImage(img,0,0,w,h);
          canvas.toBlob((blob)=>resolve(blob),"image/jpeg",0.75);
        };
        img.src = e.target.result;
      };
      reader.readAsDataURL(file);
    });
  }

  async function handleFiles(e) {
    const files = Array.from(e.target.files);
    if(!files.length) return;
    setUploading(true); setProgress(0);
    const urls = [];
    for(let i=0; i<files.length; i++) {
      if(photos.length + urls.length >= maxPhotos) break;
      setProgress(Math.round((i/files.length)*100));
      try {
        const compressed = await compressImage(files[i]);
        const name = `${Date.now()}-${Math.random().toString(36).slice(2)}.jpg`;
        const { error } = await sb.storage.from("kaziapa-photos").upload(name, compressed, { contentType:"image/jpeg" });
        if(!error) {
          const { data:pub } = sb.storage.from("kaziapa-photos").getPublicUrl(name);
          urls.push(pub.publicUrl);
        }
      } catch(err) {
        console.error("Upload error:", err);
      }
    }
    setPhotos([...photos,...urls]);
    setUploading(false); setProgress(0);
  }

  return (
    <div style={{ marginBottom:16 }}>
      <label style={{ fontSize:12,fontWeight:700,color:T.text,display:"block",marginBottom:8 }}>
        Photos ({photos.length}/{maxPhotos})
      </label>
      <div style={{ display:"flex",gap:8,flexWrap:"wrap" }}>
        {photos.map((url,i)=>(
          <div key={i} style={{ position:"relative",width:80,height:80 }}>
            <img src={url} alt="" style={{ width:80,height:80,borderRadius:10,objectFit:"cover",border:`1px solid ${T.border}` }} />
            <div onClick={()=>setPhotos(photos.filter((_,j)=>j!==i))}
              style={{ position:"absolute",top:-6,right:-6,width:20,height:20,borderRadius:"50%",background:T.coral,color:"#fff",fontSize:14,display:"flex",alignItems:"center",justifyContent:"center",cursor:"pointer",fontWeight:700 }}>×</div>
          </div>
        ))}
        {photos.length < maxPhotos && (
          <div onClick={()=>!uploading&&cameraRef.current?.click()}
            style={{ width:80,height:80,borderRadius:10,border:`2px dashed ${uploading?T.primary:T.border}`,display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",cursor:uploading?"default":"pointer",background:uploading?T.primarySoft:T.surface,transition:"all 0.2s" }}>
            <div style={{ fontSize:24 }}>📸</div>
            <div style={{ fontSize:9,color:T.textMuted,marginTop:2 }}>Take Photo</div>
          </div>
        )}
        {photos.length < maxPhotos && (
          <div onClick={()=>!uploading&&fileRef.current?.click()}
            style={{ width:80,height:80,borderRadius:10,border:`2px dashed ${uploading?T.primary:T.border}`,display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",cursor:uploading?"default":"pointer",background:uploading?T.primarySoft:T.surface,transition:"all 0.2s" }}>
            {uploading
              ? <div style={{ textAlign:"center" }}>
                  <div style={{ fontSize:13,fontWeight:800,color:T.primary }}>{progress}%</div>
                  <div style={{ fontSize:9,color:T.textMuted,marginTop:2 }}>Uploading...</div>
                </div>
              : <>
                  <div style={{ fontSize:24 }}>🖼️</div>
                  <div style={{ fontSize:9,color:T.textMuted,marginTop:2 }}>Gallery</div>
                </>
            }
          </div>
        )}
      </div>
      {uploading && (
        <div style={{ marginTop:8,background:T.border,borderRadius:4,height:4,overflow:"hidden" }}>
          <div style={{ height:"100%",background:T.primary,width:`${progress}%`,transition:"width 0.3s",borderRadius:4 }} />
        </div>
      )}
      <input ref={fileRef} type="file" accept="image/*" multiple onChange={handleFiles} style={{ display:"none" }} />
      <input ref={cameraRef} type="file" accept="image/*" capture="environment" onChange={handleFiles} style={{ display:"none" }} />
      <div style={{ fontSize:11,color:T.textMuted,marginTop:6 }}>
        📸 Photos are auto-compressed for fast upload. Up to {maxPhotos} photos.
      </div>
    </div>
  );
}

// Haversine distance in km between two lat/lng points.
function distanceKm(lat1,lng1,lat2,lng2) {
  const R = 6371;
  const dLat = (lat2-lat1)*Math.PI/180;
  const dLng = (lng2-lng1)*Math.PI/180;
  const a = Math.sin(dLat/2)**2 + Math.cos(lat1*Math.PI/180)*Math.cos(lat2*Math.PI/180)*Math.sin(dLng/2)**2;
  return R * 2*Math.atan2(Math.sqrt(a),Math.sqrt(1-a));
}

// ─── LISTING CARD ─────────────────────────────────────────────────────────────
function ListingCard({ listing,onClick }) {
  const cat = CATEGORIES.find(c=>c.id===listing.category);
  const photo = listing.photos?.[0];
  const av = availabilityOf(presenceStore.map[listing.seller_phone]);
  return (
    <div onClick={onClick} style={{ background:T.card,borderRadius:14,marginBottom:10,cursor:"pointer",border:listing.boosted?`1.5px solid ${T.accent}`:`1px solid ${T.border}`,overflow:"hidden",display:"flex" }}>
      <div style={{ width:5,flexShrink:0,background:CAT_COLOR[listing.category]||T.primary }} />
      {photo
        ? <img src={photo} alt="" loading="lazy" decoding="async" width={80} height={80} style={{ width:80,height:80,objectFit:"cover",flexShrink:0,alignSelf:"center",marginLeft:8,borderRadius:8 }} />
        : <div style={{ width:80,height:80,flexShrink:0,background:T.surface,display:"flex",alignItems:"center",justifyContent:"center",fontSize:36,marginLeft:8,borderRadius:8,alignSelf:"center" }}>{cat?.icon||"📦"}</div>
      }
      <div style={{ padding:"10px 12px",flex:1,minWidth:0 }}>
        <div style={{ display:"flex",gap:5,flexWrap:"wrap",marginBottom:3 }}>
          {listing.featured  && <Pill color={T.accentDark} bg={T.accentSoft}>🚀 Featured</Pill>}
          {listing.verified && <Pill color={T.success} bg={T.successSoft}>✓ Verified</Pill>}
          {listing.sold && <Pill color={T.coral} bg={T.coralSoft}>SOLD</Pill>}
        </div>
        <div style={{ fontWeight:700,color:T.text,fontSize:14,whiteSpace:"nowrap",overflow:"hidden",textOverflow:"ellipsis" }}>{listing.title}</div>
        <div style={{ fontSize:11,color:T.textMuted,marginTop:2,display:"flex",alignItems:"center",gap:4 }}>
          📍 {listing.town} ·
          {listing.seller_avatar_url
            ? <img src={listing.seller_avatar_url} alt="" style={{ width:14,height:14,borderRadius:"50%",objectFit:"cover" }} />
            : null
          }
          {listing.seller_name}{listing._distanceKm!=null ? ` · ${listing._distanceKm<1 ? Math.round(listing._distanceKm*1000)+"m" : listing._distanceKm.toFixed(1)+"km"} away` : ""}
          {av && <span style={{ color:av.color,fontWeight:700,marginLeft:4 }}>· {av.dot} {av.label}</span>}
        </div>
        <div style={{ display:"flex",justifyContent:"space-between",alignItems:"center",marginTop:4 }}>
          <Stars rating={listing.rating} />
          <div style={{ fontSize:15,fontWeight:800,color:T.primary }}>Ksh {listing.price_label||listing.price?.toLocaleString()}</div>
        </div>
      </div>
    </div>
  );
}

// ─── SMART CHAT (REAL, SUPABASE-BACKED) ──────────────────────────────────────
// Shared by every chat thread component (SmartChat, SimpleChatThread,
// NitumeChatThread, UsafiriChatThread) — compresses then uploads a
// single image, returns its public URL.
async function compressAndUploadChatImage(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement("canvas");
        const MAX = 900;
        let w = img.width, h = img.height;
        if(w > MAX) { h = Math.round(h * MAX / w); w = MAX; }
        if(h > MAX) { w = Math.round(w * MAX / h); h = MAX; }
        canvas.width = w; canvas.height = h;
        canvas.getContext("2d").drawImage(img,0,0,w,h);
        canvas.toBlob(async (blob) => {
          try {
            const name = `chat-${Date.now()}-${Math.random().toString(36).slice(2)}.jpg`;
            const { error } = await sb.storage.from("kaziapa-photos").upload(name, blob, { contentType:"image/jpeg" });
            if(error) { reject(error); return; }
            const { data:pub } = sb.storage.from("kaziapa-photos").getPublicUrl(name);
            resolve(pub.publicUrl);
          } catch(err) { reject(err); }
        }, "image/jpeg", 0.75);
      };
      img.src = e.target.result;
    };
    reader.readAsDataURL(file);
  });
}

function SmartChat({ listing, currentPhone, currentName, buyerPhone, buyerName, sellerPhone, sellerName, onBack, onCheckout, onNeedUpgrade, onViewListing, initialText }) {
  const [msgs, setMsgs]     = useState([]);
  const [ctxListing, setCtxListing] = useState(listing?.photos!==undefined ? listing : null);
  const [pendingOrder, setPendingOrder] = useState(null);
  const [paidDlg, setPaidDlg] = useState(false);
  const [confirmingPaid, setConfirmingPaid] = useState(false);
  const [paidNote, setPaidNote] = useState("");
  const [input, setInput]   = useState(initialText || "");
  const [showPay, setShowPay] = useState(false);
  const [showDel, setShowDel] = useState(false);
  const [dStep, setDStep]   = useState(1);
  const [zone, setZone]     = useState(null);
  const [rider, setRider]   = useState(null);
  const isBuyer = currentPhone === buyerPhone;
  useEffect(()=>{
    if(isBuyer || !listing?.id || /^(dm|status)-/.test(String(listing.id)) || !buyerPhone) return;
    (async ()=>{
      const { data } = await sb.from("orders").select("*").eq("listing_id",listing.id).eq("buyer_phone",buyerPhone).eq("status","buyer_paid_seller_directly").order("created_at",{ ascending:false }).limit(1);
      setPendingOrder(data?.[0]||null);
    })();
  },[listing?.id, buyerPhone, msgs.length]);
  const otherName = isBuyer ? sellerName : buyerName;
  const otherPhone = isBuyer ? sellerPhone : buyerPhone;
  const [otherAvatar,setOtherAvatar] = useState(null);
  const [sendingImage, setSendingImage] = useState(false);
  const chatImgRef = useRef();
  const [viewingImage, setViewingImage] = useState(null);
  const nearRiders = RIDERS.filter(r=>r.town===listing?.town && r.available);

  useEffect(()=>{
    loadMsgs();
    const interval = setInterval(loadMsgs, 3000);
    return ()=>clearInterval(interval);
  },[]);

  useEffect(()=>{
    if(!onViewListing || ctxListing || !listing?.id || /^(dm|status)-/.test(String(listing.id))) return;
    (async ()=>{
      const { data } = await sb.from("listings").select("*").eq("id", listing.id).single();
      if(data) setCtxListing(data);
    })();
  },[listing?.id]);

  useEffect(()=>{
    if(!otherPhone) return;
    (async ()=>{
      const { data } = await sb.from("users").select("avatar_url").eq("phone",otherPhone).single();
      setOtherAvatar(data?.avatar_url||null);
    })();
  },[otherPhone]);

  async function loadMsgs() {
    const { data } = await sb.from("chats").select("*")
      .eq("listing_id", String(listing?.id||""))
      .eq("buyer_phone", buyerPhone)
      .order("created_at",{ ascending:true });
    setMsgs(data||[]);
    // Mark messages as read for current user
    await sb.from("chats")
      .update({ read:true })
      .eq("listing_id", String(listing?.id||""))
      .eq("buyer_phone", buyerPhone)
      .neq("sender_phone", currentPhone);
  }

  // Checks and consumes 1 of the 10 daily free conversation-starts.
  // Only called for the FIRST message in a thread — replies never count.
  // Verified users and active plan subscribers bypass the limit entirely.
  async function checkAndConsumeChatStart() {
    const { data: u } = await sb.from("users")
      .select("chat_starts_today,chat_starts_reset_at,chat_unlimited_until,is_verified")
      .eq("phone", currentPhone).single();

    if (u?.is_verified) return true;
    if (u?.chat_unlimited_until && new Date(u.chat_unlimited_until) > new Date()) return true;

    const today = new Date().toISOString().slice(0,10);
    let startsToday = u?.chat_starts_today || 0;
    if (u?.chat_starts_reset_at !== today) startsToday = 0; // new day, reset

    if (startsToday >= 10) {
      // Limit hit — notify in-app (bell) and prompt upgrade.
      await sb.from("notifications").insert({
        recipient_phone: currentPhone, icon: "⚡", read: false,
        title: "Daily chat limit reached",
        body: "You've used your 10 free conversation-starts today. Upgrade for unlimited messaging.",
      });
      onNeedUpgrade && onNeedUpgrade();
      return false;
    }

    await sb.from("users").update({
      chat_starts_today: startsToday + 1,
      chat_starts_reset_at: today,
    }).eq("phone", currentPhone);
    return true;
  }

  async function send() {
    if (!input.trim()) return;
    if (msgs.length === 0) {
      const allowed = await checkAndConsumeChatStart();
      if (!allowed) return;
    }
    if (PHONE_RGX.test(input)||CONTACT_RGX.test(input)) {
      await sb.from("chats").insert({ listing_id:String(listing?.id||""), listing_title:listing?.title, buyer_phone:buyerPhone, buyer_name:buyerName, seller_phone:sellerPhone, seller_name:sellerName, sender_phone:"system", sender_name:"KaziApa", message:"⚠️ Phone numbers can't be shared here for safety.", read:false });
      setInput(""); setShowPay(true); loadMsgs(); return;
    }
    await sb.from("chats").insert({ listing_id:String(listing?.id||""), listing_title:listing?.title, buyer_phone:buyerPhone, buyer_name:buyerName, seller_phone:sellerPhone, seller_name:sellerName, sender_phone:currentPhone, sender_name:currentName, message:input, read:false });

    // Notify the OTHER person — push if they have it enabled, SMS fallback otherwise
    const recipientPhone = isBuyer ? sellerPhone : buyerPhone;
    fetch("/api/notify-message", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ phone: recipientPhone, senderName: currentName, message: input }),
    }).catch(()=>{});

    setInput("");
    loadMsgs();
  }

  async function sendImage(e) {
    const file = e.target.files?.[0];
    if(!file) return;
    if (msgs.length === 0) {
      const allowed = await checkAndConsumeChatStart();
      if (!allowed) { e.target.value = ""; return; }
    }
    setSendingImage(true);
    try {
      const url = await compressAndUploadChatImage(file);
      await sb.from("chats").insert({ listing_id:String(listing?.id||""), listing_title:listing?.title, buyer_phone:buyerPhone, buyer_name:buyerName, seller_phone:sellerPhone, seller_name:sellerName, sender_phone:currentPhone, sender_name:currentName, message:"📷 Photo", image_url:url, read:false });
      const recipientPhone = isBuyer ? sellerPhone : buyerPhone;
      fetch("/api/notify-message", { method:"POST", headers:{ "Content-Type":"application/json" }, body:JSON.stringify({ phone:recipientPhone, senderName:currentName, message:"📷 Photo" }) }).catch(()=>{});
      loadMsgs();
    } catch(err) {
      askNotice("Couldn't send that photo — try again.");
    }
    setSendingImage(false);
    e.target.value = "";
  }

  if (showDel) {
    const delCost = zone?.price||rider?.price||250;
    const total   = (listing?.price||0)+delCost;
    return (
      <div style={{ fontFamily:"'Segoe UI',system-ui,sans-serif",background:T.surface,minHeight:"100vh",maxWidth:430,margin:"0 auto" }}>
        <BackHeader title="Choose Delivery" onBack={()=>{ if(dStep>1)setDStep(dStep-1); else setShowDel(false); }} right={<span style={{ fontSize:11,color:"rgba(255,255,255,0.6)" }}>{dStep}/3</span>} />
        <div style={{ padding:16 }}>
          <div style={{ display:"flex",gap:4,marginBottom:20 }}>
            {["Zone","Rider","Confirm"].map((s,i)=>(
              <div key={s} style={{ flex:1,height:4,borderRadius:2,background:dStep>i?T.success:dStep===i+1?T.accent:T.border }} />
            ))}
          </div>
          {dStep===1 && (
            <div>
              <div style={{ fontSize:14,fontWeight:800,color:T.text,marginBottom:14 }}>Where is the buyer?</div>
              {DELIVERY_ZONES.map(z=>(
                <div key={z.id} onClick={()=>setZone(z)} style={{ background:T.card,borderRadius:14,padding:16,marginBottom:10,cursor:"pointer",border:zone?.id===z.id?`2px solid ${T.success}`:`1px solid ${T.border}`,display:"flex",justifyContent:"space-between",alignItems:"center" }}>
                  <div><div style={{ fontWeight:700,color:T.text,fontSize:14 }}>{z.label}</div><div style={{ fontSize:12,color:T.textMuted,marginTop:2 }}>⏱ {z.time}</div></div>
                  <div style={{ fontSize:16,fontWeight:800,color:T.primary }}>Ksh {z.price}</div>
                </div>
              ))}
              <Btn onClick={()=>{ if(zone) setDStep(zone.id==="parcel"?3:2); }} disabled={!zone}>Continue →</Btn>
            </div>
          )}
          {dStep===2 && (
            <div>
              <div style={{ fontSize:14,fontWeight:800,color:T.text,marginBottom:14 }}>Select a Rider</div>
              {nearRiders.length===0 && <div style={{ background:T.accentSoft,borderRadius:14,padding:16,marginBottom:14,textAlign:"center",border:`1px solid ${T.accent}` }}><div style={{ fontSize:32 }}>🚌</div><div style={{ fontWeight:700,color:T.text,marginTop:8 }}>No riders available nearby</div></div>}
              {nearRiders.map(r=>(
                <div key={r.id} onClick={()=>setRider(r)} style={{ background:T.card,borderRadius:14,padding:14,marginBottom:10,cursor:"pointer",border:rider?.id===r.id?`2px solid ${T.success}`:`1px solid ${T.border}` }}>
                  <div style={{ display:"flex",alignItems:"center",gap:12 }}>
                    <div style={{ width:44,height:44,borderRadius:"50%",background:T.primary,display:"flex",alignItems:"center",justifyContent:"center",fontSize:22 }}>🏍️</div>
                    <div style={{ flex:1 }}><div style={{ fontWeight:700,color:T.text }}>{r.name}</div><div style={{ fontSize:12,color:T.textMuted }}>📍 {r.stage}</div><Stars rating={r.rating} /></div>
                    <div style={{ textAlign:"right" }}><div style={{ background:T.successSoft,color:T.success,borderRadius:8,padding:"3px 10px",fontSize:11,fontWeight:700 }}>Available</div><div style={{ fontSize:13,fontWeight:800,color:T.primary,marginTop:4 }}>Ksh {zone?.price}</div></div>
                  </div>
                </div>
              ))}
              <div style={{ fontSize:11,fontWeight:700,color:T.textMuted,margin:"14px 0 8px",letterSpacing:0.5 }}>OR USE BUS PARCEL</div>
              {BUS.slice(0,2).map(b=>(
                <div key={b.name} onClick={()=>setRider({ id:b.name, name:b.name, bus:true, price:b.price, time:b.time })}
                  style={{ background:T.card,borderRadius:14,padding:14,marginBottom:8,cursor:"pointer",border:rider?.name===b.name?`2px solid ${T.success}`:`1px solid ${T.border}`,display:"flex",justifyContent:"space-between",alignItems:"center" }}>
                  <div><div style={{ fontWeight:700,color:T.text }}>🚌 {b.name}</div><div style={{ fontSize:12,color:T.textMuted }}>⏱ {b.time}</div></div>
                  <div style={{ fontSize:14,fontWeight:800,color:T.primary }}>Ksh {b.price}</div>
                </div>
              ))}
              <Btn onClick={()=>{ if(rider) setDStep(3); }} disabled={!rider} style={{ marginTop:12 }}>Continue →</Btn>
            </div>
          )}
          {dStep===3 && (
            <div>
              <div style={{ fontSize:14,fontWeight:800,color:T.text,marginBottom:14 }}>Confirm Order</div>
              <div style={{ background:T.card,borderRadius:14,padding:16,marginBottom:14,border:`1px solid ${T.border}` }}>
                {[["Item",listing?.title],["Seller",sellerName],["Item price",`Ksh ${listing?.price?.toLocaleString()}`],["Delivery",`Ksh ${delCost}`],...(rider&&!rider.bus?[["Rider",rider.name]]:rider?.bus?[["Service",rider.name]]:[])].map(([k,v])=>(
                  <div key={k} style={{ display:"flex",justifyContent:"space-between",marginBottom:10,fontSize:14 }}><span style={{ color:T.textMid }}>{k}</span><span style={{ fontWeight:600 }}>{v}</span></div>
                ))}
                <div style={{ borderTop:`1px solid ${T.border}`,paddingTop:10,display:"flex",justifyContent:"space-between",fontSize:16,fontWeight:900 }}>
                  <span>Total</span><span style={{ color:T.primary }}>Ksh {total.toLocaleString()}</span>
                </div>
              </div>
              <div style={{ background:T.accentSoft,borderRadius:12,padding:12,marginBottom:16,fontSize:12,color:T.accentDark }}>💡 Pay the rider/seller directly on delivery or via M-Pesa.</div>
              <Btn onClick={onCheckout}>Continue →</Btn>
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div style={{ fontFamily:"'Segoe UI',system-ui,sans-serif",display:"flex",flexDirection:"column",height:"100vh",maxWidth:430,margin:"0 auto",background:T.surface }}>
      <div style={{ background:T.primary,padding:"14px 16px",display:"flex",alignItems:"center",gap:12 }}>
        <div onClick={onBack} style={{ color:"#fff",fontSize:22,cursor:"pointer" }}>←</div>
        <div style={{ width:40,height:40,borderRadius:"50%",background:T.accent,display:"flex",alignItems:"center",justifyContent:"center",fontWeight:800,color:T.primary,fontSize:18,overflow:"hidden",flexShrink:0 }}>
          {otherAvatar ? <img src={otherAvatar} alt="" style={{ width:"100%",height:"100%",objectFit:"cover" }} /> : otherName?.[0]}
        </div>
        <div style={{ flex:1 }}>
          <div style={{ color:"#fff",fontWeight:700,fontSize:14 }}>{otherName}</div>
          <div style={{ fontSize:11,color:T.accent }}>{listing?.title}</div>
          <SellerPresence phone={otherPhone} light />
        </div>
      </div>
      {onViewListing && listing?.title && !/^(dm|status)-/.test(String(listing?.id||"")) && (
        <div onClick={()=>{ if(ctxListing) onViewListing(ctxListing); }} style={{ background:T.card,borderBottom:`1px solid ${T.border}`,padding:"8px 16px",display:"flex",alignItems:"center",gap:10,cursor:ctxListing?"pointer":"default" }}>
          {ctxListing?.photos?.[0]
            ? <img src={ctxListing.photos[0]} alt="" style={{ width:44,height:44,borderRadius:8,objectFit:"cover",flexShrink:0 }} />
            : <div style={{ width:44,height:44,borderRadius:8,background:T.surface,display:"flex",alignItems:"center",justifyContent:"center",fontSize:22,flexShrink:0 }}>📦</div>}
          <div style={{ flex:1,minWidth:0 }}>
            <div style={{ fontSize:10,color:T.textMuted,fontWeight:700,textTransform:"uppercase",letterSpacing:0.5 }}>About this post</div>
            <div style={{ fontSize:13,fontWeight:700,color:T.text,whiteSpace:"nowrap",overflow:"hidden",textOverflow:"ellipsis" }}>{listing.title}</div>
            {ctxListing && ctxListing.price!=null && <div style={{ fontSize:12,fontWeight:800,color:T.primary }}>Ksh {ctxListing.price_label||Number(ctxListing.price).toLocaleString()}</div>}
          </div>
          {ctxListing && <div style={{ fontSize:12,color:T.primary,fontWeight:700,flexShrink:0 }}>View ›</div>}
        </div>
      )}
      {paidNote && <div style={{ background:"#E7F6EC",color:"#145A36",padding:"10px 16px",fontSize:13,fontWeight:600 }}>{paidNote}</div>}
      {pendingOrder && !isBuyer && (
        <div style={{ background:"#FFF6E5",borderBottom:`1px solid ${T.border}`,padding:"10px 16px" }}>
          <div style={{ fontSize:13,fontWeight:700,color:T.text }}>💰 {buyerName||"The buyer"} says they paid Ksh {Number(pendingOrder.amount||0).toLocaleString()}</div>
          <div style={{ fontSize:12,color:T.textMuted,marginTop:2 }}>Check your M-Pesa messages, then confirm here.{pendingOrder.mpesa_code ? ` M-Pesa code: ${pendingOrder.mpesa_code}` : ""}</div>
          <button disabled={confirmingPaid} onClick={()=>setPaidDlg(true)} style={{ marginTop:8,width:"100%",padding:"10px 0",background:T.success||"#16a34a",color:"#fff",border:"none",borderRadius:10,fontSize:13,fontWeight:700,cursor:"pointer" }}>{confirmingPaid ? "Saving..." : "✓ I received the payment"}</button>
        </div>
      )}
      {paidDlg && <ConfirmDialog title="Did you receive the money?" text={"Confirm that you received Ksh "+Number(pendingOrder?.amount||0).toLocaleString()+" in your M-Pesa."} okLabel="Yes, received" onCancel={()=>setPaidDlg(false)} onOk={async()=>{
        setPaidDlg(false); setConfirmingPaid(true);
        const { error } = await markOrderPaid(sb, pendingOrder, currentPhone);
        setConfirmingPaid(false);
        if(error) { setPaidNote("Couldn't confirm. Check your connection and try again."); return; }
        setPendingOrder(null); setPaidNote("✅ Payment confirmed. The buyer has been notified."); loadMsgs();
      }} />}
      <div style={{ flex:1,overflowY:"auto",padding:16,display:"flex",flexDirection:"column",gap:8 }}>
        <div style={{ textAlign:"center",fontSize:11,color:T.textMuted,background:T.surface,borderRadius:8,padding:"6px 12px",alignSelf:"center",border:`1px solid ${T.border}` }}>
          🔒 Phone numbers stay private until you choose to share them.
        </div>
        {msgs.length===0 && <div style={{ textAlign:"center",color:T.textMuted,fontSize:13,marginTop:30 }}>Say hello to start the conversation 👋</div>}
        {msgs.map((msg,i)=>{
          const d = msg.created_at ? new Date(msg.created_at) : null;
          const prevD = i>0 && msgs[i-1].created_at ? new Date(msgs[i-1].created_at) : null;
          const isNewDay = d && (!prevD || d.toDateString()!==prevD.toDateString());
          const dayLabel = d && (()=>{
            const today = new Date(), yest = new Date(); yest.setDate(today.getDate()-1);
            if(d.toDateString()===today.toDateString()) return "Today";
            if(d.toDateString()===yest.toDateString()) return "Yesterday";
            return d.toLocaleDateString([],{ day:"numeric",month:"short",year:d.getFullYear()!==today.getFullYear()?"numeric":undefined });
          })();
          const timeLabel = d ? d.toLocaleTimeString([],{ hour:"2-digit",minute:"2-digit" }) : "";
          return (
          <Fragment key={i}>
            {isNewDay && (
              <div style={{ textAlign:"center",color:T.textMuted,fontSize:11,fontWeight:700,margin:"6px 0" }}>{dayLabel}</div>
            )}
          <div style={{ display:"flex",justifyContent:msg.sender_phone==="system"?"center":msg.sender_phone===currentPhone?"flex-end":"flex-start" }}>
            {msg.sender_phone==="system"
              ? <div style={{ background:T.coralSoft,color:T.coral,borderRadius:10,padding:"8px 14px",maxWidth:"88%",fontSize:12,lineHeight:1.5,border:`1px solid ${T.coral}`,textAlign:"center" }}>{msg.message}</div>
              : <div style={{ background:msg.sender_phone===currentPhone?T.primary:T.card,color:msg.sender_phone===currentPhone?"#fff":T.text,borderRadius:msg.sender_phone===currentPhone?"16px 16px 4px 16px":"16px 16px 16px 4px",padding:msg.image_url?6:"10px 14px",maxWidth:"76%",fontSize:14,lineHeight:1.4,border:msg.sender_phone===currentPhone?"none":`1px solid ${T.border}` }}>
                  {msg.image_url ? (
                    <img src={msg.image_url} alt="" onClick={()=>setViewingImage(msg.image_url)} style={{ maxWidth:220,borderRadius:12,display:"block",cursor:"pointer" }} />
                  ) : msg.message?.includes("maps.google.com") ? (
                    <div>
                      <div>📍 {msg.sender_name} shared their location</div>
                      <a href={msg.message.match(/https:\/\/maps\.google[^\s]*/)?.[0]} target="_blank"
                        style={{ color:msg.sender_phone===currentPhone?"#FFD700":"#0066CC",fontWeight:700,fontSize:12,textDecoration:"underline" }}>
                        Open in Google Maps →
                      </a>
                    </div>
                  ) : msg.message}
                  {timeLabel && (
                    <div style={{ fontSize:10,opacity:0.7,marginTop:4,textAlign:"right",color:msg.sender_phone===currentPhone?"rgba(255,255,255,0.85)":T.textMuted }}>{timeLabel}</div>
                  )}
                </div>
            }
          </div>
          </Fragment>
          );
        })}
        {isBuyer && showPay && !/^(dm|status)-/.test(String(listing?.id||"")) && (
          <div style={{ background:T.successSoft,borderRadius:14,padding:14,border:`1.5px solid ${T.success}` }}>
            <div style={{ fontWeight:700,color:T.text,fontSize:14,marginBottom:4 }}>Ready to buy?</div>
            <div style={{ display:"flex",gap:8,flexWrap:"wrap" }}>
              <button onClick={onCheckout} style={{ flex:1,padding:"10px 6px",background:T.success,color:"#fff",border:"none",borderRadius:10,fontSize:12,fontWeight:800,cursor:"pointer",minWidth:100 }}><Icon n="card" s={14} /> Pay Directly</button>
            </div>
          </div>
        )}
      </div>
      <div style={{ padding:"10px 16px 20px",background:T.card,borderTop:`1px solid ${T.border}` }}>
        {isBuyer && msgs.length>=2 && !showPay && (
          <div style={{ display:"flex",gap:6,marginBottom:8,overflowX:"auto" }}>
            {[
              { label:"💳 Pay Now",action:()=>setShowPay(true) },
              { label:"💬 Final price?",action:()=>setInput("What is your final price?") },
              { label:"📍 Share Location",action:()=>{
                if(!navigator.geolocation){ askNotice("Location not available on this device"); return; }
                navigator.geolocation.getCurrentPosition(async(pos)=>{
                  const { latitude:lat, longitude:lng } = pos.coords;
                  const mapsUrl = `https://maps.google.com/?q=${lat},${lng}`;
                  await sb.from("chats").insert({ listing_id:String(listing?.id||""), listing_title:listing?.title, buyer_phone:buyerPhone, buyer_name:buyerName, seller_phone:sellerPhone, seller_name:sellerName, sender_phone:currentPhone, sender_name:currentName, message:`📍 ${currentName} shared their location: ${mapsUrl}`, read:false });
                  loadMsgs();
                }, ()=>askNotice("Please allow location access and try again."));
              }},
              { label:"📱 Share My Number",action:async()=>{ await sb.from("chats").insert({ listing_id:String(listing?.id||""), listing_title:listing?.title, buyer_phone:buyerPhone, buyer_name:buyerName, seller_phone:sellerPhone, seller_name:sellerName, sender_phone:"system", sender_name:"KaziApa", message:`📱 ${currentName} has shared their number: ${currentPhone}`, read:false }); loadMsgs(); } },
              { label:"💚 WhatsApp Seller",action:()=>{
                const wa = sellerPhone.startsWith("+") ? sellerPhone.replace("+","") : "254"+sellerPhone.replace(/^0/,"");
                const msg = encodeURIComponent(`Hi ${sellerName}, I found your listing "${listing?.title}" on KaziApa. Is it still available?`);
                window.open(`https://wa.me/${wa}?text=${msg}`,"_blank");
              }}
            ].map(q=>(
              <div key={q.label} onClick={q.action} style={{ background:q.label.includes("WhatsApp")?"#E8F8EF":q.label.includes("Location")?"#FFF3E0":T.surface, color:q.label.includes("WhatsApp")?"#25D366":q.label.includes("Location")?"#E65100":T.textMid, borderRadius:20,padding:"4px 12px",fontSize:11,fontWeight:700,whiteSpace:"nowrap",cursor:"pointer",border:`1px solid ${q.label.includes("WhatsApp")?"#25D366":q.label.includes("Location")?"#E65100":T.border}`,flexShrink:0 }}>{q.label}</div>
            ))}
          </div>
        )}
        {!isBuyer && msgs.length>=1 && (
          <div style={{ display:"flex",gap:6,marginBottom:8,overflowX:"auto" }}>
            {[
              { label:"📍 Share Location",action:()=>{
                if(!navigator.geolocation){ askNotice("Location not available on this device"); return; }
                navigator.geolocation.getCurrentPosition(async(pos)=>{
                  const { latitude:lat, longitude:lng } = pos.coords;
                  const mapsUrl = `https://maps.google.com/?q=${lat},${lng}`;
                  await sb.from("chats").insert({ listing_id:String(listing?.id||""), listing_title:listing?.title, buyer_phone:buyerPhone, buyer_name:buyerName, seller_phone:sellerPhone, seller_name:sellerName, sender_phone:currentPhone, sender_name:currentName, message:`📍 ${currentName} shared their location: ${mapsUrl}`, read:false });
                  loadMsgs();
                }, ()=>askNotice("Please allow location access and try again."));
              }},
              { label:"📱 Share My Number",action:async()=>{ await sb.from("chats").insert({ listing_id:String(listing?.id||""), listing_title:listing?.title, buyer_phone:buyerPhone, buyer_name:buyerName, seller_phone:sellerPhone, seller_name:sellerName, sender_phone:"system", sender_name:"KaziApa", message:`📱 ${currentName} has shared their number: ${currentPhone}`, read:false }); loadMsgs(); } },
              { label:"💚 WhatsApp Buyer",action:()=>{
                const wa = buyerPhone.startsWith("+") ? buyerPhone.replace("+","") : "254"+buyerPhone.replace(/^0/,"");
                const msg = encodeURIComponent(`Hi ${buyerName}, thanks for your interest in "${listing?.title}" on KaziApa. How can I help you?`);
                window.open(`https://wa.me/${wa}?text=${msg}`,"_blank");
              }}
            ].map(q=>(
              <div key={q.label} onClick={q.action} style={{ background:q.label.includes("WhatsApp")?"#E8F8EF":q.label.includes("Location")?"#FFF3E0":T.surface, color:q.label.includes("WhatsApp")?"#25D366":q.label.includes("Location")?"#E65100":T.textMid, borderRadius:20,padding:"4px 12px",fontSize:11,fontWeight:700,whiteSpace:"nowrap",cursor:"pointer",border:`1px solid ${q.label.includes("WhatsApp")?"#25D366":q.label.includes("Location")?"#E65100":T.border}`,flexShrink:0 }}>{q.label}</div>
            ))}
          </div>
        )}
        <div style={{ display:"flex",gap:8 }}>
          <input type="file" accept="image/*" ref={chatImgRef} onChange={sendImage} style={{ display:"none" }} />
          <button onClick={()=>chatImgRef.current?.click()} disabled={sendingImage} style={{ width:44,height:44,borderRadius:"50%",background:T.surface,border:`1px solid ${T.border}`,color:T.textMid,fontSize:18,cursor:sendingImage?"default":"pointer",display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0 }}>
            {sendingImage ? "⏳" : "📷"}
          </button>
          <input value={input} onChange={e=>setInput(e.target.value)} placeholder="Type a message..."
            style={{ flex:1,padding:"11px 15px",borderRadius:24,border:`1px solid ${T.border}`,fontSize:14,outline:"none",background:T.card,color:T.text }}
            onKeyDown={e=>{ if(e.key==="Enter") send(); }} />
          <button onClick={send} style={{ width:44,height:44,borderRadius:"50%",background:T.primary,border:"none",color:"#fff",fontSize:20,cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0 }}>↑</button>
        </div>
      </div>

      {/* Full-screen in-app photo viewer — replaces window.open() so tapping a
          chat photo never leaves KaziApa or exposes the raw Supabase storage URL */}
      {viewingImage && (
        <div onClick={()=>setViewingImage(null)} style={{ position:"fixed",inset:0,background:"rgba(0,0,0,0.92)",zIndex:999,display:"flex",alignItems:"center",justifyContent:"center" }}>
          <button onClick={()=>setViewingImage(null)} style={{ position:"absolute",top:16,right:16,width:40,height:40,borderRadius:"50%",background:"rgba(255,255,255,0.15)",border:"none",color:"#fff",fontSize:20,cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center" }}>✕</button>
          <img src={viewingImage} alt="" onClick={e=>e.stopPropagation()} style={{ maxWidth:"92%",maxHeight:"85%",objectFit:"contain",borderRadius:8 }} />
        </div>
      )}
    </div>
  );
}

// ─── MY CHATS LIST ────────────────────────────────────────────────────────────
function ChatsList({ phone, onOpenChat, onBack }) {
  const cacheKey = "kaziapa_chats_"+phone;
  const cached = (()=>{ try { const c = JSON.parse(localStorage.getItem(cacheKey)||"null"); return Array.isArray(c)&&c.length ? c : null; } catch(e){ return null; } })();
  const [threads, setThreads] = useState(cached||[]);
  const [loading, setLoading] = useState(!cached);
  const [avatarMap, setAvatarMap] = useState({});
  const [loadErr, setLoadErr] = useState(false);

  useEffect(()=>{ load(); },[]);
  useEffect(()=>{ const h=()=>load(); window.addEventListener("kaziapa-refresh",h); return ()=>window.removeEventListener("kaziapa-refresh",h); },[]);

  async function load() {
    if(!threads.length) setLoading(true);
    setLoadErr(false);
    let data = null;
    try {
      const res = await Promise.race([
        sb.from("chats").select("listing_id,listing_title,buyer_phone,buyer_name,seller_phone,seller_name,message,created_at").or(`buyer_phone.eq.${phone},seller_phone.eq.${phone}`).order("created_at",{ ascending:false }).limit(300),
        new Promise((_,rej)=>setTimeout(()=>rej(new Error("timeout")),15000))
      ]);
      if(res.error) throw res.error;
      data = res.data;
    } catch(e) {
      if(!threads.length) setLoadErr(true);
      setLoading(false); return;
    }
    const seen = new Set(); const list = [];
    (data||[]).forEach(m=>{
      const key = m.listing_id+"_"+m.buyer_phone;
      if(!seen.has(key)) { seen.add(key); list.push(m); }
    });
    setThreads(list);
    setLoading(false);
    try { localStorage.setItem(cacheKey, JSON.stringify(list.slice(0,40))); } catch(e) {}
    const others = [...new Set(list.map(t=>t.buyer_phone===phone?t.seller_phone:t.buyer_phone).filter(Boolean))];
    if(others.length) {
      const { data:users } = await sb.from("users").select("phone,avatar_url").in("phone",others);
      const map = {}; (users||[]).forEach(u=>{ if(u.avatar_url) map[u.phone]=u.avatar_url; });
      setAvatarMap(map);
    }
  }

  return (
    <div>
      <BackHeader title="My Chats" onBack={onBack} right={<span role="button" aria-label="Refresh chats" onClick={load} style={{ color:"#fff",fontSize:22,cursor:"pointer",padding:"0 6px",lineHeight:1 }}>↻</span>} />
      <div style={{ padding:16 }}>
        {loading ? <ChatSkeleton count={4} />
        : loadErr ? <StateMessage tone="error" icon="📡" title="Couldn't load your chats." text="Check your connection and try again." actionLabel="Retry" onAction={load} />
        : threads.length===0 ? <StateMessage icon="💬" title="No chats yet." text="When you message a seller or buyer, your chats will show up here." />
        : threads.map((t,i)=>{
            const isBuyer = t.buyer_phone===phone;
            const otherName = isBuyer ? t.seller_name : t.buyer_name;
            const otherPhone = isBuyer ? t.seller_phone : t.buyer_phone;
            const otherAvatar = avatarMap[otherPhone];
            return (
              <div key={i} onClick={()=>onOpenChat(t)} style={{ background:T.card,borderRadius:14,padding:14,marginBottom:10,border:`1px solid ${T.border}`,cursor:"pointer",display:"flex",alignItems:"center",gap:12 }}>
                <div style={{ width:42,height:42,borderRadius:"50%",background:T.primary,display:"flex",alignItems:"center",justifyContent:"center",color:"#fff",fontWeight:800,overflow:"hidden",flexShrink:0 }}>
                  {otherAvatar ? <img src={otherAvatar} alt="" style={{ width:"100%",height:"100%",objectFit:"cover" }} /> : otherName?.[0]}
                </div>
                <div style={{ flex:1,minWidth:0 }}>
                  <div style={{ fontWeight:700,color:T.text,fontSize:14 }}>{otherName}</div>
                  <div style={{ fontSize:12,fontWeight:700,color:T.primary,whiteSpace:"nowrap",overflow:"hidden",textOverflow:"ellipsis" }}>📦 {t.listing_title}</div>
                  <div style={{ fontSize:12,color:T.textMid,marginTop:2,whiteSpace:"nowrap",overflow:"hidden",textOverflow:"ellipsis" }}>{t.message}</div>
                </div>
              </div>
            );
          })
        }
      </div>
    </div>
  );
}

// ─── MAIN APP ─────────────────────────────────────────────────────────────────
export default function KaziApa() {
  // Stay logged in — check localStorage on first load
  const getSaved = (key, def="") => { try { const s=localStorage.getItem("kaziapa_user"); return s?JSON.parse(s)[key]||def:def; } catch(e){ return def; } };

  const [authStep,setAuthStep]   = useState(()=>{
    try {
      const saved = localStorage.getItem("kaziapa_user");
      if(saved) { const u=JSON.parse(saved); if(u.phone&&u.name) return "app"; }
      // First time visitor — show splash
      const seen = localStorage.getItem("kaziapa_onboarded");
      if(!seen) return "_splash";
    } catch(e) {}
    return "phone";
  });
  const [phone,setPhone]         = useState(()=>getSaved("phone"));
  const [otp,setOtp]             = useState(["","","","","",""]);
  const [otpLoading,setOtpLoading] = useState(false);
  const [otpError,setOtpError]   = useState("");
  const [userName,setUserName]   = useState(()=>getSaved("name"));
  const [userTown,setUserTown]   = useState(()=>getSaved("town"));
  const [userAvatar,setUserAvatar] = useState(()=>getSaved("avatar"));
  const [avatarUploading,setAvatarUploading] = useState(false);
  const [agreedPrivacy,setAgreedPrivacy] = useState(false);
  const [showPrivacy,setShowPrivacy]     = useState(false);
  const [showTerms,setShowTerms]         = useState(false);
  const [unreadCount,setUnreadCount]     = useState(0);
  const [blockedUsers,setBlockedUsers]   = useState([]);
  const [notifications,setNotifications] = useState([]);
  const [showNotifs,setShowNotifs]       = useState(false);
  const [lang,setLang]           = useState(()=>{ try { return localStorage.getItem("kaziapa_lang")||"en"; } catch(e) { return "en"; } });
  useEffect(()=>{ try { localStorage.setItem("kaziapa_lang",lang); } catch(e) {} },[lang]);
  const SAFE_SCREENS = ["home","browse","requests","post","profile","chats","kiosk","myListings","guidelines","privacy","terms","about","admin","housing","orders","nitume","market"];
  // Note: "marketProfile" is intentionally NOT in SAFE_SCREENS — it depends on
  // activeMarket, which isn't safe to restore blindly after a raw page refresh.
  // Note: "rentTracker" is intentionally NOT in SAFE_SCREENS — like "chat" and
  // "checkout", it depends on data (tenancies) that isn't safe to restore blindly
  // after a raw page refresh, matching the existing pattern for data-dependent screens.
  const [screen,setScreen]       = useState(()=>{
    try { const s = sessionStorage.getItem("kaziapa_screen"); return (s && SAFE_SCREENS.includes(s)) ? s : "home"; } catch(e) { return "home"; }
  });
  const [town,setTown]           = useState("All");
  const [locatingMe,setLocatingMe] = useState(false);
  const [userCoords,setUserCoords] = useState(null);
  const [nearMeActive,setNearMeActive] = useState(false);
  const [catFilter,setCatFilter] = useState(null);
  const [search,setSearch]       = useState("");
  const [listings,setListings]   = useState(()=>{ try { return JSON.parse(localStorage.getItem("kaziapa_listings_cache")||"[]"); } catch(e) { return []; } });
  const [activeListing,setActiveListing] = useState(null);
  const [browseTab,setBrowseTab] = useState("listings");
  const [checkStep,setCheckStep] = useState(1);
  const [showBoostOptions,setShowBoostOptions] = useState(false);
  const [boosting,setBoosting] = useState(false);
  const [freeBoosts,setFreeBoosts] = useState(0);
  const [showUpgrade,setShowUpgrade] = useState(false);
  const [upgrading,setUpgrading] = useState(false);
  const [userPlan,setUserPlan]   = useState("free");
  const [activeThread,setActiveThread] = useState(null);
  const [activeNav,setActiveNav] = useState(()=>{
    try { return sessionStorage.getItem("kaziapa_nav") || "home"; } catch(e) { return "home"; }
  });
  const [toast,setToast]         = useState(null);
  const [loading,setLoading]     = useState(false);
  const [listingsErr,setListingsErr] = useState(false);
  const [requests,setRequests]   = useState([]);
  const [conciergeTxt,setConciergeTxt] = useState("");
  const [conciergeTown,setConciergeTown] = useState("");
  const [conciergeDone,setConciergeDone] = useState(false);

  // Post form
  const [postTitle,setPostTitle]   = useState("");
  const [postPrice,setPostPrice]   = useState("");
  const [postDesc,setPostDesc]     = useState("");
  const [postCat,setPostCat]       = useState("mitumba");
  const [postMarketId,setPostMarketId] = useState(null);
  const [postMarketName,setPostMarketName] = useState("");
  const [postTown,setPostTown]     = useState("");
  const [postLat,setPostLat]       = useState(null);
  const [postLng,setPostLng]       = useState(null);
  const [postLocating,setPostLocating] = useState(false);
  const [postPhotos,setPostPhotos] = useState([]);
  const [postBoost,setPostBoost]   = useState(false);
  const [posting,setPosting]       = useState(false);

  function showToast(msg,type="success") { setToast({ msg,type }); setTimeout(()=>setToast(null),2800); }
  const [showExitConfirm,setShowExitConfirm] = useState(false);
  const [showLogoutConfirm,setShowLogoutConfirm] = useState(false);
  const [nitumeAvailable, setNitumeAvailable] = useState(false);
  const [activeMarket, setActiveMarket] = useState(null);
  const [hoodNavState, setHoodNavState] = useState({ view:"root", county:null, town:null, search:"" });
  const [planStatus, setPlanStatus] = useState(null);
  const navHistoryRef = useRef([]);
  const [listingFromChat,setListingFromChat] = useState(false);
  const exitingRef = useRef(false);
  function nav(s,key) {
    if (s !== screen) navHistoryRef.current.push({ s: screen, key: activeNav });
    if (s !== "listing") setListingFromChat(false);
    if (s !== "thread") setChatDraft("");
    setScreen(s); if(key) setActiveNav(key);
  }

  useEffect(()=>{
    try {
      if (SAFE_SCREENS.includes(screen)) sessionStorage.setItem("kaziapa_screen", screen);
      else if (screen==="thread") sessionStorage.setItem("kaziapa_screen", "chats");
      sessionStorage.setItem("kaziapa_nav", activeNav);
    } catch(e) {}
  },[screen,activeNav]);

  // Handle Android back button — returns to the actual previous screen, not always Home
  useEffect(()=>{
    if(authStep!=="app") return;
    window.history.pushState({ kaziapa:true }, "");
    function handlePop(e) {
      if(exitingRef.current) return; // user confirmed exit — let this back-navigation actually close the app
      if(navHistoryRef.current.length > 0) {
        const prev = navHistoryRef.current.pop();
        // Hardware back was leaving activeThread populated after backing out of
        // a chat, since (unlike the in-app Back arrow) this path never ran the
        // screen's own cleanup — leaving My Chats unable to render (it only
        // shows when activeThread is empty) and appearing as a blank screen.
        if (prev.s !== "thread") setActiveThread(null);
        setListingFromChat(false);
        setChatDraft("");
        setScreen(prev.s); setActiveNav(prev.key);
        window.history.pushState({ kaziapa:true }, "");
      } else if(screen !== "home") {
        setActiveThread(null);
        setScreen("home"); setActiveNav("home");
        window.history.pushState({ kaziapa:true }, "");
      } else {
        // window.confirm() is unreliable in installed standalone PWAs on Android —
        // show our own styled confirm modal instead.
        setShowExitConfirm(true);
        window.history.pushState({ kaziapa:true }, "");
      }
    }
    window.addEventListener("popstate", handlePop);
    return ()=>window.removeEventListener("popstate", handlePop);
  },[screen, authStep]);

  // Collapsible bottom nav — hides on scroll-down (more screen room while
  // browsing a long list), reappears on scroll-up or near the very top.
  const [navVisible, setNavVisible] = useState(true);
  useEffect(()=>{
    if(authStep!=="app") return;
    let lastY = window.scrollY;
    function onScroll() {
      const y = window.scrollY;
      if(y < 40) { setNavVisible(true); }
      else if(y > lastY + 4) { setNavVisible(false); }
      else if(y < lastY - 4) { setNavVisible(true); }
      lastY = y;
    }
    window.addEventListener("scroll", onScroll, { passive:true });
    return ()=>window.removeEventListener("scroll", onScroll);
  },[authStep]);

  // Web Push — ask permission once and save the subscription against this
  // phone number, so notify-message.js can reach this device for free
  // instead of falling back to a paid SMS. Safe to run every app load:
  // Notification.requestPermission() only actually prompts the user once
  // (it just returns the existing decision on later calls), and re-saving
  // the same subscription is harmless (upserted by endpoint).
  useEffect(()=>{
    if(authStep!=="app" || !phone) return;
    (async()=>{
      try {
        if(!("serviceWorker" in navigator) || !("PushManager" in window)) return;
        if(Notification.permission === "denied") return;

        const permission = await Notification.requestPermission();
        if(permission !== "granted") return;

        const reg = await navigator.serviceWorker.ready;
        let sub = await reg.pushManager.getSubscription();
        if(!sub) {
          const VAPID_PUBLIC_KEY = "BJQ5822-glkiTYsjuMcHifyMkY_2jx4T1D5j1H1r0cRIBb2lUJzfRwCxdnH_KhJr5WETl98FZA-p7YaQKN8gAQk";
          const padding = "=".repeat((4 - VAPID_PUBLIC_KEY.length % 4) % 4);
          const base64 = (VAPID_PUBLIC_KEY + padding).replace(/-/g,"+").replace(/_/g,"/");
          const rawData = atob(base64);
          const appServerKey = new Uint8Array(rawData.length);
          for(let i=0;i<rawData.length;i++) appServerKey[i] = rawData.charCodeAt(i);

          sub = await reg.pushManager.subscribe({
            userVisibleOnly: true,
            applicationServerKey: appServerKey,
          });
        }

        await fetch("/api/save-push-subscription", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ phone, subscription: sub.toJSON() }),
        }).catch(()=>{});
      } catch(err) {
        // Notification permission dismissed, unsupported browser, etc. — SMS
        // fallback in notify-message.js still covers this user either way.
      }
    })();
  },[authStep, phone]);

  // Load listings from Supabase
  useEffect(()=>{
    if(authStep!=="app") return;
    loadListings();
    loadRequests();
    loadBlockedUsers();
    loadNotifications();
    checkBanned();
  },[authStep,town,catFilter]);

  async function checkBanned() {
    if(!phone) return;
    const { data } = await sb.from("users").select("banned").eq("phone",phone).single();
    if(data?.banned) {
      localStorage.removeItem("kaziapa_user"); localStorage.removeItem("kaziapa_token");
      sessionStorage.removeItem("kaziapa_screen"); sessionStorage.removeItem("kaziapa_nav");
      setAuthStep("phone"); setUserName(""); setPhone(""); setOtp(["","","","","",""]);
      showToast("Your account has been suspended. Contact hello@kaziapa.co.ke for help.","error");
    }
  }

  useEffect(()=>{
    if(screen!=="profile" || !phone) return;
    (async ()=>{
      const { data } = await sb.from("users").select("nitume_available,chat_unlimited_until,chat_plan_tier,is_verified,verified_expires_at,free_boosts_remaining,avatar_url,availability,availability_updated_at").eq("phone",phone).single();
      setNitumeAvailable(!!data?.nitume_available);
      setPlanStatus(data||null);
      setMyAvail(data?.availability ? { availability:data.availability, availability_updated_at:data.availability_updated_at } : null);
      if(data?.avatar_url && data.avatar_url!==userAvatar) {
        setUserAvatar(data.avatar_url);
        const saved = JSON.parse(localStorage.getItem("kaziapa_user")||"{}");
        localStorage.setItem("kaziapa_user", JSON.stringify({ ...saved, avatar:data.avatar_url }));
      }
    })();
  },[screen]);

  async function toggleNitumeAvailability() {
    const next = !nitumeAvailable;
    await sb.from("users").update({ nitume_available:next }).eq("phone",phone);
    setNitumeAvailable(next);
    showToast(next ? "You're now listed as available for Nitume jobs! 🛍️" : "Removed from Nitume availability.");
  }

  async function loadBlockedUsers() {
    if(!phone) return;
    const { data } = await sb.from("blocked_users").select("blocked_phone").eq("blocker_phone", phone);
    setBlockedUsers((data||[]).map(b=>b.blocked_phone));
  }

  async function blockUser(targetPhone, targetName) {
    if(await askConfirm(`Block ${targetName}? They won't be able to message you.`)) {
      await sb.from("blocked_users").upsert({ blocker_phone:phone, blocked_phone:targetPhone, blocked_name:targetName });
      setBlockedUsers(prev=>[...prev, targetPhone]);
      showToast(`${targetName} has been blocked.`);
    }
  }

  async function loadNotifications() {
    if(!phone) return;
    const { data } = await sb.from("notifications").select("*").eq("recipient_phone", phone).order("created_at",{ ascending:false }).limit(20);
    setNotifications(data||[]);
  }

  async function markNotifsRead() {
    await sb.from("notifications").update({ read:true }).eq("recipient_phone", phone).eq("read", false);
    setNotifications(prev=>prev.map(n=>({ ...n, read:true })));
  }

  // Poll unread messages every 10 seconds
  useEffect(()=>{
    if(authStep!=="app" || !phone) return;
    async function checkUnread() {
      const { data } = await sb.from("chats").select("id,read,sender_phone")
        .or(`buyer_phone.eq.${phone},seller_phone.eq.${phone}`)
        .eq("read", false)
        .neq("sender_phone", phone)
        .limit(99);
      setUnreadCount((data||[]).length);
    }
    checkUnread();
    const interval = setInterval(checkUnread, 10000);
    return ()=>clearInterval(interval);
  },[authStep, phone]);

  async function loadListings() {
    setListingsErr(false);
    try {
      await Promise.race([ loadListingsInner(), new Promise((_,rej)=>setTimeout(()=>rej(new Error("timeout")),20000)) ]);
    } catch(e) {
      setListingsErr(true); setLoading(false);
    }
  }
  async function loadListingsInner() {
    setLoading(true);
    if(nearMeActive && userCoords) {
      // True distance sort: pull listings that have coordinates, rank by real distance.
      let q = sb.from("listings").select("*").not("lat","is",null).not("lng","is",null)
        .order("featured",{ ascending:false }).order("created_at",{ ascending:false }).limit(300);
      if(catFilter) q = q.eq("category",catFilter);
      else q = q.not("category","in","(kazi,fundi,usafiri)");
      if(search) q = q.or(`title.ilike.%${search}%,town.ilike.%${search}%`);
      const { data, error } = await q;
      if(error) throw error;
      const withDist = (data||[]).map(l=>({ ...l, _distanceKm: distanceKm(userCoords.lat,userCoords.lng,l.lat,l.lng) }))
        .sort((a,b)=>a._distanceKm-b._distanceKm).slice(0,50);
      setListings(withDist);
      setLoading(false);
      return;
    }
    let q = sb.from("listings").select("*").order("featured",{ ascending:false }).order("created_at",{ ascending:false });
    if(town!=="All") q = q.ilike("town",`%${town}%`);
    if(catFilter) q = q.eq("category",catFilter);
    else q = q.not("category","in","(kazi,fundi,usafiri)");
    if(search) q = q.or(`title.ilike.%${search}%,town.ilike.%${search}%`);
    const { data, error } = await q.limit(50);
    if(error) throw error;
    setListings(data||[]);
    if(data && town==="All" && !catFilter && !search) {
      try { localStorage.setItem("kaziapa_listings_cache", JSON.stringify(data.slice(0,20))); } catch(e) {}
    }
    setLoading(false);
  }

  // Detects the user's current GPS position and sorts listings by real distance.
  // Falls back to matching the reverse-geocoded town name if too few listings have coordinates yet.
  function findNearMe() {
    if(!navigator.geolocation) { showToast("Location isn't available on this device","error"); return; }
    setLocatingMe(true);
    navigator.geolocation.getCurrentPosition(async(pos)=>{
      const { latitude, longitude } = pos.coords;
      setUserCoords({ lat:latitude, lng:longitude });
      setNearMeActive(true);
      setSearch("");
      try {
        let q = sb.from("listings").select("id,lat,lng").not("lat","is",null).not("lng","is",null).limit(300);
        const { data } = await q;
        if((data||[]).length >= 3) {
          setTown("All");
          await loadListingsNear({ lat:latitude, lng:longitude });
          showToast("Showing listings sorted by distance from you","success");
        } else {
          // Not enough sellers have shared exact location yet — fall back to town name.
          const res = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&zoom=14&addressdetails=1`);
          const geo = await res.json();
          const addr = geo.address||{};
          const place = addr.town||addr.city||addr.suburb||addr.village||addr.county||addr.state_district||"";
          setNearMeActive(false);
          if(place) {
            setTown(place);
            setTimeout(loadListings,300);
            showToast(`Showing listings near ${place}`,"success");
          } else {
            showToast("Couldn't detect your town — try typing it instead","error");
          }
        }
      } catch(e) {
        showToast("Couldn't detect your location — check your connection","error");
      } finally {
        setLocatingMe(false);
      }
    }, ()=>{ setLocatingMe(false); showToast("Location permission denied","error"); }, { timeout:10000, enableHighAccuracy:true });
  }

  // ── OTP resend cooldown ──────────────────────────────────────────────────
  const [resendLeft,setResendLeft] = useState(0);
  const [resendBusy,setResendBusy] = useState(false);
  useEffect(()=>{
    if(resendLeft<=0) return;
    const t = setTimeout(()=>setResendLeft(l=>l-1),1000);
    return ()=>clearTimeout(t);
  },[resendLeft]);

  // ── Availability, last-active and 24-hour statuses ───────────────────────
  const [statuses,setStatuses] = useState([]);
  const [chatDraft,setChatDraft] = useState("");
  // For listings with a price range ("From 5000-25000") the buyer types the amount agreed in chat
  const [agreedAmount,setAgreedAmount] = useState("");
  useEffect(()=>{ setAgreedAmount(""); },[activeListing?.id]);
  const checkoutAmount = Number(activeListing?.price) > 0 ? Number(activeListing.price) : (Number(agreedAmount) || 0);
  const [presenceTick,setPresenceTick] = useState(0);
  const [statusOpen,setStatusOpen] = useState(null);   // seller_phone of the group being viewed
  const [showStatusComposer,setShowStatusComposer] = useState(false);
  const [seenStatus,setSeenStatus] = useState(()=>{ try { return JSON.parse(localStorage.getItem("kaziapa_seen_status")||"[]"); } catch(e) { return []; } });
  const [myAvail,setMyAvail] = useState(null);
  const hiddenStatus = () => { try { return JSON.parse(localStorage.getItem("kaziapa_hidden_status")||"[]"); } catch(e) { return []; } };
  async function loadStatuses() {
    try {
      const { data, error } = await sb.from("statuses").select("*").gt("expires_at", new Date().toISOString()).lt("reports",3).order("created_at",{ ascending:false }).limit(80);
      if(error) return;
      const hid = hiddenStatus();
      setStatuses((data||[]).filter(x=>!hid.includes(x.id)));
    } catch(e) {}
  }
  useEffect(()=>{
    if(authStep!=="app" || screen!=="home") return;
    loadStatuses();
    const h = ()=>loadStatuses();
    window.addEventListener("kaziapa-refresh", h);
    return ()=>window.removeEventListener("kaziapa-refresh", h);
  },[authStep, screen]);
  // Availability of the sellers shown in the listing cards
  useEffect(()=>{
    const phones = [...new Set((listings||[]).map(l=>l.seller_phone).filter(Boolean))].slice(0,150);
    if(!phones.length) return;
    let on = true;
    (async ()=>{
      try {
        const { data } = await sb.from("users").select("phone,availability,availability_updated_at").in("phone", phones);
        if(!on || !data) return;
        const m = { ...presenceStore.map };
        data.forEach(u=>{ m[u.phone] = u; });
        presenceStore.map = m;
        setPresenceTick(t=>t+1);
      } catch(e) {}
    })();
    return ()=>{ on = false; };
  },[listings]);
  // "Active X ago": update at most once an hour
  useEffect(()=>{
    if(authStep!=="app" || !phone) return;
    try {
      const last = Number(localStorage.getItem("kaziapa_active_ping")||0);
      if(Date.now()-last < 3600000) return;
      sb.from("users").update({ last_active:new Date().toISOString() }).eq("phone",phone).then(()=>{ try { localStorage.setItem("kaziapa_active_ping", String(Date.now())); } catch(e) {} });
    } catch(e) {}
  },[authStep, phone]);
  async function setAvailability(key) {
    const at = new Date().toISOString();
    const { error } = await sb.from("users").update({ availability:key, availability_updated_at:at }).eq("phone",phone);
    if(error) { showToast("Couldn't update. Try again.","error"); return; }
    setMyAvail({ availability:key, availability_updated_at:at });
    showToast(`${AVAIL[key].dot} ${AVAIL[key].label}`);
  }
  const markSeen = (id) => setSeenStatus(prev=>{
    if(prev.includes(id)) return prev;
    const next = [...prev, id].slice(-300);
    try { localStorage.setItem("kaziapa_seen_status", JSON.stringify(next)); } catch(e) {}
    return next;
  });
  // group statuses by seller, own first, then sellers with unseen items, then newest
  const statusGroups = (()=>{
    const map = new Map();
    for(const st of statuses) {
      if(!map.has(st.seller_phone)) map.set(st.seller_phone, { seller_phone:st.seller_phone, seller_name:st.seller_name, seller_avatar:st.seller_avatar, town:st.town, items:[] });
      map.get(st.seller_phone).items.push(st);
    }
    const arr = [...map.values()].map(g=>({ ...g, items:[...g.items].sort((a,b)=>Date.parse(a.created_at)-Date.parse(b.created_at)) }));
    const unseen = g => g.items.some(i=>!seenStatus.includes(i.id));
    const sameTown = g => !!(g.town && userTown && g.town===userTown);
    arr.sort((a,b)=> (b.seller_phone===phone)-(a.seller_phone===phone) || (sameTown(b)-sameTown(a)) || (unseen(b)-unseen(a)) || (Date.parse(b.items[b.items.length-1].created_at)-Date.parse(a.items[a.items.length-1].created_at)));
    return arr;
  })();

  // ── Pull-to-refresh (Home, Browse, My Chats) ─────────────────────────────
  const [ptrPull,setPtrPull] = useState(0);
  const [ptrRefreshing,setPtrRefreshing] = useState(false);
  const ptrBusyRef = useRef(false);
  const checkoutBusyRef = useRef(false);
  const [confirmDlg,setConfirmDlg] = useState(null);
  const [reportedIds,setReportedIds] = useState(()=>{ try { return JSON.parse(localStorage.getItem("kaziapa_reported")||"[]"); } catch(e) { return []; } });
  const markReported = (id, title) => setReportedIds(prev=>{
    const next = prev.includes(String(id)) ? prev : [...prev, String(id)];
    try { localStorage.setItem("kaziapa_reported", JSON.stringify(next.slice(-300))); } catch(e) {}
    try {
      const m = JSON.parse(localStorage.getItem("kaziapa_reported_at")||"{}");
      if(!m[String(id)]) m[String(id)] = new Date().toISOString();
      localStorage.setItem("kaziapa_reported_at", JSON.stringify(m));
      if(title) { const t = JSON.parse(localStorage.getItem("kaziapa_reported_titles")||"{}"); t[String(id)] = title; localStorage.setItem("kaziapa_reported_titles", JSON.stringify(t)); }
    } catch(e) {}
    return next;
  });
  // When a listing this user reported no longer exists (admin removed it), tell them the outcome once.
  useEffect(()=>{
    if(authStep!=="app" || !phone) return;
    (async ()=>{
      try {
        const ids = JSON.parse(localStorage.getItem("kaziapa_reported")||"[]").slice(-30);
        if(!ids.length) return;
        const { data, error } = await sb.from("listings").select("id").in("id", ids);
        if(error || !data) return;
        const alive = new Set(data.map(x=>String(x.id)));
        const handled = JSON.parse(localStorage.getItem("kaziapa_reported_gone")||"[]");
        const fresh = ids.filter(i=>!alive.has(String(i)) && !handled.includes(String(i)));
        if(!fresh.length) return;
        localStorage.setItem("kaziapa_reported_gone", JSON.stringify([...handled, ...fresh].slice(-300)));
        const titles = JSON.parse(localStorage.getItem("kaziapa_reported_titles")||"{}");
        for(const id of fresh) {
          const t = titles[String(id)];
          await sb.from("notifications").insert({ recipient_phone:phone, icon:"✅", read:false, title:"Report reviewed — listing removed", body:`The listing you reported${t?` ("${t}")`:""} is no longer on KaziApa. Thank you for helping keep the community safe.` });
        }
        showToast(fresh.length>1 ? `${fresh.length} listings you reported were removed. Thank you!` : "A listing you reported was removed. Thank you!");
      } catch(e) {}
    })();
  },[authStep, phone]);
  // "none" | "pending" | "dismissed" — dismissed once the admin reviewed the listing after this user reported it
  const reportState = (l) => {
    if(!l || !reportedIds.includes(String(l.id))) return "none";
    let at = 0;
    try { at = Date.parse(JSON.parse(localStorage.getItem("kaziapa_reported_at")||"{}")[String(l.id)]) || 0; } catch(e) {}
    const dismissed = l.report_dismissed_at ? Date.parse(l.report_dismissed_at) : 0;
    return dismissed > at ? "dismissed" : "pending";
  };
  useEffect(()=>{
    if(authStep!=="app" || !["home","browse","chats"].includes(screen)) { setPtrPull(0); return; }
    try { document.documentElement.style.overscrollBehaviorY = "none"; } catch(e) {}
    let startY = null, pulling = false, pull = 0;
    const onStart = e => {
      if(window.scrollY>0 || ptrBusyRef.current || e.touches.length!==1) { startY = null; return; }
      startY = e.touches[0].clientY; pulling = false; pull = 0;
    };
    const onMove = e => {
      if(startY==null) return;
      const dy = e.touches[0].clientY - startY;
      if(window.scrollY>0) { startY = null; pulling = false; setPtrPull(0); return; }
      if(dy<=0) { if(pulling) { pulling = false; pull = 0; setPtrPull(0); } return; }
      pulling = true; pull = Math.min(dy*0.5, 90); setPtrPull(pull);
    };
    const onEnd = async () => {
      const trigger = pulling && pull>=60;
      startY = null; pulling = false; pull = 0;
      if(!trigger) { setPtrPull(0); return; }
      ptrBusyRef.current = true; setPtrRefreshing(true); setPtrPull(0);
      window.dispatchEvent(new Event("kaziapa-refresh"));
      try { if(screen==="home" || screen==="browse") await loadListings(); } catch(e) {}
      await new Promise(r=>setTimeout(r,700));
      ptrBusyRef.current = false; setPtrRefreshing(false);
    };
    document.addEventListener("touchstart", onStart, { passive:true });
    document.addEventListener("touchmove", onMove, { passive:true });
    document.addEventListener("touchend", onEnd, { passive:true });
    document.addEventListener("touchcancel", onEnd, { passive:true });
    return ()=>{
      document.removeEventListener("touchstart", onStart);
      document.removeEventListener("touchmove", onMove);
      document.removeEventListener("touchend", onEnd);
      document.removeEventListener("touchcancel", onEnd);
    };
  },[authStep, screen, town, catFilter, search, nearMeActive, userCoords]);

  async function loadListingsNear(coords) {
    setLoading(true);
    let q = sb.from("listings").select("*").not("lat","is",null).not("lng","is",null)
      .order("featured",{ ascending:false }).order("created_at",{ ascending:false }).limit(300);
    if(catFilter) q = q.eq("category",catFilter);
    else q = q.not("category","in","(kazi,fundi,usafiri)");
    if(search) q = q.or(`title.ilike.%${search}%,town.ilike.%${search}%`);
    const { data } = await q;
    const withDist = (data||[]).map(l=>({ ...l, _distanceKm: distanceKm(coords.lat,coords.lng,l.lat,l.lng) }))
      .sort((a,b)=>a._distanceKm-b._distanceKm).slice(0,50);
    setListings(withDist);
    setLoading(false);
  }

  // Lets a seller attach their exact GPS coordinates to a listing at post time.
  function capturePostLocation() {
    if(!navigator.geolocation) { showToast("Location isn't available on this device","error"); return; }
    setPostLocating(true);
    navigator.geolocation.getCurrentPosition((pos)=>{
      setPostLat(pos.coords.latitude);
      setPostLng(pos.coords.longitude);
      setPostLocating(false);
      showToast("Location attached to your listing 📍","success");
    }, ()=>{ setPostLocating(false); showToast("Location permission denied","error"); }, { timeout:10000, enableHighAccuracy:true });
  }

  async function loadRequests() {
    const { data } = await sb.from("requests").select("*").order("created_at",{ ascending:false }).limit(30);
    setRequests(data||[]);
  }

  async function postListing() {
    if(!postTitle||!postPrice||!postTown) { showToast("Fill in title, price and town first","error"); return; }
    setPosting(true);
    // Flat anti-spam ceiling — not a real limit for genuine sellers.
    const { count } = await sb.from("listings").select("id",{ count:"exact",head:true }).eq("seller_phone",phone);
    if ((count||0) >= 50) {
      showToast("You've reached the 50-listing limit. Contact support if you need more.", "error");
      setPosting(false);
      return;
    }
    // Parse price — handle ranges like "12000-20000" by taking the first number
    const parsedPrice = parseInt(postPrice.toString().replace(/[^0-9]/,"")) || 0;
    const { error } = await sb.from("listings").insert({
      title:postTitle, price:parsedPrice, price_label:postPrice,
      description:postDesc, category:postCat, town:postTown,
      seller_name:userName, seller_phone:phone, photos:postPhotos, boosted:postBoost,
      lat:postLat, lng:postLng, seller_avatar_url:userAvatar||null, market_id:postMarketId, market_name:postMarketName||null,
    });
    if(error) { showToast("Error posting. Try again.","error"); }
    else {
      showToast("Listing posted and live immediately! 🎉");
      setPostTitle(""); setPostPrice(""); setPostDesc(""); setPostTown(""); setPostPhotos([]); setPostBoost(false); setPostLat(null); setPostLng(null);
      setPostMarketId(null); setPostMarketName("");
      await loadListings();
      nav("home","home");
    }
    setPosting(false);
  }

  async function startUpgradePurchase(type, tier, label) {
    setUpgrading(true);
    try {
      const checkField = type === "verified_badge" ? "is_verified" : "chat_unlimited_until";
      const { data: before } = await sb.from("users").select(checkField).eq("phone", phone).single();
      const beforeVal = before?.[checkField] || null;

      const res = await fetch("/api/initiate-purchase", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone, userId: phone, type, tier }),
      });
      const data = await res.json();
      if (!data.success) {
        showToast("Couldn't start payment. Try again.", "error");
        setUpgrading(false);
        return;
      }
      let attempts = 0;
      const poll = setInterval(async () => {
        attempts++;
        const { data: fresh } = await sb.from("users").select(checkField).eq("phone", phone).single();
        const freshVal = fresh?.[checkField] || null;
        const changed = freshVal && freshVal !== beforeVal;
        if (changed) {
          clearInterval(poll);
          setUpgrading(false);
          setShowUpgrade(false);
          if (type !== "verified_badge") setUserPlan(tier);
          showToast(`${label} activated! 🎉`);
        } else if (attempts >= 20) {
          clearInterval(poll);
          setUpgrading(false);
          showToast("Payment not confirmed yet. Check your M-Pesa messages, or try again.", "error");
        }
      }, 3000);
    } catch (err) {
      showToast("Something went wrong. Try again.", "error");
      setUpgrading(false);
    }
  }

  async function useFreeBoost() {
    setBoosting(true);
    const expiresAt = new Date(Date.now()+7*24*60*60*1000).toISOString(); // free boost = 7 days
    await sb.from("listings").update({ featured:true, featured_expires_at:expiresAt }).eq("id",activeListing.id);
    await sb.from("users").update({ free_boosts_remaining:Math.max(0,freeBoosts-1) }).eq("phone",phone);
    setActiveListing({ ...activeListing, featured:true });
    setFreeBoosts(f=>Math.max(0,f-1));
    setBoosting(false);
    setShowBoostOptions(false);
    showToast("Free boost used! Boosted for 7 days.");
  }

  async function boostListing(tier) {
    setBoosting(true);
    try {
      const res = await fetch("/api/initiate-purchase", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone, userId: phone, type: "boost", tier, listingId: activeListing.id }),
      });
      const data = await res.json();
      if (!data.success) {
        showToast("Couldn't start payment. Try again.", "error");
        setBoosting(false);
        return;
      }
      // Poll the listing every 3s (same interval used for chat) until it shows as boosted.
      let attempts = 0;
      const poll = setInterval(async () => {
        attempts++;
        const { data: fresh } = await sb.from("listings").select("featured").eq("id", activeListing.id).single();
        if (fresh?.featured) {
          clearInterval(poll);
          setActiveListing({ ...activeListing, featured: true });
          setBoosting(false);
          setShowBoostOptions(false);
          showToast("Listing boosted! Appears at top of results.");
        } else if (attempts >= 20) { // ~60s timeout
          clearInterval(poll);
          setBoosting(false);
          showToast("Payment not confirmed yet. Check your M-Pesa messages, or try again.", "error");
        }
      }, 3000);
    } catch (err) {
      showToast("Something went wrong. Try again.", "error");
      setBoosting(false);
    }
  }

  async function postConcierge() {
    if(!conciergeTxt.trim()) return;
    await sb.from("requests").insert({ buyer_name:userName,buyer_phone:phone,item:conciergeTxt,budget:0,category:"general",town:conciergeTown||userTown,area:"" });
    setConciergeDone(true);
    showToast("Request posted! Sellers will respond soon.");
  }

  // ── AUTH ──────────────────────────────────────────────────────────────────
  async function saveUser() {
    if(!userName.trim()||!userTown.trim()) { showToast("Please fill in name and town","error"); return; }
    await sb.from("users").upsert({ phone,name:userName,town:userTown },{ onConflict:"phone" });
    // Save to localStorage so user stays logged in
    localStorage.setItem("kaziapa_user", JSON.stringify({ phone, name:userName, town:userTown, avatar:userAvatar }));
    setAuthStep("app"); setActiveNav("home"); showToast(`Welcome ${userName}! 🤝`);
  }

  // Compress + upload a profile photo, save it to the user's account, and keep localStorage in sync.
  async function uploadAvatar(file) {
    if(!file) return;
    setAvatarUploading(true);
    try {
      const compressed = await new Promise((resolve)=>{
        const reader = new FileReader();
        reader.onload = (e)=>{
          const img = new Image();
          img.onload = ()=>{
            const canvas = document.createElement("canvas");
            const MAX = 300; // avatars are small — no need for the 900px listing-photo size
            let w = img.width, h = img.height;
            if(w > MAX) { h = Math.round(h * MAX / w); w = MAX; }
            if(h > MAX) { w = Math.round(w * MAX / h); h = MAX; }
            canvas.width = w; canvas.height = h;
            canvas.getContext("2d").drawImage(img,0,0,w,h);
            canvas.toBlob((blob)=>resolve(blob),"image/jpeg",0.8);
          };
          img.src = e.target.result;
        };
        reader.readAsDataURL(file);
      });
      const name = `avatar-${phone}-${Date.now()}.jpg`;
      const { error } = await sb.storage.from("kaziapa-photos").upload(name, compressed, { contentType:"image/jpeg" });
      if(error) { showToast("Upload failed — try again","error"); return; }
      const { data:pub } = sb.storage.from("kaziapa-photos").getPublicUrl(name);
      const url = pub.publicUrl;
      await sb.from("users").update({ avatar_url:url }).eq("phone",phone);
      setUserAvatar(url);
      const saved = JSON.parse(localStorage.getItem("kaziapa_user")||"{}");
      localStorage.setItem("kaziapa_user", JSON.stringify({ ...saved, avatar:url }));
      showToast("Profile photo updated 📸");
    } catch(e) {
      showToast("Upload failed — try again","error");
    } finally {
      setAvatarUploading(false);
    }
  }

  const publicKioskPhone = (()=>{ try { return new URLSearchParams(window.location.search).get("kiosk"); } catch(e) { return null; } })();
  if (publicKioskPhone) return <PublicKiosk sb={sb} phone={publicKioskPhone} onClose={()=>{ try { window.history.replaceState({},"",window.location.pathname); } catch(e){} window.location.reload(); }} />;

  if(authStep==="_splash") return (
    <SplashScreen onDone={()=>setAuthStep("_onboard")} />
  );

  if(authStep==="_onboard") return (
    <OnboardingScreen onDone={()=>setAuthStep("phone")} />
  );

  if(authStep==="phone") return (
    <div style={{ fontFamily:"'Segoe UI',system-ui,sans-serif",background:T.primary,minHeight:"100vh",maxWidth:430,margin:"0 auto",display:"flex",flexDirection:"column",justifyContent:"space-between",padding:32 }}>
      {showPrivacy && <PrivacyModal setShowPrivacy={setShowPrivacy} />}
      {showTerms && <TermsModal setShowTerms={setShowTerms} />}
      <div style={{ marginTop:40 }}>
        <div style={{ fontSize:42,marginBottom:4 }}>🤝</div>
        <div style={{ fontSize:34,fontWeight:900,color:T.accent,letterSpacing:-1 }}>KaziApa</div>
        <div style={{ fontSize:15,color:"rgba(255,255,255,0.7)",marginTop:6 }}>The solution you're looking for is closer than you think.</div>
        <div style={{ marginTop:36,display:"flex",flexDirection:"column",gap:12 }}>
          {[["✓","Verified sellers — not random strangers."],["📍","Your town's market — fast, local, trusted."],["🤝","One account — buy, sell, find a house, offer services."],["💬","Chat safely — phone numbers stay private until you agree to share."]]
            .map(([ic,tx])=>(
              <div key={tx} style={{ display:"flex",gap:12,alignItems:"flex-start" }}>
                <span style={{ fontSize:20 }}>{ic}</span>
                <span style={{ color:"rgba(255,255,255,0.75)",fontSize:13,lineHeight:1.5 }}>{tx}</span>
              </div>
            ))}
        </div>
      </div>
      <div>
        <div style={{ display:"flex",gap:8,marginBottom:20 }}>
          {["en","sw"].map(l=>(
            <div key={l} onClick={()=>setLang(l)} style={{ flex:1,textAlign:"center",padding:"10px 0",borderRadius:10,background:lang===l?T.accent:"rgba(255,255,255,0.1)",color:lang===l?T.primary:"#fff",fontWeight:700,fontSize:14,cursor:"pointer" }}>
              {l==="en"?"English":"Kiswahili"}
            </div>
          ))}
        </div>
        <label style={{ fontSize:12,fontWeight:700,color:"rgba(255,255,255,0.7)",display:"block",marginBottom:8 }}>Your phone number</label>
        <input value={phone} onChange={e=>setPhone(e.target.value)} placeholder="07XXXXXXXX" maxLength={10} type="tel"
          style={{ width:"100%",padding:"14px 16px",borderRadius:12,border:"2px solid rgba(255,255,255,0.2)",background:"rgba(255,255,255,0.08)",color:"#fff",fontSize:18,fontWeight:700,boxSizing:"border-box",outline:"none",marginBottom:14 }} />
        <div style={{ display:"flex",alignItems:"flex-start",gap:10,marginBottom:18 }}>
          <div onClick={()=>setAgreedPrivacy(!agreedPrivacy)}
            style={{ width:22,height:22,borderRadius:6,border:`2px solid ${agreedPrivacy?T.accent:"rgba(255,255,255,0.3)"}`,background:agreedPrivacy?T.accent:"transparent",display:"flex",alignItems:"center",justifyContent:"center",cursor:"pointer",flexShrink:0,marginTop:1 }}>
            {agreedPrivacy && <span style={{ color:T.primary,fontSize:14,fontWeight:900 }}>✓</span>}
          </div>
          <div style={{ fontSize:12,color:"rgba(255,255,255,0.7)",lineHeight:1.5 }}>
            I agree to the <span onClick={()=>setShowPrivacy(true)} style={{ color:T.accent,fontWeight:700,cursor:"pointer",textDecoration:"underline" }}>Privacy Policy</span> and <span onClick={()=>setShowTerms(true)} style={{ color:T.accent,fontWeight:700,cursor:"pointer",textDecoration:"underline" }}>Terms & Conditions</span> of KaziApa.
          </div>
        </div>
        <button disabled={otpLoading} onClick={async()=>{
          if(otpLoading) return;
          if(phone.length>=10&&agreedPrivacy) {
            setOtpLoading(true); setOtpError("");
            try {
              const res = await fetch("/api/send-otp", { method:"POST", headers:{ "Content-Type":"application/json" }, body:JSON.stringify({ phone }) });
              const data = await res.json();
              if(data.success) {
                setAuthStep("otp"); setOtp(["","","","","",""]); setResendLeft(30);
                if(data.smsDelivered) setOtpError("");
                else setOtpError(`📱 SMS temporarily unavailable. Your code is: ${data.fallbackOtp}`);
              }
              else setOtpError(data.atMessage || data.error || "Failed to send OTP");
            } catch(e) { setOtpError("Network error: "+e.message); }
            setOtpLoading(false);
          } else if(!agreedPrivacy) showToast("Please agree to privacy policy first.","error");
        }}
          style={{ width:"100%",padding:16,background:T.accent,color:T.primary,border:"none",borderRadius:14,fontSize:16,fontWeight:800,cursor:"pointer",opacity:phone.length>=10&&agreedPrivacy?1:0.6 }}>
          {otpLoading ? "Sending..." : "Get Verification Code →"}
        </button>
        {otpError && <div style={{ background:"rgba(232,64,64,0.15)",border:"1px solid #E84040",borderRadius:10,padding:"10px 12px",marginTop:12,fontSize:11,color:"#FFD0D0",wordBreak:"break-word" }}>{otpError}</div>}
      </div>
    </div>
  );

  if(authStep==="otp") return (
    <div style={{ fontFamily:"'Segoe UI',system-ui,sans-serif",background:T.primary,minHeight:"100vh",maxWidth:430,margin:"0 auto",padding:32,display:"flex",flexDirection:"column" }}>
      <div onClick={()=>setAuthStep("phone")} style={{ color:"rgba(255,255,255,0.6)",fontSize:22,cursor:"pointer",marginBottom:32 }}>←</div>
      <div style={{ fontSize:32 }}>🤝</div>
      <div style={{ fontSize:24,fontWeight:900,color:T.accent,marginTop:8 }}>KaziApa</div>
      <div style={{ fontSize:16,color:"#fff",fontWeight:700,marginTop:24 }}>Enter verification code</div>
      <div style={{ fontSize:13,color:"rgba(255,255,255,0.6)",marginTop:6 }}>Sent to {phone}</div>
      <div style={{ display:"flex",gap:10,marginTop:32,justifyContent:"center" }}>
        {otp.map((v,i)=>(
          <input key={i} id={`otp${i}`} value={v} maxLength={6} type="tel" inputMode="numeric" autoComplete={i===0?"one-time-code":"off"} autoFocus={i===0}
            onFocus={e=>e.target.select()}
            onChange={e=>{
              const digits = e.target.value.replace(/\D/g,"");
              const n=[...otp];
              if(digits.length===0) { n[i]=""; setOtp(n); if(v && i>0) document.getElementById(`otp${i-1}`)?.focus(); return; }
              if(digits.length>2 || (digits.length===2 && !v)) {
                digits.slice(0,6-i).split("").forEach((d,k)=>{ n[i+k]=d; });
                setOtp(n);
                document.getElementById(`otp${Math.min(i+digits.length,5)}`)?.focus();
                return;
              }
              n[i]=digits.slice(-1); setOtp(n);
              if(i<5) document.getElementById(`otp${i+1}`)?.focus();
            }}
            onKeyDown={e=>{ if(e.key==="Backspace" && !otp[i] && i>0) { e.preventDefault(); const n=[...otp]; n[i-1]=""; setOtp(n); document.getElementById(`otp${i-1}`)?.focus(); } }}
            style={{ width:46,height:56,textAlign:"center",fontSize:22,fontWeight:800,borderRadius:12,border:`2px solid ${v?T.accent:"rgba(255,255,255,0.2)"}`,background:"rgba(255,255,255,0.08)",color:"#fff",outline:"none" }} />
        ))}
      </div>
      {otpError && <div style={{ background:otpError.includes("code is")?"rgba(30,155,90,0.15)":"rgba(232,64,64,0.15)", border:`1px solid ${otpError.includes("code is")?"#1E9B5A":"#E84040"}`, borderRadius:10, padding:"12px 14px", textAlign:"center", marginTop:16, fontSize:14, fontWeight:otpError.includes("code is")?700:400, color:otpError.includes("code is")?"#fff":"#FFD0D0" }}>{otpError}</div>}
      <button onClick={async()=>{
        if(otpLoading) return;
        const code = otp.join("");
        if(code.length < 6) { setOtpError("Enter all 6 digits"); return; }
        setOtpLoading(true); setOtpError("");
        try {
          const res = await fetch("/api/verify-otp", { method:"POST", headers:{ "Content-Type":"application/json" }, body:JSON.stringify({ phone, otp:code }) });
          const data = await res.json();
          if(data.success) {
            try { if(data.token) localStorage.setItem("kaziapa_token", JSON.stringify({ token:data.token, exp:data.tokenExpiresAt })); } catch(e) {}
            // Returning user (new phone, reinstall, cleared data): restore their account instead of asking name/town again
            try {
              const { data:ex } = await sb.from("users").select("name,town,avatar_url").eq("phone",phone).single();
              if(ex?.name && ex?.town) {
                setUserName(ex.name); setUserTown(ex.town); if(ex.avatar_url) setUserAvatar(ex.avatar_url);
                localStorage.setItem("kaziapa_user", JSON.stringify({ phone, name:ex.name, town:ex.town, avatar:ex.avatar_url||"" }));
                setAuthStep("app"); setActiveNav("home"); showToast(`Welcome back ${ex.name}! 🤝`);
              } else { setAuthStep("profile"); }
            } catch(e2) { setAuthStep("profile"); }
          }
          else { setOtpError(data.error || "Wrong code. Try again."); setOtp(["","","","","",""]); }
        } catch(e) { setOtpError("Network error. Try again."); }
        setOtpLoading(false);
      }} style={{ width:"100%",padding:16,background:T.accent,color:T.primary,border:"none",borderRadius:14,fontSize:16,fontWeight:800,cursor:"pointer",marginTop:32,opacity:otpLoading?0.7:1 }}>
        {otpLoading ? "Verifying..." : "Verify →"}
      </button>
      <div onClick={async()=>{
        if(resendBusy || resendLeft>0) return;
        setResendBusy(true); setOtpError("");
        try {
          const res = await fetch("/api/send-otp", { method:"POST", headers:{ "Content-Type":"application/json" }, body:JSON.stringify({ phone }) });
          const data = await res.json();
          if(data.success) {
            setResendLeft(30); setOtp(["","","","","",""]);
            if(data.smsDelivered) showToast("New code sent! Use the newest code.");
            else setOtpError(`📱 SMS temporarily unavailable. Your code is: ${data.fallbackOtp}`);
          }
          else setOtpError(data.atMessage || data.error || "Couldn't send a new code. Wait a minute and try again.");
        } catch(e) { setOtpError("Network error. Check your connection and try again."); }
        setResendBusy(false);
      }} style={{ textAlign:"center",marginTop:20,color:T.accent,fontSize:13,fontWeight:600,cursor:(resendBusy||resendLeft>0)?"default":"pointer",opacity:(resendBusy||resendLeft>0)?0.6:1 }}>{resendBusy ? "Sending..." : resendLeft>0 ? `Resend code in ${resendLeft}s` : "Resend code"}</div>
      <div style={{ textAlign:"center",marginTop:8,fontSize:11,color:"rgba(255,255,255,0.5)" }}>SMS can take up to a minute. If you request another code, use the newest one.</div>
    </div>
  );

  if(authStep==="profile") return (
    <div style={{ fontFamily:"'Segoe UI',system-ui,sans-serif",background:T.primary,minHeight:"100vh",maxWidth:430,margin:"0 auto",padding:32,display:"flex",flexDirection:"column" }}>
      <div style={{ fontSize:32,marginBottom:4 }}>🤝</div>
      <div style={{ fontSize:24,fontWeight:900,color:T.accent }}>KaziApa</div>
      <div style={{ fontSize:18,color:"#fff",fontWeight:700,marginTop:20,marginBottom:4 }}>Welcome! One last step.</div>
      <div style={{ fontSize:13,color:"rgba(255,255,255,0.6)",marginBottom:32 }}>You can buy, sell, find a house, and offer services — all with one account.</div>
      <div style={{ marginBottom:18 }}>
        <label style={{ fontSize:12,fontWeight:700,color:"rgba(255,255,255,0.7)",display:"block",marginBottom:8 }}>Your name</label>
        <input value={userName} onChange={e=>setUserName(e.target.value)} placeholder="e.g. John Kamau"
          style={{ width:"100%",padding:"14px 16px",borderRadius:12,border:"2px solid rgba(255,255,255,0.2)",background:"rgba(255,255,255,0.08)",color:"#fff",fontSize:16,fontWeight:600,boxSizing:"border-box",outline:"none" }} />
      </div>
      <div style={{ marginBottom:24 }}>
        <label style={{ fontSize:12,fontWeight:700,color:"rgba(255,255,255,0.7)",display:"block",marginBottom:8 }}>Your town or area</label>
        <input value={userTown} onChange={e=>setUserTown(e.target.value)} placeholder="e.g. Butula, Nakuru CBD, Kondele..."
          style={{ width:"100%",padding:"14px 16px",borderRadius:12,border:"2px solid rgba(255,255,255,0.2)",background:"rgba(255,255,255,0.08)",color:"#fff",fontSize:16,fontWeight:600,boxSizing:"border-box",outline:"none" }} />
        <div style={{ fontSize:11,color:"rgba(255,255,255,0.5)",marginTop:6 }}>Any town, market or estate in Kenya</div>
      </div>

      {/* WhatsApp notifications - automatic now, no opt-in needed */}
      <div style={{ background:"rgba(255,255,255,0.08)",borderRadius:14,padding:16,marginBottom:24,border:"1px solid rgba(255,255,255,0.15)" }}>
        <div style={{ display:"flex",alignItems:"center",gap:10 }}>
          <span style={{ fontSize:24 }}>💚</span>
          <div>
            <div style={{ color:"#fff",fontWeight:700,fontSize:14 }}>WhatsApp notifications</div>
            <div style={{ color:"rgba(255,255,255,0.6)",fontSize:11,marginTop:2 }}>You'll automatically get a WhatsApp message whenever someone messages you on KaziApa.</div>
          </div>
        </div>
      </div>

      <button onClick={saveUser} style={{ width:"100%",padding:16,background:T.accent,color:T.primary,border:"none",borderRadius:14,fontSize:16,fontWeight:800,cursor:"pointer",opacity:userName.trim()&&userTown.trim()?1:0.6 }}>
        Start Using KaziApa →
      </button>
    </div>
  );

  // ── MAIN APP ──────────────────────────────────────────────────────────────
  const filtered = listings.filter(l=>{
    const mS = search?l.title?.toLowerCase().includes(search.toLowerCase())||l.town?.toLowerCase().includes(search.toLowerCase()):true;
    return mS;
  });

  return (
    <div style={{ fontFamily:"'Segoe UI',system-ui,sans-serif",background:T.surface,minHeight:"100vh",maxWidth:430,margin:"0 auto",position:"relative",paddingBottom:72 }}>

      {confirmDlg && <ConfirmDialog {...confirmDlg} onCancel={()=>setConfirmDlg(null)} />}
      <DialogHost />
      {showStatusComposer && <StatusComposer phone={phone} name={userName} town={userTown} avatar={userAvatar} showToast={showToast}
        onClose={()=>setShowStatusComposer(false)} onPosted={()=>{ setShowStatusComposer(false); loadStatuses(); }} />}
      {statusOpen && statusGroups.find(g=>g.seller_phone===statusOpen) && (
        <StatusViewer group={statusGroups.find(g=>g.seller_phone===statusOpen)} phone={phone}
          onClose={()=>setStatusOpen(null)} onSeen={markSeen}
          onReply={(it,text)=>{ setStatusOpen(null); setChatDraft(text); setActiveThread({ listing_id:`status-${it.id}`, listing_title:`Status: ${(it.caption||"Photo").slice(0,40)}`, buyer_phone:phone, buyer_name:userName, seller_phone:it.seller_phone, seller_name:it.seller_name }); nav("thread","profile"); }}
          onChat={(it)=>{ setStatusOpen(null); setActiveThread({ listing_id:`status-${it.id}`, listing_title:`Status: ${(it.caption||"Photo").slice(0,40)}`, buyer_phone:phone, buyer_name:userName, seller_phone:it.seller_phone, seller_name:it.seller_name }); nav("thread","profile"); }}
          onDelete={async(it)=>{ await sb.from("statuses").delete().eq("id",it.id).eq("seller_phone",phone); setStatusOpen(null); showToast("Status deleted"); loadStatuses(); }}
          onReport={async(it)=>{
            try {
              const { data:cur } = await sb.from("statuses").select("reports").eq("id",it.id).single();
              await sb.from("statuses").update({ reports:((cur?.reports)||0)+1 }).eq("id",it.id);
            } catch(e) {}
            try { localStorage.setItem("kaziapa_hidden_status", JSON.stringify([...hiddenStatus(), it.id].slice(-300))); } catch(e) {}
            setStatusOpen(null); showToast("Reported. Thank you — we'll review it."); loadStatuses();
          }} />
      )}
      {(ptrPull>0 || ptrRefreshing) && (
        <div style={{ position:"fixed",top:0,left:0,right:0,zIndex:9999,display:"flex",justifyContent:"center",pointerEvents:"none" }}>
          <style>{"@keyframes kzspin{to{transform:rotate(360deg)}}"}</style>
          <div style={{ marginTop:ptrRefreshing?56:Math.max(ptrPull-10,0)+8,width:38,height:38,borderRadius:"50%",background:"#fff",boxShadow:"0 2px 10px rgba(0,0,0,0.25)",display:"flex",alignItems:"center",justifyContent:"center",color:T.primary,fontSize:22,fontWeight:800,transform:ptrRefreshing?undefined:`rotate(${ptrPull*4}deg)`,animation:ptrRefreshing?"kzspin 0.8s linear infinite":"none" }}>↻</div>
        </div>
      )}
      {showPrivacy && <PrivacyModal setShowPrivacy={setShowPrivacy} />}
      {showTerms && <TermsModal setShowTerms={setShowTerms} />}
      {showNotifs && (
        <NotificationsPanel
          notifications={notifications}
          onClose={()=>setShowNotifs(false)}
          onClear={async()=>{ await sb.from("notifications").delete().eq("recipient_phone",phone); setNotifications([]); }}
          onOpen={(dest)=>{ setShowNotifs(false); setActiveThread(null); nav(dest,"profile"); }}
        />
      )}
      {screen==="guidelines" && <GuidelinesScreen onBack={()=>nav("profile","profile")} />}
      {screen==="admin" && ADMIN_PHONES.includes(phone) && <AdminPanel sb={sb} onBack={()=>nav("profile","profile")} showToast={showToast} />}
      {screen==="orders" && <OrdersScreen sb={sb} phone={phone} onBack={()=>nav("profile","profile")} />}

      {toast && (
        <div style={{ position:"fixed",top:16,left:"50%",transform:"translateX(-50%)",zIndex:300,background:toast.type==="success"?T.success:T.coral,color:"#fff",borderRadius:10,padding:"10px 20px",fontSize:13,fontWeight:600,boxShadow:"0 4px 16px rgba(0,0,0,0.18)",whiteSpace:"nowrap" }}>
          {toast.msg}
        </div>
      )}

      {showUpgrade && (
        <div style={{ position:"fixed",inset:0,background:T.overlay,zIndex:150,display:"flex",alignItems:"flex-end",justifyContent:"center" }} onClick={()=>{ if(!upgrading) setShowUpgrade(false); }}>
          <div style={{ background:T.card,borderRadius:"22px 22px 0 0",padding:"28px 20px 36px",width:"100%",maxWidth:430 }} onClick={e=>e.stopPropagation()}>
            <div style={{ textAlign:"center",marginBottom:22 }}><div style={{ fontSize:40,color:T.accentDark }}><Icon n="zap" s={40} /></div><div style={{ fontSize:18,fontWeight:800,color:T.text,marginTop:8 }}>Unlock More on KaziApa</div><div style={{ fontSize:13,color:T.textMuted,marginTop:4 }}>Free plan: 10 new conversations/day.</div></div>
            {upgrading && (
              <div style={{ textAlign:"center",padding:"20px 0",fontSize:13,color:T.textMuted,fontWeight:600 }}><Icon n="phone" /> Check your phone for the M-Pesa prompt...</div>
            )}
            {!upgrading && (
              <>
                {[{ plan:"daily",tier:"daily",type:"chat_pass",label:"Daily Pass",price:"Ksh 20 / day",perks:["Unlimited messages"],color:T.primaryLight },
                  { plan:"weekly",tier:"week",type:"chat_pass",label:"Weekly Plan",price:"Ksh 50 / week",perks:["Unlimited messages","1 free boost"],color:T.primary },
                  { plan:"monthly",tier:"month",type:"chat_pass",label:"Monthly Plan",price:"Ksh 250 / month",perks:["Unlimited messages","Best value — save vs weekly"],color:T.primaryMid }
                ].map(p=>(
                  <div key={p.plan} onClick={()=>startUpgradePurchase(p.type,p.tier,p.label)}
                    style={{ background:p.color,borderRadius:14,padding:"14px 18px",marginBottom:12,cursor:"pointer",display:"flex",justifyContent:"space-between",alignItems:"center" }}>
                    <div><div style={{ color:"#fff",fontWeight:700,fontSize:15 }}>{p.label}</div>{p.perks.map(pk=><div key={pk} style={{ color:"rgba(255,255,255,0.75)",fontSize:12 }}><Icon n="check" s={12} /> {pk}</div>)}</div>
                    <div style={{ color:T.accent,fontWeight:800,fontSize:16 }}>{p.price}</div>
                  </div>
                ))}
                <div style={{ background:T.accentSoft,borderRadius:14,padding:"14px 18px",marginBottom:16,border:`1px solid ${T.accent}`,cursor:"pointer" }} onClick={()=>startUpgradePurchase("verified_badge","individual","Verified Badge")}>
                  <div style={{ fontWeight:700,color:T.text,fontSize:14 }}><Icon n="check" s={15} /> Get Verified Seller Badge</div>
                  <div style={{ fontSize:12,color:T.textMuted,marginTop:2 }}>Show ✓ on all your listings. Build buyer trust.</div>
                  <div style={{ color:T.accentDark,fontWeight:800,marginTop:6 }}>Ksh 500 / year</div>
                </div>
                <button onClick={()=>setShowUpgrade(false)} style={{ width:"100%",padding:13,borderRadius:12,border:`1px solid ${T.border}`,background:T.card,color:T.textMuted,fontSize:14,cursor:"pointer" }}>Maybe Later</button>
              </>
            )}
          </div>
        </div>
      )}

      {showExitConfirm && (
        <div style={{ position:"fixed",inset:0,background:T.overlay,zIndex:200,display:"flex",alignItems:"center",justifyContent:"center",padding:24 }}>
          <div style={{ background:T.card,borderRadius:18,padding:24,width:"100%",maxWidth:320,textAlign:"center" }}>
            <div style={{ fontSize:34,marginBottom:8 }}>👋</div>
            <div style={{ fontWeight:800,fontSize:16,color:T.text,marginBottom:6 }}>Exit KaziApa?</div>
            <div style={{ fontSize:13,color:T.textMuted,marginBottom:20 }}>You'll need to reopen the app to continue browsing.</div>
            <div style={{ display:"flex",gap:10 }}>
              <button onClick={()=>setShowExitConfirm(false)} style={{ flex:1,padding:12,borderRadius:11,border:`1px solid ${T.border}`,background:"transparent",color:T.text,fontWeight:700,fontSize:14,cursor:"pointer" }}>Cancel</button>
              <button onClick={()=>{ exitingRef.current=true; setShowExitConfirm(false); window.history.back(); }} style={{ flex:1,padding:12,borderRadius:11,border:"none",background:T.coral,color:"#fff",fontWeight:700,fontSize:14,cursor:"pointer" }}>Exit</button>
            </div>
          </div>
        </div>
      )}

      {showLogoutConfirm && (
        <div style={{ position:"fixed",inset:0,background:T.overlay,zIndex:200,display:"flex",alignItems:"center",justifyContent:"center",padding:24 }}>
          <div style={{ background:T.card,borderRadius:18,padding:24,width:"100%",maxWidth:320,textAlign:"center" }}>
            <div style={{ fontSize:34,marginBottom:8 }}>🚪</div>
            <div style={{ fontWeight:800,fontSize:16,color:T.text,marginBottom:6 }}>Log out of KaziApa?</div>
            <div style={{ fontSize:13,color:T.textMuted,marginBottom:20 }}>You'll need to enter your phone number and OTP again to log back in.</div>
            <div style={{ display:"flex",gap:10 }}>
              <button onClick={()=>setShowLogoutConfirm(false)} style={{ flex:1,padding:12,borderRadius:11,border:`1px solid ${T.border}`,background:"transparent",color:T.text,fontWeight:700,fontSize:14,cursor:"pointer" }}>Cancel</button>
              <button onClick={()=>{ setShowLogoutConfirm(false); localStorage.removeItem("kaziapa_user"); localStorage.removeItem("kaziapa_token"); sessionStorage.removeItem("kaziapa_screen"); sessionStorage.removeItem("kaziapa_nav"); navHistoryRef.current=[]; setAuthStep("phone"); setUserName(""); setPhone(""); setOtp(["","","","","",""]); }} style={{ flex:1,padding:12,borderRadius:11,border:"none",background:T.coral,color:"#fff",fontWeight:700,fontSize:14,cursor:"pointer" }}>Log Out</button>
            </div>
          </div>
        </div>
      )}

      {/* HOME */}
      {screen==="home" && (
        <div>
          <div style={{ background:T.primary,padding:"20px 16px 18px",borderRadius:"0 0 22px 22px" }}>
            <div style={{ display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:14 }}>
              <div>
                <div style={{ display:"flex",alignItems:"center",gap:8 }}>
                  <span style={{ fontSize:22 }}>🤝</span>
                  <span style={{ color:T.accent,fontSize:21,fontWeight:900,letterSpacing:-0.5 }}>KaziApa</span>
                </div>
              </div>
              <div style={{ display:"flex",gap:6,flexShrink:0 }}>
                {/* Notifications bell */}
                <div onClick={()=>{ setShowNotifs(true); markNotifsRead(); }} style={{ position:"relative",background:"rgba(255,255,255,0.12)",borderRadius:20,padding:"5px 8px",cursor:"pointer",display:"flex",alignItems:"center" }}>
                  <span aria-label="Notifications" style={{ color:"#fff",display:"flex" }}><Icon n="bell" s={18} /></span>
                  {notifications.filter(n=>!n.read).length > 0 && (
                    <div style={{ position:"absolute",top:-4,right:-4,background:T.coral,color:"#fff",borderRadius:"50%",width:18,height:18,fontSize:10,fontWeight:800,display:"flex",alignItems:"center",justifyContent:"center" }}>
                      {notifications.filter(n=>!n.read).length > 9 ? "9+" : notifications.filter(n=>!n.read).length}
                    </div>
                  )}
                </div>
                {/* Chat button */}
                <div onClick={()=>nav("chats","profile")} style={{ position:"relative",background:"rgba(255,255,255,0.12)",borderRadius:20,padding:"5px 9px",cursor:"pointer",display:"flex",alignItems:"center",gap:5 }}>
                  <span aria-label="Chats" style={{ color:"#fff",display:"flex" }}><Icon n="chat" s={18} /></span>
                  {unreadCount > 0 && (
                    <div style={{ position:"absolute",top:-4,right:-4,background:T.coral,color:"#fff",borderRadius:"50%",width:18,height:18,fontSize:10,fontWeight:800,display:"flex",alignItems:"center",justifyContent:"center" }}>
                      {unreadCount > 9 ? "9+" : unreadCount}
                    </div>
                  )}
                </div>
                <div onClick={()=>setShowUpgrade(true)} style={{ background:T.accent,borderRadius:20,padding:"5px 10px",fontSize:12,fontWeight:700,color:T.primary,cursor:"pointer",display:"flex",alignItems:"center",gap:4,whiteSpace:"nowrap" }}><Icon n="zap" s={13} /> {tr(lang,"Upgrade")}</div>
                <div onClick={()=>setLang(lang==="en"?"sw":"en")} style={{ background:"rgba(255,255,255,0.12)",borderRadius:20,padding:"5px 9px",fontSize:11,color:"#fff",cursor:"pointer",fontWeight:600 }}>{lang==="en"?"SW":"EN"}</div>
              </div>
            </div>
            <div style={{ color:"rgba(255,255,255,0.75)",fontSize:12,marginTop:-4 }}>{lang==="sw"?"Karibu tena":"Welcome back"}, {userName}!</div>
          </div>
          <div style={{ padding:"14px 16px 4px" }}>
            <div style={{ background:T.card,borderRadius:13,padding:"11px 14px",display:"flex",alignItems:"center",gap:8,border:`1px solid ${T.border}` }}>
              <span style={{ color:T.textMuted,display:"flex" }}><Icon n="search" s={18} /></span>
              <input value={search} onChange={e=>{ setSearch(e.target.value); setNearMeActive(false); setTimeout(loadListings,500); }} placeholder={tr(lang,"Search item or town...")}
                style={{ border:"none",outline:"none",flex:1,fontSize:14,color:T.text,background:"transparent" }} />
              {search && <span onClick={()=>{ setSearch(""); loadListings(); }} style={{ color:T.textMuted,cursor:"pointer",fontSize:20 }}>×</span>}
              <span role="button" aria-label="Near me" onClick={()=>{ nav("browse","browse"); setBrowseTab("listings"); setCatFilter(null); findNearMe(); }} style={{ color:T.primary,cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",width:36,height:36,margin:"-8px -6px -8px 0" }}><Icon n="pin" s={19} /></span>
            </div>
          </div>
          {/* 24-hour statuses */}
          <div style={{ padding:"6px 16px 2px" }}>
            <div style={{ display:"flex",gap:12,overflowX:"auto",paddingBottom:6 }}>
              <div onClick={()=>setShowStatusComposer(true)} style={{ flexShrink:0,width:64,textAlign:"center",cursor:"pointer" }}>
                <div style={{ position:"relative",width:58,height:58,margin:"0 auto" }}>
                  <div style={{ width:58,height:58,borderRadius:"50%",border:`2px dashed ${T.accent}`,padding:2,boxSizing:"border-box" }}>
                    <div style={{ width:"100%",height:"100%",borderRadius:"50%",background:T.surface,display:"flex",alignItems:"center",justifyContent:"center",overflow:"hidden" }}>
                      {userAvatar ? <img src={userAvatar} alt="" style={{ width:"100%",height:"100%",objectFit:"cover" }} /> : <span style={{ fontWeight:800,color:T.primary,fontSize:22 }}>{userName?.[0]?.toUpperCase()}</span>}
                    </div>
                  </div>
                  <span aria-hidden="true" style={{ position:"absolute",left:"50%",bottom:-8,transform:"translateX(-50%)",background:T.accent,color:"#3B2300",border:"2px solid #fff",fontSize:11,fontWeight:800,padding:"0 9px",borderRadius:11,lineHeight:"16px",whiteSpace:"nowrap" }}>Add</span>
                </div>
                <div style={{ fontSize:11,color:T.textMid,marginTop:12,fontWeight:600 }}>Status</div>
              </div>
              {statusGroups.map(g=>{
                const unseen = g.items.some(i=>!seenStatus.includes(i.id));
                const own = g.seller_phone===phone;
                return (
                  <div key={g.seller_phone} onClick={()=>setStatusOpen(g.seller_phone)} style={{ flexShrink:0,width:64,textAlign:"center",cursor:"pointer" }}>
                    <div style={{ width:58,height:58,margin:"0 auto",borderRadius:"50%",padding:2,background:unseen?`linear-gradient(135deg,${T.accent},${T.primary})`:T.border,boxSizing:"border-box" }}>
                      <div style={{ width:"100%",height:"100%",borderRadius:"50%",background:"#fff",padding:2,boxSizing:"border-box" }}>
                        <div style={{ width:"100%",height:"100%",borderRadius:"50%",background:T.accent,display:"flex",alignItems:"center",justifyContent:"center",fontWeight:800,color:"#fff",overflow:"hidden" }}>
                          {g.items[g.items.length-1].image_url
                            ? <img src={g.items[g.items.length-1].image_url} alt="" style={{ width:"100%",height:"100%",objectFit:"cover" }} />
                            : (g.seller_avatar ? <img src={g.seller_avatar} alt="" style={{ width:"100%",height:"100%",objectFit:"cover" }} /> : (g.seller_name||"?")[0]?.toUpperCase())}
                        </div>
                      </div>
                    </div>
                    <div style={{ fontSize:11,color:T.textMid,marginTop:4,fontWeight:unseen?700:500,whiteSpace:"nowrap",overflow:"hidden",textOverflow:"ellipsis" }}>{own ? "Your status" : g.seller_name?.split(" ")[0]}</div>
                  </div>
                );
              })}
            </div>
          </div>
          <div style={{ margin:"14px 16px 4px",background:`linear-gradient(130deg,${T.primary},${T.primaryMid})`,borderRadius:16,padding:"16px 18px",cursor:"pointer" }}
            onClick={()=>{ nav("browse","browse"); setBrowseTab("concierge"); }}>
            <div style={{ color:T.accent,fontSize:10,fontWeight:700,letterSpacing:1.2,marginBottom:5 }}>{tr(lang,"CONCIERGE SERVICE")}</div>
            <div style={{ color:"#fff",fontWeight:800,fontSize:15 }}>{tr(lang,"Can't find what you need?")}</div>
            <div style={{ color:"rgba(255,255,255,0.65)",fontSize:12,marginTop:3 }}>{tr(lang,"Tell us — we'll find it within 3–6 hours. →")}</div>
          </div>
          <div style={{ margin:"10px 16px 4px",background:`linear-gradient(130deg,#0A1628,#1F3A5C)`,borderRadius:16,padding:"16px 18px",cursor:"pointer" }}
            onClick={()=>nav("nitume","browse")}>
            <div style={{ color:T.accent,fontSize:10,fontWeight:700,letterSpacing:1.2,marginBottom:5 }}>NITUME</div>
            <div style={{ color:"#fff",fontWeight:800,fontSize:15 }}>{tr(lang,"Need something sourced or done?")}</div>
            <div style={{ color:"rgba(255,255,255,0.65)",fontSize:12,marginTop:3 }}>{tr(lang,"Shopping, fashion sourcing, event photography & more. →")}</div>
          </div>
          <div role="button" tabIndex={0} className="ka-press" style={{ margin:"10px 16px 4px",background:`linear-gradient(130deg,#12A05F,#0B6E7A)`,borderRadius:18,padding:"16px 18px",cursor:"pointer",display:"flex",alignItems:"center",gap:12 }}
            onClick={()=>nav("market","home")} onKeyDown={e=>{ if(e.key==="Enter") nav("market","home"); }}>
            <div style={{ flex:1,minWidth:0 }}>
              <div style={{ color:"#fff",fontSize:10,fontWeight:700,letterSpacing:1.2,marginBottom:5,opacity:0.9 }}>{tr(lang,"MY MARKET")}</div>
              <div style={{ color:"#fff",fontWeight:800,fontSize:16 }}>{tr(lang,"Find your local market")}</div>
              <div style={{ color:"rgba(255,255,255,0.88)",fontSize:12,marginTop:3 }}>{tr(lang,"Gikomba, Kibuye, and 60+ markets across Kenya")}</div>
            </div>
            <BannerArt name="market" size={64} />
            <span style={{ color:"#fff",display:"flex" }}><Icon n="chevron" s={20} /></span>
          </div>
          <div role="button" tabIndex={0} className="ka-press" style={{ margin:"10px 16px 4px",background:`linear-gradient(130deg,#6B4EFF,#2F6BD8)`,borderRadius:18,padding:"16px 18px",cursor:"pointer",display:"flex",alignItems:"center",gap:12 }}
            onClick={()=>nav("hood","home")} onKeyDown={e=>{ if(e.key==="Enter") nav("hood","home"); }}>
            <div style={{ flex:1,minWidth:0 }}>
              <div style={{ color:"#fff",fontSize:10,fontWeight:700,letterSpacing:1.2,marginBottom:5,opacity:0.9 }}>{tr(lang,"MY HOOD")}</div>
              <div style={{ color:"#fff",fontWeight:800,fontSize:16 }}>{tr(lang,"Find your estate or area")}</div>
              <div style={{ color:"rgba(255,255,255,0.88)",fontSize:12,marginTop:3 }}>{tr(lang,"Notices, jobs & requests just for your hood")}</div>
            </div>
            <BannerArt name="hood" size={64} />
            <span style={{ color:"#fff",display:"flex" }}><Icon n="chevron" s={20} /></span>
          </div>
          <div style={{ padding:"16px 16px 4px" }}>
            <style>{`.ka-press{transition:transform .18s ease,box-shadow .18s ease}.ka-press:active{transform:scale(.975)}.ka-press:focus-visible{outline:3px solid #0066CC;outline-offset:3px}.ka-category-3d{isolation:isolate;transition:transform .22s cubic-bezier(.2,.8,.2,1),box-shadow .22s ease,border-color .22s ease}.ka-category-3d>*{position:relative;z-index:1}.ka-category-3d:before{content:"";position:absolute;inset:0;pointer-events:none;border-radius:inherit;background:linear-gradient(125deg,rgba(255,255,255,.75),transparent 38%,rgba(255,255,255,.12) 70%,transparent);opacity:.85}.ka-category-3d:after{content:"";position:absolute;left:14%;right:14%;bottom:5px;height:10px;border-radius:50%;background:rgba(16,42,72,.09);filter:blur(7px);z-index:0;pointer-events:none}.ka-category-3d:hover{transform:translateY(-4px) rotateX(2deg);box-shadow:0 4px 0 rgba(14,39,70,.035),0 15px 27px rgba(18,47,82,.14),inset 0 1px 0 #fff!important;border-color:rgba(0,102,204,.22)}.ka-category-3d:active{transform:translateY(1px) scale(.98);box-shadow:0 2px 6px rgba(18,47,82,.1)!important}.ka-category-3d img{transition:transform .22s ease,filter .22s ease}.ka-category-3d:hover img{transform:translateY(-2px) scale(1.045);filter:drop-shadow(0 10px 6px rgba(15,35,60,.24)) saturate(1.14)}@media (hover:none){.ka-category-3d:hover{transform:none}.ka-category-3d:active{transform:scale(.975)}}@media (prefers-reduced-motion:reduce){.ka-press,.ka-category-3d,.ka-category-3d img{transition:none}.ka-press:active,.ka-category-3d:hover,.ka-category-3d:active{transform:none}}`}</style>
            <div style={{ display:"flex",alignItems:"flex-end",justifyContent:"space-between",gap:8,marginBottom:12 }}>
              <div>
                <div style={{ fontSize:16,fontWeight:900,color:T.text,letterSpacing:-0.35 }}>{tr(lang,"Explore KaziApa")}</div>
                <div style={{ fontSize:11,color:T.textMuted,marginTop:3 }}>{tr(lang,"Find what you need, closer to home.")}</div>
              </div>
              <span style={{ fontSize:10,fontWeight:800,color:T.primary,background:T.primarySoft,borderRadius:20,padding:"5px 8px",whiteSpace:"nowrap" }}>{tr(lang,"7 categories")}</span>
            </div>
            <div style={{ display:"grid",gridTemplateColumns:"repeat(3,minmax(0,1fr))",gap:10 }}>
              {CATEGORIES.map(cat=>(
                <CatCard key={cat.id} cat={cat} label={lang==="sw"?cat.sw:cat.en} sub={lang==="sw"?cat.subSw:cat.sub} onClick={()=>{
                  if(cat.id==="kazi") { nav("jobs","browse"); }
                  else if(cat.id==="nyumba") { nav("housing","browse"); }
                  else if(cat.id==="fundi") { nav("fundi","browse"); }
                  else if(cat.id==="shamba") { nav("shamba","browse"); }
                  else if(cat.id==="usafiri") { nav("usafiri","browse"); }
                  else { setCatFilter(cat.id); nav("browse","browse"); setBrowseTab("listings"); }
                }} />
              ))}
            </div>
          </div>
          <div style={{ padding:"16px 16px 0" }}>
            <div style={{ display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:12 }}>
              <div style={{ fontSize:13,fontWeight:800,color:T.text }}>{tr(lang,"Latest Listings")}</div>
              <div onClick={()=>{ setCatFilter(null); nav("browse","browse"); }} style={{ fontSize:12,color:T.primaryLight,cursor:"pointer",fontWeight:600 }}>{tr(lang,"See All →")}</div>
            </div>
            {loading && filtered.length===0 ? <ListingSkeleton count={4} />
              : filtered.length===0
                ? (listingsErr
                    ? <StateMessage tone="error" icon="📡" title="Couldn't load listings" text="Check your connection and try again." actionLabel="Retry" onAction={loadListings} />
                    : <StateMessage icon="📦" title={tr(lang,"No listings yet.")} text={tr(lang,"No opportunities posted here yet. Be the first to help your community.")} />)
                : filtered.slice(0,5).map(l=>(
                  <ListingCard key={l.id} listing={l} onClick={()=>{ setActiveListing(l); nav("listing","browse"); }} />
                ))
            }
          </div>
        </div>
      )}

      {/* BROWSE */}
      {screen==="browse" && (
        <div>
          <div style={{ background:T.primary,padding:"16px 16px 0",borderRadius:"0 0 18px 18px" }}>
            <div style={{ display:"flex",alignItems:"center",gap:10,marginBottom:12 }}>
              <div onClick={()=>{ nav("home","home"); setCatFilter(null); }} style={{ color:"#fff",fontSize:22,cursor:"pointer" }}>←</div>
              <div style={{ color:"#fff",fontWeight:800,fontSize:16,flex:1 }}>
                {catFilter?(CATEGORIES.find(c=>c.id===catFilter)?.[lang==="sw"?"sw":"en"]):tr(lang,"All Listings")}
              </div>
            </div>
            <div style={{ display:"flex",gap:6,paddingBottom:14 }}>
              {[["listings",tr(lang,"Listings")],["concierge",tr(lang,"Special Request")]].map(([tab,label])=>(
                <div key={tab} onClick={()=>setBrowseTab(tab)} style={{ background:browseTab===tab?T.accent:"rgba(255,255,255,0.12)",color:browseTab===tab?T.primary:"#fff",borderRadius:20,padding:"5px 16px",fontSize:12,fontWeight:700,cursor:"pointer" }}>{label}</div>
              ))}
            </div>
          </div>
          {browseTab==="listings" && (
            <div style={{ padding:"14px 16px" }}>
              <div style={{ display:"flex",gap:8,marginBottom:8 }}>
                <div style={{ flex:1,background:T.card,borderRadius:11,padding:"9px 12px",display:"flex",alignItems:"center",gap:6,border:`1px solid ${T.border}` }}>
                  <span>🔍</span>
                  <input value={search} onChange={e=>{ setSearch(e.target.value); setNearMeActive(false); setTimeout(loadListings,500); }} placeholder={tr(lang,"Search item or town...")}
                    style={{ border:"none",outline:"none",flex:1,fontSize:13,background:"transparent",color:T.text }} />
                </div>
              </div>
              <div style={{ display:"flex",gap:8,marginBottom:12 }}>
                <input value={town==="All"?"":town} onChange={e=>{ setTown(e.target.value||"All"); setNearMeActive(false); setTimeout(loadListings,500); }} placeholder={tr(lang,"Town...")}
                  style={{ flex:1,padding:"9px 10px",borderRadius:11,border:`1px solid ${T.border}`,fontSize:12,color:T.text,background:T.card }} />
                <div onClick={()=>{ if(nearMeActive){ setNearMeActive(false); setTown("All"); setTimeout(loadListings,50); } else { findNearMe(); } }} style={{ display:"flex",alignItems:"center",gap:5,padding:"9px 12px",borderRadius:11,border:nearMeActive?`1px solid ${T.primary}`:`1px solid ${T.border}`,fontSize:12,fontWeight:700,color:nearMeActive?"#fff":T.primary,background:nearMeActive?T.primary:T.card,cursor:"pointer",whiteSpace:"nowrap" }}>
                  {locatingMe ? tr(lang,"📍 Locating...") : nearMeActive ? tr(lang,"✕ Nearest") : tr(lang,"📍 Near Me")}
                </div>
              </div>
              <div style={{ display:"flex",gap:6,overflowX:"auto",paddingBottom:10,marginBottom:4 }}>
                <div onClick={()=>setCatFilter(null)} style={{ background:!catFilter?T.primary:T.card,color:!catFilter?"#fff":T.textMuted,borderRadius:20,padding:"5px 14px",fontSize:12,fontWeight:600,whiteSpace:"nowrap",cursor:"pointer",border:`1px solid ${T.border}`,flexShrink:0 }}>{tr(lang,"All")}</div>
                {CATEGORIES.map(cat=>(
                  <div key={cat.id} onClick={()=>setCatFilter(catFilter===cat.id?null:cat.id)}
                    style={{ background:catFilter===cat.id?cat.color:T.card,color:catFilter===cat.id?"#fff":T.textMuted,borderRadius:20,padding:"5px 14px",fontSize:12,fontWeight:600,whiteSpace:"nowrap",cursor:"pointer",border:`1px solid ${T.border}`,flexShrink:0 }}>
                    {cat.icon} {lang==="sw"?cat.sw:cat.en}
                  </div>
                ))}
              </div>
              {loading && filtered.length===0 ? <ListingSkeleton count={5} />
                : filtered.length===0
                  ? (listingsErr
                      ? <StateMessage tone="error" icon="📡" title="Couldn't load listings" text="Check your connection and try again." actionLabel="Retry" onAction={loadListings} />
                      : (search || catFilter || town!=="All" || nearMeActive)
                        ? <StateMessage icon="🔍" title="No results found" text="Try a different word, town or category." actionLabel="Clear filters" onAction={()=>{ setSearch(""); setCatFilter(null); setTown("All"); setNearMeActive(false); }} />
                        : <StateMessage icon="🔍" title={tr(lang,"Nothing here yet.")} actionLabel={tr(lang,"Make a Request")} onAction={()=>setBrowseTab("concierge")} />)
                  : filtered.map(l=><ListingCard key={l.id} listing={l} onClick={()=>{ setActiveListing(l); nav("listing","browse"); }} />)
              }
            </div>
          )}
          {browseTab==="concierge" && (
            <div style={{ padding:"20px 16px" }}>
              <div style={{ background:T.accentSoft,borderRadius:14,padding:16,marginBottom:18,border:`1px solid ${T.accent}` }}>
                <div style={{ fontWeight:800,color:T.text,fontSize:15,marginBottom:4 }}>Special Request</div>
                <div style={{ fontSize:13,color:T.textMuted,lineHeight:1.5 }}>Tell us what you need — we'll find it within 3–6 hours.</div>
              </div>
              {conciergeDone
                ? <div style={{ textAlign:"center",padding:"30px 0" }}>
                    <div style={{ fontSize:56 }}>✅</div>
                    <div style={{ fontSize:18,fontWeight:800,color:T.text,marginTop:14 }}>Request Received!</div>
                    <div style={{ fontSize:14,color:T.textMuted,marginTop:8 }}>We'll contact you within 3–6 hours.</div>
                    <button onClick={()=>{ setConciergeDone(false); setConciergeTxt(""); }} style={{ marginTop:22,background:T.primary,color:"#fff",border:"none",borderRadius:12,padding:"12px 28px",fontSize:14,fontWeight:700,cursor:"pointer" }}>Make Another Request</button>
                  </div>
                : <>
                    <Field label="Your Town" value={conciergeTown} onChange={setConciergeTown} placeholder="e.g. Nakuru CBD, Kondele..." />
                    <Field label="What do you need?" value={conciergeTxt} onChange={setConciergeTxt} placeholder="e.g. Newborn socks size 0-3 months, budget Ksh 300..." rows={5} />
                    <Btn onClick={postConcierge}>Send Request →</Btn>
                  </>
              }
            </div>
          )}
        </div>
      )}

      {/* LISTING DETAIL */}
      {screen==="listing" && activeListing && (
        <div>
          <BackHeader title={activeListing.title} onBack={()=>{ if(listingFromChat && activeThread) { nav("thread","profile"); } else { nav("browse","browse"); } }} />
          <div style={{ padding:16 }}>
            {/* Photos */}
            {activeListing.photos?.length>0
              ? <div style={{ display:"flex",gap:8,overflowX:"auto",marginBottom:16 }}>
                  {activeListing.photos.map((url,i)=>(
                    <img key={i} src={url} alt="" style={{ width:i===0?280:160,height:200,objectFit:"cover",borderRadius:14,flexShrink:0 }} />
                  ))}
                </div>
              : <div style={{ background:T.border,borderRadius:18,height:180,display:"flex",alignItems:"center",justifyContent:"center",fontSize:80,marginBottom:16 }}>
                  {CAT_ICON[activeListing.category]||"📦"}
                </div>
            }
            <div style={{ background:T.card,borderRadius:16,padding:16,marginBottom:12,border:`1px solid ${T.border}` }}>
              <div style={{ display:"flex",justifyContent:"space-between",gap:8 }}>
                <div style={{ flex:1 }}>
                  <div style={{ fontSize:18,fontWeight:800,color:T.text }}>{activeListing.title}</div>
                  <div style={{ fontSize:12,color:T.textMuted,marginTop:3 }}>📍 {activeListing.town}</div>
                  <Stars rating={activeListing.rating} />
                </div>
                <div style={{ fontSize:22,fontWeight:900,color:T.primary }}>Ksh {activeListing.price_label||activeListing.price?.toLocaleString()}</div>
              </div>
              {activeListing.description && <div style={{ marginTop:12,fontSize:13,color:T.textMid,lineHeight:1.6 }}>{activeListing.description}</div>}
            </div>
            {activeListing.location && (
              <div style={{ background:T.successSoft,borderRadius:14,padding:14,marginBottom:12,border:`1px solid ${T.success}` }}>
                <div style={{ fontWeight:700,color:T.text,fontSize:13,marginBottom:4 }}>📍 Seller Location</div>
                <div style={{ fontSize:13,color:T.textMid }}>{activeListing.location}</div>
                <div style={{ fontSize:11,color:T.textMuted,marginTop:4 }}>Visit in person to pick & choose, or request delivery.</div>
              </div>
            )}
            <div style={{ background:T.card,borderRadius:16,padding:14,marginBottom:14,border:`1px solid ${T.border}`,display:"flex",alignItems:"center",gap:12 }}>
              <div style={{ width:46,height:46,borderRadius:"50%",background:T.primary,display:"flex",alignItems:"center",justifyContent:"center",color:"#fff",fontWeight:800,fontSize:20 }}>{activeListing.seller_name?.[0]}</div>
              <div style={{ flex:1 }}>
                <div style={{ fontWeight:700,color:T.text,fontSize:14 }}>{activeListing.seller_name}</div>
                <SellerPresence phone={activeListing.seller_phone} />
                {activeListing.verified && <div style={{ fontSize:11,color:T.success,fontWeight:600 }}>✓ Verified Seller</div>}
              </div>
              <button onClick={()=>{ nav("chat","browse"); }}
                style={{ background:T.surface,border:`1px solid ${T.border}`,borderRadius:10,padding:"8px 14px",fontSize:13,fontWeight:700,color:T.primary,cursor:"pointer" }}>
                💬 Chat
              </button>
            </div>
            <div style={{ background:T.primarySoft,borderRadius:13,padding:13,marginBottom:16,fontSize:12,color:T.primary,lineHeight:1.5 }}>
              💡 Chat with the seller first to confirm details, then pay directly. Only deal with verified sellers and report any issue to us.
            </div>
            {/* Show Buy Now only if listing is available and user is not the seller */}
            {activeListing.seller_phone !== phone && !activeListing.sold && (
              <Btn onClick={()=>{ setCheckStep(1); nav("checkout","browse"); }}>
                Buy Now — {Number(activeListing.price) > 0 ? `Ksh ${Number(activeListing.price).toLocaleString()}` : "agree the price"}
              </Btn>
            )}
            {activeListing.sold && (
              <div style={{ background:T.coralSoft,borderRadius:13,padding:14,textAlign:"center",fontWeight:800,color:T.coral,fontSize:15,marginBottom:10 }}>
                ✅ This item has been sold
              </div>
            )}
            {/* Seller controls */}
            {activeListing.seller_phone === phone && (
              <div style={{ display:"flex",gap:8,marginBottom:10,flexWrap:"wrap" }}>
                {!activeListing.sold && (
                  <button onClick={async()=>{
                    await sb.from("listings").update({ sold:true }).eq("id",activeListing.id);
                    setActiveListing({ ...activeListing, sold:true });
                    showToast("Marked as sold! ✅");
                  }} style={{ flex:1,padding:12,background:T.success,color:"#fff",border:"none",borderRadius:12,fontSize:13,fontWeight:700,cursor:"pointer",minWidth:100 }}>
                    ✅ Mark as Sold
                  </button>
                )}
                {!activeListing.featured && !showBoostOptions && (
                  <button onClick={async()=>{
                    const { data } = await sb.from("users").select("free_boosts_remaining").eq("phone",phone).single();
                    setFreeBoosts(data?.free_boosts_remaining||0);
                    setShowBoostOptions(true);
                  }} style={{ flex:1,padding:12,background:T.accent,color:T.primary,border:"none",borderRadius:12,fontSize:13,fontWeight:700,cursor:"pointer",minWidth:100 }}>
                    <Icon n="boost" /> Boost Listing
                  </button>
                )}
                {!activeListing.featured && showBoostOptions && (
                  <div style={{ flex:"1 1 100%",background:T.accentSoft,borderRadius:12,padding:12,border:`1px solid ${T.accent}` }}>
                    <div style={{ fontWeight:700,color:T.text,fontSize:13,marginBottom:10 }}>
                      {boosting ? <><Icon n="phone" /> Check your phone for the M-Pesa prompt...</> : "Choose boost duration"}
                    </div>
                    {!boosting && (
                      <>
                        {freeBoosts>0 && (
                          <button onClick={useFreeBoost} style={{ width:"100%",padding:"10px 6px",marginBottom:8,background:T.success,color:"#fff",border:"none",borderRadius:10,fontSize:13,fontWeight:800,cursor:"pointer" }}>
                            <Icon n="gift" /> Use Free Boost ({freeBoosts} left) — 7 days
                          </button>
                        )}
                        <div style={{ display:"grid",gridTemplateColumns:"1fr 1fr",gap:8,marginBottom:10 }}>
                          {[["24h","24 Hours",30],["3d","3 Days",80],["7d","7 Days",150],["30d","30 Days",400]].map(([tier,label,amt])=>(
                            <button key={tier} onClick={()=>boostListing(tier)}
                              style={{ padding:"10px 6px",background:T.card,border:`1px solid ${T.border}`,borderRadius:10,fontSize:12,fontWeight:700,color:T.text,cursor:"pointer" }}>
                              {label}<br/><span style={{ color:T.primary }}>Ksh {amt}</span>
                            </button>
                          ))}
                        </div>
                        <button onClick={()=>setShowBoostOptions(false)} style={{ width:"100%",padding:8,background:"transparent",border:"none",fontSize:12,color:T.textMuted,cursor:"pointer" }}>Cancel</button>
                      </>
                    )}
                  </div>
                )}
                {activeListing.featured && (
                  <div style={{ flex:1,padding:12,background:T.accentSoft,color:T.accentDark,borderRadius:12,fontSize:13,fontWeight:700,textAlign:"center",minWidth:100 }}>
                    <Icon n="boost" /> Boosted
                  </div>
                )}
                <button onClick={async()=>{
                  if(await askConfirm("Delete this listing?")) {
                    const { error } = await sb.from("listings").delete().eq("id",activeListing.id);
                    if(error) { showToast("Couldn't delete: " + error.message,"error"); return; }
                    showToast("Listing deleted.");
                    await loadListings();
                    nav("browse","browse");
                  }
                }} style={{ flex:1,padding:12,background:T.coral,color:"#fff",border:"none",borderRadius:12,fontSize:13,fontWeight:700,cursor:"pointer",minWidth:100 }}>
                  🗑️ Delete
                </button>
              </div>
            )}
            {/* Report and Block buttons for non-sellers */}
            {activeListing.seller_phone !== phone && (
              <div style={{ display:"flex",gap:8,marginTop:6 }}>
                {reportState(activeListing)==="dismissed" ? (
                  <div style={{ flex:1,padding:11,background:"#E7F6EC",color:"#145A36",border:"1px solid #BFE5CC",borderRadius:12,fontSize:12,fontWeight:700,textAlign:"center" }}>
                    ✅ Reviewed · No violation found
                  </div>
                ) : reportState(activeListing)==="pending" ? (
                  <div style={{ flex:1,padding:11,background:"#FFF6E5",color:"#B7791F",border:"1px solid #F3D9A4",borderRadius:12,fontSize:12,fontWeight:700,textAlign:"center" }}>
                    ⏳ Reported · Under review
                  </div>
                ) : (
                <button onClick={()=>{
                  setConfirmDlg({ title:"Report this listing?", text:"Our team will review it. Only report listings that are fake, a scam, or break the rules.", okLabel:"Report", onOk: async()=>{
                    setConfirmDlg(null);
                    const id = String(activeListing.id);
                    const { error } = await sb.from("listing_reports").insert({ listing_id:id, reporter_phone:phone });
                    if(error && error.code==="23505") { markReported(id, activeListing.title); showToast("You already reported this listing. We're reviewing it."); return; }
                    // Count it for the admin Reports tab (also used if the listing_reports table isn't created yet)
                    const { data:cur } = await sb.from("listings").select("reports").eq("id",activeListing.id).single();
                    await sb.from("listings").update({ reports:((cur?.reports)||0)+1 }).eq("id",activeListing.id);
                    markReported(id, activeListing.title);
                    showToast("Reported. Our team will review this listing. Thank you.");
                  } });
                }} style={{ flex:1,padding:11,background:"transparent",color:T.textMuted,border:`1px solid ${T.border}`,borderRadius:12,fontSize:12,fontWeight:600,cursor:"pointer" }}>
                  🚩 Report Listing
                </button>
                )}
                <button onClick={()=>blockUser(activeListing.seller_phone, activeListing.seller_name)}
                  style={{ flex:1,padding:11,background:"transparent",color:T.coral,border:`1px solid ${T.coral}`,borderRadius:12,fontSize:12,fontWeight:600,cursor:"pointer" }}>
                  🚫 Block Seller
                </button>
              </div>
            )}
            {activeListing.seller_phone !== phone && reportState(activeListing)==="pending" && (
              <div style={{ fontSize:11,color:T.textMuted,textAlign:"center",marginTop:6 }}>Thanks for reporting. Our team is reviewing this listing.</div>
            )}
            {activeListing.seller_phone !== phone && reportState(activeListing)==="dismissed" && (
              <div style={{ fontSize:11,color:T.textMuted,textAlign:"center",marginTop:6 }}>We reviewed your report and no action was needed. Thank you for helping keep KaziApa safe.</div>
            )}
          </div>
        </div>
      )}

      {/* LEGAL PAGES */}
      {screen==="privacy" && <LegalScreen title="🔒 Privacy Policy" onBack={()=>nav("profile","profile")} sections={PRIVACY_SECTIONS} />}
      {screen==="terms" && <LegalScreen title="📋 Terms & Conditions" onBack={()=>nav("profile","profile")} sections={TERMS_SECTIONS} />}
      {screen==="about" && <AboutUs onBack={()=>nav("profile","profile")} onWhyKaziApa={()=>nav("whykaziapa","profile")} />}
      {screen==="whykaziapa" && <WhyKaziApa onBack={()=>nav("about","profile")} />}
      {screen==="contact" && <ContactScreen onBack={()=>nav("profile","profile")} />}

      {/* KIOSK */}
      {screen==="kiosk" && (
        <KioskScreen phone={phone} userName={userName} town={userTown} showToast={showToast} onBack={()=>nav("profile","profile")} onAddItem={()=>nav("post","post")} />
      )}

      {screen==="myListings" && (
        <MyListingsScreen phone={phone} showToast={showToast} onBack={()=>nav("profile","profile")}
          onBoost={(l)=>{ setActiveListing(l); setShowBoostOptions(true); nav("listing","browse"); }}
          onViewListing={(l)=>{ setActiveListing(l); nav("listing","browse"); }}
        />
      )}

      {/* CHAT */}
      {screen==="chats" && (
        <ChatsList phone={phone} onBack={()=>nav("profile","profile")}
          onOpenChat={t=>{ setActiveThread(t); nav("thread","profile"); }} />
      )}
      {screen==="thread" && activeThread && (
        <SmartChat
          listing={{ id:activeThread.listing_id, title:activeThread.listing_title, seller_phone:activeThread.seller_phone, seller_name:activeThread.seller_name, town:"" }}
          currentPhone={phone} currentName={userName}
          buyerPhone={activeThread.buyer_phone} buyerName={activeThread.buyer_name}
          sellerPhone={activeThread.seller_phone} sellerName={activeThread.seller_name}
          onBack={()=>{ setActiveThread(null); nav("chats","profile"); }}
          onCheckout={async()=>{
            const { data: fullListing } = await sb.from("listings").select("*").eq("id", activeThread.listing_id).single();
            if(!fullListing) {
              askNotice("This chat isn't linked to a listing, so there is nothing to pay for here. Ask the seller to share the listing, or open it from Browse.");
              return;
            }
            setActiveListing(fullListing);
            setCheckStep(1); nav("checkout","browse");
          }}
          initialText={chatDraft}
          onViewListing={(l)=>{ setActiveListing(l); setListingFromChat(true); nav("listing","browse"); }}
          onNeedUpgrade={()=>setShowUpgrade(true)} />
      )}
      {screen==="chat" && activeListing && (
        <SmartChat listing={activeListing}
          currentPhone={phone} currentName={userName}
          buyerPhone={phone} buyerName={userName}
          sellerPhone={activeListing?.seller_phone} sellerName={activeListing?.seller_name}
          onBack={()=>nav("listing","browse")}
          onCheckout={()=>{ setCheckStep(1); nav("checkout","browse"); }}
          onNeedUpgrade={()=>setShowUpgrade(true)} />
      )}

      {/* CHECKOUT */}
      {screen==="checkout" && activeListing && (
        <div>
          <BackHeader title="Secure Checkout" onBack={()=>nav("listing","browse")} />
          <div style={{ padding:16 }}>
            <div style={{ display:"flex",alignItems:"center",marginBottom:24 }}>
              {["Review","Pay","Confirm"].map((s,i)=>(
                <div key={s} style={{ display:"flex",alignItems:"center",flex:1 }}>
                  <div style={{ display:"flex",flexDirection:"column",alignItems:"center",flex:1 }}>
                    <div style={{ width:30,height:30,borderRadius:"50%",background:checkStep>i?T.success:checkStep===i+1?T.primary:T.border,color:checkStep>=i+1?"#fff":T.textMuted,display:"flex",alignItems:"center",justifyContent:"center",fontSize:13,fontWeight:800 }}>{checkStep>i?"✓":i+1}</div>
                    <div style={{ fontSize:10,color:checkStep===i+1?T.primary:T.textMuted,marginTop:4,fontWeight:checkStep===i+1?700:400 }}>{s}</div>
                  </div>
                  {i<2 && <div style={{ width:30,height:2,background:checkStep>i+1?T.success:T.border,marginBottom:14,flexShrink:0 }} />}
                </div>
              ))}
            </div>
            {checkStep===1 && (
              <div>
                <div style={{ background:T.card,borderRadius:14,padding:16,marginBottom:14,border:`1px solid ${T.border}` }}>
                  <div style={{ fontWeight:800,color:T.text,marginBottom:14 }}>Order Summary</div>
                  {[["Item",Number(activeListing.price)>0 ? `Ksh ${Number(activeListing.price).toLocaleString()}` : (activeListing.price_label ? `Ksh ${activeListing.price_label}` : "Price agreed in chat")],["Seller",activeListing.seller_name]].map(([k,v])=>(
                    <div key={k} style={{ display:"flex",justifyContent:"space-between",marginBottom:10,fontSize:14 }}><span style={{ color:T.textMid }}>{k}</span><span style={{ fontWeight:600 }}>{v}</span></div>
                  ))}
                  {!(Number(activeListing.price) > 0) && (
                    <div style={{ marginBottom:12 }}>
                      <label style={{ fontSize:12,fontWeight:700,color:T.text,display:"block",marginBottom:6 }}>Amount you agreed with the seller (Ksh)</label>
                      <input type="tel" inputMode="numeric" value={agreedAmount} onChange={e=>setAgreedAmount(e.target.value.replace(/\D/g,"").slice(0,8))} placeholder="e.g. 12000"
                        style={{ width:"100%",padding:"11px 13px",borderRadius:11,border:`1px solid ${T.border}`,fontSize:15,boxSizing:"border-box" }} />
                      <div style={{ fontSize:11,color:T.textMuted,marginTop:5 }}>{activeListing.price_label ? `Listed price: Ksh ${activeListing.price_label}. ` : ""}Agree the exact amount in chat before you pay.</div>
                    </div>
                  )}
                  <div style={{ borderTop:`1px solid ${T.border}`,paddingTop:10,display:"flex",justifyContent:"space-between",fontSize:16,fontWeight:900 }}>
                    <span>Total</span><span style={{ color:T.primary }}>Ksh {checkoutAmount.toLocaleString()}</span>
                  </div>
                </div>
                <div style={{ background:T.accentSoft,borderRadius:12,padding:13,marginBottom:16,fontSize:12,color:T.accentDark,lineHeight:1.5 }}><Icon n="alert" s={13} /> KaziApa does not yet hold payments automatically. You pay the seller directly — only deal with verified sellers and report any issue to us immediately.</div>
                <Btn onClick={()=>{ if(!(checkoutAmount>0)) { showToast("Enter the amount you agreed with the seller","error"); return; } setCheckStep(2); }}>Continue →</Btn>
              </div>
            )}
            {checkStep===2 && (
              <div>
                <div style={{ background:T.card,borderRadius:14,padding:16,marginBottom:14,border:`1px solid ${T.border}` }}>
                  <div style={{ fontWeight:800,color:T.text,marginBottom:14 }}>Pay the Seller Directly</div>
                  <div style={{ background:T.surface,borderRadius:11,padding:14,marginBottom:14,fontSize:13,color:T.textMid,lineHeight:2 }}>
                    <div>1. M-Pesa → <strong>Send Money</strong></div>
                    <div>2. Enter seller's number: <strong style={{ color:T.primary }}>{activeListing.seller_phone}</strong></div>
                    <div>3. Amount: <strong style={{ color:T.primary }}>Ksh {checkoutAmount.toLocaleString()}</strong></div>
                    <div>4. Confirm with seller in chat once sent</div>
                  </div>
                  <div style={{ background:T.coralSoft,borderRadius:10,padding:12,marginBottom:12,fontSize:11,color:T.coral,lineHeight:1.5 }}>
                    <Icon n="lock" s={12} /> Always meet in a safe public place or use delivery. Never send money before agreeing on terms in chat. Report any seller who behaves suspiciously.
                  </div>
                  <div style={{ marginBottom:12 }}>
                    <label style={{ fontSize:12,fontWeight:700,color:T.text,display:"block",marginBottom:6 }}>M-Pesa confirmation code (optional, for your records)</label>
                    <input id="mpesaCodeInput" placeholder="QHX1234ABC" style={{ width:"100%",padding:"11px 13px",borderRadius:11,border:`1px solid ${T.border}`,fontSize:14,boxSizing:"border-box",color:T.text }} />
                  </div>
                </div>
                <Btn onClick={()=>{
                  if(checkoutBusyRef.current) return;
                  if(!(checkoutAmount > 0)) { showToast("Enter the amount you agreed with the seller first.","error"); return; }
                  setConfirmDlg({ title:"Have you sent the money?", text:"Only continue if you have already sent the money to the seller on M-Pesa.", okLabel:"Yes, I've sent it", onOk: async()=>{
                  setConfirmDlg(null);
                  checkoutBusyRef.current = true;
                  try {
                  const code = document.getElementById("mpesaCodeInput")?.value || "";
                  const { error } = await sb.from("orders").insert({ listing_id:activeListing.id,buyer_phone:phone,buyer_name:userName,seller_phone:activeListing.seller_phone,amount:checkoutAmount,status:"buyer_paid_seller_directly",mpesa_code:code });
                  checkoutBusyRef.current = false;
                  if(error) { showToast("Couldn't record the order. Try again.","error"); return; }
                  // Tell the seller (chat message + bell + push/SMS). Best effort: never blocks the order.
                  try {
                    const amt = checkoutAmount.toLocaleString();
                    const short = `${userName} says they sent Ksh ${amt} for "${activeListing.title}".`;
                    await sb.from("chats").insert({ listing_id:String(activeListing.id||""), listing_title:activeListing.title, buyer_phone:phone, buyer_name:userName, seller_phone:activeListing.seller_phone, seller_name:activeListing.seller_name, sender_phone:phone, sender_name:userName, message:`💰 New order: ${short}${code?` M-Pesa code: ${code.toUpperCase()}.`:""} Please check your M-Pesa, then confirm in Profile → My Orders → Sales.`, read:false });
                    await sb.from("notifications").insert({ recipient_phone:activeListing.seller_phone, icon:"💰", read:false, title:"New order — please confirm payment", body:`${short} Check your M-Pesa, then confirm in My Orders → Sales.` });
                    fetch("/api/notify-message", { method:"POST", headers:{ "Content-Type":"application/json" }, body:JSON.stringify({ phone:activeListing.seller_phone, senderName:userName, message:`💰 New order for "${activeListing.title}" — please check M-Pesa and confirm.` }) }).catch(()=>{});
                  } catch(e) {}
                  setCheckStep(3); showToast("Order recorded — seller notified");
                  } finally { checkoutBusyRef.current = false; }
                  } });
                }} color={T.success}>I Have Sent the Money <Icon n="check" s={15} /></Btn>
              </div>
            )}
            {checkStep===3 && (
              <div style={{ textAlign:"center",padding:"20px 0" }}>
                <div style={{ color:T.success }}><Icon n="checkCircle" s={68} /></div>
                <div style={{ fontSize:22,fontWeight:900,color:T.text,marginTop:16 }}>Order Recorded</div>
                <div style={{ fontSize:14,color:T.textMid,marginTop:10,lineHeight:1.6,padding:"0 10px" }}>You said you sent the money to the seller. KaziApa cannot check M-Pesa payments, so the seller must confirm they received it. Message the seller to let them know.</div>
                <div style={{ background:T.card,borderRadius:14,padding:16,margin:"20px 0",border:`1px solid ${T.border}`,fontSize:12,color:T.textMuted,lineHeight:1.6 }}>
                  ⏳ Status: <strong style={{ color:"#B7791F" }}>Awaiting seller confirmation</strong><br/>After the seller confirms, you can rate them from <strong>My Orders</strong> in your Profile.
                </div>
                <Btn onClick={()=>{ nav("orders","profile"); setCheckStep(1); }}>View My Orders</Btn>
                <div style={{ height:10 }} />
                <Btn onClick={()=>{ nav("home","home"); setCheckStep(1); }}>Back to Home</Btn>
              </div>
            )}
          </div>
        </div>
      )}

      {/* POST */}
      {screen==="post" && (
        <div>
          <BackHeader title={tr(lang,"Post a Listing")} onBack={()=>nav("home","home")} />
          <div style={{ padding:16 }}>
            <PhotoUploader photos={postPhotos} setPhotos={setPostPhotos} maxPhotos={6} />
            <Field label={tr(lang,"Title")} value={postTitle} onChange={setPostTitle} placeholder="e.g. Levi's Jeans Waist 34 Grade A" />
            <Field label={tr(lang,"Price (Ksh)")} value={postPrice} onChange={setPostPrice} placeholder="e.g. 850 or 12000-20000" />
            <Field label={tr(lang,"Description")} value={postDesc} onChange={setPostDesc} placeholder="Describe clearly — condition, size, colour, defects if any..." rows={4} />
            <div style={{ marginBottom:14 }}>
              <label style={{ fontSize:12,fontWeight:700,color:T.text,display:"block",marginBottom:7 }}>{tr(lang,"Category")}</label>
              <select value={postCat} onChange={e=>setPostCat(e.target.value)} style={{ width:"100%",padding:"11px 13px",borderRadius:11,border:`1px solid ${T.border}`,fontSize:14,color:T.text,background:T.card }}>
                {CATEGORIES.filter(c=>c.id!=="nyumba").map(c=><option key={c.id} value={c.id}>{c.icon} {lang==="sw"?c.sw:c.en} — {c.sub}</option>)}
              </select>
            </div>
            <Field label={tr(lang,"Your Town / Area")} value={postTown} onChange={setPostTown} placeholder="e.g. Butula, Kondele, Gikomba, Nakuru CBD..." />
            <div onClick={capturePostLocation} style={{ display:"flex",alignItems:"center",gap:6,marginTop:-8,marginBottom:14,fontSize:12,fontWeight:700,color:postLat?T.success:T.primary,cursor:"pointer" }}>
              📍 {postLocating ? "Getting your location..." : postLat ? "Location attached — buyers can find you with Near Me" : "Attach my exact location (helps buyers find you nearby)"}
            </div>
            <MarketPicker marketId={postMarketId} marketName={postMarketName} onPick={(id,name)=>{ setPostMarketId(id); setPostMarketName(name); }} />
            <div style={{ background:T.accentSoft,borderRadius:14,padding:16,marginBottom:18,border:`1px solid ${T.accent}` }}>
              <div style={{ display:"flex",justifyContent:"space-between",alignItems:"center" }}>
                <div><div style={{ fontWeight:700,color:T.text,fontSize:14 }}><Icon n="zap" s={15} /> Boost this Listing</div><div style={{ fontSize:12,color:T.textMuted,marginTop:2 }}>Appear at the top for 7 days — Ksh 100</div></div>
                <div onClick={()=>setPostBoost(!postBoost)} style={{ width:48,height:26,borderRadius:13,background:postBoost?T.accent:T.border,position:"relative",cursor:"pointer",flexShrink:0 }}>
                  <div style={{ width:20,height:20,borderRadius:"50%",background:"#fff",position:"absolute",top:3,left:postBoost?25:3,transition:"left 0.2s",boxShadow:"0 1px 3px rgba(0,0,0,0.2)" }} />
                </div>
              </div>
            </div>
            <Btn onClick={postListing} disabled={posting}>{posting?"Posting...":postBoost?"Publish + Boost — Ksh 100":tr(lang,"Publish — Free")}</Btn>
            <div style={{ textAlign:"center",fontSize:11,color:T.textMuted,marginTop:8 }}>{tr(lang,"Listings go live immediately on KaziApa.")}</div>
          </div>
        </div>
      )}

      {/* REQUESTS */}
      {screen==="requests" && (
        <RequestBoard userName={userName} phone={phone} town={town} requests={requests} setRequests={setRequests} showToast={showToast} />
      )}

      {/* PROFILE */}
      {screen==="profile" && (
        <div>
          <div style={{ background:T.primary,padding:"22px 16px 18px" }}>
            <div style={{ display:"flex",alignItems:"center",gap:14 }}>
              <label style={{ position:"relative",width:58,height:58,borderRadius:"50%",background:T.accent,display:"flex",alignItems:"center",justifyContent:"center",fontSize:26,fontWeight:800,color:T.primary,cursor:"pointer",flexShrink:0,overflow:"hidden" }}>
                {userAvatar
                  ? <img src={userAvatar} alt="" style={{ width:"100%",height:"100%",objectFit:"cover" }} />
                  : userName[0]?.toUpperCase()
                }
                {avatarUploading && <div style={{ position:"absolute",inset:0,background:"rgba(0,0,0,0.5)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:11,color:"#fff" }}>...</div>}
                <input type="file" accept="image/*" onChange={e=>uploadAvatar(e.target.files?.[0])} style={{ display:"none" }} />
              </label>
              <div>
                <div style={{ color:"#fff",fontWeight:800,fontSize:18 }}>{userName}</div>
                <div style={{ color:"rgba(255,255,255,0.6)",fontSize:12 }}>{userTown} · {phone}</div>
              </div>
            </div>
          </div>
          <div style={{ padding:16 }}>
            <div style={{ background:T.card,border:`1px solid ${T.border}`,borderRadius:14,padding:14,marginBottom:14 }}>
              <div style={{ fontSize:14,fontWeight:700,color:T.text }}>Your availability today</div>
              <div style={{ fontSize:11,color:T.textMuted,marginTop:2 }}>Buyers see this on your listings and in chats. It resets after 24 hours.</div>
              <div style={{ display:"flex",gap:8,marginTop:10 }}>
                {Object.entries(AVAIL).map(([k,v])=>{
                  const on = availabilityOf(myAvail)?.key===k;
                  return <button key={k} onClick={()=>setAvailability(k)} style={{ flex:1,padding:"9px 4px",borderRadius:10,border:`1.5px solid ${on?v.color:T.border}`,background:on?"#fff":T.surface,color:on?v.color:T.textMid,fontSize:12,fontWeight:700,cursor:"pointer" }}>{v.dot} {v.label}</button>;
                })}
              </div>
            </div>
            {planStatus && (() => {
              const now = new Date();
              const chatActive = planStatus.chat_unlimited_until && new Date(planStatus.chat_unlimited_until) > now;
              const badgeActive = planStatus.is_verified && planStatus.verified_expires_at && new Date(planStatus.verified_expires_at) > now;
              if (!chatActive && !badgeActive) {
                return (
                  <div style={{ background:T.card,border:`1px solid ${T.border}`,borderRadius:14,padding:14,marginBottom:14 }}>
                    <div style={{ fontSize:14,fontWeight:700,color:T.text }}>Free Plan</div>
                    <div style={{ fontSize:11,color:T.textMuted,marginTop:2 }}>10 free conversation-starts/day · No active plan</div>
                  </div>
                );
              }
              const fmtRemaining = (until) => {
                const ms = new Date(until) - now;
                const hrs = Math.floor(ms/3600000);
                if (hrs < 1) return `${Math.max(1,Math.floor(ms/60000))} min left`;
                if (hrs < 24) return `${hrs}h left`;
                return `${Math.floor(hrs/24)}d left`;
              };
              return (
                <div style={{ background:T.successSoft,border:`1px solid ${T.success}`,borderRadius:14,padding:14,marginBottom:14 }}>
                  {chatActive && (
                    <div style={{ marginBottom:badgeActive?8:0 }}>
                      <div style={{ fontSize:14,fontWeight:800,color:"#145A36" }}>
                        ⚡ {planStatus.chat_plan_tier==="daily"?"Daily Pass":planStatus.chat_plan_tier==="week"?"Weekly Plan":"Monthly Plan"} Active
                      </div>
                      <div style={{ fontSize:11,color:"#145A36",marginTop:2 }}>Unlimited messages · {fmtRemaining(planStatus.chat_unlimited_until)}</div>
                    </div>
                  )}
                  {badgeActive && (
                    <div>
                      <div style={{ fontSize:14,fontWeight:800,color:"#145A36" }}>✓ Verified Seller Badge</div>
                      <div style={{ fontSize:11,color:"#145A36",marginTop:2 }}>{fmtRemaining(planStatus.verified_expires_at)}</div>
                    </div>
                  )}
                  {(planStatus.free_boosts_remaining||0) > 0 && (
                    <div style={{ fontSize:11,color:"#145A36",marginTop:6,fontWeight:700 }}>✨ {planStatus.free_boosts_remaining} free boost{planStatus.free_boosts_remaining>1?"s":""} available</div>
                  )}
                </div>
              );
            })()}
            <div onClick={toggleNitumeAvailability} style={{ display:"flex",alignItems:"center",justifyContent:"space-between",background:T.card,border:`1px solid ${T.border}`,borderRadius:14,padding:14,marginBottom:14,cursor:"pointer" }}>
              <div>
                <div style={{ fontSize:14,fontWeight:700,color:T.text }}>🛍️ Available for Nitume Jobs</div>
                <div style={{ fontSize:11,color:T.textMuted,marginTop:2 }}>Show up as an available shopper/errand-runner for nearby Nitume requests</div>
              </div>
              <div style={{ width:44,height:26,borderRadius:20,background:nitumeAvailable?T.primary:T.border,position:"relative",flexShrink:0 }}>
                <div style={{ width:20,height:20,borderRadius:"50%",background:"#fff",position:"absolute",top:3,left:nitumeAvailable?21:3,transition:"left 0.15s" }} />
              </div>
            </div>
            {[
              { icon:"💚",label:"WhatsApp Notifications", action:()=>showToast("WhatsApp notifications are automatic — no setup needed! 💚") },
              { icon:"🏪",label:"My Kiosk",           action:()=>nav("kiosk","profile") },
              { icon:"💬",label:"My Chats",           action:()=>nav("chats","profile") },
              { icon:"📦",label:"My Listings",       action:()=>nav("myListings","profile") },
              { icon:"🛒",label:"My Orders",          action:()=>nav("orders","profile") },
              { icon:"🏠",label:"Housing & Rentals",  action:()=>nav("housing","browse"), highlight:true },
              { icon:"⚡",label:"Upgrade Plan",       action:()=>setShowUpgrade(true), accent:true },
              { icon:"✓", label:"Get Verified Badge", action:()=>setShowUpgrade(true), accent:true },
              { icon:"🌍",label:"Language",           action:()=>setLang(lang==="en"?"sw":"en"), sub:lang==="en"?"Switch to Kiswahili":"Switch to English" },
              { icon:"📜",label:"Community Guidelines", action:()=>nav("guidelines","profile") },
              { icon:"🔒",label:"Privacy Policy",     action:()=>nav("privacy","profile") },
              { icon:"📋",label:"Terms & Conditions", action:()=>nav("terms","profile") },
              { icon:"ℹ️",label:"About KaziApa",      action:()=>nav("about","profile") },
              ...(ADMIN_PHONES.includes(phone) ? [{ icon:"🛠️",label:"Admin Panel", action:()=>nav("admin","profile"), accent:true }] : []),
              { icon:"💡",label:"Why KaziApa",         action:()=>nav("whykaziapa","profile") },
              { icon:"📧",label:"Contact Us",          action:()=>nav("contact","profile") },
              { icon:"🚪",label:"Log Out",            action:()=>setShowLogoutConfirm(true) },
            ].map((item,i)=>(
              <div key={i} onClick={item.action} style={{ background:T.card,borderRadius:13,padding:"14px 16px",marginBottom:8,display:"flex",alignItems:"center",gap:13,cursor:"pointer",border:item.accent?`1px solid ${T.accent}`:item.highlight?`1px solid ${T.primary}`:`1px solid ${T.border}` }}>
                <span style={{ fontSize:20 }}>{item.icon}</span>
                <div style={{ flex:1 }}>
                  <div style={{ fontSize:14,fontWeight:item.accent||item.highlight?700:500,color:item.accent?T.accentDark:item.highlight?T.primary:T.text }}>{tr(lang,item.label)}</div>
                  {item.sub && <div style={{ fontSize:11,color:T.textMuted,marginTop:1 }}>{item.sub}</div>}
                </div>
                <span style={{ color:T.textMuted,fontSize:16 }}>›</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* USAFIRI */}
      {screen==="usafiri" && (
        <UsafiriScreen userName={userName} phone={phone} town={town} showToast={showToast} onBack={()=>nav("home","home")} lang={lang} />
      )}

      {/* SHAMBA */}
      {screen==="shamba" && (
        <ShambaScreen userName={userName} phone={phone} town={town} showToast={showToast} onBack={()=>nav("home","home")} lang={lang} />
      )}

      {/* FUNDI */}
      {screen==="fundi" && (
        <FundiScreen userName={userName} phone={phone} town={town} showToast={showToast} onBack={()=>nav("home","home")} lang={lang} />
      )}

      {/* JOBS */}
      {screen==="jobs" && (
        <JobsScreen userName={userName} phone={phone} town={town} showToast={showToast} onBack={()=>nav("home","home")} lang={lang} />
      )}

      {/* HOUSING */}
      {screen==="housing" && (
        <HousingScreen lang={lang} town={town} showToast={showToast} onBack={()=>nav("home","home")} userName={userName} phone={phone} onOpenRentTracker={()=>nav("rentTracker","housing")} />
      )}

      {/* RENT TRACKER */}
      {screen==="rentTracker" && (
        <RentTrackerScreen town={town} showToast={showToast} onBack={()=>nav("housing","home")} userName={userName} phone={phone} />
      )}

      {/* NITUME */}
      {screen==="nitume" && (
        <NitumeScreen town={town} showToast={showToast} onBack={()=>nav("home","home")} userName={userName} phone={phone} />
      )}

      {/* MY MARKET */}
      {screen==="market" && (
        <MarketListScreen phone={phone} userName={userName} town={userTown} showToast={showToast}
          onBack={()=>nav("home","home")}
          onOpenMarket={(m)=>{ setActiveMarket(m); nav("marketProfile","home"); }} />
      )}
      {screen==="marketProfile" && activeMarket && (
        <MarketProfileScreen market={activeMarket} phone={phone} userName={userName} showToast={showToast}
          onBack={()=>nav(activeMarket.type==="hood" ? "hood" : "market","home")}
          onAddBusiness={()=>{ nav("kiosk","profile"); }}
          onRequestGuide={()=>{
            try { sessionStorage.setItem("kaziapa_pending_guide_request", JSON.stringify({ marketName:activeMarket.name })); } catch(e) {}
            nav("nitume","home");
          }} />
      )}

      {/* MY HOOD */}
      {screen==="hood" && (
        <HoodListScreen phone={phone} userName={userName} showToast={showToast}
          onBack={()=>nav("home","home")}
          onOpenMarket={(h)=>{ setActiveMarket(h); nav("marketProfile","home"); }}
          navState={hoodNavState} setNavState={setHoodNavState} />
      )}

      {/* BOTTOM NAV */}
      {screen!=="chat" && (
        <div style={{ position:"fixed",bottom:0,left:"50%",transform:`translate(-50%, ${navVisible?"0":"100%"})`,transition:"transform 0.25s ease",width:"100%",maxWidth:430,background:T.card,borderTop:`1px solid ${T.border}`,display:"flex",zIndex:50,boxShadow:"0 -2px 12px rgba(0,102,204,0.08)" }}>
          {[
            { ic:"home",en:"Home",    s:"home",     key:"home" },
            { ic:"search",en:"Browse",  s:"browse",   key:"browse" },
            { ic:"clipboard",en:"Requests",s:"requests", key:"requests" },
            { ic:"plus",en:"Post",    s:"post",      key:"post" },
            { ic:"user",en:"Profile", s:"profile",  key:"profile" },
          ].map(n=>(
            <div key={n.key} role="button" aria-label={n.en} onClick={()=>{ nav(n.s,n.key); if(n.s==="browse"){ setCatFilter(null); setBrowseTab("listings"); } }}
              style={{ flex:1,padding:"10px 0 8px",textAlign:"center",cursor:"pointer",position:"relative" }}>
              {n.key==="post"
                ? <div style={{ width:34,height:34,borderRadius:"50%",background:T.primary,color:"#fff",display:"flex",alignItems:"center",justifyContent:"center",margin:"0 auto",boxShadow:"0 2px 8px rgba(0,102,204,0.35)" }}><Icon n="plus" s={20} /></div>
                : <div style={{ color:activeNav===n.key?T.primary:T.textMuted,display:"flex",justifyContent:"center",height:34,alignItems:"center" }}><Icon n={n.ic} s={22} /></div>}
              {n.key==="profile" && unreadCount > 0 && (
                <div style={{ position:"absolute",top:6,right:"50%",transform:"translateX(160%)",background:T.coral,color:"#fff",borderRadius:"50%",width:16,height:16,fontSize:9,fontWeight:800,display:"flex",alignItems:"center",justifyContent:"center" }}>
                  {unreadCount > 9 ? "9+" : unreadCount}
                </div>
              )}
              <div style={{ fontSize:9,color:activeNav===n.key?T.primary:T.textMuted,fontWeight:activeNav===n.key?800:400,marginTop:2 }}>{tr(lang,n.en)}</div>
              {activeNav===n.key && <div style={{ width:16,height:3,background:T.primary,borderRadius:2,margin:"3px auto 0" }} />}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ─── JOBS SCREEN ─────────────────────────────────────────────────────────────
function SimpleChatThread({ chatKey, title, otherName, otherPhone, currentPhone, currentName, themeColor, onClose, banner }) {
  const [msgs, setMsgs] = useState([]);
  const [input, setInput] = useState("");
  const [sending, setSending] = useState(false);
  const [sendingImage, setSendingImage] = useState(false);
  const imgRef = useRef();

  useEffect(()=>{
    load();
    const interval = setInterval(load, 3000);
    return ()=>clearInterval(interval);
  },[]);

  async function load() {
    const { data } = await sb.from("chats").select("*").eq("listing_id",chatKey).order("created_at",{ ascending:true });
    setMsgs(data||[]);
    await sb.from("chats").update({ read:true }).eq("listing_id",chatKey).neq("sender_phone",currentPhone);
  }

  async function send() {
    if(!input.trim()) return;
    setSending(true);
    await sb.from("chats").insert({
      listing_id: chatKey, listing_title: title,
      buyer_phone: currentPhone, buyer_name: currentName,
      seller_phone: otherPhone, seller_name: otherName,
      sender_phone: currentPhone, sender_name: currentName,
      message: input, read:false,
    });
    setInput("");
    setSending(false);
    load();
  }

  async function sendImage(e) {
    const file = e.target.files?.[0];
    if(!file) return;
    setSendingImage(true);
    try {
      const url = await compressAndUploadChatImage(file);
      await sb.from("chats").insert({
        listing_id: chatKey, listing_title: title,
        buyer_phone: currentPhone, buyer_name: currentName,
        seller_phone: otherPhone, seller_name: otherName,
        sender_phone: currentPhone, sender_name: currentName,
        message: "📷 Photo", image_url: url, read:false,
      });
      load();
    } catch(err) { askNotice("Couldn't send that photo — try again."); }
    setSendingImage(false);
    e.target.value = "";
  }

  return (
    <div style={{ position:"fixed", inset:0, background:"#fff", zIndex:200, display:"flex", flexDirection:"column" }}>
      <div style={{ background:themeColor||T.primary, padding:"16px 16px 14px", color:"#fff", display:"flex", alignItems:"center", gap:10 }}>
        <span onClick={onClose} style={{ cursor:"pointer", fontSize:20 }}>←</span>
        <div>
          <div style={{ fontWeight:800, fontSize:15 }}>{otherName}</div>
          <div style={{ fontSize:11, opacity:0.85 }}>{title}</div>
        </div>
      </div>
      {banner}
      <div style={{ flex:1, overflowY:"auto", padding:14, background:T.bg }}>
        {msgs.length===0 && <div style={{ textAlign:"center", color:T.textMuted, fontSize:12, marginTop:20 }}>No messages yet — say hello 👋</div>}
        {msgs.map(m=>(
          <div key={m.id} style={{ display:"flex", justifyContent:m.sender_phone===currentPhone?"flex-end":"flex-start", marginBottom:8 }}>
            <div style={{ maxWidth:"75%", padding:m.image_url?6:"9px 13px", borderRadius:14, fontSize:13, background:m.sender_phone===currentPhone?(themeColor||T.primary):T.card, color:m.sender_phone===currentPhone?"#fff":T.text, border:m.sender_phone===currentPhone?"none":`1px solid ${T.border}` }}>
              {m.image_url ? <img src={m.image_url} alt="" onClick={()=>window.open(m.image_url,"_blank")} style={{ maxWidth:200,borderRadius:10,display:"block",cursor:"pointer" }} /> : m.message}
            </div>
          </div>
        ))}
      </div>
      <div style={{ display:"flex", gap:8, padding:12, borderTop:`1px solid ${T.border}`, background:"#fff" }}>
        <input type="file" accept="image/*" ref={imgRef} onChange={sendImage} style={{ display:"none" }} />
        <button onClick={()=>imgRef.current?.click()} disabled={sendingImage} style={{ width:44,height:44,borderRadius:"50%",background:T.surface,border:`1px solid ${T.border}`,color:T.textMid,fontSize:16,cursor:sendingImage?"default":"pointer",flexShrink:0 }}>{sendingImage?"⏳":"📷"}</button>
        <input value={input} onChange={e=>setInput(e.target.value)} onKeyDown={e=>{ if(e.key==="Enter") send(); }} placeholder="Type a message..."
          style={{ flex:1, padding:12, borderRadius:20, border:`1px solid ${T.border}`, fontSize:14 }} />
        <button onClick={send} disabled={sending||!input.trim()} style={{ padding:"0 18px", background:themeColor||T.primary, color:"#fff", border:"none", borderRadius:20, fontWeight:700, cursor:"pointer" }}>Send</button>
      </div>
    </div>
  );
}

function JobsScreen({ userName, phone, town, showToast, onBack, lang }) {
  const [tab, setTab]           = useState("need"); // need | offer
  const [jobs, setJobs]         = useState([]);
  const [seekers, setSeekers]   = useState([]);
  const [loading, setLoading]   = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [activeItem, setActiveItem] = useState(null);
  const [jobChat, setJobChat] = useState(null);

  // Job form
  const [title, setTitle]         = useState("");
  const [pay, setPay]             = useState("");
  const [jobTown, setJobTown]     = useState(town !== "All" ? town : "");
  const [desc, setDesc]           = useState("");
  const [jobType, setJobType]     = useState("Full Time");
  const [skills, setSkills]       = useState("");
  const [posting, setPosting]     = useState(false);
  const [jobMarketId, setJobMarketId] = useState(null);
  const [jobMarketName, setJobMarketName] = useState("");

  const JOB_TYPES = ["Full Time", "Part Time", "Contract", "Daily Pay", "Weekend Only", "One-off Job"];
  // Pay unit shown next to the amount, based on the job type chosen when posting
  const payUnit = (t) => t==="Daily Pay" || t==="Weekend Only" ? "per day" : t==="One-off Job" ? "per job" : t==="Contract" ? "per contract" : "per month";
  const JOB_CATS  = ["Shop Attendant","Driver","House Help","Security Guard","Fundi/Artisan","Farm Worker","Cook","Delivery Rider","Cashier","Teacher","Nurse/Health","IT/Tech","Sales","Other"];

  useEffect(() => { loadJobs(); }, [tab]);

  async function loadJobs() {
    setLoading(true);
    if (tab === "need") {
      const { data } = await sb.from("listings").select("*").eq("category","kazi").eq("job_mode","need").order("created_at",{ ascending:false }).limit(30);
      setJobs(data || []);
    } else {
      const { data } = await sb.from("listings").select("*").eq("category","kazi").eq("job_mode","offer").order("created_at",{ ascending:false }).limit(30);
      setSeekers(data || []);
    }
    setLoading(false);
  }

  async function postJob() {
    if (!title || !pay || !jobTown) { showToast("Fill in title, pay and town","error"); return; }
    setPosting(true);
    const { error } = await sb.from("listings").insert({
      title, price: parseInt(pay), description: desc,
      category: "kazi", town: jobTown,
      seller_name: userName, seller_phone: phone,
      job_mode: tab, job_type: jobType,
      skills_required: tab === "need" ? desc : skills,
      market_id: jobMarketId, market_name: jobMarketName||null,
    });
    if (error) { showToast("Error posting. Try again.","error"); }
    else {
      showToast(tab === "need" ? "Job posted! People looking for work can apply now. 🎉" : "Posted! People who need help can find you. 🎉");
      setTitle(""); setPay(""); setDesc(""); setJobTown(""); setSkills("");
      setJobMarketId(null); setJobMarketName("");
      setShowForm(false);
      await loadJobs();
    }
    setPosting(false);
  }

  const items = tab === "need" ? jobs : seekers;

  if (activeItem) return (
    <div>
      <BackHeader title={activeItem.title} onBack={() => setActiveItem(null)} />
      <div style={{ padding: 16 }}>
        <div style={{ background: T.card, borderRadius: 16, padding: 16, marginBottom: 12, border: `1px solid ${T.border}` }}>
          <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", gap:8 }}>
            <div style={{ flex:1 }}>
              <div style={{ fontSize:18, fontWeight:800, color:T.text }}>{activeItem.title}</div>
              <div style={{ fontSize:12, color:T.textMuted, marginTop:3 }}>📍 {activeItem.town}</div>
              <div style={{ marginTop:6, display:"flex", gap:6, flexWrap:"wrap" }}>
                {activeItem.job_type && <Pill color={T.primary} bg={T.primarySoft}>{activeItem.job_type}</Pill>}
                {tab === "need" ? <Pill color="#B7410E" bg="#FFF0E8">Hiring</Pill> : <Pill color={T.success} bg={T.successSoft}>Available</Pill>}
              </div>
            </div>
            <div style={{ textAlign:"right" }}>
              <div style={{ fontSize:20, fontWeight:900, color:T.primary }}>Ksh {activeItem.price?.toLocaleString()}</div>
              <div style={{ fontSize:11, color:T.textMuted }}>{tab === "need" ? payUnit(activeItem.job_type) : "expected"}</div>
            </div>
          </div>
          {activeItem.description && <div style={{ marginTop:12, fontSize:13, color:T.textMid, lineHeight:1.6 }}>{activeItem.description}</div>}
        </div>
        <div style={{ background:T.card, borderRadius:14, padding:14, marginBottom:14, border:`1px solid ${T.border}`, display:"flex", alignItems:"center", gap:12 }}>
          <div style={{ width:46, height:46, borderRadius:"50%", background:T.primary, display:"flex", alignItems:"center", justifyContent:"center", color:"#fff", fontWeight:800, fontSize:20 }}>{activeItem.seller_name?.[0]}</div>
          <div style={{ flex:1 }}>
            <div style={{ fontWeight:700, color:T.text }}>{activeItem.seller_name}</div>
            <div style={{ fontSize:11, color:T.textMuted }}>{tab === "need" ? "Hiring" : "Looking for work"}</div>
          </div>
        </div>
        <div style={{ background:T.successSoft, borderRadius:13, padding:13, marginBottom:16, fontSize:12, color:"#145A36", lineHeight:1.5 }}>
          💬 Chat safely inside KaziApa — phone numbers stay private until you both agree to share.
        </div>
        {activeItem.seller_phone !== phone && (
          <>
            <button style={{ width:"100%", padding:16, background:T.primary, color:"#fff", border:"none", borderRadius:14, fontSize:16, fontWeight:800, cursor:"pointer", marginBottom:10 }}
              onClick={() => setJobChat(activeItem)}>
              💬 {tab === "need" ? "Apply for this Job" : "Contact this Person"}
            </button>
            <a href={`tel:${activeItem.seller_phone}`} style={{ textDecoration:"none" }}>
              <button style={{ width:"100%", padding:14, background:T.successSoft, color:T.success, border:"none", borderRadius:14, fontSize:14, fontWeight:800, cursor:"pointer" }}>
                📞 Call {activeItem.seller_name}
              </button>
            </a>
          </>
        )}
        {activeItem.seller_phone === phone && (
          <button onClick={async()=>{
            if(await askConfirm("Delete this listing?")) {
              const { error } = await sb.from("listings").delete().eq("id",activeItem.id);
              if (error) { showToast("Delete failed: " + error.message, "error"); return; }
              showToast("Listing deleted."); setActiveItem(null); await loadJobs();
            }
          }} style={{ width:"100%", padding:14, background:T.coral, color:"#fff", border:"none", borderRadius:14, fontSize:14, fontWeight:800, cursor:"pointer" }}>
            🗑️ Delete This Listing
          </button>
        )}
      </div>
      {jobChat && (
        <SimpleChatThread chatKey={`jobs-${activeItem.id}`} title={activeItem.title} otherName={activeItem.seller_name} otherPhone={activeItem.seller_phone}
          currentPhone={phone} currentName={userName} themeColor={T.primary} onClose={()=>setJobChat(null)} />
      )}
    </div>
  );

  return (
    <div>
      {/* Header */}
      <div style={{ background:"#B7410E", padding:"16px 16px 0", borderRadius:"0 0 18px 18px" }}>
        <div style={{ display:"flex", alignItems:"center", gap:10, marginBottom:14 }}>
          <div onClick={onBack} style={{ color:"#fff", fontSize:22, cursor:"pointer" }}>←</div>
          <div style={{ color:"#fff", fontWeight:800, fontSize:18, flex:1 }}>💼 Jobs & Gigs</div>
          <button onClick={() => setShowForm(true)}
            style={{ background:T.accent, border:"none", borderRadius:20, padding:"6px 14px", fontSize:12, fontWeight:800, color:"#B7410E", cursor:"pointer" }}>
            + Post
          </button>
        </div>
        {/* Two main buttons */}
        <div style={{ display:"flex", gap:8, paddingBottom:16 }}>
          <div onClick={() => setTab("need")}
            style={{ flex:1, background:tab==="need"?"#fff":"rgba(255,255,255,0.15)", color:tab==="need"?"#B7410E":"#fff", borderRadius:12, padding:"12px 0", textAlign:"center", cursor:"pointer", fontWeight:800, fontSize:14 }}>
            🧑‍🔧 I need a worker<div style={{ fontSize:10, fontWeight:400, marginTop:2, opacity:0.8 }}>Post a job or gig</div>
          </div>
          <div onClick={() => setTab("offer")}
            style={{ flex:1, background:tab==="offer"?"#fff":"rgba(255,255,255,0.15)", color:tab==="offer"?"#B7410E":"#fff", borderRadius:12, padding:"12px 0", textAlign:"center", cursor:"pointer", fontWeight:800, fontSize:14 }}>
            🙋 I need work<div style={{ fontSize:10, fontWeight:400, marginTop:2, opacity:0.8 }}>Show what you can do</div>
          </div>
        </div>
      </div>

      {/* Post form modal */}
      {showForm && (
        <div style={{ position:"fixed", inset:0, background:T.overlay, zIndex:150, display:"flex", alignItems:"flex-end", justifyContent:"center" }} onClick={() => setShowForm(false)}>
          <div style={{ background:T.card, borderRadius:"22px 22px 0 0", padding:"24px 20px 36px", width:"100%", maxWidth:430, maxHeight:"85vh", overflowY:"auto" }} onClick={e => e.stopPropagation()}>
            <div style={{ fontWeight:800, color:T.text, fontSize:17, marginBottom:4 }}>
              {tab === "need" ? "🧑‍🔧 Post a Job or Gig" : "🙋 Show What Work You Can Do"}
            </div>
            <div style={{ fontSize:12, color:T.textMuted, marginBottom:16 }}>
              {tab === "need" ? "Shop, home, shamba, fundi, mama fua — any work you need done" : "No CV needed. Just tell people what you can do."}
            </div>
            <Field label={tab === "need" ? "Job Title" : "Your Name / Role"} value={title} onChange={setTitle}
              placeholder={tab === "need" ? "e.g. Shop attendant, Mama fua needed" : "e.g. Mary — Mama fua, John — Driver"} />
            <Field label={(tab === "need" ? "Pay (Ksh) " : "Expected Pay (Ksh) ") + payUnit(jobType)} value={pay} onChange={setPay} placeholder="15000" type="number" />
            <div style={{ marginBottom:14 }}>
              <label style={{ fontSize:12, fontWeight:700, color:T.text, display:"bl                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                          