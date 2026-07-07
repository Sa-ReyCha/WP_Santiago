# santiagoreyeschavez.com

Personal portfolio site for **Santiago Reyes Chávez** — GCID AIOps Engineer (SRE) at SAP.

Self-hosted with Docker Compose behind a Cloudflare Tunnel — no open ports, no VPS provider, no vendor lock-in.

**Live:** [santiagoreyeschavez.com](https://santiagoreyeschavez.com)

---

## Stack

| Layer     | Tech                                              |
| --------- | ------------------------------------------------- |
| Content   | Static HTML                                        |
| Styling   | [Tailwind CSS v3](https://tailwindcss.com) CLI (no CDN) |
| Serving   | nginx (alpine)                                     |
| Ingress   | [Cloudflare Tunnel](https://developers.cloudflare.com/cloudflare-one/connections/connect-networks/) via `cloudflared` |
| Orchestration | Docker Compose                                 |

No frontend framework, no build step at runtime — pure static output served from nginx. All routing is handled by anchor links and static file paths.

---

## Structure

```
WP_Santiago/
├── src/
│   ├── index.html              # Home: hero, portfolio carousels, gallery, contact
│   ├── input.css               # Tailwind entry — @tailwind + custom @layer components
│   └── projects/
│       ├── index.html          # Projects catalog (Educational / Code / Personal)
│       ├── rag-lora-peft.html  # Blog: RAG & Fine-Tuning LLMs
│       ├── lung-cancer-cnn.html # Blog: Lung Cancer Prediction
│       ├── ai-security-hackathon.html
│       └── ...                 # One HTML per project
├── public/
│   └── photos/                 # Static assets (gallery, project images, avatar)
├── dist/                       # Build output (gitignored)
├── Dockerfile                  # Multi-stage: node build → nginx serve
├── docker-compose.yml          # web + cloudflared
├── nginx.conf                  # Static file server + caching + security headers
├── tailwind.config.js          # Brand palette + fonts
├── package.json                # Tailwind CLI as devDependency
├── Makefile                    # dev / build / up / down / logs shortcuts
└── .env.example                # Template for TUNNEL_TOKEN
```

---

## Local development

Requires **Node 20+** and **npm**.

```bash
# Install Tailwind
npm install

# Watch mode — rebuilds src/styles-dev.css on change
npm run dev
# Then open src/index.html in a browser (or serve the src/ folder)
```

The dev watcher writes to `src/styles-dev.css` (gitignored). The production build writes to `dist/styles.css`.

### Build for production

```bash
npm run build
# → dist/index.html, dist/styles.css, dist/projects/*.html, dist/public/**
```

---

## Deployment (Docker + Cloudflare Tunnel)

### 1. Create a Cloudflare Tunnel

1. Log in to the Cloudflare dashboard → **Zero Trust** → **Networks** → **Tunnels**.
2. Click **Create a tunnel** → pick **Cloudflared** → give it a name.
3. Choose **Docker** as the connector — copy the token shown.
4. Under **Public Hostnames**, route your domain (e.g. `santiagoreyeschavez.com`) to `http://web:80`.

### 2. Configure environment

```bash
cp .env.example .env
# Paste your tunnel token into .env — never commit this file
```

### 3. Start the stack

```bash
make up          # docker compose up -d --build
make logs        # tail logs
make down        # tear down
```

The `web` container has **no ports exposed** to the host — inbound traffic flows exclusively through `cloudflared`, which dials out to Cloudflare's edge. No firewall changes, no port forwarding, no public IP required.

---

## Design system

Brand colors are defined in [`tailwind.config.js`](tailwind.config.js):

| Token         | Hex       | Use                          |
| ------------- | --------- | ---------------------------- |
| `brand.yellow`| `#ffe556` | Accent badges                |
| `brand.cyan`  | `#00bcf0` | Primary accent, CTAs, links  |
| `brand.dark`  | `#303539` | Background                   |
| `brand.red`   | `#c8412d` | Warning/highlight            |
| `brand.light` | `#e1ebed` | Foreground text              |

Fonts: **Inter** (body) + **JetBrains Mono** (labels, code) — loaded from Google Fonts.

Custom components live under `@layer components` in [`src/input.css`](src/input.css) — `.project-card`, `.gallery-item`, `.badge-cyan`, `.tech-tag`, etc.

---

## Adding a new project

1. Duplicate one of the blog templates (e.g. [`src/projects/rag-lora-peft.html`](src/projects/rag-lora-peft.html)).
2. Replace title, tags, hero image, and body content.
3. Add a card in the appropriate section of [`src/projects/index.html`](src/projects/index.html) (Educational / Code / Personal).
4. Optionally add it to the home carousel in [`src/index.html`](src/index.html).
5. `npm run build` — the build script auto-copies all `src/projects/*.html` into `dist/projects/`.

---

## Notes

- `.env` is git-ignored — the tunnel token never touches the repo.
- `src/styles-dev.css` and `dist/` are also git-ignored.
- Cloudflare handles TLS termination, so nginx runs plain HTTP on port 80 internally.
- Security headers (`X-Frame-Options`, `X-Content-Type-Options`, `Referrer-Policy`) are set in [`nginx.conf`](nginx.conf).

---

## License

Content (writing, project descriptions, photos) © 2025 Santiago Reyes Chávez.
Code (HTML/CSS/config) is free to use as a template — attribution appreciated but not required.
