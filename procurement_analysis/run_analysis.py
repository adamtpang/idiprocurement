import pandas as pd
import numpy as np
import os
import warnings

warnings.filterwarnings("ignore")

# Configuration
FILE_PATH = 'idi sheet uncle charles procurement - main.csv'
TARGET_KEYWORDS = ['BANANA', 'APPLE', 'CHICKEN', 'BEEF', 'ONION', 'RICE', 'POTATO', 'GARLIC']

def load_data():
    if not os.path.exists(FILE_PATH):
        raise FileNotFoundError(f"File not found: {FILE_PATH}")

    print("Loading data...")
    # Skip the first 3 metadata rows. Line 4 (index 3) is the header "ITEM DESCRIPTION"
    try:
        # Try modern pandas (1.3+)
        df = pd.read_csv(FILE_PATH, sep='\t', header=0, skiprows=3, on_bad_lines='skip')
    except TypeError:
        # Fallback for older pandas
        df = pd.read_csv(FILE_PATH, sep='\t', header=0, skiprows=3, error_bad_lines=False)
    except Exception as e:
        print(f"Standard load failed: {e}")
        # Last resort: engine='python' is more tolerant
        df = pd.read_csv(FILE_PATH, sep='\t', header=0, skiprows=3, engine='python')

    # Normalize columns: The file starts with a tab, so Col 0 is likely empty/Unnamed.
    # Col 1 should be 'ITEM DESCRIPTION'
    print(f"Columns found: {df.columns.tolist()[:5]} ...")
    return df

def generate_optimization_targets(df):
    print("\n--- GENERATING OPTIMIZATION TARGETS ---")
    # Based on map_columns.py analysis:
    # 1: Product ('ITEM DESCRIPTION')
    # 13: FOB ('FOB')
    # 2: Pack ('-47512.8' / Grade) - using this as proxy for Pack/Size
    # 68: Landed Cost ('Unnamed: 68') - matches FOB value formatted
    # 66: Weekly Vol ('TTL')
    # 47: Origin ('ORIGIN OF ITEM')

    try:
        pattern = '|'.join(TARGET_KEYWORDS)
        targets = df[df.iloc[:, 1].astype(str).str.contains(pattern, case=False, na=False)].copy()

        # Optimization Targets
        # Cols: Desc(1), FOB(13), Pack(2), EstLanded(68)
        targets = targets.iloc[:, [1, 13, 2, 68]]
        targets.columns = ['Description', 'FOB_Price', 'Pack_Size', 'Est_Landed_Cost']
        targets = targets.dropna(subset=['Description'])
        print(targets.head(5))
        targets.to_csv('idi_optimization_targets.csv', index=False)
        print("Saved 'idi_optimization_targets.csv'")
    except Exception as e:
        print(f"Error generating optimization targets: {e}")

def generate_war_room_dashboard(df):
    print("\n--- GENERATING WAR ROOM DASHBOARD ---")
    # Columns: 1=Product, 13=FOB, 2=Pack, 47=Origin, 68=Landed, 66=Weekly_Vol
    try:
        dashboard = df.iloc[:, [1, 13, 2, 47, 68, 66]].copy()
    except IndexError as e:
        print(f"Error accessing columns: {e}. Shape: {df.shape}")
        return

    dashboard.columns = ['Product', 'Current_FOB', 'Pack_Size', 'Origin', 'Current_Landed_Cost', 'Weekly_Vol']

    pattern = '|'.join(TARGET_KEYWORDS)
    dashboard = dashboard[dashboard['Product'].astype(str).str.contains(pattern, case=False, na=False)]

    dashboard['Target_Supplier'] = ''
    dashboard['Target_Price_Quote'] = ''
    dashboard['Potential_Savings'] = ''
    dashboard['Status'] = 'Needs Quote'

    dashboard = dashboard.dropna(subset=['Product'])

    print(dashboard.head(5))
    dashboard.to_csv('idi_procurement_war_room.csv', index=False)
    print("Saved 'idi_procurement_war_room.csv'")

def generate_arbitrage_targets(df):
    print("\n--- GENERATING ARBITRAGE TARGETS ---")
    try:
        dashboard = df.iloc[:, [1, 13, 2, 47, 68, 66]].copy()
    except IndexError:
        return

    dashboard.columns = ['Product', 'FOB_Price', 'Pack_Size', 'Origin', 'Landed_Cost_Est', 'Weekly_Vol']

    pattern = '|'.join(TARGET_KEYWORDS)
    targets = dashboard[dashboard['Product'].astype(str).str.contains(pattern, case=False, na=False)].copy()
    targets = targets.dropna(subset=['Product'])

    # Clean numeric
    for col in ['Landed_Cost_Est', 'Weekly_Vol']:
        targets[col] = pd.to_numeric(targets[col].astype(str).str.replace('$', '').str.replace(',', ''), errors='coerce')

    targets['Est_Annual_Spend'] = targets['Landed_Cost_Est'] * targets['Weekly_Vol'] * 52
    targets['Target_Savings_30pct'] = targets['Est_Annual_Spend'] * 0.30

    targets = targets.sort_values(by='Est_Annual_Spend', ascending=False)

    print(targets.head(5)[['Product', 'Est_Annual_Spend', 'Target_Savings_30pct']])
    targets.to_csv('idi_arbitrage_targets.csv', index=False)
    print("Saved 'idi_arbitrage_targets.csv'")

def run_project_orchard(df):
    print("\n--- PROJECT ORCHARD (BANANA) ANALYSIS ---")
    bananas = df[df.iloc[:, 1].astype(str).str.contains("BANANA", case=False, na=False)].copy()

    if bananas.empty:
        print("No Bananas found in data.")
        return

    try:
        bananas = bananas.iloc[:, [1, 13, 2, 47, 68, 66]]
        bananas.columns = ['Product', 'Current_FOB', 'Pack_Size', 'Origin', 'Current_Landed_Cost', 'Weekly_Vol']

        # Scenario
        estimated_weekly_vol = 200
        # Clean cost
        current_cost_val = bananas.iloc[0]['Current_Landed_Cost']

        # Handle current_cost_val being a string, float, or nan
        try:
            if pd.isna(current_cost_val):
                current_cost = 40.00
            else:
                current_cost_str = str(current_cost_val).replace('$', '').replace(',', '')
                current_cost = float(current_cost_str)
                if np.isnan(current_cost):
                    current_cost = 40.00
        except ValueError:
            current_cost = 40.00 # fallback

        target_cost = 25.00
        annual_savings = (current_cost - target_cost) * estimated_weekly_vol * 52

        print(f"Projected Annual Savings: ${annual_savings:,.2f}")
        print(f"Fee (20%): ${annual_savings * 0.20:,.2f}")

    except Exception as e:
        print(f"Error in Project Orchard: {e}")

def generate_mvp_dashboard(df):
    print("\n--- GENERATING MVP DASHBOARD ---")
    # Same logic as War Room mostly but sorted
    try:
        dashboard = df.iloc[:, [1, 13, 2, 47, 68, 66]].copy()
    except IndexError:
        return

    dashboard.columns = ['Product', 'Current_FOB', 'Pack_Size', 'Origin', 'Current_Landed_Cost', 'Weekly_Vol']

    pattern = '|'.join(TARGET_KEYWORDS)
    dashboard = dashboard[dashboard['Product'].astype(str).str.contains(pattern, case=False, na=False)]

    for col in ['Current_FOB', 'Current_Landed_Cost', 'Weekly_Vol']:
        dashboard[col] = pd.to_numeric(dashboard[col].astype(str).str.replace('$', '').str.replace(',', ''), errors='coerce')

    dashboard['Target_Supplier'] = ''
    dashboard['Target_Quote_Price'] = ''
    dashboard['Potential_Savings'] = ''
    dashboard['Status'] = 'Needs Quote'

    dashboard = dashboard.sort_values(by='Weekly_Vol', ascending=False)

    dashboard.to_csv('idi_procurement_mvp.csv', index=False)
    print("Saved 'idi_procurement_mvp.csv'")

if __name__ == "__main__":
    try:
        df = load_data()
        print(f"Loaded data with shape: {df.shape}")

        generate_optimization_targets(df)
        generate_war_room_dashboard(df)
        generate_arbitrage_targets(df)
        run_project_orchard(df)
        generate_mvp_dashboard(df)

        print("\n--- ALL ANALYSES COMPLETE ---")
    except Exception as e:
        print(f"\nCRITICAL ERROR: {e}")
