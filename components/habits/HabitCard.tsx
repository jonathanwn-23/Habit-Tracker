'use client'

import { useTransition, useState } from 'react'
import Link from 'next/link'

interface HabitCardProps {
  habit: {
    id: string
    name: string
    description: string | null
    color: string | null
  }
  isCompleted: boolean
  streak: number
  onToggle: () => void
  disabled?: boolean
}

export function HabitCard({ habit, isCompleted, streak, onToggle, disabled }: HabitCardProps) {
  // Menentukan styling berdasarkan milestone streak
  const getStreakStyle = (count: number) => {
    if (count >= 100) return 'bg-fuchsia-100 text-fuchsia-700 shadow-[0_0_12px_rgba(217,70,239,0.4)] border border-fuchsia-200'
    if (count >= 30) return 'bg-cyan-100 text-cyan-700 shadow-[0_0_8px_rgba(6,182,212,0.3)] border border-cyan-200'
    if (count >= 7) return 'bg-orange-100 text-orange-700 shadow-[0_0_6px_rgba(249,115,22,0.2)] border border-orange-200'
    return 'bg-orange-50 text-orange-500 border border-transparent'
  }

  const getStreakIcon = (count: number) => {
    if (count >= 100) return '👑' // Mahkota untuk 100 hari
    if (count >= 30) return '💎' // Berlian untuk 30 hari
    return '🔥' // Api standar
  }

  return (
    <div 
      className={`relative rounded-2xl border bg-white p-6 transition-all duration-300 ${
        isCompleted 
          ? 'border-slate-200 opacity-60 bg-slate-50' 
          : 'border-transparent shadow-[0_2px_10px_rgba(0,0,0,0.04)] hover:shadow-[0_8px_30px_rgba(0,0,0,0.08)] hover:-translate-y-1'
      }`}
    >
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-4">
          <button
            onClick={onToggle}
            disabled={disabled}
            className={`flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full border-2 transition-all duration-300 active:scale-75 focus:outline-none focus:ring-2 focus:ring-offset-2 ${
              isCompleted
                ? 'border-transparent text-white scale-100'
                : 'border-slate-300 bg-transparent hover:border-slate-400 hover:scale-110'
            } disabled:opacity-50`}
            style={{ 
              backgroundColor: isCompleted ? '#40c463' : 'transparent',
              '--tw-ring-color': '#40c463' 
            } as React.CSSProperties}
          >
            {isCompleted && (
              <svg className="h-5 w-5 animate-[ping_0.3s_cubic-bezier(0,0,0.2,1)_once]" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z" clipRule="evenodd" />
              </svg>
            )}
          </button>
          <div>
            <div className="flex items-center gap-2">
              <div
                className="h-3 w-3 rounded-full shadow-sm"
                style={{ backgroundColor: '#40c463' }}
              />
              <Link href={`/habits/${habit.id}`} className="hover:underline decoration-slate-300 underline-offset-4">
                <h3 className={`font-semibold text-slate-900 transition-all ${isCompleted ? 'line-through text-slate-500' : ''}`}>
                  {habit.name}
                </h3>
              </Link>
            </div>
            {habit.description && (
              <p className="mt-1 text-sm text-slate-500">{habit.description}</p>
            )}
          </div>
        </div>
        
        {streak > 0 && (
          <div className={`flex items-center gap-1.5 rounded-full px-3 py-1.5 text-sm font-bold transition-all duration-500 hover:scale-110 ${getStreakStyle(streak)}`}>
            <span className="text-base">{getStreakIcon(streak)}</span>
            <span>{streak}</span>
          </div>
        )}
      </div>
    </div>
  )
}
