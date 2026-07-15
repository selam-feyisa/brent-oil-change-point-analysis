# Analysis Workflow: Change Point Analysis of Brent Oil Prices

## 1. Objective
Quantify how major geopolitical and economic events have historically shifted the level and
volatility of Brent crude oil prices, using Bayesian change point detection, and translate the
statistical results into insights useful to investors, policymakers, and energy companies.

## 2. Workflow Steps

**Step 1 — Data Loading & Cleaning**
Load `BrentOilPrices.csv` (daily prices, 20-May-1987 to 30-Sep-2022), parse the `Date` column to
datetime, sort chronologically, and check for missing values or duplicate dates.

**Step 2 — Exploratory Data Analysis**
- Plot the raw price series to visually identify long-run trends and obvious shock periods.
- Compute log returns, `log(P_t) - log(P_t-1)`, since raw prices are non-stationary while returns
  are closer to stationary and better suited to modeling.
- Plot log returns to inspect volatility clustering (periods of turbulence followed by calm).
- Run an Augmented Dickey-Fuller (ADF) test on both price levels and log returns to formally test
  stationarity.

**Step 3 — Event Research**
Compile a structured dataset (`data/key_events.csv`) of major supply/demand shocks: wars and
conflicts in oil-producing regions, OPEC/OPEC+ policy decisions, international sanctions, and
global economic shocks (financial crises, pandemics). This gives us candidate explanations to test
detected change points against.

**Step 4 — Bayesian Change Point Modeling (PyMC)**
- Define a discrete-uniform prior over `tau`, the unknown switch point in time.
- Define separate "before" and "after" parameters (e.g., `mu1`, `mu2`, and a shared or
  regime-specific `sigma`).
- Use `pm.math.switch` so the likelihood mean depends on whether each time index is before or
  after `tau`.
- Fit with `pm.sample()` (MCMC/NUTS).

**Step 5 — Convergence Checks & Interpretation**
- Inspect `r_hat` (should be ≈1.0) and effective sample size via `pm.summary()`.
- Visually inspect `az.plot_trace()` for good mixing.
- Plot the posterior of `tau` to see how sharply the change point is localized in time.
- Convert the estimated `tau` index back into a calendar date.

**Step 6 — Associate Change Points with Events**
Compare each detected change-point date against the compiled events dataset (allowing a
reasonable window, e.g. ±2-4 weeks, since markets sometimes anticipate or lag headline events).
Formulate a hypothesis for the most plausible triggering event and quantify the shift, e.g.
"average price moved from $X to $Y (Z% change) around [date], coinciding with [event]."

**Step 7 — Reporting**
Summarize findings for a non-technical audience: what changed, when, by how much, and the most
plausible cause — while being explicit about the difference between statistical association and
proven causation (see `docs/assumptions_and_limitations.md`).

## 3. Expected Outputs
- One (or more) posterior-estimated change point date(s)
- Before/after parameter estimates (mean level and/or volatility) with credible intervals
- A quantified impact statement per change point
- A shortlist of candidate real-world events plausibly associated with each change point

## 4. Modeling Choices Driven by Data Properties
- **Non-stationarity of price levels** → model log returns instead of raw prices, since the
  Normal-likelihood change point model assumes a roughly stable variance structure within each
  regime.
- **Volatility clustering** → a single-mean change point model captures shifts in the *level* of
  returns, but not shifts in *volatility* alone; this is flagged as a limitation (see below) and a
  motivation for future extensions (e.g., a switching-variance or GARCH-family model).
- **35 years of daily data** → for the change point model, we work with a recent, more
  computationally tractable window (rather than the full 1987-2022 series) and document this
  choice explicitly as a limitation/assumption.
