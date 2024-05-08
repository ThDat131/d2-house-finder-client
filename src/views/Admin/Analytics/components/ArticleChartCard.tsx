import { Card, CardContent, CardHeader, Stack } from '@mui/material'
import { useTranslation } from 'react-i18next'
import {
  Chart as ChartJS,
  Tooltip,
  ArcElement,
  Legend,
  LineElement,
  PointElement,
  LinearScale,
  Title,
  CategoryScale,
} from 'chart.js'
import { createRandomColorArray } from '../../../../utils/utils'
import { useEffect, useRef, useState } from 'react'
import ChartComponent from '../../../../components/Chart'
import { Doughnut, Line } from 'react-chartjs-2'

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
)
const ArticleChartCard = ({
  loading,
  data,
}: {
  loading: boolean
  data: any
}) => {
  const { t } = useTranslation()
  const [labels, setLabels] = useState([])
  const [articleData, setArticleData] = useState([])
  const [backgroundColors, setBackgroundColors] = useState<string[]>([])

  useEffect(() => {
    setLabels(data?.map((x: any) => x.role))
    setArticleData(data?.map((x: any) => x.total))
    setBackgroundColors(createRandomColorArray(1))
  }, [data])

  const chartData = {
    labels: [
      '1-4-2024',
      '5-4-2024',
      '7-4-2024',
      '20-4-2024',
      '21-4-2024',
      '23-4-2024',
    ],
    datasets: [
      {
        label: 'Total',
        data: [6, 2, 3, 4, 9, 4, 5, 3],
        backgroundColor: backgroundColors,
        borderColor: backgroundColors,
      },
    ],
  }

  const chartRef = useRef<HTMLCanvasElement | null>(null)
  const [chartInstance, setChartInstance] = useState<ChartJS | null>(null)

  useEffect(() => {
    if (chartRef.current) {
      const newChartInstance = new ChartJS(chartRef.current, {
        type: 'line',
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
    <Card>
      <CardHeader title={t('admin.analytic.articleStatistic')} />
      <CardContent>
        <Stack alignItems={'center'} height={300}>
          <Line data={chartData} options={{ responsive: true }} />
        </Stack>
      </CardContent>
    </Card>
  )
}

export default ArticleChartCard
