export interface StarterFeature {
  name: string;
  description: string;
}

const features: StarterFeature[] = [
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
];

function renderIntro(items: StarterFeature[]): string {
  const lines = items.map((item) => `- ${item.name}: ${item.description}`);

  return [
    "ai-agent-starter",
    "",
    "Build AI agent products with a repo structure designed for speed, demos, and iteration.",
    "",
    ...lines,
  ].join("\n");
}

console.log(renderIntro(features));
