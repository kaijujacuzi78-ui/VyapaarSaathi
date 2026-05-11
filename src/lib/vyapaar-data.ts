// ─── LANGUAGE SUPPORT ───
export type LangKey = "en" | "hi" | "mr" | "ta" | "te";

export const LANG: Record<LangKey, Record<string, string>> = {
  en: {
    appName: "VyapaarSaathi", tagline: "YOUR STARTUP LAW GUIDE",
    home: "Home", checklist: "Checklist", schemes: "Schemes",
    calendar: "Calendar", learn: "Learn", chat: "AI Help", wizard: "Register",
    heroTitle: "Your Business.\nYour Rights.", heroHL: "Simplified.",
    heroSub: "Laws, licenses, schemes & compliance — plain language for Indian entrepreneurs.",
    statePH: "Select your state", bizPH: "Select business type",
    progressLabel: "Compliance Progress", startJourney: "Start your journey →",
    fullyCompliant: "🎉 Fully compliant!", remaining: "items remaining",
    commonQ: "Common Questions", seeAll: "See all FAQs →",
    wizardTitle: "Registration Wizard", wizardSub: "Step-by-step — no confusion",
    templateTitle: "Download Templates", templateSub: "Ready-to-use forms & samples",
    searchPH: "Search guides, schemes, terms…",
    noResults: "No results found. Try another keyword.",
    feedbackTitle: "Help Us Improve", feedbackSub: "Your feedback shapes this tool",
    newSection: "What's New", loading: "Loading…",
    saveProgress: "Save Progress", savedBadge: "Saved ✓",
    offlineNotice: "You're offline — showing cached content",
    securityNote: "Your data stays on your device.",
    fontSizeLabel: "Text size", highContrastLabel: "High contrast",
    skipToContent: "Skip to content",
    required: "Required", optional: "Optional",
    errorRequired: "This field is required",
    stepOf: "Step {n} of {total}",
  },
  hi: {
    appName: "व्यापारसाथी", tagline: "आपका स्टार्टअप कानूनी गाइड",
    home: "होम", checklist: "चेकलिस्ट", schemes: "योजनाएं",
    calendar: "कैलेंडर", learn: "सीखें", chat: "AI सहायता", wizard: "रजिस्टर",
    heroTitle: "आपका व्यवसाय।\nआपके अधिकार।", heroHL: "सरल भाषा में।",
    heroSub: "कानून, लाइसेंस, योजनाएं — सरल हिंदी में।",
    statePH: "राज्य चुनें", bizPH: "व्यवसाय प्रकार चुनें",
    progressLabel: "अनुपालन प्रगति", startJourney: "यात्रा शुरू करें →",
    fullyCompliant: "🎉 पूरी तरह अनुपालित!", remaining: "बाकी कार्य",
    commonQ: "सामान्य प्रश्न", seeAll: "सभी FAQ देखें →",
    wizardTitle: "पंजीकरण विज़ार्ड", wizardSub: "चरण-दर-चरण मार्गदर्शन",
    templateTitle: "टेम्पलेट डाउनलोड करें", templateSub: "तैयार फॉर्म और नमूने",
    searchPH: "योजनाएं, गाइड, शब्द खोजें…",
    noResults: "कोई परिणाम नहीं मिला।",
    feedbackTitle: "सुधार में मदद करें", feedbackSub: "आपकी प्रतिक्रिया जरूरी है",
    newSection: "नया क्या है", loading: "लोड हो रहा है…",
    saveProgress: "प्रगति सहेजें", savedBadge: "सहेजा गया ✓",
    offlineNotice: "आप ऑफ़लाइन हैं — कैश्ड सामग्री दिखाई जा रही है",
    securityNote: "आपका डेटा आपके डिवाइस पर रहता है।",
    fontSizeLabel: "फ़ॉन्ट साइज़", highContrastLabel: "हाई कॉन्ट्रास्ट",
    skipToContent: "सामग्री पर जाएं",
    required: "आवश्यक", optional: "वैकल्पिक",
    errorRequired: "यह फ़ील्ड आवश्यक है",
    stepOf: "{n} में से {total} चरण",
  },
  mr: {
    appName: "व्यापारसाथी", tagline: "तुमचा कायदेशीर मार्गदर्शक",
    home: "होम", checklist: "चेकलिस्ट", schemes: "योजना",
    calendar: "दिनदर्शिका", learn: "शिका", chat: "AI मदत", wizard: "नोंदणी",
    heroTitle: "तुमचा व्यवसाय.\nतुमचे हक्क.", heroHL: "सोप्या भाषेत.",
    heroSub: "कायदे, परवाने, योजना — सोप्या मराठीत.",
    statePH: "राज्य निवडा", bizPH: "व्यवसाय प्रकार निवडा",
    progressLabel: "अनुपालन प्रगती", startJourney: "सुरुवात करा →",
    fullyCompliant: "🎉 पूर्णपणे अनुपालित!", remaining: "बाकी कार्ये",
    commonQ: "सामान्य प्रश्न", seeAll: "सर्व FAQ पाहा →",
    wizardTitle: "नोंदणी विझार्ड", wizardSub: "पायरी-पायरी मार्गदर्शन",
    templateTitle: "टेम्पलेट डाउनलोड करा", templateSub: "तयार फॉर्म आणि नमुने",
    searchPH: "योजना, मार्गदर्शक शोधा…",
    noResults: "कोणतेही परिणाम नाही.",
    feedbackTitle: "सुधारण्यास मदत करा", feedbackSub: "तुमचा अभिप्राय महत्त्वाचा आहे",
    newSection: "नवीन काय आहे", loading: "लोड होत आहे…",
    saveProgress: "प्रगती जतन करा", savedBadge: "जतन केले ✓",
    offlineNotice: "तुम्ही ऑफलाइन आहात",
    securityNote: "तुमचा डेटा तुमच्या डिव्हाइसवर राहतो.",
    fontSizeLabel: "मजकूर आकार", highContrastLabel: "उच्च कॉन्ट्रास्ट",
    skipToContent: "मुख्य मजकुरावर जा",
    required: "आवश्यक", optional: "पर्यायी",
    errorRequired: "हे फील्ड आवश्यक आहे",
    stepOf: "{n} पैकी {total} पायरी",
  },
  ta: {
    appName: "வியாபார்சாதி", tagline: "தொழில் சட்ட வழிகாட்டி",
    home: "முகப்பு", checklist: "சரிபார்ப்பு", schemes: "திட்டங்கள்",
    calendar: "நாட்காட்டி", learn: "கற்றுக்கொள்", chat: "AI உதவி", wizard: "பதிவு",
    heroTitle: "உங்கள் தொழில்.\nஉங்கள் உரிமைகள்.", heroHL: "எளிமையாக.",
    heroSub: "சட்டங்கள், உரிமங்கள், திட்டங்கள் — எளிய தமிழில்.",
    statePH: "மாநிலம் தேர்ந்தெடுக்கவும்", bizPH: "தொழில் வகை தேர்ந்தெடுக்கவும்",
    progressLabel: "இணக்க முன்னேற்றம்", startJourney: "தொடங்குங்கள் →",
    fullyCompliant: "🎉 முழுமையாக இணக்கமானது!", remaining: "பணிகள் உள்ளன",
    commonQ: "பொதுவான கேள்விகள்", seeAll: "அனைத்து FAQ →",
    wizardTitle: "பதிவு வழிகாட்டி", wizardSub: "படி-படியாக வழிகாட்டல்",
    templateTitle: "வார்ப்புருக்கள்", templateSub: "தயாரான படிவங்கள்",
    searchPH: "திட்டங்கள் தேடுங்கள்…",
    noResults: "முடிவுகள் இல்லை.",
    feedbackTitle: "மேம்படுத்த உதவுங்கள்", feedbackSub: "உங்கள் கருத்து முக்கியம்",
    newSection: "புதியது என்ன", loading: "ஏற்றுகிறது…",
    saveProgress: "முன்னேற்றம் சேமிக்கவும்", savedBadge: "சேமிக்கப்பட்டது ✓",
    offlineNotice: "நீங்கள் ஆஃப்லைனில் உள்ளீர்கள்",
    securityNote: "உங்கள் தரவு உங்கள் சாதனத்தில் இருக்கும்.",
    fontSizeLabel: "எழுத்து அளவு", highContrastLabel: "அதிக வேறுபாடு",
    skipToContent: "உள்ளடக்கத்திற்கு செல்லவும்",
    required: "தேவையான", optional: "விருப்பத்தேர்வு",
    errorRequired: "இந்த புலம் தேவையானது",
    stepOf: "{total} இல் படி {n}",
  },
  te: {
    appName: "వ్యాపార్‌సాతి", tagline: "మీ స్టార్టప్ చట్ట గైడ్",
    home: "హోమ్", checklist: "చెక్‌లిస్ట్", schemes: "పథకాలు",
    calendar: "క్యాలెండర్", learn: "నేర్చుకోండి", chat: "AI సహాయం", wizard: "నమోదు",
    heroTitle: "మీ వ్యాపారం.\nమీ హక్కులు.", heroHL: "సులభ భాషలో.",
    heroSub: "చట్టాలు, లైసెన్సులు, పథకాలు — సాధారణ తెలుగులో.",
    statePH: "మీ రాష్ట్రం ఎంచుకోండి", bizPH: "వ్యాపార రకం ఎంచుకోండి",
    progressLabel: "సమ్మతి పురోగతి", startJourney: "మీ ప్రయాణం ప్రారంభించండి →",
    fullyCompliant: "🎉 పూర్తిగా సమ్మతించబడింది!", remaining: "పనులు మిగిలి ఉన్నాయి",
    commonQ: "సాధారణ ప్రశ్నలు", seeAll: "అన్ని FAQ చూడండి →",
    wizardTitle: "నమోదు విజార్డ్", wizardSub: "దశల వారీ మార్గదర్శకం",
    templateTitle: "టెంప్లేట్‌లు డౌన్‌లోడ్ చేయండి", templateSub: "సిద్ధంగా ఉన్న ఫారమ్‌లు",
    searchPH: "పథకాలు, గైడ్‌లు వెతకండి…",
    noResults: "ఫలితాలు లేవు.",
    feedbackTitle: "మెరుగుపరచడంలో సహాయం చేయండి", feedbackSub: "మీ అభిప్రాయం ముఖ్యమైనది",
    newSection: "కొత్తది ఏమిటి", loading: "లోడ్ అవుతోంది…",
    saveProgress: "పురోగతి సేవ్ చేయండి", savedBadge: "సేవ్ అయింది ✓",
    offlineNotice: "మీరు ఆఫ్‌లైన్‌లో ఉన్నారు",
    securityNote: "మీ డేటా మీ పరికరంలో ఉంటుంది.",
    fontSizeLabel: "అక్షర పరిమాణం", highContrastLabel: "అధిక కాంట్రాస్ట్",
    skipToContent: "కంటెంట్‌కి వెళ్ళండి",
    required: "అవసరం", optional: "ఐచ్ఛికం",
    errorRequired: "ఈ ఫీల్డ్ అవసరం",
    stepOf: "{total} లో దశ {n}",
  },
};

export const STATES = [
  "Maharashtra","Karnataka","Tamil Nadu","Uttar Pradesh","Rajasthan","Gujarat",
  "Andhra Pradesh","Telangana","West Bengal","Madhya Pradesh","Odisha",
  "Punjab","Haryana","Jharkhand","Chhattisgarh","Himachal Pradesh","Other"
];

export const BUSINESS_TYPES = [
  "Agriculture / Farm","Retail Shop","Food / Tiffin / Restaurant",
  "Handicraft / Artisan","Dairy / Livestock","Services / Repairs",
  "Manufacturing","E-commerce / Online","Construction / Labour",
  "Healthcare / Medical","Education / Coaching","Transport / Logistics","Other"
];

export const REGION_TRACKS: Record<string, { extra: string[]; helpline: string }> = {
  Maharashtra: { extra:["Maharashtra Shops & Establishments Act (30 days)","Professional Tax (PT) — monthly","MIDC incentives for manufacturing"], helpline:"1800-22-6759" },
  Karnataka:   { extra:["Karnataka Shops & Commercial Est. Act","Karnataka MSME Development Corp schemes","Bruhat Bengaluru loan support"], helpline:"080-22251704" },
  "Tamil Nadu":{ extra:["TN Shops & Establishments Registration","TIDCO / SIPCOT industrial schemes","TN Startup & Innovation Policy"], helpline:"1800-425-1188" },
  "Uttar Pradesh": { extra:["UP Shops & Establishments Act","ODOP (One District One Product) scheme","UP Startup Policy 2020"], helpline:"0522-2238902" },
  Rajasthan:   { extra:["Rajasthan Shops Act Registration","RIPS scheme","CM SME support scheme"], helpline:"0141-2227911" },
  Gujarat:     { extra:["Gujarat Shops & Est. Act","iCreate startup support","MSME Sahay loan portal"], helpline:"1800-233-0003" },
  Telangana:   { extra:["TS-iPASS for industrial approvals","T-Hub startup support","Telangana MSME Policy"], helpline:"040-23452400" },
  "Andhra Pradesh": { extra:["AP Shops & Establishments Act","AP MSME Policy","APIIC industrial schemes"], helpline:"1800-599-4442" },
};

export interface ChecklistItem {
  id: string; step: number; title: string; tag: string;
  summary: string; desc: string; url: string; time: string; cost: string;
}

export const CHECKLIST: ChecklistItem[] = [
  { id:"udyam", step:1, title:"Udyam Registration", tag:"Registration",
    summary:"Free MSME ID — takes 10 minutes online",
    desc:"Register as an MSME at udyamregistration.gov.in. You need: Aadhaar + PAN + mobile number. It's 100% free and gives you access to government loans and subsidies.",
    url:"https://udyamregistration.gov.in", time:"10 min", cost:"Free" },
  { id:"pan", step:1, title:"PAN & Business Bank Acct", tag:"Registration",
    summary:"Your tax identity + dedicated bank account",
    desc:"Get a business PAN from incometax.gov.in, then open a current account at any bank.",
    url:"https://incometax.gov.in/pan", time:"2–3 days", cost:"Free" },
  { id:"shop", step:2, title:"Shop & Establishment Act", tag:"License",
    summary:"State labour registration — mandatory within 30 days",
    desc:"Register with your State Labour Department within 30 days of opening.",
    url:"#", time:"1–3 days", cost:"₹100–500" },
  { id:"gst", step:2, title:"GST Registration", tag:"Tax",
    summary:"Required if annual sales exceed ₹40L (goods) or ₹20L (services)",
    desc:"Apply at gst.gov.in. You need: PAN, Aadhaar, bank account details, business address proof.",
    url:"https://gst.gov.in", time:"7 days", cost:"Free" },
  { id:"fssai", step:2, title:"FSSAI License", tag:"License",
    summary:"Mandatory for ANY food business",
    desc:"Apply at foscos.fssai.gov.in. Basic Registration for turnover < ₹12 lakh/year.",
    url:"https://foscos.fssai.gov.in", time:"30–60 days", cost:"₹100–7,500" },
  { id:"esi", step:3, title:"ESI / PF Registration", tag:"Labour",
    summary:"ESI at 10+ workers, PF at 20+ workers — mandatory",
    desc:"ESI registration at esic.gov.in at 10+ employees. PF at epfindia.gov.in at 20+ employees.",
    url:"https://esic.gov.in", time:"7 days", cost:"Free" },
  { id:"itr", step:3, title:"Income Tax Return (Annual)", tag:"Tax",
    summary:"File ITR-4 by July 31 each year",
    desc:"File your business income tax return annually. Late filing fee: ₹5,000.",
    url:"https://incometax.gov.in", time:"1–2 hrs", cost:"Free (or CA fees)" },
  { id:"gstr", step:3, title:"GST Returns GSTR-1/3B", tag:"Tax",
    summary:"Monthly/quarterly GST filings — don't miss deadlines",
    desc:"GSTR-1 (sales) due 11th of each month. GSTR-3B (payment) due 20th.",
    url:"https://gst.gov.in", time:"30 min each", cost:"Free" },
];

export interface Scheme {
  name: string; cat: string; amount: string; who: string;
  how: string; url: string; icon: string; eligible: string;
}

export const SCHEMES: Scheme[] = [
  { name:"PM Mudra Yojana", cat:"Loan", amount:"Up to ₹20 Lakh", who:"Any non-farm small business", how:"Apply via nearest bank / NBFC", url:"https://mudra.org.in", icon:"💼", eligible:"All" },
  { name:"PMEGP", cat:"Grant+Loan", amount:"Up to ₹25 Lakh", who:"New entrepreneurs 18+", how:"kvic.gov.in", url:"https://www.kviconline.gov.in", icon:"🚀", eligible:"All" },
  { name:"Udyam Registration", cat:"Registration", amount:"Free", who:"All MSMEs", how:"udyamregistration.gov.in", url:"https://udyamregistration.gov.in", icon:"📋", eligible:"All" },
  { name:"Stand-Up India", cat:"Loan", amount:"₹10L – ₹1 Cr", who:"SC/ST & Women entrepreneurs", how:"standupmitra.in", url:"https://www.standupmitra.in", icon:"🌟", eligible:"SC/ST/Women" },
  { name:"PM SVANidhi", cat:"Micro-Loan", amount:"₹10K – ₹50K", who:"Street / rural vendors", how:"pmsvanidhi.mohua.gov.in", url:"https://pmsvanidhi.mohua.gov.in", icon:"🏪", eligible:"All" },
  { name:"PM Kisan Samman Nidhi", cat:"Subsidy", amount:"₹6,000/year", who:"Small & marginal farmers", how:"pmkisan.gov.in", url:"https://pmkisan.gov.in", icon:"🌾", eligible:"Farmers" },
  { name:"Startup India Seed", cat:"Grant", amount:"Up to ₹50 Lakh", who:"DPIIT-recognised startups", how:"startupindia.gov.in", url:"https://startupindia.gov.in", icon:"💡", eligible:"Startups" },
  { name:"NABARD Agri Loan", cat:"Loan", amount:"Varies", who:"Agri-allied businesses", how:"Through Cooperative/RRB banks", url:"https://nabard.org", icon:"🌱", eligible:"Farmers" },
];

export const CALENDAR = [
  { month:"January", tasks:[{t:"GSTR-3B for Dec",d:"11th",type:"gst"},{t:"Advance Tax 4th instalment",d:"15th",type:"tax"},{t:"TDS Return Q3",d:"31st",type:"tax"}]},
  { month:"February", tasks:[{t:"GSTR-1 for Jan",d:"11th",type:"gst"},{t:"GSTR-3B for Jan",d:"20th",type:"gst"}]},
  { month:"March", tasks:[{t:"GSTR-1",d:"11th",type:"gst"},{t:"GSTR-3B",d:"20th",type:"gst"},{t:"Year-end stock audit",d:"31st",type:"other"},{t:"Close FY books",d:"31st",type:"other"}]},
  { month:"April", tasks:[{t:"GSTR-1",d:"11th",type:"gst"},{t:"GSTR-3B",d:"20th",type:"gst"},{t:"Renew licenses (new FY)",d:"1st",type:"license"},{t:"Shop Act renewal if due",d:"check",type:"license"}]},
  { month:"May", tasks:[{t:"GSTR-1",d:"11th",type:"gst"},{t:"GSTR-3B",d:"20th",type:"gst"}]},
  { month:"June", tasks:[{t:"GSTR-1",d:"11th",type:"gst"},{t:"GSTR-3B",d:"20th",type:"gst"},{t:"Advance Tax 1st instalment",d:"15th",type:"tax"}]},
  { month:"July", tasks:[{t:"GSTR-1",d:"11th",type:"gst"},{t:"GSTR-3B",d:"20th",type:"gst"},{t:"ITR filing deadline",d:"31st",type:"tax"}]},
  { month:"August", tasks:[{t:"GSTR-1",d:"11th",type:"gst"},{t:"GSTR-3B",d:"20th",type:"gst"},{t:"TDS Return Q1",d:"31st",type:"tax"}]},
  { month:"September", tasks:[{t:"GSTR-1",d:"11th",type:"gst"},{t:"GSTR-3B",d:"20th",type:"gst"},{t:"Advance Tax 2nd instalment",d:"15th",type:"tax"}]},
  { month:"October", tasks:[{t:"GSTR-1",d:"11th",type:"gst"},{t:"GSTR-3B",d:"20th",type:"gst"},{t:"TDS Return Q2",d:"31st",type:"tax"}]},
  { month:"November", tasks:[{t:"GSTR-1",d:"11th",type:"gst"},{t:"GSTR-3B",d:"20th",type:"gst"}]},
  { month:"December", tasks:[{t:"GSTR-1",d:"11th",type:"gst"},{t:"GSTR-3B",d:"20th",type:"gst"},{t:"Advance Tax 3rd instalment",d:"15th",type:"tax"}]},
];

export const GLOSSARY = [
  { term:"MSME", def:"Micro, Small & Medium Enterprise — your business category that unlocks government loans and schemes based on annual turnover." },
  { term:"GST", def:"Goods & Services Tax — a single national tax on sales. You collect it from customers and pay the government monthly." },
  { term:"Udyam", def:"Free MSME registration certificate. Your business identity card that unlocks bank loans, subsidies, and government tenders." },
  { term:"TDS", def:"Tax Deducted at Source — tax cut before payment reaches you." },
  { term:"PAN", def:"Permanent Account Number — your business tax ID." },
  { term:"ITR", def:"Income Tax Return — filed annually by July 31." },
  { term:"FSSAI", def:"Food Safety authority license — mandatory for any food business." },
  { term:"ESI", def:"Employee State Insurance — health coverage for workers earning < ₹21,000/month. Mandatory at 10+ employees." },
  { term:"Provident Fund", def:"Retirement savings scheme. Mandatory at 20+ employees." },
  { term:"Working Capital", def:"Day-to-day money needed to operate — buy stock, pay wages, cover bills." },
];

export const FAQ = [
  { q:"Do I need to register if I earn very little?", a:"Udyam registration is free and unlocks loans/schemes even for micro businesses. GST is mandatory only above ₹40L (goods) or ₹20L (services) turnover." },
  { q:"What happens if I don't file GST returns?", a:"Late fees start from ₹50/day (minimum ₹1,000 per return). Continued non-filing = GST cancellation." },
  { q:"Can I hire workers informally?", a:"At 10+ workers you must register under ESI. At 20+ workers, PF is mandatory. Penalties: up to ₹1 lakh." },
  { q:"Is a verbal agreement with a supplier valid?", a:"Legally yes, but very risky. A written contract is essential." },
  { q:"How do I know if a scheme is genuine?", a:"Only apply through official .gov.in websites. All legitimate schemes are FREE to apply." },
];

export const QUIZ = [
  { q:"Your food business has ₹15 lakh annual turnover. Do you need GST?", o:["Yes, mandatory","No, below threshold","Only if selling online","Only for exports"], a:1, exp:"GST threshold for food/services is ₹20 lakh. At ₹15L you are below it — but you still need FSSAI!" },
  { q:"How many employees trigger mandatory ESI registration?", o:["5+","10+","20+","50+"], a:1, exp:"ESI is mandatory at 10+ workers earning below ₹21,000/month." },
  { q:"Udyam registration costs:", o:["₹500","₹2,000","Free","Depends on state"], a:2, exp:"Udyam is completely free at udyamregistration.gov.in." },
  { q:"Income Tax Return deadline for small businesses:", o:["March 31","July 31","December 31","September 30"], a:1, exp:"ITR deadline is July 31 each year." },
  { q:"Mudra Yojana loans are available to:", o:["Only women","Only SC/ST","Any small non-farm business","Only registered companies"], a:2, exp:"Mudra is open to any non-agricultural small business via banks/NBFCs." },
];

export const WHATS_NEW = [
  { date:"Jun 2025", title:"GST Annual Return threshold raised", body:"Businesses with turnover below ₹2 Cr are now exempt from GSTR-9 annual return.", tag:"Tax", verified:true },
  { date:"May 2025", title:"Udyam portal now accepts Aadhaar OTP", body:"Log in using Aadhaar OTP — no password needed.", tag:"Registration", verified:true },
  { date:"Apr 2025", title:"Mudra Yojana limit raised to ₹20 Lakh", body:"Tarun category raised from ₹10L to ₹20L for eligible businesses.", tag:"Schemes", verified:true },
];

export const PORTALS = [
  { name:"Udyam Registration", url:"https://udyamregistration.gov.in", desc:"Free MSME registration", icon:"📋" },
  { name:"GST Portal", url:"https://gst.gov.in", desc:"Register, file returns, pay tax", icon:"🧾" },
  { name:"Income Tax e-Filing", url:"https://incometax.gov.in", desc:"File ITR, check refunds", icon:"💰" },
  { name:"Startup India", url:"https://startupindia.gov.in", desc:"Recognition, funding, schemes", icon:"🚀" },
  { name:"PM Mudra Yojana", url:"https://mudra.org.in", desc:"Loans up to ₹20 lakh", icon:"🏦" },
  { name:"PMEGP Portal", url:"https://www.kviconline.gov.in", desc:"Grant + loan for new ventures", icon:"🌟" },
];

export const TEMPLATES = [
  { name:"Business Registration Checklist", type:"TXT", icon:"📋", content:"BUSINESS REGISTRATION CHECKLIST\n================================\n\n☐ Step 1: Udyam MSME Registration (FREE)\n☐ Step 2: PAN Card for Business\n☐ Step 3: Business Bank Account\n☐ Step 4: Shop & Establishment Act Registration\n☐ Step 5: GST Registration (if turnover > threshold)\n☐ Step 6: FSSAI License (FOOD BUSINESSES ONLY)\n☐ Step 7: Trade License from Municipality" },
  { name:"Basic Supplier Agreement", type:"TXT", icon:"📄", content:"BASIC SUPPLIER AGREEMENT\n=========================\n\nDate: _______________\n\nBETWEEN:\nBuyer: _______________\nSupplier: _______________\n\nTERMS AGREED:\n1. Goods/Services: _______________\n2. Price: ₹_______________\n3. Payment: ___ days after delivery\n4. Delivery Date: _______________\n\nSIGNATURES:\nBuyer: _______________\nSupplier: _______________" },
  { name:"Employee Appointment Letter", type:"TXT", icon:"📝", content:"APPOINTMENT LETTER\n==================\n\nDate: _______________\n\nDear _______________,\n\nWe are pleased to appoint you as _______________.\n\n• Start Date: _______________\n• Monthly Salary: ₹_______________\n• Working Hours: ___ AM to ___ PM\n• Probation Period: ___ months\n\nFor _______________ (Business)\nAuthorised Signatory: _______________" },
  { name:"GST Invoice Sample", type:"TXT", icon:"🧾", content:"GST TAX INVOICE\n===============\n\nFROM (Seller):\nName: _______________\nGSTIN: _______________\n\nTO (Buyer):\nName: _______________\n\nInvoice No: INV-___  |  Date: _______________\n\n| Description | Qty | Rate | Amount |\n|-------------|-----|------|--------|\n\nSubtotal: ₹_______________\nCGST @ ___% : ₹_______________\nSGST @ ___% : ₹_______________\nTOTAL: ₹_______________" },
];

export const WIZARD_STEPS = [
  { id:"w1", title:"Business Type", icon:"🎯", fields:[
    { id:"btype", label:"What does your business do?", type:"select" as const, required:true, options:BUSINESS_TYPES },
    { id:"workers", label:"How many workers (including yourself)?", type:"select" as const, required:true, options:["Just me (solo)","2–4 people","5–9 people","10–19 people","20 or more"] },
  ]},
  { id:"w2", title:"Turnover & Location", icon:"💰", fields:[
    { id:"turnover", label:"Expected annual sales/income", type:"select" as const, required:true, options:["Under ₹10 lakh","₹10–40 lakh","₹40 lakh–1 Crore","Above ₹1 Crore"] },
    { id:"state", label:"Which state is your business in?", type:"select" as const, required:true, options:STATES },
  ]},
  { id:"w3", title:"Your Required Registrations", icon:"📋", summary:true as const },
  { id:"w4", title:"You're Ready!", icon:"🎉", final:true as const },
];

// Tag color mapping
export const TAG_COLORS: Record<string, string> = {
  Registration: "bg-sage/20 text-sage",
  Tax: "bg-amber/20 text-amber",
  License: "bg-sky/20 text-sky",
  Labour: "bg-clay/20 text-clay",
  Loan: "bg-sky/20 text-sky",
  "Grant+Loan": "bg-sage/20 text-sage",
  Grant: "bg-amber/20 text-amber",
  Subsidy: "bg-sage/20 text-sage",
  "Micro-Loan": "bg-clay/20 text-clay",
  Schemes: "bg-amber/20 text-amber",
  gst: "bg-amber/20 text-amber",
  tax: "bg-amber/20 text-amber",
  license: "bg-sky/20 text-sky",
  other: "bg-sage/20 text-sage",
};

export const getTagClasses = (tag: string) => TAG_COLORS[tag] || "bg-earth/20 text-earth";

// Search index
export interface SearchResult {
  type: string; title: string; body: string; go: string;
}

export const buildSearchIndex = (): SearchResult[] => {
  const idx: SearchResult[] = [];
  CHECKLIST.forEach(c => idx.push({ type:"Checklist", title:c.title, body:c.desc, go:"checklist" }));
  SCHEMES.forEach(s => idx.push({ type:"Scheme", title:s.name, body:`${s.who} — ${s.amount}`, go:"schemes" }));
  GLOSSARY.forEach(g => idx.push({ type:"Glossary", title:g.term, body:g.def, go:"learn" }));
  FAQ.forEach(f => idx.push({ type:"FAQ", title:f.q, body:f.a, go:"learn" }));
  TEMPLATES.forEach(t => idx.push({ type:"Template", title:t.name, body:"Download ready-to-use template", go:"wizard" }));
  WHATS_NEW.forEach(n => idx.push({ type:"Update", title:n.title, body:n.body, go:"home" }));
  return idx;
};