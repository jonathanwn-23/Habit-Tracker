'use client'

import { useTransition, useState } from 'react'

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
  return (
    <div 
      className={`relative rounded-2xl border bg-white p-6 shadow-sm transition-all duration-300 ${
        isCompleted ? 'border-zinc-200 opacity-60 bg-zinc-50' : 'border-zinc-200 hover:shadow-md'
      }`}
    >
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-4">
          <button
            onClick={onToggle}
            disabled={disabled}
            className={`flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full border-2 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 ${
              isCompleted
                ? 'border-transparent text-white'
                : 'border-zinc-300 bg-transparent hover:border-zinc-400'
            } disabled:opacity-50`}
            style={{ 
              backgroundColor: isCompleted ? (habit.color || '#6366f1') : 'transparent',
              '--tw-ring-color': habit.color || '#6366f1' 
            } as React.CSSProperties}
          >
            {isCompleted && (
              <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z" clipRule="evenodd" />
              </svg>
            )}
          </button>
          <div>
            <div className="flex items-center gap-2">
              <div
                className="h-3 w-3 rounded-full"
                style={{ backgroundColor: habit.color || '#6366f1' }}
              />
              <h3 className={`font-semibold text-zinc-900 transition-all ${isCompleted ? 'line-through text-zinc-500' : ''}`}>
                {habit.name}
              </h3>
            </div>
            {habit.description && (
              <p className="mt-1 text-sm text-zinc-500">{habit.description}</p>
            )}
          </div>
        </div>
        
        {streak > 0 && (
          <div className="flex items-center gap-1 rounded-full bg-orange-50 px-3 py-1 text-sm font-medium text-orange-600 transition-all">
            <span>🔥</span>
            <span>{streak}</span>
          </div>
        )}
      </div>
    </div>
  )
}
