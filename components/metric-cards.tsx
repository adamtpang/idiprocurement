"use client"

import { DollarSign, TrendingUp, BarChart } from 'lucide-react'
import { Progress } from "@/components/ui/progress"

interface MetricCardsProps {
    totalSpend: number
    potentialSavings: number
    optimizationScore: number
}

export function MetricCards({ totalSpend, potentialSavings, optimizationScore }: MetricCardsProps) {
    return (
        <div className="grid gap-4 md:grid-cols-3">
            <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
                <div className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <div className="text-sm font-medium text-gray-500">Total Annual Spend (Est)</div>
                    <DollarSign className="h-4 w-4 text-gray-400" />
                </div>
                <div className="text-2xl font-bold text-gray-900">${totalSpend.toLocaleString()}</div>
                <p className="text-xs text-gray-500 mt-1">
                    Based on annualized weekly volume
                </p>
            </div>

            <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
                <div className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <div className="text-sm font-medium text-gray-500">Potential Annual Savings</div>
                    <TrendingUp className="h-4 w-4 text-green-600" />
                </div>
                <div className="text-2xl font-bold text-green-600">${potentialSavings.toLocaleString()}</div>
                <p className="text-xs text-gray-500 mt-1">
                    Calculated at 30% arbitrage target
                </p>
            </div>

            <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
                <div className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <div className="text-sm font-medium text-gray-500">Optimization Score</div>
                    <BarChart className="h-4 w-4 text-gray-400" />
                </div>
                <div className="text-2xl font-bold text-gray-900 mb-2">{optimizationScore}/100</div>
                <Progress value={optimizationScore} className="h-2" />
                <p className="text-xs text-gray-500 mt-2">
                    {optimizationScore < 50 ? 'Optimization needed' : 'Good optimization status'}
                </p>
            </div>
        </div>
    )
}
