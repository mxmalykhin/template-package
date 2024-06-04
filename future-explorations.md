# 🧭 Future Explorations

This document outlines various ideas, tools, and concepts I plan to explore and possibly integrate into my template. It's a mix of potential enhancements, intriguing plugins, and technologies that caught my attention.

### 🔄 Syncing Template with Forked Projects

- Explore various methods and tools for synchronizing template changes with forked projects:
  - [git-repo-sync](https://github.com/it3xl/git-repo-sync)
  - [action-template-repository-sync](https://github.com/ahmadnassri/action-template-repository-sync)
  - [actions-template-sync](https://github.com/AndreasAugustin/actions-template-sync?tab=readme-ov-file)
  - [Blog on GitHub templates and repository sync](https://0xdc.me/blog/github-templates-and-repository-sync/)

## 🌱 Later Considerations

- Explore [All Contributors](https://allcontributors.org/) for acknowledging contributions.
- Consider integrating a `.devcontainer` for consistent development environments.
- Implement automated testing of output bundles to ensure their correct operation in different environments.
- Research and potentially implement a CI example like [this one from un-ts/pkgr](https://github.com/un-ts/pkgr/blob/master/.github/workflows/ci.yml).
- Investigate more about `peerDependenciesMeta` and `peerDependencies`.
- Consider the necessity of CJS if UMD can suffice.
- Look into testing `.d.ts` files for type accuracy.
- Understand the need for duplicating types and modules in `package.json -> exports`. [Discussion](https://github.com/rollup/plugins/pull/1578#issuecomment-1718872840)
- Analyze Vue.js's approach to `package.json -> exports` and learn about "vue.runtime.esm-bundler.js". [Vue.js package.json](https://github.com/vuejs/core/blob/main/packages/vue/package.json)
- Debate the use of `module.exports = Object.assign(exports.default, exports)` as seen in [this Rollup plugin PR](https://github.com/rollup/plugins/pull/363/files#diff-7364276655cd1d00b3ca7946b145773df9d3b249382ba463204108f1050a1071).
- Examine how `yargs` was implemented in [CyberFlameGO/mantine](https://github.com/CyberFlameGO/mantine/blob/master/scripts/build.ts#L46).
- Consider replacing Rollup with Turbo Pack for bundling.
- Add Docker support following [Turbo's handbook on deploying with Docker](https://turbo.build/repo/docs/handbook/deploying-with-docker#the-solution).
- Learn about `references` in `tsconfig.json` for project management. [TypeScript Project References](https://www.typescriptlang.org/docs/handbook/project-references.html#what-are-project-references)
- Explore the possibility of using multiple bundlers.
- Read about [Node.js package entry points](https://nodejs.org/api/packages.html#package-entry-points).
- Utilize tools like [lock-file explorer](https://lfx.rushstack.io/) for better dependency management.
- Investigate Phantom dependencies and NPM doppelgangers via [Rushstack LFX](https://lfx.rushstack.io/pages/scenarios/npm_doppelgangers/).
- Contemplate the use of Deno in my workflow.
- Utilize [dep-tree](https://github.com/gabotechs/dep-tree?tab=readme-ov-file) for dependency analysis.
- Decide on including `inlineSourceMap` and `inlineSources` in tsconfig for production builds.
- Incorporate tools and libraries like [ts-reset](https://github.com/total-typescript/ts-reset), [ts-toolbelt](https://github.com/millsp/ts-toolbelt), and [ts-essentials](https://github.com/ts-essentials/ts-essentials) for enhanced TypeScript development.
- Look into package management improvements with tools like [yarn-deduplicate](https://github.com/scinos/yarn-deduplicate) and [node-semver](https://github.com/npm/node-semver).
- Assess patching strategies with [patch-package](https://github.com/ds300/patch-package).
- Consider version management tools like [nvm](https://github.com/nvm-sh/nvm?tab=readme-ov-file#nvmrc) or alternatives.
- Evaluate the use of [changesets](https://github.com/changesets/changesets) for versioning in non-monorepo projects.
- Implement debug tools like [debug-js](https://github.com/debug-js/debug) for better debugging experiences.
- Assess type coverage with [type-coverage](https://github.com/plantain-00/type-coverage).
- Review configuration options with [Renovate Bot](https://docs.renovatebot.com/configuration-options/).
- Integrate environment variable management with [dotenv](https://github.com/motdotla/dotenv).
- Research additional tools and plugins, including [license-checker-rseidelsohn](https://github.com/RSeidelsohn/license-checker-rseidelsohn), [knip](https://github.com/webpro/knip), [console-fail-test](https://www.npmjs.com/package/console-fail-test), [cspell](https://www.npmjs.com/package/cspell), [release-it](https://www.npmjs.com/package/release-it), and [tsup](https://www.npmjs.com/package/tsup).
- Stay informed about licensing information with [license-checker-rseidelsohn](https://github.com/RSeidelsohn/license-checker-rseidelsohn?tab=readme-ov-file#related-information-sources-on-the-internet).
- Explore modern TypeScript tools like [samchon/typia](https://github.com/samchon/typia), [unional/type-plus](https://github.com/unional/type-plus), [webpro/knip](https://github.com/webpro/knip), [antoine-coulon/skott](https://github.com/antoine-coulon/skott), [sverweij/dependency-cruiser](https://github.com/sverweij/dependency-cruiser), and [relative-ci/bundle-stats](https://github.com/relative-ci/bundle-stats/tree/master/packages/rollup-plugin).
- Investigate code generation tools like [hygen](https://github.com/jondot/hygen) and error translation tools like [ts-error-translator](https://github.com/mattpocock/ts-error-translator?tab=readme-ov-file) ([VSCode Extension](https://marketplace.visualstudio.com/items?itemName=mattpocock.ts-error-translator), [Online Tool](https://ts-error-translator.vercel.app/)).
