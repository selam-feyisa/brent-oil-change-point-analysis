"""
Brent Oil Change Point Dashboard - Flask backend (starter)

This is scaffolding, not a finished app. It wires up the three endpoints the
challenge asks for and shows how to load your real analysis outputs. Fill in
the TODOs with your actual notebook results.

Run with:
    python app.py
Then visit http://localhost:5000/api/prices to sanity check.
"""

from flask import Flask, jsonify, request
from flask_cors import CORS
import pandas as pd
import os

app = Flask(__name__)
CORS(app)  # allow the React dev server (localhost:5173/3000) to call this API

DATA_DIR = os.path.join(os.path.dirname(__file__), "data")


@app.route("/api/health")
def health():
    return jsonify({"status": "ok"})


@app.route("/api/prices")
def get_prices():
    """
    Historical price data, optionally filtered by ?start=YYYY-MM-DD&end=YYYY-MM-DD

    TODO: point this at your real dataset, e.g.:
        df = pd.read_csv(os.path.join(DATA_DIR, "brent_prices.csv"), parse_dates=["Date"])
    For now this reads the small sample export in backend/data/prices_sample.csv
    """
    df = pd.read_csv(os.path.join(DATA_DIR, "prices_sample.csv"), parse_dates=["Date"])

    start = request.args.get("start")
    end = request.args.get("end")
    if start:
        df = df[df["Date"] >= pd.to_datetime(start)]
    if end:
        df = df[df["Date"] <= pd.to_datetime(end)]

    df["Date"] = df["Date"].dt.strftime("%Y-%m-%d")
    return jsonify(df.to_dict(orient="records"))


@app.route("/api/changepoints")
def get_changepoints():
    """
    Change point results from your PyMC model.

    TODO: replace this stub with the real output of your Task 2 notebook.
    Easiest approach: after fitting the model in the notebook, export the
    key numbers to backend/data/changepoints.json, e.g.:

        import json
        json.dump([{
            "date": str(change_date.date()),
            "price_before": float(before),
            "price_after": float(after),
            "percent_change": float(percent_change),
            "tau_index": int(estimated_tau),
        }], open("../backend/data/changepoints.json", "w"))
    """
    import json
    path = os.path.join(DATA_DIR, "changepoints.json")
    if not os.path.exists(path):
        return jsonify({"error": "changepoints.json not found - export it from your notebook"}), 404
    return jsonify(json.load(open(path)))


@app.route("/api/events")
def get_events():
    """Researched key events, from data/key_events.csv (Task 1 deliverable)."""
    df = pd.read_csv(os.path.join(DATA_DIR, "key_events.csv"), parse_dates=["Date"])
    df["Date"] = df["Date"].dt.strftime("%Y-%m-%d")
    return jsonify(df.to_dict(orient="records"))


if __name__ == "__main__":
    app.run(debug=True, port=5000)
