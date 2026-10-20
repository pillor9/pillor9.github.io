"use strict";
const data = window.BENCHMARK_DATA;
const $ = (selector) => document.querySelector(selector);
const $$ = (selector) => Array.from(document.querySelectorAll(selector));
const names = { all: "All backends", cpu: "CPU / LLVM", cuda: "GPU / CUDA", opencl: "GPU / OpenCL" };
let sortKey = "fast";
let sortDirection = -1;

const copyCitation = $("#copy-bibtex");
const citationStatus = $("#citation-status");
let citationResetTimer;
copyCitation.addEventListener("click", async () => {
  clearTimeout(citationResetTimer);
  try {
    await navigator.clipboard.writeText($("#bibtex-code").textContent.trim());
    copyCitation.textContent = "Copied";
    citationStatus.textContent = "Copied to clipboard.";
  } catch {
    copyCitation.textContent = "Copy";
    citationStatus.textContent = "Select the citation below to copy it.";
  }
  citationResetTimer = setTimeout(() => {
    copyCitation.textContent = "Copy";
    citationStatus.textContent = "";
  }, 4000);
});

function renderTable() {
  const backend = $("#backend-filter").value;
  const level = $("#level-filter").value;
  const selected = data.rows.filter((r) => (backend === "all" || r.backend === backend) && (level === "all" || r.level === Number(level)));
  const models = [...new Set(data.rows.map((r) => r.model))];
  const rows = models
    .map((model) => {
      const slices = selected.filter((r) => r.model === model);
      const n = slices.reduce((s, r) => s + r.n, 0);
      const totals = [0, 1, 2].map((i) => slices.reduce((s, r) => s + r.counts[i], 0));
      return { model, n, compile: (100 * totals[0]) / n, correct: (100 * totals[1]) / n, fast: (100 * totals[2]) / n };
    })
    .sort((a, b) => sortDirection * (a[sortKey] - b[sortKey]) || a.model.localeCompare(b.model));
  $("#results-body").innerHTML = rows
    .map(
      (r, i) =>
        `<tr><td><span class="rank">${i + 1}</span>${r.model}</td><td>${r.compile.toFixed(1)}%</td><td>${r.correct.toFixed(1)}%</td><td><span class="fast-value">${r.fast.toFixed(1)}%<span class="mini-bar" aria-hidden="true"><i style="width:${r.fast}%"></i></span></span></td></tr>`
    )
    .join("");
  $("#table-scope").textContent = `${rows[0].n} task instances per model`;
  $$("[data-sort]").forEach((b) => {
    b.parentElement.setAttribute("aria-sort", b.dataset.sort === sortKey ? (sortDirection === -1 ? "descending" : "ascending") : "none");
    b.querySelector("span").textContent = b.dataset.sort === sortKey ? (sortDirection === -1 ? "↓" : "↑") : "↕";
  });
}
$("#backend-filter").addEventListener("change", renderTable);
$("#level-filter").addEventListener("change", renderTable);
$$("[data-sort]").forEach((b) =>
  b.addEventListener("click", () => {
    sortDirection = b.dataset.sort === sortKey ? -sortDirection : -1;
    sortKey = b.dataset.sort;
    renderTable();
  })
);

function renderAgent(key) {
  const r = data.agent[key];
  $$("[data-agent]").forEach((b) => b.setAttribute("aria-pressed", String(b.dataset.agent === key)));
  $("#agent-n").textContent = `${r.n} instances`;
  $("#agent-bars").innerHTML = [
    ["One-shot", r.direct],
    ["Claude Code", r.claude],
    ["LEKA", r.leka],
  ]
    .map(
      ([label, v]) =>
        `<div class="bar-row"><span class="bar-label">${label}</span><div class="bar-track" aria-hidden="true"><div class="bar-fill" style="width:${v}%"></div></div><span class="bar-value">${v.toFixed(1)}%</span></div>`
    )
    .join("");
  $("#agent-correct").innerHTML = `${r.correct.toFixed(0)}<small>%</small>`;
  $("#agent-gm").innerHTML = `${r.gm.toFixed(2)}<small>×</small>`;
  $("#agent-correct-note").textContent = `One-shot: ${r.directCorrect.toFixed(1)}%`;
}
$$("[data-agent]").forEach((b) => b.addEventListener("click", () => renderAgent(b.dataset.agent)));

const steps = [
  ["INITIAL IMPLEMENTATION", "The initial implementation is the reference for all speedups in this case."],
  ["GRAPH-LEVEL OPTIMIZATION", "NHWC layout and 1×1 convolution-to-matmul rewrites expose opportunities for lower-level optimization."],
  ["TENSOR & SCHEDULING", "Shared-memory tiling reuses convolution inputs, building on the graph choices made in Relax."],
  ["HARDWARE SPECIALIZATION", "Register blocking improves matrix multiplications while preserving TIR-optimized convolutions."],
];
$$("[data-step]").forEach((b) =>
  b.addEventListener("click", () => {
    $$("[data-step]").forEach((other) => other.setAttribute("aria-pressed", String(other === b)));
    $("#case-detail-text").textContent = steps[Number(b.dataset.step)][1];
  })
);

const figures = {
  benchmark: {
    title: "The EdgeKernelBench framework",
    height: 1290,
    alt: "EdgeKernelBench task construction, unified IR generation, and build, correctness, and timing evaluation on the evaluated edge devices.",
  },
  agent: {
    title: "The LEKA framework",
    height: 1350,
    alt: "Layered agents, progressive lowering, shared candidate lineage, and hardware-guided feedback.",
  },
  results: {
    title: "LEKA results and layered optimization",
    height: 675,
    alt: "LEKA correctness, Fast@1, geometric mean speedup, and SqueezeNet optimization trajectory.",
    caption: "",
  },
  fastp: {
    title: "Performance against production inference engines",
    height: 900,
    alt: "Fast@p curves comparing one-shot LLM generation against MNN and TensorRT across task complexity levels.",
    caption: "Evaluated on fixed, engine-supported task subsets.",
  },
  introduction: {
    title: "Why edge kernel generation is different",
    height: 1200,
    alt: "Contrasting server GPU kernel generation with heterogeneous edge backends and compiler-mediated generation.",
    caption: "",
  },
};
const dialog = $("#figure-dialog");
let priorFocus = null;
$$("[data-figure]").forEach((b) =>
  b.addEventListener("click", () => {
    const key = b.dataset.figure,
      f = figures[key];
    priorFocus = b;
    $("#dialog-title").textContent = f.title;
    $("#dialog-image").src = `assets/${key}.webp`;
    $("#dialog-image").alt = f.alt;
    $("#dialog-pdf").href = `assets/${key}.pdf`;
    dialog.showModal();
    document.body.style.overflow = "hidden";
  })
);
$("#close-dialog").addEventListener("click", () => dialog.close());
dialog.addEventListener("click", (e) => {
  if (e.target === dialog) {
    const r = dialog.getBoundingClientRect();
    if (e.clientX < r.left || e.clientX > r.right || e.clientY < r.top || e.clientY > r.bottom) dialog.close();
  }
});
dialog.addEventListener("close", () => {
  document.body.style.overflow = "";
  priorFocus?.focus();
});
renderTable();
renderAgent("all");

function initSectionNavigation() {
  const links = $$(".nav-links a").filter((link) => ["#news", "#abstract", "#overview", "#results", "#leka"].includes(link.getAttribute("href")));
  const sections = links.map((link) => $(link.getAttribute("href"))).filter(Boolean);
  const hero = $(".hero");
  const header = $(".site-header");
  if (!sections.length) return;

  function updateCurrentSection() {
    const headerBottom = header?.getBoundingClientRect().bottom || 0;
    const marker = Math.max(headerBottom, window.innerHeight * 0.25);
    let current = null;
    if (!hero || hero.getBoundingClientRect().bottom <= marker) {
      sections.forEach((section) => {
        if (section.getBoundingClientRect().top <= marker) current = section.id;
      });
    }
    links.forEach((link) => {
      if (link.getAttribute("href") === `#${current}`) link.setAttribute("aria-current", "location");
      else link.removeAttribute("aria-current");
    });
  }

  if ("IntersectionObserver" in window) {
    let sectionObserver;
    let heroObserver;
    function observeSections() {
      sectionObserver?.disconnect();
      heroObserver?.disconnect();
      const headerBottom = Math.max(0, header?.getBoundingClientRect().bottom || 0);
      const marker = Math.min(window.innerHeight - 1, Math.round(Math.max(headerBottom, window.innerHeight * 0.25)));
      sectionObserver = new IntersectionObserver(updateCurrentSection, {
        rootMargin: `-${marker}px 0px -${Math.max(0, window.innerHeight - marker - 1)}px 0px`,
      });
      sections.forEach((section) => sectionObserver.observe(section));
      if (hero) {
        heroObserver = new IntersectionObserver(updateCurrentSection, { rootMargin: `-${headerBottom}px 0px 0px 0px` });
        heroObserver.observe(hero);
      }
      updateCurrentSection();
    }
    observeSections();
    window.addEventListener("resize", observeSections);
  } else {
    let scheduled = false;
    function scheduleUpdate() {
      if (scheduled) return;
      scheduled = true;
      window.requestAnimationFrame(() => {
        scheduled = false;
        updateCurrentSection();
      });
    }
    window.addEventListener("scroll", scheduleUpdate, { passive: true });
    window.addEventListener("resize", scheduleUpdate);
    updateCurrentSection();
  }
}
initSectionNavigation();
