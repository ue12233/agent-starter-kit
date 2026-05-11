import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

import {
  getAllResources,
  getResourcesByKind,
  navigationSections,
  renderIntro,
  starterFeatures,
  type NavigationSection,
} from "./index.js";

const repoRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");

test("starterFeatures exposes the public navigation capabilities", () => {
  assert.equal(starterFeatures.length, 3);
  assert.deepEqual(
    starterFeatures.map((feature) => feature.name),
    ["Agent navigation", "Skill directory", "MCP and tools"],
  );
});

test("navigationSections covers agents, skills, MCP, and tools", () => {
  assert.deepEqual(
    navigationSections.map((section) => section.id),
    ["agents", "skills", "mcp", "tools"],
  );

  for (const section of navigationSections) {
    assert.equal(section.resources.length, 4);
  }
});

test("getAllResources flattens resources without mutating input", () => {
  const sections: NavigationSection[] = [
    {
      id: "agents",
      title: "Agent Frameworks",
      summary: "Pick a runtime.",
      resources: [
        {
          name: "Example Agent",
          href: "https://example.com/agent",
          kind: "agent",
          description: "An agent framework.",
          bestFor: "Testing flattening.",
          tags: ["test"],
        },
      ],
    },
  ];

  const resources = getAllResources(sections);

  assert.equal(resources.length, 1);
  assert.equal(resources[0]?.name, "Example Agent");
  assert.equal(sections[0]?.resources.length, 1);
});

test("getResourcesByKind returns only resources from the requested category", () => {
  const mcpResources = getResourcesByKind("mcp");

  assert.ok(mcpResources.length > 0);
  assert.ok(mcpResources.every((resource) => resource.kind === "mcp"));
});

test("renderIntro defaults to the navigation section list", () => {
  const intro = renderIntro();

  assert.match(intro, /^agent-kit\n\n/);
  assert.match(intro, /frameworks, skills, MCP servers, and tools/);

  for (const section of navigationSections) {
    assert.ok(intro.includes(`${section.title} (${section.resources.length})`));
    for (const resource of section.resources) {
      assert.ok(intro.includes(`- ${resource.name}: ${resource.bestFor}`));
    }
  }
});

test("docs page includes every curated navigation resource", () => {
  const docsPage = readFileSync(path.join(repoRoot, "docs", "index.html"), "utf8");

  assert.match(docsPage, /id="resource-search"/);
  assert.match(docsPage, /data-filter="agent"/);
  assert.match(docsPage, /data-filter="skill"/);
  assert.match(docsPage, /data-filter="mcp"/);
  assert.match(docsPage, /data-filter="tool"/);

  for (const resource of getAllResources()) {
    assert.ok(docsPage.includes(resource.name), `missing resource name: ${resource.name}`);
    assert.ok(docsPage.includes(resource.href), `missing resource href: ${resource.href}`);
  }
});
