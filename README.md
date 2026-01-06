# App Idea Analyzer

An intelligent web application that helps entrepreneurs and founders evaluate their product ideas through comprehensive analysis. Built with Next.js, TypeScript, and powered by AI.

## 🎯 What It Does

The App Idea Analyzer evaluates your startup idea across 9 critical dimensions:

- **Team Fit** - How well suited you are to build this product
- **Build Complexity** - Technical difficulty and development timeline
- **Competition** - Market saturation and competitive landscape
- **Financials** - Revenue potential and unit economics
- **User Acquisition** - Go-to-market strategy and growth potential
- **Technical Risk** - Development risks and technical challenges
- **Defensibility** - Competitive moats and barriers to entry
- **Capital Efficiency** - Resource requirements vs. potential returns
- **Pivot Potential** - Flexibility and adaptation opportunities

## ✨ Features

- **Interactive Multi-Step Form** - Clean, intuitive interface for capturing product and founder context
- **AI-Powered Analysis** - Comprehensive evaluation using advanced language models
- **Beautiful UI** - Modern design with animated liquid background effects
- **Detailed Reports** - In-depth analysis with actionable insights
- **Data Persistence** - Form data automatically saved between sessions
- **Responsive Design** - Works seamlessly on desktop and mobile

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ 
- npm, yarn, pnpm, or bun
- An Anthropic API key for AI analysis

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd goodcraft-app-idea-analyze
```

2. Install dependencies:
```bash
npm install
# or
yarn install
# or
pnpm install
```

3. Set up environment variables:
```bash
cp .env.example .env.local
```
Add your Anthropic API key to `.env.local`:
```
ANTHROPIC_API_KEY=your_api_key_here
```

4. Run the development server:
```bash
npm run dev
# or
yarn dev
# or
pnpm dev
```

5. Open [http://localhost:3000](http://localhost:3000) in your browser

## 📁 Project Structure

```
├── app/                    # Next.js App Router pages and layouts
│   ├── components/         # Reusable UI components
│   ├── results/           # Analysis results page
│   └── page.tsx           # Main application form
├── components/            # React components
│   └── LiquidEther.tsx   # Animated background component
├── lib/                   # Utility functions and types
│   ├── types.ts          # TypeScript type definitions
│   ├── store.ts          # Local storage utilities
│   └── analysis.ts       # Analysis logic
├── public/               # Static assets
├── test-results/         # Analysis test outputs
├── use-case-analysis/    # Example use cases and analysis
└── v1/                   # Previous version files and examples
```

## 🛠️ Built With

- **[Next.js 16](https://nextjs.org/)** - React framework with App Router
- **[TypeScript](https://www.typescriptlang.org/)** - Type-safe JavaScript
- **[Tailwind CSS](https://tailwindcss.com/)** - Utility-first CSS framework
- **[Anthropic Claude](https://www.anthropic.com/)** - AI analysis engine
- **[Lucide React](https://lucide.dev/)** - Beautiful icons
- **[Three.js](https://threejs.org/)** - 3D graphics for animations
- **[React 19](https://react.dev/)** - Latest React with concurrent features

## 📊 How It Works

1. **Product Input** - Describe your product idea, target users, and key features
2. **Founder Context** - Share your technical skills, experience, and resources
3. **Review** - Verify all information before analysis
4. **AI Analysis** - Comprehensive evaluation across 9 dimensions
5. **Results** - Detailed report with scores, insights, and recommendations

## 🧪 Testing & Quality

The project includes comprehensive test results and quality reports:

- `test-results/` - Analysis outputs and validation tests
- `quality-report/` - Code quality metrics and assessments
- `security-audit/` - Security analysis and recommendations

## 📈 Use Cases

Perfect for:

- **Entrepreneurs** evaluating new startup ideas
- **Product Managers** assessing feature concepts
- **Developers** considering side projects
- **Investors** screening potential investments
- **Accelerators** helping founders refine their ideas

## 🔧 Development

### Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint

### Key Components

- `page.tsx` - Main multi-step form interface
- `results/page.tsx` - Analysis results display
- `lib/types.ts` - Core type definitions
- `components/ui/` - Reusable UI components

## 📋 Environment Variables

```env
ANTHROPIC_API_KEY=your_anthropic_api_key
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

## 🔄 Version History

- **v2.0** (Current) - Complete Next.js rewrite with modern UI and AI analysis
- **v1.0** - Initial prototype (files preserved in `v1/` directory)

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Commit your changes: `git commit -m 'Add amazing feature'`
4. Push to the branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

## 📄 License

This project is private and proprietary.

## 🙋‍♂️ Support

For questions or support, please open an issue in the repository.

---

**Built with ❤️ using Next.js and AI**
