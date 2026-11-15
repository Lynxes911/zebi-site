const express = require("express");
const multer = require("multer");
const fs = require("fs");
const path = require("path");

const app = express();
const PORT = process.env.PORT || 3000;

// Password code mein nahi, environment variable se aata hai
const ADMIN_PASS = process.env.ADMIN_PASS;
if (!ADMIN_PASS) {
  console.error("ADMIN_PASS set nahi hai. Pehle password set karein.");
  process.exit(1);
}

const DATA_DIR = process.env.DATA_DIR || __dirname;
const DB = path.join(DATA_DIR, "data.json");
const UPLOADS = path.join(DATA_DIR, "uploads");
fs.mkdirSync(UPLOADS, { recursive: true });

function load() {
  if (!fs.existsSync(DB)) {
    fs.writeFileSync(DB, JSON.stringify({ views: 0, services: [], media: [] }, null, 2));
  }
  return JSON.parse(fs.readFileSync(DB, "utf8"));
}
function save(d) { fs.writeFileSync(DB, JSON.stringify(d, null, 2)); }

// Admin login: username "admin", password ADMIN_PASS
function auth(req, res, next) {
  const h = req.headers.authorization || "";
  const raw = Buffer.from(h.split(" ")[1] || "", "base64").toString();
  const i = raw.indexOf(":");
  if (raw.slice(0, i) === "admin" && raw.slice(i + 1) === ADMIN_PASS) return next();
  res.set("WWW-Authenticate", 'Basic realm="Admin"').status(401).send("Login required");
}

// Upload: sirf image aur video, 100 MB tak
const ALLOWED = ["image/jpeg", "image/png", "image/webp", "image/gif", "video/mp4", "video/webm"];
const upload = multer({
  storage: multer.diskStorage({
    destination: UPLOADS,
    filename: (req, file, cb) => {
      const ext = path.extname(file.originalname).toLowerCase().replace(/[^.a-z0-9]/g, "");
      cb(null, Date.now() + ext);
    }
  }),
  limits: { fileSize: 100 * 1024 * 1024 },
  fileFilter: (req, file, cb) => cb(null, ALLOWED.includes(file.mimetype))
});

app.use(express.json());

// Public routes
app.get("/api/content", (req, res) => {
  const d = load();
  res.json({ services: d.services, media: d.media });
});
app.get("/api/views", (req, res) => res.json({ views: load().views }));
app.post("/api/view", (req, res) => {
  const d = load(); d.views += 1; save(d);
  res.json({ views: d.views });
});

// Admin routes
app.post("/api/services", auth, (req, res) => {
  const { title, text } = req.body;
  if (!title) return res.status(400).send("Title zaroori hai");
  const d = load();
  d.services.push({ id: Date.now().toString(), title, text: text || "" });
  save(d); res.json({ ok: true });
});
app.delete("/api/services/:id", auth, (req, res) => {
  const d = load();
  d.services = d.services.filter(s => s.id !== req.params.id);
  save(d); res.json({ ok: true });
});
app.post("/api/media", auth, upload.single("file"), (req, res) => {
  if (!req.file) return res.status(400).send("Sirf image ya video (mp4/webm) allowed hai");
  const d = load();
  d.media.push({
    id: Date.now().toString(),
    file: req.file.filename,
    type: req.file.mimetype.startsWith("video") ? "video" : "image",
    caption: req.body.caption || ""
  });
  save(d); res.json({ ok: true });
});
app.delete("/api/media/:id", auth, (req, res) => {
  const d = load();
  const m = d.media.find(x => x.id === req.params.id);
  if (m) fs.unlink(path.join(UPLOADS, m.file), () => {});
  d.media = d.media.filter(x => x.id !== req.params.id);
  save(d); res.json({ ok: true });
});

app.use("/admin", auth, express.static(path.join(__dirname, "admin")));
app.use("/uploads", express.static(UPLOADS));
app.use(express.static(path.join(__dirname, "public")));

app.listen(PORT, () => console.log("Site chal rahi hai: http://localhost:" + PORT));