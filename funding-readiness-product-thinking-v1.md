# Funding Readiness Score — Product Thinking (v1)
*Brainstorm, no code. Sept 2026.*

---

## 1. The reframe: why almost every "funding readiness" tool is useless

There are dozens of these already (Pitch Global, FundTQ, a dozen Gumroad checklists). They all do the same thing: 40 questions → weighted average → "You're 72% ready!" → generic checklist. They fail for four structural reasons, and each failure is an opportunity.

**(a) Fundability is not a property of the startup. It's a property of the startup–investor pair.**
The same company is a hard no for Accel and a hard yes for a ₹2 Cr micro-VC or an angel syndicate. A score computed without a counterparty in mind is arithmetic, not judgement. The real question is not *"can I get funded?"* — it's ***"who would fund me, at what price, and what specifically stops that person from saying yes?"***

**(b) It's a conjunction, not a sum.**
Weighted averages let a great market paper over a broken cap table. Real investor decisions are closer to weakest-link logic with hard knockouts. A founder with 32% equity post-seed is unfundable no matter how good the TAM slide is. **Score should be bottleneck-driven, not additive.**

**(c) Inputs are adversarially unreliable.**
Founders are optimists — it's a job requirement. Self-reported TAM, pipeline, and "we're growing 30% MoM" are close to noise. Any tool that trusts a form is measuring founder confidence, not fundability.

**(d) The binary framing is wrong.**
Almost anyone can raise *something* — angels, revenue-based finance, SISFS grants, a state scheme. The useful questions are: which capital type, at what stage, at what dilution, and how many months will it take.

> **The wedge:** nobody in the ecosystem tells founders "no" clearly and early. Investors ghost. Accelerators upsell. Advisors bill by the hour. A tool whose defining feature is *calibrated honesty* — including telling ~40% of users "you are not institutionally fundable, stop burning six months, here is the actual path" — is differentiated, memorable, and shareable. The score is the hook; the honesty is the product.

---

## 2. Architecture: four layers, in strict order

### Layer 0 — Knockout gates (binary, run before any scoring)

These are not scores. They are "nothing else matters until this is fixed." Getting one wrong costs a founder 6 months.

| Gate | Failure condition | Fix horizon |
|---|---|---|
| **Cap table** | Founders hold <50–60% collectively pre-seed; a dead/inactive co-founder with unvested-but-issued equity; advisors on 5–10%; an early investor with >20–25%; no ESOP pool carved | Months, legally painful |
| **Entity structure** | LLP instead of Pvt Ltd; targeting US funds with no flip path; flip now tax-prohibitive; reverse-flip pressure | Months |
| **FEMA / Press Note 3** | Capital traced to a land-bordering country → requires government approval | Often fatal to that source |
| **Sector licensing** | Fintech without NBFC / PA-PG / AA licence; healthtech touching PHI without DPDP compliance; regulated gaming | Quarters |
| **Founder availability** | Still employed full-time; part-time co-founder; no vesting agreements | Weeks (but must be real) |
| **IP ownership** | Code written on an employer's time/hardware; unassigned contractor IP; moonlighting clause exposure | Weeks–months |
| **VC math** | Honest TAM can't support a ₹1,000 Cr+ outcome | Not fixable — it's a pivot |

Failing any gate should short-circuit the report. Do not hand someone a "68/100" when their cap table is unfundable.

### Layer 1 — Stage detection (and mis-staging is the point)

Weights are **stage-dependent**, and this is what every generic rubric gets wrong:

| Dimension | Pre-seed | Seed | Series A | Series B |
|---|---|---|---|---|
| Team | 50% | 30% | 20% | 15% |
| Market | 25% | 25% | 20% | 15% |
| Insight / wedge | 15% | 10% | — | — |
| Traction | 10% | 30% | 45% | 35% |
| Product | — | 5% | — | — |
| Unit economics / efficiency | — | — | 15% | 35% |

**The killer feature hiding here:** a large share of founders self-diagnose the wrong stage. They believe they're raising a Series A; their metrics read as seed. Mis-staging is a top-3 cause of failed raises — you get judged against a bar you were never near.

So the tool should say: *"You told us Series A. Your evidence reads as late seed. Against seed comparables you're 61st percentile; against Series A you're 12th. Raise the seed extension."*

Related India reality check: **the median Indian company raising seed in 2026 was already ~3 years old.** Seed is not day-zero capital any more. Founders anchored on 2021 norms are systematically mis-staged.

### Layer 2 — Evidence tiers (the honesty mechanism)

Weight inputs by how verifiable they are:

- **Tier A — hard:** MCA/ROC filings (incorporation, directors, charges, PAS-3/SH-7 for prior rounds), GST returns, bank/Razorpay/Stripe revenue, app-store rank, DPIIT recognition, LinkedIn work history, Tracxn/Crunchbase prior rounds.
- **Tier B — semi:** named customer logos, signed pilots/LOIs, patents filed, web traffic.
- **Tier C — self-reported:** TAM, pipeline, growth claims, "a fund is interested."

> **Design rule: cap the score by evidence quality.** "Unverified inputs — score capped at 60. Connect GST or your payment gateway to unlock your real score." This makes the tool honest, kills gaming, and creates a natural data moat plus an upgrade path.

Also run **consistency checks** as a fraud/optimism detector: ₹5 Cr claimed ARR + 3 employees + no GST filings = flag. Claimed 30% MoM growth + flat web traffic = flag. The inconsistencies themselves are a diagnostic output.

### Layer 3 — India-specific overlay (this is the moat if the audience is Indian founders)

Almost no existing tool models any of this:

- **DPIIT recognition** → gates 80-IAC (3 tax-free years out of 10; startups incorporated before Apr 2030), and much else.
- **Angel tax** — Sec 56(2)(viib) was abolished in Budget 2024, effective FY 2025-26. Historic rounds may still carry exposure; Rule 11UA valuation discipline still matters.
- **Flip / reverse-flip decision** — Delaware or Singapore, cost, ODI/FEMA mechanics, and the 2023–26 reverse-flip wave (Groww, PhonePe, Razorpay, Pine Labs) driven by Indian IPO markets. This is a high-stakes, low-information decision for most founders.
- **Non-dilutive capital most founders don't know exists:** SISFS (₹20L PoC grant / up to ₹50L convertible for commercialisation), SIDBI Fund of Funds, BIRAC BIG (biotech), NIDHI-PRAYAS, state schemes (Karnataka Elevate, Kerala KSUM, T-Hub, Gujarat). **"You're not VC-fundable, but you qualify for four grants — here they are" is a genuinely valuable verdict that nobody ships.**
- **Base-rate reality:** ~890 seed-to-Series-B deals in India Jan–Aug 2026, ₹46,013 Cr total. Median seed ₹8.0 Cr (IQR ₹2.4–19.0 Cr), Series A ₹50.8 Cr, Series B ₹123.8 Cr. That's roughly 500-odd seed cheques a year against tens of thousands of startups. Most founders have no idea how narrow the funnel is.
- **Sector heat map, refreshed quarterly:** Consumer & Retail 182 deals, Enterprise Tech/SaaS 146 (51% AI-based), Fintech 117, Healthtech 103, Logistics 97, Foodtech 88, Agritech 72. Capital is also brutally concentrated — three mega-deals took 63% of enterprise tech capital.

---

## 3. What the founder actually receives

Not a number and a checklist. Five things:

**1. The Verdict — one sentence, a category, not a percentage.**
- `VC-fundable now` — go raise
- `VC-fundable in ~2 quarters` — with the specific gate named
- `Angel / micro-VC fundable, not institutional` — retarget, don't grind
- `Not equity-fundable — grant / revenue-finance / bootstrap path`
- `Structurally blocked` — cap table or legal first, nothing else counts

**2. The Blocker Stack** — ranked, each tagged *fixable in weeks / quarters / not fixable*. Founders desperately need the distinction between "your deck is weak" (a week) and "your market is too small" (a pivot).

**3. Investor Match** — not 50 logos. *"Given your stage, sector, cheque size, city and traction, these 12 funds have actually written this cheque in the last 12 months"* — plus, for each, **the specific reason they'd probably pass.** That last part is what a good angel does for free and nobody has scaled.

**4. Comparable positioning** — *"Companies that raised seed in Indian fintech in the last 12 months had median ARR ₹X, team of Y, age Z. You are here."* Percentile against real funded companies is far more persuasive than an abstract score.

**5. A 90-day plan** — three actions, each tied to a named blocker, each with a measurable target.

---

## 4. What kind of model should produce the score?

| Option | Pros | Cons |
|---|---|---|
| **A. Weighted rubric (0–100)** | Trivial, transparent | Arbitrary weights, gameable, hides bottlenecks |
| **B. Comparable percentile** | Defensible, concrete, persuasive | Needs a real deal dataset |
| **C. Predictive probability** | Most valuable if true | Needs outcome labels — see §5 |
| **D. Bottleneck / knockout model** | Matches how investors actually decide | Feels harsh, needs careful UX |

**Recommendation: D for the verdict, B for credibility, and explicitly *not* C until the data exists.** Publishing a fake "23% probability of funding" destroys trust the first time it's wrong. Percentiles against real deals are honest and land harder anyway.

---

## 5. The data problem — name it out loud

**Survivorship bias is the central technical risk.** Tracxn, Crunchbase, Entrackr and Inc42 tell you everything about companies that *raised*. They tell you almost nothing about the far larger population that tried and failed. Any model trained only on funded companies learns "what funded companies look like," not "what separates funded from unfunded" — and those are different questions.

Two consequences:

1. **Year 1 must be rubric + comparables, honestly labelled as such.** No probability claims.
2. **The tool itself is the instrument that fixes this.** Every founder who takes the assessment and later reports the outcome ("raised / didn't / raised from whom / how long") is one labelled row. Ask at 3, 6 and 9 months. After ~1,000 completions with follow-up, a genuinely predictive model becomes possible — and it would be proprietary and defensible in a way the rubric never is.

That flywheel — *free score → labelled outcomes → real model → better score* — is the actual long-term asset. Everything else is copyable in a weekend.

---

## 6. Features worth building that nobody else has

- **Deck-in, score-out.** Most founders already have a deck. Parse it and score it — and flag what's *missing*, because omissions are diagnostic (no retention slide ≈ bad retention).
- **The objection simulator.** Skip the score entirely for a moment: generate the five questions a partner will ask in the first meeting that you currently cannot answer. Viscerally useful, instantly demonstrates expertise.
- **Cap table stress test.** Model dilution across the next two rounds and show founders where they land. Most Indian founders have never run this and are genuinely shocked.
- **Runway-to-readiness clock.** *"You have 7 months of runway. A round takes ~5 months to close, and the median seed→Series A gap is now ~774 days. You must start in 8 weeks. Here's what's achievable in 8 weeks — and what isn't."* Time is the founder's actual binding constraint and no tool models it.
- **The anti-recommendation.** Sometimes the right answer is *"₹4 Cr revenue, 20% margins, growing 40% — you'd be better off not raising."* Almost nobody says this, which is exactly why saying it builds trust.

---

## 7. Failure modes to design against

1. **Gaming.** Once the rubric is known, founders optimise for it. Mitigate with verifiable-input weighting, unpublished exact weights, and consistency cross-checks.
2. **Score inflation.** If the median user scores 72, the tool is decoration. Calibrate the distribution against the real base rate — the median result should be uncomfortable.
3. **Over-harshness → no virality.** Balance is: hard verdict, generous and specific path. "You're not ready, and here's the shortest route" gets shared. "You suck" gets closed.
4. **Barnum effect.** Generic feedback that feels personal. Rule: every output line must cite a specific input the founder gave.
5. **Tone / liability.** Never "you will not get funded." Always "on current evidence, funds matching your profile have not written this cheque." Evidence, not prophecy.
6. **Form fatigue.** A 60-question form completes at ~10%. Ship a 2-minute, 10-question version for a directional verdict, then deepen progressively — score confidence rises as they give more.
7. **Conflict of interest.** If the same operation scores founders and sells deal flow to investors, that must be disclosed and opt-in, or the honesty positioning collapses.

---

## 8. MVP and — importantly — the validation test

**MVP:** 12–15 questions, 3 minutes. Knockout gates + stage-mismatch detection + bottleneck verdict. Comparables from a hand-built set of 300–500 recent Indian deals. Output: verdict category, top 3 blockers, 10 matched investors, 90-day plan.

**Define the validation test before building anything:** run the rubric retrospectively on 30 companies that *did* raise and 30 that visibly tried and didn't. If it can't separate them, the rubric is wrong and no amount of UI fixes it. This is a one-week exercise and it should gate the build.

---

## 9. Open decisions

1. **Audience** — Indian founders only (deep, defensible, matches the regulatory moat) or global (bigger, but the India layer is the differentiator)?
2. **Stage focus** — pre-seed/seed is the biggest, most confused, least-served group; Series A founders have more money but need less help.
3. **Business model** — free lead magnet, paid report, or front door to a paid readiness service?
4. **Score philosophy** — does the tool tell people "no"? This is the single biggest fork. Kind-and-generic is a commodity; harsh-and-specific is a brand.
5. **Investor-match data** — build from existing funding-news pipelines, or licence?

---
---

# Part 2 — Reframed for incentiv.finance/tools/

*Context added: Incentiv is India private-markets infrastructure — Tabulate (cap table/ESOP), Folio (fund ops), Transact (secondaries/buybacks), Advisory (ESOP design, valuations, compliance). 200+ companies, ₹3,000+ Cr. Existing free tools: ESOP Tax Calculator (live), Funding Round Simulator (live), Valuation Calculator (soon). All free, no signup. CTA: Request a Demo.*

## 10. The brand mismatch, stated plainly

The three tools already live are **calculators**: deterministic, precise, defensible. You type numbers, you get an answer that is *correct*. Incentiv's entire authority rests on regulatory and structural precision — SEBI, FEMA, MCA, ROFR, Rule 11UA.

A generic "funding readiness score" is a **taste tool**. It asks Incentiv to opine on team quality, market size and traction — where Incentiv has no data advantage, where the answer can't be verified, and where being wrong is cheap for a blog but expensive for infrastructure trusted by 200+ companies *and the funds on the other side of the table*. There is also a live conflict: Folio serves funds. A tool that publicly grades founders on "fundability" sits badly next to that.

**So: keep the funnel idea, change the object being scored.**

## 11. The move — score diligence readiness, not fundability

Narrow to the part Incentiv can be the definitive authority on. It happens to also be the part with the highest conversion.

**"Will you survive investor due diligence?"** — scored on what actually shows up in a data room and delays or kills rounds:

| Check | What breaks | Incentiv product |
|---|---|---|
| Cap table integrity | Founder %, unvested blocks, ghost shareholders, reconciliation vs MCA | Tabulate |
| Instrument stack | SAFEs / CCDs / CCPS stacked without modelled conversion | Tabulate + Funding Round Simulator |
| ESOP pool | Exists? Right-sized for stage? Granted vs allocated? Vesting papered? | Tabulate + Advisory |
| Corporate hygiene | ROC filings current, PAS-3/SH-7, board resolutions, share certificates, statutory registers | Advisory |
| Valuation defensibility | Rule 11UA, merchant banker report, prior-round consistency | Valuation Calculator + Advisory |
| FEMA / PN3 / FDI | Land-border capital, FC-GPR filings, ODI if flipped | Advisory |
| Founder vesting + IP | Unvested founders, unassigned IP, employer overhang | Advisory |
| Secondary / ROFR readiness | ROFR waivers, existing SHA constraints | Transact |
| Data room completeness | What's missing before a partner asks | Demo |

Every one of these is **factual, verifiable, and something Incentiv sells the fix for.** None requires judging whether a business is good.

**Why this converts better:**
- Zero brand risk — you're not telling a founder their startup is weak, you're telling them their paperwork will fail.
- Each failed check maps to a specific product. The CTA writes itself.
- It fires at the highest-intent moment in a founder's entire lifecycle: term sheet signed, diligence starting, weeks to fix things.
- Nobody in India has it. Qapita and Hissa have blog posts and product pages, not diagnostics.

## 12. Two structural ideas that make it much stronger

**(a) Score in weeks-of-delay, not points.**
"You scored 68/100" motivates nobody. **"3 issues will surface in your data room. One will delay your close by 4–6 weeks."** Founders mid-raise care about closing date, not a number. This is the single highest-leverage design decision in the tool.

**(b) The assessment is a soft Tabulate trial.**
If the founder enters their cap table to get the score, they have already done ~60% of Tabulate onboarding. The CTA stops being "Request a Demo" (high friction, sales call) and becomes **"Import this into Tabulate"** (one click, near-zero friction). That is a fundamentally better funnel than what the current tools have.

## 13. Make the tools section a system, not three calculators

Today the page is three disconnected calculators. The readiness check should be the **hub** that routes to them:

> Diagnostic → your gaps → Gap 1 *(dilution unclear)* → Funding Round Simulator · Gap 2 *(ESOP exercise tax)* → ESOP Tax Calculator · Gap 3 *(valuation undefended)* → Valuation Calculator · Gap 4 *(FEMA filing)* → Advisory

This raises the value of the three tools already built and gives the page a reason to exist as a set.

## 14. Practical constraints for this placement

- **Respect "free, no signup."** Don't gate the score. Optional "email me the PDF report" is capture without a wall — consistent with the existing pattern.
- **Input burden must match the page.** The existing tools take ~1 minute. A 40-question assessment breaks the pattern hard. Target ≤12 questions / 3 minutes, or derive most of it from structured cap-table entry.
- **SEO reality:** "funding readiness" has thin Indian search volume. The high-intent queries are `esop tax calculator india`, `cap table calculator`, `safe note india`, `startup valuation calculator`, `esop pool size`, `angel tax`. So this is a **shareability + intent** play, not an SEO play — and it should be *named* for what people search (e.g. "Due Diligence Readiness Check"), not a coined term.
- Self-contained, fast, mobile, embeddable in the existing page shell.

## 15. The alternative worth considering: Term Sheet Decoder

Possibly a stronger tool than the readiness score:

> Paste or upload a term sheet → plain-English translation + flagged non-standard terms (liquidation preference and participation, anti-dilution ratchet, ROFR/co-sale, drag-along, board composition, protective provisions, exit-preference stacking).

- Extremely high intent — you only look at this with a live term sheet in hand.
- Highly shareable; founders forward it to each other.
- Perfectly on-brand: private markets, instruments, structure.
- Sits exactly one step before the need for Tabulate.
- Genuinely hard to build well, which is a moat, not a problem.

**Open question for this round: readiness check, term sheet decoder, or readiness check *with* the decoder as the follow-up tool?**
