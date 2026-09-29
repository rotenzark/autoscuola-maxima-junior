/* PLUMBING_V 4 — Bespoke Studio · meccanica invisibile canonica.
   ────────────────────────────────────────────────────────────────
   CONFINE (inviolabile): questo file contiene SOLO plumbing — la meccanica
   che il visitatore non percepisce come design. NIENTE markup di sezioni,
   NIENTE stile, NIENTE struttura: concept, griglia, tipografia, hero e
   animazioni-firma si progettano DA ZERO per ogni cliente (GATE #3).
   Se qui dentro scivola del layout, questo diventa il nuovo scheletro
   condiviso — cioè il difetto "copia-incolla" che il metodo combatte.

   Come si usa: si COPIA nella cartella js/ del sito e si adatta la sola
   costante SITE. Le animazioni-firma del sito si scrivono nel proprio
   main.js DOPO questo file (o in coda a questo file, sotto il marcatore).
   Ogni bug nuovo si corregge QUI (bump PLUMBING_V + changelog nel README)
   e poi nel sito: mai il contrario.

   Fix già incorporati (non rimuovere):
   - ScrollTrigger registrato SUBITO allo script load, MAI dentro l'intro
     o un setTimeout (bug APF #5 del 16/7: race col watchdog → sezioni
     che sparivano allo scroll).
   - Reveal con once:true (niente re-animazioni da zero ri-scorrendo).
   - Watchdog 1,5s che forza visibile e UCCIDE i trigger non scattati.
   - Lightbox su [hidden] + override CSS !important (bug: display:flex
     batteva [hidden] e la lightbox restava visibile).
   - Foto-contenuto MAI lazy (regola workflow §8): il plumbing non tocca
     il loading, ma il lint lo verifica.
   - Orari Europe/Rome con finestre multiple e scavalco di mezzanotte
     (pattern Il Cavallante 18:00–00:30). */

(function () {
  'use strict';
  var root = document.documentElement;
  root.classList.add('js');
  var reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (reducedMotion) root.classList.add('reduced-motion');

  /* ══════════ CONFIG PER-SITO — l'unica parte da adattare ══════════ */
  var SITE = {
    slug: 'autoscuola-maxima-junior',
    /* WhatsApp sul numero della scheda Google: PagineGialle lo dà come WhatsApp dell'attività */
    whatsapp: {
      number: '393755219329',
      message: 'Ciao, vorrei informazioni per la patente.',
      ids: ['waTestata', 'waMenu', 'waApertura', 'waOrari', 'waPiede', 'waBarra'],
    },
    /* Google (29/9/2026) e il cartello giallo sulla porta (gennaio 2022): lunedì–venerdì 10–12 e 15–19, sabato 10–12, domenica chiuso */
    hours: {
      0: [],
      1: [['10:00', '12:00'], ['15:00', '19:00']],
      2: [['10:00', '12:00'], ['15:00', '19:00']],
      3: [['10:00', '12:00'], ['15:00', '19:00']],
      4: [['10:00', '12:00'], ['15:00', '19:00']],
      5: [['10:00', '12:00'], ['15:00', '19:00']],
      6: [['10:00', '12:00']],
    },
    hoursStatusId: 'orarioStato',
    hoursTableSelector: '[data-day]',
    todayClass: 'is-today',
    introId: 'intro',
    introDuration: 1800,
    revealSelector: '.reveal',
    inViewClass: 'in-view',
    breakpointMenu: 1040,
    EN: {
      "m.salta": "Skip to the content",
      "m.top": "Autoscuola Maxima Junior: back to the top",
      "m.nav": "The sections",
      "m.lingua": "Language",
      "m.menu": "Open the menu",
      "m.ingrandisci": "Enlarge the photo",
      "m.lightbox": "Enlarged photo",
      "m.chiudi": "Close",
      "n.patenti": "The licences",
      "n.rime": "The rhymes",
      "n.dicono": "Reviews",
      "n.orari": "Hours and where",
      "n.domande": "Questions",
      "t.scrivi": "WhatsApp",
      "t.chiama": "Call",
      "h.sopra": "Driving school · Via dei Biancospini 14 · Lorenteggio",
      "h.titolo": "From first gear <span class=\"a-capo\">to fifth.</span>",
      "h.testo": "Car (B) and motorbike licences, renewals and points recovery, a short walk from the M4 Frattini and Gelsomini stops. Former students talk about patient instructors, Saturdays for those who can’t make it during the week, and learning the Highway Code with rhymes.",
      "h.voto": "64 reviews on Google",
      "h.scrivi": "Message on WhatsApp",
      "cb.invito": "Pull the lever, or pick a gear.",
      "cb.rifai": "Replay the route",
      "cb.titolo": "The gearbox, from first to fifth",
      "cb.desc": "The gear pattern from their shop sign: the H with first, second, third, fourth, fifth and reverse. The knob is in fifth.",
      "cb.lista": "The steps to the licence, one per gear",
      "cb.t1": "Enrolment and medical check",
      "cb.t2": "Theory, with rhymes",
      "cb.t3": "The theory test: the learner’s permit",
      "cb.t4": "Driving lessons",
      "cb.t5": "The driving test: licence!",
      "cb.tr": "Renewals and points recovery",
      "p.etichetta": "The licences",
      "p.titolo": "The car, the motorbike, and what comes after",
      "p.b": "The car licence",
      "p.bt": "Theory lessons on site, driving lessons, the two tests: the five gears of the gearbox above.",
      "p.ms": "Motorbike",
      "p.m": "The motorbike licence",
      "p.mt": "For two wheels as well: on their Instagram, new riders celebrate with their helmet in hand.",
      "p.rs": "Renewal",
      "p.r": "Licence renewal",
      "p.rt": "With the medical check on site: ask the office for the day.",
      "p.ps": "Points",
      "p.p": "Points recovery",
      "p.pt": "The courses to recover the points lost on your licence.",
      "p.nota": "For other categories, and to find out when the next theory course starts, write or drop by the office.",
      "r.etichetta": "The rhymes",
      "r.titolo": "The Highway Code, with rhymes",
      "r.chi": "on Google: she got her B licence there",
      "r.testo": "Signs, right of way, signals: in theory lessons the Highway Code is also learnt this way, with rhymes and songs. Students have been saying so for years.",
      "r.testo2": "A family-run school in two shop fronts on Via dei Biancospini: the office, the theory lessons, and the door where the licence photo is taken.",
      "f2.etichetta": "Licence passed",
      "f2.titolo": "The photo in front of the door",
      "a.vetrina": "The two shop fronts of the driving school at Via dei Biancospini 14: on the left the AUTOSCUOLA sign, on the right AUTOSCUOLA MAXIMA JUNIOR and the glass door with AUTOSCUOLA written vertically; a yellow car parked in front.",
      "c.vetrina": "The two shop fronts at Via dei Biancospini 14.",
      "f2.testo": "Once the test is passed, the photo is taken right there: in front of the door, new licence in hand. There are dozens of them on their Instagram, one after another, with cars and motorbikes.",
      "f2.ig": "The photos on Instagram",
      "d.etichetta": "Reviews",
      "d.titolo": "First time, and without anxiety",
      "d.voto": "on Google, 64 reviews",
      "d.m2": "Google, 2 months ago",
      "d.m3": "Google, 3 months ago",
      "d.a3": "Google, 3 years ago",
      "d.a5": "Google, 5 years ago",
      "d.a9": "Google, 9 years ago",
      "d.nota": "From the reviews on Google, as they were written (in Italian); cuts are marked […]. The sentence in “The rhymes” is from another student.",
      "d.tutte": "All the reviews on Google",
      "o.etichetta": "Hours and where",
      "o.titolo": "Monday to Saturday morning",
      "a.porta": "The right-hand shop front: the AUTOSCUOLA MAXIMA JUNIOR sign and the glass door.",
      "o.c3": "Where",
      "o.c3v": "Via dei Biancospini 14, 20146 Milan",
      "o.c4": "Hours",
      "o.cap": "Opening hours",
      "g.lun": "Monday",
      "g.mar": "Tuesday",
      "g.mer": "Wednesday",
      "g.gio": "Thursday",
      "g.ven": "Friday",
      "g.sab": "Saturday",
      "g.dom": "Sunday",
      "g.chiuso": "closed",
      "o.c5": "Phone",
      "o.c5v": "(WhatsApp too)",
      "o.c8": "Getting there",
      "o.c8v": "M4 Frattini and Gelsomini, about 350 metres away · tram on Via Brunelleschi, 240 metres away",
      "o.c9": "Licences",
      "o.c9v": "B · motorbike · renewals · points recovery",
      "o.mappa": "Map: Autoscuola Maxima Junior, Via dei Biancospini 14, Milan",
      "o.indicazioni": "Directions",
      "q.etichetta": "Questions",
      "q.titolo": "Before you enrol",
      "q.1": "Which licences can I get?",
      "q.1r": "The B licence for cars and the licences for motorbikes; then licence renewal and points recovery courses. For other categories, ask the office.",
      "q.2": "Are you open on Saturdays?",
      "q.2r": "Yes, in the morning, from 10 am to 12 noon. Monday to Friday from 10 am to 12 noon and from 3 pm to 7 pm.",
      "q.3": "Can I renew my licence with you?",
      "q.3r": "Yes, with the medical check on site: ask the office for the day.",
      "q.4": "How do I enrol?",
      "q.4r": "At the office, Via dei Biancospini 14, during opening hours. For information you can also write on WhatsApp or call +39 375 521 9329.",
      "q.5": "How do I get there?",
      "q.5r": "By M4: the Frattini and Gelsomini stops are about 350 metres away. The tram stops on Via Brunelleschi, 240 metres away.",
      "f.orario": "Monday–Friday 10 am–12 noon and 3–7 pm · Saturday 10 am–12 noon",
      "f.cred": "Demo website made by <a href=\"https://bespokestud.io\" rel=\"noopener\">Bespoke Studio</a> · the photo is theirs, from their Google listing; hours and reviews from Google, the licences from the reviews, Instagram and PagineGialle (September 2026). We drew the gearbox ourselves, from the circle on their shop sign.",
      "f.su": "Back to the top ↑"
    },
    LANGS: null,
    RTL: ['ar', 'he', 'fa', 'ur'],
    HOURS_I18N: null,
  };
  /* normalizzazione: EN storico -> LANGS */
  if (!SITE.LANGS) SITE.LANGS = SITE.EN && Object.keys(SITE.EN).length ? { en: SITE.EN } : {};
  var LANG_CODES = Object.keys(SITE.LANGS);   // senza 'it', che è il DOM
  /* ═════════════════════════════════════════════════════════════════ */

  /* ---------- WhatsApp wiring ---------- */
  if (SITE.whatsapp.number) {
    var waHref = 'https://wa.me/' + SITE.whatsapp.number + '?text=' +
      encodeURIComponent(SITE.whatsapp.message);
    SITE.whatsapp.ids.forEach(function (id) {
      var el = document.getElementById(id);
      if (el) { el.href = waHref; el.target = '_blank'; el.rel = 'noopener'; }
    });
  }

  /* ---------- GSAP: registrazione IMMEDIATA + reveal + watchdog ---------- */
  var hasGsap = typeof gsap !== 'undefined';
  var hasST = hasGsap && typeof ScrollTrigger !== 'undefined';
  if (hasST) gsap.registerPlugin(ScrollTrigger);

  function showAllReveals() {
    var els = document.querySelectorAll(SITE.revealSelector);
    els.forEach(function (el) { el.classList.add(SITE.inViewClass); });
    if (hasGsap) {
      if (hasST) {
        els.forEach(function (el) {
          ScrollTrigger.getAll().forEach(function (st) {
            if (st.trigger === el && !st.progress) st.kill();
          });
        });
      }
      gsap.set(els, { opacity: 1, y: 0, x: 0 });
    }
  }
  // FIX FOUC (18/7): il watchdog è SOLO un fallback se GSAP non c'è (o reduced-motion).
  // Rivelare in anticipo tutti i .reveal mentre gli scroll-trigger sono attivi causava il
  // flash (scompaiono/ricompaiono) sotto la piega. Con GSAP attivo, rivelano gli ScrollTrigger.
  setTimeout(function () { if (!hasGsap || reducedMotion) showAllReveals(); }, 1500);

  if (hasGsap && !reducedMotion) {
    // reveal generico: le animazioni-FIRMA del sito vanno oltre questo,
    // ma si registrano ANCHE LORO subito, mai dopo l'intro.
    // ⚠️ REGOLA ANTI-FLASH (18/7): un elemento .reveal deve avere UNA SOLA animazione che
    // ne porta l'opacità a 1. Se un elemento ha una FIRMA che ne anima l'opacità (stagger,
    // timeline, ecc.), ESCLUDILO da qui via SITE.revealSelector (es. '.reveal:not(.mondo)'),
    // altrimenti il reveal generico + la firma si sovrappongono e l'elemento FLASHA.
    // immediateRender:false → lo stato "from" (opacity:0) NON viene ri-applicato ad ogni
    // ScrollTrigger.refresh() (che scatta al window.load mentre scrolli) → niente flash su refresh.
    gsap.utils.toArray(SITE.revealSelector).forEach(function (el) {
      gsap.fromTo(el, { opacity: 0, y: 28 }, {
        opacity: 1, y: 0, duration: 0.7, ease: 'power2.out', immediateRender: false,
        scrollTrigger: { trigger: el, start: 'top 88%', once: true },
      });
    });
  } else {
    // fallback senza GSAP: IntersectionObserver + classe
    if ('IntersectionObserver' in window && !reducedMotion) {
      var io = new IntersectionObserver(function (entries) {
        entries.forEach(function (e) {
          if (e.isIntersecting) { e.target.classList.add(SITE.inViewClass); io.unobserve(e.target); }
        });
      }, { threshold: 0.12 });
      document.querySelectorAll(SITE.revealSelector).forEach(function (el) { io.observe(el); });
    } else {
      showAllReveals();
    }
  }

  /* ---------- intro skippabile (NON gate-a nulla) ---------- */
  var intro = document.getElementById(SITE.introId);
  /* ⚠️ L'hook si legge AL MOMENTO DELLA CHIAMATA, mai catturato per valore
     qui. Il codice-firma vive sotto il marcatore di fine plumbing — cioè
     gira DOPO questa riga — quindi `window.bespokeHeroEntrance ||
     function(){}` congelava la funzione vuota e l'entrata dell'hero non
     partiva più: titolo a opacity 0 per sempre, hero vuota sul live.
     (20/7/2026, riprodotto a schermo su Benessere Futuro #159.) */
  function heroEntrance() {
    if (typeof window.bespokeHeroEntrance === 'function') window.bespokeHeroEntrance();
  }
  function hideIntro() {
    if (!intro) return;
    var el = intro; intro = null;
    el.classList.add('hide');
    setTimeout(function () { el.remove(); }, 700);
    heroEntrance();
  }
  // rimozione IMMEDIATA (niente fade): serve quando qualcosa deve stare sopra
  // l'intro subito, es. l'apertura del menu. Durante il fade l'intro resta
  // hit-testable e i link del drawer non sono cliccabili.
  function killIntroNow() {
    if (!intro) return;
    var el = intro; intro = null;
    el.remove();
    heroEntrance();
  }
  if (reducedMotion || !intro) {
    if (intro) { intro.remove(); intro = null; }
    /* ⚠️ setTimeout 0 NON è decorativo: senza intro questo ramo gira in modo
       SINCRONO, cioè PRIMA che il codice-firma — che sta sotto il marcatore
       di fine plumbing, dentro questa stessa IIFE — abbia assegnato
       `window.bespokeHeroEntrance`. Il risultato è un'entrata dell'hero MUTA:
       nessun errore, elementi visibili, animazione semplicemente mai partita.
       Rimandando di un tick la IIFE è conclusa e l'hook esiste.
       (14/8/2026, A.S.FA. Sicilia: misurato h1 a opacity 1 già al load.)
       Cugino del bug `hero-hook-congelato` del 20/7: lì l'hook era catturato
       troppo presto, qui è CHIAMATO troppo presto. */
    setTimeout(heroEntrance, 0);
  } else {
    setTimeout(hideIntro, SITE.introDuration);
    setTimeout(hideIntro, 6000); // safety net: l'intro non può incastrarsi
    intro.addEventListener('click', hideIntro);
  }

  /* ---------- burger menu (inert + focus + Escape + resize) ---------- */
  var burger = document.getElementById('burger');
  /* 26/7/2026 (Il Papiro #168) — IL PANNELLO SI RISOLVE DA `aria-controls`.
     Il canone apriva sempre `#mainNav`, dando per scontato che la nav
     desktop FOSSE anche il drawer. Molti siti invece hanno un drawer
     separato (`#mobile-menu`) con `hidden`, mentre `#mainNav` su mobile è
     `display:none`: il burger aggiungeva `nav-open` a un elemento nascosto
     e il menu non si apriva. È la stessa decisione già presa il 20/7 per
     qa-motion — «è lì che il markup accessibile dice qual è il pannello» —
     che però non era mai rientrata qui. */
  var nav = (function () {
    var byAria = burger && burger.getAttribute('aria-controls');
    return (byAria && document.getElementById(byAria)) || document.getElementById('mainNav');
  })();
  if (burger && nav) {
    var navUsaHidden = nav.hasAttribute('hidden');
    var lastFocus = null;
    var closeNav = function () {
      nav.classList.remove('nav-open');
      if (navUsaHidden) nav.hidden = true;
      burger.setAttribute('aria-expanded', 'false');
      if (lastFocus) { lastFocus.focus(); lastFocus = null; }
    };
    var openNav = function () {
      // L'intro ha z-index alto ed è figlia del body: se è ancora a schermo
      // copre il drawer (che vive nello stacking context dell'header) e i link
      // risultano non cliccabili. Aprire il menu chiude l'intro.
      // (bug trovato da qa-motion su Linea Uomo, 19/7/2026 → PLUMBING_V 2)
      if (typeof killIntroNow === 'function') killIntroNow();
      lastFocus = document.activeElement;
      if (navUsaHidden) nav.hidden = false;
      nav.classList.add('nav-open');
      burger.setAttribute('aria-expanded', 'true');
      var first = nav.querySelector('a, button');
      if (first) first.focus();
    };
    burger.addEventListener('click', function () {
      nav.classList.contains('nav-open') ? closeNav() : openNav();
    });
    nav.querySelectorAll('a').forEach(function (a) { a.addEventListener('click', closeNav); });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && nav.classList.contains('nav-open')) closeNav();
    });
    window.addEventListener('resize', function () {
      if (window.innerWidth > SITE.breakpointMenu) closeNav();
    });
  }

  /* ---------- lightbox accessibile ---------- */
  var lightbox = document.getElementById('lightbox');
  var lightboxImg = document.getElementById('lightboxImg');
  var lightboxClose = document.getElementById('lightboxClose');
  if (lightbox && lightboxImg) {
    var opener = null;
    var openLb = function (src, alt) {
      lightboxImg.src = src; lightboxImg.alt = alt || '';
      lightbox.hidden = false;
      document.body.style.overflow = 'hidden';
      if (lightboxClose) lightboxClose.focus();
    };
    var closeLb = function () {
      lightbox.hidden = true; lightboxImg.src = '';
      document.body.style.overflow = '';
      if (opener) { opener.focus(); opener = null; }
    };
    document.querySelectorAll('[data-full]').forEach(function (btn) {
      btn.addEventListener('click', function () {
        opener = btn;
        var img = btn.querySelector('img');
        openLb(btn.getAttribute('data-full'), img ? img.alt : '');
      });
    });
    if (lightboxClose) lightboxClose.addEventListener('click', closeLb);
    lightbox.addEventListener('click', function (e) { if (e.target === lightbox) closeLb(); });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && !lightbox.hidden) closeLb();
    });
  }

  /* ---------- orari dinamici Europe/Rome (finestre multiple + scavalco) ---------- */
  function romeNow() {
    try {
      var f = new Intl.DateTimeFormat('en-GB', {
        timeZone: 'Europe/Rome', weekday: 'short', hour: '2-digit', minute: '2-digit', hour12: false,
      });
      var p = f.formatToParts(new Date());
      var map = { Sun: 0, Mon: 1, Tue: 2, Wed: 3, Thu: 4, Fri: 5, Sat: 6 };
      var get = function (t) { return p.find(function (x) { return x.type === t; }).value; };
      return { day: map[get('weekday')], mins: parseInt(get('hour'), 10) * 60 + parseInt(get('minute'), 10) };
    } catch (e) {
      var d = new Date();
      return { day: d.getDay(), mins: d.getHours() * 60 + d.getMinutes() };
    }
  }
  var toMin = function (hm) {
    var a = hm.split(':');
    return parseInt(a[0], 10) * 60 + parseInt(a[1], 10);
  };
  var fmt = function (m) {
    m = m % 1440;
    return ('0' + Math.floor(m / 60)).slice(-2) + ':' + ('0' + (m % 60)).slice(-2);
  };
  var DAYS_IT = ['domenica', 'lunedì', 'martedì', 'mercoledì', 'giovedì', 'venerdì', 'sabato'];
  var DAYS_EN = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  var HOURS_BASE = {
    it: { open: 'Aperto ora', closesAt: 'chiude alle ', opensToday: 'Chiuso · apre oggi alle ',
          opensOn: 'Chiuso · apre {day} alle ', closed: 'Chiuso', days: DAYS_IT },
    en: { open: 'Open now', closesAt: 'closes at ', opensToday: 'Closed · opens today at ',
          opensOn: 'Closed · opens {day} at ', closed: 'Closed', days: DAYS_EN },
  };
  /* risolve le etichette orari per la lingua richiesta, con fallback en -> it */
  function strings(lang) {
    var custom = (SITE.HOURS_I18N && SITE.HOURS_I18N[lang]) || null;
    var base = HOURS_BASE[lang] || HOURS_BASE.en;
    if (!custom) return base;
    var outp = {};
    Object.keys(HOURS_BASE.it).forEach(function (k) {
      outp[k] = custom[k] !== undefined ? custom[k] : base[k];
    });
    return outp;
  }

  function hoursState() {
    var now = romeNow();
    // finestra del giorno corrente
    var wins = SITE.hours[now.day] || [];
    for (var i = 0; i < wins.length; i++) {
      var s = toMin(wins[i][0]), e = toMin(wins[i][1]);
      if (now.mins >= s && now.mins < Math.min(e, 1440)) {
        return { open: true, day: now.day, closesAt: fmt(e) };
      }
    }
    // coda dopo mezzanotte della sera PRIMA
    var prev = (now.day + 6) % 7;
    var pw = SITE.hours[prev] || [];
    for (var j = 0; j < pw.length; j++) {
      var pe = toMin(pw[j][1]);
      if (pe > 1440 && now.mins < pe - 1440) {
        return { open: true, day: prev, closesAt: fmt(pe) };
      }
    }
    // chiuso: prossima apertura (oggi o nei prossimi 7 giorni)
    for (var k = 0; k < wins.length; k++) {
      if (now.mins < toMin(wins[k][0])) {
        return { open: false, day: now.day, opensToday: fmt(toMin(wins[k][0])) };
      }
    }
    for (var d = 1; d <= 7; d++) {
      var nd = (now.day + d) % 7;
      var nw = SITE.hours[nd] || [];
      if (nw.length) return { open: false, day: now.day, opensDay: nd, opensAt: fmt(toMin(nw[0][0])) };
    }
    return { open: false, day: now.day };
  }

  function renderHours() {
    var el = document.getElementById(SITE.hoursStatusId);
    var st = hoursState();
    document.querySelectorAll(SITE.hoursTableSelector).forEach(function (row) {
      row.classList.toggle(SITE.todayClass,
        parseInt(row.getAttribute('data-day'), 10) === st.day);
    });
    if (!el) return;
    /* V4: le etichette si risolvono per lingua corrente, non con un booleano
       en/it. Fallback a catena lingua -> en -> it, così un sito con AR o FR
       che non traduce lo stato orari resta comunque leggibile. */
    var L = strings(root.lang);
    var txt;
    if (st.open) {
      txt = L.open + ' · ' + L.closesAt + st.closesAt;
    } else if (st.opensToday) {
      txt = L.opensToday + st.opensToday;
    } else if (st.opensAt !== undefined) {
      txt = L.opensOn.replace('{day}', L.days[st.opensDay]) + st.opensAt;
    } else {
      txt = L.closed;
    }
    el.textContent = txt;
  }
  renderHours();
  setInterval(renderHours, 60000);

  /* ---------- i18n overlay (EN sopra l'IT del DOM) ---------- */
  var originals = {}; // attr -> key -> testo IT
  var I18N_ATTRS = [
    ['data-i18n', null],
    ['data-i18n-aria', 'aria-label'],
    ['data-i18n-alt', 'alt'],
    ['data-i18n-placeholder', 'placeholder'],
    ['data-i18n-title', 'title'],
  ];
  function setLang(lang) {
    /* V4: qualunque lingua dichiarata in SITE.LANGS, non più solo 'en'.
       'it' resta la lingua del DOM: nessun dizionario, nessuna sostituzione.
       Una lingua sconosciuta ricade su 'it' invece di rompere la pagina. */
    root.lang = (lang === 'it' || LANG_CODES.indexOf(lang) !== -1) ? lang : 'it';
    root.dir = SITE.RTL.indexOf(root.lang) !== -1 ? 'rtl' : 'ltr';
    var dict = SITE.LANGS[root.lang] || null;
    I18N_ATTRS.forEach(function (pair) {
      var dattr = pair[0], target = pair[1];
      if (!originals[dattr]) originals[dattr] = {};
      document.querySelectorAll('[' + dattr + ']').forEach(function (el) {
        var key = el.getAttribute(dattr);
        var store = originals[dattr];
        /* innerHTML, NON textContent: gli elementi tradotti contengono
           quasi sempre markup (<strong>, <br>) e con textContent il primo
           passaggio a EN lo appiattisce — tornando in italiano il grassetto
           non torna più. I valori del dizionario sono statici e scritti da
           noi. (20/7/2026: la flotta era già così, il boilerplate no.) */
        if (!(key in store)) store[key] = target ? el.getAttribute(target) : el.innerHTML;
        var val = dict && dict[key] !== undefined ? dict[key] : store[key];
        if (target) el.setAttribute(target, val); else el.innerHTML = val;
      });
    });
    renderHours();
    /* stato visivo della coppia di bottoni lingua, se il sito la usa */
    document.querySelectorAll('[data-lang]').forEach(function (b) {
      var on = b.getAttribute('data-lang') === root.lang;
      b.classList.toggle('is-on', on);
      if (b.tagName === 'BUTTON') b.setAttribute('aria-pressed', on ? 'true' : 'false');
    });
    try { localStorage.setItem(SITE.slug + '-lang', lang); } catch (e) {}
  }
  /* 26/7/2026 (Il Papiro #168) — SI CABLANO ENTRAMBE LE FORME DI SELETTORE.
     Il canone conosceva solo il toggle singolo `#langToggle`, ma nella
     flotta esiste da tempo anche la COPPIA di bottoni `[data-lang]`
     (Warsa, Mido…): `i18n-roundtrip` era già stato insegnato a riconoscerle
     il 20/7, il plumbing no. Chi copiava il boilerplate e usava la coppia
     si ritrovava il cambio lingua MORTO, e nessun lint statico se ne
     accorgeva (lo becca solo qa-motion, a runtime). */
  var langToggle = document.getElementById('langToggle');
  if (langToggle) {
    /* V4: il toggle singolo CICLA sull'anello ['it', ...LANG_CODES].
       Con due lingue il comportamento è identico a prima (it <-> en). */
    var RING = ['it'].concat(LANG_CODES);
    langToggle.addEventListener('click', function () {
      var i = RING.indexOf(root.lang);
      setLang(RING[(i + 1) % RING.length]);
    });
  }
  document.querySelectorAll('[data-lang]').forEach(function (b) {
    b.addEventListener('click', function () { setLang(b.getAttribute('data-lang')); });
  });
  try {
    var saved = localStorage.getItem(SITE.slug + '-lang');
    if (saved && saved !== 'it' && LANG_CODES.indexOf(saved) !== -1) setLang(saved);
  } catch (e) {}

  /* ---------- action-bar mobile (opzionale: #actionBar) ---------- */
  var actionBar = document.getElementById('actionBar');
  if (actionBar) {
    var onScroll = function () {
      actionBar.classList.toggle('is-visible', window.scrollY > window.innerHeight * 0.6);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
  }

  /* ══════════ FINE PLUMBING — da qui in giù SOLO il codice-firma
     del sito (animazioni e interazioni uniche del cliente), che si
     registra comunque SUBITO, mai dentro setTimeout/intro. ══════════ */

  /* ══════════ AUTOSCUOLA MAXIMA JUNIOR — «Dalla prima alla quinta.» ══════════
     La pagina ha il loro cartello: «AUTOSCUOLA» nero, «MAXIMA JUNIOR» rosa, il cerchio col cambio.
     la FIRMA — il cambio: il cerchio del cartello, grande, con la H incisa; il pomello parte in folle e ingrana 1→2→3→4→5 passando
     sempre dalla folle (mai in diagonale), e a ogni marcia si accende la sua tappa della patente sul cruscotto (iscrizione e visita
     medica, la teoria, l'esame di teoria, le guide, l'esame di guida). Poi il pomello si tira col mouse o col dito, SOLO dentro la H:
     lasciato in fondo a una corsia innesta, lasciato a metà torna in folle e si centra sulla corsia 3–4, come una leva vera. Le tappe
     del cruscotto (e i numeri) portano il pomello alla loro marcia per la strada giusta; «Rifai il percorso» rifà l'intro. Stato
     finale = l'SVG (pomello in quinta, tappa 5 accesa). Senza JS: lo stato finale, l'invito e il bottone nascosti col loro posto, il
     cruscotto è una lista che si legge. Con reduced-motion: lo stato finale subito; il pomello si tira ma innesta o torna senza
     animazione; le tappe lo spostano subito. L'attesa è la classe firma-attesa dell'head (pomello in folle, via CSS), tolta dall'head
     dopo 2,5 s se il codice non arriva. Un rAF a tempo: la firma non dipende da GSAP. I dati vengono da _amj_firma.mjs. */
  var DATI = {"corsie":[120,200,280],"su":120,"folle":200,"giu":280,"marce":{"1":[120,120],"2":[120,280],"3":[200,120],"4":[200,280],"5":[280,120],"R":[280,280]},"centro":[200,200],"finale":"5","tempi":{"inizio":300,"base":160,"perUnita":1.3,"pausa":380,"colpo":160,"rientro":200,"centra":240,"innesto":130,"fine":4028},"intro":[{"marcia":"1","da":300,"a":668,"strada":[[200,200],[120,200],[120,120]]},{"marcia":"2","da":1048,"a":1416,"strada":[[120,120],[120,280]]},{"marcia":"3","da":1796,"a":2268,"strada":[[120,280],[120,200],[200,200],[200,120]]},{"marcia":"4","da":2648,"a":3016,"strada":[[200,120],[200,280]]},{"marcia":"5","da":3396,"a":3868,"strada":[[200,280],[200,200],[280,200],[280,120]]}],"tappe":[{"m":"1","k":"cb.t1","dire":"cb.a1"},{"m":"2","k":"cb.t2","dire":"cb.a2"},{"m":"3","k":"cb.t3","dire":"cb.a3"},{"m":"4","k":"cb.t4","dire":"cb.a4"},{"m":"5","k":"cb.t5","dire":"cb.a5"},{"m":"R","k":"cb.tr","dire":"cb.ar"}]};
  var prendi = function (id) { return document.getElementById(id); };
  var figuraC = prendi('cambio'), svgC = figuraC ? figuraC.querySelector('.cambio__svg') : null;
  var pomello = prendi('pomello'), testa = prendi('pomelloTesta');
  var rifaiB = prendi('cambioRifai'), leggiC = prendi('cambioLeggi');
  var TC = DATI.tempi, MARCE = DATI.marce, XS = DATI.corsie, SU = DATI.su, FOLLE = DATI.folle, GIU = DATI.giu, CENTRO = DATI.centro;
  var TAPPE = [].slice.call(document.querySelectorAll('#cruscotto .tappa'));
  var NUMERI = {};
  Object.keys(MARCE).forEach(function (m) { NUMERI[m] = prendi('num' + m); });
  var faseC = 'fatta', modoC = '', rafC = 0, guardiaC = 0, larghezzaAvvioC = 0, corseC = 0, presaC = null, pianoC = null;
  var posC = MARCE[DATI.finale].slice(), marciaC = DATI.finale;
  var finaleC = { pos: MARCE[DATI.finale].slice(), marcia: DATI.finale }, destinazioneC = finaleC;
  var c01 = function (t) { return Math.max(0, Math.min(1, t)); };
  var dentro = function (v, a, b) { return Math.max(a, Math.min(b, v)); };
  var inOut = function (t) { return t < .5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2; };
  var r3 = function (n) { return Math.round(n * 1000) / 1000; };
  var PAROLE = {
    it: { '1': 'Prima: iscrizione e visita medica.', '2': 'Seconda: la teoria, con le rime.', '3': 'Terza: l\'esame di teoria, il foglio rosa.', '4': 'Quarta: le guide.', '5': 'Quinta: l\'esame di guida. Patente!', 'R': 'Retromarcia: rinnovo e recupero punti.', 'N': 'In folle.' },
    en: { '1': 'First: enrolment and medical check.', '2': 'Second: theory, with rhymes.', '3': 'Third: the theory test, the learner\u2019s permit.', '4': 'Fourth: driving lessons.', '5': 'Fifth: the driving test. Licence!', 'R': 'Reverse: renewals and points recovery.', 'N': 'Neutral.' }
  };
  function linguaC() { return (root.getAttribute('lang') || 'it').slice(0, 2) === 'en' ? 'en' : 'it'; }
  function annuncia(m) { if (leggiC) leggiC.textContent = PAROLE[linguaC()][m || 'N']; }
  /* il disegno: il pomello (attributo transform, come nell'HTML), il colpo della testa, la marcia accesa */
  function metti(x, y) { posC = [x, y]; if (pomello) pomello.setAttribute('transform', 'translate(' + r3(x) + ' ' + r3(y) + ')'); }
  function premi(sc) { if (!testa) return; if (sc >= 0.9999) testa.removeAttribute('transform'); else testa.setAttribute('transform', 'scale(' + r3(sc) + ')'); }
  function evidenzia(m) {
    marciaC = m || null;
    TAPPE.forEach(function (li) {
      var on = li.getAttribute('data-marcia') === marciaC;
      li.classList.toggle('is-inserita', on);
      var c = li.querySelector('.tappa__corpo');
      if (c && c.getAttribute('role') === 'button') c.setAttribute('aria-pressed', on ? 'true' : 'false');
    });
    Object.keys(NUMERI).forEach(function (k) { if (NUMERI[k]) NUMERI[k].classList.toggle('is-inserita', k === marciaC); });
  }
  /* la strada da un punto a un altro dentro la H: se si è in una corsia e si cambia corsia, prima in folle; poi lungo la folle; poi
     su o giù (la stessa di _amj_firma.mjs) */
  function strada(da, a) {
    var p = [da.slice()];
    function aggiungi(q) { var u = p[p.length - 1]; if (Math.abs(u[0] - q[0]) > 1e-9 || Math.abs(u[1] - q[1]) > 1e-9) p.push(q.slice()); }
    if (Math.abs(da[1] - FOLLE) > 1e-9 && Math.abs(da[0] - a[0]) > 1e-9) aggiungi([da[0], FOLLE]);
    if (Math.abs(p[p.length - 1][0] - a[0]) > 1e-9) aggiungi([a[0], FOLLE]);
    aggiungi(a);
    return p;
  }
  function tratto(st, da, dur, marcia) {
    var segs = [], tot = 0;
    for (var k = 1; k < st.length; k++) { var l = Math.hypot(st[k][0] - st[k - 1][0], st[k][1] - st[k - 1][1]); segs.push(l); tot += l; }
    return { da: da, a: da + dur, strada: st, segs: segs, tot: tot, marcia: marcia || null };
  }
  /* il piano: una fila di marce ('N' = folle al centro); ogni tratto dura base + perUnita × lunghezza; dopo ogni innesto la pausa,
     dopo l'ultimo solo il colpo */
  function pianifica(elenco, inizio, da) {
    var p = (da || posC).slice(), piano = [], t = inizio || 0;
    elenco.forEach(function (m, i) {
      var dest = m === 'N' ? CENTRO : MARCE[m];
      var tr = tratto(strada(p, dest), t, 0, m === 'N' ? null : m);
      tr.a = t + (tr.tot ? TC.base + TC.perUnita * tr.tot : 0);
      piano.push(tr);
      t = tr.a + (m === 'N' ? 0 : (i < elenco.length - 1 ? TC.pausa : TC.colpo));
      p = dest.slice();
    });
    return { piano: piano, fine: t };
  }
  /* un piano a tratti diritti con durate date (il rilascio: l'innesto, o il rientro in folle e la centratura) */
  function pianoFisso(tratti) {
    var p = posC.slice(), piano = [], t = 0;
    tratti.forEach(function (x) {
      var tr = tratto([p, x.a.slice()], t, x.dur, x.marcia);
      piano.push(tr);
      t = tr.a + (x.marcia ? TC.colpo : 0);
      p = x.a.slice();
    });
    return { piano: piano, fine: t };
  }
  /* un punto lungo il tratto: il tempo diviso fra i pezzi diritti secondo la lunghezza, e ogni pezzo rallenta agli angoli */
  function lungo(tr, u) {
    var ultimo = tr.strada[tr.strada.length - 1];
    if (!tr.tot) return ultimo.slice();
    var acc = 0;
    for (var k = 0; k < tr.segs.length; k++) {
      var f = tr.segs[k] / tr.tot;
      if (u <= acc + f || k === tr.segs.length - 1) {
        var e = inOut(f ? c01((u - acc) / f) : 1), A = tr.strada[k], B = tr.strada[k + 1];
        return [A[0] + (B[0] - A[0]) * e, A[1] + (B[1] - A[1]) * e];
      }
      acc += f;
    }
    return ultimo.slice();
  }
  function fotogrammaPiano(t) {
    var P = pianoC.piano, cur = null;
    for (var i = 0; i < P.length; i++) if (t >= P[i].da) cur = P[i];
    if (!cur) return;
    if (t < cur.a) {
      var q = lungo(cur, (t - cur.da) / (cur.a - cur.da));
      metti(q[0], q[1]); premi(1);
      /* uscendo dalla marcia la sua tappa si spegne */
      if (marciaC && (Math.abs(q[0] - MARCE[marciaC][0]) > .01 || Math.abs(q[1] - MARCE[marciaC][1]) > .01)) evidenzia(null);
      return;
    }
    var d = cur.strada[cur.strada.length - 1], v = t - cur.a;
    metti(d[0], d[1]);
    if (cur.marcia && marciaC !== cur.marcia) evidenzia(cur.marcia);
    premi(cur.marcia && v < TC.colpo ? 1 - 0.08 * Math.sin(Math.PI * v / TC.colpo) : 1);
  }
  /* la guardia: se i fotogrammi smettono di arrivare per 1,5 s (scheda in background) il pomello va dove stava andando; si riarma a
     ogni fotogramma (#229) */
  function sorvegliaC() { clearTimeout(guardiaC); guardiaC = setTimeout(chiudiC, 1500); }
  function chiudiC() {
    cancelAnimationFrame(rafC); rafC = 0;
    clearTimeout(guardiaC);
    var d = destinazioneC || finaleC;
    metti(d.pos[0], d.pos[1]); premi(1); evidenzia(d.marcia);
    if (figuraC) figuraC.setAttribute('data-firma', 'fatta');
    root.classList.remove('firma-attesa');
    faseC = 'fatta';
  }
  function avviaC(modo, piano) {
    cancelAnimationFrame(rafC); rafC = 0;
    modoC = modo; pianoC = piano;
    root.classList.remove('firma-attesa');
    faseC = 'corre'; if (figuraC) figuraC.setAttribute('data-firma', 'corre');
    larghezzaAvvioC = window.innerWidth;
    var t0 = null, corsa = ++corseC;
    function fotogramma(ts) {
      rafC = 0;
      /* un fotogramma rimasto in coda dopo la chiusura (o di una corsa vecchia) non riapre niente */
      if (faseC !== 'corre' || corsa !== corseC) return;
      if (t0 === null) t0 = ts;
      var t = ts - t0;
      fotogrammaPiano(t);
      if (t >= pianoC.fine) { chiudiC(); return; }
      sorvegliaC();
      rafC = requestAnimationFrame(fotogramma);
    }
    sorvegliaC();
    rafC = requestAnimationFrame(fotogramma);
  }
  function avviaIntro() {
    /* dalla classe d'attesa agli attributi senza cambiare un pixel: il pomello in folle al centro, nessuna tappa accesa */
    metti(CENTRO[0], CENTRO[1]); premi(1); evidenzia(null);
    destinazioneC = finaleC;
    avviaC('intro', pianifica(['1', '2', '3', '4', '5'], TC.inizio, CENTRO));
  }
  /* tirare: il puntatore (mouse, penna o dito, sul pomello) lo porta al punto della H più vicino; da una corsia a un'altra solo
     passando dalla folle */
  function puntoSvg(e) {
    var m = svgC.getScreenCTM();
    if (!m) return posC.slice();
    var p = svgC.createSVGPoint(); p.x = e.clientX; p.y = e.clientY;
    var q = p.matrixTransform(m.inverse());
    return [q.x, q.y];
  }
  function vicino(t) {
    var best = null, bd = 1e9;
    XS.forEach(function (x) { var q = [x, dentro(t[1], SU, GIU)], d = Math.hypot(q[0] - t[0], q[1] - t[1]); if (d < bd) { bd = d; best = q; } });
    var q2 = [dentro(t[0], XS[0], XS[2]), FOLLE];
    if (Math.hypot(q2[0] - t[0], q2[1] - t[1]) < bd) best = q2;
    return best;
  }
  function raggiungibile(da, t) {
    var q = vicino(t);
    if (Math.abs(da[1] - FOLLE) > 0.5 && Math.abs(q[0] - da[0]) > 0.5) return [da[0], FOLLE];
    return q;
  }
  function marciaIn(q) {
    var ks = Object.keys(MARCE);
    for (var i = 0; i < ks.length; i++) { var g = MARCE[ks[i]]; if (Math.abs(g[0] - q[0]) < 0.5 && Math.abs(g[1] - q[1]) < 2.5) return ks[i]; }
    return null;
  }
  function prendiPomello(e) {
    if (e.button !== undefined && e.button !== 0) return;
    if (faseC === 'corre' || root.classList.contains('firma-attesa')) chiudiC();
    e.preventDefault();
    try { pomello.setPointerCapture(e.pointerId); } catch (err) {}
    var P = puntoSvg(e);
    presaC = { id: e.pointerId, dx: posC[0] - P[0], dy: posC[1] - P[1] };
    pomello.classList.add('preso');
  }
  function muoviPomello(e) {
    if (!presaC || e.pointerId !== presaC.id) return;
    e.preventDefault();
    var P = puntoSvg(e), t = [P[0] + presaC.dx, P[1] + presaC.dy];
    /* due passi: se si esce di lato da una corsia, prima in folle; dalla folle si prosegue verso il puntatore */
    var q = raggiungibile(raggiungibile(posC, t), t);
    metti(q[0], q[1]);
    var m = marciaIn(q);
    if (m && m !== marciaC) { evidenzia(m); annuncia(m); }
    else if (!m && marciaC) evidenzia(null);
  }
  function lasciaPomello(e) {
    if (!presaC || (e && e.pointerId !== presaC.id)) return;
    presaC = null;
    pomello.classList.remove('preso');
    var fuori = Math.abs(posC[1] - FOLLE), tratti;
    if (fuori > 0.5 && fuori >= 0.55 * (FOLLE - SU)) {
      var fine = [posC[0], posC[1] < FOLLE ? SU : GIU], m = marciaIn(fine);
      if (m !== marciaC) annuncia(m);
      destinazioneC = { pos: fine, marcia: m };
      tratti = [{ a: fine, dur: TC.innesto, marcia: m }];
    } else {
      destinazioneC = { pos: CENTRO.slice(), marcia: null };
      tratti = [];
      if (fuori > 0.5) tratti.push({ a: [posC[0], FOLLE], dur: TC.rientro });
      tratti.push({ a: CENTRO.slice(), dur: TC.centra });
      annuncia('N');
    }
    if (reducedMotion) { chiudiC(); return; }
    avviaC('molla', pianoFisso(tratti));
  }
  /* una tappa del cruscotto (o un numero): il pomello va a quella marcia per la strada giusta */
  function scegli(m) {
    if (presaC) return;
    if (faseC === 'corre' || root.classList.contains('firma-attesa')) chiudiC();
    annuncia(m);
    destinazioneC = { pos: MARCE[m].slice(), marcia: m };
    if (reducedMotion) { chiudiC(); return; }
    avviaC('vai', pianifica([m], 0, posC));
  }
  function rifai() {
    if (presaC) return;
    if (faseC === 'corre' || root.classList.contains('firma-attesa')) chiudiC();
    destinazioneC = finaleC;
    if (reducedMotion) { chiudiC(); annuncia(DATI.finale); return; }
    avviaC('rifai', pianifica(['N', '1', '2', '3', '4', '5'], 0, posC));
  }

  /* la testata segna la sezione in cui ti trovi */
  var linkVoci = [].slice.call(document.querySelectorAll('#mainNav a'));
  var bersagliVoci = linkVoci.map(function (a) { return document.querySelector(a.getAttribute('href')); });
  function aggiornaVoci() {
    var y = (document.getElementById('testata') || { offsetHeight: 80 }).offsetHeight + 40, ora = -1;
    for (var i = 0; i < bersagliVoci.length; i++) { if (bersagliVoci[i] && bersagliVoci[i].getBoundingClientRect().top <= y) ora = i; }
    linkVoci.forEach(function (a, k) { if (k === ora) a.setAttribute('aria-current', 'true'); else a.removeAttribute('aria-current'); });
  }
  var tickVoci = 0;
  window.addEventListener('scroll', function () {
    if (tickVoci) return;
    tickVoci = requestAnimationFrame(function () { tickVoci = 0; aggiornaVoci(); });
  }, { passive: true });
  aggiornaVoci();

  /* lo stato degli orari anche sulla tessera, col pallino rosa quando è aperto */
  function copiaStato() {
    var primo = document.getElementById(SITE.hoursStatusId);
    if (!primo) return;
    var aperto = hoursState().open;
    ['orarioStato', 'orarioStato2'].forEach(function (id) {
      var el = document.getElementById(id);
      if (!el) return;
      if (el !== primo) el.textContent = primo.textContent;
      el.classList.toggle('is-aperto', aperto);
    });
  }
  copiaStato();
  setInterval(copiaStato, 60000);
  /* la copia segue lo stato principale a ogni cambio, anche di lingua: prima si aggiornava solo ogni minuto e dopo IT→EN restava in
     italiano (#243, stato-lingua-check) */
  (function () {
    var primoS = document.getElementById(SITE.hoursStatusId);
    if (primoS && window.MutationObserver) new MutationObserver(copiaStato).observe(primoS, { childList: true, characterData: true, subtree: true });
  })();

  /* il cambio è «in vista» quando se ne vede almeno il 60% (o il 60% della finestra, se è più alto della finestra); l'altezza è
     quella del documento: all'avvio innerHeight di un telefono può non essere ancora quella vera (#233) */
  function altezzaVista() { return document.documentElement.clientHeight || window.innerHeight || 800; }
  function abbastanza(top, bottom, alto, vh) { return Math.min(bottom, vh) - Math.max(top, 0) >= 0.6 * Math.min(alto, vh); }
  function inVistaC() { var r = svgC.getBoundingClientRect(); return abbastanza(r.top, r.bottom, r.height, altezzaVista()); }

  if (figuraC && svgC && pomello && testa && rifaiB && TAPPE.length === DATI.tappe.length) {
    try { clearTimeout(window.__attesaCambio); } catch (e) {}
    window.__cambio = {
      stato: function () {
        return { fase: faseC, modo: modoC, corse: corseC, marcia: marciaC, presa: !!presaC, x: posC[0], y: posC[1] };
      },
      tempi: TC,
    };
    /* il cruscotto: da lista a comandi, senza cambiare di un pixel l'impaginazione */
    TAPPE.forEach(function (li) {
      var c = li.querySelector('.tappa__corpo'), m = li.getAttribute('data-marcia');
      if (!c) return;
      c.setAttribute('role', 'button');
      c.setAttribute('tabindex', '0');
      c.setAttribute('aria-pressed', li.classList.contains('is-inserita') ? 'true' : 'false');
      c.addEventListener('click', function () { scegli(m); });
      c.addEventListener('keydown', function (e) { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); scegli(m); } });
    });
    Object.keys(NUMERI).forEach(function (m) { if (NUMERI[m]) NUMERI[m].addEventListener('click', function () { scegli(m); }); });
    var daFare = !reducedMotion && root.classList.contains('firma-attesa');
    /* la pagina aperta su una sezione (#orari): il browser ci scorre dopo, la firma non si vedrebbe */
    var ancora = location.hash && location.hash.length > 1 && location.hash !== '#inizio';
    var inVista = inVistaC();
    /* perché la firma è partita o no (lo legge il check) */
    window.__cambio.avvio = { daFare: daFare, ancora: !!ancora, inVista: inVista, top: svgC.getBoundingClientRect().top, vh: altezzaVista() };
    if (!daFare || ancora) chiudiC();
    else if (inVista) avviaIntro();
    else if ('IntersectionObserver' in window) {
      /* il cambio sotto la piega (telefoni): parte quando se ne vede abbastanza; fino ad allora il pomello resta in folle */
      var soglie = []; for (var sg = 0; sg <= 20; sg++) soglie.push(sg / 20);
      var ioC = new IntersectionObserver(function (voci) {
        if (!voci.some(function (v) { return v.isIntersecting && abbastanza(v.boundingClientRect.top, v.boundingClientRect.bottom, v.boundingClientRect.height, altezzaVista()); })) return;
        ioC.disconnect();
        if (faseC === 'fatta' && root.classList.contains('firma-attesa')) avviaIntro();
      }, { threshold: soglie });
      ioC.observe(svgC);
      window.__cambio.avvio.aspetta = true;
    } else chiudiC();
    /* un resize chiude la firma solo se cambia la LARGHEZZA (sul telefono arrivano resize della sola altezza, #228) */
    window.addEventListener('resize', function () {
      if (faseC !== 'corre' || Math.abs(window.innerWidth - larghezzaAvvioC) <= 1) return;
      chiudiC();
    });
    rifaiB.addEventListener('click', rifai);
    /* Chrome non guarda il touch-action degli elementi interni di un SVG: senza questo il dito farebbe scorrere la pagina e il gesto
       verrebbe annullato (#242, svg-dito-check). Solo sul pomello: dal resto del disegno la pagina scorre. */
    pomello.addEventListener('touchstart', function (e) { e.preventDefault(); }, { passive: false });
    pomello.addEventListener('pointerdown', prendiPomello);
    pomello.addEventListener('pointermove', muoviPomello);
    pomello.addEventListener('pointerup', lasciaPomello);
    pomello.addEventListener('pointercancel', lasciaPomello);
  }
})();
