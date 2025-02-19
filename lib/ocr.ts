import { createWorker } from 'tesseract.js'

function cleanAndFormatTitle(title: string): string {
  // Remove any extra whitespace and special characters
  let cleaned = title
    .replace(/\s+/g, ' ') // Replace multiple spaces with single space
    .replace(/[^\w\s-]/g, '') // Remove special characters except hyphens
    .trim()

  // Capitalize the first letter of each sentence
  cleaned = cleaned
    .split('. ')
    .map(sentence => sentence.charAt(0).toUpperCase() + sentence.slice(1).toLowerCase())
    .join('. ')

  // If no sentences were found, just capitalize the first letter
  if (!cleaned.includes('. ')) {
    cleaned = cleaned.charAt(0).toUpperCase() + cleaned.slice(1).toLowerCase()
  }

  return cleaned
}

export async function processImage(imageFile: File): Promise<{ title: string; points: number }[]> {
  // Create worker with English language
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
        const rawTitle = line.replace(match[1], '').trim()
        return {
          title: cleanAndFormatTitle(rawTitle),
          points: parseInt(match[1], 10)
        }
      }
      return null
    }).filter((story): story is { title: string; points: number } => 
      story !== null && !isNaN(story.points) && story.points > 0 && story.title.length > 0
    )
    
    return stories
  } finally {
    await worker.terminate()
  }
} 