(function () {
  const data = window.SLAYER_DATA;
  const londonNow = new Date(
    new Date().toLocaleString("en-GB", { timeZone: "Europe/London" })
  );

  function ymd(d) {
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, "0");
    const day = String(d.getDate()).padStart(2, "0");
    return y + "-" + m + "-" + day;
  }

  function startOfDay(d) {
    return Date.UTC(d.getFullYear(), d.getMonth(), d.getDate());
  }

  function pickSlayer(d) {
    const key = ymd(d);
    if (key === "2026-09-29") {
      return data.niches.find((n) => n.id === "lengthorn");
    }
    const epoch = startOfDay(new Date(2026, 8, 24));
    const today = startOfDay(d);
    const days = Math.floor((today - epoch) / 86400000);
    const idx = ((days % data.niches.length) + data.niches.length) % data.niches.length;
    return data.niches[idx];
  }

  const signalLabel = {
    mid: "\ud83d\udc26 Mid-market private",
    "mid-public": "\ud83d\udc26 Mid / public-law mix",
    access: "\ud83d\udc26 Access / pro bono track",
    mixed: "\ud83d\udc26 Mixed private + public education",
    "specialist-probono": "\ud83d\udc26 Specialist + pro bono programme"
  };

  const today = londonNow;
  const slayer = pickSlayer(today);
  const dateLabel = today.toLocaleDateString("en-GB", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: "Europe/London"
  });

  document.getElementById("clock").textContent =
    dateLabel + " \u00b7 London \u00b7 rotation locked to Europe/London calendar date.";

  document.getElementById("slayer-card").innerHTML = `
    <p class="eyebrow">Slayer of the Day \u00b7 ${dateLabel}</p>
    <p class="kicker" style="color:#f0d789;margin-bottom:8px">${escapeHtml(slayer.category)}</p>
    <h2>${escapeHtml(slayer.name)}</h2>
    <p class="offer">${escapeHtml(slayer.offer)}</p>
    <p class="why"><strong>Why today:</strong> ${escapeHtml(slayer.whyPicked)} ${
      ymd(today) === "2026-09-29"
        ? "Pinned to 29 September 2026 because the Heroes ceremony (24 Sep) and the Society’s same-week note on the leave announcement sit in one official news cycle."
        : "Today’s rotation from the five official-niche cards."
    }</p>
    <p class="signal">${signalLabel[slayer.signal] || "\ud83d\udc26"} — ${escapeHtml(slayer.hummingbird)}</p>
    <p class="why">${escapeHtml(data.disclaimer)}</p>
  `;

  const grid = document.getElementById("niche-grid");
  data.niches.forEach((n) => {
    const el = document.createElement("article");
    el.className = "card";
    el.innerHTML = `
      <p class="eyebrow">${escapeHtml(n.category)}</p>
      <h3>${escapeHtml(n.name)}</h3>
      <p>${escapeHtml(n.offer)}</p>
      <p><strong>Why listed:</strong> ${escapeHtml(n.whyPicked)}</p>
      <p class="price">\ud83d\udc26 ${escapeHtml(n.hummingbird)}</p>
    `;
    grid.appendChild(el);
  });

  const copy = buildCopy(slayer, dateLabel);
  document.getElementById("bot-copy").textContent = copy;

  document.getElementById("copy-btn").addEventListener("click", async () => {
    try {
      await navigator.clipboard.writeText(copy);
      document.getElementById("copy-btn").textContent = "Copied";
      setTimeout(() => {
        document.getElementById("copy-btn").textContent = "Copy today\u2019s brief";
      }, 1600);
    } catch (e) {
      document.getElementById("copy-btn").textContent = "Select the text and copy";
    }
  });

  function buildCopy(s, label) {
    return [
      "SLAYER OF THE DAY — " + label.toUpperCase(),
      "Source: Law Society Legal Heroes 2026 (24 Sep 2026 ceremony).",
      "",
      "Category: " + s.category,
      "Name: " + s.name,
      "",
      "What they do outstandingly well:",
      s.offer,
      "",
      "Why this day: " + s.whyPicked,
      "",
      "Hummingbird price signal: " + s.hummingbird,
      "",
      "Five niches on the same list: Amy Wallhead \u00b7 Keeley Lengthorn \u00b7 Glyn Maddocks \u00b7 Harjap Singh Bhangal \u00b7 James Netto.",
      "Also honoured: Rakesh Veja.",
      "",
      "NOT LEGAL ADVICE. Not a recommendation. Confirm SRA regulation. Use solicitors.lawsociety.org.uk. Written retainer and fee estimate required before any work.",
      "Intercity and every company under Gerber Enterprises: information only. Follow the law in every aspect.",
      "",
      "Official: " + data.officialFind,
      "SRA: " + data.sra,
      "Press: " + data.heroesPress
    ].join("\n");
  }

  function escapeHtml(str) {
    return String(str)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");
  }
})();
