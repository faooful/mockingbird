import WireframeGrid from "@/components/WireframeGrid";

export default function Home() {
  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border bg-card">
        <div className="container mx-auto px-4 py-6">
          <div className="text-center">
            <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Mockingbird Wireframe Tool
            </h1>
            <p className="text-muted-foreground mt-2">
              Create wireframes with drag-and-drop components
            </p>
          </div>
        </div>
      </header>
      <main className="flex h-[calc(100vh-140px)]">
        <div className="flex-1 overflow-auto">
          <div className="container mx-auto px-4 py-8 max-w-4xl">
            <div className="space-y-6">
              {/* Instructions */}
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <h3 className="font-semibold text-blue-900 mb-2">How to use:</h3>
                <ul className="text-sm text-blue-800 space-y-1">
                  <li>• Click on any empty cell to add content</li>
                  <li>• Click on content to select and edit properties in the right panel</li>
                  <li>• Drag the resize handles to make content span across multiple cells</li>
                  <li>• Hover over content and click the × button to delete</li>
                  <li>• Use the toolbar to adjust grid size and export your wireframe</li>
                </ul>
              </div>
              
              <WireframeGrid />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}