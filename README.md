# library-data

The library data the [defold-typescript toolchain](https://github.com/defold-typescript/toolchain) downloads when it resolves a project's dependencies, and the host of the [library docs site](https://defold-typescript.github.io/library-data/). See the [library guide](https://github.com/defold-typescript/toolchain/blob/main/packages/docs/guide/library.md).

**This repository is automated and does not accept pull requests.** CI writes it whole from [`packages/library-types/data`](https://github.com/defold-typescript/toolchain/tree/main/packages/library-types/data) in `defold-typescript/toolchain` each time that folder changes, so a change made here is overwritten by the next publish. Propose changes and report problems in [defold-typescript/toolchain](https://github.com/defold-typescript/toolchain).

The library docs site is built from `packages/library-docs` in the same repository and served from this repository's `gh-pages` branch.

Each folder under `data/` holds the data of one data format, named for the first CLI release that reads it. [`data/README.md`](data/README.md) says which releases read each folder and when a change needs a new one.

A data folder also holds the extension docs, portal listings and display metadata the library docs site reads.
