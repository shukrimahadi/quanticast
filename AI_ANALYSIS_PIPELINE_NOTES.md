## AI Analysis Pipeline Notes (Internal)

- Source guide: `myfiles/ai_analysis_guide_10dec25.txt`
- Framework: 4-Phase Hybrid (Validation → Context Visual → Grounding → Horizon) + Final Signal
- Models (as per guide): flash-8b (validation), pro (visual), flash (grounding), flash (horizon)
- Grounding checks: volume vs avg, OI, funding; flag low-volume breakouts
- Horizon checks: earnings/CPI/FOMC/major news; cap grade near binary events per matrix
- Grade logic: use Hybrid Adjuster Matrix (vol/horizon impacts); A+ to F definitions in guide
- Strategies: SMC, ICT 2022, AMT, Liquidity Flow, VCP, CAN SLIM, Elliott, Dow, Gann, Wyckoff, Investment Clock, LPPL, Intermarket, Fractal, Sentiment (apply one)
- Output schema: `AnalysisResult` (grade, trade_plan, rationale, dna_score, risk_flags) from guide
- Always follow: Validate -> Visual (with dashboard context) -> Grounding -> Horizon -> Grade/Cap -> Emit JSON

