'use client'

import React, { useMemo } from 'react'

interface HabitCalendarProps {
  logs: string[] // Array of YYYY-MM-DD
  color?: string | null
}

export function HabitCalendar({ logs, color = '#6366f1' }: HabitCalendarProps) {
  // Memoize the calendar generation so it doesn't recalculate on every render
  const calendarData = useMemo(() => {
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    
    // Geser hari ini ke hari Minggu terakhir (atau biarkan sampai hari ini saja)
    // GitHub biasanya berakhir di hari ini. 
    // Jika kita pakai grid-auto-flow: column, hari pertama (pojok kiri atas) harus dipaskan
    // agar hari ini (elemen terakhir) jatuh di baris yang sesuai (hari dalam seminggu).
    
    const daysInCalendar = 52 * 7 // 364 hari (52 minggu penuh)
    
    // Cari tanggal mulai
    const startDate = new Date(today)
    startDate.setDate(today.getDate() - daysInCalendar + 1)
    
    // Karena kita tidak memaksa rata dari hari Minggu, posisi baris akan bergeser 
    // tergantung hari ini hari apa.
    // Untuk menyederhanakan dan mudah dipahami: kita render 364 kotak secara flat
    // dengan grid-auto-flow: column.
    
    const logSet = new Set(logs)
    const data = []

    for (let i = 0; i < daysInCalendar; i++) {
      const currentDate = new Date(startDate)
      currentDate.setDate(startDate.getDate() + i)
      
      // Format YYYY-MM-DD (menggunakan locale sv-SE untuk format ISO YYYY-MM-DD)
      // atau gunakan getFullYear dll untuk amannya.
      const year = currentDate.getFullYear()
      const month = String(currentDate.getMonth() + 1).padStart(2, '0')
      const day = String(currentDate.getDate()).padStart(2, '0')
      const dateString = `${year}-${month}-${day}`
      
      const isCompleted = logSet.has(dateString)
      
      data.push({
        date: currentDate,
        dateString,
        isCompleted
      })
    }
    
    return data
  }, [logs])

  // Mendapatkan label bulan untuk ditampilkan di atas
  // Kita cek bulan dari elemen pertama setiap minggu (setiap 7 hari)
  const monthLabels = useMemo(() => {
    const labels: { name: string, colIndex: number }[] = []
    let currentMonth = -1
    
    calendarData.forEach((day, index) => {
      // Hanya cek baris pertama dari setiap kolom (index kelipatan 7)
      if (index % 7 === 0) {
        const month = day.date.getMonth()
        if (month !== currentMonth) {
          labels.push({
            name: day.date.toLocaleString('id-ID', { month: 'short' }),
            colIndex: index / 7
          })
          currentMonth = month
        }
      }
    })
    
    return labels
  }, [calendarData])

  return (
    <div className="w-full overflow-x-auto pb-4">
      <div className="min-w-[700px]">
        {/* Label Bulan */}
        <div className="relative mb-2 flex h-5 text-xs text-zinc-400">
          {monthLabels.map((label, i) => (
            <span 
              key={i} 
              className="absolute"
              style={{ left: `${(label.colIndex / 52) * 100}%` }}
            >
              {label.name}
            </span>
          ))}
        </div>

        {/* Grid Heatmap */}
        <div 
          className="grid gap-1"
          style={{
            display: 'grid',
            gridTemplateRows: 'repeat(7, minmax(0, 1fr))',
            gridTemplateColumns: 'repeat(52, minmax(0, 1fr))',
            gridAutoFlow: 'column'
          }}
        >
          {calendarData.map((day, i) => (
            <div
              key={day.dateString}
              title={`${day.date.toLocaleDateString('id-ID', { 
                weekday: 'long', 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
              })}${day.isCompleted ? ' : Selesai' : ''}`}
              className="h-3 w-3 rounded-[2px] transition-colors"
              style={{
                backgroundColor: day.isCompleted ? '#40c463' : '#ebedf0',
              }}
            />
          ))}
        </div>
        
        <div className="mt-4 flex items-center justify-end gap-2 text-xs text-slate-500">
          <div className="flex items-center gap-1.5 mr-3">
            <div className="h-3 w-3 rounded-[2px] bg-[#ebedf0]" />
            <span>Belum</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="h-3 w-3 rounded-[2px] bg-[#40c463]" />
            <span>Selesai</span>
          </div>
        </div>
      </div>
    </div>
  )
}
