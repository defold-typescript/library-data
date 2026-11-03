# library-data

Library data for the [defold-typescript toolchain](https://github.com/defold-typescript/toolchain). See the [library guide](https://github.com/defold-typescript/toolchain/blob/main/packages/docs/guide/library.md).

This repository is written whole from [`packages/library-types/data`](https://github.com/defold-typescript/toolchain/tree/main/packages/library-types/data) in `defold-typescript/toolchain` each time that folder changes, so make changes there: a change made here is overwritten by the next publish. The [library docs site](https://defold-typescript.github.io/library-data/) is built from `packages/library-docs` in the same repository and served from this repository's `gh-pages` branch.

Each folder under `data/` holds the data for one data format version. Open a new folder only when the data format or the core-type names change.

A data folder also holds the extension docs, portal listings and display metadata the library docs site reads.
