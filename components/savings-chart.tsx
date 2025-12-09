"use client"

import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, Tooltip, Legend } from "recharts"

interface SavingsChartProps {
    data: {
        name: string
        current: number
        optimized: number
    }[]
}

export function SavingsChart({ data }: SavingsChartProps) {
    return (
        <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
            <div className="mb-4">
                <h3 className="text-lg font-semibold text-gray-900">Optimization Impact</h3>
                <p className="text-sm text-gray-500">Comparing current annual landed cost vs optimized target.</p>
            </div>
            <div className="h-[350px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={data}>
                        <XAxis
                            dataKey="name"
                            stroke="#888888"
                            fontSize={12}
                            tickLine={false}
                            axisLine={false}
                        />
                        <YAxis
                            stroke="#888888"
                            fontSize={12}
                            tickLine={false}
                            axisLine={false}
                            tickFormatter={(value) => `$${value.toLocaleString()}`}
                        />
                        <Tooltip
                            cursor={{ fill: 'transparent' }}
                            contentStyle={{ border: '1px solid #e5e7eb', borderRadius: '8px' }}
                            labelStyle={{ fontWeight: 'bold', color: '#111827' }}
                            formatter={(value: number) => [`$${value.toLocaleString()}`, undefined]}
                        />
                        <Legend />
                        <Bar dataKey="current" fill="#9ca3af" name="Current Cost" radius={[4, 4, 0, 0]} />
                        <Bar dataKey="optimized" fill="#16a34a" name="Optimized Cost" radius={[4, 4, 0, 0]} />
                    </BarChart>
                </ResponsiveContainer>
            </div>
        </div>
    )
}
