# Tana Life — simulatore di vita ad Antananarivo

## Avvio
    node server.js
Poi apri http://localhost:3000 (o l'indirizzo del tuo server) su Safari iPhone → Condividi → "Aggiungi alla schermata Home".

## AI dei personaggi
Nel gioco: scheda **Io → ⚙️ Impostazioni AI**, incolla la chiave OpenAI o Anthropic. Oppure avvia con:
    OPENAI_API_KEY=sk-... node server.js
Senza chiave i personaggi usano il motore di dialogo interno.

## Salvataggi
Cartella `saves/` sul server + copia locale nel browser.

## Hosting gratuito consigliato
Render.com / Railway / Fly.io: repo con questo folder, comando `node server.js`, porta da variabile PORT.
