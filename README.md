# Shui

Ett REST API för en digital anslagstavla, byggt som en serverless backend med Node.js, AWS Lambda, API Gateway och DynamoDB. Ingen frontend ingår.

**Driftsatt API:** https://mgnitot8e9.execute-api.eu-north-1.amazonaws.com

## Kom igång

Du behöver Node.js 24, Serverless Framework och ett AWS-konto med konfigurerade autentiseringsuppgifter.

```bash
npm install
npm install -g serverless
cp .env.example .env
```

Fyll i följande i `.env`:

- `SERVERLESS_ORG` – din organisation i Serverless Framework.
- `LAMBDA_ROLE_ARN` – ARN till en Lambda-roll med behörighet för CloudWatch-loggar och DynamoDB-tabellen `ShuiDB` inklusive dess index.
- `JWT_SECRET` – en lång, slumpmässig hemlighet för signering av JWT. Använd inte exempelvärdet.

## Kör och driftsätt

```bash
serverless deploy
```

Kommandot driftsätter API:et och databasen i AWS-regionen `eu-north-1` och skriver ut API:ets URL. API:et körs i AWS, inte som en lokal webbserver.

För utveckling mot AWS:

```bash
serverless dev
```

Driftsättning kan medföra AWS-kostnader.

## Använd API:et

Skicka JSON med `Content-Type: application/json`. Registrera en användare med `POST /auth/register` och logga in med `POST /auth/login`. Båda tar emot:

```json
{
  "username": "something",
  "password": "Something123!"
}
```

Använd token från inloggningen för skyddade anrop:

```text
Authorization: Bearer <token>
```

| Metod | Endpoint | Beskrivning |
| --- | --- | --- |
| POST | `/auth/register` | Registrera användare |
| POST | `/auth/login` | Logga in och få en JWT |
| GET | `/posts` | Lista inlägg, filtrera med `?username=jesper` |
| GET | `/posts/{postId}` | Hämta ett inlägg |
| POST | `/posts` | Skapa inlägg som inloggad |
| PUT | `/posts/{postId}` | Uppdatera ett eget inlägg |
| DELETE | `/posts/{postId}` | Radera ett eget inlägg |

Se [API-specifikationen](api-spec.md) för request- och responseformat samt felkoder och [uppgiftsbeskrivningen](upgift.md) för examinationskraven.

## Testa alla endpoints med curl

Kräver Bash, curl och Node.js:

```bash
bash scripts/curl-api.sh
# Eller mot en annan driftsättning:
bash scripts/curl-api.sh https://din-api-url
```

Skriptet anropar alla nio endpoints samt användarnamnsfiltret och visar statuskod och svar. Det skapar ett testkonto som blir kvar och ett testinlägg som raderas vid avslut. Oväntade statuskoder avbryter med fel; `501` från kommentarsendpoints visas som ej implementerade. Inloggningssvaret innehåller en JWT – dela inte utskriften medan den är giltig.

Testa skriptet lokalt utan AWS-anrop:

```bash
node --test tests/curl-api.test.mjs
```

**Status:** Gästpublicering och kommentarer (VG) är inte implementerade. Kommentarsendpoints returnerar för närvarande `501`.
