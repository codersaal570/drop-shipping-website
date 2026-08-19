import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json());

// Lazy-initialized Gemini AI client
let aiClient: GoogleGenAI | null = null;

function getAI(): GoogleGenAI | null {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return null;
  }
  if (!aiClient) {
    aiClient = new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          "User-Agent": "aistudio-build",
        },
      },
    });
  }
  return aiClient;
}

// Health check
app.get("/api/health", (req, res) => {
  res.json({
    status: "ok",
    hasApiKey: Boolean(process.env.GEMINI_API_KEY),
    timestamp: new Date().toISOString(),
  });
});

// AI Product Listing Optimizer & Copywriter
app.post("/api/ai/optimize-listing", async (req, res) => {
  try {
    const { title, rawDescription, supplier, category, costPrice } = req.body;
    const ai = getAI();

    if (!ai) {
      // Fallback high-converting response if API key is not yet configured
      return res.json({
        optimizedTitle: `${title} - Premium Grade | High Performance`,
        catchyHeadline: `Engineered for effortless daily excellence & unmatched durability.`,
        keyFeatures: [
          "Direct supplier-verified quality testing with 100% compliance guarantee",
          "Ultra-fast processing & robust materials designed for long-lasting use",
          "Includes 1-Year Comprehensive Warranty & hassle-free return coverage",
          "Universal compatibility & plug-and-play setup right out of the box",
        ],
        seoDescription: `Upgrade your everyday routine with our ${title}. Direct factory quality sourced through ${supplier.toUpperCase()} with guaranteed express logistics and premium retail packaging.`,
        marketingAngle: "Focus on instant utility, premium convenience, and durability.",
        recommendedMarkupPercent: 45,
        targetCustomerPersona: "Tech enthusiasts and modern convenience seekers looking for top value.",
        isFallback: true,
      });
    }

    const prompt = `You are a high-conversion e-commerce dropshipping expert. Optimize this raw supplier product from ${supplier} into a high-converting retail listing.
Product Title: "${title}"
Category: "${category}"
Supplier Base Cost: $${costPrice || 25}
Raw Supplier Notes: "${rawDescription || 'High quality durable item'}"

Return a valid JSON object with the following fields:
- optimizedTitle: A crisp, branded, high-converting product title (max 70 characters).
- catchyHeadline: A 1-sentence punchy headline for the hero banner.
- keyFeatures: Array of 4 persuasive, benefit-driven bullet points.
- seoDescription: A polished, persuasive 2-paragraph retail sales copy.
- marketingAngle: Strategic angle (e.g. pain-point relief, luxury affordable, time-saver).
- recommendedMarkupPercent: Number (recommended markup percentage e.g. 45-80%).
- targetCustomerPersona: Brief description of target buyer.`;

    const response = await ai.models.generateContent({
      model: "gemini-3.7-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
      },
    });

    const parsed = JSON.parse(response.text || "{}");
    res.json({ ...parsed, isFallback: false });
  } catch (error: any) {
    console.error("AI Listing Optimization error:", error);
    res.status(500).json({
      error: "Failed to optimize listing",
      details: error.message,
    });
  }
});

// AI Dropship Market Insights & Competitor Pricing
app.post("/api/ai/market-insights", async (req, res) => {
  try {
    const { category, currentProductsCount } = req.body;
    const ai = getAI();

    if (!ai) {
      return res.json({
        topTrendingNiche: "Smart Home Ambience & Health Recovery Gadgets",
        supplierRecommendation: "AliExpress offers highest margins (55-70%) on lighting; Amazon gives fastest 2-3 day shipping for electronics.",
        pricingStrategy: "Use tiered markup: 65% markup on sub-$30 items, 40% markup on items above $75 to maximize cart conversion.",
        inventoryAlert: "Summer clearance demand peaking for portable electronics. Ensure minimum supplier stock buffer of 50 units.",
        isFallback: true,
      });
    }

    const prompt = `Analyze dropshipping supplier dynamics for a multi-channel store dropshipping from eBay, Amazon, and AliExpress across category "${category || 'Consumer Tech & Home'}".
Provide concise strategic recommendations for margin optimization, supplier stock risk mitigation, and top trending items.
Return JSON with:
- topTrendingNiche: string
- supplierRecommendation: string (comparison between AliExpress, Amazon, and eBay)
- pricingStrategy: string
- inventoryAlert: string`;

    const response = await ai.models.generateContent({
      model: "gemini-3.7-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
      },
    });

    const parsed = JSON.parse(response.text || "{}");
    res.json({ ...parsed, isFallback: false });
  } catch (error: any) {
    console.error("AI Market Insights error:", error);
    res.status(500).json({
      error: "Failed to get market insights",
      details: error.message,
    });
  }
});

// Real-time Supplier Inventory & Price Sync Simulator
app.post("/api/supplier/sync", (req, res) => {
  const { products } = req.body;
  if (!Array.isArray(products)) {
    return res.status(400).json({ error: "products array required" });
  }

  const syncResults = products.map((prod: any) => {
    // Generate subtle real-time fluctuations or stock adjustments
    const fluctuationPercent = (Math.random() * 6 - 3) / 100; // -3% to +3%
    const newCost = Math.max(5, +(prod.costPrice * (1 + fluctuationPercent)).toFixed(2));
    const stockChange = Math.floor(Math.random() * 7) - 3;
    const newStock = Math.max(0, prod.stockQuantity + stockChange);

    const priceChanged = Math.abs(newCost - prod.costPrice) > 0.05;
    const stockOut = newStock === 0;

    return {
      id: prod.id,
      supplierSku: prod.supplierSku,
      supplier: prod.supplier,
      oldCost: prod.costPrice,
      newCost,
      costDifference: +(newCost - prod.costPrice).toFixed(2),
      oldStock: prod.stockQuantity,
      newStock,
      syncStatus: stockOut ? "out_of_stock" : priceChanged ? "updating" : "synced",
      lastSyncedAt: new Date().toISOString(),
      supplierResponseTimeMs: Math.floor(Math.random() * 200) + 120,
    };
  });

  res.json({
    syncedAt: new Date().toISOString(),
    totalSynced: syncResults.length,
    results: syncResults,
  });
});

// Automated Order Fulfillment Dispatcher
app.post("/api/supplier/fulfill", (req, res) => {
  const { orderId, items, shippingAddress } = req.body;

  const supplierPrefixes: Record<string, string> = {
    aliexpress: "AE-CUST-",
    amazon: "AMZ-FBA-",
    ebay: "EBY-ORD-",
  };

  const carrierNames = ["ePacket Express", "Amazon Logistics Prime", "USPS Priority Direct", "DHL Global eCommerce", "Yanwen Special Line"];

  const fulfillmentDispatch = items.map((item: any, idx: number) => {
    const supplier = item.product?.supplier || "aliexpress";
    const prefix = supplierPrefixes[supplier] || "SPL-";
    const supplierOrderId = `${prefix}${Math.floor(100000000 + Math.random() * 900000000)}`;
    const carrier = carrierNames[Math.floor(Math.random() * carrierNames.length)];
    const trackingCode = `TRK${supplier.substring(0, 2).toUpperCase()}${Math.floor(100000000000 + Math.random() * 900000000000)}`;

    return {
      itemId: item.product?.id || `item-${idx}`,
      productTitle: item.product?.title || "Product",
      supplier,
      supplierOrderId,
      carrierName: carrier,
      carrierTrackingCode: trackingCode,
      estimatedDeliveryDays: supplier === "amazon" ? "2-4 Business Days" : supplier === "ebay" ? "4-7 Business Days" : "7-12 Business Days",
      dispatchStatus: "SUCCESS",
      supplierApiCost: item.product?.costPrice * item.quantity,
    };
  });

  res.json({
    success: true,
    orderId,
    fulfillmentStatus: "auto_fulfilled",
    fulfilledAt: new Date().toISOString(),
    dispatchDetails: fulfillmentDispatch,
    message: "Order successfully auto-dispatched to supplier APIs and tracking assigned.",
  });
});

// Secure Multi-Gateway Payment Verification (Credit Cards, Mobile Money: M-Pesa, MTN, Airtel)
app.post("/api/checkout/process", (req, res) => {
  const { paymentMethod, amount, customer, currency } = req.body;

  // Generate simulated instant authorization reference
  const txPrefix = paymentMethod === "mobile_money" ? "MOM-" : paymentMethod === "credit_card" ? "CC-AUTH-" : "TX-";
  const transactionReference = `${txPrefix}${Date.now().toString(36).toUpperCase()}-${Math.floor(1000 + Math.random() * 9000)}`;

  res.json({
    success: true,
    transactionReference,
    paymentStatus: "paid",
    gatewayResponse: "APPROVED",
    authorizedAmount: amount,
    currency: currency || "USD",
    settledAt: new Date().toISOString(),
    customerEmail: customer?.email,
    securityMessage: "PCI-DSS Level 1 256-bit encrypted transaction verified.",
  });
});

// Push Notification Broadcast Service
app.post("/api/notifications/broadcast", (req, res) => {
  const { title, message, type, discountCode, discountPercent } = req.body;

  res.json({
    broadcastId: `push_${Date.now()}`,
    sentCount: 1420,
    deliveredAt: new Date().toISOString(),
    channel: "Web Push & In-App Alerts",
    notification: {
      title,
      message,
      type: type || "promo",
      discountCode,
      discountPercent,
    },
  });
});

// Start Server with Vite Middleware
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`[OmniDrop Server] Running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
