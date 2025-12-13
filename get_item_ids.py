#!/usr/bin/env python3
"""
Script to fetch CS:GO/CS2 item IDs from Steam Community Market.

This script takes a list of CS:GO case names and retrieves their item IDs
using the Steam Community Market API.

Usage:
    python get_item_ids.py

The script will:
1. Iterate through the predefined list of CS:GO cases
2. Fetch item information from Steam Community Market API
3. Extract the item nameid (unique identifier for each item)
4. Save results to item_ids.json
5. Display results in console and CSV format

Requirements:
- Python 3.6+
- Internet connection to access Steam Community Market API
- No external dependencies (uses standard library only)

Note: The script includes rate limiting (2 seconds between requests) to be
respectful to Steam's servers. The full run may take 1-2 minutes.
"""

import json
import time
import urllib.request
import urllib.parse
from typing import Dict, List, Optional


def get_item_id(item_name: str, app_id: int = 730) -> Optional[Dict]:
    """
    Fetch item information from Steam Community Market.
    
    Args:
        item_name: The market hash name of the item
        app_id: Steam app ID (730 for CS:GO/CS2)
    
    Returns:
        Dictionary containing item information including item_nameid, or None if not found
    """
    # Encode the item name for URL
    encoded_name = urllib.parse.quote(item_name)
    
    # Steam Community Market API endpoint
    url = f"https://steamcommunity.com/market/priceoverview/?appid={app_id}&currency=1&market_hash_name={encoded_name}"
    
    try:
        # Add headers to mimic a browser request
        headers = {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
        }
        req = urllib.request.Request(url, headers=headers)
        
        with urllib.request.urlopen(req, timeout=10) as response:
            data = json.loads(response.read().decode())
            if data.get('success'):
                return {
                    'name': item_name,
                    'lowest_price': data.get('lowest_price', 'N/A'),
                    'median_price': data.get('median_price', 'N/A'),
                    'volume': data.get('volume', 'N/A')
                }
    except Exception as e:
        print(f"Error fetching data for '{item_name}': {e}")
    
    return None


def get_item_nameid(item_name: str, app_id: int = 730) -> Optional[int]:
    """
    Fetch item nameid from Steam Community Market listing page.
    
    The nameid is embedded in the market listing page HTML/JavaScript.
    
    Args:
        item_name: The market hash name of the item
        app_id: Steam app ID (730 for CS:GO/CS2)
    
    Returns:
        Item nameid as integer, or None if not found
    """
    encoded_name = urllib.parse.quote(item_name)
    url = f"https://steamcommunity.com/market/listings/{app_id}/{encoded_name}"
    
    try:
        headers = {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
        }
        req = urllib.request.Request(url, headers=headers)
        
        with urllib.request.urlopen(req, timeout=10) as response:
            html = response.read().decode('utf-8')
            
            # Search for Market_LoadOrderSpread which contains the nameid
            search_str = 'Market_LoadOrderSpread( '
            idx = html.find(search_str)
            if idx != -1:
                # Extract the nameid (first parameter)
                start = idx + len(search_str)
                end = html.find(' ', start)
                nameid_str = html[start:end].strip()
                try:
                    return int(nameid_str)
                except ValueError:
                    pass
    except Exception as e:
        print(f"Error fetching nameid for '{item_name}': {e}")
    
    return None


def main():
    """Main function to process the list of CS:GO cases."""
    
    # List of CS:GO cases from the problem statement
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
        "Gallary Case"
    ]
    
    print("Fetching item IDs for CS:GO cases...")
    print("=" * 80)
    
    results = []
    
    for i, case_name in enumerate(cases, 1):
        print(f"\n[{i}/{len(cases)}] Processing: {case_name}")
        
        # Get price overview
        price_info = get_item_id(case_name)
        
        # Get nameid
        nameid = get_item_nameid(case_name)
        
        result = {
            'name': case_name,
            'nameid': nameid,
            'price_info': price_info
        }
        results.append(result)
        
        if nameid:
            print(f"  ✓ Item nameid: {nameid}")
        else:
            print(f"  ✗ Could not retrieve nameid")
        
        if price_info:
            print(f"  ✓ Lowest price: {price_info.get('lowest_price', 'N/A')}")
            print(f"  ✓ Median price: {price_info.get('median_price', 'N/A')}")
        
        # Rate limiting - be respectful to Steam's servers
        if i < len(cases):
            time.sleep(2)  # Wait 2 seconds between requests
    
    # Save results to JSON file
    output_file = 'item_ids.json'
    with open(output_file, 'w', encoding='utf-8') as f:
        json.dump(results, f, indent=2, ensure_ascii=False)
    
    print("\n" + "=" * 80)
    print(f"\nResults saved to {output_file}")
    
    # Print summary
    print("\nSummary:")
    print(f"Total items: {len(results)}")
    print(f"Successfully retrieved nameids: {sum(1 for r in results if r['nameid'] is not None)}")
    print(f"Failed to retrieve nameids: {sum(1 for r in results if r['nameid'] is None)}")
    
    # Print simple CSV format
    print("\n" + "=" * 80)
    print("\nCSV Format (name, nameid):")
    print("-" * 80)
    for result in results:
        nameid = result['nameid'] if result['nameid'] else 'N/A'
        print(f'"{result["name"]}",{nameid}')


if __name__ == "__main__":
    main()
