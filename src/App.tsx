import { useState } from 'react'
import { Button } from "@/components/ui/button"

function App() {
  const [count, setCount] = useState(0)

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-slate-100 p-6">
      <div className="max-w-md w-full bg-white dark:bg-slate-800 rounded-xl shadow-lg p-8 border border-slate-200 dark:border-slate-700 text-center">
        <h1 className="text-3xl font-extrabold tracking-tight mb-2 text-indigo-600 dark:text-indigo-400">
          Trip Planner SPA
        </h1>
        <p className="text-sm text-slate-500 dark:text-slate-400 mb-6">
          React + TypeScript + Tailwind v4 + shadcn/ui configured successfully.
        </p>
        <div className="space-y-4">
          <Button 
            onClick={() => setCount((c) => c + 1)}
            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-medium"
          >
            Count is: {count}
          </Button>
          <p className="text-xs text-slate-400 dark:text-slate-500">
            Edit <code className="font-mono text-indigo-500">src/App.tsx</code> to begin building your application!
          </p>
        </div>
      </div>
    </div>
  )
}

export default App
