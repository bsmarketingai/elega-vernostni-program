# Klub ELEGA – klikací prototyp

Prototyp věrnostního programu Klub ELEGA pro elega.cz (BSSHOP). Vychází z návrhů ve Figmě
[ELEGA – sharp, stránka Věrnostní program](https://www.figma.com/design/qKcNs4MdLrNVCKs6Crl2ek/ELEGA---sharp?node-id=16585-212275).

Živá ukázka (claude.ai, soukromá): https://claude.ai/artifact/QKSR7kGevZGoPTpkS6C34m

## Spuštění

Čisté HTML + CSS + JS bez závislostí a bez buildu. Stačí otevřít `index.html` v prohlížeči,
nebo spustit jednoduchý server:

```
python3 -m http.server 8000
```

a otevřít http://localhost:8000. Písmo Lexend se načítá z Google Fonts.

## Stránky (hash routing)

| Adresa | Stránka |
|---|---|
| `#detail` | Detail produktu (Kabelka Simone) s Klub boxem a cenou po klubové slevě |
| `#kosik` | Košík: položky, doplňky, kupón, doprava/platba, spodní panel s klubovou slevou |
| `#klub` | LP Klub ELEGA: úrovně, tabulka slev, kalkulačka, FAQ; počítadlo pro Silver/Gold, pozvánka na křest pro VIP |
| ikona uživatele | Pop-up: přihlášení (nepřihlášený) / účet se stavem v klubu (Silver, Gold, VIP) |

Lišta nahoře přepíná úroveň zákazníka (Neregistrovaný / Silver / Gold / VIP) a stránku.
Volba úrovně se pamatuje v `localStorage` (`elega-proto`).

## Pravidla klubu

Obrat za posledních 12 měsíců (e-shop i prodejna).

| Úroveň | Hranice | Stálá sleva | V akci |
|---|---|---|---|
| Neregistrovaný | – | 0 % | 20 % |
| Silver | 15 000 Kč | 10 % | 21 % |
| Gold | 20 000 Kč | 15 % | 22 % |
| VIP | 40 000 Kč | 20 % | 25 % + pozvánky na křest |

Klubová sleva se v košíku počítá z ceny zboží (ne z dopravy, platby a doplňků).

## Ukázková data – nutno nahradit

- Zákaznice „Jana Nováková“ a její obraty (Silver 17 450 Kč, Gold 26 800 Kč, VIP 48 200 Kč).
- Hranice dopravy zdarma 3 000 Kč (`FREE` v `assets/js/app.js`).
- Termín a místo křtu (`EVENT` v `assets/js/app.js`).
- Texty označené `[Doplnit …]` ve FAQ a na detailu.
- Kupóny, přihlášení přes sociální sítě a další kroky objednávky nejsou aktivní.

## Struktura

```
index.html
assets/css/tokens.css   – design tokeny (barvy, písmo, breakpointy)
assets/css/base.css     – základ a atomy
assets/css/proto.css    – komponenty prototypu
assets/js/app.js        – data, vykreslení stránek a interakce
assets/img/             – fotky z elega.cz, logo
docs/KOMPONENTY.md      – mapování na komponenty ve Figmě a knihovně BSSHOP
```
