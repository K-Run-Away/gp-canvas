# GP Mate

GP Mate is a clinical reference lookup tool designed to streamline access to British National Formulary (BNF) medication information and NICE Clinical Knowledge Summaries (CKS) guidelines. This tool is specifically designed for healthcare professionals in the UK to quickly access reliable clinical information.

## Live Demo
Visit the live application at [https://gp-canvas.vercel.app](https://gp-canvas.vercel.app)

## Features

- **Adult BNF Search**: Quick access to adult medication information from the BNF
- **Children's BNF Search**: Dedicated search for pediatric medication information from the BNFC
- **BNF Interactions Search**: Easy lookup of medication interactions
- **NICE CKS Guidelines Search**: Fast access to clinical guidelines for various conditions
- **Auto-complete Suggestions**: Real-time search suggestions as you type
- **UK-Specific Access**: Optimized for use within the UK healthcare system

## Prerequisites

Before you begin, ensure you have installed:
- Node.js (v14 or higher)
- npm (comes with Node.js)

## Installation

1. Clone the repository:
```bash
git clone https://github.com/K-Run-Away/gp-canvas.git
cd gp-canvas
```

2. Install dependencies:
```bash
npm install
```

3. Create necessary data files:
- Place your medication list in `data/medications.csv`
- Place your conditions list in `data/conditions.csv`

4. Start the development server:
```bash
npm run dev
```

The application will be available at `http://localhost:3000` (or the next available port if 3000 is in use).

## Usage

### Medication Search
1. Select the appropriate search box (Adult BNF, Children's BNF, or Interactions)
2. Begin typing the medication name
3. Select from the auto-complete suggestions or continue typing
4. Click the search button or press Enter to access the BNF page

### CKS Guidelines Search
1. Use the purple CKS search box
2. Type the condition name
3. Select from the suggestions or continue typing
4. Click search or press Enter to access the NICE CKS guidelines

## Important Notes

- BNF access is restricted to users within the UK (England, Scotland, Wales, and Northern Ireland)
- Users outside the UK will need a MedicinesComplete subscription to access BNF content
- The application requires an active internet connection to access BNF and CKS websites

## Technical Details

- Built with Next.js 14
- TypeScript for type safety
- Tailwind CSS for styling
- CSV-based data management for medications and conditions
- Server-side API routes for search functionality
- Responsive design for various screen sizes

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Disclaimer

This tool is designed to provide quick access to official BNF and NICE CKS resources. It does not store or provide medical information directly. Always refer to official sources and use professional judgment when making clinical decisions.

## Deployment

### Deploy to Vercel (Recommended)
The easiest way to deploy your Next.js app is to use [Vercel](https://vercel.com), the platform created by the creators of Next.js.

1. Create a Vercel account at https://vercel.com
2. Install the Vercel CLI:
```bash
npm install -g vercel
```
3. Run the deployment command:
```bash
vercel
```
4. Follow the prompts to deploy your application

The deployment will provide you with a URL where your application is live.

### Environment Variables
If you need to set up environment variables for your deployment:
1. Create a `.env.local` file in your project root
2. Add any necessary environment variables
3. In Vercel, add these same environment variables in your project settings

### Alternative Deployment Options
While Vercel is recommended, you can also deploy your Next.js application to other platforms that support Node.js server-side rendering, such as:
- AWS Elastic Beanstalk
- Google Cloud Run
- Heroku
- Digital Ocean App Platform

Note: Static hosting platforms like GitHub Pages won't work properly with this application as it requires server-side functionality.

