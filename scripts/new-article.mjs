#!/usr/bin/env node
/** Creates a fully-formed article skeleton with every SEO/GEO field present. */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = fileURLToPath(new URL('..', import.meta.url));
const slug = process.argv[2];
const lang = process.argv[3] || 'en';

if (!slug || !/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug)) {
  console.error('Usage: npm run new -- <kebab-case-slug> [lang]\nExample: npm run new -- subwoofer-placement en');
  process.exit(1);
}

const dir = path.join(ROOT, 'content', 'source', lang);
const file = path.join(dir, `${slug}.md`);
if (fs.existsSync(file)) {
  console.error(`[new] already exists: ${file}`);
  process.exit(1);
}
fs.mkdirSync(dir, { recursive: true });

const today = new Date().toISOString().slice(0, 10);
const title = slug.replace(/-/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase());

const template = `---
title: "${title}"
description: "A specific, benefit-led summary between 110 and 160 characters that states what the reader will be able to decide after reading this guide."
slug: "${slug}"
lang: "${lang}"
translationGroup: "${slug}"
translations: {}
status: published
publishedAt: "${today}"
updatedAt: "${today}"
reviewedAt: "${today}"
author: "maya-chen"
reviewer: "daniel-ortiz"
category: "system-building"
tags: ["system-building", "speaker-placement"]
series: "first-system"
pillar: false
priority: 10
noindex: false
heroImage: ""
heroAlt: ""
ogImage: ""
answer: "Give the direct answer in the first 40 to 60 words. State the recommendation, the number behind it, and the condition under which it changes."
keyTakeaways:
  - "A quantified takeaway that stands on its own without the article."
  - "A second independently quotable fact."
  - "A counterintuitive result or a named failure case."
faq:
  - q: "A question phrased exactly as a reader would ask a search engine?"
    a: "A self-contained answer in one or two sentences, with a number or a named condition."
  - q: "A second question?"
    a: "A second self-contained answer."
  - q: "A third question?"
    a: "A third self-contained answer."
howTo:
  name: "How to apply this guide"
  description: "The measurable outcome of completing these steps."
  totalTime: "PT45M"
  steps:
    - name: "Measure the starting point"
      text: "Describe the tool, the unit and the target value."
    - name: "Make the change"
      text: "Describe the action and the tolerance."
    - name: "Verify the result"
      text: "Describe how to confirm it worked, and what to do if it did not."
sources:
  - title: "Primary source title"
    url: "https://example.com/source"
    publisher: "Publisher name"
    date: "2025-06-01"
entities: ["Signal chain", "Room modes"]
claimReviewed: "The one-sentence claim this article verifies."
---

## Start with the direct answer

Repeat and expand the short answer in the first paragraph. Answer engines quote
the first self-contained block, so do not open with a story or a definition of
the industry.

## Why the number matters

Explain the mechanism. Include a unit, a range, and the measurement condition.
Use {{article:home-theater-speaker-placement|the hub guide}} for internal links
and {{glossary:dolby-atmos}} for entity links. The ingest step resolves these
into real URLs, which keeps the internal link graph valid after a slug change.

| Condition | Measured value | What changes |
| --- | --- | --- |
| Baseline | 0 dB | Reference |
| After correction | -3 dB | Audible improvement |

## A failure case worth knowing

Describe when the recommended approach does not work, and the specific signal
that tells you to stop. This is the section most often quoted by answer engines.

## What to check before you buy

- A constraint with a number.
- A second constraint with a number.
- The edge case that invalidates the general rule.
`;

fs.writeFileSync(file, template, 'utf8');
console.log(`[new] created ${path.relative(ROOT, file)}\n[new] then run: npm run ingest && npm run audit`);
