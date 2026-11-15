const fs = require("fs");
const path = require("path");

const DATA_DIR = process.env.DATA_DIR || __dirname;
const DB = path.join(DATA_DIR, "data.json");
const db = fs.existsSync(DB)
  ? JSON.parse(fs.readFileSync(DB, "utf8"))
  : { views: 0, services: [], media: [] };

const list = [
  ["WiFi Settings", "Router setup, WiFi password change, signal aur speed ke masail ka hal."],
  ["Accounts Backup & Recovery", "Gmail, Facebook aur dusre accounts ka backup aur recover karne mein madad."],
  ["Accounts Security", "Strong password, two-step verification aur account hacking se bachao."],
  ["Mobile Security", "Mobile ko virus, fake apps aur data chori se mehfooz banana."],
  ["PC & Laptop Errors", "Slow chalna, hang hona, Windows errors aur hardware masail ki jaanch."],
  ["Software Problems", "Software install na hona, crash hona aur settings ke masail ka hal."],
  ["Web Development", "HTML, CSS aur JavaScript se tez, mobile-friendly aur professional websites."],
  ["Database Services", "Database design, setup aur data ko sahi tarah organize karna."],
  ["Ethical Hacking (CEH)", "Malik ki likhi ijazat ke sath website aur network ki security jaanch."],
  ["WordPress", "WordPress website setup, theme customization aur maintenance."],
  ["Video Editing", "Social media, business aur personal videos ki professional editing."]
];

let added = 0;
list.forEach(([title, text], i) => {
  if (!db.services.some(s => s.title === title)) {
    db.services.push({ id: (Date.now() + i).toString(), title, text });
    added++;
  }
});
fs.writeFileSync(DB, JSON.stringify(db, null, 2));
console.log(added + " services add hui");