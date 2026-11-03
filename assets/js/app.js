/* Klub ELEGA – klikací prototyp. Stránky: #detail, #kosik, #klub. Pop-up uživatele z ikony v hlavičce. */
(function () {
  'use strict';
  var IMG = 'assets/img/';
  var TIERS = {
    anon:   { n: 'Neregistrovaný', perm: 0 },
    silver: { n: 'Silver', perm: 10, min: 15000, next: 'gold', obrat: 17450 },
    gold:   { n: 'Gold', perm: 15, min: 20000, next: 'vip', obrat: 26800 },
    vip:    { n: 'VIP', perm: 20, min: 40000, obrat: 48200 }
  };
  var ACT = { anon: 20, silver: 21, gold: 22, vip: 25 };
  var FREE = 3000; /* hranice dopravy zdarma – ukázková hodnota */
  var PRODUCTS = {
    simone: { name: 'Kabelka Simone oranžová/stříbro', code: '69003_913_S', price: 6490, img: 'p-simone.jpg' },
    hillary: { name: 'Mini crossbody kabelka Hillary růžová/stříbro', code: '[kód]', price: 3490, img: 'p-hillary.jpg' }
  };
  var SHIP = [['osobni', 'Osobní odběr na prodejně Třebechovice p/O.', 0, 'pin'], ['ppl', 'PPL', 89, 'truck'], ['pplbox', 'PPL – výdejní místa', 65, 'box'], ['posta', 'Česká pošta – na adresu', 149, 'truck']];
  var PAY = [['dobirka', 'Dobírka', 49, 'cash'], ['hotove', 'Hotově na prodejně', 0, 'pin'], ['banka', 'Bankovní převod / QR kód', 0, 'bank'], ['karta', 'Online platební kartou', 0, 'card']];
  var ADDONS = [['eko', 'EKO balení', 'Jsem EKO, chci mou objednávku zabalit bezpečně do použitého obalu/krabice', 0], ['dar', 'Chci mou objednávku darovat', 'Přidat papírovou tašku ELEGA', 0], ['box', 'Dárkové balení', 'Dárková krabička černá, bordó stuha', 149]];

  var S = { tier: 'anon', page: 'detail', pop: false, img: 0, color: 0, fav: false, more: false,
    cart: [{ id: 'simone', q: 1 }, { id: 'hillary', q: 1 }], addons: {}, ship: 'osobni', pay: 'hotove', land: 'cz', spend: 24000, menu: false, rsvp: false };
  try { var sv = JSON.parse(localStorage.getItem('elega-proto') || '{}'); if (TIERS[sv.tier]) S.tier = sv.tier; } catch (e) {}
  var h0 = location.hash.slice(1); if (['detail', 'kosik', 'klub'].indexOf(h0) > -1) S.page = h0;
  function save() { try { localStorage.setItem('elega-proto', JSON.stringify({ tier: S.tier })); } catch (e) {} }

  function kc(n) { return Math.round(n).toLocaleString('cs-CZ').replace(/\s/g, ' ') + ' Kč'; }
  function num(n) { return Math.round(n).toLocaleString('cs-CZ').replace(/\s/g, ' '); }
  function t() { return TIERS[S.tier]; }
  function member() { return S.tier !== 'anon'; }
  var P = {
    crown: '<path d="M3 18h18l1-10-5.5 4L12 5l-4.5 7L2 8l1 10z"/>', user: '<circle cx="12" cy="8" r="4"/><path d="M4 21c1.4-4 4.4-6 8-6s6.6 2 8 6"/>',
    search: '<circle cx="11" cy="11" r="7"/><path d="m20 20-3.5-3.5"/>', heart: '<path d="M12 20s-7-4.4-7-10a4 4 0 0 1 7-2.6A4 4 0 0 1 19 10c0 5.6-7 10-7 10z"/>',
    pin: '<path d="M12 21s-6-5.4-6-11a6 6 0 1 1 12 0c0 5.6-6 11-6 11z"/><circle cx="12" cy="10" r="2.2"/>', bag: '<path d="M5 8h14l-1 13H6L5 8z"/><path d="M9 8V6a3 3 0 0 1 6 0v2"/>',
    menu: '<path d="M4 7h16M4 12h16M4 17h16"/>', close: '<path d="M6 6l12 12M18 6 6 18"/>', phone: '<path d="M5 4h3l2 5-2 1.5a11 11 0 0 0 5.5 5.5L15 14l5 2v3a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2z"/>',
    globe: '<circle cx="12" cy="12" r="9"/><path d="M3 12h18M12 3c2.5 2.6 3.8 5.6 3.8 9s-1.3 6.4-3.8 9c-2.5-2.6-3.8-5.6-3.8-9S9.5 5.6 12 3z"/>',
    chev: '<path d="m6 9 6 6 6-6"/>', left: '<path d="m15 6-6 6 6 6"/>', right: '<path d="m9 6 6 6-6 6"/>', check: '<path d="m5 12 5 5 9-10"/>',
    trash: '<path d="M4 7h16M9 7V4h6v3M6 7l1 13h10l1-13"/>', box: '<path d="M4 8l8-4 8 4v8l-8 4-8-4V8z"/><path d="M4 8l8 4 8-4M12 12v8"/>',
    out: '<path d="M15 4h4v16h-4M10 8l-4 4 4 4M6 12h10"/>', truck: '<path d="M2 7h12v9H2zM14 10h4l3 3v3h-7z"/><circle cx="6" cy="17" r="1.6"/><circle cx="17" cy="17" r="1.6"/>',
    cash: '<rect x="3" y="7" width="18" height="11"/><circle cx="12" cy="12.5" r="2.5"/>', bank: '<path d="M3 10h18L12 4 3 10zM5 10v8M9 10v8M15 10v8M19 10v8M3 20h18"/>',
    card: '<rect x="3" y="6" width="18" height="12"/><path d="M3 10h18"/>', play: '<rect x="3" y="6" width="18" height="12" rx="3"/><path d="m10 9 5 3-5 3z"/>',
    info: '<circle cx="12" cy="12" r="9"/><path d="M12 11v5M12 8v.5"/>', shape: '<path d="M5 9h14l-1 11H6L5 9z"/><path d="M9 9a3 3 0 0 1 6 0"/>',
    rivet: '<circle cx="7" cy="7" r="2"/><circle cx="17" cy="7" r="2"/><circle cx="7" cy="17" r="2"/><circle cx="17" cy="17" r="2"/>', zip: '<path d="M4 12h16M7 10v4M10 10v4M13 10v4M16 10v4"/>',
    doc: '<path d="M6 3h9l3 3v15H6z"/><path d="M9 10h6M9 14h6"/>', leather: '<path d="M7 4c2 1 8 1 10 0l3 4-2 3 2 9H4l2-9-2-3z"/>',
    service: '<path d="M14.5 6.5a4 4 0 0 0-5.3 5.3L4 17l3 3 5.2-5.2a4 4 0 0 0 5.3-5.3l-2.5 2.5-2.5-.5-.5-2.5z"/>', swap: '<path d="M4 9h14l-3-3M20 15H6l3 3"/>',
    spark: '<path d="M12 3v4M12 17v4M3 12h4M17 12h4M6 6l2.5 2.5M15.5 15.5 18 18M6 18l2.5-2.5M15.5 8.5 18 6"/>', gift: '<rect x="4" y="9" width="16" height="11"/><path d="M4 13h16M12 9v11M12 9c-1.5-3-5-3.5-5-1s5 1 5 1zm0 0c1.5-3 5-3.5 5-1s-5 1-5 1z"/>',
    useradd: '<circle cx="10" cy="8" r="4"/><path d="M3 21c1.2-3.6 3.9-5.5 7-5.5M18 14v6M15 17h6"/>', login: '<path d="M14 4h5v16h-5M4 12h10M10 8l4 4-4 4"/>'
  };
  function ic(n, sw) { return '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="' + (sw || 1.3) + '" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' + P[n] + '</svg>'; }

  /* ---------- Klub box (podle Klub-box-detail / Klub-box-kosik) ---------- */
  function kbar() {
    var k = S.tier, x = t();
    if (k === 'anon') return '<div class="kbar kbar--anon"><span class="kbar__l">' + ic('crown') + 'ELEGA Klub</span><a href="#klub">Jak to funguje?</a></div>';
    return '<div class="kbar kbar--' + k + '"><span class="kbar__l">' + ic('crown') + x.n + '</span><span>Sleva ' + x.perm + ' %</span></div>';
  }
  function kmsg() {
    var x = t();
    if (S.tier === 'anon') return 'Členové Klubu ELEGA mají stálé slevy.';
    if (x.next) return 'Do úrovně ' + TIERS[x.next].n + ' zbývá ' + kc(TIERS[x.next].min - x.obrat);
    return 'Děkujeme za důvěru!';
  }

  /* ---------- prototypová lišta ---------- */
  function seg(lbl, opts, cur, key) { return '<span class="proto__g">' + lbl + ' <span class="seg">' + opts.map(function (o) { return '<button type="button" data-set="' + key + ':' + o[0] + '" aria-pressed="' + (cur === o[0]) + '">' + o[1] + '</button>'; }).join('') + '</span></span>'; }
  function proto() {
    return '<div class="proto"><div class="proto__in"><span class="proto__t">Prototyp Klub ELEGA · ukázková data</span>' +
      seg('Zákazník', [['anon', 'Neregistrovaný'], ['silver', 'Silver'], ['gold', 'Gold'], ['vip', 'VIP']], S.tier, 'tier') +
      seg('Stránka', [['detail', 'Detail'], ['kosik', 'Košík'], ['klub', 'LP Klub']], S.page, 'page') + '</div></div>';
  }

  /* ---------- hlavička ---------- */
  function cartCount() { return S.cart.reduce(function (a, c) { return a + c.q; }, 0); }
  function header() {
    var nav = ['Dámské', 'Pánské', 'Dana M', 'Projekty', 'Výprodej', 'Dárkové poukazy', 'Kolekce'];
    return '<div class="hpromo">Nejnovější kolekce Elega by Dana M v prodeji zde | <a href="#detail">NAKUPOVAT</a></div>' +
      '<div class="htop"><div class="wrap htop__in"><span>' + '<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="1.3">' + P.phone + '</svg> +420 605 252 583 <small>Po–Pá: 9:00–17:00</small></span><span>CZK ' + '<svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="1.3">' + P.chev + '</svg> CZ</span></div></div>' +
      '<header class="site-header"><div class="wrap"><div class="hdesk"><span><a href="#detail">O nás</a><a href="#detail">Kontakt</a><a href="#detail">Magazín</a></span><span><span style="color:#E8A90E">★★★★★</span> 1000+ hodnocení obchodu</span></div>' +
      '<div class="hbar"><div class="hcontact"><span style="display:flex;gap:8px;align-items:center"><svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="1.3">' + P.phone + '</svg><span>+420 731 655 203<br>Po–Pá: 8:00–15:30</span></span><span style="display:flex;gap:6px;align-items:center"><svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="1.3">' + P.globe + '</svg>CZ</span></div>' +
      '<a class="hbar__logo" href="#detail" aria-label="ELEGA"><img src="' + IMG + 'logo.svg" alt="ELEGA"></a>' +
      '<div class="hbar__icons"><button class="ib" type="button" aria-label="Hledat">' + ic('search') + '</button>' +
      '<button class="ib" type="button" aria-label="Oblíbené">' + ic('heart') + (S.fav ? '<span class="ib__n">1</span>' : '') + '</button>' +
      '<button class="ib" type="button" aria-label="Prodejny">' + ic('pin') + '</button>' +
      '<button class="ib" type="button" data-act="pop" aria-label="' + (member() ? 'Můj účet' : 'Přihlášení') + '" aria-expanded="' + S.pop + '">' + ic('user') + (member() ? '<span class="ib__dot" style="background:' + ({ silver: '#B3B3B3', gold: '#D4B47A', vip: '#202020' })[S.tier] + '"></span>' : '') + '</button>' +
      '<a class="ib ib--cart" href="#kosik" aria-label="Košík">' + ic('bag') + (cartCount() ? '<span class="ib__n">' + cartCount() + '</span>' : '') + '</a>' +
      '<button class="ib hburger" type="button" aria-label="Menu">' + ic('menu') + '</button></div></div>' +
      '<nav class="hnav" aria-label="Hlavní menu">' + nav.map(function (n) { return '<a href="#detail">' + n + '</a>'; }).join('') + '<a href="#klub"' + (S.page === 'klub' ? ' aria-current="page"' : '') + '>Klub ELEGA</a></nav></div></header>';
  }

  /* ---------- pop-up uživatele ---------- */
  function popup() {
    if (!S.pop) return '';
    var close = '<button class="pop__x" type="button" data-act="pop" aria-label="Zavřít">' + ic('close') + '</button>';
    if (!member()) {
      return '<div class="pop-scrim" data-act="pop"></div><div class="pop pop--login" role="dialog" aria-label="Přihlášení">' +
        '<div class="pop__photo"><h2>Nemáte<br>ještě účet?</h2><div style="display:grid;gap:20px"><button type="button" class="btn-white" data-act="register">Registrovat ' + '<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="1.3">' + P.useradd + '</svg></button>' +
        '<div class="pop__club"><span>Stanete se členkou?</span><button type="button" data-go="klub">' + ic('crown') + 'ELEGA Klub</button></div></div></div>' +
        '<form class="pop__form" data-form="login">' + close + '<h2>Přihlásit se</h2>' +
        '<label for="lg-m"><span>Přihlašovací jméno<b>*</b></span><input id="lg-m" type="email" placeholder="Váš email" autocomplete="email"></label>' +
        '<label for="lg-p"><span>Heslo<b>*</b></span><input id="lg-p" type="password" placeholder="Vaše heslo" autocomplete="current-password"></label>' +
        '<div class="pop__row"><label for="lg-r"><input id="lg-r" type="checkbox"> Přihlásit trvale</label><a href="#klub" data-act="noop">Nevíte heslo?</a></div>' +
        '<button class="btn-green" type="submit">Přihlásit ' + '<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="1.3">' + P.login + '</svg></button>' +
        '<div class="pop__or">nebo</div><div class="pop__soc"><button type="button" data-act="social" style="color:#1877F2">f</button><button type="button" data-act="social" style="color:#4285F4">G</button><button type="button" data-act="social" style="color:#CC0000">S</button></div>' +
        '<p style="font-size:12px;color:#8C8C8C">Ukázka: přihlášení vás přepne do úrovně Gold.</p></form></div>';
    }
    var x = t(), pct = Math.min(100, x.obrat / 40000 * 100);
    return '<div class="pop-scrim" data-act="pop"></div><div class="pop" role="dialog" aria-label="Můj účet">' + close +
      '<div class="pop__acc"><h2>Dobrý den, Jana</h2><div class="pop__mail">jana.novakova@email.cz</div>' + kbar() +
      '<div class="prog"><div class="prog__row"><span>Nákupy za posledních 12 měsíců</span><b>' + kc(x.obrat) + '</b></div><div class="prog__bar"><span style="width:' + pct + '%"></span></div>' +
      (x.next ? '<span>Do úrovně ' + TIERS[x.next].n + ' chybí ' + kc(TIERS[x.next].min - x.obrat) + '. Pak budete mít stálou slevu ' + TIERS[x.next].perm + ' %.</span>' : '<span>Úroveň VIP držíte, dokud nakoupíte alespoň za 40 000 Kč za posledních 12 měsíců.</span>') + '</div></div>' +
      '<ul class="pop__links"><li><a href="#kosik">' + ic('box') + 'Moje objednávky<em>2 aktivní</em></a></li><li><a href="#klub">' + ic('crown') + 'Klub ELEGA a moje výhody</a></li><li><a href="#detail">' + ic('heart') + 'Oblíbené produkty</a></li><li><a href="#detail">' + ic('user') + 'Osobní údaje a adresy</a></li><li><button type="button" data-act="logout">' + ic('out') + 'Odhlásit se</button></li></ul></div>';
  }

  /* ---------- detail produktu ---------- */
  var GAL = ['simone-1.jpg', 'simone-2.jpg', 'simone-3.jpg', 'simone-4.jpg'];
  var SW = [['p-simone.jpg', 'oranžová'], ['sw-bambi.jpg', 'bambi'], ['sw-bezova.jpg', 'béžová'], ['sw-cerna.jpg', 'černá'], ['sw-cervena.jpg', 'červená']];
  function pageDetail() {
    var p = PRODUCTS.simone, x = t();
    var usp = [['rivet', 'Dno chráněno kovovými nýty'], ['leather', 'Odolná a pevná italská kůže Saffiano'], ['shape', 'Pevný tvar'], ['zip', 'Uzavírání pomocí zipu'], ['doc', 'Vejdou se dokumenty A4 a notebook 13,3"']];
    var acc = [['info', 'Detail produktu', '<p>Rozměry:</p><ul><li>39 × 28 × 10 cm (š × v × h)</li><li>Výška držadel: 22 cm</li></ul><p>Použité materiály:</p><ul><li>Hovězí kůže se strukturovaným povrchem, stříbrné kování</li><li>Podšívka prémiová české výroby</li></ul><p>Další vlastnosti:</p><ul><li>Váha cca 880 g</li><li>Vyrobeno v Třebechovicích pod Orebem</li></ul>', true], ['play', 'Video', '<p class="todo">[Doplnit video]</p>'], ['bag', 'Materiál a péče o něj', '<p>Kůži ošetřujte krémem na kůži a chraňte před dlouhodobým působením vlhka.</p>'], ['truck', 'Doprava a platba', '<p>Osobní odběr na prodejně zdarma, doprava PPL od 65 Kč.</p>'], ['swap', 'Možnost výměny a vrácení', '<p>Pokud nejste spokojeni, neváhejte se na nás obrátit.</p>'], ['service', 'Servis a doživotní záruka', '<p>Nabízíme pozáruční servis našich kabelek.</p>']];
    return '<div class="wrap"><ol class="crumbs"><li><a href="#detail">Dámské</a></li><li><a href="#detail">Kabelky</a></li><li><a href="#detail">Do ruky</a></li></ol>' +
      '<div class="pd"><div class="gal"><div class="gal__main"><img src="' + IMG + GAL[S.img] + '" alt="' + p.name + '"></div><ul class="gal__th">' + GAL.map(function (g, i) { return '<li><button type="button" data-img="' + i + '" aria-current="' + (S.img === i) + '" aria-label="Fotka ' + (i + 1) + '"><img src="' + IMG + g + '" alt=""></button></li>'; }).join('') + '</ul></div>' +
      '<div class="buy"><h1>' + p.name + '</h1>' +
      '<div style="display:grid;gap:8px"><p class="perex' + (S.more ? '' : ' is-clamped') + '">Elegantní kožená kabelka do práce, která zvládne víc než jen notebook. Dámská kabelka Simone pojme dokumenty A4, notebook 13,3" i vše, co potřebujete mít po ruce. Přitom si díky pevnému tvaru zachovává čistou, elegantní siluetu. Simone patří mezi dlouholeté stálice značky ELEGA a vzniká v naší dílně v Třebechovicích pod Orebem.</p>' +
      '<button class="morelink" type="button" data-act="more">' + (S.more ? 'Méně informací' : 'Více informací') + ' <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="1.4" style="transform:rotate(' + (S.more ? 180 : 0) + 'deg)">' + P.chev + '</svg></button></div>' +
      '<div style="display:grid;gap:12px"><span class="vtitle">Barevné varianty</span><ul class="sw">' + SW.map(function (s, i) { return '<li><button type="button" data-color="' + i + '" aria-pressed="' + (S.color === i) + '" aria-label="' + s[1] + '"><img src="' + IMG + s[0] + '" alt=""></button></li>'; }).join('') + '</ul></div>' +
      '<div class="pricerow"><div class="avail"><b>Skladem</b>Ihned k odeslání. Očekávané datum doručení za 1 až 3 dny.</div><div class="price">' + (member() ? '<span class="price__old">' + num(p.price) + ' <small>Kč</small></span><span class="price__now">' + num(Math.round(p.price * (1 - x.perm / 100))) + ' <small>Kč</small></span>' : '<span class="price__now">' + num(p.price) + ' <small>Kč</small></span>') + '</div></div>' +
      '<div class="kbox">' + kbar() + '<span class="kmsg">' + kmsg() + '</span></div>' +
      '<div class="addrow"><button class="btn-green" type="button" data-act="add">Vložit do košíku ' + '<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="1.3">' + P.bag + '</svg></button><button class="btn-heart" type="button" data-act="fav" aria-pressed="' + S.fav + '" aria-label="Přidat k oblíbeným">' + '<svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="1.3">' + P.heart + '</svg></button></div>' +
      '<div class="rating"><u>Hodnocení produktu:</u><span class="stars">★★★★★</span><b>100 %</b><span style="color:#8C8C8C">2×</span></div>' +
      '<ul class="usp">' + usp.map(function (u) { return '<li>' + ic(u[0], 1.2) + u[1] + '</li>'; }).join('') + '</ul>' +
      '<div class="acc">' + acc.map(function (a) { return '<details' + (a[3] ? ' open' : '') + '><summary>' + ic(a[0], 1.2) + a[1] + '</summary><div class="acc__body">' + a[2] + '</div></details>'; }).join('') + '</div>' +
      '<div class="meta"><span>SKU: ' + p.code + '</span><span>Kolekce: <a href="#detail">Simone</a></span><span>Značka: <a href="#detail">ELEGA</a></span></div>' +
      '<div class="help"><span class="vtitle">Potřebujete poradit?</span><div class="help__row"><span class="help__av" role="img" aria-label="Poradkyně"></span><span>+420 605 252 583<br><small style="color:#8C8C8C">Po–Pá: 9:00–17:00</small></span><u>info@elega.cz</u></div></div>' +
      '</div></div></div>';
  }

  /* ---------- košík ---------- */
  function totals() {
    var items = S.cart.reduce(function (a, c) { return a + PRODUCTS[c.id].price * c.q; }, 0);
    var add = ADDONS.reduce(function (a, d) { return a + (S.addons[d[0]] ? d[3] : 0); }, 0);
    var club = Math.round(items * t().perm / 100);
    var ship = SHIP.filter(function (s) { return s[0] === S.ship; })[0][2];
    var pay = PAY.filter(function (s) { return s[0] === S.pay; })[0][2];
    if (items - club >= FREE && S.ship !== 'osobni') ship = 0;
    return { items: items, add: add, club: club, ship: ship, pay: pay, total: items + add - club + ship + pay };
  }
  function opt(name, o, cur) {
    return '<label class="opt" for="' + name + '-' + o[0] + '"><input type="radio" id="' + name + '-' + o[0] + '" name="' + name + '" value="' + o[0] + '"' + (cur === o[0] ? ' checked' : '') + '><span class="opt__ic">' + ic(o[3], 1.2) + '</span><span>' + o[1] + '</span><span class="opt__p">' + (o[2] ? kc(o[2]) : '0 Kč') + '</span></label>';
  }
  function pageCart() {
    var x = totals(), left = Math.max(0, FREE - (x.items - x.club));
    var items = S.cart.length ? S.cart.map(function (c) { var p = PRODUCTS[c.id];
      return '<li class="ci"><span class="ci__img"><img src="' + IMG + p.img + '" alt=""></span><div class="ci__body"><span class="ci__name">' + p.name + '</span><span class="ci__code">Kód: ' + p.code + '</span><span class="avail"><b>Skladem</b></span><span>Cena s DPH (m. j.): ' + kc(p.price) + '</span>' +
        '<span class="qty"><button type="button" data-qty="' + c.id + ':-1" aria-label="Méně">−</button><span>' + c.q + ' ks</span><button type="button" data-qty="' + c.id + ':1" aria-label="Více">+</button></span><span class="ci__total">Celková cena s DPH: <b>' + kc(p.price * c.q) + '</b></span></div>' +
        '<button class="ci__del" type="button" data-del="' + c.id + '" aria-label="Odebrat">' + '<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="1.4">' + P.trash + '</svg></button></li>'; }).join('')
      : '<li class="ci" style="grid-template-columns:1fr">Košík je prázdný. <a href="#detail">Zpět na kabelku Simone</a></li>';
    return '<div class="wrap cart"><ol class="crumbs"><li><a href="#detail">Úvod</a></li><li>Košík</li></ol>' +
      '<div class="steps"><span aria-current="step">1.<span class="lbl"> Nákupní košík</span></span><span>2.<span class="lbl"> Kontaktní údaje</span></span><span>3.<span class="lbl"> Kontrola údajů</span></span></div>' +
      '<h1>Obsah košíku</h1><ul class="citems">' + items + '</ul>' +
      '<div class="addons">' + ADDONS.map(function (a) { return '<label class="addon" for="ad-' + a[0] + '"><input type="checkbox" id="ad-' + a[0] + '" data-addon="' + a[0] + '"' + (S.addons[a[0]] ? ' checked' : '') + '><span><b>' + a[1] + '</b>' + a[2] + '</span><b>' + kc(a[3]) + '</b></label>'; }).join('') + '</div>' +
      '<form class="coupon" data-form="coupon"><label for="cp">Mám slevový/dárkový kupón a chci ho uplatnit:</label><div class="coupon__row"><input id="cp" placeholder="Kód kupónu"><button class="btn-sm" type="submit">Uplatnit ' + '<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="1.6">' + P.check + '</svg></button></div><span class="coupon__msg" id="cp-msg" aria-live="polite"></span></form>' +
      '<div class="free">' + (left ? 'K dopravě ZDARMA zbývá ' + kc(left) : 'Máte dopravu ZDARMA') + '<span class="free__bar"><span style="width:' + Math.min(100, (x.items - x.club) / FREE * 100) + '%"></span></span></div>' +
      '<div class="ship"><div class="land-wrap"><h2>Země dodání</h2><div class="land"><label for="l-cz"><input type="radio" id="l-cz" name="land" value="cz"' + (S.land === 'cz' ? ' checked' : '') + '> Česko</label><label for="l-sk"><input type="radio" id="l-sk" name="land" value="sk"' + (S.land === 'sk' ? ' checked' : '') + '> Slovensko</label></div></div>' +
      '<div><h2>Způsob dopravy</h2><div class="opts">' + SHIP.map(function (o) { return opt('ship', o, S.ship); }).join('') + '</div></div>' +
      '<div><h2>Způsob platby</h2><div class="opts">' + PAY.map(function (o) { return opt('pay', o, S.pay); }).join('') + '</div></div></div></div>' +
      cpanel(x);
  }
  function cpanel(x) {
    var club = member() ? '<div class="is-club"><dt>ELEGA Klub – ' + t().perm + '\u00a0%</dt><dd>−' + kc(x.club) + '</dd></div>' : '';
    var band = '<div class="kband kband--' + S.tier + '"><div class="kband__in"><span class="kbar__l">' + ic('crown') + (member() ? t().n : 'ELEGA Klub') + '</span><span class="kband__msg">' + kmsg() + '</span>' + (member() ? '<span class="kband__r">Sleva ' + t().perm + '\u00a0%</span>' : '<a href="#klub">Jak to funguje?</a>') + '</div></div>';
    var arrowR = '<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="1.6"><path d="M4 12h15M13 6l6 6-6 6"/></svg>';
    var arrowL = '<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="1.6"><path d="M20 12H5M11 6l-6 6 6 6"/></svg>';
    return '<div class="cpanel">' + band + '<div class="cpanel__in"><div class="kpanel">' + (member() ? '<span class="kmsg">' + kmsg() + '</span>' + kbar()
      : '<span class="kmsg">Členové Klubu ELEGA mají stálé slevy.</span><div class="kbar kbar--anon"><span class="kbar__l">' + ic('crown') + 'ELEGA Klub</span><a href="#klub" data-act="register">Registrovat se</a></div>') + '</div>' +
      '<div class="cpanel__row"><button class="btn-white" type="button" data-go="detail">' + arrowL + 'Zpět</button>' +
      '<dl class="sum sum--m">' + club + '<div><dt>Cena dopravy:</dt><dd>' + kc(x.ship) + '</dd></div><div><dt>Cena platby:</dt><dd>' + kc(x.pay) + '</dd></div><div class="is-total"><dt>Celková cena s DPH:</dt><dd>' + kc(x.total) + '</dd></div></dl>' +
      '<dl class="sum sum--d">' + (member() ? '<div><dt>Klubová sleva ' + t().perm + '\u00a0%:</dt><dd>−' + kc(x.club) + '</dd></div>' : '') + '<div><dt>Poštovné a balné:</dt><dd>' + kc(x.ship + x.pay + x.add) + '</dd></div><div><dt>Konečná cena s DPH:</dt><dd>' + kc(x.total) + '</dd></div></dl>' +
      '<button class="btn-sm" type="button" data-act="next"><span class="only-m">2. Kontaktní údaje</span><span class="only-d">Pokračovat</span> ' + arrowR + '</button></div></div></div>';
  }

  /* ---------- LP Klub ELEGA ---------- */
  function tierOf(v) { return v >= 40000 ? 'vip' : v >= 20000 ? 'gold' : v >= 15000 ? 'silver' : 'anon'; }
  function calcOut() {
    var k = tierOf(S.spend), x = TIERS[k], reg = Math.round(6490 * (1 - x.perm / 100)), act = Math.round(6490 * (1 - ACT[k] / 100));
    var save0 = k === 'anon';
    var bar = save0 ? '<div class="kbar kbar--anon"><span class="kbar__l">' + ic('crown') + 'ELEGA Klub</span><span>Do Silver chybí ' + kc(15000 - S.spend) + '</span></div>' : '<div class="kbar kbar--' + k + '"><span class="kbar__l">' + ic('crown') + x.n + '</span><span>Sleva ' + x.perm + ' %</span></div>';
    return '<p>S nákupy za ' + kc(S.spend) + ' ročně budete ' + (save0 ? 'zatím bez stálé slevy' : 'v úrovni') + '</p>' + bar +
      '<div class="calc__res"><div><span>Stálá sleva</span><b>' + x.perm + ' %</b></div><div class="r"><span>Sleva v akcích</span><b>' + ACT[k] + ' %</b></div><div><span>Simone mimo akci</span><b>' + kc(reg) + '</b></div><div class="r"><span>Simone v akci</span><b>' + kc(act) + '</b></div></div>';
  }
  var EVENT = { d: new Date(2026, 11, 4, 18, 0), when: 'čtvrtek 4. prosince 2026, 18:00', where: 'Prodejna ELEGA, Tyršova 536, Třebechovice pod Orebem', what: 'Křest nové zimní kolekce ELEGA' };
  function days(d) { var n = Math.ceil((d - new Date()) / 86400000); return n > 4 ? 'za ' + n + ' dní' : n > 1 ? 'za ' + n + ' dny' : n === 1 ? 'zítra' : n === 0 ? 'dnes' : 'proběhlo'; }
  function vipInvite() {
    return '<section class="lp-inv" aria-labelledby="inv-h"><div class="lp-inv__img" role="img" aria-label="Psaníčko ELEGA na společenské akci"></div><div class="lp-inv__txt">' +
      '<span class="lp-ey">Pozvánka pro VIP</span><h1 class="lp-h2" id="inv-h">' + EVENT.what + '</h1>' +
      '<p class="lp-p">Jano, jako členku VIP vás zveme mezi první. Uvidíte novou kolekci dřív než ostatní, potkáte lidi, kteří kabelky navrhují a šijí, a svůj kousek si můžete odnést hned na místě.</p>' +
      '<div class="lp-inv__card"><div class="lp-inv__date"><b>' + EVENT.d.getDate() + '</b><span>prosinec</span></div><div class="lp-inv__info"><span class="lp-inv__left">' + days(EVENT.d) + '</span><b>' + EVENT.when + '</b><span>' + EVENT.where + '</span></div></div>' +
      '<div class="lp-inv__btns">' + (S.rsvp ? '<button class="lp-inv__ok" type="button" data-act="rsvp">' + ic('check') + 'Účast potvrzena</button>' : '<button class="btn-green" type="button" data-act="rsvp">Potvrdit účast</button>') + '<button class="lp-inv__cal" type="button" data-act="cal">Přidat do kalendáře</button></div>' +
      '<p style="font-size:12px;color:#8C8C8C">Ukázkový termín a místo – doplnit podle skutečného křtu.</p></div></section>';
  }
  function memberStatus() {
    var x = t(), pct = Math.min(100, x.obrat / 40000 * 100);
    return '<section class="lp-me" aria-labelledby="me-h"><div class="lp-me__in"><span class="lp-ey">Jste v klubu</span><h2 class="lp-h2" id="me-h">Dobrý den, Jano. Vaše sleva ' + x.perm + '\u00a0% platí na celém e-shopu</h2>' + kbar() +
      '<div class="lp-me__prog"><div class="prog__row"><span>Nákupy za posledních 12 měsíců</span><b>' + kc(x.obrat) + '</b></div><div class="lp-me__bar"><span style="width:' + pct + '%"></span><i style="left:37.5%"></i><i style="left:50%"></i></div>' +
      '<div class="lp-me__scale"><span style="left:37.5%">Silver</span><span style="left:50%">Gold</span><span style="left:100%">VIP</span></div></div>' +
      '<p class="lp-me__note">' + kmsg() + (x.next ? '. Pak budete mít stálou slevu ' + TIERS[x.next].perm + '\u00a0%.' : ' Úroveň VIP držíte, dokud nakoupíte alespoň za 40\u00a0000\u00a0Kč za 12 měsíců.') + '</p>' +
      '<a class="btn-green lp-btn" href="#detail">Nakupovat se slevou ' + x.perm + '\u00a0%</a></div></section>';
  }
  function heroCounter() {
    var x = t(), nx = TIERS[x.next], pct = Math.min(100, x.obrat / nx.min * 100);
    return '<div class="lp-cnt" aria-label="Váš postup v klubu"><div class="lp-cnt__top"><span>Vaše úroveň <b>' + x.n + '</b> · sleva ' + x.perm + '\u00a0%</span><span>' + kc(x.obrat) + ' / ' + kc(nx.min) + '</span></div>' +
      '<div class="lp-cnt__bar"><span style="width:' + pct + '%"></span></div><span class="lp-cnt__note">Do úrovně ' + nx.n + ' zbývá <b>' + kc(nx.min - x.obrat) + '</b> · pak stálá sleva ' + nx.perm + '\u00a0%</span></div>';
  }
  function pageKlub() {
    var me = S.tier;
    var tc = ['silver', 'gold', 'vip'].map(function (k) { var x = TIERS[k];
      return '<article class="tcard' + (me === k ? ' is-me' : '') + '"><div class="kbar kbar--' + k + '"><span class="kbar__l">' + ic('crown') + x.n + '</span><span>Sleva ' + x.perm + ' %</span></div><div class="tcard__b">' + (me === k ? '<span class="tcard__me">Vaše úroveň</span>' : '') +
        '<span class="tcard__from">od ' + kc(x.min) + ' za 12 měsíců</span><span class="tcard__pct"><b>' + x.perm + ' %</b>stálá sleva</span><div class="tcard__rows"><div><span>Sleva během akcí</span><b>' + ACT[k] + ' %</b></div><div><span>Platí pro</span><b>e-shop i prodejnu</b></div></div>' +
        (k === 'vip' ? '<div class="tcard__x">' + '<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="1.2">' + P.spark + '</svg><span>Pozvánky na křest nových kolekcí ELEGA. Přijďte mezi první.</span></div>' : '') + '</div></article>'; }).join('');
    var rows = [['anon', 'Bez účtu'], ['silver', 'Silver'], ['gold', 'Gold'], ['vip', 'VIP']].map(function (r) { var x = TIERS[r[0]];
      return '<tr' + (me === r[0] ? ' class="is-me"' : '') + '><td>' + r[1] + '</td><td><span>' + x.perm + ' %</span><b>' + kc(6490 * (1 - x.perm / 100)) + '</b></td><td class="r"><span>' + ACT[r[0]] + ' %</span><b>' + kc(6490 * (1 - ACT[r[0]] / 100)) + '</b></td></tr>'; }).join('');
    var faq = [['Počítají se nákupy na prodejně?', 'Ano. Nákupy v prodejně v Třebechovicích pod Orebem se připisují na váš účet stejně jako nákupy na e-shopu. <span class="todo">[Doplnit: jak se zákazník na prodejně identifikuje]</span>'],
      ['Jak dlouho mi úroveň platí?', 'Úroveň se počítá vždy z nákupů za posledních 12 měsíců. Když nakupujete průběžně, úroveň si udržíte.'],
      ['Proč mám v akci jen o 5 % víc?', 'Vaše stálá sleva platí po celý rok. V akci, kdy mají ostatní 20 %, máte jako VIP 25 %, jako Gold 22 % a jako Silver 21 %. Vždy platíte méně než zákazník bez účtu.'],
      ['Musím zadávat slevový kód?', 'Stálá sleva se uplatní sama po přihlášení. V akcích dostanete osobní kód e-mailem.'],
      ['Počítají se nákupy před registrací?', '<span class="todo">[Doplnit]</span>'], ['Platí sleva i na výprodej?', '<span class="todo">[Doplnit podle podmínek klubu]</span>'], ['Co když zboží vrátím?', '<span class="todo">[Doplnit: odečte se vrácené zboží z obratu?]</span>']];
    var ben = [['box', 'Přehled objednávek', 'Kdykoli vidíte, co jste kupovali a kolik vám zbývá do další úrovně.'], ['heart', 'Oblíbené produkty', 'Uložte si kabelku, ke které se chcete vrátit.'], ['service', 'Doživotní servis', 'Opravíme a vyčistíme vaše kabelky ELEGA i po letech.'], ['gift', '150 Kč na první nákup', 'Za přihlášení k odběru novinek.']];
    var cta = member() ? '<a class="btn-green lp-btn" href="#detail">Nakupovat se slevou ' + t().perm + ' %</a>' : '<button class="btn-green lp-btn" type="button" data-act="register">Registrovat se zdarma</button>';
    var top = S.tier === 'vip' ? vipInvite() : '';
    return '<section class="lp-hero" aria-labelledby="lp-h"><div class="lp-hero__img" role="img" aria-label="Zákaznice s kabelkou ELEGA"></div><div class="lp-hero__txt"><span class="lp-ey">Věrnostní program</span><h1 class="lp-h1" id="lp-h">Klub ELEGA.<br>Čím víc nosíte ELEGU, <em>tím méně platíte.</em></h1>' +
      '<p class="lp-p">Kabelky ELEGA vydrží roky. Chceme, aby se věrnost vyplácela stejně dlouho. Každý váš nákup na e-shopu i v prodejně v Třebechovicích se počítá a od 15 000 Kč za rok máte stálou slevu až 20 %.</p>' + cta +
      '<button class="lp-link" type="button" data-scroll="jak">Jak to funguje</button>' + (S.tier === 'silver' || S.tier === 'gold' ? heroCounter() : member() ? '' : '<div class="lp-facts"><span>' + ic('check') + 'Registrace zdarma</span><span>' + ic('check') + 'Bez karet a bodů</span><span>' + ic('check') + 'Sleva se počítá sama</span></div>') + '</div></section>' + top +
      '<section class="lp-sec" id="jak"><span class="lp-ey">Jak to funguje</span><h2 class="lp-h2">Tři kroky, žádné body ani kartičky</h2><ol class="lp-steps">' +
      [['Zaregistrujte se', 'Účet si založíte za minutu na e-shopu nebo při nákupu v prodejně. Je zdarma a k ničemu vás nezavazuje.'], ['Nakupujte online i v prodejně', 'Všechny nákupy na váš účet sčítáme dohromady, ať nakoupíte na elega.cz nebo osobně v Třebechovicích pod Orebem.'], ['Sleva se zapne sama', 'Jakmile za posledních 12 měsíců nakoupíte za 15 000 Kč, máte stálou slevu. Ceny na webu ji pak ukazují rovnou.']].map(function (s, i) { return '<li class="lp-step"><span class="lp-step__n">' + (i + 1) + '</span><h3>' + s[0] + '</h3><p>' + s[1] + '</p></li>'; }).join('') + '</ol></section>' +
      '<section class="lp-sec lp-sec--grey"><span class="lp-ey">Úrovně klubu</span><h2 class="lp-h2">Silver, Gold, VIP</h2><p class="lp-p">Úroveň určují nákupy za posledních 12 měsíců. Kdo nakupuje pravidelně, svou slevu si drží.</p><div class="tcards">' + tc + '</div></section>' +
      '<section class="lp-sec"><span class="lp-ey">Slevové akce</span><h2 class="lp-h2">V akcích dostanete víc než ostatní</h2><p class="lp-p">Zhruba jednou měsíčně pořádáme akci se slevou 20 % pro všechny. Členové klubu v ní mají vyšší slevu podle své úrovně.</p>' +
      '<table class="tbl"><caption class="sr-only">Kabelka Simone 6 490 Kč podle úrovně</caption><thead><tr><th>Úroveň</th><th>Mimo akci</th><th>V akci</th></tr></thead><tbody>' + rows + '</tbody></table><p style="font-size:14px;color:#8C8C8C;text-align:left">Příklad: Kabelka Simone oranžová/stříbro, běžná cena 6 490 Kč.</p></section>' +
      '<section class="lp-sec" style="border-top:1px solid #D9D9D9"><span class="lp-ey">Spočítejte si to</span><h2 class="lp-h2">Kolik u nás ročně utratíte?</h2><div class="calc"><label for="spend" style="font-weight:500;font-size:14px">Nákupy za 12 měsíců</label><output class="calc__val" id="spend-out" for="spend">' + kc(S.spend) + '</output>' +
      '<input type="range" id="spend" min="0" max="60000" step="500" value="' + S.spend + '"><div class="calc__sc" aria-hidden="true"><span style="left:0">0</span><span style="left:25%">15 000</span><span style="left:66.67%">40 000</span><span style="left:100%">60 000 Kč</span></div>' +
      '<div class="calc__pre"><button type="button" data-spend="9000">Jedna kabelka a peněženka</button><button type="button" data-spend="16000">Dvě kabelky ročně</button><button type="button" data-spend="42000">Kabelky i dárky</button></div><div id="calc-out" class="calc" aria-live="polite">' + calcOut() + '</div></div></section>' +
      (S.tier === 'vip' ? '' : '<section class="lp-vip"><div class="lp-vip__img" role="img" aria-label="Psaníčko ELEGA"></div><div class="lp-sec lp-sec--left"><span class="lp-ey">Jen pro VIP</span><h2 class="lp-h2">Pozvánka na křest nové kolekce</h2><p class="lp-p">Členky a členové VIP dostávají pozvánky na křest nových kolekcí ELEGA. Uvidíte novinky jako první, potkáte lidi, kteří kabelky navrhují a šijí, a odnesete si svůj kousek dřív, než se dostane na e-shop.</p><p class="todo" style="font-size:14px">[Doplnit: kde a jak často křest probíhá]</p></div></section>') +
      '<section class="lp-sec lp-sec--grey"><h2 class="lp-h2">A k tomu pro všechny s účtem</h2><ul class="lp-ben">' + ben.map(function (b) { return '<li>' + ic(b[0], 0.9) + '<b>' + b[1] + '</b><span>' + b[2] + '</span></li>'; }).join('') + '</ul></section>' +
      '<section class="lp-sec"><h2 class="lp-h2">Časté otázky</h2><div class="faq">' + faq.map(function (q) { return '<details><summary>' + q[0] + '</summary><p>' + q[1] + '</p></details>'; }).join('') + '</div></section>' +
      '<section class="lp-sec" style="border-top:1px solid #D9D9D9"><span class="lp-ey">' + (member() ? 'Jste v klubu' : 'Registrace zdarma') + '</span><h2 class="lp-h2">' + (member() ? 'Vaše sleva ' + t().perm + ' % platí na celém e-shopu' : 'Začněte sbírat na svou stálou slevu') + '</h2><p class="lp-p">' + (member() ? kmsg() : 'Založte si účet a příští nákup se vám už počítá. Stačí e-mail a heslo.') + '</p>' + cta + '</section>';
  }

  function footer() {
    return '<footer class="foot"><div class="foot__in"><div><img src="' + IMG + 'logo.svg" alt="ELEGA" style="height:22px;margin-bottom:12px"><p>Elega spol. s r.o.<br>Tyršova 536, Třebechovice p. Orebem<br>+420 731 655 203 · info@elega.cz</p></div>' +
      '<div><h3>O nás</h3><ul><li><a href="#detail">Doprava a platba</a></li><li><a href="#detail">Obchodní podmínky</a></li><li><a href="#detail">Reklamační řád</a></li></ul></div>' +
      '<div><h3>ELEGA</h3><ul><li><a href="#detail">Filozofie ELEGY</a></li><li><a href="#detail">Prodejny</a></li><li><a href="#detail">Doživotní servis</a></li></ul></div>' +
      '<div><h3>Klub ELEGA</h3><ul><li><a href="#klub">Jak klub funguje</a></li><li><a href="#klub">Úrovně a slevy</a></li></ul></div></div></footer>';
  }

  /* ---------- render ---------- */
  var root = document.getElementById('app');
  function render(keep) {
    var y = window.scrollY;
    var page = S.page === 'kosik' ? pageCart() : S.page === 'klub' ? pageKlub() : pageDetail();
    root.innerHTML = proto() + header() + '<main>' + page + '</main>' + (S.page === 'kosik' ? '' : footer()) + popup() + '<div class="toast" id="toast" role="status"></div>';
    document.title = ({ detail: 'Kabelka Simone', kosik: 'Košík', klub: 'Klub ELEGA' })[S.page] + ' – prototyp';
    if (keep) window.scrollTo(0, y);
  }
  function toast(m) { var e = document.getElementById('toast'); if (!e) return; e.textContent = m; e.classList.add('is-on'); clearTimeout(toast.t); toast.t = setTimeout(function () { e.classList.remove('is-on'); }, 2600); }
  function go(p) { S.page = p; S.pop = false; if (location.hash !== '#' + p) history.replaceState(null, '', '#' + p); render(); window.scrollTo(0, 0); }

  document.addEventListener('click', function (e) {
    var a = e.target.closest('a[href^="#"]');
    if (a && !a.dataset.act) { var h = a.getAttribute('href').slice(1); if (['detail', 'kosik', 'klub'].indexOf(h) > -1) { e.preventDefault(); return go(h); } }
    var b = e.target.closest('[data-set],[data-act],[data-go],[data-img],[data-color],[data-qty],[data-del],[data-spend],[data-scroll]');
    if (!b) return;
    if (b.dataset.set) { var kv = b.dataset.set.split(':'); if (kv[0] === 'page') return go(kv[1]); S.tier = kv[1]; save(); return render(true); }
    if (b.dataset.go) return go(b.dataset.go);
    if (b.dataset.img) { S.img = +b.dataset.img; return render(true); }
    if (b.dataset.color) { S.color = +b.dataset.color; render(true); return toast('Varianta ' + SW[S.color][1] + ' – v prototypu jen jako ukázka.'); }
    if (b.dataset.qty) { var q = b.dataset.qty.split(':'); S.cart.forEach(function (c) { if (c.id === q[0]) c.q = Math.max(1, c.q + (+q[1])); }); return render(true); }
    if (b.dataset.del) { S.cart = S.cart.filter(function (c) { return c.id !== b.dataset.del; }); render(true); return toast('Položka odebrána z košíku.'); }
    if (b.dataset.spend) { S.spend = +b.dataset.spend; var r = document.getElementById('spend'); if (r) r.value = S.spend; return updCalc(); }
    if (b.dataset.scroll) { var el = document.getElementById(b.dataset.scroll); if (el) el.scrollIntoView({ behavior: 'smooth' }); return; }
    var act = b.dataset.act;
    if (act === 'pop') { S.pop = !S.pop; return render(true); }
    if (act === 'more') { S.more = !S.more; return render(true); }
    if (act === 'fav') { S.fav = !S.fav; render(true); return toast(S.fav ? 'Přidáno k oblíbeným.' : 'Odebráno z oblíbených.'); }
    if (act === 'add') { var it = S.cart.filter(function (c) { return c.id === 'simone'; })[0]; if (it) it.q++; else S.cart.unshift({ id: 'simone', q: 1 }); render(true); return toast('Kabelka Simone je v košíku (' + cartCount() + ' ks).'); }
    if (act === 'logout') { S.tier = 'anon'; S.pop = false; save(); render(true); return toast('Odhlášeno.'); }
    if (act === 'register') { e.preventDefault(); if (S.page !== 'klub') { go('klub'); } else { S.pop = true; render(true); } return; }
    if (act === 'social' || act === 'noop') { e.preventDefault(); return toast('V prototypu není aktivní.'); }
    if (act === 'rsvp') { S.rsvp = !S.rsvp; render(true); return toast(S.rsvp ? 'Účast potvrzena. Pošleme vám připomínku e-mailem.' : 'Potvrzení účasti zrušeno.'); }
    if (act === 'cal') return toast('Ukázka: termín by se uložil do kalendáře.');
    if (act === 'next') return toast('Kontaktní údaje nejsou součástí prototypu.');
  });
  document.addEventListener('change', function (e) {
    var el = e.target;
    if (el.name === 'ship') { S.ship = el.value; render(true); }
    else if (el.name === 'pay') { S.pay = el.value; render(true); }
    else if (el.name === 'land') { S.land = el.value; render(true); }
    else if (el.dataset.addon) { S.addons[el.dataset.addon] = el.checked; render(true); }
  });
  function updCalc() { var o = document.getElementById('spend-out'), c = document.getElementById('calc-out'); if (o) o.textContent = kc(S.spend); if (c) c.innerHTML = calcOut(); }
  document.addEventListener('input', function (e) { if (e.target.id === 'spend') { S.spend = +e.target.value; updCalc(); } });
  document.addEventListener('submit', function (e) {
    e.preventDefault();
    var f = e.target.dataset.form;
    if (f === 'login') { S.tier = 'gold'; S.pop = false; save(); render(true); toast('Přihlášeno jako Jana (Gold).'); }
    if (f === 'coupon') { var m = document.getElementById('cp-msg'), v = (document.getElementById('cp').value || '').trim(); if (m) m.textContent = v ? 'Kupón „' + v + '“ v prototypu neověřujeme.' : 'Zadejte kód kupónu.'; }
  });
  document.addEventListener('keydown', function (e) { if (e.key === 'Escape' && S.pop) { S.pop = false; render(true); } });
  window.addEventListener('hashchange', function () { var p = location.hash.slice(1); if (['detail', 'kosik', 'klub'].indexOf(p) > -1 && p !== S.page) go(p); });
  render();
})();
