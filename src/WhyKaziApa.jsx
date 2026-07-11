export default function WhyKaziApa({ onBack }) {
  const T = {
    primary:"#0066CC", accent:"#F5A623", text:"#0A1628",
    textMid:"#3A4A5C", textMuted:"#7A8A9C",
    card:"#fff", surface:"#F5F7FA", border:"#E2E8F0",
    primarySoft:"#EBF4FF", successSoft:"#E8F5E9", success:"#1E9B5A",
  };

  const REASONS = [
    { icon:"🌍", title:"Built for Kenya", desc:"KaziApa is not a copy of a foreign app. It is built from the ground up for Kenyan communities, Kenyan towns, and the Kenyan informal economy. We understand M-Pesa, bodaboda, mitumba, shamba, and the way Kenyans actually do business." },
    { icon:"📍", title:"Hyperlocal — Your Town, Not the Internet", desc:"Most platforms show you listings from across the country. KaziApa focuses on your town. Whether you are in Nakuru, Kisumu, Eldoret, Mombasa, or a small market town, KaziApa connects you with people already near you." },
    { icon:"🤝", title:"Community, Not Just Commerce", desc:"KaziApa is not just a marketplace. It is a community platform. Every feature is designed to strengthen the relationships between people in the same community — not just to facilitate a transaction and move on." },
    { icon:"🔒", title:"Trust First", desc:"We know that trust is the biggest barrier to doing business online in Kenya. That is why KaziApa is built with safety features, verified users, ratings, and community reporting — so you can deal with confidence." },
    { icon:"💼", title:"Everything in One Place", desc:"Jobs, housing, goods, services, transport, farm produce, land — all in one app. No more switching between WhatsApp groups, Facebook pages, and word of mouth. KaziApa brings it all together." },
    { icon:"📱", title:"Works on Any Phone", desc:"KaziApa is a Progressive Web App. It works on any Android phone, does not require a fast internet connection, and can be installed directly from your browser — no app store needed." },
    { icon:"🆓", title:"Free to Use", desc:"Listing on KaziApa is completely free. We believe access to opportunity should not cost money. We only charge for optional features like boosting your listing to reach more people." },
    { icon:"🇰🇪", title:"Kenyan-Owned", desc:"KaziApa is owned and operated by Kazinasi Technologies, a Kenyan-registered business. Your data stays in Kenya. Your money supports a Kenyan business. And the people building this platform understand your community." },
  ];

  return (
    <div style={{ fontFamily:"'Segoe UI',system-ui,sans-serif", background:T.surface, minHeight:"100vh", maxWidth:430, margin:"0 auto" }}>
      {/* Header */}
      <div style={{ background:`linear-gradient(160deg,#003F8A,#0066CC)`, padding:"16px 16px 28px" }}>
        <div style={{ display:"flex", alignItems:"center", gap:10, marginBottom:16 }}>
          <div onClick={onBack} style={{ color:"#fff", fontSize:22, cursor:"pointer" }}>←</div>
          <div style={{ color:"#fff", fontWeight:800, fontSize:16, flex:1 }}>Why KaziApa?</div>
        </div>
        <div style={{ textAlign:"center" }}>
          <div style={{ fontSize:40, marginBottom:8 }}>💡</div>
          <div style={{ fontSize:20, fontWeight:900, color:"#fff" }}>Why Choose KaziApa?</div>
          <div style={{ fontSize:13, color:"rgba(255,255,255,0.75)", marginTop:6, lineHeight:1.6, padding:"0 16px" }}>
            There are many apps out there. Here is why KaziApa is different.
          </div>
        </div>
      </div>

      <div style={{ padding:16, marginTop:-12 }}>
        {REASONS.map((r,i)=>(
          <div key={i} style={{ background:T.card, borderRadius:16, padding:16, marginBottom:12, boxShadow:"0 2px 10px rgba(0,0,0,0.05)", display:"flex", gap:14, alignItems:"flex-start" }}>
            <div style={{ width:48, height:48, borderRadius:12, background:T.primarySoft, display:"flex", alignItems:"center", justifyContent:"center", fontSize:26, flexShrink:0 }}>{r.icon}</div>
            <div style={{ flex:1 }}>
              <div style={{ fontWeight:800, color:T.text, fontSize:14, marginBottom:4 }}>{r.title}</div>
              <div style={{ fontSize:12, color:T.textMid, lineHeight:1.7 }}>{r.desc}</div>
            </div>
          </div>
        ))}

        {/* Brand promise */}
        <div style={{ background:`linear-gradient(135deg,#003F8A,#0066CC)`, borderRadius:16, padding:20, marginTop:8, marginBottom:16, textAlign:"center" }}>
          <div style={{ fontSize:18, fontWeight:900, color:"#F5A623", marginBottom:6 }}>Opportunity is already hapa.</div>
          <div style={{ fontSize:14, color:"rgba(255,255,255,0.85)", lineHeight:1.6 }}>We connect you.</div>
          <div style={{ marginTop:12, fontSize:11, color:"rgba(255,255,255,0.5)" }}>Kazinasi Technologies · Nairobi, Kenya · 2026</div>
        </div>
      </div>
    </div>
  );
}
