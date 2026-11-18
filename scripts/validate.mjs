import assert from "node:assert/strict";
import { execFileSync } from "node:child_process";
import { readFileSync, statSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { getNodeValue, parseTree } from "jsonc-parser";

const root = fileURLToPath(new URL("../", import.meta.url));
const color = /^#(?:[\da-f]{3}|[\da-f]{4}|[\da-f]{6}|[\da-f]{8})$/i;
const fontStyle = /^(?:(?:italic|bold|underline|strikethrough)(?:\s+|$))*$/;

export function parseJson(text, name) {
  const errors = [];
  const tree = parseTree(text, errors, {
    disallowComments: true,
    allowTrailingComma: false,
  });
  assert(tree && errors.length === 0, `${name}: invalid JSON`);
  function checkKeys(node) {
    if (node.type === "object") {
      const keys = new Set();
      for (const property of node.children) {
        const key = property.children[0].value;
        assert(!keys.has(key), `${name}: duplicate key ${key}`);
        keys.add(key);
      }
    }
    node.children?.forEach(checkKeys);
  }
  checkKeys(tree);
  return getNodeValue(tree);
}

function object(value, name) {
  assert(
    value !== null && typeof value === "object" && !Array.isArray(value),
    `${name}: expected an object`,
  );
}

function validateStyle(settings, name, semantic = false) {
  object(settings, name);
  const allowed = semantic
    ? [
        "foreground",
        "fontStyle",
        "bold",
        "italic",
        "underline",
        "strikethrough",
      ]
    : ["foreground", "fontStyle"];
  for (const [key, value] of Object.entries(settings)) {
    assert(allowed.includes(key), `${name}: unsupported setting ${key}`);
    if (key === "foreground") {
      assert(
        typeof value === "string" && color.test(value),
        `${name}: invalid foreground`,
      );
    } else if (key === "fontStyle") {
      assert(
        typeof value === "string" && fontStyle.test(value),
        `${name}: invalid fontStyle`,
      );
    } else {
      assert.equal(
        typeof value,
        "boolean",
        `${name}.${key}: expected a boolean`,
      );
    }
  }
}

export function validateTheme(theme, contribution) {
  object(theme, contribution.path);
  assert.equal(
    theme.name,
    contribution.label,
    "Theme name must match its picker label",
  );
  object(theme.colors, `${theme.name}.colors`);
  for (const [key, value] of Object.entries(theme.colors)) {
    assert(
      typeof value === "string" && color.test(value),
      `${theme.name}.${key}: invalid color`,
    );
  }
  assert(
    theme.colors["editor.background"],
    `${theme.name}: missing editor background`,
  );
  assert(
    theme.colors["editor.foreground"],
    `${theme.name}: missing editor foreground`,
  );
  assert(
    Array.isArray(theme.tokenColors) && theme.tokenColors.length > 0,
    `${theme.name}: missing token colors`,
  );
  for (const rule of theme.tokenColors) {
    object(rule, `${theme.name}: token rule`);
    if (rule.scope !== undefined) {
      const scopes = Array.isArray(rule.scope) ? rule.scope : [rule.scope];
      assert(
        scopes.length > 0 &&
          scopes.every((scope) => typeof scope === "string" && scope.trim()),
        `${theme.name}: invalid token scope`,
      );
    }
    validateStyle(rule.settings, `${theme.name}: token rule`);
  }
  assert.equal(
    typeof theme.semanticHighlighting,
    "boolean",
    `${theme.name}: missing semantic highlighting policy`,
  );
  object(theme.semanticTokenColors, `${theme.name}.semanticTokenColors`);
  for (const [selector, style] of Object.entries(theme.semanticTokenColors)) {
    assert(
      /^(?:\*|[\w-]+)(?:\.[\w-]+)*(?::[\w-]+)?$/.test(selector),
      `${theme.name}: invalid semantic selector ${selector}`,
    );
    if (typeof style === "string") {
      assert(
        color.test(style),
        `${theme.name}.${selector}: invalid semantic color`,
      );
    } else {
      validateStyle(style, `${theme.name}.${selector}`, true);
    }
  }
}

export function validateRelease(
  version,
  { expectedVersion = "", releaseTag = "", ref = "" } = {},
) {
  if (expectedVersion) {
    assert.equal(
      version,
      expectedVersion,
      "Requested version must match package.json",
    );
  }
  if (releaseTag) {
    assert.equal(
      releaseTag,
      `v${version}`,
      "Release tag must be v followed by the package.json version",
    );
  }
  if (ref) {
    assert(
      ref === "refs/heads/main" || ref === `refs/tags/v${version}`,
      "Publishing is only allowed from main or the matching version tag",
    );
  }
}

export function validateRepository() {
  const manifest = parseJson(
    readFileSync(path.join(root, "package.json"), "utf8"),
    "package.json",
  );
  assert.match(
    manifest.version,
    /^\d+\.\d+\.\d+$/,
    "Use a stable major.minor.patch version",
  );
  assert(manifest.engines?.vscode, "Missing VS Code compatibility range");
  assert(manifest.categories?.includes("Themes"), "Missing Themes category");
  assert(
    !manifest.main && !manifest.browser && !manifest.dependencies,
    "Theme extension must not ship executable code or runtime dependencies",
  );
  assert(
    !manifest.contributes.configuration,
    "A theme must not register application settings or change the user's selected theme",
  );
  assert(
    Array.isArray(manifest.contributes.themes) &&
      manifest.contributes.themes.length > 0,
    "Missing theme contributions",
  );
  const expectedFiles = [
    "package.json",
    "README.md",
    "CHANGELOG.md",
    "LICENSE",
    manifest.icon,
    "images/linkedinlearning-vscode-theme.png",
  ];
  const labels = new Set();
  for (const theme of manifest.contributes.themes) {
    assert(
      ["vs", "vs-dark", "hc-black", "hc-light"].includes(theme.uiTheme),
      `Invalid uiTheme: ${theme.uiTheme}`,
    );
    assert(
      typeof theme.label === "string" &&
        theme.label.trim() &&
        !labels.has(theme.label),
      "Theme labels must be nonempty and unique",
    );
    labels.add(theme.label);
    assert.match(
      theme.path,
      /^\.\/themes\/[\w-]+\.json$/,
      "Theme paths must point into themes/",
    );
    expectedFiles.push(theme.path.slice(2));
    validateTheme(
      parseJson(readFileSync(path.join(root, theme.path), "utf8"), theme.path),
      theme,
    );
  }
  for (const file of expectedFiles) {
    assert(
      statSync(path.join(root, file)).isFile(),
      `Missing package file: ${file}`,
    );
  }
  const cli = path.join(root, "node_modules/@vscode/vsce/vsce");
  const files = execFileSync(
    process.execPath,
    [cli, "ls", "--no-dependencies"],
    {
      cwd: root,
      encoding: "utf8",
    },
  )
    .trim()
    .split(/\r?\n/);
  assert.deepEqual(
    files.sort(),
    expectedFiles.sort(),
    "VSIX must contain only the theme, documentation, and listing images",
  );
  validateRelease(manifest.version, {
    expectedVersion: process.env.EXPECTED_VERSION,
    releaseTag: process.env.RELEASE_TAG,
    ref: process.env.PUBLISH_REF,
  });
  console.log(
    `Validated ${manifest.contributes.themes.length} themes and ${files.length} package files for ${manifest.version}.`,
  );
}

if (
  process.argv[1] &&
  path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)
) {
  validateRepository();
}
