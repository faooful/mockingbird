# Mockingbird 🐦

**A visual wireframing tool for rapid prototyping and user journey mapping**

Mockingbird is a modern, intuitive wireframing application that helps designers and developers quickly create layouts and visualize user flows. Built with Next.js and shadcn/ui, it bridges the gap between design and development by generating AI-ready prompts from your wireframes.

![Pages View](public/screenshots/pages.png)
*Wireframe editor with drag-and-drop components*

![Journeys View](public/screenshots/journeys.png)
*User journey mapping with visual flow connections*

![Preview](public/screenshots/preview.png)
*Preview your layout before exporting*

![Export](public/screenshots/export.png)
*Generate AI-ready prompts from your wireframes*

## ✨ Features

### 📐 Visual Wireframing
- **Drag-and-drop interface** - Easily place UI components on a responsive grid
- **Component library** - Pre-built shadcn/ui components including buttons, inputs, tables, charts, and more
- **Flexible grid system** - Customize rows and columns to match your design
- **Responsive preview** - Toggle between desktop and mobile views
- **Real-time editing** - Adjust component properties on the fly

### 🗺️ Journey Mapping
- **Visual flow designer** - Connect components to pages to create user journeys
- **Interactive connections** - See how users navigate through your application
- **Multi-page support** - Design complex flows across multiple screens
- **Connection management** - Easily create and remove navigation paths

### 🤖 AI-Powered Export
- **Prompt generation** - Automatically generate detailed prompts for AI code generation
- **CSS Grid layouts** - Export uses modern CSS Grid with explicit positioning
- **Copy-paste ready** - One-click copy to share with AI assistants or developers
- **Visual preview** - See how your layout will render before exporting

### 💾 Persistence
- **Local storage** - Your wireframes automatically save to your browser
- **Session recovery** - Pick up right where you left off
- **Multi-page projects** - Create and manage multiple pages in one project

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ 
- npm, yarn, pnpm, or bun

### Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/mockingbird.git
cd mockingbird
```

2. Install dependencies:
```bash
npm install
# or
yarn install
# or
pnpm install
```

3. Run the development server:
```bash
npm run dev
# or
yarn dev
# or
pnpm dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser

## 🎨 How to Use

### Creating a Wireframe

1. **Add Components** - Browse the component sidebar and drag components onto the grid
2. **Arrange Layout** - Resize and position components using the resize handles
3. **Customize Properties** - Click on a component to edit its text, variants, and other properties
4. **Adjust Grid** - Use the row/column controls to change the grid dimensions

### Mapping User Journeys

1. **Switch to Journeys** - Click the "Journeys" tab in the header
2. **Create Connections** - Click a component, then click a destination page to create a path
3. **View Flow** - See the visual representation of your user's journey
4. **Edit Pages** - Click "Edit in Pages" to return to the wireframe view

### Exporting Your Design

1. **Click Export** - Use the Export button in the header
2. **Copy Prompt** - Copy the generated prompt describing your layout
3. **Use with AI** - Paste into your favorite AI coding assistant (Cursor, Claude, ChatGPT, etc.)
4. **Build Faster** - Let AI generate the initial code structure based on your wireframe

## 🛠️ Built With

- [Next.js 15](https://nextjs.org/) - React framework with App Router
- [React 19](https://react.dev/) - UI library
- [TypeScript](https://www.typescriptlang.org/) - Type safety
- [Tailwind CSS](https://tailwindcss.com/) - Utility-first styling
- [shadcn/ui](https://ui.shadcn.com/) - High-quality component library
- [Recharts](https://recharts.org/) - Data visualization

## 📁 Project Structure

```
mockingbird/
├── src/
│   ├── app/              # Next.js app router
│   ├── components/       # React components
│   │   ├── ui/          # shadcn/ui components
│   │   ├── WireframeGrid.tsx      # Main grid component
│   │   ├── ComponentSidebar.tsx   # Component library
│   │   ├── JourneyCanvas.tsx      # Journey mapping view
│   │   ├── ExportModal.tsx        # Prompt generation
│   │   └── ...
│   ├── lib/             # Utilities
│   └── hooks/           # Custom React hooks
├── public/              # Static assets
└── ...
```

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

## 🙏 Acknowledgments

- Built with [shadcn/ui](https://ui.shadcn.com/) components
- Inspired by the need for better designer-developer collaboration
- Made possible by modern web technologies and AI-assisted development

---

**Happy wireframing!** 🎨✨
