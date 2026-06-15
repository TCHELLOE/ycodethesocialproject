# Call Tracker

Persönliches Tool zum Tracken von Kaltakquise-Anrufen (Mac/iPhone, als Web-App).

## Features

- Tagesziel für Anrufe setzen
- Neuer Anruf: Telefonnummer + Name (optional), `tel:`-Link zum Wählen
- Ergebnis erfassen: **Erreicht** / **Nur geklingelt** / **Mailbox**
  - Bei **Erreicht**: kurzes Notizfeld für Call-Feedback
  - Bei **Nur geklingelt** / **Mailbox**: fertiger, kopierbarer Textschnipsel mit
    Datum + Uhrzeit (Geräte-Zeitzone + frei wählbare zweite Zeitzone, z. B.
    Europe/Berlin) zum Einfügen in deine Numbers/Excel-Tabelle
- Tagesstatistik / Motivationsanzeige (Anrufe gemacht / Ziel / erreicht)
- PIN-geschützt, Daten persistent in Upstash Redis

## Setup

1. **Dependencies installieren**

   ```bash
   npm install
   ```

2. **Upstash Redis anlegen** (kostenloser Free-Tier)

   - In Vercel-Projekt: Tab **Storage** → **Create Database** → **Upstash for
     Redis** (Marketplace-Integration) → mit dem Projekt verbinden
   - Dadurch werden automatisch die Env-Vars `UPSTASH_REDIS_REST_URL` und
     `UPSTASH_REDIS_REST_TOKEN` gesetzt

3. **PIN setzen**

   - Env-Var `APP_PIN` setzen (z. B. `1234`) – schützt den Zugriff auf die App

4. **Lokal entwickeln**

   ```bash
   cp .env.example .env.local   # ausfüllen mit Upstash-Daten + APP_PIN
   npm run dev
   ```

5. **Deploy**

   ```bash
   vercel deploy
   ```

## Auf dem iPhone/Mac nutzen

Nach dem Deploy die URL im Browser öffnen, einloggen (PIN) und über
"Zum Home-Bildschirm hinzufügen" (iPhone) bzw. als Lesezeichen/PWA (Mac) ablegen.
