# Veterinary Laboratory Staff Application (Pashu Seva)

Accredited biological veterinary diagnostic testing, sample tracking, specimen examination, and official diagnostic report upload system.

## Features
- **Laboratory Staff Authentication**: Role-based access control (`LAB_STAFF`, `LAB_DIRECTOR`).
- **Real-Time Diagnostic Test Queue**: Live intake of tests prescribed during veterinary teleconsultations.
- **Specimen Processing Workflow**: `PENDING` -> `TEST_IN_PROGRESS` -> `REPORT_AVAILABLE`.
- **Diagnostic Report Generation**: Comprehensive diagnostic metrics, pathogen identification, antibiotic susceptibility testing, and PDF generation.
- **Search & Archive**: Historical specimen records, animal ear tag tracking, and lab operations metrics.

## Development Setup
```bash
npm install
npm run dev
```

## Production Build & Deployment
```bash
npm run build
```
Deploy to Vercel or Netlify with:
- `VITE_API_URL`: URL of your deployed Pashu Seva backend (e.g. `https://your-backend.vercel.app/api`)
