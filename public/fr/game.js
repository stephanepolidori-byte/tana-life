/* ===================== TANA LIFE v2 — motore di gioco ===================== */
'use strict';
const $ = id => document.getElementById(id);
const rnd = (a, b) => Math.floor(Math.random() * (b - a + 1)) + a;
const pick = a => a[Math.floor(Math.random() * a.length)];
const clamp = (v, a = 0, b = 100) => Math.max(a, Math.min(b, v));
const Ar = n => Math.round(n).toLocaleString('fr-FR');
const GIORNI = ['Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi', 'Dimanche'];
const GG = ['lun', 'mar', 'mer', 'jeu', 'ven', 'sam', 'dim'];
const MESI = ['janv', 'févr', 'mars', 'avr', 'mai', 'juin', 'juil', 'août', 'sept', 'oct', 'nov', 'déc'];
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
  { id: 'analakely', nome: 'Analakely', tier: 2, centro: true, x: 0, y: 0, desc: 'Le cœur de la ville : pavillons du marché, Avenue de l\'Indépendance, bureaux et banques. Y habiter coûte cher.', poi: ['mercato', 'epicerie', 'bagni', 'gargote', 'annunci', 'banca', 'agenzia', 'chiesa', 'scuola', 'farmacia'] },
  { id: 'isotry', nome: 'Isotry', tier: 1, x: -0.8, y: -0.3, desc: 'Quartier populaire près de la gare : bruyant, pas cher, attention le soir.', poi: ['farmacia', 'mercato', 'epicerie', 'bagni', 'gargote', 'chiesa'] },
  { id: '67ha', nome: '67 Ha', tier: 1, x: -1.5, y: 0.3, desc: 'Grands immeubles populaires, marché animé, beaucoup de taxi-be.', poi: ['farmacia', 'mercato', 'epicerie', 'bagni', 'gargote', 'minimarket'] },
  { id: 'anosy', nome: 'Anosy', tier: 2, x: 0.2, y: -1.0, desc: 'Le lac aux jacarandas, la Commune, le stade de Mahamasina, les ministères.', poi: ['farmacia', 'epicerie', 'bagni', 'gargote', 'comune', 'stadio', 'lago'] },
  { id: 'ampefiloha', nome: 'Ampefiloha', tier: 3, x: -0.5, y: -1.0, desc: 'Hôpital HJRA, cités résidentielles, pharmacies.', poi: ['epicerie', 'bagni', 'gargote', 'ospedale', 'farmacia', 'minimarket'] },
  { id: 'antanimena', nome: 'Antanimena', tier: 3, x: 0.3, y: 1.2, desc: 'Banques, agences, bars et restaurants. Quartier d\'affaires.', poi: ['farmacia', 'epicerie', 'bagni', 'gargote', 'ristorante', 'banca', 'agenzia', 'bar', 'minimarket'] },
  { id: 'behoririka', nome: 'Behoririka', tier: 2, centro: true, x: 0.6, y: 0.8, desc: 'Plein centre : marché des tissus et des brochettes, Chinois et grossistes. Loyers de centre-ville.', poi: ['farmacia', 'mercato', 'epicerie', 'bagni', 'gargote', 'minimarket'] },
  { id: 'tsaralalana', nome: 'Tsaralalana', tier: 3, x: -0.2, y: 0.4, desc: 'Pharmacies, cybers, petits hôtels, communauté indo-pakistanaise.', poi: ['epicerie', 'bagni', 'gargote', 'ristorante', 'farmacia', 'bar'] },
  { id: 'andravoahangy', nome: 'Andravoahangy', tier: 1, x: 1.5, y: 1.0, desc: 'Le marché le plus grand et le plus chaotique de la ville. Tout coûte moins cher.', poi: ['farmacia', 'mercato', 'epicerie', 'bagni', 'gargote'] },
  { id: 'ankorondrano', nome: 'Ankorondrano', tier: 4, x: 0.8, y: 2.5, desc: 'Zone franche, Shoprite, concessionnaires, bureaux modernes.', poi: ['farmacia', 'epicerie', 'bagni', 'gargote', 'ristorante', 'super', 'auto', 'agenzia', 'palestra', 'zonafranca'] },
  { id: 'ivandry', nome: 'Ivandry', tier: 5, x: 1.8, y: 3.5, desc: 'Villas avec gardiens, ambassades, supermarchés pour vazaha.', poi: ['farmacia', 'epicerie', 'gargote', 'ristorante', 'super', 'agenzia', 'palestra'] },
  { id: 'ambatobe', nome: 'Ambatobe', tier: 5, x: 3.5, y: 3.0, desc: 'Colline résidentielle, Lycée français, bon air.', poi: ['farmacia', 'epicerie', 'minimarket', 'ristorante'] },
  { id: 'ambohipo', nome: 'Ambohipo', tier: 2, x: 2.5, y: -1.0, desc: 'La cité universitaire : étudiants, gargotes à 3.000 Ar, photocopies.', poi: ['farmacia', 'mercato', 'epicerie', 'bagni', 'gargote', 'universita', 'scuola'] },
  { id: 'itaosy', nome: 'Itaosy', tier: 1, x: -4.0, y: -1.5, desc: 'Périphérie ouest : terrains, rizières, maisons en briques. Loin de tout.', poi: ['farmacia', 'mercato', 'epicerie', 'bagni', 'gargote', 'chiesa'] },
  { id: 'andoharanofotsy', nome: 'Andoharanofotsy', tier: 2, x: 0.5, y: -6.0, desc: 'Périphérie sud sur la RN7 : en expansion, terrains et nouvelles villas.', poi: ['farmacia', 'mercato', 'epicerie', 'bagni', 'gargote', 'minimarket'] },
  { id: 'ivato', nome: 'Ivato', tier: 2, x: -4.5, y: 11.0, desc: 'L\'aéroport international, des hôtels, le marché de l\'artisanat. Loin, mais le travail tourne autour des vols.', poi: ['farmacia', 'mercato', 'epicerie', 'bagni', 'gargote', 'ristorante', 'aeroporto', 'chiesa'] },
  { id: 'analamahitsy', nome: 'Analamahitsy', tier: 3, x: 3.0, y: 4.5, desc: 'Nord-est résidentiel : familles de la classe moyenne, écoles privées, jardins et taxi-be vers Ivandry.', poi: ['mercato', 'epicerie', 'bagni', 'gargote', 'minimarket', 'scuola', 'farmacia', 'chiesa'] },
  { id: 'alasora', nome: 'Alasora', tier: 1, x: 3.5, y: -4.0, desc: 'Commune populaire au sud-est, derrière la voie ferrée : briquetiers, rizières, maisons en briques rouges. Vie simple, prix bas.', poi: ['farmacia', 'mercato', 'epicerie', 'bagni', 'gargote', 'fornace', 'chiesa'] },
  { id: 'anosibe', nome: 'Anosibe', tier: 1, x: -1.0, y: -2.2, desc: 'Le marché de gros : camions de riz et de charbon dès 4 h du matin, boue à la saison des pluies.', poi: ['farmacia', 'mercato', 'epicerie', 'bagni', 'gargote', 'grossista'] },
  { id: 'tanjombato', nome: 'Tanjombato', tier: 2, x: 0.0, y: -4.5, desc: 'Sud sur la RN7 : usines, dépôts, Jumbo Score. Quartier d\'ouvriers et de camionneurs.', poi: ['farmacia', 'epicerie', 'bagni', 'gargote', 'super', 'minimarket', 'fabbrica'] },
  { id: 'ambanidia', nome: 'Ambanidia', tier: 2, x: 0.9, y: -0.6, desc: 'Les escaliers de la haute ville vers le Rova : maisons anciennes, ruelles, églises et une vue incroyable.', poi: ['farmacia', 'epicerie', 'bagni', 'gargote', 'chiesa', 'rova'] },
  { id: 'ambohimanarina', nome: 'Ambohimanarina', tier: 1, x: -2.8, y: 4.0, desc: 'Nord-ouest populaire sur la route de l\'aéroport : lots, familles nombreuses, marché de quartier.', poi: ['farmacia', 'mercato', 'epicerie', 'bagni', 'gargote', 'chiesa', 'scuola'] },
  { id: 'talatamaty', nome: 'Talatamaty', tier: 3, x: -3.5, y: 8.0, desc: 'Entre Tana et Ivato : villas neuves, entrepôts, marché du mardi. En pleine croissance.', poi: ['farmacia', 'mercato', 'epicerie', 'bagni', 'gargote', 'minimarket', 'agenzia'] },
];
const Q = id => QUARTIERI.find(q => q.id === id);
const POI = {
  mercato: { nome: 'Marché', icon: '🧺', desc: 'Kapoaka, toko, prix bas, beaucoup de monde.' },
  epicerie: { nome: 'Épicerie', icon: '🏪', desc: 'La petite boutique en bas de chez toi : pratique, un peu plus chère.' },
  minimarket: { nome: 'Shop Liantsoa (mini market)', icon: '🛒', desc: 'Produits emballés, climatisation, prix élevés.' },
  super: { nome: 'Supermarché (Shoprite / Supermaki)', icon: '🏬', desc: 'Tout en paquets de 1 kg, chariots, caisses.' },
  bagni: { nome: 'Toilettes publiques', icon: '🚻', desc: 'WC 200 Ar, douche 1.000 Ar.' },
  gargote: { nome: 'Hotely gasy (gargote)', icon: '🍲', desc: 'Plats prêts : vary sy laoka, romazava, brochettes.' },
  ristorante: { nome: 'Restaurant', icon: '🍽️', desc: 'Pizza, cuisine française, service à table.' },
  annunci: { nome: 'Panneau d\'annonces & agences d\'emploi', icon: '📋' },
  banca: { nome: 'Banque BNI / MVola', icon: '🏦' },
  agenzia: { nome: 'Agence immobilière', icon: '🏘️', desc: 'Locations, ventes et terrains dans toute la ville.' },
  ospedale: { nome: 'Hôpital HJRA', icon: '🏥' },
  farmacia: { nome: 'Pharmacie', icon: '💊', desc: 'Dans chaque quartier ; les prix changent selon la zone.' },
  auto: { nome: 'Concessionnaire & occasions', icon: '🚗' },
  scuola: { nome: 'École primaire / Lycée', icon: '🏫' },
  universita: { nome: 'Université d\'Antananarivo', icon: '🎓' },
  stadio: { nome: 'Stade de Mahamasina', icon: '⚽' },
  palestra: { nome: 'Salle de sport & piscine', icon: '🏋️' },
  chiesa: { nome: 'Église FJKM', icon: '⛪' },
  comune: { nome: 'Commune & Commissariat', icon: '🏛️' },
  bar: { nome: 'Bar / vie nocturne', icon: '🍻' },
  lago: { nome: 'Lac Anosy', icon: '🌳' },
  zonafranca: { nome: 'Zone franche (usines)', icon: '🏭' },
  aeroporto: { nome: 'Aéroport d\'Ivato', icon: '✈️', desc: 'Vols, taxis, bureaux de change et touristes avec leurs valises.' },
  fornace: { nome: 'Briqueteries', icon: '🧱', desc: 'Briques rouges cuites dans les rizières : travail dur, payé à la pièce.' },
  grossista: { nome: 'Grossistes d\'Anosibe', icon: '🚛', desc: 'Sacs de riz, charbon, bananes par camions entiers.' },
  fabbrica: { nome: 'Usines de Tanjombato', icon: '🏭', desc: 'Bière, plastique, textile : horaires fixes, badge à l\'entrée.' },
  rova: { nome: 'Rova & haute ville', icon: '🏰', desc: 'Le palais de la reine au sommet de la colline. Vue sur tout Tana.' },
  casa: { nome: 'Chez toi', icon: '🏠' },
  lavoro: { nome: 'Ton lieu de travail', icon: '💼' },
};
const MULT_CIBO = [0, 0.9, 1, 1.1, 1.25, 1.4];   // per tier quartiere
const MULT_CASA = [0, 0.7, 1, 1.3, 1.8, 2.5];
const MULT_CASA_CENTRO = 2.8; // Analakely/Behoririka: pieno centro, affitti sopra Ivandry/Ambatobe
const multCasa = q => q.centro ? MULT_CASA_CENTRO : MULT_CASA[q.tier];
const MULT_NEGOZIO = { mercato: 1, epicerie: 1.15, minimarket: 1.3, super: 1.35 };

/* ---------- PRODOTTI (prezzi base al mercato, Ariary 2026) ---------- */
// unità realistiche: kapoaka ≈ 285 g (barattolo di latte concentrato), toko = mucchietto (2-3 pezzi), sachet = bustina
const PRODOTTI = [
  { id: 'riso', nome: 'Riz (vary gasy)', unit: '1 kapoaka', prezzo: 700, key: 'riso', n: 1, dove: ['mercato', 'epicerie'], cat: 'base' },
  { id: 'riso_kg', nome: 'Riz emballé', unit: '1 kg', prezzo: 3200, key: 'riso', n: 3.5, dove: ['minimarket', 'super'], cat: 'base' },
  { id: 'riso_sacco', nome: 'Sac de riz', unit: '25 kg', prezzo: 65000, key: 'riso', n: 87, dove: ['mercato', 'super'], cat: 'base' },
  { id: 'fagioli', nome: 'Haricots secs (tsaramaso)', unit: '1 kapoaka', prezzo: 1500, key: 'fagioli', n: 2, dove: ['mercato', 'epicerie'], cat: 'base' },
  { id: 'pasta', nome: 'Pâtes', unit: '500 g', prezzo: 2500, key: 'pasta', n: 2, dove: ['epicerie', 'minimarket', 'super'], cat: 'base' },
  { id: 'patate', nome: 'Pommes de terre', unit: '1 kapoaka', prezzo: 1000, key: 'patate', n: 1, dove: ['mercato'], cat: 'verdura', fresco: 6 },
  { id: 'carne', nome: 'Viande de zébu', unit: '250 g', prezzo: 3500, key: 'carne', n: 1, dove: ['mercato'], cat: 'carne', fresco: 1 },
  { id: 'carne_kg', nome: 'Viande de zébu emballée', unit: '1 kg', prezzo: 16000, key: 'carne', n: 4, dove: ['super'], cat: 'carne', fresco: 1 },
  { id: 'pollo', nome: 'Poulet', unit: '¼ de poulet', prezzo: 4000, key: 'pollo', n: 1, dove: ['mercato', 'super'], cat: 'carne', fresco: 1 },
  { id: 'pesce', nome: 'Poisson séché (trondro maina)', unit: '250 g', prezzo: 2500, key: 'pesce', n: 1, dove: ['mercato', 'epicerie'], cat: 'carne' },
  { id: 'sardine', nome: 'Sardines en boîte', unit: '1 boîte', prezzo: 3000, key: 'sardine', n: 1, dove: ['epicerie', 'minimarket', 'super'], cat: 'carne' },
  { id: 'uova', nome: 'Œufs', unit: '1 œuf', prezzo: 700, key: 'uova', n: 1, dove: ['mercato', 'epicerie'], cat: 'carne' },
  { id: 'uova6', nome: 'Œufs', unit: 'boîte de 6', prezzo: 4500, key: 'uova', n: 6, dove: ['minimarket', 'super'], cat: 'carne' },
  { id: 'brede', nome: 'Brèdes (anana)', unit: '1 botte', prezzo: 300, key: 'brede', n: 1, dove: ['mercato'], cat: 'verdura', fresco: 2 },
  { id: 'pomodoro', nome: 'Tomates', unit: '1 toko (3 pièces)', prezzo: 500, key: 'pomodoro', n: 1, dove: ['mercato', 'epicerie'], cat: 'verdura', fresco: 3 },
  { id: 'pomodoro_kg', nome: 'Tomates', unit: '1 kg', prezzo: 2500, key: 'pomodoro', n: 5, dove: ['super'], cat: 'verdura', fresco: 3 },
  { id: 'cipolla', nome: 'Oignons', unit: '1 toko (3 pièces)', prezzo: 500, key: 'cipolla', n: 1, dove: ['mercato', 'epicerie'], cat: 'verdura', fresco: 10 },
  { id: 'carote', nome: 'Carottes et légumes variés', unit: '1 toko', prezzo: 500, key: 'verdure', n: 1, dove: ['mercato'], cat: 'verdura', fresco: 4 },
  { id: 'olio', nome: 'Huile', unit: 'sachet 100 ml', prezzo: 1000, key: 'olio', n: 3, dove: ['mercato', 'epicerie'], cat: 'dispensa' },
  { id: 'olio_l', nome: 'Huile', unit: 'bouteille 1 L', prezzo: 8500, key: 'olio', n: 30, dove: ['epicerie', 'minimarket', 'super'], cat: 'dispensa' },
  { id: 'zucchero', nome: 'Sucre', unit: '250 g', prezzo: 1500, key: 'zucchero', n: 10, dove: ['mercato', 'epicerie'], cat: 'dispensa' },
  { id: 'zucchero_kg', nome: 'Sucre', unit: '1 kg', prezzo: 5200, key: 'zucchero', n: 40, dove: ['minimarket', 'super'], cat: 'dispensa' },
  { id: 'sale', nome: 'Sel', unit: 'sachet', prezzo: 300, key: 'sale', n: 20, dove: ['mercato', 'epicerie', 'minimarket', 'super'], cat: 'dispensa' },
  { id: 'caffe', nome: 'Café moulu', unit: 'sachet', prezzo: 1000, key: 'caffe', n: 5, dove: ['mercato', 'epicerie'], cat: 'dispensa' },
  { id: 'caffe_p', nome: 'Café', unit: 'paquet 250 g', prezzo: 9000, key: 'caffe', n: 40, dove: ['minimarket', 'super'], cat: 'dispensa' },
  { id: 'latte', nome: 'Lait concentré', unit: '1 boîte', prezzo: 3200, key: 'latte', n: 5, dove: ['epicerie', 'minimarket', 'super'], cat: 'dispensa' },
  { id: 'pane', nome: 'Mofo dipaina (baguette)', unit: '1 pièce', prezzo: 600, key: 'pane', n: 1, dove: ['epicerie', 'minimarket', 'super'], cat: 'base', fresco: 2 },
  { id: 'acqua', nome: 'Eau Eau Vive', unit: '1,5 L', prezzo: 1500, key: 'acqua', n: 1, dove: ['epicerie', 'minimarket', 'super'], cat: 'dispensa', sempre: true },
  { id: 'carbone_s', nome: 'Charbon', unit: 'petit sachet', prezzo: 3000, key: 'carbone', n: 5, dove: ['mercato', 'epicerie'], cat: 'casa' },
  { id: 'carbone', nome: 'Charbon', unit: 'grand sac', prezzo: 25000, key: 'carbone', n: 50, dove: ['mercato'], cat: 'casa' },
  { id: 'gas', nome: 'Recharge bouteille de gaz 12 kg', unit: '1 recharge', prezzo: 85000, key: 'gas', n: 100, dove: ['epicerie', 'minimarket', 'super'], cat: 'casa' },
  { id: 'sapone', nome: 'Savon (savony gasy)', unit: '1 barre', prezzo: 1500, key: 'sapone', n: 5, dove: ['mercato', 'epicerie', 'minimarket', 'super'], cat: 'casa', sempre: true },
  { id: 'detersivo', nome: 'Lessive en poudre', unit: 'sachet', prezzo: 500, key: 'sapone', n: 1, dove: ['epicerie', 'minimarket', 'super'], cat: 'casa', sempre: true },
];
const NOMI_DISP = { riso: 'riz (kapoaka)', fagioli: 'haricots (port.)', pasta: 'pâtes (port.)', patate: 'patate', carne: 'viande 250g', pollo: 'poulet ¼', pesce: 'poisson séché', sardine: 'sardine', uova: 'uova', brede: 'brèdes', pomodoro: 'tomates (toko)', cipolla: 'oignons (toko)', verdure: 'verdure', olio: 'huile (doses)', zucchero: 'sucre (doses)', sale: 'sel (doses)', caffe: 'café (doses)', latte: 'lait (doses)', pane: 'pane', acqua: 'acqua', carbone: 'charbon (cuissons)', gas: 'gaz (cuissons)', sapone: 'savon (usages)' };
const FRESCHI = { carne: 1, pollo: 1, brede: 2, pane: 2, pomodoro: 3, verdure: 4, patate: 6, cipolla: 10 };

/* ---------- RICETTE ---------- */
const RICETTE = [
  { id: 'vary_fotsy', nome: 'Riz blanc et sel', ing: { riso: 1, sale: 1 }, fame: 30, salute: 0, umore: -2, min: 40, fuoco: 1 },
  { id: 'vary_anana', nome: 'Vary amin\'anana (riz aux brèdes)', ing: { riso: 1, brede: 1, sale: 1 }, fame: 45, salute: 2, umore: 3, min: 45, fuoco: 1 },
  { id: 'tsaramaso', nome: 'Vary sy tsaramaso (riz et haricots)', ing: { riso: 1, fagioli: 1, cipolla: 1, olio: 1, sale: 1 }, fame: 55, salute: 2, umore: 5, min: 75, fuoco: 1 },
  { id: 'atody', nome: 'Vary sy atody (riz et œufs)', ing: { riso: 1, uova: 2, olio: 1, sale: 1 }, fame: 50, salute: 2, umore: 5, min: 40, fuoco: 1 },
  { id: 'sardina', nome: 'Vary sy sardina', ing: { riso: 1, sardine: 1, pomodoro: 1 }, fame: 50, salute: 1, umore: 4, min: 40, fuoco: 1 },
  { id: 'trondro', nome: 'Riz au poisson séché et brèdes', ing: { riso: 1, pesce: 1, brede: 1, sale: 1 }, fame: 55, salute: 3, umore: 5, min: 50, fuoco: 1 },
  { id: 'romazava', nome: 'Romazava', ing: { riso: 1, carne: 1, brede: 1, pomodoro: 1, sale: 1 }, fame: 60, salute: 4, umore: 10, min: 70, fuoco: 1 },
  { id: 'ritra', nome: 'Hen\'omby ritra (zébu mijoté)', ing: { riso: 1, carne: 1, cipolla: 1, pomodoro: 1, olio: 1, sale: 1 }, fame: 65, salute: 3, umore: 12, min: 90, fuoco: 2 },
  { id: 'akoho', nome: 'Akoho sy voatabia (poulet à la tomate)', ing: { riso: 1, pollo: 1, pomodoro: 1, cipolla: 1, olio: 1, sale: 1 }, fame: 62, salute: 4, umore: 12, min: 70, fuoco: 1 },
  { id: 'lasopy', nome: 'Lasopy (soupe de légumes)', ing: { verdure: 1, patate: 1, sale: 1, pane: 1 }, fame: 40, salute: 5, umore: 4, min: 45, fuoco: 1 },
  { id: 'pasta', nome: 'Pâtes à la tomate', ing: { pasta: 1, pomodoro: 1, olio: 1, sale: 1 }, fame: 45, salute: 1, umore: 6, min: 30, fuoco: 1 },
  { id: 'frites', nome: 'Frites', ing: { patate: 1, olio: 2, sale: 1 }, fame: 35, salute: -1, umore: 8, min: 35, fuoco: 1 },
  { id: 'colazione', nome: 'Petit-déjeuner : café, pain et lait', ing: { pane: 1, caffe: 1, zucchero: 1, latte: 1 }, fame: 25, salute: 1, umore: 8, min: 15, fuoco: 0.3 },
  { id: 'kafe', nome: 'Café sucré et pain', ing: { pane: 1, caffe: 1, zucchero: 1 }, fame: 20, salute: 0, umore: 5, min: 10, fuoco: 0.3 },
  { id: 'pane_sardine', nome: 'Pain et sardines (sans cuisiner)', ing: { pane: 1, sardine: 1 }, fame: 30, salute: 0, umore: 2, min: 5, fuoco: 0 },
];
/* ---------- CIBO PRONTO ---------- */
const PRONTO = {
  gargote: [
    { nome: 'Mofo gasy (1 beignet de riz)', tier: [200, 300, 300, 400, 500], fame: 4, mattina: true },
    { nome: 'Mofo gasy (5 beignets) + café', tier: [1200, 1700, 1800, 2500, 3200], fame: 18, umore: 4, mattina: true },
    { nome: 'Koba (1 tranche)', tier: [500, 500, 500, 700, 1000], fame: 6, umore: 2 },
    { nome: 'Sambos et nems', tier: [1500, 2000, 2500, 3500, 5000], fame: 16, salute: -1, rischio: 0.12 },
    { nome: 'Brochettes de zébu (5)', tier: [2000, 3000, 3500, 5000, 7000], fame: 22, umore: 6 },
    { nome: 'Vary sy laoka petit (riz et un peu de laoka)', tier: [2500, 2500, 3000, 4000, 6000], fame: 28, rischio: 0.06 },
    { nome: 'Vary sy laoka complet (plat du jour)', tier: [3500, 4500, 5500, 9000, 14000], fame: 42, salute: 1, rischio: 0.04 },
    { nome: 'Vary be menaka + laoka spécial', tier: [5000, 6500, 8000, 13000, 20000], fame: 55, salute: 2, umore: 8, tierMin: 1 },
    { nome: 'Romazava avec riz', tier: [4500, 6000, 7000, 11000, 16000], fame: 50, salute: 2, umore: 6 },
    { nome: 'Ravitoto sy henakisoa', tier: [5000, 7000, 8000, 12000, 18000], fame: 55, salute: 1, umore: 8 },
    { nome: 'Ranon\'ampango / thé chaud', tier: [200, 300, 300, 500, 800], fame: 3, umore: 2 },
    { nome: 'THB (bière)', tier: [3500, 4000, 4500, 6000, 8000], fame: 5, salute: -2, umore: 8 },
  ],
  ristorante: [
    { nome: 'Pizza', tier: [18000, 22000, 25000, 30000, 38000], fame: 60, umore: 10 },
    { nome: 'Zébu grillé avec frites', tier: [25000, 30000, 35000, 42000, 55000], fame: 70, salute: 2, umore: 12 },
    { nome: 'Dîner français (3 plats)', tier: [45000, 55000, 60000, 75000, 95000], fame: 80, salute: 3, umore: 18 },
    { nome: 'Verre de vin', tier: [8000, 10000, 12000, 15000, 20000], fame: 3, umore: 8, salute: -1 },
  ],
};

/* ---------- IMMOBILIARE (generato per quartiere) ---------- */
const TIPI_CASA = {
  stanza: { nome: 'Chambre à louer', affitto: 85000, comfort: 2, tiers: [1, 2], desc: 'Bois et tôle, toilettes communes dans la cour.' },
  mono: { nome: 'Studio', affitto: 170000, comfort: 4, tiers: [1, 2, 3], desc: 'Une pièce avec coin cuisine, eau et électricité JIRAMA.' },
  bilo: { nome: 'Deux-pièces', affitto: 320000, comfort: 6, tiers: [2, 3, 4], desc: 'Chambre + séjour, terrasse pour étendre le linge.' },
  app: { nome: 'Appartement', affitto: 750000, comfort: 8, tiers: [3, 4, 5], desc: 'Immeuble avec gardien et parking.' },
  villa: { nome: 'Villa', affitto: 1800000, comfort: 10, tiers: [4, 5], desc: 'Jardin, garage, gardien.' },
  casav: { nome: 'Maison traditionnelle en briques (vente)', prezzo: 45000000, comfort: 5, tiers: [1, 2], desc: 'Deux étages, toit en tuiles, cour.' },
  appv: { nome: 'Appartement (vente)', prezzo: 110000000, comfort: 8, tiers: [2, 3, 4, 5], desc: 'Vue sur la ville, ascenseur.' },
  villav: { nome: 'Villa (vente)', prezzo: 320000000, comfort: 10, tiers: [4, 5], desc: 'Piscine, gardiens, le rêve de tous.' },
  terreno: { nome: 'Terrain constructible', prezzo: 12000000, comfort: 0, tiers: [1, 2, 3, 4, 5], desc: '300 m², titre de propriété en règle. Tu peux y construire une maison.' },
};
const CASE = [{ id: 'strada', nome: 'Sans logement (tu dors où tu peux)', affitto: 0, prezzo: 0, q: 'isotry', comfort: 0, tipo: 'strada' }];
QUARTIERI.forEach(q => Object.entries(TIPI_CASA).forEach(([t, d]) => { if (q.centro ? !['stanza', 'mono', 'bilo', 'app', 'appv', 'terreno'].includes(t) : !d.tiers.includes(q.tier)) return; const m = multCasa(q); CASE.push({ id: `${q.id}-${t}`, tipo: t, q: q.id, nome: `${d.nome} a ${q.nome}`, affitto: d.affitto ? Math.round(d.affitto * m / 5000) * 5000 : 0, prezzo: d.prezzo ? Math.round(d.prezzo * m / 500000) * 500000 : 0, comfort: d.comfort + (q.tier >= 4 ? 1 : 0), desc: d.desc }); }));
CASE.push({ id: 'costruita', tipo: 'costruita', q: null, nome: 'La maison que tu as construite', affitto: 0, prezzo: 0, comfort: 7, desc: 'Construite sur ton terrain, brique par brique.' });

const MOBILI = [
  { id: 'materasso', nome: 'Matelas en mousse', prezzo: 60000, eff: 'sommeil +1', icon: '🛏️', dove: ['mercato', 'super'] },
  { id: 'letto', nome: 'Lit en palissandre', prezzo: 450000, eff: 'sommeil +3', icon: '🛏️', dove: ['super'] },
  { id: 'fornello', nome: 'Réchaud à charbon (fatapera)', prezzo: 15000, eff: 'cuisine au charbon', icon: '🔥', dove: ['mercato', 'epicerie'] },
  { id: 'gasf', nome: 'Cuisinière à gaz + bouteille', prezzo: 250000, eff: 'cuisine rapide (recharge de gaz nécessaire)', icon: '🍳', dove: ['super', 'minimarket'] },
  { id: 'frigo', nome: 'Réfrigérateur', prezzo: 900000, eff: 'les produits frais durent 4x', icon: '🧊', dove: ['super'] },
  { id: 'secchio', nome: 'Seau et bassine', prezzo: 8000, eff: 'se laver et lessive à la main', icon: '🪣', dove: ['mercato', 'epicerie'] },
  { id: 'doccia', nome: 'Chauffe-eau + douche', prezzo: 600000, eff: 'hygiène 100', icon: '🚿', dove: ['super'] },
  { id: 'lavatrice', nome: 'Machine à laver', prezzo: 1400000, eff: 'lessive en 1h', icon: '🫧', dove: ['super'] },
  { id: 'stendino', nome: 'Étendoir et pinces', prezzo: 20000, eff: 'étendre à la maison', icon: '🧺', dove: ['mercato', 'epicerie'] },
  { id: 'tv', nome: 'TV + décodeur Canal+', prezzo: 700000, eff: 'moral +12', icon: '📺', dove: ['super'] },
  { id: 'divano', nome: 'Canapé', prezzo: 500000, eff: 'moral +', icon: '🛋️', dove: ['super'] },
  { id: 'pc', nome: 'Ordinateur portable', prezzo: 2200000, eff: 'études +, travail en ligne', icon: '💻', dove: ['super'] },
  { id: 'telefono', nome: 'Smartphone', prezzo: 350000, eff: 'MVola, appels', icon: '📱', dove: ['minimarket', 'super', 'mercato'] },
  { id: 'libri', nome: 'Étagère de livres', prezzo: 120000, eff: 'intelligence +', icon: '📚', dove: ['super', 'mercato'] },
  { id: 'pesi', nome: 'Haltères', prezzo: 90000, eff: 'sport à la maison', icon: '🏋️', dove: ['super'] },
  { id: 'pannelli', nome: 'Panneau solaire', prezzo: 1800000, eff: 'facture d\'électricité -60%', icon: '☀️', dove: ['super'] },
  { id: 'zanzariera', nome: 'Moustiquaire', prezzo: 20000, eff: 'moins de paludisme', icon: '🦟', dove: ['mercato', 'farmacia', 'super'] },
];
const VEICOLI = [
  { id: 'bici', nome: 'Vélo', prezzo: 300000, vel: 2, costo: 0, icon: '🚲' },
  { id: 'moto', nome: 'Scooter chinois 125', prezzo: 4500000, vel: 3, costo: 1500, icon: '🛵' },
  { id: 'r4', nome: 'Renault 4L (1982)', prezzo: 9000000, vel: 3, costo: 4000, icon: '🚗' },
  { id: 'peugeot', nome: 'Peugeot 405', prezzo: 18000000, vel: 3, costo: 5000, icon: '🚗' },
  { id: 'hilux', nome: 'Toyota Hilux 4x4', prezzo: 95000000, vel: 4, costo: 9000, icon: '🛻' },
  { id: 'prado', nome: 'Toyota Land Cruiser Prado', prezzo: 220000000, vel: 4, costo: 12000, icon: '🚙' },
];
const MEDICINE = [
  { id: 'paracetamolo', nome: 'Paracétamol', prezzo: 2000, cura: ['influenza', 'febbre'] },
  { id: 'orsa', nome: 'Sels de réhydratation + Flagyl', prezzo: 6000, cura: ['diarrea'] },
  { id: 'malaria', nome: 'Coartem (antipaludique)', prezzo: 15000, cura: ['malaria'] },
  { id: 'antibiotico', nome: 'Amoxicilline', prezzo: 12000, cura: ['bronchite', 'infezione'] },
  { id: 'vitamine', nome: 'Vitamines', prezzo: 8000, cura: [] },
];
const MALATTIE = {
  influenza: { nome: 'Grippe', grav: 1, gg: 4, sint: 'nez bouché, courbatures' }, febbre: { nome: 'Fièvre', grav: 1, gg: 3, sint: 'frissons, faiblesse' }, diarrea: { nome: 'Diarrhée', grav: 2, gg: 3, sint: 'crampes, tu cours aux toilettes', extra: 'vessie -50%/h en plus' },
  malaria: { nome: 'Paludisme', grav: 4, gg: 8, sint: 'forte fièvre, frissons violents', extra: 'DANGEREUX : sans soins, il peut tuer' }, bronchite: { nome: 'Bronchite', grav: 2, gg: 6, sint: 'toux, souffle court', extra: 'sport presque impossible' }, infezione: { nome: 'Infection', grav: 3, gg: 5, sint: 'douleur, fièvre' },
};
function malusMalattia(tipo) { const m = MALATTIE[tipo]; return `santé -${(m.grav * 0.4 * 24).toFixed(0)}/jour · énergie -24/jour · moral -${m.grav * 6}/jour · rendement au travail -2/service · entretiens -20%${m.extra ? ' · ' + m.extra : ''}`; }
function cureMalattia(tipo) { const med = MEDICINE.find(x => x.cura.includes(tipo)); return `Traitement : ${med.nome} (${Ar(med.prezzo)} Ar en pharmacie, -3 jours) ou hospitalisation. Sans soins, ça dure ${MALATTIE[tipo].gg} jours.`; }

/* ---------- LAVORI (gg = giorni lavorativi 0=lun … 6=dom) ---------- */
const LV = [0, 1, 2, 3, 4], LS6 = [0, 1, 2, 3, 4, 5], MS = [1, 2, 3, 4, 5, 6], TUTTI = [0, 1, 2, 3, 4, 5, 6];
const LAVORI = [
  { id: 'nulla', nome: 'Sans emploi', paga: 0, gg: [] },
  // --- a giornata (nessun titolo) ---
  { id: 'lavatore', nome: 'Laveur de vitres / porteur au marché', paga: 5000, tipo: 'giorno', edu: 0, ore: 8, inizio: 6, gg: LS6, luogo: 'analakely' },
  { id: 'lavatore2', nome: 'Porteur au marché', paga: 4500, tipo: 'giorno', edu: 0, ore: 9, inizio: 5, gg: TUTTI, luogo: 'andravoahangy' },
  { id: 'mpanasa', nome: 'Lavandier/ère à domicile (mpanasa lamba)', paga: 7000, tipo: 'giorno', edu: 0, ore: 6, inizio: 7, gg: LS6, luogo: 'ampefiloha', skill: 'casa' },
  { id: 'mpanasa2', nome: 'Lavandier/ère à domicile (mpanasa lamba)', paga: 6000, tipo: 'giorno', edu: 0, ore: 7, inizio: 6, gg: LS6, luogo: 'analamahitsy', skill: 'casa' },
  { id: 'ricevitore', nome: 'Receveur de taxi-be', paga: 8000, tipo: 'giorno', edu: 0, ore: 10, inizio: 5, gg: LS6, luogo: 'anosy' },
  { id: 'ricevitore2', nome: 'Receveur de taxi-be (ligne Ivato)', paga: 9000, tipo: 'giorno', edu: 0, ore: 12, inizio: 4, gg: TUTTI, luogo: 'ivato' },
  { id: 'muratore', nome: 'Manœuvre sur chantier', paga: 9000, tipo: 'giorno', edu: 0, ore: 9, inizio: 7, gg: LS6, luogo: 'andoharanofotsy', skill: 'fitness' },
  { id: 'muratore2', nome: 'Manœuvre sur chantier', paga: 10000, tipo: 'giorno', edu: 0, ore: 9, inizio: 7, gg: LS6, luogo: 'talatamaty', skill: 'fitness' },
  { id: 'facchino', nome: 'Porteur au marché de gros', paga: 10000, tipo: 'giorno', edu: 0, ore: 8, inizio: 4, gg: LS6, luogo: 'anosibe', skill: 'fitness', minSkill: 20 },
  { id: 'mattonaio', nome: 'Briquetier', paga: 7000, tipo: 'giorno', edu: 0, ore: 9, inizio: 6, gg: LS6, luogo: 'alasora', skill: 'fitness' },
  { id: 'facchinoaero', nome: 'Porteur à l\'aéroport (pourboires)', paga: 8000, tipo: 'giorno', edu: 0, ore: 8, inizio: 5, gg: TUTTI, luogo: 'ivato', skill: 'sociale' },
  { id: 'venditore', nome: 'Vendeur ambulant (mpivarotra)', paga: 6000, tipo: 'giorno', edu: 0, ore: 10, inizio: 7, gg: TUTTI, luogo: 'behoririka', skill: 'sociale' },
  { id: 'lavapiatti', nome: 'Plongeur dans un hotely', paga: 6000, tipo: 'giorno', edu: 0, ore: 9, inizio: 9, gg: LS6, luogo: 'isotry', skill: 'casa' },
  { id: 'lavapiatti2', nome: 'Plongeur dans un restaurant', paga: 8000, tipo: 'giorno', edu: 0, ore: 8, inizio: 11, gg: MS, luogo: 'tsaralalana', skill: 'casa' },
  { id: 'pousse', nome: 'Tireur de pousse-pousse / cyclo-pousse', paga: 7000, tipo: 'giorno', edu: 0, ore: 10, inizio: 6, gg: TUTTI, luogo: '67ha', skill: 'fitness', minSkill: 25 },
  // --- mensili senza titolo ---
  { id: 'guardiano', nome: 'Gardien de nuit', paga: 220000, tipo: 'mese', edu: 0, ore: 10, inizio: 20, gg: LS6, luogo: 'ivandry', notte: true },
  { id: 'guardiano2', nome: 'Gardien de nuit', paga: 200000, tipo: 'mese', edu: 0, ore: 11, inizio: 19, gg: LS6, luogo: 'ambatobe', notte: true },
  { id: 'guardiano3', nome: 'Gardien d\'entrepôt', paga: 180000, tipo: 'mese', edu: 0, ore: 12, inizio: 18, gg: LS6, luogo: 'tanjombato', notte: true },
  { id: 'domestica', nome: 'Employé(e) de maison (mpiasa an-trano)', paga: 200000, tipo: 'mese', edu: 0, ore: 8, inizio: 7, gg: LS6, luogo: 'analamahitsy', skill: 'casa', minSkill: 15 },
  { id: 'domestica2', nome: 'Employé(e) de maison en villa', paga: 260000, tipo: 'mese', edu: 0, ore: 9, inizio: 7, gg: LS6, luogo: 'ivandry', skill: 'casa', minSkill: 25 },
  { id: 'giardiniere', nome: 'Jardinier', paga: 230000, tipo: 'mese', edu: 0, ore: 8, inizio: 7, gg: LS6, luogo: 'ambatobe', skill: 'casa', minSkill: 15 },
  { id: 'operaiofab', nome: 'Ouvrier/ère en usine (plastique)', paga: 240000, tipo: 'mese', edu: 0, ore: 10, inizio: 6, gg: LS6, luogo: 'tanjombato', skill: 'fitness' },
  { id: 'magazziniere', nome: 'Magasinier', paga: 260000, tipo: 'mese', edu: 0, ore: 9, inizio: 7, gg: LS6, luogo: 'talatamaty', skill: 'fitness', minSkill: 20 },
  { id: 'pulizie', nome: 'Agent d\'entretien en hôtel', paga: 250000, tipo: 'mese', edu: 0, ore: 8, inizio: 6, gg: LS6, luogo: 'ivato', skill: 'casa', minSkill: 15 },
  // --- mensili con CEPE ---
  { id: 'cameriere', nome: 'Serveur/se d\'hotely', paga: 250000, tipo: 'mese', edu: 1, ore: 9, inizio: 10, gg: MS, luogo: 'analakely', skill: 'sociale' },
  { id: 'cameriere2', nome: 'Serveur/se d\'hotely', paga: 220000, tipo: 'mese', edu: 1, ore: 10, inizio: 9, gg: MS, luogo: 'ambohipo', skill: 'sociale' },
  { id: 'cameriere3', nome: 'Serveur/se de restaurant', paga: 320000, tipo: 'mese', edu: 1, ore: 9, inizio: 11, gg: MS, luogo: 'ivandry', skill: 'sociale', minSkill: 15 },
  { id: 'zonetranche', nome: 'Ouvrier/ère zone franche (textile)', paga: 280000, tipo: 'mese', edu: 1, ore: 9, inizio: 7, gg: LS6, luogo: 'ankorondrano' },
  { id: 'zonetranche2', nome: 'Ouvrier/ère textile', paga: 260000, tipo: 'mese', edu: 1, ore: 9, inizio: 7, gg: LS6, luogo: 'tanjombato' },
  { id: 'commesso', nome: 'Vendeur/se chez Shoprite', paga: 320000, tipo: 'mese', edu: 1, ore: 8, inizio: 8, gg: MS, luogo: 'ankorondrano', skill: 'sociale' },
  { id: 'commesso2', nome: 'Vendeur/se Jumbo Score', paga: 300000, tipo: 'mese', edu: 1, ore: 8, inizio: 8, gg: MS, luogo: 'tanjombato', skill: 'sociale' },
  { id: 'commesso3', nome: 'Vendeur/se en boutique de tissus', paga: 240000, tipo: 'mese', edu: 1, ore: 10, inizio: 8, gg: LS6, luogo: 'behoririka', skill: 'sociale' },
  { id: 'cuoco', nome: 'Cuisinier/ère d\'hotely', paga: 300000, tipo: 'mese', edu: 1, ore: 10, inizio: 6, gg: LS6, luogo: 'isotry', skill: 'casa', minSkill: 25 },
  { id: 'sarto', nome: 'Couturier/ère en atelier', paga: 280000, tipo: 'mese', edu: 1, ore: 9, inizio: 8, gg: LS6, luogo: 'behoririka', skill: 'casa', minSkill: 20 },
  { id: 'autista', nome: 'Chauffeur privé', paga: 500000, tipo: 'mese', edu: 1, ore: 9, inizio: 7, gg: LS6, luogo: 'ivandry', patente: true },
  { id: 'autista2', nome: 'Chauffeur de taxi-be', paga: 400000, tipo: 'mese', edu: 1, ore: 12, inizio: 5, gg: LS6, luogo: 'ambohimanarina', patente: true },
  { id: 'autista3', nome: 'Chauffeur de navette d\'hôtel', paga: 450000, tipo: 'mese', edu: 1, ore: 10, inizio: 5, gg: LS6, luogo: 'ivato', patente: true, skill: 'sociale' },
  { id: 'camionista', nome: 'Camionneur (livraisons RN7)', paga: 550000, tipo: 'mese', edu: 1, ore: 11, inizio: 5, gg: LS6, luogo: 'tanjombato', patente: true, skill: 'guida', minSkill: 30 },
  { id: 'meccanico', nome: 'Aide-mécanicien', paga: 300000, tipo: 'mese', edu: 1, ore: 9, inizio: 8, gg: LS6, luogo: '67ha', skill: 'guida', minSkill: 15 },
  { id: 'agentesic', nome: 'Agent de sécurité (société privée)', paga: 300000, tipo: 'mese', edu: 1, ore: 12, inizio: 7, gg: LS6, luogo: 'ankorondrano', skill: 'fitness', minSkill: 30 },
  // --- mensili con BACC ---
  { id: 'callcenter', nome: 'Téléopérateur call center (français)', paga: 550000, tipo: 'mese', edu: 2, ore: 8, inizio: 9, gg: LV, luogo: 'ankorondrano', skill: 'sociale', minSkill: 20 },
  { id: 'callcenter2', nome: 'Téléopérateur (nuit, horaires Europe)', paga: 650000, tipo: 'mese', edu: 2, ore: 8, inizio: 22, gg: LV, luogo: 'antanimena', skill: 'sociale', minSkill: 20, notte: true },
  { id: 'segretaria', nome: 'Secrétaire', paga: 600000, tipo: 'mese', edu: 2, ore: 8, inizio: 8, gg: LV, luogo: 'antanimena', skill: 'intelligenza', minSkill: 15 },
  { id: 'segretaria2', nome: 'Secrétaire en agence immobilière', paga: 500000, tipo: 'mese', edu: 2, ore: 8, inizio: 8, gg: LS6, luogo: 'talatamaty', skill: 'intelligenza', minSkill: 15 },
  { id: 'cassiere', nome: 'Caissier/ère de supermarché', paga: 420000, tipo: 'mese', edu: 2, ore: 8, inizio: 9, gg: MS, luogo: 'ankorondrano', skill: 'intelligenza', minSkill: 10 },
  { id: 'receptionist', nome: 'Réceptionniste d\'hôtel', paga: 600000, tipo: 'mese', edu: 2, ore: 9, inizio: 6, gg: LS6, luogo: 'ivato', skill: 'sociale', minSkill: 30 },
  { id: 'receptionist2', nome: 'Réceptionniste de petit hôtel', paga: 450000, tipo: 'mese', edu: 2, ore: 10, inizio: 7, gg: LS6, luogo: 'tsaralalana', skill: 'sociale', minSkill: 20 },
  { id: 'guida', nome: 'Guide touristique (haute ville)', paga: 500000, tipo: 'mese', edu: 2, ore: 7, inizio: 9, gg: MS, luogo: 'ambanidia', skill: 'sociale', minSkill: 35 },
  { id: 'maestro', nome: 'Instituteur/trice', paga: 650000, tipo: 'mese', edu: 2, ore: 7, inizio: 7, gg: LV, luogo: 'ambohipo', skill: 'intelligenza', minSkill: 25 },
  { id: 'maestro2', nome: 'Instituteur/trice en école publique', paga: 480000, tipo: 'mese', edu: 2, ore: 7, inizio: 7, gg: LV, luogo: 'ambohimanarina', skill: 'intelligenza', minSkill: 20 },
  { id: 'maestro3', nome: 'Enseignant(e) en école privée', paga: 750000, tipo: 'mese', edu: 2, ore: 8, inizio: 7, gg: LV, luogo: 'analamahitsy', skill: 'intelligenza', minSkill: 35 },
  { id: 'poliziotto', nome: 'Agent de police', paga: 700000, tipo: 'mese', edu: 2, ore: 9, inizio: 7, gg: LS6, luogo: 'anosy', skill: 'fitness', minSkill: 40 },
  { id: 'gendarme', nome: 'Gendarme', paga: 720000, tipo: 'mese', edu: 2, ore: 10, inizio: 6, gg: LS6, luogo: 'alasora', skill: 'fitness', minSkill: 40 },
  { id: 'capoturno', nome: 'Chef d\'équipe en usine', paga: 600000, tipo: 'mese', edu: 2, ore: 10, inizio: 6, gg: LS6, luogo: 'tanjombato', skill: 'sociale', minSkill: 30, esp: 1 },
  { id: 'agenteimm', nome: 'Agent immobilier (commissions)', paga: 700000, tipo: 'mese', edu: 2, ore: 9, inizio: 8, gg: LS6, luogo: 'talatamaty', skill: 'business', minSkill: 20 },
  { id: 'agenteviaggi', nome: 'Agent de voyage / enregistrement', paga: 800000, tipo: 'mese', edu: 2, ore: 9, inizio: 5, gg: LS6, luogo: 'ivato', skill: 'sociale', minSkill: 40 },
  // --- laurea ---
  { id: 'infermiere', nome: 'Infirmier/ère', paga: 750000, tipo: 'mese', edu: 3, ore: 9, inizio: 7, gg: LS6, luogo: 'ampefiloha', skill: 'intelligenza', minSkill: 30 },
  { id: 'infermiere2', nome: 'Infirmier/ère en clinique privée', paga: 900000, tipo: 'mese', edu: 3, ore: 9, inizio: 7, gg: LS6, luogo: 'analamahitsy', skill: 'intelligenza', minSkill: 40 },
  { id: 'contabile', nome: 'Comptable', paga: 1200000, tipo: 'mese', edu: 3, ore: 8, inizio: 8, gg: LV, luogo: 'antanimena', skill: 'intelligenza', minSkill: 45 },
  { id: 'contabile2', nome: 'Comptable d\'usine', paga: 1000000, tipo: 'mese', edu: 3, ore: 9, inizio: 7, gg: LS6, luogo: 'tanjombato', skill: 'intelligenza', minSkill: 40 },
  { id: 'prof', nome: 'Professeur de lycée', paga: 900000, tipo: 'mese', edu: 3, ore: 7, inizio: 7, gg: LV, luogo: 'analamahitsy', skill: 'intelligenza', minSkill: 45 },
  { id: 'ong', nome: 'Assistant(e) de projet en ONG', paga: 1400000, tipo: 'mese', edu: 3, ore: 8, inizio: 8, gg: LV, luogo: 'ivandry', skill: 'sociale', minSkill: 45 },
  { id: 'dev', nome: 'Développeur logiciel', paga: 2000000, tipo: 'mese', edu: 3, ore: 8, inizio: 9, gg: LV, luogo: 'ankorondrano', skill: 'intelligenza', minSkill: 55 },
  { id: 'dev2', nome: 'Développeur web (start-up)', paga: 1500000, tipo: 'mese', edu: 3, ore: 9, inizio: 9, gg: LV, luogo: 'antanimena', skill: 'intelligenza', minSkill: 45 },
  { id: 'medico', nome: 'Médecin', paga: 2500000, tipo: 'mese', edu: 4, ore: 10, inizio: 7, gg: LS6, luogo: 'ampefiloha', skill: 'intelligenza', minSkill: 65 },
  { id: 'medico2', nome: 'Médecin en clinique privée', paga: 3200000, tipo: 'mese', edu: 4, ore: 9, inizio: 8, gg: LV, luogo: 'ivandry', skill: 'intelligenza', minSkill: 70, esp: 2 },
  { id: 'avvocato', nome: 'Avocat', paga: 3000000, tipo: 'mese', edu: 4, ore: 9, inizio: 8, gg: LV, luogo: 'anosy', skill: 'sociale', minSkill: 60 },
  { id: 'ingegnere', nome: 'Ingénieur (Ambatovy)', paga: 3500000, tipo: 'mese', edu: 4, ore: 9, inizio: 8, gg: LV, luogo: 'ankorondrano', skill: 'intelligenza', minSkill: 65 },
  { id: 'pilota', nome: 'Pilote de ligne (Madagascar Airlines)', paga: 5000000, tipo: 'mese', edu: 4, ore: 10, inizio: 5, gg: LS6, luogo: 'ivato', skill: 'intelligenza', minSkill: 75, esp: 3 },
  { id: 'dirigente', nome: 'Cadre de banque', paga: 6000000, tipo: 'mese', edu: 4, ore: 10, inizio: 8, gg: LV, luogo: 'antanimena', skill: 'intelligenza', minSkill: 75, esp: 3 },
  { id: 'direttorefab', nome: 'Directeur d\'usine', paga: 7000000, tipo: 'mese', edu: 4, ore: 10, inizio: 7, gg: LS6, luogo: 'tanjombato', skill: 'business', minSkill: 60, esp: 4 },
  { id: 'ministro', nome: 'Haut fonctionnaire au ministère', paga: 9000000, tipo: 'mese', edu: 4, ore: 8, inizio: 8, gg: LV, luogo: 'anosy', skill: 'sociale', minSkill: 85, esp: 5 },
];
LAVORI.forEach(l => { if (l.id !== 'nulla') l.fine = (l.inizio + l.ore) % 24; });
function giorniTxt(l) { if (!l.gg.length) return ''; if (l.gg.length === 7) return 'tous les jours'; if (l.gg.join() === LV.join()) return 'lun–ven'; if (l.gg.join() === LS6.join()) return 'lun–sam'; if (l.gg.join() === MS.join()) return 'mar–dim (repos le lundi)'; return l.gg.map(g => GG[g]).join(' '); }
function orarioLavoro(l) { return `${hh(l.inizio)}–${hh(l.fine)}`; }
const STATO_LBL = { conoscente: 'connaissance', fidanzato: 'en couple', promesso: 'fiancé(e)', sposato: 'marié(e)', ex: 'ex' };
const TRATTI_LBL = { allegro: 'joyeux', sospettoso: 'méfiant', chiacchierone: 'bavard', timido: 'timide', severo: 'sévère', generoso: 'généreux', pettegolo: 'commère', religioso: 'religieux', ambizioso: 'ambitieux', pigro: 'paresseux', romantico: 'romantique', pratico: 'pratique', ironico: 'ironique', ansioso: 'anxieux', orgoglioso: 'fier', materno: 'maternel', furbo: 'malin', gentile: 'gentil' };
const trattiTxt = p => p.tratti.map(t => TRATTI_LBL[t] || t).join(', ');
const TIER_LBL = ['', 'populaire', 'moyen', 'bon', 'chic', 'luxe', 'centre-ville'];
const SKILL_LBL = { intelligenza: 'intelligence', sociale: 'social', fitness: 'forme', casa: 'maison', guida: 'conduite', business: 'business' };
const EDU = ['Aucun diplôme', 'Certificat primaire (CEPE)', 'Baccalauréat (BACC)', 'Licence', 'Master / Spécialisation'];
const SCUOLE = [
  { liv: 1, nome: 'Cours du soir / primaire (CEPE)', costo: 20000, mesi: 6, poi: 'scuola' },
  { liv: 2, nome: 'Lycée (jusqu\'au BACC)', costo: 60000, mesi: 12, poi: 'scuola' },
  { liv: 3, nome: 'Université d\'Antananarivo (Licence)', costo: 150000, mesi: 24, poi: 'universita' },
  { liv: 4, nome: 'Master / Médecine / Ingénierie', costo: 400000, mesi: 24, poi: 'universita' },
];
const ATTIVITA = [
  { id: 'epicerie', nome: 'Épicerie de quartier', costo: 3000000, base: 25000, icon: '🏪' },
  { id: 'gargote', nome: 'Hotely gasy (gargote)', costo: 5000000, base: 45000, icon: '🍲' },
  { id: 'taxi', nome: 'Taxi (voiture nécessaire)', costo: 800000, base: 40000, icon: '🚕', auto: true },
  { id: 'cyber', nome: 'Cyber café', costo: 12000000, base: 90000, icon: '🖥️' },
  { id: 'atelier', nome: 'Atelier de couture', costo: 8000000, base: 70000, icon: '🧵' },
  { id: 'agenzia', nome: 'Agence immobilière', costo: 40000000, base: 300000, icon: '🏢' },
  { id: 'mattoni', nome: 'Briqueterie', costo: 4000000, base: 35000, icon: '🧱', q: ['alasora', 'itaosy', 'andoharanofotsy'] },
  { id: 'grossista', nome: 'Dépôt de riz & charbon en gros', costo: 20000000, base: 140000, icon: '🚛', q: ['anosibe', 'andravoahangy'] },
  { id: 'artigianato', nome: 'Étal d\'artisanat pour touristes', costo: 2500000, base: 30000, icon: '🎨', q: ['ivato', 'ambanidia', 'analakely'] },
  { id: 'guesthouse', nome: 'Guest house / chambres d\'hôtes', costo: 60000000, base: 380000, icon: '🛏️', q: ['ivato', 'ambanidia', 'talatamaty', 'analamahitsy'] },
  { id: 'scuolaprivata', nome: 'École privée', costo: 35000000, base: 250000, icon: '🏫', q: ['analamahitsy', 'ambohimanarina', 'talatamaty', 'alasora'] },
  { id: 'lavaggio', nome: 'Station de lavage auto', costo: 6000000, base: 55000, icon: '🚿', q: ['tanjombato', 'talatamaty', 'ankorondrano', 'analamahitsy'] },
  { id: 'import', nome: 'Import-export (conteneurs)', costo: 150000000, base: 1200000, icon: '🚢' },
];

/* ---------- LAVORETTI (asa tselika) ---------- */
const LAVORETTI = [
  { id: 'trasloco', nome: 'Aider à un déménagement (porteur)', icon: '📦', ore: [3, 5], paga: 2000, fatica: 9, igiene: 6, fit: 15, tiers: [1, 2, 3, 4, 5], skill: 'fitness', desc: 'Canapés et armoires dans les escaliers, « mora mora » mais sans s\'arrêter.' },
  { id: 'scarico', nome: 'Décharger un camion de marchandises', icon: '🚛', ore: [2, 3], paga: 2200, fatica: 10, igiene: 7, fit: 20, tiers: [1, 2, 3], skill: 'fitness', desc: 'Des sacs de riz de 50 kg du camion à l\'entrepôt.' },
  { id: 'consegna', nome: 'Livraisons pour une épicerie', icon: '🛵', ore: [2, 4], paga: 1500, fatica: 4, igiene: 3, tiers: [1, 2, 3, 4, 5], skill: 'sociale', veicolo: 1.6, desc: 'Bouteilles de gaz, packs d\'eau et sacs de riz à domicile. Avec un vélo ou une moto, tu gagnes bien plus.' },
  { id: 'pacchi', nome: 'Porter les courses des dames du marché', icon: '🧺', ore: [1, 3], paga: 1200, fatica: 5, igiene: 4, tiers: [1, 2], skill: 'sociale', desc: 'Tu suis les clientes jusqu\'au taxi-be avec les paniers sur la tête.' },
  { id: 'lavaggio', nome: 'Laver des voitures dans la rue', icon: '🚗', ore: [1, 3], paga: 1800, fatica: 5, igiene: 5, tiers: [2, 3, 4, 5], skill: 'casa', desc: 'Un seau, un chiffon et un sourire devant le parking.' },
  { id: 'panni', nome: 'Faire la lessive d\'une famille (mpanasa lamba)', icon: '🫧', ore: [3, 5], paga: 1500, fatica: 6, igiene: 3, tiers: [1, 2, 3, 4, 5], skill: 'casa', casa: 10, bucato: true, desc: 'Laver à la main les draps, chemises et pantalons d\'une famille.' },
  { id: 'cantiere', nome: 'Journée sur un chantier (gâcher du ciment)', icon: '🧱', ore: [4, 6], paga: 1800, fatica: 8, igiene: 8, fit: 20, tiers: [1, 2, 3], skill: 'fitness', desc: 'Un maçon du quartier cherche des bras pour aujourd\'hui.' },
  { id: 'guardia', nome: 'Surveiller une boutique quelques heures', icon: '👁️', ore: [2, 4], paga: 1300, fatica: 2, igiene: 1, tiers: [1, 2, 3], skill: 'sociale', desc: 'Le propriétaire doit sortir et n\'ose pas tout laisser sans surveillance.' },
  { id: 'giardino', nome: 'Entretenir un jardin', icon: '🌿', ore: [2, 4], paga: 2500, fatica: 6, igiene: 5, tiers: [3, 4, 5], skill: 'casa', desc: 'Les villas ont des pelouses à tondre et des haies à tailler.' },
  { id: 'babysitter', nome: 'Garder les enfants d\'une voisine', icon: '👶', ore: [2, 4], paga: 1500, fatica: 3, igiene: 1, tiers: [2, 3, 4, 5], skill: 'sociale', soc: 15, desc: 'Il faut de la confiance : la maman te connaît de vue.' },
  { id: 'ripetizioni', nome: 'Cours particuliers de français/maths', icon: '📖', ore: [1, 2], paga: 4000, fatica: 2, igiene: 0, tiers: [2, 3, 4, 5], skill: 'intelligenza', edu: 2, desc: 'Une famille cherche quelqu\'un pour aider son fils avant les examens.' },
  { id: 'volantini', nome: 'Distribuer des prospectus', icon: '📄', ore: [2, 3], paga: 1000, fatica: 4, igiene: 3, tiers: [1, 2, 3, 4], skill: 'sociale', desc: 'Une nouvelle boutique veut se faire connaître.' },
  { id: 'evento', nome: 'Servir à une fête (mariage, famadihana)', icon: '🍽️', ore: [4, 6], paga: 2000, fatica: 5, igiene: 3, tiers: [1, 2, 3, 4, 5], skill: 'sociale', soc: 10, weekend: true, desc: 'Servir le riz et les boissons à 200 invités. Souvent on te donne aussi à manger.' },
  { id: 'ricevitore', nome: 'Remplacer le receveur d\'un taxi-be', icon: '🚌', ore: [3, 5], paga: 1500, fatica: 6, igiene: 6, tiers: [1, 2], skill: 'sociale', desc: 'Le receveur est malade, le chauffeur cherche quelqu\'un pour aujourd\'hui.' },
  { id: 'valigie', nome: 'Porter les valises des touristes', icon: '🧳', ore: [2, 4], paga: 2500, fatica: 5, igiene: 3, tiers: [1, 2, 3, 4, 5], q: ['ivato'], skill: 'sociale', desc: 'À l\'arrivée des vols, les vazaha cherchent qui portera leurs valises jusqu\'au taxi. Les pourboires font la différence.' },
  { id: 'mattoni', nome: 'Empiler des briques à la briqueterie', icon: '🧱', ore: [3, 5], paga: 1600, fatica: 9, igiene: 8, fit: 15, tiers: [1, 2], q: ['alasora', 'itaosy'], skill: 'fitness', desc: 'Mille briques à déplacer avant la pluie.' },
  { id: 'carbone', nome: 'Décharger des sacs de charbon', icon: '🪵', ore: [2, 4], paga: 2400, fatica: 10, igiene: 10, fit: 20, tiers: [1, 2], q: ['anosibe', 'andravoahangy'], skill: 'fitness', desc: 'Le camion arrive à l\'aube : des sacs noirs jusqu\'à midi.' },
  { id: 'spesa', nome: 'Faire les courses pour une famille', icon: '🛍️', ore: [1, 3], paga: 2000, fatica: 3, igiene: 2, tiers: [3, 4, 5], skill: 'sociale', soc: 15, desc: 'Liste en main, marché et pharmacie : on te paie même le taxi-be.' },
  { id: 'inventario', nome: 'Inventaire de nuit dans un magasin', icon: '📋', ore: [3, 5], paga: 2200, fatica: 4, igiene: 1, tiers: [2, 3, 4], edu: 1, skill: 'intelligenza', desc: 'Compter des cartons et noter des chiffres : il faut bien savoir lire.' },
  { id: 'traduzione', nome: 'Servir d\'interprète à un touriste', icon: '🗣️', ore: [2, 4], paga: 5000, fatica: 2, igiene: 1, tiers: [2, 3, 4, 5], q: ['ivato', 'ambanidia', 'analakely', 'ivandry'], skill: 'sociale', edu: 2, soc: 30, desc: 'Un vazaha veut visiter le Rova ou marchander au marché : parle français avec lui.' },
  { id: 'risaia', nome: 'Journée dans la rizière', icon: '🌾', ore: [4, 6], paga: 1200, fatica: 8, igiene: 9, fit: 10, tiers: [1], q: ['alasora', 'itaosy', 'ambohimanarina'], skill: 'fitness', desc: 'Repiquer ou moissonner le riz les pieds dans la boue. Le déjeuner est offert.' },
  { id: 'catering', nome: 'Aide en cuisine pour un traiteur', icon: '🍛', ore: [4, 6], paga: 1800, fatica: 5, igiene: 4, tiers: [2, 3, 4, 5], skill: 'casa', casa: 15, desc: 'Éplucher, couper, frire pour 100 personnes.' },
];
function lavorettiOggi() {
  const key = now().toDateString() + '|' + S.q; if (S.flags.lavKey === key) return S.flags.lavList;
  const q = Q(S.q); const rete = (S.flags.rep && S.flags.rep[S.q]) || 0; const conosc = S.png.filter(p => p.aff >= 30).length;
  const n = Math.min(5, 1 + Math.floor(Math.random() * 2) + (rete >= 3 ? 1 : 0) + (rete >= 8 ? 1 : 0) + (conosc >= 5 ? 1 : 0) + (ha('telefono') ? 1 : 0));
  const pool = LAVORETTI.filter(l => (l.q ? l.q.includes(q.id) : l.tiers.includes(q.tier)) && (!l.weekend || giornoIdx() >= 5));
  const list = []; for (let i = 0; i < n && pool.length; i++) { const l = pool.splice(Math.floor(Math.random() * pool.length), 1)[0]; const ore = rnd(l.ore[0], l.ore[1]); const inizio = rnd(7, 15); const item = { id: l.id, ore, inizio, paga: Math.round(l.paga * ore * MULT_CIBO[q.tier] * (0.85 + Math.random() * 0.3) / 100) * 100, fatto: false }; if (l.bucato) item.bucato = { capi: ore * 8 + rnd(0, 6), cortile: q.tier >= 3 ? Math.random() < 0.75 : Math.random() < 0.3 }; list.push(item); }
  S.flags.lavKey = key; S.flags.lavList = list; return list;
}
/* ---------- STATO ---------- */
let S = null;
let ui = { tab: 'home', modal: null, toastT: null, aiActive: 'none' };
const DISP_VUOTA = () => ({ riso: 0, fagioli: 0, pasta: 0, patate: 0, carne: 0, pollo: 0, pesce: 0, sardine: 0, uova: 0, brede: 0, pomodoro: 0, cipolla: 0, verdure: 0, olio: 0, zucchero: 0, sale: 0, caffe: 0, latte: 0, pane: 0, acqua: 0, carbone: 0, gas: 0, sapone: 0 });

function nuovoPNG(ruolo, opts = {}) {
  const gen = opts.gen || pick(['M', 'F']);
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
  log(`Bienvenue à Antananarivo, ${nome}. Tu es à Analakely avec ${Ar(S.soldi)} Ar en poche, sans logement, sans travail.`, 'info');
  log('Conseils : 📋 cherche un travail journalier au panneau d\'annonces d\'Analakely ; mange à l\'hotely (sans logement tu ne peux pas cuisiner) ; pour une chambre, va dans une agence immobilière (Analakely, Antanimena…).', 'info');
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
function png(id) { return S.png.find(p => p.id === id); }
function prezzoPronto(c, q = S.q) { return c.tier[Q(q).tier - 1]; }
function prezzo(base, negozio, q = S.q) { const p = base * (MULT_NEGOZIO[negozio] || 1) * MULT_CIBO[Q(q).tier]; return Math.max(100, Math.round(p / 100) * 100); }
function casaComfortSonno() { if (S.flags.ostello) return 4; let c = casa().comfort; if (ha('letto')) c += 3; else if (ha('materasso')) c += 1; return c; }
function primoGiornoLavoro(l, daData) { for (let i = 1; i <= 7; i++) { const d = new Date(daData.getTime() + i * 86400000); if (l.gg.includes((d.getDay() + 6) % 7)) return d; } return null; }
function primoGiornoTxt(d) { const oggi = now(); const diff = Math.round((new Date(d.getFullYear(), d.getMonth(), d.getDate()) - new Date(oggi.getFullYear(), oggi.getMonth(), oggi.getDate())) / 86400000); return diff === 0 ? 'aujourd\'hui' : diff === 1 ? 'demain' : `${GIORNI[(d.getDay() + 6) % 7]} ${d.getDate()} ${MESI[d.getMonth()]}`; }
function statoTurno(l) {
  if (!l || l.id === 'nulla') return { stato: 'nessuno' };
  if (S.flags.inizioLavoro && now().getTime() < S.flags.inizioLavoro) return { stato: 'chiuso', txt: `tu commences ${primoGiornoTxt(new Date(S.flags.inizioLavoro))} à ${hh(l.inizio)}` };
  if (!l.gg.includes(giornoIdx())) return { stato: 'chiuso', txt: `repos aujourd'hui (tu travailles ${giorniTxt(l)})` };
  let m = minutiOra(), ini = l.inizio * 60, fin = ini + l.ore * 60;
  if (l.notte && m < 12 * 60) m += 24 * 60;
  const diff = m - ini;
  if (diff < -60) return { stato: 'presto', attesa: -diff, txt: `le service commence à ${hh(l.inizio)} (dans ${Math.round(-diff / 6) / 10} h)` };
  if (diff <= 10) return { stato: 'puntuale', attesa: Math.max(0, -diff), txt: 'tu es à l\'heure' };
  if (m < fin - 120) return { stato: 'ritardo', ritardo: diff, txt: `tu es en retard de ${Math.floor(diff / 60)}h${String(diff % 60).padStart(2, '0')}` };
  return { stato: 'perso', txt: 'service manqué : trop tard' };
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
    if (b.energia <= 0 && !opts.sonno) { log('Tu t\'es écroulé(e) de sommeil là où tu étais.', 'bad'); S.bis.energia = 30; S.min += 300; b.igiene = clamp(b.igiene - 15); }
    if (b.vescica <= 0) { log('Tu n\'as pas réussi à te retenir… quelle honte.', 'bad'); b.vescica = 60; b.igiene = clamp(b.igiene - 30); b.umore = clamp(b.umore - 15); S.pantoSporchi++; }
    if (b.igiene < 15) b.salute = clamp(b.salute - 0.15 * f);
    S.malattie.forEach(m => { const g = MALATTIE[m.tipo].grav; b.salute = clamp(b.salute - g * 0.4 * f); b.energia = clamp(b.energia - 1 * f); b.umore = clamp(b.umore - g * 0.25 * f); if (m.tipo === 'diarrea') b.vescica = clamp(b.vescica - 2.5 * f); });
    if (S.malattie.length === 0 && b.fame > 40 && b.igiene > 40) b.salute = clamp(b.salute + 0.3 * f);
    if (S.pantoBagnati > 0 && !opts.sonno && Math.random() < 0.15 * f) { S.pantoPuliti += S.pantoBagnati; S.pantoBagnati = 0; log('Le linge étendu a séché.', 'good'); }
    S.sporcoCasa = clamp(S.sporcoCasa + 0.4 * f);
    const cur = now(); if (cur.getDate() !== prev.getDate()) nuovoGiorno(cur);
  }
  if (S.bis.salute <= 0) morte();
}
function nuovoGiorno(d) {
  S.stat.gg++;
  const c = casa();
  // assenza ieri
  { const l = lavoro(); const prev = new Date(d.getTime() - 86400000); const pi = (prev.getDay() + 6) % 7; if (l.id !== 'nulla' && l.tipo === 'mese' && l.gg.includes(pi) && S.flags.lavoratoOggi !== prev.toDateString() && S.flags.assuntoIl !== prev.toDateString() && !(S.flags.inizioLavoro && prev.getTime() < S.flags.inizioLavoro)) { S.perf = clamp(S.perf - 8); log(`Hier (${GIORNI[pi]}) tu ne t'es pas présenté(e) au travail (${orarioLavoro(l)}). Absence : performance -8 → ${Math.round(S.perf)}.`, 'bad'); } }
  // cibo fresco che va a male
  Object.entries(FRESCHI).forEach(([k, lim]) => { if (S.disp[k] > 0 && S.fresco[k] !== undefined) { const eta = S.stat.gg - S.fresco[k]; const max = ha('frigo') ? lim * 4 : lim; if (eta > max) { log(`${NOMI_DISP[k]} a pourri (${S.disp[k]} jetés). ${ha('frigo') ? '' : 'Un frigo le ferait durer 4 fois plus longtemps.'}`, 'bad'); S.disp[k] = 0; } } });
  if (d.getDate() === 1) {
    if (c.affitto > 0) {
      if (paga(c.affitto, true)) log(`Tu as payé le loyer : ${Ar(c.affitto)} Ar.`, 'info');
      else { S.flags.arretrati = (S.flags.arretrati || 0) + 1; log(`Tu n'as pas payé le loyer (${Ar(c.affitto)} Ar). Le propriétaire est furieux.`, 'bad'); if (S.flags.arretrati >= 2) { S.casa = 'strada'; S.flags.arretrati = 0; log('Tu as été expulsé(e). Tu es de nouveau à la rue.', 'bad'); } }
    }
    if (haCasa() && c.tipo !== 'stanza') {
      let boll = 25000 + c.comfort * 12000 + (ha('frigo') ? 20000 : 0) + (ha('tv') ? 8000 : 0) + (ha('lavatrice') ? 12000 : 0);
      if (ha('pannelli')) boll = Math.round(boll * 0.4);
      if (paga(boll, true)) log(`Facture JIRAMA (électricité et eau) : ${Ar(boll)} Ar.`, 'info'); else { log(`Tu n'as pas payé la JIRAMA (${Ar(boll)} Ar) : on t'a coupé l'électricité. Moral -20.`, 'bad'); S.bis.umore = clamp(S.bis.umore - 20); }
    }
    const l = lavoro();
    if (l.tipo === 'mese' && S.ggLavorati > 0) {
      const attesi = l.gg.length * 4.33; const stip = Math.round(l.paga * Math.min(1, S.ggLavorati / attesi) * (0.8 + S.perf / 250) * (S.flags.bonus || 1));
      S.soldi += stip; log(`Salaire reçu : ${Ar(stip)} Ar (${Math.round(S.ggLavorati)} services sur ~${Math.round(attesi)} prévus, performance ${Math.round(S.perf)}).`, 'good'); S.ggLavorati = 0;
      if (S.perf > 85 && Math.random() < 0.3) { S.perf = 60; S.flags.bonus = (S.flags.bonus || 1) * 1.1; log('Le patron est content : augmentation de 10% !', 'good'); }
    }
    if (S.scuola) { const sc = SCUOLE.find(s => s.liv === S.scuola.liv); if (!paga(sc.costo, true)) { log(`Tu n'as pas payé les frais de scolarité (${Ar(sc.costo)} Ar). Tu as été renvoyé(e).`, 'bad'); S.scuola = null; } else log(`Frais de scolarité payés : ${Ar(sc.costo)} Ar.`, 'info'); }
    if (S.banca) { S.banca.saldo = Math.round(S.banca.saldo * 1.003); if (S.banca.prestito > 0) { const rata = Math.round(S.banca.rata); if (paga(rata, true)) { S.banca.prestito = Math.max(0, S.banca.prestito - rata * 0.85); log(`Mensualité du prêt : ${Ar(rata)} Ar.`, 'info'); } else { S.banca.prestito *= 1.05; log('Mensualité du prêt impayée : pénalité de 5%.', 'bad'); } } }
    if (S.attivita) { const tot = S.attivita.mese; S.attivita.mese = 0; log(`Ton commerce a rapporté ${Ar(tot)} Ar ce mois-ci.`, 'info'); }
  }
  S.malattie = S.malattie.filter(m => { m.gg--; if (m.gg <= 0) { log(`Tu es guéri(e) de : ${MALATTIE[m.tipo].nome}.`, 'good'); return false; } return true; });
  let rischio = 0.03 + (S.bis.igiene < 30 ? 0.05 : 0) + (haCasa() ? 0 : 0.05) + (S.bis.fame < 30 ? 0.03 : 0) - S.skill.fitness / 2000;
  if (Math.random() < rischio && S.malattie.length < 2) { const tipo = pick(['influenza', 'febbre', 'diarrea', 'diarrea', 'bronchite', ...(ha('zanzariera') ? [] : ['malaria'])]); S.malattie.push({ tipo, gg: MALATTIE[tipo].gg }); log(`🤒 Tu es tombé(e) malade : ${MALATTIE[tipo].nome} (${MALATTIE[tipo].sint}). MALUS : ${malusMalattia(tipo)}. ${cureMalattia(tipo)}`, 'bad'); }
  if (S.attivita) { const a = ATTIVITA.find(x => x.id === S.attivita.id); const r = Math.round(a.base * (0.5 + S.skill.business / 60) * (0.7 + Math.random() * 0.6) * (S.attivita.dip ? 1.6 : 1)) - (S.attivita.dip ? 12000 : 0); S.soldi += r; S.attivita.mese += r; }
  if (S.cantiere) { S.cantiere.gg--; if (S.cantiere.gg <= 0) { S.flags.casaQ = S.cantiere.q; S.proprieta.push('costruita'); S.casa = 'costruita'; log(`🏠 Ta maison à ${Q(S.cantiere.q).nome} est terminée ! Tu as emménagé.`, 'good'); S.cantiere = null; } else if (S.cantiere.gg % 30 === 0) log(`Chantier à ${Q(S.cantiere.q).nome} : il reste ${S.cantiere.gg} jours.`, 'info'); }
  const ga = giornoAnno(d);
  if (ga === S.nascita) { S.eta++; log(`🎂 Joyeux anniversaire ! Aujourd'hui tu as ${S.eta} ans.`, 'good'); S.flags.compleanno = true; }
  S.png.forEach(p => { if (p.comp === ga) { p.eta++; if (p.aff > 30) log(`🎂 Aujourd'hui c'est l'anniversaire de ${p.nome}. Fais-lui un cadeau !`, 'info'); } });
  S.figli.forEach(f => { if (f.comp === ga) { f.eta++; log(`🎂 ${f.nome} fête ses ${f.eta} ans !`, 'good'); } });
  if (S.gravidanza) { S.gravidanza.gg--; if (S.gravidanza.gg <= 0) { const gen = pick(['M', 'F']); const nome = pick(gen === 'M' ? NOMI_M : NOMI_F); S.figli.push({ nome, gen, eta: 0, comp: ga }); S.gravidanza = null; log(`👶 Naissance de ${nome} ! Les enfants coûtent ~60.000 Ar/mois chacun.`, 'good'); } }
  if (d.getDate() === 15 && S.figli.length) { const c2 = S.figli.length * 60000; paga(c2, true); log(`Dépenses pour les enfants : ${Ar(c2)} Ar.`, 'info'); }
  S.png.forEach(p => { if (Math.random() < 0.3 && p.aff > 10 && p.id !== S.partner) p.aff = clamp(p.aff - 1); });
  if (S.partner) { const p = png(S.partner); if (p && Math.random() < 0.15) p.aff = clamp(p.aff - 2); if (p && p.aff < 15) { log(`${p.nome} t'a quitté(e) : « Tu n'es jamais là pour moi. »`, 'bad'); p.stato = 'ex'; S.partner = null; S.sposato = false; } }
  eventoCasuale();
  if (S.stat.gg % 5 === 0) salva();
}
function eventoCasuale() {
  const r = Math.random();
  if (r < 0.04 && S.soldi > 30000 && !haCasa()) { const k = Math.round(S.soldi * 0.5); S.soldi -= k; log(`On t'a volé pendant que tu dormais dans la rue : -${Ar(k)} Ar.`, 'bad'); }
  else if (r < 0.06) { S.png.push(nuovoPNG(pick(['sconosciuto', 'collega', 'vicino']), { aff: rnd(5, 15) })); log('Tu as rencontré quelqu\'un de nouveau dans le taxi-be.', 'info'); }
  else if (r < 0.08 && S.veicolo) { const m = pick([3000, 8000, 25000]); paga(m, true); log(`Contrôle routier. Un « petit geste » de ${Ar(m)} Ar et c'est réglé.`, 'bad'); }
  else if (r < 0.10) { const p = pick(S.png.filter(x => x.aff > 30)); if (p) { p.aff = clamp(p.aff + 5); log(`${p.nome} t'a envoyé un gentil message. Affinité +5.`, 'good'); } }
  else if (r < 0.115 && S.veicolo) { log('Un taxi-be a rayé ta carrosserie. Réparation 60.000 Ar.', 'bad'); paga(60000, true); }
  else if (r < 0.125 && ha('telefono') && S.flags.rep && Object.keys(S.flags.rep).length) { const qid = pick(Object.keys(S.flags.rep)); log(`📱 Une connaissance de ${Q(qid).nome} t'a appelé(e) : demain on cherche du monde pour un petit boulot. Passe par là.`, 'info'); }
  else if (r < 0.13) { const v = rnd(2000, 15000); S.soldi += v; log(`Tu as trouvé ${Ar(v)} Ar par terre !`, 'good'); }
}
function morte() { if (S.morto) return; S.morto = true; S.bis.salute = 0; ui.modal = { tipo: 'morte' }; render(); salva(); }
async function nuovaVita() { const slot = codiceGiocatore(); S = null; ui.modal = null; ui.tab = 'home'; LS.del('tanalife'); LS.set('mrls_pid', nuovoCodice()); render(); try { await fetch('/api/delete', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ slot }) }); } catch (e) { } }
function paga(n, auto = false) {
  if (S.soldi >= n) { S.soldi -= n; return true; }
  if (auto && S.banca && S.banca.saldo + S.soldi >= n) { const m = n - S.soldi; S.banca.saldo -= m; S.soldi = 0; log(`Prélèvement automatique de ${Ar(m)} Ar sur le compte.`, 'info'); return true; }
  return false;
}
function log(t, tipo = '') { S.log.unshift({ t, tipo, d: dataStr() }); if (S.log.length > 100) S.log.pop(); toast(t.replace(/<[^>]+>/g, ''), tipo); }
function toast(t, tipo = '') { clearTimeout(ui.toastT); let e = document.querySelector('.toast'); if (!e) { e = document.createElement('div'); e.className = 'toast'; document.body.appendChild(e); } e.className = 'toast ' + tipo; e.textContent = t; e.style.display = 'block'; e.style.animation = 'none'; void e.offsetWidth; e.style.animation = ''; ui.toastT = setTimeout(() => e.style.display = 'none', 3200); }
function skillUp(k, n) { S.skill[k] = clamp(S.skill[k] + n); }

/* ---------- AZIONI ---------- */
const A = {
  pronto(negozio, i) { const c = PRONTO[negozio][i]; const pr = prezzoPronto(c); if (c.mattina && ora() > 10) return toast('Les mofo gasy ne se vendent que le matin.'); if (S.bis.fame >= 95) return toast('Tu es rassasié(e) : tu ne peux plus rien avaler.', 'bad'); if (S.bis.fame >= 80 && !ui.confSazio) { ui.confSazio = true; return toast('Tu as déjà le ventre plein (faim ' + Math.round(S.bis.fame) + '/100). Touche encore si tu veux quand même manger.'); } ui.confSazio = false; if (!paga(pr)) return toast('Tu n\'as pas assez d\'argent.'); const prima = Math.round(S.bis.fame); S.bis.fame = clamp(S.bis.fame + c.fame); S.bis.umore = clamp(S.bis.umore + (c.umore || 3)); S.bis.salute = clamp(S.bis.salute + (c.salute || 0)); S.stat.pasti++; avanza(20); log(`🍽️ Tu as mangé ${c.nome} : faim ${prima} → ${Math.round(S.bis.fame)} · −${Ar(pr)} Ar · 20 min.`, 'good'); if (c.rischio && Math.random() < c.rischio && !S.malattie.some(m => m.tipo === 'diarrea')) { S.malattie.push({ tipo: 'diarrea', gg: 3 }); log(`La nourriture n'était pas fraîche… Diarrhée. MALUS : ${malusMalattia('diarrea')}`, 'bad'); } },
  compra(pid, negozio) { const p = PRODOTTI.find(x => x.id === pid); const pr = prezzo(p.prezzo, negozio); if (!haCasa() && !p.sempre) return toast('Sans logement tu n\'as nulle part où le conserver : mange à l\'hotely.'); if (!paga(pr)) return toast('Tu n\'as pas assez d\'argent.'); S.disp[p.key] = Math.round((S.disp[p.key] + p.n) * 10) / 10; if (FRESCHI[p.key]) S.fresco[p.key] = S.stat.gg; avanza(2); toast(`${p.nome} (${p.unit}): −${Ar(pr)} Ar`); },
  cucina(rid) {
    const r = RICETTE.find(x => x.id === rid); if (!haCasa()) return toast('Il faut un logement pour cuisiner.'); if (S.loc !== 'casa') return toast('Tu dois être chez toi.'); if (S.bis.fame >= 95) return toast('Tu es rassasié(e) : tu ne peux plus rien avaler.', 'bad'); if (S.bis.fame >= 80 && !ui.confSazio) { ui.confSazio = true; return toast('Tu as déjà le ventre plein (faim ' + Math.round(S.bis.fame) + '/100). Touche encore si tu veux quand même cuisiner.'); } ui.confSazio = false; const primaF = Math.round(S.bis.fame);
    for (const [k, n] of Object.entries(r.ing)) if ((S.disp[k] || 0) < n) return toast(`Il manque : ${NOMI_DISP[k]} (il faut ${n}).`);
    let fuoco = null, tempo = r.min;
    if (r.fuoco > 0) { if (ha('gasf') && S.disp.gas >= r.fuoco) { fuoco = 'gas'; tempo = Math.round(r.min * 0.65); } else if (ha('fornello') && S.disp.carbone >= r.fuoco) fuoco = 'carbone'; else if (!ha('fornello') && !ha('gasf')) return toast('Il te faut un réchaud (fatapera au marché, 15.000 Ar).'); else return toast(`Il manque ${ha('gasf') ? NOMI_DISP.gas : NOMI_DISP.carbone} pour cuisiner.`); }
    for (const [k, n] of Object.entries(r.ing)) S.disp[k] = Math.round((S.disp[k] - n) * 10) / 10;
    if (fuoco) S.disp[fuoco] = Math.round((S.disp[fuoco] - r.fuoco) * 10) / 10;
    S.bis.fame = clamp(S.bis.fame + r.fame); S.bis.umore = clamp(S.bis.umore + r.umore); S.bis.salute = clamp(S.bis.salute + r.salute); skillUp('casa', 0.8); S.stat.pasti++; avanza(tempo); S.sporcoCasa = clamp(S.sporcoCasa + 3);
    log(`🍳 Tu as cuisiné et mangé ${r.nome}${fuoco ? ' (' + NOMI_DISP[fuoco].split(' ')[0] + ')' : ''} : faim ${primaF} → ${Math.round(S.bis.fame)} · ${tempo} min.`, 'good');
  },
  bagno() { const fuori = !(S.loc === 'casa' && haCasa()); if (fuori && S.loc !== 'bagni' && S.loc !== 'lavoro' && S.loc !== 'gargote') return toast('Il n\'y a pas de toilettes ici : cherche 🚻 Toilettes publiques dans le quartier (ou chez toi/au travail/à l\'hotely).'); if (S.loc === 'bagni' && !paga(200)) return toast('Le WC public coûte 200 Ar.'); S.bis.vescica = 100; avanza(5); if (S.loc === 'bagni') log('WC public : 200 Ar.'); },
  lavati() { if (S.loc === 'bagni') { if (!paga(1000)) return toast('La douche publique coûte 1.000 Ar.'); S.bis.igiene = clamp(S.bis.igiene + 40); avanza(30); return log('Douche aux toilettes publiques (1.000 Ar).'); } if (S.loc !== 'casa' || !haCasa()) return toast('Tu peux te laver chez toi ou aux 🚻 toilettes publiques.'); if (ha('doccia')) { S.bis.igiene = 100; S.bis.umore = clamp(S.bis.umore + 5); avanza(20); log('Douche chaude. Quel bonheur.'); } else if (ha('secchio')) { if (S.disp.sapone < 1) return toast('Il te faut du savon.'); S.disp.sapone--; S.bis.igiene = clamp(S.bis.igiene + 55); avanza(30); log('Tu t\'es lavé(e) au seau d\'eau froide.'); } else toast('Il te faut au moins un seau (marché/épicerie, 8.000 Ar).'); },
  bucato() { if (S.pantoSporchi < 1) return toast('Tu n\'as pas de linge sale.'); if (S.disp.sapone < 1) return toast('Il faut du savon ou de la lessive.'); const n = S.pantoSporchi; S.disp.sapone--; S.pantoSporchi = 0; S.pantoBagnati += n; S.stat.lavate++; if (ha('lavatrice')) { avanza(60); log(`Machine à laver : ${n} vêtements lavés. Maintenant étends-les.`); } else { if (!ha('secchio')) return toast('Il faut un seau.'); skillUp('casa', 1); S.bis.energia = clamp(S.bis.energia - 8); avanza(90); log(`Lessive à la main : ${n} vêtements. Maintenant étends-les.`); } },
  stendi() { if (S.pantoBagnati < 1) return toast('Tu n\'as pas de linge mouillé.'); avanza(15); log(`Tu as étendu ${S.pantoBagnati} vêtements au soleil.`); },
  pulisci() { S.sporcoCasa = 0; S.bis.umore = clamp(S.bis.umore + 5); skillUp('casa', 1); avanza(60); log('Tu as fait le ménage.'); },
  dormi(h, motivo) { const min = Math.round(h * 60); if (min < 10) return toast('Trop court pour dormir.'); if (!haCasa()) { S.bis.umore = clamp(S.bis.umore - 10); S.bis.igiene = clamp(S.bis.igiene - 10); } else if (S.loc !== 'casa') return toast('Rentre chez toi pour dormir (ou dors dans la rue si tu n\'as pas de logement).');
    const prima = { ...S.bis }; avanza(min, { sonno: true }); if (min >= 240 && S.pantoSporchi < 8) S.pantoSporchi++; if (!ha('materasso') && !ha('letto') && haCasa()) S.bis.energia = clamp(S.bis.energia - 10 * Math.min(1, min / 480));
    const ore = min / 60; if (ore < 5 && min >= 60) { S.bis.umore = clamp(S.bis.umore - 6); S.bis.salute = clamp(S.bis.salute - 1); } if (ore > 10) { S.bis.umore = clamp(S.bis.umore - 4); S.bis.energia = clamp(S.bis.energia - 5); }
    const d = k => { const v = Math.round(S.bis[k] - prima[k]); return (v >= 0 ? '+' : '') + v; };
    log(`${haCasa() ? 'Tu as dormi' : 'Tu as dormi dans la rue'} ${durata(min)}${motivo ? ' ' + motivo : ''}, réveil à ${oraStr()}. Énergie ${d('energia')}, faim ${d('fame')}, moral ${d('umore')}${ore < 5 && min >= 60 ? ' (trop peu : fatigue et mauvaise humeur)' : ore > 10 ? ' (trop : tu te sens vaseux/se)' : ''}.`, haCasa() ? '' : 'bad'); },
  ostello(h, motivo) { const min = Math.round(h * 60); if (min < 10) return toast('Trop court.'); const notti = Math.ceil(min / (12 * 60)); const costo = 15000 * notti; if (!paga(costo)) return toast(`L'auberge coûte ${Ar(costo)} Ar (${notti} ${notti > 1 ? 'nuits' : 'nuit'}).`);
    const prima = { ...S.bis }; S.bis.igiene = clamp(S.bis.igiene + 30); S.flags.ostello = true; avanza(min, { sonno: true }); S.flags.ostello = false;
    const ore = min / 60; if (ore < 5 && min >= 60) { S.bis.umore = clamp(S.bis.umore - 6); S.bis.salute = clamp(S.bis.salute - 1); } if (ore > 10) { S.bis.umore = clamp(S.bis.umore - 4); S.bis.energia = clamp(S.bis.energia - 5); }
    if (min >= 240 && S.pantoSporchi < 8) S.pantoSporchi++;
    const d = k => { const v = Math.round(S.bis[k] - prima[k]); return (v >= 0 ? '+' : '') + v; };
    log(`Auberge (${Ar(costo)} Ar) : tu as dormi ${durata(min)}${motivo ? ' ' + motivo : ''} dans un lit propre avec douche, réveil à ${oraStr()}. Énergie ${d('energia')}, hygiène ${d('igiene')}, moral ${d('umore')}.`); },
  aspetta(min, motivo) { if (min <= 0) return toast('Aucune attente nécessaire.'); avanza(min); S.bis.energia = clamp(S.bis.energia + 8 * min / 60); S.bis.umore = clamp(S.bis.umore + 2 * min / 60); log(`Tu as attendu ${durata(min)}${motivo ? ' ' + motivo : ''}. Il est maintenant ${oraStr()}.`); },
  riposa() { avanza(60); S.bis.energia = clamp(S.bis.energia + 8); S.bis.umore = clamp(S.bis.umore + 3); },
  tv() { avanza(90); S.bis.umore = clamp(S.bis.umore + 12); },
  leggi() { avanza(90); skillUp('intelligenza', ha('libri') ? 1.5 : 0.7); S.bis.umore = clamp(S.bis.umore + 3); log('Tu as lu et étudié un peu.'); },
  pesi() { avanza(60, { sport: true }); skillUp('fitness', 1.5); S.bis.energia = clamp(S.bis.energia - 10); log('Entraînement à la maison.'); },
  festaCompleanno() { if (!paga(50000)) return toast('Il faut 50.000 Ar.'); S.flags.compleanno = false; S.bis.umore = 100; S.png.forEach(p => { if (p.aff > 25) p.aff = clamp(p.aff + 6); }); avanza(240); log('🎉 Fête d\'anniversaire avec les amis, mofo gasy et THB !', 'good'); },
  lavora() {
    const l = lavoro(); if (l.id === 'nulla') return toast('Tu n\'as pas de travail.'); if (S.flags.lavoratoOggi === now().toDateString()) return toast('Tu as déjà fait ton service aujourd\'hui.'); if (S.bis.energia < 15) return toast('Tu es trop fatigué(e). Dors.');
    const st = statoTurno(l);
    if (st.stato === 'chiuso') return toast(st.txt);
    if (st.stato === 'perso') { S.perf = clamp(S.perf - 12); S.flags.lavoratoOggi = now().toDateString(); return log(`Tu es arrivé(e) alors que le service était presque fini : ABSENCE. Performance -12 → ${Math.round(S.perf)}.`, 'bad'); }
    if (st.attesa > 0) { avanza(st.attesa); log(`Tu as attendu ${Math.round(st.attesa)} min le début du service.`); }
    let oreEff = l.ore;
    if (st.stato === 'ritardo') { const penal = Math.min(15, 3 + Math.floor(st.ritardo / 15)); oreEff = l.ore - st.ritardo / 60; S.perf = clamp(S.perf - penal); log(`Retard de ${st.ritardo} min : le patron ${S.capo ? S.capo.nome : ''} te regarde de travers. Performance -${penal}.`, 'bad'); }
    avanza(Math.round(oreEff * 60), { lavoro: true }); S.flags.lavoratoOggi = now().toDateString(); S.esp += 1; if (l.skill) skillUp(l.skill, 0.6); skillUp('sociale', 0.2);
    const perfD = (S.bis.umore > 50 ? 1 : -1) + (S.bis.igiene > 40 ? 1 : -2) + (S.malattie.length ? -2 : 0) + (S.bis.fame > 30 ? 0 : -2) + 1; S.perf = clamp(S.perf + perfD);
    if (l.tipo === 'giorno') { const p = Math.round(l.paga * (0.8 + Math.random() * 0.5) * (oreEff / l.ore)); S.soldi += p; log(`Service ${orarioLavoro(l)} comme ${l.nome}: +${Ar(p)} Ar. Performance ${perfD >= 0 ? '+' : ''}${perfD} → ${Math.round(S.perf)}.`, 'good'); }
    else { S.ggLavorati += oreEff / l.ore; log(`Service ${orarioLavoro(l)} terminé. Services ce mois-ci : ${Math.round(S.ggLavorati * 10) / 10}. Performance ${perfD >= 0 ? '+' : ''}${perfD} → ${Math.round(S.perf)}.`); }
    if (S.perf < 15) { log('Tu as été licencié(e) pour mauvais rendement.', 'bad'); S.lavoro = 'nulla'; S.perf = 50; }
    if (Math.random() < 0.08) { const c = nuovoPNG('collega', { aff: 20 }); S.png.push(c); log(`Tu t'es lié(e) d'amitié avec un(e) collègue : ${c.nome}.`, 'info'); }
  },
  candidati(id) {
    const l = LAVORI.find(x => x.id === id);
    if (S.edu < l.edu) return toast(`Requis : ${EDU[l.edu]}.`); if (l.minSkill && S.skill[l.skill] < l.minSkill) return toast(`Il faut ${SKILL_LBL[l.skill]} ≥ ${l.minSkill}.`); if (l.patente && !S.patente) return toast('Il faut le permis.'); if (l.esp && S.esp < l.esp * 200) return toast(`Il faut plus d'expérience (${l.esp} ans).`);
    // punteggio colloquio con fattori spiegabili
    const fattori = []; let prob = 0.55;
    const soc = S.skill.sociale / 200; prob += soc; fattori.push({ n: 'Compétence sociale ' + Math.round(S.skill.sociale), v: soc });
    const ig = S.bis.igiene > 50 ? 0.15 : S.bis.igiene > 30 ? -0.05 : -0.2; prob += ig; fattori.push({ n: 'Hygiène ' + Math.round(S.bis.igiene) + (S.bis.igiene > 50 ? ' (présentable)' : ' (négligé(e))'), v: ig });
    const um = S.bis.umore > 50 ? 0.05 : -0.05; prob += um; fattori.push({ n: 'Moral ' + Math.round(S.bis.umore), v: um });
    if (S.malattie.length) { prob -= 0.2; fattori.push({ n: 'Malade (' + MALATTIE[S.malattie[0].tipo].nome + ')', v: -0.2 }); }
    if (S.pantoPuliti < 1) { prob -= 0.1; fattori.push({ n: 'Vêtements sales', v: -0.1 }); }
    if (l.skill && S.skill[l.skill] > (l.minSkill || 0) + 15) { prob += 0.1; fattori.push({ n: 'Excellent(e) ' + SKILL_LBL[l.skill], v: 0.1 }); }
    if (S.edu > l.edu) { prob += 0.05; fattori.push({ n: 'Diplôme supérieur au requis', v: 0.05 }); }
    if (S.fedina > 0) { prob -= 0.15; fattori.push({ n: 'Casier judiciaire', v: -0.15 }); }
    if (S.flags.rifiuti && S.flags.rifiuti[id] >= 2) { prob -= 0.1; fattori.push({ n: 'Déjà refusé(e) ici ' + S.flags.rifiuti[id] + ' fois', v: -0.1 }); }
    prob = clamp(prob, 0.05, 0.95); avanza(90);
    const ok = Math.random() < prob;
    const lista = fattori.map(f => `<div class="row"><span>${f.n}</span><b style="color:${f.v >= 0 ? 'var(--ok)' : 'var(--bad)'}">${f.v >= 0 ? '+' : ''}${Math.round(f.v * 100)}%</b></div>`).join('');
    if (!ok) {
      S.flags.rifiuti = S.flags.rifiuti || {}; S.flags.rifiuti[id] = (S.flags.rifiuti[id] || 0) + 1;
      const peggio = [...fattori].sort((a, b) => a.v - b.v)[0]; const motivo = peggio && peggio.v < 0 ? peggio.n.toLowerCase() : 'trop de candidats';
      const frasi = { igiene: ['« Revenez quand vous vous serez arrangé(e). »', '« Ici on est en contact avec les clients, vous comprenez… »'], malat: ['« Avec cette toux, impossible ; repassez quand vous irez mieux. »'], vestiti: ['« Présentez-vous avec des vêtements propres la prochaine fois. »'], fedina: ['« Nous avons vérifié votre casier. Je suis désolé. »'], umore: ['« Vous semblez peu motivé(e). On va y réfléchir. »'], sociale: ['« Vous ne nous avez pas convaincus à l\'entretien. Entraînez-vous à parler aux gens. »'], respinto: ['« On vous l\'a déjà dit. Arrêtez d\'insister. »'], troppi: ['« Nous avons choisi un autre candidat avec plus d\'expérience. Réessayez le mois prochain. »'] };
      const k = Object.keys(frasi).find(k2 => motivo.includes(k2)) || 'troppi';
      S.bis.umore = clamp(S.bis.umore - 5);
      log(`Entretien pour ${l.nome} : PAS embauché(e). Raison principale : ${motivo}.`, 'bad');
      ui.modal = { tipo: 'esito', ok: false, titolo: '❌ Tu n\'as pas été embauché(e)', html: `<p><b>${l.nome}</b> a ${Q(l.luogo).nome}</p><p style="font-style:italic">${pick(frasi[k])}</p><p class="mut">Raison principale : <b>${motivo}</b>. Moral -5.</p><h3>Comment s'est passé l'entretien</h3>${lista}<div class="row"><span>Probabilité totale</span><b>${Math.round(prob * 100)}%</b></div><p class="mut">Tu peux repostuler demain. Améliore les points en rouge.</p>` };
      return;
    }
    S.lavoro = id; S.perf = 50; S.ggLavorati = 0; S.flags.assuntoIl = now().toDateString(); { const pg = primoGiornoLavoro(l, now()); S.flags.inizioLavoro = new Date(pg.getFullYear(), pg.getMonth(), pg.getDate(), l.notte ? l.inizio : 0, 0).getTime(); }
    S.capo = nuovoPNG('capo', { aff: 15, eta: rnd(35, 60) }); S.png.push(S.capo); const c = nuovoPNG('collega', { aff: 15 }); S.png.push(c);
    const primo = primoGiornoTxt(new Date(S.flags.inizioLavoro)); S.bis.umore = clamp(S.bis.umore + 15);
    log(`Embauché(e) comme ${l.nome} a ${Q(l.luogo).nome} ! Patron : ${S.capo.nome} ${S.capo.cognome}. Horaire ${orarioLavoro(l)}, ${giorniTxt(l)}. Premier jour : ${primo}.`, 'good');
    ui.modal = { tipo: 'esito', ok: true, titolo: '🎉 Félicitations, tu es embauché(e) !', html: `<p><b>${l.nome}</b> a ${Q(l.luogo).nome}</p><p style="font-style:italic">"${pick(['Bienvenue à bord. Ne me décevez pas.', 'On se voit à l\'heure, hein. Ici la ponctualité compte.', 'Tongasoa ! L\'équipe vous attend.'])}" — ${S.capo.nome} ${S.capo.cognome}, ${S.capo.gen === 'M' ? 'ton patron' : 'ta patronne'}</p>
      <div class="row"><span>📅 Premier jour</span><b>${primo} à ${hh(l.inizio)}</b></div><div class="row"><span>⏰ Horaire</span><b>${orarioLavoro(l)}</b></div><div class="row"><span>📆 Jours</span><b>${giorniTxt(l)}</b></div><div class="row"><span>💰 Paie</span><b>${Ar(l.paga)} Ar/${l.tipo === 'mese' ? 'mois' : 'jour'}</b></div><div class="row"><span>📍 Où</span><b>${Q(l.luogo).nome} (${distKm(S.q, l.luogo)} km d'ici)</b></div><div class="row"><span>👥 Collègue</span><b>${c.nome} ${c.cognome}</b></div>
      <p class="mut" style="margin-top:8px">${l.tipo === 'giorno' ? 'Tu es payé(e) en fin de service : si tu n\'y vas pas, tu ne gagnes rien.' : 'Salaire le 1er du mois, proportionnel aux services effectués. Retards et absences baissent la performance (sous 15 = licenciement).'} Moral +15.</p><h3>Comment s'est passé l'entretien</h3>${lista}` };
  },
  licenziati() { S.lavoro = 'nulla'; S.flags.inizioLavoro = null; log('Tu as démissionné.'); },
  iscriviti(liv) { const s = SCUOLE.find(x => x.liv === liv); if (S.edu < liv - 1) return toast('Tu dois d\'abord terminer le niveau précédent.'); if (!paga(s.costo)) return toast(`Inscription : ${Ar(s.costo)} Ar.`); S.scuola = { liv, giorni: 0, tot: s.mesi * 20, voti: 0 }; const prof = nuovoPNG('professore', { aff: 10, eta: rnd(35, 65) }); const comp = nuovoPNG('compagno di scuola', { aff: 20, eta: S.eta + rnd(-2, 2) }); S.png.push(prof, comp); log(`Inscrit(e) : ${s.nome}. Professeur : ${prof.nome}. Cours 4h lun–ven, ${s.mesi} mois.`, 'good'); },
  studia() { if (!S.scuola) return; if (S.flags.scuolaOggi === now().toDateString()) return toast('Tu as déjà assisté aux cours aujourd\'hui.'); avanza(240); S.flags.scuolaOggi = now().toDateString(); S.scuola.giorni++; const v = (S.bis.energia > 40 ? 1 : 0) + (S.bis.fame > 30 ? 1 : 0) + (ha('pc') ? 1 : 0) + (ha('libri') ? 0.5 : 0); S.scuola.voti += v; skillUp('intelligenza', 0.5 + v * 0.2); skillUp('sociale', 0.2); if (S.scuola.giorni % 20 === 0) log(`Examen mensuel réussi. Progression : ${Math.round(S.scuola.giorni / S.scuola.tot * 100)}%.`, 'info'); if (S.scuola.giorni >= S.scuola.tot) { const media = S.scuola.voti / S.scuola.tot; if (media >= 1.2) { S.edu = S.scuola.liv; log(`🎓 Tu as obtenu : ${EDU[S.edu]}!`, 'good'); S.scuola = null; } else { log(`Recalé(e) (moyenne ${media.toFixed(1)}). Tu refais les 3 derniers mois.`, 'bad'); S.scuola.giorni -= 60; S.scuola.voti *= 0.75; } } },
  patente() { if (!paga(250000)) return toast('L\'auto-école coûte 250.000 Ar.'); avanza(180); if (Math.random() < 0.6 + S.skill.intelligenza / 300) { S.patente = true; skillUp('guida', 20); log('🚗 Tu as eu ton permis !', 'good'); } else log('Recalé(e) à l\'examen de conduite.', 'bad'); },
  mobile(id, negozio) { const m = MOBILI.find(x => x.id === id); const pr = prezzo(m.prezzo, negozio === 'mercato' ? 'mercato' : 'epicerie'); if (!haCasa() && !['telefono'].includes(id)) return toast('Il faut un logement où le mettre.'); if (!paga(pr)) return toast('Argent insuffisant.'); S.mobili.push(id); avanza(20); log(`Acheté : ${m.nome} (${Ar(pr)} Ar).`, 'good'); if (id === 'telefono') S.png.push(nuovoPNG('sconosciuto', { aff: 10 })); },
  veicolo(id) { const v = VEICOLI.find(x => x.id === id); if (!paga(v.prezzo)) return toast('Argent insuffisant.'); if (id !== 'bici' && !S.patente) return toast('Il faut le permis.'); S.veicoli.push(id); S.veicolo = id; log(`Tu as acheté : ${v.nome}!`, 'good'); },
  affitta(id) { const c = CASE.find(x => x.id === id); if (c.tipo === 'terreno') { if (!paga(c.prezzo)) return toast('Tu n\'as pas assez d\'argent (essaie un prêt).'); S.proprieta.push(id); return log(`Tu as acheté un terrain à ${Q(c.q).nome} (${Ar(c.prezzo)} Ar). Reviens à l'agence pour lancer la construction.`, 'good'); } if (c.prezzo > 0) { if (!paga(c.prezzo)) return toast('Tu n\'as pas assez d\'argent (essaie un prêt à la banque).'); S.proprieta.push(id); S.casa = id; log(`🏠 Tu as ACHETÉ : ${c.nome} ! Plus de loyer.`, 'good'); } else { const cap = c.affitto * 2; if (!paga(cap)) return toast(`Il faut 2 mois de caution : ${Ar(cap)} Ar.`); S.casa = id; S.flags.arretrati = 0; log(`Tu as emménagé : ${c.nome}. Caution ${Ar(cap)} Ar. Loyer ${Ar(c.affitto)} Ar le 1er du mois.`, 'good'); } },
  costruisci(tid) { const t = CASE.find(x => x.id === tid); const costo = Math.round(28000000 * multCasa(Q(t.q)) / 500000) * 500000; if (S.cantiere) return toast('Tu as déjà un chantier en cours.'); if (!paga(costo, true)) return toast(`La construction coûte ${Ar(costo)} Ar (banque ?).`); S.proprieta = S.proprieta.filter(x => x !== tid); S.cantiere = { q: t.q, gg: 120 }; log(`🏗️ Chantier lancé à ${Q(t.q).nome}: ${Ar(costo)} Ar, 120 jours.`, 'good'); },
  apriConto() { if (!paga(10000)) return toast('Ouverture de compte : 10.000 Ar.'); S.banca = { saldo: 0, prestito: 0, rata: 0 }; S.png.push(nuovoPNG('bancario', { aff: 15 })); log('Compte ouvert à la BNI. Il rapporte 0,3%/mois et paie automatiquement loyer et factures.', 'good'); },
  deposita(n) { n = Math.min(n, S.soldi); if (n <= 0) return; S.soldi -= n; S.banca.saldo += n; toast(`Déposé ${Ar(n)} Ar`); },
  preleva(n) { n = Math.min(n, S.banca.saldo); if (n <= 0) return; S.soldi += n; S.banca.saldo -= n; toast(`Retiré ${Ar(n)} Ar`); },
  prestito(n) { if (S.banca.prestito > 0) return toast('Tu as déjà un prêt.'); const max = (lavoro().tipo === 'mese' ? lavoro().paga * 10 : 0) + (S.attivita ? 20000000 : 0) + S.banca.saldo * 3 + S.proprieta.length * 30000000; if (n > max) return toast(`Maximum accordé : ${Ar(max)} Ar (il faut un salaire fixe ou des garanties).`); S.banca.prestito = n * 1.2; S.banca.rata = n * 1.2 / 24; S.soldi += n; log(`Prêt de ${Ar(n)} Ar approuvé. 24 mensualités de ${Ar(S.banca.rata)} Ar.`, 'good'); },
  apriAttivita(id) { const a = ATTIVITA.find(x => x.id === id); if (S.attivita) return toast('Tu as déjà un commerce.'); if (a.auto && !S.veicolo) return toast('Il faut une voiture.'); if (!paga(a.costo)) return toast('Capital insuffisant (essaie la banque).'); avanza(240); S.attivita = { id, mese: 0, dip: false, q: S.q }; skillUp('business', 5); log(`Tu as ouvert : ${a.nome} a ${Q(S.q).nome} ! Ça rapporte chaque jour selon ta compétence business.`, 'good'); },
  gestisci() { avanza(300); skillUp('business', 1.2); skillUp('sociale', 0.3); const a = ATTIVITA.find(x => x.id === S.attivita.id); const extra = Math.round(a.base * 0.5); S.soldi += extra; S.attivita.mese += extra; log(`Tu as géré ${a.nome}: +${Ar(extra)} Ar en plus.`); },
  assumi() { if (!paga(300000)) return toast('Il faut 300.000 Ar.'); S.attivita.dip = true; const d = nuovoPNG('dipendente', { aff: 20 }); S.png.push(d); log(`Tu as embauché ${d.nome}.`, 'good'); },
  chiudiAttivita() { const a = ATTIVITA.find(x => x.id === S.attivita.id); S.soldi += Math.round(a.costo * 0.4); S.attivita = null; log('Tu as vendu le commerce (40% de la valeur).'); },
  medico() { if (!paga(20000)) return toast('La consultation coûte 20.000 Ar.'); avanza(120); if (S.malattie.length) { const m = S.malattie[0]; log(`Diagnostic : ${MALATTIE[m.tipo].nome}. ${cureMalattia(m.tipo)}`, 'info'); } else log('Consultation : tu vas bien. Plus de fruits et moins de THB.'); S.bis.salute = clamp(S.bis.salute + 5); },
  ricovero() { if (!paga(150000, true)) return toast('L\'hospitalisation coûte 150.000 Ar.'); avanza(24 * 60, { sonno: true }); S.malattie = []; S.bis.salute = clamp(S.bis.salute + 40); log('Hospitalisation à l\'HJRA : tu es guéri(e).', 'good'); },
  medicina(id) { const m = MEDICINE.find(x => x.id === id); const pr = prezzo(m.prezzo, 'epicerie'); if (!paga(pr)) return toast('Argent insuffisant.'); S.medicine[id] = (S.medicine[id] || 0) + 1; log(`Acheté : ${m.nome} (${Ar(pr)} Ar).`); },
  prendi(id) { const m = MEDICINE.find(x => x.id === id); if (!S.medicine[id]) return; S.medicine[id]--; if (id === 'vitamine') { S.bis.salute = clamp(S.bis.salute + 8); return log('Vitamines prises : santé +8.'); } const idx = S.malattie.findIndex(x => m.cura.includes(x.tipo)); if (idx < 0) return log(`Tu as pris ${m.nome} mais ce n'était pas nécessaire.`); S.malattie[idx].gg = Math.max(1, S.malattie[idx].gg - 3); S.bis.salute = clamp(S.bis.salute + 5); log(`${m.nome}: ${MALATTIE[S.malattie[idx].tipo].nome} -3 jours (il en reste ${S.malattie[idx].gg}).`, 'good'); },
  sport(tipo) { const c = { corsa: 0, calcio: 2000, palestra: 10000, piscina: 15000 }[tipo]; if (S.malattie.some(m => m.tipo === 'bronchite') && tipo !== 'corsa') return toast('Avec la bronchite tu n\'arrives pas à respirer : pas de sport.'); if (!paga(c)) return toast('Argent insuffisant.'); avanza(90, { sport: true }); skillUp('fitness', tipo === 'palestra' ? 2.5 : 1.8); S.bis.umore = clamp(S.bis.umore + 10); S.bis.energia = clamp(S.bis.energia - 15); S.bis.fame = clamp(S.bis.fame - 10); if (tipo === 'calcio' && Math.random() < 0.3) { const p = nuovoPNG('amico', { aff: 25 }); S.png.push(p); log(`Au foot tu as rencontré ${p.nome}.`, 'info'); } log(`Sport : ${tipo}. Forme +.`); },
  bar() { const pr = prezzo(12000, 'mercato'); if (!paga(pr)) return toast(`Il faut ${Ar(pr)} Ar.`); avanza(150); S.bis.umore = clamp(S.bis.umore + 18); skillUp('sociale', 1.5); if (Math.random() < 0.5) { const p = nuovoPNG('sconosciuto', { aff: 20, eta: S.eta + rnd(-4, 6) }); S.png.push(p); log(`Au bar tu as rencontré ${p.nome} ${p.cognome} (${p.eta} ans).`, 'info'); } else log('Soirée au bar avec du salegy et de la THB.'); },
  chiesa() { avanza(120); S.bis.umore = clamp(S.bis.umore + 10); skillUp('sociale', 0.5); if (Math.random() < 0.4) { const p = nuovoPNG('amico', { aff: 25, extra: { tratti: ['religioso', pick(TRATTI)] } }); S.png.push(p); log(`Après la messe tu as parlé avec ${p.nome}.`, 'info'); } else log('Messe à la FJKM : chants et paix intérieure.'); },
  rova() { if (!paga(10000)) return toast('Il faut 10 000 Ar.'); avanza(120); S.bis.umore = clamp(S.bis.umore + 15); skillUp('intelligenza', 0.8); log('Tu as visité le Rova de Manjakamiadana : l\'histoire des rois merina et tout Tana à tes pieds.'); },
  lago() { avanza(60); S.bis.umore = clamp(S.bis.umore + 8); S.bis.energia = clamp(S.bis.energia + 3); log('Promenade autour du lac Anosy sous les jacarandas.'); },
  regalo(id, tipo) { const p = png(id); const c = { fiori: 5000, gioiello: 200000 }[tipo]; if (!paga(c)) return toast('Argent insuffisant.'); const b = { fiori: 5, gioiello: 20 }[tipo]; p.aff = clamp(p.aff + b); if (p.rom > 0) p.rom = clamp(p.rom + b); avanza(30); log(`Cadeau (${tipo}) a ${p.nome} : affinité +${b}.`, 'good'); },
  uscita(id) { const p = png(id); if (!paga(15000)) return toast('Une sortie coûte ~15.000 Ar.'); avanza(180); p.aff = clamp(p.aff + 8); skillUp('sociale', 1); S.bis.umore = clamp(S.bis.umore + 10); if (p.eta >= 18) p.rom = clamp(p.rom + 6); log(`Sortie avec ${p.nome} : hotely et promenade.`, 'good'); },
  fidanzati(id) { const p = png(id); if (S.partner) return toast('Tu es déjà en couple.'); if (p.aff < 55 || p.rom < 25) return toast('Ce n\'est pas encore le moment : sortez plus souvent ensemble.'); if (Math.random() < 0.7) { p.stato = 'fidanzato'; S.partner = id; log(`💕 ${p.nome} a dit oui ! Vous êtes maintenant en couple.`, 'good'); } else { p.aff -= 10; log(`${p.nome} : « Je t'aime bien, mais pas comme ça… »`, 'bad'); } },
  proponi(id) { const p = png(id); if (p.aff < 75 || p.rom < 60) return toast('Il faut plus d\'affinité et de romantisme.'); if (!paga(200000)) return toast('La bague coûte 200.000 Ar.'); if (Math.random() < 0.8) { p.stato = 'promesso'; log(`💍 ${p.nome} a accepté ! Va à la Commune (Anosy) pour le mariage.`, 'good'); } else log(`${p.nome} a besoin de temps.`, 'bad'); },
  sposa(id, tipo) { const p = png(id); const c = { semplice: 500000, media: 3000000, grande: 15000000 }[tipo]; if (!paga(c, true)) return toast(`Ça coûte ${Ar(c)} Ar.`); p.stato = 'sposato'; S.sposato = true; p.rom = 100; p.aff = 100; S.bis.umore = 100; avanza(600); S.png.forEach(x => x.aff = clamp(x.aff + (tipo === 'grande' ? 15 : 5))); log(`💒 Mariage (${tipo}) avec vodiondry à la famille ! Tu es maintenant marié(e) avec ${p.nome} ${p.cognome}.`, 'good'); },
  figlio(id) { const p = png(id); if (S.gravidanza) return toast('Un bébé est déjà en route.'); if (p.aff < 60) return toast(`${p.nome} n'est pas convaincu(e).`); if (Math.random() < 0.5) { S.gravidanza = { gg: 270, con: id }; log('🤰 Un bébé est en route ! Il naîtra dans 9 mois.', 'good'); } else log('Cette fois ça n\'a pas marché.'); },
  lascia(id) { const p = png(id); const eraSposato = S.sposato; p.stato = 'ex'; p.aff = 10; S.partner = null; S.sposato = false; S.bis.umore -= 20; if (eraSposato && S.banca) S.banca.saldo = Math.round(S.banca.saldo / 2); log(`Tu as quitté ${p.nome}.${eraSposato ? ' Le divorce te coûte la moitié de tes économies.' : ''}`, 'bad'); },
  giocaFigli() { avanza(90); S.bis.umore = clamp(S.bis.umore + 15); log(`Tu as joué avec ${S.figli.map(f => f.nome).join(', ')}.`, 'good'); },
  compleannoPNG(id) { const p = png(id); if (!paga(20000)) return toast('Il faut 20.000 Ar.'); p.aff = clamp(p.aff + 12); avanza(180); log(`Tu as fêté l'anniversaire de ${p.nome}. Affinité +12.`, 'good'); },
  elemosina(ore) {
    const q = Q(S.q); const t = q.tier; const h = ora();
    // per tier: probabilità che un passante dia qualcosa, taglio tipico delle monete, passanti/ora
    const P = [null, { p: 1 / 7, tagli: [200, 500, 500, 1000], pass: 11 }, { p: 1 / 10, tagli: [500, 500, 1000, 2000], pass: 9 }, { p: 1 / 16, tagli: [1000, 1000, 2000, 5000], pass: 7 }, { p: 1 / 28, tagli: [2000, 5000, 5000, 10000], pass: 5 }, { p: 1 / 45, tagli: [5000, 10000, 10000, 20000], pass: 3 }][t];
    let passanti = P.pass * ore; if (h < 7 || h >= 20) passanti *= 0.3; else if (h >= 11 && h <= 14) passanti *= 1.4; if (giornoIdx() === 6 && S.loc !== 'chiesa') passanti *= 0.6;
    let prob = P.p * (S.bis.igiene < 30 ? 1.25 : S.bis.igiene > 70 ? 0.6 : 1) * (S.figli.length ? 1.2 : 1) * (S.malattie.length ? 1.15 : 1) * (S.eta >= 50 ? 1.2 : 1);
    if (S.flags.elemosinaOggi === now().toDateString() + q.id) prob *= 0.5; // stessa gente già passata
    passanti = Math.round(passanti); let tot = 0, donatori = 0;
    for (let i = 0; i < passanti; i++) if (Math.random() < prob) { donatori++; tot += pick(P.tagli); }
    if (t >= 4 && Math.random() < 0.15 * ore) { const gp = Math.round(tot * 0.5); avanza(ore * 60); S.bis.umore = clamp(S.bis.umore - 12 - 3 * ore); S.soldi += tot - gp; log(`Aumône à ${q.nome} : les gardiens privés t'ont chassé(e) au bout d'un moment et « retenu » ${Ar(gp)} Ar. Récolté ${Ar(tot - gp)} Ar de ${donatori} personnes sur ${passanti}.`, 'bad'); S.flags.elemosinaOggi = now().toDateString() + q.id; return; }
    if (t <= 2 && Math.random() < 0.05 * ore && tot > 0) { avanza(ore * 60); S.bis.umore = clamp(S.bis.umore - 15); log(`Aumône à ${q.nome} : tu avais récolté ${Ar(tot)} Ar mais un autre mendiant plus costaud t'a tout pris. C'est ça, Isotry.`, 'bad'); S.flags.elemosinaOggi = now().toDateString() + q.id; return; }
    avanza(ore * 60); S.soldi += tot; S.bis.umore = clamp(S.bis.umore - 4 * ore); S.bis.igiene = clamp(S.bis.igiene - 3 * ore); skillUp('sociale', 0.1 * ore);
    S.png.forEach(pp => { if (pp.aff > 40 && Math.random() < 0.05 * ore) { pp.aff = clamp(pp.aff - 5); log(`${pp.nome} t'a vu(e) faire la manche. Affinité -5.`, 'bad'); } });
    S.flags.elemosinaOggi = now().toDateString() + q.id;
    log(`Aumône à ${q.nome} pendant ${durata(ore * 60)}: ${donatori} personnes sur ${passanti} t'ont donné quelque chose → <b>+${Ar(tot)} Ar</b>. Moral -${4 * ore}.`, tot > 0 ? 'good' : 'bad');
  },
  lavoretto(idx, opz) {
    const j = lavorettiOggi()[idx]; const l = LAVORETTI.find(x => x.id === j.id); const q = Q(S.q);
    if (j.fatto) return toast('Déjà fait.');
    if (l.bucato && !opz) { ui.modal = { tipo: 'bucato', idx }; return; }
    if (l.fit && S.skill.fitness < l.fit) return toast(`Il faut forme ≥ ${l.fit} : « Tu es trop chétif/ve pour ça. »`);
    if (l.soc && S.skill.sociale < l.soc) return toast(`Il faut social ≥ ${l.soc} : on ne te fait pas encore confiance.`);
    if (l.casa && S.skill.casa < l.casa) return toast(`Il faut compétence maison ≥ ${l.casa}.`);
    if (l.edu && S.edu < l.edu) return toast(`Il faut au moins : ${EDU[l.edu]}.`);
    if (S.bis.energia < l.fatica * j.ore * 0.8) return toast('Tu es trop fatigué(e) pour tenir jusqu\'au bout.');
    const h = ora(); if (h > j.inizio + 2) { j.fatto = true; return toast(`Trop tard : ils ont déjà trouvé quelqu'un d'autre (c'était à ${hh(j.inizio)}).`); }
    if (h < j.inizio) { avanza((j.inizio - h) * 60 - now().getMinutes()); log(`Tu as attendu le début du petit boulot (${hh(j.inizio)}).`); }
    if (l.bucato) {
      const b = j.bucato; let costo = 0, extraB = '', tempoExtra = 0;
      if (opz === 'casa') { extraB = ' Tu as lavé dans la cour de la famille, sur leur bassin : l\'eau et la place étaient à eux.'; }
      else {
        // bassin pubblico: ritiro, acqua a bidoni, posto, consegna
        const bidoni = Math.ceil(b.capi / 8); const prezzoBidone = q.tier >= 4 ? 200 : 100; costo = bidoni * prezzoBidone;
        if (!paga(costo)) return toast(`Il te faut ${Ar(costo)} Ar pour ${bidoni} bidons d'eau à la pompe publique.`);
        const affollato = Math.random() < (ora() >= 8 && ora() <= 11 ? 0.45 : 0.15);
        if (affollato) { tempoExtra = rnd(30, 90); extraB = ` Le bassin public était plein de mpanasa : tu as attendu ${tempoExtra} min qu'une place se libère.`; }
        extraB += ` Tu as pris le linge chez le client, acheté ${bidoni} bidons d'eau à la pompe (${Ar(costo)} Ar), lavé au bassin public et tout rendu plié.`;
        if (Math.random() < 0.06) { extraB += ' <b>Une chemise a disparu pendant le séchage</b> : le client te l\'a retenue sur la paie (-2.000 Ar).'; j.paga = Math.max(500, j.paga - 2000); }
        if (S.pantoBagnati === 0 && Math.random() < 0.3) extraB += ' Pendant ce temps tu as aussi étendu ton propre linge.';
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
    if (r < 0.08) { guad = Math.round(guad * 0.6 / 100) * 100; extra = ' Le patron a « oublié » une partie : il t\'a payé moins que convenu.'; S.bis.umore = clamp(S.bis.umore - 6); }
    else if (r < 0.2) { const m = pick([500, 1000, 2000]); guad += m; extra = ` Pourboire de ${Ar(m)} Ar !`; }
    else if (r < 0.3 && ['evento', 'trasloco', 'cantiere'].includes(l.id)) { S.bis.fame = clamp(S.bis.fame + 35); extra = ' On t\'a aussi donné une assiette de vary sy laoka.'; }
    if (l.id === 'trasloco' && Math.random() < 0.04) { S.bis.salute = clamp(S.bis.salute - 8); extra += ' Tu t\'es fait mal au dos (santé -8).'; }
    S.soldi += guad; j.fatto = true; skillUp(l.skill, 0.5); skillUp('sociale', 0.3);
    S.flags.rep = S.flags.rep || {}; S.flags.rep[S.q] = (S.flags.rep[S.q] || 0) + 1;
    if (Math.random() < 0.15) { const pp = nuovoPNG(pick(['vicino', 'sconosciuto', 'venditore']), { aff: 25, extra: { quartiere: q.nome } }); S.png.push(pp); extra += ` Tu as rencontré ${pp.nome}, qui te rappellera pour d'autres petits boulots.`; }
    if (l.bucato) { extra = (j.extraB || '') + extra; if (j.costoB) extra += ` Net après l'eau : ${Ar(guad - j.costoB)} Ar.`; skillUp('casa', 0.5); }
    log(`Petit boulot à ${q.nome}: ${l.nome}, ${j.ore}h → +${Ar(guad)} Ar.${extra}`, 'good');
    ui.modal = { tipo: 'esito', ok: true, titolo: `${l.icon} Petit boulot terminé`, html: `<p><b>${l.nome}</b> a ${q.nome}, ${j.ore} heures.</p><div class="row"><span>💰 Gain</span><b>+${Ar(guad)} Ar</b></div><div class="row"><span>⚡ Énergie</span><b>-${Math.round(l.fatica * j.ore * 0.5 + 5 * j.ore)}</b></div><div class="row"><span>🧼 Hygiène</span><b>-${Math.round(l.igiene * j.ore * 0.5 + 2 * j.ore)}</b></div><div class="row"><span>📈 ${SKILL_LBL[l.skill]}</span><b>+0.5</b></div><div class="row"><span>🗣️ Bouche-à-oreille à ${q.nome}</span><b>${S.flags.rep[S.q]} petits boulots</b></div>${extra ? `<p class="mut">${extra}</p>` : ''}` };
  },
  borseggia() { avanza(60); if (Math.random() < 0.5) { const v = rnd(5000, 40000); S.soldi += v; log(`Tu as volé un portefeuille : +${Ar(v)} Ar.`, 'bad'); S.bis.umore -= 5; } else { S.fedina++; log('Attrapé(e) par la police ! 3 nuits en cellule et 100.000 Ar d\'amende.', 'bad'); paga(100000, true); avanza(72 * 60, { sonno: true }); S.bis.igiene = 10; } },
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
  const e = stimaViaggio(qid, mezzo); if (!e) return; if (!paga(e.costo)) return toast('Tu n\'as pas l\'argent pour le transport.');
  const v = S.veicolo && VEICOLI.find(x => x.id === S.veicolo); const txt = { piedi: 'à pied', taxibe: 'en taxi-be', taxi: 'en taxi', proprio: v ? 'avec ' + v.nome : '' }[mezzo];
  if (mezzo === 'piedi') skillUp('fitness', 0.1 * e.km); if (mezzo === 'proprio') skillUp('guida', 0.2);
  if (mezzo === 'taxibe' && Math.random() < 0.03) { S.soldi = Math.max(0, S.soldi - 10000); log('Un pickpocket dans le taxi-be t\'a piqué 10.000 Ar.', 'bad'); }
  avanza(e.min); S.bis.energia = clamp(S.bis.energia - e.energia); S.bis.igiene = clamp(S.bis.igiene - e.igiene); S.bis.umore = clamp(S.bis.umore + e.umore);
  S.q = qid; S.loc = null; log(`Tu es allé(e) à ${Q(qid).nome} ${txt}: ${e.min} min${e.traffico ? ' (embouteillages !)' : ''}, ${e.costo ? Ar(e.costo) + ' Ar' : 'gratuit'}, énergie -${e.energia}.`);
  ui.modal = null; ui.tab = 'home'; render(); salva();
}
function poiDisponibili(qid) { const q = Q(qid); const l = [...q.poi]; if (haCasa() && casaQ() === qid) l.unshift('casa'); if (S.lavoro !== 'nulla' && lavoro().luogo === qid) l.unshift('lavoro'); if (S.attivita && S.attivita.q === qid) l.push('attivita'); return l; }
function entra(poi) { const min = poi === 'casa' ? 3 : 7; avanza(min); S.loc = poi; S.bis.energia = clamp(S.bis.energia - 0.5); ui.modal = null; render(); salva(); }

/* ---------- AI / DIALOGHI ---------- */
function ruoloTxt(p) { const map = { amico: 'ami(e)', vicino: 'voisin(e)', venditore: 'vendeur au marché', poliziotto: 'agent de police', medico: 'médecin de l\'hôpital HJRA', sconosciuto: 'connaissance', collega: 'collègue de travail', capo: 'patron au travail', professore: 'professeur(e)', 'compagno di scuola': 'camarade de classe', bancario: 'employé(e) de banque', dipendente: 'ton employé(e)' }; return map[p.ruolo] || p.ruolo; }
function sistemaPrompt(p) {
  const l = lavoro();
  return `Tu es ${p.nome} ${p.cognome}, ${p.eta} ans, ${p.gen === 'M' ? 'homme' : 'femme'}, tu vis à ${p.quartiere}, Antananarivo (Madagascar). Rôle envers le joueur : ${ruoloTxt(p)}${p.stato !== 'conoscente' ? ' e ' + STATO_LBL[p.stato] : ''}. Caractère : ${trattiTxt(p)}. Affinité avec le joueur : ${p.aff}/100${p.rom ? ', attirance ' + p.rom + '/100' : ''}.
Le joueur est ${S.nome}, ${S.eta} ans, ${S.gen === 'M' ? 'homme' : 'femme'}, travail : ${l.nome}${l.id !== 'nulla' ? ' (' + orarioLavoro(l) + ', ' + giorniTxt(l) + ')' : ''}, logement : ${casa().nome}, diplôme : ${EDU[S.edu]}, argent en poche ${Ar(S.soldi)} Ar${S.sposato ? ', marié(e)' : S.partner ? ', en couple' : ''}${S.figli.length ? ', ' + S.figli.length + ' enfants' : ''}. Il se trouve maintenant à ${Q(S.q).nome}. Moral ${Math.round(S.bis.umore)}/100, hygiène ${Math.round(S.bis.igiene)}/100${S.malattie.length ? ', malade de ' + S.malattie.map(m => MALATTIE[m.tipo].nome).join(', ') : ''}. Heure : ${dataStr()}.
Prix réels du jeu : riz 700 Ar/kapoaka au marché (800 à l'épicerie), zébu 3.500 Ar/250g, tomates 500 Ar/toko, huile 1.000 Ar/sachet, mofo gasy 200 Ar dans les quartiers populaires / 300 dans les moyens / 500 à Ivandry, vary sy laoka petit 2.500 Ar, complet 3.500-5.500 (jusqu'à 14-20.000 dans les hotely chics d'Ankorondrano/Ivandry), taxi-be 600 Ar, chambre à Isotry 60.000 Ar/mois, studio 67 Ha 100-150.000, appartement Ankorondrano ~1.300.000, villa Ivandry 4.500.000.
Règles : réponds TOUJOURS en français (il représente le malgache parlé dans la vie réelle ; tu peux glisser rarement des mots malgaches comme « salama », « misaotra », « mora mora », « vazaha », « azafady »). Sois extrêmement réaliste et cohérent avec la vie quotidienne d'Antananarivo (taxi-be, JIRAMA, riz, kapoaka, prix en Ariary, famille, église, fady, fihavanana). Reste dans le personnage, tu n'es pas un assistant. Réponses courtes : 1-3 phrases, parlé naturel. Tu peux refuser, te fâcher, demander des services, faire des commérages, donner des infos sur le travail/les logements/les prix/les quartiers. Ne propose jamais de grosses sommes gratuites. À la fin, ajoute sur une ligne le tag [AFF:n] avec n entre -3 et +3 selon à quel point la phrase du joueur t'a plu.`;
}
function fallbackRisposta(p, testo) {
  const t = testo.toLowerCase(); let aff = 0;
  const cortese = /grazie|misaotra|per favore|azafady|salama|buongiorno|ciao|come stai|merci|s'il te|s'il vous|bonjour|salut|ça va|comment vas/.test(t);
  const rude = /stupid|idiot|vaff|merda|cretin|brutt|connard|con\b|merde|salaud|moche|imbécile/.test(t);
  if (cortese) aff = 1; if (rude) aff = -3;
  const tono = p.aff > 60 ? 'caldo' : p.aff > 30 ? 'neutro' : 'freddo';
  const R = {
    amico: { caldo: ['Namako ! Toujours un plaisir. Dis-moi, ça va le travail ?', 'Allez, ce soir brochettes à Behoririka, c\'est moi qui offre… si tu as 2.000 Ar à me prêter, haha.', 'Ma mère demande toujours de tes nouvelles. Passe manger chez nous dimanche.'], neutro: ['Hé, salut. Ça va ? Moi je cours après le taxi-be comme toujours.', 'J\'ai entendu qu\'on cherche du monde à la zone franche d\'Ankorondrano : regarde le panneau à Analakely.'], freddo: ['Ah, c\'est toi. Tu donnes des nouvelles seulement quand tu as besoin de quelque chose.'] },
    vicino: { caldo: ['Voisin ! La JIRAMA a encore coupé l\'eau ce matin, tu as fait des réserves ?', 'Si tu veux je surveille ta maison quand tu n\'es pas là.'], neutro: ['Salama. Le propriétaire est passé hier demander après toi.', 'Tu peux baisser la musique le soir ? Les enfants dorment.'], freddo: ['Je n\'ai pas le temps de bavarder. Et étends ton linge de ton côté de la cour.'] },
    venditore: { caldo: ['Pour toi le riz je le fais à 650 le kapoaka, prix de famille !', 'Aujourd\'hui j\'ai des tomates fraîches d\'Antsirabe, 500 le toko. Prends, prends.'], neutro: ['Qu\'est-ce qu\'il te faut ? Riz, haricots, huile… tout frais, mora mora.', 'Le prix c\'est ça, le carburant a encore augmenté.'], freddo: ['Si tu n\'achètes pas, laisse la place aux autres clients.'] },
    poliziotto: { caldo: ['Tout est calme. Fais attention le soir à Isotry.'], neutro: ['Vos papiers, s\'il vous plaît. Carte d\'identité.', 'Circulez. Ce n\'est pas une zone de stationnement.'], freddo: ['J\'ai déjà vu ta tête. Ne me fais pas me rappeler où.'] },
    medico: { caldo: ['Comment va la santé ? Rappelle-toi : eau bouillie, moustiquaire et repos.'], neutro: ['La consultation coûte 20.000 Ar. Symptômes ? Fièvre, frissons, diarrhée ?', 'Avec la saison des pluies le paludisme augmente. Achetez des moustiquaires.'], freddo: ['La file d\'attente est dehors, comme pour tout le monde.'] },
    capo: { caldo: ['Bon travail ce mois-ci. Continue comme ça et on parlera d\'une augmentation.', 'Tu peux fermer ce soir ? Je te fais confiance.'], neutro: ['Rappelle-toi : on commence à l\'heure, pas un quart d\'heure après.', 'Les objectifs du mois sont là. On verra.'], freddo: ['Encore un retard et tu trouves la lettre de licenciement sur ton bureau.'] },
    collega: { caldo: ['Pause déjeuner ensemble à l\'hotely en bas ? Le romazava est délicieux.', 'Je te couvre si tu arrives en retard demain, t\'inquiète.'], neutro: ['Le patron est de mauvaise humeur aujourd\'hui, attention.', 'Tu as fini le rapport ? Il le veut avant 17h.'], freddo: ['Fais ton travail et je fais le mien.'] },
    professore: { caldo: ['Tu es parmi les meilleurs de la classe. Pense à l\'université.'], neutro: ['Tu as révisé pour l\'interro ? On va voir.', 'Le devoir est pour lundi. Pas d\'excuses.'], freddo: ['Avec cette assiduité tu ne passeras pas l\'examen.'] },
    'compagno di scuola': { caldo: ['On révise ensemble ce soir chez moi ? Après on regarde le foot.'], neutro: ['Tu as compris le cours d\'aujourd\'hui ? Moi rien.', 'Tu me prêtes tes notes ?'], freddo: ['Demande à quelqu\'un d\'autre.'] },
    bancario: { caldo: ['Votre compte va bien. Vous voulez parler d\'un prêt immobilier ?'], neutro: ['Pour le prêt il faut un contrat de travail et trois fiches de paie.', 'Le compte rapporte 0,3% par mois. Guichet 3 pour les retraits.'], freddo: ['Prenez un numéro et attendez votre tour.'] },
    dipendente: { caldo: ['Patron, aujourd\'hui on a beaucoup vendu ! Les clients t\'adorent.'], neutro: ['Patron, il manque de la monnaie en caisse. Il faut des pièces.', 'Je peux avoir une avance sur salaire ?'], freddo: ['Tu ne me paies pas depuis des semaines. Ça ne va pas.'] },
    sconosciuto: { caldo: ['Content(e) de te revoir ! On prend un café au Colbert ?'], neutro: ['Salama. On s\'est déjà vus, non ? Au taxi-be peut-être.', 'Tu es de quel quartier ? Moi j\'habite à Ambanidia.'], freddo: ['Désolé(e), je ne crois pas te connaître.'] },
  };
  let pool = (R[p.ruolo] || R.sconosciuto)[tono] || R.sconosciuto.neutro;
  if (/lavoro|assum|cerc|travail|emploi|boulot|embauch/.test(t)) pool = ['On cherche du monde à la zone franche et comme serveurs à Analakely. Regarde le panneau 📋 à Analakely et postule.', 'Sans le BACC c\'est dur. Mais le travail journalier au marché ne manque jamais : lun–sam, le dimanche pas de paie.'];
  if (/casa|affitto|stanza|terreno|maison|loyer|chambre|terrain|logement/.test(t)) pool = ['À Isotry une chambre coûte 60.000 par mois, mais la nuit évite le coin. Passe par une agence à Analakely ou Antanimena.', 'Le propriétaire veut toujours deux mois de caution, c\'est comme ça partout à Tana. Terrains pas chers à Itaosy.'];
  if (/lavoretti|trasloc|facchin|consegn|tselika|petits boulots|déménag|livraison|porteur/.test(t)) pool = ['Si tu as des heures libres, montre-toi dans le quartier : il y a toujours un déménagement ou un camion à décharger, 2.000 Ar de l\'heure. Plus on te connaît, plus on t\'appelle.', 'Mon cousin fait le porteur aux déménagements à 67 Ha, on l\'appelle par le bouche-à-oreille. Sans téléphone par contre on ne te trouve que si tu es sur place.'];
  if (/elemosin|mendic|aumône|mendi/.test(t)) pool = ['À Analakely à l\'heure du déjeuner on récolte quelque chose. À Ivandry les gardiens te chassent avant même que tu tendes la main.', 'Mieux vaut porter des paquets au marché que tendre la main, crois-moi. Mais si tu as faim, l\'église le dimanche aide.'];
  if (/soldi|prest|ariary|vola|argent|prêt|prête/.test(t)) pool = ['De l\'argent ? Haha, si j\'en avais je ne serais pas là. Essaie la banque ou MVola.', 'Je peux te prêter 5.000 Ar mais je les veux vendredi.', 'Moi aussi je suis fauché(e) jusqu\'à la paie.'];
  if (/amore|ti amo|bell|uscire|fidanz|amour|je t'aime|beau|belle|sortir|fiancé|copain|copine/.test(t)) { if (p.rom > 30) pool = ['Tu me fais rougir… oui, sortons. Mais ma mère veut te rencontrer.', 'Toi aussi tu me plais. Mais doucement, mora mora.']; else pool = ['Euh… on se connaît à peine. Discutons d\'abord un peu.', 'Haha, tu es direct(e). On verra comment ça se passe.']; }
  if (/malat|febbre|medic|malad|fièvre|médec|docteur/.test(t)) pool = ['Va à la pharmacie, le paracétamol coûte 2.000 Ar. Si tu as de gros frissons, c\'est le paludisme : cours à l\'HJRA à Ampefiloha.'];
  if (/prezz|riso|kapoaka|mercato|prix|riz|marché/.test(t)) pool = ['Le riz au marché d\'Andravoahangy est à 650 le kapoaka, à l\'épicerie en bas de chez toi 800. Ça vaut le coup de faire le tour.', 'À Ivandry tout coûte le double, c\'est pour les vazaha.'];
  if (rude) pool = ['Mais comment oses-tu ? Tsy mety izany !', 'On ne me parle pas comme ça. Adieu.'];
  return { text: pick(pool), aff };
}
async function parla(p, testo) {
  p.storia.push({ role: 'user', content: testo });
  let out = null;
  try { const r = await fetch('/api/chat', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ system: sistemaPrompt(p), messages: p.storia.slice(-10) }) }); const j = await r.json(); if (j.text) out = j.text; ui.aiActive = j.ai; } catch (e) {}
  let aff = 0;
  if (out) { const m = out.match(/\[AFF:\s*([+-]?\d)\]/i); if (m) { aff = parseInt(m[1]); out = out.replace(m[0], '').trim(); } else aff = 1; }
  else { const f = fallbackRisposta(p, testo); out = f.text; aff = f.aff; }
  p.aff = clamp(p.aff + aff); if (p.rom > 0 || /amore|bell/.test(testo)) p.rom = clamp((p.rom || 0) + Math.max(0, aff));
  p.storia.push({ role: 'assistant', content: out }); skillUp('sociale', 0.3); avanza(5);
  return out;
}

/* ---------- SALVATAGGIO ---------- */
const LS = { get(k) { try { return localStorage.getItem(k); } catch (e) { return null; } }, set(k, v) { try { localStorage.setItem(k, v); } catch (e) {} }, del(k) { try { localStorage.removeItem(k); } catch (e) {} } };
// Codice giocatore: ogni telefono/browser ha il suo slot sul server (così più amici possono giocare sullo stesso link).
function codiceGiocatore() { let c = LS.get('mrls_pid'); if (!c || !/^[A-Z0-9-]{4,}$/.test(c)) { c = nuovoCodice(); LS.set('mrls_pid', c); } return c; }
function nuovoCodice() { const A = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'; let c = ''; for (let i = 0; i < 8; i++) c += A[Math.floor(Math.random() * A.length)]; return c.slice(0, 4) + '-' + c.slice(4); }
function cambiaCodice(c) { c = String(c || '').toUpperCase().replace(/[^A-Z0-9]/g, ''); if (c.length < 6) return toast('Code trop court.'); LS.set('mrls_pid', c.slice(0, 4) + '-' + c.slice(4, 12)); return true; }
async function salva() { if (!S) return; LS.set('tanalife', JSON.stringify(S)); try { await fetch('/api/save', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ slot: codiceGiocatore(), state: S }) }); } catch (e) {} }
function nomeFileSalvataggio() { const d = new Date(); const p = n => String(n).padStart(2, '0'); return `MRLS-${(S.nome || 'partita').replace(/[^\w]+/g, '_')}-g${S.stat.gg}-${d.getFullYear()}${p(d.getMonth() + 1)}${p(d.getDate())}-${p(d.getHours())}${p(d.getMinutes())}.json`; }
function salvaSuFile() { if (!S) return; salva(); ui.modal = { tipo: 'salvafile', data: JSON.stringify(S), nome: nomeFileSalvataggio() }; render(); }
function condividiFile(data, nome) { try { const file = new File([data], nome, { type: 'application/json' }); if (!navigator.share) throw new Error('noshare'); return navigator.share({ files: [file], title: nome }).then(() => toast('Fait.')).catch(e => { if (e && e.name === 'AbortError') return; toast('Partage bloqué ici : ouvre le jeu directement dans Safari (pas dans l\'aperçu) ou utilise Télécharger / Copier.'); }); } catch (e) { toast('Partage indisponible sur ce navigateur : utilise Télécharger ou Copier.'); } }
function salvaConPicker(data, nome) { window.showSaveFilePicker({ suggestedName: nome, types: [{ description: 'Sauvegarde MRLS', accept: { 'application/json': ['.json'] } }] }).then(async h => { const w = await h.createWritable(); await w.write(data); await w.close(); toast('Sauvegardé : ' + nome); ui.modal = null; render(); }).catch(e => { if (!e || e.name !== 'AbortError') scaricaFile(data, nome); }); }
function copiaSalvataggio(data) { const done = () => toast('Sauvegarde copiée : colle-la dans Notes ou dans un fichier texte.'); if (navigator.clipboard && navigator.clipboard.writeText) navigator.clipboard.writeText(data).then(done, () => { const t = $('svTxt'); if (t) { t.focus(); t.select(); document.execCommand('copy'); done(); } }); else { const t = $('svTxt'); if (t) { t.focus(); t.select(); document.execCommand('copy'); done(); } } }
function importaTesto() { const t = $('ldTxt'); if (!t || !t.value.trim()) return toast('Colle d\'abord le texte de la sauvegarde.'); try { const s = JSON.parse(t.value.trim()); if (!s || !s.nome || !s.bis) throw 0; S = migra(s); ui.modal = null; ui.tab = 'home'; render(); salva(); toast('Partie chargée : ' + S.nome); } catch (e) { toast('Texte invalide.'); } }
function scaricaFile(data, nome) { const blob = new Blob([data], { type: 'application/json' }); const url = URL.createObjectURL(blob); const a = document.createElement('a'); a.href = url; a.download = nome; document.body.appendChild(a); a.click(); setTimeout(() => { a.remove(); URL.revokeObjectURL(url); }, 4000); toast('Fichier téléchargé : ' + nome); }
function caricaDaFile() { const inp = document.createElement('input'); inp.type = 'file'; inp.accept = '.json,application/json'; inp.onchange = () => { const f = inp.files[0]; if (!f) return; const r = new FileReader(); r.onload = () => { try { const s = JSON.parse(r.result); if (!s || !s.nome || !s.bis) throw 0; S = migra(s); ui.modal = null; ui.tab = 'home'; render(); salva(); toast('Partie chargée : ' + S.nome); } catch (e) { toast('Fichier invalide.'); } }; r.readAsText(f); }; inp.click(); }
async function carica() { let s = null; try { const r = await fetch('/api/load?slot=' + encodeURIComponent(codiceGiocatore())); if (r.ok) s = (await r.json()).state; } catch (e) {} if (!s) { const l = LS.get('tanalife'); if (l) s = JSON.parse(l); } return s ? migra(s) : null; }

/* ---------- UI ---------- */
function esc(s) { return String(s).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c])); }
function conferma(titolo, testo, fn, okLabel = 'Confirmer') { ui.modal = { tipo: 'conferma', titolo, testo, fn, okLabel }; render(); }
function act(label, fn, small = '', dis = false) { const id = 'a' + Math.random().toString(36).slice(2, 8); setTimeout(() => { const e = $(id); if (e) e.onclick = () => { fn(); render(); salva(); }; }); return `<button class="act" id="${id}" ${dis ? 'disabled' : ''}><span>${label}</span><small>${small}</small></button>`; }
function btn(label, fn, cls = 'pri') { const id = 'b' + Math.random().toString(36).slice(2, 8); setTimeout(() => { const e = $(id); if (e) e.onclick = () => { fn(); render(); }; }); return `<button class="${cls}" id="${id}">${label}</button>`; }
function renderHeader() {
  $('hName').textContent = S.nome; const hav = $('hAv'); if (hav) { hav.src = AVATAR_BASE + (S.avatar || 'a1') + '.jpg'; hav.style.display = 'block'; } $('hAge').textContent = `${S.eta} ans · ${lavoro().nome}`; $('hTime').textContent = dataStr(); $('hMoney').textContent = Ar(S.soldi);
  const ic = { fame: '🍚', energia: '⚡', igiene: '🧼', vescica: '🚽', umore: '🙂', salute: '❤️' };
  $('bars').innerHTML = Object.entries(S.bis).map(([k, v]) => `<div class="bar ${v < 25 ? 'low' : ''}">${ic[k]} ${Math.round(v)}<i><b style="width:${v}%"></b></i></div>`).join('');
}
function renderNav() { const tabs = [['home', '📍', 'Ici'], ['citta', '🗺️', 'Ville'], ['persone', '👥', 'Gens'], ['me', '🧍', 'Moi'], ['diario', '📜', 'Journal']]; $('nav').innerHTML = tabs.map(t => `<button class="${ui.tab === t[0] ? 'on' : ''}" onclick="ui.tab='${t[0]}';render()"><span>${t[1]}</span>${t[2]}</button>`).join(''); }
function render() { clearTimeout(ui.cineT); if (!S) return renderIntro(); if (S.morto && (!ui.modal || ui.modal.tipo !== 'morte')) ui.modal = { tipo: 'morte' }; document.body.classList.remove('start', 'intro'); renderHeader(); renderNav(); $('main').innerHTML = ({ home: vHome, citta: vCitta, persone: vPersone, me: vMe, diario: vDiario })[ui.tab](); renderModal(); }
const AVATARS = [
  { id: 'a1', nome: 'Andry', gen: 'M', desc: 'Déterminé, il vient des collines' },
  { id: 'a2', nome: 'Miora', gen: 'F', desc: 'Solaire, elle n\'abandonne jamais' },
  { id: 'a3', nome: 'Tojo', gen: 'M', desc: 'Réservé, esprit vif' },
  { id: 'a4', nome: 'Soa', gen: 'F', desc: 'Sûre d\'elle, elle vient de la côte' },
  { id: 'a5', nome: 'Hery', gen: 'M', desc: 'Costaud, toujours de bonne humeur' },
];
const AVATAR_BASE = (typeof window !== 'undefined' && window.AVATAR_BASE) || '../avatars/';
const ART_BASE = '../art/';
const INTRO_VIDEO = '../intro/intro.mp4';
const INTRO_POSTER = '../intro/c1.jpg';
const INTRO_SLIDES = [
  { at: 0.8, t: 'Madagascar.', s: 'Une île magnifique. Une vie qui ne fait aucun cadeau.' },
  { at: 6.5, t: 'Antananarivo t\'attend.', s: 'Tu pars de rien : 20 000 Ariary en poche, pas de maison, pas de travail.' },
  { at: 12.5, t: 'Chaque jour est une épreuve.', s: 'La faim, le loyer, la fatigue. Personne ne te fait de cadeau, mais chacun a quelque chose à t\'offrir.' },
  { at: 18.5, t: 'Tu peux arriver au sommet.', s: 'Avec de l\'effort, les bons choix et un peu de chance, n\'importe qui peut devenir quelqu\'un.' },
  { at: 24.5, t: 'Y arriveras-tu ?', s: '', last: true },
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
  <input id="iNome" placeholder="Comment tu t'appelles ?" value="${ui.nomeTmp || ''}" oninput="ui.nomeTmp=this.value" autocomplete="off"></div>
  <div class="card"><h3>Comment ça marche</h3>
  <div class="how"><div><span>📍</span><div><b>Une vraie ville</b><p>Antananarivo, quartier par quartier. Chaque lieu a ses boutiques, ses prix et ses opportunités.</p></div></div>
  <div><span>🍚</span><div><b>Besoins quotidiens</b><p>Faim, énergie, hygiène, moral et santé. Si tu les négliges, la vie te le fait payer.</p></div></div>
  <div><span>💼</span><div><b>Travail et carrière</b><p>Des petits boulots de rue aux bureaux : entretiens, horaires, ponctualité, salaires. Étudie pour monter.</p></div></div>
  <div><span>🏠</span><div><b>Logement, argent, avenir</b><p>Loue, achète, meuble, ouvre un compte, demande un prêt, lance ton propre commerce.</p></div></div>
  <div><span>👥</span><div><b>De vraies personnes</b><p>Amis, collègues, amours, famille : les personnages te parlent grâce à l'IA et se souviennent de toi.</p></div></div>
  <div><span>⏱</span><div><b>Le temps compte</b><p>Chaque action coûte des minutes, de l'énergie et souvent des Ariary. Planifie tes journées.</p></div></div></div></div>
  <div class="card"><h3>Mode</h3>
  <div class="modes">
    <button class="mode on" onclick="ui.mode=18"><b>18 ans</b><span>Sans études, sans rien. Le chemin le plus dur.</span></button>
    <button class="mode soon" disabled><b>25 ans</b><span>Jeune diplômé(e)</span><em>Bientôt</em></button>
    <button class="mode soon" disabled><b>35 ans</b><span>Entrepreneur à succès</span><em>Bientôt</em></button>
  </div>
  ${btn('Commencer ta vie', () => { const n = ($('iNome').value || '').trim(); if (!n) return toast('Écris ton nom.'); nuovaPartita(n, av.gen, 18); S.avatar = av.id; ui.tab = 'home'; })}
  <button class="sec" style="width:100%" onclick="carica().then(s=>{if(s){S=s;render()}else toast('Aucune sauvegarde')})">Continuer la partie sauvegardée</button>
  <button class="sec" style="width:100%" onclick="ui.modal={tipo:'caricafile'};render()">📂 Charger depuis un fichier…</button>
  <button class="sec" style="width:100%" onclick="ui.modal={tipo:'codice'};render()">🔑 J'ai un code de partie</button>
  <button class="link" onclick="ui.introStep=0;ui.introDone=false;LS.del('mrls_intro');render()">Revoir l'intro</button></div>
`;
}
function renderCinematic() {
  const fine = () => { ui.introDone = true; LS.set('mrls_intro', '1'); render(); };
  $('main').innerHTML = `<div class="cine"><video id="cVid" src="${INTRO_VIDEO}" poster="${INTRO_POSTER}" playsinline webkit-playsinline muted autoplay preload="auto"></video><div class="shade"></div>
    <button class="skip" id="cSkip">Passer</button>
    <div class="ctext" id="cText"></div></div>`;
  const v = $('cVid'), tx = $('cText'); let shown = -1;
  const show = i => { if (i === shown) return; shown = i; const sl = INTRO_SLIDES[i]; tx.className = 'ctext'; void tx.offsetWidth; tx.className = 'ctext in'; tx.innerHTML = `<h1>${sl.t}</h1>${sl.s ? `<p>${sl.s}</p>` : ''}${sl.last ? `<div class="cta"><button class="pri" id="cGo">Oui, je tente</button></div>` : ''}`; const g = $('cGo'); if (g) g.onclick = e => { e.stopPropagation(); fine(); }; };
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
    if (S.malattie.length) top += `<div class="card" style="border:1px solid var(--bad)"><h3>🤒 Tu es malade</h3>${S.malattie.map(m => `<div style="margin-bottom:6px"><b>${MALATTIE[m.tipo].nome}</b> — encore ${m.gg} jours · ${MALATTIE[m.tipo].sint}<div class="mut">Malus : ${malusMalattia(m.tipo)}</div><div class="mut">${cureMalattia(m.tipo)}</div></div>`).join('')}${Object.entries(S.medicine).filter(([k, v]) => v > 0).map(([k]) => act('Prendre ' + MEDICINE.find(x => x.id === k).nome, () => A.prendi(k), 'x' + S.medicine[k])).join('')}</div>`;
    if (S.flags.compleanno) top += `<div class="card">🎂 C'est ton anniversaire ! ${act('Fêter avec les amis', A.festaCompleanno, '4h · 50.000 Ar · moral 100 · amis +6')}</div>`;
  }
  if (!S.loc) return (top || '') + vQuartiere(q);
  return (top || '') + vLuogo(q);
}
function vQuartiere(q) {
  let h = `<div class="qhero"><img src="${ART_BASE}q/${q.id}.webp" alt="" onerror="this.parentNode.classList.add('noimg')"><div class="qh"><h2>📍 ${q.nome} <span class="pill">quartier ${q.centro ? TIER_LBL[6] : TIER_LBL[q.tier]}</span></h2></div></div><p class="mut">${q.desc} Prix : ×${MULT_CIBO[q.tier]}.</p><div class="card"><h3>Lieux du quartier</h3>`;
  poiDisponibili(q.id).forEach(p => { const d = p === 'attivita' ? { nome: ATTIVITA.find(a => a.id === S.attivita.id).nome, icon: ATTIVITA.find(a => a.id === S.attivita.id).icon } : POI[p]; let sub = d.desc || ''; if (p === 'lavoro') { const st = statoTurno(lavoro()); sub = `${orarioLavoro(lavoro())} · ${st.txt || ''}`; } h += act(`${d.icon} ${d.nome}`, () => entra(p), (p === 'casa' ? '3' : '7') + ' min · ' + sub); });
  h += '</div>';
  { const L = lavorettiOggi(); const rete = (S.flags.rep && S.flags.rep[q.id]) || 0; h += `<div class="card"><h3>🔧 Petits boulots du jour à ${q.nome}</h3><p class="mut">Bouche-à-oreille : ${rete === 0 ? 'personne ne te connaît ici' : rete < 3 ? 'quelques-uns commencent à te connaître' : rete < 8 ? 'on t\'appelle souvent (+1 offre)' : 'tu es l\'homme/la femme à tout faire du quartier (+2 offres, paie +10%)'}${ha('telefono') ? ' · 📱 téléphone : +1 offre' : ' · sans téléphone on ne te trouve qu\'en personne'}. Les offres changent chaque jour et selon le quartier.</p>`;
    if (!L.length) h += '<p class="mut">Aujourd\'hui personne ne cherche d\'aide.</p>';
    L.forEach((j, i) => { const l = LAVORETTI.find(x => x.id === j.id); const req = [l.fit ? 'forme ' + l.fit : '', l.soc ? 'social ' + l.soc : '', l.casa ? 'maison ' + l.casa : '', l.edu ? EDU[l.edu] : ''].filter(Boolean).join(', '); const scaduto = ora() > j.inizio + 2; h += act(`${l.icon} ${l.nome}${l.bucato ? ' <span class="mut">' + (j.bucato.cortile ? '· cour disponible' : '· à emporter au bassin public') + '</span>' : ''}`, () => l.bucato ? A.lavoretto(i) : conferma(`${l.icon} ${l.nome}?`, `${l.desc}<br><br>⏰ Ça commence à <b>${hh(j.inizio)}</b> (arrive dans les 2h), dure <b>${j.ore}h</b> → fin ~${hh((j.inizio + j.ore) % 24)}<br>💰 <b>${Ar(j.paga)} Ar</b> en espèces à la fin${l.veicolo && S.veicolo ? ' (×' + (S.veicolo === 'bici' ? '1.3' : l.veicolo) + ' avec ton véhicule)' : ''}<br>⚡ fatigue ${Math.round(l.fatica * j.ore * 0.5 + 5 * j.ore)} · 🧼 hygiène -${Math.round(l.igiene * j.ore * 0.5 + 2 * j.ore)}${req ? '<br>Prérequis : ' + req : ''}${S.lavoro !== 'nulla' ? '<br><span class="mut">Ton service fixe : ' + orarioLavoro(lavoro()) + ' — vérifie de ne pas te chevaucher.</span>' : ''}`, () => A.lavoretto(i), 'J\'accepte'), `${j.fatto ? '✅ fait' : scaduto ? '⌛ expiré' : hh(j.inizio) + ' · ' + j.ore + 'h · ' + Ar(j.paga) + ' Ar'}${req ? ' · ' + req : ''}`, j.fatto || scaduto); });
    h += '</div>'; }
  h += `<div class="card"><h3>Dans la rue</h3>${act('⏳ Attendre…', () => { ui.modal = { tipo: 'aspetta' }; }, 'choisis une durée ou une heure')}${!haCasa() ? act('😴 Dormir dans la rue…', () => { ui.modal = { tipo: 'dormi' }; }, 'choisis durée ou réveil · moral -10 · hygiène -10 · risque de vol') + act('🛏️ Dormir à l\'auberge…', () => { ui.modal = { tipo: 'dormi', ostello: true }; }, 'choisis durée ou réveil · 15.000 Ar/nuit · douche incluse') : ''}${act('🤲 Faire la manche…', () => { ui.modal = { tipo: 'elemosina' }; }, ({ 1: '~1 sur 7 donne 200–1.000 Ar', 2: '~1 sur 10 donne 500–2.000 Ar', 3: '~1 sur 16 donne 1–5.000 Ar', 4: '~1 sur 28 donne 2–10.000 Ar · risque gardiens', 5: '~1 sur 45 donne 5–20.000 Ar · risque gardiens' })[q.tier] + ' · moral -4/h')}${S.fedina < 3 && q.tier <= 2 ? act('🕵️ Voler un passant', () => conferma('🕵️ Prendre le risque ?', '50% : tu voles 5–40.000 Ar. 50% : arrêté(e), 3 nuits en cellule, amende 100.000 Ar et casier judiciaire.', A.borseggia, 'Je risque'), '1h · risqué') : ''}</div>`;
  h += `<div class="card"><h3>Derniers événements</h3><div class="log">${S.log.slice(0, 5).map(e => `<div class="${e.tipo}"><span class="mut">${e.d}</span> · ${esc(e.t)}</div>`).join('')}</div></div>`;
  return h;
}
function vLuogo(q) {
  const p = S.loc; const d = p === 'attivita' ? { nome: ATTIVITA.find(a => a.id === S.attivita.id).nome, icon: ATTIVITA.find(a => a.id === S.attivita.id).icon } : POI[p];
  let h = `<button class="sec" onclick="S.loc=null;render()">‹ ${q.nome}</button><div class="qhero phero"><img src="${ART_BASE}${p === 'casa' ? 'h/' + artCasa(casa()) : 'p/' + p}.webp" alt="" onerror="this.parentNode.classList.add('noimg')"><div class="qh"><h2>${d.icon} ${d.nome}</h2></div></div>`;
  const F = { casa: vCasa, lavoro: vLavoro, annunci: vAnnunci, mercato: () => vNegozio('mercato'), epicerie: () => vNegozio('epicerie'), minimarket: () => vNegozio('minimarket'), super: () => vNegozio('super'), bagni: vBagni, gargote: () => vPronto('gargote'), ristorante: () => vPronto('ristorante'), banca: vBanca, agenzia: vAgenzia, ospedale: vOspedale, farmacia: vFarmacia, auto: vAuto, scuola: () => vScuola('scuola'), universita: () => vScuola('universita'), stadio: vSport, palestra: vSport, chiesa: () => act('⛪ Assister à la messe', A.chiesa, '2h · moral +10 · rencontres'), comune: vComune, bar: vBar, lago: () => act('🌳 Se promener', A.lago, '1h · moral +8') + act('🏃 Courir autour du lac', () => A.sport('corsa'), '1h30 · gratuit · forme +'), zonafranca: () => `<p class="mut">Les usines textiles de la zone franche. Pour y travailler, postule au panneau 📋 d'Analakely.</p>`, aeroporto: () => `<p class="mut">Arrivées et départs, touristes, taxis officiels. Les offres d'emploi du coin sont sur le tableau 📋 d'Analakely.</p>` + act('👀 Regarder les avions', A.lago, '1h · moral +8'), fornace: () => `<p class="mut">Des tas de briques rouges fument dans les rizières. Travail à la journée : regarde les petits boulots du jour ou le tableau 📋.</p>`, grossista: () => `<p class="mut">Camions et sacs de 50 kg. Ici le riz coûte moins cher que partout ailleurs : achète au marché d'Anosibe.</p>`, fabbrica: () => `<p class="mut">Équipes dès 6 h, badge, cantine. Les offres sont sur le tableau 📋 d'Analakely.</p>`, rova: () => act('🏰 Visiter le Rova', A.rova, '2h · 10 000 Ar · moral +15 · intelligence +') + act('🌄 Regarder le coucher de soleil sur la ville', A.lago, '1h · moral +8'), attivita: vAttivita };
  h += `<div class="card">${F[p]()}</div>`;
  h += `<div class="card">${['lavoro', 'gargote', 'casa'].includes(p) ? act('🚽 Aller aux toilettes', A.bagno, '5 min · gratuit') : ''}${act('⏳ Attendre…', () => { ui.modal = { tipo: 'aspetta' }; }, p === 'lavoro' && statoTurno(lavoro()).stato === 'presto' ? 'ex. jusqu\'au début du service' : 'choisis durée ou heure')}</div>`;
  return h;
}
function artCasa(c) { if (!c) return 'strada'; const t = c.tipo; return ({ appv: 'app', villav: 'villa' })[t] || t; }
function vCasa() {
  const c = casa(); let h = `<p class="mut">${c.nome}. ${c.desc || ''} Confort ${c.comfort}/10 · Saleté ${Math.round(S.sporcoCasa)}%${c.affitto ? ' · loyer ' + Ar(c.affitto) + ' Ar/mois' : ''}</p>`;
  h += `<h3>🍳 Cuisine</h3><p class="mut">Feu : ${ha('gasf') ? 'gaz (' + S.disp.gas + ' cotture)' : ha('fornello') ? 'fatapera au charbon (' + S.disp.carbone + ' cotture)' : 'AUCUN RÉCHAUD — achète une fatapera au marché'}</p>`;
  RICETTE.forEach(r => { const manca = Object.entries(r.ing).filter(([k, n]) => (S.disp[k] || 0) < n).map(([k, n]) => NOMI_DISP[k]); const ok = !manca.length; const tempo = ha('gasf') && r.fuoco ? Math.round(r.min * 0.65) : r.min; h += act(`${ok ? '✅' : '▫️'} ${r.nome}`, () => A.cucina(r.id), `${durata(tempo)} · faim +${r.fame}${r.umore ? ' · moral ' + (r.umore > 0 ? '+' : '') + r.umore : ''}${r.salute ? ' · santé +' + r.salute : ''}${ok ? '' : ' · manque : ' + manca.join(', ')}`, !ok); });
  h += `<details><summary class="mut">Garde-manger</summary><p class="mut">${Object.entries(S.disp).filter(([k, v]) => v > 0).map(([k, v]) => `${NOMI_DISP[k]}: <b>${v}</b>${FRESCHI[k] && S.fresco[k] !== undefined ? ' (' + Math.max(0, (ha('frigo') ? FRESCHI[k] * 4 : FRESCHI[k]) - (S.stat.gg - S.fresco[k])) + 'gg)' : ''}`).join(' · ') || 'vide'}</p></details>`;
  h += `<h3 style="margin-top:10px">🧼 Hygiène et maison</h3>`;
  h += act('🧼 Se laver', A.lavati, ha('doccia') ? '20 min · douche · hygiène 100' : ha('secchio') ? '30 min · seau + savon · hygiène +55' : 'il faut un seau');
  h += act('🫧 Faire la lessive', A.bucato, `${ha('lavatrice') ? '1h' : '1h30'} · ${S.pantoSporchi} sales · savon ${S.disp.sapone}`);
  h += act('🧺 Étendre le linge', A.stendi, `15 min · ${S.pantoBagnati} mouillés · ${S.pantoPuliti} propres`);
  h += act('🧹 Faire le ménage', A.pulisci, '1h · moral +5');
  h += `<h3 style="margin-top:10px">😴 Repos et loisirs</h3>` + act('😴 Dormir…', () => { ui.modal = { tipo: 'dormi' }; }, `choisis durée ou réveil · ${8 + casaComfortSonno()} énergie/heure${!ha('materasso') && !ha('letto') ? ' · par terre : -10' : ''}`);
  h += act('📚 Lire / étudier', A.leggi, '1h30 · intelligence +');
  if (ha('tv')) h += act('📺 Regarder la TV', A.tv, '1h30 · moral +12');
  if (ha('pesi')) h += act('🏋️ S\'entraîner', A.pesi, '1h · forme + · énergie -10');
  if (S.figli.length) h += act('👶 Jouer avec les enfants', A.giocaFigli, '1h30 · moral +15');
  return h;
}
function vLavoro() {
  const l = lavoro(); const st = statoTurno(l); const fatto = S.flags.lavoratoOggi === now().toDateString();
  return `<p class="mut">${l.nome} · ${l.tipo === 'mese' ? Ar(l.paga) + ' Ar/mois (fixe, même les jours de repos)' : Ar(l.paga) + ' Ar/jour (seulement les jours travaillés)'}<br>⏰ <b>${orarioLavoro(l)}</b> · 📅 <b>${giorniTxt(l)}</b> · heure : <b>${GG[giornoIdx()]} ${oraStr()}</b> → <b style="color:${['puntuale', 'presto'].includes(st.stato) ? 'var(--ok)' : 'var(--bad)'}">${fatto ? 'service du jour déjà fait' : st.txt}</b><br>Performance ${Math.round(S.perf)}/100 (sous 15 = licenciement) · expérience ${S.esp} services${S.capo ? ' · patron : ' + S.capo.nome : ''}</p>` + (st.stato === 'presto' && !fatto ? act(`⏳ Attendre le début du service et pointer`, () => { A.aspetta(minutiFinoTurno() || 0, 'jusqu\'au début du service'); A.lavora(); }, `${durata(minutiFinoTurno() || 0)} d'attente · puis tu travailles ${l.ore}h`) : '') + act('💼 Pointer et travailler', A.lavora, `${l.ore}h · énergie -${l.ore * 5} · faim -${Math.round(l.ore * 3.5)}`, st.stato === 'chiuso' || fatto) + act('Démissionner', () => conferma('Démissionner ?', `Tu quittes le poste de <b>${l.nome}</b>. ${l.tipo === 'mese' ? 'Tu perds les services accumulés ce mois-ci (' + Math.round(S.ggLavorati) + ').' : ''} Il faudra repasser un entretien pour un nouveau travail.`, A.licenziati, 'Je démissionne'), 'immédiat');
}
function vOfferte() {
  let h = `<h3 style="margin-top:10px">Offres d'emploi</h3><p class="mut">Touche pour postuler (entretien 1h30). Une bonne hygiène et un bon moral aident.</p>`;
  LAVORI.filter(x => x.id !== 'nulla' && x.id !== S.lavoro).forEach(x => { const req = [x.edu ? EDU[x.edu] : null, x.minSkill ? `${SKILL_LBL[x.skill]} ${x.minSkill}` : null, x.patente ? 'patente' : null, x.esp ? x.esp + ' ans d\'exp.' : null].filter(Boolean).join(', '); h += act(`${x.nome}`, () => conferma('📋 Postuler ?', `<b>${x.nome}</b> a ${Q(x.luogo).nome}<br>💰 ${Ar(x.paga)} Ar/${x.tipo === 'mese' ? 'mois (salaire le 1er)' : 'jour (payé en fin de service)'}<br>⏰ ${orarioLavoro(x)} · 📅 ${giorniTxt(x)}<br>Prérequis : ${req || 'aucun'}<br><br>L'entretien dure 1h30.${S.lavoro !== 'nulla' ? ' <b>Si on t\'embauche, tu quittes ton travail actuel (' + lavoro().nome + ').</b>' : ''}`, () => A.candidati(x.id), 'Aller à l\'entretien'), `${Ar(x.paga)} Ar/${x.tipo === 'mese' ? 'mois' : 'j'} · ⏰ ${orarioLavoro(x)} ${giorniTxt(x)} · 📍 ${Q(x.luogo).nome} · ${req || 'aucun prérequis'}`); });
  return h;
}
function vAnnunci() { let h = `<p class="mut">${S.lavoro !== 'nulla' ? 'Travail actuel : ' + lavoro().nome + '.' : 'Tu es sans emploi.'}</p>` + vOfferte(); if (!S.attivita) { h += `<h3 style="margin-top:10px">Monte ta propre affaire</h3><p class="mut">Elle s'ouvre dans le quartier où tu te trouves : certaines affaires n'existent que dans certains quartiers.</p>`; ATTIVITA.filter(a => !a.q || a.q.includes(S.q)).forEach(a => h += act(`${a.icon} ${a.nome}`, () => conferma('🏪 Ouvrir le commerce ?', `<b>${a.nome}</b> a ${Q(S.q).nome}<br>💰 capital ${Ar(a.costo)} Ar · rendement estimé ~${Ar(a.base)} Ar/jour (selon ta compétence business)<br>4h de démarches à la commune.`, () => A.apriAttivita(a.id), 'Ouvrir'), `4h démarches · capital ${Ar(a.costo)} Ar · ~${Ar(a.base)} Ar/j`)); } return h; }
function vAttivita() { const a = ATTIVITA.find(x => x.id === S.attivita.id); return `<p class="mut">Recettes du mois : ${Ar(S.attivita.mese)} Ar · business ${Math.round(S.skill.business)}</p>` + act('Gérer le commerce', A.gestisci, '5h · business + · recettes en plus') + (S.attivita.dip ? '' : act('Embaucher un employé', A.assumi, '300.000 Ar · +60% de recettes')) + act('Vendre le commerce', () => conferma('Vendre le commerce ?', `Tu récupères 40% du capital : <b>${Ar(a.costo * 0.4)} Ar</b>. Pas de retour en arrière.`, A.chiudiAttivita, 'Vendre'), '40% de la valeur'); }
function vNegozio(tipo) {
  const q = Q(S.q); const cat = { base: 'Riz et céréales', carne: 'Viande, poisson, œufs', verdura: 'Légumes', dispensa: 'Garde-manger', casa: 'Maison et combustible' };
  let h = `<p class="mut">${POI[tipo].desc} Prix ${q.nome}: ×${MULT_CIBO[q.tier]} ${tipo !== 'mercato' ? '· ' + POI[tipo].nome.split(' (')[0] + ' ×' + MULT_NEGOZIO[tipo] : ''}. ${haCasa() ? '' : '<b>Sans logement tu ne peux pas conserver les courses</b> (seulement eau et savon).'}</p>`;
  const items = PRODOTTI.filter(p => p.dove.includes(tipo));
  Object.entries(cat).forEach(([c, nome]) => { const its = items.filter(p => p.cat === c); if (!its.length) return; h += `<h3 style="margin-top:8px">${nome}</h3>`; its.forEach(p => h += act(`${p.nome} <span class="mut">${p.unit}</span>`, () => A.compra(p.id, tipo), `${Ar(prezzo(p.prezzo, tipo))} Ar · +${p.n} ${NOMI_DISP[p.key]}${S.disp[p.key] ? ' (tu as ' + S.disp[p.key] + ')' : ''}`, !haCasa() && !p.sempre)); });
  const mob = MOBILI.filter(m => m.dove.includes(tipo)); if (mob.length) { h += `<h3 style="margin-top:8px">Objets pour la maison</h3>`; mob.forEach(m => h += act(`${m.icon} ${m.nome}`, () => { const pr = prezzo(m.prezzo, tipo === 'mercato' ? 'mercato' : 'epicerie'); pr >= 100000 ? conferma('🛋️ Acheter ?', `<b>${m.nome}</b> · ${m.eff}<br>💰 ${Ar(pr)} Ar`, () => A.mobile(m.id, tipo), 'Acheter') : A.mobile(m.id, tipo); }, `${Ar(prezzo(m.prezzo, tipo === 'mercato' ? 'mercato' : 'epicerie'))} Ar · ${m.eff}`, ha(m.id))); }
  if (tipo === 'mercato') { h += `<h3 style="margin-top:8px">Stands de plats prêts</h3>`; PRONTO.gargote.slice(0, 6).forEach((c, i) => h += act(c.nome, () => A.pronto('gargote', i), `${Ar(prezzoPronto(c))} Ar · faim +${c.fame}${c.mattina ? ' · le matin seulement' : ''}`)); }
  return h;
}
function vPronto(tipo) { const t = Q(S.q).tier; let h = `<p class="mut">${tipo === 'gargote' ? (t <= 1 ? 'Hotely populaire : bancs en bois, assiettes copieuses et prix bas.' : t <= 3 ? 'Hotely de quartier : nappe en plastique, plat du jour à l\'ardoise.' : 'Hotely « chic » pour employés et vazaha : mêmes plats, prix triplés.') : 'Service à table, menu en français.'} 20 min par repas.</p><p class="mut">Ta faim actuelle : <b>${Math.round(S.bis.fame)}/100</b>${S.bis.fame >= 80 ? ' — tu es déjà rassasié(e)' : S.bis.fame < 30 ? ' — tu as très faim' : ''}.</p>`; PRONTO[tipo].forEach((c, i) => h += act(c.nome, () => A.pronto(tipo, i), `${Ar(prezzoPronto(c))} Ar · faim +${c.fame}${c.umore ? ' · moral +' + c.umore : ''}${c.salute ? ' · santé ' + c.salute : ''}${c.rischio ? ' · risque pour le ventre' : ''}${c.mattina ? ' · le matin seulement' : ''}`)); return h; }
function vBagni() { return act('🚽 WC', A.bagno, '5 min · 200 Ar') + act('🚿 Douche', A.lavati, '30 min · 1.000 Ar · hygiène +40'); }
function vBanca() { if (!S.banca) return act('🏦 Ouvrir un compte BNI', A.apriConto, '10.000 Ar'); const id = 'bAmt'; return `<p>Solde : <b class="money">${Ar(S.banca.saldo)} Ar</b>${S.banca.prestito > 0 ? ` · Dette : <b style="color:var(--bad)">${Ar(S.banca.prestito)} Ar</b> (mensualité ${Ar(S.banca.rata)})` : ''}</p><input id="${id}" type="number" placeholder="Montant en Ar" inputmode="numeric"><div class="grid2">${btn('Déposer', () => A.deposita(+$(id).value || 0), 'sec')}${btn('Retirer', () => A.preleva(+$(id).value || 0), 'sec')}</div>${btn('Demander un prêt (24 mensualités, 20%)', () => { const n = +$(id).value || 0; if (n <= 0) return toast('Saisis le montant.'); conferma('🏦 Demander le prêt ?', `Tu reçois <b>${Ar(n)} Ar</b>. Tu rembourses ${Ar(n * 1.2)} Ar en 24 mensualités de <b>${Ar(n * 1.2 / 24)} Ar</b>. Mensualités impayées : pénalité 5%.`, () => A.prestito(n), 'J\'accepte'); }, 'sec')}`; }
function vAgenzia() {
  let h = `<p class="mut">Annonces de toute la ville. Location : 2 mois de caution. Vente : paiement intégral (ou prêt). Les quartiers résidentiels coûtent plus cher mais sont plus sûrs et confortables.</p>`;
  const terreni = S.proprieta.filter(id => CASE.find(c => c.id === id).tipo === 'terreno');
  if (terreni.length && !S.cantiere) terreni.forEach(t => { const c = CASE.find(x => x.id === t); h += act(`🏗️ Construire une maison sur le terrain à ${Q(c.q).nome}`, () => conferma('🏗️ Lancer le chantier ?', `Construction à ${Q(c.q).nome}: <b>${Ar(Math.round(28000000 * multCasa(Q(c.q)) / 500000) * 500000)} Ar</b>, 120 jours. À la fin tu emménages automatiquement.`, () => A.costruisci(t), 'Construire'), `${Ar(Math.round(28000000 * multCasa(Q(c.q)) / 500000) * 500000)} Ar · 120 jours · confort 7`); });
  if (S.cantiere) h += `<p>🏗️ Chantier à ${Q(S.cantiere.q).nome} : il reste ${S.cantiere.gg} jours.</p>`;
  const id = 'selQ'; const qsel = ui.agQ || 'tutti';
  h += `<select id="${id}" onchange="ui.agQ=this.value;render()"><option value="tutti">Tous les quartiers</option>${QUARTIERI.map(q => `<option value="${q.id}" ${qsel === q.id ? 'selected' : ''}>${q.nome} (quartier ${q.centro ? TIER_LBL[6] : TIER_LBL[q.tier]})</option>`).join('')}</select>`;
  const lista = CASE.filter(c => c.tipo !== 'strada' && c.tipo !== 'costruita' && c.id !== S.casa && !S.proprieta.includes(c.id) && (qsel === 'tutti' || c.q === qsel));
  ['Locations', 'Ventes', 'Terrains'].forEach(sez => { const its = lista.filter(c => sez === 'Locations' ? c.affitto : sez === 'Ventes' ? c.prezzo && c.tipo !== 'terreno' : c.tipo === 'terreno'); if (!its.length) return; h += `<h3 style="margin-top:8px">${sez}</h3>`; its.forEach(c => h += act(c.nome, () => conferma('🏘️ ' + (c.tipo === 'terreno' ? 'Acheter le terrain ?' : c.prezzo ? 'Acheter la maison ?' : 'Louer ?'), `<img class="mimg" src="${ART_BASE}h/${artCasa(c)}.webp" alt="" onerror="this.remove()"><b>${c.nome}</b><br>${c.desc || ''}<br>${c.tipo === 'terreno' ? '💰 ' + Ar(c.prezzo) + ' Ar' : c.prezzo ? '💰 ' + Ar(c.prezzo) + ' Ar en une seule fois · confort ' + c.comfort : '💰 caution ' + Ar(c.affitto * 2) + ' Ar tout de suite, puis ' + Ar(c.affitto) + ' Ar chaque 1er du mois · confort ' + c.comfort}${haCasa() && c.tipo !== 'terreno' ? '<br><b>Tu quittes ton logement actuel (' + casa().nome + ').</b>' : ''}`, () => A.affitta(c.id), c.tipo === 'terreno' ? 'Acheter' : c.prezzo ? 'Acheter' : 'Louer'), c.tipo === 'terreno' ? `${Ar(c.prezzo)} Ar` : c.prezzo ? `ACHAT ${Ar(c.prezzo)} Ar · confort ${c.comfort}` : `${Ar(c.affitto)} Ar/mois (caution ${Ar(c.affitto * 2)}) · confort ${c.comfort}`)); });
  if (S.proprieta.length) { h += `<h3 style="margin-top:8px">Tes propriétés</h3>`; S.proprieta.forEach(id2 => { const c = CASE.find(x => x.id === id2); if (c.tipo !== 'terreno' && S.casa !== id2) h += act(`Emménager : ${c.nome}`, () => { S.casa = id2; log(`Tu as emménagé dans ta ${c.nome}.`); }); else h += `<div class="row"><span>${c.nome}</span><span class="mut">${S.casa === id2 ? 'tu y vis' : 'terreno'}</span></div>`; }); }
  return h;
}
function vOspedale() { return act('🩺 Consultation médicale', A.medico, '2h · 20.000 Ar · diagnostic + santé +5') + act('🏥 Hospitalisation (soigne tout)', () => conferma('🏥 Te faire hospitaliser ?', '<b>150.000 Ar</b> (aussi depuis le compte), 24 heures à l\'hôpital. Tu guéris de tout, santé +40.', A.ricovero, 'Hospitalise-moi'), '24h · 150.000 Ar · guérison, santé +40'); }
function vFarmacia() { let h = '<p class="mut">Médicaments sur ordonnance ou conseil du pharmacien.</p>'; MEDICINE.forEach(m => h += act(m.nome, () => A.medicina(m.id), `${Ar(prezzo(m.prezzo, 'epicerie'))} Ar${m.cura.length ? ' · ' + m.cura.map(c => MALATTIE[c].nome).join('/') : ' · santé +8'}${S.medicine[m.id] ? ' · tu as ' + S.medicine[m.id] : ''}`)); h += act('🦟 Moustiquaire', () => A.mobile('zanzariera', 'epicerie'), '20.000 Ar · moins de paludisme', ha('zanzariera')); return h; }
function vAuto() { let h = `<p class="mut">${S.patente ? 'Tu as le permis.' : 'Sans permis tu ne peux acheter que le vélo.'} Véhicule actuel : ${S.veicolo ? VEICOLI.find(v => v.id === S.veicolo).nome : 'aucun'}</p>`; VEICOLI.forEach(v => h += act(`${v.icon} ${v.nome}`, () => conferma('🚗 Acheter le véhicule ?', `<img class="mimg" src="${ART_BASE}v/${v.id}.webp" alt="" onerror="this.remove()"><b>${v.nome}</b><br>💰 ${Ar(v.prezzo)} Ar · carburant ${Ar(v.costo)} Ar tous les 4 km${v.id !== 'bici' ? '<br>Il faut le permis.' : ''}`, () => A.veicolo(v.id), 'Acheter'), `${Ar(v.prezzo)} Ar · ${Ar(v.costo)} Ar/4 km`, S.veicoli.includes(v.id))); if (!S.patente) h += act('🚗 Auto-école + examen du permis', () => conferma('🚗 Auto-école ?', '3h et <b>250.000 Ar</b>. L\'examen peut échouer (l\'argent n\'est pas remboursé).', A.patente, 'Y aller'), '3h · 250.000 Ar'); return h; }
function vScuola(poi) { let h = `<p class="mut">Diplôme actuel : ${EDU[S.edu]}</p>`; if (S.scuola) { const s = SCUOLE.find(x => x.liv === S.scuola.liv); if (s.poi !== poi) return h + `<p>Tu es inscrit(e) à ${s.nome} : les cours ont lieu ${s.poi === 'universita' ? 'à l\'Université (Ambohipo)' : 'à l\'école'}.</p>`; h += `<p>${s.nome}: ${Math.round(S.scuola.giorni / S.scuola.tot * 100)}% terminé</p>` + act('🎓 Assister aux cours', A.studia, '4h · lun–ven · énergie -12', giornoIdx() > 4); } else SCUOLE.filter(s => s.poi === poi).forEach(s => h += act(s.nome, () => conferma('🎓 S\'inscrire ?', `<b>${s.nome}</b><br>💰 ${Ar(s.costo)} Ar par mois pendant ${s.mesi} mois (prélevé le 1er)<br>📅 cours 4h, lun–ven. Si tu ne paies pas, tu es renvoyé(e).`, () => A.iscriviti(s.liv), 'Inscris-moi'), `${Ar(s.costo)} Ar/mois · ${s.mesi} mois`, S.edu >= s.liv)); return h; }
function vSport() { const pal = S.loc === 'palestra'; return '<p class="mut">1h30 · énergie -15 · faim -10 · moral +10 · hygiène -12 (lave-toi après !)</p>' + (pal ? act('🏋️ Salle de sport', () => A.sport('palestra'), `${Ar(prezzo(10000, 'mercato'))} Ar · forme +2.5`) + act('🏊 Piscine', () => A.sport('piscina'), `${Ar(prezzo(15000, 'mercato'))} Ar · forme +1.8`) : act('🏃 Course sur piste', () => A.sport('corsa'), 'gratuit · forme +1.8') + act('⚽ Foot', () => A.sport('calcio'), '2.000 Ar · forme +1.8 · rencontres')); }
function vComune() { let h = `<p class="mut">Casier judiciaire : ${S.fedina ? S.fedina + ' antécédent(s)' : 'vierge'}. ${S.sposato ? 'État civil : marié(e).' : ''}</p>`; if (S.partner && png(S.partner).stato === 'promesso') { h += '<h3>Célébrer le mariage</h3>' + [['semplice', 'Mariage simple', 500000], ['media', 'Mariage moyen (église + salle)', 3000000], ['grande', 'Grand mariage (500 invités)', 15000000]].map(([t, n, c]) => act(n, () => conferma('💒 ' + n + '?', `Tu épouses <b>${png(S.partner).nome} ${png(S.partner).cognome}</b>. Coût <b>${Ar(c)} Ar</b> (aussi depuis le compte). Ça dure toute la journée.`, () => A.sposa(S.partner, t), 'Oui, je le veux'), Ar(c) + ' Ar')).join(''); } h += act('Parler à la police', () => apriChat(S.png.find(p => p.ruolo === 'poliziotto').id)); return h; }
function vBar() { return act('🍻 Soirée au bar', A.bar, `2h30 · ${Ar(prezzo(12000, 'mercato'))} Ar · moral +18 · social +`) + act('🍺 Une THB', () => A.pronto('gargote', 11), `20 min · ${Ar(prezzoPronto(PRONTO.gargote[11]))} Ar · moral +8`); }

function vCitta() {
  let h = `<h2>🗺️ Antananarivo</h2><p class="mut">Tu es à <b>${Q(S.q).nome}</b>. Touche un quartier pour voir les temps et coûts des transports.</p>`;
  h += '<div class="qgrid">';
  [...QUARTIERI].sort((a, b) => distKm(S.q, a.id) - distKm(S.q, b.id)).forEach(q => { if (q.id === S.q) return; const tag = [haCasa() && casaQ() === q.id ? '🏠' : '', S.lavoro !== 'nulla' && lavoro().luogo === q.id ? '💼' : ''].filter(Boolean).join(' '); const id = 'qg' + q.id; setTimeout(() => { const e = $(id); if (e) e.onclick = () => { ui.modal = { tipo: 'vai', id: q.id }; render(); }; }); h += `<div class="qcard" id="${id}"><img src="${ART_BASE}q/${q.id}.webp" alt="" loading="lazy" onerror="this.style.visibility='hidden'"><div class="qc"><b>${q.nome}</b> ${tag}<span>${distKm(S.q, q.id)} km · zone ${q.centro ? TIER_LBL[6] : TIER_LBL[q.tier]}</span></div></div>`; });
  h += '</div>';
  return h;
}
function vPersone() {
  let h = '<h2>👥 Gens</h2>';
  if (S.figli.length) h += `<div class="card"><h3>Enfants</h3>${S.figli.map(f => `<div class="row"><span>${f.gen === 'M' ? '👦' : '👧'} ${f.nome}</span><span class="mut">${f.eta} ans</span></div>`).join('')}</div>`;
  if (S.gravidanza) h += `<div class="card">🤰 Bébé attendu dans ${S.gravidanza.gg} jours.</div>`;
  const ord = [...S.png].sort((a, b) => (b.id === S.partner) - (a.id === S.partner) || b.aff - a.aff);
  h += '<div class="card">' + ord.map(p => `<div class="person" onclick="apriChat('${p.id}')">${avatarHtml(p)}<div class="n"><b>${p.nome} ${p.cognome}</b> <span class="mut">${p.eta}</span><div class="mut">${ruoloTxt(p)}${p.stato !== 'conoscente' ? ' · ' + STATO_LBL[p.stato] : ''} · ${trattiTxt(p)}</div><div class="heart"><b style="width:${p.aff}%"></b></div></div><span class="mut">${p.aff}</span></div>`).join('') + '</div>';
  return h;
}
function vMe() {
  let h = `<h2>🧍 ${S.nome}</h2><div class="card"><div class="row"><span>Âge</span><b>${S.eta}</b></div><div class="row"><span>Études</span><b>${EDU[S.edu]}</b></div><div class="row"><span>Travail</span><b>${lavoro().nome}${S.lavoro !== 'nulla' ? ' · ' + orarioLavoro(lavoro()) + ' ' + giorniTxt(lavoro()) : ''}</b></div><div class="row"><span>Logement</span><b>${casa().nome}</b></div><div class="row"><span>Espèces</span><b>${Ar(S.soldi)} Ar</b></div>${S.banca ? `<div class="row"><span>Banque</span><b>${Ar(S.banca.saldo)} Ar</b></div>` : ''}<div class="row"><span>Patrimoine</span><b>${Ar(S.soldi + (S.banca?.saldo || 0) - (S.banca?.prestito || 0) + S.proprieta.reduce((a, id) => a + CASE.find(c => c.id === id).prezzo, 0) + S.veicoli.reduce((a, id) => a + VEICOLI.find(v => v.id === id).prezzo * 0.7, 0))} Ar</b></div><div class="row"><span>État civil</span><b>${S.sposato ? 'Marié(e)' : S.partner ? 'En couple' : 'Célibataire'}</b></div><div class="row"><span>Jours vécus</span><b>${S.stat.gg}</b></div></div>`;
  h += `<div class="card"><h3>Compétences</h3>${Object.entries(S.skill).map(([k, v]) => `<div class="row"><span style="text-transform:capitalize">${SKILL_LBL[k]}</span><span class="mut">${Math.round(v)}</span></div>`).join('')}</div>`;
  h += `<div class="card"><h3>Ce que tu possèdes</h3><div>${S.mobili.map(id => { const m = MOBILI.find(x => x.id === id); return m ? `<span class="tag">${m.icon} ${m.nome}</span>` : ''; }).join('') || '<span class="mut">Rien.</span>'}</div><div style="margin-top:6px">${S.veicoli.map(id => { const v = VEICOLI.find(x => x.id === id); return `<span class="tag">${v.icon} ${v.nome}</span>`; }).join('')}</div><p class="mut">Garde-manger : ${Object.entries(S.disp).filter(([k, v]) => v > 0).map(([k, v]) => `${NOMI_DISP[k]} ${v}`).join(', ') || 'vide'}. Linge : ${S.pantoPuliti} propres / ${S.pantoSporchi} sales / ${S.pantoBagnati} étendus. Médicaments : ${Object.entries(S.medicine).filter(([k, v]) => v > 0).map(([k, v]) => MEDICINE.find(m => m.id === k).nome + ' x' + v).join(', ') || 'aucun'}</p></div>`;
  h += `<div class="card"><h3>⚙️ Réglages IA</h3><p class="mut">Fournisseur actif : <b id="aiStato">…</b>. Saisis une clé OpenAI ou Anthropic pour faire parler les personnages avec la vraie IA.</p><select id="sProv"><option value="auto">Automatique</option><option value="openai">OpenAI</option><option value="anthropic">Anthropic</option></select><input id="sOpenai" placeholder="Clé API OpenAI (sk-…)"><input id="sAnth" placeholder="Clé API Anthropic (sk-ant-…)"><input id="sModel" placeholder="Modèle (optionnel, ex. gpt-4o-mini)"><input id="sAdmin" type="password" placeholder="Clé administrateur (seulement si le serveur en ligne l'exige)">${btn('Enregistrer les réglages', salvaImpostazioni, 'sec')}</div>`;
  h += `<div class="card"><h3>Sauvegardes</h3><p class="mut">La partie se sauvegarde toute seule. Tu peux aussi l'exporter dans un fichier et la recharger depuis un fichier.</p><p class="mut" style="font-size:13px">Ton code de partie : <b style="font-size:16px;letter-spacing:.06em">${codiceGiocatore()}</b><br>Note-le : sur un autre téléphone, il suffit de le saisir sur l'écran d'accueil pour reprendre la partie.</p>${btn('💾 Sauvegarder dans un fichier…', salvaSuFile, 'sec')} ${btn('📂 Charger depuis un fichier…', () => { ui.modal = { tipo: 'caricafile' }; }, 'sec')} ${btn('🗑️ Nouvelle vie (tout effacer)', () => conferma('🗑️ Effacer la partie ?', `Tu perds <b>${S.nome}</b>, ${S.stat.gg} jours de vie et tout ton patrimoine. Irréversible.`, nuovaVita, 'Tout effacer'), 'sec')}</div>`;
  setTimeout(caricaImpostazioni); return h;
}
function vDiario() { return `<h2>📜 Journal</h2><div class="card log">${S.log.map(e => `<div class="${e.tipo}"><span class="mut">${e.d}</span> · ${esc(e.t)}</div>`).join('')}</div>`; }
async function caricaImpostazioni() { try { const j = await (await fetch('/api/settings')).json(); if ($('aiStato')) { $('aiStato').textContent = j.active === 'none' ? 'moteur interne (aucune clé)' : j.active; $('sProv').value = j.provider; $('sModel').value = j.model || ''; if (j.hasOpenai) $('sOpenai').value = '••••'; if (j.hasAnthropic) $('sAnth').value = '••••'; } } catch (e) { if ($('aiStato')) $('aiStato').textContent = 'moteur interne (aucun serveur)'; } }
async function salvaImpostazioni() { const b = { provider: $('sProv').value, model: $('sModel').value, openaiKey: $('sOpenai').value, anthropicKey: $('sAnth').value, adminKey: $('sAdmin') ? $('sAdmin').value : '' }; try { const j = await (await fetch('/api/settings', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(b) })).json(); toast('AI: ' + (j.active === 'none' ? 'moteur interne' : j.active)); } catch (e) { toast('Erreur de sauvegarde'); } }

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
    const riga = (icona, nome, mezzo) => { const e2 = stimaViaggio(M.id, mezzo); if (!e2) return ''; return act(`${icona} ${nome} <span class="mut">→ tu arrives à</span> <b>${e2.arrivo}</b>`, () => conferma(`${icona} Aller à ${q.nome}?`, `<img class="mimg" src="${ART_BASE}v/${mezzo === 'proprio' ? S.veicolo : mezzo}.webp" alt="" onerror="this.remove()">${nome} da ${Q(S.q).nome} a <b>${q.nome}</b><br>⏱ ${e2.min} min${e2.traffico ? ' (traffico)' : ''} → arrivée à <b>${e2.arrivo}</b><br>💰 ${e2.costo ? Ar(e2.costo) + ' Ar' : 'gratuit'} · ⚡ énergie -${e2.energia}${e2.igiene ? ' · 🧼 hygiène -' + e2.igiene : ''}`, () => vaiA(M.id, mezzo), 'Partir'), `⏱ ${e2.min} min${e2.traffico ? ' 🚦' : ''} · ${e2.costo ? Ar(e2.costo) + ' Ar' : 'gratuit'} · ⚡-${e2.energia}${e2.igiene ? ' · 🧼-' + e2.igiene : ''}${e2.umore ? ' · 🙂' + (e2.umore > 0 ? '+' : '') + e2.umore : ''}`, S.soldi < e2.costo); };
    let extra = ''; if (lav.id !== 'nulla' && lav.luogo === M.id) extra = `<p class="mut">⏰ Service ${orarioLavoro(lav)} (${giorniTxt(lav)}). Arrive avant ${hh(lav.inizio)}.</p>`;
    e.innerHTML = `<div class="box"><img class="mimg" src="${ART_BASE}q/${q.id}.webp" alt="" onerror="this.remove()"><h3>📍 ${q.nome}</h3><p class="mut">${q.desc}</p><p class="mut">${Q(S.q).nome} → ${q.nome} · ${distKm(S.q, M.id)} km · heure ${oraStr()}${inTraffico('taxibe') ? ' · 🚦 heure de pointe : transports +70%' : ''}</p>${extra}${riga('🚶', 'À pied', 'piedi')}${riga('🚌', 'Taxi-be', 'taxibe')}${riga('🚕', 'Taxi', 'taxi')}${v ? riga(v.icon, v.nome, 'proprio') : ''}<p class="mut" style="margin-top:8px">Lieux : ${q.poi.map(p => POI[p].icon + ' ' + POI[p].nome.split(' (')[0]).join(' · ')}</p></div>`;
    return;
  }
  if (M.tipo === 'bucato') {
    const j = lavorettiOggi()[M.idx]; const b = j.bucato; const q = Q(S.q); const bidoni = Math.ceil(b.capi / 8); const prezzoBidone = q.tier >= 4 ? 200 : 100;
    e.innerHTML = `<div class="box"><h3>🫧 Lessive pour une famille à ${q.nome}</h3><p class="mut">${b.capi} pièces (draps, chemises, pantalons). Paie convenue <b>${Ar(j.paga)} Ar</b>, ${j.ore}h de travail à partir de ${hh(j.inizio)}.</p>
    ${b.cortile ? act('🏡 Laver chez eux, dans la cour', () => { A.lavoretto(M.idx, 'casa'); }, `bassin et eau de la famille · ${j.ore}h · aucun coût`) : '<p class="mut">🏡 La famille <b>n\'a pas de cour</b> où te laisser laver : tu dois emporter le linge.</p>'}
    ${act('🚰 Récupérer le linge et laver au bassin public', () => { A.lavoretto(M.idx, 'pubblico'); }, `+40 min collecte/livraison · ${bidoni} bidons d'eau à la pompe (${Ar(bidoni * prezzoBidone)} Ar) · risque d'attente pour une place${ora() >= 8 && ora() <= 11 ? ' (heure de pointe !)' : ''} · risque de vêtement perdu`)}
    <p class="mut" style="margin-top:8px">Au bassin public on paie l'eau au bidon (${prezzoBidone} Ar) à la pompe JIRAMA ; le matin c'est plein de lavandières et il faut attendre son tour. Ensuite le linge doit être rendu plié chez le client.</p>${btn('Annuler', () => { ui.modal = null; }, 'sec')}</div>`;
    return;
  }
  if (M.tipo === 'elemosina') {
    const q = Q(S.q); const h = ora(); const mom = h < 7 || h >= 20 ? 'La nuit il passe très peu de monde.' : h >= 11 && h <= 14 ? 'Heure du déjeuner : beaucoup de monde dehors.' : 'Passage normal de piétons.';
    const stima = { 1: 'environ 1 passant sur 7 laisse 200–1.000 Ar', 2: 'environ 1 sur 10 laisse 500–2.000 Ar', 3: 'environ 1 sur 16 laisse 1.000–5.000 Ar', 4: 'environ 1 sur 28 laisse 2.000–10.000 Ar ; les gardiens des villas peuvent te chasser', 5: 'environ 1 sur 45 laisse 5.000–20.000 Ar ; presque que des vazaha et des gardiens partout' }[q.tier];
    e.innerHTML = `<div class="box"><h3>🤲 Faire la manche à ${q.nome}</h3><p class="mut">${stima}. ${mom} ${S.bis.igiene < 30 ? 'Tu as vraiment l\'air dans le besoin : plus de gens s\'apitoient.' : S.bis.igiene > 70 ? 'Tu es trop propre et bien mis(e) : les gens n\'y croient pas.' : ''}${S.flags.elemosinaOggi === now().toDateString() + q.id ? ' <b>Tu as déjà fait la manche ici aujourd\'hui : récolte divisée par deux.</b>' : ''}</p><p class="mut">Chaque heure : moral -4, hygiène -3. Si une connaissance te voit, tu perds de l'affinité.</p>${[1, 2, 4, 8].map(o => act(`${o}h`, () => { A.elemosina(o); ui.modal = null; }, `jusqu'à ${String((h + o) % 24).padStart(2, '0')}:${String(now().getMinutes()).padStart(2, '0')}`)).join('')}</div>`;
    return;
  }
  if (M.tipo === 'salvafile') {
    const ios = /iPhone|iPad|iPod/.test(navigator.userAgent); const picker = !!window.showSaveFilePicker; const share = !!navigator.share;
    e.innerHTML = `<div class="box"><h3>💾 Sauvegarder dans un fichier</h3><p class="mut" style="font-size:13px;line-height:1.5">Fichier : <b>${M.nome}</b><br>${picker ? 'Choisis le dossier et le nom dans la fenêtre qui s\'ouvre.' : ios ? 'Sur iPhone, le dossier se choisit depuis la feuille de partage : touche <b>Partager</b> → <b>Enregistrer dans Fichiers</b>. Avec <b>Télécharger</b>, le fichier va dans Fichiers → Téléchargements.' : 'Avec <b>Télécharger</b>, le navigateur le met dans le dossier Téléchargements.'}</p>
    ${picker ? btn('📁 Choisir où enregistrer…', () => salvaConPicker(M.data, M.nome)) : ''}
    ${share ? btn('📤 Partager → Enregistrer dans Fichiers', () => condividiFile(M.data, M.nome), picker ? 'sec' : 'pri') : ''}
    ${btn('⬇️ Télécharger le fichier', () => scaricaFile(M.data, M.nome), 'sec')}
    ${btn('📋 Copier la sauvegarde (texte)', () => copiaSalvataggio(M.data), 'sec')}
    <textarea id="svTxt" readonly style="position:absolute;left:-9999px;height:1px">${M.data.replace(/</g, '&lt;')}</textarea>
    ${btn('Fermer', () => { ui.modal = null; }, 'link')}</div>`;
    return;
  }
  if (M.tipo === 'codice') {
    e.innerHTML = `<div class="box"><h3>🔑 Code de partie</h3><p class="mut" style="font-size:13px;line-height:1.5">Code de ce téléphone : <b>${codiceGiocatore()}</b><br>Saisis le code d'une autre partie pour la reprendre ici (il se trouve dans l'onglet Moi → Sauvegardes).</p><input id="pidIn" placeholder="EX. ABCD-EFGH" autocapitalize="characters" autocomplete="off" style="text-transform:uppercase;letter-spacing:.08em">${btn('Reprendre la partie', () => { if (!cambiaCodice($('pidIn').value)) return; carica().then(s => { if (s) { S = s; render(); toast('Bon retour, ' + S.nome + '!'); } else { toast('Aucune partie avec ce code.'); } }); })}${btn('Annuler', () => { ui.modal = null; }, 'link')}</div>`;
    return;
  }
  if (M.tipo === 'caricafile') {
    e.innerHTML = `<div class="box"><h3>📂 Charger une sauvegarde</h3><p class="mut" style="font-size:13px">La partie en cours sera remplacée.</p>${btn('📂 Choisir un fichier…', caricaDaFile)}<p class="mut" style="font-size:13px;margin-top:10px">Ou colle ici le texte copié :</p><textarea id="ldTxt" placeholder="{…}" style="width:100%;height:80px;background:#1f2733;color:var(--txt);border:1px solid #2a3442;border-radius:10px;padding:8px;font-size:12px"></textarea>${btn('Importer le texte', importaTesto, 'sec')}${btn('Annuler', () => { ui.modal = null; }, 'link')}</div>`;
    return;
  }
  if (M.tipo === 'esito') {
    e.innerHTML = `<div class="box" style="border-top:4px solid ${M.ok ? 'var(--ok)' : 'var(--bad)'}"><h3>${M.titolo}</h3>${M.html}${btn(M.ok ? 'Parfait !' : 'Compris', () => { ui.modal = null; }, M.ok ? 'pri' : 'sec')}</div>`;
    return;
  }
  if (M.tipo === 'conferma') {
    e.innerHTML = `<div class="box"><h3>${M.titolo}</h3><p style="font-size:14px;line-height:1.5">${M.testo}</p>${btn('✅ ' + M.okLabel, () => { ui.modal = null; M.fn(); salva(); })}${btn('Annuler', () => { ui.modal = null; }, 'sec')}</div>`;
    return;
  }
  if (M.tipo === 'dormi') {
    const l = lavoro(); const tt = minutiFinoTurno(); const ost = !!M.ostello; const strada = !haCasa() && !ost; const DO = (h, m) => ost ? A.ostello(h, m) : A.dormi(h, m);
    const riga = (label, min, motivo) => { const st = stimaSonno(min, ost); const sv = new Date(now().getTime() + min * 60000); return act(`${label} <span class="mut">→ réveil</span> <b>${String(sv.getHours()).padStart(2, '0')}:${String(sv.getMinutes()).padStart(2, '0')}</b>`, () => { DO(min / 60, motivo); ui.modal = null; }, `${durata(min)} · ⚡${st.energia >= 0 ? '+' : ''}${st.energia} · 🍚${st.fame} · 🙂${st.umore >= 0 ? '+' : ''}${st.umore}${ost ? ' · ' + Ar(15000 * Math.ceil(min / 720)) + ' Ar' : ''}`); };
    let h = `<div class="box"><h3>😴 Dormir${ost ? ' à l\'auberge' : strada ? ' dans la rue' : ''}</h3><p class="mut">Il est <b>${oraStr()}</b>. Tu récupères <b>${ost ? 12 : 8 + casaComfortSonno()} énergie/heure</b> (${ost ? 'lit propre, douche incluse : hygiène +30 · 15.000 Ar par 12h' : strada ? 'par terre' : casa().nome.split(' a ')[0] + (ha('letto') ? ' + lit' : ha('materasso') ? ' + matelas' : ' sans matelas : -10')}). Moins de 5h : moral -6, santé -1. Plus de 10h : vaseux/se.</p>`;
    if (l.id !== 'nulla' && tt !== null) { const pre = { piedi: 0 }[0]; const sveglia = Math.max(30, tt - 90); h += riga(`⏰ Réveil 1h30 avant le service (${hh(l.inizio)})`, sveglia, 'avec le réveil pour le travail'); }
    if (S.scuola && (giornoIdx() < 4 || giornoIdx() === 6)) h += riga('🎓 Réveil à 6:30 pour les cours', minutiFinoA(6, 30), 'pour l\'école');
    h += `<div class="grid2">${[120, 240, 360, 480].map(m => riga(durata(m), m)).join('')}</div>`;
    h += `<h3 style="margin-top:8px">Réveil à une heure précise</h3><div style="display:flex;gap:6px"><input id="sH" type="number" min="0" max="23" placeholder="heures" inputmode="numeric" style="width:50%"><input id="sM" type="number" min="0" max="59" placeholder="min" inputmode="numeric" style="width:50%"></div>${btn('Dormir jusqu\'à cette heure', () => { const H = +$('sH').value, Mn = +$('sM').value || 0; if ($('sH').value === '') return toast('Saisis l\'heure du réveil.'); DO(minutiFinoA(clamp(H, 0, 23), clamp(Mn, 0, 59)) / 60, 'jusqu\'à ' + String(H).padStart(2, '0') + ':' + String(Mn).padStart(2, '0')); ui.modal = null; }, 'sec')}`;
    h += `<h3 style="margin-top:8px">Durée précise</h3><div style="display:flex;gap:6px"><input id="zH" type="number" min="0" placeholder="heures" inputmode="numeric" style="width:50%"><input id="zM" type="number" min="0" max="59" placeholder="min" inputmode="numeric" style="width:50%"></div>${btn('Dormir cette durée', () => { const m = (+$('zH').value || 0) * 60 + (+$('zM').value || 0); if (m <= 0) return toast('Saisis une durée.'); DO(m / 60); ui.modal = null; }, 'sec')}</div>`;
    e.innerHTML = h; return;
  }
  if (M.tipo === 'aspetta') {
    const l = lavoro(); const tt = minutiFinoTurno(); const fatto = S.flags.lavoratoOggi === now().toDateString();
    let h = `<div class="box"><h3>⏳ Attendre</h3><p class="mut">Il est <b>${oraStr()}</b>. En attendant tu récupères ~8 énergie/heure.</p>`;
    if (l.id !== 'nulla' && tt !== null && !fatto) h += act(`💼 Jusqu'au début du service (${hh(l.inizio)})`, () => { A.aspetta(tt, 'jusqu\'au début du service'); ui.modal = null; if (S.loc === 'lavoro') A.lavora(); }, `${durata(tt)} · ${S.loc === 'lavoro' ? 'puis tu pointes tout de suite' : 'tu arrives juste à l\'heure si tu es déjà sur place'}`);
    if (S.scuola && giornoIdx() < 5) h += act('🎓 Jusqu\'à 8:00 (cours)', () => { A.aspetta(minutiFinoA(8), 'jusqu\'aux cours'); ui.modal = null; }, durata(minutiFinoA(8)));
    h += `<div class="grid2">${[15, 30, 60, 120, 180, 240].map(m => act(durata(m), () => { A.aspetta(m); ui.modal = null; })).join('')}</div>`;
    h += `<h3 style="margin-top:8px">Jusqu'à une heure précise</h3><div style="display:flex;gap:6px;align-items:center"><input id="wH" type="number" min="0" max="23" placeholder="heures" inputmode="numeric" style="width:50%"><input id="wM" type="number" min="0" max="59" placeholder="min" inputmode="numeric" style="width:50%"></div>${btn('Attendre jusqu\'à cette heure', () => { const H = +$('wH').value, Mn = +$('wM').value || 0; if (isNaN(H) || $('wH').value === '') return toast('Saisis l\'heure.'); A.aspetta(minutiFinoA(clamp(H, 0, 23), clamp(Mn, 0, 59)), 'jusqu\'à ' + String(H).padStart(2, '0') + ':' + String(Mn).padStart(2, '0')); ui.modal = null; }, 'sec')}`;
    h += `<h3 style="margin-top:8px">Durée précise</h3><div style="display:flex;gap:6px"><input id="dH" type="number" min="0" placeholder="heures" inputmode="numeric" style="width:50%"><input id="dM" type="number" min="0" max="59" placeholder="min" inputmode="numeric" style="width:50%"></div>${btn('Attendre cette durée', () => { const m = (+$('dH').value || 0) * 60 + (+$('dM').value || 0); if (m <= 0) return toast('Saisis une durée.'); A.aspetta(m); ui.modal = null; }, 'sec')}</div>`;
    e.innerHTML = h; return;
  }
  if (M.tipo === 'morte') { e.onclick = null; e.innerHTML = `<div class="box" style="border-top:4px solid var(--bad)"><h3>☠️ Tu es mort(e)</h3><p>Ta vie à Antananarivo s'est terminée à ${S.eta} ans après ${S.stat.gg} jours. Patrimoine final : ${Ar(S.soldi + (S.banca?.saldo || 0))} Ar.</p><button class="pri" id="bNuovaVita" style="width:100%">🌅 Nouvelle vie</button></div>`; const nb = $('bNuovaVita'); if (nb) nb.onclick = ev => { ev.stopPropagation(); nuovaVita(); }; return; }
  if (M.tipo === 'chat') {
    const p = png(M.id); if (!p) { ui.modal = null; return; }
    const romantic = p.eta >= 18 && !['capo', 'poliziotto', 'medico', 'professore', 'bancario'].includes(p.ruolo); const ga = giornoAnno(now());
    let azioni = act('☕ Sortir ensemble', () => A.uscita(p.id), '3h · 15.000 Ar · affinité +8') + act('🎁 Cadeau : fleurs', () => A.regalo(p.id, 'fiori'), '30 min · 5.000 Ar · affinité +5') + act('🎁 Cadeau : bijou', () => A.regalo(p.id, 'gioiello'), '30 min · 200.000 Ar · affinité +20');
    if (p.comp === ga) azioni += act('🎂 Fêter son anniversaire', () => A.compleannoPNG(p.id), '3h · 20.000 Ar · affinité +12');
    if (romantic && !S.partner && p.stato === 'conoscente') azioni += act('💕 Se déclarer', () => conferma('💕 Te déclarer ?', `Tu demandes à <b>${p.nome}</b> de sortir avec toi. En cas de refus tu perds 10 d'affinité.`, () => A.fidanzati(p.id), 'Me déclarer'), `affinité ${p.aff} (il faut 55) · attirance ${p.rom || 0} (il faut 25)`);
    if (p.id === S.partner) { if (p.stato === 'fidanzato') azioni += act('💍 Demande en mariage', () => conferma('💍 Demander sa main ?', `Bague : <b>200.000 Ar</b>. Ensuite le mariage se célèbre à la Commune (Anosy).`, () => A.proponi(p.id), 'Demander'), 'bague 200.000 Ar'); if (p.stato === 'promesso') azioni += '<p class="mut">Va à la Commune (Anosy) pour célébrer le mariage.</p>'; if (['sposato', 'fidanzato'].includes(p.stato)) azioni += act('👶 Essayer d\'avoir un enfant', () => conferma('👶 Un enfant ?', `Avec ${p.nome}. Un bébé coûte ~60.000 Ar/mois et naît après 9 mois. Probabilité 50%.`, () => A.figlio(p.id), 'Essayons')); azioni += act('💔 Quitter', () => conferma('💔 Quitter ' + p.nome + '?', S.sposato ? '<b>Divorce :</b> tu perds la moitié de tes économies en banque et moral -20.' : 'Moral -20. On ne revient pas facilement en arrière.', () => A.lascia(p.id), 'Je quitte')); }
    e.innerHTML = `<div class="box"><div class="person">${avatarHtml(p)}<div class="n"><b>${p.nome} ${p.cognome}</b>, ${p.eta} <div class="mut">${ruoloTxt(p)} · ${p.quartiere} · ${trattiTxt(p)}</div><div class="heart"><b style="width:${p.aff}%"></b></div></div><span class="mut">${p.aff}</span></div>
    <div class="chat" id="chatBox">${p.storia.slice(-8).map(m => `<div class="msg ${m.role === 'user' ? 'me' : 'them'}">${esc(m.content)}</div>`).join('') || '<div class="mut">Commence la conversation. « Salama ! » ouvre toutes les portes.</div>'}</div>
    <div style="display:flex;gap:6px"><input id="chatIn" placeholder="Écris quelque chose…" autocomplete="off"><button class="sec" id="chatSend">➤</button></div>
    <details style="margin-top:8px"><summary class="mut">Actions avec ${p.nome}</summary>${azioni}</details></div>`;
    const send = async () => { const t = $('chatIn').value.trim(); if (!t) return; $('chatIn').value = ''; const box = $('chatBox'); box.innerHTML += `<div class="msg me">${esc(t)}</div><div class="msg them mut" id="typing">…</div>`; box.scrollTop = 1e9; const r = await parla(p, t); const ty = $('typing'); if (ty) { ty.textContent = r; ty.classList.remove('mut'); ty.id = ''; } box.scrollTop = 1e9; renderHeader(); salva(); };
    $('chatSend').onclick = send; $('chatIn').onkeydown = ev => { if (ev.key === 'Enter') send(); };
    $('chatBox').scrollTop = 1e9;
  }
}

/* ---------- AVVIO ---------- */
window.apriChat = apriChat; window.ui = ui; window.render = render; window.carica = carica; window.toast = toast;
(async () => { const s = await carica(); if (s) S = s; render(); })();
