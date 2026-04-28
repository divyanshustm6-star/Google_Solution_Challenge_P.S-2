# ChainGuard - Smart Supply Chain (Google Solution Challenge P.S-2)

ChainGuard is a "GPS for supply chains that reroutes before the roadblock forms." It continuously ingests multi-source transit data, runs ML-based risk scoring on every active shipment, and surfaces dynamic route recommendations before localized bottlenecks cascade into broader delivery failures.

## Local setup
1. `git clone <repo> && cd chainguard`
2. `npm install`
3. `cp .env.example .env`
4. `npx prisma generate`
5. `npx prisma db push`
6. `npx prisma db seed`
7. `npm run dev`
8. Open http://localhost:3000
9. Login with ops@chainguard.demo / demo1234

## Testing the simulation
- Open dashboard — watch shipment pins update every 8 seconds
- Visit /alerts to see auto-generated disruption alerts
- Click any CRITICAL shipment → view Impact Simulator
- Click "View Route Options" → accept or dismiss a recommendation
- Visit /analytics for carrier performance charts

## Deployment to Vercel/Netlify
1. Push repo to GitHub
2. Import project in Vercel/Netlify dashboard
