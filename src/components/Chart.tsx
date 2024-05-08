import React, { useRef, useEffect, useState } from 'react'
import type { ChartData, ChartArea, ChartOptions, ChartType } from 'chart.js'
import {
  Chart as ChartJS,
  LinearScale,
  PointElement,
  LineElement,
  Chart,
  Title,
} from 'chart.js'

interface ChartProps {
  data: ChartData
  options?: ChartOptions
  type: ChartType
}

ChartJS.register(LineElement, PointElement, LinearScale, Title)

const ChartComponent: React.FC<ChartProps> = ({ data, options, type }) => {
  const chartRef = useRef<HTMLCanvasElement | null>(null)
  const [chartInstance, setChartInstance] = useState<Chart | null>(null)

  useEffect(() => {
    if (chartRef.current) {
      const newChartInstance = new Chart(chartRef.current, {
        type,
        data,
        options,
      })
      setChartInstance(newChartInstance)
    }

    return () => {
      if (chartInstance) {
        chartInstance.destroy()
      }
    }
  }, [data, options, type])

  return <canvas ref={chartRef} />
}

export default ChartComponent
