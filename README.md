# Assign It

A Next.js application for automatically assigning stories to team members using AI. This tool helps distribute work evenly among team members by analyzing screenshots of stories and their story points.

## Features

- Upload screenshots of stories with story points
- Automatically extract story information using OCR
- Add and remove team members easily
- Automatically assign stories while balancing workload
- Clean, minimal, and professional UI design
- Dark mode support
- No accounts required - single-use purpose

## Getting Started

1. Clone the repository
2. Install dependencies:
   ```bash
   pnpm install
   ```
3. Run the development server:
   ```bash
   pnpm dev
   ```
4. Open [http://localhost:3000](http://localhost:3000) in your browser

## How to Use

1. Add team members using the input field in the "Team Members" section
2. Take a screenshot of your stories that includes:
   - Story titles/descriptions
   - Story point numbers (should be at the end of each line)
3. Drag and drop the screenshot into the upload area
4. The application will:
   - Extract story information using OCR
   - Automatically assign stories to team members
   - Display the assignments with point distribution

## Technologies Used

- Next.js 14
- TypeScript
- Tailwind CSS
- shadcn/ui
- Tesseract.js for OCR
- Zustand for state management
- React Dropzone for file uploads

## Development

This project uses:
- `pnpm` as the package manager
- `next` for the framework
- `shadcn/ui` for components
- `tailwindcss` for styling

## License

MIT
