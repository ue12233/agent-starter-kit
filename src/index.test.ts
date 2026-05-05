import test from "node:test";
import assert from "node:assert/strict";

import { renderIntro, starterFeatures, type StarterFeature } from "./index.js";

test("starterFeatures exposes the public starter capabilities", () => {
  assert.equal(starterFeatures.length, 3);
  assert.deepEqual(
    starterFeatures.map((feature) => feature.name),
    ["Agent-first structure", "MCP-ready layout", "Ship-fast defaults"],
  );
});

test("renderIntro renders all supplied features without mutating input", () => {
  const features: StarterFeature[] = [
    { name: "Typed APIs", description: "Use strict TypeScript by default." },
    { name: "Runnable examples", description: "Keep demos easy to verify." },
  ];

  const intro = renderIntro(features);

  assert.match(intro, /^agent-kit\n\n/);
  assert.match(intro, /- Typed APIs: Use strict TypeScript by default\./);
  assert.match(intro, /- Runnable examples: Keep demos easy to verify\./);
  assert.deepEqual(features, [
    { name: "Typed APIs", description: "Use strict TypeScript by default." },
    { name: "Runnable examples", description: "Keep demos easy to verify." },
  ]);
});

test("renderIntro defaults to the starter feature list", () => {
  const intro = renderIntro();

  for (const feature of starterFeatures) {
    assert.ok(intro.includes(`- ${feature.name}: ${feature.description}`));
  }
});
