# CS2 Portfolio Tracker

A Next.js application for tracking your Counter-Strike 2 case and package investments with real-time Steam Market pricing.

## Features

- 📊 **Portfolio Management**: Add cases/packages with quantities and track total value
- 💰 **Real-time Pricing**: Fetches current prices from Steam Community Market
- 💾 **Persistent Storage**: Portfolio data saved in localStorage
- 🔍 **Search & Filter**: Quickly find specific cases
- 📱 **Responsive Design**: Works on desktop and mobile
- 🎨 **Modern UI**: Built with Tailwind CSS


**Option B: Direct Download**

- Visit: https://nodejs.org/
- Download and install Node.js 20 LTS or higher

### 2. Install Dependencies

```bash
npm install
```

### 3. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### 4. Build for Production

```bash
npm run build
npm start
```

## Project Structure

```
dashboard/
├── src/
│   ├── app/
│   │   ├── api/prices/         # API route for fetching Steam prices
│   │   ├── layout.tsx          # Root layout
│   │   └── page.tsx            # Main portfolio page
│   ├── components/
│   │   ├── CaseCard.tsx        # Individual case display card
│   │   └── PortfolioList.tsx   # Portfolio items list
│   ├── lib/
│   │   ├── steamApi.ts         # Steam API integration
│   │   └── storage.ts          # localStorage utilities
│   └── types/
│       └── index.ts            # TypeScript interfaces
├── public/                     # Static assets
└── package.json
```

## How It Works

### Adding Items to Portfolio

1. Browse the available cases on the main page
2. Set the quantity you want to add
3. Click "Add to Portfolio"
4. Item is added with current median price

### Updating Prices

- Prices are fetched when the app loads
- There's a 2-second delay between requests to respect Steam's rate limits
- Portfolio items automatically update with new prices

### Data Persistence

- Portfolio data is stored in browser's localStorage
- Data persists across browser sessions
- No backend database required

## API Routes

### GET `/api/prices?item=<item_name>`

Fetch price for a single item.

**Response:**

```json
{
  "success": true,
  "lowest_price": "$1.50",
  "median_price": "$1.52",
  "volume": "1,234"
}
```

### POST `/api/prices`

Batch fetch prices for multiple items.

**Request:**

```json
{
  "items": ["Case Name 1", "Case Name 2"]
}
```

## Rate Limiting

Steam Community Market has rate limits. The app includes:

- 2-second delays between requests
- Error handling for 429 (Too Many Requests)
- Graceful fallback for failed requests

## Customization

### Adding More Cases

Edit `src/lib/steamApi.ts` and add case names to the `CSGO_CASES` array:

```typescript
export const CSGO_CASES = [
  "Your New Case Name",
  // ... existing cases
];
```

### Changing Currency

Edit the API call in `src/lib/steamApi.ts`:

```typescript
// Change currency=1 (USD) to another value
// 1=USD, 2=GBP, 3=EUR, etc.
const url = `...&currency=1&...`;
```

## Troubleshooting

### Node Version Error

```
You are using Node.js 18.17.1. For Next.js, Node.js version ">=20.9.0" is required.
```

**Solution**: Upgrade to Node.js 20.9.0 or higher (see Prerequisites).

### Rate Limiting (429 Errors)

If you see 429 errors, Steam is rate limiting your requests:

- Wait a few minutes before refreshing
- The 2-second delay helps prevent this
- Consider reducing the number of cases being fetched

### Port Already in Use

If port 3000 is busy:

```bash
# Use a different port
npm run dev -- -p 3001
```

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
