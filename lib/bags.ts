export interface BagsData {
  price: number;
  volume: number;
  change: number;
}

export async function getBagsData(): Promise<BagsData> {
  try {
    const res = await fetch("/api/bags", {
      cache: "no-store"
    });

    if (!res.ok) {
      throw new Error("failed");
    }

    const data = (await res.json()) as Partial<BagsData>;

    return {
      price: Number(data.price ?? 0.0012),
      volume: Number(data.volume ?? 12000),
      change: Number(data.change ?? 2.5)
    };
  } catch {
    return {
      price: 0.0012,
      volume: 12000,
      change: 2.5
    };
  }
}
