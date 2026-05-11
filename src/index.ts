import path from "node:path";
import { pathToFileURL } from "node:url";

export type ResourceKind = "agent" | "skill" | "mcp" | "tool";

export interface StarterFeature {
  name: string;
  description: string;
}

export interface NavigationResource {
  name: string;
  href: string;
  kind: ResourceKind;
  description: string;
  bestFor: string;
  tags: readonly string[];
}

export interface NavigationSection {
  id: string;
  title: string;
  summary: string;
  resources: readonly NavigationResource[];
}

export const starterFeatures = [
  {
    name: "Agent navigation",
    description: "A compact map of agent frameworks and orchestration choices.",
  },
  {
    name: "Skill directory",
    description: "Reusable skill standards, authoring guides, and prompt playbooks.",
  },
  {
    name: "MCP and tools",
    description: "MCP references, server registries, SDKs, and practical build tools.",
  },
] satisfies readonly StarterFeature[];

export const navigationSections = [
  {
    id: "agents",
    title: "Agent Frameworks",
    summary: "Pick the runtime that matches your control-flow, memory, and deployment needs.",
    resources: [
      {
        name: "OpenAI Agents SDK",
        href: "https://platform.openai.com/docs/guides/agents-sdk/",
        kind: "agent",
        description: "Lightweight SDK for agents with tools, handoffs, guardrails, tracing, and MCP.",
        bestFor: "TypeScript or Python apps that need production-grade agent primitives.",
        tags: ["sdk", "handoffs", "tracing"],
      },
      {
        name: "LangGraph",
        href: "https://docs.langchain.com/oss/javascript/langgraph",
        kind: "agent",
        description: "Low-level orchestration for long-running, stateful, human-in-the-loop agents.",
        bestFor: "Durable workflows where explicit graph state matters more than quick setup.",
        tags: ["orchestration", "state", "memory"],
      },
      {
        name: "Vercel AI SDK Agents",
        href: "https://ai-sdk.dev/docs/agents/overview",
        kind: "agent",
        description: "Agent loops and tool calling that fit naturally into full-stack web apps.",
        bestFor: "Next.js and TypeScript products that stream agent output to users.",
        tags: ["typescript", "streaming", "web"],
      },
      {
        name: "CrewAI",
        href: "https://docs.crewai.com/",
        kind: "agent",
        description: "Framework for role-based multi-agent crews, flows, tasks, and automations.",
        bestFor: "Collaborative agents with clear roles, processes, and enterprise integrations.",
        tags: ["multi-agent", "flows", "roles"],
      },
    ],
  },
  {
    id: "skills",
    title: "Agent Skills",
    summary: "Package repeatable workflows so agents can load the right instructions on demand.",
    resources: [
      {
        name: "Agent Skills Standard",
        href: "https://agentskills.io/",
        kind: "skill",
        description: "Open format for portable skill folders with SKILL.md, scripts, and references.",
        bestFor: "Teams that want reusable, versioned procedures across agent tools.",
        tags: ["standard", "portable", "skill-md"],
      },
      {
        name: "Skills Specification",
        href: "https://agentskills.io/specification",
        kind: "skill",
        description: "Exact SKILL.md frontmatter, directory structure, and validation rules.",
        bestFor: "Writing skills that other clients can discover and load reliably.",
        tags: ["spec", "validation", "frontmatter"],
      },
      {
        name: "Claude Code Skills",
        href: "https://docs.claude.com/en/docs/claude-code/skills",
        kind: "skill",
        description: "Create, manage, invoke, and share Claude Code skills with supporting files.",
        bestFor: "Turning repeated coding workflows into direct slash commands or auto-loaded skills.",
        tags: ["claude-code", "commands", "workflow"],
      },
      {
        name: "Prompt Engineering Guide",
        href: "https://platform.openai.com/docs/guides/prompt-engineering",
        kind: "skill",
        description: "Practical guidance for instructions, context, examples, and structured outputs.",
        bestFor: "Improving the instruction body inside agents, tools, and skills.",
        tags: ["prompting", "instructions", "quality"],
      },
    ],
  },
  {
    id: "mcp",
    title: "MCP Servers",
    summary: "Connect agents to files, APIs, databases, repos, and other live context safely.",
    resources: [
      {
        name: "Model Context Protocol",
        href: "https://modelcontextprotocol.io/docs",
        kind: "mcp",
        description: "Official MCP documentation for clients, servers, tools, resources, and prompts.",
        bestFor: "Understanding the protocol before choosing servers or SDKs.",
        tags: ["protocol", "tools", "resources"],
      },
      {
        name: "MCP Example Servers",
        href: "https://modelcontextprotocol.io/examples",
        kind: "mcp",
        description: "Reference servers for filesystem, Git, memory, fetch, time, and more.",
        bestFor: "Finding a known-good server pattern before writing your own integration.",
        tags: ["examples", "filesystem", "git"],
      },
      {
        name: "MCP TypeScript SDK",
        href: "https://github.com/modelcontextprotocol/typescript-sdk",
        kind: "mcp",
        description: "Official TypeScript SDK for building MCP servers and clients.",
        bestFor: "Node, Bun, or Deno projects that need custom MCP integrations.",
        tags: ["typescript", "sdk", "server"],
      },
      {
        name: "Smithery",
        href: "https://smithery.ai/",
        kind: "mcp",
        description: "Registry for discovering, installing, and publishing community MCP servers.",
        bestFor: "Quickly finding an MCP connector before committing to custom code.",
        tags: ["registry", "discovery", "community"],
      },
    ],
  },
  {
    id: "tools",
    title: "Builder Tools",
    summary: "Round out the agent stack with cookbooks, sandboxes, browser control, and evals.",
    resources: [
      {
        name: "OpenAI Cookbook",
        href: "https://cookbook.openai.com/",
        kind: "tool",
        description: "Runnable recipes for model calls, retrieval, evals, structured output, and agents.",
        bestFor: "Copyable implementation patterns when moving from concept to code.",
        tags: ["recipes", "evals", "retrieval"],
      },
      {
        name: "Claude Code",
        href: "https://docs.claude.com/en/docs/claude-code/overview",
        kind: "tool",
        description: "Terminal coding agent with file editing, command execution, GitHub automation, and MCP.",
        bestFor: "Repository-level implementation, debugging, refactors, and release work.",
        tags: ["coding", "terminal", "mcp"],
      },
      {
        name: "E2B Sandbox",
        href: "https://e2b.dev/docs",
        kind: "tool",
        description: "Secure cloud sandboxes for running agent-generated code and tools.",
        bestFor: "Agents that need isolated execution environments for code or notebooks.",
        tags: ["sandbox", "execution", "isolation"],
      },
      {
        name: "Browser Use",
        href: "https://docs.browser-use.com/",
        kind: "tool",
        description: "Browser automation layer that lets agents inspect and operate web apps.",
        bestFor: "Research, QA, and workflows where the agent must use a real browser.",
        tags: ["browser", "automation", "qa"],
      },
    ],
  },
] satisfies readonly NavigationSection[];

export function getAllResources(
  sections: readonly NavigationSection[] = navigationSections,
): NavigationResource[] {
  return sections.flatMap((section) => [...section.resources]);
}

export function getResourcesByKind(
  kind: ResourceKind,
  sections: readonly NavigationSection[] = navigationSections,
): NavigationResource[] {
  return getAllResources(sections).filter((resource) => resource.kind === kind);
}

export function renderIntro(sections: readonly NavigationSection[] = navigationSections): string {
  const lines = sections.flatMap((section) => [
    `${section.title} (${section.resources.length})`,
    section.summary,
    ...section.resources.map((resource) => `- ${resource.name}: ${resource.bestFor}`),
    "",
  ]);

  return [
    "agent-kit",
    "",
    "A concise navigation hub for agent builders: frameworks, skills, MCP servers, and tools.",
    "",
    ...lines,
  ]
    .join("\n")
    .trimEnd();
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
