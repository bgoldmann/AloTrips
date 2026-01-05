# AloTrips.me – Product Requirements Document (PRD)

> **Reference:** Expedia-style full-service OTA experience, adapted to a lean, multi-API, cheapest-first + EPC-optimized model.

---

## 1. Product Overview
**Project Name:** AloTrips.me  
**Tagline:** Compare. Book. Travel Cheaper.

AloTrips.me is a full-service online travel platform (Expedia-style) that aggregates multiple travel suppliers/APIs across **Flights, Stays (Hotels), Car Rentals, Packages, Cruises, and Things To Do**, compares options, and highlights the **cheapest valid offer** while using an **EPC-aware “Best Value”** recommendation to maximize revenue responsibly.

---

## 2. Goals & Success Metrics
### 2.1 Goals
- Ship an Expedia-like experience with multi-vertical search tabs and modern filters.
- Aggregate multiple APIs per vertical (where possible) and normalize results.
- Always show **Total Price** and highlight **🔥 Cheapest** and **⭐ Best Value**.
- Start with affiliate/redirect model to avoid payment + licensing overhead.
- Scale SEO with destination and route pages modeled on Expedia’s structure.

### 2.2 KPIs
- Search → outbound click rate
- Conversion rate per provider (by vertical)
- EPC (earnings per click) by provider + by placement
- AOV uplift from upsells (eSIM + Insurance)
- SEO: indexed pages, impressions, clicks, and rankings for destination/route queries

---

## 3. Scope: Services & Verticals (Expedia-style)
### 3.1 Flights
- One-way / Round-trip / Multi-city
- Filters: stops, airlines, time windows, duration, baggage/refund
- Calendar flexible dates (Phase 2+)
- Book: redirect to partner checkout via affiliate deep link
- Normalize: fare + taxes/fees; anti “fake cheap” penalties

### 3.2 Stays (Hotels)
- City/region/property search
- Filters: price, stars, guest rating, refundable, amenities, neighborhoods
- Map view + pins
- Property detail page (SEO + conversion) with reviews & photos (where allowed)
- Book: redirect or API booking (later)

### 3.3 Car Rentals
- Pickup/drop-off locations, dates/times
- Filters: car class, supplier, cancellation, mileage, transmission
- Book via affiliate redirect

### 3.4 Vacation Packages
- Flight + Hotel
- Hotel + Car
- Flight + Hotel + Car
- Package pricing: via partner packaging API if available; otherwise component-sum with “bundle” UX
- Emphasize “Bundle & Save” with clear disclaimers

### 3.5 Cruises
- Browse/search by region, cruise line, port, dates, length
- Itinerary details (ports of call), ship highlights
- Book via cruise affiliate partner redirect

### 3.6 Things To Do (Activities)
- Destination activities, tours, tickets
- Filters: date, duration, category, rating, cancellation
- Book via affiliate redirect

---

## 4. User Experience (Modeled on Expedia)
### 4.1 Global Navigation
- Header with tabs: **Stays | Flights | Cars | Packages | Cruises | Things to do**
- Account menu: Sign in, Trips (Phase 2), Support, Language/Currency

### 4.2 Search Module (Homepage + Persistent)
- Expedia-style search box with tab-specific fields
- Typeahead for airports/cities/hotels
- Date picker: range select
- Travelers selector (adults/children/rooms)
- CTA: **Search**

### 4.3 Results UX
- Toolbar: sort + filters
- Result cards with price, key attributes, provider, badges
- Map toggle for hotels + activities
- Clear total price with fee disclaimer
- Provider-down non-blocking notice

### 4.4 Trust Signals
- Ratings/reviews count (where permitted by supplier)
- Refundable/free cancellation tags
- “Deal” and “Save” labels only when verifiable
- “Prices may change” disclaimer on every results page

---

## 5. SEO (Expedia-inspired structure)
### 5.1 URL Patterns
- Vertical hubs:
  - `/stays`
  - `/flights`
  - `/cars`
  - `/packages`
  - `/cruises`
  - `/things-to-do`

- Destination pages:
  - `/stays/{city}`
  - `/things-to-do/{city}`
  - `/cars/{city}`
  - `/vacation-packages/{destination}`

- Flights:
  - `/flights-to/{destination}`
  - `/flights/{origin}-to-{destination}`

### 5.2 On-page SEO Requirements
- Unique H1 per page (city/route)
- FAQ blocks + FAQ schema for high-volume pages
- Breadcrumbs + Breadcrumb schema
- ItemList schema for listing pages (hotels/activities)
- Auto-generated sitemaps by type (cities/routes/packages)

### 5.3 Internal Linking
- Cross-link verticals per destination:
  - Stays → Things to do → Cars → Packages → Flights
- Popular destinations modules (sitewide)
- Route pages interlink (e.g., “Flights from NYC to Paris”)

---

## 6. Licensing & Compliance (Lean-first)
### 6.1 MVP (affiliate redirect)
- No PCI scope (no card processing)
- No ARC/IATA required (no ticketing)
- Seller-of-travel registration only if required by your target states and operating model

### 6.2 Policies
- TOS, Privacy, Cookie policy
- Affiliate disclosure (“We may earn a commission…”)
- Price accuracy disclaimer + last-updated timestamp

---

## 7. Cheapest APIs Strategy (Multi-API)
### 7.1 Primary “Cheap” stack (recommended)
- **Travelpayouts**: flights + hotels (affiliate)
- **Skyscanner**: flights meta/redirect (if accessible)
- **Expedia Rapid**: hotels depth (if approved)
- **Kiwi Tequila**: flights (low-cost / LCC coverage)

> Exact commercial access varies by partner approval.

---

## 8. Price Comparison Logic
- Normalize currencies
- Compute trustworthy **Total Price**
- Remove invalid/outlier offers
- Rank: **Cheapest first**
- If prices are “close”, optimize by EPC to choose **Best Value**

---

## 9. Upsells (Phase 2): eSIM + Travel Insurance
### 9.1 eSIM
- Show for international destinations
- Recommend plan by trip duration
- Affiliate redirect purchase (provider as merchant of record)

### 9.2 Insurance
- Recommend for international, expensive, or multi-leg trips
- Affiliate redirect purchase (provider as merchant of record)

---

## 10. Upsell Recommendation Logic (Rules)
### 10.1 Signals
- Destination vs home country
- Trip duration
- Device type (eSIM capability when detectable)
- Booking price band, multi-leg complexity

### 10.2 eSIM Rules
- International trip → show eSIM
- 1–3 days: short plan; 4–10: standard; 10+: high-GB/unlimited
- If eSIM unknown: show “Check compatibility”

### 10.3 Insurance Rules
- International / multi-leg / expensive → strong recommend
- 7+ days: emphasize medical coverage
- <7 days: emphasize cancellation/delay

### 10.4 UX Guardrails
- Max one upsell banner per page
- If dismissed, don’t repeat within same session

---

## 11. Affiliate Tracking Parameters (Exact Mapping)
### 11.1 Universal UTMs
- `utm_source=alotrips`
- `utm_medium=affiliate`
- `utm_campaign={product}` (flights|hotels|cars|packages|cruises|activities|esim|insurance)
- `utm_content={placement}` (results_row|top_banner|price_box|confirmation|email)
- `utm_term={route_or_destination}`

### 11.2 First-party IDs
- `at_click_id` (UUID v4)
- `at_session_id`
- `at_user_type` (new|returning)
- `at_device` (ios|android|desktop)

### 11.3 Redirect Template (generic)
```text
https://partner.com/deeplink?
  affiliate_id=ALO123
  &click_id={at_click_id}
  &utm_source=alotrips
  &utm_medium=affiliate
  &utm_campaign=flights
  &utm_content=results_row
  &utm_term=nyc-lax
```

### 11.4 Server-side Attribution
- Store click context by `at_click_id`
- Postback endpoint: `/api/affiliate/postback`
- Reconcile conversions from partner reports/APIs

---

## 12. Cheapest-Price + EPC Decision Engine (Pseudo-code)
### 12.1 Configuration
```pseudo
PRICE_TIE_THRESHOLD_ABSOLUTE = 5.00
PRICE_TIE_THRESHOLD_PERCENT  = 0.01

PROVIDER_TRUST_MULTIPLIER = {
  expedia: 1.00,
  travelpayouts: 0.95,
  skyscanner: 0.92,
  kiwi: 0.90
}

DEFAULT_EPC = {
  flights: 0.12,
  hotels: 0.25,
  esim: 0.35,
  insurance: 0.40
}
```

### 12.2 Normalized Offer Model
```pseudo
Offer {
  provider
  vertical
  base_price
  taxes_fees
  total_price
  baggage_included
  carryon_included
  refundable
  layover_minutes
  epc
  provider_trust
}
```

### 12.3 Total Price Calculation (Anti-Fake-Cheap)
```pseudo
function compute_total_price(o):
  total = o.base_price + o.taxes_fees
  penalty = 0

  if o.baggage_included == unknown: penalty += 0.03
  if o.carryon_included == false: penalty += 0.02
  if o.layover_minutes > 240: penalty += 0.01
  if o.refundable == false: penalty += 0.005

  return total * (1 + penalty)
```

### 12.4 Tie-set Selection
```pseudo
function get_tie_set(offers):
  sort offers by total_price asc
  cheapest = offers[0]
  tie_set = [cheapest]

  for o in offers[1:]:
    if abs(o.total_price - cheapest.total_price) <= 5
       OR (o.total_price / cheapest.total_price) <= 1.01:
      tie_set.append(o)
    else:
      break

  return tie_set
```

### 12.5 Winner Selection (EPC + Trust)
```pseudo
function choose_winner(tie_set):
  best = null
  best_score = -inf

  for o in tie_set:
    score = o.epc * PROVIDER_TRUST_MULTIPLIER[o.provider]
    if score > best_score:
      best = o
      best_score = score

  return best
```

### 12.6 Guardrails
```pseudo
function apply_guardrails(recommended, cheapest):
  if recommended.total_price > cheapest.total_price * 1.03:
    return cheapest
  return recommended
```

### 12.7 Output Tags
```pseudo
cheapest = offers[0]
recommended = apply_guardrails(choose_winner(get_tie_set(offers)), cheapest)

label cheapest as "🔥 Cheapest"
label recommended (if different) as "⭐ Best Value"
```

---

## 13. UI Components Spec (Comparison + Upsells)
Create reusable UI components in `/packages/ui`.

### 13.1 Search Components
- `SearchTabs` (Flights | Stays | Cars | Packages | Cruises | Things to do)
- `FlightSearchForm`
- `HotelSearchForm`
- `CarSearchForm`
- `PackageSearchForm`
- `CruiseSearchForm`
- `ActivitiesSearchForm`

### 13.2 Results Components
- `ResultsToolbar` (Sort + filters)
- `OfferCard` (badges, attributes, price, provider, CTA)
- `PriceBreakdown`
- `CheapestVsBestValueToggle`
- `ResultsSkeleton`
- `EmptyState`
- `ProviderDownNotice`

### 13.3 Upsell Components
- `UpsellBanner` (eSIM | Insurance)
- `UpsellModal` (benefits, CTA)
- `BundleCard` (eSIM + Insurance)

### 13.4 Tracking Hooks
All CTAs call `trackEvent(name, payload)` with:
- `at_click_id`, `at_session_id`, `provider`, `vertical`, `placement`

---

## 14. Cursor Prompts (Generate the Full Project)
### 14.1 Prompt 1 — Repo + Stack
> Create a production-ready monorepo for AloTrips.me: Next.js (App Router) + TypeScript + Tailwind. Add /apps/web, /packages/ui, /packages/shared. ESLint+Prettier, .env.example, dev scripts, README.

### 14.2 Prompt 2 — Search + Results Pages
> Build Expedia-style search tabs and forms for Flights/Stays/Cars/Packages/Cruises/Things to do. Implement results pages with query params, skeleton loaders, filters, sort.

### 14.3 Prompt 3 — Aggregator Layer
> Implement provider adapters (/lib/providers/*) for Travelpayouts + stubs for Skyscanner/Expedia/Kiwi. Normalize offers. Implement decision engine (Section 12). Add caching + unit tests.

### 14.4 Prompt 4 — Affiliate Tracking
> Add click IDs, UTMs, partner subids. Log events. Create /api/affiliate/postback. Build /admin/affiliate metrics dashboard.

### 14.5 Prompt 5 — Upsells
> Implement eSIM + insurance upsells with recommendation rules, banners/modals, tracking events, and partner config with EPC/trust.

### 14.6 Prompt 6 — Deploy Polish
> Add error boundaries, rate limiting, provider timeouts, security headers, robots.txt + sitemap generation, Vercel + Supabase deployment checklist.

---

## 15. Roadmap
### Phase 1 (MVP)
- Stays + Flights fully functional
- Expedia-style UI tabs
- Affiliate redirect booking
- Basic destination SEO pages

### Phase 2
- Cars + Activities + Packages
- Map views
- Upsells (eSIM + insurance)
- EPC learning loop

### Phase 3
- Cruises
- Personalization, saved trips, email journeys
- More SEO coverage (routes, neighborhoods)

---

## 16. Summary
AloTrips.me is an Expedia-inspired, full-service OTA experience delivered via a lean multi-API affiliate model, powered by a cheapest-first + EPC-aware decision engine, with a scalable SEO playbook and monetization through upsells and optimized partner selection.
