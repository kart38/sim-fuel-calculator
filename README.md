# Fuelwise

Fuelwise is a responsive racing-sim fuel calculator based on `Sim Fuel Usage.xlsx`. It supports:

- Fuel requirements calculated from race time and average lap time.
- Fuel requirements calculated from a fixed race lap count.
- Liter and gallon display modes.
- A two-lap reserve in time-based calculations.
- Pit-load and lap-count summaries.

## Run locally

```powershell
npm.cmd install
npm.cmd run dev -- --host 127.0.0.1
```

Open `http://127.0.0.1:5173`.

## Build

```powershell
npm.cmd run build
```

The production site is written to `dist/` and can be uploaded to any static host.

## Deploy

### GitHub Pages

Push the repository to GitHub and enable Pages with **GitHub Actions** as the source. The included workflow builds and deploys `dist/` on pushes to `main`.

### Netlify

Connect the repository and use:

- Build command: `npm run build`
- Publish directory: `dist`

The included `netlify.toml` supplies these settings.

## Spreadsheet formula

Time-based fuel uses:

```text
(race seconds / lap seconds + 2 laps) * fuel used per lap
```

Lap-based fuel uses:

```text
race laps * fuel used per lap
```
