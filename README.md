# Pharmacy Web Platform

A pharmacy e-commerce platform consisting of:

- **Backend** — .NET 8 Web API (`Pharmacy web (backend)`) serving REST endpoints under `api/v1/*`, with EF Core (SQL Server), Cloudinary image uploads, Mapbox delivery-directions, and email verification via SMTP.
- **Frontend** — React single-page app (`Pharmacy web(Frontend)/pharmacyapp`) bootstrapped with Create React App, for customers and pharmacy managers.

---

## Prerequisites

| Tool | Notes |
|---|---|
| [.NET 8 SDK](https://dotnet.microsoft.com/download/dotnet/8.0) | Required to build/run the API |
| [Node.js](https://nodejs.org/) 18+ | Includes `npm` for the frontend |
| SQL Server | Local (e.g. SQL Server Express / LocalDB) or Azure SQL |
| EF Core tools | `dotnet tool install --global dotnet-ef` |
| HTTPS dev certificate | Run once: `dotnet dev-certs https --trust` |

---

## 1. Configure the backend (required)

The repository **does not** include `appsettings.json` (it holds secrets and is git-ignored).
Create your local copy from the provided template:

```bash
cd "Pharmacy web (backend)/Pharmacy Web API"
cp appsettings.example.json appsettings.json
```

Then fill in every value:

| Key | What to put | Notes |
|---|---|---|
| `ConnectionString` | Your SQL Server connection string | Any `User Id`/`Password` you control |
| `SecurityKey` | **Exactly 16, 24 or 32 characters** | Used as the AES key by `Security/SecurityMethode.cs`. ⚠️ **If the database already contains passwords encrypted with an existing key, changing this value makes that data unreadable.** Keep the key the database was encrypted with. |
| `Cloudinary:CloudName` / `ApiKey` / `ApiSecret` | Cloudinary account credentials | Used for all image uploads |
| `MailPassword` | Gmail **App Password** | Needs 2FA enabled on the Gmail account |
| `EmailAddress` | The Gmail address that sends verification emails | SMTP sender (`smtp.gmail.com:587`) |
| `MapboxKey` | Mapbox access token | Delivery distance/directions |
| `PhoneNumber` | Support phone number (e.g. `9627XXXXXXXXX`) | Shown to users |

> **Never commit your real `appsettings.json`.** For production (e.g. Azure App Service), set these values in the app service **Configuration** — the API also reads environment variables (`Program.cs` calls `AddEnvironmentVariables()`).

### Apply database migrations

PowerShell:

```powershell
dotnet ef database update `
  --project "Pharmacy web (backend)/DatabaseLayer" `
  --startup-project "Pharmacy web (backend)/Pharmacy Web API"
```

bash (single line):

```bash
dotnet ef database update --project "Pharmacy web (backend)/DatabaseLayer" --startup-project "Pharmacy web (backend)/Pharmacy Web API"
```

## 2. Run the backend

```bash
dotnet run --project "Pharmacy web (backend)/Pharmacy Web API"
```

- Runs on **`https://localhost:7204`** (also `http://localhost:5179`).
- Swagger UI: `https://localhost:7204/swagger` (Development only).

## 3. Run the frontend

```bash
cd "Pharmacy web(Frontend)/pharmacyapp"
npm install
npm start
```

- Opens on **`http://localhost:3000`**.
- The backend CORS policy only allows `http://localhost:3000` — if you use a different port, update the origin in `Pharmacy web (backend)/Pharmacy Web API/Program.cs`.

---

## Fixed ports (important)

The frontend talks to the backend through URLs hardcoded in these files:

```
src/services/customerServices.js
src/services/managerServices.js
src/services/orderServices.js
src/services/pharmacyServices.js
src/services/phProductsServices.js
src/services/requestServices.js
```

They all point to `https://localhost:7204/api/v1/...`. If you change the API port, update these files too (search & replace `https://localhost:7204`).

---

## Troubleshooting

| Symptom | Cause / fix |
|---|---|
| CORS / network errors in browser | Backend not running on `https://localhost:7204`, or frontend not on `http://localhost:3000` |
| HTTPS trust warning | Run `dotnet dev-certs https --trust` |
| App can't connect to DB | Check `ConnectionString` in `appsettings.json` and run the EF migration command above |
| Email codes never arrive | Wrong `MailPassword` (must be a Gmail **App Password**, not the account password) or missing 2FA |
| AES `Specified key is not a valid size` | `SecurityKey` must be exactly 16, 24 or 32 characters |

---

## Security notes

- `appsettings.json`, `.env`, `*.pem`, publish profiles and Azure service-dependency metadata are git-ignored — do not force-add them.
- Copy `appsettings.example.json` and fill it locally; teammates each keep their own.
- See `PROJECT_DOCUMENTATION.md` (backend) for the full API endpoint list.
