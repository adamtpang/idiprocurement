"use client"

import { useState } from "react"
import { ArrowUpDown, Mail } from "lucide-react"
import { Button } from "@/components/ui/button"

export type Opportunity = {
    product: string
    currentSupplier: string
    currentPrice: number
    targetSupplier: string
    targetPrice: number
    savingsPerCase: number
    annualSavings: number
    spreadPercentage: number
}

interface OpportunityTableProps {
    items: Opportunity[]
}

export function OpportunityTable({ items }: OpportunityTableProps) {
    const [sortConfig, setSortConfig] = useState<{ key: keyof Opportunity; direction: 'asc' | 'desc' } | null>({ key: 'annualSavings', direction: 'desc' })

    const sortedItems = [...items].sort((a, b) => {
        if (!sortConfig) return 0
        const aValue = a[sortConfig.key]
        const bValue = b[sortConfig.key]
        if (aValue < bValue) return sortConfig.direction === 'asc' ? -1 : 1
        if (aValue > bValue) return sortConfig.direction === 'asc' ? 1 : -1
        return 0
    })

    const requestSort = (key: keyof Opportunity) => {
        let direction: 'asc' | 'desc' = 'asc';
        if (sortConfig && sortConfig.key === key && sortConfig.direction === 'asc') {
            direction = 'desc';
        }
        setSortConfig({ key, direction });
    }

    return (
        <div className="rounded-xl border border-gray-200 bg-white shadow-sm overflow-hidden">
            <div className="p-6 border-b border-gray-100">
                <h3 className="text-lg font-semibold text-gray-900">Live Opportunities</h3>
                <p className="text-sm text-gray-500">Actionable arbitrage targets sorted by value.</p>
            </div>
            <div className="overflow-x-auto">
                <table className="w-full text-sm text-left">
                    <thead className="bg-gray-50 text-gray-500 font-medium">
                        <tr>
                            <th className="px-6 py-4">Product Name</th>
                            <th className="px-6 py-4 text-center cursor-pointer hover:text-gray-900 group" onClick={() => requestSort('spreadPercentage')}>
                                Spread
                                <ArrowUpDown className="ml-1 h-3 w-3 inline opacity-0 group-hover:opacity-100" />
                            </th>
                            <th className="px-6 py-4 text-right cursor-pointer hover:text-gray-900 group" onClick={() => requestSort('currentPrice')}>
                                Current Price
                                <ArrowUpDown className="ml-1 h-3 w-3 inline opacity-0 group-hover:opacity-100" />
                            </th>
                            <th className="px-6 py-4 text-right cursor-pointer hover:text-gray-900 group" onClick={() => requestSort('targetPrice')}>
                                Target Price
                                <ArrowUpDown className="ml-1 h-3 w-3 inline opacity-0 group-hover:opacity-100" />
                            </th>
                            <th className="px-6 py-4 text-center">Supplier Target</th>
                            <th className="px-6 py-4 text-right cursor-pointer hover:text-gray-900 group" onClick={() => requestSort('annualSavings')}>
                                Est. Annual Savings
                                <ArrowUpDown className="ml-1 h-3 w-3 inline opacity-0 group-hover:opacity-100" />
                            </th>
                            <th className="px-6 py-4 text-right">Action</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                        {sortedItems.map((item, index) => (
                            <tr key={index} className="hover:bg-gray-50/50 transition-colors">
                                <td className="px-6 py-4 font-medium text-gray-900">{item.product}</td>
                                <td className="px-6 py-4 text-center">
                                    <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${item.spreadPercentage >= 30
                                            ? 'bg-green-100 text-green-800'
                                            : 'bg-yellow-100 text-yellow-800'
                                        }`}>
                                        +{item.spreadPercentage.toFixed(1)}%
                                    </span>
                                </td>
                                <td className="px-6 py-4 text-right font-medium text-red-500">
                                    ${item.currentPrice.toFixed(2)}
                                </td>
                                <td className="px-6 py-4 text-right font-bold text-green-600">
                                    ${item.targetPrice.toFixed(2)}
                                </td>
                                <td className="px-6 py-4 text-center text-gray-500 text-xs uppercase tracking-wide">
                                    {item.targetSupplier}
                                </td>
                                <td className="px-6 py-4 text-right font-medium text-gray-900">
                                    ${item.annualSavings.toLocaleString(undefined, { maximumFractionDigits: 0 })}
                                </td>
                                <td className="px-6 py-4 text-right">
                                    <Button size="sm" variant="outline" className="h-8 text-xs border-gray-200 hover:bg-gray-100 hover:text-gray-900">
                                        <Mail className="mr-2 h-3 w-3" />
                                        Request
                                    </Button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    )
}
