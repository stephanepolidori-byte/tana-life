/* ===================== TANA LIFE v2 — motore di gioco ===================== */
'use strict';
const $ = id => document.getElementById(id);
const rnd = (a, b) => Math.floor(Math.random() * (b - a + 1)) + a;
const pick = a => a[Math.floor(Math.random() * a.length)];
const clamp = (v, a = 0, b = 100) => Math.max(a, Math.min(b, v));
const Ar = n => Math.round(n).toLocaleString('it-IT');
const GIORNI = ['Lunedì', 'Martedì', 'Mercoledì', 'Giovedì', 'Venerdì', 'Sabato', 'Domenica'];
const GG = ['lun', 'mar', 'mer', 'gio', 'ven', 'sab', 'dom'];
const MESI = ['gen', 'feb', 'mar', 'apr', 'mag', 'giu', 'lug', 'ago', 'set', 'ott', 'nov', 'dic'];
const hh = h => String(h).padStart(2, '0') + ':00';
const durata = m => m < 60 ? `${m} min` : (m % 60 ? `${Math.floor(m / 60)}h${String(m % 60).padStart(2, '0')}` : `${m / 60}h`);

/* ---------- PERSONE ---------- */
const NOMI_M = ['Andry', 'Faly', 'Hery', 'Tojo', 'Njaka', 'Rija', 'Sitraka', 'Tahina', 'Mamy', 'Zo', 'Lova', 'Toky', 'Fanomezana', 'Haja', 'Rado', 'Tsiry', 'Mihaja', 'Ny Aina'];
const NOMI_F = ['Miora', 'Tiana', 'Nirina', 'Fanja', 'Hasina', 'Vola', 'Fitia', 'Aina', 'Ony', 'Soa', 'Lalaina', 'Mialy', 'Hanitra', 'Voahangy', 'Sarobidy', 'Felana', 'Nomena', 'Tsiky'];
const COGNOMI = ['Rakotomalala', 'Randrianarisoa', 'Andriamahefa', 'Razafindrakoto', 'Rabemananjara', 'Ramanantsoa', 'Rasolofoniaina', 'Andrianjafy', 'Rakotondrabe', 'Raharison', 'Ravelojaona', 'Rajaonarivelo', 'Andriamasinoro', 'Razanamparany', 'Ratsimbazafy', 'Rafanomezantsoa'];
const TRATTI = ['allegro', 'sospettoso', 'chiacchierone', 'timido', 'severo', 'generoso', 'pettegolo', 'religioso', 'ambizioso', 'pigro', 'romantico', 'pratico', 'ironico', 'ansioso', 'orgoglioso', 'materno', 'furbo', 'gentile'];

/* ---------- CITTÀ: QUARTIERI ---------- */
// tier 1 = popolare/periferia economica … 5 = residenziale di lusso. x,y = km approssimativi da Analakely.
const QUARTIERI = [
  { id: 'analakely', nome: 'Analakely', tier: 2, centro: true, x: 0, y: 0, desc: 'Il cuore della città: pavillons del mercato, Avenue de l\'Indépendance, uffici e banche. Vivere qui costa caro.', poi: ['mercato', 'epicerie', 'bagni', 'gargote', 'annunci', 'banca', 'agenzia', 'chiesa', 'scuola', 'farmacia'] },
  { id: 'isotry', nome: 'Isotry', tier: 1, x: -0.8, y: -0.3, desc: 'Quartiere popolare vicino alla stazione: rumoroso, economico, occhio la sera.', poi: ['farmacia', 'mercato', 'epicerie', 'bagni', 'gargote', 'chiesa'] },
  { id: '67ha', nome: '67 Ha', tier: 1, x: -1.5, y: 0.3, desc: 'Grandi palazzine popolari, mercato vivace, molti taxi-be.', poi: ['farmacia', 'mercato', 'epicerie', 'bagni', 'gargote', 'minimarket'] },
  { id: 'anosy', nome: 'Anosy', tier: 2, x: 0.2, y: -1.0, desc: 'Il lago con le jacarande, il Comune, lo stadio Mahamasina, i ministeri.', poi: ['farmacia', 'epicerie', 'bagni', 'gargote', 'comune', 'stadio', 'lago'] },
  { id: 'ampefiloha', nome: 'Ampefiloha', tier: 3, x: -0.5, y: -1.0, desc: 'Ospedale HJRA, cités residenziali, farmacie.', poi: ['epicerie', 'bagni', 'gargote', 'ospedale', 'farmacia', 'minimarket'] },
  { id: 'antanimena', nome: 'Antanimena', tier: 3, x: 0.3, y: 1.2, desc: 'Banche, agenzie, bar e ristoranti. Zona d\'affari.', poi: ['farmacia', 'epicerie', 'bagni', 'gargote', 'ristorante', 'banca', 'agenzia', 'bar', 'minimarket'] },
  { id: 'behoririka', nome: 'Behoririka', tier: 2, centro: true, x: 0.6, y: 0.8, desc: 'Pieno centro: mercato dei tessuti e delle brochette, cinesi e grossisti. Affitti da centro città.', poi: ['farmacia', 'mercato', 'epicerie', 'bagni', 'gargote', 'minimarket'] },
  { id: 'tsaralalana', nome: 'Tsaralalana', tier: 3, x: -0.2, y: 0.4, desc: 'Farmacie, cyber, piccoli hotel, comunità indo-pakistana.', poi: ['epicerie', 'bagni', 'gargote', 'ristorante', 'farmacia', 'bar'] },
  { id: 'andravoahangy', nome: 'Andravoahangy', tier: 1, x: 1.5, y: 1.0, desc: 'Il mercato più grande e caotico della città. Tutto costa meno.', poi: ['farmacia', 'mercato', 'epicerie', 'bagni', 'gargote'] },
  { id: 'ankorondrano', nome: 'Ankorondrano', tier: 4, x: 0.8, y: 2.5, desc: 'Zona franca, Shoprite, concessionarie, uffici moderni.', poi: ['farmacia', 'epicerie', 'bagni', 'gargote', 'ristorante', 'super', 'auto', 'agenzia', 'palestra', 'zonafranca'] },
  { id: 'ivandry', nome: 'Ivandry', tier: 5, x: 1.8, y: 3.5, desc: 'Ville con guardiani, ambasciate, supermercati per vazaha.', poi: ['farmacia', 'epicerie', 'gargote', 'ristorante', 'super', 'agenzia', 'palestra'] },
  { id: 'ambatobe', nome: 'Ambatobe', tier: 5, x: 3.5, y: 3.0, desc: 'Collina residenziale, Lycée français, aria buona.', poi: ['farmacia', 'epicerie', 'minimarket', 'ristorante'] },
  { id: 'ambohipo', nome: 'Ambohipo', tier: 2, x: 2.5, y: -1.0, desc: 'La città universitaria: studenti, gargote da 3.000 Ar, fotocopie.', poi: ['farmacia', 'mercato', 'epicerie', 'bagni', 'gargote', 'universita', 'scuola'] },
  { id: 'itaosy', nome: 'Itaosy', tier: 1, x: -4.0, y: -1.5, desc: 'Periferia ovest: terreni, risaie, case in mattoni. Lontano da tutto.', poi: ['farmacia', 'mercato', 'epicerie', 'bagni', 'gargote', 'chiesa'] },
  { id: 'andoharanofotsy', nome: 'Andoharanofotsy', tier: 2, x: 0.5, y: -6.0, desc: 'Periferia sud sulla RN7: in espansione, terreni e nuove villette.', poi: ['farmacia', 'mercato', 'epicerie', 'bagni', 'gargote', 'minimarket'] },
  { id: 'ivato', nome: 'Ivato', tier: 2, x: -4.5, y: 11.0, desc: 'L\'aeroporto internazionale, hotel, il mercato dell\'artigianato. Lontano, ma il lavoro gira attorno ai voli.', poi: ['farmacia', 'mercato', 'epicerie', 'bagni', 'gargote', 'ristorante', 'aeroporto', 'chiesa'] },
  { id: 'analamahitsy', nome: 'Analamahitsy', tier: 3, x: 3.0, y: 4.5, desc: 'Nord-est residenziale: famiglie della classe media, scuole private, giardini e taxi-be verso Ivandry.', poi: ['mercato', 'epicerie', 'bagni', 'gargote', 'minimarket', 'scuola', 'farmacia', 'chiesa'] },
  { id: 'alasora', nome: 'Alasora', tier: 1, x: 3.5, y: -4.0, desc: 'Comune popolare a sud-est, oltre la ferrovia: mattonai, risaie, case in mattoni rossi. Vita semplice, prezzi bassi.', poi: ['farmacia', 'mercato', 'epicerie', 'bagni', 'gargote', 'fornace', 'chiesa'] },
  { id: 'anosibe', nome: 'Anosibe', tier: 1, x: -1.0, y: -2.2, desc: 'Il mercato all\'ingrosso: camion di riso e carbone dalle 4 del mattino, fango nella stagione delle piogge.', poi: ['farmacia', 'mercato', 'epicerie', 'bagni', 'gargote', 'grossista'] },
  { id: 'tanjombato', nome: 'Tanjombato', tier: 2, x: 0.0, y: -4.5, desc: 'Sud sulla RN7: fabbriche, depositi, Jumbo Score. Zona di operai e camionisti.', poi: ['farmacia', 'epicerie', 'bagni', 'gargote', 'super', 'minimarket', 'fabbrica'] },
  { id: 'ambanidia', nome: 'Ambanidia', tier: 2, x: 0.9, y: -0.6, desc: 'Le scale della città alta verso il Rova: case antiche, viuzze, chiese e una vista incredibile.', poi: ['farmacia', 'epicerie', 'bagni', 'gargote', 'chiesa', 'rova'] },
  { id: 'ambohimanarina', nome: 'Ambohimanarina', tier: 1, x: -2.8, y: 4.0, desc: 'Nord-ovest popolare sulla strada dell\'aeroporto: lotti, famiglie numerose, mercato di quartiere.', poi: ['farmacia', 'mercato', 'epicerie', 'bagni', 'gargote', 'chiesa', 'scuola'] },
  { id: 'talatamaty', nome: 'Talatamaty', tier: 3, x: -3.5, y: 8.0, desc: 'Fra Tana e Ivato: villette nuove, magazzini, mercato del martedì. In forte crescita.', poi: ['farmacia', 'mercato', 'epicerie', 'bagni', 'gargote', 'minimarket', 'agenzia'] },
];
const Q = id => QUARTIERI.find(q => q.id === id);
const POI = {
  mercato: { nome: 'Mercato', icon: '🧺', desc: 'Kapoaka, toko, prezzi bassi, tanta gente.' },
  epicerie: { nome: 'Épicerie', icon: '🏪', desc: 'Il negozietto sotto casa: comodo, un po\' più caro.' },
  minimarket: { nome: 'Shop Liantsoa (mini market)', icon: '🛒', desc: 'Prodotti confezionati, aria condizionata, prezzi alti.' },
  super: { nome: 'Supermercato (Shoprite / Supermaki)', icon: '🏬', desc: 'Tutto in confezioni da 1 kg, carrelli, casse.' },
  bagni: { nome: 'Bagni pubblici', icon: '🚻', desc: 'WC 200 Ar, doccia 1.000 Ar.' },
  gargote: { nome: 'Hotely gasy (gargote)', icon: '🍲', desc: 'Piatti pronti: vary sy laoka, romazava, brochette.' },
  ristorante: { nome: 'Ristorante', icon: '🍽️', desc: 'Pizza, cucina francese, servizio al tavolo.' },
  annunci: { nome: 'Bacheca annunci & agenzie lavoro', icon: '📋' },
  banca: { nome: 'Banca BNI / MVola', icon: '🏦' },
  agenzia: { nome: 'Agenzia immobiliare', icon: '🏘️', desc: 'Affitti, vendite e terreni in tutta la città.' },
  ospedale: { nome: 'Ospedale HJRA', icon: '🏥' },
  farmacia: { nome: 'Farmacia', icon: '💊', desc: 'In ogni quartiere; i prezzi cambiano con la zona.' },
  auto: { nome: 'Concessionaria & usato', icon: '🚗' },
  scuola: { nome: 'Scuola primaria / Liceo', icon: '🏫' },
  universita: { nome: 'Università di Antananarivo', icon: '🎓' },
  stadio: { nome: 'Stadio Mahamasina', icon: '⚽' },
  palestra: { nome: 'Palestra & piscina', icon: '🏋️' },
  chiesa: { nome: 'Chiesa FJKM', icon: '⛪' },
  comune: { nome: 'Comune & Commissariato', icon: '🏛️' },
  bar: { nome: 'Bar / vita notturna', icon: '🍻' },
  lago: { nome: 'Lago Anosy', icon: '🌳' },
  zonafranca: { nome: 'Zona franca (fabbriche)', icon: '🏭' },
  aeroporto: { nome: 'Aeroporto Ivato', icon: '✈️', desc: 'Voli, taxi, cambiavalute e turisti con le valigie.' },
  fornace: { nome: 'Fornaci di mattoni', icon: '🧱', desc: 'Mattoni rossi cotti nelle risaie: lavoro duro, pagato a pezzo.' },
  grossista: { nome: 'Grossisti di Anosibe', icon: '🚛', desc: 'Sacchi di riso, carbone, banane a camion interi.' },
  fabbrica: { nome: 'Fabbriche di Tanjombato', icon: '🏭', desc: 'Birra, plastica, tessuti: turni fissi, badge all\'ingresso.' },
  rova: { nome: 'Rova & città alta', icon: '🏰', desc: 'Il palazzo della regina in cima alla collina. Vista su tutta Tana.' },
  casa: { nome: 'Casa tua', icon: '🏠' },
  lavoro: { nome: 'Il tuo posto di lavoro', icon: '💼' },
};
const MULT_CIBO = [0, 0.9, 1, 1.1, 1.25, 1.4];   // per tier quartiere
const MULT_CASA = [0, 0.7, 1, 1.3, 1.8, 2.5];
const MULT_CASA_CENTRO = 2.8; // Analakely/Behoririka: pieno centro, affitti sopra Ivandry/Ambatobe
const multCasa = q => q.centro ? MULT_CASA_CENTRO : MULT_CASA[q.tier];
const MULT_NEGOZIO = { mercato: 1, epicerie: 1.15, minimarket: 1.3, super: 1.35 };

/* ---------- PRODOTTI (prezzi base al mercato, Ariary 2026) ---------- */
// unità realistiche: kapoaka ≈ 285 g (barattolo di latte concentrato), toko = mucchietto (2-3 pezzi), sachet = bustina
const PRODOTTI = [
  { id: 'riso', nome: 'Riso (vary gasy)', unit: '1 kapoaka', prezzo: 700, key: 'riso', n: 1, dove: ['mercato', 'epicerie'], cat: 'base' },
  { id: 'riso_kg', nome: 'Riso confezionato', unit: '1 kg', prezzo: 3200, key: 'riso', n: 3.5, dove: ['minimarket', 'super'], cat: 'base' },
  { id: 'riso_sacco', nome: 'Sacco di riso', unit: '25 kg', prezzo: 65000, key: 'riso', n: 87, dove: ['mercato', 'super'], cat: 'base' },
  { id: 'fagioli', nome: 'Fagioli secchi (tsaramaso)', unit: '1 kapoaka', prezzo: 1500, key: 'fagioli', n: 2, dove: ['mercato', 'epicerie'], cat: 'base' },
  { id: 'pasta', nome: 'Pasta', unit: '500 g', prezzo: 2500, key: 'pasta', n: 2, dove: ['epicerie', 'minimarket', 'super'], cat: 'base' },
  { id: 'patate', nome: 'Patate', unit: '1 kapoaka', prezzo: 1000, key: 'patate', n: 1, dove: ['mercato'], cat: 'verdura', fresco: 6 },
  { id: 'carne', nome: 'Carne di zebù', unit: '250 g', prezzo: 3500, key: 'carne', n: 1, dove: ['mercato'], cat: 'carne', fresco: 1 },
  { id: 'carne_kg', nome: 'Carne di zebù confezionata', unit: '1 kg', prezzo: 16000, key: 'carne', n: 4, dove: ['super'], cat: 'carne', fresco: 1 },
  { id: 'pollo', nome: 'Pollo', unit: '¼ di pollo', prezzo: 4000, key: 'pollo', n: 1, dove: ['mercato', 'super'], cat: 'carne', fresco: 1 },
  { id: 'pesce', nome: 'Pesce secco (trondro maina)', unit: '250 g', prezzo: 2500, key: 'pesce', n: 1, dove: ['mercato', 'epicerie'], cat: 'carne' },
  { id: 'sardine', nome: 'Sardine in scatola', unit: '1 scatola', prezzo: 3000, key: 'sardine', n: 1, dove: ['epicerie', 'minimarket', 'super'], cat: 'carne' },
  { id: 'uova', nome: 'Uova', unit: '1 uovo', prezzo: 700, key: 'uova', n: 1, dove: ['mercato', 'epicerie'], cat: 'carne' },
  { id: 'uova6', nome: 'Uova', unit: 'confezione da 6', prezzo: 4500, key: 'uova', n: 6, dove: ['minimarket', 'super'], cat: 'carne' },
  { id: 'brede', nome: 'Brèdes (anana)', unit: '1 mazzo', prezzo: 300, key: 'brede', n: 1, dove: ['mercato'], cat: 'verdura', fresco: 2 },
  { id: 'pomodoro', nome: 'Pomodori', unit: '1 toko (3 pezzi)', prezzo: 500, key: 'pomodoro', n: 1, dove: ['mercato', 'epicerie'], cat: 'verdura', fresco: 3 },
  { id: 'pomodoro_kg', nome: 'Pomodori', unit: '1 kg', prezzo: 2500, key: 'pomodoro', n: 5, dove: ['super'], cat: 'verdura', fresco: 3 },
  { id: 'cipolla', nome: 'Cipolle', unit: '1 toko (3 pezzi)', prezzo: 500, key: 'cipolla', n: 1, dove: ['mercato', 'epicerie'], cat: 'verdura', fresco: 10 },
  { id: 'carote', nome: 'Carote e verdure miste', unit: '1 toko', prezzo: 500, key: 'verdure', n: 1, dove: ['mercato'], cat: 'verdura', fresco: 4 },
  { id: 'olio', nome: 'Olio', unit: 'sachet 100 ml', prezzo: 1000, key: 'olio', n: 3, dove: ['mercato', 'epicerie'], cat: 'dispensa' },
  { id: 'olio_l', nome: 'Olio', unit: 'bottiglia 1 L', prezzo: 8500, key: 'olio', n: 30, dove: ['epicerie', 'minimarket', 'super'], cat: 'dispensa' },
  { id: 'zucchero', nome: 'Zucchero', unit: '250 g', prezzo: 1500, key: 'zucchero', n: 10, dove: ['mercato', 'epicerie'], cat: 'dispensa' },
  { id: 'zucchero_kg', nome: 'Zucchero', unit: '1 kg', prezzo: 5200, key: 'zucchero', n: 40, dove: ['minimarket', 'super'], cat: 'dispensa' },
  { id: 'sale', nome: 'Sale', unit: 'sachet', prezzo: 300, key: 'sale', n: 20, dove: ['mercato', 'epicerie', 'minimarket', 'super'], cat: 'dispensa' },
  { id: 'caffe', nome: 'Caffè macinato', unit: 'sachet', prezzo: 1000, key: 'caffe', n: 5, dove: ['mercato', 'epicerie'], cat: 'dispensa' },
  { id: 'caffe_p', nome: 'Caffè', unit: 'pacco 250 g', prezzo: 9000, key: 'caffe', n: 40, dove: ['minimarket', 'super'], cat: 'dispensa' },
  { id: 'latte', nome: 'Latte concentrato', unit: '1 barattolo', prezzo: 3200, key: 'latte', n: 5, dove: ['epicerie', 'minimarket', 'super'], cat: 'dispensa' },
  { id: 'pane', nome: 'Mofo dipaina (baguette)', unit: '1 pezzo', prezzo: 600, key: 'pane', n: 1, dove: ['epicerie', 'minimarket', 'super'], cat: 'base', fresco: 2 },
  { id: 'acqua', nome: 'Acqua Eau Vive', unit: '1,5 L', prezzo: 1500, key: 'acqua', n: 1, dove: ['epicerie', 'minimarket', 'super'], cat: 'dispensa', sempre: true },
  { id: 'carbone_s', nome: 'Carbone', unit: 'sacchetto piccolo', prezzo: 3000, key: 'carbone', n: 5, dove: ['mercato', 'epicerie'], cat: 'casa' },
  { id: 'carbone', nome: 'Carbone', unit: 'sacco grande', prezzo: 25000, key: 'carbone', n: 50, dove: ['mercato'], cat: 'casa' },
  { id: 'gas', nome: 'Ricarica bombola gas 12 kg', unit: '1 ricarica', prezzo: 85000, key: 'gas', n: 100, dove: ['epicerie', 'minimarket', 'super'], cat: 'casa' },
  { id: 'sapone', nome: 'Sapone (savony gasy)', unit: '1 barra', prezzo: 1500, key: 'sapone', n: 5, dove: ['mercato', 'epicerie', 'minimarket', 'super'], cat: 'casa', sempre: true },
  { id: 'detersivo', nome: 'Detersivo in polvere', unit: 'sachet', prezzo: 500, key: 'sapone', n: 1, dove: ['epicerie', 'minimarket', 'super'], cat: 'casa', sempre: true },
];
const NOMI_DISP = { riso: 'riso (kapoaka)', fagioli: 'fagioli (porz.)', pasta: 'pasta (porz.)', patate: 'patate', carne: 'carne 250g', pollo: 'pollo ¼', pesce: 'pesce secco', sardine: 'sardine', uova: 'uova', brede: 'brèdes', pomodoro: 'pomodori (toko)', cipolla: 'cipolle (toko)', verdure: 'verdure', olio: 'olio (dosi)', zucchero: 'zucchero (dosi)', sale: 'sale (dosi)', caffe: 'caffè (dosi)', latte: 'latte (dosi)', pane: 'pane', acqua: 'acqua', carbone: 'carbone (cotture)', gas: 'gas (cotture)', sapone: 'sapone (usi)' };
const FRESCHI = { carne: 1, pollo: 1, brede: 2, pane: 2, pomodoro: 3, verdure: 4, patate: 6, cipolla: 10 };

/* ---------- RICETTE ---------- */
const RICETTE = [
  { id: 'vary_fotsy', nome: 'Riso bianco e sale', ing: { riso: 1, sale: 1 }, fame: 30, salute: 0, umore: -2, min: 40, fuoco: 1 },
  { id: 'vary_anana', nome: 'Vary amin\'anana (riso con brèdes)', ing: { riso: 1, brede: 1, sale: 1 }, fame: 45, salute: 2, umore: 3, min: 45, fuoco: 1 },
  { id: 'tsaramaso', nome: 'Vary sy tsaramaso (riso e fagioli)', ing: { riso: 1, fagioli: 1, cipolla: 1, olio: 1, sale: 1 }, fame: 55, salute: 2, umore: 5, min: 75, fuoco: 1 },
  { id: 'atody', nome: 'Vary sy atody (riso e uova)', ing: { riso: 1, uova: 2, olio: 1, sale: 1 }, fame: 50, salute: 2, umore: 5, min: 40, fuoco: 1 },
  { id: 'sardina', nome: 'Vary sy sardina', ing: { riso: 1, sardine: 1, pomodoro: 1 }, fame: 50, salute: 1, umore: 4, min: 40, fuoco: 1 },
  { id: 'trondro', nome: 'Riso con pesce secco e brèdes', ing: { riso: 1, pesce: 1, brede: 1, sale: 1 }, fame: 55, salute: 3, umore: 5, min: 50, fuoco: 1 },
  { id: 'romazava', nome: 'Romazava', ing: { riso: 1, carne: 1, brede: 1, pomodoro: 1, sale: 1 }, fame: 60, salute: 4, umore: 10, min: 70, fuoco: 1 },
  { id: 'ritra', nome: 'Hen\'omby ritra (zebù stufato)', ing: { riso: 1, carne: 1, cipolla: 1, pomodoro: 1, olio: 1, sale: 1 }, fame: 65, salute: 3, umore: 12, min: 90, fuoco: 2 },
  { id: 'akoho', nome: 'Akoho sy voatabia (pollo al pomodoro)', ing: { riso: 1, pollo: 1, pomodoro: 1, cipolla: 1, olio: 1, sale: 1 }, fame: 62, salute: 4, umore: 12, min: 70, fuoco: 1 },
  { id: 'lasopy', nome: 'Lasopy (zuppa di verdure)', ing: { verdure: 1, patate: 1, sale: 1, pane: 1 }, fame: 40, salute: 5, umore: 4, min: 45, fuoco: 1 },
  { id: 'pasta', nome: 'Pasta al pomodoro', ing: { pasta: 1, pomodoro: 1, olio: 1, sale: 1 }, fame: 45, salute: 1, umore: 6, min: 30, fuoco: 1 },
  { id: 'frites', nome: 'Patate fritte', ing: { patate: 1, olio: 2, sale: 1 }, fame: 35, salute: -1, umore: 8, min: 35, fuoco: 1 },
  { id: 'colazione', nome: 'Colazione: caffè, pane e latte', ing: { pane: 1, caffe: 1, zucchero: 1, latte: 1 }, fame: 25, salute: 1, umore: 8, min: 15, fuoco: 0.3 },
  { id: 'kafe', nome: 'Caffè zuccherato e pane', ing: { pane: 1, caffe: 1, zucchero: 1 }, fame: 20, salute: 0, umore: 5, min: 10, fuoco: 0.3 },
  { id: 'pane_sardine', nome: 'Pane e sardine (senza cucinare)', ing: { pane: 1, sardine: 1 }, fame: 30, salute: 0, umore: 2, min: 5, fuoco: 0 },
];
/* ---------- CIBO PRONTO ---------- */
const PRONTO = {
  gargote: [
    { nome: 'Mofo gasy (1 frittella di riso)', tier: [200, 300, 300, 400, 500], fame: 4, mattina: true },
    { nome: 'Mofo gasy (5 frittelle) + caffè', tier: [1200, 1700, 1800, 2500, 3200], fame: 18, umore: 4, mattina: true },
    { nome: 'Koba (1 fetta)', tier: [500, 500, 500, 700, 1000], fame: 6, umore: 2 },
    { nome: 'Sambos e nems', tier: [1500, 2000, 2500, 3500, 5000], fame: 16, salute: -1, rischio: 0.12 },
    { nome: 'Brochette di zebù (5)', tier: [2000, 3000, 3500, 5000, 7000], fame: 22, umore: 6 },
    { nome: 'Vary sy laoka piccolo (riso e un po\' di laoka)', tier: [2500, 2500, 3000, 4000, 6000], fame: 28, rischio: 0.06 },
    { nome: 'Vary sy laoka completo (piatto del giorno)', tier: [3500, 4500, 5500, 9000, 14000], fame: 42, salute: 1, rischio: 0.04 },
    { nome: 'Vary be menaka + laoka speciale', tier: [5000, 6500, 8000, 13000, 20000], fame: 55, salute: 2, umore: 8, tierMin: 1 },
    { nome: 'Romazava con riso', tier: [4500, 6000, 7000, 11000, 16000], fame: 50, salute: 2, umore: 6 },
    { nome: 'Ravitoto sy henakisoa', tier: [5000, 7000, 8000, 12000, 18000], fame: 55, salute: 1, umore: 8 },
    { nome: 'Ranon\'ampango / tè caldo', tier: [200, 300, 300, 500, 800], fame: 3, umore: 2 },
    { nome: 'THB (birra)', tier: [3500, 4000, 4500, 6000, 8000], fame: 5, salute: -2, umore: 8 },
  ],
  ristorante: [
    { nome: 'Pizza', tier: [18000, 22000, 25000, 30000, 38000], fame: 60, umore: 10 },
    { nome: 'Zebù grigliato con patatine', tier: [25000, 30000, 35000, 42000, 55000], fame: 70, salute: 2, umore: 12 },
    { nome: 'Cena francese (3 portate)', tier: [45000, 55000, 60000, 75000, 95000], fame: 80, salute: 3, umore: 18 },
    { nome: 'Bicchiere di vino', tier: [8000, 10000, 12000, 15000, 20000], fame: 3, umore: 8, salute: -1 },
  ],
};

/* ---------- IMMOBILIARE (generato per quartiere) ---------- */
const TIPI_CASA = {
  stanza: { nome: 'Stanza in affitto', affitto: 85000, comfort: 2, tiers: [1, 2], desc: 'Legno e lamiera, bagno in comune nel cortile.' },
  mono: { nome: 'Monolocale', affitto: 170000, comfort: 4, tiers: [1, 2, 3], desc: 'Una stanza con angolo cottura, acqua e luce JIRAMA.' },
  bilo: { nome: 'Bilocale', affitto: 320000, comfort: 6, tiers: [2, 3, 4], desc: 'Camera + soggiorno, terrazzo per stendere.' },
  app: { nome: 'Appartamento', affitto: 750000, comfort: 8, tiers: [3, 4, 5], desc: 'Palazzina con custode e parcheggio.' },
  villa: { nome: 'Villa', affitto: 1800000, comfort: 10, tiers: [4, 5], desc: 'Giardino, garage, guardiano.' },
  casav: { nome: 'Casa tradizionale in mattoni (vendita)', prezzo: 45000000, comfort: 5, tiers: [1, 2], desc: 'Due piani, tetto in tegole, cortile.' },
  appv: { nome: 'Appartamento (vendita)', prezzo: 110000000, comfort: 8, tiers: [2, 3, 4, 5], desc: 'Vista sulla città, ascensore.' },
  villav: { nome: 'Villa (vendita)', prezzo: 320000000, comfort: 10, tiers: [4, 5], desc: 'Piscina, guardiani, il sogno di tutti.' },
  terreno: { nome: 'Terreno edificabile', prezzo: 12000000, comfort: 0, tiers: [1, 2, 3, 4, 5], desc: '300 m², titolo di proprietà regolare. Puoi costruirci una casa.' },
};
const CASE = [{ id: 'strada', nome: 'Nessuna casa (dormi dove capita)', affitto: 0, prezzo: 0, q: 'isotry', comfort: 0, tipo: 'strada' }];
QUARTIERI.forEach(q => Object.entries(TIPI_CASA).forEach(([t, d]) => { if (q.centro ? !['stanza', 'mono', 'bilo', 'app', 'appv', 'terreno'].includes(t) : !d.tiers.includes(q.tier)) return; const m = multCasa(q); CASE.push({ id: `${q.id}-${t}`, tipo: t, q: q.id, nome: `${d.nome} a ${q.nome}`, affitto: d.affitto ? Math.round(d.affitto * m / 5000) * 5000 : 0, prezzo: d.prezzo ? Math.round(d.prezzo * m / 500000) * 500000 : 0, comfort: d.comfort + (q.tier >= 4 ? 1 : 0), desc: d.desc }); }));
CASE.push({ id: 'costruita', tipo: 'costruita', q: null, nome: 'La casa che hai costruito', affitto: 0, prezzo: 0, comfort: 7, desc: 'Costruita sul tuo terreno, mattone su mattone.' });

const MOBILI = [
  { id: 'materasso', nome: 'Materasso in spugna', prezzo: 60000, eff: 'sonno +1', icon: '🛏️', dove: ['mercato', 'super'] },
  { id: 'letto', nome: 'Letto in palissandro', prezzo: 450000, eff: 'sonno +3', icon: '🛏️', dove: ['super'] },
  { id: 'fornello', nome: 'Fornello a carbone (fatapera)', prezzo: 15000, eff: 'cucina a carbone', icon: '🔥', dove: ['mercato', 'epicerie'] },
  { id: 'gasf', nome: 'Cucina a gas + bombola', prezzo: 250000, eff: 'cucina veloce (serve ricarica gas)', icon: '🍳', dove: ['super', 'minimarket'] },
  { id: 'frigo', nome: 'Frigorifero', prezzo: 900000, eff: 'cibo fresco dura 4x', icon: '🧊', dove: ['super'] },
  { id: 'secchio', nome: 'Secchio e bacinella', prezzo: 8000, eff: 'lavarsi e bucato a mano', icon: '🪣', dove: ['mercato', 'epicerie'] },
  { id: 'doccia', nome: 'Scaldabagno + doccia', prezzo: 600000, eff: 'igiene 100', icon: '🚿', dove: ['super'] },
  { id: 'lavatrice', nome: 'Lavatrice', prezzo: 1400000, eff: 'bucato in 1h', icon: '🫧', dove: ['super'] },
  { id: 'stendino', nome: 'Stendino e mollette', prezzo: 20000, eff: 'stendere in casa', icon: '🧺', dove: ['mercato', 'epicerie'] },
  { id: 'tv', nome: 'TV + decoder Canal+', prezzo: 700000, eff: 'umore +12', icon: '📺', dove: ['super'] },
  { id: 'divano', nome: 'Divano', prezzo: 500000, eff: 'umore +', icon: '🛋️', dove: ['super'] },
  { id: 'pc', nome: 'Computer portatile', prezzo: 2200000, eff: 'studio +, lavoro online', icon: '💻', dove: ['super'] },
  { id: 'telefono', nome: 'Smartphone', prezzo: 350000, eff: 'MVola, chiamate', icon: '📱', dove: ['minimarket', 'super', 'mercato'] },
  { id: 'libri', nome: 'Scaffale di libri', prezzo: 120000, eff: 'intelligenza +', icon: '📚', dove: ['super', 'mercato'] },
  { id: 'pesi', nome: 'Manubri', prezzo: 90000, eff: 'sport a casa', icon: '🏋️', dove: ['super'] },
  { id: 'pannelli', nome: 'Pannello solare', prezzo: 1800000, eff: 'bolletta luce -60%', icon: '☀️', dove: ['super'] },
  { id: 'zanzariera', nome: 'Zanzariera', prezzo: 20000, eff: 'meno malaria', icon: '🦟', dove: ['mercato', 'farmacia', 'super'] },
];
const VEICOLI = [
  { id: 'bici', nome: 'Bicicletta', prezzo: 300000, vel: 2, costo: 0, icon: '🚲' },
  { id: 'moto', nome: 'Scooter cinese 125', prezzo: 4500000, vel: 3, costo: 1500, icon: '🛵' },
  { id: 'r4', nome: 'Renault 4L (1982)', prezzo: 9000000, vel: 3, costo: 4000, icon: '🚗' },
  { id: 'peugeot', nome: 'Peugeot 405', prezzo: 18000000, vel: 3, costo: 5000, icon: '🚗' },
  { id: 'hilux', nome: 'Toyota Hilux 4x4', prezzo: 95000000, vel: 4, costo: 9000, icon: '🛻' },
  { id: 'prado', nome: 'Toyota Land Cruiser Prado', prezzo: 220000000, vel: 4, costo: 12000, icon: '🚙' },
];
const MEDICINE = [
  { id: 'paracetamolo', nome: 'Paracetamolo', prezzo: 2000, cura: ['influenza', 'febbre'] },
  { id: 'orsa', nome: 'Sali reidratanti + Flagyl', prezzo: 6000, cura: ['diarrea'] },
  { id: 'malaria', nome: 'Coartem (antimalarico)', prezzo: 15000, cura: ['malaria'] },
  { id: 'antibiotico', nome: 'Amoxicillina', prezzo: 12000, cura: ['bronchite', 'infezione'] },
  { id: 'vitamine', nome: 'Vitamine', prezzo: 8000, cura: [] },
];
const MALATTIE = {
  influenza: { nome: 'Influenza', grav: 1, gg: 4, sint: 'naso chiuso, dolori' }, febbre: { nome: 'Febbre', grav: 1, gg: 3, sint: 'brividi, debolezza' }, diarrea: { nome: 'Diarrea', grav: 2, gg: 3, sint: 'crampi, corri in bagno', extra: 'vescica -50%/h in più' },
  malaria: { nome: 'Malaria', grav: 4, gg: 8, sint: 'febbre alta, brividi violenti', extra: 'PERICOLOSA: senza cure può uccidere' }, bronchite: { nome: 'Bronchite', grav: 2, gg: 6, sint: 'tosse, fiato corto', extra: 'sport quasi impossibile' }, infezione: { nome: 'Infezione', grav: 3, gg: 5, sint: 'dolore, febbre' },
};
function malusMalattia(tipo) { const m = MALATTIE[tipo]; return `salute -${(m.grav * 0.4 * 24).toFixed(0)}/giorno · energia -24/giorno · umore -${m.grav * 6}/giorno · rendimento lavoro -2/turno · colloqui -20%${m.extra ? ' · ' + m.extra : ''}`; }
function cureMalattia(tipo) { const med = MEDICINE.find(x => x.cura.includes(tipo)); return `Cura: ${med.nome} (${Ar(med.prezzo)} Ar in farmacia, -3 giorni) oppure ricovero. Senza cure dura ${MALATTIE[tipo].gg} giorni.`; }

/* ---------- LAVORI (gg = giorni lavorativi 0=lun … 6=dom) ---------- */
const LV = [0, 1, 2, 3, 4], LS6 = [0, 1, 2, 3, 4, 5], MS = [1, 2, 3, 4, 5, 6], TUTTI = [0, 1, 2, 3, 4, 5, 6];
const LAVORI = [
  { id: 'nulla', nome: 'Disoccupato', paga: 0, gg: [] },
  // --- a giornata (nessun titolo) ---
  { id: 'lavatore', nome: 'Lavavetri / porta pacchi al mercato', paga: 5000, tipo: 'giorno', edu: 0, ore: 8, inizio: 6, gg: LS6, luogo: 'analakely' },
  { id: 'lavatore2', nome: 'Porta pacchi al mercato', paga: 4500, tipo: 'giorno', edu: 0, ore: 9, inizio: 5, gg: TUTTI, luogo: 'andravoahangy' },
  { id: 'mpanasa', nome: 'Lavandaia/o a domicilio', paga: 7000, tipo: 'giorno', edu: 0, ore: 6, inizio: 7, gg: LS6, luogo: 'ampefiloha', skill: 'casa' },
  { id: 'mpanasa2', nome: 'Lavandaia/o a domicilio', paga: 6000, tipo: 'giorno', edu: 0, ore: 7, inizio: 6, gg: LS6, luogo: 'analamahitsy', skill: 'casa' },
  { id: 'ricevitore', nome: 'Ricevitore taxi-be', paga: 8000, tipo: 'giorno', edu: 0, ore: 10, inizio: 5, gg: LS6, luogo: 'anosy' },
  { id: 'ricevitore2', nome: 'Ricevitore taxi-be (linea Ivato)', paga: 9000, tipo: 'giorno', edu: 0, ore: 12, inizio: 4, gg: TUTTI, luogo: 'ivato' },
  { id: 'muratore', nome: 'Manovale in cantiere', paga: 9000, tipo: 'giorno', edu: 0, ore: 9, inizio: 7, gg: LS6, luogo: 'andoharanofotsy', skill: 'fitness' },
  { id: 'muratore2', nome: 'Manovale in cantiere', paga: 10000, tipo: 'giorno', edu: 0, ore: 9, inizio: 7, gg: LS6, luogo: 'talatamaty', skill: 'fitness' },
  { id: 'facchino', nome: 'Facchino al mercato all\'ingrosso', paga: 10000, tipo: 'giorno', edu: 0, ore: 8, inizio: 4, gg: LS6, luogo: 'anosibe', skill: 'fitness', minSkill: 20 },
  { id: 'mattonaio', nome: 'Mattonaio alle fornaci', paga: 7000, tipo: 'giorno', edu: 0, ore: 9, inizio: 6, gg: LS6, luogo: 'alasora', skill: 'fitness' },
  { id: 'facchinoaero', nome: 'Facchino all\'aeroporto (mance)', paga: 8000, tipo: 'giorno', edu: 0, ore: 8, inizio: 5, gg: TUTTI, luogo: 'ivato', skill: 'sociale' },
  { id: 'venditore', nome: 'Venditore ambulante (mpivarotra)', paga: 6000, tipo: 'giorno', edu: 0, ore: 10, inizio: 7, gg: TUTTI, luogo: 'behoririka', skill: 'sociale' },
  { id: 'lavapiatti', nome: 'Lavapiatti in hotely', paga: 6000, tipo: 'giorno', edu: 0, ore: 9, inizio: 9, gg: LS6, luogo: 'isotry', skill: 'casa' },
  { id: 'lavapiatti2', nome: 'Lavapiatti in ristorante', paga: 8000, tipo: 'giorno', edu: 0, ore: 8, inizio: 11, gg: MS, luogo: 'tsaralalana', skill: 'casa' },
  { id: 'pousse', nome: 'Tiratore di pousse-pousse / cyclo-pousse', paga: 7000, tipo: 'giorno', edu: 0, ore: 10, inizio: 6, gg: TUTTI, luogo: '67ha', skill: 'fitness', minSkill: 25 },
  // --- mensili senza titolo ---
  { id: 'guardiano', nome: 'Guardiano notturno', paga: 220000, tipo: 'mese', edu: 0, ore: 10, inizio: 20, gg: LS6, luogo: 'ivandry', notte: true },
  { id: 'guardiano2', nome: 'Guardiano notturno', paga: 200000, tipo: 'mese', edu: 0, ore: 11, inizio: 19, gg: LS6, luogo: 'ambatobe', notte: true },
  { id: 'guardiano3', nome: 'Guardiano di deposito', paga: 180000, tipo: 'mese', edu: 0, ore: 12, inizio: 18, gg: LS6, luogo: 'tanjombato', notte: true },
  { id: 'domestica', nome: 'Domestico/a a ore (mpiasa an-trano)', paga: 200000, tipo: 'mese', edu: 0, ore: 8, inizio: 7, gg: LS6, luogo: 'analamahitsy', skill: 'casa', minSkill: 15 },
  { id: 'domestica2', nome: 'Domestico/a in villa', paga: 260000, tipo: 'mese', edu: 0, ore: 9, inizio: 7, gg: LS6, luogo: 'ivandry', skill: 'casa', minSkill: 25 },
  { id: 'giardiniere', nome: 'Giardiniere', paga: 230000, tipo: 'mese', edu: 0, ore: 8, inizio: 7, gg: LS6, luogo: 'ambatobe', skill: 'casa', minSkill: 15 },
  { id: 'operaiofab', nome: 'Operaio/a in fabbrica (plastica)', paga: 240000, tipo: 'mese', edu: 0, ore: 10, inizio: 6, gg: LS6, luogo: 'tanjombato', skill: 'fitness' },
  { id: 'magazziniere', nome: 'Magazziniere', paga: 260000, tipo: 'mese', edu: 0, ore: 9, inizio: 7, gg: LS6, luogo: 'talatamaty', skill: 'fitness', minSkill: 20 },
  { id: 'pulizie', nome: 'Addetto/a pulizie in hotel', paga: 250000, tipo: 'mese', edu: 0, ore: 8, inizio: 6, gg: LS6, luogo: 'ivato', skill: 'casa', minSkill: 15 },
  // --- mensili con CEPE ---
  { id: 'cameriere', nome: 'Cameriere/a hotely', paga: 250000, tipo: 'mese', edu: 1, ore: 9, inizio: 10, gg: MS, luogo: 'analakely', skill: 'sociale' },
  { id: 'cameriere2', nome: 'Cameriere/a hotely', paga: 220000, tipo: 'mese', edu: 1, ore: 10, inizio: 9, gg: MS, luogo: 'ambohipo', skill: 'sociale' },
  { id: 'cameriere3', nome: 'Cameriere/a ristorante', paga: 320000, tipo: 'mese', edu: 1, ore: 9, inizio: 11, gg: MS, luogo: 'ivandry', skill: 'sociale', minSkill: 15 },
  { id: 'zonetranche', nome: 'Operaio/a zona franca (tessile)', paga: 280000, tipo: 'mese', edu: 1, ore: 9, inizio: 7, gg: LS6, luogo: 'ankorondrano' },
  { id: 'zonetranche2', nome: 'Operaio/a tessile', paga: 260000, tipo: 'mese', edu: 1, ore: 9, inizio: 7, gg: LS6, luogo: 'tanjombato' },
  { id: 'commesso', nome: 'Commesso/a Shoprite', paga: 320000, tipo: 'mese', edu: 1, ore: 8, inizio: 8, gg: MS, luogo: 'ankorondrano', skill: 'sociale' },
  { id: 'commesso2', nome: 'Commesso/a Jumbo Score', paga: 300000, tipo: 'mese', edu: 1, ore: 8, inizio: 8, gg: MS, luogo: 'tanjombato', skill: 'sociale' },
  { id: 'commesso3', nome: 'Commesso/a in boutique di tessuti', paga: 240000, tipo: 'mese', edu: 1, ore: 10, inizio: 8, gg: LS6, luogo: 'behoririka', skill: 'sociale' },
  { id: 'cuoco', nome: 'Cuoco/a di hotely', paga: 300000, tipo: 'mese', edu: 1, ore: 10, inizio: 6, gg: LS6, luogo: 'isotry', skill: 'casa', minSkill: 25 },
  { id: 'sarto', nome: 'Sarto/a in atelier', paga: 280000, tipo: 'mese', edu: 1, ore: 9, inizio: 8, gg: LS6, luogo: 'behoririka', skill: 'casa', minSkill: 20 },
  { id: 'autista', nome: 'Autista privato', paga: 500000, tipo: 'mese', edu: 1, ore: 9, inizio: 7, gg: LS6, luogo: 'ivandry', patente: true },
  { id: 'autista2', nome: 'Autista taxi-be', paga: 400000, tipo: 'mese', edu: 1, ore: 12, inizio: 5, gg: LS6, luogo: 'ambohimanarina', patente: true },
  { id: 'autista3', nome: 'Autista navetta hotel', paga: 450000, tipo: 'mese', edu: 1, ore: 10, inizio: 5, gg: LS6, luogo: 'ivato', patente: true, skill: 'sociale' },
  { id: 'camionista', nome: 'Camionista (consegne RN7)', paga: 550000, tipo: 'mese', edu: 1, ore: 11, inizio: 5, gg: LS6, luogo: 'tanjombato', patente: true, skill: 'guida', minSkill: 30 },
  { id: 'meccanico', nome: 'Aiuto meccanico', paga: 300000, tipo: 'mese', edu: 1, ore: 9, inizio: 8, gg: LS6, luogo: '67ha', skill: 'guida', minSkill: 15 },
  { id: 'agentesic', nome: 'Agente di sicurezza (società privata)', paga: 300000, tipo: 'mese', edu: 1, ore: 12, inizio: 7, gg: LS6, luogo: 'ankorondrano', skill: 'fitness', minSkill: 30 },
  // --- mensili con BACC ---
  { id: 'callcenter', nome: 'Operatore call center (francese)', paga: 550000, tipo: 'mese', edu: 2, ore: 8, inizio: 9, gg: LV, luogo: 'ankorondrano', skill: 'sociale', minSkill: 20 },
  { id: 'callcenter2', nome: 'Operatore call center (turno notte, orario Europa)', paga: 650000, tipo: 'mese', edu: 2, ore: 8, inizio: 22, gg: LV, luogo: 'antanimena', skill: 'sociale', minSkill: 20, notte: true },
  { id: 'segretaria', nome: 'Segretario/a', paga: 600000, tipo: 'mese', edu: 2, ore: 8, inizio: 8, gg: LV, luogo: 'antanimena', skill: 'intelligenza', minSkill: 15 },
  { id: 'segretaria2', nome: 'Segretario/a in agenzia immobiliare', paga: 500000, tipo: 'mese', edu: 2, ore: 8, inizio: 8, gg: LS6, luogo: 'talatamaty', skill: 'intelligenza', minSkill: 15 },
  { id: 'cassiere', nome: 'Cassiere/a supermercato', paga: 420000, tipo: 'mese', edu: 2, ore: 8, inizio: 9, gg: MS, luogo: 'ankorondrano', skill: 'intelligenza', minSkill: 10 },
  { id: 'receptionist', nome: 'Receptionist d\'hotel', paga: 600000, tipo: 'mese', edu: 2, ore: 9, inizio: 6, gg: LS6, luogo: 'ivato', skill: 'sociale', minSkill: 30 },
  { id: 'receptionist2', nome: 'Receptionist piccolo hotel', paga: 450000, tipo: 'mese', edu: 2, ore: 10, inizio: 7, gg: LS6, luogo: 'tsaralalana', skill: 'sociale', minSkill: 20 },
  { id: 'guida', nome: 'Guida turistica (città alta)', paga: 500000, tipo: 'mese', edu: 2, ore: 7, inizio: 9, gg: MS, luogo: 'ambanidia', skill: 'sociale', minSkill: 35 },
  { id: 'maestro', nome: 'Insegnante scuola primaria', paga: 650000, tipo: 'mese', edu: 2, ore: 7, inizio: 7, gg: LV, luogo: 'ambohipo', skill: 'intelligenza', minSkill: 25 },
  { id: 'maestro2', nome: 'Insegnante scuola primaria pubblica', paga: 480000, tipo: 'mese', edu: 2, ore: 7, inizio: 7, gg: LV, luogo: 'ambohimanarina', skill: 'intelligenza', minSkill: 20 },
  { id: 'maestro3', nome: 'Insegnante scuola privata', paga: 750000, tipo: 'mese', edu: 2, ore: 8, inizio: 7, gg: LV, luogo: 'analamahitsy', skill: 'intelligenza', minSkill: 35 },
  { id: 'poliziotto', nome: 'Agente di polizia', paga: 700000, tipo: 'mese', edu: 2, ore: 9, inizio: 7, gg: LS6, luogo: 'anosy', skill: 'fitness', minSkill: 40 },
  { id: 'gendarme', nome: 'Gendarme', paga: 720000, tipo: 'mese', edu: 2, ore: 10, inizio: 6, gg: LS6, luogo: 'alasora', skill: 'fitness', minSkill: 40 },
  { id: 'capoturno', nome: 'Capoturno in fabbrica', paga: 600000, tipo: 'mese', edu: 2, ore: 10, inizio: 6, gg: LS6, luogo: 'tanjombato', skill: 'sociale', minSkill: 30, esp: 1 },
  { id: 'agenteimm', nome: 'Agente immobiliare (provvigioni)', paga: 700000, tipo: 'mese', edu: 2, ore: 9, inizio: 8, gg: LS6, luogo: 'talatamaty', skill: 'business', minSkill: 20 },
  { id: 'agenteviaggi', nome: 'Agente di viaggio / check-in', paga: 800000, tipo: 'mese', edu: 2, ore: 9, inizio: 5, gg: LS6, luogo: 'ivato', skill: 'sociale', minSkill: 40 },
  // --- laurea ---
  { id: 'infermiere', nome: 'Infermiere/a', paga: 750000, tipo: 'mese', edu: 3, ore: 9, inizio: 7, gg: LS6, luogo: 'ampefiloha', skill: 'intelligenza', minSkill: 30 },
  { id: 'infermiere2', nome: 'Infermiere/a in clinica privata', paga: 900000, tipo: 'mese', edu: 3, ore: 9, inizio: 7, gg: LS6, luogo: 'analamahitsy', skill: 'intelligenza', minSkill: 40 },
  { id: 'contabile', nome: 'Contabile', paga: 1200000, tipo: 'mese', edu: 3, ore: 8, inizio: 8, gg: LV, luogo: 'antanimena', skill: 'intelligenza', minSkill: 45 },
  { id: 'contabile2', nome: 'Contabile di fabbrica', paga: 1000000, tipo: 'mese', edu: 3, ore: 9, inizio: 7, gg: LS6, luogo: 'tanjombato', skill: 'intelligenza', minSkill: 40 },
  { id: 'prof', nome: 'Professore di liceo', paga: 900000, tipo: 'mese', edu: 3, ore: 7, inizio: 7, gg: LV, luogo: 'analamahitsy', skill: 'intelligenza', minSkill: 45 },
  { id: 'ong', nome: 'Assistente di progetto in ONG', paga: 1400000, tipo: 'mese', edu: 3, ore: 8, inizio: 8, gg: LV, luogo: 'ivandry', skill: 'sociale', minSkill: 45 },
  { id: 'dev', nome: 'Sviluppatore software', paga: 2000000, tipo: 'mese', edu: 3, ore: 8, inizio: 9, gg: LV, luogo: 'ankorondrano', skill: 'intelligenza', minSkill: 55 },
  { id: 'dev2', nome: 'Sviluppatore web (start-up)', paga: 1500000, tipo: 'mese', edu: 3, ore: 9, inizio: 9, gg: LV, luogo: 'antanimena', skill: 'intelligenza', minSkill: 45 },
  { id: 'medico', nome: 'Medico', paga: 2500000, tipo: 'mese', edu: 4, ore: 10, inizio: 7, gg: LS6, luogo: 'ampefiloha', skill: 'intelligenza', minSkill: 65 },
  { id: 'medico2', nome: 'Medico in clinica privata', paga: 3200000, tipo: 'mese', edu: 4, ore: 9, inizio: 8, gg: LV, luogo: 'ivandry', skill: 'intelligenza', minSkill: 70, esp: 2 },
  { id: 'avvocato', nome: 'Avvocato', paga: 3000000, tipo: 'mese', edu: 4, ore: 9, inizio: 8, gg: LV, luogo: 'anosy', skill: 'sociale', minSkill: 60 },
  { id: 'ingegnere', nome: 'Ingegnere (Ambatovy)', paga: 3500000, tipo: 'mese', edu: 4, ore: 9, inizio: 8, gg: LV, luogo: 'ankorondrano', skill: 'intelligenza', minSkill: 65 },
  { id: 'pilota', nome: 'Pilota di linea (Madagascar Airlines)', paga: 5000000, tipo: 'mese', edu: 4, ore: 10, inizio: 5, gg: LS6, luogo: 'ivato', skill: 'intelligenza', minSkill: 75, esp: 3 },
  { id: 'dirigente', nome: 'Dirigente di banca', paga: 6000000, tipo: 'mese', edu: 4, ore: 10, inizio: 8, gg: LV, luogo: 'antanimena', skill: 'intelligenza', minSkill: 75, esp: 3 },
  { id: 'direttorefab', nome: 'Direttore di stabilimento', paga: 7000000, tipo: 'mese', edu: 4, ore: 10, inizio: 7, gg: LS6, luogo: 'tanjombato', skill: 'business', minSkill: 60, esp: 4 },
  { id: 'ministro', nome: 'Alto funzionario ministeriale', paga: 9000000, tipo: 'mese', edu: 4, ore: 8, inizio: 8, gg: LV, luogo: 'anosy', skill: 'sociale', minSkill: 85, esp: 5 },
];
LAVORI.forEach(l => { if (l.id !== 'nulla') l.fine = (l.inizio + l.ore) % 24; });
function giorniTxt(l) { if (!l.gg.length) return ''; if (l.gg.length === 7) return 'tutti i giorni'; if (l.gg.join() === LV.join()) return 'lun–ven'; if (l.gg.join() === LS6.join()) return 'lun–sab'; if (l.gg.join() === MS.join()) return 'mar–dom (riposo lunedì)'; return l.gg.map(g => GG[g]).join(' '); }
function orarioLavoro(l) { return `${hh(l.inizio)}–${hh(l.fine)}`; }
const STATO_LBL = { conoscente: 'conoscente', fidanzato: 'fidanzato/a', promesso: 'promesso/a', sposato: 'sposato/a', ex: 'ex' };
const TRATTI_LBL = {};
const trattiTxt = p => p.tratti.map(t => TRATTI_LBL[t] || t).join(', ');
const TRATTI_DESC = { allegro: 'ridi facilmente, fai battute, vedi il lato buono', sospettoso: 'ti fidi poco, fai domande, tieni le distanze finché non ti convinci', chiacchierone: 'parli tanto, racconti fatti tuoi e del quartiere, fai fatica a chiudere', timido: 'frasi corte, ti imbarazzi, ti apri solo piano piano', severo: 'sei diretto e rigido, pretendi rispetto e puntualità', generoso: 'offri e aiuti volentieri anche se hai poco', pettegolo: 'sai tutto di tutti e lo racconti; ti piace scoprire cose sul giocatore', religioso: 'citi Dio e la chiesa, giudichi vizi e alcol, sei accogliente', ambizioso: 'parli di soldi, progetti, chi conta; rispetti chi si dà da fare', pigro: 'minimizzi, rimandi, non hai voglia di fare sforzi', romantico: 'sei sentimentale, fai complimenti, ti innamori facilmente', pratico: 'vai al sodo, parli di prezzi, soluzioni e cose concrete', ironico: 'prendi in giro con affetto, usi sarcasmo', ansioso: 'ti preoccupi per tutto, chiedi conferme', orgoglioso: 'non ammetti torti, ti offendi facilmente', materno: 'ti prendi cura, chiedi se ha mangiato, sgridi con affetto', furbo: 'cerchi il tuo tornaconto, negozi, prometti a metà', gentile: 'sei cortese e paziente, non alzi mai la voce' };
const FIGURE_FISSE = { mercato: ['venditrice di riso al mercato', 'venditore di brèdes e pomodori'], epicerie: ['proprietario/a dell\'épicerie'], minimarket: ['cassiera del mini market'], super: ['cassiera del supermercato'], bagni: ['custode dei bagni pubblici'], gargote: ['cuoca padrona dell\'hotely'], ristorante: ['cameriere del ristorante'], annunci: ['impiegata dell\'agenzia di lavoro'], agenzia: ['agente immobiliare'], farmacia: ['farmacista'], auto: ['venditore di auto usate'], stadio: ['allenatore della squadra di quartiere'], palestra: ['istruttore della palestra'], chiesa: ['pastore della FJKM'], bar: ['barista'], lago: ['venditore di gelati al lago'], zonafranca: ['guardiano della zona franca'], aeroporto: ['tassista dell\'aeroporto'], fornace: ['capo della fornace'], grossista: ['grossista di riso'], fabbrica: ['guardiano della fabbrica'], rova: ['guida turistica del Rova'], comune: ['impiegato del Comune'] };
const FIGURE_OCC = { negozio: ['cliente in fila', 'mamma con bambino che fa la spesa', 'ragazzo mandato a fare commissioni', 'signora che tratta sul prezzo'], cibo: ['cliente al tavolo accanto', 'studente che mangia in fretta', 'operaio in pausa pranzo', 'tassista che beve un caffè'], strada: ['passante', 'venditore ambulante di mofo gasy', 'tassista in attesa di clienti', 'tiratore di pousse-pousse', 'studentessa che aspetta il taxi-be', 'nonna che vende arachidi', 'muratore che torna dal cantiere', 'ragazzo che vende schede telefoniche'], ufficio: ['persona in attesa allo sportello', 'giovane che compila un modulo'], salute: ['paziente in sala d\'attesa', 'infermiera di turno'], svago: ['ragazzo che gioca a pallone', 'coppia che passeggia', 'turista vazaha con la guida', 'giovane che fa jogging'] };
const CAT_POI = { mercato: 'negozio', epicerie: 'negozio', minimarket: 'negozio', super: 'negozio', farmacia: 'negozio', gargote: 'cibo', ristorante: 'cibo', bar: 'cibo', annunci: 'ufficio', banca: 'ufficio', agenzia: 'ufficio', comune: 'ufficio', auto: 'ufficio', ospedale: 'salute', stadio: 'svago', palestra: 'svago', lago: 'svago', rova: 'svago', chiesa: 'svago', scuola: 'ufficio', universita: 'svago', aeroporto: 'strada', zonafranca: 'strada', fornace: 'strada', grossista: 'negozio', fabbrica: 'strada' };
const RUOLO_GUIDA = { capo: 'sei IL CAPO: parli di turni, obiettivi, clienti, disciplina; giudichi la performance e la puntualità; puoi premiare o punire; non sei un amico anche se puoi essere cordiale', collega: 'sei un COLLEGA: parli del lavoro di tutti i giorni, del capo, dei turni, delle paghe, dei pettegolezzi dell\'azienda; puoi allearti col giocatore o fargli concorrenza', amico: 'sei un AMICO: parli di vita, famiglia, soldi, ragazze/ragazzi, calcio, chiesa; puoi aiutare ma hai anche i tuoi problemi', vicino: 'sei il VICINO: parli del quartiere, del rumore, dell\'acqua della pompa, del fokontany, dei ladri; osservi tutto quello che fa il giocatore', venditore: 'sei un VENDITORE: vendi, tratti i prezzi, ti lamenti della concorrenza e del costo del riso; sei gentile con chi compra spesso', poliziotto: 'sei un AGENTE: formale, sospettoso, chiedi documenti; puoi chiudere un occhio o no', medico: 'sei MEDICO: fai domande sui sintomi, dai consigli di salute, parli dei costi delle cure', professore: 'sei PROFESSORE: parli di studio, esami, disciplina; incoraggi chi si impegna', bancario: 'sei IMPIEGATO DI BANCA: parli di conti, prestiti, garanzie; sei formale', dipendente: 'sei il DIPENDENTE del giocatore: parli del lavoro, chiedi la paga, ti lamenti o ti impegni a seconda di come ti tratta', sconosciuto: 'sei una persona che il giocatore ha appena incontrato: sii naturale, parla della tua giornata e del tuo mestiere, chiedi chi è' };
const dominio = p => p.mest ? `Il tuo mestiere/ruolo preciso qui: ${p.mest}${p.luogoNome ? ' (' + p.luogoNome + ')' : ''}. Parla e agisci da quello che sei: dei tuoi clienti, prezzi, colleghi, orari, di ciò che vedi in questo posto.` : '';
const TIER_LBL = ['', 'popolare', 'media', 'buona', 'alta', 'lusso', 'centro'];
const SKILL_LBL = { intelligenza: 'intelligenza', sociale: 'sociale', fitness: 'fitness', casa: 'casa', guida: 'guida', business: 'business' };
const EDU = ['Nessun titolo', 'Licenza primaria (CEPE)', 'Diploma liceo (BACC)', 'Laurea (Licence)', 'Master / Specializzazione'];
const SCUOLE = [
  { liv: 1, nome: 'Corsi serali / primaria (CEPE)', costo: 20000, mesi: 6, poi: 'scuola' },
  { liv: 2, nome: 'Liceo (fino al BACC)', costo: 60000, mesi: 12, poi: 'scuola' },
  { liv: 3, nome: 'Università di Antananarivo (Licence)', costo: 150000, mesi: 24, poi: 'universita' },
  { liv: 4, nome: 'Master / Medicina / Ingegneria', costo: 400000, mesi: 24, poi: 'universita' },
];
const ATTIVITA = [
  { id: 'epicerie', nome: 'Épicerie di quartiere', costo: 3000000, base: 25000, icon: '🏪' },
  { id: 'gargote', nome: 'Hotely gasy (gargote)', costo: 5000000, base: 45000, icon: '🍲' },
  { id: 'taxi', nome: 'Taxi (serve auto)', costo: 800000, base: 40000, icon: '🚕', auto: true },
  { id: 'cyber', nome: 'Cyber café', costo: 12000000, base: 90000, icon: '🖥️' },
  { id: 'atelier', nome: 'Atelier di sartoria', costo: 8000000, base: 70000, icon: '🧵' },
  { id: 'agenzia', nome: 'Agenzia immobiliare', costo: 40000000, base: 300000, icon: '🏢' },
  { id: 'mattoni', nome: 'Fornace di mattoni', costo: 4000000, base: 35000, icon: '🧱', q: ['alasora', 'itaosy', 'andoharanofotsy'] },
  { id: 'grossista', nome: 'Deposito riso & carbone all\'ingrosso', costo: 20000000, base: 140000, icon: '🚛', q: ['anosibe', 'andravoahangy'] },
  { id: 'artigianato', nome: 'Bancarella di artigianato per turisti', costo: 2500000, base: 30000, icon: '🎨', q: ['ivato', 'ambanidia', 'analakely'] },
  { id: 'guesthouse', nome: 'Guest house / chambres d\'hôtes', costo: 60000000, base: 380000, icon: '🛏️', q: ['ivato', 'ambanidia', 'talatamaty', 'analamahitsy'] },
  { id: 'scuolaprivata', nome: 'Scuola privata', costo: 35000000, base: 250000, icon: '🏫', q: ['analamahitsy', 'ambohimanarina', 'talatamaty', 'alasora'] },
  { id: 'lavaggio', nome: 'Autolavaggio', costo: 6000000, base: 55000, icon: '🚿', q: ['tanjombato', 'talatamaty', 'ankorondrano', 'analamahitsy'] },
  { id: 'import', nome: 'Import-export (container)', costo: 150000000, base: 1200000, icon: '🚢' },
];

/* ---------- LAVORETTI (asa tselika) ---------- */
const LAVORETTI = [
  { id: 'trasloco', nome: 'Aiutare in un trasloco (facchino)', icon: '📦', ore: [3, 5], paga: 2000, fatica: 9, igiene: 6, fit: 15, tiers: [1, 2, 3, 4, 5], skill: 'fitness', desc: 'Divani e armadi su per le scale, "mora mora" ma senza fermarsi.' },
  { id: 'scarico', nome: 'Scaricare un camion di merce', icon: '🚛', ore: [2, 3], paga: 2200, fatica: 10, igiene: 7, fit: 20, tiers: [1, 2, 3], skill: 'fitness', desc: 'Sacchi di riso da 50 kg dal camion al magazzino.' },
  { id: 'consegna', nome: 'Consegne per un\'épicerie', icon: '🛵', ore: [2, 4], paga: 1500, fatica: 4, igiene: 3, tiers: [1, 2, 3, 4, 5], skill: 'sociale', veicolo: 1.6, desc: 'Bombole, casse d\'acqua e sacchi di riso a domicilio. Con la bici o la moto rendi molto di più.' },
  { id: 'pacchi', nome: 'Portare la spesa alle signore del mercato', icon: '🧺', ore: [1, 3], paga: 1200, fatica: 5, igiene: 4, tiers: [1, 2], skill: 'sociale', desc: 'Segui le clienti fino al taxi-be con le ceste sulla testa.' },
  { id: 'lavaggio', nome: 'Lavare auto in strada', icon: '🚗', ore: [1, 3], paga: 1800, fatica: 5, igiene: 5, tiers: [2, 3, 4, 5], skill: 'casa', desc: 'Secchio, straccio e un sorriso davanti al parcheggio.' },
  { id: 'panni', nome: 'Fare il bucato per una famiglia (mpanasa lamba)', icon: '🫧', ore: [3, 5], paga: 1500, fatica: 6, igiene: 3, tiers: [1, 2, 3, 4, 5], skill: 'casa', casa: 10, bucato: true, desc: 'Lavare a mano lenzuola, camicie e pantaloni di una famiglia.' },
  { id: 'cantiere', nome: 'Giornata in cantiere (impastare cemento)', icon: '🧱', ore: [4, 6], paga: 1800, fatica: 8, igiene: 8, fit: 20, tiers: [1, 2, 3], skill: 'fitness', desc: 'Un muratore del quartiere cerca braccia per oggi.' },
  { id: 'guardia', nome: 'Sorvegliare un negozio per qualche ora', icon: '👁️', ore: [2, 4], paga: 1300, fatica: 2, igiene: 1, tiers: [1, 2, 3], skill: 'sociale', desc: 'Il proprietario deve uscire e non si fida di lasciare tutto.' },
  { id: 'giardino', nome: 'Sistemare un giardino', icon: '🌿', ore: [2, 4], paga: 2500, fatica: 6, igiene: 5, tiers: [3, 4, 5], skill: 'casa', desc: 'Le ville hanno prati da tagliare e siepi da potare.' },
  { id: 'babysitter', nome: 'Badare ai bambini di una vicina', icon: '👶', ore: [2, 4], paga: 1500, fatica: 3, igiene: 1, tiers: [2, 3, 4, 5], skill: 'sociale', soc: 15, desc: 'Serve fiducia: la mamma ti conosce di vista.' },
  { id: 'ripetizioni', nome: 'Ripetizioni di francese/matematica', icon: '📖', ore: [1, 2], paga: 4000, fatica: 2, igiene: 0, tiers: [2, 3, 4, 5], skill: 'intelligenza', edu: 2, desc: 'Una famiglia cerca chi aiuti il figlio prima degli esami.' },
  { id: 'volantini', nome: 'Distribuire volantini', icon: '📄', ore: [2, 3], paga: 1000, fatica: 4, igiene: 3, tiers: [1, 2, 3, 4], skill: 'sociale', desc: 'Un negozio nuovo vuole farsi conoscere.' },
  { id: 'evento', nome: 'Servire a una festa (matrimonio, famadihana)', icon: '🍽️', ore: [4, 6], paga: 2000, fatica: 5, igiene: 3, tiers: [1, 2, 3, 4, 5], skill: 'sociale', soc: 10, weekend: true, desc: 'Servire riso e bibite a 200 invitati. Spesso ti danno anche da mangiare.' },
  { id: 'ricevitore', nome: 'Sostituire il ricevitore di un taxi-be', icon: '🚌', ore: [3, 5], paga: 1500, fatica: 6, igiene: 6, tiers: [1, 2], skill: 'sociale', desc: 'Il ricevitore è malato, l\'autista cerca qualcuno per oggi.' },
  { id: 'valigie', nome: 'Portare valigie ai turisti', icon: '🧳', ore: [2, 4], paga: 2500, fatica: 5, igiene: 3, tiers: [1, 2, 3, 4, 5], q: ['ivato'], skill: 'sociale', desc: 'All\'arrivo dei voli i vazaha cercano chi porti le valigie al taxi. Le mance fanno la differenza.' },
  { id: 'mattoni', nome: 'Impilare mattoni alla fornace', icon: '🧱', ore: [3, 5], paga: 1600, fatica: 9, igiene: 8, fit: 15, tiers: [1, 2], q: ['alasora', 'itaosy'], skill: 'fitness', desc: 'Mille mattoni da spostare prima della pioggia.' },
  { id: 'carbone', nome: 'Scaricare sacchi di carbone', icon: '🪵', ore: [2, 4], paga: 2400, fatica: 10, igiene: 10, fit: 20, tiers: [1, 2], q: ['anosibe', 'andravoahangy'], skill: 'fitness', desc: 'Il camion arriva all\'alba: sacchi neri fino a mezzogiorno.' },
  { id: 'spesa', nome: 'Fare la spesa per una famiglia (commissioni)', icon: '🛍️', ore: [1, 3], paga: 2000, fatica: 3, igiene: 2, tiers: [3, 4, 5], skill: 'sociale', soc: 15, desc: 'Lista in mano, mercato e farmacia: ti pagano anche il taxi-be.' },
  { id: 'inventario', nome: 'Inventario notturno in un negozio', icon: '📋', ore: [3, 5], paga: 2200, fatica: 4, igiene: 1, tiers: [2, 3, 4], edu: 1, skill: 'intelligenza', desc: 'Contare scatole e scrivere numeri: serve saper leggere bene.' },
  { id: 'traduzione', nome: 'Fare da interprete a un turista', icon: '🗣️', ore: [2, 4], paga: 5000, fatica: 2, igiene: 1, tiers: [2, 3, 4, 5], q: ['ivato', 'ambanidia', 'analakely', 'ivandry'], skill: 'sociale', edu: 2, soc: 30, desc: 'Un vazaha vuole visitare il Rova o contrattare al mercato: parla francese con lui.' },
  { id: 'risaia', nome: 'Giornata nella risaia', icon: '🌾', ore: [4, 6], paga: 1200, fatica: 8, igiene: 9, fit: 10, tiers: [1], q: ['alasora', 'itaosy', 'ambohimanarina'], skill: 'fitness', desc: 'Trapiantare o mietere il riso con i piedi nel fango. Ti danno anche il pranzo.' },
  { id: 'catering', nome: 'Aiuto in cucina per un catering', icon: '🍛', ore: [4, 6], paga: 1800, fatica: 5, igiene: 4, tiers: [2, 3, 4, 5], skill: 'casa', casa: 15, desc: 'Sbucciare, tagliare, friggere per 100 persone.' },
];
// Compatibilità di un lavoretto con il turno fisso di oggi (in minuti dalla mezzanotte)
function turnoOggi() { const l = lavoro(); if (l.id === 'nulla' || S.flags.lavoratoOggi === now().toDateString()) return null; if (!l.gg.includes(giornoIdx())) return null; if (S.flags.inizioLavoro && now().getTime() < S.flags.inizioLavoro) return null; const ini = l.inizio * 60, fin = ini + l.ore * 60; if (minutiOra() > fin - 120 && !l.notte) return null; /* turno già perso: non blocca */ return { ini, fin, l }; }
function conflittoLavoretto(j) { const t = turnoOggi(); if (!t) return null; const ji = j.inizio * 60, jf = ji + j.ore * 60; const ora_ = minutiOra();
  if (ji < t.fin && jf > t.ini) return { tipo: 'sovrapposto', txt: `si sovrappone al tuo turno ${hh(t.l.inizio)}–${hh(t.l.fine)}` };
  if (ji >= t.fin) return { tipo: 'dopo', txt: `dopo il turno (finisci alle ${hh(t.l.fine)})`, primaTurno: ora_ < t.fin };
  return { tipo: 'prima', txt: `prima del turno (inizia alle ${hh(t.l.inizio)})` }; }
function lavorettiOggi() {
  const key = now().toDateString() + '|' + S.q; if (S.flags.lavKey === key) return S.flags.lavList;
  const q = Q(S.q); const rete = (S.flags.rep && S.flags.rep[S.q]) || 0; const conosc = S.png.filter(p => p.aff >= 30).length;
  const n = Math.min(5, 1 + Math.floor(Math.random() * 2) + (rete >= 3 ? 1 : 0) + (rete >= 8 ? 1 : 0) + (conosc >= 5 ? 1 : 0) + (ha('telefono') ? 1 : 0));
  const pool = LAVORETTI.filter(l => (l.q ? l.q.includes(q.id) : l.tiers.includes(q.tier)) && (!l.weekend || giornoIdx() >= 5));
  const list = []; for (let i = 0; i < n && pool.length; i++) { const l = pool.splice(Math.floor(Math.random() * pool.length), 1)[0]; const ore = rnd(l.ore[0], l.ore[1]); let inizio = rnd(7, 15); { const lv = lavoro(); if (lv.id !== 'nulla' && lv.gg.includes(giornoIdx()) && Math.random() < 0.7) { const fine = lv.inizio + lv.ore; if (fine <= 16) inizio = rnd(Math.max(7, fine), 17); else if (lv.inizio >= 12) inizio = rnd(7, Math.max(7, lv.inizio - ore - 1)); } } const item = { id: l.id, ore, inizio, paga: Math.round(l.paga * ore * MULT_CIBO[q.tier] * (0.85 + Math.random() * 0.3) / 100) * 100, fatto: false }; if (l.bucato) item.bucato = { capi: ore * 8 + rnd(0, 6), cortile: q.tier >= 3 ? Math.random() < 0.75 : Math.random() < 0.3 }; list.push(item); }
  S.flags.lavKey = key; S.flags.lavList = list; return list;
}
/* ---------- STATO ---------- */
let S = null;
let ui = { tab: 'home', modal: null, toastT: null, aiActive: 'none' };
const DISP_VUOTA = () => ({ riso: 0, fagioli: 0, pasta: 0, patate: 0, carne: 0, pollo: 0, pesce: 0, sardine: 0, uova: 0, brede: 0, pomodoro: 0, cipolla: 0, verdure: 0, olio: 0, zucchero: 0, sale: 0, caffe: 0, latte: 0, pane: 0, acqua: 0, carbone: 0, gas: 0, sapone: 0 });

const MEST_RUOLO = { venditore: ['venditore di riso al mercato', 'venditrice di frutta', 'venditore di vestiti usati (friperie)'], vicino: ['vicino/a di casa, fa il sarto', 'vicina di casa, vende mofo gasy', 'vicino di casa, guardiano notturno', 'vicina di casa, casalinga con tre figli'], amico: ['amico/a, apprendista meccanico', 'amico/a, studente', 'amico/a, venditore ambulante', 'amico/a, tassista', 'amico/a, parrucchiera'] };
function nuovoPNG(ruolo, opts = {}) {
  const gen = opts.gen || pick(['M', 'F']); if (MEST_RUOLO[ruolo] && !(opts.extra && opts.extra.mest)) opts.extra = { mest: pick(MEST_RUOLO[ruolo]), ...(opts.extra || {}) };
  return { id: 'p' + Math.random().toString(36).slice(2, 9), gen, nome: pick(gen === 'M' ? NOMI_M : NOMI_F), cognome: pick(COGNOMI), eta: opts.eta || rnd(18, 60), ruolo, tratti: [pick(TRATTI), pick(TRATTI)], quartiere: pick(QUARTIERI).nome, aff: opts.aff ?? rnd(5, 25), rom: 0, stato: 'conoscente', comp: rnd(1, 365), storia: [], ...opts.extra };
}
function nuovaPartita(nome, gen, eta) {
  const start = new Date(2026, 8, 7, 7, 0);
  S = {
    v: 2, nome, gen, nascita: rnd(1, 365), eta, min: 0, start: start.getTime(),
    soldi: 20000, banca: null,
    bis: { fame: 60, energia: 80, igiene: 50, vescica: 70, umore: 55, salute: 85 },
    skill: { intelligenza: 5, sociale: 5, fitness: 10, casa: 5, guida: 0, business: 0 },
    edu: 0, scuola: null, patente: false,
    casa: 'strada', proprieta: [], mobili: [], veicoli: [], veicolo: null, cantiere: null,
    disp: DISP_VUOTA(), fresco: {}, medicine: {},
    pantoBagnati: 0, pantoSporchi: 3, pantoPuliti: 2, sporcoCasa: 20,
    lavoro: 'nulla', ggLavorati: 0, esp: 0, perf: 50, capo: null,
    attivita: null, q: 'analakely', loc: null, malattie: [],
    png: [], partner: null, sposato: false, figli: [], gravidanza: null,
    log: [], fedina: 0, stat: { gg: 0, pasti: 0, lavate: 0 }, flags: {},
  };
  S.png.push(nuovoPNG('amico', { aff: 40, eta: eta + rnd(-3, 3) }));
  S.png.push(nuovoPNG('vicino', { aff: 15 }));
  S.png.push(nuovoPNG('venditore', { aff: 10 }));
  S.png.push(nuovoPNG('poliziotto', { aff: 0, gen: 'M' }));
  S.png.push(nuovoPNG('medico', { aff: 5 }));
  S.png.push(nuovoPNG('sconosciuto', { aff: 5, eta: eta + rnd(-2, 5) }));
  log(`Benvenuto/a ad Antananarivo, ${nome}. Sei ad Analakely con ${Ar(S.soldi)} Ar in tasca, nessuna casa, nessun lavoro.`, 'info');
  log('Consigli: 📋 cerca un lavoro giornaliero alla bacheca di Analakely; mangia all\'hotely (senza casa non puoi cucinare); per una stanza vai in un\'agenzia immobiliare (Analakely, Antanimena…).', 'info');
  salva();
}
function migra(s) {
  if (s.v >= 2) return s;
  const mapQ = { Analakely: 'analakely', Isotry: 'isotry', '67 Ha': '67ha', Anosy: 'anosy', Ampefiloha: 'ampefiloha', Antanimena: 'antanimena', Ankorondrano: 'ankorondrano', Ivandry: 'ivandry', Ambatobe: 'ambatobe', Ambohipo: 'ambohipo', Itaosy: 'itaosy', Andoharanofotsy: 'andoharanofotsy' };
  const mapC = { stanza: 'isotry-stanza', trano1: '67ha-mono', trano2: 'ampefiloha-bilo', trano3: 'ankorondrano-app', villa: 'ivandry-villa', buy1: 'itaosy-casav', buy2: 'antanimena-appv', buy3: 'ambatobe-villav' };
  s.q = mapQ[s.locQ] || 'analakely'; s.loc = null;
  s.casa = mapC[s.casa] || s.casa; s.proprieta = (s.proprieta || []).map(c => mapC[c] || c);
  const d = DISP_VUOTA(); if (s.inv) { d.riso = (s.inv.riso || 0) * 3; d.fagioli = s.inv.laoka || 0; d.sapone = s.inv.sapone || 0; d.carbone = s.inv.carbone || 0; d.gas = s.inv.gasb || 0; s.medicine = s.inv.medicine || {}; }
  s.disp = d; s.fresco = {}; s.cantiere = null; s.medicine = s.medicine || {};
  s.mobili = (s.mobili || []).map(m => m === 'gas' ? 'gasf' : m);
  s.v = 2; return s;
}

/* ---------- TEMPO / HELPERS ---------- */
const now = () => new Date(S.start + S.min * 60000);
const ora = () => now().getHours();
const giornoIdx = () => (now().getDay() + 6) % 7;
const oraStr = () => { const d = now(); return `${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`; };
function dataStr() { const d = now(); return `${GIORNI[giornoIdx()].slice(0, 3)} ${d.getDate()} ${MESI[d.getMonth()]} ${oraStr()}`; }
function giornoAnno(d) { const s = new Date(d.getFullYear(), 0, 0); return Math.floor((d - s) / 86400000); }
function minutiOra() { const d = now(); return d.getHours() * 60 + d.getMinutes(); }
function casa() { return CASE.find(c => c.id === S.casa); }
function casaQ() { return S.casa === 'costruita' ? S.flags.casaQ : casa().q; }
function ha(id) { return S.mobili.includes(id); }
function lavoro() { return LAVORI.find(l => l.id === S.lavoro); }
function haCasa() { return S.casa !== 'strada'; }
function png(id) { return S.png.find(p => p.id === id) || (S.folla || []).find(p => p.id === id); }
function folla() { return S.folla || (S.folla = []); }
function chiaveLuogo(qid, poi) { return `${qid}:${poi || 'strada'}`; }
function figuraNuova(qid, poi, mest, fissa) {
  const q = Q(qid); const nome = poi ? (POI[poi]?.nome || poi) : q.nome;
  const p = nuovoPNG('sconosciuto', { aff: fissa ? 15 : 12, extra: { mest, luogoQ: qid, luogoPoi: poi || null, luogoNome: nome, fissa: !!fissa, gg: S.stat.gg, quartiere: fissa && Math.random() < 0.5 ? q.nome : pick(QUARTIERI).nome } });
  if (/mamma|signora|nonna|cassiera|cuoca|venditrice|studentessa|infermiera|impiegata/.test(mest)) { p.gen = 'F'; p.nome = pick(NOMI_F); }
  if (/ragazzo|studente|giovane|muratore|tiratore|guardiano|tassista|operaio|allenatore|pastore|barista|cameriere|proprietario|venditore|capo|grossista/.test(mest) && p.gen === 'F' && !/proprietario\/a/.test(mest)) { p.gen = 'M'; p.nome = pick(NOMI_M); }
  if (/nonna/.test(mest)) p.eta = rnd(60, 78); else if (/ragazzo|studente|giovane/.test(mest)) p.eta = rnd(16, 24); else if (/pastore|capo|grossista|proprietario|guida/.test(mest)) p.eta = rnd(35, 62);
  return p;
}
function personeQui(qid, poi) {
  // Figure fisse (sempre le stesse) + figure occasionali del giorno, per ogni luogo di ogni quartiere.
  const k = chiaveLuogo(qid, poi); const F = folla();
  let fissi = [...S.png, ...F].filter(p => p.luogoQ === qid && (p.luogoPoi || null) === (poi || null) && p.fissa);
  if (!fissi.length && poi && FIGURE_FISSE[poi]) { fissi = FIGURE_FISSE[poi].map(m => figuraNuova(qid, poi, m, true)); F.push(...fissi); }
  let occ = F.filter(p => p.luogoQ === qid && (p.luogoPoi || null) === (poi || null) && !p.fissa && p.gg === S.stat.gg);
  if (!occ.length && !S.flags['gen' + k + S.stat.gg]) {
    S.flags['gen' + k + S.stat.gg] = 1; const pool = poi ? (FIGURE_OCC[CAT_POI[poi]] || FIGURE_OCC.strada) : FIGURE_OCC.strada; const n = poi ? rnd(1, 2) : rnd(1, 3);
    for (let i = 0; i < n; i++) { const o = figuraNuova(qid, poi, pick(pool), false); F.push(o); occ.push(o); }
  }
  const noti = S.png.filter(p => !p.fissa && p.luogoQ === qid && (p.luogoPoi || null) === (poi || null) && p.gg === S.stat.gg);
  return [...fissi, ...noti, ...occ];
}
function pulisciFolla() { S.folla = folla().filter(p => p.fissa || p.gg === S.stat.gg); for (const k in S.flags) if (k.startsWith('gen') && !k.endsWith(String(S.stat.gg))) delete S.flags[k]; }
function doveSta(p) {
  // Dove si trova il personaggio adesso: al suo posto fisso, al lavoro con te, oppure a casa sua.
  const h = ora();
  if (p.luogoQ && (p.fissa ? h >= 6 && h < 21 : p.gg === S.stat.gg)) return { q: p.luogoQ, poi: p.luogoPoi, txt: p.luogoNome + (p.luogoPoi ? ' a ' + Q(p.luogoQ).nome : '') };
  if (['capo', 'collega'].includes(p.ruolo) && S.lavoro !== 'nulla' && statoTurno(lavoro()).stato !== 'chiuso' && h >= 7 && h < 19) return { q: lavoro().luogo, poi: 'lavoro', txt: 'al lavoro' };
  const qid = QUARTIERI.find(q => q.nome === p.quartiere)?.id || S.q; return { q: qid, poi: 'casa', txt: 'a casa sua a ' + p.quartiere };
}
function presente(p) { const d = doveSta(p); if (d.q !== S.q) return false; if (d.poi === 'casa') return !!p.visita; if (d.poi === 'lavoro') return S.loc === 'lavoro'; if (d.poi) return S.loc === d.poi; return !S.loc; }
function puoTelefonare(p) { return !!p.numero && ha('telefono'); }
function prezzoPronto(c, q = S.q) { return c.tier[Q(q).tier - 1]; }
function prezzo(base, negozio, q = S.q) { const p = base * (MULT_NEGOZIO[negozio] || 1) * MULT_CIBO[Q(q).tier]; return Math.max(100, Math.round(p / 100) * 100); }
function casaComfortSonno() { if (S.flags.ostello) return 4; if (S.flags.daOspite) return 5; let c = casa().comfort; if (ha('letto')) c += 3; else if (ha('materasso')) c += 1; return c; }
function primoGiornoLavoro(l, daData) { for (let i = 1; i <= 7; i++) { const d = new Date(daData.getTime() + i * 86400000); if (l.gg.includes((d.getDay() + 6) % 7)) return d; } return null; }
function primoGiornoTxt(d) { const oggi = now(); const diff = Math.round((new Date(d.getFullYear(), d.getMonth(), d.getDate()) - new Date(oggi.getFullYear(), oggi.getMonth(), oggi.getDate())) / 86400000); return diff === 0 ? 'oggi' : diff === 1 ? 'domani' : `${GIORNI[(d.getDay() + 6) % 7]} ${d.getDate()} ${MESI[d.getMonth()]}`; }
function statoTurno(l) {
  if (!l || l.id === 'nulla') return { stato: 'nessuno' };
  if (S.flags.inizioLavoro && now().getTime() < S.flags.inizioLavoro) return { stato: 'chiuso', txt: `inizi ${primoGiornoTxt(new Date(S.flags.inizioLavoro))} alle ${hh(l.inizio)}` };
  if (!l.gg.includes(giornoIdx())) return { stato: 'chiuso', txt: `oggi riposo (lavori ${giorniTxt(l)})` };
  let m = minutiOra(), ini = l.inizio * 60, fin = ini + l.ore * 60;
  if (l.notte && m < 12 * 60) m += 24 * 60;
  const diff = m - ini;
  if (diff < -60) return { stato: 'presto', attesa: -diff, txt: `il turno inizia alle ${hh(l.inizio)} (tra ${Math.round(-diff / 6) / 10} h)` };
  if (diff <= 10) return { stato: 'puntuale', attesa: Math.max(0, -diff), txt: 'sei in orario' };
  if (m < fin - 120) return { stato: 'ritardo', ritardo: diff, txt: `sei in ritardo di ${Math.floor(diff / 60)}h${String(diff % 60).padStart(2, '0')}` };
  return { stato: 'perso', txt: 'turno perso: troppo tardi' };
}

function stimaSonno(min, ostello) { const ore = min / 60; const conf = ostello ? 12 : 8 + casaComfortSonno(); let en = conf * ore - (!ostello && !ha('materasso') && !ha('letto') && haCasa() ? 10 * Math.min(1, ore / 8) : 0); const fame = -3.5 * 0.4 * ore, umore = -1.2 * ore - (haCasa() || ostello ? 0 : ore + 10) + (ore < 5 && min >= 60 ? -6 : 0) + (ore > 10 ? -4 : 0); return { energia: Math.round(Math.min(en, 100 - S.bis.energia)), fame: Math.round(fame), umore: Math.round(umore) }; }
function minutiFinoA(h, m = 0) { let t = h * 60 + m - minutiOra(); if (t <= 0) t += 24 * 60; return t; }
function minutiFinoTurno() { const l = lavoro(); if (l.id === 'nulla') return null; let t = minutiFinoA(l.inizio); const d = new Date(now().getTime() + t * 60000); if (S.flags.inizioLavoro && d.getTime() < S.flags.inizioLavoro) return null; const gi = (d.getDay() + 6) % 7; if (!l.gg.includes(gi)) return null; if (t > 23 * 60) return null; return t; }
/* ---------- AVANZAMENTO TEMPO ---------- */
function avanza(minuti, opts = {}) {
  let step = 0;
  while (step < minuti) {
    const dt = Math.min(60, minuti - step); const f = dt / 60;
    const prev = now(); S.min += dt; step += dt;
    const b = S.bis;
    b.fame = clamp(b.fame - 3.5 * f * (opts.sonno ? 0.4 : 1));
    b.vescica = clamp(b.vescica - 5 * f * (opts.sonno ? 0.4 : 1));
    b.igiene = clamp(b.igiene - (opts.sport ? 8 : 2) * f);
    if (opts.sonno) b.energia = clamp(b.energia + (8 + casaComfortSonno()) * f); else b.energia = clamp(b.energia - (opts.lavoro ? 5 : 3) * f);
    b.umore = clamp(b.umore - 1.2 * f - (haCasa() ? 0 : 1) * f);
    if (b.fame <= 0) b.salute = clamp(b.salute - 3 * f);
    if (b.energia <= 0 && !opts.sonno) { log('Sei crollato/a dal sonno dove ti trovavi.', 'bad'); S.bis.energia = 30; S.min += 300; b.igiene = clamp(b.igiene - 15); }
    if (b.vescica <= 0) { log('Non ce l\'hai fatta a trattenerla… che vergogna.', 'bad'); b.vescica = 60; b.igiene = clamp(b.igiene - 30); b.umore = clamp(b.umore - 15); S.pantoSporchi++; }
    if (b.igiene < 15) b.salute = clamp(b.salute - 0.15 * f);
    S.malattie.forEach(m => { const g = MALATTIE[m.tipo].grav; b.salute = clamp(b.salute - g * 0.4 * f); b.energia = clamp(b.energia - 1 * f); b.umore = clamp(b.umore - g * 0.25 * f); if (m.tipo === 'diarrea') b.vescica = clamp(b.vescica - 2.5 * f); });
    if (S.malattie.length === 0 && b.fame > 40 && b.igiene > 40) b.salute = clamp(b.salute + 0.3 * f);
    if (S.pantoBagnati > 0 && !opts.sonno && Math.random() < 0.15 * f) { S.pantoPuliti += S.pantoBagnati; S.pantoBagnati = 0; log('I panni stesi si sono asciugati.', 'good'); }
    S.sporcoCasa = clamp(S.sporcoCasa + 0.4 * f);
    const cur = now(); if (cur.getDate() !== prev.getDate()) nuovoGiorno(cur);
  }
  if (S.bis.salute <= 0) morte();
}
function iniziativaPNG() {
  // Ogni mattina qualche personaggio può farsi vivo da solo in base a ciò che vede/sa.
  const cand = S.png.filter(p => p.aff >= 30 || ['capo', 'collega', 'vicino'].includes(p.ruolo)); if (!cand.length) return;
  const p = pick(cand); const msgs = [];
  if (!haCasa() && p.aff >= 50 && !S.ospite && Math.random() < 0.5) msgs.push({ t: `${p.nome}: "Ho saputo che dormi per strada… Vieni da me qualche notte, c'è una stuoia. Passa a ${p.quartiere} e parliamone."`, act: () => { p.pendOspita = true; } });
  if (S.bis.fame < 25 && p.aff >= 40) msgs.push({ t: `${p.nome}: "Hai una faccia… hai mangiato oggi? Passa da me, c'è riso."` });
  if (p.debito && Math.random() < 0.6) msgs.push({ t: `${p.nome}: "Namako, quei ${Ar(p.debito)} Ar… quando me li ridai?"`, neg: 1 });
  if (p.ruolo === 'capo' && S.lavoro !== 'nulla') { if (S.perf < 40) msgs.push({ t: `${p.nome} (capo): "Devo parlarti: così non va. Vieni in ufficio."`, neg: 1 }); else if (S.perf > 85 && Math.random() < 0.3) msgs.push({ t: `${p.nome} (capo): "Bel lavoro ultimamente. Passa a trovarmi, ho una proposta."` }); }
  if (p.ruolo === 'collega' && S.lavoro !== 'nulla' && Math.random() < 0.3) msgs.push({ t: `${p.nome} (collega): "${pick(['Il capo oggi è nervoso, arriva puntuale.', 'Pranziamo insieme? Hotely dietro la fabbrica.', 'Ho sentito che tagliano gli straordinari…'])}"` });
  if (p.rom >= 30 && !S.partner && Math.random() < 0.4) msgs.push({ t: `${p.nome}: "Pensavo a te… ci vediamo al lago Anosy stasera?"` });
  if (p.aff < 15 && S.voci && S.voci.length && Math.random() < 0.3) msgs.push({ t: `${p.nome} ti evita per strada: qualcuno gli/le ha parlato male di te.`, neg: 1 });
  if (!msgs.length) return; const m = pick(msgs); log('📱 ' + m.t, m.neg ? 'bad' : 'info'); if (m.act) m.act();
}
function nuovoGiorno(d) {
  S.stat.gg++;
  pulisciFolla(); S.png.forEach(p => { p.visita = false; });
  if (S.png.length && Math.random() < 0.55) iniziativaPNG();
  if (S.flags.dritta && S.stat.gg - S.flags.dritta.gg > 7) S.flags.dritta = null;
  const c = casa();
  // assenza ieri
  { const l = lavoro(); const prev = new Date(d.getTime() - 86400000); const pi = (prev.getDay() + 6) % 7; if (l.id !== 'nulla' && l.tipo === 'mese' && l.gg.includes(pi) && S.flags.lavoratoOggi !== prev.toDateString() && S.flags.assuntoIl !== prev.toDateString() && !(S.flags.inizioLavoro && prev.getTime() < S.flags.inizioLavoro)) { S.perf = clamp(S.perf - 8); log(`Ieri (${GIORNI[pi]}) non ti sei presentato/a al lavoro (${orarioLavoro(l)}). Assenza: performance -8 → ${Math.round(S.perf)}.`, 'bad'); } }
  // cibo fresco che va a male
  Object.entries(FRESCHI).forEach(([k, lim]) => { if (S.disp[k] > 0 && S.fresco[k] !== undefined) { const eta = S.stat.gg - S.fresco[k]; const max = ha('frigo') ? lim * 4 : lim; if (eta > max) { log(`${NOMI_DISP[k]} andato/a a male (${S.disp[k]} buttati). ${ha('frigo') ? '' : 'Un frigo lo farebbe durare 4 volte di più.'}`, 'bad'); S.disp[k] = 0; } } });
  if (d.getDate() === 1) {
    if (c.affitto > 0) {
      if (paga(c.affitto, true)) log(`Hai pagato l'affitto: ${Ar(c.affitto)} Ar.`, 'info');
      else { S.flags.arretrati = (S.flags.arretrati || 0) + 1; log(`Non hai pagato l'affitto (${Ar(c.affitto)} Ar). Il padrone di casa è furioso.`, 'bad'); if (S.flags.arretrati >= 2) { S.casa = 'strada'; S.flags.arretrati = 0; log('Sei stato/a sfrattato/a. Sei di nuovo per strada.', 'bad'); } }
    }
    if (haCasa() && c.tipo !== 'stanza') {
      let boll = 25000 + c.comfort * 12000 + (ha('frigo') ? 20000 : 0) + (ha('tv') ? 8000 : 0) + (ha('lavatrice') ? 12000 : 0);
      if (ha('pannelli')) boll = Math.round(boll * 0.4);
      if (paga(boll, true)) log(`Bolletta JIRAMA (luce e acqua): ${Ar(boll)} Ar.`, 'info'); else { log(`Non hai pagato la JIRAMA (${Ar(boll)} Ar): ti hanno staccato la luce. Umore -20.`, 'bad'); S.bis.umore = clamp(S.bis.umore - 20); }
    }
    const l = lavoro();
    if (l.tipo === 'mese' && S.ggLavorati > 0) {
      const attesi = l.gg.length * 4.33; const stip = Math.round(l.paga * Math.min(1, S.ggLavorati / attesi) * (0.8 + S.perf / 250) * (S.flags.bonus || 1));
      S.soldi += stip; log(`Stipendio ricevuto: ${Ar(stip)} Ar (${Math.round(S.ggLavorati)} turni su ~${Math.round(attesi)} previsti, performance ${Math.round(S.perf)}).`, 'good'); S.ggLavorati = 0;
      if (S.perf > 85 && Math.random() < 0.3) { S.perf = 60; S.flags.bonus = (S.flags.bonus || 1) * 1.1; log('Il capo è contento: aumento del 10%!', 'good'); }
    }
    if (S.scuola) { const sc = SCUOLE.find(s => s.liv === S.scuola.liv); if (!paga(sc.costo, true)) { log(`Non hai pagato la retta (${Ar(sc.costo)} Ar). Sei stato/a espulso/a.`, 'bad'); S.scuola = null; } else log(`Retta scolastica pagata: ${Ar(sc.costo)} Ar.`, 'info'); }
    if (S.banca) { S.banca.saldo = Math.round(S.banca.saldo * 1.003); if (S.banca.prestito > 0) { const rata = Math.round(S.banca.rata); if (paga(rata, true)) { S.banca.prestito = Math.max(0, S.banca.prestito - rata * 0.85); log(`Rata prestito: ${Ar(rata)} Ar.`, 'info'); } else { S.banca.prestito *= 1.05; log('Rata del prestito non pagata: mora del 5%.', 'bad'); } } }
    if (S.attivita) { const tot = S.attivita.mese; S.attivita.mese = 0; log(`La tua attività ha reso ${Ar(tot)} Ar questo mese.`, 'info'); }
  }
  S.malattie = S.malattie.filter(m => { m.gg--; if (m.gg <= 0) { log(`Sei guarito/a da: ${MALATTIE[m.tipo].nome}.`, 'good'); return false; } return true; });
  let rischio = 0.03 + (S.bis.igiene < 30 ? 0.05 : 0) + (haCasa() ? 0 : 0.05) + (S.bis.fame < 30 ? 0.03 : 0) - S.skill.fitness / 2000;
  if (Math.random() < rischio && S.malattie.length < 2) { const tipo = pick(['influenza', 'febbre', 'diarrea', 'diarrea', 'bronchite', ...(ha('zanzariera') ? [] : ['malaria'])]); S.malattie.push({ tipo, gg: MALATTIE[tipo].gg }); log(`🤒 Ti sei ammalato/a: ${MALATTIE[tipo].nome} (${MALATTIE[tipo].sint}). MALUS: ${malusMalattia(tipo)}. ${cureMalattia(tipo)}`, 'bad'); }
  if (S.attivita) { const a = ATTIVITA.find(x => x.id === S.attivita.id); const r = Math.round(a.base * (0.5 + S.skill.business / 60) * (0.7 + Math.random() * 0.6) * (S.attivita.dip ? 1.6 : 1)) - (S.attivita.dip ? 12000 : 0); S.soldi += r; S.attivita.mese += r; }
  if (S.cantiere) { S.cantiere.gg--; if (S.cantiere.gg <= 0) { S.flags.casaQ = S.cantiere.q; S.proprieta.push('costruita'); S.casa = 'costruita'; log(`🏠 La tua casa a ${Q(S.cantiere.q).nome} è finita! Ti sei trasferito/a.`, 'good'); S.cantiere = null; } else if (S.cantiere.gg % 30 === 0) log(`Cantiere a ${Q(S.cantiere.q).nome}: mancano ${S.cantiere.gg} giorni.`, 'info'); }
  const ga = giornoAnno(d);
  if (ga === S.nascita) { S.eta++; log(`🎂 Buon compleanno! Oggi compi ${S.eta} anni.`, 'good'); S.flags.compleanno = true; }
  S.png.forEach(p => { if (p.comp === ga) { p.eta++; if (p.aff > 30) log(`🎂 Oggi è il compleanno di ${p.nome}. Fagli/le un regalo!`, 'info'); } });
  S.figli.forEach(f => { if (f.comp === ga) { f.eta++; log(`🎂 ${f.nome} compie ${f.eta} anni!`, 'good'); } });
  if (S.gravidanza) { S.gravidanza.gg--; if (S.gravidanza.gg <= 0) { const gen = pick(['M', 'F']); const nome = pick(gen === 'M' ? NOMI_M : NOMI_F); S.figli.push({ nome, gen, eta: 0, comp: ga }); S.gravidanza = null; log(`👶 È nato/a ${nome}! I figli costano ~60.000 Ar/mese ciascuno.`, 'good'); } }
  if (d.getDate() === 15 && S.figli.length) { const c2 = S.figli.length * 60000; paga(c2, true); log(`Spese per i figli: ${Ar(c2)} Ar.`, 'info'); }
  S.png.forEach(p => { if (Math.random() < 0.3 && p.aff > 10 && p.id !== S.partner) p.aff = clamp(p.aff - 1); });
  if (S.partner) { const p = png(S.partner); if (p && Math.random() < 0.15) p.aff = clamp(p.aff - 2); if (p && p.aff < 15) { log(`${p.nome} ti ha lasciato/a: "Non ci sei mai per me."`, 'bad'); p.stato = 'ex'; S.partner = null; S.sposato = false; } }
  eventoCasuale();
  if (S.stat.gg % 5 === 0) salva();
}
function eventoCasuale() {
  const r = Math.random();
  if (r < 0.04 && S.soldi > 30000 && !haCasa()) { const k = Math.round(S.soldi * 0.5); S.soldi -= k; log(`Ti hanno derubato/a mentre dormivi per strada: -${Ar(k)} Ar.`, 'bad'); }
  else if (r < 0.06) { S.png.push(nuovoPNG(pick(['sconosciuto', 'collega', 'vicino']), { aff: rnd(5, 15) })); log('Hai conosciuto una nuova persona in taxi-be.', 'info'); }
  else if (r < 0.08 && S.veicolo) { const m = pick([3000, 8000, 25000]); paga(m, true); log(`Controllo stradale. Una "mancia" di ${Ar(m)} Ar e via.`, 'bad'); }
  else if (r < 0.10) { const p = pick(S.png.filter(x => x.aff > 30)); if (p) { p.aff = clamp(p.aff + 5); log(`${p.nome} ti ha mandato un messaggio carino. Affinità +5.`, 'good'); } }
  else if (r < 0.115 && S.veicolo) { log('Un taxi-be ti ha graffiato la fiancata. Riparazione 60.000 Ar.', 'bad'); paga(60000, true); }
  else if (r < 0.125 && ha('telefono') && S.flags.rep && Object.keys(S.flags.rep).length) { const qid = pick(Object.keys(S.flags.rep)); log(`📱 Ti ha chiamato un conoscente di ${Q(qid).nome}: domani cercano gente per un lavoretto. Passa di là.`, 'info'); }
  else if (r < 0.13) { const v = rnd(2000, 15000); S.soldi += v; log(`Hai trovato ${Ar(v)} Ar per terra!`, 'good'); }
}
function morte() { if (S.morto) return; S.morto = true; S.bis.salute = 0; ui.modal = { tipo: 'morte' }; render(); salva(); }
async function nuovaVita() { const slot = codiceGiocatore(); S = null; ui.modal = null; ui.tab = 'home'; LS.del('tanalife'); LS.set('mrls_pid', nuovoCodice()); render(); try { await fetch('/api/delete', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ slot }) }); } catch (e) { } }
function paga(n, auto = false) {
  if (S.soldi >= n) { S.soldi -= n; return true; }
  if (auto && S.banca && S.banca.saldo + S.soldi >= n) { const m = n - S.soldi; S.banca.saldo -= m; S.soldi = 0; log(`Prelevati automaticamente ${Ar(m)} Ar dal conto.`, 'info'); return true; }
  return false;
}
function log(t, tipo = '') { S.log.unshift({ t, tipo, d: dataStr() }); if (S.log.length > 100) S.log.pop(); toast(t.replace(/<[^>]+>/g, ''), tipo); }
function toast(t, tipo = '') { clearTimeout(ui.toastT); let e = document.querySelector('.toast'); if (!e) { e = document.createElement('div'); e.className = 'toast'; document.body.appendChild(e); } e.className = 'toast ' + tipo; e.textContent = t; e.style.display = 'block'; e.style.animation = 'none'; void e.offsetWidth; e.style.animation = ''; ui.toastT = setTimeout(() => e.style.display = 'none', 3200); }
function skillUp(k, n) { S.skill[k] = clamp(S.skill[k] + n); }

/* ---------- AZIONI ---------- */
const A = {
  pronto(negozio, i) { const c = PRONTO[negozio][i]; const pr = prezzoPronto(c); if (c.mattina && ora() > 10) return toast('I mofo gasy si vendono solo la mattina.'); if (S.bis.fame >= 95) return toast('Sei sazio/a: non riesci a mangiare altro.', 'bad'); if (S.bis.fame >= 80 && !ui.confSazio) { ui.confSazio = true; return toast('Hai già la pancia piena (fame ' + Math.round(S.bis.fame) + '/100). Tocca di nuovo se vuoi mangiare lo stesso.'); } ui.confSazio = false; if (!paga(pr)) return toast('Non hai abbastanza soldi.'); const prima = Math.round(S.bis.fame); S.bis.fame = clamp(S.bis.fame + c.fame); S.bis.umore = clamp(S.bis.umore + (c.umore || 3)); S.bis.salute = clamp(S.bis.salute + (c.salute || 0)); S.stat.pasti++; avanza(20); log(`🍽️ Hai mangiato ${c.nome}: fame ${prima} → ${Math.round(S.bis.fame)} · −${Ar(pr)} Ar · 20 min.`, 'good'); if (c.rischio && Math.random() < c.rischio && !S.malattie.some(m => m.tipo === 'diarrea')) { S.malattie.push({ tipo: 'diarrea', gg: 3 }); log(`Il cibo non era fresco… Diarrea. MALUS: ${malusMalattia('diarrea')}`, 'bad'); } },
  compra(pid, negozio) { const p = PRODOTTI.find(x => x.id === pid); const pr = prezzo(p.prezzo, negozio); if (!haCasa() && !p.sempre) return toast('Senza una casa non hai dove conservarlo: mangia all\'hotely.'); if (!paga(pr)) return toast('Non hai abbastanza soldi.'); S.disp[p.key] = Math.round((S.disp[p.key] + p.n) * 10) / 10; if (FRESCHI[p.key]) S.fresco[p.key] = S.stat.gg; avanza(2); toast(`${p.nome} (${p.unit}): −${Ar(pr)} Ar`); },
  cucina(rid) {
    const r = RICETTE.find(x => x.id === rid); if (!haCasa()) return toast('Serve una casa per cucinare.'); if (S.loc !== 'casa') return toast('Devi essere a casa.'); if (S.bis.fame >= 95) return toast('Sei sazio/a: non riesci a mangiare altro.', 'bad'); if (S.bis.fame >= 80 && !ui.confSazio) { ui.confSazio = true; return toast('Hai già la pancia piena (fame ' + Math.round(S.bis.fame) + '/100). Tocca di nuovo se vuoi cucinare lo stesso.'); } ui.confSazio = false; const primaF = Math.round(S.bis.fame);
    for (const [k, n] of Object.entries(r.ing)) if ((S.disp[k] || 0) < n) return toast(`Manca: ${NOMI_DISP[k]} (serve ${n}).`);
    let fuoco = null, tempo = r.min;
    if (r.fuoco > 0) { if (ha('gasf') && S.disp.gas >= r.fuoco) { fuoco = 'gas'; tempo = Math.round(r.min * 0.65); } else if (ha('fornello') && S.disp.carbone >= r.fuoco) fuoco = 'carbone'; else if (!ha('fornello') && !ha('gasf')) return toast('Ti serve un fornello (fatapera al mercato, 15.000 Ar).'); else return toast(`Manca ${ha('gasf') ? NOMI_DISP.gas : NOMI_DISP.carbone} per cucinare.`); }
    for (const [k, n] of Object.entries(r.ing)) S.disp[k] = Math.round((S.disp[k] - n) * 10) / 10;
    if (fuoco) S.disp[fuoco] = Math.round((S.disp[fuoco] - r.fuoco) * 10) / 10;
    S.bis.fame = clamp(S.bis.fame + r.fame); S.bis.umore = clamp(S.bis.umore + r.umore); S.bis.salute = clamp(S.bis.salute + r.salute); skillUp('casa', 0.8); S.stat.pasti++; avanza(tempo); S.sporcoCasa = clamp(S.sporcoCasa + 3);
    log(`🍳 Hai cucinato e mangiato ${r.nome}${fuoco ? ' (' + NOMI_DISP[fuoco].split(' ')[0] + ')' : ''}: fame ${primaF} → ${Math.round(S.bis.fame)} · ${tempo} min.`, 'good');
  },
  bagno() { const fuori = !(S.loc === 'casa' && haCasa()); if (fuori && S.loc !== 'bagni' && S.loc !== 'lavoro' && S.loc !== 'gargote') return toast('Qui non c\'è un bagno: cerca 🚻 Bagni pubblici nel quartiere (o a casa/al lavoro/all\'hotely).'); if (S.loc === 'bagni' && !paga(200)) return toast('Il WC pubblico costa 200 Ar.'); S.bis.vescica = 100; avanza(5); if (S.loc === 'bagni') log('WC pubblico: 200 Ar.'); },
  lavati() { if (S.loc === 'bagni') { if (!paga(1000)) return toast('La doccia pubblica costa 1.000 Ar.'); S.bis.igiene = clamp(S.bis.igiene + 40); avanza(30); return log('Doccia ai bagni pubblici (1.000 Ar).'); } if (S.loc !== 'casa' || !haCasa()) return toast('Puoi lavarti a casa o ai 🚻 bagni pubblici.'); if (ha('doccia')) { S.bis.igiene = 100; S.bis.umore = clamp(S.bis.umore + 5); avanza(20); log('Doccia calda. Che bello.'); } else if (ha('secchio')) { if (S.disp.sapone < 1) return toast('Ti serve sapone.'); S.disp.sapone--; S.bis.igiene = clamp(S.bis.igiene + 55); avanza(30); log('Ti sei lavato/a col secchio di acqua fredda.'); } else toast('Ti serve almeno un secchio (mercato/épicerie, 8.000 Ar).'); },
  bucato() { if (S.pantoSporchi < 1) return toast('Non hai panni sporchi.'); if (S.disp.sapone < 1) return toast('Serve sapone o detersivo.'); const n = S.pantoSporchi; S.disp.sapone--; S.pantoSporchi = 0; S.pantoBagnati += n; S.stat.lavate++; if (ha('lavatrice')) { avanza(60); log(`Lavatrice: ${n} capi lavati. Ora stendili.`); } else { if (!ha('secchio')) return toast('Serve un secchio.'); skillUp('casa', 1); S.bis.energia = clamp(S.bis.energia - 8); avanza(90); log(`Bucato a mano: ${n} capi. Ora stendili.`); } },
  stendi() { if (S.pantoBagnati < 1) return toast('Non hai panni bagnati.'); avanza(15); log(`Hai steso ${S.pantoBagnati} capi al sole.`); },
  pulisci() { S.sporcoCasa = 0; S.bis.umore = clamp(S.bis.umore + 5); skillUp('casa', 1); avanza(60); log('Hai pulito casa.'); },
  dormiOspite(h) { const o = S.ospite; if (!o || o.gg <= 0) return toast('Nessuno ti ospita al momento.'); if (S.q !== o.q) return toast(`${o.nome} abita a ${Q(o.q).nome}: vai lì.`); const min = Math.round(h * 60); const prima = { ...S.bis }; S.flags.daOspite = true; S.bis.igiene = clamp(S.bis.igiene + 20); avanza(min, { sonno: true }); S.flags.daOspite = false; o.gg--; const p = png(o.id); if (p) { p.favoriRicevuti = p.favoriRicevuti || 0; if (Math.random() < 0.25) { p.aff = clamp(p.aff - 2); ricorda(p, 'sta a casa mia, spero aiuti un po\''); } } log(`😴 Hai dormito da ${o.nome} (${Math.round(min / 60)}h): energia ${Math.round(prima.energia)} → ${Math.round(S.bis.energia)}. Notti rimaste: ${o.gg}.`, 'good'); if (o.gg <= 0) { log(`${o.nome}: "Namako, è ora che trovi una sistemazione tua." L'ospitalità è finita.`, 'info'); S.ospite = null; } },
  restituisci(id) { const p = png(id); if (!p || !p.debito) return; if (!paga(p.debito)) return toast('Non hai abbastanza soldi.'); log(`Hai restituito ${Ar(p.debito)} Ar a ${p.nome}. Affinità +6.`, 'good'); p.aff = clamp(p.aff + 6); p.favoriRicevuti = (p.favoriRicevuti || 0) + 1; ricorda(p, 'mi ha restituito i soldi, persona seria'); p.debito = 0; },
  aiutaOspite() { const o = S.ospite; const p = o && png(o.id); if (!p) return; if (S.q !== o.q) return toast(`Vai a ${Q(o.q).nome}.`); avanza(120); S.bis.energia = clamp(S.bis.energia - 10); p.aff = clamp(p.aff + 5); p.favoriRicevuti = (p.favoriRicevuti || 0) + 1; skillUp('casa', 0.6); ricorda(p, 'mi ha aiutato in casa (pulizie, acqua, bucato)'); log(`Hai aiutato in casa di ${p.nome}: acqua dalla pompa, pavimenti, bucato. Affinità +5.`, 'good'); },
  dormi(h, motivo) { const min = Math.round(h * 60); if (min < 10) return toast('Troppo poco per dormire.'); if (!haCasa()) { S.bis.umore = clamp(S.bis.umore - 10); S.bis.igiene = clamp(S.bis.igiene - 10); } else if (S.loc !== 'casa') return toast('Vai a casa per dormire (o dormi per strada se sei senza casa).');
    const prima = { ...S.bis }; avanza(min, { sonno: true }); if (min >= 240 && S.pantoSporchi < 8) S.pantoSporchi++; if (!ha('materasso') && !ha('letto') && haCasa()) S.bis.energia = clamp(S.bis.energia - 10 * Math.min(1, min / 480));
    const ore = min / 60; if (ore < 5 && min >= 60) { S.bis.umore = clamp(S.bis.umore - 6); S.bis.salute = clamp(S.bis.salute - 1); } if (ore > 10) { S.bis.umore = clamp(S.bis.umore - 4); S.bis.energia = clamp(S.bis.energia - 5); }
    const d = k => { const v = Math.round(S.bis[k] - prima[k]); return (v >= 0 ? '+' : '') + v; };
    log(`${haCasa() ? 'Hai dormito' : 'Hai dormito per strada'} ${durata(min)}${motivo ? ' ' + motivo : ''}, sveglia alle ${oraStr()}. Energia ${d('energia')}, fame ${d('fame')}, umore ${d('umore')}${ore < 5 && min >= 60 ? ' (troppo poco: stanchezza e malumore)' : ore > 10 ? ' (troppo: ti senti intontito/a)' : ''}.`, haCasa() ? '' : 'bad'); },
  ostello(h, motivo) { const min = Math.round(h * 60); if (min < 10) return toast('Troppo poco.'); const notti = Math.ceil(min / (12 * 60)); const costo = 15000 * notti; if (!paga(costo)) return toast(`L'ostello costa ${Ar(costo)} Ar (${notti} ${notti > 1 ? 'notti' : 'notte'}).`);
    const prima = { ...S.bis }; S.bis.igiene = clamp(S.bis.igiene + 30); S.flags.ostello = true; avanza(min, { sonno: true }); S.flags.ostello = false;
    const ore = min / 60; if (ore < 5 && min >= 60) { S.bis.umore = clamp(S.bis.umore - 6); S.bis.salute = clamp(S.bis.salute - 1); } if (ore > 10) { S.bis.umore = clamp(S.bis.umore - 4); S.bis.energia = clamp(S.bis.energia - 5); }
    if (min >= 240 && S.pantoSporchi < 8) S.pantoSporchi++;
    const d = k => { const v = Math.round(S.bis[k] - prima[k]); return (v >= 0 ? '+' : '') + v; };
    log(`Ostello (${Ar(costo)} Ar): hai dormito ${durata(min)}${motivo ? ' ' + motivo : ''} in un letto pulito con doccia, sveglia alle ${oraStr()}. Energia ${d('energia')}, igiene ${d('igiene')}, umore ${d('umore')}.`); },
  aspetta(min, motivo) { if (min <= 0) return toast('Nessuna attesa necessaria.'); avanza(min); S.bis.energia = clamp(S.bis.energia + 8 * min / 60); S.bis.umore = clamp(S.bis.umore + 2 * min / 60); log(`Hai aspettato ${durata(min)}${motivo ? ' ' + motivo : ''}. Ora sono le ${oraStr()}.`); },
  riposa() { avanza(60); S.bis.energia = clamp(S.bis.energia + 8); S.bis.umore = clamp(S.bis.umore + 3); },
  tv() { avanza(90); S.bis.umore = clamp(S.bis.umore + 12); },
  leggi() { avanza(90); skillUp('intelligenza', ha('libri') ? 1.5 : 0.7); S.bis.umore = clamp(S.bis.umore + 3); log('Hai letto e studiato un po\'.'); },
  pesi() { avanza(60, { sport: true }); skillUp('fitness', 1.5); S.bis.energia = clamp(S.bis.energia - 10); log('Allenamento a casa.'); },
  festaCompleanno() { if (!paga(50000)) return toast('Servono 50.000 Ar.'); S.flags.compleanno = false; S.bis.umore = 100; S.png.forEach(p => { if (p.aff > 25) p.aff = clamp(p.aff + 6); }); avanza(240); log('🎉 Festa di compleanno con amici, mofo gasy e THB!', 'good'); },
  lavora() {
    const l = lavoro(); if (l.id === 'nulla') return toast('Non hai un lavoro.'); if (S.flags.lavoratoOggi === now().toDateString()) return toast('Hai già fatto il turno di oggi.'); if (S.bis.energia < 15) return toast('Sei troppo stanco/a. Dormi.');
    const st = statoTurno(l);
    if (st.stato === 'chiuso') return toast(st.txt);
    if (st.stato === 'perso') { S.perf = clamp(S.perf - 12); S.flags.lavoratoOggi = now().toDateString(); return log(`Sei arrivato/a a turno quasi finito: ASSENZA. Performance -12 → ${Math.round(S.perf)}.`, 'bad'); }
    if (st.attesa > 0) { avanza(st.attesa); log(`Hai aspettato ${Math.round(st.attesa)} min l'inizio del turno.`); }
    let oreEff = l.ore;
    if (st.stato === 'ritardo') { const penal = Math.min(15, 3 + Math.floor(st.ritardo / 15)); oreEff = l.ore - st.ritardo / 60; S.perf = clamp(S.perf - penal); log(`Ritardo di ${st.ritardo} min: il capo ${S.capo ? S.capo.nome : ''} ti guarda male. Performance -${penal}.`, 'bad'); }
    avanza(Math.round(oreEff * 60), { lavoro: true }); S.flags.lavoratoOggi = now().toDateString(); S.esp += 1; if (l.skill) skillUp(l.skill, 0.6); skillUp('sociale', 0.2);
    const perfD = (S.bis.umore > 50 ? 1 : -1) + (S.bis.igiene > 40 ? 1 : -2) + (S.malattie.length ? -2 : 0) + (S.bis.fame > 30 ? 0 : -2) + 1; S.perf = clamp(S.perf + perfD);
    if (l.tipo === 'giorno') { const p = Math.round(l.paga * (0.8 + Math.random() * 0.5) * (oreEff / l.ore)); S.soldi += p; log(`Turno ${orarioLavoro(l)} come ${l.nome}: +${Ar(p)} Ar. Performance ${perfD >= 0 ? '+' : ''}${perfD} → ${Math.round(S.perf)}.`, 'good'); }
    else { S.ggLavorati += oreEff / l.ore; log(`Turno ${orarioLavoro(l)} completato. Turni questo mese: ${Math.round(S.ggLavorati * 10) / 10}. Performance ${perfD >= 0 ? '+' : ''}${perfD} → ${Math.round(S.perf)}.`); }
    if (S.perf < 15) { log('Sei stato/a licenziato/a per scarso rendimento.', 'bad'); S.lavoro = 'nulla'; S.perf = 50; }
    if (Math.random() < 0.08) { const c = nuovoPNG('collega', { aff: 20 }); S.png.push(c); log(`Hai fatto amicizia con un/a collega: ${c.nome}.`, 'info'); }
  },
  candidati(id) {
    const l = LAVORI.find(x => x.id === id);
    if (S.edu < l.edu) return toast(`Serve: ${EDU[l.edu]}.`); if (l.minSkill && S.skill[l.skill] < l.minSkill) return toast(`Serve ${SKILL_LBL[l.skill]} ≥ ${l.minSkill}.`); if (l.patente && !S.patente) return toast('Serve la patente.'); if (l.esp && S.esp < l.esp * 200) return toast(`Serve più esperienza (${l.esp} anni).`);
    // punteggio colloquio con fattori spiegabili
    const fattori = []; let prob = 0.55;
    if (S.flags.dritta && S.flags.dritta.id === id) { prob += 0.15; fattori.push({ n: 'Raccomandazione di un conoscente', v: 0.15 }); S.flags.dritta = null; }
    const soc = S.skill.sociale / 200; prob += soc; fattori.push({ n: 'Abilità sociale ' + Math.round(S.skill.sociale), v: soc });
    const ig = S.bis.igiene > 50 ? 0.15 : S.bis.igiene > 30 ? -0.05 : -0.2; prob += ig; fattori.push({ n: 'Igiene ' + Math.round(S.bis.igiene) + (S.bis.igiene > 50 ? ' (presentabile)' : ' (trasandato/a)'), v: ig });
    const um = S.bis.umore > 50 ? 0.05 : -0.05; prob += um; fattori.push({ n: 'Umore ' + Math.round(S.bis.umore), v: um });
    if (S.malattie.length) { prob -= 0.2; fattori.push({ n: 'Malato/a (' + MALATTIE[S.malattie[0].tipo].nome + ')', v: -0.2 }); }
    if (S.pantoPuliti < 1) { prob -= 0.1; fattori.push({ n: 'Vestiti sporchi', v: -0.1 }); }
    if (l.skill && S.skill[l.skill] > (l.minSkill || 0) + 15) { prob += 0.1; fattori.push({ n: 'Ottima ' + SKILL_LBL[l.skill], v: 0.1 }); }
    if (S.edu > l.edu) { prob += 0.05; fattori.push({ n: 'Titolo superiore al richiesto', v: 0.05 }); }
    if (S.fedina > 0) { prob -= 0.15; fattori.push({ n: 'Fedina penale sporca', v: -0.15 }); }
    if (S.flags.rifiuti && S.flags.rifiuti[id] >= 2) { prob -= 0.1; fattori.push({ n: 'Già respinto/a qui ' + S.flags.rifiuti[id] + ' volte', v: -0.1 }); }
    prob = clamp(prob, 0.05, 0.95); avanza(90);
    const ok = Math.random() < prob;
    const lista = fattori.map(f => `<div class="row"><span>${f.n}</span><b style="color:${f.v >= 0 ? 'var(--ok)' : 'var(--bad)'}">${f.v >= 0 ? '+' : ''}${Math.round(f.v * 100)}%</b></div>`).join('');
    if (!ok) {
      S.flags.rifiuti = S.flags.rifiuti || {}; S.flags.rifiuti[id] = (S.flags.rifiuti[id] || 0) + 1;
      const peggio = [...fattori].sort((a, b) => a.v - b.v)[0]; const motivo = peggio && peggio.v < 0 ? peggio.n.toLowerCase() : 'troppi candidati';
      const frasi = { igiene: ['"Torni quando si sarà dato una sistemata."', '"Qui si sta a contatto con i clienti, capisce…"'], malat: ['"Con quella tosse non possiamo, ripassi quando sta meglio."'], vestiti: ['"Si presenti con abiti puliti la prossima volta."'], fedina: ['"Abbiamo verificato il suo casellario. Mi dispiace."'], umore: ['"Sembra poco motivato/a. Ci penseremo."'], sociale: ['"Non ci ha convinto al colloquio. Si eserciti a parlare con la gente."'], respinto: ['"Gliel\'abbiamo già detto. Basta insistere."'], troppi: ['"Abbiamo scelto un altro candidato con più esperienza. Riprovi il mese prossimo."'] };
      const k = Object.keys(frasi).find(k2 => motivo.includes(k2)) || 'troppi';
      S.bis.umore = clamp(S.bis.umore - 5);
      log(`Colloquio per ${l.nome}: NON assunto/a. Motivo principale: ${motivo}.`, 'bad');
      ui.modal = { tipo: 'esito', ok: false, titolo: '❌ Non sei stato/a assunto/a', html: `<p><b>${l.nome}</b> a ${Q(l.luogo).nome}</p><p style="font-style:italic">${pick(frasi[k])}</p><p class="mut">Motivo principale: <b>${motivo}</b>. Umore -5.</p><h3>Com'è andato il colloquio</h3>${lista}<div class="row"><span>Probabilità totale</span><b>${Math.round(prob * 100)}%</b></div><p class="mut">Puoi ricandidarti domani. Migliora i punti in rosso.</p>` };
      return;
    }
    S.lavoro = id; S.perf = 50; S.ggLavorati = 0; S.flags.assuntoIl = now().toDateString(); { const pg = primoGiornoLavoro(l, now()); S.flags.inizioLavoro = new Date(pg.getFullYear(), pg.getMonth(), pg.getDate(), l.notte ? l.inizio : 0, 0).getTime(); }
    S.capo = nuovoPNG('capo', { aff: 15, eta: rnd(35, 60) }); S.png.push(S.capo); const c = nuovoPNG('collega', { aff: 15 }); S.png.push(c);
    const primo = primoGiornoTxt(new Date(S.flags.inizioLavoro)); S.bis.umore = clamp(S.bis.umore + 15);
    log(`Assunto/a come ${l.nome} a ${Q(l.luogo).nome}! Capo: ${S.capo.nome} ${S.capo.cognome}. Orario ${orarioLavoro(l)}, ${giorniTxt(l)}. Primo giorno: ${primo}.`, 'good');
    ui.modal = { tipo: 'esito', ok: true, titolo: '🎉 Congratulazioni, sei stato/a assunto/a!', html: `<p><b>${l.nome}</b> a ${Q(l.luogo).nome}</p><p style="font-style:italic">"${pick(['Benvenuto/a a bordo. Non mi deluda.', 'Ci vediamo puntuale, eh. Qui la puntualità conta.', 'Tongasoa! La squadra la aspetta.'])}" — ${S.capo.nome} ${S.capo.cognome}, ${S.capo.gen === 'M' ? 'il tuo capo' : 'la tua capa'}</p>
      <div class="row"><span>📅 Primo giorno</span><b>${primo} alle ${hh(l.inizio)}</b></div><div class="row"><span>⏰ Orario</span><b>${orarioLavoro(l)}</b></div><div class="row"><span>📆 Giorni</span><b>${giorniTxt(l)}</b></div><div class="row"><span>💰 Paga</span><b>${Ar(l.paga)} Ar/${l.tipo === 'mese' ? 'mese' : 'giorno'}</b></div><div class="row"><span>📍 Dove</span><b>${Q(l.luogo).nome} (${distKm(S.q, l.luogo)} km da qui)</b></div><div class="row"><span>👥 Collega</span><b>${c.nome} ${c.cognome}</b></div>
      <p class="mut" style="margin-top:8px">${l.tipo === 'giorno' ? 'Sei pagato/a a fine turno: se non vai, non guadagni.' : 'Stipendio il 1° del mese, proporzionale ai turni fatti. Ritardi e assenze abbassano la performance (sotto 15 = licenziamento).'} Umore +15.</p><h3>Com'è andato il colloquio</h3>${lista}` };
  },
  licenziati() { S.lavoro = 'nulla'; S.flags.inizioLavoro = null; log('Ti sei licenziato/a.'); },
  iscriviti(liv) { const s = SCUOLE.find(x => x.liv === liv); if (S.edu < liv - 1) return toast('Devi prima completare il livello precedente.'); if (!paga(s.costo)) return toast(`Iscrizione: ${Ar(s.costo)} Ar.`); S.scuola = { liv, giorni: 0, tot: s.mesi * 20, voti: 0 }; const prof = nuovoPNG('professore', { aff: 10, eta: rnd(35, 65) }); const comp = nuovoPNG('compagno di scuola', { aff: 20, eta: S.eta + rnd(-2, 2) }); S.png.push(prof, comp); log(`Iscritto/a: ${s.nome}. Professore: ${prof.nome}. Lezioni 4h lun–ven, ${s.mesi} mesi.`, 'good'); },
  studia() { if (!S.scuola) return; if (S.flags.scuolaOggi === now().toDateString()) return toast('Hai già frequentato oggi.'); avanza(240); S.flags.scuolaOggi = now().toDateString(); S.scuola.giorni++; const v = (S.bis.energia > 40 ? 1 : 0) + (S.bis.fame > 30 ? 1 : 0) + (ha('pc') ? 1 : 0) + (ha('libri') ? 0.5 : 0); S.scuola.voti += v; skillUp('intelligenza', 0.5 + v * 0.2); skillUp('sociale', 0.2); if (S.scuola.giorni % 20 === 0) log(`Esame mensile superato. Progresso: ${Math.round(S.scuola.giorni / S.scuola.tot * 100)}%.`, 'info'); if (S.scuola.giorni >= S.scuola.tot) { const media = S.scuola.voti / S.scuola.tot; if (media >= 1.2) { S.edu = S.scuola.liv; log(`🎓 Hai ottenuto: ${EDU[S.edu]}!`, 'good'); S.scuola = null; } else { log(`Bocciato/a (media ${media.toFixed(1)}). Ripeti gli ultimi 3 mesi.`, 'bad'); S.scuola.giorni -= 60; S.scuola.voti *= 0.75; } } },
  patente() { if (!paga(250000)) return toast('La scuola guida costa 250.000 Ar.'); avanza(180); if (Math.random() < 0.6 + S.skill.intelligenza / 300) { S.patente = true; skillUp('guida', 20); log('🚗 Hai preso la patente!', 'good'); } else log('Bocciato/a all\'esame di guida.', 'bad'); },
  mobile(id, negozio) { const m = MOBILI.find(x => x.id === id); const pr = prezzo(m.prezzo, negozio === 'mercato' ? 'mercato' : 'epicerie'); if (!haCasa() && !['telefono'].includes(id)) return toast('Serve una casa dove metterlo.'); if (!paga(pr)) return toast('Soldi insufficienti.'); S.mobili.push(id); avanza(20); log(`Comprato: ${m.nome} (${Ar(pr)} Ar).`, 'good'); if (id === 'telefono') S.png.push(nuovoPNG('sconosciuto', { aff: 10 })); },
  veicolo(id) { const v = VEICOLI.find(x => x.id === id); if (!paga(v.prezzo)) return toast('Soldi insufficienti.'); if (id !== 'bici' && !S.patente) return toast('Serve la patente.'); S.veicoli.push(id); S.veicolo = id; log(`Hai comprato: ${v.nome}!`, 'good'); },
  affitta(id) { const c = CASE.find(x => x.id === id); if (c.tipo === 'terreno') { if (!paga(c.prezzo)) return toast('Non hai abbastanza soldi (prova un prestito).'); S.proprieta.push(id); return log(`Hai comprato un terreno a ${Q(c.q).nome} (${Ar(c.prezzo)} Ar). Torna in agenzia per avviare la costruzione.`, 'good'); } if (c.prezzo > 0) { if (!paga(c.prezzo)) return toast('Non hai abbastanza soldi (prova un prestito in banca).'); S.proprieta.push(id); S.casa = id; log(`🏠 Hai COMPRATO: ${c.nome}! Niente più affitto.`, 'good'); } else { const cap = c.affitto * 2; if (!paga(cap)) return toast(`Servono 2 mesi di caparra: ${Ar(cap)} Ar.`); S.casa = id; S.flags.arretrati = 0; log(`Ti sei trasferito/a: ${c.nome}. Caparra ${Ar(cap)} Ar. Affitto ${Ar(c.affitto)} Ar il 1° del mese.`, 'good'); } },
  costruisci(tid) { const t = CASE.find(x => x.id === tid); const costo = Math.round(28000000 * multCasa(Q(t.q)) / 500000) * 500000; if (S.cantiere) return toast('Hai già un cantiere aperto.'); if (!paga(costo, true)) return toast(`La costruzione costa ${Ar(costo)} Ar (banca?).`); S.proprieta = S.proprieta.filter(x => x !== tid); S.cantiere = { q: t.q, gg: 120 }; log(`🏗️ Cantiere avviato a ${Q(t.q).nome}: ${Ar(costo)} Ar, 120 giorni.`, 'good'); },
  apriConto() { if (!paga(10000)) return toast('Apertura conto: 10.000 Ar.'); S.banca = { saldo: 0, prestito: 0, rata: 0 }; S.png.push(nuovoPNG('bancario', { aff: 15 })); log('Conto aperto alla BNI. Rende 0,3%/mese e paga in automatico affitto e bollette.', 'good'); },
  deposita(n) { n = Math.min(n, S.soldi); if (n <= 0) return; S.soldi -= n; S.banca.saldo += n; toast(`Depositati ${Ar(n)} Ar`); },
  preleva(n) { n = Math.min(n, S.banca.saldo); if (n <= 0) return; S.soldi += n; S.banca.saldo -= n; toast(`Prelevati ${Ar(n)} Ar`); },
  prestito(n) { if (S.banca.prestito > 0) return toast('Hai già un prestito.'); const max = (lavoro().tipo === 'mese' ? lavoro().paga * 10 : 0) + (S.attivita ? 20000000 : 0) + S.banca.saldo * 3 + S.proprieta.length * 30000000; if (n > max) return toast(`Massimo concesso: ${Ar(max)} Ar (serve stipendio fisso o garanzie).`); S.banca.prestito = n * 1.2; S.banca.rata = n * 1.2 / 24; S.soldi += n; log(`Prestito di ${Ar(n)} Ar approvato. 24 rate da ${Ar(S.banca.rata)} Ar.`, 'good'); },
  apriAttivita(id) { const a = ATTIVITA.find(x => x.id === id); if (S.attivita) return toast('Hai già un\'attività.'); if (a.auto && !S.veicolo) return toast('Serve un\'auto.'); if (!paga(a.costo)) return toast('Capitale insufficiente (prova la banca).'); avanza(240); S.attivita = { id, mese: 0, dip: false, q: S.q }; skillUp('business', 5); log(`Hai aperto: ${a.nome} a ${Q(S.q).nome}! Rende ogni giorno in base alla tua abilità business.`, 'good'); },
  gestisci() { avanza(300); skillUp('business', 1.2); skillUp('sociale', 0.3); const a = ATTIVITA.find(x => x.id === S.attivita.id); const extra = Math.round(a.base * 0.5); S.soldi += extra; S.attivita.mese += extra; log(`Hai gestito ${a.nome}: +${Ar(extra)} Ar extra.`); },
  assumi() { if (!paga(300000)) return toast('Serve 300.000 Ar.'); S.attivita.dip = true; const d = nuovoPNG('dipendente', { aff: 20 }); S.png.push(d); log(`Hai assunto ${d.nome}.`, 'good'); },
  chiudiAttivita() { const a = ATTIVITA.find(x => x.id === S.attivita.id); S.soldi += Math.round(a.costo * 0.4); S.attivita = null; log('Hai venduto l\'attività (40% del valore).'); },
  medico() { if (!paga(20000)) return toast('La visita costa 20.000 Ar.'); avanza(120); if (S.malattie.length) { const m = S.malattie[0]; log(`Diagnosi: ${MALATTIE[m.tipo].nome}. ${cureMalattia(m.tipo)}`, 'info'); } else log('Visita: stai bene. Più frutta e meno THB.'); S.bis.salute = clamp(S.bis.salute + 5); },
  ricovero() { if (!paga(150000, true)) return toast('Il ricovero costa 150.000 Ar.'); avanza(24 * 60, { sonno: true }); S.malattie = []; S.bis.salute = clamp(S.bis.salute + 40); log('Ricovero all\'HJRA: sei guarito/a.', 'good'); },
  medicina(id) { const m = MEDICINE.find(x => x.id === id); const pr = prezzo(m.prezzo, 'epicerie'); if (!paga(pr)) return toast('Soldi insufficienti.'); S.medicine[id] = (S.medicine[id] || 0) + 1; log(`Comprato: ${m.nome} (${Ar(pr)} Ar).`); },
  prendi(id) { const m = MEDICINE.find(x => x.id === id); if (!S.medicine[id]) return; S.medicine[id]--; if (id === 'vitamine') { S.bis.salute = clamp(S.bis.salute + 8); return log('Vitamine prese: salute +8.'); } const idx = S.malattie.findIndex(x => m.cura.includes(x.tipo)); if (idx < 0) return log(`Hai preso ${m.nome} ma non serviva.`); S.malattie[idx].gg = Math.max(1, S.malattie[idx].gg - 3); S.bis.salute = clamp(S.bis.salute + 5); log(`${m.nome}: ${MALATTIE[S.malattie[idx].tipo].nome} -3 giorni (restano ${S.malattie[idx].gg}).`, 'good'); },
  sport(tipo) { const c = { corsa: 0, calcio: 2000, palestra: 10000, piscina: 15000 }[tipo]; if (S.malattie.some(m => m.tipo === 'bronchite') && tipo !== 'corsa') return toast('Con la bronchite non riesci a respirare: niente sport.'); if (!paga(c)) return toast('Soldi insufficienti.'); avanza(90, { sport: true }); skillUp('fitness', tipo === 'palestra' ? 2.5 : 1.8); S.bis.umore = clamp(S.bis.umore + 10); S.bis.energia = clamp(S.bis.energia - 15); S.bis.fame = clamp(S.bis.fame - 10); if (tipo === 'calcio' && Math.random() < 0.3) { const p = nuovoPNG('amico', { aff: 25 }); S.png.push(p); log(`Al calcetto hai conosciuto ${p.nome}.`, 'info'); } log(`Sport: ${tipo}. Fitness +.`); },
  bar() { const pr = prezzo(12000, 'mercato'); if (!paga(pr)) return toast(`Servono ${Ar(pr)} Ar.`); avanza(150); S.bis.umore = clamp(S.bis.umore + 18); skillUp('sociale', 1.5); if (Math.random() < 0.5) { const p = nuovoPNG('sconosciuto', { aff: 20, eta: S.eta + rnd(-4, 6) }); S.png.push(p); log(`Al bar hai conosciuto ${p.nome} ${p.cognome} (${p.eta} anni).`, 'info'); } else log('Serata al bar con musica salegy e THB.'); },
  chiesa() { avanza(120); S.bis.umore = clamp(S.bis.umore + 10); skillUp('sociale', 0.5); if (Math.random() < 0.4) { const p = nuovoPNG('amico', { aff: 25, extra: { tratti: ['religioso', pick(TRATTI)] } }); S.png.push(p); log(`Dopo la messa hai parlato con ${p.nome}.`, 'info'); } else log('Messa alla FJKM: canti e pace interiore.'); },
  rova() { if (!paga(10000)) return toast('Servono 10.000 Ar.'); avanza(120); S.bis.umore = clamp(S.bis.umore + 15); skillUp('intelligenza', 0.8); log('Hai visitato il Rova di Manjakamiadana: la storia dei re Merina e tutta Tana sotto di te.'); },
  lago() { avanza(60); S.bis.umore = clamp(S.bis.umore + 8); S.bis.energia = clamp(S.bis.energia + 3); log('Passeggiata attorno al lago Anosy sotto le jacarande.'); },
  visita(id) { const p = png(id); const d = doveSta(p); if (d.q !== S.q) return toast(`${p.nome} abita a ${p.quartiere}: vai lì.`); avanza(15); if (p.aff < 30 && Math.random() < 0.6) { p.aff = clamp(p.aff - 1); return log(`Hai bussato da ${p.nome}: "Azafady, ora non posso." Non ti conosce abbastanza.`, 'bad'); } p.visita = true; p.aff = clamp(p.aff + 2); ricorda(p, 'è venuto/a a trovarmi a casa'); log(`Sei a casa di ${p.nome} a ${p.quartiere}: ti offre un tè.`, 'good'); apriChat(id); },
  chiediNumero(id) { const p = png(id); const box = $('chatBox'); const t = 'Senti, mi dai il tuo numero? Così ci sentiamo.'; if (box) { box.innerHTML += `<div class="msg me">${esc(t)}</div><div class="msg them mut" id="typing">…</div>`; box.scrollTop = 1e9; } parla(p, t).then(r => { const ty = $('typing'); if (ty) { ty.textContent = r; ty.classList.remove('mut'); ty.id = ''; } render(); salva(); }); },
  regalo(id, tipo) { const p = png(id); const c = { fiori: 5000, gioiello: 200000 }[tipo]; if (!paga(c)) return toast('Soldi insufficienti.'); const b = { fiori: 5, gioiello: 20 }[tipo]; p.aff = clamp(p.aff + b); if (p.rom > 0) p.rom = clamp(p.rom + b); avanza(30); log(`Regalo (${tipo}) a ${p.nome}: affinità +${b}.`, 'good'); },
  uscita(id) { const p = png(id); if (!paga(15000)) return toast('Un\'uscita costa ~15.000 Ar.'); avanza(180); p.aff = clamp(p.aff + 8); skillUp('sociale', 1); S.bis.umore = clamp(S.bis.umore + 10); if (p.eta >= 18) p.rom = clamp(p.rom + 6); log(`Uscita con ${p.nome}: hotely e passeggiata.`, 'good'); },
  fidanzati(id) { const p = png(id); if (S.partner) return toast('Sei già in coppia.'); if (p.aff < 55 || p.rom < 25) return toast('Non è ancora il momento: fate più uscite.'); if (Math.random() < 0.7) { p.stato = 'fidanzato'; S.partner = id; log(`💕 ${p.nome} ha detto sì! Ora siete fidanzati.`, 'good'); } else { p.aff -= 10; log(`${p.nome}: "Ti voglio bene ma non così…"`, 'bad'); } },
  proponi(id) { const p = png(id); if (p.aff < 75 || p.rom < 60) return toast('Serve più affinità e romanticismo.'); if (!paga(200000)) return toast('L\'anello costa 200.000 Ar.'); if (Math.random() < 0.8) { p.stato = 'promesso'; log(`💍 ${p.nome} ha accettato! Vai al Comune (Anosy) per il matrimonio.`, 'good'); } else log(`${p.nome} ha bisogno di tempo.`, 'bad'); },
  sposa(id, tipo) { const p = png(id); const c = { semplice: 500000, media: 3000000, grande: 15000000 }[tipo]; if (!paga(c, true)) return toast(`Costa ${Ar(c)} Ar.`); p.stato = 'sposato'; S.sposato = true; p.rom = 100; p.aff = 100; S.bis.umore = 100; avanza(600); S.png.forEach(x => x.aff = clamp(x.aff + (tipo === 'grande' ? 15 : 5))); log(`💒 Matrimonio (${tipo}) con vodiondry alla famiglia! Ora sei sposato/a con ${p.nome} ${p.cognome}.`, 'good'); },
  figlio(id) { const p = png(id); if (S.gravidanza) return toast('Un bambino è già in arrivo.'); if (p.aff < 60) return toast(`${p.nome} non è convinto/a.`); if (Math.random() < 0.5) { S.gravidanza = { gg: 270, con: id }; log('🤰 Un bambino è in arrivo! Nascerà tra 9 mesi.', 'good'); } else log('Questa volta non è successo.'); },
  lascia(id) { const p = png(id); const eraSposato = S.sposato; p.stato = 'ex'; p.aff = 10; S.partner = null; S.sposato = false; S.bis.umore -= 20; if (eraSposato && S.banca) S.banca.saldo = Math.round(S.banca.saldo / 2); log(`Hai lasciato ${p.nome}.${eraSposato ? ' Il divorzio ti costa metà dei risparmi.' : ''}`, 'bad'); },
  giocaFigli() { avanza(90); S.bis.umore = clamp(S.bis.umore + 15); log(`Hai giocato con ${S.figli.map(f => f.nome).join(', ')}.`, 'good'); },
  compleannoPNG(id) { const p = png(id); if (!paga(20000)) return toast('Servono 20.000 Ar.'); p.aff = clamp(p.aff + 12); avanza(180); log(`Hai festeggiato il compleanno di ${p.nome}. Affinità +12.`, 'good'); },
  elemosina(ore) {
    const q = Q(S.q); const t = q.tier; const h = ora();
    // per tier: probabilità che un passante dia qualcosa, taglio tipico delle monete, passanti/ora
    const P = [null, { p: 1 / 7, tagli: [200, 500, 500, 1000], pass: 11 }, { p: 1 / 10, tagli: [500, 500, 1000, 2000], pass: 9 }, { p: 1 / 16, tagli: [1000, 1000, 2000, 5000], pass: 7 }, { p: 1 / 28, tagli: [2000, 5000, 5000, 10000], pass: 5 }, { p: 1 / 45, tagli: [5000, 10000, 10000, 20000], pass: 3 }][t];
    let passanti = P.pass * ore; if (h < 7 || h >= 20) passanti *= 0.3; else if (h >= 11 && h <= 14) passanti *= 1.4; if (giornoIdx() === 6 && S.loc !== 'chiesa') passanti *= 0.6;
    let prob = P.p * (S.bis.igiene < 30 ? 1.25 : S.bis.igiene > 70 ? 0.6 : 1) * (S.figli.length ? 1.2 : 1) * (S.malattie.length ? 1.15 : 1) * (S.eta >= 50 ? 1.2 : 1);
    if (S.flags.elemosinaOggi === now().toDateString() + q.id) prob *= 0.5; // stessa gente già passata
    passanti = Math.round(passanti); let tot = 0, donatori = 0;
    for (let i = 0; i < passanti; i++) if (Math.random() < prob) { donatori++; tot += pick(P.tagli); }
    if (t >= 4 && Math.random() < 0.15 * ore) { const gp = Math.round(tot * 0.5); avanza(ore * 60); S.bis.umore = clamp(S.bis.umore - 12 - 3 * ore); S.soldi += tot - gp; log(`Elemosina a ${q.nome}: i guardiani privati ti hanno cacciato/a dopo un po' e "trattenuto" ${Ar(gp)} Ar. Incassati ${Ar(tot - gp)} Ar da ${donatori} persone su ${passanti}.`, 'bad'); S.flags.elemosinaOggi = now().toDateString() + q.id; return; }
    if (t <= 2 && Math.random() < 0.05 * ore && tot > 0) { avanza(ore * 60); S.bis.umore = clamp(S.bis.umore - 15); log(`Elemosina a ${q.nome}: avevi raccolto ${Ar(tot)} Ar ma un altro mendicante più grosso ti ha preso tutto. Isotry è così.`, 'bad'); S.flags.elemosinaOggi = now().toDateString() + q.id; return; }
    avanza(ore * 60); S.soldi += tot; S.bis.umore = clamp(S.bis.umore - 4 * ore); S.bis.igiene = clamp(S.bis.igiene - 3 * ore); skillUp('sociale', 0.1 * ore);
    S.png.forEach(pp => { if (pp.aff > 40 && Math.random() < 0.05 * ore) { pp.aff = clamp(pp.aff - 5); log(`${pp.nome} ti ha visto/a chiedere l'elemosina. Affinità -5.`, 'bad'); } });
    S.flags.elemosinaOggi = now().toDateString() + q.id;
    log(`Elemosina a ${q.nome} per ${durata(ore * 60)}: ${donatori} persone su ${passanti} ti hanno dato qualcosa → <b>+${Ar(tot)} Ar</b>. Umore -${4 * ore}.`, tot > 0 ? 'good' : 'bad');
  },
  lavoretto(idx, opz) {
    const j = lavorettiOggi()[idx]; const l = LAVORETTI.find(x => x.id === j.id); const q = Q(S.q);
    if (j.fatto) return toast('Già fatto.');
    if (l.bucato && !opz) { ui.modal = { tipo: 'bucato', idx }; return; }
    if (l.fit && S.skill.fitness < l.fit) return toast(`Serve fitness ≥ ${l.fit}: "Sei troppo gracile per questo."`);
    if (l.soc && S.skill.sociale < l.soc) return toast(`Serve sociale ≥ ${l.soc}: non si fidano ancora di te.`);
    if (l.casa && S.skill.casa < l.casa) return toast(`Serve abilità casa ≥ ${l.casa}.`);
    if (l.edu && S.edu < l.edu) return toast(`Serve almeno: ${EDU[l.edu]}.`);
    if (S.bis.energia < l.fatica * j.ore * 0.8) return toast('Sei troppo stanco/a per reggere fino alla fine.');
    const h = ora(); if (h > j.inizio + 2) { j.fatto = true; return toast(`Troppo tardi: hanno già trovato qualcun altro (era alle ${hh(j.inizio)}).`); }
    const cf = conflittoLavoretto(j);
    if (cf && cf.tipo === 'sovrapposto') return toast(`⛔ Questo lavoretto (${hh(j.inizio)}–${hh((j.inizio + j.ore) % 24)}) ${cf.txt}. Non puoi fare entrambi.`, 'bad');
    if (cf && cf.tipo === 'dopo' && cf.primaTurno) return toast(`⏰ Il lavoretto comincia alle ${hh(j.inizio)}, dopo il tuo turno. Prima vai a lavorare (${orarioLavoro(lavoro())}), poi torna qui: l'offerta resta valida fino alle ${hh(j.inizio + 2)}.`);
    if (cf && cf.tipo === 'prima') { const fineL = j.inizio * 60 + j.ore * 60; if (fineL > turnoOggi().ini - 20) return toast(`⛔ Finiresti alle ${hh((j.inizio + j.ore) % 24)}, troppo a ridosso del turno delle ${hh(lavoro().inizio)}.`, 'bad'); }
    if (h < j.inizio) { const t = turnoOggi(); if (t && t.fin > minutiOra() && t.ini < j.inizio * 60) return toast(`⏰ Prima del lavoretto hai il turno alle ${hh(lavoro().inizio)}: non posso farti aspettare fino alle ${hh(j.inizio)}.`); avanza((j.inizio - h) * 60 - now().getMinutes()); log(`Hai aspettato l'inizio del lavoretto (${hh(j.inizio)}).`); }
    if (l.bucato) {
      const b = j.bucato; let costo = 0, extraB = '', tempoExtra = 0;
      if (opz === 'casa') { extraB = ' Hai lavato nel cortile della famiglia, sul loro bassin: acqua e spazio erano loro.'; }
      else {
        // bassin pubblico: ritiro, acqua a bidoni, posto, consegna
        const bidoni = Math.ceil(b.capi / 8); const prezzoBidone = q.tier >= 4 ? 200 : 100; costo = bidoni * prezzoBidone;
        if (!paga(costo)) return toast(`Ti servono ${Ar(costo)} Ar per ${bidoni} bidoni d'acqua alla pompa pubblica.`);
        const affollato = Math.random() < (ora() >= 8 && ora() <= 11 ? 0.45 : 0.15);
        if (affollato) { tempoExtra = rnd(30, 90); extraB = ` Al bassin pubblico era pieno di mpanasa: hai aspettato ${tempoExtra} min un posto libero.`; }
        extraB += ` Hai preso i panni a casa del cliente, comprato ${bidoni} bidoni d'acqua alla pompa (${Ar(costo)} Ar), lavato al bassin pubblico e riconsegnato tutto piegato.`;
        if (Math.random() < 0.06) { extraB += ' <b>Una camicia è sparita mentre asciugava</b>: il cliente te l\'ha scalata dalla paga (-2.000 Ar).'; j.paga = Math.max(500, j.paga - 2000); }
        if (S.pantoBagnati === 0 && Math.random() < 0.3) extraB += ' Nel frattempo hai steso anche i tuoi panni.';
        tempoExtra += 40; // andata/ritorno per ritiro e consegna
      }
      if (tempoExtra) avanza(tempoExtra);
      j.extraB = extraB; j.costoB = costo;
    }
    let mult = 1; if (l.veicolo && S.veicolo) mult = S.veicolo === 'bici' ? 1.3 : l.veicolo;
    const rete = (S.flags.rep && S.flags.rep[S.q]) || 0; if (rete >= 8) mult *= 1.1;
    avanza(j.ore * 60, { lavoro: true }); S.bis.energia = clamp(S.bis.energia - l.fatica * j.ore * 0.5); S.bis.igiene = clamp(S.bis.igiene - l.igiene * j.ore * 0.5);
    let guad = Math.round(j.paga * mult / 100) * 100; let extra = '';
    const r = Math.random();
    if (r < 0.08) { guad = Math.round(guad * 0.6 / 100) * 100; extra = ' Il padrone ha "dimenticato" una parte: ti ha pagato meno del pattuito.'; S.bis.umore = clamp(S.bis.umore - 6); }
    else if (r < 0.2) { const m = pick([500, 1000, 2000]); guad += m; extra = ` Mancia di ${Ar(m)} Ar!`; }
    else if (r < 0.3 && ['evento', 'trasloco', 'cantiere'].includes(l.id)) { S.bis.fame = clamp(S.bis.fame + 35); extra = ' Ti hanno anche dato un piatto di vary sy laoka.'; }
    if (l.id === 'trasloco' && Math.random() < 0.04) { S.bis.salute = clamp(S.bis.salute - 8); extra += ' Ti sei fatto/a male alla schiena (salute -8).'; }
    S.soldi += guad; j.fatto = true; skillUp(l.skill, 0.5); skillUp('sociale', 0.3);
    S.flags.rep = S.flags.rep || {}; S.flags.rep[S.q] = (S.flags.rep[S.q] || 0) + 1;
    if (Math.random() < 0.15) { const pp = nuovoPNG(pick(['vicino', 'sconosciuto', 'venditore']), { aff: 25, extra: { quartiere: q.nome } }); S.png.push(pp); extra += ` Hai conosciuto ${pp.nome}, che ti richiamerà per altri lavoretti.`; }
    if (l.bucato) { extra = (j.extraB || '') + extra; if (j.costoB) extra += ` Netto dopo l'acqua: ${Ar(guad - j.costoB)} Ar.`; skillUp('casa', 0.5); }
    log(`Lavoretto a ${q.nome}: ${l.nome}, ${j.ore}h → +${Ar(guad)} Ar.${extra}`, 'good');
    ui.modal = { tipo: 'esito', ok: true, titolo: `${l.icon} Lavoretto finito`, html: `<p><b>${l.nome}</b> a ${q.nome}, ${j.ore} ore.</p><div class="row"><span>💰 Guadagno</span><b>+${Ar(guad)} Ar</b></div><div class="row"><span>⚡ Energia</span><b>-${Math.round(l.fatica * j.ore * 0.5 + 5 * j.ore)}</b></div><div class="row"><span>🧼 Igiene</span><b>-${Math.round(l.igiene * j.ore * 0.5 + 2 * j.ore)}</b></div><div class="row"><span>📈 ${SKILL_LBL[l.skill]}</span><b>+0.5</b></div><div class="row"><span>🗣️ Passaparola a ${q.nome}</span><b>${S.flags.rep[S.q]} lavoretti</b></div>${extra ? `<p class="mut">${extra}</p>` : ''}` };
  },
  borseggia() { avanza(60); if (Math.random() < 0.5) { const v = rnd(5000, 40000); S.soldi += v; log(`Hai rubato un portafoglio: +${Ar(v)} Ar.`, 'bad'); S.bis.umore -= 5; } else { S.fedina++; log('Preso dalla polizia! 3 notti in cella e 100.000 Ar di multa.', 'bad'); paga(100000, true); avanza(72 * 60, { sonno: true }); S.bis.igiene = 10; } },
};

/* ---------- SPOSTAMENTI ---------- */
function distKm(a, b) { if (a === b) return 0; const A1 = Q(a), B1 = Q(b); return Math.max(1, Math.round(Math.hypot(A1.x - B1.x, A1.y - B1.y) * 1.5 * 10) / 10); }
function inTraffico(m) { const hr = ora(); return m !== 'piedi' && (hr >= 7 && hr <= 9 || hr >= 16 && hr <= 19) && giornoIdx() < 6; }
function stimaViaggio(qid, mezzo) {
  const km = distKm(S.q, qid); const v = S.veicolo && VEICOLI.find(x => x.id === S.veicolo);
  const M = { piedi: { mk: 13, costo: 0, en: 2.2, ig: 1.2, um: -0.3 }, taxibe: { mk: 6, costo: 600 + (km > 6 ? 600 : 0), en: 0.5, ig: 1.5, um: -0.6, fisso: 12 }, taxi: { mk: 4, costo: 3000 + km * 1500, en: 0.2, ig: 0, um: 0.2, fisso: 5 }, proprio: v && { mk: 12 / v.vel, costo: Math.round((v.costo || 0) * km / 4), en: v.id === 'bici' ? 1.5 : 0.3, ig: v.id === 'bici' ? 1 : 0, um: 0.3, fisso: 3 } }[mezzo];
  if (!M) return null;
  let min = km * M.mk + (M.fisso || 0); const traffico = inTraffico(mezzo); if (traffico) min *= 1.7; min = Math.round(min);
  const arrivo = new Date(now().getTime() + min * 60000);
  return { km, min, costo: Math.round(M.costo / 100) * 100, energia: Math.round(km * M.en * 10) / 10, igiene: Math.round(km * M.ig * 10) / 10, umore: Math.round(km * M.um * 10) / 10, arrivo: `${String(arrivo.getHours()).padStart(2, '0')}:${String(arrivo.getMinutes()).padStart(2, '0')}`, traffico };
}
function vaiA(qid, mezzo) {
  const e = stimaViaggio(qid, mezzo); if (!e) return; if (!paga(e.costo)) return toast('Non hai i soldi per il trasporto.');
  const v = S.veicolo && VEICOLI.find(x => x.id === S.veicolo); const txt = { piedi: 'a piedi', taxibe: 'in taxi-be', taxi: 'in taxi', proprio: v ? 'con ' + v.nome : '' }[mezzo];
  if (mezzo === 'piedi') skillUp('fitness', 0.1 * e.km); if (mezzo === 'proprio') skillUp('guida', 0.2);
  if (mezzo === 'taxibe' && Math.random() < 0.03) { S.soldi = Math.max(0, S.soldi - 10000); log('Un borseggiatore nel taxi-be ti ha sfilato 10.000 Ar.', 'bad'); }
  avanza(e.min); S.bis.energia = clamp(S.bis.energia - e.energia); S.bis.igiene = clamp(S.bis.igiene - e.igiene); S.bis.umore = clamp(S.bis.umore + e.umore);
  S.q = qid; S.loc = null; log(`Sei andato/a a ${Q(qid).nome} ${txt}: ${e.min} min${e.traffico ? ' (traffico!)' : ''}, ${e.costo ? Ar(e.costo) + ' Ar' : 'gratis'}, energia -${e.energia}.`);
  ui.modal = null; ui.tab = 'home'; render(); salva();
}
function poiDisponibili(qid) { const q = Q(qid); const l = [...q.poi]; if (haCasa() && casaQ() === qid) l.unshift('casa'); if (S.lavoro !== 'nulla' && lavoro().luogo === qid) l.unshift('lavoro'); if (S.attivita && S.attivita.q === qid) l.push('attivita'); return l; }
function entra(poi) { const min = poi === 'casa' ? 3 : 7; avanza(min); S.loc = poi; S.bis.energia = clamp(S.bis.energia - 0.5); ui.modal = null; render(); salva(); }

/* ---------- AI / DIALOGHI ---------- */
function ruoloTxt(p) { const map = { amico: 'amico/a', vicino: 'vicino/a di casa', venditore: 'venditore al mercato', poliziotto: 'agente di polizia', medico: 'medico dell\'ospedale HJRA', sconosciuto: 'conoscente', collega: 'collega di lavoro', capo: 'capo al lavoro', professore: 'professore/professoressa', 'compagno di scuola': 'compagno/a di scuola', bancario: 'impiegato/a di banca', dipendente: 'tuo/a dipendente' }; return (p.ruolo === 'sconosciuto' && p.mest) ? p.mest : (map[p.ruolo] || p.ruolo); }
function ospiteDi() { return S.ospite && png(S.ospite.id); }
function relazioniTxt(p) { const altri = S.png.filter(x => x.id !== p.id && x.aff >= 45).slice(0, 4).map(x => `${x.nome} (${ruoloTxt(x)}, affinità ${x.aff})`); return altri.length ? altri.join(', ') : 'nessuno di rilievo'; }
function memoriaTxt(p) { const m = (p.mem || []).slice(-6); return m.length ? m.join(' | ') : 'niente di particolare'; }
function vociTxt(p) { const v = (S.voci || []).filter(x => x.su !== p.id).slice(-4).map(x => `${x.da}: "${x.txt}"`); return v.length ? v.join(' | ') : 'nessuna'; }
function sistemaPrompt(p) {
  const l = lavoro(); const c = casa(); const h = ora(); const notte = h >= 21 || h < 5;
  const sameJob = ['capo', 'collega'].includes(p.ruolo) && l.id !== 'nulla';
  const stato = [];
  if (!haCasa()) stato.push('SENZA CASA (dorme per strada o in ostello)'); else stato.push(`casa: ${c.nome} (comfort ${c.comfort}/10)`);
  if (S.ospite) stato.push(`ospitato temporaneamente da ${S.ospite.nome} (ancora ${S.ospite.gg} notti)`);
  if (S.bis.fame < 30) stato.push('ha FAME visibile'); if (S.bis.igiene < 30) stato.push('è visibilmente SPORCO/A e maleodorante'); if (S.bis.energia < 25) stato.push('sembra ESAUSTO/A'); if (S.bis.umore < 30) stato.push('appare triste/abbattuto/a');
  if (S.malattie.length) stato.push('malato/a: ' + S.malattie.map(m => MALATTIE[m.tipo].nome).join(', '));
  if (S.soldi < 3000) stato.push('è al verde (si vede: chiede prezzi, conta le monete)'); else if (S.soldi > 2000000) stato.push('sembra benestante');
  if (S.fedina) stato.push(`ha precedenti penali (${S.fedina})`);
  if (notte) stato.push('è NOTTE');
  const lav = l.id === 'nulla' ? 'disoccupato/a' : `${l.nome} a ${Q(l.luogo).nome} (${orarioLavoro(l)}, ${giorniTxt(l)}, ${l.tipo === 'mese' ? Ar(l.paga) + ' Ar/mese' : Ar(l.paga) + ' Ar/giorno'})${sameJob ? `; performance sul lavoro ${Math.round(S.perf)}/100, esperienza ${S.esp} turni, ritardi recenti ${S.flags.ritardi || 0}` : ''}`;
  const poteri = [];
  poteri.push('OSPITA:n — offri un posto per dormire a casa tua per n notti (1-14). Solo se affinità ≥ 55, o ≥ 40 se il giocatore è senza casa e ti fa pena; puoi chiedere un favore in cambio nel testo (aiuto in casa, bucato, piccoli soldi).');
  poteri.push('PRESTA:n — presti n Ariary (max 20.000, solo se affinità ≥ 50; il giocatore dovrà restituirli).');
  poteri.push('REGALA_CIBO — offri un pasto (riso e laoka) se il giocatore ha fame e affinità ≥ 35.');
  poteri.push('LAVORETTO — gli proponi un lavoretto pagato per oggi/domani nel quartiere (se sei venditore, vicino, amico, dipendente).');
  poteri.push('DRITTA_LAVORO — gli segnali un\'offerta concreta della bacheca (cita mestiere e quartiere reale).');
  if (sameJob && p.ruolo === 'capo') { poteri.push('BONUS:n — bonus in busta paga di n Ariary (max metà stipendio) se performance ≥ 70 e affinità ≥ 45.'); poteri.push('PROMOZIONE — aumento stabile +10% (solo se performance ≥ 80, esperienza ≥ 60 turni, affinità ≥ 55; massimo una volta).'); poteri.push('RICHIAMO — richiamo ufficiale, performance -8 (se il giocatore è maleducato, in ritardo cronico, ubriaco, sporco).'); poteri.push('LICENZIA — licenziamento immediato (solo per insulti gravi, furto, o performance < 25).'); }
  if (sameJob && p.ruolo === 'collega') { poteri.push('COPRI — lo copri con il capo: performance +5 (affinità ≥ 45).'); poteri.push('PARLA_BENE — parli bene di lui/lei al capo e ai colleghi: affinità del capo +5 (affinità ≥ 55).'); poteri.push('PARLA_MALE — sparli di lui/lei al capo: affinità del capo -6, performance -3 (se ti ha offeso o affinità < 20).'); }
  poteri.push('PETTEGOLEZZO:testo — racconti agli altri personaggi che conosci qualcosa sul giocatore (positivo o negativo, max 12 parole): influenzerà le loro opinioni.');
  if (p.ruolo === 'vicino') poteri.push('DENUNCIA — chiami la polizia se il giocatore ti minaccia o è ubriaco molesto (multa 20.000 Ar).');
  if (p.eta >= 18 && !['capo', 'poliziotto', 'medico', 'professore', 'bancario'].includes(p.ruolo) && !S.sposato) poteri.push('FLIRT — segnali interesse romantico (attrazione +8) se il momento è giusto e affinità ≥ 40; se il giocatore è sposato/fidanzato con altri, evita o chiedi spiegazioni.');
  if (p.id === S.partner) poteri.push('LASCIA — lo/la lasci se ti tradisce, ti insulta o ti trascura da settimane.');
  if (!p.numero) poteri.push('NUMERO — dai il tuo numero di telefono al giocatore (solo se ti sta simpatico/a: affinità ≥ 30, o ≥ 20 se sei chiacchierone/generoso; mai se sospettoso e affinità < 45).');
  poteri.push('AFF:n — obbligatorio, n tra -3 e +3: quanto ti è piaciuto lo scambio.');
  const guida = RUOLO_GUIDA[p.ruolo] || RUOLO_GUIDA.sconosciuto; const car = p.tratti.map(t => `${TRATTI_LBL[t] || t} (${TRATTI_DESC[t] || ''})`).join('; ');
  const canale = ui.canale === 'tel' ? 'State parlando AL TELEFONO (chiamata o messaggio): non vedi il giocatore, non potete darvi cose di mano; puoi solo sentire la voce/il tono. Non usare OSPITA/REGALA_CIBO se non per fissare un appuntamento.' : `Siete DI PERSONA, ${p.visita ? 'a casa tua' : presente(p) ? 'qui a ' + (S.loc ? (POI[S.loc]?.nome || S.loc) + ', ' : '') + Q(S.q).nome : 'nello stesso posto'}.`;
  return `Sei ${p.nome} ${p.cognome}, ${p.eta} anni, ${p.gen === 'M' ? 'uomo' : 'donna'}, vivi a ${p.quartiere}, Antananarivo (Madagascar). Ruolo verso il giocatore: ${ruoloTxt(p)}${p.stato !== 'conoscente' ? ' e ' + STATO_LBL[p.stato] : ''}. ${dominio(p)} INTERPRETA PIENAMENTE IL TUO RUOLO: ${guida}. Il tuo CARATTERE colora tutto ciò che dici: ${car}. ${canale}${p.numero ? ' Il giocatore ha il tuo numero.' : ''} Affinità con il giocatore: ${p.aff}/100${p.rom ? ', attrazione ' + p.rom + '/100' : ''}. Favori che gli hai già fatto: ${(p.favori || 0)}; favori che lui/lei ha fatto a te: ${(p.favoriRicevuti || 0)}${p.debito ? `; ti deve ancora ${Ar(p.debito)} Ar` : ''}.
COSA RICORDI di lui/lei: ${memoriaTxt(p)}.${p.pendOspita ? ' Stamattina gli/le hai fatto sapere che potresti ospitarlo/a: se te lo chiede con garbo, usa [OSPITA:n].' : ''}
COSA SI DICE in giro (voci arrivate da altri): ${vociTxt(p)}.
Altre persone importanti nella vita del giocatore: ${relazioniTxt(p)}.
IL GIOCATORE: ${S.nome}, ${S.eta} anni, ${S.gen === 'M' ? 'uomo' : 'donna'}, ${lav}. Titolo di studio: ${EDU[S.edu]}. Soldi in tasca ${Ar(S.soldi)} Ar${S.banca ? ', in banca ' + Ar(S.banca.saldo) + ' Ar' : ''}${S.sposato ? ', sposato/a' : S.partner ? ', fidanzato/a con ' + (png(S.partner)?.nome || 'qualcuno') : ', single'}${S.figli.length ? ', ' + S.figli.length + ' figli' : ''}. Quello che VEDI e PERCEPISCI di lui/lei adesso: ${stato.join('; ')}. Si trova a ${Q(S.q).nome}${S.loc ? ' (' + (POI[S.loc]?.nome || S.loc) + ')' : ''}. Umore ${Math.round(S.bis.umore)}/100, igiene ${Math.round(S.bis.igiene)}/100, energia ${Math.round(S.bis.energia)}/100. Ora: ${dataStr()}.
Prezzi reali: riso 700 Ar/kapoaka, mofo gasy 200-500 Ar, vary sy laoka 2.500-5.500 Ar, taxi-be 600 Ar, stanza a Isotry 60.000 Ar/mese, monolocale 100-150.000, appartamento Ankorondrano ~1.300.000, villa Ivandry 4.500.000, stipendi: operaio 250-300.000, impiegato 500-700.000, quadro 1-3 milioni.
REGOLE: rispondi SEMPRE in italiano (rappresenta il malgascio parlato nella vita reale; ogni tanto parole malgasce: "salama", "misaotra", "mora mora", "vazaha", "azafady", "tsy misy", "namako"). Sii realistico e coerente con Antananarivo (taxi-be, JIRAMA, riso, fihavanana, chiesa, famiglia). Resta nel personaggio: hai i tuoi problemi, la tua famiglia, i tuoi orari; NON sei un assistente. Reagisci a ciò che vedi (se puzza, diglielo con tatto o senza; se ha fame e sei amico, offri; se è notte, sei stanco/a). Ricorda le promesse fatte. Risposte brevi: 1-3 frasi parlate.
AZIONI: puoi agire concretamente nel mondo aggiungendo ALLA FINE, ognuno su una propria riga, tag nella forma [NOME] o [NOME:valore]. Usali solo quando è davvero coerente con il carattere, l'affinità e la situazione (raramente, non a ogni messaggio; mai su richiesta insistente se non te la senti). Tag disponibili:
${poteri.map(x => '- [' + x.replace(' — ', '] ')).join('\n')}`;
}
function fallbackRisposta(p, testo) {
  const t = testo.toLowerCase(); let aff = 0;
  const cortese = /grazie|misaotra|per favore|azafady|salama|buongiorno|ciao|come stai|merci|s'il te|s'il vous|bonjour|salut|ça va|comment vas/.test(t);
  const rude = /stupid|idiot|vaff|merda|cretin|brutt|connard|con\b|merde|salaud|moche|imbécile/.test(t);
  if (cortese) aff = 1; if (rude) aff = -3;
  const tono = p.aff > 60 ? 'caldo' : p.aff > 30 ? 'neutro' : 'freddo';
  const R = {
    amico: { caldo: ['Namako! Sempre un piacere. Dimmi, come va con il lavoro?', 'Dai, stasera brochette a Behoririka, offro io… se hai 2.000 Ar da prestarmi, ahah.', 'Mia madre chiede sempre di te. Passa a mangiare da noi domenica.'], neutro: ['Ehi, ciao. Tutto a posto? Io sto correndo dietro al taxi-be come sempre.', 'Ho sentito che cercano gente alla zona franca di Ankorondrano: guarda la bacheca ad Analakely.'], freddo: ['Ah, sei tu. Ti fai sentire solo quando ti serve qualcosa.'] },
    vicino: { caldo: ['Vicino! La JIRAMA ha tagliato l\'acqua di nuovo stamattina, hai fatto scorta?', 'Se vuoi ti tengo d\'occhio la casa quando non ci sei.'], neutro: ['Salama. Il padrone di casa è passato ieri a chiedere di te.', 'Puoi abbassare la musica la sera? I bambini dormono.'], freddo: ['Non ho tempo per chiacchierare. E stendi i panni dalla tua parte del cortile.'] },
    venditore: { caldo: ['Per te il riso lo faccio a 650 il kapoaka, prezzo da famiglia!', 'Oggi ho pomodori freschi da Antsirabe, 500 il toko. Prendi, prendi.'], neutro: ['Cosa ti serve? Riso, fagioli, olio… tutto fresco, mora mora.', 'Il prezzo è quello, il carburante è aumentato ancora.'], freddo: ['Se non compri, lascia spazio agli altri clienti.'] },
    poliziotto: { caldo: ['Tutto tranquillo. Fai attenzione la sera a Isotry.'], neutro: ['Documenti, per favore. Carta d\'identità.', 'Circolare. Non è zona di sosta.'], freddo: ['Ho già visto la tua faccia. Non farmi ricordare dove.'] },
    medico: { caldo: ['Come va la salute? Ricorda: acqua bollita, zanzariera e riposo.'], neutro: ['La visita costa 20.000 Ar. Sintomi? Febbre, brividi, diarrea?', 'Con la stagione delle piogge la malaria aumenta. Comprate le zanzariere.'], freddo: ['La fila è là fuori come per tutti.'] },
    capo: { caldo: ['Bel lavoro questo mese. Continua così e parleremo di un aumento.', 'Puoi chiudere tu stasera? Mi fido.'], neutro: ['Ricorda: si comincia in orario, non un quarto d\'ora dopo.', 'Gli obiettivi del mese sono quelli. Vediamo.'], freddo: ['Un altro ritardo e trovi la lettera di licenziamento sulla scrivania.'] },
    collega: { caldo: ['Pausa pranzo insieme all\'hotely qui sotto? Il romazava è buonissimo.', 'Ti copro io se arrivi tardi domani, tranquillo/a.'], neutro: ['Il capo è di cattivo umore oggi, occhio.', 'Hai finito il rapporto? Lo vuole entro le 17.'], freddo: ['Fai il tuo lavoro e io faccio il mio.'] },
    professore: { caldo: ['Sei tra i migliori della classe. Pensa all\'università.'], neutro: ['Hai studiato per l\'interrogazione? Vediamo.', 'Il compito è per lunedì. Niente scuse.'], freddo: ['Con questa frequenza non passerai l\'esame.'] },
    'compagno di scuola': { caldo: ['Studiamo insieme stasera da me? Poi guardiamo il calcio.'], neutro: ['Hai capito la lezione di oggi? Io zero.', 'Mi presti gli appunti?'], freddo: ['Chiedi a qualcun altro.'] },
    bancario: { caldo: ['Il suo conto va bene. Vuole parlare di un prestito immobiliare?'], neutro: ['Per il prestito serve un contratto di lavoro e tre buste paga.', 'Il conto rende 0,3% al mese. Sportello 3 per i prelievi.'], freddo: ['Prenda il numero e attenda il suo turno.'] },
    dipendente: { caldo: ['Capo, oggi abbiamo venduto tanto! I clienti ti adorano.'], neutro: ['Capo, manca il resto in cassa. Serve moneta.', 'Posso avere un anticipo sullo stipendio?'], freddo: ['Non mi paghi da settimane. Così non va.'] },
    sconosciuto: { caldo: ['Che bello rivederti! Prendiamo un caffè da Colbert?'], neutro: ['Salama. Ci siamo già visti, no? Al taxi-be forse.', 'Di che quartiere sei? Io sto ad Ambanidia.'], freddo: ['Scusa, non credo di conoscerti.'] },
  };
  let pool = (R[p.ruolo] || R.sconosciuto)[tono] || R.sconosciuto.neutro;
  if (/lavoro|assum|cerc|travail|emploi|boulot|embauch/.test(t)) pool = ['Cercano gente alla zona franca e come camerieri ad Analakely. Guarda la bacheca 📋 ad Analakely e candidati.', 'Senza BACC è dura. Ma il lavoro giornaliero al mercato non manca mai: lun–sab, la domenica niente paga.'];
  if (/casa|affitto|stanza|terreno|maison|loyer|chambre|terrain|logement/.test(t)) pool = ['A Isotry una stanza costa 60.000 al mese, ma di notte gira alla larga. Passa da un\'agenzia ad Analakely o Antanimena.', 'Il padrone vuole sempre due mesi di caparra, è così ovunque a Tana. Terreni economici a Itaosy.'];
  if (/lavoretti|trasloc|facchin|consegn|tselika|petits boulots|déménag|livraison|porteur/.test(t)) pool = ['Se hai ore libere, fatti vedere nel quartiere: c\'è sempre un trasloco o un camion da scaricare, 2.000 Ar l\'ora. Più ti conoscono, più ti chiamano.', 'Mio cugino fa il facchino ai traslochi a 67 Ha, lo chiamano col passaparola. Senza telefono però ti trovano solo se sei lì.'];
  if (/elemosin|mendic|aumône|mendi/.test(t)) pool = ['Ad Analakely all\'ora di pranzo qualcosa si raccoglie. A Ivandry i guardiani ti cacciano prima che tiri fuori la mano.', 'Meglio portare pacchi al mercato che tendere la mano, credimi. Ma se hai fame, la chiesa la domenica aiuta.'];
  if (/soldi|prest|ariary|vola|argent|prêt|prête/.test(t)) pool = ['Soldi? Ahah, se li avessi non sarei qui. Prova la banca o MVola.', 'Ti posso prestare 5.000 Ar ma li rivoglio venerdì.', 'Anche io sono al verde fino allo stipendio.'];
  if (/amore|ti amo|bell|uscire|fidanz|amour|je t'aime|beau|belle|sortir|fiancé|copain|copine/.test(t)) { if (p.rom > 30) pool = ['Mi fai arrossire… sì, usciamo. Ma mia madre vuole conoscerti.', 'Anche tu mi piaci. Ma piano, mora mora.']; else pool = ['Ehm… ci conosciamo appena. Facciamo prima due chiacchiere.', 'Ahah, sei diretto/a. Vediamo come va.']; }
  if (/malat|febbre|medic|malad|fièvre|médec|docteur/.test(t)) pool = ['Vai in farmacia, il paracetamolo costa 2.000 Ar. Se hai brividi forti, è malaria: corri all\'HJRA ad Ampefiloha.'];
  if (/prezz|riso|kapoaka|mercato|prix|riz|marché/.test(t)) pool = ['Il riso al mercato di Andravoahangy è a 650 il kapoaka, all\'épicerie sotto casa 800. Conviene farsi il giro.', 'A Ivandry tutto costa il doppio, è per i vazaha.'];
  if (rude) pool = ['Ma come ti permetti? Tsy mety izany!', 'Con me non si parla così. Addio.'];
  return { text: pick(pool), aff };
}
function ricorda(p, txt) { p.mem = p.mem || []; p.mem.push(`${dataStr().split(' ')[0]}: ${txt}`); if (p.mem.length > 12) p.mem.shift(); }
function spargiVoce(da, txt, segno) { S.voci = S.voci || []; S.voci.push({ da: da.nome, su: da.id, txt, d: S.stat.gg }); if (S.voci.length > 20) S.voci.shift(); S.png.forEach(x => { if (x.id === da.id) return; if (Math.random() < 0.6) { x.aff = clamp(x.aff + segno * rnd(1, 4)); ricorda(x, `${da.nome} mi ha detto: "${txt}"`); } }); }
function applicaAzioniPNG(p, out) {
  const tags = []; out = out.replace(/\[([A-Z_]+)(?::\s*([^\]]*))?\]/g, (m, k, v) => { tags.push([k, (v || '').trim()]); return ''; }).trim();
  let aff = 1, eff = [];
  const hasCasaPNG = true; const n = v => Math.max(0, parseInt(String(v).replace(/[^\d-]/g, '')) || 0);
  for (const [k, v] of tags) {
    if (k === 'AFF') { aff = Math.max(-3, Math.min(3, parseInt(v) || 0)); continue; }
    if (k === 'NUMERO') { if (!p.numero && p.aff >= 10) { p.numero = true; ricorda(p, 'gli/le ho dato il mio numero'); eff.push(`📱 ${p.nome} ti ha dato il suo numero: ora puoi chiamare o scrivere (serve uno smartphone).`); } continue; }
    if (k === 'OSPITA' && p.aff >= 40 && hasCasaPNG) { const gg = Math.min(14, Math.max(1, n(v) || 3)); S.ospite = { id: p.id, nome: p.nome, gg, q: QUARTIERI.find(q => q.nome === p.quartiere)?.id || S.q }; p.favori = (p.favori || 0) + 1; ricorda(p, `l'ho ospitato/a per ${gg} notti`); eff.push(`🛏️ ${p.nome} ti ospita per ${gg} notti a ${p.quartiere}: vai lì e usa «Dormi da ${p.nome}».`); }
    else if (k === 'PRESTA' && p.aff >= 45) { const a = Math.min(20000, Math.max(1000, n(v))); if (a && !p.debito) { S.soldi += a; p.debito = a; p.favori = (p.favori || 0) + 1; ricorda(p, `gli/le ho prestato ${Ar(a)} Ar`); eff.push(`💵 ${p.nome} ti presta ${Ar(a)} Ar (restituiscili!).`); } }
    else if (k === 'REGALA_CIBO' && p.aff >= 30) { S.bis.fame = clamp(S.bis.fame + 35); S.bis.umore = clamp(S.bis.umore + 5); p.favori = (p.favori || 0) + 1; ricorda(p, 'gli/le ho offerto da mangiare'); eff.push(`🍚 ${p.nome} ti offre un piatto di vary sy laoka: fame +35.`); }
    else if (k === 'LAVORETTO') { const L = lavorettiOggi(); const pool = LAVORETTI.filter(l => l.tiers.includes(Q(S.q).tier) && !L.some(x => x.id === l.id)); if (pool.length && L.length < 5) { const l = pick(pool); const ore = rnd(l.ore[0], l.ore[1]); const inizio = Math.min(17, Math.max(ora() + 1, 8)); L.push({ id: l.id, ore, inizio, paga: Math.round(l.paga * ore * MULT_CIBO[Q(S.q).tier] * 1.1 / 100) * 100, fatto: false, da: p.nome }); S.flags.lavList = L; eff.push(`🔧 ${p.nome} ti procura un lavoretto: ${l.nome} alle ${hh(inizio)} (vedi "Lavoretti di oggi").`); } }
    else if (k === 'DRITTA_LAVORO') { const cand = LAVORI.filter(l => l.id !== 'nulla' && l.id !== S.lavoro && S.edu >= (l.edu || 0) && (!l.minSkill || S.skill[l.skill] >= l.minSkill - 5)); if (cand.length) { const l = pick(cand); S.flags.dritta = { id: l.id, gg: S.stat.gg }; eff.push(`📋 Dritta: ${l.nome} a ${Q(l.luogo).nome} (${Ar(l.paga)} Ar/${l.tipo === 'mese' ? 'mese' : 'giorno'}). Se ti candidi entro 7 giorni hai +15% al colloquio.`); } }
    else if (k === 'BONUS' && p.ruolo === 'capo' && S.perf >= 65) { const a = Math.min(Math.round(lavoro().paga / 2), Math.max(5000, n(v))); S.soldi += a; ricorda(p, `gli/le ho dato un bonus di ${Ar(a)} Ar`); eff.push(`💰 Bonus dal capo: +${Ar(a)} Ar.`); }
    else if (k === 'PROMOZIONE' && p.ruolo === 'capo' && S.perf >= 75 && S.esp >= 50 && !S.flags.promosso) { S.flags.bonus = (S.flags.bonus || 1) * 1.1; S.flags.promosso = true; S.bis.umore = clamp(S.bis.umore + 15); ricorda(p, 'l\'ho promosso/a'); eff.push('📈 Promozione! Stipendio +10% stabile.'); }
    else if (k === 'RICHIAMO' && p.ruolo === 'capo') { S.perf = clamp(S.perf - 8); S.bis.umore = clamp(S.bis.umore - 6); ricorda(p, 'gli/le ho fatto un richiamo'); eff.push('⚠️ Richiamo ufficiale: performance -8.'); }
    else if (k === 'LICENZIA' && p.ruolo === 'capo' && (S.perf < 30 || aff <= -3)) { ricorda(p, 'l\'ho licenziato/a'); eff.push('🚫 Sei stato/a licenziato/a su due piedi.'); setTimeout(() => A.licenziati(), 0); }
    else if (k === 'COPRI' && p.ruolo === 'collega' && p.aff >= 40) { S.perf = clamp(S.perf + 5); p.favori = (p.favori || 0) + 1; ricorda(p, 'l\'ho coperto/a col capo'); eff.push('🤝 Il/la collega ti copre: performance +5.'); }
    else if (k === 'PARLA_BENE' && p.ruolo === 'collega' && S.capo) { const c = png(S.capo.id); if (c) { c.aff = clamp(c.aff + 5); ricorda(c, `${p.nome} parla bene di lui/lei`); } eff.push(`🗣️ ${p.nome} parla bene di te al capo: affinità del capo +5.`); }
    else if (k === 'PARLA_MALE' && p.ruolo === 'collega' && S.capo) { const c = png(S.capo.id); if (c) { c.aff = clamp(c.aff - 6); ricorda(c, `${p.nome} sparla di lui/lei`); } S.perf = clamp(S.perf - 3); eff.push(`🐍 ${p.nome} sparla di te al capo: affinità del capo -6, performance -3.`); }
    else if (k === 'PETTEGOLEZZO' && v) { const neg = /pigr|sporc|ladr|bugiard|ubriac|puzz|inaffidab|maleduc|debit|ritard|cattiv|strano/i.test(v) ? -1 : 1; spargiVoce(p, v.slice(0, 90), neg); eff.push(`${neg > 0 ? '💬' : '😬'} ${p.nome} racconta in giro: "${v.slice(0, 90)}"`); }
    else if (k === 'DENUNCIA' && p.ruolo === 'vicino') { if (S.soldi >= 20000) S.soldi -= 20000; else S.soldi = 0; S.fedina = (S.fedina || 0) + 0; ricorda(p, 'ho chiamato la polizia'); eff.push('🚔 Il vicino ha chiamato la polizia: multa 20.000 Ar.'); }
    else if (k === 'FLIRT' && p.aff >= 35) { p.rom = clamp((p.rom || 0) + 8); ricorda(p, 'gli/le ho fatto capire che mi piace'); eff.push(`💞 ${p.nome} ti lancia un segnale: attrazione +8.`); }
    else if (k === 'LASCIA' && p.id === S.partner) { ricorda(p, 'l\'ho lasciato/a'); eff.push(`💔 ${p.nome} ti lascia.`); setTimeout(() => A.lascia(p.id), 0); }
  }
  return { out, aff, eff };
}
async function parla(p, testo) {
  if (!S.png.includes(p)) { S.folla = folla().filter(x => x.id !== p.id); p.conosciuto = S.stat.gg; S.png.push(p); log(`Hai conosciuto ${p.nome} ${p.cognome}, ${p.mest || ruoloTxt(p)}${p.luogoNome ? ' (' + p.luogoNome + ')' : ''}.`, 'info'); }
  p.storia.push({ role: 'user', content: testo });
  let out = null, err = null;
  try { const r = await fetch('/api/chat', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ system: sistemaPrompt(p), messages: p.storia.slice(-12) }) }); const j = await r.json(); if (j.text) out = j.text; ui.aiActive = j.ai; err = j.error; } catch (e) {}
  let aff = 0, eff = [];
  if (out) { const r = applicaAzioniPNG(p, out); out = r.out || '…'; aff = r.aff; eff = r.eff; }
  else { const f = fallbackRisposta(p, testo); out = f.text; aff = f.aff; }
  p.aff = clamp(p.aff + aff); if (p.rom > 0 || /amore|bell/.test(testo)) p.rom = clamp((p.rom || 0) + Math.max(0, aff));
  if (/prometto|giuro|ti aiuto|domani|restituisc|ti pago/i.test(testo)) ricorda(p, `mi ha detto: "${testo.slice(0, 60)}"`);
  if (aff <= -2) ricorda(p, `è stato/a sgarbato/a ("${testo.slice(0, 40)}")`);
  p.storia.push({ role: 'assistant', content: out }); skillUp('sociale', 0.3); avanza(5);
  eff.forEach(t => log(t, 'info'));
  return out;
}

/* ---------- SALVATAGGIO ---------- */
const LS = { get(k) { try { return localStorage.getItem(k); } catch (e) { return null; } }, set(k, v) { try { localStorage.setItem(k, v); } catch (e) {} }, del(k) { try { localStorage.removeItem(k); } catch (e) {} } };
// Codice giocatore: ogni telefono/browser ha il suo slot sul server (così più amici possono giocare sullo stesso link).
function codiceGiocatore() { let c = LS.get('mrls_pid'); if (!c || !/^[A-Z0-9-]{4,}$/.test(c)) { c = nuovoCodice(); LS.set('mrls_pid', c); } return c; }
function nuovoCodice() { const A = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'; let c = ''; for (let i = 0; i < 8; i++) c += A[Math.floor(Math.random() * A.length)]; return c.slice(0, 4) + '-' + c.slice(4); }
function cambiaCodice(c) { c = String(c || '').toUpperCase().replace(/[^A-Z0-9]/g, ''); if (c.length < 6) return toast('Codice troppo corto.'); LS.set('mrls_pid', c.slice(0, 4) + '-' + c.slice(4, 12)); return true; }
async function salva() { if (!S) return; LS.set('tanalife', JSON.stringify(S)); try { await fetch('/api/save', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ slot: codiceGiocatore(), state: S }) }); } catch (e) {} }
function nomeFileSalvataggio() { const d = new Date(); const p = n => String(n).padStart(2, '0'); return `MRLS-${(S.nome || 'partita').replace(/[^\w]+/g, '_')}-g${S.stat.gg}-${d.getFullYear()}${p(d.getMonth() + 1)}${p(d.getDate())}-${p(d.getHours())}${p(d.getMinutes())}.json`; }
function salvaSuFile() { if (!S) return; salva(); ui.modal = { tipo: 'salvafile', data: JSON.stringify(S), nome: nomeFileSalvataggio() }; render(); }
function condividiFile(data, nome) { try { const file = new File([data], nome, { type: 'application/json' }); if (!navigator.share) throw new Error('noshare'); return navigator.share({ files: [file], title: nome }).then(() => toast('Fatto.')).catch(e => { if (e && e.name === 'AbortError') return; toast('Condivisione bloccata qui: apri il gioco direttamente in Safari (non nell\'anteprima) oppure usa Scarica / Copia.'); }); } catch (e) { toast('Condivisione non disponibile su questo browser: usa Scarica o Copia.'); } }
function salvaConPicker(data, nome) { window.showSaveFilePicker({ suggestedName: nome, types: [{ description: 'Salvataggio MRLS', accept: { 'application/json': ['.json'] } }] }).then(async h => { const w = await h.createWritable(); await w.write(data); await w.close(); toast('Salvato: ' + nome); ui.modal = null; render(); }).catch(e => { if (!e || e.name !== 'AbortError') scaricaFile(data, nome); }); }
function copiaSalvataggio(data) { const done = () => toast('Salvataggio copiato: incollalo in Note o in un file di testo.'); if (navigator.clipboard && navigator.clipboard.writeText) navigator.clipboard.writeText(data).then(done, () => { const t = $('svTxt'); if (t) { t.focus(); t.select(); document.execCommand('copy'); done(); } }); else { const t = $('svTxt'); if (t) { t.focus(); t.select(); document.execCommand('copy'); done(); } } }
function importaTesto() { const t = $('ldTxt'); if (!t || !t.value.trim()) return toast('Incolla prima il testo del salvataggio.'); try { const s = JSON.parse(t.value.trim()); if (!s || !s.nome || !s.bis) throw 0; S = migra(s); ui.modal = null; ui.tab = 'home'; render(); salva(); toast('Partita caricata: ' + S.nome); } catch (e) { toast('Testo non valido.'); } }
function scaricaFile(data, nome) { const blob = new Blob([data], { type: 'application/json' }); const url = URL.createObjectURL(blob); const a = document.createElement('a'); a.href = url; a.download = nome; document.body.appendChild(a); a.click(); setTimeout(() => { a.remove(); URL.revokeObjectURL(url); }, 4000); toast('File scaricato: ' + nome); }
function caricaDaFile() { const inp = document.createElement('input'); inp.type = 'file'; inp.accept = '.json,application/json'; inp.onchange = () => { const f = inp.files[0]; if (!f) return; const r = new FileReader(); r.onload = () => { try { const s = JSON.parse(r.result); if (!s || !s.nome || !s.bis) throw 0; S = migra(s); ui.modal = null; ui.tab = 'home'; render(); salva(); toast('Partita caricata: ' + S.nome); } catch (e) { toast('File non valido.'); } }; r.readAsText(f); }; inp.click(); }
async function carica() { let s = null; try { const r = await fetch('/api/load?slot=' + encodeURIComponent(codiceGiocatore())); if (r.ok) s = (await r.json()).state; } catch (e) {} if (!s) { const l = LS.get('tanalife'); if (l) s = JSON.parse(l); } return s ? migra(s) : null; }

/* ---------- UI ---------- */
function esc(s) { return String(s).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c])); }
function conferma(titolo, testo, fn, okLabel = 'Conferma') { ui.modal = { tipo: 'conferma', titolo, testo, fn, okLabel }; render(); }
function act(label, fn, small = '', dis = false) { const id = 'a' + Math.random().toString(36).slice(2, 8); setTimeout(() => { const e = $(id); if (e) e.onclick = () => { fn(); render(); salva(); }; }); return `<button class="act" id="${id}" ${dis ? 'disabled' : ''}><span>${label}</span><small>${small}</small></button>`; }
function btn(label, fn, cls = 'pri') { const id = 'b' + Math.random().toString(36).slice(2, 8); setTimeout(() => { const e = $(id); if (e) e.onclick = () => { fn(); render(); }; }); return `<button class="${cls}" id="${id}">${label}</button>`; }
function renderHeader() {
  $('hName').textContent = S.nome; const hav = $('hAv'); if (hav) { hav.src = AVATAR_BASE + (S.avatar || 'a1') + '.jpg'; hav.style.display = 'block'; } $('hAge').textContent = `${S.eta} anni · ${lavoro().nome}`; $('hTime').textContent = dataStr(); $('hMoney').textContent = Ar(S.soldi);
  const ic = { fame: '🍚', energia: '⚡', igiene: '🧼', vescica: '🚽', umore: '🙂', salute: '❤️' };
  $('bars').innerHTML = Object.entries(S.bis).map(([k, v]) => `<div class="bar ${v < 25 ? 'low' : ''}">${ic[k]} ${Math.round(v)}<i><b style="width:${v}%"></b></i></div>`).join('');
}
function renderNav() { const tabs = [['home', '📍', 'Qui'], ['citta', '🗺️', 'Città'], ['persone', '👥', 'Persone'], ['me', '🧍', 'Io'], ['diario', '📜', 'Diario']]; $('nav').innerHTML = tabs.map(t => `<button class="${ui.tab === t[0] ? 'on' : ''}" onclick="ui.tab='${t[0]}';render()"><span>${t[1]}</span>${t[2]}</button>`).join(''); }
function render() { clearTimeout(ui.cineT); if (!S) return renderIntro(); if (S.morto && (!ui.modal || ui.modal.tipo !== 'morte')) ui.modal = { tipo: 'morte' }; document.body.classList.remove('start', 'intro'); renderHeader(); renderNav(); $('main').innerHTML = ({ home: vHome, citta: vCitta, persone: vPersone, me: vMe, diario: vDiario })[ui.tab](); renderModal(); }
const AVATARS = [
  { id: 'a1', nome: 'Andry', gen: 'M', desc: 'Determinato, arriva dalle colline' },
  { id: 'a2', nome: 'Miora', gen: 'F', desc: 'Solare, non si arrende mai' },
  { id: 'a3', nome: 'Tojo', gen: 'M', desc: 'Riservato, testa fine' },
  { id: 'a4', nome: 'Soa', gen: 'F', desc: 'Sicura di sé, viene dalla costa' },
  { id: 'a5', nome: 'Hery', gen: 'M', desc: 'Forte, sempre di buon umore' },
];
const AVATAR_BASE = (typeof window !== 'undefined' && window.AVATAR_BASE) || 'avatars/';
const ART_BASE = 'art/';
const INTRO_VIDEO = 'intro/intro.mp4';
const INTRO_POSTER = 'intro/c1.jpg';
const INTRO_SLIDES = [
  { at: 0.8, t: 'Madagascar.', s: 'Un\'isola bellissima. Una vita che non regala niente.' },
  { at: 6.5, t: 'Antananarivo ti aspetta.', s: 'Parti dal nulla: 20.000 Ariary in tasca, nessuna casa, nessun lavoro.' },
  { at: 12.5, t: 'Ogni giorno è una prova.', s: 'Fame, affitto, fatica. Nessuno ti regala niente, ma tutti hanno qualcosa da offrirti.' },
  { at: 18.5, t: 'Puoi arrivare in cima.', s: 'Con fatica, scelte giuste e un po\' di fortuna, chiunque può diventare qualcuno.' },
  { at: 24.5, t: 'Ce la farai?', s: '', last: true },
];
function renderIntro() {
  $('nav').innerHTML = ''; document.body.classList.add('intro');
    if (!ui.introDone && LS.get('mrls_intro') !== '1') return renderCinematic();
  document.body.classList.remove('intro'); document.body.classList.add('start');
  const sel = ui.avatar || AVATARS[0].id; const av = AVATARS.find(a => a.id === sel);
  $('main').innerHTML = `<div class="hero"><img class="heroimg" src="${ART_BASE}hero.webp" alt="" onerror="this.remove()"><div class="brand"><h1>Malagasy Real Life Simulator</h1><p class="mut">Una vita vera, da zero, ad Antananarivo.</p></div></div>
  <div class="card"><h3>Il tuo personaggio</h3>
  <div class="avsel">${AVATARS.map(a => `<button class="av ${a.id === sel ? 'on' : ''}" onclick="ui.avatar='${a.id}';render()"><img src="${AVATAR_BASE}${a.id}.jpg" alt=""></button>`).join('')}</div>
  <p class="mut" style="margin:6px 0 10px">${av.desc}</p>
  <input id="iNome" placeholder="Come ti chiami?" value="${ui.nomeTmp || ''}" oninput="ui.nomeTmp=this.value" autocomplete="off"></div>
  <div class="card"><h3>Come funziona</h3>
  <div class="how"><div><span>📍</span><div><b>Una città vera</b><p>Antananarivo, quartiere per quartiere. Ogni luogo ha i suoi negozi, i suoi prezzi e le sue opportunità.</p></div></div>
  <div><span>🍚</span><div><b>Bisogni quotidiani</b><p>Fame, energia, igiene, umore e salute. Se li trascuri, la vita te lo fa pagare.</p></div></div>
  <div><span>💼</span><div><b>Lavoro e carriera</b><p>Dai lavoretti di strada agli uffici: colloqui, orari, puntualità, stipendi. Studia per salire.</p></div></div>
  <div><span>🏠</span><div><b>Casa, soldi, futuro</b><p>Affitta, compra, arreda, apri un conto, chiedi un prestito, avvia un'attività tua.</p></div></div>
  <div><span>👥</span><div><b>Persone vere</b><p>Amici, colleghi, amori, famiglia: i personaggi parlano con te grazie all'AI e si ricordano di te.</p></div></div>
  <div><span>⏱</span><div><b>Il tempo conta</b><p>Ogni azione costa minuti, energia e spesso Ariary. Pianifica le giornate.</p></div></div></div></div>
  <div class="card"><h3>Modalità</h3>
  <div class="modes">
    <button class="mode on" onclick="ui.mode=18"><b>18 anni</b><span>Senza istruzione, senza niente. La strada più dura.</span></button>
    <button class="mode soon" disabled><b>25 anni</b><span>Appena laureato/a</span><em>Coming soon</em></button>
    <button class="mode soon" disabled><b>35 anni</b><span>Imprenditore di successo</span><em>Coming soon</em></button>
  </div>
  ${btn('Inizia la tua vita', () => { const n = ($('iNome').value || '').trim(); if (!n) return toast('Scrivi il tuo nome.'); nuovaPartita(n, av.gen, 18); S.avatar = av.id; ui.tab = 'home'; })}
  <button class="sec" style="width:100%" onclick="carica().then(s=>{if(s){S=s;render()}else toast('Nessun salvataggio')})">Continua partita salvata</button>
  <button class="sec" style="width:100%" onclick="ui.modal={tipo:'caricafile'};render()">📂 Carica da file…</button>
  <button class="sec" style="width:100%" onclick="ui.modal={tipo:'codice'};render()">🔑 Ho un codice partita</button>
  <button class="link" onclick="ui.introStep=0;ui.introDone=false;LS.del('mrls_intro');render()">Rivedi l'intro</button></div>
`;
}
function renderCinematic() {
  const fine = () => { ui.introDone = true; LS.set('mrls_intro', '1'); render(); };
  $('main').innerHTML = `<div class="cine"><video id="cVid" src="${INTRO_VIDEO}" poster="${INTRO_POSTER}" playsinline webkit-playsinline muted autoplay preload="auto"></video><div class="shade"></div>
    <button class="skip" id="cSkip">Salta</button>
    <div class="ctext" id="cText"></div></div>`;
  const v = $('cVid'), tx = $('cText'); let shown = -1;
  const show = i => { if (i === shown) return; shown = i; const sl = INTRO_SLIDES[i]; tx.className = 'ctext'; void tx.offsetWidth; tx.className = 'ctext in'; tx.innerHTML = `<h1>${sl.t}</h1>${sl.s ? `<p>${sl.s}</p>` : ''}${sl.last ? `<div class="cta"><button class="pri" id="cGo">Sì, ci provo</button></div>` : ''}`; const g = $('cGo'); if (g) g.onclick = e => { e.stopPropagation(); fine(); }; };
  const tick = t => { let i = 0; INTRO_SLIDES.forEach((sl, k) => { if (t >= sl.at) i = k; }); if (t >= INTRO_SLIDES[0].at) show(i); };
  if (v) { v.ontimeupdate = () => tick(v.currentTime); v.onended = () => show(INTRO_SLIDES.length - 1); v.onerror = () => { show(INTRO_SLIDES.length - 1); }; const p = v.play && v.play(); if (p && p.catch) p.catch(() => { }); }
  // fallback se il video non parte (autoplay bloccato): timer
  const t0 = Date.now(); ui.cineT = setTimeout(function loop() { if (S || ui.introDone) return; if (!v || v.paused || v.currentTime === 0) tick((Date.now() - t0) / 1000); if ((Date.now() - t0) / 1000 < 30) ui.cineT = setTimeout(loop, 500); }, 500);
  const k = $('cSkip'); if (k) k.onclick = e => { e.stopPropagation(); fine(); };
}

/* ---- HOME: quartiere o luogo ---- */
function vHome() {
  const q = Q(S.q);
  if (S.malattie.length || S.flags.compleanno) {
    var top = '';
    if (S.malattie.length) top += `<div class="card" style="border:1px solid var(--bad)"><h3>🤒 Sei malato/a</h3>${S.malattie.map(m => `<div style="margin-bottom:6px"><b>${MALATTIE[m.tipo].nome}</b> — ancora ${m.gg} giorni · ${MALATTIE[m.tipo].sint}<div class="mut">Malus: ${malusMalattia(m.tipo)}</div><div class="mut">${cureMalattia(m.tipo)}</div></div>`).join('')}${Object.entries(S.medicine).filter(([k, v]) => v > 0).map(([k]) => act('Prendi ' + MEDICINE.find(x => x.id === k).nome, () => A.prendi(k), 'x' + S.medicine[k])).join('')}</div>`;
    if (S.flags.compleanno) top += `<div class="card">🎂 È il tuo compleanno! ${act('Festeggia con gli amici', A.festaCompleanno, '4h · 50.000 Ar · umore 100 · amici +6')}</div>`;
  }
  if (!S.loc) return (top || '') + vQuartiere(q);
  return (top || '') + vLuogo(q);
}
function vQuartiere(q) {
  let h = `<div class="qhero"><img src="${ART_BASE}q/${q.id}.webp" alt="" onerror="this.parentNode.classList.add('noimg')"><div class="qh"><h2>📍 ${q.nome} <span class="pill">zona ${q.centro ? TIER_LBL[6] : TIER_LBL[q.tier]}</span></h2></div></div><p class="mut">${q.desc} Prezzi: ×${MULT_CIBO[q.tier]}.</p><div class="card"><h3>Luoghi del quartiere</h3>`;
  poiDisponibili(q.id).forEach(p => { const d = p === 'attivita' ? { nome: ATTIVITA.find(a => a.id === S.attivita.id).nome, icon: ATTIVITA.find(a => a.id === S.attivita.id).icon } : POI[p]; let sub = d.desc || ''; if (p === 'lavoro') { const st = statoTurno(lavoro()); sub = `${orarioLavoro(lavoro())} · ${st.txt || ''}`; } h += act(`${d.icon} ${d.nome}`, () => entra(p), (p === 'casa' ? '3' : '7') + ' min · ' + sub); });
  h += '</div>';
  { const L = lavorettiOggi(); const rete = (S.flags.rep && S.flags.rep[q.id]) || 0; h += `<div class="card"><h3>🔧 Lavoretti di oggi a ${q.nome}</h3><p class="mut">Passaparola: ${rete === 0 ? 'nessuno ti conosce qui' : rete < 3 ? 'qualcuno inizia a conoscerti' : rete < 8 ? 'ti chiamano spesso (+1 offerta)' : 'sei il/la tuttofare del quartiere (+2 offerte, paga +10%)'}${ha('telefono') ? ' · 📱 telefono: +1 offerta' : ' · senza telefono ti trovano solo di persona'}. Le offerte cambiano ogni giorno e per quartiere.</p>`;
    if (!L.length) h += '<p class="mut">Oggi nessuno cerca aiuto.</p>';
    L.forEach((j, i) => { const l = LAVORETTI.find(x => x.id === j.id); const req = [l.fit ? 'fitness ' + l.fit : '', l.soc ? 'sociale ' + l.soc : '', l.casa ? 'casa ' + l.casa : '', l.edu ? EDU[l.edu] : ''].filter(Boolean).join(', '); const scaduto = ora() > j.inizio + 2; const cf = conflittoLavoretto(j); const cfTag = cf ? (cf.tipo === 'sovrapposto' ? ' <span class="tag" style="background:#5a2a2a">⛔ ' + cf.txt + '</span>' : ' <span class="tag" style="background:#234d3a">✅ ' + cf.txt + '</span>') : ''; h += act(`${l.icon} ${l.nome}${cfTag}${l.bucato ? ' <span class="mut">' + (j.bucato.cortile ? '· cortile disponibile' : '· da portare al bassin pubblico') + '</span>' : ''}`, () => l.bucato ? A.lavoretto(i) : conferma(`${l.icon} ${l.nome}?`, `${l.desc}<br><br>⏰ Si comincia alle <b>${hh(j.inizio)}</b> (arriva entro 2h), dura <b>${j.ore}h</b> → fine ~${hh((j.inizio + j.ore) % 24)}<br>💰 <b>${Ar(j.paga)} Ar</b> in contanti alla fine${l.veicolo && S.veicolo ? ' (×' + (S.veicolo === 'bici' ? '1.3' : l.veicolo) + ' col tuo mezzo)' : ''}<br>⚡ fatica ${Math.round(l.fatica * j.ore * 0.5 + 5 * j.ore)} · 🧼 igiene -${Math.round(l.igiene * j.ore * 0.5 + 2 * j.ore)}${req ? '<br>Requisiti: ' + req : ''}${S.lavoro !== 'nulla' ? '<br><span class="mut">Il tuo turno fisso: ' + orarioLavoro(lavoro()) + ' — controlla di non sovrapporti.</span>' : ''}`, () => A.lavoretto(i), 'Accetto'), `${j.fatto ? '✅ fatto' : scaduto ? '⌛ scaduto' : hh(j.inizio) + '–' + hh((j.inizio + j.ore) % 24) + ' · ' + j.ore + 'h · ' + Ar(j.paga) + ' Ar'}${req ? ' · ' + req : ''}`, j.fatto || scaduto || (cf && cf.tipo === 'sovrapposto')); });
    h += '</div>'; }
  { const qui = personeQui(q.id, null); const abitanti = S.png.filter(p => !p.luogoQ && doveSta(p).q === q.id && doveSta(p).poi === 'casa'); h += cardPersoneQui(qui, 'Per strada'); if (abitanti.length) h += `<div class="card"><h3>🏠 Abitano qui</h3>${abitanti.map(p => act(`🚪 Vai a casa di ${p.nome} ${p.cognome}`, () => A.visita(p.id), `${ruoloTxt(p)} · affinità ${p.aff}` + (p.aff < 30 ? ' · potrebbe non aprirti' : ''))).join('')}</div>`; }
  h += `<div class="card"><h3>Per strada</h3>${act('⏳ Aspetta…', () => { ui.modal = { tipo: 'aspetta' }; }, 'scegli durata o fino a un orario')}${S.ospite && S.ospite.gg > 0 && S.q === S.ospite.q ? act(`🛏️ Dormi da ${S.ospite.nome}…`, () => { ui.modal = { tipo: 'dormi', ospite: true }; }, `ospite ancora ${S.ospite.gg} notti · gratis`) + act(`🧹 Dai una mano in casa di ${S.ospite.nome}`, A.aiutaOspite, '2h · affinità +5') : ''}${!haCasa() ? act('😴 Dormi per strada…', () => { ui.modal = { tipo: 'dormi' }; }, 'scegli durata o sveglia · umore -10 · igiene -10 · rischio furto') + act('🛏️ Dormi in ostello…', () => { ui.modal = { tipo: 'dormi', ostello: true }; }, 'scegli durata o sveglia · 15.000 Ar/notte · doccia inclusa') : ''}${act('🤲 Chiedi l\'elemosina…', () => { ui.modal = { tipo: 'elemosina' }; }, ({ 1: '~1 su 7 dà 200–1.000 Ar', 2: '~1 su 10 dà 500–2.000 Ar', 3: '~1 su 16 dà 1–5.000 Ar', 4: '~1 su 28 dà 2–10.000 Ar · rischio guardiani', 5: '~1 su 45 dà 5–20.000 Ar · rischio guardiani' })[q.tier] + ' · umore -4/h')}${S.fedina < 3 && q.tier <= 2 ? act('🕵️ Borseggia un passante', () => conferma('🕵️ Rischiare?', '50%: rubi 5–40.000 Ar. 50%: arrestato/a, 3 notti in cella, multa 100.000 Ar e fedina sporca.', A.borseggia, 'Rischio'), '1h · rischioso') : ''}</div>`;
  h += `<div class="card"><h3>Ultimi eventi</h3><div class="log">${S.log.slice(0, 5).map(e => `<div class="${e.tipo}"><span class="mut">${e.d}</span> · ${esc(e.t)}</div>`).join('')}</div></div>`;
  return h;
}
function cardPersoneQui(list, titolo) {
  if (!list.length) return '';
  return `<div class="card"><h3>👥 ${titolo}</h3><p class="mut">Tocca qualcuno per parlargli. Gli sconosciuti diventano conoscenze dopo la prima chiacchierata.</p>${list.map(p => `<div class="person" onclick="apriChat('${p.id}')">${avatarHtml(p)}<div class="n"><b>${S.png.includes(p) ? p.nome + ' ' + p.cognome : (p.gen === 'M' ? 'Uno sconosciuto' : 'Una sconosciuta')}</b> <span class="mut">${p.eta}</span><div class="mut">${p.mest || ruoloTxt(p)}${S.png.includes(p) ? ' · ' + trattiTxt(p) : ''}</div></div>${S.png.includes(p) ? `<span class="mut">${p.aff}</span>` : '<span class="mut">💬</span>'}</div>`).join('')}</div>`;
}
function vLuogo(q) {
  const p = S.loc; const d = p === 'attivita' ? { nome: ATTIVITA.find(a => a.id === S.attivita.id).nome, icon: ATTIVITA.find(a => a.id === S.attivita.id).icon } : POI[p];
  let h = `<button class="sec" onclick="S.loc=null;render()">‹ ${q.nome}</button><div class="qhero phero"><img src="${ART_BASE}${p === 'casa' ? 'h/' + artCasa(casa()) : 'p/' + p}.webp" alt="" onerror="this.parentNode.classList.add('noimg')"><div class="qh"><h2>${d.icon} ${d.nome}</h2></div></div>`;
  const F = { casa: vCasa, lavoro: vLavoro, annunci: vAnnunci, mercato: () => vNegozio('mercato'), epicerie: () => vNegozio('epicerie'), minimarket: () => vNegozio('minimarket'), super: () => vNegozio('super'), bagni: vBagni, gargote: () => vPronto('gargote'), ristorante: () => vPronto('ristorante'), banca: vBanca, agenzia: vAgenzia, ospedale: vOspedale, farmacia: vFarmacia, auto: vAuto, scuola: () => vScuola('scuola'), universita: () => vScuola('universita'), stadio: vSport, palestra: vSport, chiesa: () => act('⛪ Partecipa alla messa', A.chiesa, '2h · umore +10 · conosci gente'), comune: vComune, bar: vBar, lago: () => act('🌳 Passeggia', A.lago, '1h · umore +8') + act('🏃 Corri attorno al lago', () => A.sport('corsa'), '1h30 · gratis · fitness +'), zonafranca: () => `<p class="mut">Le fabbriche tessili della zona franca. Per lavorarci candidati alla bacheca 📋 di Analakely.</p>`, aeroporto: () => `<p class="mut">Arrivi e partenze, turisti, taxi ufficiali. Le offerte di lavoro qui attorno sono sulla bacheca 📋 di Analakely.</p>` + act('👀 Guarda gli aerei', A.lago, '1h · umore +8'), fornace: () => `<p class="mut">Cataste di mattoni rossi fumano nelle risaie. Lavoro a giornata: guarda i lavoretti di oggi o la bacheca 📋.</p>`, grossista: () => `<p class="mut">Camion e sacchi da 50 kg. Qui il riso costa meno che ovunque: compra al mercato di Anosibe.</p>`, fabbrica: () => `<p class="mut">Turni dalle 6, badge, mensa. Le offerte sono sulla bacheca 📋 di Analakely.</p>`, rova: () => act('🏰 Visita il Rova', A.rova, '2h · 10.000 Ar · umore +15 · intelligenza +') + act('🌄 Guarda il tramonto sulla città', A.lago, '1h · umore +8'), attivita: vAttivita };
  h += `<div class="card">${F[p]()}</div>`;
  if (!['casa', 'lavoro', 'attivita'].includes(p)) h += cardPersoneQui(personeQui(S.q, p), 'Persone qui'); else if (p === 'lavoro') h += cardPersoneQui(S.png.filter(x => presente(x)), 'Colleghi presenti'); else if (p === 'attivita') h += cardPersoneQui(S.png.filter(x => x.ruolo === 'dipendente'), 'In negozio');
  h += `<div class="card">${['lavoro', 'gargote', 'casa'].includes(p) ? act('🚽 Vai in bagno', A.bagno, '5 min · gratis') : ''}${act('⏳ Aspetta…', () => { ui.modal = { tipo: 'aspetta' }; }, p === 'lavoro' && statoTurno(lavoro()).stato === 'presto' ? 'es. fino all\'inizio del turno' : 'scegli durata o orario')}</div>`;
  return h;
}
function artCasa(c) { if (!c) return 'strada'; const t = c.tipo; return ({ appv: 'app', villav: 'villa' })[t] || t; }
function vCasa() {
  const c = casa(); let h = `<p class="mut">${c.nome}. ${c.desc || ''} Comfort ${c.comfort}/10 · Sporcizia ${Math.round(S.sporcoCasa)}%${c.affitto ? ' · affitto ' + Ar(c.affitto) + ' Ar/mese' : ''}</p>`;
  h += `<h3>🍳 Cucina</h3><p class="mut">Fuoco: ${ha('gasf') ? 'gas (' + S.disp.gas + ' cotture)' : ha('fornello') ? 'fatapera a carbone (' + S.disp.carbone + ' cotture)' : 'NESSUN FORNELLO — compra una fatapera al mercato'}</p>`;
  RICETTE.forEach(r => { const manca = Object.entries(r.ing).filter(([k, n]) => (S.disp[k] || 0) < n).map(([k, n]) => NOMI_DISP[k]); const ok = !manca.length; const tempo = ha('gasf') && r.fuoco ? Math.round(r.min * 0.65) : r.min; h += act(`${ok ? '✅' : '▫️'} ${r.nome}`, () => A.cucina(r.id), `${durata(tempo)} · fame +${r.fame}${r.umore ? ' · umore ' + (r.umore > 0 ? '+' : '') + r.umore : ''}${r.salute ? ' · salute +' + r.salute : ''}${ok ? '' : ' · manca: ' + manca.join(', ')}`, !ok); });
  h += `<details><summary class="mut">Dispensa</summary><p class="mut">${Object.entries(S.disp).filter(([k, v]) => v > 0).map(([k, v]) => `${NOMI_DISP[k]}: <b>${v}</b>${FRESCHI[k] && S.fresco[k] !== undefined ? ' (' + Math.max(0, (ha('frigo') ? FRESCHI[k] * 4 : FRESCHI[k]) - (S.stat.gg - S.fresco[k])) + 'gg)' : ''}`).join(' · ') || 'vuota'}</p></details>`;
  h += `<h3 style="margin-top:10px">🧼 Igiene e casa</h3>`;
  h += act('🧼 Lavati', A.lavati, ha('doccia') ? '20 min · doccia · igiene 100' : ha('secchio') ? '30 min · secchio + sapone · igiene +55' : 'serve un secchio');
  h += act('🫧 Fai il bucato', A.bucato, `${ha('lavatrice') ? '1h' : '1h30'} · ${S.pantoSporchi} sporchi · sapone ${S.disp.sapone}`);
  h += act('🧺 Stendi i panni', A.stendi, `15 min · ${S.pantoBagnati} bagnati · ${S.pantoPuliti} puliti`);
  h += act('🧹 Pulisci casa', A.pulisci, '1h · umore +5');
  h += `<h3 style="margin-top:10px">😴 Riposo e svago</h3>` + act('😴 Dormi…', () => { ui.modal = { tipo: 'dormi' }; }, `scegli durata o sveglia · ${8 + casaComfortSonno()} energia/ora${!ha('materasso') && !ha('letto') ? ' · per terra: -10' : ''}`);
  h += act('📚 Leggi / studia', A.leggi, '1h30 · intelligenza +');
  if (ha('tv')) h += act('📺 Guarda la TV', A.tv, '1h30 · umore +12');
  if (ha('pesi')) h += act('🏋️ Allenati', A.pesi, '1h · fitness + · energia -10');
  if (S.figli.length) h += act('👶 Gioca con i figli', A.giocaFigli, '1h30 · umore +15');
  return h;
}
function vLavoro() {
  const l = lavoro(); const st = statoTurno(l); const fatto = S.flags.lavoratoOggi === now().toDateString();
  return `<p class="mut">${l.nome} · ${l.tipo === 'mese' ? Ar(l.paga) + ' Ar/mese (fisso, anche nei giorni di riposo)' : Ar(l.paga) + ' Ar/giorno (solo i giorni lavorati)'}<br>⏰ <b>${orarioLavoro(l)}</b> · 📅 <b>${giorniTxt(l)}</b> · ora: <b>${GG[giornoIdx()]} ${oraStr()}</b> → <b style="color:${['puntuale', 'presto'].includes(st.stato) ? 'var(--ok)' : 'var(--bad)'}">${fatto ? 'turno di oggi già fatto' : st.txt}</b><br>Performance ${Math.round(S.perf)}/100 (sotto 15 = licenziamento) · esperienza ${S.esp} turni${S.capo ? ' · capo: ' + S.capo.nome : ''}</p>` + (st.stato === 'presto' && !fatto ? act(`⏳ Aspetta l'inizio del turno e timbra`, () => { A.aspetta(minutiFinoTurno() || 0, 'fino all\'inizio del turno'); A.lavora(); }, `${durata(minutiFinoTurno() || 0)} di attesa · poi lavori ${l.ore}h`) : '') + act('💼 Timbra e lavora', A.lavora, `${l.ore}h · energia -${l.ore * 5} · fame -${Math.round(l.ore * 3.5)}`, st.stato === 'chiuso' || fatto) + act('Licenziati', () => conferma('Licenziarti?', `Lasci il posto di <b>${l.nome}</b>. ${l.tipo === 'mese' ? 'Perdi i turni maturati questo mese (' + Math.round(S.ggLavorati) + ').' : ''} Dovrai rifare un colloquio per un nuovo lavoro.`, A.licenziati, 'Mi licenzio'), 'immediato');
}
function vOfferte() {
  let h = `<h3 style="margin-top:10px">Offerte di lavoro</h3><p class="mut">Tocca per candidarti (colloquio 1h30). Igiene alta e buon umore aiutano.</p>`;
  LAVORI.filter(x => x.id !== 'nulla' && x.id !== S.lavoro).forEach(x => { const req = [x.edu ? EDU[x.edu] : null, x.minSkill ? `${SKILL_LBL[x.skill]} ${x.minSkill}` : null, x.patente ? 'patente' : null, x.esp ? x.esp + ' anni esp.' : null].filter(Boolean).join(', '); h += act(`${x.nome}`, () => conferma('📋 Candidarsi?', `<b>${x.nome}</b> a ${Q(x.luogo).nome}<br>💰 ${Ar(x.paga)} Ar/${x.tipo === 'mese' ? 'mese (stipendio il 1°)' : 'giorno (pagato a fine turno)'}<br>⏰ ${orarioLavoro(x)} · 📅 ${giorniTxt(x)}<br>Requisiti: ${req || 'nessuno'}<br><br>Il colloquio dura 1h30.${S.lavoro !== 'nulla' ? ' <b>Se ti assumono lasci il lavoro attuale (' + lavoro().nome + ').</b>' : ''}`, () => A.candidati(x.id), 'Vai al colloquio'), `${Ar(x.paga)} Ar/${x.tipo === 'mese' ? 'mese' : 'gg'} · ⏰ ${orarioLavoro(x)} ${giorniTxt(x)} · 📍 ${Q(x.luogo).nome} · ${req || 'nessun requisito'}`); });
  return h;
}
function vAnnunci() { let h = `<p class="mut">${S.lavoro !== 'nulla' ? 'Lavoro attuale: ' + lavoro().nome + '.' : 'Sei disoccupato/a.'}</p>` + vOfferte(); if (!S.attivita) { h += `<h3 style="margin-top:10px">Metti su un'attività in proprio</h3><p class="mut">Si apre nel quartiere in cui ti trovi: alcune attività esistono solo in certi quartieri.</p>`; ATTIVITA.filter(a => !a.q || a.q.includes(S.q)).forEach(a => h += act(`${a.icon} ${a.nome}`, () => conferma('🏪 Aprire l\'attività?', `<b>${a.nome}</b> a ${Q(S.q).nome}<br>💰 capitale ${Ar(a.costo)} Ar · resa stimata ~${Ar(a.base)} Ar/giorno (dipende dalla tua abilità business)<br>4h di pratiche al comune.`, () => A.apriAttivita(a.id), 'Apri'), `4h pratiche · capitale ${Ar(a.costo)} Ar · ~${Ar(a.base)} Ar/gg`)); } return h; }
function vAttivita() { const a = ATTIVITA.find(x => x.id === S.attivita.id); return `<p class="mut">Incasso del mese: ${Ar(S.attivita.mese)} Ar · business ${Math.round(S.skill.business)}</p>` + act('Gestisci l\'attività', A.gestisci, '5h · business + · incasso extra') + (S.attivita.dip ? '' : act('Assumi un dipendente', A.assumi, '300.000 Ar · +60% incassi')) + act('Vendi l\'attività', () => conferma('Vendere l\'attività?', `Incassi il 40% del capitale: <b>${Ar(a.costo * 0.4)} Ar</b>. Non torna indietro.`, A.chiudiAttivita, 'Vendi'), '40% del valore'); }
function vNegozio(tipo) {
  const q = Q(S.q); const cat = { base: 'Riso e cereali', carne: 'Carne, pesce, uova', verdura: 'Verdure', dispensa: 'Dispensa', casa: 'Casa e combustibile' };
  let h = `<p class="mut">${POI[tipo].desc} Prezzi ${q.nome}: ×${MULT_CIBO[q.tier]} ${tipo !== 'mercato' ? '· ' + POI[tipo].nome.split(' (')[0] + ' ×' + MULT_NEGOZIO[tipo] : ''}. ${haCasa() ? '' : '<b>Senza casa non puoi conservare la spesa</b> (solo acqua e sapone).'}</p>`;
  const items = PRODOTTI.filter(p => p.dove.includes(tipo));
  Object.entries(cat).forEach(([c, nome]) => { const its = items.filter(p => p.cat === c); if (!its.length) return; h += `<h3 style="margin-top:8px">${nome}</h3>`; its.forEach(p => h += act(`${p.nome} <span class="mut">${p.unit}</span>`, () => A.compra(p.id, tipo), `${Ar(prezzo(p.prezzo, tipo))} Ar · +${p.n} ${NOMI_DISP[p.key]}${S.disp[p.key] ? ' (hai ' + S.disp[p.key] + ')' : ''}`, !haCasa() && !p.sempre)); });
  const mob = MOBILI.filter(m => m.dove.includes(tipo)); if (mob.length) { h += `<h3 style="margin-top:8px">Oggetti per la casa</h3>`; mob.forEach(m => h += act(`${m.icon} ${m.nome}`, () => { const pr = prezzo(m.prezzo, tipo === 'mercato' ? 'mercato' : 'epicerie'); pr >= 100000 ? conferma('🛋️ Comprare?', `<b>${m.nome}</b> · ${m.eff}<br>💰 ${Ar(pr)} Ar`, () => A.mobile(m.id, tipo), 'Compra') : A.mobile(m.id, tipo); }, `${Ar(prezzo(m.prezzo, tipo === 'mercato' ? 'mercato' : 'epicerie'))} Ar · ${m.eff}`, ha(m.id))); }
  if (tipo === 'mercato') { h += `<h3 style="margin-top:8px">Bancarelle di cibo pronto</h3>`; PRONTO.gargote.slice(0, 6).forEach((c, i) => h += act(c.nome, () => A.pronto('gargote', i), `${Ar(prezzoPronto(c))} Ar · fame +${c.fame}${c.mattina ? ' · solo mattina' : ''}`)); }
  return h;
}
function vPronto(tipo) { const t = Q(S.q).tier; let h = `<p class="mut">${tipo === 'gargote' ? (t <= 1 ? 'Hotely popolare: panche di legno, piatti abbondanti e prezzi bassi.' : t <= 3 ? 'Hotely di quartiere: tovaglia di plastica, piatto del giorno alla lavagna.' : 'Hotely "chic" per impiegati e vazaha: stessi piatti, prezzi tripli.') : 'Servizio al tavolo, menù in francese.'} 20 min a pasto.</p><p class="mut">La tua fame ora: <b>${Math.round(S.bis.fame)}/100</b>${S.bis.fame >= 80 ? ' — sei già sazio/a' : S.bis.fame < 30 ? ' — hai molta fame' : ''}.</p>`; PRONTO[tipo].forEach((c, i) => h += act(c.nome, () => A.pronto(tipo, i), `${Ar(prezzoPronto(c))} Ar · fame +${c.fame}${c.umore ? ' · umore +' + c.umore : ''}${c.salute ? ' · salute ' + c.salute : ''}${c.rischio ? ' · rischio pancia' : ''}${c.mattina ? ' · solo mattina' : ''}`)); return h; }
function vBagni() { return act('🚽 WC', A.bagno, '5 min · 200 Ar') + act('🚿 Doccia', A.lavati, '30 min · 1.000 Ar · igiene +40'); }
function vBanca() { if (!S.banca) return act('🏦 Apri un conto BNI', A.apriConto, '10.000 Ar'); const id = 'bAmt'; return `<p>Saldo: <b class="money">${Ar(S.banca.saldo)} Ar</b>${S.banca.prestito > 0 ? ` · Debito: <b style="color:var(--bad)">${Ar(S.banca.prestito)} Ar</b> (rata ${Ar(S.banca.rata)})` : ''}</p><input id="${id}" type="number" placeholder="Importo in Ar" inputmode="numeric"><div class="grid2">${btn('Deposita', () => A.deposita(+$(id).value || 0), 'sec')}${btn('Preleva', () => A.preleva(+$(id).value || 0), 'sec')}</div>${btn('Chiedi un prestito (24 rate, 20%)', () => { const n = +$(id).value || 0; if (n <= 0) return toast('Inserisci l\'importo.'); conferma('🏦 Chiedere il prestito?', `Ricevi <b>${Ar(n)} Ar</b>. Restituisci ${Ar(n * 1.2)} Ar in 24 rate mensili da <b>${Ar(n * 1.2 / 24)} Ar</b>. Rate non pagate: mora 5%.`, () => A.prestito(n), 'Accetto'); }, 'sec')}`; }
function vAgenzia() {
  let h = `<p class="mut">Annunci di tutta la città. Affitto: 2 mesi di caparra. Vendita: pagamento intero (o prestito). I quartieri residenziali costano di più ma sono più sicuri e comodi.</p>`;
  const terreni = S.proprieta.filter(id => CASE.find(c => c.id === id).tipo === 'terreno');
  if (terreni.length && !S.cantiere) terreni.forEach(t => { const c = CASE.find(x => x.id === t); h += act(`🏗️ Costruisci una casa sul terreno a ${Q(c.q).nome}`, () => conferma('🏗️ Avviare il cantiere?', `Costruzione a ${Q(c.q).nome}: <b>${Ar(Math.round(28000000 * multCasa(Q(c.q)) / 500000) * 500000)} Ar</b>, 120 giorni. Alla fine ti trasferisci automaticamente.`, () => A.costruisci(t), 'Costruisci'), `${Ar(Math.round(28000000 * multCasa(Q(c.q)) / 500000) * 500000)} Ar · 120 giorni · comfort 7`); });
  if (S.cantiere) h += `<p>🏗️ Cantiere a ${Q(S.cantiere.q).nome}: mancano ${S.cantiere.gg} giorni.</p>`;
  const id = 'selQ'; const qsel = ui.agQ || 'tutti';
  h += `<select id="${id}" onchange="ui.agQ=this.value;render()"><option value="tutti">Tutti i quartieri</option>${QUARTIERI.map(q => `<option value="${q.id}" ${qsel === q.id ? 'selected' : ''}>${q.nome} (zona ${q.centro ? TIER_LBL[6] : TIER_LBL[q.tier]})</option>`).join('')}</select>`;
  const lista = CASE.filter(c => c.tipo !== 'strada' && c.tipo !== 'costruita' && c.id !== S.casa && !S.proprieta.includes(c.id) && (qsel === 'tutti' || c.q === qsel));
  ['Affitti', 'Vendite', 'Terreni'].forEach(sez => { const its = lista.filter(c => sez === 'Affitti' ? c.affitto : sez === 'Vendite' ? c.prezzo && c.tipo !== 'terreno' : c.tipo === 'terreno'); if (!its.length) return; h += `<h3 style="margin-top:8px">${sez}</h3>`; its.forEach(c => h += act(c.nome, () => conferma('🏘️ ' + (c.tipo === 'terreno' ? 'Comprare il terreno?' : c.prezzo ? 'Comprare casa?' : 'Affittare?'), `<img class="mimg" src="${ART_BASE}h/${artCasa(c)}.webp" alt="" onerror="this.remove()"><b>${c.nome}</b><br>${c.desc || ''}<br>${c.tipo === 'terreno' ? '💰 ' + Ar(c.prezzo) + ' Ar' : c.prezzo ? '💰 ' + Ar(c.prezzo) + ' Ar in un\'unica soluzione · comfort ' + c.comfort : '💰 caparra ' + Ar(c.affitto * 2) + ' Ar subito, poi ' + Ar(c.affitto) + ' Ar ogni 1° del mese · comfort ' + c.comfort}${haCasa() && c.tipo !== 'terreno' ? '<br><b>Lasci la tua casa attuale (' + casa().nome + ').</b>' : ''}`, () => A.affitta(c.id), c.tipo === 'terreno' ? 'Compra' : c.prezzo ? 'Compra' : 'Affitta'), c.tipo === 'terreno' ? `${Ar(c.prezzo)} Ar` : c.prezzo ? `ACQUISTO ${Ar(c.prezzo)} Ar · comfort ${c.comfort}` : `${Ar(c.affitto)} Ar/mese (caparra ${Ar(c.affitto * 2)}) · comfort ${c.comfort}`)); });
  if (S.proprieta.length) { h += `<h3 style="margin-top:8px">Le tue proprietà</h3>`; S.proprieta.forEach(id2 => { const c = CASE.find(x => x.id === id2); if (c.tipo !== 'terreno' && S.casa !== id2) h += act(`Trasferisciti: ${c.nome}`, () => { S.casa = id2; log(`Ti sei trasferito/a nella tua ${c.nome}.`); }); else h += `<div class="row"><span>${c.nome}</span><span class="mut">${S.casa === id2 ? 'ci vivi' : 'terreno'}</span></div>`; }); }
  return h;
}
function vOspedale() { return act('🩺 Visita medica', A.medico, '2h · 20.000 Ar · diagnosi + salute +5') + act('🏥 Ricovero (cura tutto)', () => conferma('🏥 Ricoverarti?', '<b>150.000 Ar</b> (anche dal conto), 24 ore in ospedale. Guarisci da tutto, salute +40.', A.ricovero, 'Ricoverami'), '24h · 150.000 Ar · guarigione, salute +40'); }
function vFarmacia() { let h = '<p class="mut">Farmaci con ricetta o consiglio del farmacista.</p>'; MEDICINE.forEach(m => h += act(m.nome, () => A.medicina(m.id), `${Ar(prezzo(m.prezzo, 'epicerie'))} Ar${m.cura.length ? ' · ' + m.cura.map(c => MALATTIE[c].nome).join('/') : ' · salute +8'}${S.medicine[m.id] ? ' · hai ' + S.medicine[m.id] : ''}`)); h += act('🦟 Zanzariera', () => A.mobile('zanzariera', 'epicerie'), '20.000 Ar · meno malaria', ha('zanzariera')); return h; }
function vAuto() { let h = `<p class="mut">${S.patente ? 'Hai la patente.' : 'Senza patente puoi comprare solo la bici.'} Veicolo attuale: ${S.veicolo ? VEICOLI.find(v => v.id === S.veicolo).nome : 'nessuno'}</p>`; VEICOLI.forEach(v => h += act(`${v.icon} ${v.nome}`, () => conferma('🚗 Comprare il veicolo?', `<img class="mimg" src="${ART_BASE}v/${v.id}.webp" alt="" onerror="this.remove()"><b>${v.nome}</b><br>💰 ${Ar(v.prezzo)} Ar · carburante ${Ar(v.costo)} Ar ogni 4 km${v.id !== 'bici' ? '<br>Serve la patente.' : ''}`, () => A.veicolo(v.id), 'Compra'), `${Ar(v.prezzo)} Ar · ${Ar(v.costo)} Ar/4 km`, S.veicoli.includes(v.id))); if (!S.patente) h += act('🚗 Scuola guida + esame patente', () => conferma('🚗 Scuola guida?', '3h e <b>250.000 Ar</b>. L\'esame può andare male (i soldi non tornano).', A.patente, 'Vai'), '3h · 250.000 Ar'); return h; }
function vScuola(poi) { let h = `<p class="mut">Titolo attuale: ${EDU[S.edu]}</p>`; if (S.scuola) { const s = SCUOLE.find(x => x.liv === S.scuola.liv); if (s.poi !== poi) return h + `<p>Sei iscritto/a a ${s.nome}: le lezioni sono ${s.poi === 'universita' ? 'all\'Università (Ambohipo)' : 'alla scuola'}.</p>`; h += `<p>${s.nome}: ${Math.round(S.scuola.giorni / S.scuola.tot * 100)}% completato</p>` + act('🎓 Frequenta le lezioni', A.studia, '4h · lun–ven · energia -12', giornoIdx() > 4); } else SCUOLE.filter(s => s.poi === poi).forEach(s => h += act(s.nome, () => conferma('🎓 Iscriversi?', `<b>${s.nome}</b><br>💰 ${Ar(s.costo)} Ar al mese per ${s.mesi} mesi (addebito il 1°)<br>📅 lezioni 4h, lun–ven. Se salti la retta vieni espulso/a.`, () => A.iscriviti(s.liv), 'Iscrivimi'), `${Ar(s.costo)} Ar/mese · ${s.mesi} mesi`, S.edu >= s.liv)); return h; }
function vSport() { const pal = S.loc === 'palestra'; return '<p class="mut">1h30 · energia -15 · fame -10 · umore +10 · igiene -12 (poi lavati!)</p>' + (pal ? act('🏋️ Palestra', () => A.sport('palestra'), `${Ar(prezzo(10000, 'mercato'))} Ar · fitness +2.5`) + act('🏊 Piscina', () => A.sport('piscina'), `${Ar(prezzo(15000, 'mercato'))} Ar · fitness +1.8`) : act('🏃 Corsa in pista', () => A.sport('corsa'), 'gratis · fitness +1.8') + act('⚽ Calcetto', () => A.sport('calcio'), '2.000 Ar · fitness +1.8 · conosci gente')); }
function vComune() { let h = `<p class="mut">Fedina penale: ${S.fedina ? S.fedina + ' precedenti' : 'pulita'}. ${S.sposato ? 'Stato civile: sposato/a.' : ''}</p>`; if (S.partner && png(S.partner).stato === 'promesso') { h += '<h3>Celebra il matrimonio</h3>' + [['semplice', 'Matrimonio semplice', 500000], ['media', 'Matrimonio medio (chiesa + sala)', 3000000], ['grande', 'Grande matrimonio (500 invitati)', 15000000]].map(([t, n, c]) => act(n, () => conferma('💒 ' + n + '?', `Sposi <b>${png(S.partner).nome} ${png(S.partner).cognome}</b>. Costo <b>${Ar(c)} Ar</b> (anche dal conto). Dura tutto il giorno.`, () => A.sposa(S.partner, t), 'Sì, lo voglio'), Ar(c) + ' Ar')).join(''); } h += act('Parla con la polizia', () => apriChat(S.png.find(p => p.ruolo === 'poliziotto').id)); return h; }
function vBar() { return act('🍻 Serata al bar', A.bar, `2h30 · ${Ar(prezzo(12000, 'mercato'))} Ar · umore +18 · sociale +`) + act('🍺 Una THB', () => A.pronto('gargote', 11), `20 min · ${Ar(prezzoPronto(PRONTO.gargote[11]))} Ar · umore +8`); }

function vCitta() {
  let h = `<h2>🗺️ Antananarivo</h2><p class="mut">Sei a <b>${Q(S.q).nome}</b>. Tocca un quartiere per vedere tempi e costi dei mezzi.</p>`;
  h += '<div class="qgrid">';
  [...QUARTIERI].sort((a, b) => distKm(S.q, a.id) - distKm(S.q, b.id)).forEach(q => { if (q.id === S.q) return; const tag = [haCasa() && casaQ() === q.id ? '🏠' : '', S.lavoro !== 'nulla' && lavoro().luogo === q.id ? '💼' : ''].filter(Boolean).join(' '); const id = 'qg' + q.id; setTimeout(() => { const e = $(id); if (e) e.onclick = () => { ui.modal = { tipo: 'vai', id: q.id }; render(); }; }); h += `<div class="qcard" id="${id}"><img src="${ART_BASE}q/${q.id}.webp" alt="" loading="lazy" onerror="this.style.visibility='hidden'"><div class="qc"><b>${q.nome}</b> ${tag}<span>${distKm(S.q, q.id)} km · zona ${q.centro ? TIER_LBL[6] : TIER_LBL[q.tier]}</span></div></div>`; });
  h += '</div>';
  return h;
}
function vPersone() {
  let h = '<h2>👥 Persone</h2>';
  if (S.figli.length) h += `<div class="card"><h3>Figli</h3>${S.figli.map(f => `<div class="row"><span>${f.gen === 'M' ? '👦' : '👧'} ${f.nome}</span><span class="mut">${f.eta} anni</span></div>`).join('')}</div>`;
  if (S.gravidanza) h += `<div class="card">🤰 Bambino in arrivo tra ${S.gravidanza.gg} giorni.</div>`;
  const ord = [...S.png].sort((a, b) => (b.id === S.partner) - (a.id === S.partner) || b.aff - a.aff);
  h += '<div class="card">' + ord.map(p => `<div class="person" onclick="apriChat('${p.id}')">${avatarHtml(p)}<div class="n"><b>${p.nome} ${p.cognome}</b> <span class="mut">${p.eta}</span><div class="mut">${p.mest || ruoloTxt(p)}${p.stato !== 'conoscente' ? ' · ' + STATO_LBL[p.stato] : ''} · ${trattiTxt(p)}</div><div class="mut">${presente(p) ? '🗣️ qui con te' : '📍 ' + doveSta(p).txt}${p.numero ? ' · 📱' : ''}</div><div class="heart"><b style="width:${p.aff}%"></b></div></div><span class="mut">${p.aff}</span></div>`).join('') + '</div>';
  return h;
}
function vMe() {
  let h = `<h2>🧍 ${S.nome}</h2><div class="card"><div class="row"><span>Età</span><b>${S.eta}</b></div><div class="row"><span>Istruzione</span><b>${EDU[S.edu]}</b></div><div class="row"><span>Lavoro</span><b>${lavoro().nome}${S.lavoro !== 'nulla' ? ' · ' + orarioLavoro(lavoro()) + ' ' + giorniTxt(lavoro()) : ''}</b></div><div class="row"><span>Casa</span><b>${casa().nome}</b></div><div class="row"><span>Contanti</span><b>${Ar(S.soldi)} Ar</b></div>${S.banca ? `<div class="row"><span>Banca</span><b>${Ar(S.banca.saldo)} Ar</b></div>` : ''}<div class="row"><span>Patrimonio</span><b>${Ar(S.soldi + (S.banca?.saldo || 0) - (S.banca?.prestito || 0) + S.proprieta.reduce((a, id) => a + CASE.find(c => c.id === id).prezzo, 0) + S.veicoli.reduce((a, id) => a + VEICOLI.find(v => v.id === id).prezzo * 0.7, 0))} Ar</b></div><div class="row"><span>Stato civile</span><b>${S.sposato ? 'Sposato/a' : S.partner ? 'Fidanzato/a' : 'Single'}</b></div><div class="row"><span>Giorni vissuti</span><b>${S.stat.gg}</b></div></div>`;
  h += `<div class="card"><h3>Abilità</h3>${Object.entries(S.skill).map(([k, v]) => `<div class="row"><span style="text-transform:capitalize">${SKILL_LBL[k]}</span><span class="mut">${Math.round(v)}</span></div>`).join('')}</div>`;
  h += `<div class="card"><h3>Cose che possiedi</h3><div>${S.mobili.map(id => { const m = MOBILI.find(x => x.id === id); return m ? `<span class="tag">${m.icon} ${m.nome}</span>` : ''; }).join('') || '<span class="mut">Niente.</span>'}</div><div style="margin-top:6px">${S.veicoli.map(id => { const v = VEICOLI.find(x => x.id === id); return `<span class="tag">${v.icon} ${v.nome}</span>`; }).join('')}</div><p class="mut">Dispensa: ${Object.entries(S.disp).filter(([k, v]) => v > 0).map(([k, v]) => `${NOMI_DISP[k]} ${v}`).join(', ') || 'vuota'}. Panni: ${S.pantoPuliti} puliti / ${S.pantoSporchi} sporchi / ${S.pantoBagnati} stesi. Medicine: ${Object.entries(S.medicine).filter(([k, v]) => v > 0).map(([k, v]) => MEDICINE.find(m => m.id === k).nome + ' x' + v).join(', ') || 'nessuna'}</p></div>`;
  h += `<div class="card"><h3>⚙️ Impostazioni AI</h3><p class="mut">Provider attivo: <b id="aiStato">…</b>. Inserisci una chiave gratuita Gemini o Groq (oppure OpenAI/Anthropic) per far parlare i personaggi con l'AI vera.</p><select id="sProv"><option value="auto">Automatico (prima i gratuiti)</option><option value="gemini">Gemini</option><option value="groq">Groq</option><option value="openai">OpenAI</option><option value="anthropic">Anthropic</option></select><input id="sGemini" placeholder="Google Gemini API key (AIza…) — gratuita"><input id="sGroq" placeholder="Groq API key (gsk_…) — gratuita"><input id="sOpenai" placeholder="OpenAI API key (sk-…)"><input id="sAnth" placeholder="Anthropic API key (sk-ant-…)"><input id="sModel" placeholder="Modello (opzionale, es. gpt-4o-mini)"><input id="sAdmin" type="password" placeholder="Chiave amministratore (solo se il server online la richiede)">${btn('Salva impostazioni', salvaImpostazioni, 'sec')}</div>`;
  if (S.ospite) h += `<div class="card"><h3>🛏️ Ospitalità</h3><p class="mut">Sei ospite di <b>${S.ospite.nome}</b> a ${Q(S.ospite.q).nome} per ancora <b>${S.ospite.gg}</b> notti. Dai una mano in casa per non pesare.</p></div>`;
  const deb = S.png.filter(p => p.debito); if (deb.length) h += `<div class="card"><h3>💵 Debiti con amici</h3>${deb.map(p => act(`Restituisci ${Ar(p.debito)} Ar a ${p.nome}`, () => A.restituisci(p.id), 'affinità +6')).join('')}</div>`;
  h += `<div class="card"><h3>Salvataggi</h3><p class="mut">La partita si salva da sola. Puoi anche esportarla in un file e ricaricarla da file.</p><p class="mut" style="font-size:13px">Il tuo codice partita: <b style="font-size:16px;letter-spacing:.06em">${codiceGiocatore()}</b><br>Scrivilo: su un altro telefono basta inserirlo nella schermata iniziale per riprendere la partita.</p>${btn('💾 Salva su file…', salvaSuFile, 'sec')} ${btn('📂 Carica da file…', () => { ui.modal = { tipo: 'caricafile' }; }, 'sec')} ${btn('🗑️ Nuova vita (cancella tutto)', () => conferma('🗑️ Cancellare la partita?', `Perdi <b>${S.nome}</b>, ${S.stat.gg} giorni di vita e tutto il patrimonio. Irreversibile.`, nuovaVita, 'Cancella tutto'), 'sec')}</div>`;
  setTimeout(caricaImpostazioni); return h;
}
function vDiario() { return `<h2>📜 Diario</h2><div class="card log">${S.log.map(e => `<div class="${e.tipo}"><span class="mut">${e.d}</span> · ${esc(e.t)}</div>`).join('')}</div>`; }
async function caricaImpostazioni() { try { const j = await (await fetch('/api/settings')).json(); if ($('aiStato')) { $('aiStato').textContent = j.active === 'none' ? 'motore interno (nessuna chiave)' : j.active; $('sProv').value = j.provider; $('sModel').value = j.model || ''; if (j.hasGemini) $('sGemini').value = '••••'; if (j.hasGroq) $('sGroq').value = '••••'; if (j.hasOpenai) $('sOpenai').value = '••••'; if (j.hasAnthropic) $('sAnth').value = '••••'; } } catch (e) { if ($('aiStato')) $('aiStato').textContent = 'motore interno (nessun server)'; } }
async function salvaImpostazioni() { const b = { provider: $('sProv').value, model: $('sModel').value, geminiKey: $('sGemini').value, groqKey: $('sGroq').value, openaiKey: $('sOpenai').value, anthropicKey: $('sAnth').value, adminKey: $('sAdmin') ? $('sAdmin').value : '' }; try { const j = await (await fetch('/api/settings', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(b) })).json(); toast('AI: ' + (j.active === 'none' ? 'motore interno' : j.active)); } catch (e) { toast('Errore salvataggio'); } }

/* ---------- MODALI ---------- */
// Ritratto cartoon del PNG: scelto per genere ed età, stabile per id.
function ritratto(p) { const g = p.gen === 'M' ? 'm' : 'f'; const pool = p.eta < 30 ? [1, 2] : p.eta < 55 ? [3, 4] : [5]; let hsh = 0; for (const ch of String(p.id)) hsh = (hsh * 31 + ch.charCodeAt(0)) >>> 0; return `${ART_BASE}n/${g}${pool[hsh % pool.length]}.webp`; }
function avatarHtml(p) { return `<div class="avatar"><img src="${ritratto(p)}" alt="" onerror="this.remove()"><span>${p.gen === 'M' ? '👨' : '👩'}</span></div>`; }
function apriChat(id) { ui.modal = { tipo: 'chat', id }; render(); }
function renderModal() {
  let e = document.querySelector('.modal'); if (e) e.remove(); if (!ui.modal) return;
  e = document.createElement('div'); e.className = 'modal'; document.body.appendChild(e);
  e.addEventListener('click', ev => { if (ev.target === e && ui.modal && ui.modal.tipo !== 'morte') { ui.modal = null; render(); } });
  const M = ui.modal;
  if (M.tipo === 'vai') {
    const q = Q(M.id); const v = S.veicolo && VEICOLI.find(x => x.id === S.veicolo); const lav = lavoro();
    const riga = (icona, nome, mezzo) => { const e2 = stimaViaggio(M.id, mezzo); if (!e2) return ''; return act(`${icona} ${nome} <span class="mut">→ arrivi alle</span> <b>${e2.arrivo}</b>`, () => conferma(`${icona} Andare a ${q.nome}?`, `<img class="mimg" src="${ART_BASE}v/${mezzo === 'proprio' ? S.veicolo : mezzo}.webp" alt="" onerror="this.remove()">${nome} da ${Q(S.q).nome} a <b>${q.nome}</b><br>⏱ ${e2.min} min${e2.traffico ? ' (traffico)' : ''} → arrivo alle <b>${e2.arrivo}</b><br>💰 ${e2.costo ? Ar(e2.costo) + ' Ar' : 'gratis'} · ⚡ energia -${e2.energia}${e2.igiene ? ' · 🧼 igiene -' + e2.igiene : ''}`, () => vaiA(M.id, mezzo), 'Parti'), `⏱ ${e2.min} min${e2.traffico ? ' 🚦' : ''} · ${e2.costo ? Ar(e2.costo) + ' Ar' : 'gratis'} · ⚡-${e2.energia}${e2.igiene ? ' · 🧼-' + e2.igiene : ''}${e2.umore ? ' · 🙂' + (e2.umore > 0 ? '+' : '') + e2.umore : ''}`, S.soldi < e2.costo); };
    let extra = ''; if (lav.id !== 'nulla' && lav.luogo === M.id) extra = `<p class="mut">⏰ Turno ${orarioLavoro(lav)} (${giorniTxt(lav)}). Arriva prima delle ${hh(lav.inizio)}.</p>`;
    e.innerHTML = `<div class="box"><img class="mimg" src="${ART_BASE}q/${q.id}.webp" alt="" onerror="this.remove()"><h3>📍 ${q.nome}</h3><p class="mut">${q.desc}</p><p class="mut">${Q(S.q).nome} → ${q.nome} · ${distKm(S.q, M.id)} km · ora ${oraStr()}${inTraffico('taxibe') ? ' · 🚦 ora di punta: mezzi +70%' : ''}</p>${extra}${riga('🚶', 'A piedi', 'piedi')}${riga('🚌', 'Taxi-be', 'taxibe')}${riga('🚕', 'Taxi', 'taxi')}${v ? riga(v.icon, v.nome, 'proprio') : ''}<p class="mut" style="margin-top:8px">Luoghi: ${q.poi.map(p => POI[p].icon + ' ' + POI[p].nome.split(' (')[0]).join(' · ')}</p></div>`;
    return;
  }
  if (M.tipo === 'bucato') {
    const j = lavorettiOggi()[M.idx]; const b = j.bucato; const q = Q(S.q); const bidoni = Math.ceil(b.capi / 8); const prezzoBidone = q.tier >= 4 ? 200 : 100;
    e.innerHTML = `<div class="box"><h3>🫧 Bucato per una famiglia a ${q.nome}</h3><p class="mut">${b.capi} capi (lenzuola, camicie, pantaloni). Paga pattuita <b>${Ar(j.paga)} Ar</b>, ${j.ore}h di lavoro dalle ${hh(j.inizio)}.</p>
    ${b.cortile ? act('🏡 Lavare a casa loro, nel cortile', () => { A.lavoretto(M.idx, 'casa'); }, `bassin e acqua della famiglia · ${j.ore}h · nessun costo`) : '<p class="mut">🏡 La famiglia <b>non ha un cortile</b> dove farti lavare: devi portare i panni via.</p>'}
    ${act('🚰 Ritirare i panni e lavare al bassin pubblico', () => { A.lavoretto(M.idx, 'pubblico'); }, `+40 min ritiro/consegna · ${bidoni} bidoni d'acqua alla pompa (${Ar(bidoni * prezzoBidone)} Ar) · rischio attesa per un posto${ora() >= 8 && ora() <= 11 ? ' (ora di punta!)' : ''} · rischio capo smarrito`)}
    <p class="mut" style="margin-top:8px">Al bassin pubblico si paga l'acqua a bidone (${prezzoBidone} Ar) alla pompa JIRAMA; la mattina è pieno di lavandaie e bisogna aspettare il turno. Poi i panni vanno riconsegnati piegati a casa del cliente.</p>${btn('Annulla', () => { ui.modal = null; }, 'sec')}</div>`;
    return;
  }
  if (M.tipo === 'elemosina') {
    const q = Q(S.q); const h = ora(); const mom = h < 7 || h >= 20 ? 'Di notte passa pochissima gente.' : h >= 11 && h <= 14 ? 'Ora di pranzo: molta gente in giro.' : 'Traffico normale di passanti.';
    const stima = { 1: 'circa 1 passante su 7 lascia 200–1.000 Ar', 2: 'circa 1 su 10 lascia 500–2.000 Ar', 3: 'circa 1 su 16 lascia 1.000–5.000 Ar', 4: 'circa 1 su 28 lascia 2.000–10.000 Ar; i guardiani delle ville possono cacciarti', 5: 'circa 1 su 45 lascia 5.000–20.000 Ar; quasi solo vazaha e guardiani ovunque' }[q.tier];
    e.innerHTML = `<div class="box"><h3>🤲 Chiedere l'elemosina a ${q.nome}</h3><p class="mut">${stima}. ${mom} ${S.bis.igiene < 30 ? 'Sembri davvero bisognoso/a: più gente si impietosisce.' : S.bis.igiene > 70 ? 'Sei troppo pulito/a e ben messo/a: la gente non ci crede.' : ''}${S.flags.elemosinaOggi === now().toDateString() + q.id ? ' <b>Oggi hai già chiesto qui: resa dimezzata.</b>' : ''}</p><p class="mut">Ogni ora: umore -4, igiene -3. Se un conoscente ti vede, perdi affinità.</p>${[1, 2, 4, 8].map(o => act(`${o}h`, () => { A.elemosina(o); ui.modal = null; }, `fino alle ${String((h + o) % 24).padStart(2, '0')}:${String(now().getMinutes()).padStart(2, '0')}`)).join('')}</div>`;
    return;
  }
  if (M.tipo === 'salvafile') {
    const ios = /iPhone|iPad|iPod/.test(navigator.userAgent); const picker = !!window.showSaveFilePicker; const share = !!navigator.share;
    e.innerHTML = `<div class="box"><h3>💾 Salva su file</h3><p class="mut" style="font-size:13px;line-height:1.5">File: <b>${M.nome}</b><br>${picker ? 'Scegli cartella e nome nella finestra che si apre.' : ios ? 'Su iPhone la cartella si sceglie dal foglio di condivisione: tocca <b>Condividi</b> → <b>Salva su File</b>. Con <b>Scarica</b> il file finisce in File → Download.' : 'Con <b>Scarica</b> il browser lo mette nella cartella Download.'}</p>
    ${picker ? btn('📁 Scegli dove salvare…', () => salvaConPicker(M.data, M.nome)) : ''}
    ${share ? btn('📤 Condividi → Salva su File', () => condividiFile(M.data, M.nome), picker ? 'sec' : 'pri') : ''}
    ${btn('⬇️ Scarica il file', () => scaricaFile(M.data, M.nome), 'sec')}
    ${btn('📋 Copia il salvataggio (testo)', () => copiaSalvataggio(M.data), 'sec')}
    <textarea id="svTxt" readonly style="position:absolute;left:-9999px;height:1px">${M.data.replace(/</g, '&lt;')}</textarea>
    ${btn('Chiudi', () => { ui.modal = null; }, 'link')}</div>`;
    return;
  }
  if (M.tipo === 'codice') {
    e.innerHTML = `<div class="box"><h3>🔑 Codice partita</h3><p class="mut" style="font-size:13px;line-height:1.5">Codice di questo telefono: <b>${codiceGiocatore()}</b><br>Inserisci il codice di un'altra partita per riprenderla qui (lo trovi nella scheda Io → Salvataggi).</p><input id="pidIn" placeholder="ES. ABCD-EFGH" autocapitalize="characters" autocomplete="off" style="text-transform:uppercase;letter-spacing:.08em">${btn('Riprendi la partita', () => { if (!cambiaCodice($('pidIn').value)) return; carica().then(s => { if (s) { S = s; render(); toast('Bentornato/a, ' + S.nome + '!'); } else { toast('Nessuna partita con questo codice.'); } }); })}${btn('Annulla', () => { ui.modal = null; }, 'link')}</div>`;
    return;
  }
  if (M.tipo === 'caricafile') {
    e.innerHTML = `<div class="box"><h3>📂 Carica salvataggio</h3><p class="mut" style="font-size:13px">La partita attuale verrà sostituita.</p>${btn('📂 Scegli un file…', caricaDaFile)}<p class="mut" style="font-size:13px;margin-top:10px">Oppure incolla qui il testo copiato:</p><textarea id="ldTxt" placeholder="{…}" style="width:100%;height:80px;background:#1f2733;color:var(--txt);border:1px solid #2a3442;border-radius:10px;padding:8px;font-size:12px"></textarea>${btn('Importa il testo', importaTesto, 'sec')}${btn('Annulla', () => { ui.modal = null; }, 'link')}</div>`;
    return;
  }
  if (M.tipo === 'esito') {
    e.innerHTML = `<div class="box" style="border-top:4px solid ${M.ok ? 'var(--ok)' : 'var(--bad)'}"><h3>${M.titolo}</h3>${M.html}${btn(M.ok ? 'Perfetto!' : 'Capito', () => { ui.modal = null; }, M.ok ? 'pri' : 'sec')}</div>`;
    return;
  }
  if (M.tipo === 'conferma') {
    e.innerHTML = `<div class="box"><h3>${M.titolo}</h3><p style="font-size:14px;line-height:1.5">${M.testo}</p>${btn('✅ ' + M.okLabel, () => { ui.modal = null; M.fn(); salva(); })}${btn('Annulla', () => { ui.modal = null; }, 'sec')}</div>`;
    return;
  }
  if (M.tipo === 'dormi') {
    const l = lavoro(); const tt = minutiFinoTurno(); const ost = !!M.ostello; const osp = !!M.ospite; const strada = !haCasa() && !ost && !osp; const DO = (h, m) => osp ? A.dormiOspite(h) : ost ? A.ostello(h, m) : A.dormi(h, m);
    const riga = (label, min, motivo) => { const st = stimaSonno(min, ost); const sv = new Date(now().getTime() + min * 60000); return act(`${label} <span class="mut">→ sveglia</span> <b>${String(sv.getHours()).padStart(2, '0')}:${String(sv.getMinutes()).padStart(2, '0')}</b>`, () => { DO(min / 60, motivo); ui.modal = null; }, `${durata(min)} · ⚡${st.energia >= 0 ? '+' : ''}${st.energia} · 🍚${st.fame} · 🙂${st.umore >= 0 ? '+' : ''}${st.umore}${ost ? ' · ' + Ar(15000 * Math.ceil(min / 720)) + ' Ar' : ''}`); };
    let h = `<div class="box"><h3>😴 Dormi${ost ? ' in ostello' : strada ? ' per strada' : ''}</h3><p class="mut">Ora sono le <b>${oraStr()}</b>. Recuperi <b>${ost ? 12 : 8 + casaComfortSonno()} energia/ora</b> (${ost ? 'letto pulito, doccia inclusa: igiene +30 · 15.000 Ar ogni 12h' : strada ? 'per terra' : casa().nome.split(' a ')[0] + (ha('letto') ? ' + letto' : ha('materasso') ? ' + materasso' : ' senza materasso: -10')}). Sotto 5h: umore -6, salute -1. Oltre 10h: intontito/a.</p>`;
    if (l.id !== 'nulla' && tt !== null) { const pre = { piedi: 0 }[0]; const sveglia = Math.max(30, tt - 90); h += riga(`⏰ Sveglia 1h30 prima del turno (${hh(l.inizio)})`, sveglia, 'con la sveglia per il lavoro'); }
    if (S.scuola && (giornoIdx() < 4 || giornoIdx() === 6)) h += riga('🎓 Sveglia alle 6:30 per le lezioni', minutiFinoA(6, 30), 'per la scuola');
    h += `<div class="grid2">${[120, 240, 360, 480].map(m => riga(durata(m), m)).join('')}</div>`;
    h += `<h3 style="margin-top:8px">Sveglia a un orario preciso</h3><div style="display:flex;gap:6px"><input id="sH" type="number" min="0" max="23" placeholder="ore" inputmode="numeric" style="width:50%"><input id="sM" type="number" min="0" max="59" placeholder="min" inputmode="numeric" style="width:50%"></div>${btn('Dormi fino a quell\'ora', () => { const H = +$('sH').value, Mn = +$('sM').value || 0; if ($('sH').value === '') return toast('Inserisci l\'ora della sveglia.'); DO(minutiFinoA(clamp(H, 0, 23), clamp(Mn, 0, 59)) / 60, 'fino alle ' + String(H).padStart(2, '0') + ':' + String(Mn).padStart(2, '0')); ui.modal = null; }, 'sec')}`;
    h += `<h3 style="margin-top:8px">Durata precisa</h3><div style="display:flex;gap:6px"><input id="zH" type="number" min="0" placeholder="ore" inputmode="numeric" style="width:50%"><input id="zM" type="number" min="0" max="59" placeholder="min" inputmode="numeric" style="width:50%"></div>${btn('Dormi questa durata', () => { const m = (+$('zH').value || 0) * 60 + (+$('zM').value || 0); if (m <= 0) return toast('Inserisci una durata.'); DO(m / 60); ui.modal = null; }, 'sec')}</div>`;
    e.innerHTML = h; return;
  }
  if (M.tipo === 'aspetta') {
    const l = lavoro(); const tt = minutiFinoTurno(); const fatto = S.flags.lavoratoOggi === now().toDateString();
    let h = `<div class="box"><h3>⏳ Aspetta</h3><p class="mut">Ora sono le <b>${oraStr()}</b>. Aspettando recuperi ~8 energia/ora.</p>`;
    if (l.id !== 'nulla' && tt !== null && !fatto) h += act(`💼 Fino all'inizio del turno (${hh(l.inizio)})`, () => { A.aspetta(tt, 'fino all\'inizio del turno'); ui.modal = null; if (S.loc === 'lavoro') A.lavora(); }, `${durata(tt)} · ${S.loc === 'lavoro' ? 'poi timbri subito' : 'arrivi giusto in orario se sei già sul posto'}`);
    if (S.scuola && giornoIdx() < 5) h += act('🎓 Fino alle 8:00 (lezioni)', () => { A.aspetta(minutiFinoA(8), 'fino alle lezioni'); ui.modal = null; }, durata(minutiFinoA(8)));
    h += `<div class="grid2">${[15, 30, 60, 120, 180, 240].map(m => act(durata(m), () => { A.aspetta(m); ui.modal = null; })).join('')}</div>`;
    h += `<h3 style="margin-top:8px">Fino a un orario preciso</h3><div style="display:flex;gap:6px;align-items:center"><input id="wH" type="number" min="0" max="23" placeholder="ore" inputmode="numeric" style="width:50%"><input id="wM" type="number" min="0" max="59" placeholder="min" inputmode="numeric" style="width:50%"></div>${btn('Aspetta fino a quell\'ora', () => { const H = +$('wH').value, Mn = +$('wM').value || 0; if (isNaN(H) || $('wH').value === '') return toast('Inserisci l\'ora.'); A.aspetta(minutiFinoA(clamp(H, 0, 23), clamp(Mn, 0, 59)), 'fino alle ' + String(H).padStart(2, '0') + ':' + String(Mn).padStart(2, '0')); ui.modal = null; }, 'sec')}`;
    h += `<h3 style="margin-top:8px">Durata precisa</h3><div style="display:flex;gap:6px"><input id="dH" type="number" min="0" placeholder="ore" inputmode="numeric" style="width:50%"><input id="dM" type="number" min="0" max="59" placeholder="min" inputmode="numeric" style="width:50%"></div>${btn('Aspetta questa durata', () => { const m = (+$('dH').value || 0) * 60 + (+$('dM').value || 0); if (m <= 0) return toast('Inserisci una durata.'); A.aspetta(m); ui.modal = null; }, 'sec')}</div>`;
    e.innerHTML = h; return;
  }
  if (M.tipo === 'morte') { e.onclick = null; e.innerHTML = `<div class="box" style="border-top:4px solid var(--bad)"><h3>☠️ Sei morto/a</h3><p>La tua vita ad Antananarivo si è conclusa a ${S.eta} anni dopo ${S.stat.gg} giorni. Patrimonio finale: ${Ar(S.soldi + (S.banca?.saldo || 0))} Ar.</p><button class="pri" id="bNuovaVita" style="width:100%">🌅 Nuova vita</button></div>`; const nb = $('bNuovaVita'); if (nb) nb.onclick = ev => { ev.stopPropagation(); nuovaVita(); }; return; }
  if (M.tipo === 'chat') {
    const p = png(M.id); if (!p) { ui.modal = null; return; }
    const noto = S.png.includes(p); const qui = presente(p); const tel = puoTelefonare(p); ui.canale = qui ? 'persona' : tel ? 'tel' : 'no'; const d = doveSta(p);
    const romantic = p.eta >= 18 && !['capo', 'poliziotto', 'medico', 'professore', 'bancario'].includes(p.ruolo); const ga = giornoAnno(now());
    let azioni = qui ? act('☕ Esci insieme', () => A.uscita(p.id), '3h · 15.000 Ar · affinità +8') + act('🎁 Regalo: fiori', () => A.regalo(p.id, 'fiori'), '30 min · 5.000 Ar · affinità +5') + act('🎁 Regalo: gioiello', () => A.regalo(p.id, 'gioiello'), '30 min · 200.000 Ar · affinità +20') : tel ? act('☕ Invita a uscire (per telefono)', () => A.uscita(p.id), '3h · 15.000 Ar · affinità +8 · vi vedete a ' + Q(S.q).nome) : '';
    if (p.debito) azioni = act(`💵 Restituisci ${Ar(p.debito)} Ar`, () => A.restituisci(p.id), 'affinità +6') + azioni;
    if (p.comp === ga) azioni += act('🎂 Festeggia il suo compleanno', () => A.compleannoPNG(p.id), '3h · 20.000 Ar · affinità +12');
    if (romantic && !S.partner && p.stato === 'conoscente') azioni += act('💕 Chiedi di fidanzarvi', () => conferma('💕 Dichiararti?', `Chiedi a <b>${p.nome}</b> di fidanzarvi. Se rifiuta perdi 10 di affinità.`, () => A.fidanzati(p.id), 'Dichiarati'), `affinità ${p.aff} (serve 55) · attrazione ${p.rom || 0} (serve 25)`);
    if (p.id === S.partner) { if (p.stato === 'fidanzato') azioni += act('💍 Proposta di matrimonio', () => conferma('💍 Chiedere la mano?', `Anello: <b>200.000 Ar</b>. Poi il matrimonio si celebra al Comune (Anosy).`, () => A.proponi(p.id), 'Proponi'), 'anello 200.000 Ar'); if (p.stato === 'promesso') azioni += '<p class="mut">Vai al Comune (Anosy) per celebrare il matrimonio.</p>'; if (['sposato', 'fidanzato'].includes(p.stato)) azioni += act('👶 Provate ad avere un figlio', () => conferma('👶 Un figlio?', `Con ${p.nome}. Un bambino costa ~60.000 Ar/mese e nasce dopo 9 mesi. Probabilità 50%.`, () => A.figlio(p.id), 'Proviamo')); azioni += act('💔 Lascia', () => conferma('💔 Lasciare ' + p.nome + '?', S.sposato ? '<b>Divorzio:</b> perdi metà dei risparmi in banca e umore -20.' : 'Umore -20. Non si torna indietro facilmente.', () => A.lascia(p.id), 'Lascio')); }
    if (!noto) azioni = '<p class="mut">Prima fate due chiacchiere.</p>'; else { if (!p.numero && ui.canale !== 'no') azioni = act('📱 Chiedi il numero', () => A.chiediNumero(p.id), 'se ti sta simpatico/a te lo dà') + azioni; if (!qui && d.q === S.q && d.poi === 'casa') azioni = act('🚪 Vai a casa sua', () => A.visita(p.id), '15 min') + azioni; if (!qui && d.q !== S.q) azioni = act(`🚌 Vai a ${Q(d.q).nome}`, () => { ui.modal = { tipo: 'vai', id: d.q }; render(); }, d.txt) + azioni; }
    const statoCanale = qui ? `<span class="pill">🗣️ di persona</span>` : tel ? `<span class="pill">📞 al telefono</span>` : `<span class="pill" style="opacity:.7">📍 ${d.txt}${p.numero ? ' · serve uno smartphone' : noto ? ' · non hai il suo numero' : ''}</span>`;
    e.innerHTML = `<div class="box"><div class="person">${avatarHtml(p)}<div class="n"><b>${noto ? p.nome + ' ' + p.cognome : (p.gen === 'M' ? 'Sconosciuto' : 'Sconosciuta')}</b>, ${p.eta} <div class="mut">${p.mest || ruoloTxt(p)}${noto ? ' · ' + p.quartiere + ' · ' + trattiTxt(p) : ''}</div>${statoCanale}<div class="heart"><b style="width:${p.aff}%"></b></div></div><span class="mut">${p.aff}</span></div>
    <div class="chat" id="chatBox">${p.storia.slice(-8).map(m => `<div class="msg ${m.role === 'user' ? 'me' : 'them'}">${esc(m.content)}</div>`).join('') || '<div class="mut">Inizia tu la conversazione. "Salama!" apre tutte le porte.</div>'}</div>
    ${ui.canale === 'no' ? '<p class="mut">Non è qui: raggiungilo/a, oppure chiama/scrivi se hai il suo numero e uno smartphone.</p>' : '<div style="display:flex;gap:6px"><input id="chatIn" placeholder="' + (ui.canale === 'tel' ? 'Messaggio o chiamata…' : 'Scrivi qualcosa…') + '" autocomplete="off"><button class="sec" id="chatSend">➤</button></div>'}
    <details style="margin-top:8px"><summary class="mut">Azioni con ${p.nome}</summary>${azioni}</details></div>`;
    const send = async () => { const t = $('chatIn').value.trim(); if (!t) return; $('chatIn').value = ''; const box = $('chatBox'); box.innerHTML += `<div class="msg me">${esc(t)}</div><div class="msg them mut" id="typing">…</div>`; box.scrollTop = 1e9; const r = await parla(p, t); const ty = $('typing'); if (ty) { ty.textContent = r; ty.classList.remove('mut'); ty.id = ''; } box.scrollTop = 1e9; renderHeader(); salva(); };
    if ($('chatSend')) { $('chatSend').onclick = send; $('chatIn').onkeydown = ev => { if (ev.key === 'Enter') send(); }; }
    $('chatBox').scrollTop = 1e9;
  }
}

/* ---------- AVVIO ---------- */
window.apriChat = apriChat; window.ui = ui; window.render = render; window.carica = carica; window.toast = toast;
(async () => { const s = await carica(); if (s) S = s; render(); })();
