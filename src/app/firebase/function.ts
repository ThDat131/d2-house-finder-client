import { equalTo, get, orderByChild, push, query, ref } from 'firebase/database'
import { database } from '../../configs/firebase'
import {
  Notification,
  SendFromModel,
} from '../../model/notification/notification'

export const createNotification = (
  notification: Notification,
  sendFrom: SendFromModel,
  sendTo: string,
) => {
  if (sendFrom._id === sendTo) return

  const notificationsRef = ref(database, 'notifications')

  push(notificationsRef, notification)
}

export const getNotificationByUserId = async (userId: string) => {
  const notificationRef = query(
    ref(database, 'notifications'),
    orderByChild('sendTo'),
    equalTo(userId),
  )

  const results = await get(notificationRef)

  return results.val()
}
