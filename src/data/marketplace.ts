import phone from "@/assets/p-phone.jpg";
import tv from "@/assets/p-tv.jpg";
import laptop from "@/assets/p-laptop.jpg";
import fabric from "@/assets/p-fabric.jpg";
import kitchen from "@/assets/p-kitchen.jpg";
import audio from "@/assets/p-audio.jpg";

export type Shop = {
  id: string;
  name: string;
  location: string;
  verified: boolean;
  trustScore: number;
  followers: number;
  years: number;
  rating: number;
  about: string;
  hours: string;
  responseMins: number;
  completedSales: number;
};

export type Product = {
  id: string;
  name: string;
  category: string;
  image: string;
  retail: number;
  wholesale: number;
  bulkFrom: number;
  stock: number;
  rating: number;
  reviews: number;
  warrantyMonths: number;
  deliveryDays: number;
  deliveryCost: number;
  authenticity: "Verified original" | "Grade A copy" | "Refurbished";
  shopId: string;
  specs: Record<string, string>;
  pros: string[];
  cons: string[];
  aiScore: number;
  aiVerdict: string;
  tag?: string;
};

export const shops: Shop[] = [
  {
    id: "kikubo-electronics",
    name: "Kikubo Electronics Hub",
    location: "Nakivubo Road, Kikubo",
    verified: true,
    trustScore: 94,
    followers: 12480,
    years: 7,
    rating: 4.8,
    about:
      "Wholesale and retail electronics dealer on Nakivubo Road. Original stock with importer receipts, warranty on every unit.",
    hours: "Mon-Sat, 7:30am - 7:00pm",
    responseMins: 4,
    completedSales: 18420,
  },
  {
    id: "nakasero-textiles",
    name: "Nakasero Textiles",
    location: "Ben Kiwanuka Street",
    verified: true,
    trustScore: 88,
    followers: 6320,
    years: 11,
    rating: 4.6,
    about: "Bolt fabric wholesalers supplying tailors across Uganda since 2014.",
    hours: "Mon-Sat, 8:00am - 6:00pm",
    responseMins: 9,
    completedSales: 9310,
  },
  {
    id: "kampala-home",
    name: "Kampala Home & Kitchen",
    location: "Kikubo Lane",
    verified: false,
    trustScore: 71,
    followers: 2140,
    years: 2,
    rating: 4.2,
    about: "Kitchenware and household goods in bulk cartons at market rates.",
    hours: "Mon-Sun, 8:00am - 8:00pm",
    responseMins: 22,
    completedSales: 1870,
  },
];

export const categories = [
  { name: "Electronics", icon: "Smartphone", count: 4820 },
  { name: "Fashion & Fabric", icon: "Shirt", count: 3160 },
  { name: "Home & Kitchen", icon: "CookingPot", count: 2740 },
  { name: "Computing", icon: "Laptop", count: 1890 },
  { name: "Audio", icon: "Headphones", count: 1210 },
  { name: "Building", icon: "Hammer", count: 980 },
  { name: "Beauty", icon: "Sparkles", count: 1640 },
  { name: "Agriculture", icon: "Sprout", count: 760 },
];

export const products: Product[] = [
  {
    id: "sm-a35",
    name: "Samsung Galaxy A35 5G — 256GB",
    category: "Electronics",
    image: phone,
    retail: 780000,
    wholesale: 705000,
    bulkFrom: 5,
    stock: 42,
    rating: 4.7,
    reviews: 218,
    warrantyMonths: 12,
    deliveryDays: 1,
    deliveryCost: 8000,
    authenticity: "Verified original",
    shopId: "kikubo-electronics",
    specs: {
      Display: "6.6\" Super AMOLED 120Hz",
      Battery: "5000mAh",
      Storage: "256GB / 8GB RAM",
      Camera: "50MP OIS",
    },
    pros: ["Sealed with importer receipt", "12-month shop warranty", "Best battery in its price band"],
    cons: ["No charger in box", "Limited colour stock"],
    aiScore: 92,
    aiVerdict:
      "Best overall pick under UGX 800,000 — original stock, real warranty, and the strongest battery-to-price ratio in Kikubo right now.",
    tag: "AI top pick",
  },
  {
    id: "hisense-43",
    name: "Hisense 43\" Smart TV — A6 Series",
    category: "Electronics",
    image: tv,
    retail: 1150000,
    wholesale: 1020000,
    bulkFrom: 3,
    stock: 18,
    rating: 4.5,
    reviews: 143,
    warrantyMonths: 24,
    deliveryDays: 2,
    deliveryCost: 25000,
    authenticity: "Verified original",
    shopId: "kikubo-electronics",
    specs: {
      Panel: "43\" 4K UHD",
      OS: "VIDAA Smart",
      Ports: "3x HDMI, 2x USB",
      Power: "Wide voltage 110-240V",
    },
    pros: ["24-month warranty", "Handles unstable power", "Free wall bracket"],
    cons: ["Heavier delivery fee", "Sound is average without a bar"],
    aiScore: 87,
    aiVerdict: "Cheapest genuine 4K panel with a 2-year warranty from a verified seller.",
    tag: "Top deal",
  },
  {
    id: "hp-probook",
    name: "HP ProBook 450 G9 — i5 / 16GB",
    category: "Computing",
    image: laptop,
    retail: 3250000,
    wholesale: 3010000,
    bulkFrom: 3,
    stock: 11,
    rating: 4.6,
    reviews: 96,
    warrantyMonths: 12,
    deliveryDays: 1,
    deliveryCost: 10000,
    authenticity: "Verified original",
    shopId: "kikubo-electronics",
    specs: {
      CPU: "Intel Core i5-1235U",
      RAM: "16GB DDR4",
      Storage: "512GB NVMe SSD",
      Screen: "15.6\" FHD",
    },
    pros: ["Business-grade build", "Upgradeable RAM slot", "Genuine Windows 11 Pro"],
    cons: ["No dedicated GPU", "Only 11 units left"],
    aiScore: 89,
    aiVerdict: "Strongest value business laptop — pay ~7% less per unit when buying three or more.",
  },
  {
    id: "wax-print",
    name: "African Wax Print Bolt — 6 yards",
    category: "Fashion & Fabric",
    image: fabric,
    retail: 95000,
    wholesale: 72000,
    bulkFrom: 10,
    stock: 320,
    rating: 4.8,
    reviews: 412,
    warrantyMonths: 0,
    deliveryDays: 1,
    deliveryCost: 6000,
    authenticity: "Verified original",
    shopId: "nakasero-textiles",
    specs: {
      Length: "6 yards per bolt",
      Material: "100% cotton wax",
      Width: "48 inches",
      Origin: "Imported",
    },
    pros: ["24% cheaper at 10+ bolts", "Colour-fast dye", "Mixed pattern packs allowed"],
    cons: ["No returns on cut fabric"],
    aiScore: 90,
    aiVerdict: "Best margin for tailors — bulk price beats the Kikubo street average by 18%.",
    tag: "Trending",
  },
  {
    id: "steel-pots",
    name: "Stainless Steel Cookware Set — 12 pieces",
    category: "Home & Kitchen",
    image: kitchen,
    retail: 420000,
    wholesale: 365000,
    bulkFrom: 4,
    stock: 64,
    rating: 4.3,
    reviews: 87,
    warrantyMonths: 6,
    deliveryDays: 2,
    deliveryCost: 15000,
    authenticity: "Grade A copy",
    shopId: "kampala-home",
    specs: {
      Pieces: "12",
      Material: "304 stainless steel",
      Base: "Induction compatible",
      Packaging: "Gift carton",
    },
    pros: ["Popular wedding gift item", "Induction ready"],
    cons: ["Seller not yet verified", "Slower reply times"],
    aiScore: 68,
    aiVerdict: "Good price, but the seller is unverified with a 71 trust score — pay on delivery.",
  },
  {
    id: "anc-headphones",
    name: "Wireless ANC Headphones + Earbuds Bundle",
    category: "Audio",
    image: audio,
    retail: 185000,
    wholesale: 152000,
    bulkFrom: 6,
    stock: 130,
    rating: 4.4,
    reviews: 265,
    warrantyMonths: 6,
    deliveryDays: 1,
    deliveryCost: 6000,
    authenticity: "Grade A copy",
    shopId: "kikubo-electronics",
    specs: {
      Battery: "40h playback",
      ANC: "Hybrid active",
      Codec: "AAC / SBC",
      Bundle: "Headphones + TWS earbuds",
    },
    pros: ["Two devices in one box", "Strong resale margin"],
    cons: ["Not a branded original", "ANC is mild"],
    aiScore: 74,
    aiVerdict: "Fine for resale volume, not for buyers who insist on branded originals.",
  },
];

export const videoFeed = [
  {
    id: "v1",
    shopId: "kikubo-electronics",
    productId: "sm-a35",
    caption: "Unboxing today's Galaxy A35 stock — sealed, receipts included. Wholesale from 5 units.",
    likes: 4820,
    comments: 213,
    shares: 96,
    hue: 62,
  },
  {
    id: "v2",
    shopId: "nakasero-textiles",
    productId: "wax-print",
    caption: "New wax print arrivals. 10 bolts and up goes for UGX 72,000 each.",
    likes: 9130,
    comments: 401,
    shares: 288,
    hue: 20,
  },
  {
    id: "v3",
    shopId: "kikubo-electronics",
    productId: "hisense-43",
    caption: "Testing every Hisense panel before it leaves the shop. 2-year warranty.",
    likes: 2740,
    comments: 118,
    shares: 54,
    hue: 190,
  },
  {
    id: "v4",
    shopId: "kampala-home",
    productId: "steel-pots",
    caption: "12-piece cookware sets, cartons of 4. Perfect for the wedding season.",
    likes: 1560,
    comments: 74,
    shares: 31,
    hue: 150,
  },
];

export const testimonials = [
  {
    name: "Aisha Nakato",
    role: "Retailer, Mbale",
    quote:
      "I used to travel to Kikubo every two weeks. Now I compare five wholesalers on my phone and the goods reach Mbale the next morning.",
  },
  {
    name: "Ronald Sekitto",
    role: "Shop owner, Nakivubo Road",
    quote:
      "The trust score changed everything. Buyers upcountry send deposits without meeting me because the platform vouches for my record.",
  },
  {
    name: "Grace Amongin",
    role: "Boutique owner, Gulu",
    quote:
      "I asked the assistant for the cheapest original fabric under 80,000 and it found a bolt price I had never seen before.",
  },
];

export const faqs = [
  {
    q: "How does the AI shopping assistant decide what to recommend?",
    a: "It weighs price, seller trust score, verified authenticity, warranty length, delivery cost and time, review sentiment, and recent sales volume — then explains the trade-offs instead of just listing results.",
  },
  {
    q: "Are wholesale prices visible to everyone?",
    a: "Retail prices are public. Wholesale tiers unlock once you set a minimum order quantity, and each shop sets its own bulk break points.",
  },
  {
    q: "How is the Trust Score calculated?",
    a: "Verification status, customer ratings, years on the platform, completed sales, delivery performance, response speed, return history, and any fraud reports.",
  },
  {
    q: "How does delivery work?",
    a: "After checkout you request a rider, see live tracking and an ETA, and confirm with proof of delivery. Scheduled and consolidated upcountry deliveries are supported.",
  },
  {
    q: "Which areas do you cover today?",
    a: "Kikubo and greater Kampala first, then major upcountry towns, then East Africa.",
  },
];

export const ugx = (n: number) => `UGX ${n.toLocaleString("en-UG")}`;

export const getShop = (id: string) => shops.find((s) => s.id === id);
export const getProduct = (id: string) => products.find((p) => p.id === id);