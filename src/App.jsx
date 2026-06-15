import { useState } from "react";

// ─── DESIGN TOKENS ─────────────────────────────────────────────────────────
// Ocean Blue #0066CC — trust, professionalism, clarity
// Gold #F5A623 — Kenyan market energy, warmth
// White surfaces — clean, modern, uncluttered
// 🤝 Handshake logo — trusted connections

const T = {
  primary: "#0066CC",
  primaryMid: "#0055AA",
  primaryLight: "#3385D6",
  primarySoft: "#E8F2FF",
  accent: "#F5A623",
  accentSoft: "#FFF8E7",
  accentDark: "#C4841A",
  coral: "#E84040",
  coralSoft: "#FFF0F0",
  success: "#1E9B5A",
  successSoft: "#E8F5EE",
  surface: "#F5F8FF",
  card: "#FFFFFF",
  text: "#0A1628",
  textMid: "#3A4A5C",
  textMuted: "#7A8A9C",
  border: "#DCE8F5",
  overlay: "rgba(0,51,102,0.6)",
};

const CATEGORIES = [
  { id:"mitumba", en:"Mitumba",  sw:"Mitumba",  sub:"Secondhand Clothes", icon:"👕", color:"#0066CC" },
  { id:"shamba",  en:"Shamba",   sw:"Shamba",   sub:"Farm Produce",        icon:"🌽", color:"#1E9B5A" },
  { id:"vitu",    en:"Goods",    sw:"Vitu",     sub:"General Items",       icon:"📦", color:"#6C3483" },
  { id:"kazi",    en:"Jobs",     sw:"Kazi",     sub:"Jobs & Gigs",         icon:"💼", color:"#B7410E" },
  { id:"nyumba",  en:"Housing",  sw:"Nyumba",   sub:"Rentals & Agents",    icon:"🏠", color:"#0E6655" },
  { id:"fundi",   en:"Services", sw:"Fundi",    sub:"Fundis & Pros",       icon:"🔧", color:"#1A5276" },
];
const CAT_COLOR = Object.fromEntries(CATEGORIES.map(c=>[c.id,c.color]));
const CAT_ICON  = Object.fromEntries(CATEGORIES.map(c=>[c.id,c.icon]));
const TOWNS = ["Nairobi","Nakuru","Kisumu","Mombasa","Eldoret","Thika","Nyeri","Machakos","Kitale","Webuye","Malindi","Garissa"];

const LISTINGS = [
  { id:1,  category:"mitumba", title:"Levi's Slim Fit Jeans",     price:850,   town:"Nakuru",  seller:"Grace Wanjiru",      verified:true,  boosted:true,  icon:"👖", desc:"Grade A, Waist 34, no defects.",         rating:4.9, sales:47,  location:"Kibuye Market, Stall 14", area:"Kibuye" },
  { id:2,  category:"shamba",  title:"Fresh Tomatoes 10kg",        price:400,   town:"Nakuru",  seller:"James Mkulima",      verified:false, boosted:false, icon:"🍅", desc:"Farm fresh, harvested this morning.",     rating:4.7, sales:23,  location:"Nakuru Market, Stall 3",  area:"CBD" },
  { id:3,  category:"fundi",   title:"Plumber – All Repairs",      price:500,   town:"Nakuru",  seller:"Ochieng Fundi",      verified:true,  boosted:false, icon:"🔧", desc:"10 years experience. Same-day response.", rating:4.8, sales:61,  location:"Milimani, Nakuru",         area:"Milimani" },
  { id:4,  category:"kazi",    title:"Shop Attendant Needed",      price:15000, town:"Nairobi", seller:"Westlands Supermart", verified:true, boosted:true,  icon:"💼", desc:"Full time, Mon–Sat.",                    rating:4.6, sales:0,   location:"Westlands, Nairobi",      area:"Westlands" },
  { id:7,  category:"mitumba", title:"Ralph Lauren Polo XL",       price:550,   town:"Nairobi", seller:"Gikomba Picks",      verified:true,  boosted:true,  icon:"👔", desc:"Grade A, clean, no wear marks.",         rating:5.0, sales:92,  location:"Gikomba Market, Row C",   area:"Gikomba" },
  { id:9,  category:"mitumba", title:"Nike Sneakers Size 42",      price:1200,  town:"Mombasa", seller:"Coast Threads",      verified:true,  boosted:false, icon:"👟", desc:"Grade A, barely worn.",                  rating:4.8, sales:29,  location:"Kongowea Market",          area:"Kongowea" },
  { id:10, category:"fundi",   title:"Electrician – Wiring",       price:800,   town:"Eldoret", seller:"Cheruiyot Electric", verified:true,  boosted:true,  icon:"⚡", desc:"Licensed. Fast, clean work.",            rating:4.9, sales:55,  location:"Eldoret Town, Opp. Posta",area:"Town" },
];

const PROPERTIES = [
  { id:"P1", title:"Modern 1BR Apartment", rent:12000, town:"Nakuru", area:"Milimani", agent:"Kevin Mwangi", agentRating:4.9, agentViewings:34, verified:true, type:"Apartment", bedrooms:1, bathrooms:1, desc:"Spacious 1BR with modern finish. Water 24hrs, secure parking. Walking distance to CBD.", amenities:["Water 24hrs","Parking","Security","DSTV ready"], photos:["🏢","🛋️","🚿"], available:true, viewingFee:150, strikes:0 },
  { id:"P2", title:"Bedsitter Near Town",  rent:6500,  town:"Nakuru", area:"CBD",      agent:"Mary Njeri",   agentRating:4.7, agentViewings:21, verified:true, type:"Bedsitter", bedrooms:0, bathrooms:1, desc:"Clean bedsitter. Electricity included. Shared kitchen.", amenities:["Electricity incl.","Shared kitchen","Security"], photos:["🏠","🛏️"], available:true, viewingFee:150, strikes:0 },
  { id:"P3", title:"2BR House with Garden",rent:18000, town:"Nairobi",area:"Westlands",agent:"Peter Kamau",  agentRating:5.0, agentViewings:67, verified:true, type:"House", bedrooms:2, bathrooms:2, desc:"Spacious 2BR with garden. Quiet neighborhood. All amenities.", amenities:["Garden","Parking","Borehole","Generator"], photos:["🏡","🛋️","🌳","🚿"], available:true, viewingFee:150, strikes:0 },
  { id:"P4", title:"Single Room Kondele",  rent:3500,  town:"Kisumu", area:"Kondele",  agent:"Aisha Omar",   agentRating:4.5, agentViewings:12, verified:false,type:"Single Room",bedrooms:1, bathrooms:0, desc:"Clean single room. Communal bathroom. Near stage.", amenities:["Near stage","Shared bathroom"], photos:["🏠"], available:true, viewingFee:150, strikes:1 },
];

const RIDERS = [
  { id:1, name:"Brian M.",  stage:"Kibuye Stage",     town:"Kisumu",  rating:4.8, trips:234, available:true },
  { id:2, name:"Kevin O.",  stage:"Kondele Stage",    town:"Kisumu",  rating:4.9, trips:187, available:true },
  { id:3, name:"Peter N.",  stage:"Westlands Stage",  town:"Nairobi", rating:5.0, trips:89,  available:true },
  { id:4, name:"Hassan A.", stage:"Nyali Stage",      town:"Mombasa", rating:4.6, trips:156, available:true },
  { id:5, name:"Chebet J.", stage:"Eldoret Stage",    town:"Eldoret", rating:4.8, trips:201, available:true },
  { id:6, name:"James K.",  stage:"Nakuru CBD Stage", town:"Nakuru",  rating:4.7, trips:312, available:true },
];

const DELIVERY_ZONES = [
  { id:"same",      label:"Same Stage / Area",      labelSw:"Stage Moja",     price:50,  time:"15–30 mins" },
  { id:"cbd",       label:"Within Town CBD",         labelSw:"Ndani ya Mji",   price:100, time:"30–60 mins" },
  { id:"outskirts", label:"Outskirts / Estate",      labelSw:"Nje ya Mji",     price:150, time:"45–90 mins" },
  { id:"parcel",    label:"Bus Parcel (Other Town)", labelSw:"Parcel ya Basi", price:250, time:"Same/Next day" },
];

const BUS = [
  { name:"Easy Coach",    price:200, time:"Same day" },
  { name:"Modern Coast",  price:180, time:"Same day" },
  { name:"Fargo Courier", price:300, time:"Next day, tracked" },
];

const PHONE_RGX   = /(\+?254|0)[17]\d{8}|\b07\d{8}\b|\b01\d{8}\b/g;
const CONTACT_RGX = /(@[\w]+|wa\.me|whatsapp|instagram|facebook|tuma.*moja kwa moja|nipe.*nambari|number yangu|nambari yangu)/i;
const DEAL_RGX    = /\b(sawa|deal|nataka|nimechukua|confirmed|ok price|bei sawa|niko tayari|fine|agreed)\b/i;

// ─── HELPERS ───────────────────────────────────────────────────────────────
function Stars({ rating, size=11 }) {
  return <span style={{ color:T.accent, fontSize:size }}>{"★".repeat(Math.floor(rating))}{"☆".repeat(5-Math.floor(rating))}<span style={{ color:T.textMuted, marginLeft:3 }}>{rating}</span></span>;
}
function Pill({ children, color=T.primary, bg=T.primarySoft }) {
  return <span style={{ background:bg, color, fontSize:10, fontWeight:700, padding:"2px 8px", borderRadius:20 }}>{children}</span>;
}
function SecTitle({ children, style={} }) {
  return <div style={{ fontSize:13, fontWeight:800, color:T.text, marginBottom:12, ...style }}>{children}</div>;
}
function BackHeader({ title, onBack, right }) {
  return (
    <div style={{ background:T.primary, padding:"16px", display:"flex", alignItems:"center", gap:10 }}>
      <div onClick={onBack} style={{ color:"#fff", fontSize:22, cursor:"pointer" }}>←</div>
      <div style={{ color:"#fff", fontWeight:700, fontSize:15, flex:1 }}>{title}</div>
      {right}
    </div>
  );
}

function ListingCard({ listing, onClick, lang }) {
  return (
    <div onClick={onClick} style={{ background:T.card, borderRadius:14, marginBottom:10, cursor:"pointer", border:listing.boosted?`1.5px solid ${T.accent}`:`1px solid ${T.border}`, boxShadow:listing.boosted?"0 2px 12px rgba(0,102,204,0.12)":"0 1px 4px rgba(0,0,0,0.05)", overflow:"hidden", display:"flex" }}>
      <div style={{ width:5, flexShrink:0, background:CAT_COLOR[listing.category]||T.primary }} />
      <div style={{ padding:"12px 14px 12px 10px", flex:1, minWidth:0 }}>
        <div style={{ display:"flex", justifyContent:"space-between", gap:8 }}>
          <div style={{ flex:1, minWidth:0 }}>
            <div style={{ display:"flex", gap:5, flexWrap:"wrap", marginBottom:4 }}>
              {listing.boosted   && <Pill color={T.accentDark} bg={T.accentSoft}>⚡ Boosted</Pill>}
              {listing.verified  && <Pill color={T.success} bg={T.successSoft}>✓ {lang==="sw"?"Amethibitishwa":"Verified"}</Pill>}
            </div>
            <div style={{ fontWeight:700, color:T.text, fontSize:14, whiteSpace:"nowrap", overflow:"hidden", textOverflow:"ellipsis" }}>{listing.title}</div>
            <div style={{ fontSize:11, color:T.textMuted, marginTop:2 }}>📍 {listing.town} · {listing.seller}</div>
            <Stars rating={listing.rating} />
          </div>
          <div style={{ textAlign:"right", flexShrink:0 }}>
            <div style={{ fontSize:16, fontWeight:800, color:T.primary }}>Ksh {listing.price.toLocaleString()}</div>
            <div style={{ fontSize:11, color:T.textMuted }}>{listing.sales>0?`${listing.sales} sold`:"New"}</div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── HOUSING MODULE ─────────────────────────────────────────────────────────
function PropertyCard({ prop, onClick, lang }) {
  return (
    <div onClick={onClick} style={{ background:T.card, borderRadius:14, marginBottom:12, cursor:"pointer", border:`1px solid ${T.border}`, overflow:"hidden", boxShadow:"0 1px 6px rgba(0,102,204,0.08)" }}>
      <div style={{ height:5, background:prop.verified?T.success:T.accent }} />
      <div style={{ padding:"12px 14px" }}>
        <div style={{ display:"flex", justifyContent:"space-between", gap:8 }}>
          <div style={{ flex:1 }}>
            <div style={{ display:"flex", gap:5, marginBottom:4 }}>
              {prop.verified && <Pill color={T.success} bg={T.successSoft}>✓ Agent Verified</Pill>}
              {prop.strikes>0 && <Pill color={T.coral} bg={T.coralSoft}>⚠ {prop.strikes} strike{prop.strikes>1?"s":""}</Pill>}
            </div>
            <div style={{ fontWeight:700, color:T.text, fontSize:14 }}>{prop.title}</div>
            <div style={{ fontSize:11, color:T.textMuted, marginTop:2 }}>📍 {prop.area}, {prop.town} · {prop.type}</div>
            <div style={{ fontSize:11, color:T.textMuted, marginTop:2 }}>🏠 Agent: {prop.agent} · <Stars rating={prop.agentRating} /></div>
          </div>
          <div style={{ textAlign:"right", flexShrink:0 }}>
            <div style={{ fontSize:16, fontWeight:800, color:T.primary }}>Ksh {prop.rent.toLocaleString()}</div>
            <div style={{ fontSize:10, color:T.textMuted }}>per month</div>
            <div style={{ fontSize:11, color:T.success, marginTop:4, fontWeight:600 }}>{prop.available?"✓ Available":"Taken"}</div>
          </div>
        </div>
        <div style={{ display:"flex", gap:6, marginTop:10 }}>
          {prop.bedrooms>0 && <div style={{ background:T.primarySoft, borderRadius:6, padding:"2px 8px", fontSize:11, color:T.primary, fontWeight:600 }}>🛏 {prop.bedrooms}BR</div>}
          <div style={{ background:T.primarySoft, borderRadius:6, padding:"2px 8px", fontSize:11, color:T.primary, fontWeight:600 }}>👁 {prop.agentViewings} viewings</div>
          <div style={{ background:T.accentSoft, borderRadius:6, padding:"2px 8px", fontSize:11, color:T.accentDark, fontWeight:600 }}>Viewing: Ksh {prop.viewingFee}</div>
        </div>
      </div>
    </div>
  );
}

function HousingScreen({ lang, town, showToast, onBack }) {
  const [view, setView]           = useState("list"); // list|detail|book|agent_reg|my_props|commission
  const [props, setProps]         = useState(PROPERTIES);
  const [selected, setSelected]   = useState(null);
  const [bookStep, setBookStep]   = useState(1);
  const [viewingDone, setViewingDone] = useState(false);
  const [tenantRating, setTenantRating] = useState(null);
  const [showTip, setShowTip]     = useState(false);
  const [tipAmount, setTipAmount] = useState("");
  const [houseTab, setHouseTab]   = useState("browse"); // browse|agents|post
  const [agentForm, setAgentForm] = useState({ name:"", phone:"", town:"Nakuru", stage:"", experience:"" });
  const [postForm, setPostForm]   = useState({ title:"", type:"Bedsitter", rent:"", town:"Nakuru", area:"", desc:"", bedrooms:"0", bathrooms:"1" });
  const [commissionNotice, setCommissionNotice] = useState(null);

  const filtered = props.filter(p=>town==="All"||p.town===town);

  // PROPERTY DETAIL
  if (view==="detail" && selected) {
    const prop = props.find(p=>p.id===selected);
    return (
      <div>
        <BackHeader title={prop.title} onBack={()=>setView("list")} />
        <div style={{ padding:16 }}>
          {/* Photo strip */}
          <div style={{ display:"flex", gap:8, marginBottom:16, overflowX:"auto" }}>
            {prop.photos.map((ph,i)=>(
              <div key={i} style={{ width:i===0?200:130, height:130, flexShrink:0, background:T.primarySoft, borderRadius:12, display:"flex", alignItems:"center", justifyContent:"center", fontSize:i===0?64:44 }}>{ph}</div>
            ))}
          </div>
          {/* Details */}
          <div style={{ background:T.card, borderRadius:14, padding:16, marginBottom:12, border:`1px solid ${T.border}` }}>
            <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start" }}>
              <div>
                <div style={{ fontSize:18, fontWeight:800, color:T.text }}>{prop.title}</div>
                <div style={{ fontSize:12, color:T.textMuted, marginTop:2 }}>📍 {prop.area}, {prop.town}</div>
                <div style={{ fontSize:12, color:T.textMuted, marginTop:2 }}>🏠 {prop.type}{prop.bedrooms>0?` · ${prop.bedrooms} Bedroom${prop.bedrooms>1?"s":""}`:" · Bedsitter"}</div>
              </div>
              <div style={{ textAlign:"right" }}>
                <div style={{ fontSize:22, fontWeight:900, color:T.primary }}>Ksh {prop.rent.toLocaleString()}</div>
                <div style={{ fontSize:11, color:T.textMuted }}>per month</div>
              </div>
            </div>
            <div style={{ marginTop:12, fontSize:13, color:T.textMid, lineHeight:1.6 }}>{prop.desc}</div>
            <div style={{ display:"flex", flexWrap:"wrap", gap:6, marginTop:12 }}>
              {prop.amenities.map(a=>(
                <div key={a} style={{ background:T.primarySoft, borderRadius:8, padding:"4px 10px", fontSize:11, color:T.primary, fontWeight:600 }}>✓ {a}</div>
              ))}
            </div>
          </div>
          {/* Agent card */}
          <div style={{ background:T.card, borderRadius:14, padding:14, marginBottom:12, border:`1px solid ${T.border}` }}>
            <SecTitle style={{ marginBottom:8 }}>Listed by Agent</SecTitle>
            <div style={{ display:"flex", alignItems:"center", gap:12 }}>
              <div style={{ width:46, height:46, borderRadius:"50%", background:T.primary, display:"flex", alignItems:"center", justifyContent:"center", color:"#fff", fontWeight:800, fontSize:20 }}>{prop.agent[0]}</div>
              <div style={{ flex:1 }}>
                <div style={{ fontWeight:700, color:T.text }}>{prop.agent}</div>
                <Stars rating={prop.agentRating} size={12} />
                <div style={{ fontSize:11, color:T.textMuted, marginTop:2 }}>{prop.agentViewings} successful viewings</div>
              </div>
              {prop.verified && <Pill color={T.success} bg={T.successSoft}>✓ Verified</Pill>}
            </div>
          </div>
          {/* Strike warning */}
          {prop.strikes>0 && (
            <div style={{ background:T.coralSoft, borderRadius:12, padding:12, marginBottom:12, border:`1px solid ${T.coral}`, fontSize:12, color:T.coral }}>
              ⚠️ This agent has {prop.strikes} fake listing strike{prop.strikes>1?"s":""}. Proceed with caution. Your viewing fee is fully refunded if the house is not as described.
            </div>
          )}
          {/* Viewing fee notice */}
          <div style={{ background:T.successSoft, borderRadius:12, padding:12, marginBottom:16, fontSize:12, color:"#145A36", lineHeight:1.6 }}>
            🔒 <strong>How viewing works:</strong> Pay Ksh {prop.viewingFee} to book. Money held in escrow. After viewing, you rate the house. If genuine — agent gets Ksh 100, KaziApa keeps Ksh 50. If fake — full refund to you + agent gets a strike.
          </div>
          <button onClick={()=>{ setBookStep(1); setView("book"); }}
            style={{ width:"100%", padding:16, background:T.primary, color:"#fff", border:"none", borderRadius:14, fontSize:16, fontWeight:800, cursor:"pointer" }}>
            📅 Book Viewing — Ksh {prop.viewingFee}
          </button>
          <button onClick={()=>{
            const commission = Math.round(props.find(p=>p.id===selected).rent * 0.1);
            setCommissionNotice({ agent:prop.agent, property:prop.title, rent:prop.rent, commission });
            setView("commission");
          }} style={{ width:"100%", padding:13, background:T.card, color:T.primary, border:`1px solid ${T.primary}`, borderRadius:14, fontSize:14, fontWeight:700, cursor:"pointer", marginTop:10 }}>
            🏠 I Have Taken This House
          </button>
        </div>
      </div>
    );
  }

  // BOOK VIEWING
  if (view==="book" && selected) {
    const prop = props.find(p=>p.id===selected);
    return (
      <div>
        <BackHeader title="Book Viewing" onBack={()=>setView("detail")} />
        <div style={{ padding:16 }}>
          {/* Steps */}
          <div style={{ display:"flex", gap:4, marginBottom:20 }}>
            {["Pay","Confirm","Rate"].map((s,i)=>(
              <div key={s} style={{ flex:1, display:"flex", flexDirection:"column", alignItems:"center" }}>
                <div style={{ width:28, height:28, borderRadius:"50%", background:bookStep>i?T.success:bookStep===i+1?T.primary:T.border, color:bookStep>=i+1?"#fff":T.textMuted, display:"flex", alignItems:"center", justifyContent:"center", fontSize:12, fontWeight:800 }}>{bookStep>i?"✓":i+1}</div>
                <div style={{ fontSize:10, color:bookStep===i+1?T.primary:T.textMuted, marginTop:4, fontWeight:bookStep===i+1?700:400 }}>{s}</div>
              </div>
            ))}
          </div>

          {bookStep===1 && (
            <div>
              <div style={{ background:T.card, borderRadius:14, padding:16, marginBottom:14, border:`1px solid ${T.border}` }}>
                <SecTitle>Payment Summary</SecTitle>
                {[["Property", prop.title],["Agent", prop.agent],["Viewing Fee","Ksh 150"],["Goes to Agent","Ksh 100"],["KaziApa Fee","Ksh 50"]].map(([k,v])=>(
                  <div key={k} style={{ display:"flex", justifyContent:"space-between", marginBottom:10, fontSize:14 }}>
                    <span style={{ color:T.textMid }}>{k}</span><span style={{ fontWeight:600 }}>{v}</span>
                  </div>
                ))}
                <div style={{ borderTop:`1px solid ${T.border}`, paddingTop:10, display:"flex", justifyContent:"space-between", fontSize:15, fontWeight:900 }}>
                  <span>Total to Pay</span><span style={{ color:T.primary }}>Ksh 150</span>
                </div>
              </div>
              <div style={{ background:T.card, borderRadius:14, padding:16, marginBottom:14, border:`1px solid ${T.border}` }}>
                <SecTitle>Pay via M-Pesa</SecTitle>
                <div style={{ background:T.surface, borderRadius:11, padding:14, marginBottom:12, fontSize:13, color:T.textMid, lineHeight:2 }}>
                  <div>1. M-Pesa → <strong>Lipa Na M-Pesa → Pay Bill</strong></div>
                  <div>2. Business No: <strong style={{ color:T.primary }}>522522</strong></div>
                  <div>3. Account: <strong style={{ color:T.primary }}>VIEW{prop.id}KZP</strong></div>
                  <div>4. Amount: <strong style={{ color:T.primary }}>Ksh 150</strong></div>
                </div>
                <input placeholder="M-Pesa confirmation code e.g. QHX1234ABC"
                  style={{ width:"100%", padding:"11px 13px", borderRadius:11, border:`1px solid ${T.border}`, fontSize:14, boxSizing:"border-box", color:T.text }} />
              </div>
              <button onClick={()=>{ setBookStep(2); showToast("Payment confirmed! Viewing booked."); }}
                style={{ width:"100%", padding:15, background:T.success, color:"#fff", border:"none", borderRadius:13, fontSize:15, fontWeight:800, cursor:"pointer" }}>
                Confirm Payment ✓
              </button>
            </div>
          )}

          {bookStep===2 && !viewingDone && (
            <div>
              <div style={{ textAlign:"center", padding:"20px 0" }}>
                <div style={{ fontSize:60 }}>📅</div>
                <div style={{ fontSize:18, fontWeight:800, color:T.text, marginTop:12 }}>Viewing Booked!</div>
                <div style={{ fontSize:13, color:T.textMuted, marginTop:8, lineHeight:1.6, padding:"0 10px" }}>
                  Agent <strong>{prop.agent}</strong> has been notified and will contact you within 2 hours to confirm viewing time.
                </div>
              </div>
              <div style={{ background:T.card, borderRadius:14, padding:16, marginBottom:14, border:`1px solid ${T.border}` }}>
                <div style={{ fontWeight:700, color:T.text, marginBottom:8 }}>📍 Property Location</div>
                <div style={{ fontSize:13, color:T.textMid }}>{prop.area}, {prop.town}</div>
                <div style={{ fontSize:12, color:T.textMuted, marginTop:6 }}>Booking ID: VIEW-{prop.id}-{Date.now().toString().slice(-4)}</div>
              </div>
              <div style={{ background:T.successSoft, borderRadius:12, padding:12, marginBottom:16, fontSize:12, color:"#145A36", lineHeight:1.5 }}>
                💡 Your Ksh 150 is held safely. After viewing, rate the house to release agent payment. If house is fake — full refund automatically.
              </div>
              <button onClick={()=>setViewingDone(true)}
                style={{ width:"100%", padding:14, background:T.primary, color:"#fff", border:"none", borderRadius:13, fontSize:15, fontWeight:800, cursor:"pointer" }}>
                ✓ I Have Done the Viewing
              </button>
            </div>
          )}

          {bookStep===2 && viewingDone && tenantRating===null && (
            <div style={{ padding:"10px 0" }}>
              <div style={{ fontSize:18, fontWeight:800, color:T.text, textAlign:"center", marginBottom:8 }}>Rate this Viewing</div>
              <div style={{ fontSize:13, color:T.textMuted, textAlign:"center", marginBottom:24 }}>Was the house exactly as described in the listing?</div>
              <button onClick={()=>{
                setTenantRating("genuine");
                showToast("Thank you! Agent paid Ksh 100. KaziApa earned Ksh 50.");
                setBookStep(3);
              }} style={{ width:"100%", padding:16, background:T.success, color:"#fff", border:"none", borderRadius:13, fontSize:15, fontWeight:800, cursor:"pointer", marginBottom:12 }}>
                ✅ Yes — House is Genuine
              </button>
              <button onClick={()=>{
                setTenantRating("fake");
                setProps(prev=>prev.map(p=>p.id===selected?{...p,strikes:p.strikes+1}:p));
                showToast("Refund issued! Agent received a strike.", "error");
                setBookStep(3);
              }} style={{ width:"100%", padding:16, background:T.coral, color:"#fff", border:"none", borderRadius:13, fontSize:15, fontWeight:800, cursor:"pointer" }}>
                ❌ No — House Not as Described
              </button>
            </div>
          )}

          {bookStep===3 && (
            <div style={{ textAlign:"center", padding:"20px 0" }}>
              {tenantRating==="genuine" ? (
                <>
                  <div style={{ fontSize:60 }}>🎉</div>
                  <div style={{ fontSize:18, fontWeight:800, color:T.text, marginTop:12 }}>Viewing Complete!</div>
                  <div style={{ fontSize:13, color:T.textMuted, marginTop:8, lineHeight:1.6 }}>
                    Agent {prop.agent} has been paid Ksh 100. If you decide to take this house, tap below.
                  </div>
                  {!showTip ? (
                    <button onClick={()=>setShowTip(true)} style={{ width:"100%", padding:13, background:T.accentSoft, color:T.accentDark, border:`1px solid ${T.accent}`, borderRadius:12, fontSize:14, fontWeight:700, cursor:"pointer", marginTop:20 }}>
                      💝 Tip the Agent (up to Ksh 500)
                    </button>
                  ) : (
                    <div style={{ background:T.card, borderRadius:14, padding:16, marginTop:16, border:`1px solid ${T.accent}` }}>
                      <div style={{ fontSize:13, fontWeight:700, color:T.text, marginBottom:10 }}>Send tip to {prop.agent}</div>
                      <div style={{ display:"flex", gap:8, marginBottom:10 }}>
                        {[100,200,300,500].map(amt=>(
                          <div key={amt} onClick={()=>setTipAmount(amt.toString())} style={{ flex:1, padding:"8px 0", textAlign:"center", background:tipAmount===amt.toString()?T.accent:T.surface, color:tipAmount===amt.toString()?T.primary:T.textMid, borderRadius:10, fontWeight:700, fontSize:13, cursor:"pointer", border:`1px solid ${tipAmount===amt.toString()?T.accent:T.border}` }}>
                            {amt}
                          </div>
                        ))}
                      </div>
                      <button onClick={()=>{ if(tipAmount){ showToast(`Tip of Ksh ${tipAmount} sent to ${prop.agent}! 🙏`); setShowTip(false); } }}
                        style={{ width:"100%", padding:11, background:T.accent, color:T.primary, border:"none", borderRadius:10, fontSize:14, fontWeight:800, cursor:"pointer" }}>
                        Send Ksh {tipAmount||"..."} Tip
                      </button>
                    </div>
                  )}
                </>
              ) : (
                <>
                  <div style={{ fontSize:60 }}>💔</div>
                  <div style={{ fontSize:18, fontWeight:800, color:T.text, marginTop:12 }}>House Was Fake</div>
                  <div style={{ fontSize:13, color:T.textMuted, marginTop:8, lineHeight:1.6 }}>Your Ksh 150 has been fully refunded. The agent received a strike. 3 strikes = permanent suspension.</div>
                </>
              )}
              <button onClick={()=>{ setView("list"); setBookStep(1); setViewingDone(false); setTenantRating(null); setShowTip(false); setTipAmount(""); }}
                style={{ width:"100%", padding:14, background:T.primary, color:"#fff", border:"none", borderRadius:13, fontSize:15, fontWeight:800, cursor:"pointer", marginTop:20 }}>
                Back to Properties
              </button>
            </div>
          )}
        </div>
      </div>
    );
  }

  // COMMISSION NOTICE
  if (view==="commission" && commissionNotice) {
    return (
      <div>
        <BackHeader title="Commission Notice" onBack={()=>setView("detail")} />
        <div style={{ padding:16 }}>
          <div style={{ textAlign:"center", marginBottom:20 }}>
            <div style={{ fontSize:56 }}>🤝</div>
            <div style={{ fontSize:18, fontWeight:800, color:T.text, marginTop:12 }}>Congratulations on Your New Home!</div>
          </div>
          <div style={{ background:T.primarySoft, borderRadius:16, padding:20, marginBottom:16, border:`1px solid ${T.primary}` }}>
            <div style={{ fontSize:13, fontWeight:700, color:T.textMuted, marginBottom:12, letterSpacing:0.5 }}>AGENT COMMISSION NOTICE</div>
            <div style={{ fontSize:15, color:T.text, lineHeight:1.8 }}>
              This tenant was connected to <strong>{commissionNotice.property}</strong> by agent <strong>{commissionNotice.agent}</strong> through <strong>KaziApa</strong>.
            </div>
            <div style={{ marginTop:16, background:T.card, borderRadius:12, padding:14 }}>
              {[["Monthly Rent",`Ksh ${commissionNotice.rent.toLocaleString()}`],["Standard Agent Fee","10% of monthly rent"],["Amount Due to Agent",`Ksh ${commissionNotice.commission.toLocaleString()}`]].map(([k,v])=>(
                <div key={k} style={{ display:"flex", justifyContent:"space-between", marginBottom:8, fontSize:14 }}>
                  <span style={{ color:T.textMid }}>{k}</span><span style={{ fontWeight:700, color:T.text }}>{v}</span>
                </div>
              ))}
            </div>
            <div style={{ marginTop:12, fontSize:12, color:T.textMuted, lineHeight:1.5 }}>
              Show this screen to your landlord. Commission can be paid directly to the agent via M-Pesa or cash as agreed between all parties.
            </div>
          </div>
          <button onClick={()=>showToast("Commission notice shared!")}
            style={{ width:"100%", padding:14, background:T.primary, color:"#fff", border:"none", borderRadius:13, fontSize:15, fontWeight:800, cursor:"pointer", marginBottom:10 }}>
            📤 Share with Landlord
          </button>
          <button onClick={()=>setView("list")} style={{ width:"100%", padding:13, background:T.card, color:T.primary, border:`1px solid ${T.primary}`, borderRadius:13, fontSize:14, fontWeight:700, cursor:"pointer" }}>
            Back to Properties
          </button>
        </div>
      </div>
    );
  }

  // AGENT REGISTRATION
  if (view==="agent_reg") {
    return (
      <div>
        <BackHeader title="Become a KaziApa Agent" onBack={()=>setView("list")} />
        <div style={{ padding:16 }}>
          <div style={{ background:T.primarySoft, borderRadius:14, padding:16, marginBottom:18, border:`1px solid ${T.primary}` }}>
            <div style={{ fontWeight:800, color:T.text, fontSize:15, marginBottom:8 }}>🤝 How Agent Earning Works</div>
            {[["Every viewing you arrange","Ksh 100"],["Tenant tips (optional, max)","Ksh 500"],["When tenant rents (from landlord)","10% of monthly rent"]].map(([k,v])=>(
              <div key={k} style={{ display:"flex", justifyContent:"space-between", marginBottom:8, fontSize:13 }}>
                <span style={{ color:T.textMid }}>{k}</span><span style={{ fontWeight:700, color:T.primary }}>{v}</span>
              </div>
            ))}
          </div>
          {[{ label:"Your Full Name", field:"name", ph:"John Kamau" },
            { label:"Phone Number",  field:"phone", ph:"0712345678" },
            { label:"Your Area/Stage", field:"stage", ph:"e.g. Kibuye Stage, Nakuru CBD" },
            { label:"Experience (optional)", field:"experience", ph:"e.g. 2 years in real estate" }
          ].map(f=>(
            <div key={f.field} style={{ marginBottom:14 }}>
              <label style={{ fontSize:12, fontWeight:700, color:T.text, display:"block", marginBottom:7 }}>{f.label}</label>
              <input value={agentForm[f.field]} onChange={e=>setAgentForm({...agentForm,[f.field]:e.target.value})} placeholder={f.ph}
                style={{ width:"100%", padding:"11px 13px", borderRadius:11, border:`1px solid ${T.border}`, fontSize:14, color:T.text, boxSizing:"border-box" }} />
            </div>
          ))}
          <div style={{ marginBottom:18 }}>
            <label style={{ fontSize:12, fontWeight:700, color:T.text, display:"block", marginBottom:7 }}>Town</label>
            <select value={agentForm.town} onChange={e=>setAgentForm({...agentForm,town:e.target.value})}
              style={{ width:"100%", padding:"11px 13px", borderRadius:11, border:`1px solid ${T.border}`, fontSize:14, color:T.text, background:"#fff" }}>
              {TOWNS.map(t=><option key={t}>{t}</option>)}
            </select>
          </div>
          <div style={{ background:T.successSoft, borderRadius:12, padding:12, marginBottom:18, fontSize:12, color:"#145A36", lineHeight:1.5 }}>
            ✅ Anyone can become an agent. No ID required to start. Your reputation is built through ratings from tenants after each viewing.
          </div>
          <button onClick={()=>{ if(agentForm.name&&agentForm.phone){ showToast("Agent profile created! Start listing properties."); setView("my_props"); } }}
            style={{ width:"100%", padding:15, background:T.primary, color:"#fff", border:"none", borderRadius:13, fontSize:15, fontWeight:800, cursor:"pointer" }}>
            Register as Agent →
          </button>
        </div>
      </div>
    );
  }

  // POST PROPERTY
  if (view==="my_props") {
    const TYPES = ["Bedsitter","Single Room","1 Bedroom","2 Bedrooms","3 Bedrooms","House","Maisonette"];
    return (
      <div>
        <BackHeader title="Post a Property" onBack={()=>setView("list")} />
        <div style={{ padding:16 }}>
          <div style={{ background:T.accentSoft, borderRadius:12, padding:12, marginBottom:16, fontSize:12, color:T.accentDark, lineHeight:1.5 }}>
            ⚡ Listings go live immediately. Build your rating by arranging genuine viewings. Fake listings = strikes. 3 strikes = suspension.
          </div>
          {[{ label:"Property Title", field:"title", ph:"e.g. Modern 1BR Apartment in Milimani" },
            { label:"Monthly Rent (Ksh)", field:"rent", ph:"12000", type:"number" },
            { label:"Area / Estate", field:"area", ph:"e.g. Milimani, Kondele, Westlands" },
            { label:"Description", field:"desc", ph:"Describe the property clearly — size, condition, what's included...", rows:4 }
          ].map(f=>(
            <div key={f.field} style={{ marginBottom:14 }}>
              <label style={{ fontSize:12, fontWeight:700, color:T.text, display:"block", marginBottom:7 }}>{f.label}</label>
              {f.rows
                ? <textarea value={postForm[f.field]} onChange={e=>setPostForm({...postForm,[f.field]:e.target.value})} placeholder={f.ph} rows={f.rows}
                    style={{ width:"100%", padding:"11px 13px", borderRadius:11, border:`1px solid ${T.border}`, fontSize:14, color:T.text, resize:"none", boxSizing:"border-box" }} />
                : <input value={postForm[f.field]} onChange={e=>setPostForm({...postForm,[f.field]:e.target.value})} placeholder={f.ph} type={f.type||"text"}
                    style={{ width:"100%", padding:"11px 13px", borderRadius:11, border:`1px solid ${T.border}`, fontSize:14, color:T.text, boxSizing:"border-box" }} />
              }
            </div>
          ))}
          <div style={{ display:"flex", gap:10, marginBottom:14 }}>
            {[{ label:"Type", field:"type", opts:TYPES },{ label:"Town", field:"town", opts:TOWNS }].map(f=>(
              <div key={f.field} style={{ flex:1 }}>
                <label style={{ fontSize:12, fontWeight:700, color:T.text, display:"block", marginBottom:7 }}>{f.label}</label>
                <select value={postForm[f.field]} onChange={e=>setPostForm({...postForm,[f.field]:e.target.value})}
                  style={{ width:"100%", padding:"11px 10px", borderRadius:11, border:`1px solid ${T.border}`, fontSize:13, color:T.text, background:"#fff" }}>
                  {f.opts.map(o=><option key={o}>{o}</option>)}
                </select>
              </div>
            ))}
          </div>
          <button onClick={()=>{
            if(postForm.title&&postForm.rent){
              const newProp = { id:`P${Date.now()}`, title:postForm.title, rent:parseInt(postForm.rent), town:postForm.town, area:postForm.area||postForm.town, agent:"You", agentRating:0, agentViewings:0, verified:false, type:postForm.type, bedrooms:parseInt(postForm.bedrooms)||0, bathrooms:parseInt(postForm.bathrooms)||1, desc:postForm.desc, amenities:[], photos:["🏠"], available:true, viewingFee:150, strikes:0 };
              setProps(prev=>[newProp,...prev]);
              showToast("Property listed! It's now live on KaziApa.");
              setPostForm({ title:"", type:"Bedsitter", rent:"", town:"Nakuru", area:"", desc:"", bedrooms:"0", bathrooms:"1" });
              setView("list");
            }
          }} style={{ width:"100%", padding:15, background:T.primary, color:"#fff", border:"none", borderRadius:13, fontSize:15, fontWeight:800, cursor:"pointer" }}>
            Post Property — Goes Live Immediately →
          </button>
        </div>
      </div>
    );
  }

  // MAIN LIST
  return (
    <div>
      <div style={{ background:T.primary, padding:"16px 16px 0" }}>
        <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:12 }}>
          <div onClick={onBack} style={{ color:"#fff", fontSize:22, cursor:"pointer" }}>←</div>
          <div style={{ color:"#fff", fontWeight:800, fontSize:16, flex:1, marginLeft:10 }}>🏠 Housing & Rentals</div>
        </div>
        <div style={{ display:"flex", gap:6, paddingBottom:14 }}>
          {[["browse","Browse"],["agents","Become Agent"],["my_props","Post Property"]].map(([tab,label])=>(
            <div key={tab} onClick={()=>setHouseTab(tab)} style={{ background:houseTab===tab?T.accent:"rgba(255,255,255,0.12)", color:houseTab===tab?T.primary:"#fff", borderRadius:20, padding:"5px 14px", fontSize:12, fontWeight:700, cursor:"pointer", whiteSpace:"nowrap" }}>{label}</div>
          ))}
        </div>
      </div>

      {houseTab==="browse" && (
        <div style={{ padding:16 }}>
          <div style={{ background:T.primarySoft, borderRadius:12, padding:12, marginBottom:16, fontSize:12, color:T.primary, lineHeight:1.5 }}>
            🤝 All agents are rated by tenants. Viewing fee: Ksh 150 (fully refunded if listing is fake). <strong>Anyone can become an agent.</strong>
          </div>
          {filtered.length===0
            ? <div style={{ textAlign:"center", padding:"40px 0", color:T.textMuted }}>
                <div style={{ fontSize:44 }}>🏠</div>
                <div style={{ fontWeight:700, marginTop:12, color:T.text }}>No properties in {town==="All"?"your area":town} yet.</div>
                <button onClick={()=>setHouseTab("my_props")} style={{ marginTop:16, background:T.primary, color:"#fff", border:"none", borderRadius:10, padding:"10px 22px", fontSize:13, fontWeight:700, cursor:"pointer" }}>Post a Property</button>
              </div>
            : filtered.map(prop=>(
              <PropertyCard key={prop.id} prop={prop} lang="en" onClick={()=>{ setSelected(prop.id); setView("detail"); }} />
            ))
          }
        </div>
      )}

      {houseTab==="agents" && (
        <div style={{ padding:16 }}>
          <div style={{ background:T.primarySoft, borderRadius:14, padding:16, marginBottom:16, border:`1px solid ${T.primary}` }}>
            <div style={{ fontWeight:800, color:T.text, fontSize:16, marginBottom:8 }}>Earn as a KaziApa Housing Agent</div>
            {[["📅 Per viewing arranged","Ksh 100 automatic"],["💝 Tenant tip (optional)","Up to Ksh 500"],["🏠 When tenant rents","10% of monthly rent from landlord"],["📋 No ID required","Build trust through ratings"]].map(([k,v])=>(
              <div key={k} style={{ display:"flex", justifyContent:"space-between", marginBottom:8, fontSize:13 }}>
                <span style={{ color:T.textMid }}>{k}</span><span style={{ fontWeight:700, color:T.primary }}>{v}</span>
              </div>
            ))}
          </div>
          <SecTitle>Top Agents</SecTitle>
          {PROPERTIES.map(p=>(
            <div key={p.id} style={{ background:T.card, borderRadius:14, padding:14, marginBottom:10, border:`1px solid ${T.border}`, display:"flex", alignItems:"center", gap:12 }}>
              <div style={{ width:46, height:46, borderRadius:"50%", background:T.primary, display:"flex", alignItems:"center", justifyContent:"center", color:"#fff", fontWeight:800, fontSize:20 }}>{p.agent[0]}</div>
              <div style={{ flex:1 }}>
                <div style={{ fontWeight:700, color:T.text }}>{p.agent}</div>
                <Stars rating={p.agentRating} />
                <div style={{ fontSize:11, color:T.textMuted, marginTop:2 }}>{p.agentViewings} viewings · {p.town}</div>
              </div>
              {p.verified && <Pill color={T.success} bg={T.successSoft}>✓ Verified</Pill>}
            </div>
          ))}
          <button onClick={()=>setView("agent_reg")}
            style={{ width:"100%", padding:15, background:T.primary, color:"#fff", border:"none", borderRadius:13, fontSize:15, fontWeight:800, cursor:"pointer", marginTop:8 }}>
            🤝 Register as Agent →
          </button>
        </div>
      )}

      {houseTab==="my_props" && (
        <div style={{ padding:16 }}>
          <button onClick={()=>setView("my_props")} style={{ width:"100%", padding:15, background:T.primary, color:"#fff", border:"none", borderRadius:13, fontSize:15, fontWeight:800, cursor:"pointer" }}>
            + Post a New Property
          </button>
        </div>
      )}
    </div>
  );
}

// ─── SMART CHAT ─────────────────────────────────────────────────────────────
function SmartChat({ lang, listing, userPlan, msgs, setMsgs, onBack, onCheckout, onUpgrade }) {
  const [input, setInput]           = useState("");
  const [showPay, setShowPay]       = useState(false);
  const [showDelivery, setShowDelivery] = useState(false);
  const [dStep, setDStep]           = useState(1);
  const [zone, setZone]             = useState(null);
  const [rider, setRider]           = useState(null);
  const myCount = msgs.filter(m=>m.from==="me").length;
  const limited = userPlan==="free" && myCount>=5;
  const nearRiders = RIDERS.filter(r=>r.town===listing?.town && r.available);

  function send() {
    if (!input.trim()||limited) return;
    if (PHONE_RGX.test(input)||CONTACT_RGX.test(input)) {
      setMsgs(p=>[...p,{ from:"system", text:"⚠️ Phone numbers can't be shared here for your safety. Complete your deal securely through KaziApa." }]);
      setInput(""); setTimeout(()=>setShowPay(true),400); return;
    }
    if (DEAL_RGX.test(input)&&myCount>=2) setTimeout(()=>setShowPay(true),1200);
    if (myCount===7) setTimeout(()=>setMsgs(p=>[...p,{ from:"system", text:"💡 Looks like you're close to a deal! Tap 'Pay Now' below to complete safely." }]),900);
    setMsgs(p=>[...p,{ from:"me", text:input }]);
    setInput("");
    setTimeout(()=>setMsgs(p=>[...p,{ from:"seller", text:"Got it, one moment..." }]),1100);
  }

  if (showDelivery) {
    const delCost = zone?.price||rider?.price||250;
    const total = (listing?.price||0)+50+delCost;
    return (
      <div style={{ fontFamily:"'Segoe UI',system-ui,sans-serif", background:T.surface, minHeight:"100vh", maxWidth:430, margin:"0 auto" }}>
        <BackHeader title="Choose Delivery" onBack={()=>{ if(dStep>1)setDStep(dStep-1); else setShowDelivery(false); }} right={<span style={{ fontSize:11, color:"rgba(255,255,255,0.6)" }}>{dStep}/3</span>} />
        <div style={{ padding:16 }}>
          <div style={{ display:"flex", gap:4, marginBottom:20 }}>
            {["Zone","Rider","Confirm"].map((s,i)=>(
              <div key={s} style={{ flex:1, height:4, borderRadius:2, background:dStep>i?T.success:dStep===i+1?T.accent:T.border }} />
            ))}
          </div>
          {dStep===1 && (
            <div>
              <SecTitle>Where is the buyer?</SecTitle>
              {DELIVERY_ZONES.map(z=>(
                <div key={z.id} onClick={()=>setZone(z)} style={{ background:T.card, borderRadius:14, padding:16, marginBottom:10, cursor:"pointer", border:zone?.id===z.id?`2px solid ${T.success}`:`1px solid ${T.border}`, display:"flex", justifyContent:"space-between", alignItems:"center" }}>
                  <div>
                    <div style={{ fontWeight:700, color:T.text, fontSize:14 }}>{z.label}</div>
                    <div style={{ fontSize:12, color:T.textMuted, marginTop:2 }}>⏱ {z.time}</div>
                  </div>
                  <div style={{ textAlign:"right" }}>
                    <div style={{ fontSize:16, fontWeight:800, color:T.primary }}>Ksh {z.price}</div>
                    {zone?.id===z.id && <div style={{ fontSize:10, color:T.success }}>✓ Selected</div>}
                  </div>
                </div>
              ))}
              <button onClick={()=>{ if(zone) setDStep(zone.id==="parcel"?3:2); }} disabled={!zone}
                style={{ width:"100%", padding:14, background:zone?T.primary:T.border, color:"#fff", border:"none", borderRadius:13, fontSize:15, fontWeight:800, cursor:zone?"pointer":"default", marginTop:8 }}>
                Continue →
              </button>
            </div>
          )}
          {dStep===2 && (
            <div>
              <SecTitle>Select a Rider</SecTitle>
              {nearRiders.length===0 && (
                <div style={{ background:T.accentSoft, borderRadius:14, padding:16, marginBottom:14, textAlign:"center", border:`1px solid ${T.accent}` }}>
                  <div style={{ fontSize:32 }}>🚌</div>
                  <div style={{ fontWeight:700, color:T.text, marginTop:8 }}>No riders available nearby</div>
                  <div style={{ fontSize:12, color:T.textMuted, marginTop:4 }}>Use bus parcel instead</div>
                </div>
              )}
              {nearRiders.map(r=>(
                <div key={r.id} onClick={()=>setRider(r)} style={{ background:T.card, borderRadius:14, padding:14, marginBottom:10, cursor:"pointer", border:rider?.id===r.id?`2px solid ${T.success}`:`1px solid ${T.border}` }}>
                  <div style={{ display:"flex", alignItems:"center", gap:12 }}>
                    <div style={{ width:44, height:44, borderRadius:"50%", background:T.primary, display:"flex", alignItems:"center", justifyContent:"center", fontSize:22 }}>🏍️</div>
                    <div style={{ flex:1 }}>
                      <div style={{ fontWeight:700, color:T.text }}>{r.name}</div>
                      <div style={{ fontSize:12, color:T.textMuted }}>📍 {r.stage}</div>
                      <Stars rating={r.rating} />
                    </div>
                    <div style={{ textAlign:"right" }}>
                      <div style={{ background:T.successSoft, color:T.success, borderRadius:8, padding:"3px 10px", fontSize:11, fontWeight:700 }}>Available</div>
                      <div style={{ fontSize:13, fontWeight:800, color:T.primary, marginTop:4 }}>Ksh {zone?.price}</div>
                    </div>
                  </div>
                </div>
              ))}
              <div style={{ fontSize:11, fontWeight:700, color:T.textMuted, margin:"14px 0 8px", letterSpacing:0.5 }}>OR USE BUS PARCEL</div>
              {BUS.slice(0,2).map(b=>(
                <div key={b.name} onClick={()=>setRider({ id:b.name, name:b.name, bus:true, price:b.price, time:b.time })}
                  style={{ background:T.card, borderRadius:14, padding:14, marginBottom:8, cursor:"pointer", border:rider?.name===b.name?`2px solid ${T.success}`:`1px solid ${T.border}`, display:"flex", justifyContent:"space-between", alignItems:"center" }}>
                  <div><div style={{ fontWeight:700, color:T.text }}>🚌 {b.name}</div><div style={{ fontSize:12, color:T.textMuted }}>⏱ {b.time}</div></div>
                  <div style={{ fontSize:14, fontWeight:800, color:T.primary }}>Ksh {b.price}</div>
                </div>
              ))}
              <button onClick={()=>{ if(rider) setDStep(3); }} disabled={!rider}
                style={{ width:"100%", padding:14, background:rider?T.primary:T.border, color:"#fff", border:"none", borderRadius:13, fontSize:15, fontWeight:800, cursor:rider?"pointer":"default", marginTop:12 }}>
                Continue →
              </button>
            </div>
          )}
          {dStep===3 && (
            <div>
              <SecTitle>Confirm Order</SecTitle>
              <div style={{ background:T.card, borderRadius:14, padding:16, marginBottom:14, border:`1px solid ${T.border}` }}>
                {[["Item",listing?.title],["Seller",listing?.seller],["Location",listing?.location],["Item price",`Ksh ${listing?.price?.toLocaleString()}`],["Buyer protection","Ksh 50"],["Delivery",`Ksh ${delCost}`],...(rider&&!rider.bus?[["Rider",rider.name+" · "+rider.stage]]:[]),...(rider?.bus?[["Service",rider.name+" · "+rider.time]]:[])].map(([k,v])=>(
                  <div key={k} style={{ display:"flex", justifyContent:"space-between", marginBottom:10, fontSize:14 }}>
                    <span style={{ color:T.textMid }}>{k}</span><span style={{ fontWeight:600 }}>{v}</span>
                  </div>
                ))}
                <div style={{ borderTop:`1px solid ${T.border}`, paddingTop:10, display:"flex", justifyContent:"space-between", fontSize:16, fontWeight:900 }}>
                  <span>Total</span><span style={{ color:T.primary }}>Ksh {total.toLocaleString()}</span>
                </div>
              </div>
              {rider&&!rider.bus && (
                <div style={{ background:T.successSoft, borderRadius:12, padding:12, marginBottom:12, fontSize:12, color:"#145A36" }}>
                  🏍️ {rider.name} will be notified immediately to pick up from the seller.
                </div>
              )}
              <div style={{ background:T.successSoft, borderRadius:12, padding:12, marginBottom:16, fontSize:12, color:"#145A36" }}>
                🔒 Money held by KaziApa until you confirm receipt.
              </div>
              <button onClick={onCheckout} style={{ width:"100%", padding:16, background:T.primary, color:"#fff", border:"none", borderRadius:14, fontSize:16, fontWeight:800, cursor:"pointer" }}>
                Pay Now →
              </button>
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div style={{ fontFamily:"'Segoe UI',system-ui,sans-serif", display:"flex", flexDirection:"column", height:"100vh", maxWidth:430, margin:"0 auto", background:T.surface }}>
      <div style={{ background:T.primary, padding:"14px 16px", display:"flex", alignItems:"center", gap:12 }}>
        <div onClick={onBack} style={{ color:"#fff", fontSize:22, cursor:"pointer" }}>←</div>
        <div style={{ width:40, height:40, borderRadius:"50%", background:T.accent, display:"flex", alignItems:"center", justifyContent:"center", fontWeight:800, color:T.primary, fontSize:18 }}>{listing?.seller?.[0]}</div>
        <div style={{ flex:1 }}>
          <div style={{ color:"#fff", fontWeight:700, fontSize:14 }}>{listing?.seller}</div>
          {listing?.verified && <div style={{ fontSize:11, color:T.accent }}>✓ Verified · {listing?.town}</div>}
        </div>
        <div style={{ background:"rgba(255,255,255,0.12)", borderRadius:8, padding:"4px 10px", fontSize:11, color:"#fff" }}>
          {userPlan==="free"?`${Math.max(0,5-myCount)} left`:"∞"}
        </div>
      </div>
      {limited && (
        <div style={{ background:T.accentSoft, padding:"10px 16px", display:"flex", justifyContent:"space-between", alignItems:"center", borderBottom:`1px solid ${T.accent}` }}>
          <div style={{ fontSize:12, color:T.text }}>You've reached your 5 free messages today.</div>
          <div onClick={onUpgrade} style={{ fontSize:12, fontWeight:800, color:T.primary, cursor:"pointer" }}>Upgrade →</div>
        </div>
      )}
      <div style={{ flex:1, overflowY:"auto", padding:16, display:"flex", flexDirection:"column", gap:8 }}>
        <div style={{ textAlign:"center", fontSize:11, color:T.textMuted, background:T.surface, borderRadius:8, padding:"6px 12px", alignSelf:"center", border:`1px solid ${T.border}` }}>
          🔒 Phone numbers stay private. Payments go through KaziApa.
        </div>
        <div style={{ background:T.successSoft, borderRadius:12, padding:12, border:`1px solid ${T.success}`, fontSize:12 }}>
          <div style={{ fontWeight:700, color:T.text, marginBottom:2 }}>📍 Seller Location</div>
          <div style={{ color:T.textMid }}>{listing?.location}</div>
          <div style={{ color:T.textMuted, marginTop:4, fontSize:11 }}>You can visit personally to pick & choose, or request delivery — your choice.</div>
        </div>
        {msgs.map((msg,i)=>(
          <div key={i} style={{ display:"flex", justifyContent:msg.from==="me"?"flex-end":msg.from==="system"?"center":"flex-start" }}>
            {msg.from==="system"
              ? <div style={{ background:T.coralSoft, color:T.coral, borderRadius:10, padding:"8px 14px", maxWidth:"88%", fontSize:12, lineHeight:1.5, border:`1px solid ${T.coral}`, textAlign:"center" }}>{msg.text}</div>
              : <div style={{ background:msg.from==="me"?T.primary:T.card, color:msg.from==="me"?"#fff":T.text, borderRadius:msg.from==="me"?"16px 16px 4px 16px":"16px 16px 16px 4px", padding:"10px 14px", maxWidth:"76%", fontSize:14, lineHeight:1.4, border:msg.from==="me"?"none":`1px solid ${T.border}` }}>{msg.text}</div>
            }
          </div>
        ))}
        {showPay && (
          <div style={{ background:T.successSoft, borderRadius:14, padding:14, border:`1.5px solid ${T.success}` }}>
            <div style={{ fontWeight:700, color:T.text, fontSize:14, marginBottom:4 }}>✅ Ready to close this deal?</div>
            <div style={{ fontSize:12, color:T.textMuted, marginBottom:12 }}>Pay through KaziApa — your money is fully protected.</div>
            <div style={{ display:"flex", gap:8, flexWrap:"wrap" }}>
              <button onClick={()=>setShowDelivery(true)} style={{ flex:1, padding:"10px 6px", background:T.primary, color:"#fff", border:"none", borderRadius:10, fontSize:12, fontWeight:800, cursor:"pointer", minWidth:100 }}>🏍️ Arrange Delivery</button>
              <button onClick={onCheckout} style={{ flex:1, padding:"10px 6px", background:T.success, color:"#fff", border:"none", borderRadius:10, fontSize:12, fontWeight:800, cursor:"pointer", minWidth:100 }}>💳 Pay Directly</button>
              <button onClick={()=>{ setMsgs(p=>[...p,{ from:"system", text:"📍 Seller is at: "+listing?.location+". You can visit personally to pick items and pay on the spot." }]); setShowPay(false); }}
                style={{ width:"100%", padding:"10px 6px", background:T.accentSoft, color:T.accentDark, border:`1px solid ${T.accent}`, borderRadius:10, fontSize:12, fontWeight:800, cursor:"pointer", marginTop:4 }}>
                🚗 I'll Visit in Person
              </button>
            </div>
          </div>
        )}
      </div>
      <div style={{ padding:"10px 16px 20px", background:T.card, borderTop:`1px solid ${T.border}` }}>
        {!showPay && myCount>=2 && (
          <div style={{ display:"flex", gap:6, marginBottom:8, overflowX:"auto" }}>
            {[{ label:"💳 Pay Now", action:()=>setShowPay(true) },{ label:"🏍️ Delivery", action:()=>setShowDelivery(true) },{ label:"🚗 Visit in Person", action:()=>setMsgs(p=>[...p,{ from:"system", text:"📍 Seller location: "+listing?.location }]) },{ label:"💬 Final price?", action:()=>setInput("What is your final price?") }].map(q=>(
              <div key={q.label} onClick={q.action} style={{ background:T.surface, color:T.textMid, borderRadius:20, padding:"4px 12px", fontSize:11, fontWeight:700, whiteSpace:"nowrap", cursor:"pointer", border:`1px solid ${T.border}`, flexShrink:0 }}>{q.label}</div>
            ))}
          </div>
        )}
        <div style={{ display:"flex", gap:8 }}>
          <input value={input} onChange={e=>setInput(e.target.value)} placeholder={limited?"Upgrade to continue...":"Type a message..."} disabled={limited}
            style={{ flex:1, padding:"11px 15px", borderRadius:24, border:`1px solid ${T.border}`, fontSize:14, outline:"none", background:limited?T.surface:T.card, color:T.text }}
            onKeyDown={e=>{ if(e.key==="Enter") send(); }} />
          <button onClick={send} style={{ width:44, height:44, borderRadius:"50%", background:T.primary, border:"none", color:"#fff", fontSize:20, cursor:"pointer", display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0 }}>↑</button>
        </div>
      </div>
    </div>
  );
}

// ─── REQUEST BOARD ───────────────────────────────────────────────────────────
function RequestBoard({ lang, town, setTown, showToast, userRole }) {
  const [requests, setRequests] = useState([
    { id:1, buyer:"Sarah M.",  town:"Kisumu",  area:"Kondele",   item:"Long socks for men",             budget:150,  category:"mitumba", time:"10 mins ago", responses:2 },
    { id:2, buyer:"John K.",   town:"Nakuru",  area:"CBD",       item:"Newborn baby clothes 0-3 months", budget:500, category:"mitumba", time:"25 mins ago", responses:0 },
    { id:3, buyer:"Aisha O.",  town:"Nairobi", area:"Westlands", item:"Fresh sukuma wiki 2 bundles",     budget:40,   category:"shamba",  time:"1 hr ago",    responses:1 },
    { id:4, buyer:"Peter N.",  town:"Mombasa", area:"Nyali",     item:"Plumber for bathroom tap",        budget:800,  category:"fundi",   time:"2 hrs ago",   responses:3 },
    { id:5, buyer:"Grace W.",  town:"Eldoret", area:"Town",      item:"Single room near CBD",            budget:5000, category:"nyumba",  time:"3 hrs ago",   responses:0 },
  ]);
  const [replies, setReplies] = useState({
    1:[{ seller:"Mama Stocks",  verified:true,  text:"Nina long socks — Ksh 120/pair. Niko Kondele stage.", time:"5 mins ago" },
       { seller:"Gikomba Picks",verified:true,  text:"Niko na socks 3 pairs Ksh 300. Grade A.", time:"8 mins ago" }],
    3:[{ seller:"Shamba Fresh", verified:false, text:"Niko na sukuma wiki fresh. Ksh 35 bundle.", time:"30 mins ago" }],
    4:[{ seller:"Fundi Hassan", verified:true,  text:"Plumber here. Ksh 600 tap repair. Available leo.", time:"1 hr ago" }],
  });
  const [showForm, setShowForm]   = useState(false);
  const [activeReq, setActiveReq] = useState(null);
  const [replyText, setReplyText] = useState("");
  const [form, setForm]           = useState({ item:"", budget:"", area:"", town:town!=="All"?town:"Nakuru", category:"mitumba" });
  const filtered = requests.filter(r=>town==="All"||r.town===town);

  if (activeReq) {
    const req = requests.find(r=>r.id===activeReq);
    const reqReplies = replies[activeReq]||[];
    return (
      <div>
        <BackHeader title="Request Details" onBack={()=>setActiveReq(null)}
          right={<div style={{ background:CAT_COLOR[req.category], borderRadius:8, padding:"3px 10px", fontSize:11, color:"#fff", fontWeight:700 }}>{CAT_ICON[req.category]} {req.category}</div>} />
        <div style={{ padding:16 }}>
          <div style={{ background:T.accentSoft, borderRadius:16, padding:16, marginBottom:16, border:`1px solid ${T.accent}` }}>
            <div style={{ display:"flex", justifyContent:"space-between", marginBottom:6 }}>
              <div style={{ fontWeight:800, color:T.text, fontSize:16, flex:1 }}>{req.item}</div>
              <div style={{ fontSize:15, fontWeight:800, color:T.primary }}>Ksh {req.budget}</div>
            </div>
            <div style={{ fontSize:12, color:T.textMuted }}>📍 {req.area}, {req.town} · {req.buyer} · {req.time}</div>
            <div style={{ marginTop:8, fontSize:12, color:T.success, fontWeight:600 }}>{reqReplies.length} responses so far</div>
          </div>
          <SecTitle>Seller Responses</SecTitle>
          {reqReplies.length===0
            ? <div style={{ textAlign:"center", padding:"30px 0", color:T.textMuted }}><div style={{ fontSize:36 }}>💬</div><div style={{ marginTop:8 }}>No responses yet. Be the first!</div></div>
            : reqReplies.map((r,i)=>(
              <div key={i} style={{ background:T.card, borderRadius:14, padding:14, marginBottom:10, border:`1px solid ${T.border}` }}>
                <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:8 }}>
                  <div style={{ display:"flex", alignItems:"center", gap:8 }}>
                    <div style={{ width:36, height:36, borderRadius:"50%", background:T.primary, display:"flex", alignItems:"center", justifyContent:"center", color:"#fff", fontWeight:800 }}>{r.seller[0]}</div>
                    <div><div style={{ fontWeight:700, color:T.text, fontSize:13 }}>{r.seller}</div>{r.verified&&<div style={{ fontSize:10, color:T.success, fontWeight:600 }}>✓ Verified</div>}</div>
                  </div>
                  <div style={{ fontSize:11, color:T.textMuted }}>{r.time}</div>
                </div>
                <div style={{ fontSize:13, color:T.textMid, lineHeight:1.5, marginBottom:10 }}>{r.text}</div>
                <button onClick={()=>showToast("Opening chat with "+r.seller)} style={{ width:"100%", padding:9, background:T.primary, color:"#fff", border:"none", borderRadius:10, fontSize:13, fontWeight:700, cursor:"pointer" }}>
                  💬 Chat with Seller
                </button>
              </div>
            ))
          }
          {(userRole==="seller"||true) && (
            <div style={{ background:T.card, borderRadius:16, padding:16, marginTop:8, border:`1.5px solid ${T.primaryLight}` }}>
              <SecTitle>Respond to this Request</SecTitle>
              <textarea value={replyText} onChange={e=>setReplyText(e.target.value)} placeholder="Describe what you have, your price, and location..." rows={3}
                style={{ width:"100%", padding:"11px 13px", borderRadius:11, border:`1px solid ${T.border}`, fontSize:14, resize:"none", boxSizing:"border-box", color:T.text }} />
              <button onClick={()=>{ if(replyText.trim()){ setReplies(p=>({...p,[activeReq]:[...(p[activeReq]||[]),{ seller:"You", verified:false, text:replyText, time:"Just now" }]})); setRequests(p=>p.map(r=>r.id===activeReq?{...r,responses:r.responses+1}:r)); setReplyText(""); showToast("Response sent!"); } }}
                style={{ width:"100%", padding:12, background:T.primary, color:"#fff", border:"none", borderRadius:11, fontSize:14, fontWeight:700, cursor:"pointer", marginTop:10 }}>
                Send Response →
              </button>
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div>
      <div style={{ background:T.primary, padding:"16px 16px 0", borderRadius:"0 0 18px 18px" }}>
        <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:12 }}>
          <div>
            <div style={{ color:T.accent, fontSize:10, fontWeight:700, letterSpacing:1 }}>LIVE BOARD</div>
            <div style={{ color:"#fff", fontWeight:800, fontSize:18 }}>Buyer Requests</div>
          </div>
          <button onClick={()=>setShowForm(true)} style={{ background:T.accent, border:"none", borderRadius:22, padding:"8px 16px", fontSize:13, fontWeight:800, color:T.primary, cursor:"pointer" }}>
            + Post Need
          </button>
        </div>
        <div style={{ display:"flex", gap:6, overflowX:"auto", paddingBottom:14 }}>
          {["All",...TOWNS.slice(0,7)].map(t=>(
            <div key={t} onClick={()=>setTown(t)} style={{ background:town===t?T.accent:"rgba(255,255,255,0.12)", color:town===t?T.primary:"#fff", borderRadius:20, padding:"4px 13px", fontSize:12, fontWeight:600, whiteSpace:"nowrap", cursor:"pointer", flexShrink:0 }}>
              {t==="All"?"All Towns":t}
            </div>
          ))}
        </div>
      </div>
      {showForm && (
        <div style={{ position:"fixed", inset:0, background:T.overlay, zIndex:150, display:"flex", alignItems:"flex-end", justifyContent:"center" }} onClick={()=>setShowForm(false)}>
          <div style={{ background:T.card, borderRadius:"22px 22px 0 0", padding:"24px 20px 36px", width:"100%", maxWidth:430 }} onClick={e=>e.stopPropagation()}>
            <div style={{ fontWeight:800, color:T.text, fontSize:17, marginBottom:16 }}>I Need...</div>
            <div style={{ marginBottom:12 }}>
              <label style={{ fontSize:12, fontWeight:700, color:T.text, display:"block", marginBottom:6 }}>What do you need?</label>
              <input value={form.item} onChange={e=>setForm({...form,item:e.target.value})} placeholder="e.g. Newborn socks size 0-3 months"
                style={{ width:"100%", padding:"11px 13px", borderRadius:11, border:`1px solid ${T.border}`, fontSize:14, boxSizing:"border-box", color:T.text }} />
            </div>
            <div style={{ display:"flex", gap:10, marginBottom:12 }}>
              <div style={{ flex:1 }}>
                <label style={{ fontSize:12, fontWeight:700, color:T.text, display:"block", marginBottom:6 }}>Budget (Ksh)</label>
                <input value={form.budget} onChange={e=>setForm({...form,budget:e.target.value})} type="number" placeholder="300"
                  style={{ width:"100%", padding:"11px 13px", borderRadius:11, border:`1px solid ${T.border}`, fontSize:14, boxSizing:"border-box", color:T.text }} />
              </div>
              <div style={{ flex:1 }}>
                <label style={{ fontSize:12, fontWeight:700, color:T.text, display:"block", marginBottom:6 }}>Your Area</label>
                <input value={form.area} onChange={e=>setForm({...form,area:e.target.value})} placeholder="e.g. Kondele"
                  style={{ width:"100%", padding:"11px 13px", borderRadius:11, border:`1px solid ${T.border}`, fontSize:14, boxSizing:"border-box", color:T.text }} />
              </div>
            </div>
            <div style={{ display:"flex", gap:10, marginBottom:18 }}>
              <div style={{ flex:1 }}>
                <label style={{ fontSize:12, fontWeight:700, color:T.text, display:"block", marginBottom:6 }}>Town</label>
                <select value={form.town} onChange={e=>setForm({...form,town:e.target.value})} style={{ width:"100%", padding:"11px 13px", borderRadius:11, border:`1px solid ${T.border}`, fontSize:14, color:T.text, background:"#fff" }}>
                  {TOWNS.map(t=><option key={t}>{t}</option>)}
                </select>
              </div>
              <div style={{ flex:1 }}>
                <label style={{ fontSize:12, fontWeight:700, color:T.text, display:"block", marginBottom:6 }}>Category</label>
                <select value={form.category} onChange={e=>setForm({...form,category:e.target.value})} style={{ width:"100%", padding:"11px 13px", borderRadius:11, border:`1px solid ${T.border}`, fontSize:14, color:T.text, background:"#fff" }}>
                  {CATEGORIES.map(c=><option key={c.id} value={c.id}>{c.icon} {c.en}</option>)}
                </select>
              </div>
            </div>
            <button onClick={()=>{ if(form.item.trim()&&form.budget){ setRequests(p=>[{ id:Date.now(), buyer:"You", town:form.town, area:form.area||form.town, item:form.item, budget:parseInt(form.budget), category:form.category, time:"Just now", responses:0 },...p]); setShowForm(false); setForm({ item:"", budget:"", area:"", town:"Nakuru", category:"mitumba" }); showToast("Request posted! Sellers can see it now."); } }}
              style={{ width:"100%", padding:14, background:T.primary, color:"#fff", border:"none", borderRadius:13, fontSize:15, fontWeight:800, cursor:"pointer" }}>
              Post Request →
            </button>
          </div>
        </div>
      )}
      <div style={{ margin:"14px 16px 0", background:T.successSoft, borderRadius:13, padding:"10px 14px", border:`1px solid ${T.success}`, fontSize:12, color:"#145A36" }}>
        💡 Sellers see these requests and respond directly. You pick the best offer.
      </div>
      <div style={{ padding:"14px 16px" }}>
        {filtered.length===0
          ? <div style={{ textAlign:"center", padding:"50px 0", color:T.textMuted }}>
              <div style={{ fontSize:44 }}>📋</div>
              <div style={{ fontWeight:700, fontSize:15, marginTop:12, color:T.text }}>No requests yet.</div>
              <button onClick={()=>setShowForm(true)} style={{ marginTop:16, background:T.primary, color:"#fff", border:"none", borderRadius:11, padding:"11px 24px", fontSize:14, fontWeight:700, cursor:"pointer" }}>+ Post a Need</button>
            </div>
          : filtered.map(req=>(
            <div key={req.id} onClick={()=>setActiveReq(req.id)} style={{ background:T.card, borderRadius:14, marginBottom:10, overflow:"hidden", border:req.responses===0?`1px solid ${T.border}`:`1.5px solid ${T.success}`, cursor:"pointer" }}>
              <div style={{ height:4, background:CAT_COLOR[req.category]||T.primary }} />
              <div style={{ padding:"12px 14px" }}>
                <div style={{ display:"flex", justifyContent:"space-between", gap:8 }}>
                  <div style={{ flex:1 }}>
                    <div style={{ fontWeight:700, color:T.text, fontSize:14 }}>{req.item}</div>
                    <div style={{ fontSize:11, color:T.textMuted, marginTop:3 }}>📍 {req.area}, {req.town} · {req.buyer} · {req.time}</div>
                  </div>
                  <div style={{ textAlign:"right", flexShrink:0 }}>
                    <div style={{ fontSize:15, fontWeight:800, color:T.primary }}>Ksh {req.budget}</div>
                    <div style={{ fontSize:10, color:T.textMuted }}>budget</div>
                  </div>
                </div>
                <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginTop:10 }}>
                  <div style={{ background:CAT_COLOR[req.category], borderRadius:6, padding:"2px 9px", fontSize:10, color:"#fff", fontWeight:700 }}>{CAT_ICON[req.category]} {req.category}</div>
                  {req.responses>0
                    ? <div style={{ background:T.successSoft, borderRadius:20, padding:"3px 10px", fontSize:11, fontWeight:700, color:T.success }}>✓ {req.responses} responses</div>
                    : <div style={{ background:T.accentSoft, borderRadius:20, padding:"3px 10px", fontSize:11, fontWeight:700, color:T.accentDark }}>Be First →</div>
                  }
                </div>
              </div>
            </div>
          ))
        }
      </div>
    </div>
  );
}

// ─── MAIN APP ────────────────────────────────────────────────────────────────
export default function KaziApa() {
  const [authStep, setAuthStep]   = useState("phone");
  const [phone, setPhone]         = useState("");
  const [otp, setOtp]             = useState(["","","","",""]);
  const [userName, setUserName]   = useState("");
  const [userTown, setUserTown]   = useState("Nakuru");
  const [agreedPrivacy, setAgreedPrivacy] = useState(false);
  const [showPrivacy, setShowPrivacy]     = useState(false);
  const [lang, setLang]           = useState("en");
  const [screen, setScreen]       = useState("home");
  const [town, setTown]           = useState("All");
  const [catFilter, setCatFilter] = useState(null);
  const [search, setSearch]       = useState("");
  const [activeListing, setActiveListing] = useState(null);
  const [browseTab, setBrowseTab] = useState("listings");
  const [checkStep, setCheckStep] = useState(1);
  const [showUpgrade, setShowUpgrade] = useState(false);
  const [userPlan, setUserPlan]   = useState("free");
  const [chatMsgs, setChatMsgs]   = useState([{ from:"seller", text:"Hi! Thanks for your interest. How can I help?" }]);
  const [postForm, setPostForm]   = useState({ title:"", cat:"mitumba", price:"", town:"Nakuru", desc:"", boost:false });
  const [conciergeTxt, setConciergeTxt] = useState("");
  const [conciergeTown, setConciergeTown] = useState("Nakuru");
  const [conciergeDone, setConciergeDone] = useState(false);
  const [activeNav, setActiveNav] = useState("home");
  const [toast, setToast]         = useState(null);

  function showToast(msg, type="success") { setToast({ msg, type }); setTimeout(()=>setToast(null),2800); }
  function nav(s,key) { setScreen(s); if(key) setActiveNav(key); }

  const filtered = LISTINGS.filter(l=>{
    const mT = town==="All"||l.town===town;
    const mC = catFilter?l.category===catFilter:true;
    const mS = search?l.title.toLowerCase().includes(search.toLowerCase())||l.town.toLowerCase().includes(search.toLowerCase()):true;
    return mT&&mC&&mS;
  });
  const boosted = filtered.filter(l=>l.boosted);
  const regular = filtered.filter(l=>!l.boosted);
  const sorted  = [...boosted,...regular];

  function PrivacyModal() {
    return (
      <div style={{ position:"fixed", inset:0, background:T.overlay, zIndex:200, display:"flex", alignItems:"flex-end", justifyContent:"center" }} onClick={()=>setShowPrivacy(false)}>
        <div style={{ background:T.card, borderRadius:"22px 22px 0 0", padding:"24px 20px 40px", width:"100%", maxWidth:430, maxHeight:"80vh", overflowY:"auto" }} onClick={e=>e.stopPropagation()}>
          <div style={{ fontWeight:800, color:T.text, fontSize:18, marginBottom:16 }}>Privacy Policy — KaziApa</div>
          {[["What we collect","Your phone number, name, and town. Transaction and order history within the app."],
            ["How we use it","To connect buyers and sellers, process orders, send order notifications, and improve the platform. We never sell your data."],
            ["Your rights","You can request deletion of your account and all associated data at any time."],
            ["Data security","All data stored securely. M-Pesa transactions processed through official Safaricom channels."],
            ["Kenya Data Protection Act 2019","KaziApa complies with the Kenya Data Protection Act 2019."],
            ["Contact","privacy@kaziapa.co.ke"],
          ].map(([title,body])=>(
            <div key={title} style={{ marginBottom:16 }}>
              <div style={{ fontWeight:700, color:T.text, fontSize:14, marginBottom:4 }}>{title}</div>
              <div style={{ fontSize:13, color:T.textMid, lineHeight:1.6 }}>{body}</div>
            </div>
          ))}
          <button onClick={()=>setShowPrivacy(false)} style={{ width:"100%", padding:13, background:T.primary, color:"#fff", border:"none", borderRadius:12, fontSize:14, fontWeight:700, cursor:"pointer" }}>Close</button>
        </div>
      </div>
    );
  }

  // ── AUTH ──
  if (authStep==="phone") return (
    <div style={{ fontFamily:"'Segoe UI',system-ui,sans-serif", background:T.primary, minHeight:"100vh", maxWidth:430, margin:"0 auto", display:"flex", flexDirection:"column", justifyContent:"space-between", padding:32 }}>
      {showPrivacy && <PrivacyModal />}
      <div style={{ marginTop:40 }}>
        <div style={{ fontSize:42, marginBottom:4 }}>🤝</div>
        <div style={{ fontSize:36, fontWeight:900, color:T.accent, letterSpacing:-1 }}>KaziApa</div>
        <div style={{ fontSize:15, color:"rgba(255,255,255,0.7)", marginTop:6 }}>Your local market, online.</div>
        <div style={{ marginTop:36, display:"flex", flexDirection:"column", gap:12 }}>
          {[["🔒","Safe M-Pesa escrow — money held until you confirm receipt."],["✓","Verified sellers and housing agents — not random strangers."],["📍","Hyperlocal — see only what's available in your town."],["🤝","One account — buy, sell, find a house, offer services."]]
            .map(([ic,tx])=>(
              <div key={tx} style={{ display:"flex", gap:12, alignItems:"flex-start" }}>
                <span style={{ fontSize:20 }}>{ic}</span>
                <span style={{ color:"rgba(255,255,255,0.75)", fontSize:13, lineHeight:1.5 }}>{tx}</span>
              </div>
            ))
          }
        </div>
      </div>
      <div>
        <div style={{ display:"flex", gap:8, marginBottom:20 }}>
          {["en","sw"].map(l=>(
            <div key={l} onClick={()=>setLang(l)} style={{ flex:1, textAlign:"center", padding:"10px 0", borderRadius:10, background:lang===l?T.accent:"rgba(255,255,255,0.1)", color:lang===l?T.primary:"#fff", fontWeight:700, fontSize:14, cursor:"pointer" }}>
              {l==="en"?"English":"Kiswahili"}
            </div>
          ))}
        </div>
        <label style={{ fontSize:12, fontWeight:700, color:"rgba(255,255,255,0.7)", display:"block", marginBottom:8 }}>Your phone number</label>
        <input value={phone} onChange={e=>setPhone(e.target.value)} placeholder="07XXXXXXXX" maxLength={10} type="tel"
          style={{ width:"100%", padding:"14px 16px", borderRadius:12, border:"2px solid rgba(255,255,255,0.2)", background:"rgba(255,255,255,0.08)", color:"#fff", fontSize:18, fontWeight:700, boxSizing:"border-box", outline:"none", marginBottom:14 }} />
        <div style={{ display:"flex", alignItems:"flex-start", gap:10, marginBottom:18 }}>
          <div onClick={()=>setAgreedPrivacy(!agreedPrivacy)}
            style={{ width:22, height:22, borderRadius:6, border:`2px solid ${agreedPrivacy?T.accent:"rgba(255,255,255,0.3)"}`, background:agreedPrivacy?T.accent:"transparent", display:"flex", alignItems:"center", justifyContent:"center", cursor:"pointer", flexShrink:0, marginTop:1 }}>
            {agreedPrivacy && <span style={{ color:T.primary, fontSize:14, fontWeight:900 }}>✓</span>}
          </div>
          <div style={{ fontSize:12, color:"rgba(255,255,255,0.7)", lineHeight:1.5 }}>
            I agree to the <span onClick={()=>setShowPrivacy(true)} style={{ color:T.accent, fontWeight:700, cursor:"pointer", textDecoration:"underline" }}>Privacy Policy</span> of KaziApa.
          </div>
        </div>
        <button onClick={()=>{ if(phone.length>=10&&agreedPrivacy) setAuthStep("otp"); else if(!agreedPrivacy) showToast("Please agree to the privacy policy first.","error"); }}
          style={{ width:"100%", padding:16, background:T.accent, color:T.primary, border:"none", borderRadius:14, fontSize:16, fontWeight:800, cursor:"pointer", opacity:phone.length>=10&&agreedPrivacy?1:0.6 }}>
          Get Verification Code →
        </button>
      </div>
    </div>
  );

  if (authStep==="otp") return (
    <div style={{ fontFamily:"'Segoe UI',system-ui,sans-serif", background:T.primary, minHeight:"100vh", maxWidth:430, margin:"0 auto", padding:32, display:"flex", flexDirection:"column" }}>
      <div onClick={()=>setAuthStep("phone")} style={{ color:"rgba(255,255,255,0.6)", fontSize:22, cursor:"pointer", marginBottom:32 }}>←</div>
      <div style={{ fontSize:32 }}>🤝</div>
      <div style={{ fontSize:26, fontWeight:900, color:T.accent, marginTop:8 }}>KaziApa</div>
      <div style={{ fontSize:16, color:"#fff", fontWeight:700, marginTop:24 }}>Enter verification code</div>
      <div style={{ fontSize:13, color:"rgba(255,255,255,0.6)", marginTop:6 }}>Sent to {phone}</div>
      <div style={{ display:"flex", gap:10, marginTop:32, justifyContent:"center" }}>
        {otp.map((v,i)=>(
          <input key={i} id={`otp${i}`} value={v} maxLength={1} type="tel"
            onChange={e=>{ const n=[...otp]; n[i]=e.target.value; setOtp(n); if(e.target.value&&i<4) document.getElementById(`otp${i+1}`)?.focus(); }}
            style={{ width:52, height:60, textAlign:"center", fontSize:24, fontWeight:800, borderRadius:12, border:`2px solid ${v?T.accent:"rgba(255,255,255,0.2)"}`, background:"rgba(255,255,255,0.08)", color:"#fff", outline:"none" }} />
        ))}
      </div>
      <div style={{ fontSize:12, color:"rgba(255,255,255,0.5)", textAlign:"center", marginTop:16 }}>Demo code: 1 2 3 4 5</div>
      <button onClick={()=>{ if(otp.join("")==="12345") setAuthStep("profile"); else showToast("Wrong code — try 12345","error"); }}
        style={{ width:"100%", padding:16, background:T.accent, color:T.primary, border:"none", borderRadius:14, fontSize:16, fontWeight:800, cursor:"pointer", marginTop:32 }}>
        Verify →
      </button>
      <div onClick={()=>showToast("New code sent!")} style={{ textAlign:"center", marginTop:20, color:T.accent, fontSize:13, fontWeight:600, cursor:"pointer" }}>Resend code</div>
    </div>
  );

  if (authStep==="profile") return (
    <div style={{ fontFamily:"'Segoe UI',system-ui,sans-serif", background:T.primary, minHeight:"100vh", maxWidth:430, margin:"0 auto", padding:32, display:"flex", flexDirection:"column" }}>
      <div style={{ fontSize:32, marginBottom:4 }}>🤝</div>
      <div style={{ fontSize:26, fontWeight:900, color:T.accent }}>KaziApa</div>
      <div style={{ fontSize:18, color:"#fff", fontWeight:700, marginTop:20, marginBottom:4 }}>Welcome! One last step.</div>
      <div style={{ fontSize:13, color:"rgba(255,255,255,0.6)", marginBottom:32 }}>No role selection needed — you can buy, sell, find a house, AND offer services all with one account.</div>
      <div style={{ marginBottom:18 }}>
        <label style={{ fontSize:12, fontWeight:700, color:"rgba(255,255,255,0.7)", display:"block", marginBottom:8 }}>Your name</label>
        <input value={userName} onChange={e=>setUserName(e.target.value)} placeholder="e.g. John Kamau"
          style={{ width:"100%", padding:"14px 16px", borderRadius:12, border:"2px solid rgba(255,255,255,0.2)", background:"rgba(255,255,255,0.08)", color:"#fff", fontSize:16, fontWeight:600, boxSizing:"border-box", outline:"none" }} />
      </div>
      <div style={{ marginBottom:32 }}>
        <label style={{ fontSize:12, fontWeight:700, color:"rgba(255,255,255,0.7)", display:"block", marginBottom:8 }}>Your town</label>
        <select value={userTown} onChange={e=>setUserTown(e.target.value)}
          style={{ width:"100%", padding:"14px 16px", borderRadius:12, border:"2px solid rgba(255,255,255,0.2)", background:"rgba(255,255,255,0.08)", color:"#fff", fontSize:16, fontWeight:600, boxSizing:"border-box", outline:"none" }}>
          {TOWNS.map(t=><option key={t} style={{ color:T.text }}>{t}</option>)}
        </select>
      </div>
      <button onClick={()=>{ if(userName.trim()){ setTown(userTown); setAuthStep("app"); setActiveNav("home"); showToast(`Welcome ${userName}! 🤝`); } }}
        style={{ width:"100%", padding:16, background:T.accent, color:T.primary, border:"none", borderRadius:14, fontSize:16, fontWeight:800, cursor:"pointer", opacity:userName.trim()?1:0.6 }}>
        Start Using KaziApa →
      </button>
    </div>
  );

  // ── MAIN APP ──
  return (
    <div style={{ fontFamily:"'Segoe UI',system-ui,sans-serif", background:T.surface, minHeight:"100vh", maxWidth:430, margin:"0 auto", position:"relative", paddingBottom:72 }}>
      {showPrivacy && <PrivacyModal />}

      {toast && (
        <div style={{ position:"fixed", top:16, left:"50%", transform:"translateX(-50%)", zIndex:300, background:toast.type==="success"?T.success:T.coral, color:"#fff", borderRadius:10, padding:"10px 20px", fontSize:13, fontWeight:600, boxShadow:"0 4px 16px rgba(0,0,0,0.18)", whiteSpace:"nowrap" }}>
          {toast.msg}
        </div>
      )}

      {showUpgrade && (
        <div style={{ position:"fixed", inset:0, background:T.overlay, zIndex:150, display:"flex", alignItems:"flex-end", justifyContent:"center" }} onClick={()=>setShowUpgrade(false)}>
          <div style={{ background:T.card, borderRadius:"22px 22px 0 0", padding:"28px 20px 36px", width:"100%", maxWidth:430 }} onClick={e=>e.stopPropagation()}>
            <div style={{ textAlign:"center", marginBottom:22 }}>
              <div style={{ fontSize:40 }}>⚡</div>
              <div style={{ fontSize:18, fontWeight:800, color:T.text, marginTop:8 }}>Unlock More on KaziApa</div>
              <div style={{ fontSize:13, color:T.textMuted, marginTop:4 }}>Free plan: 5 chat messages/day.</div>
            </div>
            {[{ plan:"daily", label:"Daily Pass",  price:"Ksh 20 / day",  perks:["Unlimited messages","Priority support"], color:T.primaryLight },
              { plan:"weekly",label:"Weekly Plan", price:"Ksh 50 / week", perks:["Unlimited messages","List up to 20 items","1 free boost"], color:T.primary }
            ].map(p=>(
              <div key={p.plan} onClick={()=>{ setUserPlan(p.plan); setShowUpgrade(false); showToast(`Upgraded to ${p.label}!`); }}
                style={{ background:p.color, borderRadius:14, padding:"14px 18px", marginBottom:12, cursor:"pointer", display:"flex", justifyContent:"space-between", alignItems:"center" }}>
                <div><div style={{ color:"#fff", fontWeight:700, fontSize:15 }}>{p.label}</div>{p.perks.map(pk=><div key={pk} style={{ color:"rgba(255,255,255,0.75)", fontSize:12 }}>✓ {pk}</div>)}</div>
                <div style={{ color:T.accent, fontWeight:800, fontSize:16 }}>{p.price}</div>
              </div>
            ))}
            <div style={{ background:T.accentSoft, borderRadius:14, padding:"14px 18px", marginBottom:16, border:`1px solid ${T.accent}`, cursor:"pointer" }} onClick={()=>{ setShowUpgrade(false); showToast("Verified badge request sent!"); }}>
              <div style={{ fontWeight:700, color:T.text, fontSize:14 }}>✓ Get Verified Seller Badge</div>
              <div style={{ fontSize:12, color:T.textMuted, marginTop:2 }}>Show ✓ on all your listings. Build buyer trust.</div>
              <div style={{ color:T.accentDark, fontWeight:800, marginTop:6 }}>Ksh 200 one-time</div>
            </div>
            <button onClick={()=>setShowUpgrade(false)} style={{ width:"100%", padding:13, borderRadius:12, border:`1px solid ${T.border}`, background:T.card, color:T.textMuted, fontSize:14, cursor:"pointer" }}>Maybe Later</button>
          </div>
        </div>
      )}

      {/* HOME */}
      {screen==="home" && (
        <div>
          <div style={{ background:T.primary, padding:"20px 16px 18px", borderRadius:"0 0 22px 22px" }}>
            <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:14 }}>
              <div>
                <div style={{ display:"flex", alignItems:"center", gap:8 }}>
                  <span style={{ fontSize:22 }}>🤝</span>
                  <span style={{ color:T.accent, fontSize:22, fontWeight:900, letterSpacing:-0.5 }}>KaziApa</span>
                </div>
                <div style={{ color:"rgba(255,255,255,0.6)", fontSize:12 }}>Welcome back, {userName}!</div>
              </div>
              <div style={{ display:"flex", gap:8 }}>
                <div onClick={()=>setShowUpgrade(true)} style={{ background:T.accent, borderRadius:20, padding:"5px 13px", fontSize:12, fontWeight:700, color:T.primary, cursor:"pointer" }}>⚡ Upgrade</div>
                <div onClick={()=>setLang(lang==="en"?"sw":"en")} style={{ background:"rgba(255,255,255,0.12)", borderRadius:20, padding:"5px 10px", fontSize:11, color:"#fff", cursor:"pointer", fontWeight:600 }}>{lang==="en"?"SW":"EN"}</div>
              </div>
            </div>
            <div style={{ display:"flex", gap:6, overflowX:"auto", paddingBottom:2 }}>
              {["All",...TOWNS.slice(0,8)].map(t=>(
                <div key={t} onClick={()=>setTown(t)} style={{ background:town===t?T.accent:"rgba(255,255,255,0.12)", color:town===t?T.primary:"#fff", borderRadius:20, padding:"5px 14px", fontSize:12, fontWeight:600, whiteSpace:"nowrap", cursor:"pointer", flexShrink:0 }}>
                  {t==="All"?"All Towns":t}
                </div>
              ))}
            </div>
          </div>
          <div style={{ padding:"14px 16px 4px" }}>
            <div style={{ background:T.card, borderRadius:13, padding:"11px 14px", display:"flex", alignItems:"center", gap:8, border:`1px solid ${T.border}` }}>
              <span style={{ fontSize:16 }}>🔍</span>
              <input value={search} onChange={e=>setSearch(e.target.value)} placeholder={`Search in ${town==="All"?"All Towns":town}...`}
                style={{ border:"none", outline:"none", flex:1, fontSize:14, color:T.text, background:"transparent" }} />
              {search && <span onClick={()=>setSearch("")} style={{ color:T.textMuted, cursor:"pointer", fontSize:20 }}>×</span>}
            </div>
          </div>
          <div style={{ margin:"14px 16px 4px", background:`linear-gradient(130deg,${T.primary},${T.primaryMid})`, borderRadius:16, padding:"16px 18px", cursor:"pointer" }}
            onClick={()=>{ nav("browse","browse"); setBrowseTab("concierge"); }}>
            <div style={{ color:T.accent, fontSize:10, fontWeight:700, letterSpacing:1.2, marginBottom:5 }}>CONCIERGE SERVICE</div>
            <div style={{ color:"#fff", fontWeight:800, fontSize:15 }}>Can't find what you need?</div>
            <div style={{ color:"rgba(255,255,255,0.65)", fontSize:12, marginTop:3 }}>Tell us — we'll find it within 3–6 hours. →</div>
          </div>
          <div style={{ padding:"16px 16px 4px" }}>
            <SecTitle>Categories</SecTitle>
            <div style={{ display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:9 }}>
              {CATEGORIES.map(cat=>(
                <div key={cat.id} onClick={()=>{ if(cat.id==="nyumba"){ nav("housing","browse"); } else { setCatFilter(cat.id); nav("browse","browse"); setBrowseTab("listings"); } }}
                  style={{ background:T.card, borderRadius:13, padding:"14px 8px 10px", textAlign:"center", cursor:"pointer", border:`1px solid ${T.border}`, position:"relative", overflow:"hidden" }}>
                  <div style={{ position:"absolute", top:0, left:0, right:0, height:4, background:cat.color }} />
                  <div style={{ fontSize:26, marginBottom:5 }}>{cat.icon}</div>
                  <div style={{ fontSize:12, fontWeight:800, color:cat.color }}>{lang==="sw"?cat.sw:cat.en}</div>
                  <div style={{ fontSize:10, color:T.textMuted, marginTop:1 }}>{cat.sub}</div>
                </div>
              ))}
            </div>
          </div>
          <div style={{ padding:"16px 16px 0" }}>
            <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:12 }}>
              <SecTitle style={{ marginBottom:0 }}>Near You{town!=="All"?` — ${town}`:""}</SecTitle>
              <div onClick={()=>{ setCatFilter(null); nav("browse","browse"); setBrowseTab("listings"); }} style={{ fontSize:12, color:T.primaryLight, cursor:"pointer", fontWeight:600 }}>See All →</div>
            </div>
            {sorted.slice(0,4).map(l=>(
              <ListingCard key={l.id} listing={l} lang={lang} onClick={()=>{ setActiveListing(l); nav("listing","browse"); }} />
            ))}
          </div>
        </div>
      )}

      {/* HOUSING */}
      {screen==="housing" && (
        <HousingScreen lang={lang} town={town} showToast={showToast} onBack={()=>nav("home","home")} />
      )}

      {/* BROWSE */}
      {screen==="browse" && (
        <div>
          <div style={{ background:T.primary, padding:"16px 16px 0", borderRadius:"0 0 18px 18px" }}>
            <div style={{ display:"flex", alignItems:"center", gap:10, marginBottom:12 }}>
              <div onClick={()=>{ nav("home","home"); setCatFilter(null); }} style={{ color:"#fff", fontSize:22, cursor:"pointer" }}>←</div>
              <div style={{ color:"#fff", fontWeight:800, fontSize:16, flex:1 }}>
                {catFilter?(CATEGORIES.find(c=>c.id===catFilter)?.[lang==="sw"?"sw":"en"]):"All Listings"}{town!=="All"?` — ${town}`:""}
              </div>
              <div onClick={()=>setLang(lang==="en"?"sw":"en")} style={{ background:"rgba(255,255,255,0.12)", borderRadius:16, padding:"4px 10px", fontSize:11, color:"#fff", cursor:"pointer" }}>{lang==="en"?"SW":"EN"}</div>
            </div>
            <div style={{ display:"flex", gap:6, paddingBottom:14 }}>
              {[["listings","Listings"],["concierge","Special Request"]].map(([tab,label])=>(
                <div key={tab} onClick={()=>setBrowseTab(tab)} style={{ background:browseTab===tab?T.accent:"rgba(255,255,255,0.12)", color:browseTab===tab?T.primary:"#fff", borderRadius:20, padding:"5px 16px", fontSize:12, fontWeight:700, cursor:"pointer" }}>{label}</div>
              ))}
            </div>
          </div>
          {browseTab==="listings" && (
            <div style={{ padding:"14px 16px" }}>
              <div style={{ display:"flex", gap:8, marginBottom:12 }}>
                <div style={{ flex:1, background:T.card, borderRadius:11, padding:"9px 12px", display:"flex", alignItems:"center", gap:6, border:`1px solid ${T.border}` }}>
                  <span>🔍</span>
                  <input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Search..." style={{ border:"none", outline:"none", flex:1, fontSize:13, background:"transparent", color:T.text }} />
                </div>
                <select value={town} onChange={e=>setTown(e.target.value)} style={{ background:T.card, border:`1px solid ${T.border}`, borderRadius:11, padding:"9px 10px", fontSize:12, color:T.text }}>
                  <option value="All">All Towns</option>
                  {TOWNS.map(t=><option key={t}>{t}</option>)}
                </select>
              </div>
              <div style={{ display:"flex", gap:6, overflowX:"auto", paddingBottom:10, marginBottom:4 }}>
                <div onClick={()=>setCatFilter(null)} style={{ background:!catFilter?T.primary:T.card, color:!catFilter?"#fff":T.textMuted, borderRadius:20, padding:"5px 14px", fontSize:12, fontWeight:600, whiteSpace:"nowrap", cursor:"pointer", border:`1px solid ${T.border}`, flexShrink:0 }}>All</div>
                {CATEGORIES.filter(c=>c.id!=="nyumba").map(cat=>(
                  <div key={cat.id} onClick={()=>setCatFilter(catFilter===cat.id?null:cat.id)}
                    style={{ background:catFilter===cat.id?cat.color:T.card, color:catFilter===cat.id?"#fff":T.textMuted, borderRadius:20, padding:"5px 14px", fontSize:12, fontWeight:600, whiteSpace:"nowrap", cursor:"pointer", border:`1px solid ${T.border}`, flexShrink:0 }}>
                    {cat.icon} {lang==="sw"?cat.sw:cat.en}
                  </div>
                ))}
              </div>
              {boosted.length>0 && <div style={{ fontSize:10, fontWeight:700, color:T.accentDark, marginBottom:8, letterSpacing:0.8 }}>⚡ FEATURED</div>}
              {sorted.length===0
                ? <div style={{ textAlign:"center", padding:"50px 20px", color:T.textMuted }}>
                    <div style={{ fontSize:44 }}>🔍</div>
                    <div style={{ fontWeight:700, fontSize:15, marginTop:12, color:T.text }}>Nothing here yet.</div>
                    <button onClick={()=>setBrowseTab("concierge")} style={{ marginTop:16, background:T.primary, color:"#fff", border:"none", borderRadius:10, padding:"10px 22px", fontSize:13, fontWeight:700, cursor:"pointer" }}>Make a Request</button>
                  </div>
                : sorted.map((l,i)=>(
                  <div key={l.id}>
                    {i===boosted.length&&boosted.length>0&&regular.length>0 && <div style={{ fontSize:10, fontWeight:700, color:T.textMuted, margin:"10px 0 8px", letterSpacing:0.8 }}>ALL LISTINGS</div>}
                    <ListingCard listing={l} lang={lang} onClick={()=>{ setActiveListing(l); nav("listing","browse"); }} />
                  </div>
                ))
              }
            </div>
          )}
          {browseTab==="concierge" && (
            <div style={{ padding:"20px 16px" }}>
              <div style={{ background:T.accentSoft, borderRadius:14, padding:16, marginBottom:18, border:`1px solid ${T.accent}` }}>
                <div style={{ fontWeight:800, color:T.text, fontSize:15, marginBottom:4 }}>Special Request</div>
                <div style={{ fontSize:13, color:T.textMuted, lineHeight:1.5 }}>Tell us what you need — we'll find it within 3–6 hours.</div>
              </div>
              {conciergeDone
                ? <div style={{ textAlign:"center", padding:"30px 0" }}>
                    <div style={{ fontSize:56 }}>✅</div>
                    <div style={{ fontSize:18, fontWeight:800, color:T.text, marginTop:14 }}>Request Received!</div>
                    <div style={{ fontSize:14, color:T.textMuted, marginTop:8, lineHeight:1.5 }}>We'll call or WhatsApp you within 3–6 hours.</div>
                    <button onClick={()=>{ setConciergeDone(false); setConciergeTxt(""); }} style={{ marginTop:22, background:T.primary, color:"#fff", border:"none", borderRadius:12, padding:"12px 28px", fontSize:14, fontWeight:700, cursor:"pointer" }}>Make Another Request</button>
                  </div>
                : <>
                    <div style={{ marginBottom:14 }}>
                      <label style={{ fontSize:12, fontWeight:700, color:T.text, display:"block", marginBottom:7 }}>Your Town</label>
                      <select value={conciergeTown} onChange={e=>setConciergeTown(e.target.value)} style={{ width:"100%", padding:"11px 13px", borderRadius:11, border:`1px solid ${T.border}`, fontSize:14, color:T.text, background:T.card }}>
                        {TOWNS.map(t=><option key={t}>{t}</option>)}
                      </select>
                    </div>
                    <div style={{ marginBottom:18 }}>
                      <label style={{ fontSize:12, fontWeight:700, color:T.text, display:"block", marginBottom:7 }}>What do you need?</label>
                      <textarea value={conciergeTxt} onChange={e=>setConciergeTxt(e.target.value)} placeholder="e.g. Newborn socks size 0-3 months, budget Ksh 300. I'm in Nakuru CBD." rows={5}
                        style={{ width:"100%", padding:"11px 13px", borderRadius:11, border:`1px solid ${T.border}`, fontSize:14, color:T.text, resize:"none", boxSizing:"border-box", background:T.card }} />
                    </div>
                    <button onClick={()=>{ if(conciergeTxt.trim()){ setConciergeDone(true); showToast("Request received!"); } }}
                      style={{ width:"100%", padding:15, background:T.primary, color:"#fff", border:"none", borderRadius:13, fontSize:15, fontWeight:800, cursor:"pointer" }}>
                      Send Request →
                    </button>
                  </>
              }
            </div>
          )}
        </div>
      )}

      {/* LISTING DETAIL */}
      {screen==="listing" && activeListing && (()=>{
        const cat = CATEGORIES.find(c=>c.id===activeListing.category);
        return (
          <div>
            <BackHeader title={activeListing.title} onBack={()=>nav("browse","browse")} />
            <div style={{ padding:16 }}>
              <div style={{ background:T.border, borderRadius:18, height:180, display:"flex", alignItems:"center", justifyContent:"center", fontSize:80, marginBottom:16, position:"relative", overflow:"hidden" }}>
                {activeListing.icon}
                <div style={{ position:"absolute", top:12, left:12, display:"flex", gap:6 }}>
                  {activeListing.boosted  && <Pill color={T.accentDark} bg="rgba(255,248,231,0.95)">⚡ Boosted</Pill>}
                  {activeListing.verified && <Pill color={T.success} bg="rgba(232,245,238,0.95)">✓ Verified</Pill>}
                </div>
                <div style={{ position:"absolute", bottom:12, right:12, background:cat?.color, color:"#fff", borderRadius:8, padding:"3px 10px", fontSize:11, fontWeight:700 }}>{lang==="sw"?cat?.sw:cat?.en}</div>
              </div>
              <div style={{ background:T.card, borderRadius:16, padding:16, marginBottom:12, border:`1px solid ${T.border}` }}>
                <div style={{ display:"flex", justifyContent:"space-between", gap:8 }}>
                  <div style={{ flex:1 }}>
                    <div style={{ fontSize:18, fontWeight:800, color:T.text }}>{activeListing.title}</div>
                    <div style={{ fontSize:12, color:T.textMuted, marginTop:3 }}>📍 {activeListing.town}</div>
                    <Stars rating={activeListing.rating} /><span style={{ fontSize:11, color:T.textMuted, marginLeft:6 }}>{activeListing.sales} sold</span>
                  </div>
                  <div style={{ fontSize:22, fontWeight:900, color:T.primary }}>Ksh {activeListing.price.toLocaleString()}</div>
                </div>
                <div style={{ marginTop:12, fontSize:13, color:T.textMid, lineHeight:1.6 }}>{activeListing.desc}</div>
              </div>
              <div style={{ background:T.successSoft, borderRadius:14, padding:14, marginBottom:12, border:`1px solid ${T.success}` }}>
                <div style={{ fontWeight:700, color:T.text, fontSize:13, marginBottom:4 }}>📍 Seller Location</div>
                <div style={{ fontSize:13, color:T.textMid }}>{activeListing.location}</div>
                <div style={{ fontSize:11, color:T.textMuted, marginTop:6 }}>You can visit in person to pick & choose, or request delivery — your choice.</div>
              </div>
              <div style={{ background:T.card, borderRadius:16, padding:14, marginBottom:14, border:`1px solid ${T.border}`, display:"flex", alignItems:"center", gap:12 }}>
                <div style={{ width:46, height:46, borderRadius:"50%", background:T.primary, display:"flex", alignItems:"center", justifyContent:"center", color:"#fff", fontWeight:800, fontSize:20 }}>{activeListing.seller[0]}</div>
                <div style={{ flex:1 }}>
                  <div style={{ fontWeight:700, color:T.text, fontSize:14 }}>{activeListing.seller}</div>
                  {activeListing.verified && <div style={{ fontSize:11, color:T.success, fontWeight:600 }}>✓ Verified Seller</div>}
                </div>
                <button onClick={()=>{ setChatMsgs([{ from:"seller", text:`Hi ${userName}! Interested in the ${activeListing.title}? I'm at ${activeListing.location}.` }]); nav("chat","browse"); }}
                  style={{ background:T.surface, border:`1px solid ${T.border}`, borderRadius:10, padding:"8px 14px", fontSize:13, fontWeight:700, color:T.primary, cursor:"pointer" }}>
                  💬 Chat
                </button>
              </div>
              <div style={{ background:T.successSoft, borderRadius:13, padding:13, marginBottom:16, fontSize:12, color:"#145A36", lineHeight:1.5 }}>
                🔒 KaziApa protects you: Money held until you confirm receipt.
              </div>
              <button onClick={()=>{ setCheckStep(1); nav("checkout","browse"); }} style={{ width:"100%", padding:16, background:T.primary, color:"#fff", border:"none", borderRadius:14, fontSize:16, fontWeight:800, cursor:"pointer" }}>
                Buy Now — Ksh {(activeListing.price+50).toLocaleString()}
              </button>
              <div style={{ textAlign:"center", fontSize:11, color:T.textMuted, marginTop:6 }}>Ksh {activeListing.price.toLocaleString()} + Ksh 50 buyer protection</div>
            </div>
          </div>
        );
      })()}

      {/* CHAT */}
      {screen==="chat" && (
        <SmartChat lang={lang} listing={activeListing} userPlan={userPlan} msgs={chatMsgs} setMsgs={setChatMsgs}
          onBack={()=>nav("listing","browse")} onCheckout={()=>{ setCheckStep(1); nav("checkout","browse"); }} onUpgrade={()=>setShowUpgrade(true)} />
      )}

      {/* CHECKOUT */}
      {screen==="checkout" && activeListing && (
        <div>
          <BackHeader title="Secure Checkout" onBack={()=>nav("listing","browse")} />
          <div style={{ padding:16 }}>
            <div style={{ display:"flex", alignItems:"center", marginBottom:24 }}>
              {["Review","Pay","Confirm"].map((s,i)=>(
                <div key={s} style={{ display:"flex", alignItems:"center", flex:1 }}>
                  <div style={{ display:"flex", flexDirection:"column", alignItems:"center", flex:1 }}>
                    <div style={{ width:30, height:30, borderRadius:"50%", background:checkStep>i?T.success:checkStep===i+1?T.primary:T.border, color:checkStep>=i+1?"#fff":T.textMuted, display:"flex", alignItems:"center", justifyContent:"center", fontSize:13, fontWeight:800 }}>{checkStep>i?"✓":i+1}</div>
                    <div style={{ fontSize:10, color:checkStep===i+1?T.primary:T.textMuted, marginTop:4, fontWeight:checkStep===i+1?700:400 }}>{s}</div>
                  </div>
                  {i<2 && <div style={{ width:30, height:2, background:checkStep>i+1?T.success:T.border, marginBottom:14, flexShrink:0 }} />}
                </div>
              ))}
            </div>
            {checkStep===1 && (
              <div>
                <div style={{ background:T.card, borderRadius:14, padding:16, marginBottom:14, border:`1px solid ${T.border}` }}>
                  <SecTitle>Order Summary</SecTitle>
                  {[["Item",`Ksh ${activeListing.price.toLocaleString()}`],["Buyer protection","Ksh 50"]].map(([k,v])=>(
                    <div key={k} style={{ display:"flex", justifyContent:"space-between", marginBottom:10, fontSize:14 }}>
                      <span style={{ color:T.textMid }}>{k}</span><span style={{ fontWeight:600 }}>{v}</span>
                    </div>
                  ))}
                  <div style={{ borderTop:`1px solid ${T.border}`, paddingTop:10, display:"flex", justifyContent:"space-between", fontSize:16, fontWeight:900 }}>
                    <span>Total</span><span style={{ color:T.primary }}>Ksh {(activeListing.price+50).toLocaleString()}</span>
                  </div>
                </div>
                <div style={{ background:T.successSoft, borderRadius:12, padding:13, marginBottom:16, fontSize:12, color:"#145A36", lineHeight:1.5 }}>
                  ✅ Your money is held securely until you confirm delivery.
                </div>
                <button onClick={()=>setCheckStep(2)} style={{ width:"100%", padding:15, background:T.primary, color:"#fff", border:"none", borderRadius:13, fontSize:15, fontWeight:800, cursor:"pointer" }}>Continue →</button>
              </div>
            )}
            {checkStep===2 && (
              <div>
                <div style={{ background:T.card, borderRadius:14, padding:16, marginBottom:14, border:`1px solid ${T.border}` }}>
                  <SecTitle>Pay via M-Pesa</SecTitle>
                  <div style={{ background:T.surface, borderRadius:11, padding:14, marginBottom:14, fontSize:13, color:T.textMid, lineHeight:2 }}>
                    <div>1. M-Pesa → <strong>Lipa Na M-Pesa → Pay Bill</strong></div>
                    <div>2. Business No: <strong style={{ color:T.primary }}>522522</strong></div>
                    <div>3. Account: <strong style={{ color:T.primary }}>KAZI{activeListing.id}ORD</strong></div>
                    <div>4. Amount: <strong style={{ color:T.primary }}>Ksh {(activeListing.price+50).toLocaleString()}</strong></div>
                  </div>
                  {[["Your M-Pesa number","07XXXXXXXX"],["Confirmation code","QHX1234ABC"]].map(([label,ph])=>(
                    <div key={label} style={{ marginBottom:12 }}>
                      <label style={{ fontSize:12, fontWeight:700, color:T.text, display:"block", marginBottom:6 }}>{label}</label>
                      <input placeholder={ph} style={{ width:"100%", padding:"11px 13px", borderRadius:11, border:`1px solid ${T.border}`, fontSize:14, boxSizing:"border-box", color:T.text }} />
                    </div>
                  ))}
                </div>
                <button onClick={()=>{ setCheckStep(3); showToast("Payment confirmed!"); }} style={{ width:"100%", padding:15, background:T.success, color:"#fff", border:"none", borderRadius:13, fontSize:15, fontWeight:800, cursor:"pointer" }}>
                  Confirm Payment ✓
                </button>
              </div>
            )}
            {checkStep===3 && (
              <div style={{ textAlign:"center", padding:"20px 0" }}>
                <div style={{ fontSize:68 }}>🎉</div>
                <div style={{ fontSize:22, fontWeight:900, color:T.text, marginTop:16 }}>Order Placed!</div>
                <div style={{ fontSize:14, color:T.textMid, marginTop:10, lineHeight:1.6, padding:"0 10px" }}>Seller notified. Confirm receipt to release payment.</div>
                <div style={{ background:T.accentSoft, borderRadius:13, padding:14, margin:"20px 0", border:`1px solid ${T.accent}` }}>
                  <div style={{ fontSize:12, color:T.textMuted }}>Order ID</div>
                  <div style={{ fontSize:16, fontWeight:900, color:T.primary, marginTop:4 }}>KAZI-{activeListing.id}-{Date.now().toString().slice(-5)}</div>
                </div>
                <button onClick={()=>{ nav("home","home"); setCheckStep(1); }} style={{ width:"100%", padding:15, background:T.primary, color:"#fff", border:"none", borderRadius:13, fontSize:15, fontWeight:800, cursor:"pointer" }}>Back to Home</button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* POST */}
      {screen==="post" && (
        <div>
          <BackHeader title="Post a Listing" onBack={()=>nav("home","home")} />
          <div style={{ padding:16 }}>
            {[{ label:"Title", field:"title", ph:"e.g. Levi's Jeans Waist 34 Grade A", type:"text" },{ label:"Price (Ksh)", field:"price", ph:"850", type:"number" }].map(f=>(
              <div key={f.field} style={{ marginBottom:14 }}>
                <label style={{ fontSize:12, fontWeight:700, color:T.text, display:"block", marginBottom:7 }}>{f.label}</label>
                <input value={postForm[f.field]} onChange={e=>setPostForm({...postForm,[f.field]:e.target.value})} type={f.type} placeholder={f.ph}
                  style={{ width:"100%", padding:"11px 13px", borderRadius:11, border:`1px solid ${T.border}`, fontSize:14, color:T.text, boxSizing:"border-box", background:T.card }} />
              </div>
            ))}
            <div style={{ marginBottom:14 }}>
              <label style={{ fontSize:12, fontWeight:700, color:T.text, display:"block", marginBottom:7 }}>Description</label>
              <textarea value={postForm.desc} onChange={e=>setPostForm({...postForm,desc:e.target.value})} placeholder="Describe clearly — condition, size, colour..." rows={4}
                style={{ width:"100%", padding:"11px 13px", borderRadius:11, border:`1px solid ${T.border}`, fontSize:14, color:T.text, resize:"none", boxSizing:"border-box", background:T.card }} />
            </div>
            {[{ label:"Category", field:"cat", opts:CATEGORIES.filter(c=>c.id!=="nyumba").map(c=>({ v:c.id, l:`${c.icon} ${lang==="sw"?c.sw:c.en}` })) },
              { label:"Town", field:"town", opts:TOWNS.map(t=>({ v:t, l:t })) }
            ].map(f=>(
              <div key={f.field} style={{ marginBottom:14 }}>
                <label style={{ fontSize:12, fontWeight:700, color:T.text, display:"block", marginBottom:7 }}>{f.label}</label>
                <select value={postForm[f.field]} onChange={e=>setPostForm({...postForm,[f.field]:e.target.value})} style={{ width:"100%", padding:"11px 13px", borderRadius:11, border:`1px solid ${T.border}`, fontSize:14, color:T.text, background:T.card }}>
                  {f.opts.map(o=><option key={o.v} value={o.v}>{o.l}</option>)}
                </select>
              </div>
            ))}
            <div style={{ background:T.accentSoft, borderRadius:14, padding:16, marginBottom:18, border:`1px solid ${T.accent}` }}>
              <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center" }}>
                <div>
                  <div style={{ fontWeight:700, color:T.text, fontSize:14 }}>⚡ Boost this Listing</div>
                  <div style={{ fontSize:12, color:T.textMuted, marginTop:2 }}>Appear at the top for 7 days — Ksh 100</div>
                </div>
                <div onClick={()=>setPostForm({...postForm,boost:!postForm.boost})}
                  style={{ width:48, height:26, borderRadius:13, background:postForm.boost?T.accent:T.border, position:"relative", cursor:"pointer", transition:"background 0.2s", flexShrink:0 }}>
                  <div style={{ width:20, height:20, borderRadius:"50%", background:"#fff", position:"absolute", top:3, left:postForm.boost?25:3, transition:"left 0.2s", boxShadow:"0 1px 3px rgba(0,0,0,0.2)" }} />
                </div>
              </div>
            </div>
            <button onClick={()=>{ showToast("Listing posted and live immediately!"); setPostForm({ title:"", cat:"mitumba", price:"", town:"Nakuru", desc:"", boost:false }); nav("home","home"); }}
              style={{ width:"100%", padding:16, background:T.primary, color:"#fff", border:"none", borderRadius:14, fontSize:15, fontWeight:800, cursor:"pointer", marginBottom:8 }}>
              {postForm.boost?"Publish + Boost — Ksh 100":"Publish — Free"}
            </button>
            <div style={{ textAlign:"center", fontSize:11, color:T.textMuted }}>Listings go live immediately on KaziApa.</div>
          </div>
        </div>
      )}

      {/* REQUESTS */}
      {screen==="requests" && <RequestBoard lang={lang} town={town} setTown={setTown} showToast={showToast} userRole="buyer" />}

      {/* PROFILE */}
      {screen==="profile" && (
        <div>
          <div style={{ background:T.primary, padding:"22px 16px 18px" }}>
            <div style={{ display:"flex", alignItems:"center", gap:14 }}>
              <div style={{ width:58, height:58, borderRadius:"50%", background:T.accent, display:"flex", alignItems:"center", justifyContent:"center", fontSize:26, fontWeight:800, color:T.primary }}>{userName[0]?.toUpperCase()}</div>
              <div>
                <div style={{ color:"#fff", fontWeight:800, fontSize:18 }}>{userName}</div>
                <div style={{ color:"rgba(255,255,255,0.6)", fontSize:12 }}>{userTown} · {phone} · {userPlan==="free"?"Free Plan":userPlan==="daily"?"Daily ⚡":"Weekly ⚡"}</div>
              </div>
            </div>
          </div>
          <div style={{ padding:16 }}>
            {[
              { icon:"📦", label:"My Listings",       action:()=>{ nav("browse","browse"); } },
              { icon:"🛒", label:"My Orders",          action:()=>{} },
              { icon:"💬", label:"My Chats",           action:()=>{} },
              { icon:"🏠", label:"Housing Dashboard",  action:()=>nav("housing","profile"), highlight:true },
              { icon:"⚡", label:"Upgrade Plan",       action:()=>setShowUpgrade(true), accent:true },
              { icon:"✓",  label:"Get Verified Badge", action:()=>setShowUpgrade(true), accent:true },
              { icon:"🌍", label:"Language",           action:()=>setLang(lang==="en"?"sw":"en"), sub:lang==="en"?"Switch to Kiswahili":"Switch to English" },
              { icon:"🔒", label:"Privacy Policy",     action:()=>setShowPrivacy(true) },
              { icon:"🚪", label:"Log Out",            action:()=>setAuthStep("phone") },
            ].map((item,i)=>(
              <div key={i} onClick={item.action} style={{ background:T.card, borderRadius:13, padding:"14px 16px", marginBottom:8, display:"flex", alignItems:"center", gap:13, cursor:"pointer", border:item.accent?`1px solid ${T.accent}`:item.highlight?`1px solid ${T.primary}`:`1px solid ${T.border}` }}>
                <span style={{ fontSize:20 }}>{item.icon}</span>
                <div style={{ flex:1 }}>
                  <div style={{ fontSize:14, fontWeight:item.accent||item.highlight?700:500, color:item.accent?T.accentDark:item.highlight?T.primary:T.text }}>{item.label}</div>
                  {item.sub && <div style={{ fontSize:11, color:T.textMuted, marginTop:1 }}>{item.sub}</div>}
                </div>
                <span style={{ color:T.textMuted, fontSize:16 }}>›</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* BOTTOM NAV */}
      {screen!=="chat" && (
        <div style={{ position:"fixed", bottom:0, left:"50%", transform:"translateX(-50%)", width:"100%", maxWidth:430, background:T.card, borderTop:`1px solid ${T.border}`, display:"flex", zIndex:50, boxShadow:"0 -2px 12px rgba(0,102,204,0.08)" }}>
          {[
            { icon:"🏠", en:"Home",     s:"home",     key:"home" },
            { icon:"🔍", en:"Browse",   s:"browse",   key:"browse" },
            { icon:"📋", en:"Requests", s:"requests", key:"requests" },
            { icon:"➕", en:"Post",     s:"post",     key:"post" },
            { icon:"👤", en:"Profile",  s:"profile",  key:"profile" },
          ].map(n=>(
            <div key={n.key} onClick={()=>{ nav(n.s,n.key); if(n.s==="browse"){ setCatFilter(null); setBrowseTab("listings"); } }}
              style={{ flex:1, padding:"10px 0 8px", textAlign:"center", cursor:"pointer" }}>
              <div style={{ fontSize:20 }}>{n.icon}</div>
              <div style={{ fontSize:9, color:activeNav===n.key?T.primary:T.textMuted, fontWeight:activeNav===n.key?800:400, marginTop:2 }}>{n.en}</div>
              {activeNav===n.key && <div style={{ width:16, height:3, background:T.primary, borderRadius:2, margin:"3px auto 0" }} />}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
