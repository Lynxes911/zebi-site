const $ = id => document.getElementById(id);
const WHATSAPP = "923XXXXXXXXX"; // apna number: 92 se shuru, bina + aur bina 0 ke

// Services ke groups. Nayi service ka naam in lafzon se match kare to us group mein jati hai.
const GROUPS = [
  { name: "Tech Support", color: "#FF7A1A", keys: ["wifi", "pc", "laptop", "software", "error", "network"] },
  { name: "Security", color: "#0B7A6E", keys: ["account", "security", "mobile", "hacking", "ceh", "backup", "recovery"] },
  { name: "Web & Media", color: "#2563EB", keys: ["web", "database", "wordpress", "video", "design"] }
];
const OTHER = { name: "More Services", color: "#7C3AED", keys: [] };

function make(tag, cls, text) {
  const e = document.createElement(tag);
  if (cls) e.className = cls;
  if (text) e.textContent = text;
  return e;
}

function groupOf(title) {
  const t = title.toLowerCase();
  return GROUPS.find(g => g.keys.some(k => t.includes(k))) || OTHER;
}

async function init() {
  // View count: har naye visit par sirf ek baar
  if (!sessionStorage.getItem("seen")) {
    sessionStorage.setItem("seen", "1");
    await fetch("/api/view", { method: "POST" });
  }
  $("views").textContent = (await (await fetch("/api/views")).json()).views;

  const data = await (await fetch("/api/content")).json();

  // Services ko groups mein dikhana
  const box = $("cats");
  const all = [...GROUPS, OTHER];
  all.forEach(g => {
    const list = data.services.filter(s => groupOf(s.title) === g);
    if (!list.length) return;
    const card = make("div", "cat");
    card.style.borderTopColor = g.color;
    card.append(make("h3", "", g.name));
    list.forEach(s => {
      const row = make("div", "svc");
      row.append(make("b", "", s.title), make("span", "", s.text));
      card.append(row);
    });
    box.append(card);
  });
  if (!box.children.length) box.append(make("p", "", "Services jald add hongi."));

  // Images aur videos: agar nahi hain to section chhupa rehta hai
  const images = data.media.filter(m => m.type === "image");
  const videos = data.media.filter(m => m.type === "video");

  images.forEach(m => {
    const item = make("div", "item");
    const img = document.createElement("img");
    img.src = "/uploads/" + m.file; img.alt = m.caption; img.loading = "lazy";
    item.append(img, make("p", "", m.caption));
    $("images").append(item);
  });
  videos.forEach(m => {
    const item = make("div", "item");
    const vid = document.createElement("video");
    vid.src = "/uploads/" + m.file; vid.controls = true; vid.preload = "metadata";
    item.append(vid, make("p", "", m.caption));
    $("videosBox").append(item);
  });
  if (images.length) { $("work").hidden = false; $("navWork").hidden = false; }
  if (videos.length) { $("videos").hidden = false; $("navVideos").hidden = false; }
}

$("send").onclick = () => {
  const text = "Assalam o Alaikum. Mera naam " + $("n").value +
    ", city " + $("c").value + ". Masla: " + $("m").value;
  window.open("https://wa.me/" + WHATSAPP + "?text=" + encodeURIComponent(text), "_blank");
};

init();