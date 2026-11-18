# Contributing

## Development

Use Node.js 24 (`nvm use` if you use nvm), then run:

```sh
npm ci --ignore-scripts
npm run check
npm run package
```

`npm run check` checks formatting, runs tests, and validates both themes and the exact package file list. Validation rejects malformed JSON, duplicate keys, and invalid color and token styles.

`npm run package` creates the installable `theme.vsix`. Only the themes, extension manifest, license, changelog, README, and listing images are included; contributor documentation, sample code, source artwork, workflows, tests, and development dependencies are excluded.

## Previewing themes

Press F5 in VS Code to open an Extension Development Host. Select each theme and use the files in `syntax-tests/` to inspect syntax highlighting.

Check both light and dark variants, including semantic highlighting, selections, focus indicators, and common editor UI states. Automated checks do not replace visual or accessibility testing.

## Continuous integration

Pull requests and pushes to `main` run **Validate and package** without publishing credentials. Successful runs upload a `theme-vsix` artifact containing the VSIX and its SHA-256 checksum.

GitHub Actions are pinned to commit SHAs, npm tools are locked in `package-lock.json`, and dependency lifecycle scripts are disabled. Update tool versions and action pins through reviewed pull requests.

## Releases

The **Publish theme** workflow packages once and waits for approval through the `publishing` GitHub environment. Both registries receive the same VSIX.

Publishing requires:

- Required reviewers configured on the `publishing` environment. Referencing an environment in workflow YAML does not itself enforce approval.
- [Marketplace Trusted Publishing](https://code.visualstudio.com/api/working-with-extensions/publishing-extension#publish-with-github-actions-and-trusted-publishing) configured for the repository, workflow `publish.yml`, and environment `publishing`. Authentication uses OIDC rather than a stored Marketplace PAT.
- Verified ownership of the Open VSX namespace and [Open VSX Trusted Publishing](https://github.com/eclipse-openvsx/openvsx/blob/master/cli/README.md#trusted-publishing) registered for the extension, repository, workflow `publish.yml`, and environment `publishing`. An extension must already be published and active before its trusted publisher can be registered.

Both registries authenticate with short-lived OIDC credentials; no publishing token secrets are required. The Open VSX command explicitly requires trusted publishing and fails if an OIDC token cannot be obtained.

### Publishing a new version

1. Update `package.json` and `package-lock.json` together with `npm version <version> --no-git-tag-version`, update `CHANGELOG.md`, and open a pull request.
2. After CI and review pass, merge the changes. Tag the reviewed commit with `v` followed by the exact package version, then publish a stable GitHub release for that tag. Prereleases are not published by this workflow.
3. Inspect the packaged artifact and approve the waiting deployment. The workflow publishes to both registries without changing the version or creating commits.

### Publishing to one registry

To retry a failed publication or add an existing version to another registry, run **Publish theme** manually. Select the matching version tag, enter the exact package version, and select only the registry that does not already have that version.

Manual publishing also supports `main`, provided its package version is the intended release version. Publishing from other branches or mismatched tags is rejected. The selected commit must contain the publishing workflows.

Do not republish an existing version to a registry that already has it. Do not increment the version just to retry a failed upload.
