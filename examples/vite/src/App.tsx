import { Button, Card, CardDescription, CardTitle } from "trek-ui";

function App() {
  return (
    <div>
      <h1 className="bg-amber-500 text-white font-bold">Tailwind (this work)</h1>
      <Button variant="ghost">test button</Button>
      <Card>
        <CardTitle>A title (not working)</CardTitle>
        <CardDescription> A Decs (not working)</CardDescription>
      </Card>
    </div>
  );
}

export default App;
