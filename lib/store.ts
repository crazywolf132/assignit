import { create } from 'zustand'

interface TeamMember {
  id: string
  name: string
  maxPoints?: number
}

export interface Story {
  id: string
  title: string
  points: number
  assignee?: string
}

interface AssignmentStore {
  teamMembers: TeamMember[]
  stories: Story[]
  addTeamMember: (name: string, maxPoints?: number) => void
  removeTeamMember: (id: string) => void
  setStories: (stories: Story[]) => void
  assignStories: () => void
  updateStoryAssignee: (storyId: string, assigneeId?: string) => void
  clearAll: () => void
}

export const useAssignmentStore = create<AssignmentStore>((set) => ({
  teamMembers: [],
  stories: [],
  
  addTeamMember: (name: string, maxPoints?: number) => set((state) => ({
    teamMembers: [...state.teamMembers, { 
      id: crypto.randomUUID(), 
      name,
      maxPoints 
    }]
  })),
  
  removeTeamMember: (id: string) => set((state) => ({
    teamMembers: state.teamMembers.filter((member) => member.id !== id)
  })),
  
  setStories: (stories: Story[]) => set({ stories }),
  
  assignStories: () => set((state) => {
    if (state.teamMembers.length === 0) return state
    
    const sortedStories = [...state.stories].sort((a, b) => b.points - a.points)
    const memberWorkloads = new Map(state.teamMembers.map(member => [member.id, 0]))
    
    const assignedStories = sortedStories.map(story => {
      const availableMembers = state.teamMembers.filter(member => {
        const currentLoad = memberWorkloads.get(member.id) || 0
        return !member.maxPoints || currentLoad + story.points <= member.maxPoints
      })
      
      if (availableMembers.length === 0) {
        return { ...story } // Leave unassigned if no available members
      }
      
      const memberEntries = Array.from(memberWorkloads.entries())
        .filter(([memberId]) => 
          availableMembers.some(m => m.id === memberId)
        )
      
      const [memberId] = memberEntries.reduce((min, curr) => 
        curr[1] < min[1] ? curr : min
      )
      
      memberWorkloads.set(memberId, (memberWorkloads.get(memberId) || 0) + story.points)
      
      return {
        ...story,
        assignee: memberId
      }
    })
    
    return { stories: assignedStories }
  }),
  
  updateStoryAssignee: (storyId: string, assigneeId?: string) => set((state) => ({
    stories: state.stories.map(story => 
      story.id === storyId ? { ...story, assignee: assigneeId } : story
    )
  })),
  
  clearAll: () => set({ teamMembers: [], stories: [] })
})) 