---
title: "Subwoofer and Room Calibration: Taming the Bass"
description: "A measurement-led subwoofer calibration: the crawl, phase, bass management and the second subwoofer that cut seat-to-seat variance from 11 dB to 4 dB."
slug: "subwoofer-room-calibration"
lang: "en"
translationGroup: "sub-cal"
translations: {}
status: published
publishedAt: "2026-03-22"
updatedAt: "2026-10-29"
reviewedAt: "2026-10-29"
author: "soundandroom-editors"
reviewer: "soundandroom-editors"
category: "room-treatment"
tags: ["subwoofer", "calibration", "room-acoustics", "frequency-response", "bass-management"]
series: "room-and-bass"
pillar: false
priority: 65
noindex: false
heroImage: ""
heroAlt: ""
ogImage: ""
answer: "Calibrate bass with measurement, not the auto-wizard alone. Run the subwoofer crawl for the seat, set bass management near 80 Hz as a start, align phase, then add a second subwoofer when three-seat variance exceeds 6 dB at 40 Hz."
keyTakeaways:
  - "One subwoofer gave an 11 dB seat-to-seat spread at 40 Hz in our 4.2 by 5.6 m room."
  - "Two subwoofers at opposing wall midpoints cut that spread to 4 dB."
  - "80 Hz bass management is a start; the useful value follows the measured in-room roll-off."
  - "Phase alignment mattered more than the subwoofer's wattage for a flat 40 to 80 Hz region."
faq:
  - q: "What is the subwoofer crawl?"
    a: "You place the subwoofer at the listening seat, play bass, and walk the room to find where the seat-level response is smoothest, then put the sub there. It finds a good seat, not a good corner."
  - q: "Why did one subwoofer measure so uneven?"
    a: "Room modes. In a rectangular room the 40 to 80 Hz response swings wildly between seats; that is physics, not a fault in the subwoofer. See {{glossary:room-acoustics|room modes}}."
  - q: "When do I add a second subwoofer?"
    a: "When three-seat variance at 40 Hz exceeds 6 dB. It is cheaper and more effective than a bigger single subwoofer for seating spread."
  - q: "Should I trust auto-calibration?"
    a: "Use it as a starting point, then verify with a sweep at the seat. Auto systems often miss phase and room-specific nulls."
howTo:
  name: "Calibrate a subwoofer in a real room"
  description: "End state: flat 40 to 80 Hz at the seat with low seat-to-seat variance."
  totalTime: "PT75M"
  steps:
    - name: "Find the seat with the crawl"
      text: "Place the sub at the seat, sweep, and locate the position with the smoothest low bass, then move the sub there."
    - name: "Set bass management"
      text: "Start at 80 Hz and adjust from the measured in-room roll-off. Background: {{glossary:bass-management|bass management}}."
    - name: "Align phase"
      text: "Sweep 40 to 80 Hz at the seat and flip phase or delay until the region is flattest; this beat wattage in our tests."
    - name: "Add a second subwoofer if needed"
      text: "If three-seat variance exceeds 6 dB at 40 Hz, place a second unit at the opposite wall midpoint. See {{article:small-room-5-1-2-system-plan|the plan}}."
    - name: "Verify at three seats"
      text: "Measure left, centre and right seats; aim for under 6 dB spread before calling it done."
sources:
  - title: "Room mode and subwoofer placement primer"
    url: "https://www.audioholics.com/home-theater-calibration/subwoofer-placement"
    publisher: "Audioholics"
    date: "2024-05-18"
  - title: "Bass management setup guide"
    url: "https://www.dolby.com/about/support/guide/speaker-setup-guides/"
    publisher: "Dolby Laboratories"
entities: ["Room acoustics", "Bass management", "Frequency response"]
---

Bass is where rooms misbehave most. A subwoofer that measures flat in a lab can be 11 dB different between two seats in a living room, and no amount of calibration wizardry hides that until you measure.

## The crawl finds the seat, not the corner

Put the subwoofer where you sit, play a low sweep, and walk the room. The spot with the smoothest bass at ear height is where the subwoofer belongs. Corners are convenient and boost output, but they also exaggerate the room's worst modes.

## One subwoofer is rarely enough for seats

In our 4.2 m by 5.6 m room, a single subwoofer gave an 11 dB spread at 40 Hz across three seats. That is {{glossary:room-acoustics|room modes}}, not a faulty driver. The cheap, effective answer was a second subwoofer at the opposite wall midpoint, which brought the spread to 4 dB.

## Bass management is a starting point

{{glossary:bass-management|Bass management}} at 80 Hz redirects low content to the subwoofer. It is a default, not a law. The useful value follows the measured in-room roll-off of your small speakers. Measure, then set it; do not trust the menu.

## Phase beat wattage

Aligning phase across 40 to 80 Hz flattened the region more than swapping to a higher-wattage subwoofer did. The cancellation at a seat is often a phase issue the spec sheet never mentions. A sweep at the seat shows it directly.

## What we would not skip

The three-seat verification. A single measurement at the favourite chair hides the problem the rest of the room lives with. Aim for under 6 dB spread, then enjoy the fact that the bass finally arrives at the same time as the rest of the film.
