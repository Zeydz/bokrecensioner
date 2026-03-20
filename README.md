# Bokrecensioner

En webbaserad plattform för bokrecensioner byggd med Next.js, React och TypeScript. Användare kan söka efter böcker via Google Books API, skriva recensioner med stjärnbetyg och hantera en personlig läslista.

## Funktioner

- Sök efter böcker via Google Books API
- Skriv, redigera och ta bort recensioner med stjärnbetyg (1-5)
- Hantera lässtatus per bok (Vill läsa / Läser / Har läst)
- Profilsida med statistik, recensioner och läslista
- Registrering och inloggning med JWT-autentisering
- Genomsnittligt betyg per bok
- Sortering av recensioner (nyast / högst betyg)
- Sökhistorik i sökfältet
- Responsiv design för desktop och mobil

## Teknikstack

- **Framework:** Next.js (App Router)
- **Frontend:** React, TypeScript, Tailwind CSS
- **Databas:** PostgreSQL via Supabase
- **ORM:** Prisma 
- **Autentisering:** NextAuth.js (JWT + CredentialsProvider)
- **Animationer:** Motion (tidigare Framer Motion)
- **API:** Google Books API

## Installation

### Krav
- PostgreSQL-databas (t.ex. via Supabase)

### Steg

1. Klona repot:
```bash
git clone https://github.com/Zeydz/bokrecensioner.git
cd bokrecensioner
```

2. Installera beroenden:
```bash
npm install
```

3. Skapa en `.env`-fil i projektets rot:
```env
DATABASE_URL=din-supabase-connection-string
NEXTAUTH_SECRET=din-hemliga-nyckel
NEXTAUTH_URL=http://localhost:3000
```

4. Generera Prisma-klienten och kör migrationer:
```bash
npx prisma generate
npx prisma db push
```

5. Starta utvecklingsservern:
```bash
npm run dev
```

Öppna [http://localhost:3000](http://localhost:3000) i webbläsaren.

## Testinloggning

Du kan registrera ett eget konto på `/register`

## Publicerad applikation

[bokrecensioner.vercel.app](https://bokrecensioner.vercel.app)