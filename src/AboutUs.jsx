import { useState } from "react";

const T = {
  primary:"#0066CC", accent:"#F5A623", text:"#0A1628",
  textMid:"#3A4A5C", textMuted:"#7A8A9C",
  card:"#fff", surface:"#F5F7FA", border:"#E2E8F0",
  primarySoft:"#EBF4FF", successSoft:"#E8F5E9", success:"#1E9B5A",
};

export default function AboutUs({ onBack, onWhyKaziApa }) {
  return (
    <div style={{ fontFamily:"'Segoe UI',system-ui,sans-serif", background:T.surface, minHeight:"100vh", maxWidth:430, margin:"0 auto" }}>
      {/* Header */}
      <div style={{ background:`linear-gradient(160deg,#003F8A,#0066CC)`, padding:"16px 16px 32px" }}>
        <div style={{ display:"flex", alignItems:"center", gap:10, marginBottom:20 }}>
          <div onClick={onBack} style={{ color:"#fff", fontSize:22, cursor:"pointer" }}>←</div>
          <div style={{ color:"#fff", fontWeight:800, fontSize:16, flex:1 }}>About KaziApa</div>
        </div>
        <div style={{ textAlign:"center" }}>
          <div style={{ width:72, height:72, borderRadius:18, background:"#F5A623", display:"flex", alignItems:"center", justifyContent:"center", fontSize:38, fontWeight:900, color:"#0066CC", margin:"0 auto 12px", boxShadow:"0 4px 16px rgba(0,0,0,0.2)" }}>K</div>
          <div style={{ fontSize:26, fontWeight:900, color:"#fff" }}>KaziApa</div>
          <div style={{ fontSize:14, color:"#F5A623", fontWeight:700, marginTop:4 }}>Opportunity is already hapa.</div>
          <div style={{ fontSize:13, color:"rgba(255,255,255,0.7)", marginTop:2 }}>We connect you.</div>
        </div>
      </div>

      <div style={{ padding:16, marginTop:-16 }}>
        {/* Intro card */}
        <div style={{ background:T.card, borderRadius:16, padding:20, marginBottom:16, boxShadow:"0 2px 12px rgba(0,0,0,0.06)" }}>
          <p style={{ fontSize:14, color:T.textMid, lineHeight:1.8, margin:0 }}>
            Every community has people with skills, businesses with potential, farmers with harvests, and families looking for opportunities.
            KaziApa exists to help those people discover one another and build stronger communities together.
          </p>
        </div>

        {/* Our Story */}
        <div style={{ background:T.card, borderRadius:16, padding:20, marginBottom:16, boxShadow:"0 2px 12px rgba(0,0,0,0.06)" }}>
          <h2 style={{ fontSize:16, fontWeight:800, color:T.primary, marginBottom:12, marginTop:0 }}>Our Story</h2>
          <p style={{ fontSize:13, color:T.textMid, lineHeight:1.8, margin:"0 0 10px" }}>
            When we looked around our community, we saw something that didn't make sense. People were looking for jobs. Businesses were looking for workers. Farmers were looking for buyers. Families were looking for houses. People were searching for fundis, transport, and everyday services.
          </p>
          <p style={{ fontSize:13, color:T.textMid, lineHeight:1.8, margin:"0 0 10px" }}>
            Yet many of these opportunities already existed nearby. A skilled fundi could live in the same neighbourhood as someone desperately looking for one. A farmer might transport produce hundreds of kilometres while buyers nearby import the same products from elsewhere.
          </p>
          <p style={{ fontSize:13, color:T.textMid, lineHeight:1.8, margin:"0 0 10px" }}>
            Communities already had the people, the skills, and the opportunities. They simply lacked a bridge. That bridge became KaziApa.
          </p>
          <p style={{ fontSize:14, fontWeight:700, color:T.primary, fontStyle:"italic", margin:0 }}>
            Opportunity is already hapa. We connect you.
          </p>
        </div>

        {/* Mission */}
        <div style={{ background:T.card, borderRadius:16, padding:20, marginBottom:16, boxShadow:"0 2px 12px rgba(0,0,0,0.06)" }}>
          <h2 style={{ fontSize:16, fontWeight:800, color:T.primary, marginBottom:8, marginTop:0 }}>Our Mission</h2>
          <p style={{ fontSize:13, color:T.textMid, lineHeight:1.8, margin:0 }}>
            To connect people with opportunities already around them through trusted technology that strengthens communities and improves lives.
          </p>
        </div>

        {/* Vision */}
        <div style={{ background:T.card, borderRadius:16, padding:20, marginBottom:16, boxShadow:"0 2px 12px rgba(0,0,0,0.06)" }}>
          <h2 style={{ fontSize:16, fontWeight:800, color:T.primary, marginBottom:8, marginTop:0 }}>Our Vision</h2>
          <p style={{ fontSize:13, color:T.textMid, lineHeight:1.8, margin:0 }}>
            To build Africa's most trusted community platform where every person can discover opportunities already around them, and every community can grow stronger through meaningful local connections.
          </p>
        </div>

        {/* Values */}
        <div style={{ background:T.card, borderRadius:16, padding:20, marginBottom:16, boxShadow:"0 2px 12px rgba(0,0,0,0.06)" }}>
          <h2 style={{ fontSize:16, fontWeight:800, color:T.primary, marginBottom:12, marginTop:0 }}>Our Values</h2>
          {[
            ["🤝","Community First","Every decision should strengthen local communities."],
            ["🔒","Trust Before Growth","Growth without trust doesn't last."],
            ["📍","Think Local","The next opportunity may be only a few steps away."],
            ["💡","Innovation With Purpose","Technology should solve real human problems."],
            ["🌍","Kenya First","Built for Kenya, by Kenyans."],
          ].map(([icon,title,desc])=>(
            <div key={title} style={{ display:"flex", gap:12, marginBottom:14, alignItems:"flex-start" }}>
              <div style={{ fontSize:22, flexShrink:0 }}>{icon}</div>
              <div>
                <div style={{ fontWeight:700, color:T.text, fontSize:13 }}>{title}</div>
                <div style={{ fontSize:12, color:T.textMuted, marginTop:2, lineHeight:1.6 }}>{desc}</div>
              </div>
            </div>
          ))}
        </div>

        {/* Company */}
        <div style={{ background:T.primarySoft, borderRadius:16, padding:20, marginBottom:16, border:`1px solid ${T.primary}20` }}>
          <h2 style={{ fontSize:16, fontWeight:800, color:T.primary, marginBottom:8, marginTop:0 }}>Our Company</h2>
          <p style={{ fontSize:13, color:T.textMid, lineHeight:1.8, margin:0 }}>
            KaziApa is a product of <strong>Kazinasi Technologies</strong>, a Kenyan-registered business (Certificate BN-MJS7EOL7, issued 08 July 2026) based in Nairobi, Kenya.
          </p>
        </div>

        {/* Why KaziApa button */}
        {onWhyKaziApa && (
          <button onClick={onWhyKaziApa}
            style={{ width:"100%", padding:15, background:T.accent, color:T.primary, border:"none", borderRadius:14, fontSize:15, fontWeight:800, cursor:"pointer", marginBottom:16 }}>
            💡 Why KaziApa? →
          </button>
        )}

        <div style={{ textAlign:"center", fontSize:11, color:T.textMuted, paddingBottom:24 }}>
          © 2026 Kazinasi Technologies · kaziapa.co.ke · Nairobi, Kenya
        </div>
      </div>
    </div>
  );
}
