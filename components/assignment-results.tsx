'use client'

import { useAssignmentStore } from '@/lib/store'
import type { Story } from '@/lib/store'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronRight, ListChecks, GripVertical } from 'lucide-react'
import { DndContext, DragEndEvent, MouseSensor, TouchSensor, useSensor, useSensors, DragStartEvent, DragOverlay, useDraggable, useDroppable } from '@dnd-kit/core'
import { restrictToVerticalAxis } from '@dnd-kit/modifiers'
import { toast } from 'sonner'
import { useState } from 'react'
import { cn } from '@/lib/utils'

function capitalizeFirstLetter(str: string) {
  return str.charAt(0).toUpperCase() + str.slice(1)
}

interface StoryItemProps {
  story: Story
  isDragging?: boolean
  isOverlay?: boolean
}

function StoryItem({ story, isDragging, isOverlay }: StoryItemProps) {
  const { attributes, listeners, setNodeRef } = useDraggable({
    id: story.id,
    disabled: isOverlay
  })

  return (
    <motion.div
      ref={setNodeRef}
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 20 }}
      className={cn(
        "flex items-center gap-3 rounded bg-[#323238] px-3 py-2 transition-colors group",
        isDragging ? "opacity-30" : "hover:bg-[#3F3F46]",
        isOverlay && "shadow-2xl ring-2 ring-indigo-500/50 cursor-grabbing"
      )}
      {...attributes}
    >
      <div className="flex-1 min-w-0 flex items-center gap-2">
        <div {...listeners} className="touch-none">
          <GripVertical className="h-4 w-4 text-zinc-600 opacity-0 group-hover:opacity-100 cursor-grab active:cursor-grabbing" />
        </div>
        <p className="text-sm text-white truncate">{story.title}</p>
      </div>
      <div className="text-xs font-medium px-2 py-0.5 rounded-full bg-[#27272A] text-zinc-200 ring-1 ring-inset ring-[#3F3F46]">
        {story.points} pts
      </div>
    </motion.div>
  )
}

function DroppableSection({ id, children, className }: { id: string, children: React.ReactNode, className?: string }) {
  const { isOver, setNodeRef } = useDroppable({ id })
  
  return (
    <div 
      ref={setNodeRef}
      className={cn(
        className,
        isOver && "ring-2 ring-indigo-500/50"
      )}
    >
      {children}
    </div>
  )
}

export function AssignmentResults() {
  const { stories, teamMembers, updateStoryAssignee } = useAssignmentStore()
  const [activeId, setActiveId] = useState<string | null>(null)

  const sensors = useSensors(
    useSensor(MouseSensor, {
      activationConstraint: {
        distance: 5,
      },
    }),
    useSensor(TouchSensor, {
      activationConstraint: {
        delay: 100,
        tolerance: 5,
      },
    })
  )

  const handleDragStart = (event: DragStartEvent) => {
    setActiveId(event.active.id as string)
  }

  const handleDragEnd = (event: DragEndEvent) => {
    setActiveId(null)
    const { active, over } = event
    if (!over) return

    const storyId = active.id as string
    const targetId = over.id as string

    if (targetId.startsWith('member-')) {
      const memberId = targetId.replace('member-', '')
      const member = memberMap.get(memberId)
      if (!member) return

      const story = stories.find(s => s.id === storyId)
      if (!story) return

      // Check if the member has capacity
      const currentMemberStories = stories.filter(s => s.assignee === memberId)
      const currentPoints = currentMemberStories.reduce((acc, s) => acc + s.points, 0)
      
      if (member.maxPoints && currentPoints + story.points > member.maxPoints) {
        toast.error('Cannot assign story - Capacity limit exceeded', {
          description: `${member.name} has a capacity of ${member.maxPoints} points and would exceed it by ${currentPoints + story.points - member.maxPoints} points`,
          duration: 4000,
          className: 'bg-red-950 border-red-900 text-red-200',
          descriptionClassName: 'text-red-300'
        })
        return
      }

      updateStoryAssignee(storyId, memberId)
      toast.success('Story reassigned', {
        description: `Assigned to ${member.name}`,
        className: 'bg-emerald-950 border-emerald-900'
      })
    } else if (targetId === 'unassigned') {
      updateStoryAssignee(storyId, undefined)
      toast.info('Story unassigned', {
        description: 'Story moved to unassigned section',
        className: 'bg-zinc-950 border-zinc-900'
      })
    }
  }

  const assignedStories = stories.filter(story => story.assignee)
  const unassignedStories = stories.filter(story => !story.assignee)
  if (stories.length === 0) return null

  const memberMap = new Map(teamMembers.map(member => [member.id, member]))
  type MemberData = { stories: Story[], totalPoints: number }
  const storiesByMember = new Map<string, MemberData>(
    teamMembers.map(member => [member.id, { stories: [], totalPoints: 0 }])
  )
  
  // Fill in the stories for members who have them
  assignedStories.forEach(story => {
    const memberId = story.assignee!
    const memberData = storiesByMember.get(memberId)!
    memberData.stories.push(story)
    memberData.totalPoints += story.points
  })

  const totalPoints = Array.from(storiesByMember.values()).reduce((acc, { totalPoints }) => acc + totalPoints, 0)
  const averagePoints = storiesByMember.size > 0 ? totalPoints / storiesByMember.size : 0
  const unassignedPoints = unassignedStories.reduce((acc, story) => acc + story.points, 0)

  const activeStory = activeId ? stories.find(s => s.id === activeId) : null

  return (
    <DndContext
      sensors={sensors}
      modifiers={[restrictToVerticalAxis]}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
    >
      <div className="space-y-6">
        <div className="flex items-center gap-2 text-white">
          <ListChecks className="h-5 w-5 text-indigo-400" />
          <h2 className="text-lg font-medium">Assignments</h2>
        </div>

        <div className="flex items-center gap-3 text-sm">
          <div className="rounded-full bg-[#27272A] px-3 py-1 text-zinc-100 ring-1 ring-inset ring-[#3F3F46]">
            {totalPoints} assigned points
          </div>
          {unassignedPoints > 0 && (
            <>
              <ChevronRight className="h-4 w-4 text-zinc-400" />
              <div className="rounded-full bg-red-500/20 px-3 py-1 text-red-200 ring-1 ring-inset ring-red-500/30">
                {unassignedPoints} unassigned points
              </div>
            </>
          )}
          {storiesByMember.size > 0 && (
            <>
              <ChevronRight className="h-4 w-4 text-zinc-400" />
              <div className="rounded-full bg-[#27272A] px-3 py-1 text-zinc-100 ring-1 ring-inset ring-[#3F3F46]">
                {averagePoints.toFixed(1)} points per member
              </div>
            </>
          )}
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="grid gap-4"
        >
          {/* Empty Team Members Row */}
          {(() => {
            const emptyMembers = Array.from(storiesByMember.entries())
              .filter(([_, data]) => data.stories.length === 0)
            
            if (emptyMembers.length > 0) {
              return (
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <div className="h-px flex-1 bg-zinc-800" />
                    <h4 className="text-xs font-medium text-zinc-500">Available Team Members</h4>
                    <div className="h-px flex-1 bg-zinc-800" />
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {emptyMembers.map(([memberId]) => {
                      const member = memberMap.get(memberId)
                      if (!member) return null
                      
                      return (
                        <DroppableSection
                          key={memberId}
                          id={`member-${memberId}`}
                          className="rounded-lg bg-[#27272A] ring-1 ring-inset ring-[#3F3F46] overflow-hidden
                            hover:ring-[#52525B] transition-colors w-[120px]"
                        >
                          <div className="p-4 flex flex-col items-center gap-2 h-[120px] justify-center text-center">
                            <h3 className="text-sm font-medium text-white">
                              {capitalizeFirstLetter(member.name)}
                            </h3>
                            <div className="flex flex-col items-center gap-1">
                              <div className="text-xs text-zinc-400">
                                Ready for stories
                              </div>
                              {member.maxPoints && (
                                <div className="px-2 py-0.5 rounded-full text-xs font-medium ring-1 ring-inset
                                  bg-indigo-500/10 text-indigo-200 ring-indigo-500/20">
                                  Max {member.maxPoints} pts
                                </div>
                              )}
                            </div>
                          </div>
                        </DroppableSection>
                      )
                    })}
                  </div>
                </div>
              )
            }
            return null
          })()}

          {/* Unassigned Stories Section */}
          {unassignedStories.length > 0 && (
            <>
              <div className="flex items-center gap-2">
                <div className="h-px flex-1 bg-zinc-800" />
                <h4 className="text-xs font-medium text-zinc-500">Stories Needing Assignment</h4>
                <div className="h-px flex-1 bg-zinc-800" />
              </div>
              <DroppableSection
                id="unassigned"
                className="rounded-lg bg-[#27272A] ring-1 ring-inset ring-[#3F3F46] overflow-hidden"
              >
                <div className="flex items-center justify-between p-4 bg-[#323238]">
                  <div>
                    <h3 className="font-medium text-red-200">Unassigned Stories</h3>
                    <p className="text-sm text-zinc-300">
                      {unassignedStories.length} stories • {unassignedPoints} points
                    </p>
                  </div>
                  <div className="px-3 py-1 rounded-full text-xs font-medium ring-1 ring-inset bg-red-500/20 text-red-200 ring-red-500/30">
                    Cannot assign
                  </div>
                </div>

                <div className="p-2 space-y-1">
                  {unassignedStories.map(story => (
                    <StoryItem 
                      key={story.id} 
                      story={story}
                      isDragging={activeId === story.id}
                    />
                  ))}
                </div>
              </DroppableSection>
            </>
          )}

          {/* Members with Stories */}
          {(() => {
            const activeMembers = Array.from(storiesByMember.entries())
              .filter(([_, data]) => data.stories.length > 0)
            
            if (activeMembers.length > 0) {
              return (
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <div className="h-px flex-1 bg-zinc-800" />
                    <h4 className="text-xs font-medium text-zinc-500">Active Assignments</h4>
                    <div className="h-px flex-1 bg-zinc-800" />
                  </div>
                  <div className="grid gap-4">
                    {activeMembers.map(([memberId, memberData]) => {
                      const variance = Math.abs(memberData.totalPoints - averagePoints)
                      const status = variance <= 2 ? 'balanced' : memberData.totalPoints > averagePoints ? 'high' : 'low'
                      const statusColors = {
                        balanced: {
                          bg: 'bg-emerald-500/20',
                          text: 'text-emerald-200',
                          ring: 'ring-emerald-500/30'
                        },
                        high: {
                          bg: 'bg-amber-500/20',
                          text: 'text-amber-200',
                          ring: 'ring-amber-500/30'
                        },
                        low: {
                          bg: 'bg-sky-500/20',
                          text: 'text-sky-200',
                          ring: 'ring-sky-500/30'
                        }
                      }
                      
                      return (
                        <DroppableSection
                          key={memberId}
                          id={`member-${memberId}`}
                          className="rounded-lg bg-[#27272A] ring-1 ring-inset ring-[#3F3F46] overflow-hidden"
                        >
                          <div className="flex items-center justify-between p-4 bg-[#323238]">
                            <div>
                              <h3 className="font-medium text-white">
                                {(() => {
                                  const name = memberMap.get(memberId)?.name
                                  if (!name) return ''
                                  return capitalizeFirstLetter(name)
                                })()}
                              </h3>
                              <p className="text-sm text-zinc-300">
                                {memberData.stories.length} stories assigned
                                {memberMap.get(memberId)?.maxPoints && ` • ${memberData.totalPoints}/${memberMap.get(memberId)?.maxPoints} points`}
                              </p>
                            </div>
                            <div className={`px-3 py-1 rounded-full text-xs font-medium ring-1 ring-inset
                              ${statusColors[status].bg} ${statusColors[status].text} ${statusColors[status].ring}`}
                            >
                              {(() => {
                                const member = memberMap.get(memberId)
                                if (member?.maxPoints && memberData.totalPoints > member.maxPoints) {
                                  return `${memberData.totalPoints}/${member.maxPoints} (Over capacity)`
                                }
                                return `${memberData.totalPoints} points`
                              })()}
                            </div>
                          </div>

                          <div className="p-2 space-y-1">
                            {memberData.stories.length === 0 ? (
                              <div className="px-3 py-4 text-center">
                                <p className="text-sm text-zinc-400">No stories assigned</p>
                                <p className="text-xs text-zinc-500 mt-1">Drag stories here to assign them</p>
                              </div>
                            ) : (
                              memberData.stories.map((story: Story) => (
                                <StoryItem 
                                  key={story.id} 
                                  story={story}
                                  isDragging={activeId === story.id}
                                />
                              ))
                            )}
                          </div>
                        </DroppableSection>
                      )
                    })}
                  </div>
                </div>
              )
            }
            return null
          })()}
        </motion.div>

        <DragOverlay>
          {activeStory && (
            <StoryItem story={activeStory} isOverlay />
          )}
        </DragOverlay>
      </div>
    </DndContext>
  )
} 