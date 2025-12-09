import pandas as pd

FILE_PATH = 'idi sheet uncle charles procurement - main.csv'

try:
    # Use the same loading logic as the main script
    df = pd.read_csv(FILE_PATH, sep='\t', header=0, skiprows=3, on_bad_lines='skip')

    print(f"Shape: {df.shape}")
    print("\n--- COLUMN MAPPING ---")
    headers = df.columns.tolist()

    # Get the first valid data row (e.g., Apple Fuji)
    # We'll look for the first row where 'ITEM DESCRIPTION' contains "APPLE"
    sample_rows = df[df.iloc[:, 1].astype(str).str.contains("APPLE", case=False, na=False)]

    if not sample_rows.empty:
        row = sample_rows.iloc[0]
        print(f"Sample Row: {row.iloc[1]}") # Print item name

        for i, (header, value) in enumerate(zip(headers, row)):
            print(f"[{i}] {str(header)[:20]}... : {str(value)[:50]}")
    else:
        print("Could not find 'APPLE' row to verify columns.")
        # Print first row anyway
        row = df.iloc[0]
        for i, (header, value) in enumerate(zip(headers, row)):
            print(f"[{i}] {str(header)[:20]}... : {str(value)[:50]}")

except Exception as e:
    print(e)
