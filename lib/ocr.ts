import { createWorker } from 'tesseract.js'

export async function processImage(imageFile: File): Promise<{ title: string; points: number }[]> {
  const worker = await createWorker('eng')
  
  try {
    const imageUrl = URL.createObjectURL(imageFile)
    const { data: { text } } = await worker.recognize(imageUrl)
    
    // Clean up the object URL
    URL.revokeObjectURL(imageUrl)
    
    // Parse the text to extract stories and points
    const lines = text.split('\n').filter(line => line.trim())
    const stories = lines.map(line => {
      // Look for numbers that could be story points at the end of the line
      const match = line.match(/.*?(\d+)\s*$/)
      if (match) {
        return {
          title: line.replace(match[1], '').trim(),
          points: parseInt(match[1], 10)
        }
      }
      return null
    }).filter((story): story is { title: string; points: number } => 
      story !== null && !isNaN(story.points) && story.points > 0
    )
    
    return stories
  } finally {
    await worker.terminate()
  }
} 