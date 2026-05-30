#!/usr/bin/env tsx
// Import wave-5 issues from docs/issues/*.md into GitHub
import { readdirSync, readFileSync } from "fs";
import { join } from "path";

const issuesDir = join(__dirname, "..", "docs", "issues");
const issues = readdirSync(issuesDir).filter(f => f.endsWith(".md"));
console.log(`Found ${issues.length} wave-5 issues to import`);
issues.forEach(f => console.log(`  - ${f}`));
