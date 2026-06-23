'use client'

import { useState, useEffect, useRef } from 'react'
import { Send, X } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface Message {
  id: string
  sender: string
  senderId: string
  content: string
  timestamp: string
  isRead: boolean
}

interface ChatWidgetProps {
  orderId: string
  currentUserId: string
  recipientName: string
  recipientId: string
}

export function ChatWidget({
  orderId,
  currentUserId,
  recipientName,
  recipientId,
}: ChatWidgetProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      sender: recipientName,
      senderId: recipientId,
      content: 'Hi, when can you deliver my order?',
      timestamp: '10:30 AM',
      isRead: true,
    },
    {
      id: '2',
      sender: 'You',
      senderId: currentUserId,
      content: 'Around 2 PM today',
      timestamp: '10:35 AM',
      isRead: true,
    },
    {
      id: '3',
      sender: recipientName,
      senderId: recipientId,
      content: 'Perfect! Thank you',
      timestamp: '10:36 AM',
      isRead: false,
    },
  ])
  const [inputValue, setInputValue] = useState('')
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const handleSendMessage = () => {
    if (!inputValue.trim()) return

    const newMessage: Message = {
      id: Date.now().toString(),
      sender: 'You',
      senderId: currentUserId,
      content: inputValue,
      timestamp: new Date().toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit',
      }),
      isRead: false,
    }

    setMessages([...messages, newMessage])
    setInputValue('')
  }

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 w-14 h-14 rounded-full bg-emerald-500 hover:bg-emerald-600 text-white shadow-lg flex items-center justify-center text-2xl transition-all"
      >
        💬
      </button>
    )
  }

  return (
    <div className="fixed bottom-6 right-6 w-96 glass rounded-lg border border-white/10 shadow-2xl overflow-hidden flex flex-col max-h-96">
      {/* Header */}
      <div className="bg-gradient-to-r from-emerald-600 to-emerald-700 p-4 flex items-center justify-between">
        <div>
          <h3 className="text-white font-bold">{recipientName}</h3>
          <p className="text-emerald-200 text-xs">Order {orderId}</p>
        </div>
        <button
          onClick={() => setIsOpen(false)}
          className="p-1 hover:bg-white/20 rounded transition-colors"
        >
          <X className="w-5 h-5 text-white" />
        </button>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-black/20">
        {messages.map(message => (
          <div
            key={message.id}
            className={`flex ${
              message.senderId === currentUserId ? 'justify-end' : 'justify-start'
            }`}
          >
            <div
              className={`max-w-xs px-3 py-2 rounded-lg ${
                message.senderId === currentUserId
                  ? 'bg-emerald-600/80 text-white'
                  : 'bg-slate-700/80 text-gray-100'
              }`}
            >
              <p className="text-sm">{message.content}</p>
              <p className="text-xs mt-1 opacity-70">{message.timestamp}</p>
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="p-4 bg-black/20 border-t border-white/10 flex gap-2">
        <input
          type="text"
          value={inputValue}
          onChange={e => setInputValue(e.target.value)}
          onKeyPress={e => e.key === 'Enter' && handleSendMessage()}
          placeholder="Type a message..."
          className="flex-1 bg-slate-800/50 border border-slate-700 rounded-lg px-3 py-2 text-white placeholder-gray-400 focus:outline-none focus:border-emerald-400 text-sm"
        />
        <button
          onClick={handleSendMessage}
          className="bg-emerald-500 hover:bg-emerald-600 text-white p-2 rounded-lg transition-colors"
        >
          <Send className="w-4 h-4" />
        </button>
      </div>
    </div>
  )
}
