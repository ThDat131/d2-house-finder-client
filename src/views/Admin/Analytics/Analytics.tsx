import { Grid, Skeleton } from '@mui/material'
import UserCard from './components/UserCard'
import { HttpService } from '../../../api/HttpService'
import { useEffect, useState } from 'react'
import { ApiPathEnum } from '../../../api/ApiPathEnum'
import LandlordRequestCard from './components/LandlordRequestCard'
import ArticleCard from './components/ArticleCard'
import VerificationCard from './components/VerificationCard'
import UserChartCard from './components/UserChartCard'
import ArticleChartCard from './components/ArticleChartCard'
import moment from 'moment'

const Analytics = () => {
  const { httpService } = new HttpService()
  const [totalLoading, setTotalLoading] = useState<boolean>(false)
  const [totalInfo, setTotalInfo] = useState({
    user: 0,
    article: 0,
    landlordRequest: 0,
    verification: 0,
  })
  const [chartUserLoading, setChartUserLoading] = useState<boolean>(false)
  const [userChartData, setUserChartData] = useState()
  const [chartArticleLoading, setCharArticleLoading] = useState<boolean>(false)
  const [articleChartData, setArticleChartData] = useState()
  const [from, setFrom] = useState(moment().startOf('month'))
  const [to, setTo] = useState(moment().endOf('month'))
  const [typeDate, setTypeDate] = useState<string>('DAY')
  const [triggerUpdate, setTriggerUpdate] = useState<boolean>(false)

  useEffect(() => {
    setTotalLoading(true)

    httpService
      .get(ApiPathEnum.Statistical)
      .then(res => {
        if (res.status === 200) {
          setTotalInfo(res.data.data)
        }
      })
      .finally(() => {
        setTotalLoading(false)
      })
  }, [])

  useEffect(() => {
    setChartUserLoading(true)

    httpService
      .get(`${ApiPathEnum.Statistical}/users`)
      .then(res => {
        if (res.status === 200) {
          setUserChartData(res.data.data)
        }
      })
      .finally(() => {
        setChartUserLoading(false)
      })
  }, [])

  useEffect(() => {
    setCharArticleLoading(true)

    httpService
      .post(`${ApiPathEnum.Statistical}/articles`, {
        fromDate: from.format('DD/MM/YYYY'),
        toDate: to.format('DD/MM/YYYY'),
        type: typeDate,
      })
      .then(res => {
        if (res.status === 201) {
          setArticleChartData(res.data.data)
        }
      })
      .finally(() => {
        setCharArticleLoading(false)
      })
  }, [triggerUpdate])

  if (chartUserLoading || chartArticleLoading) return <Skeleton />

  return (
    <Grid container spacing={5}>
      <Grid item container xs={12} spacing={2}>
        <Grid item xs={3}>
          <UserCard loading={totalLoading} total={totalInfo.user} />
        </Grid>
        <Grid item xs={3}>
          <ArticleCard loading={totalLoading} total={totalInfo.article} />
        </Grid>
        <Grid item xs={3}>
          <LandlordRequestCard
            loading={totalLoading}
            total={totalInfo.landlordRequest}
          />
        </Grid>
        <Grid item xs={3}>
          <VerificationCard
            loading={totalLoading}
            total={totalInfo.verification}
          />
        </Grid>
      </Grid>
      <Grid item container xs={12} spacing={2}>
        <Grid item xs={4}>
          <UserChartCard loading={chartUserLoading} data={userChartData} />
        </Grid>
        <Grid item xs={8}>
          <ArticleChartCard
            loading={chartArticleLoading}
            data={articleChartData}
            from={from}
            setFrom={setFrom}
            to={to}
            setTo={setTo}
            typeDate={typeDate}
            setTypeDate={setTypeDate}
            trigger={triggerUpdate}
            setTrigger={setTriggerUpdate}
          />
        </Grid>
      </Grid>
    </Grid>
  )
}

export default Analytics
