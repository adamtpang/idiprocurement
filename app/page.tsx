import fs from "fs"
import path from "path"
import { MetricCards } from "@/components/metric-cards"
import { SavingsChart } from "@/components/savings-chart"
import { OpportunityTable, Opportunity } from "@/components/opportunity-table"
import { Header } from "@/components/header"

async function getData() {
  const filePath = path.join(process.cwd(), 'procurement_analysis', 'idi_procurement_mvp.csv')

  if (!fs.existsSync(filePath)) {
    return { items: [], totalSpend: 0, totalSavings: 0, chartData: [] }
  }

  const fileContent = fs.readFileSync(filePath, 'utf-8')
  const rows = fileContent.split('\n').filter(row => row.trim() !== '')

  // Helper to parse CSV lines with quoted fields
  const parseCSVLine = (line: string) => {
    const result = []
    let current = ''
    let inQuote = false

    for (let i = 0; i < line.length; i++) {
      const char = line[i]
      if (char === '"') {
        inQuote = !inQuote
      } else if (char === ',' && !inQuote) {
        result.push(current)
        current = ''
      } else {
        current += char
      }
    }
    result.push(current)

    // Clean up quotes from the values (e.g. "Product Name" -> Product Name)
    return result.map(val => val.trim().replace(/^"|"$/g, ''))
  }

  let totalSpend = 0
  let totalSavings = 0

  const items: Opportunity[] = rows.slice(1).map(row => {
    // robust parse
    const columns = parseCSVLine(row)

    // Map columns:
    // 0: Product
    // 1: Current_FOB
    // 2: Pack_Size
    // 3: Origin
    // 4: Current_Landed_Cost
    // 5: Weekly_Vol

    const product = columns[0]
    const landedCost = parseFloat(columns[4]) || 0
    const weeklyVol = parseFloat(columns[5]) || 0

    const annualSpend = landedCost * weeklyVol * 52

    // Logic: 30% savings target
    const targetPrice = landedCost * 0.7
    const savingsPerCase = landedCost - targetPrice
    const annualSaving = annualSpend * 0.30
    const spreadPercentage = 30.0

    totalSpend += annualSpend
    totalSavings += annualSaving

    return {
      product: product,
      currentSupplier: "GenPro",
      currentPrice: landedCost,
      targetSupplier: "Sumifru Philippines",
      targetPrice: targetPrice,
      savingsPerCase: savingsPerCase,
      annualSavings: annualSaving,
      spreadPercentage: spreadPercentage
    }
  }).filter(item => item.product && item.product !== 'Product' && item.currentPrice > 0) // Filter invalid/zero rows

  // Sort by savings for top chart
  const topItems = [...items].sort((a, b) => b.annualSavings - a.annualSavings).slice(0, 5)

  const chartData = topItems.map(item => ({
    name: item.product.replace('BANANA, ', '').replace('APPLE, ', '').split(' ')[0],
    current: (item.annualSavings / 0.30),
    optimized: (item.annualSavings / 0.30) * 0.7
  }))

  return { items, totalSpend, totalSavings, chartData }
}

export default async function Home() {
  const { items, totalSpend, totalSavings, chartData } = await getData()

  // Progress bar logic (arbitrary score based on savings potential %?)
  // If savings are 30% of spend, score is maybe 45/100 (optimization room remaining?)
  const optimizationScore = 45

  return (
    <div className="min-h-screen bg-gray-50 font-sans text-gray-900 pb-20">
      <div className="bg-white border-b border-gray-200 px-8 py-4 flex items-center justify-between sticky top-0 z-10 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="bg-gray-900 text-white p-1 rounded font-bold text-xs tracking-widest">IDI</div>
          <h1 className="text-lg font-semibold tracking-tight">Procurement Intelligence</h1>
        </div>
        <div className="flex items-center gap-4 text-sm text-gray-500">
          <span>idi_procurement_mvp.csv</span>
          <span className="h-4 w-px bg-gray-200"></span>
          <span>Last updated: just now</span>
        </div>
      </div>

      <main className="max-w-[1600px] mx-auto p-8 space-y-8">
        {/* Metric Cards */}
        <MetricCards
          totalSpend={totalSpend}
          potentialSavings={totalSavings}
          optimizationScore={optimizationScore}
        />

        {/* Visuals & Data Layer */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <OpportunityTable items={items} />
          </div>
          <div>
            <SavingsChart data={chartData} />

            {/* Decorative extra card */}
            <div className="mt-8 rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
              <h3 className="text-sm font-medium text-gray-500 mb-4">Implementation Status</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-900">Supplier Onboarding</span>
                  <span className="text-green-600 font-medium">Complete</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-900">Price Negotiation</span>
                  <span className="text-orange-500 font-medium">In Progress</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-900">Logistics Route</span>
                  <span className="text-gray-400">Pending</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
