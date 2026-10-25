# 吴迪 / Di Wu — Robotics & Autonomous Systems

双语个人工程作品集：四项核心项目、17 个公开项目仓库索引，以及个人贡献和验证范围说明。

Live site: https://wudi-tech.github.io/

## Build

Requires Node.js 20 or later. No package installation is needed.

```sh
node tools/build.mjs
```

Content is maintained in `content/projects.json`. The build writes the Chinese homepage, project index, four project pages, matching English pages, a bilingual 404 page, and discovery metadata. Serve the repository root with any static HTTP server to preview it.

The site uses plain HTML, CSS, and a small script for the mobile menu, language preference, and repository filters. Page content and navigation remain available with JavaScript disabled. Assets and fonts do not depend on a third-party CDN. Diagrams are explicitly labeled schematics and do not represent device photos or experimental evidence.

## Content boundaries

Project descriptions distinguish team and individual contributions, historical records and new checks, simulation and physical devices, and local and official evaluation. Repository links point to the public source archives. No unconfirmed email, school, GPA, résumé download, or physical performance claim is included.

Deployment uses GitHub Pages from `main` at the repository root. Source code and project materials in linked repositories retain their own provenance and licensing terms; this website does not relicense them.
