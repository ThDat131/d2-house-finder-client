import { Card, CardContent, CardHeader, Stack } from '@mui/material'
import { useTranslation } from 'react-i18next'
import { Doughnut } from 'react-chartjs-2'
import { Chart as ChartJS, Tooltip, ArcElement, Legend } from 'chart.js'
import { createRandomColorArray } from '../../../../utils/utils'
import { useEffect, useRef, useState } from 'react'

ChartJS.register(ArcElement, Tooltip, Legend)

const UserChartCard = ({ loading, data }: { loading: boolean; data: any }) => {
  const { t } = useTranslation()
  const [labels, setLabels] = useState([])
  const [userData, setUserData] = useState([])
  const [backgroundColors, setBackgroundColors] = useState<string[]>([])

  useEffect(() => {
    setLabels(data?.map((x: any) => x.role))
    setUserData(data?.map((x: any) => x.total))
    setBackgroundColors(createRandomColorArray(10))
  }, [data])

  const chartData = {
    labels,
    datasets: [
      {
        label: 'Total',
        data: userData,
        backgroundColor: backgroundColors,
      },
    ],
  }

  const chartRef = useRef<HTMLCanvasElement | null>(null)
  const [chartInstance, setChartInstance] = useState<ChartJS | null>(null)

  useEffect(() => {
    if (chartRef.current) {
      const newChartInstance = new ChartJS(chartRef.current, {
        type: 'doughnut',
        data: chartData,
      })
      setChartInstance(newChartInstance as ChartJS)
    }

    return () => {
      if (chartInstance) {
        chartInstance.destroy()
      }
    }
  }, [data])

  return (
    <Card sx={{ height: 1 }}>
      <CardHeader title={t('admin.analytic.userStatistic')} />
      <CardContent>
        <Stack alignItems={'center'} height={300}>
          <Doughnut data={chartData} options={{ responsive: true }} />
        </Stack>
      </CardContent>
    </Card>
  )
}

export default UserChartCard
