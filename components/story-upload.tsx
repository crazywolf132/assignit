'use client'

import { useCallback, useState } from 'react'
import { useDropzone } from 'react-dropzone'
import { Button } from '@/components/ui/button'
import { useAssignmentStore } from '@/lib/store'
import { processImage } from '@/lib/ocr'
import { toast } from 'sonner'
import { Upload, Loader2, X, ImageIcon, RotateCw } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

export function StoryUpload() {
  const [isProcessing, setIsProcessing] = useState(false)
  const { setStories, assignStories, stories } = useAssignmentStore()

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    if (acceptedFiles.length === 0) return

    setIsProcessing(true)
    try {
      const file = acceptedFiles[0]
      const stories = await processImage(file)
      
      if (stories.length === 0) {
        toast.error('No stories found in the image', {
          description: 'Make sure the image contains story titles with point numbers at the end of each line.'
        })
        return
      }

      setStories(stories.map(story => ({
        ...story,
        id: crypto.randomUUID()
      })))
      assignStories()
      
      toast.success('Stories processed successfully', {
        description: `Found ${stories.length} stories with a total of ${stories.reduce((acc, s) => acc + s.points, 0)} points.`
      })
    } catch (error) {
      console.error('Error processing image:', error)
      toast.error('Failed to process image', {
        description: 'There was an error processing your image. Please try again with a clearer image.'
      })
    } finally {
      setIsProcessing(false)
    }
  }, [setStories, assignStories])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.png', '.jpg', '.jpeg']
    },
    maxFiles: 1
  })

  const rootProps = getRootProps()

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 text-white">
        <ImageIcon className="h-5 w-5 text-indigo-400" />
        <h2 className="text-lg font-medium">Upload Stories</h2>
      </div>

      <motion.div
        onClick={rootProps.onClick}
        onKeyDown={rootProps.onKeyDown}
        onFocus={rootProps.onFocus}
        onBlur={rootProps.onBlur}
        whileHover={{ scale: 1.01 }}
        whileTap={{ scale: 0.99 }}
        className={`
          relative overflow-hidden rounded-lg
          bg-[#27272A] ring-1 ring-inset ring-[#3F3F46]
          transition-all duration-200 cursor-pointer
          ${isDragActive ? 'ring-2 ring-indigo-500/50 bg-[#323238]' : 'hover:ring-[#52525B] hover:bg-[#323238]'}
        `}
      >
        <input {...getInputProps()} />
        <AnimatePresence mode="wait">
          <motion.div
            key={isProcessing ? 'processing' : isDragActive ? 'active' : 'inactive'}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="flex flex-col items-center justify-center gap-3 p-8"
          >
            {isProcessing ? (
              <>
                <div className="rounded-full bg-indigo-500/20 p-3">
                  <Loader2 className="h-6 w-6 animate-spin text-indigo-300" />
                </div>
                <p className="text-sm text-zinc-300">Processing image...</p>
              </>
            ) : isDragActive ? (
              <>
                <div className="rounded-full bg-indigo-500/20 p-3">
                  <Upload className="h-6 w-6 text-indigo-300" />
                </div>
                <p className="text-sm font-medium text-indigo-300">Drop to upload</p>
              </>
            ) : (
              <>
                <div className="rounded-full bg-[#323238] p-3">
                  <Upload className="h-6 w-6 text-zinc-300" />
                </div>
                <div className="text-center">
                  <p className="text-sm text-zinc-200">
                    Drag and drop a screenshot, or click to select
                  </p>
                  <p className="text-xs text-zinc-400 mt-1">
                    Supports PNG, JPG, or JPEG
                  </p>
                </div>
              </>
            )}
          </motion.div>
        </AnimatePresence>
      </motion.div>

      <div className="flex justify-end gap-2">
        {stories.length > 0 && (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => {
              assignStories()
              toast.success('Stories reassigned')
            }}
            className="text-zinc-500 hover:text-zinc-300 hover:bg-white/5"
          >
            <RotateCw className="mr-2 h-4 w-4" />
            Recalculate
          </Button>
        )}
        <Button
          variant="ghost"
          size="sm"
          onClick={() => {
            setStories([])
            toast.info('Stories cleared')
          }}
          className="text-zinc-500 hover:text-zinc-300 hover:bg-white/5"
        >
          <X className="mr-2 h-4 w-4" />
          Clear Stories
        </Button>
      </div>
    </div>
  )
} 