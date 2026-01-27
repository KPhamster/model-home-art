// Business configuration - Edit these values for the business
export const businessConfig = {
  // Business Identity
  name: "Model Home Art",
  tagline: "Custom framing that looks high-end — without the high-end price.",
  
  // Contact Information
  address: {
    street: "2550 S. Fairview St.",
    city: "Santa Ana",
    state: "CA",
    zip: "92704",
    full: "2550 S. Fairview St., Santa Ana, CA 92704",
  },
  phone: "(714) 878-2919",
  email: "modelhomeart@gmail.com",
  
  // Hours
  hours: {
    display: "Mon-Sat: 10am-5pm, Sun: Closed",
    structured: [
      { days: "Monday - Saturday", hours: "10:00 AM - 5:00 PM" },
      { days: "Sunday", hours: "Closed" },
    ],
  },
  
  // Service Area
  serviceArea: "Orange County, CA and nationwide in the United States",
  
  // Response Time
  responseTime: "24 business hours",
  
  // Google Maps
  googleMapsUrl: "https://www.google.com/maps/search/Model+Home+Art,+2550+S+Fairview+St,+Santa+Ana,+CA+92704",
  googleMapsEmbedUrl: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3316.8765309843547!2d-117.91041092346794!3d33.713059973374116!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x80dcd8bbe8e1473f%3A0xb691ed8e254c5162!2sModel%20Home%20Art!5e0!3m2!1sen!2sus!4v1737000000000!5m2!1sen!2sus",
  
  // Social Links
  social: {
    instagram: "https://instagram.com/modelhomeart",
    facebook: "https://facebook.com/modelhomeart",
    yelp: "https://yelp.com/biz/model-home-art",
    google: "https://g.page/modelhomeart",
  },
  
  // Shipping
  shipping: {
    freeThreshold: 15000, // $150 in cents
    standardRate: 999, // $9.99 in cents
    processingDays: "3-5 business days",
    deliveryDays: "5-7 business days",
  },
  
  // Meta/SEO
  seo: {
    title: "Model Home Art | Custom Framing in Orange County, CA and nationwide in the United States",
    description: "Budget-friendly custom framing in Orange County, CA that delivers nationwide in the United States. We frame art, photos, jerseys, diplomas, mirrors & more. Visit our shop or get a fast quote online. Delivery & installation available.",
    keywords: "custom framing, picture framing, Orange County, CA, jersey framing, diploma framing, art framing, affordable framing, nationwide, United States",
  },
} as const;

// Categories for what we frame
export const framingCategories = [
  { id: "jerseys", name: "Jerseys", icon: "shirt" },
  { id: "mirrors", name: "Mirrors", icon: "square" },
  { id: "diplomas", name: "Diplomas & Paper Items", icon: "scroll" },
  { id: "fine-art", name: "Fine Art", icon: "palette" },
  { id: "posters", name: "Posters & Prints", icon: "image" },
  { id: "photos", name: "Photos", icon: "camera" },
  { id: "canvas", name: "Canvas Stretching", icon: "frame" },
  { id: "needlework", name: "Needlework & Textiles", icon: "scissors" },
  { id: "shadowboxes", name: "Shadowboxes & Memorabilia", icon: "box" },
  { id: "other", name: "And more — ask us!", icon: "plus" },
] as const;

// Extended list for What We Frame page
export const extendedFramingCategories = [
  ...framingCategories.slice(0, -1),
  { id: "medals", name: "Medals & Awards", icon: "medal" },
  { id: "vinyl", name: "Vinyl Records & Album Art", icon: "disc" },
  { id: "baby", name: "Baby Keepsakes", icon: "baby" },
  { id: "wedding", name: "Wedding Items", icon: "heart" },
  { id: "military", name: "Military Memorabilia", icon: "shield" },
  { id: "sports", name: "Sports Equipment", icon: "trophy" },
  { id: "documents", name: "Important Documents", icon: "file" },
  { id: "maps", name: "Maps & Blueprints", icon: "map" },
  { id: "flags", name: "Flags & Banners", icon: "flag" },
] as const;

// Services list
export const services = [
  {
    id: "custom-framing",
    name: "Custom Framing",
    description: "Professional custom framing for any item",
    icon: "frame",
  },
  {
    id: "ready-made",
    name: "Ready-Made Frames",
    description: "Beautiful art in quality frames — ready to ship!",
    icon: "package",
  },
  {
    id: "canvas-printing",
    name: "Canvas Printing",
    description: "Print any image on high-quality canvas",
    icon: "image",
  },
  {
    id: "preservation",
    name: "Preservation Framing",
    description: "Archival framing to protect valuable items",
    icon: "shield",
  },
  {
    id: "repairs",
    name: "Repairs & Re-framing",
    description: "Fix damaged frames or update existing pieces",
    icon: "wrench",
  },
  {
    id: "consultation",
    name: "Design Consultations",
    description: "Expert guidance on framing choices",
    icon: "message-circle",
  },
  {
    id: "delivery",
    name: "Delivery & Installation",
    description: "We deliver and hang your framed pieces",
    icon: "truck",
  },
  {
    id: "art-sales",
    name: "Art for Sale",
    description: "Curated art pieces ready to display",
    icon: "palette",
  },
] as const;

// Quote form options
export const quoteOptions = {
  categories: [
    "Photo",
    "Poster/Print",
    "Fine Art",
    "Diploma/Certificate",
    "Jersey",
    "Mirror",
    "Canvas",
    "Needlework/Textile",
    "Shadowbox/Memorabilia",
    "Other",
  ],
  styles: [
    { value: "modern", label: "Modern" },
    { value: "classic", label: "Classic" },
    { value: "minimal", label: "Minimal" },
    { value: "ornate", label: "Ornate" },
    { value: "not-sure", label: "Not sure — help me decide" },
  ],
  matting: [
    { value: "none", label: "No matting" },
    { value: "single", label: "Single mat" },
    { value: "double", label: "Double mat" },
    { value: "not-sure", label: "Not sure" },
  ],
  protection: [
    { value: "standard", label: "Standard glass" },
    { value: "upgraded", label: "Non-glare/UV glass" },
    { value: "preservation", label: "Museum/Preservation grade" },
    { value: "not-sure", label: "Not sure — advise me" },
  ],
  budget: [
    { value: "under-100", label: "Under $100" },
    { value: "100-250", label: "$100 – $250" },
    { value: "250-500", label: "$250 – $500" },
    { value: "500-plus", label: "$500+" },
    { value: "not-sure", label: "Not sure — show me options" },
  ],
  timeline: [
    { value: "standard", label: "Standard (2-3 weeks)" },
    { value: "rush", label: "Rush (1 week, may incur fee)" },
    { value: "no-deadline", label: "No deadline" },
  ],
  services: [
    { value: "pickup", label: "I'll pick up" },
    { value: "delivery", label: "Local delivery" },
    { value: "shipping", label: "Ship to me" },
    { value: "installation", label: "Delivery + Installation" },
  ],
  contactMethods: [
    { value: "email", label: "Email" },
    { value: "phone", label: "Phone call" },
    { value: "text", label: "Text message" },
  ],
} as const;

// Gallery categories
export const galleryCategories = [
  { id: "all", name: "All" },
  { id: "jerseys", name: "Jerseys" },
  { id: "diplomas", name: "Diplomas" },
  { id: "fine-art", name: "Fine Art" },
  { id: "posters", name: "Posters" },
  { id: "shadowboxes", name: "Shadowboxes" },
  { id: "before-after", name: "Before/After" },
  { id: "installations", name: "Installations" },
] as const;

// Business types we serve
export const businessTypes = [
  "Offices & Corporate Spaces",
  "Interior Designers & Decorators",
  "Hotels & Hospitality",
  "Home Builders & Developers",
  "Medical Offices & Healthcare",
  "Schools & Nonprofits",
  "Restaurants & Retail",
  "Real Estate Staging",
] as const;

// FAQ items
export const faqItems = [
  {
    question: "How much does custom framing cost?",
    answer: "Pricing depends on the size of your piece, frame style, matting, and glass type. We offer options for every budget — from affordable basics to premium preservation framing. Get a fast quote online and we'll provide options that fit your budget.",
  },
  {
    question: "Do you offer preservation or archival framing?",
    answer: "Yes! We offer museum-quality preservation framing with acid-free materials and UV-protective glass. This is ideal for valuable artwork, documents, or items you want to protect for generations.",
  },
  {
    question: "Can you deliver and install my framed pieces?",
    answer: "Absolutely. We offer delivery throughout the United States and professional installation. We'll hang your pieces exactly where you want them. Shipping is also available for ready-made frames and completed orders.",
  },
  {
    question: "Do you repair or re-frame existing pieces?",
    answer: "Yes, we can repair damaged frames, replace broken glass, and re-frame items in new frames. Bring your piece to our shop or upload photos for a repair quote.",
  },
  {
    question: "How long does custom framing take?",
    answer: "Standard turnaround is 2-3 weeks. Rush orders (1 week) are available for an additional fee. Ready-made frames ship within 3-5 business days.",
  },
  {
    question: "What should I bring to my appointment?",
    answer: "Bring the item you want framed, any inspiration photos, and an idea of your budget. If you're not sure about anything, our staff will guide you through the options.",
  },
] as const;
