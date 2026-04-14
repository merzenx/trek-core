import {
  Badge,
  Button,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
  Input,
  Label,
  Separator,
} from "trek-core/ui";
import { toast } from "sonner";
import { useTheme, Theme } from "trek-core";
import { useWasm } from "../hooks/use-wasm";
import * as React from "react";
import { ChevronDownIcon, Loader2 } from "lucide-react";

function App() {
  const { setTheme, theme } = useTheme();
  const { ready, wasm, error, loading } = useWasm();
  const [n, setN] = React.useState(1_000_000);
  const [result, setResult] = React.useState<{ value: number; time: number } | null>(null);
  const [isRunning, setIsRunning] = React.useState(false);

  const onClickCallWASM = () => {
    if (!ready || !n || isRunning) return;
    setIsRunning(true);
    setResult(null);

    const start = performance.now();
    const res = wasm.loop_with_count(n);
    const elapsed = performance.now() - start;

    setResult({ value: res, time: elapsed });
    toast.success(`WASM completed in ${elapsed.toFixed(2)}ms`);
    setIsRunning(false);
  };

  React.useEffect(() => {
    if (error) {
      toast.error("Failed to load WASM module");
    }
  }, [error]);

  return (
    <div className="min-h-screen bg-linear-to-b from-background to-muted/20 flex flex-col items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl w-full space-y-8">
        {/* Header Section */}
        <div className="text-center space-y-4">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Badge variant="secondary" className="text-sm">
              v1.0.0
            </Badge>
            {loading && <Badge variant="outline">Loading WASM...</Badge>}
            {ready && <Badge variant="default">WASM Ready</Badge>}
          </div>
          <h1 className="text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl">
            UI Components for <span className="text-primary">Trek</span> Projects
          </h1>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Beautifully designed, fully customizable components built with Tailwind CSS and Shadcn
            UI
          </p>
        </div>

        {/* Theme Selector */}
        <Card className="w-full max-w-lg mx-auto">
          <CardHeader>
            <CardTitle>Appearance</CardTitle>
            <CardDescription>Choose your preferred theme</CardDescription>
          </CardHeader>
          <CardContent>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="w-full justify-between">
                  {theme}
                  <ChevronDownIcon className="ml-2 h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                align="center"
                className="w-[var(--radix-dropdown-menu-trigger-width)]"
              >
                {Object.values(Theme).map((themeOption) => (
                  <DropdownMenuCheckboxItem
                    key={themeOption}
                    checked={theme === themeOption}
                    onSelect={() => setTheme(themeOption)}
                  >
                    {themeOption}
                  </DropdownMenuCheckboxItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          </CardContent>
        </Card>

        {/* Performance Test Section */}
        <Card className="w-full max-w-lg mx-auto">
          <CardHeader>
            <CardTitle>Performance Testing</CardTitle>
            <CardDescription>
              Test WASM module performance with different iteration counts
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="iterations">Number of Iterations</Label>
              <Input
                id="iterations"
                type="number"
                min="1"
                value={n}
                onChange={({ target }) => setN(Math.max(1, Number(target.value)))}
                disabled={isRunning}
              />
            </div>

            <Button
              onClick={onClickCallWASM}
              disabled={!ready || isRunning}
              size="lg"
              className="w-full"
            >
              {isRunning ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Running...
                </>
              ) : (
                `Run ${n.toLocaleString()} Iterations`
              )}
            </Button>

            {/* Results Display */}
            {result && (
              <div className="rounded-lg border bg-muted/50 p-4 space-y-3">
                <h3 className="font-semibold text-sm">Results</h3>
                <Separator />
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <p className="text-sm text-muted-foreground">Return Value</p>
                    <p className="text-2xl font-bold font-mono">{result.value.toLocaleString()}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm text-muted-foreground">Execution Time</p>
                    <p className="text-2xl font-bold font-mono">{result.time.toFixed(2)}ms</p>
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Footer */}
        <div className="text-center text-sm text-muted-foreground pt-4">
          <p>Built with React, TypeScript, and Rust/WASM</p>
        </div>
      </div>
    </div>
  );
}

export default App;
