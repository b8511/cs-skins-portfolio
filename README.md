# cs-skins-portfolio
The end goal is to track the value of CS 2 assets.

## Scripts

### get_item_ids.py

A Python script to fetch CS:GO/CS2 case item IDs from the Steam Community Market.

**Usage:**
```bash
python get_item_ids.py
```

**What it does:**
- Fetches item nameids for a predefined list of CS:GO cases
- Retrieves price information (lowest price, median price, volume)
- Saves results to `item_ids.json`
- Displays results in console and CSV format

**Output:**
- `item_ids.json`: Complete results including nameids and price information
- Console output: Progress updates and formatted results
- See `item_ids_example.json` for expected output format

**Requirements:**
- Python 3.6+
- Internet connection
- No external dependencies (uses Python standard library only)

**Note:** The script includes rate limiting (2 seconds between requests) to be respectful to Steam's servers.
