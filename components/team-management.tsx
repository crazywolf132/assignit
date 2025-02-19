'use client'

import { useState, useRef, useEffect } from 'react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { useAssignmentStore } from '@/lib/store'
import { toast } from 'sonner'
import { Loader2, Plus, X, Users } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

export function TeamManagement() {
  const [newMember, setNewMember] = useState('')
  const [capacity, setCapacity] = useState<string>('')
  const [isAdding, setIsAdding] = useState(false)
  const [shouldFocus, setShouldFocus] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)
  const { teamMembers, addTeamMember, removeTeamMember } = useAssignmentStore()

  // Effect to handle focusing
  useEffect(() => {
    if (shouldFocus && !isAdding) {
      inputRef.current?.focus()
      setShouldFocus(false)
    }
  }, [shouldFocus, isAdding])

  const handleAddMember = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newMember.trim()) return

    setIsAdding(true)
    try {
      const maxPoints = capacity ? parseInt(capacity, 10) : undefined
      addTeamMember(newMember.trim(), maxPoints)
      setNewMember('')
      setCapacity('')
      toast.success('Team member added', {
        description: `${newMember.trim()} has been added to the team${maxPoints ? ` with ${maxPoints} points capacity` : ''}.`
      })
      setShouldFocus(true)
    } catch (error) {
      toast.error('Failed to add team member')
    } finally {
      setIsAdding(false)
    }
  }

  const handleRemoveMember = (id: string, name: string) => {
    removeTeamMember(id)
    toast.info('Team member removed', {
      description: `${name} has been removed from the team.`
    })
  }

  const handleClearInput = () => {
    setNewMember('')
    inputRef.current?.focus()
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 text-white">
        <Users className="h-5 w-5 text-indigo-400" />
        <h2 className="text-lg font-medium">Team Members</h2>
      </div>

      <form onSubmit={handleAddMember} className="flex gap-2">
        <div className="flex-1 flex gap-2">
          <div className="relative flex-1">
            <Input
              ref={inputRef}
              placeholder="Add team member..."
              value={newMember}
              onChange={(e) => setNewMember(e.target.value)}
              disabled={isAdding}
              className="h-9 bg-[#27272A] border-0 ring-1 ring-inset ring-[#3F3F46] text-white
                placeholder:text-zinc-400 focus-visible:ring-indigo-500/50 focus-visible:ring-2"
            />
            {newMember && (
              <button
                type="button"
                onClick={handleClearInput}
                className="absolute right-2 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-200"
              >
                <X className="h-4 w-4" />
              </button>
            )}
          </div>
          <Input
            type="number"
            placeholder="Max points..."
            value={capacity}
            onChange={(e) => setCapacity(e.target.value)}
            disabled={isAdding}
            min="1"
            className="h-9 w-24 bg-[#27272A] border-0 ring-1 ring-inset ring-[#3F3F46] text-white
              placeholder:text-zinc-400 focus-visible:ring-indigo-500/50 focus-visible:ring-2"
          />
        </div>
        <Button
          type="submit"
          disabled={isAdding || !newMember.trim()}
          size="icon"
          className="h-9 w-9 bg-indigo-500/10 text-indigo-200 ring-1 ring-inset ring-indigo-500/20
            hover:bg-indigo-500/20 hover:text-indigo-100 disabled:opacity-40"
        >
          {isAdding ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Plus className="h-4 w-4" />
          )}
        </Button>
      </form>

      <AnimatePresence mode="popLayout">
        {teamMembers.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="rounded-lg bg-[#27272A] ring-1 ring-inset ring-[#3F3F46] p-6 text-center"
          >
            <p className="text-sm text-zinc-400">Add team members to get started</p>
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="rounded-lg bg-[#27272A] ring-1 ring-inset ring-[#3F3F46] divide-y divide-[#3F3F46]"
          >
            {teamMembers.map((member) => (
              <motion.div
                key={member.id}
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="group flex items-center justify-between px-4 py-2"
              >
                <div className="flex items-center gap-2">
                  <span className="text-sm text-zinc-200">{member.name}</span>
                  {member.maxPoints && (
                    <span className="text-xs px-2 py-0.5 rounded-full bg-indigo-500/10 text-indigo-200 ring-1 ring-inset ring-indigo-500/20">
                      Max {member.maxPoints} pts
                    </span>
                  )}
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => handleRemoveMember(member.id, member.name)}
                  className="h-8 w-8 opacity-0 group-hover:opacity-100 text-zinc-500 hover:text-zinc-300
                    hover:bg-white/5"
                >
                  <X className="h-4 w-4" />
                </Button>
              </motion.div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
} 