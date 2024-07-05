import {
  Button,
  Card,
  CardContent,
  CardHeader,
  MenuItem,
  Popper,
  Select,
  Stack,
} from '@mui/material'
import { useTranslation } from 'react-i18next'
import {
  Chart as ChartJS,
  Tooltip,
  Legend,
  LineElement,
  PointElement,
  LinearScale,
  Title,
  CategoryScale,
} from 'chart.js'
import { createRandomColorArray } from '../../../../utils/utils'
import { Dispatch, SetStateAction, useEffect, useRef, useState } from 'react'
import ChartComponent from '../../../../components/Chart'
import { Line } from 'react-chartjs-2'
import { DatePicker } from '@mui/x-date-pickers'
import moment, { Moment } from 'moment'

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
)

const CustomPopper = (props: any) => <Popper {...props} style={{ height: 0 }} />

const ArticleChartCard = ({
  loading,
  data,
  from,
  setFrom,
  to,
  setTo,
  typeDate,
  setTypeDate,
  trigger,
  setTrigger,
}: {
  loading: boolean
  data: any
  from: Moment
  setFrom: Dispatch<SetStateAction<Moment>>
  to: Moment
  setTo: Dispatch<SetStateAction<Moment>>
  typeDate: string
  setTypeDate: Dispatch<SetStateAction<string>>
  trigger: boolean
  setTrigger: Dispatch<SetStateAction<boolean>>
}) => {
  const { t } = useTranslation()
  const [labels, setLabels] = useState([])
  const [articleData, setArticleData] = useState([])
  const [backgroundColors, setBackgroundColors] = useState<string[]>([])

  useEffect(() => {
    if (typeDate === 'DAY') {
      setLabels(data?.map((x: any) => moment(x.date).format('DD/MM/YYYY')))
    } else if (typeDate === 'MONTH') {
      setLabels(data?.map((x: any) => x.months))
    } else if (typeDate === 'YEAR') {
      setLabels(data?.map((x: any) => x.year))
    }

    setArticleData(data?.map((x: any) => x.quantity))
    setBackgroundColors(createRandomColorArray(1))
  }, [data])

  const chartData = {
    labels,
    datasets: [
      {
        label: 'Total',
        data: articleData,
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
        <Stack direction={'row'} spacing={2}>
          <DatePicker
            slots={{
              popper: CustomPopper,
            }}
            label="Basic date picker"
            value={from}
            onChange={value => {
              setFrom(value as Moment)
            }}
          />
          <DatePicker
            slots={{
              popper: CustomPopper,
            }}
            label="Basic date picker"
            value={to}
            onChange={value => {
              setTo(value as Moment)
            }}
          />
          <Select
            value={typeDate}
            onChange={evt => {
              setTypeDate(evt.target.value)
            }}
          >
            <MenuItem value={'DAY'}>{t('admin.analytic.day')}</MenuItem>
            <MenuItem value={'MONTH'}>{t('admin.analytic.month')}</MenuItem>
            <MenuItem value={'YEAR'}>{t('admin.analytic.year')}</MenuItem>
          </Select>
          <Button
            variant="contained"
            onClick={() => {
              setTrigger(!trigger)
            }}
          >
            {t('admin.analytic.statistic')}
          </Button>
        </Stack>
        <Stack alignItems={'center'} height={300}>
          <Line data={chartData} options={{ responsive: true }} />
        </Stack>
      </CardContent>
    </Card>
  )
}

export default ArticleChartCard
