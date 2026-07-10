import { useState, useEffect, useRef } from "react";
import { createClient } from "@supabase/supabase-js";
import AboutUs from './AboutUs';
import WhyKaziApa from './WhyKaziApa';
import './AboutPages.css';

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
  { id:"shamba", en:"Shamba",  sw:"Shamba",  sub:"Farm & Land",        icon:"🌽",color:"#1E9B5A" },
  { id:"vitu",   en:"Goods",   sw:"Vitu",    sub:"General Items",      icon:"📦",color:"#6C3483" },
  { id:"kazi",   en:"Jobs",    sw:"Kazi",    sub:"Jobs & Gigs",        icon:"💼",color:"#B7410E" },
  { id:"nyumba", en:"Housing", sw:"Nyumba",  sub:"Rentals & Agents",   icon:"🏠",color:"#0E6655" },
  { id:"fundi",  en:"Services",sw:"Fundi",   sub:"Fundis & Pros",      icon:"🔧",color:"#1A5276" },
  { id:"usafiri",en:"Transport",sw:"Usafiri",sub:"Boda, Taxi & More",  icon:"🏍️",color:"#7D3C98" },
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
          <div onClick={()=>!uploading&&fileRef.current?.click()}
            style={{ width:80,height:80,borderRadius:10,border:`2px dashed ${uploading?T.primary:T.border}`,display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",cursor:uploading?"default":"pointer",background:uploading?T.primarySoft:T.surface,transition:"all 0.2s" }}>
            {uploading
              ? <div style={{ textAlign:"center" }}>
                  <div style={{ fontSize:13,fontWeight:800,color:T.primary }}>{progress}%</div>
                  <div style={{ fontSize:9,color:T.textMuted,marginTop:2 }}>Uploading...</div>
                </div>
              : <>
                  <div style={{ fontSize:24 }}>📷</div>
                  <div style={{ fontSize:9,color:T.textMuted,marginTop:2 }}>Add Photo</div>
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
      <div style={{ fontSize:11,color:T.textMuted,marginTop:6 }}>
        📸 Photos are auto-compressed for fast upload. Up to {maxPhotos} photos.
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
          {listing.featured  && <Pill color={T.accentDark} bg={T.accentSoft}>🚀 Featured</Pill>}
          {listing.verified && <Pill color={T.success} bg={T.successSoft}>✓ Verified</Pill>}
          {listing.sold && <Pill color={T.coral} bg={T.coralSoft}>SOLD</Pill>}
        </div>
        <div style={{ fontWeight:700,color:T.text,fontSize:14,whiteSpace:"nowrap",overflow:"hidden",textOverflow:"ellipsis" }}>{listing.title}</div>
        <div style={{ fontSize:11,color:T.textMuted,marginTop:2 }}>📍 {listing.town} · {listing.seller_name}</div>
        <div style={{ display:"flex",justifyContent:"space-between",alignItems:"center",marginTop:4 }}>
          <Stars rating={listing.rating} />
          <div style={{ fontSize:15,fontWeight:800,color:T.primary }}>Ksh {listing.price_label||listing.price?.toLocaleString()}</div>
        </div>
      </div>
    </div>
  );
}

// ─── SMART CHAT (REAL, SUPABASE-BACKED) ──────────────────────────────────────
function SmartChat({ listing, currentPhone, currentName, buyerPhone, buyerName, sellerPhone, sellerName, onBack, onCheckout }) {
  const [msgs, setMsgs]     = useState([]);
  const [input, setInput]   = useState("");
  const [showPay, setShowPay] = useState(false);
  const [showDel, setShowDel] = useState(false);
  const [dStep, setDStep]   = useState(1);
  const [zone, setZone]     = useState(null);
  const [rider, setRider]   = useState(null);
  const isBuyer = currentPhone === buyerPhone;
  const otherName = isBuyer ? sellerName : buyerName;
  const nearRiders = RIDERS.filter(r=>r.town===listing?.town && r.available);

  useEffect(()=>{
    loadMsgs();
    const interval = setInterval(loadMsgs, 3000);
    return ()=>clearInterval(interval);
  },[]);

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

  async function send() {
    if (!input.trim()) return;
    if (PHONE_RGX.test(input)||CONTACT_RGX.test(input)) {
      await sb.from("chats").insert({ listing_id:String(listing?.id||""), listing_title:listing?.title, buyer_phone:buyerPhone, buyer_name:buyerName, seller_phone:sellerPhone, seller_name:sellerName, sender_phone:"system", sender_name:"KaziApa", message:"⚠️ Phone numbers can't be shared here for safety.", read:false });
      setInput(""); setShowPay(true); loadMsgs(); return;
    }
    await sb.from("chats").insert({ listing_id:String(listing?.id||""), listing_title:listing?.title, buyer_phone:buyerPhone, buyer_name:buyerName, seller_phone:sellerPhone, seller_name:sellerName, sender_phone:currentPhone, sender_name:currentName, message:input, read:false });

    // Send WhatsApp notification to the OTHER person
    const recipientPhone = isBuyer ? sellerPhone : buyerPhone;
    const recipientName = isBuyer ? sellerName : buyerName;
    const waNumber = recipientPhone.startsWith("+") ? recipientPhone.replace("+","") : "254"+recipientPhone.replace(/^0/,"");
    const waMsg = encodeURIComponent(`💬 KaziApa: New message from ${currentName} about "${listing?.title}". Open KaziApa to reply: https://kaziapa.co.ke`);
    // Use CallMeBot free WhatsApp API
    fetch(`https://api.callmebot.com/whatsapp.php?phone=${waNumber}&text=${waMsg}&apikey=free`).catch(()=>{});

    setInput("");
    loadMsgs();
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
        <div style={{ width:40,height:40,borderRadius:"50%",background:T.accent,display:"flex",alignItems:"center",justifyContent:"center",fontWeight:800,color:T.primary,fontSize:18 }}>{otherName?.[0]}</div>
        <div style={{ flex:1 }}>
          <div style={{ color:"#fff",fontWeight:700,fontSize:14 }}>{otherName}</div>
          <div style={{ fontSize:11,color:T.accent }}>{listing?.title}</div>
        </div>
      </div>
      <div style={{ flex:1,overflowY:"auto",padding:16,display:"flex",flexDirection:"column",gap:8 }}>
        <div style={{ textAlign:"center",fontSize:11,color:T.textMuted,background:T.surface,borderRadius:8,padding:"6px 12px",alignSelf:"center",border:`1px solid ${T.border}` }}>
          🔒 Phone numbers stay private until you choose to share them.
        </div>
        {msgs.length===0 && <div style={{ textAlign:"center",color:T.textMuted,fontSize:13,marginTop:30 }}>Say hello to start the conversation 👋</div>}
        {msgs.map((msg,i)=>(
          <div key={i} style={{ display:"flex",justifyContent:msg.sender_phone==="system"?"center":msg.sender_phone===currentPhone?"flex-end":"flex-start" }}>
            {msg.sender_phone==="system"
              ? <div style={{ background:T.coralSoft,color:T.coral,borderRadius:10,padding:"8px 14px",maxWidth:"88%",fontSize:12,lineHeight:1.5,border:`1px solid ${T.coral}`,textAlign:"center" }}>{msg.message}</div>
              : <div style={{ background:msg.sender_phone===currentPhone?T.primary:T.card,color:msg.sender_phone===currentPhone?"#fff":T.text,borderRadius:msg.sender_phone===currentPhone?"16px 16px 4px 16px":"16px 16px 16px 4px",padding:"10px 14px",maxWidth:"76%",fontSize:14,lineHeight:1.4,border:msg.sender_phone===currentPhone?"none":`1px solid ${T.border}` }}>
                  {msg.message?.includes("maps.google.com") ? (
                    <div>
                      <div>📍 {msg.sender_name} shared their location</div>
                      <a href={msg.message.match(/https:\/\/maps\.google[^\s]*/)?.[0]} target="_blank"
                        style={{ color:msg.sender_phone===currentPhone?"#FFD700":"#0066CC",fontWeight:700,fontSize:12,textDecoration:"underline" }}>
                        Open in Google Maps →
                      </a>
                    </div>
                  ) : msg.message}
                </div>
            }
          </div>
        ))}
        {isBuyer && showPay && (
          <div style={{ background:T.successSoft,borderRadius:14,padding:14,border:`1.5px solid ${T.success}` }}>
            <div style={{ fontWeight:700,color:T.text,fontSize:14,marginBottom:4 }}>Ready to buy?</div>
            <div style={{ display:"flex",gap:8,flexWrap:"wrap" }}>
              <button onClick={()=>setShowDel(true)} style={{ flex:1,padding:"10px 6px",background:T.primary,color:"#fff",border:"none",borderRadius:10,fontSize:12,fontWeight:800,cursor:"pointer",minWidth:100 }}>🏍️ Arrange Delivery</button>
              <button onClick={onCheckout} style={{ flex:1,padding:"10px 6px",background:T.success,color:"#fff",border:"none",borderRadius:10,fontSize:12,fontWeight:800,cursor:"pointer",minWidth:100 }}>💳 Pay Directly</button>
            </div>
          </div>
        )}
      </div>
      <div style={{ padding:"10px 16px 20px",background:T.card,borderTop:`1px solid ${T.border}` }}>
        {isBuyer && msgs.length>=2 && !showPay && (
          <div style={{ display:"flex",gap:6,marginBottom:8,overflowX:"auto" }}>
            {[
              { label:"💳 Pay Now",action:()=>setShowPay(true) },
              { label:"🏍️ Delivery",action:()=>setShowDel(true) },
              { label:"💬 Final price?",action:()=>setInput("What is your final price?") },
              { label:"📍 Share Location",action:()=>{
                if(!navigator.geolocation){ alert("Location not available on this device"); return; }
                navigator.geolocation.getCurrentPosition(async(pos)=>{
                  const { latitude:lat, longitude:lng } = pos.coords;
                  const mapsUrl = `https://maps.google.com/?q=${lat},${lng}`;
                  await sb.from("chats").insert({ listing_id:String(listing?.id||""), listing_title:listing?.title, buyer_phone:buyerPhone, buyer_name:buyerName, seller_phone:sellerPhone, seller_name:sellerName, sender_phone:currentPhone, sender_name:currentName, message:`📍 ${currentName} shared their location: ${mapsUrl}`, read:false });
                  loadMsgs();
                }, ()=>alert("Please allow location access and try again."));
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
                if(!navigator.geolocation){ alert("Location not available on this device"); return; }
                navigator.geolocation.getCurrentPosition(async(pos)=>{
                  const { latitude:lat, longitude:lng } = pos.coords;
                  const mapsUrl = `https://maps.google.com/?q=${lat},${lng}`;
                  await sb.from("chats").insert({ listing_id:String(listing?.id||""), listing_title:listing?.title, buyer_phone:buyerPhone, buyer_name:buyerName, seller_phone:sellerPhone, seller_name:sellerName, sender_phone:currentPhone, sender_name:currentName, message:`📍 ${currentName} shared their location: ${mapsUrl}`, read:false });
                  loadMsgs();
                }, ()=>alert("Please allow location access and try again."));
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
          <input value={input} onChange={e=>setInput(e.target.value)} placeholder="Type a message..."
            style={{ flex:1,padding:"11px 15px",borderRadius:24,border:`1px solid ${T.border}`,fontSize:14,outline:"none",background:T.card,color:T.text }}
            onKeyDown={e=>{ if(e.key==="Enter") send(); }} />
          <button onClick={send} style={{ width:44,height:44,borderRadius:"50%",background:T.primary,border:"none",color:"#fff",fontSize:20,cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0 }}>↑</button>
        </div>
      </div>
    </div>
  );
}

// ─── MY CHATS LIST ────────────────────────────────────────────────────────────
function ChatsList({ phone, onOpenChat, onBack }) {
  const [threads, setThreads] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(()=>{ load(); },[]);

  async function load() {
    setLoading(true);
    const { data } = await sb.from("chats").select("*").or(`buyer_phone.eq.${phone},seller_phone.eq.${phone}`).order("created_at",{ ascending:false });
    const seen = new Set(); const list = [];
    (data||[]).forEach(m=>{
      const key = m.listing_id+"_"+m.buyer_phone;
      if(!seen.has(key)) { seen.add(key); list.push(m); }
    });
    setThreads(list);
    setLoading(false);
  }

  return (
    <div>
      <BackHeader title="My Chats" onBack={onBack} />
      <div style={{ padding:16 }}>
        {loading ? <div style={{ textAlign:"center",padding:30,color:T.textMuted }}>Loading...</div>
        : threads.length===0 ? <div style={{ textAlign:"center",padding:"40px 0",color:T.textMuted }}><div style={{ fontSize:44 }}>💬</div><div style={{ marginTop:12,fontWeight:700,color:T.text }}>No chats yet.</div></div>
        : threads.map((t,i)=>{
            const isBuyer = t.buyer_phone===phone;
            const otherName = isBuyer ? t.seller_name : t.buyer_name;
            return (
              <div key={i} onClick={()=>onOpenChat(t)} style={{ background:T.card,borderRadius:14,padding:14,marginBottom:10,border:`1px solid ${T.border}`,cursor:"pointer",display:"flex",alignItems:"center",gap:12 }}>
                <div style={{ width:42,height:42,borderRadius:"50%",background:T.primary,display:"flex",alignItems:"center",justifyContent:"center",color:"#fff",fontWeight:800 }}>{otherName?.[0]}</div>
                <div style={{ flex:1,minWidth:0 }}>
                  <div style={{ fontWeight:700,color:T.text,fontSize:14 }}>{otherName}</div>
                  <div style={{ fontSize:11,color:T.textMuted }}>{t.listing_title}</div>
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
  const [agreedPrivacy,setAgreedPrivacy] = useState(false);
  const [showPrivacy,setShowPrivacy]     = useState(false);
  const [showTerms,setShowTerms]         = useState(false);
  const [unreadCount,setUnreadCount]     = useState(0);
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
  const [activeThread,setActiveThread] = useState(null);
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

  // Handle Android back button
  useEffect(()=>{
    if(authStep!=="app") return;
    // Push a state so back button is interceptable
    window.history.pushState({ kaziapa:true }, "");
    function handlePop(e) {
      if(screen !== "home") {
        // Navigate back within app instead of leaving
        nav("home","home");
        window.history.pushState({ kaziapa:true }, "");
      } else {
        // On home screen — ask if they want to exit
        const confirmed = window.confirm("Exit KaziApa?");
        if(confirmed) {
          window.history.back();
        } else {
          window.history.pushState({ kaziapa:true }, "");
        }
      }
    }
    window.addEventListener("popstate", handlePop);
    return ()=>window.removeEventListener("popstate", handlePop);
  },[screen, authStep]);

  // Load listings from Supabase
  useEffect(()=>{
    if(authStep!=="app") return;
    loadListings();
    loadRequests();
  },[authStep,town,catFilter]);

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
    setLoading(true);
    let q = sb.from("listings").select("*").order("featured",{ ascending:false }).order("created_at",{ ascending:false });
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
    // Parse price — handle ranges like "12000-20000" by taking the first number
    const parsedPrice = parseInt(postPrice.toString().replace(/[^0-9]/,"")) || 0;
    const { error } = await sb.from("listings").insert({
      title:postTitle, price:parsedPrice, price_label:postPrice,
      description:postDesc, category:postCat, town:postTown,
      seller_name:userName, seller_phone:phone, photos:postPhotos, boosted:postBoost,
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
    // Save to localStorage so user stays logged in
    localStorage.setItem("kaziapa_user", JSON.stringify({ phone, name:userName, town:userTown }));
    setAuthStep("app"); setActiveNav("home"); showToast(`Welcome ${userName}! 🤝`);
  }

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
        <button onClick={async()=>{
          if(phone.length>=10&&agreedPrivacy) {
            setOtpLoading(true); setOtpError("");
            try {
              const res = await fetch("/api/send-otp", { method:"POST", headers:{ "Content-Type":"application/json" }, body:JSON.stringify({ phone }) });
              const data = await res.json();
              if(data.success) {
                setAuthStep("otp"); setOtp(["","","","","",""]);
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
          <input key={i} id={`otp${i}`} value={v} maxLength={1} type="tel"
            onChange={e=>{ const n=[...otp]; n[i]=e.target.value; setOtp(n); if(e.target.value&&i<5) document.getElementById(`otp${i+1}`)?.focus(); }}
            style={{ width:46,height:56,textAlign:"center",fontSize:22,fontWeight:800,borderRadius:12,border:`2px solid ${v?T.accent:"rgba(255,255,255,0.2)"}`,background:"rgba(255,255,255,0.08)",color:"#fff",outline:"none" }} />
        ))}
      </div>
      {otpError && <div style={{ background:otpError.includes("code is")?"rgba(30,155,90,0.15)":"rgba(232,64,64,0.15)", border:`1px solid ${otpError.includes("code is")?"#1E9B5A":"#E84040"}`, borderRadius:10, padding:"12px 14px", textAlign:"center", marginTop:16, fontSize:14, fontWeight:otpError.includes("code is")?700:400, color:otpError.includes("code is")?"#fff":"#FFD0D0" }}>{otpError}</div>}
      <button onClick={async()=>{
        const code = otp.join("");
        if(code.length < 6) { setOtpError("Enter all 6 digits"); return; }
        setOtpLoading(true); setOtpError("");
        try {
          const res = await fetch("/api/verify-otp", { method:"POST", headers:{ "Content-Type":"application/json" }, body:JSON.stringify({ phone, otp:code }) });
          const data = await res.json();
          if(data.success) { setAuthStep("profile"); }
          else { setOtpError(data.error || "Wrong code. Try again."); setOtp(["","","","","",""]); }
        } catch(e) { setOtpError("Network error. Try again."); }
        setOtpLoading(false);
      }} style={{ width:"100%",padding:16,background:T.accent,color:T.primary,border:"none",borderRadius:14,fontSize:16,fontWeight:800,cursor:"pointer",marginTop:32,opacity:otpLoading?0.7:1 }}>
        {otpLoading ? "Verifying..." : "Verify →"}
      </button>
      <div onClick={async()=>{
        setOtpError("");
        try {
          const res = await fetch("/api/send-otp", { method:"POST", headers:{ "Content-Type":"application/json" }, body:JSON.stringify({ phone }) });
          const data = await res.json();
          if(data.success) showToast("New code sent!");
          else setOtpError("Failed to resend. Try again.");
        } catch(e) { setOtpError("Network error."); }
      }} style={{ textAlign:"center",marginTop:20,color:T.accent,fontSize:13,fontWeight:600,cursor:"pointer" }}>Resend code</div>
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

      {/* WhatsApp notification opt-in */}
      <div style={{ background:"rgba(255,255,255,0.08)",borderRadius:14,padding:16,marginBottom:24,border:"1px solid rgba(255,255,255,0.15)" }}>
        <div style={{ display:"flex",alignItems:"center",gap:10,marginBottom:10 }}>
          <span style={{ fontSize:24 }}>💚</span>
          <div>
            <div style={{ color:"#fff",fontWeight:700,fontSize:14 }}>Get WhatsApp notifications</div>
            <div style={{ color:"rgba(255,255,255,0.6)",fontSize:11,marginTop:2 }}>Know instantly when someone messages you</div>
          </div>
        </div>
        <div style={{ fontSize:12,color:"rgba(255,255,255,0.7)",lineHeight:1.6,marginBottom:12 }}>
          One-time setup — send a WhatsApp message to activate free notifications on your number.
        </div>
        <a href={`https://wa.me/34644597107?text=I%20allow%20callmebot%20to%20send%20me%20messages`}
          target="_blank"
          style={{ display:"block",width:"100%",padding:"11px 0",background:"#25D366",color:"#fff",borderRadius:11,fontSize:13,fontWeight:800,cursor:"pointer",textAlign:"center",textDecoration:"none" }}>
          📱 Activate WhatsApp Notifications →
        </a>
        <div style={{ fontSize:10,color:"rgba(255,255,255,0.4)",marginTop:8,textAlign:"center" }}>Optional — you can skip this and activate later from Profile</div>
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
      {showTerms && <TermsModal setShowTerms={setShowTerms} />}

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
                {/* Chat notification button */}
                <div onClick={()=>nav("chats","profile")} style={{ position:"relative",background:"rgba(255,255,255,0.12)",borderRadius:20,padding:"5px 12px",cursor:"pointer",display:"flex",alignItems:"center",gap:5 }}>
                  <span style={{ fontSize:16 }}>💬</span>
                  {unreadCount > 0 && (
                    <div style={{ position:"absolute",top:-4,right:-4,background:T.coral,color:"#fff",borderRadius:"50%",width:18,height:18,fontSize:10,fontWeight:800,display:"flex",alignItems:"center",justifyContent:"center" }}>
                      {unreadCount > 9 ? "9+" : unreadCount}
                    </div>
                  )}
                </div>
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
                <div key={cat.id} onClick={()=>{
                  if(cat.id==="kazi") { nav("jobs","browse"); }
                  else if(cat.id==="nyumba") { nav("housing","browse"); }
                  else if(cat.id==="fundi") { nav("fundi","browse"); }
                  else if(cat.id==="shamba") { nav("shamba","browse"); }
                  else if(cat.id==="usafiri") { nav("usafiri","browse"); }
                  else { setCatFilter(cat.id); nav("browse","browse"); setBrowseTab("listings"); }
                }}
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
                    <div style={{ fontSize:13,marginTop:6 }}>No opportunities posted here yet. Be the first to help your community.</div>
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
                Buy Now — Ksh {(activeListing.price||0).toLocaleString()}
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
                {!activeListing.featured && (
                  <button onClick={async()=>{
                    await sb.from("listings").update({ featured:true }).eq("id",activeListing.id);
                    setActiveListing({ ...activeListing, featured:true });
                    showToast("Listing boosted! 🚀 Appears at top of results.");
                  }} style={{ flex:1,padding:12,background:T.accent,color:T.primary,border:"none",borderRadius:12,fontSize:13,fontWeight:700,cursor:"pointer",minWidth:100 }}>
                    🚀 Boost Listing
                  </button>
                )}
                {activeListing.featured && (
                  <div style={{ flex:1,padding:12,background:T.accentSoft,color:T.accentDark,borderRadius:12,fontSize:13,fontWeight:700,textAlign:"center",minWidth:100 }}>
                    🚀 Boosted
                  </div>
                )}
                <button onClick={async()=>{
                  if(window.confirm("Delete this listing?")) {
                    await sb.from("listings").delete().eq("id",activeListing.id);
                    showToast("Listing deleted.");
                    nav("browse","browse");
                  }
                }} style={{ flex:1,padding:12,background:T.coral,color:"#fff",border:"none",borderRadius:12,fontSize:13,fontWeight:700,cursor:"pointer",minWidth:100 }}>
                  🗑️ Delete
                </button>
              </div>
            )}
            {/* Report button for non-sellers */}
            {activeListing.seller_phone !== phone && (
              <button onClick={async()=>{
                await sb.from("listings").update({ reports:(activeListing.reports||0)+1 }).eq("id",activeListing.id);
                showToast("Reported. We'll review this listing. Thank you.");
              }} style={{ width:"100%",padding:11,background:"transparent",color:T.textMuted,border:`1px solid ${T.border}`,borderRadius:12,fontSize:12,fontWeight:600,cursor:"pointer",marginTop:6 }}>
                🚩 Report this Listing
              </button>
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
        <KioskScreen phone={phone} userName={userName} town={userTown} showToast={showToast} onBack={()=>nav("profile","profile")} />
      )}

      {/* CHAT */}
      {screen==="chats" && !activeThread && (
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
          onCheckout={()=>{ setCheckStep(1); nav("checkout","browse"); }} />
      )}
      {screen==="chat" && activeListing && (
        <SmartChat listing={activeListing}
          currentPhone={phone} currentName={userName}
          buyerPhone={phone} buyerName={userName}
          sellerPhone={activeListing?.seller_phone} sellerName={activeListing?.seller_name}
          onBack={()=>nav("listing","browse")}
          onCheckout={()=>{ setCheckStep(1); nav("checkout","browse"); }} />
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
                  {[["Item",`Ksh ${activeListing.price?.toLocaleString()}`],["Seller",activeListing.seller_name]].map(([k,v])=>(
                    <div key={k} style={{ display:"flex",justifyContent:"space-between",marginBottom:10,fontSize:14 }}><span style={{ color:T.textMid }}>{k}</span><span style={{ fontWeight:600 }}>{v}</span></div>
                  ))}
                  <div style={{ borderTop:`1px solid ${T.border}`,paddingTop:10,display:"flex",justifyContent:"space-between",fontSize:16,fontWeight:900 }}>
                    <span>Total</span><span style={{ color:T.primary }}>Ksh {(activeListing.price||0).toLocaleString()}</span>
                  </div>
                </div>
                <div style={{ background:T.accentSoft,borderRadius:12,padding:13,marginBottom:16,fontSize:12,color:T.accentDark,lineHeight:1.5 }}>⚠️ KaziApa does not yet hold payments automatically. You pay the seller directly — only deal with verified sellers and report any issue to us immediately.</div>
                <Btn onClick={()=>setCheckStep(2)}>Continue →</Btn>
              </div>
            )}
            {checkStep===2 && (
              <div>
                <div style={{ background:T.card,borderRadius:14,padding:16,marginBottom:14,border:`1px solid ${T.border}` }}>
                  <div style={{ fontWeight:800,color:T.text,marginBottom:14 }}>Pay the Seller Directly</div>
                  <div style={{ background:T.surface,borderRadius:11,padding:14,marginBottom:14,fontSize:13,color:T.textMid,lineHeight:2 }}>
                    <div>1. M-Pesa → <strong>Send Money</strong></div>
                    <div>2. Enter seller's number: <strong style={{ color:T.primary }}>{activeListing.seller_phone}</strong></div>
                    <div>3. Amount: <strong style={{ color:T.primary }}>Ksh {(activeListing.price||0).toLocaleString()}</strong></div>
                    <div>4. Confirm with seller in chat once sent</div>
                  </div>
                  <div style={{ background:T.coralSoft,borderRadius:10,padding:12,marginBottom:12,fontSize:11,color:T.coral,lineHeight:1.5 }}>
                    🔒 Always meet in a safe public place or use delivery. Never send money before agreeing on terms in chat. Report any seller who behaves suspiciously.
                  </div>
                  <div style={{ marginBottom:12 }}>
                    <label style={{ fontSize:12,fontWeight:700,color:T.text,display:"block",marginBottom:6 }}>M-Pesa confirmation code (optional, for your records)</label>
                    <input id="mpesaCodeInput" placeholder="QHX1234ABC" style={{ width:"100%",padding:"11px 13px",borderRadius:11,border:`1px solid ${T.border}`,fontSize:14,boxSizing:"border-box",color:T.text }} />
                  </div>
                </div>
                <Btn onClick={async()=>{
                  const code = document.getElementById("mpesaCodeInput")?.value || "";
                  await sb.from("orders").insert({ listing_id:activeListing.id,buyer_phone:phone,buyer_name:userName,seller_phone:activeListing.seller_phone,amount:(activeListing.price||0),status:"buyer_paid_seller_directly",mpesa_code:code });
                  setCheckStep(3); showToast("Order recorded!");
                }} color={T.success}>I Have Paid the Seller ✓</Btn>
              </div>
            )}
            {checkStep===3 && (
              <div style={{ textAlign:"center",padding:"20px 0" }}>
                <div style={{ fontSize:68 }}>🎉</div>
                <div style={{ fontSize:22,fontWeight:900,color:T.text,marginTop:16 }}>Order Placed!</div>
                <div style={{ fontSize:14,color:T.textMid,marginTop:10,lineHeight:1.6,padding:"0 10px" }}>You agreed to pay the seller directly. Once you receive the item, please rate the seller.</div>
                <div style={{ background:T.card,borderRadius:14,padding:16,margin:"20px 0",border:`1px solid ${T.border}` }}>
                  <div style={{ fontSize:13,fontWeight:700,color:T.text,marginBottom:12 }}>Rate {activeListing?.seller_name}</div>
                  <div style={{ display:"flex",gap:8,justifyContent:"center",marginBottom:12 }}>
                    {[1,2,3,4,5].map(star=>(
                      <div key={star} onClick={async()=>{
                        const newRating = ((activeListing?.rating||0) + star) / 2;
                        await sb.from("listings").update({ rating:newRating }).eq("id",activeListing?.id);
                        showToast(`Rated ${star} stars! Thank you ⭐`);
                      }} style={{ fontSize:32,cursor:"pointer" }}>⭐</div>
                    ))}
                  </div>
                  <div style={{ fontSize:11,color:T.textMuted }}>Tap a star to rate after receiving your item</div>
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
            <Field label="Price (Ksh)" value={postPrice} onChange={setPostPrice} placeholder="e.g. 850 or 12000-20000" />
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
              { icon:"💚",label:"WhatsApp Notifications", action:()=>{ window.open(`https://wa.me/34644597107?text=I%20allow%20callmebot%20to%20send%20me%20messages`,"_blank"); } },
              { icon:"🏪",label:"My Kiosk",           action:()=>nav("kiosk","profile") },
              { icon:"💬",label:"My Chats",           action:()=>nav("chats","profile") },
              { icon:"📦",label:"My Listings",       action:()=>{ setCatFilter(null); nav("browse","browse"); } },
              { icon:"🛒",label:"My Orders",          action:()=>{} },
              { icon:"🏠",label:"Housing & Rentals",  action:()=>nav("housing","browse"), highlight:true },
              { icon:"⚡",label:"Upgrade Plan",       action:()=>setShowUpgrade(true), accent:true },
              { icon:"✓", label:"Get Verified Badge", action:()=>setShowUpgrade(true), accent:true },
              { icon:"🌍",label:"Language",           action:()=>setLang(lang==="en"?"sw":"en"), sub:lang==="en"?"Switch to Kiswahili":"Switch to English" },
              { icon:"🔒",label:"Privacy Policy",     action:()=>nav("privacy","profile") },
              { icon:"📋",label:"Terms & Conditions", action:()=>nav("terms","profile") },
              { icon:"ℹ️",label:"About KaziApa",      action:()=>nav("about","profile") },
              { icon:"💡",label:"Why KaziApa",         action:()=>nav("whykaziapa","profile") },
              { icon:"📧",label:"Contact Us",          action:()=>nav("contact","profile") },
              { icon:"🚪",label:"Log Out",            action:()=>{ localStorage.removeItem("kaziapa_user"); setAuthStep("phone"); setUserName(""); setPhone(""); setOtp(["","","","","",""]); } },
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
        <HousingScreen lang={lang} town={town} showToast={showToast} onBack={()=>nav("home","home")} userName={userName} phone={phone} />
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
              style={{ flex:1,padding:"10px 0 8px",textAlign:"center",cursor:"pointer",position:"relative" }}>
              <div style={{ fontSize:20 }}>{n.icon}</div>
              {n.key==="profile" && unreadCount > 0 && (
                <div style={{ position:"absolute",top:6,right:"50%",transform:"translateX(160%)",background:T.coral,color:"#fff",borderRadius:"50%",width:16,height:16,fontSize:9,fontWeight:800,display:"flex",alignItems:"center",justifyContent:"center" }}>
                  {unreadCount > 9 ? "9+" : unreadCount}
                </div>
              )}
              <div style={{ fontSize:9,color:activeNav===n.key?T.primary:T.textMuted,fontWeight:activeNav===n.key?800:400,marginTop:2 }}>{n.en}</div>
              {activeNav===n.key && <div style={{ width:16,height:3,background:T.primary,borderRadius:2,margin:"3px auto 0" }} />}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ─── JOBS SCREEN ─────────────────────────────────────────────────────────────
function JobsScreen({ userName, phone, town, showToast, onBack, lang }) {
  const [tab, setTab]           = useState("need"); // need | offer
  const [jobs, setJobs]         = useState([]);
  const [seekers, setSeekers]   = useState([]);
  const [loading, setLoading]   = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [activeItem, setActiveItem] = useState(null);

  // Job form
  const [title, setTitle]         = useState("");
  const [pay, setPay]             = useState("");
  const [jobTown, setJobTown]     = useState(town !== "All" ? town : "");
  const [desc, setDesc]           = useState("");
  const [jobType, setJobType]     = useState("Full Time");
  const [skills, setSkills]       = useState("");
  const [posting, setPosting]     = useState(false);

  const JOB_TYPES = ["Full Time", "Part Time", "Contract", "Daily Pay", "Weekend Only"];
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
    });
    if (error) { showToast("Error posting. Try again.","error"); }
    else {
      showToast(tab === "need" ? "Job posted! Seekers can apply now. 🎉" : "Your profile posted! Employers can find you. 🎉");
      setTitle(""); setPay(""); setDesc(""); setJobTown(""); setSkills("");
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
              <div style={{ fontSize:11, color:T.textMuted }}>{tab === "need" ? "per month" : "expected"}</div>
            </div>
          </div>
          {activeItem.description && <div style={{ marginTop:12, fontSize:13, color:T.textMid, lineHeight:1.6 }}>{activeItem.description}</div>}
        </div>
        <div style={{ background:T.card, borderRadius:14, padding:14, marginBottom:14, border:`1px solid ${T.border}`, display:"flex", alignItems:"center", gap:12 }}>
          <div style={{ width:46, height:46, borderRadius:"50%", background:T.primary, display:"flex", alignItems:"center", justifyContent:"center", color:"#fff", fontWeight:800, fontSize:20 }}>{activeItem.seller_name?.[0]}</div>
          <div style={{ flex:1 }}>
            <div style={{ fontWeight:700, color:T.text }}>{activeItem.seller_name}</div>
            <div style={{ fontSize:11, color:T.textMuted }}>{tab === "need" ? "Employer" : "Job Seeker"}</div>
          </div>
        </div>
        <div style={{ background:T.successSoft, borderRadius:13, padding:13, marginBottom:16, fontSize:12, color:"#145A36", lineHeight:1.5 }}>
          💬 Chat safely inside KaziApa — phone numbers stay private until you both agree to share.
        </div>
        <button style={{ width:"100%", padding:16, background:T.primary, color:"#fff", border:"none", borderRadius:14, fontSize:16, fontWeight:800, cursor:"pointer" }}
          onClick={() => showToast("Chat feature coming soon!")}>
          💬 {tab === "need" ? "Apply for this Job" : "Contact this Person"}
        </button>
      </div>
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
            🏢 I Need<div style={{ fontSize:10, fontWeight:400, marginTop:2, opacity:0.8 }}>Post a job vacancy</div>
          </div>
          <div onClick={() => setTab("offer")}
            style={{ flex:1, background:tab==="offer"?"#fff":"rgba(255,255,255,0.15)", color:tab==="offer"?"#B7410E":"#fff", borderRadius:12, padding:"12px 0", textAlign:"center", cursor:"pointer", fontWeight:800, fontSize:14 }}>
            👤 I Offer<div style={{ fontSize:10, fontWeight:400, marginTop:2, opacity:0.8 }}>Post your skills/CV</div>
          </div>
        </div>
      </div>

      {/* Post form modal */}
      {showForm && (
        <div style={{ position:"fixed", inset:0, background:T.overlay, zIndex:150, display:"flex", alignItems:"flex-end", justifyContent:"center" }} onClick={() => setShowForm(false)}>
          <div style={{ background:T.card, borderRadius:"22px 22px 0 0", padding:"24px 20px 36px", width:"100%", maxWidth:430, maxHeight:"85vh", overflowY:"auto" }} onClick={e => e.stopPropagation()}>
            <div style={{ fontWeight:800, color:T.text, fontSize:17, marginBottom:4 }}>
              {tab === "need" ? "🏢 Post a Job Vacancy" : "👤 Post Your Skills / CV"}
            </div>
            <div style={{ fontSize:12, color:T.textMuted, marginBottom:16 }}>
              {tab === "need" ? "Employers looking for workers" : "Job seekers showing what they can do"}
            </div>
            <Field label={tab === "need" ? "Job Title" : "Your Name / Role"} value={title} onChange={setTitle}
              placeholder={tab === "need" ? "e.g. Shop Attendant Needed" : "e.g. John — Experienced Driver"} />
            <Field label={tab === "need" ? "Monthly Pay (Ksh)" : "Expected Pay (Ksh/month)"} value={pay} onChange={setPay} placeholder="15000" type="number" />
            <div style={{ marginBottom:14 }}>
              <label style={{ fontSize:12, fontWeight:700, color:T.text, display:"block", marginBottom:7 }}>Job Type</label>
              <div style={{ display:"flex", gap:6, flexWrap:"wrap" }}>
                {JOB_TYPES.map(t => (
                  <div key={t} onClick={() => setJobType(t)}
                    style={{ background:jobType===t?"#B7410E":T.surface, color:jobType===t?"#fff":T.textMid, borderRadius:20, padding:"5px 12px", fontSize:12, fontWeight:600, cursor:"pointer", border:`1px solid ${jobType===t?"#B7410E":T.border}` }}>
                    {t}
                  </div>
                ))}
              </div>
            </div>
            <Field label="Your Town / Area" value={jobTown} onChange={setJobTown} placeholder="e.g. Nakuru CBD, Kondele..." />
            <Field label={tab === "need" ? "Job Description & Requirements" : "Your Skills & Experience"}
              value={tab === "need" ? desc : skills} onChange={tab === "need" ? setDesc : setSkills}
              placeholder={tab === "need" ? "Describe the job, working hours, requirements..." : "Describe your skills, experience, what you can do..."} rows={4} />
            <button onClick={postJob} disabled={posting}
              style={{ width:"100%", padding:15, background:posting?"#ccc":"#B7410E", color:"#fff", border:"none", borderRadius:13, fontSize:15, fontWeight:800, cursor:posting?"default":"pointer" }}>
              {posting ? "Posting..." : tab === "need" ? "Post Job Vacancy →" : "Post My Skills →"}
            </button>
          </div>
        </div>
      )}

      {/* Content */}
      <div style={{ padding:16 }}>
        <div style={{ background:tab==="need"?"#FFF0E8":T.successSoft, borderRadius:12, padding:"10px 14px", marginBottom:14, fontSize:12, color:tab==="need"?"#B7410E":"#145A36" }}>
          {tab === "need"
            ? "🏢 These are job vacancies posted by employers. Tap any to apply."
            : "👤 These are people offering their skills and looking for work. Tap any to contact."}
        </div>
        {loading
          ? <div style={{ textAlign:"center", padding:30, color:T.textMuted }}>Loading...</div>
          : items.length === 0
            ? <div style={{ textAlign:"center", padding:"40px 0", color:T.textMuted }}>
                <div style={{ fontSize:44 }}>💼</div>
                <div style={{ fontWeight:700, color:T.text, fontSize:15, marginTop:12 }}>
                  {tab === "need" ? "No job vacancies yet." : "No job seekers yet."}
                </div>
                <div style={{ fontSize:13, marginTop:6 }}>No opportunities posted here yet. Be the first to share one.</div>
                <button onClick={() => setShowForm(true)}
                  style={{ marginTop:16, background:"#B7410E", color:"#fff", border:"none", borderRadius:11, padding:"11px 24px", fontSize:14, fontWeight:700, cursor:"pointer" }}>
                  + {tab === "need" ? "Post a Job" : "Post Your Skills"}
                </button>
              </div>
            : items.map(item => (
              <div key={item.id} onClick={() => setActiveItem(item)}
                style={{ background:T.card, borderRadius:14, marginBottom:10, cursor:"pointer", border:`1px solid ${T.border}`, overflow:"hidden", display:"flex" }}>
                <div style={{ width:5, flexShrink:0, background:"#B7410E" }} />
                <div style={{ padding:"12px 14px", flex:1 }}>
                  <div style={{ display:"flex", justifyContent:"space-between", gap:8 }}>
                    <div style={{ flex:1 }}>
                      <div style={{ fontWeight:700, color:T.text, fontSize:14 }}>{item.title}</div>
                      <div style={{ fontSize:11, color:T.textMuted, marginTop:2 }}>📍 {item.town} · {item.seller_name}</div>
                      <div style={{ display:"flex", gap:6, marginTop:6, flexWrap:"wrap" }}>
                        {item.job_type && <Pill color="#B7410E" bg="#FFF0E8">{item.job_type}</Pill>}
                        {tab === "need" ? <Pill color={T.success} bg={T.successSoft}>Hiring</Pill> : <Pill color={T.primary} bg={T.primarySoft}>Available</Pill>}
                      </div>
                    </div>
                    <div style={{ textAlign:"right", flexShrink:0 }}>
                      <div style={{ fontSize:15, fontWeight:800, color:"#B7410E" }}>Ksh {item.price?.toLocaleString()}</div>
                      <div style={{ fontSize:10, color:T.textMuted }}>per month</div>
                    </div>
                  </div>
                  {item.description && <div style={{ fontSize:12, color:T.textMid, marginTop:8, lineHeight:1.5, overflow:"hidden", display:"-webkit-box", WebkitLineClamp:2, WebkitBoxOrient:"vertical" }}>{item.description}</div>}
                </div>
              </div>
            ))
        }
      </div>
    </div>
  );
}

// ─── HOUSING SCREEN ──────────────────────────────────────────────────────────
function HousingScreen({ lang, town, showToast, onBack, userName, phone }) {
  const [tab, setTab]           = useState("browse");
  const [properties, setProperties] = useState([]);
  const [loading, setLoading]   = useState(false);
  const [selected, setSelected] = useState(null);
  const [showPost, setShowPost] = useState(false);
  const [bookStep, setBookStep] = useState(1);
  const [viewingDone, setViewingDone] = useState(false);
  const [tenantRating, setTenantRating] = useState(null);
  const [showTip, setShowTip]   = useState(false);
  const [tipAmount, setTipAmount] = useState("");
  const [posting, setPosting]   = useState(false);
  const [photos, setPhotos]     = useState([]);

  // Post form
  const [pTitle, setPTitle]     = useState("");
  const [pRent, setPRent]       = useState("");
  const [pType, setPType]       = useState("Bedsitter");
  const [pTown, setPTown]       = useState(town !== "All" ? town : "");
  const [pArea, setPArea]       = useState("");
  const [pDesc, setPDesc]       = useState("");
  const [pBeds, setPBeds]       = useState("0");
  const [pBaths, setPBaths]     = useState("1");

  const TYPES = ["Bedsitter","Single Room","1 Bedroom","2 Bedrooms","3 Bedrooms","House","Maisonette"];

  useEffect(() => { loadProperties(); }, [town]);

  async function loadProperties() {
    setLoading(true);
    let q = sb.from("properties").select("*").order("created_at", { ascending:false });
    if (town !== "All") q = q.eq("town", town);
    const { data } = await q.limit(30);
    setProperties(data || []);
    setLoading(false);
  }

  async function postProperty() {
    if (!pTitle || !pRent || !pTown) { showToast("Fill in title, rent and town","error"); return; }
    setPosting(true);
    const { error } = await sb.from("properties").insert({
      title:pTitle, rent:parseInt(pRent), type:pType, town:pTown,
      area:pArea, description:pDesc, bedrooms:parseInt(pBeds),
      bathrooms:parseInt(pBaths), agent_name:userName,
      agent_phone:phone, photos, available:true,
      verified:false, strikes:0, agent_rating:0, agent_viewings:0,
    });
    if (error) { showToast("Error posting. Try again.","error"); }
    else {
      showToast("Property listed! Goes live immediately. 🎉");
      setPTitle(""); setPRent(""); setPArea(""); setPDesc(""); setPhotos([]);
      setShowPost(false);
      await loadProperties();
      setTab("browse");
    }
    setPosting(false);
  }

  async function bookViewing(prop) {
    await sb.from("viewings").insert({
      property_id: prop.id, tenant_name:userName,
      tenant_phone:phone, agent_name:prop.agent_name,
      agent_phone:prop.agent_phone, amount:150, status:"booked",
    });
    // Update agent viewings count
    await sb.from("properties").update({ agent_viewings: (prop.agent_viewings||0)+1 }).eq("id", prop.id);
  }

  // Property detail view
  if (selected) {
    return (
      <div>
        <BackHeader title={selected.title} onBack={()=>{ setSelected(null); setBookStep(1); setViewingDone(false); setTenantRating(null); }} />
        <div style={{ padding:16 }}>
          {/* Photos */}
          {selected.photos?.length > 0
            ? <div style={{ display:"flex", gap:8, overflowX:"auto", marginBottom:16 }}>
                {selected.photos.map((url,i)=>(
                  <img key={i} src={url} alt="" style={{ width:i===0?280:160, height:180, objectFit:"cover", borderRadius:14, flexShrink:0 }} />
                ))}
              </div>
            : <div style={{ background:T.border, borderRadius:16, height:160, display:"flex", alignItems:"center", justifyContent:"center", fontSize:80, marginBottom:16 }}>🏠</div>
          }
          {/* Details */}
          <div style={{ background:T.card, borderRadius:16, padding:16, marginBottom:12, border:`1px solid ${T.border}` }}>
            <div style={{ display:"flex", justifyContent:"space-between", gap:8 }}>
              <div style={{ flex:1 }}>
                <div style={{ fontSize:18, fontWeight:800, color:T.text }}>{selected.title}</div>
                <div style={{ fontSize:12, color:T.textMuted, marginTop:3 }}>📍 {selected.area && selected.area+", "}{selected.town}</div>
                <div style={{ display:"flex", gap:6, marginTop:6, flexWrap:"wrap" }}>
                  <Pill color={T.primary} bg={T.primarySoft}>{selected.type}</Pill>
                  {selected.bedrooms > 0 && <Pill color={T.success} bg={T.successSoft}>🛏 {selected.bedrooms}BR</Pill>}
                  {selected.available ? <Pill color={T.success} bg={T.successSoft}>✓ Available</Pill> : <Pill color={T.coral} bg={T.coralSoft}>Taken</Pill>}
                </div>
              </div>
              <div style={{ textAlign:"right" }}>
                <div style={{ fontSize:22, fontWeight:900, color:T.primary }}>Ksh {selected.rent?.toLocaleString()}</div>
                <div style={{ fontSize:11, color:T.textMuted }}>per month</div>
              </div>
            </div>
            {selected.description && <div style={{ marginTop:12, fontSize:13, color:T.textMid, lineHeight:1.6 }}>{selected.description}</div>}
          </div>
          {/* Agent card */}
          <div style={{ background:T.card, borderRadius:14, padding:14, marginBottom:12, border:`1px solid ${T.border}`, display:"flex", alignItems:"center", gap:12 }}>
            <div style={{ width:46, height:46, borderRadius:"50%", background:T.primary, display:"flex", alignItems:"center", justifyContent:"center", color:"#fff", fontWeight:800, fontSize:20 }}>{selected.agent_name?.[0]}</div>
            <div style={{ flex:1 }}>
              <div style={{ fontWeight:700, color:T.text }}>{selected.agent_name}</div>
              <div style={{ fontSize:11, color:T.textMuted }}>Agent · {selected.agent_viewings||0} viewings</div>
              {selected.verified && <Pill color={T.success} bg={T.successSoft}>✓ Verified Agent</Pill>}
            </div>
          </div>
          {/* Viewing booking flow */}
          {!viewingDone && bookStep === 1 && (
            <>
              <div style={{ background:T.primarySoft, borderRadius:12, padding:12, marginBottom:16, fontSize:12, color:T.primary, lineHeight:1.5 }}>
                💡 <strong>How viewing works:</strong> Pay Ksh 150 directly to the agent once they confirm a time. Rate the viewing afterward — fake listings get reported and the agent receives a strike.
              </div>
              <Btn onClick={()=>setBookStep(2)}>📅 Book Viewing — Ksh 150</Btn>
              <button onClick={async()=>{
                const commission = Math.round((selected.rent||0) * 0.1);
                showToast(`Commission notice: Ksh ${commission.toLocaleString()} due to ${selected.agent_name}`);
              }} style={{ width:"100%", padding:13, background:T.card, color:T.primary, border:`1px solid ${T.primary}`, borderRadius:14, fontSize:14, fontWeight:700, cursor:"pointer", marginTop:10 }}>
                🏠 I Have Taken This House
              </button>
            </>
          )}
          {bookStep === 2 && !viewingDone && (
            <div>
              <div style={{ background:T.card, borderRadius:14, padding:16, marginBottom:14, border:`1px solid ${T.border}` }}>
                <div style={{ fontWeight:800, color:T.text, marginBottom:12 }}>Pay Ksh 150 Viewing Fee to Agent</div>
                <div style={{ background:T.surface, borderRadius:11, padding:14, fontSize:13, color:T.textMid, lineHeight:2 }}>
                  <div>1. M-Pesa → <strong>Send Money</strong></div>
                  <div>2. Agent's number: <strong style={{ color:T.primary }}>{selected.agent_phone}</strong></div>
                  <div>3. Amount: <strong style={{ color:T.primary }}>Ksh 150</strong></div>
                </div>
                <div style={{ background:T.accentSoft, borderRadius:10, padding:12, marginTop:12, fontSize:11, color:T.accentDark, lineHeight:1.5 }}>
                  ⚠️ KaziApa does not yet hold this fee automatically. Pay only once the agent confirms a viewing time with you. If the house turns out to be fake, report it to us immediately.
                </div>
              </div>
              <Btn color={T.success} onClick={async()=>{ await bookViewing(selected); setViewingDone(false); setBookStep(3); showToast("Viewing booked! Agent notified."); }}>I Have Paid the Agent ✓</Btn>
            </div>
          )}
          {bookStep === 3 && !viewingDone && (
            <div style={{ textAlign:"center", padding:"20px 0" }}>
              <div style={{ fontSize:56 }}>📅</div>
              <div style={{ fontSize:18, fontWeight:800, color:T.text, marginTop:12 }}>Viewing Booked!</div>
              <div style={{ fontSize:13, color:T.textMuted, marginTop:8, lineHeight:1.6 }}>{selected.agent_name} has been notified and will contact you to confirm viewing time.</div>
              <div style={{ background:T.successSoft, borderRadius:12, padding:12, margin:"16px 0", fontSize:12, color:"#145A36" }}>
                💡 Your Ksh 150 is held safely. Rate the house after viewing to release agent payment.
              </div>
              <Btn onClick={()=>setViewingDone(true)}>✓ I Have Done the Viewing</Btn>
            </div>
          )}
          {viewingDone && tenantRating === null && (
            <div style={{ padding:"10px 0" }}>
              <div style={{ fontSize:16, fontWeight:800, color:T.text, textAlign:"center", marginBottom:16 }}>Was the house as described?</div>
              <Btn color={T.success} onClick={async()=>{
                await sb.from("viewings").update({ status:"completed", rating:"genuine" }).eq("property_id", selected.id).eq("tenant_phone", phone);
                setTenantRating("genuine"); showToast("Thanks for confirming! Agent's rating updated.");
              }}>✅ Yes — House is Genuine</Btn>
              <button onClick={async()=>{
                await sb.from("properties").update({ strikes:(selected.strikes||0)+1 }).eq("id", selected.id);
                setTenantRating("fake"); showToast("Reported. Agent received a strike — contact us for help with a refund.","error");
              }} style={{ width:"100%", padding:14, background:T.coral, color:"#fff", border:"none", borderRadius:13, fontSize:15, fontWeight:800, cursor:"pointer", marginTop:10 }}>
                ❌ No — House Not as Described
              </button>
            </div>
          )}
          {tenantRating === "genuine" && (
            <div style={{ textAlign:"center", padding:"20px 0" }}>
              <div style={{ fontSize:56 }}>🎉</div>
              <div style={{ fontSize:18, fontWeight:800, color:T.text, marginTop:12 }}>Viewing Complete!</div>
              {!showTip ? (
                <button onClick={()=>setShowTip(true)} style={{ width:"100%", padding:13, background:T.accentSoft, color:T.accentDark, border:`1px solid ${T.accent}`, borderRadius:12, fontSize:14, fontWeight:700, cursor:"pointer", marginTop:16 }}>
                  💝 Tip the Agent (up to Ksh 500)
                </button>
              ) : (
                <div style={{ background:T.card, borderRadius:14, padding:16, marginTop:16, border:`1px solid ${T.accent}` }}>
                  <div style={{ fontSize:13, fontWeight:700, color:T.text, marginBottom:10 }}>Send tip directly to {selected.agent_name} via M-Pesa</div>
                  <div style={{ fontSize:12, color:T.textMuted, marginBottom:10 }}>Agent number: {selected.agent_phone}</div>
                  <div style={{ display:"flex", gap:8, marginBottom:10 }}>
                    {[100,200,300,500].map(amt=>(
                      <div key={amt} onClick={()=>setTipAmount(amt.toString())} style={{ flex:1, padding:"8px 0", textAlign:"center", background:tipAmount===amt.toString()?T.accent:T.surface, color:tipAmount===amt.toString()?T.primary:T.textMid, borderRadius:10, fontWeight:700, fontSize:13, cursor:"pointer", border:`1px solid ${tipAmount===amt.toString()?T.accent:T.border}` }}>
                        {amt}
                      </div>
                    ))}
                  </div>
                  <Btn color={T.accent} text={T.primary} onClick={()=>{ if(tipAmount){ showToast(`Send Ksh ${tipAmount} to ${selected.agent_name} via M-Pesa`); setShowTip(false); } }}>
                    I've Sent Ksh {tipAmount||"..."} Tip
                  </Btn>
                </div>
              )}
            </div>
          )}
          {tenantRating === "fake" && (
            <div style={{ textAlign:"center", padding:"20px 0" }}>
              <div style={{ fontSize:56 }}>⚠️</div>
              <div style={{ fontSize:18, fontWeight:800, color:T.text, marginTop:12 }}>Reported</div>
              <div style={{ fontSize:13, color:T.textMuted, marginTop:8, lineHeight:1.6 }}>The agent has received a strike and the listing is flagged. 3 strikes = suspension. Contact KaziApa support if you need help recovering your Ksh 150.</div>
              <Btn onClick={()=>setSelected(null)} style={{ marginTop:20 }}>Back to Properties</Btn>
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
          <div style={{ display:"flex", alignItems:"center", gap:10 }}>
            <div onClick={onBack} style={{ color:"#fff", fontSize:22, cursor:"pointer" }}>←</div>
            <div style={{ color:"#fff", fontWeight:800, fontSize:16 }}>🏠 Housing & Rentals</div>
          </div>
          <button onClick={()=>setShowPost(true)} style={{ background:T.accent, border:"none", borderRadius:20, padding:"6px 14px", fontSize:12, fontWeight:800, color:T.primary, cursor:"pointer" }}>+ Post</button>
        </div>
        <div style={{ display:"flex", gap:6, paddingBottom:14 }}>
          {[["browse","Browse"],["agents","Become Agent"]].map(([t,l])=>(
            <div key={t} onClick={()=>setTab(t)} style={{ background:tab===t?T.accent:"rgba(255,255,255,0.12)", color:tab===t?T.primary:"#fff", borderRadius:20, padding:"5px 16px", fontSize:12, fontWeight:700, cursor:"pointer" }}>{l}</div>
          ))}
        </div>
      </div>

      {/* Post property modal */}
      {showPost && (
        <div style={{ position:"fixed", inset:0, background:T.overlay, zIndex:150, display:"flex", alignItems:"flex-end", justifyContent:"center" }} onClick={()=>setShowPost(false)}>
          <div style={{ background:T.card, borderRadius:"22px 22px 0 0", padding:"24px 20px 36px", width:"100%", maxWidth:430, maxHeight:"85vh", overflowY:"auto" }} onClick={e=>e.stopPropagation()}>
            <div style={{ fontWeight:800, color:T.text, fontSize:17, marginBottom:16 }}>Post a Property</div>
            <PhotoUploader photos={photos} setPhotos={setPhotos} maxPhotos={6} />
            <Field label="Property Title" value={pTitle} onChange={setPTitle} placeholder="e.g. Modern 1BR in Milimani" />
            <Field label="Monthly Rent (Ksh)" value={pRent} onChange={setPRent} placeholder="12000" type="number" />
            <div style={{ marginBottom:14 }}>
              <label style={{ fontSize:12, fontWeight:700, color:T.text, display:"block", marginBottom:7 }}>Property Type</label>
              <select value={pType} onChange={e=>setPType(e.target.value)} style={{ width:"100%", padding:"11px 13px", borderRadius:11, border:`1px solid ${T.border}`, fontSize:14, color:T.text, background:T.card }}>
                {TYPES.map(t=><option key={t}>{t}</option>)}
              </select>
            </div>
            <Field label="Town" value={pTown} onChange={setPTown} placeholder="e.g. Nakuru, Kisumu..." />
            <Field label="Area / Estate" value={pArea} onChange={setPArea} placeholder="e.g. Milimani, Kondele..." />
            <Field label="Description" value={pDesc} onChange={setPDesc} placeholder="Describe the property — size, amenities, what's included..." rows={4} />
            <div style={{ display:"flex", gap:10, marginBottom:14 }}>
              <div style={{ flex:1 }}>
                <label style={{ fontSize:12, fontWeight:700, color:T.text, display:"block", marginBottom:7 }}>Bedrooms</label>
                <select value={pBeds} onChange={e=>setPBeds(e.target.value)} style={{ width:"100%", padding:"11px 10px", borderRadius:11, border:`1px solid ${T.border}`, fontSize:14, color:T.text, background:T.card }}>
                  {["0","1","2","3","4","5+"].map(n=><option key={n} value={n}>{n===0?"Bedsitter/Single":n}</option>)}
                </select>
              </div>
              <div style={{ flex:1 }}>
                <label style={{ fontSize:12, fontWeight:700, color:T.text, display:"block", marginBottom:7 }}>Bathrooms</label>
                <select value={pBaths} onChange={e=>setPBaths(e.target.value)} style={{ width:"100%", padding:"11px 10px", borderRadius:11, border:`1px solid ${T.border}`, fontSize:14, color:T.text, background:T.card }}>
                  {["1","2","3","Shared"].map(n=><option key={n}>{n}</option>)}
                </select>
              </div>
            </div>
            <div style={{ background:T.accentSoft, borderRadius:12, padding:12, marginBottom:16, fontSize:12, color:T.accentDark }}>
              ⚡ Listings go live immediately. Build trust through genuine viewings and good ratings.
            </div>
            <Btn onClick={postProperty} disabled={posting}>{posting?"Posting...":"Post Property →"}</Btn>
          </div>
        </div>
      )}

      {tab === "browse" && (
        <div style={{ padding:16 }}>
          <div style={{ background:T.primarySoft, borderRadius:12, padding:"10px 14px", marginBottom:14, fontSize:12, color:T.primary }}>
            🤝 Viewing fee: Ksh 150. Fully refunded if listing is fake. Anyone can become an agent.
          </div>
          {loading
            ? <div style={{ textAlign:"center", padding:30, color:T.textMuted }}>Loading...</div>
            : properties.length === 0
              ? <div style={{ textAlign:"center", padding:"40px 0", color:T.textMuted }}>
                  <div style={{ fontSize:44 }}>🏠</div>
                  <div style={{ fontWeight:700, color:T.text, fontSize:15, marginTop:12 }}>No properties yet.</div>
                  <div style={{ fontSize:13, marginTop:6 }}>Be the first agent to post!</div>
                  <button onClick={()=>setShowPost(true)} style={{ marginTop:16, background:T.primary, color:"#fff", border:"none", borderRadius:11, padding:"11px 24px", fontSize:14, fontWeight:700, cursor:"pointer" }}>Post a Property</button>
                </div>
              : properties.map(prop=>(
                <div key={prop.id} onClick={()=>setSelected(prop)}
                  style={{ background:T.card, borderRadius:14, marginBottom:12, cursor:"pointer", border:`1px solid ${T.border}`, overflow:"hidden" }}>
                  <div style={{ height:5, background:prop.verified?T.success:T.primary }} />
                  {prop.photos?.[0] && <img src={prop.photos[0]} alt="" style={{ width:"100%", height:140, objectFit:"cover" }} />}
                  <div style={{ padding:"12px 14px" }}>
                    <div style={{ display:"flex", justifyContent:"space-between", gap:8 }}>
                      <div style={{ flex:1 }}>
                        <div style={{ fontWeight:700, color:T.text, fontSize:14 }}>{prop.title}</div>
                        <div style={{ fontSize:11, color:T.textMuted, marginTop:2 }}>📍 {prop.area&&prop.area+", "}{prop.town} · {prop.type}</div>
                        <div style={{ fontSize:11, color:T.textMuted, marginTop:2 }}>Agent: {prop.agent_name} · {prop.agent_viewings||0} viewings</div>
                      </div>
                      <div style={{ textAlign:"right" }}>
                        <div style={{ fontSize:16, fontWeight:800, color:T.primary }}>Ksh {prop.rent?.toLocaleString()}</div>
                        <div style={{ fontSize:10, color:T.textMuted }}>per month</div>
                      </div>
                    </div>
                    <div style={{ display:"flex", gap:6, marginTop:8 }}>
                      {prop.bedrooms > 0 && <Pill color={T.primary} bg={T.primarySoft}>🛏 {prop.bedrooms}BR</Pill>}
                      <Pill color={T.accentDark} bg={T.accentSoft}>Viewing: Ksh 150</Pill>
                      {prop.strikes > 0 && <Pill color={T.coral} bg={T.coralSoft}>⚠ {prop.strikes} strike{prop.strikes>1?"s":""}</Pill>}
                    </div>
                  </div>
                </div>
              ))
          }
        </div>
      )}

      {tab === "agents" && (
        <div style={{ padding:16 }}>
          <div style={{ background:T.primarySoft, borderRadius:14, padding:16, marginBottom:16, border:`1px solid ${T.primary}` }}>
            <div style={{ fontWeight:800, color:T.text, fontSize:16, marginBottom:10 }}>🤝 Earn as a KaziApa Housing Agent</div>
            {[["📅 Per viewing arranged","Ksh 100 automatic"],["💝 Tenant tip (optional)","Up to Ksh 500"],["🏠 When tenant rents","10% of monthly rent from landlord"],["📋 No ID required","Build trust through ratings"]].map(([k,v])=>(
              <div key={k} style={{ display:"flex", justifyContent:"space-between", marginBottom:8, fontSize:13 }}>
                <span style={{ color:T.textMid }}>{k}</span><span style={{ fontWeight:700, color:T.primary }}>{v}</span>
              </div>
            ))}
          </div>
          <div style={{ background:T.successSoft, borderRadius:12, padding:12, marginBottom:16, fontSize:12, color:"#145A36", lineHeight:1.5 }}>
            ✅ Anyone can become an agent. Sign up, post properties, arrange viewings and earn automatically through KaziApa.
          </div>
          <Btn onClick={()=>{ setTab("browse"); setShowPost(true); }}>Start Posting Properties →</Btn>
        </div>
      )}
    </div>
  );
}

// ─── USAFIRI SCREEN ───────────────────────────────────────────────────────────
const VEHICLE_TYPES = [
  { id:"boda",   icon:"🏍️", label:"Bodaboda",    sub:"Motorcycle taxi" },
  { id:"taxi",   icon:"🚖", label:"Taxi/Cab",     sub:"Car hire & rides" },
  { id:"tuktuk", icon:"🛺", label:"Tuk-tuk",      sub:"3-wheeler taxi" },
  { id:"probox", icon:"🚐", label:"Probox/Matatu",sub:"Shared transport" },
  { id:"lorry",  icon:"🚛", label:"Lorry/Pickup", sub:"Goods transport" },
  { id:"other",  icon:"🚗", label:"Other",         sub:"Any other vehicle" },
];

function UsafiriScreen({ userName, phone, town, showToast, onBack, lang }) {
  const [riders, setRiders]       = useState([]);
  const [loading, setLoading]     = useState(false);
  const [selected, setSelected]   = useState(null);
  const [showForm, setShowForm]   = useState(false);
  const [filterType, setFilterType] = useState(null);
  const [posting, setPosting]     = useState(false);

  // Form state
  const [vType, setVType]         = useState("");
  const [vName, setVName]         = useState("");
  const [vStage, setVStage]       = useState("");
  const [vTown, setVTown]         = useState(town!=="All"?town:"");
  const [vArea, setVArea]         = useState("");
  const [vPhone, setVPhone]       = useState(phone);
  const [vAvail, setVAvail]       = useState(true);
  const [vDesc, setVDesc]         = useState("");
  const [vPhotos, setVPhotos]     = useState([]);

  useEffect(()=>{ load(); },[filterType]);

  async function load() {
    setLoading(true);
    let q = sb.from("listings").select("*").eq("category","usafiri")
      .order("usafiri_available",{ ascending:false })
      .order("featured",{ ascending:false })
      .order("created_at",{ ascending:false });
    if(filterType) q = q.eq("usafiri_type", filterType);
    const { data } = await q.limit(50);
    setRiders(data||[]);
    setLoading(false);
  }

  async function post() {
    if(!vType||!vName||!vStage||!vTown) { showToast("Fill in vehicle type, name, stage and town","error"); return; }
    setPosting(true);
    const vt = VEHICLE_TYPES.find(v=>v.id===vType);
    const { error } = await sb.from("listings").insert({
      title:`${vt?.icon} ${vName} — ${vStage}`,
      description: vDesc,
      price: 0,
      category: "usafiri",
      town: vTown,
      seller_name: vName,
      seller_phone: vPhone||phone,
      usafiri_type: vType,
      usafiri_stage: vStage,
      usafiri_area: vArea,
      usafiri_available: vAvail,
      photos: vPhotos,
    });
    if(error) showToast("Error posting. Try again.","error");
    else {
      showToast("Profile posted! Clients can find and call you now. 🎉");
      setShowForm(false);
      setVType(""); setVName(""); setVStage(""); setVArea(""); setVDesc(""); setVPhotos([]);
      await load();
    }
    setPosting(false);
  }

  // Toggle availability
  async function toggleAvailability(rider) {
    const newVal = !rider.usafiri_available;
    await sb.from("listings").update({ usafiri_available:newVal }).eq("id",rider.id);
    showToast(newVal ? "You are now Available ✅" : "You are now Off Duty");
    await load();
  }

  // Detail view
  if(selected) {
    const vt = VEHICLE_TYPES.find(v=>v.id===selected.usafiri_type);
    return (
      <div>
        <BackHeader title={selected.seller_name} onBack={()=>setSelected(null)} />
        <div style={{ padding:16 }}>
          {selected.photos?.[0] && (
            <div style={{ display:"flex",gap:8,overflowX:"auto",marginBottom:16 }}>
              {selected.photos.map((url,i)=>(
                <img key={i} src={url} alt="" style={{ width:i===0?260:140,height:160,objectFit:"cover",borderRadius:14,flexShrink:0 }} />
              ))}
            </div>
          )}
          <div style={{ background:T.card,borderRadius:16,padding:16,marginBottom:12,border:`1px solid ${T.border}` }}>
            <div style={{ display:"flex",alignItems:"center",gap:14,marginBottom:12 }}>
              <div style={{ width:64,height:64,borderRadius:14,background:"#EDE7F6",display:"flex",alignItems:"center",justifyContent:"center",fontSize:36,flexShrink:0 }}>{vt?.icon||"🚗"}</div>
              <div style={{ flex:1 }}>
                <div style={{ fontSize:18,fontWeight:800,color:T.text }}>{selected.seller_name}</div>
                <div style={{ fontSize:13,color:"#7D3C98",fontWeight:600 }}>{vt?.label}</div>
                <div style={{ fontSize:12,color:T.textMuted,marginTop:2 }}>📍 {selected.usafiri_stage} · {selected.town}</div>
              </div>
              <div style={{ background:selected.usafiri_available?T.successSoft:T.coralSoft,color:selected.usafiri_available?T.success:T.coral,borderRadius:20,padding:"6px 12px",fontSize:12,fontWeight:700 }}>
                {selected.usafiri_available?"✅ Available":"⛔ Off Duty"}
              </div>
            </div>
            {selected.usafiri_area && (
              <div style={{ background:T.surface,borderRadius:10,padding:"10px 14px",marginBottom:10,fontSize:13,color:T.textMid }}>
                🗺️ <strong>Coverage area:</strong> {selected.usafiri_area}
              </div>
            )}
            {selected.description && <div style={{ fontSize:13,color:T.textMid,lineHeight:1.7 }}>{selected.description}</div>}
          </div>

          {selected.usafiri_available ? (
            <>
              <div style={{ background:T.successSoft,borderRadius:12,padding:12,marginBottom:16,fontSize:12,color:"#145A36",lineHeight:1.5 }}>
                📞 This rider is available now. Tap to call or WhatsApp directly.
              </div>
              <a href={`tel:${selected.seller_phone}`} style={{ textDecoration:"none" }}>
                <button style={{ width:"100%",padding:15,background:"#7D3C98",color:"#fff",border:"none",borderRadius:13,fontSize:15,fontWeight:800,cursor:"pointer",marginBottom:10 }}>
                  📞 Call {selected.seller_name}
                </button>
              </a>
              <a href={`https://wa.me/${selected.seller_phone.replace(/^0/,"254").replace("+","")}?text=${encodeURIComponent(`Hi ${selected.seller_name}, I found you on KaziApa. Are you available for a ride?`)}`} target="_blank" style={{ textDecoration:"none" }}>
                <button style={{ width:"100%",padding:14,background:"#25D366",color:"#fff",border:"none",borderRadius:13,fontSize:14,fontWeight:800,cursor:"pointer" }}>
                  💚 WhatsApp {selected.seller_name}
                </button>
              </a>
            </>
          ) : (
            <div style={{ background:T.coralSoft,borderRadius:12,padding:14,textAlign:"center",color:T.coral,fontWeight:700 }}>
              ⛔ This rider is currently off duty. Try another one.
            </div>
          )}

          {/* Own listing controls */}
          {selected.seller_phone === phone && (
            <div style={{ marginTop:16,display:"flex",gap:8 }}>
              <button onClick={()=>toggleAvailability(selected)}
                style={{ flex:1,padding:12,background:selected.usafiri_available?T.coral:T.success,color:"#fff",border:"none",borderRadius:12,fontSize:13,fontWeight:700,cursor:"pointer" }}>
                {selected.usafiri_available ? "⛔ Go Off Duty" : "✅ Go Available"}
              </button>
              <button onClick={async()=>{
                if(window.confirm("Delete this profile?")) {
                  await sb.from("listings").delete().eq("id",selected.id);
                  showToast("Profile deleted."); setSelected(null); await load();
                }
              }} style={{ flex:1,padding:12,background:T.coral,color:"#fff",border:"none",borderRadius:12,fontSize:13,fontWeight:700,cursor:"pointer" }}>
                🗑️ Delete
              </button>
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div>
      {/* Header */}
      <div style={{ background:"#7D3C98",padding:"16px 16px 0",borderRadius:"0 0 18px 18px" }}>
        <div style={{ display:"flex",alignItems:"center",gap:10,marginBottom:12 }}>
          <div onClick={onBack} style={{ color:"#fff",fontSize:22,cursor:"pointer" }}>←</div>
          <div style={{ color:"#fff",fontWeight:800,fontSize:18,flex:1 }}>🏍️ Usafiri — Transport</div>
          <button onClick={()=>setShowForm(true)} style={{ background:T.accent,border:"none",borderRadius:20,padding:"6px 14px",fontSize:12,fontWeight:800,color:"#7D3C98",cursor:"pointer" }}>+ Register</button>
        </div>
        {/* Filter chips */}
        <div style={{ display:"flex",gap:6,overflowX:"auto",paddingBottom:14 }}>
          <div onClick={()=>setFilterType(null)} style={{ background:!filterType?"#fff":"rgba(255,255,255,0.15)",color:!filterType?"#7D3C98":"#fff",borderRadius:20,padding:"5px 14px",fontSize:11,fontWeight:700,whiteSpace:"nowrap",cursor:"pointer",flexShrink:0 }}>All</div>
          {VEHICLE_TYPES.map(v=>(
            <div key={v.id} onClick={()=>setFilterType(filterType===v.id?null:v.id)}
              style={{ background:filterType===v.id?"#fff":"rgba(255,255,255,0.15)",color:filterType===v.id?"#7D3C98":"#fff",borderRadius:20,padding:"5px 14px",fontSize:11,fontWeight:700,whiteSpace:"nowrap",cursor:"pointer",flexShrink:0 }}>
              {v.icon} {v.label}
            </div>
          ))}
        </div>
      </div>

      {/* Post form */}
      {showForm && (
        <div style={{ position:"fixed",inset:0,background:T.overlay,zIndex:150,display:"flex",alignItems:"flex-end",justifyContent:"center" }} onClick={()=>setShowForm(false)}>
          <div style={{ background:T.card,borderRadius:"22px 22px 0 0",padding:"24px 20px 36px",width:"100%",maxWidth:430,maxHeight:"88vh",overflowY:"auto" }} onClick={e=>e.stopPropagation()}>
            <div style={{ fontWeight:800,color:T.text,fontSize:17,marginBottom:4 }}>🏍️ Register Your Ride</div>
            <div style={{ fontSize:12,color:T.textMuted,marginBottom:16 }}>Clients in your town will find and call you directly.</div>

            {/* Vehicle type grid */}
            <div style={{ marginBottom:14 }}>
              <label style={{ fontSize:12,fontWeight:700,color:T.text,display:"block",marginBottom:8 }}>Vehicle Type</label>
              <div style={{ display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:8 }}>
                {VEHICLE_TYPES.map(v=>(
                  <div key={v.id} onClick={()=>setVType(v.id)}
                    style={{ background:vType===v.id?"#7D3C98":T.surface,color:vType===v.id?"#fff":T.text,borderRadius:12,padding:"10px 8px",cursor:"pointer",border:`1px solid ${vType===v.id?"#7D3C98":T.border}`,textAlign:"center" }}>
                    <div style={{ fontSize:24 }}>{v.icon}</div>
                    <div style={{ fontSize:11,fontWeight:700,marginTop:4 }}>{v.label}</div>
                    <div style={{ fontSize:9,opacity:0.7,marginTop:2 }}>{v.sub}</div>
                  </div>
                ))}
              </div>
            </div>

            <Field label="Your Name" value={vName} onChange={setVName} placeholder="e.g. John Kamau" />
            <Field label="Your Stage / Base Location" value={vStage} onChange={setVStage} placeholder="e.g. Kondele Stage, Nakuru CBD Stage..." />
            <Field label="Your Town" value={vTown} onChange={setVTown} placeholder="e.g. Nakuru, Kisumu..." />
            <Field label="Area You Cover" value={vArea} onChange={setVArea} placeholder="e.g. Kondele to Town, Nakuru all areas..." />
            <Field label="Your Phone Number" value={vPhone} onChange={setVPhone} placeholder="07XXXXXXXX" />
            <Field label="About You (optional)" value={vDesc} onChange={setVDesc} placeholder="Years of experience, type of trips, anything clients should know..." rows={3} />

            <div style={{ display:"flex",alignItems:"center",gap:10,background:T.surface,borderRadius:12,padding:12,marginBottom:16,cursor:"pointer" }} onClick={()=>setVAvail(!vAvail)}>
              <div style={{ width:22,height:22,borderRadius:6,background:vAvail?T.success:T.border,display:"flex",alignItems:"center",justifyContent:"center",color:"#fff",fontSize:14,flexShrink:0 }}>{vAvail?"✓":""}</div>
              <div style={{ fontSize:13,fontWeight:600,color:T.text }}>I am currently available for rides</div>
            </div>

            <PhotoUploader photos={vPhotos} setPhotos={setVPhotos} maxPhotos={3} />

            <button onClick={post} disabled={posting}
              style={{ width:"100%",padding:15,background:posting?"#ccc":"#7D3C98",color:"#fff",border:"none",borderRadius:13,fontSize:15,fontWeight:800,cursor:posting?"default":"pointer" }}>
              {posting ? "Posting..." : "Register My Ride →"}
            </button>
          </div>
        </div>
      )}

      {/* Listings */}
      <div style={{ padding:16 }}>
        <div style={{ background:"#EDE7F6",borderRadius:12,padding:"10px 14px",marginBottom:14,fontSize:12,color:"#7D3C98" }}>
          🏍️ Find bodaboda, taxis and transport in your town. Call or WhatsApp directly — no booking fee.
        </div>
        {loading
          ? <div style={{ textAlign:"center",padding:30,color:T.textMuted }}>Loading...</div>
          : riders.length === 0
            ? <div style={{ textAlign:"center",padding:"40px 0",color:T.textMuted }}>
                <div style={{ fontSize:44 }}>🏍️</div>
                <div style={{ fontWeight:700,color:T.text,fontSize:15,marginTop:12 }}>No riders registered yet.</div>
                <div style={{ fontSize:13,marginTop:6 }}>Be the first to register your ride!</div>
                <button onClick={()=>setShowForm(true)} style={{ marginTop:16,background:"#7D3C98",color:"#fff",border:"none",borderRadius:11,padding:"11px 24px",fontSize:14,fontWeight:700,cursor:"pointer" }}>
                  + Register My Ride
                </button>
              </div>
            : riders.map(r=>{
                const vt = VEHICLE_TYPES.find(v=>v.id===r.usafiri_type);
                return (
                  <div key={r.id} onClick={()=>setSelected(r)}
                    style={{ background:T.card,borderRadius:14,marginBottom:10,cursor:"pointer",border:`1px solid ${r.usafiri_available?T.success:T.border}`,overflow:"hidden" }}>
                    <div style={{ height:4,background:r.usafiri_available?"#25D366":"#7D3C98" }} />
                    <div style={{ padding:"12px 14px",display:"flex",gap:12,alignItems:"center" }}>
                      {r.photos?.[0]
                        ? <img src={r.photos[0]} alt="" style={{ width:56,height:56,borderRadius:12,objectFit:"cover",flexShrink:0 }} />
                        : <div style={{ width:56,height:56,borderRadius:12,background:"#EDE7F6",display:"flex",alignItems:"center",justifyContent:"center",fontSize:30,flexShrink:0 }}>{vt?.icon||"🚗"}</div>
                      }
                      <div style={{ flex:1,minWidth:0 }}>
                        <div style={{ fontWeight:700,color:T.text,fontSize:14 }}>{r.seller_name}</div>
                        <div style={{ fontSize:12,color:"#7D3C98",fontWeight:600 }}>{vt?.icon} {vt?.label}</div>
                        <div style={{ fontSize:11,color:T.textMuted,marginTop:2 }}>📍 {r.usafiri_stage} · {r.town}</div>
                        {r.usafiri_area && <div style={{ fontSize:11,color:T.textMuted }}>🗺️ {r.usafiri_area}</div>}
                      </div>
                      <div style={{ flexShrink:0,display:"flex",flexDirection:"column",alignItems:"flex-end",gap:6 }}>
                        <div style={{ background:r.usafiri_available?T.successSoft:T.coralSoft,color:r.usafiri_available?T.success:T.coral,borderRadius:20,padding:"4px 10px",fontSize:11,fontWeight:700 }}>
                          {r.usafiri_available?"✅ Available":"⛔ Off Duty"}
                        </div>
                        {r.usafiri_available && (
                          <a href={`tel:${r.seller_phone}`} onClick={e=>e.stopPropagation()}
                            style={{ background:"#7D3C98",color:"#fff",borderRadius:20,padding:"4px 12px",fontSize:11,fontWeight:700,textDecoration:"none" }}>
                            📞 Call
                          </a>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })
        }
      </div>
    </div>
  );
}

// ─── SHAMBA SCREEN ────────────────────────────────────────────────────────────
const PRODUCE_CATS = [
  { id:"maize",      icon:"🌽", label:"Maize/Corn" },
  { id:"vegetables", icon:"🥬", label:"Vegetables" },
  { id:"fruits",     icon:"🍎", label:"Fruits" },
  { id:"potatoes",   icon:"🥔", label:"Potatoes/Roots" },
  { id:"beans",      icon:"🫘", label:"Beans/Legumes" },
  { id:"rice",       icon:"🌾", label:"Rice/Grains" },
  { id:"livestock",  icon:"🐄", label:"Livestock" },
  { id:"poultry",    icon:"🐔", label:"Poultry/Eggs" },
  { id:"milk",       icon:"🥛", label:"Milk/Dairy" },
  { id:"honey",      icon:"🍯", label:"Honey" },
  { id:"coffee",     icon:"☕", label:"Coffee/Tea" },
  { id:"other",      icon:"🌿", label:"Other Produce" },
];

const LAND_TYPES = ["Plot","Farm Land","Acre","Half Acre","Quarter Acre","Residential Land","Commercial Land"];
const EQUIPMENT_CATS = ["Tractor Hire","Plough/Jembe","Irrigation Equipment","Seeds","Fertilizer","Sprayer","Harvesting Equipment","Other"];

function ShambaScreen({ userName, phone, town, showToast, onBack, lang }) {
  const [tab, setTab]         = useState("produce"); // produce | land | equipment
  const [items, setItems]     = useState([]);
  const [loading, setLoading] = useState(false);
  const [selected, setSelected] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [posting, setPosting] = useState(false);

  // Produce form
  const [pName, setPName]     = useState("");
  const [pCat, setPCat]       = useState("");
  const [pPrice, setPPrice]   = useState("");
  const [pUnit, setPUnit]     = useState("Per Kg");
  const [pQty, setPQty]       = useState("");
  const [pTown, setPTown]     = useState(town!=="All"?town:"");
  const [pDesc, setPDesc]     = useState("");
  const [pPhotos, setPPhotos] = useState([]);

  // Land form
  const [lTitle, setLTitle]   = useState("");
  const [lType, setLType]     = useState("Plot");
  const [lPrice, setLPrice]   = useState("");
  const [lSize, setLSize]     = useState("");
  const [lTown, setLTown]     = useState(town!=="All"?town:"");
  const [lDesc, setLDesc]     = useState("");
  const [lPhotos, setLPhotos] = useState([]);

  // Equipment form
  const [eTitle, setETitle]   = useState("");
  const [eCat, setECat]       = useState("");
  const [ePrice, setEPrice]   = useState("");
  const [eTown, setETown]     = useState(town!=="All"?town:"");
  const [eDesc, setEDesc]     = useState("");
  const [ePhotos, setEPhotos] = useState([]);

  useEffect(()=>{ load(); },[tab]);

  async function load() {
    setLoading(true);
    const { data } = await sb.from("listings").select("*")
      .eq("category","shamba")
      .eq("shamba_type", tab)
      .order("featured",{ ascending:false })
      .order("created_at",{ ascending:false })
      .limit(40);
    setItems(data||[]);
    setLoading(false);
  }

  async function post() {
    setPosting(true);
    let payload = { category:"shamba", shamba_type:tab, seller_name:userName, seller_phone:phone };
    if(tab==="produce") {
      if(!pName||!pPrice||!pTown) { showToast("Fill in name, price and town","error"); setPosting(false); return; }
      const cat = PRODUCE_CATS.find(c=>c.id===pCat);
      payload = { ...payload, title:`${cat?.icon||"🌿"} ${pName}`, price:parseInt(pPrice)||0, price_label:`${pPrice} ${pUnit}`, description:`${pDesc}${pQty?` · Available: ${pQty}`:""}`, town:pTown, photos:pPhotos, shamba_unit:pUnit, shamba_produce_cat:pCat };
    } else if(tab==="land") {
      if(!lTitle||!lPrice||!lTown) { showToast("Fill in title, price and town","error"); setPosting(false); return; }
      payload = { ...payload, title:`🏞️ ${lTitle}`, price:parseInt(lPrice)||0, price_label:lPrice, description:`${lDesc}${lSize?` · Size: ${lSize}`:""}`, town:lTown, photos:lPhotos, shamba_land_type:lType };
    } else {
      if(!eTitle||!eTown) { showToast("Fill in title and town","error"); setPosting(false); return; }
      payload = { ...payload, title:`🚜 ${eTitle}`, price:parseInt(ePrice)||0, price_label:ePrice, description:eDesc, town:eTown, photos:ePhotos, shamba_equipment_cat:eCat };
    }
    const { error } = await sb.from("listings").insert(payload);
    if(error) showToast("Error posting. Try again.","error");
    else { showToast("Posted successfully! 🌱"); setShowForm(false); await load(); }
    setPosting(false);
  }

  const TAB_CONFIG = {
    produce:  { icon:"🌽", label:"Farm Produce",   color:"#2E7D32", bg:"#E8F5E9" },
    land:     { icon:"🏞️", label:"Land for Sale",  color:"#5D4037", bg:"#EFEBE9" },
    equipment:{ icon:"🚜", label:"Farm Equipment", color:"#E65100", bg:"#FFF3E0" },
  };
  const tc = TAB_CONFIG[tab];

  if(selected) {
    return (
      <div>
        <BackHeader title={selected.title} onBack={()=>setSelected(null)} />
        <div style={{ padding:16 }}>
          {selected.photos?.length > 0 && (
            <div style={{ display:"flex",gap:8,overflowX:"auto",marginBottom:16 }}>
              {selected.photos.map((url,i)=>(
                <img key={i} src={url} alt="" style={{ width:i===0?280:160,height:180,objectFit:"cover",borderRadius:14,flexShrink:0 }} />
              ))}
            </div>
          )}
          <div style={{ background:T.card,borderRadius:16,padding:16,marginBottom:12,border:`1px solid ${T.border}` }}>
            <div style={{ display:"flex",justifyContent:"space-between",gap:8 }}>
              <div style={{ flex:1 }}>
                <div style={{ fontSize:18,fontWeight:800,color:T.text }}>{selected.title}</div>
                <div style={{ fontSize:12,color:T.textMuted,marginTop:3 }}>📍 {selected.town} · {selected.seller_name}</div>
              </div>
              <div style={{ textAlign:"right" }}>
                <div style={{ fontSize:20,fontWeight:900,color:tc.color }}>Ksh {selected.price_label||selected.price?.toLocaleString()}</div>
              </div>
            </div>
            {selected.description && <div style={{ marginTop:12,fontSize:13,color:T.textMid,lineHeight:1.7 }}>{selected.description}</div>}
          </div>
          <div style={{ background:tc.bg,borderRadius:12,padding:12,marginBottom:16,fontSize:12,color:tc.color,lineHeight:1.5 }}>
            💬 Chat with the seller to confirm availability, quantity and arrange payment or delivery.
          </div>
          <Btn onClick={()=>showToast("Open chat to contact this seller")} style={{ background:tc.color }}>💬 Contact Seller</Btn>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div style={{ background:"#2E7D32",padding:"16px 16px 0",borderRadius:"0 0 18px 18px" }}>
        <div style={{ display:"flex",alignItems:"center",gap:10,marginBottom:12 }}>
          <div onClick={onBack} style={{ color:"#fff",fontSize:22,cursor:"pointer" }}>←</div>
          <div style={{ color:"#fff",fontWeight:800,fontSize:18,flex:1 }}>🌱 Shamba & Farm</div>
          <button onClick={()=>setShowForm(true)} style={{ background:T.accent,border:"none",borderRadius:20,padding:"6px 14px",fontSize:12,fontWeight:800,color:"#2E7D32",cursor:"pointer" }}>+ Post</button>
        </div>
        <div style={{ display:"flex",gap:6,paddingBottom:14 }}>
          {Object.entries(TAB_CONFIG).map(([key,cfg])=>(
            <div key={key} onClick={()=>setTab(key)}
              style={{ flex:1,background:tab===key?"#fff":"rgba(255,255,255,0.15)",color:tab===key?cfg.color:"#fff",borderRadius:12,padding:"8px 0",textAlign:"center",cursor:"pointer",fontWeight:700,fontSize:11 }}>
              {cfg.icon}<div style={{ fontSize:9,marginTop:2 }}>{cfg.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Post form */}
      {showForm && (
        <div style={{ position:"fixed",inset:0,background:T.overlay,zIndex:150,display:"flex",alignItems:"flex-end",justifyContent:"center" }} onClick={()=>setShowForm(false)}>
          <div style={{ background:T.card,borderRadius:"22px 22px 0 0",padding:"24px 20px 36px",width:"100%",maxWidth:430,maxHeight:"88vh",overflowY:"auto" }} onClick={e=>e.stopPropagation()}>

            {tab==="produce" && (
              <>
                <div style={{ fontWeight:800,color:T.text,fontSize:17,marginBottom:16 }}>🌽 Post Farm Produce</div>
                <div style={{ marginBottom:14 }}>
                  <label style={{ fontSize:12,fontWeight:700,color:T.text,display:"block",marginBottom:8 }}>Produce Type</label>
                  <div style={{ display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:6 }}>
                    {PRODUCE_CATS.map(c=>(
                      <div key={c.id} onClick={()=>setPCat(c.id)}
                        style={{ background:pCat===c.id?"#2E7D32":T.surface,color:pCat===c.id?"#fff":T.text,borderRadius:10,padding:"8px 6px",cursor:"pointer",border:`1px solid ${pCat===c.id?"#2E7D32":T.border}`,textAlign:"center" }}>
                        <div style={{ fontSize:20 }}>{c.icon}</div>
                        <div style={{ fontSize:10,fontWeight:600,marginTop:2 }}>{c.label}</div>
                      </div>
                    ))}
                  </div>
                </div>
                <Field label="Product Name" value={pName} onChange={setPName} placeholder="e.g. Fresh Tomatoes, Maize Grade A..." />
                <div style={{ display:"flex",gap:10,marginBottom:14 }}>
                  <div style={{ flex:2 }}><Field label="Price (Ksh)" value={pPrice} onChange={setPPrice} placeholder="50" /></div>
                  <div style={{ flex:1 }}>
                    <label style={{ fontSize:12,fontWeight:700,color:T.text,display:"block",marginBottom:7 }}>Per</label>
                    <select value={pUnit} onChange={e=>setPUnit(e.target.value)} style={{ width:"100%",padding:"11px 8px",borderRadius:11,border:`1px solid ${T.border}`,fontSize:12,color:T.text,background:T.card }}>
                      {["Per Kg","Per Bag","Per Crate","Per Litre","Per Dozen","Per Piece","Negotiable"].map(u=><option key={u}>{u}</option>)}
                    </select>
                  </div>
                </div>
                <Field label="Available Quantity" value={pQty} onChange={setPQty} placeholder="e.g. 50 bags, 200kg available..." />
                <Field label="Your Town / Area" value={pTown} onChange={setPTown} placeholder="e.g. Nakuru, Eldoret..." />
                <Field label="Description (optional)" value={pDesc} onChange={setPDesc} placeholder="Quality, harvest date, delivery available?..." rows={3} />
                <PhotoUploader photos={pPhotos} setPhotos={setPPhotos} maxPhotos={4} />
              </>
            )}

            {tab==="land" && (
              <>
                <div style={{ fontWeight:800,color:T.text,fontSize:17,marginBottom:16 }}>🏞️ Post Land for Sale</div>
                <div style={{ marginBottom:14 }}>
                  <label style={{ fontSize:12,fontWeight:700,color:T.text,display:"block",marginBottom:8 }}>Land Type</label>
                  <div style={{ display:"flex",gap:6,flexWrap:"wrap" }}>
                    {LAND_TYPES.map(t=>(
                      <div key={t} onClick={()=>setLType(t)}
                        style={{ background:lType===t?"#5D4037":T.surface,color:lType===t?"#fff":T.textMid,borderRadius:20,padding:"5px 12px",fontSize:12,fontWeight:600,cursor:"pointer",border:`1px solid ${lType===t?"#5D4037":T.border}` }}>
                        {t}
                      </div>
                    ))}
                  </div>
                </div>
                <Field label="Title / Description" value={lTitle} onChange={setLTitle} placeholder="e.g. 50x100 Plot Nakuru Milimani..." />
                <Field label="Price (Ksh)" value={lPrice} onChange={setLPrice} placeholder="e.g. 500000 or Negotiable" />
                <Field label="Size" value={lSize} onChange={setLSize} placeholder="e.g. 50x100ft, 2 acres, Quarter acre..." />
                <Field label="Town / Location" value={lTown} onChange={setLTown} placeholder="e.g. Nakuru, Eldoret..." />
                <Field label="Details (title deed, amenities, road access...)" value={lDesc} onChange={setLDesc} placeholder="Describe the land — title deed status, nearby facilities, road access, water..." rows={4} />
                <PhotoUploader photos={lPhotos} setPhotos={setLPhotos} maxPhotos={6} />
              </>
            )}

            {tab==="equipment" && (
              <>
                <div style={{ fontWeight:800,color:T.text,fontSize:17,marginBottom:16 }}>🚜 Post Farm Equipment</div>
                <div style={{ marginBottom:14 }}>
                  <label style={{ fontSize:12,fontWeight:700,color:T.text,display:"block",marginBottom:8 }}>Equipment Type</label>
                  <div style={{ display:"flex",gap:6,flexWrap:"wrap" }}>
                    {EQUIPMENT_CATS.map(c=>(
                      <div key={c} onClick={()=>setECat(c)}
                        style={{ background:eCat===c?"#E65100":T.surface,color:eCat===c?"#fff":T.textMid,borderRadius:20,padding:"5px 12px",fontSize:12,fontWeight:600,cursor:"pointer",border:`1px solid ${eCat===c?"#E65100":T.border}` }}>
                        {c}
                      </div>
                    ))}
                  </div>
                </div>
                <Field label="Title" value={eTitle} onChange={setETitle} placeholder="e.g. Tractor for hire — Nakuru, Seeds (maize)..." />
                <Field label="Price (Ksh)" value={ePrice} onChange={setEPrice} placeholder="e.g. 3000 per day or Negotiable" />
                <Field label="Town / Area" value={eTown} onChange={setETown} placeholder="e.g. Nakuru, Eldoret..." />
                <Field label="Description" value={eDesc} onChange={setEDesc} placeholder="Describe the equipment, condition, availability..." rows={3} />
                <PhotoUploader photos={ePhotos} setPhotos={setEPhotos} maxPhotos={4} />
              </>
            )}

            <button onClick={post} disabled={posting}
              style={{ width:"100%",padding:15,background:posting?"#ccc":tc.color,color:"#fff",border:"none",borderRadius:13,fontSize:15,fontWeight:800,cursor:posting?"default":"pointer",marginTop:8 }}>
              {posting ? "Posting..." : "Post Now →"}
            </button>
          </div>
        </div>
      )}

      {/* Listings */}
      <div style={{ padding:16 }}>
        <div style={{ background:tc.bg,borderRadius:12,padding:"10px 14px",marginBottom:14,fontSize:12,color:tc.color }}>
          {tab==="produce" && "🌽 Fresh farm produce from farmers near you. Contact directly for bulk orders and delivery."}
          {tab==="land" && "🏞️ Land and plots for sale across Kenya. Always verify title deed before any payment."}
          {tab==="equipment" && "🚜 Farm equipment for hire or sale. Chat with the owner to confirm availability."}
        </div>
        {loading
          ? <div style={{ textAlign:"center",padding:30,color:T.textMuted }}>Loading...</div>
          : items.length === 0
            ? <div style={{ textAlign:"center",padding:"40px 0",color:T.textMuted }}>
                <div style={{ fontSize:44 }}>{tc.icon}</div>
                <div style={{ fontWeight:700,color:T.text,fontSize:15,marginTop:12 }}>No {tc.label} listings yet.</div>
                <div style={{ fontSize:13,marginTop:6 }}>No opportunities posted here yet. Be the first to share one.</div>
                <button onClick={()=>setShowForm(true)} style={{ marginTop:16,background:tc.color,color:"#fff",border:"none",borderRadius:11,padding:"11px 24px",fontSize:14,fontWeight:700,cursor:"pointer" }}>+ Post {tc.label}</button>
              </div>
            : items.map(item=>(
              <div key={item.id} onClick={()=>setSelected(item)}
                style={{ background:T.card,borderRadius:14,marginBottom:10,cursor:"pointer",border:`1px solid ${T.border}`,overflow:"hidden" }}>
                <div style={{ height:4,background:item.featured?T.accent:tc.color }} />
                <div style={{ display:"flex",gap:10,padding:"12px 14px",alignItems:"flex-start" }}>
                  {item.photos?.[0]
                    ? <img src={item.photos[0]} alt="" style={{ width:72,height:72,borderRadius:12,objectFit:"cover",flexShrink:0 }} />
                    : <div style={{ width:72,height:72,borderRadius:12,background:tc.bg,display:"flex",alignItems:"center",justifyContent:"center",fontSize:36,flexShrink:0 }}>{tc.icon}</div>
                  }
                  <div style={{ flex:1,minWidth:0 }}>
                    <div style={{ fontWeight:700,color:T.text,fontSize:14 }}>{item.title}</div>
                    <div style={{ fontSize:11,color:T.textMuted,marginTop:2 }}>📍 {item.town} · {item.seller_name}</div>
                    {item.description && <div style={{ fontSize:12,color:T.textMid,marginTop:4,overflow:"hidden",display:"-webkit-box",WebkitLineClamp:2,WebkitBoxOrient:"vertical" }}>{item.description}</div>}
                    <div style={{ marginTop:6,display:"flex",gap:6 }}>
                      {item.featured && <Pill color={T.accentDark} bg={T.accentSoft}>🚀 Featured</Pill>}
                    </div>
                  </div>
                  <div style={{ textAlign:"right",flexShrink:0 }}>
                    <div style={{ fontSize:14,fontWeight:800,color:tc.color }}>Ksh {item.price_label||item.price?.toLocaleString()}</div>
                  </div>
                </div>
              </div>
            ))
        }
      </div>
    </div>
  );
}

// ─── FUNDI SCREEN ─────────────────────────────────────────────────────────────
const FUNDI_CATS = [
  { id:"plumber",    icon:"🔧", label:"Plumber",           sub:"Maji, mabomba, sinks" },
  { id:"electrician",icon:"⚡", label:"Electrician",        sub:"Wiring, connections, repairs" },
  { id:"mason",      icon:"🏗️", label:"Mason/Builder",      sub:"Ujenzi, plastering, tiling" },
  { id:"carpenter",  icon:"🪵", label:"Carpenter",          sub:"Furniture, doors, windows" },
  { id:"painter",    icon:"🎨", label:"Painter",            sub:"Walls, houses, furniture" },
  { id:"phonerepair",icon:"📱", label:"Phone Repair",       sub:"Screens, batteries, software" },
  { id:"mechanic",   icon:"🚗", label:"Mechanic",           sub:"Cars, bodaboda, tuk-tuks" },
  { id:"tailor",     icon:"🧵", label:"Tailor",             sub:"Clothes, alterations, uniforms" },
  { id:"welder",     icon:"🏠", label:"Welder",             sub:"Gates, grills, metalwork" },
  { id:"landscaper", icon:"🌿", label:"Landscaper/Gardener",sub:"Shamba, lawn, compound" },
  { id:"househelp",  icon:"🧹", label:"House Help/Cleaner", sub:"Domestic work, cleaning" },
  { id:"barber",     icon:"💇", label:"Barber/Salon",       sub:"Hair services" },
  { id:"photo",      icon:"📷", label:"Photographer",       sub:"Events, portraits, videos" },
  { id:"it",         icon:"💻", label:"IT/Tech Support",    sub:"Computers, printers, CCTV" },
  { id:"transport",  icon:"🚛", label:"Transporter",        sub:"Pickup, lorry, moving" },
  { id:"other",      icon:"🔨", label:"Other",              sub:"Not listed above" },
];

function FundiScreen({ userName, phone, town, showToast, onBack, lang }) {
  const [view, setView]           = useState("browse"); // browse | post | detail
  const [fundis, setFundis]       = useState([]);
  const [loading, setLoading]     = useState(false);
  const [selected, setSelected]   = useState(null);
  const [filterCat, setFilterCat] = useState(null);
  const [showForm, setShowForm]   = useState(false);

  // Form state
  const [fSpecialization, setFSpecialization] = useState("");
  const [fCustomSpec, setFCustomSpec]         = useState("");
  const [fExperience, setFExperience]         = useState("");
  const [fRate, setFRate]                     = useState("");
  const [fRateType, setFRateType]             = useState("Per Job");
  const [fTown, setFTown]                     = useState(town !== "All" ? town : "");
  const [fDesc, setFDesc]                     = useState("");
  const [fAvail, setFAvail]                   = useState(true);
  const [fPhotos, setFPhotos]                 = useState([]);
  const [posting, setPosting]                 = useState(false);

  useEffect(()=>{ load(); },[filterCat]);

  async function load() {
    setLoading(true);
    let q = sb.from("listings").select("*").eq("category","fundi").order("featured",{ ascending:false }).order("created_at",{ ascending:false });
    if(filterCat) q = q.eq("fundi_specialization", filterCat);
    const { data } = await q.limit(40);
    setFundis(data||[]);
    setLoading(false);
  }

  async function post() {
    const spec = fSpecialization === "other" ? fCustomSpec : fSpecialization;
    if(!spec || !fTown) { showToast("Fill in specialization and town","error"); return; }
    setPosting(true);
    const cat = FUNDI_CATS.find(c=>c.id===fSpecialization);
    const { error } = await sb.from("listings").insert({
      title: `${cat?.icon||"🔨"} ${cat?.label||spec} — ${fTown}`,
      description: fDesc,
      price: parseInt(fRate)||0,
      category: "fundi",
      town: fTown,
      seller_name: userName,
      seller_phone: phone,
      fundi_specialization: fSpecialization,
      fundi_custom_spec: fCustomSpec,
      fundi_experience: fExperience,
      fundi_rate_type: fRateType,
      fundi_available: fAvail,
      photos: fPhotos,
    });
    if(error) { showToast("Error posting. Try again.","error"); }
    else {
      showToast("Profile posted! Clients can find you now. 🎉");
      setShowForm(false);
      setFSpecialization(""); setFCustomSpec(""); setFExperience(""); setFRate(""); setFDesc(""); setFPhotos([]);
      await load();
    }
    setPosting(false);
  }

  // Detail view
  if(selected) {
    const cat = FUNDI_CATS.find(c=>c.id===selected.fundi_specialization);
    return (
      <div>
        <BackHeader title={cat?.label||selected.fundi_custom_spec||"Fundi"} onBack={()=>setSelected(null)} />
        <div style={{ padding:16 }}>
          {selected.photos?.length > 0 && (
            <div style={{ display:"flex",gap:8,overflowX:"auto",marginBottom:16 }}>
              {selected.photos.map((url,i)=>(
                <img key={i} src={url} alt="" style={{ width:i===0?260:140,height:160,objectFit:"cover",borderRadius:14,flexShrink:0 }} />
              ))}
            </div>
          )}
          <div style={{ background:T.card,borderRadius:16,padding:16,marginBottom:12,border:`1px solid ${T.border}` }}>
            <div style={{ display:"flex",alignItems:"flex-start",gap:12 }}>
              <div style={{ width:56,height:56,borderRadius:14,background:T.primary,display:"flex",alignItems:"center",justifyContent:"center",fontSize:28,flexShrink:0 }}>{cat?.icon||"🔨"}</div>
              <div style={{ flex:1 }}>
                <div style={{ fontSize:18,fontWeight:800,color:T.text }}>{selected.seller_name}</div>
                <div style={{ fontSize:13,color:T.textMuted,marginTop:2 }}>📍 {selected.town}</div>
                <div style={{ display:"flex",gap:6,marginTop:6,flexWrap:"wrap" }}>
                  <Pill color="#1A5276" bg="#EAF2FF">{cat?.icon} {cat?.label||selected.fundi_custom_spec}</Pill>
                  {selected.fundi_available ? <Pill color={T.success} bg={T.successSoft}>✅ Available</Pill> : <Pill color={T.coral} bg={T.coralSoft}>Busy</Pill>}
                  {selected.fundi_experience && <Pill color={T.primary} bg={T.primarySoft}>{selected.fundi_experience} exp</Pill>}
                </div>
              </div>
            </div>
            {selected.price > 0 && (
              <div style={{ marginTop:12,display:"flex",justifyContent:"space-between",alignItems:"center",background:T.surface,borderRadius:10,padding:"10px 14px" }}>
                <span style={{ fontSize:13,color:T.textMid }}>Rate</span>
                <span style={{ fontSize:16,fontWeight:800,color:T.primary }}>Ksh {selected.price?.toLocaleString()} <span style={{ fontSize:11,fontWeight:400 }}>{selected.fundi_rate_type||"per job"}</span></span>
              </div>
            )}
            {selected.description && <div style={{ marginTop:12,fontSize:13,color:T.textMid,lineHeight:1.7 }}>{selected.description}</div>}
          </div>
          <div style={{ background:T.primarySoft,borderRadius:12,padding:12,marginBottom:16,fontSize:12,color:T.primary,lineHeight:1.5 }}>
            💬 Chat first to agree on price and scope of work before any payment. Only pay after the job is done to your satisfaction.
          </div>
          <Btn onClick={()=>showToast("Open chat to contact this fundi")}>💬 Contact This Fundi</Btn>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div style={{ background:"#1A5276",padding:"16px 16px 0",borderRadius:"0 0 18px 18px" }}>
        <div style={{ display:"flex",alignItems:"center",gap:10,marginBottom:12 }}>
          <div onClick={onBack} style={{ color:"#fff",fontSize:22,cursor:"pointer" }}>←</div>
          <div style={{ color:"#fff",fontWeight:800,fontSize:18,flex:1 }}>🔧 Fundis & Services</div>
          <button onClick={()=>setShowForm(true)} style={{ background:T.accent,border:"none",borderRadius:20,padding:"6px 14px",fontSize:12,fontWeight:800,color:"#1A5276",cursor:"pointer" }}>+ Post</button>
        </div>
        {/* Category filter chips */}
        <div style={{ display:"flex",gap:6,overflowX:"auto",paddingBottom:14 }}>
          <div onClick={()=>setFilterCat(null)} style={{ background:!filterCat?"#fff":"rgba(255,255,255,0.15)",color:!filterCat?"#1A5276":"#fff",borderRadius:20,padding:"5px 14px",fontSize:11,fontWeight:700,whiteSpace:"nowrap",cursor:"pointer",flexShrink:0 }}>All</div>
          {FUNDI_CATS.filter(c=>c.id!=="other").map(c=>(
            <div key={c.id} onClick={()=>setFilterCat(filterCat===c.id?null:c.id)}
              style={{ background:filterCat===c.id?"#fff":"rgba(255,255,255,0.15)",color:filterCat===c.id?"#1A5276":"#fff",borderRadius:20,padding:"5px 14px",fontSize:11,fontWeight:700,whiteSpace:"nowrap",cursor:"pointer",flexShrink:0 }}>
              {c.icon} {c.label}
            </div>
          ))}
        </div>
      </div>

      {/* Post form modal */}
      {showForm && (
        <div style={{ position:"fixed",inset:0,background:T.overlay,zIndex:150,display:"flex",alignItems:"flex-end",justifyContent:"center" }} onClick={()=>setShowForm(false)}>
          <div style={{ background:T.card,borderRadius:"22px 22px 0 0",padding:"24px 20px 36px",width:"100%",maxWidth:430,maxHeight:"88vh",overflowY:"auto" }} onClick={e=>e.stopPropagation()}>
            <div style={{ fontWeight:800,color:T.text,fontSize:17,marginBottom:4 }}>🔧 Post Your Fundi Profile</div>
            <div style={{ fontSize:12,color:T.textMuted,marginBottom:16 }}>Clients in your town will find and contact you directly.</div>

            {/* Specialization grid */}
            <div style={{ marginBottom:14 }}>
              <label style={{ fontSize:12,fontWeight:700,color:T.text,display:"block",marginBottom:8 }}>What is your specialization?</label>
              <div style={{ display:"grid",gridTemplateColumns:"1fr 1fr",gap:8 }}>
                {FUNDI_CATS.map(c=>(
                  <div key={c.id} onClick={()=>setFSpecialization(c.id)}
                    style={{ background:fSpecialization===c.id?"#1A5276":T.surface,color:fSpecialization===c.id?"#fff":T.text,borderRadius:12,padding:"10px 12px",cursor:"pointer",border:`1px solid ${fSpecialization===c.id?"#1A5276":T.border}`,display:"flex",alignItems:"center",gap:8 }}>
                    <span style={{ fontSize:20 }}>{c.icon}</span>
                    <div>
                      <div style={{ fontSize:12,fontWeight:700 }}>{c.label}</div>
                      <div style={{ fontSize:10,opacity:0.7 }}>{c.sub}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Custom specialization if "Other" selected */}
            {fSpecialization === "other" && (
              <Field label="Describe your specialization" value={fCustomSpec} onChange={setFCustomSpec} placeholder="e.g. Solar installation, TV repair, roofing..." />
            )}

            <Field label="Years of Experience" value={fExperience} onChange={setFExperience} placeholder="e.g. 5 years, 2 years..." />

            <div style={{ display:"flex",gap:10,marginBottom:14 }}>
              <div style={{ flex:2 }}>
                <Field label="Rate (Ksh)" value={fRate} onChange={setFRate} placeholder="500" type="number" />
              </div>
              <div style={{ flex:1 }}>
                <label style={{ fontSize:12,fontWeight:700,color:T.text,display:"block",marginBottom:7 }}>Per</label>
                <select value={fRateType} onChange={e=>setFRateType(e.target.value)} style={{ width:"100%",padding:"11px 8px",borderRadius:11,border:`1px solid ${T.border}`,fontSize:13,color:T.text,background:T.card }}>
                  {["Per Job","Per Hour","Per Day","Negotiable"].map(t=><option key={t}>{t}</option>)}
                </select>
              </div>
            </div>

            <Field label="Your Town / Area" value={fTown} onChange={setFTown} placeholder="e.g. Nakuru CBD, Kisumu..." />

            <Field label="Tell clients about yourself and your work" value={fDesc} onChange={setFDesc}
              placeholder="Describe your experience, what you can do, past projects, why clients should choose you..."
              rows={4} />

            <div style={{ marginBottom:14 }}>
              <label style={{ fontSize:12,fontWeight:700,color:T.text,display:"block",marginBottom:8 }}>Photos of Past Work (Recommended)</label>
              <PhotoUploader photos={fPhotos} setPhotos={setFPhotos} maxPhotos={6} />
              <div style={{ fontSize:11,color:T.textMuted,marginTop:6 }}>📸 Fundis with photos of their work get 5x more clients. Add photos of completed jobs.</div>
            </div>

            <div style={{ display:"flex",alignItems:"center",gap:10,background:T.surface,borderRadius:12,padding:12,marginBottom:16,cursor:"pointer" }} onClick={()=>setFAvail(!fAvail)}>
              <div style={{ width:22,height:22,borderRadius:6,background:fAvail?T.success:T.border,display:"flex",alignItems:"center",justifyContent:"center",color:"#fff",fontSize:14,flexShrink:0 }}>{fAvail?"✓":""}</div>
              <div style={{ fontSize:13,fontWeight:600,color:T.text }}>I am currently available for work</div>
            </div>

            <button onClick={post} disabled={posting}
              style={{ width:"100%",padding:15,background:posting?"#ccc":"#1A5276",color:"#fff",border:"none",borderRadius:13,fontSize:15,fontWeight:800,cursor:posting?"default":"pointer" }}>
              {posting ? "Posting..." : "Post My Profile →"}
            </button>
          </div>
        </div>
      )}

      {/* Listings */}
      <div style={{ padding:16 }}>
        <div style={{ background:"#EAF2FF",borderRadius:12,padding:"10px 14px",marginBottom:14,fontSize:12,color:"#1A5276" }}>
          🔧 Find skilled fundis in your town. Chat first, agree on price, pay after the job is done.
        </div>
        {loading
          ? <div style={{ textAlign:"center",padding:30,color:T.textMuted }}>Loading...</div>
          : fundis.length === 0
            ? <div style={{ textAlign:"center",padding:"40px 0",color:T.textMuted }}>
                <div style={{ fontSize:44 }}>🔧</div>
                <div style={{ fontWeight:700,color:T.text,fontSize:15,marginTop:12 }}>
                  {filterCat ? `No ${FUNDI_CATS.find(c=>c.id===filterCat)?.label||""} fundis yet.` : "No fundis posted yet."}
                </div>
                <div style={{ fontSize:13,marginTop:6 }}>No services listed yet. Be the first to offer yours to the community.</div>
                <button onClick={()=>setShowForm(true)} style={{ marginTop:16,background:"#1A5276",color:"#fff",border:"none",borderRadius:11,padding:"11px 24px",fontSize:14,fontWeight:700,cursor:"pointer" }}>
                  + Post My Services
                </button>
              </div>
            : fundis.map(f=>{
                const cat = FUNDI_CATS.find(c=>c.id===f.fundi_specialization);
                return (
                  <div key={f.id} onClick={()=>setSelected(f)}
                    style={{ background:T.card,borderRadius:14,marginBottom:10,cursor:"pointer",border:`1px solid ${T.border}`,overflow:"hidden" }}>
                    <div style={{ height:4,background:f.featured?"#F5A623":"#1A5276" }} />
                    <div style={{ padding:"12px 14px",display:"flex",gap:12,alignItems:"flex-start" }}>
                      {f.photos?.[0]
                        ? <img src={f.photos[0]} alt="" style={{ width:64,height:64,borderRadius:12,objectFit:"cover",flexShrink:0 }} />
                        : <div style={{ width:64,height:64,borderRadius:12,background:"#EAF2FF",display:"flex",alignItems:"center",justifyContent:"center",fontSize:32,flexShrink:0 }}>{cat?.icon||"🔨"}</div>
                      }
                      <div style={{ flex:1,minWidth:0 }}>
                        <div style={{ fontWeight:700,color:T.text,fontSize:14 }}>{f.seller_name}</div>
                        <div style={{ fontSize:12,color:"#1A5276",fontWeight:600,marginTop:2 }}>{cat?.icon} {cat?.label||f.fundi_custom_spec}</div>
                        <div style={{ fontSize:11,color:T.textMuted,marginTop:2 }}>📍 {f.town} {f.fundi_experience && `· ${f.fundi_experience}`}</div>
                        <div style={{ display:"flex",gap:6,marginTop:6,flexWrap:"wrap" }}>
                          {f.fundi_available ? <Pill color={T.success} bg={T.successSoft}>✅ Available</Pill> : <Pill color={T.coral} bg={T.coralSoft}>Busy</Pill>}
                          {f.featured && <Pill color="#B7410E" bg="#FFF0E8">🚀 Featured</Pill>}
                        </div>
                      </div>
                      {f.price > 0 && (
                        <div style={{ textAlign:"right",flexShrink:0 }}>
                          <div style={{ fontSize:14,fontWeight:800,color:"#1A5276" }}>Ksh {f.price?.toLocaleString()}</div>
                          <div style={{ fontSize:10,color:T.textMuted }}>{f.fundi_rate_type||"per job"}</div>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })
        }
      </div>
    </div>
  );
}

// ─── KIOSK SCREEN ─────────────────────────────────────────────────────────────
function KioskScreen({ phone, userName, town, showToast, onBack }) {
  const [kiosk, setKiosk]       = useState(null);
  const [listings, setListings] = useState([]);
  const [loading, setLoading]   = useState(true);
  const [editing, setEditing]   = useState(false);
  const [name, setName]         = useState("");
  const [desc, setDesc]         = useState("");
  const [location, setLocation] = useState("");
  const [category, setCategory] = useState("");
  const [saving, setSaving]     = useState(false);

  useEffect(()=>{ load(); },[]);

  async function load() {
    setLoading(true);
    const { data:k } = await sb.from("kiosks").select("*").eq("phone",phone).single();
    const { data:l } = await sb.from("listings").select("*").eq("seller_phone",phone).order("created_at",{ ascending:false }).limit(20);
    if(k) { setKiosk(k); setName(k.name); setDesc(k.description); setLocation(k.location); setCategory(k.category); }
    else { setName(userName); setLocation(town); }
    setListings(l||[]);
    setLoading(false);
  }

  async function save() {
    if(!name.trim()) { showToast("Enter your kiosk name","error"); return; }
    setSaving(true);
    if(kiosk) {
      await sb.from("kiosks").update({ name, description:desc, location, category, updated_at:new Date().toISOString() }).eq("phone",phone);
    } else {
      await sb.from("kiosks").insert({ phone, seller_name:userName, name, description:desc, location, category });
    }
    showToast("Kiosk saved! 🏪");
    setEditing(false);
    await load();
    setSaving(false);
  }

  if(loading) return <div style={{ padding:40,textAlign:"center",color:T.textMuted }}>Loading...</div>;

  return (
    <div>
      <BackHeader title="🏪 My Kiosk" onBack={onBack} right={
        <button onClick={()=>setEditing(!editing)} style={{ background:T.accent,border:"none",borderRadius:20,padding:"6px 14px",fontSize:12,fontWeight:800,color:T.primary,cursor:"pointer" }}>
          {editing ? "Cancel" : "Edit"}
        </button>
      } />
      <div style={{ padding:16 }}>
        {!kiosk && !editing && (
          <div style={{ textAlign:"center",padding:"30px 0" }}>
            <div style={{ fontSize:56 }}>🏪</div>
            <div style={{ fontWeight:800,color:T.text,fontSize:17,marginTop:12 }}>Create Your Kiosk</div>
            <div style={{ fontSize:13,color:T.textMuted,marginTop:8,lineHeight:1.6 }}>Your digital market stall — show buyers who you are, what you sell and where to find you.</div>
            <button onClick={()=>setEditing(true)} style={{ marginTop:20,background:T.primary,color:"#fff",border:"none",borderRadius:13,padding:"13px 28px",fontSize:15,fontWeight:800,cursor:"pointer" }}>Set Up My Kiosk →</button>
          </div>
        )}
        {editing && (
          <div>
            <div style={{ fontWeight:800,color:T.text,fontSize:16,marginBottom:16 }}>🏪 {kiosk ? "Edit" : "Set Up"} Your Kiosk</div>
            <Field label="Kiosk Name" value={name} onChange={setName} placeholder="e.g. Araff Mtumba Bales" />
            <Field label="What You Sell" value={category} onChange={setCategory} placeholder="e.g. Second hand clothes, shoes, bags..." />
            <Field label="Location / Where to Find You" value={location} onChange={setLocation} placeholder="e.g. Nakuru Market, Stall 14, next to KCB" />
            <Field label="Your Story (Why buy from you?)" value={desc} onChange={setDesc} placeholder="e.g. 5 years experience sourcing Grade A mtumba from Nairobi. Quality guaranteed, fair prices..." rows={4} />
            <div style={{ background:T.successSoft,borderRadius:12,padding:12,marginBottom:16,fontSize:12,color:"#145A36" }}>
              💡 A good kiosk description builds trust. Tell buyers your experience, your specialty, and why they should choose you.
            </div>
            <Btn onClick={save} disabled={saving}>{saving?"Saving...":"Save Kiosk →"}</Btn>
          </div>
        )}
        {kiosk && !editing && (
          <div>
            <div style={{ background:T.primary,borderRadius:16,padding:20,marginBottom:16,color:"#fff" }}>
              <div style={{ fontSize:22,fontWeight:900 }}>{kiosk.name}</div>
              <div style={{ fontSize:13,opacity:0.8,marginTop:4 }}>📍 {kiosk.location}</div>
              {kiosk.category && <div style={{ background:"rgba(255,255,255,0.15)",borderRadius:20,padding:"4px 12px",fontSize:12,fontWeight:700,display:"inline-block",marginTop:8 }}>{kiosk.category}</div>}
              {kiosk.description && <div style={{ fontSize:13,marginTop:12,lineHeight:1.6,opacity:0.9 }}>{kiosk.description}</div>}
            </div>
            <div style={{ fontWeight:800,color:T.text,fontSize:15,marginBottom:12 }}>My Listings ({listings.length})</div>
            {listings.length === 0
              ? <div style={{ textAlign:"center",padding:"20px 0",color:T.textMuted,fontSize:13 }}>No listings yet. Post your first item!</div>
              : listings.map(l=>(
                <div key={l.id} style={{ background:T.card,borderRadius:13,padding:12,marginBottom:10,border:`1px solid ${T.border}`,display:"flex",gap:10,alignItems:"center" }}>
                  {l.photos?.[0] ? <img src={l.photos[0]} alt="" style={{ width:56,height:56,borderRadius:10,objectFit:"cover",flexShrink:0 }} /> : <div style={{ width:56,height:56,borderRadius:10,background:T.border,display:"flex",alignItems:"center",justifyContent:"center",fontSize:24,flexShrink:0 }}>📦</div>}
                  <div style={{ flex:1,minWidth:0 }}>
                    <div style={{ fontWeight:700,color:T.text,fontSize:13 }}>{l.title}</div>
                    <div style={{ fontSize:12,color:T.primary,fontWeight:700 }}>Ksh {l.price?.toLocaleString()}</div>
                    {l.sold && <div style={{ fontSize:11,color:T.coral,fontWeight:700 }}>SOLD</div>}
                    {l.featured && <div style={{ fontSize:11,color:T.accentDark,fontWeight:700 }}>🚀 Boosted</div>}
                  </div>
                </div>
              ))
            }
          </div>
        )}
      </div>
    </div>
  );
}

// ─── SPLASH SCREEN ────────────────────────────────────────────────────────────
function SplashScreen({ onDone }) {
  useEffect(()=>{
    const t = setTimeout(onDone, 2800);
    return ()=>clearTimeout(t);
  },[]);

  return (
    <div style={{ fontFamily:"'Segoe UI',system-ui,sans-serif",background:"linear-gradient(160deg,#003F8A 0%,#0066CC 60%,#0A8FE0 100%)",minHeight:"100vh",maxWidth:430,margin:"0 auto",display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",padding:40,textAlign:"center" }}>
      {/* Logo */}
      <div style={{ width:96,height:96,borderRadius:24,background:"#F5A623",display:"flex",alignItems:"center",justifyContent:"center",fontSize:52,fontWeight:900,color:"#0066CC",marginBottom:24,boxShadow:"0 8px 32px rgba(0,0,0,0.25)" }}>K</div>

      {/* Brand */}
      <div style={{ fontSize:36,fontWeight:900,color:"#fff",letterSpacing:-0.5 }}>KaziApa</div>
      <div style={{ fontSize:16,color:"#F5A623",fontWeight:700,marginTop:8 }}>Opportunity is already hapa.</div>
      <div style={{ fontSize:14,color:"rgba(255,255,255,0.7)",marginTop:4 }}>We connect you.</div>

      {/* Loading dots */}
      <div style={{ display:"flex",gap:8,marginTop:48 }}>
        {[0,1,2].map(i=>(
          <div key={i} style={{ width:8,height:8,borderRadius:"50%",background:"rgba(255,255,255,0.4)",animation:`pulse 1.2s ease-in-out ${i*0.4}s infinite` }} />
        ))}
      </div>

      <div style={{ position:"absolute",bottom:32,fontSize:11,color:"rgba(255,255,255,0.4)" }}>
        Kazinasi Technologies · Kenya
      </div>

      <style>{`
        @keyframes pulse {
          0%,100%{opacity:0.3;transform:scale(1)}
          50%{opacity:1;transform:scale(1.3)}
        }
      `}</style>
    </div>
  );
}

// ─── ONBOARDING SCREEN ────────────────────────────────────────────────────────
function OnboardingScreen({ onDone }) {
  const [step, setStep] = useState(0);

  const SLIDES = [
    {
      emoji:"🌍",
      headline:"The opportunity you're looking for may already be around you.",
      body:"Every day people search for jobs, workers, customers, housing and services. Many never realize those opportunities already exist in their own communities.\n\nKaziApa helps people discover them.",
      bg:"linear-gradient(160deg,#003F8A 0%,#0066CC 100%)",
    },
    {
      emoji:"🤝",
      headline:"Communities become stronger when people connect.",
      body:"",
      community:true,
      bg:"linear-gradient(160deg,#0066CC 0%,#1E9B5A 100%)",
    },
    {
      emoji:"✨",
      headline:"Discover opportunities around you.",
      body:"",
      categories:true,
      bg:"linear-gradient(160deg,#1A5276 0%,#0066CC 100%)",
    },
  ];

  const COMMUNITY = [
    { icon:"🌽", label:"Farmer" },
    { icon:"🔧", label:"Fundi" },
    { icon:"🏠", label:"Landlord" },
    { icon:"🛒", label:"Seller" },
    { icon:"🎓", label:"Student" },
    { icon:"🏍️", label:"Boda Rider" },
    { icon:"👨‍👩‍👧", label:"Family" },
  ];

  const CATS = [
    { icon:"💼",label:"Jobs",color:"#B7410E" },
    { icon:"🏠",label:"Housing",color:"#0E6655" },
    { icon:"🛒",label:"Goods",color:"#6C3483" },
    { icon:"🏍️",label:"Transport",color:"#7D3C98" },
    { icon:"🌽",label:"Shamba",color:"#1E9B5A" },
    { icon:"🔧",label:"Fundi",color:"#1A5276" },
  ];

  const slide = SLIDES[step];

  function finish() {
    localStorage.setItem("kaziapa_onboarded","1");
    onDone();
  }

  return (
    <div style={{ fontFamily:"'Segoe UI',system-ui,sans-serif",background:slide.bg,minHeight:"100vh",maxWidth:430,margin:"0 auto",display:"flex",flexDirection:"column",padding:"48px 32px 40px",transition:"background 0.5s" }}>

      {/* Skip button */}
      <div onClick={finish} style={{ alignSelf:"flex-end",color:"rgba(255,255,255,0.5)",fontSize:13,cursor:"pointer",fontWeight:600 }}>Skip</div>

      {/* Main content */}
      <div style={{ flex:1,display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",textAlign:"center" }}>
        <div style={{ fontSize:64,marginBottom:24 }}>{slide.emoji}</div>
        <div style={{ fontSize:22,fontWeight:900,color:"#fff",lineHeight:1.3,marginBottom:16 }}>{slide.headline}</div>

        {slide.body && (
          <div style={{ fontSize:14,color:"rgba(255,255,255,0.75)",lineHeight:1.8,whiteSpace:"pre-line" }}>{slide.body}</div>
        )}

        {slide.community && (
          <div style={{ display:"flex",flexWrap:"wrap",gap:12,justifyContent:"center",marginTop:16 }}>
            {COMMUNITY.map(c=>(
              <div key={c.label} style={{ background:"rgba(255,255,255,0.12)",borderRadius:14,padding:"12px 16px",textAlign:"center",minWidth:72 }}>
                <div style={{ fontSize:28 }}>{c.icon}</div>
                <div style={{ fontSize:11,color:"rgba(255,255,255,0.85)",fontWeight:600,marginTop:4 }}>{c.label}</div>
              </div>
            ))}
          </div>
        )}

        {slide.categories && (
          <div style={{ display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:10,marginTop:16,width:"100%" }}>
            {CATS.map(c=>(
              <div key={c.label} style={{ background:"rgba(255,255,255,0.12)",borderRadius:14,padding:"14px 8px",textAlign:"center" }}>
                <div style={{ fontSize:28 }}>{c.icon}</div>
                <div style={{ fontSize:11,color:"#fff",fontWeight:700,marginTop:4 }}>{c.label}</div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Progress dots */}
      <div style={{ display:"flex",gap:8,justifyContent:"center",marginBottom:24 }}>
        {SLIDES.map((_,i)=>(
          <div key={i} style={{ width:i===step?24:8,height:8,borderRadius:4,background:i===step?"#F5A623":"rgba(255,255,255,0.3)",transition:"all 0.3s" }} />
        ))}
      </div>

      {/* Button */}
      {step < SLIDES.length - 1 ? (
        <button onClick={()=>setStep(step+1)}
          style={{ width:"100%",padding:16,background:"#F5A623",color:"#0066CC",border:"none",borderRadius:14,fontSize:16,fontWeight:900,cursor:"pointer" }}>
          Next →
        </button>
      ) : (
        <button onClick={finish}
          style={{ width:"100%",padding:16,background:"#F5A623",color:"#0066CC",border:"none",borderRadius:14,fontSize:16,fontWeight:900,cursor:"pointer" }}>
          Get Started →
        </button>
      )}
    </div>
  );
}

// ─── LEGAL CONTENT ────────────────────────────────────────────────────────────
const PRIVACY_SECTIONS = [
  ["Effective Date", "08 July 2026 — Kazinasi Technologies, Nakuru, Kenya"],
  ["What We Collect", "Phone number (for account creation and OTP verification), name and town (provided by you during signup), listing content including photos (posted by you), messages sent between users inside KaziApa chat, GPS location coordinates (only when you voluntarily tap 'Share Location' in chat), device information for app functionality."],
  ["How We Use Your Data", "To create and manage your account, to send OTP verification SMS via Africa's Talking, to display your listings to other users in your town, to enable chat between buyers and sellers, to send you WhatsApp notifications about new messages via Meta WhatsApp Business Platform, to improve the app and fix bugs."],
  ["Service Providers", "Supabase (database and file storage — EU West 1, Ireland), Africa's Talking (SMS OTP delivery — Kenya), Meta/WhatsApp Business Platform (message notifications), Vercel (app hosting — USA), Safaricom Daraja (M-Pesa payments for Boost/Featured listings — Kenya)."],
  ["Payments", "KaziApa does not hold or process payments between users. All user-to-user transactions are conducted directly via M-Pesa. KaziApa is not a party to any transaction between users. Boost and Featured listing fees are paid directly to KaziApa via M-Pesa Daraja STK Push."],
  ["Location Data", "KaziApa only accesses your GPS location when you explicitly tap the 'Share Location' button inside a chat. Location is never tracked in the background. Location coordinates are shared only with the specific user you are chatting with."],
  ["Data Retention", "Your data is retained as long as your account is active. You may request deletion of your account and all associated data by contacting privacy@kaziapa.co.ke. Deleted data is removed within 30 days."],
  ["Children's Privacy", "KaziApa is intended for users aged 18 and above. We do not knowingly collect data from children under 18."],
  ["Your Rights", "You have the right to access, correct, or delete your personal data. Contact us at privacy@kaziapa.co.ke for any data requests."],
  ["Governing Law", "This Privacy Policy is governed by the laws of Kenya, including the Kenya Data Protection Act 2019."],
  ["Contact", "For privacy concerns: privacy@kaziapa.co.ke | Kazinasi Technologies, Nakuru, Kenya"],
];

const TERMS_SECTIONS = [
  ["1. About KaziApa", "KaziApa is a hyperlocal marketplace platform operated by Kazinasi Technologies (Business Registration Certificate BN-MJS7EOL7, issued 08 July 2026, Nakuru, Kenya). KaziApa connects buyers, sellers, job seekers, employers, tenants, housing agents, fundis, farmers, and transport providers within communities across Kenya."],
  ["2. KaziApa's Role", "KaziApa is a platform only. We connect people — we do not buy, sell, employ, rent, or hold money on behalf of any user. All transactions, agreements, and dealings are strictly between the users involved. KaziApa is not a party to any transaction between users."],
  ["3. Payments Between Users", "KaziApa does not currently hold or process payments between users automatically. All user-to-user payments are made directly via M-Pesa or cash. KaziApa is not responsible for any payment disputes, losses, or fraud between users. Always confirm the identity and trustworthiness of the person you are dealing with before sending money."],
  ["4. Boost & Featured Listings", "KaziApa charges fees for Boost and Featured listing services. These payments are processed via M-Pesa Daraja STK Push directly to KaziApa. These fees are non-refundable once a listing has been boosted or featured."],
  ["5. User Responsibilities", "By using KaziApa you agree to: provide accurate information about yourself and your listings, only post items, services, or jobs that you genuinely have or need, treat other users with respect and honesty, not use KaziApa for any illegal activity, meet in safe public places when completing transactions."],
  ["6. Prohibited Items & Activities", "You must NOT use KaziApa to sell or advertise: stolen goods, counterfeit or fake items, illegal drugs or substances, weapons or ammunition, adult or obscene content, or any item or service that is illegal under Kenyan law. Violations will result in immediate account suspension and may be reported to authorities."],
  ["7. Housing Listings", "Agents and landlords must only post genuine, available properties. Fake or misleading listings will result in account suspension and strikes. 3 strikes results in permanent suspension. KaziApa does not hold viewing fees — all payments are directly between tenants and agents."],
  ["8. Transport Listings", "Bodaboda riders, taxi drivers and other transport providers must maintain accurate availability status. Riders are solely responsible for their own safety, licensing, and insurance. KaziApa is not liable for any incidents during transport arranged through the platform."],
  ["9. Dispute Resolution", "KaziApa does not mediate or resolve disputes between users. For serious issues involving fraud or illegal activity, contact the Kenya Police Service or the Communications Authority of Kenya."],
  ["10. Limitation of Liability", "KaziApa is provided as-is without any guarantees. KaziApa is not liable for any loss, damage, or harm arising from use of the platform, including financial loss, failed transactions, or incorrect information posted by other users."],
  ["11. Changes to Terms", "These Terms may be updated from time to time. Continued use of KaziApa after changes are posted means you accept the updated Terms."],
  ["12. Governing Law", "These Terms are governed by the laws of Kenya. Any disputes will be resolved under Kenyan jurisdiction."],
];

const ABOUT_SECTIONS = [
  ["Our Story", "KaziApa was built in Nairobi, Kenya to solve a simple problem: the opportunity people are looking for is often already nearby — the problem is that people don't know where to find each other. KaziApa bridges that gap. We believe every community already has jobs, customers, skilled workers, houses, farmers, and transport. People simply need a way to discover them."],
  ["Our Mission", "To connect people with opportunities already around them through trusted technology that strengthens communities and improves lives."],
  ["Our Vision", "To become Africa's most trusted hyperlocal community platform."],
  ["Brand Promise", "Opportunity is already hapa. We connect you."],
  ["Our Philosophy", "KaziApa is NOT just another marketplace. KaziApa exists to strengthen communities by connecting people with opportunities that already exist around them. The word 'Hapa' means 'Here.' Technology should strengthen communities, not replace them. Trust is more important than growth. Every feature should help communities become stronger."],
  ["What KaziApa Offers", "Marketplace for goods and mitumba, job listings (employers and job seekers), housing and rentals with agent model, farm produce, land and equipment, fundi and professional services, transport (bodaboda, taxi, tuk-tuk), buyer requests board, and safe in-app chat with location sharing."],
  ["Our Core Beliefs", "Every community already has: Jobs · Customers · Skilled workers · Businesses · Houses · Land · Farmers · Transport · Opportunities. People simply need a way to discover them."],
  ["Our Company", "KaziApa is a product of Kazinasi Technologies, a Kenyan-registered business (Certificate BN-MJS7EOL7, issued 08 July 2026) based in Nairobi, Kenya."],
  ["Our Values", "Honesty — we never claim to do things we cannot do yet. Trust — we build features that protect users, not exploit them. Local first — we build for Kenyan communities. Accessibility — free to use, works on any Android phone with any data plan. Community — every feature must strengthen communities, not just transactions."],
  ["Contact Us", "Email: hello@kaziapa.co.ke | Website: kaziapa.co.ke | Location: Nairobi, Kenya"],
];

// ─── LEGAL SCREEN ─────────────────────────────────────────────────────────────
function LegalScreen({ title, onBack, sections }) {
  return (
    <div>
      <BackHeader title={title} onBack={onBack} />
      <div style={{ padding:16 }}>
        <div style={{ background:T.primarySoft,borderRadius:12,padding:"10px 14px",marginBottom:16,fontSize:12,color:T.primary }}>
          Kazinasi Technologies · kaziapa.co.ke · Nakuru, Kenya
        </div>
        {sections.map(([heading, body])=>(
          <div key={heading} style={{ marginBottom:20 }}>
            <div style={{ fontWeight:800,color:T.primary,fontSize:13,marginBottom:6 }}>{heading}</div>
            <div style={{ fontSize:13,color:T.textMid,lineHeight:1.8 }}>{body}</div>
          </div>
        ))}
        <div style={{ marginTop:16,padding:16,background:T.surface,borderRadius:12,fontSize:12,color:T.textMuted,textAlign:"center" }}>
          © 2026 Kazinasi Technologies. All rights reserved.
        </div>
      </div>
    </div>
  );
}

// ─── CONTACT SCREEN ───────────────────────────────────────────────────────────
function ContactScreen({ onBack }) {
  const CONTACTS = [
    { icon:"📧", label:"General Enquiries",  value:"hello@kaziapa.co.ke",     href:"mailto:hello@kaziapa.co.ke" },
    { icon:"🔒", label:"Privacy & Data",     value:"privacy@kaziapa.co.ke",   href:"mailto:privacy@kaziapa.co.ke" },
    { icon:"🌐", label:"Website",            value:"kaziapa.co.ke",           href:"https://kaziapa.co.ke" },
    { icon:"💚", label:"WhatsApp Support",   value:"Chat with us",            href:"https://wa.me/254768761424?text=Hi KaziApa support" },
    { icon:"📍", label:"Location",           value:"Nairobi, Kenya",           href:null },
  ];
  return (
    <div>
      <BackHeader title="📧 Contact Us" onBack={onBack} />
      <div style={{ padding:16 }}>
        <div style={{ background:T.primarySoft,borderRadius:14,padding:16,marginBottom:16 }}>
          <div style={{ fontWeight:800,color:T.text,fontSize:15,marginBottom:4 }}>We're here to help</div>
          <div style={{ fontSize:13,color:T.textMid,lineHeight:1.6 }}>KaziApa is built by a small team in Nakuru. We read every message and respond as fast as we can.</div>
        </div>
        {CONTACTS.map(c=>(
          <div key={c.label} onClick={()=>c.href&&window.open(c.href,"_blank")}
            style={{ background:T.card,borderRadius:13,padding:14,marginBottom:10,border:`1px solid ${T.border}`,display:"flex",alignItems:"center",gap:14,cursor:c.href?"pointer":"default" }}>
            <div style={{ width:44,height:44,borderRadius:12,background:T.primarySoft,display:"flex",alignItems:"center",justifyContent:"center",fontSize:22,flexShrink:0 }}>{c.icon}</div>
            <div style={{ flex:1 }}>
              <div style={{ fontSize:11,color:T.textMuted,fontWeight:600 }}>{c.label}</div>
              <div style={{ fontSize:14,fontWeight:700,color:c.href?T.primary:T.text,marginTop:2 }}>{c.value}</div>
            </div>
            {c.href && <div style={{ color:T.textMuted,fontSize:16 }}>→</div>}
          </div>
        ))}
        <div style={{ background:T.successSoft,borderRadius:12,padding:14,marginTop:8,fontSize:12,color:"#145A36",lineHeight:1.6 }}>
          🕐 We typically respond within 24 hours on business days (Monday–Friday).
        </div>
      </div>
    </div>
  );
}

// ─── TERMS & CONDITIONS MODAL ─────────────────────────────────────────────────
function TermsModal({ setShowTerms }) {
  const TERMS = [
    ["1. About KaziApa", "KaziApa is a hyperlocal marketplace platform that connects buyers, sellers, job seekers, employers, tenants, and housing agents within the same town or community in Kenya. KaziApa is operated by Stephen Onyango (trading as KaziApa) and can be reached at stvaraff@gmail.com."],
    ["2. KaziApa's Role", "KaziApa is a platform only. We connect people — we do not buy, sell, employ, rent, or hold money on behalf of any user. All transactions, agreements, and dealings are strictly between the users involved. KaziApa is not a party to any transaction."],
    ["3. Payments", "KaziApa does not currently hold or process payments automatically. All payments are made directly between users via M-Pesa or cash. KaziApa is not responsible for any payment disputes, losses, or fraud. Always confirm the identity and trustworthiness of the person you are dealing with before sending money."],
    ["4. User Responsibilities", "By using KaziApa you agree to: (a) provide accurate information about yourself and your listings; (b) only post items, services, or jobs that you genuinely have or need; (c) treat other users with respect; (d) not use KaziApa for any illegal activity; (e) meet in safe, public places when completing transactions."],
    ["5. Prohibited Items & Activities", "You must NOT use KaziApa to sell or advertise: stolen goods, counterfeit or fake items, illegal drugs or substances, weapons or ammunition, adult or obscene content, or any item or service that is illegal under Kenyan law. Accounts found violating this rule will be suspended immediately and reported to authorities where required."],
    ["6. Housing Listings", "Housing agents and landlords must only post genuine, available properties. Fake or misleading listings will result in account suspension and strikes. KaziApa does not verify listings but relies on community reporting to maintain quality."],
    ["7. Jobs Listings", "Employers must only post genuine job vacancies with accurate pay and conditions. Job seekers must represent their skills and experience honestly. KaziApa is not an employment agency and is not responsible for any employment relationship between users."],
    ["8. Disputes", "KaziApa does not mediate or resolve disputes between users. If you have a problem with another user, we encourage you to resolve it directly. For serious issues involving fraud or illegal activity, contact the Kenya Police Service or the Communications Authority of Kenya."],
    ["9. Account Suspension", "KaziApa reserves the right to suspend or delete any account that violates these Terms, posts false information, engages in fraud, or receives multiple verified complaints from other users."],
    ["10. Limitation of Liability", "KaziApa is provided 'as is' without any guarantees. KaziApa is not liable for any loss, damage, or harm arising from use of the platform, including but not limited to financial loss, failed transactions, or incorrect information posted by other users."],
    ["11. Changes to Terms", "These Terms may be updated from time to time. Continued use of KaziApa after changes are posted means you accept the updated Terms."],
    ["12. Governing Law", "These Terms are governed by the laws of Kenya. Any disputes will be resolved under Kenyan jurisdiction."],
  ];
  return (
    <div style={{ position:"fixed",inset:0,background:"rgba(0,51,102,0.6)",zIndex:200,display:"flex",alignItems:"flex-end",justifyContent:"center" }} onClick={()=>setShowTerms(false)}>
      <div style={{ background:"#fff",borderRadius:"22px 22px 0 0",padding:"24px 20px 36px",width:"100%",maxWidth:430,maxHeight:"85vh",overflowY:"auto" }} onClick={e=>e.stopPropagation()}>
        <div style={{ fontWeight:900,color:"#0A1628",fontSize:18,marginBottom:4 }}>📋 Terms & Conditions</div>
        <div style={{ fontSize:11,color:"#6B7A90",marginBottom:20 }}>Effective date: June 2026 · KaziApa Kenya</div>
        {TERMS.map(([title,body])=>(
          <div key={title} style={{ marginBottom:18 }}>
            <div style={{ fontWeight:800,color:"#0066CC",fontSize:13,marginBottom:5 }}>{title}</div>
            <div style={{ fontSize:13,color:"#3A4A5C",lineHeight:1.7 }}>{body}</div>
          </div>
        ))}
        <div style={{ background:"#F0F7FF",borderRadius:12,padding:12,marginBottom:20,fontSize:12,color:"#0066CC",lineHeight:1.5 }}>
          By using KaziApa you confirm that you have read, understood, and agree to these Terms & Conditions.
        </div>
        <button onClick={()=>setShowTerms(false)} style={{ width:"100%",padding:13,background:"#0066CC",color:"#fff",border:"none",borderRadius:12,fontSize:14,fontWeight:700,cursor:"pointer" }}>I Understand — Close</button>
      </div>
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
