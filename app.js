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
    const blog = POSTS.length
      ? `
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
    </section>`
      : "";

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
        <img class="portrait" src="${esc(s.photo)}" alt="Portrait of ${esc(s.name)}" width="320" height="320"
             onerror="this.style.display='none'">
      </div>
    </section>

    <section class="section" id="about">
      <div class="wrap split">
        <h2>About</h2>
        <div>
          ${s.about.map((p) => `<p class="prose">${esc(p)}</p>`).join("")}
          <h3 class="subhead first">Interests</h3>
          ${tags(s.interests)}
          <dl class="facts">
            ${s.facts.map(([k, v]) => `<div><dt>${esc(k)}</dt><dd>${esc(v)}</dd></div>`).join("")}
          </dl>
        </div>
      </div>
    </section>

    <section class="section" id="news">
      <div class="wrap split">
        <h2>News</h2>
        <ul class="news">
          ${NEWS.map((n) => `<li><span class="when">[${esc(n.when)}]</span><p>${esc(n.text)}</p></li>`).join("")}
        </ul>
      </div>
    </section>

    <section class="section" id="experience">
      <div class="wrap">
        <h2>Experience</h2>
        <div class="cols">
          <div>
            <h3 class="subhead first">Courses and internships</h3>
            ${timeline(TRAINING)}
          </div>
          <div>
            <h3 class="subhead first">Teaching and community</h3>
            ${timeline(LEADERSHIP)}
            <h3 class="subhead">Awards</h3>
            <ul class="plain">${AWARDS.map((a) => `<li>${esc(a)}</li>`).join("")}</ul>
          </div>
        </div>
      </div>
    </section>

    <section class="section" id="projects">
      <div class="wrap">
        <h2>Projects</h2>
        <div class="filters" role="group" aria-label="Filter projects">
          <button type="button" class="chip is-on" data-filter="All" aria-pressed="true">All</button>
          ${FILTERS.map((f) => `<button type="button" class="chip" data-filter="${esc(f)}" aria-pressed="false">${esc(f)}</button>`).join("")}
        </div>
        <div class="cards">
        ${FEATURED.map((p) => {
          const repo = (p.links || []).find((l) => l.label === "GitHub") || (p.links || [])[0];
          const inner = `
            ${p.award ? `<p class="award">${esc(p.award)}</p>` : ""}
            ${p.status ? `<p class="status">${esc(p.status)}</p>` : ""}
            <h3>${esc(p.title)}</h3>
            ${p.supervisor ? `<p class="meta">${esc(p.supervisor)}</p>` : ""}
            ${p.role ? `<p class="meta">${esc(p.role)}</p>` : ""}
            <p class="summary">${esc(p.summary)}</p>
            ${tags(p.tags)}
            ${repo ? `<span class="card-cta">View on GitHub &rarr;</span>` : ""}`;
          const cats = esc((p.cats || []).join("|"));
          return repo
            ? `<a class="card" data-cats="${cats}" href="${esc(repo.url)}" target="_blank" rel="noopener">${inner}</a>`
            : `<div class="card" data-cats="${cats}">${inner}</div>`;
        }).join("")}
        </div>
      </div>
    </section>
    // ${blog}

    <section class="section" id="contact">
      <div class="wrap split">
        <h2>Contact</h2>
        <div>
          <p class="prose">Feel free to reach out, I'm always happy to talk about research, collaborations, or Master's opportunities in AI.</p>
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

  /* ---------- Project filters ---------- */
  function bindFilters() {
    const bar = document.querySelector(".filters");
    if (!bar) return;
    bar.addEventListener("click", (e) => {
      const btn = e.target.closest(".chip");
      if (!btn) return;
      const f = btn.dataset.filter;
      bar.querySelectorAll(".chip").forEach((c) => {
        const on = c === btn;
        c.classList.toggle("is-on", on);
        c.setAttribute("aria-pressed", String(on));
      });
      document.querySelectorAll(".cards .card").forEach((c) => {
        c.hidden = !(f === "All" || (c.dataset.cats || "").split("|").includes(f));
      });
    });
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
      bindFilters();
    }
    stopTrace = initTrace();
    const id = hash.slice(1);
    const target = id && document.getElementById(id);
    if (target) target.scrollIntoView();
    else window.scrollTo(0, 0);
  }

  const navBlog = document.getElementById("nav-blog");
  if (navBlog && POSTS.length) navBlog.hidden = false;

  window.addEventListener("hashchange", route);
  route();

  function initTrace() {
    const hero = document.querySelector(".hero");
    const canvas = document.getElementById("trace");
    if (!hero || !canvas) return null;

    const ctx = canvas.getContext("2d");
    const css = getComputedStyle(document.documentElement);
    const color = css.getPropertyValue("--accent").trim() || "#7c3aed";
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const LINK = 150;
    const MOUSE_LINK = 190;
    let w = 0, h = 0, nodes = [], raf = 0, running = false;
    const mouse = { x: 0, y: 0, on: false };

    function resize() {
      const dpr = window.devicePixelRatio || 1;
      const r = hero.getBoundingClientRect();
      w = r.width; h = r.height;
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      canvas.style.width = w + "px";
      canvas.style.height = h + "px";
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      const count = Math.min(90, Math.max(28, Math.round((w * h) / 11000)));
      nodes = Array.from({ length: count }, () => ({
        x: Math.random() * w,
        y: Math.random() * h,
        vx: (Math.random() - 0.5) * 0.35,
        vy: (Math.random() - 0.5) * 0.35,
        r: 1.8 + Math.random() * 2.4,
        fire: 0,
        cool: 0
      }));
      if (reduce) frame();
    }

    function frame() {
      ctx.clearRect(0, 0, w, h);
      ctx.fillStyle = color;
      ctx.strokeStyle = color;

      for (const n of nodes) {
        if (!reduce) {
          n.x += n.vx; n.y += n.vy;
          if (n.x < 0 || n.x > w) n.vx *= -1;
          if (n.y < 0 || n.y > h) n.vy *= -1;
          if (mouse.on) {
            const dx = mouse.x - n.x, dy = mouse.y - n.y, d = Math.hypot(dx, dy);
            if (d < MOUSE_LINK && d > 1) { n.x += (dx / d) * 0.25; n.y += (dy / d) * 0.25; }
          }
          n.fire = Math.max(0, n.fire - 0.018);
          n.cool = Math.max(0, n.cool - 1);
          if (n.cool === 0 && Math.random() < 0.0007) { n.fire = 1; n.cool = 120; }
        }
      }

      for (let i = 0; i < nodes.length; i++) {
        const a = nodes[i];
        for (let j = i + 1; j < nodes.length; j++) {
          const b = nodes[j];
          const d = Math.hypot(a.x - b.x, a.y - b.y);
          if (d > LINK) continue;
          const glow = Math.max(a.fire, b.fire);
          if (!reduce) {
            if (a.fire > 0.9 && b.cool === 0 && Math.random() < 0.05) { b.fire = 1; b.cool = 120; }
            if (b.fire > 0.9 && a.cool === 0 && Math.random() < 0.05) { a.fire = 1; a.cool = 120; }
          }
          ctx.globalAlpha = (1 - d / LINK) * (0.28 + glow * 0.6);
          ctx.lineWidth = 1 + glow * 1.2;
          ctx.beginPath(); ctx.moveTo(a.x, a.y); ctx.lineTo(b.x, b.y); ctx.stroke();
        }
        if (mouse.on) {
          const d = Math.hypot(a.x - mouse.x, a.y - mouse.y);
          if (d < MOUSE_LINK) {
            if (!reduce && Math.random() < 0.02 && a.cool === 0) { a.fire = 1; a.cool = 120; }
            ctx.globalAlpha = (1 - d / MOUSE_LINK) * 0.6;
            ctx.lineWidth = 1.2;
            ctx.beginPath(); ctx.moveTo(a.x, a.y); ctx.lineTo(mouse.x, mouse.y); ctx.stroke();
          }
        }
      }

      for (const n of nodes) {
        if (n.fire > 0) {
          ctx.globalAlpha = n.fire * 0.25;
          ctx.beginPath(); ctx.arc(n.x, n.y, n.r + 4 + n.fire * 12, 0, Math.PI * 2); ctx.fill();
        }
        ctx.globalAlpha = 0.45 + n.fire * 0.55;
        ctx.beginPath(); ctx.arc(n.x, n.y, n.r + n.fire * 1.5, 0, Math.PI * 2); ctx.fill();
      }
      if (mouse.on) {
        ctx.globalAlpha = 0.9;
        ctx.beginPath(); ctx.arc(mouse.x, mouse.y, 4, 0, Math.PI * 2); ctx.fill();
      }
      ctx.globalAlpha = 1;
      if (running && !reduce) raf = requestAnimationFrame(frame);
    }

    function onMove(e) {
      const r = canvas.getBoundingClientRect();
      mouse.x = e.clientX - r.left; mouse.y = e.clientY - r.top; mouse.on = true;
    }
    function onLeave() { mouse.on = false; }

    resize();
    window.addEventListener("resize", resize);
    hero.addEventListener("pointermove", onMove);
    hero.addEventListener("pointerleave", onLeave);

    let io = null;
    if (!reduce) {
      io = new IntersectionObserver(([en]) => {
        if (en.isIntersecting && !running) { running = true; raf = requestAnimationFrame(frame); }
        else if (!en.isIntersecting) { running = false; cancelAnimationFrame(raf); }
      });
      io.observe(hero);
    }

    return function stop() {
      running = false;
      cancelAnimationFrame(raf);
      if (io) io.disconnect();
      hero.removeEventListener("pointermove", onMove);
      hero.removeEventListener("pointerleave", onLeave);
      window.removeEventListener("resize", resize);
    };
  }
})();