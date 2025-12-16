import json
import time
import urllib.parse
import urllib.request

cases = [
    "Dreams & Nightmares Case",
    "Clutch Case",
    "Prisma Case",
    "CS20 Case",
    "CS:GO Weapon Case",
    "Chroma 3 Case",
    "Copenhagen 2024 Nuke Souvenir Package",
    "Copenhagen 2024 Overpass Souvenir Package",
    "Danger Zone Case",
    "Fracture Case",
    "Gamma 2 Case",
    "Horizon Case",
    "Kilowatt Case",
    "Operation Breakout Weapon Case",
    "Operation Broken Fang Case",
    "Operation Hydra Case",
    "Operation Phoenix Weapon Case",
    "Operation Riptide Case",
    "Operation Vanguard Weapon Case",
    "Operation Wildfire Case",
    "Paris 2023 Anubis Souvenir Package",
    "Paris 2023 Mirage Souvenir Package",
    "Paris 2023 Vertigo Souvenir Package",
    "Prisma 2 Case",
    "Recoil Case",
    "Revolution Case",
    "Revolver Case",
    "Rio 2022 Ancient Souvenir Package",
    "Rio 2022 Dust II Souvenir Package",
    "Rio 2022 Mirage Souvenir Package",
    "Rio 2022 Overpass Souvenir Package",
    "Shattered Web Case",
    "Snakebite Case",
    "Spectrum 2 Case",
    "Fever Case",
    "Gallery Case",
]


def get_item_id(item_name: str, app_id: int = 730) -> dict | None:
    encoded_name = urllib.parse.quote(item_name)

    url = f"https://steamcommunity.com/market/priceoverview/?appid={app_id}&currency=1&market_hash_name={encoded_name}"

    try:
        headers = {
            "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"
        }
        req = urllib.request.Request(url, headers=headers)

        with urllib.request.urlopen(req, timeout=10) as response:
            data = json.loads(response.read().decode())
            if data.get("success"):
                return {
                    "name": item_name,
                    "lowest_price": data.get("lowest_price", "N/A"),
                    "median_price": data.get("median_price", "N/A"),
                    "volume": data.get("volume", "N/A"),
                }
    except Exception as e:
        print(f"Error fetching data for '{item_name}': {e}")

    return None


def main():
    print("Fetching item IDs for CS:GO cases...")
    print("=" * 80)

    results = []

    for i, case_name in enumerate(cases, 1):
        print(f"\n[{i}/{len(cases)}] Processing: {case_name}")

        price_info = get_item_id(case_name)

        result = {"name": case_name, "price_info": price_info}
        results.append(result)

        if price_info:
            print(f"  ✓ Lowest price: {price_info.get('lowest_price', 'N/A')}")
            print(f"  ✓ Median price: {price_info.get('median_price', 'N/A')}")
        else:
            print("  ✗ Could not retrieve price info")

        if i < len(cases):
            time.sleep(2)

    output_file = "item_ids.json"
    with open(output_file, "w", encoding="utf-8") as f:
        json.dump(results, f, indent=2, ensure_ascii=False)

    print("\n" + "=" * 80)
    print(f"\nResults saved to {output_file}")

    print("\nSummary:")
    print(f"Total items: {len(results)}")
    print(f"Successfully retrieved prices: {sum(1 for r in results if r['price_info'] is not None)}")
    print(f"Failed to retrieve prices: {sum(1 for r in results if r['price_info'] is None)}")


if __name__ == "__main__":
    main()
