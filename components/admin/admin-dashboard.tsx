'use client'

import { useState } from 'react'
import { Check, X, Eye, ChevronRight, AlertCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface Admin {
  id?: string
  full_name: string
  [key: string]: any
}

const pendingApprovals = [
  {
    id: 1,
    name: 'Mulungushi Fruits',
    type: 'Business',
    owner: 'David Chipoya',
    submittedDate: '2024-01-15',
    status: 'pending',
  },
  {
    id: 2,
    name: 'Fresh Hub Kabwe',
    type: 'Business',
    owner: 'Sarah Nkomo',
    submittedDate: '2024-01-14',
    status: 'pending',
  },
  {
    id: 3,
    name: 'John Mulewa',
    type: 'Delivery Agent',
    owner: 'John Mulewa',
    submittedDate: '2024-01-13',
    status: 'pending',
  },
]

const disputes = [
  {
    id: 1,
    orderId: 'ORD-2024-001',
    raisedBy: 'Zama Student',
    reason: 'Product quality issue',
    date: 'Today',
    status: 'open',
    priority: 'high',
  },
  {
    id: 2,
    orderId: 'ORD-2024-002',
    raisedBy: 'Chileshe Business',
    reason: 'Delivery delay',
    date: 'Today',
    status: 'under_review',
    priority: 'medium',
  },
  {
    id: 3,
    orderId: 'ORD-2024-003',
    raisedBy: 'Mubita Student',
    reason: 'Payment issue',
    date: '2 days ago',
    status: 'resolved',
    priority: 'low',
  },
]

const flaggedUsers = [
  {
    id: 1,
    name: 'Chipu Banda',
    role: 'Student',
    reason: 'Multiple failed transactions',
    flags: 3,
    status: 'warning',
  },
  {
    id: 2,
    name: 'Lusaka Meats',
    role: 'Business',
    reason: 'Poor customer ratings',
    flags: 2,
    status: 'warning',
  },
  {
    id: 3,
    name: 'Kevin Agent',
    role: 'Delivery Agent',
    reason: 'Low completion rate',
    flags: 1,
    status: 'caution',
  },
]

export function AdminDashboard({ admin }: { admin: Admin }) {
  const [activeTab, setActiveTab] = useState('approvals')

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'text-red-400'
      case 'medium':
        return 'text-yellow-400'
      case 'low':
        return 'text-blue-400'
      default:
        return 'text-gray-400'
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'open':
        return 'bg-red-500/20 text-red-300 border-red-500/30'
      case 'under_review':
        return 'bg-yellow-500/20 text-yellow-300 border-yellow-500/30'
      case 'resolved':
        return 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30'
      default:
        return 'bg-gray-500/20 text-gray-300 border-gray-500/30'
    }
  }

  return (
    <div className="space-y-8">
      {/* Tab Navigation */}
      <div className="flex gap-4 border-b border-white/10">
        {['approvals', 'disputes', 'users'].map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-3 font-semibold transition-all ${
              activeTab === tab
                ? 'text-emerald-400 border-b-2 border-emerald-400'
                : 'text-gray-400 hover:text-gray-300'
            }`}
          >
            {tab === 'approvals' && 'Pending Approvals'}
            {tab === 'disputes' && 'Open Disputes'}
            {tab === 'users' && 'Flagged Users'}
          </button>
        ))}
      </div>

      {/* Pending Approvals Tab */}
      {activeTab === 'approvals' && (
        <div>
          <h2 className="text-2xl font-bold text-white mb-6">Pending Approvals</h2>
          <div className="space-y-4">
            {pendingApprovals.map(approval => (
              <div
                key={approval.id}
                className="glass rounded-lg p-6 border border-white/10 hover:border-emerald-400/50 transition-colors"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-lg font-bold text-white">{approval.name}</h3>
                      <span className="px-2 py-1 rounded bg-yellow-500/20 text-yellow-300 text-xs font-semibold border border-yellow-500/30">
                        {approval.type}
                      </span>
                    </div>
                    <div className="flex items-center gap-6 text-sm text-gray-400">
                      <p>Owner: {approval.owner}</p>
                      <p>Submitted: {approval.submittedDate}</p>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <Button className="bg-emerald-500 hover:bg-emerald-600 text-white">
                    <Check className="w-4 h-4 mr-2" />
                    Approve
                  </Button>
                  <Button className="bg-red-500 hover:bg-red-600 text-white">
                    <X className="w-4 h-4 mr-2" />
                    Reject
                  </Button>
                  <Button className="bg-blue-500 hover:bg-blue-600 text-white ml-auto">
                    <Eye className="w-4 h-4 mr-2" />
                    Review Details
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Disputes Tab */}
      {activeTab === 'disputes' && (
        <div>
          <h2 className="text-2xl font-bold text-white mb-6">Open Disputes</h2>
          <div className="glass rounded-lg border border-white/10 overflow-hidden">
            <div className="space-y-0">
              {disputes.map(dispute => (
                <div key={dispute.id} className="p-6 border-b border-white/10 last:border-b-0 hover:bg-white/5 transition-colors">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <p className="text-white font-semibold">{dispute.orderId}</p>
                        <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${getStatusColor(dispute.status)}`}>
                          {dispute.status.replace('_', ' ').toUpperCase()}
                        </span>
                        <span className={`text-xs font-semibold uppercase ${getPriorityColor(dispute.priority)}`}>
                          {dispute.priority} PRIORITY
                        </span>
                      </div>
                      <div className="flex items-center gap-6 text-sm">
                        <p className="text-gray-400">Raised by: {dispute.raisedBy}</p>
                        <p className="text-gray-500">{dispute.date}</p>
                      </div>
                    </div>
                    <Button className="bg-blue-500 hover:bg-blue-600 text-white">
                      Resolve
                    </Button>
                  </div>
                  <p className="text-gray-300 text-sm flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 text-yellow-400" />
                    {dispute.reason}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Flagged Users Tab */}
      {activeTab === 'users' && (
        <div>
          <h2 className="text-2xl font-bold text-white mb-6">Flagged Users</h2>
          <div className="glass rounded-lg border border-white/10 overflow-hidden">
            <div className="space-y-0">
              {flaggedUsers.map(user => (
                <div key={user.id} className="p-6 border-b border-white/10 last:border-b-0 hover:bg-white/5 transition-colors">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <p className="text-white font-semibold">{user.name}</p>
                        <span className="px-2 py-1 rounded bg-blue-500/20 text-blue-300 text-xs font-semibold border border-blue-500/30">
                          {user.role}
                        </span>
                        <span className="text-red-400 text-xs font-bold">
                          ⚠️ {user.flags} FLAGS
                        </span>
                      </div>
                      <p className="text-gray-400 text-sm flex items-center gap-2">
                        <AlertCircle className="w-4 h-4 text-yellow-400" />
                        {user.reason}
                      </p>
                    </div>
                    <div className="flex items-center gap-3">
                      <Button className="bg-purple-500 hover:bg-purple-600 text-white">
                        Investigate
                      </Button>
                      <ChevronRight className="w-5 h-5 text-gray-400" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
