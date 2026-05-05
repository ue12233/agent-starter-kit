import path from "node:path";
import { pathToFileURL } from "node:url";

export interface StarterFeature {
  name: string;
  description: string;
}

export const starterFeatures = [
  {
    name: "Agent-first structure",
    description: "A clean project shape for AI agents, tools, prompts, and workflows.",
  },
  {
    name: "MCP-ready layout",
    description: "A place to plug MCP servers and local tools without rethinking the repo.",
  },
  {
    name: "Ship-fast defaults",
    description: "TypeScript, build scripts, examples, and a README made for public launch.",
  },
] satisfies readonly StarterFeature[];

export function renderIntro(items: readonly StarterFeature[] = starterFeatures): string {
  const lines = items.map((item) => `- ${item.name}: ${item.description}`);

  return [
    "agent-kit",
    "",
    "Build AI agent products with a repo structure designed for speed, demos, and iteration.",
    "",
    ...lines,
  ].join("\n");
}

export function main(): void {
  console.log(renderIntro());
}

const isMain = process.argv[1]
  ? import.meta.url === pathToFileURL(path.resolve(process.argv[1])).href
  : false;

if (isMain) {
  main();
}
