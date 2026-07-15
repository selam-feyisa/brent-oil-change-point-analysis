# Task 3 Dashboard - Setup & Next Steps

This is a **starter scaffold**: a working Flask skeleton with real endpoints wired to your
actual data, and an unwired React skeleton with clear TODOs. It is not a finished dashboard -
you'll fill in the TODO comments in `frontend/src/components/*.jsx` to get the interactivity
(event highlighting, drill-down) the rubric asks for.

## What's already working
- `GET /api/prices?start=YYYY-MM-DD&end=YYYY-MM-DD` - full price series, date-filterable
- `GET /api/events` - your `key_events.csv`
- `GET /api/changepoints` - returns 404 with an instructive message until you export your
  notebook's results to `backend/data/changepoints.json` (see Step 3 below)
- React app fetches all three on load and renders a line chart + event table

## What you still need to do
1. Export your PyMC change point result to JSON (Step 3 below)
2. Wire up event highlight markers on the chart (`PriceChart.jsx` TODO)
3. Add drill-down on click (`EventList.jsx` TODO)
4. Style it (currently bare-bones dark theme in `index.css`)
5. Take the screenshots the final report needs

## PowerShell setup (Windows)

Run these from your repo root (`brent-oil-change-point-analysis`).

### 1. Backend (Flask)
```powershell
cd backend
python -m venv venv
.\venv\Scripts\Activate.ps1
pip install -r requirements.txt
python app.py
```
Leave this running. Visit `http://localhost:5000/api/prices` in a browser to confirm you see JSON.

> If `Activate.ps1` is blocked, run PowerShell as admin once and execute:
> `Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser`

### 2. Frontend (React + Vite)
Open a **second** PowerShell window (keep Flask running in the first):
```powershell
cd frontend
npm install
npm run dev
```
Visit `http://localhost:5173` - you should see the dashboard shell pulling live data from Flask.

### 3. Export your change point results from the notebook
At the end of `notebooks/task2_change_point_analysis.ipynb`, add a cell:
```python
import json

json.dump([{
    "date": str(change_date.date()),
    "price_before": float(before),
    "price_after": float(after),
    "percent_change": float(percent_change),
    "tau_index": int(estimated_tau),
}], open("../backend/data/changepoints.json", "w"))
```
Run it, then restart the Flask server so it picks up the new file.

### 4. Take screenshots for the final report
Once the chart is rendering with real data, screenshot:
- the full price series with a change point marked
- the event table/filter in action
Save them to `docs/screenshots/` — the final report references this folder.
