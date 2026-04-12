import { Button } from "trek-core/ui";
import { toast } from "sonner";

function App() {

  return (
    <div className="min-h-screen flex flex-col items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl text-center space-y-8">
        <h1 className="text-4xl font-bold sm:text-5xl">
          UI Components for <span className="text-blue-500 font-bold">Trek</span> Projects
        </h1>
        <p className="text-lg">
          Beautifully designed components built with Tailwind CSS and Shadcn UI
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button onClick={() => toast.success("Get Started")} > Get Started</Button>
        </div>
      </div>
    </div>
  );
}

export default App;
