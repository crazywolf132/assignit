'use client'

import { TeamManagement } from '@/components/team-management'
import { StoryUpload } from '@/components/story-upload'
import { AssignmentResults } from '@/components/assignment-results'
import { motion } from 'framer-motion'

export default function AppPage() {
  return (
    <main className="min-h-screen bg-[#0A0A0B] selection:bg-indigo-500/20 selection:text-indigo-200">
      {/* Gradient Background */}
      <div className="fixed inset-0 bg-gradient-to-tr from-indigo-600/10 via-[#0A0A0B] to-[#0A0A0B]" />
      
      {/* Content */}
      <div className="relative">
        <div className="mx-auto max-w-7xl px-6 py-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-10"
          >
            {/* Header */}
            <header className="flex items-center justify-between">
              <div>
                <motion.h1 
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="text-4xl font-light tracking-tight text-white"
                >
                  assign<span className="font-medium bg-gradient-to-r from-indigo-300 to-indigo-100 bg-clip-text text-transparent">it</span>
                </motion.h1>
                <motion.p 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.2 }}
                  className="mt-2 text-sm text-zinc-300"
                >
                  AI-powered story assignment
                </motion.p>
              </div>
            </header>

            {/* Main Content */}
            <div className="grid gap-10 lg:grid-cols-12 lg:gap-12">
              {/* Sidebar */}
              <div className="lg:col-span-4 space-y-8">
                <div className="sticky top-8">
                  <div className="space-y-8">
                    <TeamManagement />
                    <StoryUpload />
                  </div>
                </div>
              </div>

              {/* Results */}
              <div className="lg:col-span-8">
                <AssignmentResults />
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </main>
  )
} 