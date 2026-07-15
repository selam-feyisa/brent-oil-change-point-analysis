# Assumptions and Limitations

## Assumptions
1. **Log returns are approximately stationary within a regime.** The Bayesian change point model
   assumes a constant mean (and, in the simple version, constant variance) before and after
   `tau`. Real markets have more complex dynamics (e.g., volatility clustering), so this is a
   simplification.
2. **A single dominant change point per fitted window.** The core model detects one switch point.
   In reality, oil prices have experienced many structural breaks over 1987-2022; we address this
   by analyzing a recent sub-window and noting multiple-change-point extensions as future work.
3. **Daily closing price is a fair representative of that day's market state.** We do not adjust
   for intraday volatility, contract roll effects, or exchange-specific quirks.
4. **Event dates are start dates of the underlying real-world event**, not necessarily the date
   the market fully priced in the news (markets can anticipate or lag).
5. **Missing/irregular trading days** (holidays, weekends) are treated as simply absent from the
   series rather than interpolated.

## Limitations
1. **Correlation vs. causation.** This is the most important limitation of the whole analysis.
   A Bayesian change point model can tell us *when* the statistical properties of the price series
   changed and *how large* that change was. It cannot, by itself, prove that a specific real-world
   event *caused* that change. Oil prices are influenced by many simultaneous factors (macro data
   releases, currency moves, speculative positioning, weather, unrelated commodity moves). When we
   observe a change point close in time to a compiled event, we are proposing a **plausible
   hypothesis**, not a proven causal claim. Rigorous causal identification would require
   additional techniques (e.g., event-study methodology with control series, instrumental
   variables, or structural VAR models) that are outside the scope of this project.
2. **Look-ahead / multiple-comparisons risk.** With 19+ candidate events and one or a few detected
   change points, some near-matches could occur by chance. We mitigate this by preferring events
   with a clear, well-documented supply/demand mechanism over coincidental timing alone.
3. **Single-mean model does not capture volatility regime shifts** on its own. A period can become
   far more volatile without much change in the mean, which this simple model would under-detect.
4. **Sub-sampling window for tractability.** For MCMC efficiency we model a recent window rather
   than the full 35-year series; earlier structural breaks (e.g., 1990-91, 1998, 2008) are
   discussed qualitatively from the EDA rather than formally modeled with the same PyMC pipeline
   in this iteration.
5. **No macroeconomic controls.** We do not control for USD strength, global GDP growth, or
   competing energy prices, all of which independently move oil prices and could confound simple
   event-to-price-move narratives.

## Implication for Stakeholders
Treat the event associations in this report as **evidence-informed hypotheses** to guide further
due diligence, not as certainties. They are most useful for narrowing down *which* period and
*which* class of event to investigate further, not for making unqualified causal claims in
downstream decisions.
