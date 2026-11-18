import assert from "node:assert/strict";
import test from "node:test";
import {
  parseJson,
  validateRelease,
  validateTheme,
} from "../scripts/validate.mjs";

const contribution = { label: "Example", path: "./themes/example.json" };
function theme() {
  return {
    name: "Example",
    colors: { "editor.background": "#fff", "editor.foreground": "#000000ff" },
    tokenColors: [
      {
        scope: ["comment"],
        settings: { foreground: "#1234", fontStyle: "italic bold" },
      },
    ],
    semanticHighlighting: true,
    semanticTokenColors: {
      "variable.readonly:javascript": { foreground: "#123456", bold: true },
    },
  };
}

test("strict JSON rejects malformed files and silently overridden duplicate keys", () => {
  assert.equal(parseJson('{"a":{"b":1}}', "example").a.b, 1);
  for (const text of [
    '{"a":1,}',
    '{"a":1,"a":2}',
    '{"a":{"b":1,"b":2}}',
    '{"a": /* comment */ 1}',
  ]) {
    assert.throws(
      () => parseJson(text, "example"),
      /invalid JSON|duplicate key/,
    );
  }
});

test("validates supported color formats and TextMate and semantic styles", () => {
  validateTheme(theme(), contribution);
});

test("rejects invalid theme colors, styles, scopes, and mismatched labels", () => {
  const cases = [
    [
      (value) => {
        value.colors["editor.background"] = "#12345";
      },
      /invalid color/,
    ],
    [
      (value) => {
        value.tokenColors[0].settings.fontStyle = "blink";
      },
      /invalid fontStyle/,
    ],
    [
      (value) => {
        value.tokenColors[0].settings.background = "#fff";
      },
      /unsupported setting/,
    ],
    [
      (value) => {
        value.tokenColors[0].scope = [];
      },
      /invalid token scope/,
    ],
    [
      (value) => {
        value.semanticTokenColors["variable.readonly:javascript"].bold = "yes";
      },
      /expected a boolean/,
    ],
    [
      (value) => {
        value.semanticTokenColors["variable:javascript:invalid"] = "#fff";
      },
      /invalid semantic selector/,
    ],
    [
      (value) => {
        value.name = "Wrong";
      },
      /picker label/,
    ],
  ];
  for (const [mutate, error] of cases) {
    const value = theme();
    mutate(value);
    assert.throws(() => validateTheme(value, contribution), error);
  }
});

test("publishing accepts only a matching version and an approved source ref", () => {
  validateRelease("1.0.1", {
    expectedVersion: "1.0.1",
    ref: "refs/heads/main",
  });
  validateRelease("1.0.2", { releaseTag: "v1.0.2", ref: "refs/tags/v1.0.2" });
  for (const options of [
    { expectedVersion: "1.0.0" },
    { releaseTag: "v1.0.0" },
    { releaseTag: "1.0.1" },
    { ref: "refs/heads/feature" },
    { ref: "refs/tags/v1.0.0" },
  ]) {
    assert.throws(() => validateRelease("1.0.1", options));
  }
});
