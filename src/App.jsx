import { useState, useEffect, useRef } from "react";
import { createClient } from "@supabase/supabase-js";

// ─── SUPABASE ────────────────────────────────────────────────────────────────
const SUPABASE_URL = "https://dalaawxoiecrmfwxwrdn.supabase.co";
const SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRhbGFhd3hvaWVjcm1md3h3cmRuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODE1MTg1NjksImV4cCI6MjA5NzA5NDU2OX0.vl3NdmbF4suNoSeDXLwksYIhx8V-TddrKT0ZShHZwws";
const sb = createClient(SUPABASE_URL, SUPABASE_KEY);

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

const CATEGORIES = [
  { id:"mitumba",en:"Mitumba", sw:"Mitumba", sub:"Secondhand Clothes",icon:"👕",color:"#0066CC" },
  { id:"shamba", en:"Shamba",  sw:"Shamba",  sub:"Farm Produce",      icon:"🌽",color:"#1E9B5A" },
  { id:"vitu",   en:"Goods",   sw:"Vitu",    sub:"General Items",     icon:"📦",color:"#6C3483" },
  { id:"kazi",   en:"Jobs",    sw:"Kazi",    sub:"Jobs & Gigs",       icon:"💼",color:"#B7410E" },
  { id:"nyumba", en:"Housing", sw:"Nyumba",  sub:"Rentals & Agents",  icon:"🏠",color:"#0E6655" },
  { id:"fundi",  en:"Services",sw:"Fundi",   sub:"Fundis & Pros",     icon:"🔧",color:"#1A5276" },
];
const CAT_COLOR = Object.fromEntries(CATEGORIES.map(c=>[c.id,c.color]));
const CAT_ICON  = Object.fromEntries(CATEGORIES.map(c=>[c.id,c.icon]));

const PHONE_RGX   = /(\+?254|0)[17]\d{8}|\b07\d{8}\b|\b01\d{8}\b/g;
const CONTACT_RGX = /(@[\w]+|wa\.me|whatsapp|instagram|facebook|nipe.*nambari|number yangu)/i;
const DEAL_RGX    = /\b(sawa|deal|nataka|nimechukua|confirmed|bei sawa|niko tayari|agreed)\b/i;

const RIDERS = [
  { id:1,name:"Brian M.",  stage:"Kibuye Stage",    town:"Kisumu", rating:4.8,trips:234,available:true },
  { id:2,name:"Kevin O.",  stage:"Kondele Stage",   town:"Kisumu", rating:4.9,trips:187,available:true },
  { id:3,name:"Peter N.",  stage:"Westlands Stage", town:"Nairobi",rating:5.0,trips:89, available:true },
  { id:4,name:"Hassan A.", stage:"Nyali Stage",     town:"Mombasa",rating:4.6,trips:156,available:true },
  { id:5,name:"James K.",  stage:"Nakuru CBD",      town:"Nakuru", rating:4.7,trips:312,available:true },
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
function PhotoUploader({ photos,setPhotos,maxPhotos=5 }) {
  const fileRef = useRef();
  const [uploading,setUploading] = useState(false);

  async function handleFiles(e) {
    const files = Array.from(e.target.files);
    if (!files.length) return;
    setUploading(true);
    const urls = [];
    for (const file of files) {
      if (photos.length + urls.length >= maxPhotos) break;
      const ext  = file.name.split(".").pop();
      const name = `${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;
      const { data,error } = await sb.storage.from("kaziapa-photos").upload(name,file,{ contentType:file.type });
      if (!error) {
        const { data:pub } = sb.storage.from("kaziapa-photos").getPublicUrl(name);
        urls.push(pub.publicUrl);
      }
    }
    setPhotos([...photos,...urls]);
    setUploading(false);
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
          <div onClick={()=>fileRef.current?.click()}
            style={{ width:80,height:80,borderRadius:10,border:`2px dashed ${T.border}`,display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",cursor:"pointer",background:T.surface }}>
            {uploading ? <div style={{ fontSize:20 }}>⏳</div> : <>
              <div style={{ fontSize:24 }}>📷</div>
              <div style={{ fontSize:9,color:T.textMuted,marginTop:2 }}>Add Photo</div>
            </>}
          </div>
        )}
      </div>
      <input ref={fileRef} type="file" accept="image/*" multiple onChange={handleFiles} style={{ display:"none" }} />
      <div style={{ fontSize:11,color:T.textMuted,marginTop:6 }}>
        Tap 📷 to add photos from your camera or gallery. Up to {maxPhotos} photos.
      </div>
    </div>
  );
}

// ─── LISTING CARD ─────────────────────────────────────────────────────────────
function ListingCard({ listing,onClick }) {
  const cat = CATEGORIES.find(c=>c.id===listing.category);
  const photo = listing.photos?.[0];
  return (
    <div onClick={onClick} style={{ background:T.card,borderRadius:14,marginBottom:10,cursor:"pointer",border:listing.boosted?`1.5px solid ${T.accent}`:`1px solid ${T.border}`,overflow:"hidden",display:"flex" }}>
      <div style={{ width:5,flexShrink:0,background:CAT_COLOR[listing.category]||T.primary }} />
      {photo
        ? <img src={photo} alt="" style={{ width:80,height:80,objectFit:"cover",flexShrink:0,alignSelf:"center",marginLeft:8,borderRadius:8 }} />
        : <div style={{ width:80,height:80,flexShrink:0,background:T.surface,display:"flex",alignItems:"center",justifyContent:"center",fontSize:36,marginLeft:8,borderRadius:8,alignSelf:"center" }}>{cat?.icon||"📦"}</div>
      }
      <div style={{ padding:"10px 12px",flex:1,minWidth:0 }}>
        <div style={{ display:"flex",gap:5,flexWrap:"wrap",marginBottom:3 }}>
          {listing.boosted  && <Pill color={T.accentDark} bg={T.accentSoft}>⚡ Boosted</Pill>}
          {listing.verified && <Pill color={T.success} bg={T.successSoft}>✓ Verified</Pill>}
        </div>
        <div style={{ fontWeight:700,color:T.text,fontSize:14,whiteSpace:"nowrap",overflow:"hidden",textOverflow:"ellipsis" }}>{listing.title}</div>
        <div style={{ fontSize:11,color:T.textMuted,marginTop:2 }}>📍 {listing.town} · {listing.seller_name}</div>
        <div style={{ display:"flex",justifyContent:"space-between",alignItems:"center",marginTop:4 }}>
          <Stars rating={listing.rating} />
          <div style={{ fontSize:15,fontWeight:800,color:T.primary }}>Ksh {listing.price?.toLocaleString()}</div>
        </div>
      </div>
    </div>
  );
}

// ─── SMART CHAT ──────────────────────────────────────────────────────────────
function SmartChat({ listing,userPlan,msgs,setMsgs,onBack,onCheckout,onUpgrade,userName }) {
  const [input,setInput]   = useState("");
  const [showPay,setShowPay] = useState(false);
  const [showDel,setShowDel] = useState(false);
  const [dStep,setDStep]   = useState(1);
  const [zone,setZone]     = useState(null);
  const [rider,setRider]   = useState(null);
  const myCount = msgs.filter(m=>m.from==="me").length;
  const limited = userPlan==="free" && myCount>=5;
  const nearRiders = RIDERS.filter(r=>r.town===listing?.town && r.available);

  function send() {
    if (!input.trim()||limited) return;
    if (PHONE_RGX.test(input)||CONTACT_RGX.test(input)) {
      setMsgs(p=>[...p,{ from:"system",text:"⚠️ Phone numbers can't be shared here for your safety. Complete your deal securely through KaziApa." }]);
      setInput(""); setTimeout(()=>setShowPay(true),400); return;
    }
    if (DEAL_RGX.test(input)&&myCount>=2) setTimeout(()=>setShowPay(true),1200);
    if (myCount===7) setTimeout(()=>setMsgs(p=>[...p,{ from:"system",text:"💡 Looks like you're close to a deal! Tap Pay Now below to complete safely." }]),900);
    setMsgs(p=>[...p,{ from:"me",text:input }]);
    setInput("");
    setTimeout(()=>setMsgs(p=>[...p,{ from:"seller",text:"Got it, one moment..." }]),1100);
  }

  if (showDel) {
    const delCost = zone?.price||rider?.price||250;
    const total   = (listing?.price||0)+50+delCost;
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
                  <div><div style={{ fontWeight:700,color:T.text }}>{z.label}</div><div style={{ fontSize:12,color:T.textMuted }}>⏱ {z.time}</div></div>
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
              <Btn onClick={()=>{ if(rider) setDStep(3); }} disabled={!rider} style={{ marginTop:12 }}>Continue →</Btn>
            </div>
          )}
          {dStep===3 && (
            <div>
              <div style={{ fontSize:14,fontWeight:800,color:T.text,marginBottom:14 }}>Confirm Order</div>
              <div style={{ background:T.card,borderRadius:14,padding:16,marginBottom:14,border:`1px solid ${T.border}` }}>
                {[["Item",listing?.title],["Seller",listing?.seller_name],["Item price",`Ksh ${listing?.price?.toLocaleString()}`],["Buyer protection","Ksh 50"],["Delivery",`Ksh ${delCost}`],...(rider&&!rider.bus?[["Rider",rider.name]]:rider?.bus?[["Service",rider.name]]:[])].map(([k,v])=>(
                  <div key={k} style={{ display:"flex",justifyContent:"space-between",marginBottom:10,fontSize:14 }}><span style={{ color:T.textMid }}>{k}</span><span style={{ fontWeight:600 }}>{v}</span></div>
                ))}
                <div style={{ borderTop:`1px solid ${T.border}`,paddingTop:10,display:"flex",justifyContent:"space-between",fontSize:16,fontWeight:900 }}>
                  <span>Total</span><span style={{ color:T.primary }}>Ksh {total.toLocaleString()}</span>
                </div>
              </div>
              <div style={{ background:T.successSoft,borderRadius:12,padding:12,marginBottom:16,fontSize:12,color:"#145A36" }}>🔒 Money held by KaziApa until you confirm receipt.</div>
              <Btn onClick={onCheckout}>Pay Now →</Btn>
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
        <div style={{ width:40,height:40,borderRadius:"50%",background:T.accent,display:"flex",alignItems:"center",justifyContent:"center",fontWeight:800,color:T.primary,fontSize:18 }}>{listing?.seller_name?.[0]}</div>
        <div style={{ flex:1 }}>
          <div style={{ color:"#fff",fontWeight:700,fontSize:14 }}>{listing?.seller_name}</div>
          {listing?.verified && <div style={{ fontSize:11,color:T.accent }}>✓ Verified · {listing?.town}</div>}
        </div>
        <div style={{ background:"rgba(255,255,255,0.12)",borderRadius:8,padding:"4px 10px",fontSize:11,color:"#fff" }}>{userPlan==="free"?`${Math.max(0,5-myCount)} left`:"∞"}</div>
      </div>
      {limited && (
        <div style={{ background:T.accentSoft,padding:"10px 16px",display:"flex",justifyContent:"space-between",alignItems:"center",borderBottom:`1px solid ${T.accent}` }}>
          <div style={{ fontSize:12,color:T.text }}>5 free messages reached.</div>
          <div onClick={onUpgrade} style={{ fontSize:12,fontWeight:800,color:T.primary,cursor:"pointer" }}>Upgrade →</div>
        </div>
      )}
      <div style={{ flex:1,overflowY:"auto",padding:16,display:"flex",flexDirection:"column",gap:8 }}>
        <div style={{ textAlign:"center",fontSize:11,color:T.textMuted,background:T.surface,borderRadius:8,padding:"6px 12px",alignSelf:"center",border:`1px solid ${T.border}` }}>
          🔒 Phone numbers stay private. Payments go through KaziApa.
        </div>
        {listing?.location && (
          <div style={{ background:T.successSoft,borderRadius:12,padding:12,border:`1px solid ${T.success}`,fontSize:12 }}>
            <div style={{ fontWeight:700,color:T.text,marginBottom:2 }}>📍 Seller Location</div>
            <div style={{ color:T.textMid }}>{listing.location}</div>
            <div style={{ color:T.textMuted,marginTop:4,fontSize:11 }}>You can visit personally to pick & choose, or request delivery.</div>
          </div>
        )}
        {msgs.map((msg,i)=>(
          <div key={i} style={{ display:"flex",justifyContent:msg.from==="me"?"flex-end":msg.from==="system"?"center":"flex-start" }}>
            {msg.from==="system"
              ? <div style={{ background:T.coralSoft,color:T.coral,borderRadius:10,padding:"8px 14px",maxWidth:"88%",fontSize:12,lineHeight:1.5,border:`1px solid ${T.coral}`,textAlign:"center" }}>{msg.text}</div>
              : <div style={{ background:msg.from==="me"?T.primary:T.card,color:msg.from==="me"?"#fff":T.text,borderRadius:msg.from==="me"?"16px 16px 4px 16px":"16px 16px 16px 4px",padding:"10px 14px",maxWidth:"76%",fontSize:14,lineHeight:1.4,border:msg.from==="me"?"none":`1px solid ${T.border}` }}>{msg.text}</div>
            }
          </div>
        ))}
        {showPay && (
          <div style={{ background:T.successSoft,borderRadius:14,padding:14,border:`1.5px solid ${T.success}` }}>
            <div style={{ fontWeight:700,color:T.text,fontSize:14,marginBottom:4 }}>✅ Ready to close this deal?</div>
            <div style={{ fontSize:12,color:T.textMuted,marginBottom:12 }}>Pay through KaziApa — money protected until you receive item.</div>
            <div style={{ display:"flex",gap:8,flexWrap:"wrap" }}>
              <button onClick={()=>setShowDel(true)} style={{ flex:1,padding:"10px 6px",background:T.primary,color:"#fff",border:"none",borderRadius:10,fontSize:12,fontWeight:800,cursor:"pointer",minWidth:100 }}>🏍️ Arrange Delivery</button>
              <button onClick={onCheckout} style={{ flex:1,padding:"10px 6px",background:T.success,color:"#fff",border:"none",borderRadius:10,fontSize:12,fontWeight:800,cursor:"pointer",minWidth:100 }}>💳 Pay Directly</button>
              <button onClick={()=>{ setMsgs(p=>[...p,{ from:"system",text:"📍 Seller is at: "+listing?.location+". You can visit personally to pick and pay on the spot." }]); setShowPay(false); }}
                style={{ width:"100%",padding:"10px 6px",background:T.accentSoft,color:T.accentDark,border:`1px solid ${T.accent}`,borderRadius:10,fontSize:12,fontWeight:800,cursor:"pointer",marginTop:4 }}>
                🚗 I'll Visit in Person
              </button>
            </div>
          </div>
        )}
      </div>
      <div style={{ padding:"10px 16px 20px",background:T.card,borderTop:`1px solid ${T.border}` }}>
        {!showPay && myCount>=2 && (
          <div style={{ display:"flex",gap:6,marginBottom:8,overflowX:"auto" }}>
            {[{ label:"💳 Pay Now",action:()=>setShowPay(true) },{ label:"🏍️ Delivery",action:()=>setShowDel(true) },{ label:"🚗 Visit",action:()=>setMsgs(p=>[...p,{ from:"system",text:"📍 "+listing?.location }]) },{ label:"💬 Final price?",action:()=>setInput("What is your final price?") }].map(q=>(
              <div key={q.label} onClick={q.action} style={{ background:T.surface,color:T.textMid,borderRadius:20,padding:"4px 12px",fontSize:11,fontWeight:700,whiteSpace:"nowrap",cursor:"pointer",border:`1px solid ${T.border}`,flexShrink:0 }}>{q.label}</div>
            ))}
          </div>
        )}
        <div style={{ display:"flex",gap:8 }}>
          <input value={input} onChange={e=>setInput(e.target.value)} placeholder={limited?"Upgrade to continue...":"Type a message..."} disabled={limited}
            style={{ flex:1,padding:"11px 15px",borderRadius:24,border:`1px solid ${T.border}`,fontSize:14,outline:"none",background:limited?T.surface:T.card,color:T.text }}
            onKeyDown={e=>{ if(e.key==="Enter") send(); }} />
          <button onClick={send} style={{ width:44,height:44,borderRadius:"50%",background:T.primary,border:"none",color:"#fff",fontSize:20,cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0 }}>↑</button>
        </div>
      </div>
    </div>
  );
}

// ─── MAIN APP ─────────────────────────────────────────────────────────────────
export default function KaziApa() {
  const [authStep,setAuthStep]   = useState("phone");
  const [phone,setPhone]         = useState("");
  const [otp,setOtp]             = useState(["","","","",""]);
  const [userName,setUserName]   = useState("");
  const [userTown,setUserTown]   = useState("");
  const [agreedPrivacy,setAgreedPrivacy] = useState(false);
  const [showPrivacy,setShowPrivacy]     = useState(false);
  const [lang,setLang]           = useState("en");
  const [screen,setScreen]       = useState("home");
  const [town,setTown]           = useState("All");
  const [catFilter,setCatFilter] = useState(null);
  const [search,setSearch]       = useState("");
  const [listings,setListings]   = useState([]);
  const [activeListing,setActiveListing] = useState(null);
  const [browseTab,setBrowseTab] = useState("listings");
  const [checkStep,setCheckStep] = useState(1);
  const [showUpgrade,setShowUpgrade] = useState(false);
  const [userPlan,setUserPlan]   = useState("free");
  const [chatMsgs,setChatMsgs]   = useState([{ from:"seller",text:"Hi! Thanks for your interest. How can I help?" }]);
  const [activeNav,setActiveNav] = useState("home");
  const [toast,setToast]         = useState(null);
  const [loading,setLoading]     = useState(false);
  const [requests,setRequests]   = useState([]);
  const [conciergeTxt,setConciergeTxt] = useState("");
  const [conciergeTown,setConciergeTown] = useState("");
  const [conciergeDone,setConciergeDone] = useState(false);

  // Post form
  const [postTitle,setPostTitle]   = useState("");
  const [postPrice,setPostPrice]   = useState("");
  const [postDesc,setPostDesc]     = useState("");
  const [postCat,setPostCat]       = useState("mitumba");
  const [postTown,setPostTown]     = useState("");
  const [postPhotos,setPostPhotos] = useState([]);
  const [postBoost,setPostBoost]   = useState(false);
  const [posting,setPosting]       = useState(false);

  function showToast(msg,type="success") { setToast({ msg,type }); setTimeout(()=>setToast(null),2800); }
  function nav(s,key) { setScreen(s); if(key) setActiveNav(key); }

  // Load listings from Supabase
  useEffect(()=>{
    if(authStep!=="app") return;
    loadListings();
    loadRequests();
  },[authStep,town,catFilter]);

  async function loadListings() {
    setLoading(true);
    let q = sb.from("listings").select("*").order("boosted",{ ascending:false }).order("created_at",{ ascending:false });
    if(town!=="All") q = q.eq("town",town);
    if(catFilter) q = q.eq("category",catFilter);
    if(search) q = q.ilike("title",`%${search}%`);
    const { data } = await q.limit(50);
    setListings(data||[]);
    setLoading(false);
  }

  async function loadRequests() {
    const { data } = await sb.from("requests").select("*").order("created_at",{ ascending:false }).limit(30);
    setRequests(data||[]);
  }

  async function postListing() {
    if(!postTitle||!postPrice||!postTown) { showToast("Fill in title, price and town first","error"); return; }
    setPosting(true);
    const { error } = await sb.from("listings").insert({
      title:postTitle,price:parseInt(postPrice),description:postDesc,
      category:postCat,town:postTown,seller_name:userName,
      seller_phone:phone,photos:postPhotos,boosted:postBoost,
    });
    if(error) { showToast("Error posting. Try again.","error"); }
    else {
      showToast("Listing posted and live immediately! 🎉");
      setPostTitle(""); setPostPrice(""); setPostDesc(""); setPostTown(""); setPostPhotos([]); setPostBoost(false);
      await loadListings();
      nav("home","home");
    }
    setPosting(false);
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
    setAuthStep("app"); setActiveNav("home"); showToast(`Welcome ${userName}! 🤝`);
  }

  if(authStep==="phone") return (
    <div style={{ fontFamily:"'Segoe UI',system-ui,sans-serif",background:T.primary,minHeight:"100vh",maxWidth:430,margin:"0 auto",display:"flex",flexDirection:"column",justifyContent:"space-between",padding:32 }}>
      {showPrivacy && <PrivacyModal setShowPrivacy={setShowPrivacy} />}
      <div style={{ marginTop:40 }}>
        <div style={{ fontSize:42,marginBottom:4 }}>🤝</div>
        <div style={{ fontSize:34,fontWeight:900,color:T.accent,letterSpacing:-1 }}>KaziApa</div>
        <div style={{ fontSize:15,color:"rgba(255,255,255,0.7)",marginTop:6 }}>Your local market, online.</div>
        <div style={{ marginTop:36,display:"flex",flexDirection:"column",gap:12 }}>
          {[["🔒","Safe M-Pesa escrow — money held until you confirm receipt."],["✓","Verified sellers — not random strangers."],["📍","Your town's market — fast, local, trusted."],["🤝","One account — buy, sell, find a house, offer services."]]
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
            I agree to the <span onClick={()=>setShowPrivacy(true)} style={{ color:T.accent,fontWeight:700,cursor:"pointer",textDecoration:"underline" }}>Privacy Policy</span> of KaziApa.
          </div>
        </div>
        <button onClick={()=>{ if(phone.length>=10&&agreedPrivacy) setAuthStep("otp"); else if(!agreedPrivacy) showToast("Please agree to privacy policy first.","error"); }}
          style={{ width:"100%",padding:16,background:T.accent,color:T.primary,border:"none",borderRadius:14,fontSize:16,fontWeight:800,cursor:"pointer",opacity:phone.length>=10&&agreedPrivacy?1:0.6 }}>
          Get Verification Code →
        </button>
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
          <input key={i} id={`otp${i}`} value={v} maxLength={1} type="tel"
            onChange={e=>{ const n=[...otp]; n[i]=e.target.value; setOtp(n); if(e.target.value&&i<4) document.getElementById(`otp${i+1}`)?.focus(); }}
            style={{ width:52,height:60,textAlign:"center",fontSize:24,fontWeight:800,borderRadius:12,border:`2px solid ${v?T.accent:"rgba(255,255,255,0.2)"}`,background:"rgba(255,255,255,0.08)",color:"#fff",outline:"none" }} />
        ))}
      </div>
      <div style={{ fontSize:12,color:"rgba(255,255,255,0.5)",textAlign:"center",marginTop:16 }}>Demo code: 1 2 3 4 5</div>
      <button onClick={()=>{ if(otp.join("")==="12345") setAuthStep("profile"); else showToast("Wrong code — try 12345","error"); }}
        style={{ width:"100%",padding:16,background:T.accent,color:T.primary,border:"none",borderRadius:14,fontSize:16,fontWeight:800,cursor:"pointer",marginTop:32 }}>
        Verify →
      </button>
      <div onClick={()=>showToast("New code sent!")} style={{ textAlign:"center",marginTop:20,color:T.accent,fontSize:13,fontWeight:600,cursor:"pointer" }}>Resend code</div>
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
      <div style={{ marginBottom:32 }}>
        <label style={{ fontSize:12,fontWeight:700,color:"rgba(255,255,255,0.7)",display:"block",marginBottom:8 }}>Your town or area</label>
        <input value={userTown} onChange={e=>setUserTown(e.target.value)} placeholder="e.g. Butula, Nakuru CBD, Kondele..."
          style={{ width:"100%",padding:"14px 16px",borderRadius:12,border:"2px solid rgba(255,255,255,0.2)",background:"rgba(255,255,255,0.08)",color:"#fff",fontSize:16,fontWeight:600,boxSizing:"border-box",outline:"none" }} />
        <div style={{ fontSize:11,color:"rgba(255,255,255,0.5)",marginTop:6 }}>Any town, market or estate in Kenya</div>
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

      {showPrivacy && <PrivacyModal setShowPrivacy={setShowPrivacy} />}

      {toast && (
        <div style={{ position:"fixed",top:16,left:"50%",transform:"translateX(-50%)",zIndex:300,background:toast.type==="success"?T.success:T.coral,color:"#fff",borderRadius:10,padding:"10px 20px",fontSize:13,fontWeight:600,boxShadow:"0 4px 16px rgba(0,0,0,0.18)",whiteSpace:"nowrap" }}>
          {toast.msg}
        </div>
      )}

      {showUpgrade && (
        <div style={{ position:"fixed",inset:0,background:T.overlay,zIndex:150,display:"flex",alignItems:"flex-end",justifyContent:"center" }} onClick={()=>setShowUpgrade(false)}>
          <div style={{ background:T.card,borderRadius:"22px 22px 0 0",padding:"28px 20px 36px",width:"100%",maxWidth:430 }} onClick={e=>e.stopPropagation()}>
            <div style={{ textAlign:"center",marginBottom:22 }}><div style={{ fontSize:40 }}>⚡</div><div style={{ fontSize:18,fontWeight:800,color:T.text,marginTop:8 }}>Unlock More on KaziApa</div><div style={{ fontSize:13,color:T.textMuted,marginTop:4 }}>Free plan: 5 chat messages/day.</div></div>
            {[{ plan:"daily",label:"Daily Pass",price:"Ksh 20 / day",perks:["Unlimited messages","Priority support"],color:T.primaryLight },
              { plan:"weekly",label:"Weekly Plan",price:"Ksh 50 / week",perks:["Unlimited messages","List up to 20 items","1 free boost"],color:T.primary }
            ].map(p=>(
              <div key={p.plan} onClick={()=>{ setUserPlan(p.plan); setShowUpgrade(false); showToast(`Upgraded to ${p.label}!`); }}
                style={{ background:p.color,borderRadius:14,padding:"14px 18px",marginBottom:12,cursor:"pointer",display:"flex",justifyContent:"space-between",alignItems:"center" }}>
                <div><div style={{ color:"#fff",fontWeight:700,fontSize:15 }}>{p.label}</div>{p.perks.map(pk=><div key={pk} style={{ color:"rgba(255,255,255,0.75)",fontSize:12 }}>✓ {pk}</div>)}</div>
                <div style={{ color:T.accent,fontWeight:800,fontSize:16 }}>{p.price}</div>
              </div>
            ))}
            <div style={{ background:T.accentSoft,borderRadius:14,padding:"14px 18px",marginBottom:16,border:`1px solid ${T.accent}`,cursor:"pointer" }} onClick={()=>{ setShowUpgrade(false); showToast("Verified badge request sent!"); }}>
              <div style={{ fontWeight:700,color:T.text,fontSize:14 }}>✓ Get Verified Seller Badge</div>
              <div style={{ fontSize:12,color:T.textMuted,marginTop:2 }}>Show ✓ on all your listings. Build buyer trust.</div>
              <div style={{ color:T.accentDark,fontWeight:800,marginTop:6 }}>Ksh 200 one-time</div>
            </div>
            <button onClick={()=>setShowUpgrade(false)} style={{ width:"100%",padding:13,borderRadius:12,border:`1px solid ${T.border}`,background:T.card,color:T.textMuted,fontSize:14,cursor:"pointer" }}>Maybe Later</button>
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
                  <span style={{ color:T.accent,fontSize:22,fontWeight:900,letterSpacing:-0.5 }}>KaziApa</span>
                </div>
                <div style={{ color:"rgba(255,255,255,0.6)",fontSize:12 }}>Welcome back, {userName}!</div>
              </div>
              <div style={{ display:"flex",gap:8 }}>
                <div onClick={()=>setShowUpgrade(true)} style={{ background:T.accent,borderRadius:20,padding:"5px 13px",fontSize:12,fontWeight:700,color:T.primary,cursor:"pointer" }}>⚡ Upgrade</div>
                <div onClick={()=>setLang(lang==="en"?"sw":"en")} style={{ background:"rgba(255,255,255,0.12)",borderRadius:20,padding:"5px 10px",fontSize:11,color:"#fff",cursor:"pointer",fontWeight:600 }}>{lang==="en"?"SW":"EN"}</div>
              </div>
            </div>
          </div>
          <div style={{ padding:"14px 16px 4px" }}>
            <div style={{ background:T.card,borderRadius:13,padding:"11px 14px",display:"flex",alignItems:"center",gap:8,border:`1px solid ${T.border}` }}>
              <span style={{ fontSize:16 }}>🔍</span>
              <input value={search} onChange={e=>{ setSearch(e.target.value); setTimeout(loadListings,500); }} placeholder="Search anything across Kenya..."
                style={{ border:"none",outline:"none",flex:1,fontSize:14,color:T.text,background:"transparent" }} />
              {search && <span onClick={()=>{ setSearch(""); loadListings(); }} style={{ color:T.textMuted,cursor:"pointer",fontSize:20 }}>×</span>}
            </div>
          </div>
          <div style={{ margin:"14px 16px 4px",background:`linear-gradient(130deg,${T.primary},${T.primaryMid})`,borderRadius:16,padding:"16px 18px",cursor:"pointer" }}
            onClick={()=>{ nav("browse","browse"); setBrowseTab("concierge"); }}>
            <div style={{ color:T.accent,fontSize:10,fontWeight:700,letterSpacing:1.2,marginBottom:5 }}>CONCIERGE SERVICE</div>
            <div style={{ color:"#fff",fontWeight:800,fontSize:15 }}>Can't find what you need?</div>
            <div style={{ color:"rgba(255,255,255,0.65)",fontSize:12,marginTop:3 }}>Tell us — we'll find it within 3–6 hours. →</div>
          </div>
          <div style={{ padding:"16px 16px 4px" }}>
            <div style={{ fontSize:13,fontWeight:800,color:T.text,marginBottom:12 }}>Categories</div>
            <div style={{ display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:9 }}>
              {CATEGORIES.map(cat=>(
                <div key={cat.id} onClick={()=>{ setCatFilter(cat.id); nav("browse","browse"); setBrowseTab("listings"); }}
                  style={{ background:T.card,borderRadius:13,padding:"14px 8px 10px",textAlign:"center",cursor:"pointer",border:`1px solid ${T.border}`,position:"relative",overflow:"hidden" }}>
                  <div style={{ position:"absolute",top:0,left:0,right:0,height:4,background:cat.color }} />
                  <div style={{ fontSize:26,marginBottom:5 }}>{cat.icon}</div>
                  <div style={{ fontSize:12,fontWeight:800,color:cat.color }}>{lang==="sw"?cat.sw:cat.en}</div>
                  <div style={{ fontSize:10,color:T.textMuted,marginTop:1 }}>{cat.sub}</div>
                </div>
              ))}
            </div>
          </div>
          <div style={{ padding:"16px 16px 0" }}>
            <div style={{ display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:12 }}>
              <div style={{ fontSize:13,fontWeight:800,color:T.text }}>Latest Listings</div>
              <div onClick={()=>{ setCatFilter(null); nav("browse","browse"); }} style={{ fontSize:12,color:T.primaryLight,cursor:"pointer",fontWeight:600 }}>See All →</div>
            </div>
            {loading ? <div style={{ textAlign:"center",padding:30,color:T.textMuted }}>Loading...</div>
              : filtered.length===0
                ? <div style={{ textAlign:"center",padding:30,color:T.textMuted }}>
                    <div style={{ fontSize:44 }}>📦</div>
                    <div style={{ marginTop:12,fontWeight:700,color:T.text }}>No listings yet.</div>
                    <div style={{ fontSize:13,marginTop:6 }}>Be the first to post something!</div>
                  </div>
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
                {catFilter?(CATEGORIES.find(c=>c.id===catFilter)?.[lang==="sw"?"sw":"en"]):"All Listings"}
              </div>
            </div>
            <div style={{ display:"flex",gap:6,paddingBottom:14 }}>
              {[["listings","Listings"],["concierge","Special Request"]].map(([tab,label])=>(
                <div key={tab} onClick={()=>setBrowseTab(tab)} style={{ background:browseTab===tab?T.accent:"rgba(255,255,255,0.12)",color:browseTab===tab?T.primary:"#fff",borderRadius:20,padding:"5px 16px",fontSize:12,fontWeight:700,cursor:"pointer" }}>{label}</div>
              ))}
            </div>
          </div>
          {browseTab==="listings" && (
            <div style={{ padding:"14px 16px" }}>
              <div style={{ display:"flex",gap:8,marginBottom:12 }}>
                <div style={{ flex:1,background:T.card,borderRadius:11,padding:"9px 12px",display:"flex",alignItems:"center",gap:6,border:`1px solid ${T.border}` }}>
                  <span>🔍</span>
                  <input value={search} onChange={e=>{ setSearch(e.target.value); setTimeout(loadListings,500); }} placeholder="Search listings..."
                    style={{ border:"none",outline:"none",flex:1,fontSize:13,background:"transparent",color:T.text }} />
                </div>
                <input value={town} onChange={e=>setTown(e.target.value)} placeholder="Town..."
                  style={{ width:100,padding:"9px 10px",borderRadius:11,border:`1px solid ${T.border}`,fontSize:12,color:T.text,background:T.card }} />
              </div>
              <div style={{ display:"flex",gap:6,overflowX:"auto",paddingBottom:10,marginBottom:4 }}>
                <div onClick={()=>{ setCatFilter(null); loadListings(); }} style={{ background:!catFilter?T.primary:T.card,color:!catFilter?"#fff":T.textMuted,borderRadius:20,padding:"5px 14px",fontSize:12,fontWeight:600,whiteSpace:"nowrap",cursor:"pointer",border:`1px solid ${T.border}`,flexShrink:0 }}>All</div>
                {CATEGORIES.map(cat=>(
                  <div key={cat.id} onClick={()=>{ setCatFilter(catFilter===cat.id?null:cat.id); }}
                    style={{ background:catFilter===cat.id?cat.color:T.card,color:catFilter===cat.id?"#fff":T.textMuted,borderRadius:20,padding:"5px 14px",fontSize:12,fontWeight:600,whiteSpace:"nowrap",cursor:"pointer",border:`1px solid ${T.border}`,flexShrink:0 }}>
                    {cat.icon} {lang==="sw"?cat.sw:cat.en}
                  </div>
                ))}
              </div>
              {loading ? <div style={{ textAlign:"center",padding:30,color:T.textMuted }}>Loading...</div>
                : filtered.length===0
                  ? <div style={{ textAlign:"center",padding:"50px 20px",color:T.textMuted }}>
                      <div style={{ fontSize:44 }}>🔍</div>
                      <div style={{ fontWeight:700,fontSize:15,marginTop:12,color:T.text }}>Nothing here yet.</div>
                      <button onClick={()=>setBrowseTab("concierge")} style={{ marginTop:16,background:T.primary,color:"#fff",border:"none",borderRadius:10,padding:"10px 22px",fontSize:13,fontWeight:700,cursor:"pointer" }}>Make a Request</button>
                    </div>
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
          <BackHeader title={activeListing.title} onBack={()=>nav("browse","browse")} />
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
                <div style={{ fontSize:22,fontWeight:900,color:T.primary }}>Ksh {activeListing.price?.toLocaleString()}</div>
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
                {activeListing.verified && <div style={{ fontSize:11,color:T.success,fontWeight:600 }}>✓ Verified Seller</div>}
              </div>
              <button onClick={()=>{ setChatMsgs([{ from:"seller",text:`Hi ${userName}! I saw you're interested in the ${activeListing.title}. How can I help?` }]); nav("chat","browse"); }}
                style={{ background:T.surface,border:`1px solid ${T.border}`,borderRadius:10,padding:"8px 14px",fontSize:13,fontWeight:700,color:T.primary,cursor:"pointer" }}>
                💬 Chat
              </button>
            </div>
            <div style={{ background:T.successSoft,borderRadius:13,padding:13,marginBottom:16,fontSize:12,color:"#145A36",lineHeight:1.5 }}>
              🔒 KaziApa protects you: Money held until you confirm receipt.
            </div>
            <Btn onClick={()=>{ setCheckStep(1); nav("checkout","browse"); }}>
              Buy Now — Ksh {((activeListing.price||0)+50).toLocaleString()}
            </Btn>
            <div style={{ textAlign:"center",fontSize:11,color:T.textMuted,marginTop:6 }}>Ksh {activeListing.price?.toLocaleString()} + Ksh 50 buyer protection</div>
          </div>
        </div>
      )}

      {/* CHAT */}
      {screen==="chat" && (
        <SmartChat listing={activeListing} userPlan={userPlan} msgs={chatMsgs} setMsgs={setChatMsgs} userName={userName}
          onBack={()=>nav("listing","browse")} onCheckout={()=>{ setCheckStep(1); nav("checkout","browse"); }} onUpgrade={()=>setShowUpgrade(true)} />
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
                  {[["Item",`Ksh ${activeListing.price?.toLocaleString()}`],["Buyer protection","Ksh 50"]].map(([k,v])=>(
                    <div key={k} style={{ display:"flex",justifyContent:"space-between",marginBottom:10,fontSize:14 }}><span style={{ color:T.textMid }}>{k}</span><span style={{ fontWeight:600 }}>{v}</span></div>
                  ))}
                  <div style={{ borderTop:`1px solid ${T.border}`,paddingTop:10,display:"flex",justifyContent:"space-between",fontSize:16,fontWeight:900 }}>
                    <span>Total</span><span style={{ color:T.primary }}>Ksh {((activeListing.price||0)+50).toLocaleString()}</span>
                  </div>
                </div>
                <div style={{ background:T.successSoft,borderRadius:12,padding:13,marginBottom:16,fontSize:12,color:"#145A36",lineHeight:1.5 }}>✅ Your money is held securely until you confirm delivery.</div>
                <Btn onClick={()=>setCheckStep(2)}>Continue →</Btn>
              </div>
            )}
            {checkStep===2 && (
              <div>
                <div style={{ background:T.card,borderRadius:14,padding:16,marginBottom:14,border:`1px solid ${T.border}` }}>
                  <div style={{ fontWeight:800,color:T.text,marginBottom:14 }}>Pay via M-Pesa</div>
                  <div style={{ background:T.surface,borderRadius:11,padding:14,marginBottom:14,fontSize:13,color:T.textMid,lineHeight:2 }}>
                    <div>1. M-Pesa → <strong>Lipa Na M-Pesa → Pay Bill</strong></div>
                    <div>2. Business No: <strong style={{ color:T.primary }}>522522</strong></div>
                    <div>3. Account: <strong style={{ color:T.primary }}>KAZI{activeListing.id?.slice(0,8).toUpperCase()}</strong></div>
                    <div>4. Amount: <strong style={{ color:T.primary }}>Ksh {((activeListing.price||0)+50).toLocaleString()}</strong></div>
                  </div>
                  {[["Your M-Pesa number","07XXXXXXXX"],["Confirmation code","QHX1234ABC"]].map(([label,ph])=>(
                    <div key={label} style={{ marginBottom:12 }}>
                      <label style={{ fontSize:12,fontWeight:700,color:T.text,display:"block",marginBottom:6 }}>{label}</label>
                      <input placeholder={ph} style={{ width:"100%",padding:"11px 13px",borderRadius:11,border:`1px solid ${T.border}`,fontSize:14,boxSizing:"border-box",color:T.text }} />
                    </div>
                  ))}
                </div>
                <Btn onClick={async()=>{
                  await sb.from("orders").insert({ listing_id:activeListing.id,buyer_phone:phone,buyer_name:userName,seller_phone:activeListing.seller_phone,amount:(activeListing.price||0)+50,status:"paid" });
                  setCheckStep(3); showToast("Payment confirmed!");
                }} color={T.success}>Confirm Payment ✓</Btn>
              </div>
            )}
            {checkStep===3 && (
              <div style={{ textAlign:"center",padding:"20px 0" }}>
                <div style={{ fontSize:68 }}>🎉</div>
                <div style={{ fontSize:22,fontWeight:900,color:T.text,marginTop:16 }}>Order Placed!</div>
                <div style={{ fontSize:14,color:T.textMid,marginTop:10,lineHeight:1.6,padding:"0 10px" }}>Seller notified. Confirm receipt to release payment.</div>
                <div style={{ background:T.accentSoft,borderRadius:13,padding:14,margin:"20px 0",border:`1px solid ${T.accent}` }}>
                  <div style={{ fontSize:12,color:T.textMuted }}>Order ID</div>
                  <div style={{ fontSize:14,fontWeight:900,color:T.primary,marginTop:4 }}>KAZI-{Date.now().toString().slice(-6)}</div>
                </div>
                <Btn onClick={()=>{ nav("home","home"); setCheckStep(1); }}>Back to Home</Btn>
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
            <PhotoUploader photos={postPhotos} setPhotos={setPostPhotos} maxPhotos={6} />
            <Field label="Title" value={postTitle} onChange={setPostTitle} placeholder="e.g. Levi's Jeans Waist 34 Grade A" />
            <Field label="Price (Ksh)" value={postPrice} onChange={setPostPrice} placeholder="850" type="number" />
            <Field label="Description" value={postDesc} onChange={setPostDesc} placeholder="Describe clearly — condition, size, colour, defects if any..." rows={4} />
            <div style={{ marginBottom:14 }}>
              <label style={{ fontSize:12,fontWeight:700,color:T.text,display:"block",marginBottom:7 }}>Category</label>
              <select value={postCat} onChange={e=>setPostCat(e.target.value)} style={{ width:"100%",padding:"11px 13px",borderRadius:11,border:`1px solid ${T.border}`,fontSize:14,color:T.text,background:T.card }}>
                {CATEGORIES.filter(c=>c.id!=="nyumba").map(c=><option key={c.id} value={c.id}>{c.icon} {lang==="sw"?c.sw:c.en} — {c.sub}</option>)}
              </select>
            </div>
            <Field label="Your Town / Area" value={postTown} onChange={setPostTown} placeholder="e.g. Butula, Kondele, Gikomba, Nakuru CBD..." />
            <div style={{ background:T.accentSoft,borderRadius:14,padding:16,marginBottom:18,border:`1px solid ${T.accent}` }}>
              <div style={{ display:"flex",justifyContent:"space-between",alignItems:"center" }}>
                <div><div style={{ fontWeight:700,color:T.text,fontSize:14 }}>⚡ Boost this Listing</div><div style={{ fontSize:12,color:T.textMuted,marginTop:2 }}>Appear at the top for 7 days — Ksh 100</div></div>
                <div onClick={()=>setPostBoost(!postBoost)} style={{ width:48,height:26,borderRadius:13,background:postBoost?T.accent:T.border,position:"relative",cursor:"pointer",flexShrink:0 }}>
                  <div style={{ width:20,height:20,borderRadius:"50%",background:"#fff",position:"absolute",top:3,left:postBoost?25:3,transition:"left 0.2s",boxShadow:"0 1px 3px rgba(0,0,0,0.2)" }} />
                </div>
              </div>
            </div>
            <Btn onClick={postListing} disabled={posting}>{posting?"Posting...":postBoost?"Publish + Boost — Ksh 100":"Publish — Free"}</Btn>
            <div style={{ textAlign:"center",fontSize:11,color:T.textMuted,marginTop:8 }}>Listings go live immediately on KaziApa.</div>
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
              <div style={{ width:58,height:58,borderRadius:"50%",background:T.accent,display:"flex",alignItems:"center",justifyContent:"center",fontSize:26,fontWeight:800,color:T.primary }}>{userName[0]?.toUpperCase()}</div>
              <div>
                <div style={{ color:"#fff",fontWeight:800,fontSize:18 }}>{userName}</div>
                <div style={{ color:"rgba(255,255,255,0.6)",fontSize:12 }}>{userTown} · {phone} · {userPlan==="free"?"Free Plan":userPlan==="daily"?"Daily ⚡":"Weekly ⚡"}</div>
              </div>
            </div>
          </div>
          <div style={{ padding:16 }}>
            {[
              { icon:"📦",label:"My Listings",       action:()=>{ setCatFilter(null); nav("browse","browse"); } },
              { icon:"🛒",label:"My Orders",          action:()=>{} },
              { icon:"🏠",label:"Housing & Rentals",  action:()=>nav("housing","browse"), highlight:true },
              { icon:"⚡",label:"Upgrade Plan",       action:()=>setShowUpgrade(true), accent:true },
              { icon:"✓", label:"Get Verified Badge", action:()=>setShowUpgrade(true), accent:true },
              { icon:"🌍",label:"Language",           action:()=>setLang(lang==="en"?"sw":"en"), sub:lang==="en"?"Switch to Kiswahili":"Switch to English" },
              { icon:"🔒",label:"Privacy Policy",     action:()=>setShowPrivacy(true) },
              { icon:"🚪",label:"Log Out",            action:()=>{ setAuthStep("phone"); setUserName(""); setPhone(""); setOtp(["","","","",""]); } },
            ].map((item,i)=>(
              <div key={i} onClick={item.action} style={{ background:T.card,borderRadius:13,padding:"14px 16px",marginBottom:8,display:"flex",alignItems:"center",gap:13,cursor:"pointer",border:item.accent?`1px solid ${T.accent}`:item.highlight?`1px solid ${T.primary}`:`1px solid ${T.border}` }}>
                <span style={{ fontSize:20 }}>{item.icon}</span>
                <div style={{ flex:1 }}>
                  <div style={{ fontSize:14,fontWeight:item.accent||item.highlight?700:500,color:item.accent?T.accentDark:item.highlight?T.primary:T.text }}>{item.label}</div>
                  {item.sub && <div style={{ fontSize:11,color:T.textMuted,marginTop:1 }}>{item.sub}</div>}
                </div>
                <span style={{ color:T.textMuted,fontSize:16 }}>›</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* HOUSING placeholder */}
      {screen==="housing" && (
        <div>
          <BackHeader title="🏠 Housing & Rentals" onBack={()=>nav("home","home")} />
          <div style={{ padding:20,textAlign:"center",color:T.textMuted,marginTop:40 }}>
            <div style={{ fontSize:56 }}>🏠</div>
            <div style={{ fontWeight:700,color:T.text,fontSize:16,marginTop:16 }}>Housing Module</div>
            <div style={{ fontSize:13,marginTop:8,lineHeight:1.6 }}>Full housing with agent model, viewing bookings and commission notices — coming in the next update.</div>
          </div>
        </div>
      )}

      {/* BOTTOM NAV */}
      {screen!=="chat" && (
        <div style={{ position:"fixed",bottom:0,left:"50%",transform:"translateX(-50%)",width:"100%",maxWidth:430,background:T.card,borderTop:`1px solid ${T.border}`,display:"flex",zIndex:50,boxShadow:"0 -2px 12px rgba(0,102,204,0.08)" }}>
          {[
            { icon:"🏠",en:"Home",    s:"home",     key:"home" },
            { icon:"🔍",en:"Browse",  s:"browse",   key:"browse" },
            { icon:"📋",en:"Requests",s:"requests", key:"requests" },
            { icon:"➕",en:"Post",    s:"post",      key:"post" },
            { icon:"👤",en:"Profile", s:"profile",  key:"profile" },
          ].map(n=>(
            <div key={n.key} onClick={()=>{ nav(n.s,n.key); if(n.s==="browse"){ setCatFilter(null); setBrowseTab("listings"); } }}
              style={{ flex:1,padding:"10px 0 8px",textAlign:"center",cursor:"pointer" }}>
              <div style={{ fontSize:20 }}>{n.icon}</div>
              <div style={{ fontSize:9,color:activeNav===n.key?T.primary:T.textMuted,fontWeight:activeNav===n.key?800:400,marginTop:2 }}>{n.en}</div>
              {activeNav===n.key && <div style={{ width:16,height:3,background:T.primary,borderRadius:2,margin:"3px auto 0" }} />}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ─── PRIVACY MODAL ────────────────────────────────────────────────────────────
function PrivacyModal({ setShowPrivacy }) {
  return (
    <div style={{ position:"fixed",inset:0,background:"rgba(0,51,102,0.6)",zIndex:200,display:"flex",alignItems:"flex-end",justifyContent:"center" }} onClick={()=>setShowPrivacy(false)}>
      <div style={{ background:"#fff",borderRadius:"22px 22px 0 0",padding:"24px 20px 40px",width:"100%",maxWidth:430,maxHeight:"80vh",overflowY:"auto" }} onClick={e=>e.stopPropagation()}>
        <div style={{ fontWeight:800,color:"#0A1628",fontSize:18,marginBottom:16 }}>Privacy Policy — KaziApa</div>
        {[["What we collect","Your phone number, name, town, and listings you post. Transaction history within the app."],
          ["How we use it","To connect buyers and sellers, process orders, and improve the platform. We never sell your data."],
          ["Your rights","You can request deletion of your account at any time by contacting us."],
          ["Data security","All data stored securely on Supabase (EU servers). M-Pesa via official Safaricom channels."],
          ["Kenya Data Protection Act 2019","KaziApa complies with the Kenya Data Protection Act 2019."],
          ["Contact","privacy@kaziapa.co.ke"],
        ].map(([title,body])=>(
          <div key={title} style={{ marginBottom:16 }}>
            <div style={{ fontWeight:700,color:"#0A1628",fontSize:14,marginBottom:4 }}>{title}</div>
            <div style={{ fontSize:13,color:"#3A4A5C",lineHeight:1.6 }}>{body}</div>
          </div>
        ))}
        <button onClick={()=>setShowPrivacy(false)} style={{ width:"100%",padding:13,background:"#0066CC",color:"#fff",border:"none",borderRadius:12,fontSize:14,fontWeight:700,cursor:"pointer" }}>Close</button>
      </div>
    </div>
  );
}

// ─── REQUEST BOARD ────────────────────────────────────────────────────────────
function RequestBoard({ userName,phone,town,requests,setRequests,showToast }) {
  const [showForm,setShowForm] = useState(false);
  const [activeReq,setActiveReq] = useState(null);
  const [replyText,setReplyText] = useState("");
  const [replies,setReplies]   = useState({});
  const [form,setForm]         = useState({ item:"",budget:"",area:"",town:town!=="All"?town:"",category:"mitumba" });
  const filtered = town==="All"?requests:requests.filter(r=>r.town===town);

  async function postRequest() {
    if(!form.item.trim()||!form.budget) return;
    const { data } = await sb.from("requests").insert({ buyer_name:userName,buyer_phone:phone,item:form.item,budget:parseInt(form.budget),category:form.category,town:form.town||town,area:form.area }).select();
    if(data?.[0]) { setRequests(p=>[data[0],...p]); setShowForm(false); setForm({ item:"",budget:"",area:"",town:"",category:"mitumba" }); showToast("Request posted! Sellers can see it now."); }
  }

  async function postReply(reqId) {
    if(!replyText.trim()) return;
    const { data } = await sb.from("request_replies").insert({ request_id:reqId,seller_name:userName,seller_phone:phone,message:replyText }).select();
    if(data?.[0]) { setReplies(p=>({...p,[reqId]:[...(p[reqId]||[]),data[0]]})); setReplyText(""); showToast("Response sent!"); }
  }

  async function loadReplies(reqId) {
    const { data } = await sb.from("request_replies").select("*").eq("request_id",reqId).order("created_at");
    setReplies(p=>({...p,[reqId]:data||[]}));
  }

  if(activeReq) {
    const req = requests.find(r=>r.id===activeReq);
    const reqReplies = replies[activeReq]||[];
    return (
      <div>
        <BackHeader title="Request Details" onBack={()=>setActiveReq(null)} right={<div style={{ background:CAT_COLOR[req.category]||"#0066CC",borderRadius:8,padding:"3px 10px",fontSize:11,color:"#fff",fontWeight:700 }}>{CAT_ICON[req.category]||"📦"} {req.category}</div>} />
        <div style={{ padding:16 }}>
          <div style={{ background:"#FFF8E7",borderRadius:16,padding:16,marginBottom:16,border:"1px solid #F5A623" }}>
            <div style={{ display:"flex",justifyContent:"space-between",marginBottom:6 }}>
              <div style={{ fontWeight:800,color:"#0A1628",fontSize:16,flex:1 }}>{req.item}</div>
              <div style={{ fontSize:15,fontWeight:800,color:"#0066CC" }}>Ksh {req.budget}</div>
            </div>
            <div style={{ fontSize:12,color:"#7A8A9C" }}>📍 {req.area&&req.area+", "}{req.town} · {req.buyer_name}</div>
          </div>
          <div style={{ fontSize:13,fontWeight:800,color:"#0A1628",marginBottom:12 }}>Seller Responses ({reqReplies.length})</div>
          {reqReplies.length===0
            ? <div style={{ textAlign:"center",padding:"30px 0",color:"#7A8A9C" }}><div style={{ fontSize:36 }}>💬</div><div style={{ marginTop:8 }}>No responses yet. Be the first!</div></div>
            : reqReplies.map((r,i)=>(
              <div key={i} style={{ background:"#fff",borderRadius:14,padding:14,marginBottom:10,border:"1px solid #DCE8F5" }}>
                <div style={{ display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:8 }}>
                  <div style={{ display:"flex",alignItems:"center",gap:8 }}>
                    <div style={{ width:36,height:36,borderRadius:"50%",background:"#0066CC",display:"flex",alignItems:"center",justifyContent:"center",color:"#fff",fontWeight:800 }}>{r.seller_name?.[0]}</div>
                    <div style={{ fontWeight:700,color:"#0A1628",fontSize:13 }}>{r.seller_name}</div>
                  </div>
                </div>
                <div style={{ fontSize:13,color:"#3A4A5C",lineHeight:1.5 }}>{r.message}</div>
              </div>
            ))
          }
          <div style={{ background:"#fff",borderRadius:16,padding:16,marginTop:8,border:"1.5px solid #3385D6" }}>
            <div style={{ fontSize:13,fontWeight:700,color:"#0A1628",marginBottom:10 }}>Respond to this Request</div>
            <textarea value={replyText} onChange={e=>setReplyText(e.target.value)} placeholder="Describe what you have, your price, and location..." rows={3}
              style={{ width:"100%",padding:"11px 13px",borderRadius:11,border:"1px solid #DCE8F5",fontSize:14,resize:"none",boxSizing:"border-box",color:"#0A1628" }} />
            <button onClick={()=>postReply(activeReq)} style={{ width:"100%",padding:12,background:"#0066CC",color:"#fff",border:"none",borderRadius:11,fontSize:14,fontWeight:700,cursor:"pointer",marginTop:10 }}>
              Send Response →
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div style={{ background:"#0066CC",padding:"16px 16px 0",borderRadius:"0 0 18px 18px" }}>
        <div style={{ display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:12 }}>
          <div>
            <div style={{ color:"#F5A623",fontSize:10,fontWeight:700,letterSpacing:1 }}>LIVE BOARD</div>
            <div style={{ color:"#fff",fontWeight:800,fontSize:18 }}>Buyer Requests</div>
          </div>
          <button onClick={()=>setShowForm(true)} style={{ background:"#F5A623",border:"none",borderRadius:22,padding:"8px 16px",fontSize:13,fontWeight:800,color:"#0066CC",cursor:"pointer" }}>
            + Post Need
          </button>
        </div>
        <div style={{ paddingBottom:14 }} />
      </div>

      {showForm && (
        <div style={{ position:"fixed",inset:0,background:"rgba(0,51,102,0.6)",zIndex:150,display:"flex",alignItems:"flex-end",justifyContent:"center" }} onClick={()=>setShowForm(false)}>
          <div style={{ background:"#fff",borderRadius:"22px 22px 0 0",padding:"24px 20px 36px",width:"100%",maxWidth:430 }} onClick={e=>e.stopPropagation()}>
            <div style={{ fontWeight:800,color:"#0A1628",fontSize:17,marginBottom:16 }}>I Need...</div>
            <div style={{ marginBottom:12 }}>
              <label style={{ fontSize:12,fontWeight:700,color:"#0A1628",display:"block",marginBottom:6 }}>What do you need?</label>
              <input value={form.item} onChange={e=>setForm({...form,item:e.target.value})} placeholder="e.g. Newborn socks size 0-3 months"
                style={{ width:"100%",padding:"11px 13px",borderRadius:11,border:"1px solid #DCE8F5",fontSize:14,boxSizing:"border-box",color:"#0A1628" }} />
            </div>
            <div style={{ display:"flex",gap:10,marginBottom:12 }}>
              <div style={{ flex:1 }}>
                <label style={{ fontSize:12,fontWeight:700,color:"#0A1628",display:"block",marginBottom:6 }}>Budget (Ksh)</label>
                <input value={form.budget} onChange={e=>setForm({...form,budget:e.target.value})} type="number" placeholder="300"
                  style={{ width:"100%",padding:"11px 13px",borderRadius:11,border:"1px solid #DCE8F5",fontSize:14,boxSizing:"border-box",color:"#0A1628" }} />
              </div>
              <div style={{ flex:1 }}>
                <label style={{ fontSize:12,fontWeight:700,color:"#0A1628",display:"block",marginBottom:6 }}>Your Area</label>
                <input value={form.area} onChange={e=>setForm({...form,area:e.target.value})} placeholder="e.g. Kondele"
                  style={{ width:"100%",padding:"11px 13px",borderRadius:11,border:"1px solid #DCE8F5",fontSize:14,boxSizing:"border-box",color:"#0A1628" }} />
              </div>
            </div>
            <div style={{ display:"flex",gap:10,marginBottom:18 }}>
              <div style={{ flex:1 }}>
                <label style={{ fontSize:12,fontWeight:700,color:"#0A1628",display:"block",marginBottom:6 }}>Town</label>
                <input value={form.town} onChange={e=>setForm({...form,town:e.target.value})} placeholder="e.g. Kisumu"
                  style={{ width:"100%",padding:"11px 13px",borderRadius:11,border:"1px solid #DCE8F5",fontSize:14,boxSizing:"border-box",color:"#0A1628" }} />
              </div>
              <div style={{ flex:1 }}>
                <label style={{ fontSize:12,fontWeight:700,color:"#0A1628",display:"block",marginBottom:6 }}>Category</label>
                <select value={form.category} onChange={e=>setForm({...form,category:e.target.value})} style={{ width:"100%",padding:"11px 13px",borderRadius:11,border:"1px solid #DCE8F5",fontSize:14,color:"#0A1628",background:"#fff" }}>
                  {CATEGORIES.map(c=><option key={c.id} value={c.id}>{c.icon} {c.en}</option>)}
                </select>
              </div>
            </div>
            <button onClick={postRequest} style={{ width:"100%",padding:14,background:"#0066CC",color:"#fff",border:"none",borderRadius:13,fontSize:15,fontWeight:800,cursor:"pointer" }}>
              Post Request →
            </button>
          </div>
        </div>
      )}

      <div style={{ margin:"14px 16px 0",background:"#E8F5EE",borderRadius:13,padding:"10px 14px",border:"1px solid #1E9B5A",fontSize:12,color:"#145A36" }}>
        💡 Sellers see these requests and respond directly. You pick the best offer.
      </div>
      <div style={{ padding:"14px 16px" }}>
        {filtered.length===0
          ? <div style={{ textAlign:"center",padding:"50px 0",color:"#7A8A9C" }}>
              <div style={{ fontSize:44 }}>📋</div>
              <div style={{ fontWeight:700,fontSize:15,marginTop:12,color:"#0A1628" }}>No requests yet.</div>
              <button onClick={()=>setShowForm(true)} style={{ marginTop:16,background:"#0066CC",color:"#fff",border:"none",borderRadius:11,padding:"11px 24px",fontSize:14,fontWeight:700,cursor:"pointer" }}>+ Post a Need</button>
            </div>
          : filtered.map(req=>(
            <div key={req.id} onClick={()=>{ setActiveReq(req.id); loadReplies(req.id); }}
              style={{ background:"#fff",borderRadius:14,marginBottom:10,overflow:"hidden",border:`1px solid #DCE8F5`,cursor:"pointer" }}>
              <div style={{ height:4,background:CAT_COLOR[req.category]||"#0066CC" }} />
              <div style={{ padding:"12px 14px" }}>
                <div style={{ display:"flex",justifyContent:"space-between",gap:8 }}>
                  <div style={{ flex:1 }}>
                    <div style={{ fontWeight:700,color:"#0A1628",fontSize:14 }}>{req.item}</div>
                    <div style={{ fontSize:11,color:"#7A8A9C",marginTop:3 }}>📍 {req.area&&req.area+", "}{req.town} · {req.buyer_name}</div>
                  </div>
                  <div style={{ textAlign:"right",flexShrink:0 }}>
                    <div style={{ fontSize:15,fontWeight:800,color:"#0066CC" }}>Ksh {req.budget}</div>
                  </div>
                </div>
                <div style={{ display:"flex",justifyContent:"space-between",alignItems:"center",marginTop:10 }}>
                  <div style={{ background:CAT_COLOR[req.category]||"#0066CC",borderRadius:6,padding:"2px 9px",fontSize:10,color:"#fff",fontWeight:700 }}>{CAT_ICON[req.category]||"📦"} {req.category}</div>
                  <div style={{ background:"#FFF8E7",borderRadius:20,padding:"3px 10px",fontSize:11,fontWeight:700,color:"#C4841A" }}>Tap to respond →</div>
                </div>
              </div>
            </div>
          ))
        }
      </div>
    </div>
  );
}
