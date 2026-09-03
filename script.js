/*
  NOWLY — MVP v0.1 (estático, sin backend, sin base de datos)
  ------------------------------------------------------------
  Cómo funciona, en resumen:
  1. Tenemos una lista de actividades (ACTIVITIES). Cada una tiene:
       - text:   el texto que se muestra
       - time:   minutos mínimos que necesita (15, 30, 60 o 120)
       - energy: "low" | "medium" | "high"
       - vibe:   "useful" | "fun" | "move" | "social"
  2. El usuario elige UNA opción en cada uno de los 3 grupos
     (tiempo, energía, vibe).
  3. Al hacer clic en "Get my NOW", filtramos la lista según lo
     elegido y mostramos UNA actividad al azar en el "ticket".

  Para agregar actividades nuevas, solo copia una línea del arreglo
  ACTIVITIES de abajo y cambia los valores.
*/

// ---------- 1. Datos: el banco de actividades ----------

const ACTIVITIES = [
  // USEFUL
  { text: "Reply to that one email you've been avoiding", time: 15, energy: "low", vibe: "useful" },
  { text: "Unsubscribe from 5 emails you never read", time: 15, energy: "low", vibe: "useful" },
  { text: "Wipe down your kitchen counters", time: 15, energy: "medium", vibe: "useful" },
  { text: "Write down 3 things you actually need to buy this week", time: 15, energy: "low", vibe: "useful" },
  { text: "Back up the photos on your phone", time: 30, energy: "low", vibe: "useful" },
  { text: "Clean out one drawer, just one", time: 30, energy: "medium", vibe: "useful" },
  { text: "Update your resume with one new line", time: 30, energy: "low", vibe: "useful" },
  { text: "Schedule that appointment you keep putting off", time: 15, energy: "low", vibe: "useful" },
  { text: "Sort your laundry into wash piles", time: 30, energy: "medium", vibe: "useful" },
  { text: "Deep-clean your bathroom sink and mirror", time: 60, energy: "high", vibe: "useful" },
  { text: "Organize your desktop folders and delete the junk", time: 60, energy: "medium", vibe: "useful" },
  { text: "Meal-prep lunch for tomorrow", time: 60, energy: "medium", vibe: "useful" },

  // FUN
  { text: "Watch one episode of a show you've been meaning to start", time: 30, energy: "low", vibe: "fun" },
  { text: "Look up the weirdest news story from today", time: 15, energy: "low", vibe: "fun" },
  { text: "Try drawing your pet (or a random object) from memory", time: 15, energy: "low", vibe: "fun" },
  { text: "Make a playlist for a road trip that doesn't exist yet", time: 30, energy: "low", vibe: "fun" },
  { text: "Learn one card trick from a video", time: 30, energy: "medium", vibe: "fun" },
  { text: "Bake something with only 4 ingredients", time: 60, energy: "medium", vibe: "fun" },
  { text: "Rewatch your favorite movie trailer from 10 years ago", time: 15, energy: "low", vibe: "fun" },
  { text: "Try cooking a dish from a country you've never visited", time: 60, energy: "medium", vibe: "fun" },
  { text: "Doodle your dream house, no rules", time: 30, energy: "low", vibe: "fun" },
  { text: "Play one round of a game you haven't opened in months", time: 30, energy: "low", vibe: "fun" },
  { text: "Build a tiny Lego set or puzzle you already own", time: 60, energy: "medium", vibe: "fun" },
  { text: "Write the first paragraph of a story you'll never finish", time: 15, energy: "low", vibe: "fun" },

  // MOVE
  { text: "Take a 15-minute walk with no phone", time: 15, energy: "medium", vibe: "move" },
  { text: "Do 20 push-ups, however you can", time: 15, energy: "high", vibe: "move" },
  { text: "Stretch for 10 minutes, slowly", time: 15, energy: "low", vibe: "move" },
  { text: "Dance to 3 songs, alone, badly", time: 15, energy: "medium", vibe: "move" },
  { text: "Walk up and down your stairs 5 times", time: 15, energy: "high", vibe: "move" },
  { text: "Go for a short run around the block", time: 30, energy: "high", vibe: "move" },
  { text: "Follow a 10-minute yoga video", time: 15, energy: "medium", vibe: "move" },
  { text: "Bike somewhere you can reach in 20 minutes", time: 30, energy: "high", vibe: "move" },
  { text: "Do 50 jumping jacks", time: 15, energy: "high", vibe: "move" },
  { text: "Walk to the farthest store from your house and back", time: 60, energy: "medium", vibe: "move" },
  { text: "Try 10 minutes of shadow boxing", time: 15, energy: "high", vibe: "move" },
  { text: "Take the long way home, on foot", time: 60, energy: "medium", vibe: "move" },

  // SOCIAL
  { text: "Call a friend you haven't spoken to in a month", time: 15, energy: "low", vibe: "social" },
  { text: "Send a voice note to someone you miss", time: 15, energy: "low", vibe: "social" },
  { text: "Text someone one specific memory you share", time: 15, energy: "low", vibe: "social" },
  { text: "Plan a coffee with a coworker for this week", time: 15, energy: "low", vibe: "social" },
  { text: "Ask a family member how their week actually went", time: 30, energy: "low", vibe: "social" },
  { text: "Leave a genuine comment on an old friend's post", time: 15, energy: "low", vibe: "social" },
  { text: "Invite someone to do this exact NOW with you", time: 30, energy: "medium", vibe: "social" },
  { text: "Write a thank-you message to an old teacher or mentor", time: 30, energy: "low", vibe: "social" },
  { text: "Video call someone who lives far away", time: 60, energy: "low", vibe: "social" },
  { text: "Introduce two friends who'd get along", time: 30, energy: "low", vibe: "social" },
  { text: "Go say hi to a neighbor you've never talked to", time: 30, energy: "medium", vibe: "social" },
  { text: "Plan a small hangout for next weekend", time: 60, energy: "low", vibe: "social" },
];

// ---------- 2. Estado de la selección del usuario ----------

// Guardamos lo que el usuario va eligiendo en cada grupo.
// null = todavía no eligió nada en ese grupo.
const selection = {
  time: null,
  energy: null,
  vibe: null,
};

let lastActivityShown = null; // para intentar no repetir la misma actividad dos veces seguidas

// ---------- 3. Elementos del HTML que vamos a usar ----------

const pickerGroups = document.querySelectorAll(".picker-group");
const getNowBtn = document.getElementById("get-now-btn");
const againBtn = document.getElementById("again-btn");
const ticketEl = document.getElementById("ticket");
const ticketNumberEl = document.getElementById("ticket-number");
const ticketTagsEl = document.getElementById("ticket-tags");
const ticketActivityEl = document.getElementById("ticket-activity");

// ---------- 4. Manejar los clics en los botones de cada grupo ----------

pickerGroups.forEach((group) => {
  const groupName = group.dataset.group; // "time", "energy" o "vibe"
  const buttons = group.querySelectorAll(".pill");

  buttons.forEach((button) => {
    button.addEventListener("click", () => {
      // Quitamos "seleccionado" de todos los botones de este grupo...
      buttons.forEach((b) => {
        b.classList.remove("active");
        b.setAttribute("aria-pressed", "false");
      });
      // ...y se lo ponemos solo al que se hizo clic.
      button.classList.add("active");
      button.setAttribute("aria-pressed", "true");

      // Guardamos el valor elegido (ej: "15", "medium", "fun").
      selection[groupName] = button.dataset.value;

      updateButtonState();
    });
  });
});

// Habilita el botón "Get my NOW" solo cuando ya se eligió algo
// en los 3 grupos (tiempo, energía y vibe).
function updateButtonState() {
  const allSelected = selection.time && selection.energy && selection.vibe;
  getNowBtn.disabled = !allSelected;
}

// ---------- 5. Elegir una actividad según la selección ----------

function findMatches() {
  const maxTime = Number(selection.time);

  // Intento 1: respetar tiempo + energía + vibe exactos.
  let matches = ACTIVITIES.filter((a) => {
    const vibeMatches = selection.vibe === "surprise" || a.vibe === selection.vibe;
    return a.time <= maxTime && a.energy === selection.energy && vibeMatches;
  });
  if (matches.length > 0) return matches;

  // Intento 2: si no hay nada, soltamos la energía (solo tiempo + vibe).
  matches = ACTIVITIES.filter((a) => {
    const vibeMatches = selection.vibe === "surprise" || a.vibe === selection.vibe;
    return a.time <= maxTime && vibeMatches;
  });
  if (matches.length > 0) return matches;

  // Intento 3: soltamos también el vibe, solo respetamos el tiempo.
  matches = ACTIVITIES.filter((a) => a.time <= maxTime);
  if (matches.length > 0) return matches;

  // Último recurso: cualquier actividad de la lista.
  return ACTIVITIES;
}

function pickOneActivity() {
  const matches = findMatches();

  // Evitamos repetir la misma actividad dos veces seguidas, si se puede.
  const pool = matches.filter((a) => a.text !== lastActivityShown);
  const finalPool = pool.length > 0 ? pool : matches;

  const random = finalPool[Math.floor(Math.random() * finalPool.length)];
  lastActivityShown = random.text;
  return random;
}

// ---------- 6. Mostrar el resultado en el "ticket" ----------

const TIME_LABELS = { 15: "15 MIN", 30: "30 MIN", 60: "1 HOUR", 120: "2+ HOURS" };
const ENERGY_LABELS = { low: "LOW ENERGY", medium: "MEDIUM ENERGY", high: "HIGH ENERGY" };
const VIBE_LABELS = { useful: "USEFUL", fun: "FUN", move: "MOVE", social: "SOCIAL" };

function renderTicket(activity) {
  // Número de ticket al azar, solo para que se sienta como un ticket real.
  const ticketNumber = String(Math.floor(Math.random() * 900) + 100);
  ticketNumberEl.textContent = ticketNumber;

  // Etiquetas: mostramos lo que el usuario eligió, más el vibe REAL
  // de la actividad (puede ser distinto si usó "Surprise me").
  ticketTagsEl.innerHTML = "";
  const tags = [
    TIME_LABELS[selection.time],
    ENERGY_LABELS[selection.energy],
    VIBE_LABELS[activity.vibe],
  ];
  tags.forEach((tagText) => {
    const span = document.createElement("span");
    span.className = "ticket-tag";
    span.textContent = tagText;
    ticketTagsEl.appendChild(span);
  });

  ticketActivityEl.textContent = activity.text;

  // Mostramos el ticket y disparamos la animación de "impresión".
  ticketEl.classList.remove("hidden");
  ticketEl.classList.remove("printing");
  void ticketEl.offsetWidth; // truco para reiniciar la animación CSS
  ticketEl.classList.add("printing");
}

// ---------- 7. Conectar los botones principales ----------

getNowBtn.addEventListener("click", () => {
  const activity = pickOneActivity();
  renderTicket(activity);
});

againBtn.addEventListener("click", () => {
  const activity = pickOneActivity();
  renderTicket(activity);
});
