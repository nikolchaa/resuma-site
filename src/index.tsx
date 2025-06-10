import { hydrate, prerender as ssr } from "preact-iso";

import "./style.css";
import { Button } from "./components/ui/button";

export function App() {
  return (
    <div className={"flex h-screen items-center justify-center"}>
      <Button>Click Me</Button>
    </div>
  );
}

if (typeof window !== "undefined") {
  hydrate(<App />, document.getElementById("app"));
}

export async function prerender(data) {
  return await ssr(<App {...data} />);
}
