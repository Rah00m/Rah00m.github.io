(function () {
  const app = document.getElementById("app");
  const POSTS = Array.isArray(window.BLOG_POSTS) ? window.BLOG_POSTS : [];
  const POST_CONTENT = window.BLOG_POST_CONTENT || {};
  let view = null; // "home" | "post"

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
      <div class="wrap hero-inner">
        <div class="hero-text">
          <p class="eyebrow">${esc(s.title)}</p>
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
    ${blog}

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
    const body = POST_CONTENT[p.slug];
    if (!body) {
      return `<article class="wrap post"><a class="back" href="#blog">Back to the blog</a>
        <h1>${esc(p.title)}</h1><p class="prose">This post content is unavailable right now. Please try again later.</p></article>`;
    }
    document.title = p.title + " | Rahma Fathy";
    return `<article class="wrap post">
      <a class="back" href="#blog">Back to the blog</a>
      <time datetime="${esc(p.date)}">${fmtDate(p.date)}</time>
      <h1>${esc(p.title)}</h1>
      <div class="post-body">${body}</div>
    </article>`;
  }

  /* ---------- Router ---------- */
  function route() {
    const hash = location.hash;
    const m = hash.match(/^#\/post\/(.+)$/);

    if (m) {
      view = "post";
      app.innerHTML = postHTML(decodeURIComponent(m[1]));
      window.scrollTo(0, 0);
      return;
    }

    document.title = "Rahma Fathy | Biomedical AI Research";
    if (view !== "home") {
      view = "home";
      app.innerHTML = homeHTML();
      bindFilters();
    }
    const id = hash.slice(1);
    const target = id && document.getElementById(id);
    if (target) target.scrollIntoView();
    else window.scrollTo(0, 0);
  }

  window.addEventListener("hashchange", route);
  route();
})();