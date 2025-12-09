"use client"

import { useState } from "react"
import { ArrowUpDown } from "lucide-react"

export type ProcurementItem = {
  Product: string
  Current_FOB: string
  Pack_Size: string
  Origin: string
  Current_Landed_Cost: number
  Weekly_Vol: number
  Potential_Savings: number
}

interface ProcurementDashboardProps {
  items: ProcurementItem[]
}

export function ProcurementDashboard({ items }: ProcurementDashboardProps) {
  const [sortConfig, setSortConfig] = useState<{ key: keyof ProcurementItem; direction: 'asc' | 'desc' } | null>({ key: 'Potential_Savings', direction: 'desc' })

  const sortedItems = [...items].sort((a, b) => {
    if (!sortConfig) return 0

    // Always sort numbers correctly
    const aValue = a[sortConfig.key]
    const bValue = b[sortConfig.key]

    if (aValue < bValue) return sortConfig.direction === 'asc' ? -1 : 1
    if (aValue > bValue) return sortConfig.direction === 'asc' ? 1 : -1
    return 0
  })

  const requestSort = (key: keyof ProcurementItem) => {
    let direction: 'asc' | 'desc' = 'asc';
    if (sortConfig && sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  return (
    <div className="w-full space-y-4">
      <div className="rounded-md border border-border bg-card">
        <div className="relative w-full overflow-auto">
          <table className="w-full caption-bottom text-sm text-left">
            <thead className="[&_tr]:border-b bg-muted/50">
              <tr className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted">
                <th className="h-12 px-4 align-middle font-medium text-muted-foreground w-[300px]">Product</th>
                <th className="h-12 px-4 align-middle font-medium text-muted-foreground">Origin</th>
                <th className="h-12 px-4 align-middle font-medium text-muted-foreground">Pack Size</th>
                <th className="h-12 px-4 align-middle font-medium text-muted-foreground text-right cursor-pointer hover:text-foreground" onClick={() => requestSort('Weekly_Vol')}>
                  Weekly Vol
                   {sortConfig?.key === 'Weekly_Vol' && <ArrowUpDown className="ml-2 h-4 w-4 inline" />}
                </th>
                <th className="h-12 px-4 align-middle font-medium text-muted-foreground text-right cursor-pointer hover:text-foreground" onClick={() => requestSort('Current_Landed_Cost')}>
                   Cost (Est)
                   {sortConfig?.key === 'Current_Landed_Cost' && <ArrowUpDown className="ml-2 h-4 w-4 inline" />}
                </th>
                <th className="h-12 px-4 align-middle font-medium text-muted-foreground text-right cursor-pointer hover:text-foreground" onClick={() => requestSort('Potential_Savings')}>
                   Delta Score
                   {sortConfig?.key === 'Potential_Savings' && <ArrowUpDown className="ml-2 h-4 w-4 inline" />}
                </th>
              </tr>
            </thead>
            <tbody className="[&_tr:last-child]:border-0">
              {sortedItems.map((item, index) => (
                <tr key={index} className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted">
                  <td className="p-4 align-middle font-medium">{item.Product}</td>
                  <td className="p-4 align-middle">{item.Origin}</td>
                  <td className="p-4 align-middle">{item.Pack_Size}</td>
                  <td className="p-4 align-middle text-right">{item.Weekly_Vol.toLocaleString()}</td>
                  <td className="p-4 align-middle text-right">${item.Current_Landed_Cost.toFixed(2)}</td>
                  <td className="p-4 align-middle text-right font-bold text-green-600">
                    ${Math.round(item.Potential_Savings).toLocaleString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      <div className="text-xs text-muted-foreground">
        * Delta Score calculated assuming 30% savings on Annual Spend (Volume * Cost * 52)
      </div>
    </div>
  )
}
