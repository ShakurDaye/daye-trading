/* eslint-disable */
import { useState, useEffect, useCallback } from "react";

// ─── FAKE DATA ────────────────────────────────────────────────────────────────
const ASSETS = [
  { symbol:"AAPL", name:"Apple Inc.",    price:192.45,  change:+1.23,   pct:+0.64 },
  { symbol:"TSLA", name:"Tesla Inc.",    price:245.18,  change:-4.32,   pct:-1.73 },
  { symbol:"NVDA", name:"NVIDIA Corp.",  price:912.36,  change:+18.44,  pct:+2.06 },
  { symbol:"BTC",  name:"Bitcoin",       price:68420.0, change:+1240.0, pct:+1.85 },
  { symbol:"ETH",  name:"Ethereum",      price:3450.0,  change:-82.5,   pct:-2.33 },
  { symbol:"SPY",  name:"S&P 500 ETF",   price:526.22,  change:+3.11,   pct:+0.59 },
];
const SECTORS = [
  { name:"Technology",     pct:+2.4, stocks:["AAPL","NVDA","MSFT","GOOGL"] },
  { name:"Crypto",         pct:+3.7, stocks:["BTC","ETH","SOL","BNB"] },
  { name:"Healthcare",     pct:+0.8, stocks:["JNJ","PFE","UNH","ABBV"] },
  { name:"Consumer Goods", pct:+1.1, stocks:["AMZN","WMT","COST","TGT"] },
  { name:"Energy",         pct:-1.2, stocks:["XOM","CVX","OXY","SLB"] },
  { name:"Finance",        pct:-0.6, stocks:["JPM","BAC","GS","MS"] },
];
const JOURNAL_ENTRIES = [
  { id:1, date:"2024-05-10", asset:"AAPL", side:"BUY",  entry:188.20, exit:192.45, pl:+4.25,  notes:"Breakout above resistance", emotion:"Confident", lesson:"Patience paid off" },
  { id:2, date:"2024-05-08", asset:"TSLA", side:"SELL", entry:252.00, exit:245.18, pl:+6.82,  notes:"Short on weak volume",      emotion:"Calm",      lesson:"Volume confirms moves" },
  { id:3, date:"2024-05-06", asset:"ETH",  side:"BUY",  entry:3520.0, exit:3450.0, pl:-70.0,  notes:"Entered too early",         emotion:"FOMO",      lesson:"Wait for confirmation" },
];
const TRADE_HISTORY = [
  { id:1, time:"10:32 AM",  symbol:"AAPL", type:"BUY",  qty:10,  price:191.20, total:1912.0 },
  { id:2, time:"09:15 AM",  symbol:"BTC",  type:"BUY",  qty:0.1, price:67800,  total:6780.0 },
  { id:3, time:"Yesterday", symbol:"TSLA", type:"SELL", qty:5,   price:250.00, total:1250.0 },
  { id:4, time:"Yesterday", symbol:"NVDA", type:"BUY",  qty:2,   price:905.00, total:1810.0 },
];
const OPEN_POSITIONS = [
  { symbol:"AAPL", qty:10,  avgCost:188.50, current:192.45, pl:+39.50, pct:+2.09 },
  { symbol:"NVDA", qty:2,   avgCost:905.00, current:912.36, pl:+14.72, pct:+0.81 },
  { symbol:"BTC",  qty:0.1, avgCost:67800,  current:68420,  pl:+62.0,  pct:+0.91 },
];
const LESSONS_INITIAL = {
  beginner: [
    { id:1,  title:"What Is Trading?",             time:"10 min", done:false },
    { id:2,  title:"Stocks, Crypto, Forex & ETFs", time:"15 min", done:false },
    { id:3,  title:"What Is a Chart?",             time:"12 min", done:false },
    { id:4,  title:"Candlestick Basics",           time:"20 min", done:false },
    { id:5,  title:"Risk Management Basics",       time:"18 min", done:false },
    { id:6,  title:"Stop-Loss & Take-Profit",      time:"15 min", done:false },
    { id:7,  title:"Trading Psychology Basics",    time:"22 min", done:false },
  ],
  intermediate: [
    { id:8,  title:"Support & Resistance",         time:"25 min", done:false },
    { id:9,  title:"Trendlines",                   time:"20 min", done:false },
    { id:10, title:"Moving Averages",              time:"22 min", done:false },
    { id:11, title:"Volume Analysis",              time:"18 min", done:false },
    { id:12, title:"Market Structure",             time:"20 min", done:false },
    { id:13, title:"Breakouts & Pullbacks",        time:"25 min", done:false },
    { id:14, title:"Creating a Trading Plan",      time:"30 min", done:false },
  ],
  advanced: [
    { id:15, title:"Technical Analysis Strategies",time:"35 min", done:false },
    { id:16, title:"Risk-to-Reward Ratio",         time:"25 min", done:false },
    { id:17, title:"Position Sizing",              time:"20 min", done:false },
    { id:18, title:"Advanced Candlestick Patterns",time:"30 min", done:false },
    { id:19, title:"Multi-Timeframe Analysis",     time:"28 min", done:false },
    { id:20, title:"Backtesting Basics",           time:"32 min", done:false },
    { id:21, title:"Trading Journal Review",       time:"20 min", done:false },
  ],
};
const LESSONS = LESSONS_INITIAL;
const QUIZZES = [
  { level:"beginner", title:"Trading Fundamentals", questions:[
    { q:"What does a stop-loss order do?", opts:["Locks in profits automatically","Limits your maximum loss on a trade","Increases your buying power","Places a market order instantly"], ans:1 },
    { q:"What is a candlestick?", opts:["A lighting tool","A chart element showing open/close/high/low prices","A type of cryptocurrency","A brokerage fee"], ans:1 },
    { q:"What is risk management?", opts:["Avoiding all trades","The process of minimizing potential losses","Maximizing leverage","Ignoring stop-losses"], ans:1 },
    { q:"What does 'going long' mean?", opts:["Holding a trade overnight","Buying an asset expecting its price to rise","Selling an asset short","Trading on margin"], ans:1 },
  ]},
  { level:"intermediate", title:"Technical Analysis", questions:[
    { q:"What does 'support' mean on a chart?", opts:["A price level where selling pressure increases","A price level where buying interest tends to stop a decline","The highest point of a trend","A moving average crossover"], ans:1 },
    { q:"What is a moving average used for?", opts:["Predicting exact prices","Smoothing price data to identify trends","Calculating profit/loss","Setting stop-loss levels"], ans:1 },
    { q:"What is a breakout?", opts:["When a trade loses money","When price moves beyond a key support/resistance level","A failed trade setup","A type of candlestick"], ans:1 },
  ]},
  { level:"advanced", title:"Advanced Concepts", questions:[
    { q:"What is a risk-to-reward ratio of 1:3?", opts:["You risk $3 to make $1","You risk $1 to potentially make $3","You have a 33% win rate","You use 3x leverage"], ans:1 },
    { q:"What is backtesting?", opts:["Trading backwards","Testing a strategy on historical data","Canceling old trades","Reviewing a journal"], ans:1 },
    { q:"What is position sizing?", opts:["The size of your trading screen","Determining how much capital to risk per trade","The number of assets in your portfolio","Setting take-profit levels"], ans:1 },
  ]},
];
const BADGES = [
  { icon:"🎓", name:"First Lesson",    earned:true  },
  { icon:"📊", name:"Chart Reader",    earned:true  },
  { icon:"✅", name:"Quiz Champion",   earned:true  },
  { icon:"💼", name:"First Trade",     earned:true  },
  { icon:"🔥", name:"7-Day Streak",    earned:false },
  { icon:"🏆", name:"Advanced Trader", earned:false },
];

// ─── VALIDATION RULES ────────────────────────────────────────────────────────
const VALIDATORS = {
  fullName: (v) => {
    if (!v.trim()) return "Full name is required.";
    if (v.trim().length < 2) return "Name must be at least 2 characters.";
    if (!/^[a-zA-Z\s'\-]+$/.test(v)) return "Name can only contain letters, spaces, hyphens, or apostrophes.";
    return "";
  },
  email: (v) => {
    if (!v.trim()) return "Email address is required.";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v)) return "Please enter a valid email (e.g. you@example.com).";
    if (/[<>\"'`]/.test(v)) return "Email contains invalid characters.";
    return "";
  },
  password: (v) => {
    if (!v) return "Password is required.";
    if (v.length < 6) return "Password must be at least 6 characters.";
    if (/\s/.test(v)) return "Password cannot contain spaces.";
    return "";
  },
};

// ─── SPARKLINE ───────────────────────────────────────────────────────────────
function Sparkline({ positive, width=80, height=32 }) {
  const pts = [];
  let v = 50;
  for (let i=0; i<20; i++) {
    v += (Math.random() - (positive ? 0.4 : 0.6)) * 8;
    v = Math.max(10, Math.min(90, v));
    pts.push(v);
  }
  const xs = pts.map((_,i) => (i/(pts.length-1))*width);
  const ys = pts.map(p => height - (p/100)*height);
  const color = positive ? "#22c55e" : "#ef4444";
  return (
    <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`} style={{display:"block"}}>
      <polyline points={xs.map((x,i)=>`${x},${ys[i]}`).join(" ")} fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );
}

// ─── LIVE CANDLE CHART ───────────────────────────────────────────────────────
function CandleChart({ symbol }) {
  const basePrice = ASSETS.find(a=>a.symbol===symbol)?.price || 200;

  // Generate initial candles
  const makeCandles = (base) => {
    const candles = [];
    let price = base * 0.97;
    for (let i=0; i<40; i++) {
      const open  = price;
      const move  = (Math.random()-0.48)*price*0.025;
      const close = Math.max(open*0.97, open+move);
      const high  = Math.max(open,close)*(1+Math.random()*0.01);
      const low   = Math.min(open,close)*(1-Math.random()*0.01);
      candles.push({ open, close, high, low });
      price = close;
    }
    return candles;
  };

  const [candles, setCandles] = useState(() => makeCandles(basePrice));
  const [lastPrice, setLastPrice] = useState(basePrice);

  // Tick every 1.5s — add a new candle, drop the oldest
  useEffect(() => {
    const id = setInterval(() => {
      setCandles(prev => {
        const last  = prev[prev.length-1];
        const open  = last.close;
        const move  = (Math.random()-0.48)*open*0.018;
        const close = Math.max(open*0.98, open+move);
        const high  = Math.max(open,close)*(1+Math.random()*0.008);
        const low   = Math.min(open,close)*(1-Math.random()*0.008);
        setLastPrice(close);
        return [...prev.slice(1), { open, close, high, low }];
      });
    }, 1500);
    return () => clearInterval(id);
  }, [symbol]);

  const allP   = candles.flatMap(c=>[c.high,c.low]);
  const minP   = Math.min(...allP);
  const maxP   = Math.max(...allP);
  const range  = maxP - minP || 1;
  const W=560, H=200, pad=12;
  const toY    = p => pad + ((maxP-p)/range)*(H-2*pad);
  const cw=9, gap=5;

  return (
    <div>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:8}}>
        <div style={{fontSize:11,color:"rgba(255,255,255,0.35)",letterSpacing:"0.05em"}}>LIVE SIMULATED · UPDATES EVERY 1.5s</div>
        <div style={{fontWeight:800,fontSize:18,color: candles[candles.length-1].close >= candles[candles.length-2]?.close ? "#22c55e":"#ef4444"}}>
          ${lastPrice.toLocaleString(undefined,{minimumFractionDigits:2,maximumFractionDigits:2})}
        </div>
      </div>
      <svg width="100%" viewBox={`0 0 ${W} ${H}`} style={{overflow:"visible",display:"block"}}>
        {/* Grid */}
        {[0,0.25,0.5,0.75,1].map(t=>(
          <g key={t}>
            <line x1={0} y1={pad+(1-t)*(H-2*pad)} x2={W} y2={pad+(1-t)*(H-2*pad)} stroke="rgba(255,255,255,0.04)" strokeWidth="1"/>
            <text x={W-2} y={pad+(1-t)*(H-2*pad)-2} fill="rgba(255,255,255,0.2)" fontSize="8" textAnchor="end">
              ${(minP+t*range).toLocaleString(undefined,{minimumFractionDigits:0,maximumFractionDigits:0})}
            </text>
          </g>
        ))}
        {candles.map((c,i)=>{
          const x    = i*(cw+gap)+gap;
          const bull = c.close >= c.open;
          const color= bull ? "#22c55e" : "#ef4444";
          const top  = toY(Math.max(c.open,c.close));
          const bot  = toY(Math.min(c.open,c.close));
          const h    = Math.max(1, bot-top);
          return (
            <g key={i}>
              <line x1={x+cw/2} y1={toY(c.high)} x2={x+cw/2} y2={toY(c.low)} stroke={color} strokeWidth="1"/>
              <rect x={x} y={top} width={cw} height={h} fill={color} rx="1" opacity={i===candles.length-1?1:0.85}/>
            </g>
          );
        })}
      </svg>
    </div>
  );
}

// ─── PROGRESS BAR ────────────────────────────────────────────────────────────
function ProgressBar({ value, max=100, color="#7c3aed", height=6 }) {
  return (
    <div style={{background:"rgba(255,255,255,0.08)",borderRadius:99,height,overflow:"hidden"}}>
      <div style={{width:`${(value/max)*100}%`,height:"100%",background:color,borderRadius:99,transition:"width 0.8s ease"}}/>
    </div>
  );
}

// ─── DISCLAIMER ──────────────────────────────────────────────────────────────
function Disclaimer() {
  return (
    <div style={{background:"rgba(234,179,8,0.1)",border:"1px solid rgba(234,179,8,0.3)",borderRadius:10,padding:"10px 16px",fontSize:12,color:"#fbbf24",marginBottom:16,display:"flex",gap:8,alignItems:"center"}}>
      <span>⚠️</span>
      <span><strong>Educational Use Only:</strong> All data, trades, prices, and charts are simulated/fake. This app does not provide financial advice and no real money is involved.</span>
    </div>
  );
}

// ─── VALIDATED INPUT FIELD ───────────────────────────────────────────────────
// Extracted as a proper standalone component so React never remounts it.
// This is the core fix for the cursor-jump bug.
function ValidatedField({ label, id, type="text", placeholder, value, onChange, error, touched, autoComplete }) {
  const hasError = touched && error;
  const isValid  = touched && !error && value.length > 0;
  return (
    <div style={{marginBottom:16}}>
      <label htmlFor={id} style={{display:"block",marginBottom:6,fontSize:13,color:"rgba(255,255,255,0.5)"}}>
        {label}
      </label>
      <input
        id={id}
        name={id}
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        autoComplete={autoComplete || "off"}
        spellCheck="false"
        autoCorrect="off"
        autoCapitalize={type==="email"?"none":"sentences"}
        style={{
          display:"block",
          width:"100%",
          boxSizing:"border-box",
          background:"rgba(255,255,255,0.06)",
          border:`1.5px solid ${hasError?"#ef4444":isValid?"#22c55e":"rgba(255,255,255,0.12)"}`,
          borderRadius:10,
          padding:"12px 14px",
          color:"#fff",
          fontSize:15,
          outline:"none",
          transition:"border-color 0.2s",
          WebkitAppearance:"none",
          MozAppearance:"none",
          appearance:"none",
        }}
      />
      {hasError && (
        <div style={{marginTop:5,fontSize:12,color:"#f87171",display:"flex",alignItems:"center",gap:5}}>
          <span>⚠</span> {error}
        </div>
      )}
      {isValid && (
        <div style={{marginTop:5,fontSize:12,color:"#4ade80",display:"flex",alignItems:"center",gap:5}}>
          <span>✓</span> Looks good!
        </div>
      )}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// AUTH PAGE — top-level component so React never remounts inputs on re-render
// ─────────────────────────────────────────────────────────────────────────────
function AuthPage({ authMode, setAuthMode, onSuccess, onDemo, onBack }) {
  // Load remembered credentials on first render
  const rememberedEmail    = (() => { try { return localStorage.getItem("daye_remembered_email")    || ""; } catch(e) { return ""; } })();
  const rememberedPassword = (() => { try { return localStorage.getItem("daye_remembered_password") || ""; } catch(e) { return ""; } })();
  const wasRemembered      = (() => { try { return localStorage.getItem("daye_remember_me") === "true"; } catch(e) { return false; } })();

  const [fields, setFields]               = useState({ firstName:"", lastName:"", email: wasRemembered ? rememberedEmail : "", password: wasRemembered ? rememberedPassword : "" });
  const [touched, setTouched]             = useState({ firstName:false, lastName:false, email: wasRemembered, password: wasRemembered });
  const [submitAttempted, setSubmitAttempted] = useState(false);
  const [rememberMe, setRememberMe]       = useState(wasRemembered);
  const [showPassword, setShowPassword]   = useState(false);

  const switchMode = (m) => {
    setAuthMode(m);
    setFields({ firstName:"", lastName:"", email: rememberMe ? rememberedEmail : "", password:"" });
    setTouched({ firstName:false, lastName:false, email:false, password:false });
    setSubmitAttempted(false);
  };

  const errors = {
    firstName: authMode==="signup" ? VALIDATORS.fullName(fields.firstName) : "",
    lastName:  authMode==="signup" ? VALIDATORS.fullName(fields.lastName)  : "",
    email:     VALIDATORS.email(fields.email),
    password:  VALIDATORS.password(fields.password),
  };

  const handleChange = (field) => (e) => {
    setFields(prev => ({ ...prev, [field]: e.target.value }));
    setTouched(prev => ({ ...prev, [field]: true }));
  };

  const handleSubmit = () => {
    setTouched({ firstName:true, lastName:true, email:true, password:true });
    setSubmitAttempted(true);
    const hasErrors = errors.email || errors.password ||
      (authMode==="signup" && (errors.firstName || errors.lastName));
    if (!hasErrors) {
      let displayName, displayEmail;
      if (authMode === "signup") {
        const first = fields.firstName.trim();
        const last  = fields.lastName.trim();
        displayName  = last ? `${first} ${last}` : first;
        displayEmail = fields.email.trim();
        onSuccess({ name: displayName, firstName: first, lastName: last, email: displayEmail });
        return; // signup handled, exit early
      } else {
        displayEmail = fields.email.trim();
        // Try to restore the saved name from a previous signup/login
        const savedName = (() => { try { return localStorage.getItem("daye_remembered_name") || ""; } catch(e) { return ""; } })();
        if (savedName) {
          displayName = savedName;
        } else {
          const raw = displayEmail.split("@")[0];
          displayName = raw
            .replace(/[._\-0-9]/g, " ")
            .trim()
            .replace(/\s+/g, " ")
            .replace(/\b\w/g, c => c.toUpperCase()) || "Trader";
        }
      }

      // Handle Remember Me — save email, password, and name
      try {
        if (rememberMe) {
          localStorage.setItem("daye_remembered_email",    fields.email.trim());
          localStorage.setItem("daye_remembered_password", fields.password);
          localStorage.setItem("daye_remembered_name",     displayName);
          localStorage.setItem("daye_remember_me",         "true");
        } else {
          localStorage.removeItem("daye_remembered_email");
          localStorage.removeItem("daye_remembered_password");
          localStorage.removeItem("daye_remembered_name");
          localStorage.removeItem("daye_remember_me");
        }
      } catch(e) {}

      onSuccess({ name: displayName, email: displayEmail });
    }
  };

  const S = {
    page:   { minHeight:"100vh", display:"flex", alignItems:"center", justifyContent:"center", padding:"24px 16px", position:"relative", background:"#080810" },
    glow:   { position:"absolute", top:"20%", left:"50%", transform:"translateX(-50%)", width:"min(500px,90vw)", height:"min(500px,90vw)", background:"radial-gradient(circle, rgba(124,58,237,0.12) 0%, transparent 70%)", pointerEvents:"none", zIndex:0 },
    wrap:   { width:"100%", maxWidth:440, position:"relative", zIndex:1 },
    card:   { background:"rgba(255,255,255,0.03)", border:"1px solid rgba(124,58,237,0.2)", borderRadius:16, padding:"clamp(20px,5vw,32px)", backdropFilter:"blur(8px)", WebkitBackdropFilter:"blur(8px)" },
    toggle: { display:"flex", background:"rgba(255,255,255,0.05)", borderRadius:10, marginBottom:24, padding:4 },
    tab:    (a) => ({ flex:1, textAlign:"center", padding:"9px 0", borderRadius:8, cursor:"pointer", fontWeight:600, fontSize:14, background:a?"rgba(124,58,237,0.3)":"transparent", color:a?"#c4b5fd":"rgba(255,255,255,0.4)", transition:"all 0.2s", userSelect:"none" }),
    row:    { display:"grid", gridTemplateColumns:"1fr 1fr", gap:12 },
    btn:    { background:"linear-gradient(135deg,#7c3aed,#5b21b6)", color:"#fff", border:"none", borderRadius:10, padding:"14px", fontWeight:600, cursor:"pointer", fontSize:15, width:"100%", transition:"all 0.2s", letterSpacing:"0.02em", WebkitAppearance:"none", touchAction:"manipulation" },
    btnSec: { background:"rgba(124,58,237,0.12)", color:"#c4b5fd", border:"1px solid rgba(124,58,237,0.3)", borderRadius:10, padding:"12px", fontWeight:600, cursor:"pointer", fontSize:14, width:"100%", marginBottom:10, display:"flex", alignItems:"center", justifyContent:"center", gap:8, transition:"all 0.2s", WebkitAppearance:"none", touchAction:"manipulation" },
    divider:{ display:"flex", alignItems:"center", gap:12, margin:"18px 0" },
    line:   { flex:1, height:1, background:"rgba(255,255,255,0.08)" },
    skip:   { display:"block", textAlign:"center", marginTop:16, fontSize:13, color:"rgba(255,255,255,0.35)", cursor:"pointer", textDecoration:"underline", background:"none", border:"none", width:"100%", padding:8, touchAction:"manipulation" },
  };

  return (
    <div style={S.page}>
      <div style={S.glow}/>
      <div style={S.wrap}>

        {/* Logo */}
        <div style={{textAlign:"center",marginBottom:32}}>
          <div onClick={onBack} style={{fontWeight:800,fontSize:28,letterSpacing:"-0.03em",cursor:"pointer",marginBottom:8}}>
            <span style={{color:"#a78bfa"}}>DAYE</span>{" "}<span style={{color:"#fff"}}>Trading</span>
          </div>
          <p style={{color:"rgba(255,255,255,0.45)",fontSize:14,margin:0}}>
            {authMode==="login" ? "Welcome back, trader." : "Create your free account."}
          </p>
        </div>

        <div style={S.card}>
          {/* Toggle */}
          <div style={S.toggle}>
            <div style={S.tab(authMode==="login")}  onClick={()=>switchMode("login")}>Log In</div>
            <div style={S.tab(authMode==="signup")} onClick={()=>switchMode("signup")}>Sign Up</div>
          </div>

          {/* First + Last Name (signup only) */}
          {authMode==="signup" && (
            <div style={S.row}>
              <ValidatedField
                id="firstName" label="First Name" type="text"
                placeholder="Jordan"
                value={fields.firstName}
                onChange={handleChange("firstName")}
                error={errors.firstName}
                touched={touched.firstName || submitAttempted}
                autoComplete="given-name"
              />
              <ValidatedField
                id="lastName" label="Last Name" type="text"
                placeholder="Smith"
                value={fields.lastName}
                onChange={handleChange("lastName")}
                error={errors.lastName}
                touched={touched.lastName || submitAttempted}
                autoComplete="family-name"
              />
            </div>
          )}

          {/* Email */}
          <ValidatedField
            id="email" label="Email Address" type="email"
            placeholder="you@email.com"
            value={fields.email}
            onChange={handleChange("email")}
            error={errors.email}
            touched={touched.email || submitAttempted}
            autoComplete="email"
          />

          {/* Password with show/hide toggle */}
          <div style={{marginBottom:16}}>
            <label htmlFor="password" style={{display:"block",marginBottom:6,fontSize:13,color:"rgba(255,255,255,0.5)"}}>Password</label>
            <div style={{position:"relative"}}>
              <input
                id="password"
                name="password"
                type={showPassword ? "text" : "password"}
                placeholder="••••••••"
                value={fields.password}
                onChange={handleChange("password")}
                autoComplete={authMode==="login"?"current-password":"new-password"}
                spellCheck="false"
                style={{
                  display:"block", width:"100%", boxSizing:"border-box",
                  background:"rgba(255,255,255,0.06)",
                  border:`1.5px solid ${touched.password&&errors.password?"#ef4444":touched.password&&!errors.password&&fields.password?"#22c55e":"rgba(255,255,255,0.12)"}`,
                  borderRadius:10, padding:"12px 44px 12px 14px",
                  color:"#fff", fontSize:15, outline:"none",
                  WebkitAppearance:"none", MozAppearance:"none",
                }}
              />
              <button
                type="button"
                onClick={()=>setShowPassword(p=>!p)}
                style={{position:"absolute",right:12,top:"50%",transform:"translateY(-50%)",background:"none",border:"none",cursor:"pointer",color:"rgba(255,255,255,0.4)",fontSize:16,padding:4,lineHeight:1}}
              >
                {showPassword ? "🙈" : "👁️"}
              </button>
            </div>
            {touched.password && errors.password && (
              <div style={{marginTop:5,fontSize:12,color:"#f87171",display:"flex",alignItems:"center",gap:5}}>
                <span>⚠</span> {errors.password}
              </div>
            )}
            {touched.password && !errors.password && fields.password && (
              <div style={{marginTop:5,fontSize:12,color:"#4ade80",display:"flex",alignItems:"center",gap:5}}>
                <span>✓</span> Looks good!
              </div>
            )}
          </div>

          {/* Remember Me + Forgot Password row (login only) */}
          {authMode==="login" && (
            <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:16,flexWrap:"wrap",gap:8}}>
              <label style={{display:"flex",alignItems:"center",gap:8,cursor:"pointer",userSelect:"none"}}>
                {/* Custom checkbox */}
                <div
                  onClick={()=>setRememberMe(p=>!p)}
                  style={{
                    width:18, height:18, borderRadius:5, border:`2px solid ${rememberMe?"#7c3aed":"rgba(255,255,255,0.25)"}`,
                    background: rememberMe?"#7c3aed":"transparent",
                    display:"flex", alignItems:"center", justifyContent:"center",
                    cursor:"pointer", transition:"all 0.2s", flexShrink:0,
                  }}
                >
                  {rememberMe && <span style={{color:"#fff",fontSize:11,fontWeight:800,lineHeight:1}}>✓</span>}
                </div>
                <span style={{fontSize:13,color:"rgba(255,255,255,0.55)"}}>Remember me</span>
              </label>
              <span style={{fontSize:13,color:"#a78bfa",cursor:"pointer",textDecoration:"underline"}}
                onClick={()=>alert("Password reset coming soon! For now, use demo mode to explore the app.")}>
                Forgot password?
              </span>
            </div>
          )}

          {/* Submit */}
          <div style={{marginTop:4}}>
            <button style={S.btn} onClick={handleSubmit}>
              {authMode==="login" ? "Log In →" : "Create Account →"}
            </button>
          </div>

          {/* Social */}
          <div style={S.divider}>
            <div style={S.line}/><span style={{color:"rgba(255,255,255,0.35)",fontSize:13}}>or</span><div style={S.line}/>
          </div>
          <button style={S.btnSec} onClick={()=>onSuccess({ name:"Google User", email:"google@user.com", social:"Google" })}>🔵 Continue with Google</button>
          <button style={S.btnSec} onClick={()=>onSuccess({ name:"Apple User",  email:"apple@user.com",  social:"Apple"  })}>⚫ Continue with Apple</button>

          <p style={{color:"rgba(255,255,255,0.3)",textAlign:"center",marginTop:16,fontSize:12,lineHeight:1.6}}>
            By continuing you agree to our Terms of Service. This platform uses simulated data only.
          </p>
        </div>

        <button style={S.skip} onClick={onDemo}>Skip for now (demo mode)</button>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// MAIN APP
// ─────────────────────────────────────────────────────────────────────────────
export default function DayeTrading() {
  const [page, setPage]               = useState("landing");
  const [authMode, setAuthMode]       = useState("login");
  const [currentUser, setCurrentUser] = useState({ name:"Trader", email:"", social:"" });
  const [selectedLesson, setSelectedLesson] = useState(null);
  const [selectedQuiz, setSelectedQuiz]     = useState(null);
  const [quizState, setQuizState]           = useState({ started:false, current:0, answers:[], done:false });
  const [lessons, setLessons]               = useState(JSON.parse(JSON.stringify(LESSONS_INITIAL)));
  const [quizScores, setQuizScores]         = useState([]); // { title, score, total, pct }
  const [quizLeaveWarning, setQuizLeaveWarning] = useState(false);
  const [profilePic, setProfilePic]         = useState(null);
  const [editingName, setEditingName]       = useState(false);
  const [editName, setEditName]             = useState({ first:"", last:"" });
  const [tradeHistory, setTradeHistory]     = useState([]);
  const [tradeAsset, setTradeAsset]         = useState(ASSETS[0]);
  const [tradeQty, setTradeQty]             = useState("1");
  const [tradeType, setTradeType]           = useState("Market");
  const [tradeSide, setTradeSide]           = useState("BUY");
  const [tradeMsg, setTradeMsg]             = useState("");
  const [journal, setJournal]               = useState([]);
  const [showJournalForm, setShowJournalForm] = useState(false);
  const [newEntry, setNewEntry]             = useState({ asset:"AAPL", side:"BUY", entry:"", exit:"", notes:"", emotion:"Neutral", lesson:"" });
  const [mobile, setMobile]                 = useState(false);

  useEffect(() => {
    const check = () => setMobile(window.innerWidth < 768);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  const nav = useCallback((p) => { setPage(p); window.scrollTo(0,0); }, []);

  const markLessonDone = (lessonId) => {
    setLessons(prev => {
      const updated = JSON.parse(JSON.stringify(prev));
      for (const level of ["beginner","intermediate","advanced"]) {
        const idx = updated[level].findIndex(l=>l.id===lessonId);
        if (idx !== -1) { updated[level][idx].done = true; break; }
      }
      return updated;
    });
    nav("lessons");
  };

  const handleTrade = () => {
    const qty = parseFloat(tradeQty||0);
    const total = qty * tradeAsset.price;
    const newTrade = {
      id: tradeHistory.length+1,
      time: new Date().toLocaleTimeString([], {hour:"2-digit",minute:"2-digit"}),
      symbol: tradeAsset.symbol,
      type: tradeSide,
      qty,
      price: tradeAsset.price,
      total,
    };
    setTradeHistory(prev => [newTrade, ...prev]);
    setTradeMsg(`✅ ${tradeSide} ${tradeQty} ${tradeAsset.symbol} @ $${tradeAsset.price.toLocaleString()} — Simulated`);
    setTimeout(() => setTradeMsg(""), 3000);
  };

  const startQuiz  = (quiz) => { setSelectedQuiz(quiz); setQuizState({ started:true, current:0, answers:[], done:false }); };
  const answerQuiz = (idx) => {
    const ans = [...quizState.answers, idx];
    if (quizState.current + 1 >= selectedQuiz.questions.length) {
      const score = ans.filter((a,i) => a===selectedQuiz.questions[i].ans).length;
      const total = selectedQuiz.questions.length;
      const pct   = Math.round((score/total)*100);
      setQuizScores(prev => [...prev.filter(q=>q.title!==selectedQuiz.title), { title:selectedQuiz.title, score, total, pct }]);
      setQuizState({ ...quizState, answers:ans, done:true });
    } else {
      setQuizState({ ...quizState, current:quizState.current+1, answers:ans });
    }
  };
  const quizScore = () => quizState.answers.filter((a,i) => a===selectedQuiz.questions[i].ans).length;

  const addJournal = () => {
    const e=parseFloat(newEntry.entry), x=parseFloat(newEntry.exit);
    const pl=newEntry.side==="BUY"?x-e:e-x;
    setJournal([{ id:journal.length+1, date:new Date().toISOString().slice(0,10), asset:newEntry.asset, side:newEntry.side, entry:e, exit:x, pl, notes:newEntry.notes, emotion:newEntry.emotion, lesson:newEntry.lesson }, ...journal]);
    setShowJournalForm(false);
    setNewEntry({ asset:"AAPL", side:"BUY", entry:"", exit:"", notes:"", emotion:"Neutral", lesson:"" });
  };

  // ── SHARED STYLES ───────────────────────────────────────────────────────────
  const S = {
    app:        { minHeight:"100vh", background:"#080810", color:"#f0f0f8", fontFamily:"'DM Sans','Segoe UI',system-ui,sans-serif", overflowX:"hidden" },
    sidebar:    { width:220, background:"rgba(12,10,26,0.97)", borderRight:"1px solid rgba(124,58,237,0.15)", height:"100vh", position:"fixed", top:0, left:0, display:"flex", flexDirection:"column", padding:"24px 0", zIndex:100 },
    logo:       { padding:"0 24px 28px", borderBottom:"1px solid rgba(124,58,237,0.15)", marginBottom:16 },
    navItem:    (a) => ({ display:"flex", alignItems:"center", gap:12, padding:"12px 24px", cursor:"pointer", color:a?"#c4b5fd":"rgba(255,255,255,0.5)", background:a?"rgba(124,58,237,0.12)":"transparent", borderLeft:a?"3px solid #7c3aed":"3px solid transparent", fontSize:14, fontWeight:500, transition:"all 0.2s", userSelect:"none" }),
    botNav:     { position:"fixed", bottom:0, left:0, right:0, background:"rgba(12,10,26,0.97)", borderTop:"1px solid rgba(124,58,237,0.2)", display:"flex", zIndex:100 },
    botItem:    (a) => ({ flex:1, display:"flex", flexDirection:"column", alignItems:"center", padding:"10px 4px 8px", cursor:"pointer", color:a?"#a78bfa":"rgba(255,255,255,0.4)", fontSize:10, gap:3, userSelect:"none", touchAction:"manipulation" }),
    content:    (m) => ({ marginLeft:m?0:220, padding:m?"16px 16px 80px":"32px 40px", maxWidth:"100%", minHeight:"100vh" }),
    card:       { background:"rgba(255,255,255,0.03)", border:"1px solid rgba(255,255,255,0.07)", borderRadius:16, padding:20, backdropFilter:"blur(8px)", WebkitBackdropFilter:"blur(8px)" },
    cardPurple: { background:"rgba(124,58,237,0.1)", border:"1px solid rgba(124,58,237,0.25)", borderRadius:16, padding:20 },
    btnPrimary: { background:"linear-gradient(135deg,#7c3aed,#5b21b6)", color:"#fff", border:"none", borderRadius:10, padding:"12px 24px", fontWeight:600, cursor:"pointer", fontSize:14, transition:"all 0.2s", letterSpacing:"0.02em", WebkitAppearance:"none", touchAction:"manipulation" },
    btnSec:     { background:"rgba(124,58,237,0.15)", color:"#c4b5fd", border:"1px solid rgba(124,58,237,0.3)", borderRadius:10, padding:"12px 24px", fontWeight:600, cursor:"pointer", fontSize:14, transition:"all 0.2s", WebkitAppearance:"none", touchAction:"manipulation" },
    btnGreen:   { background:"rgba(34,197,94,0.15)", color:"#22c55e", border:"1px solid rgba(34,197,94,0.3)", borderRadius:10, padding:"10px 20px", fontWeight:600, cursor:"pointer", fontSize:14, WebkitAppearance:"none", touchAction:"manipulation" },
    btnRed:     { background:"rgba(239,68,68,0.15)", color:"#ef4444", border:"1px solid rgba(239,68,68,0.3)", borderRadius:10, padding:"10px 20px", fontWeight:600, cursor:"pointer", fontSize:14, WebkitAppearance:"none", touchAction:"manipulation" },
    h1:         { fontSize:"clamp(28px,5vw,48px)", fontWeight:800, letterSpacing:"-0.03em", lineHeight:1.1 },
    h2:         { fontSize:"clamp(20px,3vw,28px)", fontWeight:700, letterSpacing:"-0.02em", margin:0 },
    h3:         { fontSize:18, fontWeight:700, margin:0 },
    muted:      { color:"rgba(255,255,255,0.45)", fontSize:13 },
    table:      { width:"100%", borderCollapse:"collapse", fontSize:13 },
    th:         { textAlign:"left", padding:"10px 12px", borderBottom:"1px solid rgba(255,255,255,0.07)", color:"rgba(255,255,255,0.4)", fontWeight:500, fontSize:12 },
    td:         { padding:"12px 12px", borderBottom:"1px solid rgba(255,255,255,0.05)", color:"rgba(255,255,255,0.85)" },
    input:      { display:"block", width:"100%", boxSizing:"border-box", background:"rgba(255,255,255,0.06)", border:"1px solid rgba(255,255,255,0.12)", borderRadius:10, padding:"12px 14px", color:"#fff", fontSize:14, outline:"none", WebkitAppearance:"none", MozAppearance:"none" },
    select:     { background:"rgba(255,255,255,0.06)", border:"1px solid rgba(255,255,255,0.12)", borderRadius:10, padding:"10px 14px", color:"#fff", fontSize:13, outline:"none", WebkitAppearance:"none", MozAppearance:"none" },
  };

  // ── LANDING ─────────────────────────────────────────────────────────────────
  const PageLanding = () => (
    <div style={{overflowX:"hidden"}}>
      <nav style={{display:"flex",alignItems:"center",justifyContent:"space-between",padding:"20px clamp(16px,5vw,40px)",borderBottom:"1px solid rgba(255,255,255,0.05)",background:"rgba(8,8,16,0.95)",position:"sticky",top:0,zIndex:50,backdropFilter:"blur(12px)",WebkitBackdropFilter:"blur(12px)",flexWrap:"wrap",gap:12}}>
        <div style={{fontWeight:800,fontSize:22,letterSpacing:"-0.03em"}}>
          <span style={{color:"#a78bfa"}}>DAYE</span> Trading
        </div>
        <div style={{display:"flex",gap:10,flexWrap:"wrap"}}>
          <button style={{...S.btnSec,padding:"9px 18px",fontSize:13}} onClick={()=>{setAuthMode("login");nav("auth");}}>Log In</button>
          <button style={{...S.btnPrimary,padding:"9px 18px",fontSize:13}} onClick={()=>{setAuthMode("signup");nav("auth");}}>Get Started</button>
        </div>
      </nav>

      <div style={{position:"relative",padding:"clamp(60px,10vw,120px) clamp(16px,5vw,40px)",textAlign:"center",overflow:"hidden"}}>
        <div style={{position:"absolute",top:"50%",left:"50%",transform:"translate(-50%,-50%)",width:"min(600px,100vw)",height:"min(600px,100vw)",background:"radial-gradient(circle,rgba(124,58,237,0.15) 0%,transparent 70%)",pointerEvents:"none"}}/>
        <div style={{display:"inline-block",background:"rgba(124,58,237,0.15)",border:"1px solid rgba(124,58,237,0.3)",borderRadius:99,padding:"6px 16px",fontSize:12,color:"#a78bfa",fontWeight:600,marginBottom:24,letterSpacing:"0.05em"}}>
          EDUCATIONAL TRADING PLATFORM · SIMULATED DATA ONLY
        </div>
        <h1 style={{...S.h1,marginBottom:8,background:"linear-gradient(135deg,#fff 40%,#a78bfa)",WebkitBackgroundClip:"text",WebkitTextFillColor:"transparent"}}>
          <span style={{color:"#a78bfa",WebkitTextFillColor:"#a78bfa"}}>DAYE</span> Trading
        </h1>
        <p style={{fontSize:"clamp(16px,3vw,24px)",color:"rgba(255,255,255,0.6)",marginBottom:36,fontStyle:"italic",fontWeight:300}}>"Learn. Practice. Trade Smarter."</p>
        <p style={{maxWidth:560,margin:"0 auto 44px",color:"rgba(255,255,255,0.55)",lineHeight:1.8,fontSize:16}}>
          A free educational platform that teaches you how to trade stocks, crypto, and forex — using simulated markets with zero real money at risk.
        </p>
        <div style={{display:"flex",gap:16,justifyContent:"center",flexWrap:"wrap"}}>
          <button style={{...S.btnPrimary,padding:"15px 32px",fontSize:16,borderRadius:12}} onClick={()=>{setAuthMode("signup");nav("auth");}}>🎓 Start Learning</button>
          <button style={{...S.btnSec,padding:"15px 32px",fontSize:16,borderRadius:12}} onClick={()=>{setCurrentUser({name:"Demo User",email:"",social:"Demo"});nav("simulator");}}>📈 Try Demo Trading</button>
        </div>
        <p style={{marginTop:20,fontSize:12,color:"rgba(255,255,255,0.25)"}}>No credit card required · 100% free · Simulated data only</p>
      </div>

      <div style={{padding:"60px clamp(16px,5vw,40px)",maxWidth:1100,margin:"0 auto"}}>
        <h2 style={{...S.h2,textAlign:"center",marginBottom:44}}>Everything you need to <span style={{color:"#a78bfa"}}>learn trading</span></h2>
        <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(180px,1fr))",gap:18}}>
          {[
            {icon:"📚",title:"Guided Lessons",  desc:"From zero to advanced — structured lessons that actually make sense."},
            {icon:"📊",title:"Simulated Trading",desc:"Practice with fake money and real-time-style market data."},
            {icon:"🗺️",title:"Market Maps",     desc:"Visual heatmaps showing sector performance at a glance."},
            {icon:"🧠",title:"Quizzes",          desc:"Test your knowledge after every module with instant feedback."},
            {icon:"📈",title:"Progress Tracking",desc:"See your learning journey and celebrate milestones."},
            {icon:"📓",title:"Trading Journal",  desc:"Log your simulated trades and build reflection habits."},
          ].map(f=>(
            <div key={f.title} style={{...S.card,textAlign:"center"}}>
              <div style={{fontSize:34,marginBottom:12}}>{f.icon}</div>
              <div style={{fontWeight:700,marginBottom:8}}>{f.title}</div>
              <div style={{...S.muted,lineHeight:1.6,fontSize:13}}>{f.desc}</div>
            </div>
          ))}
        </div>
      </div>

      <div style={{maxWidth:800,margin:"0 auto 60px",padding:"0 clamp(16px,5vw,40px)"}}>
        <div style={{background:"rgba(234,179,8,0.08)",border:"1px solid rgba(234,179,8,0.2)",borderRadius:12,padding:"16px 24px",fontSize:13,color:"rgba(255,255,255,0.5)",textAlign:"center",lineHeight:1.8}}>
          ⚠️ <strong style={{color:"#fbbf24"}}>Disclaimer:</strong> DAYE Trading is an educational platform only. All market data, charts, prices, and portfolio numbers are simulated and fictional. This app does not provide financial advice and is not affiliated with any brokerage.
        </div>
      </div>
      <div style={{textAlign:"center",padding:"28px clamp(16px,5vw,40px)",borderTop:"1px solid rgba(255,255,255,0.05)",color:"rgba(255,255,255,0.25)",fontSize:12}}>
        © 2024 DAYE Trading · Educational Platform · All data is simulated
      </div>
    </div>
  );

  // ── DASHBOARD ────────────────────────────────────────────────────────────────
  const PageDashboard = () => (
    <div>
      <Disclaimer/>
      <div style={{marginBottom:24}}>
        <div style={{fontSize:13,color:"#a78bfa",fontWeight:600,letterSpacing:"0.05em",textTransform:"uppercase",marginBottom:6}}>Dashboard</div>
        <h1 style={{...S.h1,marginBottom:8,fontSize:"clamp(22px,4vw,36px)"}}>
          Welcome, <span style={{color:"#a78bfa"}}>{currentUser.name}</span> 👋
        </h1>
        <p style={S.muted}>Keep learning and building your trading skills!</p>
      </div>
      {(() => {
        const totalDone = lessons.beginner.filter(l=>l.done).length + lessons.intermediate.filter(l=>l.done).length + lessons.advanced.filter(l=>l.done).length;
        const totalLessons = 21;
        const avgQuiz = quizScores.length ? Math.round(quizScores.reduce((s,q)=>s+q.pct,0)/quizScores.length) : 0;
        return (
          <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(150px,1fr))",gap:14,marginBottom:22}}>
            {[
              {label:"Sim. Portfolio", value:"$12,480.32",  sub:"+$240.50 today", pos:true},
              {label:"Lessons Done",   value:`${totalDone} / ${totalLessons}`, sub:`${Math.round((totalDone/totalLessons)*100)}% complete`},
              {label:"Quiz Score",     value: quizScores.length ? `${avgQuiz}%` : "—", sub: quizScores.length ? `Last: ${quizScores[quizScores.length-1].title}` : "No quizzes taken yet"},
              {label:"Streak",         value:"4 days 🔥",   sub:"Best: 7 days"},
            ].map(s=>(
              <div key={s.label} style={S.card}>
                <div style={{...S.muted,fontSize:11,marginBottom:6,textTransform:"uppercase",letterSpacing:"0.05em"}}>{s.label}</div>
                <div style={{fontWeight:800,fontSize:20,marginBottom:4}}>{s.value}</div>
                <div style={{fontSize:12,color:s.pos?"#22c55e":"rgba(255,255,255,0.35)"}}>{s.sub}</div>
              </div>
            ))}
          </div>
        );
      })()}
      <div style={{display:"grid",gridTemplateColumns:mobile?"1fr":"1fr 1fr",gap:18,marginBottom:18}}>
        <div style={S.card}>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:18}}>
            <h3 style={S.h3}>Learning Progress</h3>
            <button style={{...S.btnSec,padding:"6px 12px",fontSize:12}} onClick={()=>nav("lessons")}>View All</button>
          </div>
          {[{l:"Beginner",v:lessons.beginner.filter(x=>x.done).length,m:7},{l:"Intermediate",v:lessons.intermediate.filter(x=>x.done).length,m:7},{l:"Advanced",v:lessons.advanced.filter(x=>x.done).length,m:7}].map(p=>(
            <div key={p.l} style={{marginBottom:14}}>
              <div style={{display:"flex",justifyContent:"space-between",marginBottom:5}}>
                <span style={{fontSize:13,fontWeight:600}}>{p.l} Track</span>
                <span style={{...S.muted,fontSize:12}}>{p.v}/{p.m}</span>
              </div>
              <ProgressBar value={p.v} max={p.m} color="#7c3aed"/>
            </div>
          ))}
          <div style={{marginTop:18,...S.cardPurple}}>
            <div style={{fontSize:11,color:"#a78bfa",fontWeight:600,marginBottom:4}}>▶ CONTINUE WHERE YOU LEFT OFF</div>
            {(() => {
              const next = lessons.beginner.find(l=>!l.done) || lessons.intermediate.find(l=>!l.done) || lessons.advanced.find(l=>!l.done);
              if (!next) return <div style={{color:"#22c55e",fontWeight:700}}>🎉 All lessons complete!</div>;
              return (<>
                <div style={{fontWeight:700,marginBottom:4}}>{next.title}</div>
                <div style={{...S.muted,fontSize:12,marginBottom:12}}>⏱ {next.time}</div>
                <button style={{...S.btnPrimary,padding:"8px 18px",fontSize:13}} onClick={()=>{setSelectedLesson(next);nav("lesson-detail");}}>Start →</button>
              </>);
            })()}
          </div>
        </div>
        <div style={S.card}>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:18}}>
            <h3 style={S.h3}>Market Overview</h3>
            <span style={{fontSize:11,color:"rgba(255,255,255,0.3)",background:"rgba(255,255,255,0.05)",padding:"3px 8px",borderRadius:99}}>SIMULATED</span>
          </div>
          {ASSETS.map(a=>(
            <div key={a.symbol} style={{display:"flex",alignItems:"center",justifyContent:"space-between",padding:"9px 0",borderBottom:"1px solid rgba(255,255,255,0.05)"}}>
              <div><div style={{fontWeight:700,fontSize:14}}>{a.symbol}</div><div style={{...S.muted,fontSize:11}}>{a.name}</div></div>
              <Sparkline positive={a.pct>0} width={60} height={24}/>
              <div style={{textAlign:"right"}}>
                <div style={{fontWeight:700,fontSize:14}}>${a.price.toLocaleString()}</div>
                <div style={{fontSize:12,color:a.pct>0?"#22c55e":"#ef4444"}}>{a.pct>0?"+":""}{a.pct}%</div>
              </div>
            </div>
          ))}
        </div>
      </div>
      <div style={S.card}>
        <h3 style={{...S.h3,marginBottom:14}}>Quick Access</h3>
        <div style={{display:"flex",gap:10,flexWrap:"wrap"}}>
          {[{icon:"📚",label:"Lessons",page:"lessons"},{icon:"📈",label:"Practice",page:"simulator"},{icon:"🗺️",label:"Market Map",page:"market-map"},{icon:"🧠",label:"Quizzes",page:"quizzes"},{icon:"📓",label:"Journal",page:"journal"}].map(q=>(
            <button key={q.label} style={{...S.btnSec,display:"flex",flexDirection:"column",alignItems:"center",gap:5,padding:"14px 18px",minWidth:80,fontSize:12}} onClick={()=>nav(q.page)}>
              <span style={{fontSize:22}}>{q.icon}</span>{q.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );

  // ── LESSONS ──────────────────────────────────────────────────────────────────
  const PageLessons = () => (
    <div>
      <div style={{marginBottom:24}}><h1 style={{...S.h2,marginBottom:4}}>Learning Path</h1><p style={S.muted}>Complete lessons in order to build your trading foundation.</p></div>
      {[{key:"beginner",label:"🟢 Beginner",color:"#22c55e"},{key:"intermediate",label:"🟡 Intermediate",color:"#eab308"},{key:"advanced",label:"🔴 Advanced",color:"#ef4444"}].map(level=>(
        <div key={level.key} style={{marginBottom:30}}>
          <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:14}}>
            <h2 style={{fontSize:17,fontWeight:700,margin:0}}>{level.label}</h2>
            <div style={{flex:1,height:1,background:"rgba(255,255,255,0.07)"}}/>
            <span style={{...S.muted,fontSize:12}}>{lessons[level.key].filter(l=>l.done).length}/{lessons[level.key].length} complete</span>
          </div>
          <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(240px,1fr))",gap:12}}>
            {lessons[level.key].map((lesson,idx)=>{
              const prevDone = idx===0 || lessons[level.key][idx-1].done;
              const locked = level.key!=="beginner" ? !lessons["beginner"].every(l=>l.done) && level.key==="intermediate" ? true : level.key==="advanced" ? !lessons["intermediate"].every(l=>l.done) : false : false;
              const isLocked = locked || (idx>0 && !lessons[level.key][idx-1].done && level.key==="beginner");
              return (
                <div key={lesson.id} style={{...S.card,opacity:isLocked?0.45:1,borderLeft:`3px solid ${lesson.done?"#22c55e":level.color}`}}>
                  <div style={{display:"flex",justifyContent:"space-between",marginBottom:7}}>
                    <span style={{fontSize:11,color:lesson.done?"#22c55e":level.color,fontWeight:600,textTransform:"uppercase",letterSpacing:"0.04em"}}>{lesson.done?"✅ COMPLETE":level.key.toUpperCase()}</span>
                    <span style={{...S.muted,fontSize:11}}>⏱ {lesson.time}</span>
                  </div>
                  <div style={{fontWeight:700,marginBottom:12,fontSize:15}}>{lesson.title}</div>
                  <button style={{...(lesson.done?S.btnSec:S.btnPrimary),padding:"8px 16px",fontSize:12,opacity:isLocked?0.5:1}} disabled={isLocked} onClick={()=>{setSelectedLesson(lesson);nav("lesson-detail");}}>
                    {isLocked?"🔒 Locked":lesson.done?"Review →":"Start →"}
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );

  // ── LESSON DETAIL ─────────────────────────────────────────────────────────
  const PageLessonDetail = () => {
    if (!selectedLesson) return <div style={{padding:40}}>Select a lesson first.</div>;
    return (
      <div style={{maxWidth:760,margin:"0 auto"}}>
        <button style={{...S.btnSec,padding:"8px 16px",fontSize:12,marginBottom:22}} onClick={()=>nav("lessons")}>← Back to Lessons</button>
        <div style={{...S.cardPurple,marginBottom:18}}>
          <div style={{fontSize:11,color:"#a78bfa",fontWeight:600,marginBottom:4,textTransform:"uppercase",letterSpacing:"0.05em"}}>Now Learning</div>
          <h1 style={{...S.h2,marginBottom:4}}>{selectedLesson.title}</h1>
          <p style={S.muted}>⏱ {selectedLesson.time} · Beginner Level</p>
        </div>
        <div style={{background:"rgba(0,0,0,0.4)",border:"2px dashed rgba(124,58,237,0.3)",borderRadius:16,height:200,display:"flex",alignItems:"center",justifyContent:"center",marginBottom:22,flexDirection:"column",gap:8}}>
          <div style={{fontSize:44}}>▶️</div>
          <div style={{color:"rgba(255,255,255,0.4)",fontSize:14}}>Video Lesson — Coming Soon</div>
        </div>
        <div style={{...S.card,marginBottom:18}}>
          <h3 style={{...S.h3,marginBottom:14,color:"#a78bfa"}}>📖 Lesson Content</h3>
          <p style={{lineHeight:1.9,color:"rgba(255,255,255,0.75)",fontSize:14}}>Welcome to <strong>{selectedLesson.title}</strong>. In this lesson you'll build a foundational understanding that every successful trader relies on.</p>
          <p style={{lineHeight:1.9,color:"rgba(255,255,255,0.75)",fontSize:14,marginTop:12}}>Trading is the act of buying and selling financial assets — including stocks, cryptocurrency, forex, ETFs, and more — with the goal of generating a profit. Before chasing profits, understanding the mechanics, risks, and psychology is essential.</p>
        </div>
        <div style={{...S.card,marginBottom:18}}>
          <h3 style={{...S.h3,marginBottom:14,color:"#22c55e"}}>✅ Key Takeaways</h3>
          {["Trading involves buying/selling assets to generate profit.","Risk management is more important than chasing gains.","All financial markets carry inherent risk — education is protection.","Practice with simulated data before touching real capital.","Psychology and discipline are as important as technical skills."].map((t,i)=>(
            <div key={i} style={{display:"flex",gap:10,marginBottom:9,fontSize:14,color:"rgba(255,255,255,0.75)"}}>
              <span style={{color:"#22c55e",fontWeight:700}}>→</span><span>{t}</span>
            </div>
          ))}
        </div>
        <div style={{...S.card,marginBottom:22}}>
          <h3 style={{...S.h3,marginBottom:14,color:"#a78bfa"}}>📊 Example Chart (Simulated)</h3>
          <CandleChart symbol="AAPL"/>
          <p style={{...S.muted,fontSize:11,marginTop:8,textAlign:"center"}}>Simulated candlestick chart — for educational purposes only</p>
        </div>
        <div style={{display:"flex",gap:12,flexWrap:"wrap"}}>
          <button style={{...S.btnPrimary,padding:"12px 24px"}} onClick={()=>markLessonDone(selectedLesson.id)}>✅ Mark as Complete</button>
          <button style={{...S.btnSec,padding:"12px 24px"}} onClick={()=>nav("quizzes")}>🧠 Take Quiz</button>
        </div>
      </div>
    );
  };

  // ── SIMULATOR ────────────────────────────────────────────────────────────────
  const PageSimulator = () => {
    const TIMEFRAMES = ["1m","5m","15m","30m","1h","4h","1D"];
    const [tf, setTf]             = useState("1D");
    const [zoom, setZoom]         = useState(1);
    const [pan, setPan]           = useState(0);
    const [tool, setTool]         = useState(null); // null | "point" | "trendline" | "support" | "resistance" | "horizontal"
    const [drawings, setDrawings] = useState([]);
    const [pendingPt, setPendingPt] = useState(null); // first click for line tools
    const [tooltip, setTooltip]   = useState(null);
    const [showGuide, setShowGuide] = useState(false);
    const svgRef = useState(null);
    const [candles, setCandles]   = useState(() => buildCandles(tradeAsset.price, 80));
    const [currentPrice, setCurrentPrice] = useState(tradeAsset.price);

    // Rebuild candles when asset or timeframe changes
    useEffect(() => {
      setCandles(buildCandles(tradeAsset.price, 80));
      setCurrentPrice(tradeAsset.price);
      setDrawings([]);
      setPendingPt(null);
      setPan(0);
    }, [tradeAsset.symbol, tf]);

    // Live tick
    useEffect(() => {
      const id = setInterval(() => {
        setCandles(prev => {
          const last  = prev[prev.length-1];
          const open  = last.close;
          const move  = (Math.random()-0.47)*open*0.012;
          const close = Math.max(open*0.985, open+move);
          const high  = Math.max(open,close)*(1+Math.random()*0.006);
          const low   = Math.min(open,close)*(1-Math.random()*0.006);
          setCurrentPrice(close);
          return [...prev.slice(1), { open, close, high, low }];
        });
      }, 1800);
      return () => clearInterval(id);
    }, [tradeAsset.symbol, tf]);

    function buildCandles(base, count) {
      const arr = [];
      let p = base * 0.96;
      for (let i=0; i<count; i++) {
        const o = p;
        const m = (Math.random()-0.47)*p*0.022;
        const c = Math.max(o*0.98, o+m);
        const h = Math.max(o,c)*(1+Math.random()*0.009);
        const l = Math.min(o,c)*(1-Math.random()*0.009);
        arr.push({open:o,close:c,high:h,low:l});
        p = c;
      }
      return arr;
    }

    // Chart math
    const visCount = Math.floor(40 / zoom);
    const start    = Math.max(0, Math.min(candles.length - visCount, pan));
    const visible  = candles.slice(start, start + visCount);
    const W = 800, H = 340, padL = 60, padR = 8, padT = 16, padB = 28;
    const chartW   = W - padL - padR;
    const chartH   = H - padT - padB;
    const allP     = visible.flatMap(c=>[c.high,c.low]);
    const minP     = Math.min(...allP)*0.999;
    const maxP     = Math.max(...allP)*1.001;
    const range    = maxP - minP || 1;
    const toY      = p => padT + ((maxP-p)/range)*chartH;
    const cw       = Math.max(3, (chartW/visible.length)*0.7);
    const cs       = chartW / visible.length;
    const toX      = i => padL + i*cs + cs/2;

    // SVG coordinate from mouse event
    const svgCoords = (e) => {
      const svg = e.currentTarget;
      const rect = svg.getBoundingClientRect();
      const scaleX = W / rect.width;
      const scaleY = H / rect.height;
      return {
        x: (e.clientX - rect.left) * scaleX,
        y: (e.clientY - rect.top)  * scaleY,
      };
    };

    const handleChartClick = (e) => {
      if (!tool) return;
      const {x, y} = svgCoords(e);
      if (tool === "point") {
        setDrawings(d => [...d, { type:"point", x, y }]);
      } else if (tool === "horizontal") {
        setDrawings(d => [...d, { type:"horizontal", y }]);
      } else {
        // line tools need two clicks
        if (!pendingPt) {
          setPendingPt({x, y});
        } else {
          setDrawings(d => [...d, { type:tool, x1:pendingPt.x, y1:pendingPt.y, x2:x, y2:y }]);
          setPendingPt(null);
        }
      }
    };

    const lineColor = { trendline:"#a78bfa", support:"#22c55e", resistance:"#ef4444", horizontal:"#eab308" };
    const lineLabel = { trendline:"Trendline", support:"Support", resistance:"Resistance", horizontal:"Horizontal" };
    const priceUp   = currentPrice >= tradeAsset.price;

    const TOOLS = [
      { id:"point",      icon:"📍", label:"Point Marker",   tip:"Click to drop a marker on the chart" },
      { id:"trendline",  icon:"📐", label:"Trendline",      tip:"Click two points to draw a trendline" },
      { id:"support",    icon:"🟢", label:"Support Line",   tip:"Click two points to mark a support zone" },
      { id:"resistance", icon:"🔴", label:"Resistance Line",tip:"Click two points to mark a resistance zone" },
      { id:"horizontal", icon:"➖", label:"Horizontal Line", tip:"Click to draw a horizontal price level" },
    ];

    return (
      <div>
        {/* Disclaimer */}
        <div style={{background:"rgba(234,179,8,0.08)",border:"1px solid rgba(234,179,8,0.2)",borderRadius:10,padding:"10px 16px",fontSize:12,color:"#fbbf24",marginBottom:18,display:"flex",gap:8,alignItems:"center",flexWrap:"wrap"}}>
          ⚠️ <strong>DAYE Trading</strong> uses simulated market data for educational purposes only. This is not financial advice. Trading involves risk.
        </div>

        {/* Header row */}
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:20,flexWrap:"wrap",gap:12}}>
          <div>
            <h1 style={{...S.h2,marginBottom:4}}>Trading Simulator</h1>
            <p style={S.muted}>Practice technical analysis with live simulated charts.</p>
          </div>
          <div style={{display:"flex",gap:14,flexWrap:"wrap"}}>
            {[
              {label:"ACCOUNT BALANCE", val:"$12,480.32", color:"#fff"},
              {label:"BUYING POWER",    val:"$8,240.00",  color:"#fff"},
              {label:"TODAY'S P&L",     val:"+$116.22",   color:"#22c55e"},
            ].map(s=>(
              <div key={s.label} style={{...S.card,padding:"10px 16px",minWidth:120}}>
                <div style={{...S.muted,fontSize:10,marginBottom:3,textTransform:"uppercase"}}>{s.label}</div>
                <div style={{fontWeight:800,fontSize:16,color:s.color}}>{s.val}</div>
              </div>
            ))}
          </div>
        </div>

        <div style={{display:"grid",gridTemplateColumns:mobile?"1fr":"1fr 280px",gap:18,marginBottom:18}}>

          {/* ─ CHART PANEL ─ */}
          <div style={{...S.card,padding:0,overflow:"hidden"}}>
            {/* Asset + price bar */}
            <div style={{display:"flex",alignItems:"center",gap:14,padding:"14px 18px",borderBottom:"1px solid rgba(255,255,255,0.06)",flexWrap:"wrap",gap:10}}>
              <select style={{...S.select,fontWeight:700,fontSize:15}} value={tradeAsset.symbol} onChange={e=>setTradeAsset(ASSETS.find(a=>a.symbol===e.target.value))}>
                {ASSETS.map(a=><option key={a.symbol} value={a.symbol}>{a.symbol} — {a.name}</option>)}
              </select>
              <div>
                <span style={{fontWeight:800,fontSize:22}}>${currentPrice.toLocaleString(undefined,{minimumFractionDigits:2,maximumFractionDigits:2})}</span>
                <span style={{fontSize:13,color:priceUp?"#22c55e":"#ef4444",marginLeft:8}}>{priceUp?"▲":"▼"} {tradeAsset.pct}%</span>
              </div>
              <div style={{marginLeft:"auto",display:"flex",gap:2,flexWrap:"wrap"}}>
                {TIMEFRAMES.map(t=>(
                  <button key={t} onClick={()=>setTf(t)} style={{padding:"4px 10px",border:"none",borderRadius:6,cursor:"pointer",fontSize:12,fontWeight:600,background:tf===t?"#7c3aed":"rgba(255,255,255,0.06)",color:tf===t?"#fff":"rgba(255,255,255,0.45)",transition:"all 0.15s"}}>
                    {t}
                  </button>
                ))}
              </div>
            </div>

            {/* Toolbar */}
            <div style={{display:"flex",alignItems:"center",gap:6,padding:"8px 14px",borderBottom:"1px solid rgba(255,255,255,0.05)",flexWrap:"wrap",background:"rgba(0,0,0,0.2)"}}>
              <span style={{...S.muted,fontSize:11,marginRight:4}}>TOOLS:</span>
              {TOOLS.map(t=>(
                <button key={t.id} title={t.tip} onClick={()=>setTool(tool===t.id?null:t.id)}
                  style={{padding:"4px 10px",border:`1px solid ${tool===t.id?"#7c3aed":"rgba(255,255,255,0.1)"}`,borderRadius:6,cursor:"pointer",fontSize:12,background:tool===t.id?"rgba(124,58,237,0.3)":"transparent",color:tool===t.id?"#c4b5fd":"rgba(255,255,255,0.5)",display:"flex",alignItems:"center",gap:5}}>
                  {t.icon} <span style={{display:mobile?"none":"inline"}}>{t.label}</span>
                </button>
              ))}
              {drawings.length>0&&(
                <button onClick={()=>{setDrawings([]);setPendingPt(null);}} style={{padding:"4px 10px",border:"1px solid rgba(239,68,68,0.3)",borderRadius:6,cursor:"pointer",fontSize:12,background:"rgba(239,68,68,0.1)",color:"#f87171",marginLeft:"auto"}}>
                  🗑 Clear
                </button>
              )}
            </div>

            {/* Zoom + pan controls */}
            <div style={{display:"flex",alignItems:"center",gap:8,padding:"6px 14px",borderBottom:"1px solid rgba(255,255,255,0.04)",background:"rgba(0,0,0,0.15)"}}>
              <span style={{...S.muted,fontSize:11}}>ZOOM:</span>
              <button onClick={()=>setZoom(z=>Math.min(4,+(z+0.25).toFixed(2)))} style={{width:26,height:26,borderRadius:6,border:"1px solid rgba(255,255,255,0.12)",background:"rgba(255,255,255,0.06)",color:"#fff",cursor:"pointer",fontSize:16,display:"flex",alignItems:"center",justifyContent:"center"}}>+</button>
              <span style={{fontSize:12,color:"rgba(255,255,255,0.5)",minWidth:36,textAlign:"center"}}>{Math.round(zoom*100)}%</span>
              <button onClick={()=>setZoom(z=>Math.max(0.5,+(z-0.25).toFixed(2)))} style={{width:26,height:26,borderRadius:6,border:"1px solid rgba(255,255,255,0.12)",background:"rgba(255,255,255,0.06)",color:"#fff",cursor:"pointer",fontSize:16,display:"flex",alignItems:"center",justifyContent:"center"}}>−</button>
              <span style={{...S.muted,fontSize:11,marginLeft:12}}>PAN:</span>
              <button onClick={()=>setPan(p=>Math.max(0,p-5))} style={{width:26,height:26,borderRadius:6,border:"1px solid rgba(255,255,255,0.12)",background:"rgba(255,255,255,0.06)",color:"#fff",cursor:"pointer",fontSize:13}}>◀</button>
              <button onClick={()=>setPan(p=>Math.min(candles.length-visCount, p+5))} style={{width:26,height:26,borderRadius:6,border:"1px solid rgba(255,255,255,0.12)",background:"rgba(255,255,255,0.06)",color:"#fff",cursor:"pointer",fontSize:13}}>▶</button>
              {tool && (
                <div style={{marginLeft:"auto",fontSize:12,color:"#a78bfa",background:"rgba(124,58,237,0.1)",border:"1px solid rgba(124,58,237,0.2)",borderRadius:6,padding:"3px 10px"}}>
                  {pendingPt ? "🖱 Click second point…" : `🖱 Click to place ${TOOLS.find(t2=>t2.id===tool)?.label}`}
                </div>
              )}
            </div>

            {/* SVG Chart */}
            <div style={{background:"#0a0a14",position:"relative"}}>
              <svg
                width="100%"
                viewBox={`0 0 ${W} ${H}`}
                style={{display:"block",cursor:tool?"crosshair":"default"}}
                onClick={handleChartClick}
                onMouseMove={e=>{
                  if(!tool) {
                    const {x} = svgCoords(e);
                    const idx = Math.floor((x-padL)/cs);
                    if (idx>=0 && idx<visible.length) {
                      const c = visible[idx];
                      setTooltip({x:toX(idx),y:padT,c});
                    }
                  }
                }}
                onMouseLeave={()=>setTooltip(null)}
              >
                {/* Grid */}
                {[0,0.2,0.4,0.6,0.8,1].map(t=>{
                  const py = padT + t*chartH;
                  const price = maxP - t*range;
                  return (
                    <g key={t}>
                      <line x1={padL} y1={py} x2={W-padR} y2={py} stroke="rgba(255,255,255,0.04)" strokeWidth="1"/>
                      <text x={padL-4} y={py+4} fill="rgba(255,255,255,0.3)" fontSize="9" textAnchor="end">
                        ${price.toLocaleString(undefined,{minimumFractionDigits:0,maximumFractionDigits:0})}
                      </text>
                    </g>
                  );
                })}

                {/* Candles */}
                {visible.map((c,i)=>{
                  const x    = toX(i);
                  const bull = c.close >= c.open;
                  const col  = bull ? "#22c55e" : "#ef4444";
                  const top  = toY(Math.max(c.open,c.close));
                  const bot  = toY(Math.min(c.open,c.close));
                  const bh   = Math.max(1.5, bot-top);
                  const isLast = i === visible.length-1;
                  return (
                    <g key={i}>
                      <line x1={x} y1={toY(c.high)} x2={x} y2={toY(c.low)} stroke={col} strokeWidth="1" opacity={isLast?"1":"0.9"}/>
                      <rect x={x-cw/2} y={top} width={cw} height={bh} fill={col} rx="1" opacity={isLast?"1":"0.88"}/>
                      {isLast && <rect x={x-cw/2} y={top} width={cw} height={bh} fill={col} rx="1" opacity="0.4">
                        <animate attributeName="opacity" values="0.4;0.8;0.4" dur="1s" repeatCount="indefinite"/>
                      </rect>}
                    </g>
                  );
                })}

                {/* Current price line */}
                <line x1={padL} y1={toY(currentPrice)} x2={W-padR} y2={toY(currentPrice)} stroke="#a78bfa" strokeWidth="1" strokeDasharray="4,3" opacity="0.7"/>
                <rect x={W-padR} y={toY(currentPrice)-8} width={padR+48} height={16} fill="#7c3aed" rx="3"/>
                <text x={W-padR+4} y={toY(currentPrice)+4} fill="#fff" fontSize="9" fontWeight="bold">
                  ${currentPrice.toLocaleString(undefined,{minimumFractionDigits:2,maximumFractionDigits:2})}
                </text>

                {/* Drawings */}
                {drawings.map((d,i)=>{
                  if (d.type==="point") return (
                    <g key={i}>
                      <circle cx={d.x} cy={d.y} r="5" fill="#a78bfa" stroke="#fff" strokeWidth="1.5" opacity="0.9"/>
                      <circle cx={d.x} cy={d.y} r="9" fill="none" stroke="#a78bfa" strokeWidth="1" opacity="0.4"/>
                    </g>
                  );
                  if (d.type==="horizontal") return (
                    <g key={i}>
                      <line x1={padL} y1={d.y} x2={W-padR} y2={d.y} stroke={lineColor.horizontal} strokeWidth="1.5" strokeDasharray="6,3" opacity="0.8"/>
                      <text x={padL+4} y={d.y-4} fill={lineColor.horizontal} fontSize="9">{lineLabel.horizontal}</text>
                    </g>
                  );
                  return (
                    <g key={i}>
                      <line x1={d.x1} y1={d.y1} x2={d.x2} y2={d.y2} stroke={lineColor[d.type]||"#a78bfa"} strokeWidth="2" opacity="0.85"/>
                      <text x={(d.x1+d.x2)/2} y={(d.y1+d.y2)/2-6} fill={lineColor[d.type]||"#a78bfa"} fontSize="9">{lineLabel[d.type]||d.type}</text>
                    </g>
                  );
                })}

                {/* Pending point indicator */}
                {pendingPt && (
                  <circle cx={pendingPt.x} cy={pendingPt.y} r="5" fill="#a78bfa" stroke="#fff" strokeWidth="1.5" opacity="0.7"/>
                )}

                {/* Tooltip */}
                {tooltip && (
                  <g>
                    <rect x={Math.min(tooltip.x, W-120)} y={padT} width={110} height={66} fill="rgba(10,10,20,0.92)" stroke="rgba(124,58,237,0.4)" rx="6"/>
                    <text x={Math.min(tooltip.x,W-120)+8} y={padT+14} fill="#a78bfa" fontSize="9" fontWeight="bold">OHLC</text>
                    {[["O",tooltip.c.open],["H",tooltip.c.high],["L",tooltip.c.low],["C",tooltip.c.close]].map(([lbl,val],i)=>(
                      <text key={lbl} x={Math.min(tooltip.x,W-120)+8} y={padT+26+i*11} fill="rgba(255,255,255,0.8)" fontSize="9">
                        {lbl}: ${val.toLocaleString(undefined,{minimumFractionDigits:2,maximumFractionDigits:2})}
                      </text>
                    ))}
                  </g>
                )}

                {/* X-axis labels */}
                {visible.map((c,i)=>{
                  if (i % Math.max(1,Math.floor(visible.length/8)) !== 0) return null;
                  return (
                    <text key={i} x={toX(i)} y={H-4} fill="rgba(255,255,255,0.25)" fontSize="8" textAnchor="middle">
                      {tf==="1D"?`D${start+i+1}`:tf==="1h"?`${(start+i)%24}h`:tf==="4h"?`${Math.floor((start+i)*4)}h`:`${start+i+1}`}
                    </text>
                  );
                })}
              </svg>
            </div>

            {/* Guide toggle */}
            <div style={{padding:"10px 18px",borderTop:"1px solid rgba(255,255,255,0.05)"}}>
              <button onClick={()=>setShowGuide(g=>!g)} style={{...S.btnSec,width:"100%",padding:"8px",fontSize:13,justifyContent:"center",gap:8}}>
                {showGuide?"▲ Hide":"📖 Show"} Chart Reading Guide
              </button>
              {showGuide && (
                <div style={{marginTop:14,display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(200px,1fr))",gap:12}}>
                  {[
                    {title:"🕯 Candlesticks",    text:"Each candle shows open, high, low, and close price. Green = price went up. Red = price went down."},
                    {title:"📊 Market Structure",text:"Markets move in trends — higher highs & higher lows = uptrend. Lower highs & lower lows = downtrend."},
                    {title:"🟢 Support",          text:"A price level where buyers tend to step in, preventing price from falling further."},
                    {title:"🔴 Resistance",       text:"A price level where sellers tend to step in, preventing price from rising further."},
                    {title:"📐 Trendlines",       text:"Lines connecting highs or lows to visualize the direction of the trend."},
                    {title:"⏱ Timeframes",        text:"1m=1 minute per candle. 1h=1 hour. 1D=1 day. Longer timeframes = bigger picture."},
                  ].map(g=>(
                    <div key={g.title} style={{background:"rgba(124,58,237,0.07)",border:"1px solid rgba(124,58,237,0.15)",borderRadius:10,padding:"12px 14px"}}>
                      <div style={{fontWeight:700,fontSize:13,marginBottom:5}}>{g.title}</div>
                      <div style={{fontSize:12,color:"rgba(255,255,255,0.55)",lineHeight:1.6}}>{g.text}</div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* ─ ORDER PANEL ─ */}
          <div style={{display:"flex",flexDirection:"column",gap:14}}>
            <div style={S.card}>
              <h3 style={{...S.h3,marginBottom:14}}>Place Order</h3>
              <div style={{display:"flex",background:"rgba(255,255,255,0.05)",borderRadius:10,marginBottom:14,padding:4}}>
                {["BUY","SELL"].map(s=>(
                  <div key={s} onClick={()=>setTradeSide(s)} style={{flex:1,textAlign:"center",padding:"9px",borderRadius:8,cursor:"pointer",fontWeight:700,fontSize:13,background:tradeSide===s?(s==="BUY"?"rgba(34,197,94,0.25)":"rgba(239,68,68,0.25)"):"transparent",color:tradeSide===s?(s==="BUY"?"#22c55e":"#ef4444"):"rgba(255,255,255,0.4)",transition:"all 0.2s",userSelect:"none"}}>
                    {s}
                  </div>
                ))}
              </div>
              <div style={{marginBottom:10}}>
                <label style={{...S.muted,fontSize:11,display:"block",marginBottom:5}}>ORDER TYPE</label>
                <div style={{display:"flex",gap:5}}>
                  {["Market","Limit","Stop"].map(t=>(
                    <div key={t} onClick={()=>setTradeType(t)} style={{flex:1,textAlign:"center",padding:"6px",borderRadius:7,cursor:"pointer",fontSize:11,border:"1px solid",borderColor:tradeType===t?"rgba(124,58,237,0.5)":"rgba(255,255,255,0.1)",background:tradeType===t?"rgba(124,58,237,0.15)":"transparent",color:tradeType===t?"#c4b5fd":"rgba(255,255,255,0.4)",userSelect:"none"}}>
                      {t}
                    </div>
                  ))}
                </div>
              </div>
              <div style={{marginBottom:10}}>
                <label style={{...S.muted,fontSize:11,display:"block",marginBottom:5}}>QUANTITY</label>
                <input style={S.input} type="number" value={tradeQty} onChange={e=>setTradeQty(e.target.value)} min="0.01" step="0.01"/>
              </div>
              <div style={{background:"rgba(124,58,237,0.08)",border:"1px solid rgba(124,58,237,0.2)",borderRadius:10,padding:"10px 14px",marginBottom:12,fontSize:12}}>
                <div style={{display:"flex",justifyContent:"space-between",marginBottom:4}}>
                  <span style={S.muted}>Est. Total</span>
                  <span style={{fontWeight:700}}>${(parseFloat(tradeQty||0)*currentPrice).toLocaleString(undefined,{minimumFractionDigits:2,maximumFractionDigits:2})}</span>
                </div>
                <div style={{display:"flex",justifyContent:"space-between"}}>
                  <span style={S.muted}>Buying Power</span>
                  <span style={{color:"#a78bfa"}}>$8,240.00</span>
                </div>
              </div>
              <button style={{...(tradeSide==="BUY"?S.btnGreen:S.btnRed),width:"100%",padding:12,fontSize:14,fontWeight:700}} onClick={handleTrade}>
                {tradeSide==="BUY"?"🟢 Buy":"🔴 Sell"} {tradeAsset.symbol}
              </button>
              {tradeMsg&&<div style={{marginTop:8,background:"rgba(34,197,94,0.1)",border:"1px solid rgba(34,197,94,0.3)",borderRadius:8,padding:"8px 12px",fontSize:12,color:"#22c55e"}}>{tradeMsg}</div>}
            </div>

            {/* Drawing tools legend */}
            <div style={S.card}>
              <div style={{fontWeight:700,fontSize:13,marginBottom:10,color:"#a78bfa"}}>📐 Drawing Tools</div>
              {TOOLS.map(t=>(
                <div key={t.id} onClick={()=>setTool(tool===t.id?null:t.id)}
                  style={{display:"flex",alignItems:"center",gap:8,padding:"7px 10px",borderRadius:8,cursor:"pointer",marginBottom:4,background:tool===t.id?"rgba(124,58,237,0.15)":"transparent",border:`1px solid ${tool===t.id?"rgba(124,58,237,0.3)":"transparent"}`,transition:"all 0.15s"}}>
                  <span>{t.icon}</span>
                  <div style={{flex:1}}>
                    <div style={{fontSize:12,fontWeight:600,color:tool===t.id?"#c4b5fd":"rgba(255,255,255,0.7)"}}>{t.label}</div>
                    <div style={{fontSize:10,color:"rgba(255,255,255,0.3)"}}>{t.tip}</div>
                  </div>
                  {tool===t.id&&<span style={{fontSize:10,color:"#a78bfa",fontWeight:700}}>ACTIVE</span>}
                </div>
              ))}
              {drawings.length>0&&(
                <button onClick={()=>{setDrawings([]);setPendingPt(null);}} style={{...S.btnSec,width:"100%",marginTop:8,padding:"7px",fontSize:12,color:"#f87171",borderColor:"rgba(239,68,68,0.3)"}}>
                  🗑 Clear All Drawings ({drawings.length})
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Positions + History */}
        <div style={{display:"grid",gridTemplateColumns:mobile?"1fr":"1fr 1fr",gap:18}}>
          <div style={S.card}>
            <h3 style={{...S.h3,marginBottom:14}}>Open Positions</h3>
            <div style={{overflowX:"auto"}}>
              <table style={{...S.table,minWidth:360}}>
                <thead><tr><th style={S.th}>Symbol</th><th style={S.th}>Qty</th><th style={S.th}>Avg</th><th style={S.th}>Current</th><th style={S.th}>P&L</th></tr></thead>
                <tbody>
                  {tradeHistory.filter(t=>t.type==="BUY").length===0 ? (
                    <tr><td colSpan={5} style={{...S.td,textAlign:"center",color:"rgba(255,255,255,0.3)",padding:20}}>No open positions yet.</td></tr>
                  ) : (
                    tradeHistory.filter(t=>t.type==="BUY").slice(0,5).map((t,i)=>{
                      const pl = (currentPrice - t.price)*t.qty;
                      return (
                        <tr key={i}>
                          <td style={{...S.td,fontWeight:700}}>{t.symbol}</td>
                          <td style={S.td}>{t.qty}</td>
                          <td style={S.td}>${t.price.toLocaleString(undefined,{minimumFractionDigits:2,maximumFractionDigits:2})}</td>
                          <td style={S.td}>${currentPrice.toLocaleString(undefined,{minimumFractionDigits:2,maximumFractionDigits:2})}</td>
                          <td style={{...S.td,color:pl>=0?"#22c55e":"#ef4444",fontWeight:600}}>{pl>=0?"+":""}${pl.toFixed(2)}</td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          </div>
          <div style={S.card}>
            <h3 style={{...S.h3,marginBottom:14}}>Trade History</h3>
            <div style={{overflowX:"auto"}}>
              <table style={{...S.table,minWidth:340}}>
                <thead><tr><th style={S.th}>Time</th><th style={S.th}>Symbol</th><th style={S.th}>Type</th><th style={S.th}>Price</th><th style={S.th}>Total</th></tr></thead>
                <tbody>
                  {tradeHistory.length===0 ? (
                    <tr><td colSpan={5} style={{...S.td,textAlign:"center",color:"rgba(255,255,255,0.3)",padding:20}}>No trades yet.</td></tr>
                  ) : tradeHistory.slice(0,8).map(t=>(
                    <tr key={t.id}>
                      <td style={{...S.td,color:"rgba(255,255,255,0.4)",fontSize:11}}>{t.time}</td>
                      <td style={{...S.td,fontWeight:700}}>{t.symbol}</td>
                      <td style={{...S.td,color:t.type==="BUY"?"#22c55e":"#ef4444",fontWeight:600}}>{t.type}</td>
                      <td style={S.td}>${t.price.toLocaleString(undefined,{minimumFractionDigits:2,maximumFractionDigits:2})}</td>
                      <td style={S.td}>${t.total.toLocaleString(undefined,{minimumFractionDigits:2,maximumFractionDigits:2})}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    );
  };

  // ── MARKET MAP ──────────────────────────────────────────────────────────────
  const PageMarketMap = () => (
    <div>
      <Disclaimer/>
      <div style={{marginBottom:24}}><h1 style={{...S.h2,marginBottom:4}}>Market Map</h1><p style={S.muted}>Visual sector performance — simulated data only.</p></div>
      <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(220px,1fr))",gap:14,marginBottom:22}}>
        {SECTORS.map(sec=>{
          const pos=sec.pct>0;
          return (
            <div key={sec.name} style={{...S.card,borderLeft:`3px solid ${pos?"#22c55e":"#ef4444"}`,background:pos?"rgba(34,197,94,0.05)":"rgba(239,68,68,0.05)"}}>
              <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:10}}>
                <h3 style={{fontSize:15,fontWeight:700,margin:0}}>{sec.name}</h3>
                <span style={{fontSize:20,fontWeight:800,color:pos?"#22c55e":"#ef4444"}}>{pos?"+":""}{sec.pct}%</span>
              </div>
              <div style={{display:"flex",gap:5,flexWrap:"wrap",marginBottom:10}}>
                {sec.stocks.map(s=><span key={s} style={{background:"rgba(255,255,255,0.07)",borderRadius:6,padding:"2px 7px",fontSize:11,fontWeight:600}}>{s}</span>)}
              </div>
              <ProgressBar value={Math.abs(sec.pct)} max={5} color={pos?"#22c55e":"#ef4444"} height={4}/>
            </div>
          );
        })}
      </div>
      <div style={S.card}>
        <h3 style={{...S.h3,marginBottom:18}}>Asset Performance</h3>
        <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(160px,1fr))",gap:12}}>
          {ASSETS.map(a=>(
            <div key={a.symbol} style={{background:a.pct>0?"rgba(34,197,94,0.08)":"rgba(239,68,68,0.08)",border:`1px solid ${a.pct>0?"rgba(34,197,94,0.2)":"rgba(239,68,68,0.2)"}`,borderRadius:12,padding:14,textAlign:"center"}}>
              <div style={{fontWeight:800,fontSize:17,marginBottom:3}}>{a.symbol}</div>
              <div style={{...S.muted,fontSize:11,marginBottom:7}}>{a.name}</div>
              <div style={{fontWeight:700,fontSize:15,marginBottom:3}}>${a.price.toLocaleString()}</div>
              <div style={{fontWeight:700,fontSize:13,color:a.pct>0?"#22c55e":"#ef4444"}}>{a.pct>0?"+":""}{a.pct}%</div>
              <div style={{marginTop:6,display:"flex",justifyContent:"center"}}><Sparkline positive={a.pct>0} width={90} height={28}/></div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  // ── QUIZZES ─────────────────────────────────────────────────────────────────
  const PageQuizzes = () => {
    const beginnerDone = lessons.beginner.every(l=>l.done);
    const intermediateDone = lessons.intermediate.every(l=>l.done);

    const canTakeQuiz = (level) => {
      if (level==="beginner") return true;
      if (level==="intermediate") return beginnerDone;
      if (level==="advanced") return intermediateDone;
      return false;
    };

    const handleNavAway = (dest) => {
      if (selectedQuiz && quizState.started && !quizState.done) {
        setQuizLeaveWarning(true);
        return;
      }
      nav(dest);
    };

    if (selectedQuiz && quizState.started) {
      if (quizState.done) {
        const score=quizScore(),total=selectedQuiz.questions.length,pct=Math.round((score/total)*100);
        return (
          <div style={{maxWidth:600,margin:"0 auto"}}>
            <div style={{...S.card,textAlign:"center",padding:40}}>
              <div style={{fontSize:60,marginBottom:14}}>{pct>=70?"🏆":"📚"}</div>
              <h2 style={{...S.h2,marginBottom:8}}>Quiz Complete!</h2>
              <div style={{fontSize:44,fontWeight:800,color:pct>=70?"#22c55e":"#eab308",margin:"14px 0"}}>{pct}%</div>
              <div style={{...S.muted,marginBottom:22}}>You got {score} out of {total} correct.</div>
              <ProgressBar value={score} max={total} color={pct>=70?"#22c55e":"#eab308"}/>
              <div style={{display:"flex",gap:10,justifyContent:"center",marginTop:24,flexWrap:"wrap"}}>
                <button style={S.btnPrimary} onClick={()=>startQuiz(selectedQuiz)}>🔄 Retake</button>
                <button style={S.btnSec} onClick={()=>{setSelectedQuiz(null);setQuizState({started:false,current:0,answers:[],done:false});}}>← All Quizzes</button>
                <button style={S.btnSec} onClick={()=>nav("lessons")}>📚 Keep Learning</button>
              </div>
            </div>
            <div style={{...S.card,marginTop:18}}>
              <h3 style={{...S.h3,marginBottom:14}}>Review Answers</h3>
              {selectedQuiz.questions.map((q,i)=>{
                const correct=quizState.answers[i]===q.ans;
                return (
                  <div key={i} style={{marginBottom:14,padding:14,background:correct?"rgba(34,197,94,0.07)":"rgba(239,68,68,0.07)",border:`1px solid ${correct?"rgba(34,197,94,0.2)":"rgba(239,68,68,0.2)"}`,borderRadius:10}}>
                    <div style={{fontWeight:600,marginBottom:7,fontSize:14}}>{i+1}. {q.q}</div>
                    <div style={{fontSize:13,color:correct?"#22c55e":"#ef4444"}}>{correct?"✅ Correct":"❌ Incorrect"} — {q.opts[q.ans]}</div>
                  </div>
                );
              })}
            </div>
          </div>
        );
      }

      const q=selectedQuiz.questions[quizState.current];
      return (
        <div style={{maxWidth:600,margin:"0 auto"}}>
          {/* Leave warning modal */}
          {quizLeaveWarning && (
            <div style={{position:"fixed",top:0,left:0,right:0,bottom:0,background:"rgba(0,0,0,0.7)",zIndex:999,display:"flex",alignItems:"center",justifyContent:"center",padding:24}}>
              <div style={{...S.card,maxWidth:400,width:"100%",textAlign:"center",padding:32,border:"1px solid rgba(234,179,8,0.3)"}}>
                <div style={{fontSize:40,marginBottom:12}}>⚠️</div>
                <h3 style={{...S.h3,marginBottom:8}}>Leave Quiz?</h3>
                <p style={{...S.muted,marginBottom:24,lineHeight:1.6}}>If you leave now your progress will be lost. Are you sure you want to exit?</p>
                <div style={{display:"flex",gap:12,justifyContent:"center"}}>
                  <button style={{...S.btnRed,padding:"10px 20px"}} onClick={()=>{setQuizLeaveWarning(false);setSelectedQuiz(null);setQuizState({started:false,current:0,answers:[],done:false});nav("dashboard");}}>Yes, Leave</button>
                  <button style={{...S.btnPrimary,padding:"10px 20px"}} onClick={()=>setQuizLeaveWarning(false)}>Keep Going</button>
                </div>
              </div>
            </div>
          )}
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:18}}>
            <button style={{...S.btnSec,padding:"6px 14px",fontSize:12}} onClick={()=>setQuizLeaveWarning(true)}>✕ Exit</button>
            <span style={S.muted}>Question {quizState.current+1} of {selectedQuiz.questions.length}</span>
          </div>
          <ProgressBar value={quizState.current} max={selectedQuiz.questions.length} color="#7c3aed"/>
          <div style={{...S.card,marginTop:22,padding:28}}>
            <div style={{...S.muted,fontSize:12,marginBottom:14,textTransform:"uppercase",letterSpacing:"0.05em"}}>{selectedQuiz.title}</div>
            <h2 style={{fontSize:19,fontWeight:700,marginBottom:24,lineHeight:1.4,margin:"0 0 24px 0"}}>{q.q}</h2>
            {q.opts.map((opt,i)=>(
              <div key={i} onClick={()=>answerQuiz(i)} style={{padding:"13px 16px",border:"1px solid rgba(255,255,255,0.1)",borderRadius:10,marginBottom:9,cursor:"pointer",transition:"all 0.15s",fontSize:14}}
                onMouseEnter={e=>e.currentTarget.style.background="rgba(124,58,237,0.15)"}
                onMouseLeave={e=>e.currentTarget.style.background="transparent"}
              >
                <span style={{color:"#a78bfa",fontWeight:700,marginRight:10}}>{String.fromCharCode(65+i)}.</span>{opt}
              </div>
            ))}
          </div>
        </div>
      );
    }

    return (
      <div>
        <div style={{marginBottom:24}}>
          <h1 style={{...S.h2,marginBottom:4}}>Quizzes</h1>
          <p style={S.muted}>Complete lessons first to unlock each quiz level.</p>
        </div>
        <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(260px,1fr))",gap:14}}>
          {QUIZZES.map(quiz=>{
            const unlocked = canTakeQuiz(quiz.level);
            return (
              <div key={quiz.title} style={{...S.card,borderTop:`3px solid ${quiz.level==="beginner"?"#22c55e":quiz.level==="intermediate"?"#eab308":"#ef4444"}`,opacity:unlocked?1:0.5}}>
                <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:7}}>
                  <div style={{fontSize:11,fontWeight:700,textTransform:"uppercase",letterSpacing:"0.05em",color:quiz.level==="beginner"?"#22c55e":quiz.level==="intermediate"?"#eab308":"#ef4444"}}>{quiz.level}</div>
                  {!unlocked && <span style={{fontSize:11,color:"rgba(255,255,255,0.35)"}}>🔒 Complete lessons first</span>}
                </div>
                <h3 style={{...S.h3,marginBottom:7}}>{quiz.title}</h3>
                <p style={{...S.muted,fontSize:13,marginBottom:14}}>{quiz.questions.length} multiple-choice questions</p>
                <button style={unlocked?S.btnPrimary:{...S.btnSec,opacity:0.5}} disabled={!unlocked} onClick={()=>unlocked&&startQuiz(quiz)}>
                  {unlocked?"Start Quiz →":"🔒 Locked"}
                </button>
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  // ── WIN/LOSS TRACKER ─────────────────────────────────────────────────────────
  const PageJournal = () => {
    const wins  = journal.filter(e=>e.pl>0).length;
    const losses= journal.filter(e=>e.pl<=0).length;
    const totalPL = journal.reduce((sum,e)=>sum+e.pl,0);
    return (
    <div>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:22,flexWrap:"wrap",gap:12}}>
        <div><h1 style={{...S.h2,marginBottom:4}}>Win / Loss Tracker</h1><p style={S.muted}>Track your simulated trades and performance over time.</p></div>
        <button style={S.btnPrimary} onClick={()=>setShowJournalForm(!showJournalForm)}>{showJournalForm?"✕ Cancel":"+ Log Trade"}</button>
      </div>

      {/* Stats row */}
      <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(140px,1fr))",gap:14,marginBottom:22}}>
        {[
          {label:"Total Trades", value:journal.length,         color:"#a78bfa"},
          {label:"Wins 🏆",      value:wins,                   color:"#22c55e"},
          {label:"Losses 📉",    value:losses,                 color:"#ef4444"},
          {label:"Win Rate",     value:`${journal.length?Math.round((wins/journal.length)*100):0}%`, color:"#eab308"},
          {label:"Total P&L",   value:`${totalPL>=0?"+":""}$${totalPL.toFixed(2)}`, color:totalPL>=0?"#22c55e":"#ef4444"},
        ].map(s=>(
          <div key={s.label} style={S.card}>
            <div style={{...S.muted,fontSize:11,marginBottom:5,textTransform:"uppercase"}}>{s.label}</div>
            <div style={{fontWeight:800,fontSize:22,color:s.color}}>{s.value}</div>
          </div>
        ))}
      </div>

      {showJournalForm&&(
        <div style={{...S.card,marginBottom:22,border:"1px solid rgba(124,58,237,0.3)"}}>
          <h3 style={{...S.h3,marginBottom:18,color:"#a78bfa"}}>Log a Trade</h3>
          <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(160px,1fr))",gap:12,marginBottom:12}}>
            {[{label:"Asset",key:"asset",type:"text",placeholder:"AAPL"},{label:"Entry Price",key:"entry",type:"number",placeholder:"188.50"},{label:"Exit Price",key:"exit",type:"number",placeholder:"192.45"}].map(f=>(
              <div key={f.key}>
                <label style={{...S.muted,fontSize:11,display:"block",marginBottom:5}}>{f.label.toUpperCase()}</label>
                <input style={S.input} type={f.type} placeholder={f.placeholder} value={newEntry[f.key]} onChange={e=>setNewEntry({...newEntry,[f.key]:e.target.value})}/>
              </div>
            ))}
            <div>
              <label style={{...S.muted,fontSize:11,display:"block",marginBottom:5}}>SIDE</label>
              <select style={{...S.select,width:"100%"}} value={newEntry.side} onChange={e=>setNewEntry({...newEntry,side:e.target.value})}><option>BUY</option><option>SELL</option></select>
            </div>
            <div>
              <label style={{...S.muted,fontSize:11,display:"block",marginBottom:5}}>EMOTION</label>
              <select style={{...S.select,width:"100%"}} value={newEntry.emotion} onChange={e=>setNewEntry({...newEntry,emotion:e.target.value})}>
                {["Confident","Calm","FOMO","Anxious","Neutral","Greedy","Patient"].map(em=><option key={em}>{em}</option>)}
              </select>
            </div>
          </div>
          <div style={{marginBottom:12}}>
            <label style={{...S.muted,fontSize:11,display:"block",marginBottom:5}}>NOTES / REASONING</label>
            <textarea style={{...S.input,minHeight:65,resize:"vertical"}} placeholder="Why did you enter this trade?" value={newEntry.notes} onChange={e=>setNewEntry({...newEntry,notes:e.target.value})}/>
          </div>
          <div style={{marginBottom:18}}>
            <label style={{...S.muted,fontSize:11,display:"block",marginBottom:5}}>LESSON LEARNED</label>
            <input style={S.input} placeholder="What did this trade teach you?" value={newEntry.lesson} onChange={e=>setNewEntry({...newEntry,lesson:e.target.value})}/>
          </div>
          <button style={S.btnPrimary} onClick={addJournal}>💾 Save Trade</button>
        </div>
      )}
      <div style={S.card}>
        <div style={{overflowX:"auto"}}>
          <table style={{...S.table,minWidth:680}}>
            <thead><tr>{["Date","Asset","Side","Entry","Exit","P&L","Result","Notes"].map(h=><th key={h} style={S.th}>{h}</th>)}</tr></thead>
            <tbody>{journal.map(e=>(
              <tr key={e.id}>
                <td style={{...S.td,color:"rgba(255,255,255,0.4)",fontSize:12}}>{e.date}</td>
                <td style={{...S.td,fontWeight:700}}>{e.asset}</td>
                <td style={{...S.td,color:e.side==="BUY"?"#22c55e":"#ef4444",fontWeight:600}}>{e.side}</td>
                <td style={S.td}>${e.entry.toLocaleString()}</td>
                <td style={S.td}>${e.exit.toLocaleString()}</td>
                <td style={{...S.td,color:e.pl>0?"#22c55e":"#ef4444",fontWeight:700}}>{e.pl>0?"+":""}${e.pl.toFixed(2)}</td>
                <td style={{...S.td,fontWeight:700,color:e.pl>0?"#22c55e":"#ef4444"}}>{e.pl>0?"🏆 WIN":"📉 LOSS"}</td>
                <td style={{...S.td,fontSize:12,color:"rgba(255,255,255,0.55)",maxWidth:160}}>{e.notes}</td>
              </tr>
            ))}</tbody>
          </table>
        </div>
      </div>
    </div>
    );
  };

  // ── PROFILE ─────────────────────────────────────────────────────────────────
  const PageProfile = () => {
    // Support both split storage (firstName/lastName) and legacy single name
    const firstName = currentUser.firstName || currentUser.name.split(" ")[0] || "";
    const lastName  = currentUser.lastName  || currentUser.name.split(" ").slice(1).join(" ") || "";
    const nameParts = [firstName, lastName].filter(Boolean);
    const initials  = nameParts.map(p=>p[0]).join("").toUpperCase().slice(0,2);
    const doneCount = lessons.beginner.filter(l=>l.done).length + lessons.intermediate.filter(l=>l.done).length + lessons.advanced.filter(l=>l.done).length;

    const handlePicUpload = (e) => {
      const file = e.target.files[0];
      if (!file) return;
      const reader = new FileReader();
      reader.onload = (ev) => setProfilePic(ev.target.result);
      reader.readAsDataURL(file);
    };

    const saveEditName = () => {
      const f = editName.first.trim();
      const l = editName.last.trim();
      if (f) {
        setCurrentUser(prev => ({
          ...prev,
          firstName: f,
          lastName:  l,
          name: l ? `${f} ${l}` : f,
        }));
        // Update remembered name too
        try { if (localStorage.getItem("daye_remember_me")==="true") localStorage.setItem("daye_remembered_name", l ? `${f} ${l}` : f); } catch(e){}
      }
      setEditingName(false);
    };

    return (
    <div>
      {/* ── PROFILE HEADER ── */}
      <div style={{...S.cardPurple, marginBottom:24, padding:"28px 28px 24px"}}>
        <div style={{display:"flex",gap:20,alignItems:"center",flexWrap:"wrap"}}>
          {/* Avatar with upload */}
          <div style={{position:"relative",flexShrink:0}}>
            <div style={{width:80,height:80,borderRadius:"50%",background:"linear-gradient(135deg,#7c3aed,#5b21b6)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:28,fontWeight:800,border:"3px solid rgba(167,139,250,0.4)",letterSpacing:"-0.02em",overflow:"hidden"}}>
              {profilePic ? <img src={profilePic} alt="avatar" style={{width:"100%",height:"100%",objectFit:"cover"}}/> : (initials||"?")}
            </div>
            <label style={{position:"absolute",bottom:0,right:0,background:"#7c3aed",borderRadius:"50%",width:24,height:24,display:"flex",alignItems:"center",justifyContent:"center",cursor:"pointer",fontSize:12,border:"2px solid #080810"}}>
              📷
              <input type="file" accept="image/*" style={{display:"none"}} onChange={handlePicUpload}/>
            </label>
          </div>
          {/* Name block */}
          <div style={{flex:1,minWidth:0}}>
            <div style={{fontSize:11,color:"#a78bfa",fontWeight:600,letterSpacing:"0.08em",textTransform:"uppercase",marginBottom:4}}>Your Profile</div>
            {editingName ? (
              <div style={{display:"flex",gap:8,flexWrap:"wrap",marginBottom:8,alignItems:"center"}}>
                <input defaultValue={firstName} onChange={e=>setEditName(p=>({...p,first:e.target.value}))} placeholder="First" style={{...S.input,width:120,padding:"8px 12px",fontSize:14}}/>
                <input defaultValue={lastName} onChange={e=>setEditName(p=>({...p,last:e.target.value}))} placeholder="Last" style={{...S.input,width:120,padding:"8px 12px",fontSize:14}}/>
                <button style={{...S.btnPrimary,padding:"8px 16px",fontSize:13}} onClick={saveEditName}>Save</button>
                <button style={{...S.btnSec,padding:"8px 14px",fontSize:13}} onClick={()=>setEditingName(false)}>Cancel</button>
              </div>
            ) : (
              <div style={{display:"flex",alignItems:"baseline",gap:10,marginBottom:4,flexWrap:"wrap"}}>
                <span style={{fontSize:"clamp(22px,4vw,32px)",fontWeight:800,letterSpacing:"-0.03em",color:"#fff",lineHeight:1.1}}>{firstName}{" "}</span>
                {lastName && <span style={{fontSize:"clamp(22px,4vw,32px)",fontWeight:800,letterSpacing:"-0.03em",color:"#a78bfa",lineHeight:1.1}}>{lastName}</span>}
                <button style={{...S.btnSec,padding:"4px 10px",fontSize:11}} onClick={()=>{setEditName({first:firstName,last:lastName});setEditingName(true);}}>✏️ Edit</button>
              </div>
            )}
            <div style={{fontSize:13,color:"rgba(255,255,255,0.4)",marginBottom:12}}>
              {currentUser.email || (currentUser.social ? `Signed in with ${currentUser.social}` : "Demo Mode")}
            </div>
            <div style={{display:"flex",gap:8,flexWrap:"wrap"}}>
              <span style={{background:"rgba(124,58,237,0.25)",border:"1px solid rgba(124,58,237,0.4)",borderRadius:99,padding:"4px 14px",fontSize:12,color:"#c4b5fd",fontWeight:600}}>
                {doneCount < 7 ? "Beginner Trader" : doneCount < 14 ? "Intermediate Trader" : "Advanced Trader"}
              </span>
              <span style={{background:"rgba(34,197,94,0.1)",border:"1px solid rgba(34,197,94,0.25)",borderRadius:99,padding:"4px 14px",fontSize:12,color:"#22c55e",fontWeight:600}}>🔥 4-Day Streak</span>
            </div>
          </div>
        </div>
      </div>
      <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(140px,1fr))",gap:14,marginBottom:22}}>
        {[
          {label:"Lessons Done", value:String(doneCount), icon:"📚"},
          {label:"Quiz Average",  value:quizScores.length ? `${Math.round(quizScores.reduce((s,q)=>s+q.pct,0)/quizScores.length)}%` : "0%", icon:"🧠"},
          {label:"Sim. Trades",   value:String(tradeHistory.length), icon:"📈"},
          {label:"Total P&L",     value:"+$116", icon:"💰"},
        ].map(s=>(
          <div key={s.label} style={{...S.card,textAlign:"center"}}>
            <div style={{fontSize:26,marginBottom:7}}>{s.icon}</div>
            <div style={{fontWeight:800,fontSize:20,marginBottom:3}}>{s.value}</div>
            <div style={{...S.muted,fontSize:12}}>{s.label}</div>
          </div>
        ))}
      </div>
      <div style={{display:"grid",gridTemplateColumns:mobile?"1fr":"1fr 1fr",gap:18,marginBottom:18}}>
        <div style={S.card}>
          <h3 style={{...S.h3,marginBottom:18}}>Badges</h3>
          <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:10}}>
            {BADGES.map(b=>(
              <div key={b.name} style={{...S.card,textAlign:"center",padding:12,opacity:b.earned?1:0.3,border:b.earned?"1px solid rgba(124,58,237,0.3)":"1px solid rgba(255,255,255,0.05)"}}>
                <div style={{fontSize:26,marginBottom:5}}>{b.icon}</div>
                <div style={{fontSize:10,fontWeight:600,color:b.earned?"#c4b5fd":"rgba(255,255,255,0.4)"}}>{b.name}</div>
              </div>
            ))}
          </div>
        </div>
        <div style={S.card}>
          <h3 style={{...S.h3,marginBottom:18}}>Progress</h3>
          {[{l:"Beginner",v:lessons.beginner.filter(x=>x.done).length,m:7,c:"#22c55e"},{l:"Intermediate",v:lessons.intermediate.filter(x=>x.done).length,m:7,c:"#eab308"},{l:"Advanced",v:lessons.advanced.filter(x=>x.done).length,m:7,c:"#ef4444"}].map(p=>(
            <div key={p.l} style={{marginBottom:16}}>
              <div style={{display:"flex",justifyContent:"space-between",marginBottom:5}}>
                <span style={{fontSize:13}}>{p.l} Track</span>
                <span style={{...S.muted,fontSize:12}}>{p.v}/{p.m}</span>
              </div>
              <ProgressBar value={p.v} max={p.m} color={p.c}/>
            </div>
          ))}
        </div>
      </div>
      <button style={{...S.btnSec,color:"#ef4444",borderColor:"rgba(239,68,68,0.3)"}} onClick={()=>{setCurrentUser({name:"Trader",email:"",social:""});nav("landing");}}>
        Log Out
      </button>
    </div>
    );
  };

  // ── NAV ITEMS ────────────────────────────────────────────────────────────────
  const NAV_ITEMS = [
    {id:"dashboard", icon:"🏠", label:"Dashboard"},
    {id:"lessons",   icon:"📚", label:"Lessons"},
    {id:"simulator", icon:"📈", label:"Simulator"},
    {id:"market-map",icon:"🗺️",label:"Market Map"},
    {id:"quizzes",   icon:"🧠", label:"Quizzes"},
    {id:"journal",   icon:"📊", label:"Win/Loss"},
    {id:"profile",   icon:"👤", label:"Profile"},
  ];

  // ── RENDER ───────────────────────────────────────────────────────────────────
  if (page==="landing") return <div style={S.app}><PageLanding/></div>;

  if (page==="auth") return (
    <div style={S.app}>
      <AuthPage
        authMode={authMode}
        setAuthMode={setAuthMode}
        onSuccess={(userData) => { setCurrentUser(userData); nav("dashboard"); }}
        onDemo={() => { setCurrentUser({ name:"Demo User", email:"", social:"Demo" }); nav("dashboard"); }}
        onBack={() => nav("landing")}
      />
    </div>
  );

  return (
    <div style={S.app}>
      {/* SIDEBAR desktop */}
      {!mobile && (
        <aside style={S.sidebar}>
          <div style={S.logo}>
            <div style={{fontWeight:800,fontSize:18,letterSpacing:"-0.03em",cursor:"pointer"}} onClick={()=>nav(currentUser.name!=="Trader"?"dashboard":"landing")}>
              <span style={{color:"#a78bfa"}}>DAYE</span> Trading
            </div>
            <div style={{fontSize:11,color:"rgba(255,255,255,0.25)",marginTop:2}}>Educational Platform</div>
          </div>
          {NAV_ITEMS.map(item=>(
            <div key={item.id} style={S.navItem(page===item.id)} onClick={()=>nav(item.id)}>
              <span style={{fontSize:16}}>{item.icon}</span>
              <span>{item.label}</span>
            </div>
          ))}
          <div style={{marginTop:"auto",padding:"0 20px"}}>
            <div style={{background:"rgba(124,58,237,0.1)",border:"1px solid rgba(124,58,237,0.2)",borderRadius:10,padding:"12px 14px"}}>
              <div style={{fontSize:11,color:"#a78bfa",fontWeight:600,marginBottom:4}}>⚠️ SIMULATED DATA</div>
              <div style={{fontSize:11,color:"rgba(255,255,255,0.35)",lineHeight:1.5}}>All prices & trades are fake. For education only.</div>
            </div>
          </div>
        </aside>
      )}

      {/* BOTTOM NAV mobile */}
      {mobile && (
        <nav style={S.botNav}>
          {[{id:"dashboard",icon:"🏠",label:"Home"},{id:"lessons",icon:"📚",label:"Learn"},{id:"simulator",icon:"📈",label:"Trade"},{id:"market-map",icon:"🗺️",label:"Markets"},{id:"profile",icon:"👤",label:"Profile"}].map(item=>(
            <div key={item.id} style={S.botItem(page===item.id)} onClick={()=>nav(item.id)}>
              <span style={{fontSize:20}}>{item.icon}</span>
              <span>{item.label}</span>
            </div>
          ))}
        </nav>
      )}

      <main style={S.content(mobile)}>
        {page==="dashboard"    &&<PageDashboard/>}
        {page==="lessons"      &&<PageLessons/>}
        {page==="lesson-detail"&&<PageLessonDetail/>}
        {page==="simulator"    &&<PageSimulator/>}
        {page==="market-map"   &&<PageMarketMap/>}
        {page==="quizzes"      &&<PageQuizzes/>}
        {page==="journal"      &&<PageJournal/>}
        {page==="profile"      &&<PageProfile/>}
      </main>
    </div>
  );
}
