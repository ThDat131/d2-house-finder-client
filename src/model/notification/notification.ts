import { NotificationTypeEnum } from './notification--type'

export interface SendFromModel {
  avatar: string
  _id: string
  fullName: string
}

export interface NotificationFirebase {
  id: Notification
}

export interface Notification {
  id: string
  content: string
  isRead: boolean
  sendFrom: SendFromModel
  sendTo: string
  createdAt: string
  type: NotificationTypeEnum
  actionUrl: string
}
