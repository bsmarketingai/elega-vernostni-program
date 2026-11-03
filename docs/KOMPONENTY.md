# Mapování komponent

| Prototyp (CSS třída / funkce) | Figma (ELEGA – sharp) | Poznámka |
|---|---|---|
| `.kbar` (`kbar()`) | `Silver` (lišty úrovní), `Klub-box-detail`, `Klub-box-kosik` | Neregistrovaný šedá, Silver šedý přechod, Gold šampaň, VIP tmavá |
| `.kmsg` (`kmsg()`) | text v Klub-box | „Členové Klubu ELEGA mají stálé slevy.“ / „Do úrovně X zbývá …“ / „Děkujeme za důvěru!“ |
| `.kband` | spodní pruh košíku (detail-kosik-desktop) | desktop: úroveň · věta · sleva / Jak to funguje? |
| `.cpanel`, `.sum` | OrderActionPanelHorizontal | mobil: rozpis slevy, dopravy, platby; desktop: klubová sleva, poštovné a balné, konečná cena |
| `.pop--login` | LP/Pop-up uživatele, Stav=Neregistrovaný | přihlášení s fotkou, registrace, ELEGA Klub |
| `.pop` (člen) | LP/Pop-up uživatele, Stav=Silver/Gold/VIP | stav, nákupy za 12 měsíců, odkazy účtu |
| `.tcard` | LP/Úroveň karta | |
| `.lp-step` | LP/Krok | |
| `.lp-ben li` | LP/Výhoda + LP/ikona/* | |
| `.lp-cnt` | – (nové) | decentní počítadlo v úvodním banneru LP pro Silver a Gold |
| `.lp-inv` | – (nové) | pozvánka na křest kolekce pro VIP pod úvodním bannerem |
| `.faq details` | detail/accordeonItem | |
| `.acc details` | detail/accordeon | detail produktu |

Nové komponenty (`.lp-cnt`, `.lp-inv`, `.kband`) je potřeba doplnit do knihovny BSSHOP a do Figmy.
