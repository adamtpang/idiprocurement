import pandas as pd

FILE_PATH = 'idi sheet uncle charles procurement - main.csv'

try:
    # Read with no header to see raw columns
    df = pd.read_csv(FILE_PATH, sep='\t', header=None)
    print(f"Shape: {df.shape}")

    # Print the row that looks like data (e.g. index 6 corresponding to line 7)
    # Line 7 is "APPLE, FUJI 56 CT..."
    print("\n--- ROW 6 (Line 7) Analysis ---")
    row = df.iloc[6]
    for i, val in enumerate(row):
        print(f"Index {i}: {val}")

except Exception as e:
    print(e)
