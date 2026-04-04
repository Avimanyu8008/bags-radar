export async function GET() {
  try {
    const res = await fetch("https://api.bags.fm/v1/market", {
      cache: "no-store"
    });

    if (!res.ok) {
      throw new Error("API failed");
    }

    const data = (await res.json()) as {
      price?: number;
      volume24h?: number;
      change24h?: number;
    };

    return Response.json({
      price: data?.price ?? 0.0012,
      volume: data?.volume24h ?? 12000,
      change: data?.change24h ?? 2.5
    });
  } catch {
    return Response.json({
      price: 0.0012,
      volume: 12000,
      change: 2.5
    });
  }
}
