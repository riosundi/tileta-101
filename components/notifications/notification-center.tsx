'use client'

import { useState } from 'react'
import { Bell, X, Check, Package, AlertCircle, DollarSign, Truck } from 'lucide-react'

interface Notification {
  id: string
  type: 'order_update' | 'payment' | 'delivery' | 'message' | 'system'
  title: string
  message: string
  timestamp: string
  isRead: boolean
}

const mockNotifications: Notification[] = [
  {
    id: '1',
    type: 'delivery',
    title: 'Delivery in Progress',
    message: 'Your order is on its way. Estimated arrival in 15 minutes.',
    timestamp: 'Just now',
    isRead: false,
  },
  {
    id: '2',
    type: 'order_update',
    title: 'Order Accepted',
    message: 'Mulungushi Fruits has accepted your order.',
    timestamp: '5 mins ago',
    isRead: false,
  },
  {
    id: '3',
    type: 'payment',
    title: 'Payment Confirmed',
    message: 'K 150.00 held in escrow for order ORD-2024-001',
    timestamp: '10 mins ago',
    isRead: true,
  },
  {
    id: '4',
    type: 'message',
    title: 'New Message',
    message: 'Kabelo Mwepu: On my way to your location',
    timestamp: '15 mins ago',
    isRead: true,
  },
  {
    id: '5',
    type: 'system',
    title: 'Welcome Bonus',
    message: 'You earned K 50 as a welcome bonus!',
    timestamp: 'Today',
    isRead: true,
  },
]

export function NotificationCenter() {
  const [isOpen, setIsOpen] = useState(false)
  const [notifications, setNotifications] = useState(mockNotifications)

  const unreadCount = notifications.filter(n => !n.isRead).length

  const getNotificationIcon = (type: Notification['type']) => {
    switch (type) {
      case 'delivery':
        return <Truck className="w-5 h-5 text-blue-400" />
      case 'order_update':
        return <Package className="w-5 h-5 text-purple-400" />
      case 'payment':
        return <DollarSign className="w-5 h-5 text-emerald-400" />
      case 'message':
        return <AlertCircle className="w-5 h-5 text-yellow-400" />
      case 'system':
        return <Bell className="w-5 h-5 text-cyan-400" />
      default:
        return <Bell className="w-5 h-5 text-gray-400" />
    }
  }

  const getNotificationColor = (type: Notification['type']) => {
    switch (type) {
      case 'delivery':
        return 'bg-blue-500/20 border-blue-500/30'
      case 'order_update':
        return 'bg-purple-500/20 border-purple-500/30'
      case 'payment':
        return 'bg-emerald-500/20 border-emerald-500/30'
      case 'message':
        return 'bg-yellow-500/20 border-yellow-500/30'
      case 'system':
        return 'bg-cyan-500/20 border-cyan-500/30'
      default:
        return 'bg-gray-500/20 border-gray-500/30'
    }
  }

  const markAsRead = (id: string) => {
    setNotifications(prev =>
      prev.map(n => (n.id === id ? { ...n, isRead: true } : n))
    )
  }

  const markAllAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, isRead: true })))
  }

  const deleteNotification = (id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id))
  }

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="relative p-2 hover:bg-white/10 rounded-lg transition-colors"
      >
        <Bell className="w-6 h-6 text-gray-300 hover:text-white" />
        {unreadCount > 0 && (
          <span className="absolute top-0 right-0 w-5 h-5 bg-red-500 text-white text-xs font-bold rounded-full flex items-center justify-center">
            {unreadCount}
          </span>
        )}
      </button>
    )
  }

  return (
    <div className="fixed top-20 right-6 w-96 glass rounded-lg border border-white/10 shadow-2xl overflow-hidden flex flex-col max-h-96 z-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-cyan-600 p-4 flex items-center justify-between">
        <h3 className="text-white font-bold">Notifications</h3>
        <div className="flex items-center gap-2">
          {unreadCount > 0 && (
            <button
              onClick={markAllAsRead}
              className="text-xs text-blue-200 hover:text-white transition-colors"
            >
              Mark all as read
            </button>
          )}
          <button
            onClick={() => setIsOpen(false)}
            className="p-1 hover:bg-white/20 rounded transition-colors"
          >
            <X className="w-5 h-5 text-white" />
          </button>
        </div>
      </div>

      {/* Notifications List */}
      <div className="flex-1 overflow-y-auto">
        {notifications.length === 0 ? (
          <div className="p-6 text-center text-gray-400">
            <Bell className="w-12 h-12 mx-auto mb-3 opacity-50" />
            <p>No notifications</p>
          </div>
        ) : (
          <div className="space-y-0">
            {notifications.map(notification => (
              <div
                key={notification.id}
                className={`p-4 border-b border-white/10 last:border-b-0 hover:bg-white/5 transition-colors cursor-pointer ${
                  !notification.isRead ? 'bg-white/5' : ''
                }`}
                onClick={() => markAsRead(notification.id)}
              >
                <div className="flex gap-3">
                  <div className={`flex-shrink-0 p-2 rounded-lg ${getNotificationColor(notification.type)}`}>
                    {getNotificationIcon(notification.type)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <h4 className="text-white font-semibold text-sm">{notification.title}</h4>
                      {!notification.isRead && (
                        <div className="w-2 h-2 bg-blue-500 rounded-full flex-shrink-0 mt-1" />
                      )}
                    </div>
                    <p className="text-gray-400 text-xs mt-1 line-clamp-2">{notification.message}</p>
                    <p className="text-gray-500 text-xs mt-2">{notification.timestamp}</p>
                  </div>
                  <button
                    onClick={e => {
                      e.stopPropagation()
                      deleteNotification(notification.id)
                    }}
                    className="flex-shrink-0 p-1 hover:bg-white/10 rounded transition-colors"
                  >
                    <X className="w-4 h-4 text-gray-400 hover:text-white" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Footer */}
      {notifications.length > 0 && (
        <div className="p-3 bg-black/20 border-t border-white/10 text-center">
          <button className="text-xs text-blue-400 hover:text-blue-300 transition-colors">
            View all notifications
          </button>
        </div>
      )}
    </div>
  )
}
