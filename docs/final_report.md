% Change Point Analysis of Brent Crude Oil Prices
% Birhan Energies — Data Science Team
% July 2026

# What Moves Brent Crude? A Bayesian Change Point View

Brent crude has swung from single digits to nearly $150 a barrel over the last three and a half
decades. For investors, policymakers, and energy companies, the hard question is never just "did
the price move" — it's "when did the market's behavior structurally change, by how much, and
what plausibly caused it." This report walks through a Bayesian change point analysis of daily
Brent prices (20-May-1987 to Nov-2022) built for Birhan Energies to help answer that question.

## Data and Approach

We worked with daily Brent spot prices, converting them to log returns
(`log(P_t) - log(P_t-1)`) since raw prices are non-stationary while returns are much closer to
stationary — a requirement for the change point model we use. An Augmented Dickey-Fuller test on
the log-return series confirms this: the test statistic was **-16.43** (p-value ≈ 2.5 × 10⁻²⁹),
strongly rejecting the presence of a unit root, i.e. the return series is stationary.

We then compiled a structured dataset of 19 major events plausibly relevant to oil markets since
1987 — wars and conflicts in producing regions, OPEC/OPEC+ policy shifts, sanctions, and global
economic shocks like the 2008 financial crisis and the COVID-19 demand collapse. This event
dataset lets us move from "the model found a break here" to "here's a plausible story for why."

## The Model

We used a Bayesian change point model in PyMC: a single unknown switch point `tau` (given a
discrete-uniform prior over the time index), two regime means (`mu1` before, `mu2` after) for the
log-return series, a shared volatility parameter `sigma`, and a Normal likelihood whose mean is
selected via `pm.math.switch` depending on whether each day falls before or after `tau`. For
computational tractability we fit this to a recent window of the series (the last 2,000 trading
days) rather than the full 35-year history.

## What We Found

The posterior median of `tau` corresponds to **15 April 2020**. Comparing average prices either
side of that point:

| | Average Price |
|---|---|
| Before change point | **$56.63** |
| After change point | **$73.17** |
| Change | **+29.22%** |

**Candidate cause.** The closest researched event is OPEC+'s agreement on 12 April 2020 to record
coordinated production cuts (9.7 million barrels/day) — just **3 days** before the estimated
change point — in response to the COVID-19 demand shock and the preceding Saudi-Russia price war.
The direction is consistent with the story: after the historic supply-cut agreement, average
prices in our window recovered materially relative to the crisis-era lows that preceded it.

**A convergence caveat, stated plainly.** MCMC diagnostics for this run show `r_hat` values of
1.12 for `tau` and 1.08 for `mu1` — above the conventional 1.01 threshold for confident
convergence, meaning the chains had not fully mixed. `sigma` converged cleanly (r_hat ≈ 1.00). In
practice this means: treat the *direction and rough magnitude* of the shift as informative, but
treat the *exact* date and parameter values with some caution. Re-running with more tuning
samples, tighter priors, or a longer warm-up would be the first step to firm this up further.

## Correlation, Not Causation

This is worth stating outright: a change point model tells us *when* the statistical properties
of the price series shifted and *how large* that shift was. It does not, by itself, prove that a
specific headline event *caused* the shift. Oil prices move on many simultaneous forces —
currency swings, unrelated commodity moves, speculative positioning, macro data surprises. When a
detected change point lines up closely with a researched event, we are proposing a **plausible,
evidence-informed hypothesis** — not a proven causal claim. Full details on assumptions and
limitations are documented in `docs/assumptions_and_limitations.md` in the project repository.

## Why This Matters for Stakeholders

- **Investors**: structural breaks like this one mark points where prior price trends stopped
  being a reliable guide — useful as a trigger to re-evaluate positioning rather than extrapolate
  the prior regime forward.
- **Policymakers**: seeing how sharply coordinated supply decisions (like the 2020 OPEC+ cuts)
  can move the market underscores how much leverage production policy has over price stability.
- **Energy companies**: quantified before/after price levels support more grounded budgeting and
  hedging assumptions around known categories of shock (sanctions, conflict, OPEC+ policy).

## Interactive Dashboard

To make these results explorable rather than static, we built the scaffold for a companion
dashboard (Flask API + React frontend) that serves the price series, the researched events, and
the change point results, with date filtering and event highlighting. See the project's
`backend_frontend_README.md` for setup instructions.

*(Dashboard screenshots: see docs/screenshots/ once the frontend TODOs are completed locally.)*

## Limitations and Future Work

- The model detects a single change point per fitted window; the full 35-year series almost
  certainly contains many more structural breaks (1990-91 Gulf War, 1998 price collapse, 2008
  spike and crash, 2014-16 shale-driven decline, among others) that a multiple-change-point or
  regime-switching (Markov-switching) model would be better suited to capture.
- The current model only shifts the *mean* of returns; it does not separately model *volatility*
  regime shifts, which is a meaningfully different kind of market change.
- No macroeconomic controls (USD strength, global GDP growth, competing energy prices) are
  included; a Vector Autoregression (VAR) approach incorporating these would help disentangle
  overlapping drivers.
- The MCMC convergence caveat above should be resolved with a longer/re-tuned sampling run before
  treating specific parameter values as final.

## Conclusion

Around mid-April 2020, Brent crude's price behavior shifted structurally, with average prices
rising roughly 29% relative to the preceding window — a shift that lines up closely with OPEC+'s
record coordinated production cuts. The broader takeaway for Birhan Energies' clients: statistical
change point detection, combined with disciplined event research, is a practical way to move from
"the market moved" to "here's the most plausible story, and here's how confident we actually are
in it."
