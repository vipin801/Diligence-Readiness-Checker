# Diligence Readiness Check — Tool Spec v1
*For incentiv.finance/tools/ · No code yet · Sept 2026*

**Working name:** Diligence Readiness Check
**Subtitle:** *"Find out what investors will flag in your data room — in 90 seconds."*
**Promise:** 8 clicks → a list of what will delay your close, and by how long.

---

## 1. The core mechanic (why this converts)

The pitch only works if the tool first shows the founder something they didn't know. Generic output = an ad. Specific output = a rescue.

**The single best moment in the whole tool:** a founder answers *"cap table is in a spreadsheet"* + *"we have SAFEs / CCPS outstanding"* + *"raising in 1–3 months."* That combination means **they do not currently know their real post-conversion founder ownership** — which is the first number a partner asks for.

So the output says:

> You have 3 instrument types outstanding and your cap table lives in a spreadsheet.
> That means you don't currently know your post-conversion founder ownership.
> It is the first number a partner will ask you for.
> **→ See your real number in Tabulate**

That is not an ad. It's a cliffhanger. **Create the itch, then sell the scratch.**

**Corollary rule:** the tool must give away at least two fixes the founder can do themselves, free, today, without Incentiv. That is what makes it feel like a tool instead of a funnel, and it is what makes people forward it. Give away two, sell the other two.

---

## 2. The 8 questions (all multiple choice, no numbers, ~90 seconds)

Each question is chosen for diagnostic yield — one answer alone predicts a real, expensive problem.

**Q1. Where does your cap table live today?**
- On a platform (Tabulate / Qapita / Carta / other)
- In Excel or Google Sheets
- My CA or CS maintains it
- Honestly, not sure

**Q2. What's outstanding besides ordinary equity?** *(multi-select)*
- Nothing — plain equity only
- SAFEs
- Convertible notes / CCDs
- CCPS (preference shares)
- ESOP grants
- Not sure

**Q3. Your ESOP pool:**
- No pool yet
- Pool approved, less than half granted
- Pool approved, mostly granted
- Over-granted / need to expand
- Not sure

**Q4. Founder vesting:**
- All founders on vesting, documented
- Some founders, or informal/undocumented
- No vesting agreements
- A founder has left and still holds equity

**Q5. ROC / MCA filings:**
- All current
- Behind on some
- Not sure

**Q6. Foreign shareholders or foreign capital?**
- None
- Yes — FC-GPR filed on time
- Yes — not sure about the filings
- Investor from a country sharing a land border with India

**Q7. Your last round's valuation:**
- Merchant banker / Rule 11UA report on file
- Negotiated, no formal report
- No priced round yet
- Not sure

**Q8. When are you raising?**
- Not currently raising
- In 6+ months
- In the next 1–3 months
- Term sheet in hand / diligence has started

> **Q8 is the urgency multiplier.** It doesn't change *which* flags fire — it changes tone, ordering, and how hard the CTA pushes. "Term sheet in hand" + red flags = maximum urgency, and the highest-intent user Incentiv will ever see.

---

## 3. Scoring: a risk register, not a score

**No weighted average. No 0–100.** Each answer either fires a flag or doesn't. Every flag carries:

- **Severity** — `Blocker` / `Delay` / `Cleanup`
- **Estimated delay** — a range in weeks
- **Who fixes it** — `You` / `Your CA/CS` / `Incentiv`

Headline output is a **time cost, not a score**:

> ### 4 issues found · estimated 5–9 weeks of delay at close

Founders mid-raise care about the closing date, not a number. This is the highest-leverage design decision in the tool.

### Flag table *(delay ranges are placeholders — calibrate from Incentiv's own 200+ company book, which makes them defensible AND proprietary)*

| Trigger | Flag | Severity | Est. delay | Fixed by |
|---|---|---|---|---|
| Q1 = Sheets / CA / not sure | Cap table has no single source of truth; won't reconcile against MCA | Delay | 2–3 wks | **Incentiv** |
| Q2 = 2+ instrument types | Instrument stack not modelled — post-conversion ownership unknown | Delay | 1–2 wks | **Incentiv** |
| Q2 = "Not sure" | You don't know what's outstanding. Diligence will find out for you. | Blocker | 3–4 wks | **Incentiv** |
| Q3 = no pool / not sure | No approved ESOP pool — investors will require one pre-close, and it dilutes you, not them | Delay | 3–4 wks | Incentiv + CS |
| Q3 = over-granted | Pool expansion needs fresh approvals mid-round | Delay | 2–3 wks | Incentiv |
| Q4 = partial / none | Founder vesting missing — a standard investor condition | Delay | 2–4 wks | You + CS |
| Q4 = departed founder holds equity | Dead equity on the cap table. Frequently a deal-breaker, not a delay. | **Blocker** | 4–8 wks+ | You + Incentiv |
| Q5 = behind / not sure | ROC filings not current — penalties accrue daily | Delay | 2–6 wks | Your CA/CS |
| Q6 = filings unsure | FC-GPR/FEMA exposure — RBI compounding is slow and expensive | **Blocker** | 4–8 wks | Incentiv Advisory |
| Q6 = land-border investor | Press Note 3 — government approval required | **Blocker** | Indefinite | Incentiv Advisory |
| Q7 = no report / not sure | Valuation undefended under Rule 11UA | Cleanup | 1–2 wks | Incentiv Advisory |

**Calibration rule:** if the median user finishes with 1 flag, the tool is decoration. Most Indian early-stage companies genuinely have 3–5 of these. The output should be uncomfortable and true.

---

## 4. The results screen — structure and the pitch placement

**Never a banner ad.** The pitch attaches to the specific flag it solves.

**1 — Headline**
> **4 issues found · 5–9 weeks of delay at close**
> Based on how diligence typically runs for Indian companies at your stage.

**2 — The flags**, ordered by severity. Each card: what it is → *why an investor asks* → severity → weeks → who fixes it.
The *"why an investor asks"* line is what makes this feel expert rather than automated.

**3 — The split** *(the hinge of the whole page)*
> **2 of these you can fix yourself this week.** Here's how. *(genuinely useful, no gate)*
> **2 of these need a system.**

**4 — The Tabulate pitch**, contextual, attached to flags 1 and 2:
> Your cap table is in a spreadsheet, and you have SAFEs and CCPS outstanding.
> You can't answer "what do the founders own post-conversion?" — and that's question one.
> **Tabulate imports your existing sheet and reconciles it against your ROC filings.**
> → *See your real number*

**5 — Secondary CTAs**
- `Email me this report` — optional capture, **no wall** (respects the page's free/no-signup rule)
- `Talk to Advisory` — for FEMA / PN3 / 11UA flags specifically
- Routes into existing tools: dilution → **Funding Round Simulator** · ESOP exercise → **ESOP Tax Calculator** · valuation → **Valuation Calculator**

---

## 5. Two-stage architecture

**Stage 1 (v1, free, instant):** 8 clicks → flags + weeks. No numbers, no account, no upload.

**Stage 2 (optional, later):** *"Add your actual shareholding for a precise post-conversion read."*
This is deliberately the beginning of Tabulate onboarding. A founder who enters their cap table here has done ~60% of the work of onboarding — so the CTA becomes **"Import this into Tabulate"** (one click) instead of **"Request a Demo"** (a sales call). Materially better funnel than the current tools have.

---

## 6. Build scope for v1 — deliberately tiny

- 8 multiple-choice questions
- A rules table: answer → flag → severity, weeks, copy, CTA
- One results page
- **No backend. No account. No upload. No AI. No PDF parsing.** Static page + JS.

Ships in days, not weeks. Everything else is v2.

**Explicitly out of scope for v1:** cap table upload, term sheet parsing, investor matching, benchmarking, PDF export, saved results.

---

## 7. Success metrics

| Metric | Why |
|---|---|
| Completion rate (Q1 → results) | Target >70%. Below that, the questions are too heavy. |
| Median flags per user | If <2, calibration is too soft and the tool is decoration. |
| % clicking any Tabulate CTA | The actual point. |
| % who selected "term sheet in hand" | The highest-intent segment — track separately, they convert differently. |
| Report-email opt-in rate | Capture without a wall. |

---

## 8. Open items before build

1. **Calibrate the delay ranges** against Incentiv's real advisory experience — this is the credibility of the whole tool and it can't be guessed.
2. **Legal/tone review** — everything must read as *"investors typically flag this"*, never *"you are non-compliant."* Evidence, not accusation.
3. **Name:** "Diligence Readiness Check" vs "Cap Table Health Check". The latter is narrower, maps more directly to Tabulate, and `cap table` carries real search volume — but it drops the ROC/FEMA scope.
4. **Q6 phrasing on Press Note 3** — needs careful, non-alarming wording.
