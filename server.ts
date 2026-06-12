import express from "express";
import path from "path";
import axios from "axios";
import dotenv from "dotenv";

// Load local environment variables
dotenv.config({ path: ".env.local" });
dotenv.config();

import { createServer as createViteServer } from "vite";
import { 
  connectDatabase, 
  getDestinations, 
  getDestinationByName, 
  updateDestinationCrowd, 
  initSeed,
  verifyAdminCredentials,
  createSession,
  validateSession,
  destroySession
} from "./src/db";

const app = express();
const PORT = parseInt(process.env.PORT || "3000", 10);

// Middleware to protect admin routes
async function requireAdmin(req: express.Request, res: express.Response, next: express.NextFunction) {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ error: "Unauthorized: Missing or invalid token format." });
    }

    const token = authHeader.split(" ")[1];
    const username = await validateSession(token);
    if (!username) {
      return res.status(401).json({ error: "Unauthorized: Session expired or invalid." });
    }

    (req as any).adminUser = username;
    next();
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
}

// Body parser middleware
app.use(express.json());

// Set up MongoDB Connection
connectDatabase();

// --- REST API ENDPOINTS ---

// 1. Get all destinations
app.get("/api/destinations", async (req, res) => {
  try {
    const list = await getDestinations();
    res.json(list);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// 2. Main simulated live crowding router status endpoint
// Generates a random crowdLevel, updates the database, and returns routing indicators
app.get("/api/check-crowd/:destinationName", async (req, res) => {
  try {
    const { destinationName } = req.params;
    const dest = await getDestinationByName(destinationName);

    if (!dest) {
      return res.status(404).json({ error: `Destination "${destinationName}" not found.` });
    }

    // Generate simulated dynamic crowd factor: random index +/- 20% bounds or pure randomized 0-100
    // To make fluctuation realistic, we range around current value or pure pseudo-random:
    const randomLevel = Math.floor(Math.random() * 101);
    const updated = await updateDestinationCrowd(dest.name, randomLevel);

    if (!updated) {
      return res.status(404).json({ error: "Could not update destination status." });
    }

    // Determine target location for the route depending on overtourism state
    const isRedirected = updated.isCrowded;
    const currentDestinationName = isRedirected ? updated.alternativeDestination : updated.name;

    res.json({
      primaryDestination: updated.name,
      alternativeDestination: updated.alternativeDestination,
      currentDestinationName,
      isRedirected,
      crowdLevel: updated.crowdLevel,
      isCrowded: updated.isCrowded,
      timestamp: new Date().toISOString()
    });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// --- ADMIN AUTHENTICATION API ENDPOINTS ---

// Admin Login
app.post("/api/admin/login", async (req, res) => {
  try {
    const { username, password } = req.body;
    if (!username || !password) {
      return res.status(400).json({ error: "Username and password are required." });
    }

    const isValid = await verifyAdminCredentials(username, password);
    if (!isValid) {
      return res.status(401).json({ error: "Invalid username or password." });
    }

    const token = await createSession(username);
    res.json({ token, username });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// Admin Logout
app.post("/api/admin/logout", async (req, res) => {
  try {
    const authHeader = req.headers.authorization;
    if (authHeader && authHeader.startsWith("Bearer ")) {
      const token = authHeader.split(" ")[1];
      await destroySession(token);
    }
    res.json({ success: true, message: "Logged out successfully." });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// Verify session status
app.get("/api/admin/me", requireAdmin, async (req, res) => {
  res.json({ username: (req as any).adminUser });
});

// 3. Absolute manual control override endpoint
// Lets the user set an exact crowd density in the UI (e.g. 90% or 40%) to verify transitions
app.post("/api/set-crowd", requireAdmin, async (req, res) => {
  try {
    const { name, crowdLevel } = req.body;
    if (name === undefined || crowdLevel === undefined) {
      return res.status(400).json({ error: "Missing name or crowdLevel parameter." });
    }

    const val = Number(crowdLevel);
    if (isNaN(val) || val < 0 || val > 100) {
      return res.status(400).json({ error: "Crowd density must be a integer value between 0 and 100." });
    }

    const updated = await updateDestinationCrowd(name, val);
    if (!updated) {
      return res.status(404).json({ error: `Destination "${name}" was not found.` });
    }

    const isRedirected = updated.isCrowded;
    const currentDestinationName = isRedirected ? updated.alternativeDestination : updated.name;

    res.json({
      primaryDestination: updated.name,
      alternativeDestination: updated.alternativeDestination,
      currentDestinationName,
      isRedirected,
      crowdLevel: updated.crowdLevel,
      isCrowded: updated.isCrowded,
      timestamp: new Date().toISOString()
    });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// 3.5. Traffic Proxy Metric API utilizing Google Maps Routes API (v2)
app.post("/api/check-congestion", async (req, res) => {
  try {
    const apiKey = process.env.GOOGLE_MAPS_API_KEY || "YOUR_API_KEY_PLACEHOLDER";
    
    // Prepare the Google Maps computeRoutes payload
    const payload = {
      origin: {
        address: "Dambulla, Sri Lanka"
      },
      destination: {
        address: "Sigiriya Rock Fortress, Sri Lanka"
      },
      travelMode: "DRIVE",
      routingPreference: "TRAFFIC_AWARE_OPTIMAL"
    };

    let durationStr = "1500s";
    let staticDurationStr = "1100s";
    let apiSuccess = false;

    // Execute real API call if key is available
    if (apiKey && apiKey !== "YOUR_API_KEY_PLACEHOLDER") {
      try {
        const response = await axios.post(
          "https://routes.googleapis.com/directions/v2:computeRoutes",
          payload,
          {
            headers: {
              "Content-Type": "application/json",
              "X-Goog-Api-Key": apiKey,
              "X-Goog-FieldMask": "routes.duration,routes.staticDuration"
            }
          }
        );
        
        if (response.data && response.data.routes && response.data.routes[0]) {
          const firstRoute = response.data.routes[0];
          durationStr = firstRoute.duration || "1500s";
          staticDurationStr = firstRoute.staticDuration || "1105s";
          apiSuccess = true;
        }
      } catch (axErr: any) {
        console.warn("Real Routes API (v2) failed (key might be placeholder). Using local fallback: ", axErr.message);
      }
    }

    if (!apiSuccess) {
      // Simulate traffic conditions: staticDuration is ~18 min empty roadway (1100s),
      // duration fluctuates, making ratio exceed 1.25 on random congestion surges
      const staticVal = 1100;
      // fluctuates from 1.05 up to 1.45 (so sometimes above 1.25)
      const factor = 1.05 + Math.random() * 0.40;
      const liveVal = Math.round(staticVal * factor);
      durationStr = `${liveVal}s`;
      staticDurationStr = `${staticVal}s`;
    }

    // Strip "s" suffix and parse directly into integers
    const duration = parseInt(durationStr.replace("s", ""), 10);
    const staticDuration = parseInt(staticDurationStr.replace("s", ""), 10);

    // Calculate the Congestion Ratio
    const ratio = duration / staticDuration;

    if (ratio > 1.25) {
      res.json({
        isCrowded: true,
        alternative: "Pidurangala & Lion Rocks viewpoint",
        ratio,
        duration,
        staticDuration
      });
    } else {
      res.json({
        isCrowded: false,
        destination: "Sigiriya Rock Fortress",
        ratio,
        duration,
        staticDuration
      });
    }
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// 4. Restart database or values back to seeded clean state
app.post("/api/reset", requireAdmin, async (req, res) => {
  try {
    await initSeed();
    const list = await getDestinations();
    res.json({ message: "Seeded state restored successfully", list });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// --- VITE DEV MIDDLEWARE AND SERVING ---
async function mountVite() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
    console.log("⚡ Vite development middleware injected successfully.");
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
    console.log("📦 Serving production unified static assets from /dist.");
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`🌍 Server successfully established on http://0.0.0.0:${PORT}`);
  });
}

mountVite().catch((err) => {
  console.error("☠️ Failed to mount server asset pipeline:", err);
});
