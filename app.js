(function () {
  const app = document.getElementById("app");
  let view = null; // "home" | "post"
  let stopTrace = null;

  const esc = (s) =>
    String(s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));

  const links = (list = []) =>
    list.length
      ? `<ul class="links">${list
          .map((l) => `<li><a href="${esc(l.url)}" target="_blank" rel="noopener">${esc(l.label)}</a></li>`)
          .join("")}</ul>`
      : "";

  const tags = (list = []) =>
    list.length ? `<ul class="tags">${list.map((t) => `<li>${esc(t)}</li>`).join("")}</ul>` : "";

  const fmtDate = (iso) =>
    new Date(iso + "T00:00:00").toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" });

  /* ---------- Home ---------- */
  function homeHTML() {
    const s = SITE;
    return `
    <section class="hero" id="top">
      <canvas id="trace" aria-hidden="true"></canvas>
      <div class="wrap hero-inner">
        <div class="hero-text">
          <h1 id="hero-title">${esc(s.name)}</h1>
          <p class="lede" id="hero-lede">${esc(s.lede)}</p>
          <p class="where">${esc(s.school)}<br>${esc(s.location)}</p>
          <ul class="links big">
            <li><a href="mailto:${esc(s.email)}">Email</a></li>
            <li><a href="${esc(s.linkedin)}" target="_blank" rel="noopener">LinkedIn</a></li>
            <li><a href="${esc(s.github)}" target="_blank" rel="noopener">GitHub</a></li>
          </ul>
        </div>
        <img class="portrait" src="${esc(s.photo)}" alt="Portrait of ${esc(s.name)}" width="320" height="400"
             onerror="this.style.display='none'">
      </div>
    </section>

    <section class="section" id="about">
      <div class="wrap split">
        <h2>About</h2>
        <div>
          ${s.about.map((p) => `<p class="prose">${esc(p)}</p>`).join("")}
          <dl class="facts">
            ${s.facts.map(([k, v]) => `<div><dt>${esc(k)}</dt><dd>${esc(v)}</dd></div>`).join("")}
          </dl>
        </div>
      </div>
    </section>

    <section class="section" id="projects">
      <div class="wrap">
        <h2>Projects</h2>
        <div class="cards">
        ${FEATURED.map((p) => {
          const repo = (p.links || []).find((l) => l.label === "GitHub") || (p.links || [])[0];
          const inner = `
            ${p.award ? `<p class="award">${esc(p.award)}</p>` : ""}
            ${p.status ? `<p class="status">${esc(p.status)}</p>` : ""}
            <h3>${esc(p.title)}</h3>
            <p class="summary">${esc(p.summary)}</p>
            ${tags(p.tags)}
            ${repo ? `<span class="card-cta">View on GitHub &rarr;</span>` : ""}`;
          return repo
            ? `<a class="card" href="${esc(repo.url)}" target="_blank" rel="noopener">${inner}</a>`
            : `<div class="card">${inner}</div>`;
        }).join("")}
        </div>

        <h3 class="subhead">More engineering and AI projects</h3>
        <ul class="other">
          ${OTHER.map(
            (o) => `
            <li>
              <div>
                <h4>${esc(o.title)}</h4>
                <p>${esc(o.text)}</p>
              </div>
              ${links(o.links)}
            </li>`
          ).join("")}
        </ul>
      </div>
    </section>

    <section class="section" id="blog">
      <div class="wrap split">
        <h2>Blog</h2>
        <ul class="posts">
          ${POSTS.map(
            (p) => `
            <li>
              <time datetime="${esc(p.date)}">${fmtDate(p.date)}</time>
              <h3><a href="#/post/${esc(p.slug)}">${esc(p.title)}</a></h3>
              <p>${esc(p.summary)}</p>
            </li>`
          ).join("")}
        </ul>
      </div>
    </section>

    <section class="section" id="experience">
      <div class="wrap">
        <h2>Experience</h2>
        <div class="cols">
          <div>
            <h3 class="subhead first">Training and internships</h3>
            ${timeline(TRAINING)}
          </div>
          <div>
            <h3 class="subhead first">Leadership and activities</h3>
            ${timeline(LEADERSHIP)}
            <h3 class="subhead">Awards and competitions</h3>
            <ul class="plain">${AWARDS.map((a) => `<li>${esc(a)}</li>`).join("")}</ul>
          </div>
        </div>
        <h3 class="subhead">Skills</h3>
        <dl class="skills">
          ${SKILLS.map(([k, v]) => `<div><dt>${esc(k)}</dt><dd>${esc(v)}</dd></div>`).join("")}
        </dl>
      </div>
    </section>

    <section class="section" id="contact">
      <div class="wrap split">
        <h2>Contact</h2>
        <div>
          <p class="prose">I'm open to research collaborations and Master's opportunities in AI. The best way to reach me is email.</p>
          <ul class="links big">
            <li><a href="mailto:${esc(s.email)}">${esc(s.email)}</a></li>
            <li><a href="${esc(s.linkedin)}" target="_blank" rel="noopener">LinkedIn</a></li>
            <li><a href="${esc(s.github)}" target="_blank" rel="noopener">GitHub</a></li>
          </ul>
        </div>
      </div>
    </section>`;
  }

  function timeline(items) {
    return `<ol class="timeline">${items
      .map(
        (t) => `
      <li>
        <p class="when">${esc(t.when)}</p>
        <div>
          <h4>${esc(t.title)}</h4>
          <p class="org">${esc(t.org)}</p>
          ${links(t.links)}
        </div>
      </li>`
      )
      .join("")}</ol>`;
  }

  /* ---------- Post ---------- */
  function postHTML(slug) {
    const p = POSTS.find((x) => x.slug === slug);
    if (!p) {
      return `<article class="wrap post"><a class="back" href="#blog">Back to the blog</a>
        <h1>Post not found</h1><p class="prose">This post doesn't exist. Go back to the blog to see all posts.</p></article>`;
    }
    document.title = p.title + " | Rahma Fathy";
    return `<article class="wrap post">
      <a class="back" href="#blog">Back to the blog</a>
      <time datetime="${esc(p.date)}">${fmtDate(p.date)}</time>
      <h1>${esc(p.title)}</h1>
      <div class="post-body">${p.body}</div>
    </article>`;
  }

  /* ---------- Router ---------- */
  function route() {
    const hash = location.hash;
    const m = hash.match(/^#\/post\/(.+)$/);

    if (stopTrace) { stopTrace(); stopTrace = null; }

    if (m) {
      view = "post";
      app.innerHTML = postHTML(decodeURIComponent(m[1]));
      window.scrollTo(0, 0);
      return;
    }

    document.title = "Rahma Fathy | Biomedical Engineering & AI Research";
    if (view !== "home") {
      view = "home";
      app.innerHTML = homeHTML();
    }
    stopTrace = initTrace();
    const id = hash.slice(1);
    const target = id && document.getElementById(id);
    if (target) target.scrollIntoView();
    else window.scrollTo(0, 0);
  }

  window.addEventListener("hashchange", route);
  route();

  /* ---------- Hero: a gaze scanpath ----------
     Fixations (circles) joined by saccades (lines), like an eye-tracking
     scanpath. It plays once over the headline, then follows the cursor. */
  function initTrace() {
    const hero = document.querySelector(".hero");
    const canvas = document.getElementById("trace");
    if (!hero || !canvas) return null;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return null;

    const ctx = canvas.getContext("2d");
    const css = getComputedStyle(document.documentElement);
    const color = css.getPropertyValue("--accent").trim() || "#0b7285";
    const LIFE = 3200;
    let pts = [];
    let raf = 0;
    let lastAdd = 0;
    let timers = [];
    let userMoved = false;

    function resize() {
      const dpr = window.devicePixelRatio || 1;
      const r = hero.getBoundingClientRect();
      canvas.width = r.width * dpr;
      canvas.height = r.height * dpr;
      canvas.style.width = r.width + "px";
      canvas.style.height = r.height + "px";
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    }
    resize();
    window.addEventListener("resize", resize);

    function add(x, y) {
      const now = performance.now();
      pts.push({ x, y, t: now, r: 7 + Math.random() * 11 });
      if (pts.length > 40) pts.shift();
      lastAdd = now;
      if (!raf) raf = requestAnimationFrame(draw);
    }

    function draw(now) {
      raf = 0;
      const w = canvas.width / (window.devicePixelRatio || 1);
      const h = canvas.height / (window.devicePixelRatio || 1);
      ctx.clearRect(0, 0, w, h);
      pts = pts.filter((p) => now - p.t < LIFE);
      for (let i = 0; i < pts.length; i++) {
        const p = pts[i];
        const a = 1 - (now - p.t) / LIFE;
        if (i > 0) {
          const q = pts[i - 1];
          ctx.strokeStyle = color;
          ctx.globalAlpha = a * 0.45;
          ctx.lineWidth = 1.5;
          ctx.beginPath();
          ctx.moveTo(q.x, q.y);
          ctx.lineTo(p.x, p.y);
          ctx.stroke();
        }
        ctx.globalAlpha = a * 0.22;
        ctx.fillStyle = color;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fill();
        ctx.globalAlpha = a * 0.7;
        ctx.lineWidth = 1.5;
        ctx.stroke();
      }
      ctx.globalAlpha = 1;
      if (pts.length) raf = requestAnimationFrame(draw);
    }

    function onMove(e) {
      userMoved = true;
      timers.forEach(clearTimeout);
      timers = [];
      const r = canvas.getBoundingClientRect();
      const x = e.clientX - r.left;
      const y = e.clientY - r.top;
      const last = pts[pts.length - 1];
      const far = !last || Math.hypot(x - last.x, y - last.y) > 70;
      if (far && performance.now() - lastAdd > 120) add(x, y);
    }
    hero.addEventListener("pointermove", onMove);

    // Autoplay: read the headline and the first lines of the intro, with a regression.
    function autoplay() {
      const cr = canvas.getBoundingClientRect();
      const t = document.getElementById("hero-title").getBoundingClientRect();
      const l = document.getElementById("hero-lede").getBoundingClientRect();
      const lines = [
        { y: t.top + t.height / 2, x0: t.left, x1: Math.min(t.right, t.left + 520) },
        { y: l.top + l.height * 0.2, x0: l.left, x1: l.right },
        { y: l.top + l.height * 0.55, x0: l.left, x1: l.right },
        { y: l.top + l.height * 0.88, x0: l.left, x1: l.left + (l.right - l.left) * 0.6 }
      ];
      const path = [];
      lines.forEach((ln) => {
        const steps = 6;
        for (let i = 0; i <= steps; i++) {
          const x = ln.x0 + ((ln.x1 - ln.x0) * i) / steps + (Math.random() - 0.5) * 24;
          path.push([x - cr.left, ln.y - cr.top + (Math.random() - 0.5) * 14]);
          if (i === 4 && Math.random() > 0.4) {
            const bx = ln.x0 + ((ln.x1 - ln.x0) * 2.6) / steps;
            path.push([bx - cr.left, ln.y - cr.top + 6]);
          }
        }
      });
      path.forEach(([x, y], i) => {
        timers.push(setTimeout(() => { if (!userMoved) add(x, y); }, 700 + i * 190));
      });
    }
    timers.push(setTimeout(autoplay, 100));

    return function stop() {
      timers.forEach(clearTimeout);
      cancelAnimationFrame(raf);
      hero.removeEventListener("pointermove", onMove);
      window.removeEventListener("resize", resize);
    };
  }
})();