# Mettere online Malagasy Real Life Simulator (gratis, ~10 minuti)

Il server è Node puro, senza dipendenze. Qualsiasi hosting Node va bene; qui i due più semplici.

## Opzione 1 — Render (consigliata, link fisso, salvataggi su disco)

1. Crea un account su https://github.com e uno su https://render.com (login con GitHub).
2. Su GitHub: **New repository** → nome `tana-life` → Create. Poi **uploading an existing file** e trascina
   dentro TUTTO il contenuto di questa cartella (`server.js`, `package.json`, `render.yaml`, cartella `public`, ...).
   Non serve caricare `saves/` né `settings.json`.
3. Su Render: **New → Blueprint** → scegli il repo `tana-life` → **Apply**.
   Render legge `render.yaml` e crea il servizio. Dopo 1–2 minuti hai il link:
   `https://malagasy-real-life-simulator.onrender.com` (italiano) e `.../fr/` (francese).
4. (Facoltativo, per l'AI dei personaggi) Render → il tuo servizio → **Environment** →
   `OPENAI_API_KEY` oppure `ANTHROPIC_API_KEY` = la tua chiave → Save (il servizio si riavvia).
   In alternativa dal gioco: Io → Impostazioni AI, inserendo anche la **chiave amministratore**
   (`ADMIN_KEY`, la trovi in Environment): serve perché nessun altro possa cambiare le tue chiavi.
5. Manda il link agli amici. Sul telefono: Safari → Condividi → **Aggiungi a Home**: diventa un'app.

Note piano gratuito Render: dopo 15 minuti senza visite il server si addormenta; la prima apertura
successiva impiega ~30–50 secondi. Il disco `saves` (1 GB) mantiene le partite. Se non vuoi il disco
(piano free non lo consente in alcune regioni), cancella il blocco `disk:` da `render.yaml`: i
salvataggi restano comunque nel telefono di ogni giocatore + export su file.

## Opzione 2 — Railway

1. https://railway.app → login con GitHub → **New Project → Deploy from GitHub repo** → `tana-life`.
2. Railway rileva `package.json` e avvia `npm start`. Settings → **Generate Domain** per avere il link.
3. Variables: `ADMIN_KEY` (una password a tua scelta), `OPENAI_API_KEY` / `ANTHROPIC_API_KEY`.
4. Per salvataggi persistenti: **Add Volume** montato su `/app/saves`.

## Come funzionano le partite di più giocatori

Ogni telefono riceve un **codice partita** (es. `K7PM-3QZA`), visibile in Io → Salvataggi.
I salvataggi sul server sono separati per codice, quindi più amici possono giocare sullo stesso link.
Per riprendere la propria partita su un altro telefono: schermata iniziale → **🔑 Ho un codice partita**.
