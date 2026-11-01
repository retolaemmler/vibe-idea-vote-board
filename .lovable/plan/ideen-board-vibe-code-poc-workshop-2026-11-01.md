# Ideen-Board Vibe Code PoC Workshop

## Was gebaut wird
- **Start / Dashboard (/)**: Top-Ideen nach Likes (Top 5 hervorgehoben), Anzahl Ideen pro Kategorie als Balkendiagramm, Link zu "Idee erfassen" und "Alle Ideen".
- **Alle Ideen (/ideen)**: Liste aller Ideen mit Filter nach Kategorie, Like-Button mit Zähler.
- **Idee erfassen (/ideen/neu)**: Formular mit Name, Titel, Beschreibung, Kategorie.
- Beim ersten Besuch: Name eingeben (wird im Browser gespeichert), kein Login.
- Ein Like pro Idee und Browser, erneut klicken entfernt den Like.

## Kategorien (Bank-intern)
Kundenerlebnis, Prozessautomatisierung, Beratung & Anlage, Kredit & Hypotheken, Zahlungsverkehr, Compliance & Risiko, Mitarbeitende & Zusammenarbeit, Daten & KI.

## Gestaltung
Raiffeisen Design System durchgehend (Logo, Button, Input, BarChart, Badge, Alert, Snackbar), Texte auf Deutsch.

## Technisches
- Lovable Cloud aktivieren; Tabellen `ideas` (name, title, description, category) und `idea_likes` (idea_id, voter_id, unique). Öffentliche Lese-/Schreibrechte für anon mit Längenprüfungen; Like-Löschen nur über eigene voter_id (via Serverfunktion).
- voter_id = zufällige UUID in localStorage.
- Zod-Validierung, Daten via TanStack Query, head()-Metadaten pro Seite.
