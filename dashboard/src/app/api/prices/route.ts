import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;
  const itemName = searchParams.get("item");

  if (!itemName) {
    return NextResponse.json(
      { success: false, error: "Item name required" },
      { status: 400 }
    );
  }

  try {
    const encoded = encodeURIComponent(itemName);
    const url = `https://steamcommunity.com/market/priceoverview/?appid=730&currency=1&market_hash_name=${encoded}`;

    const response = await fetch(url, {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
      },
      next: { revalidate: 3600 }, // Cache for 1 hour
    });

    if (!response.ok) {
      throw new Error(`Steam API returned ${response.status}`);
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error("Error fetching from Steam:", error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const items: string[] = body.items;

    if (!items || !Array.isArray(items)) {
      return NextResponse.json(
        { success: false, error: "Items array required" },
        { status: 400 }
      );
    }

    const results = await Promise.all(
      items.map(async (itemName) => {
        const encoded = encodeURIComponent(itemName);
        const url = `https://steamcommunity.com/market/priceoverview/?appid=730&currency=1&market_hash_name=${encoded}`;

        try {
          const response = await fetch(url, {
            headers: {
              "User-Agent":
                "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
            },
          });

          if (!response.ok) {
            return { name: itemName, success: false };
          }

          const data = await response.json();
          return { name: itemName, ...data };
        } catch {
          return { name: itemName, success: false };
        }
      })
    );

    return NextResponse.json({ results });
  } catch (error) {
    console.error("Error in batch price fetch:", error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
