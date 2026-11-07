---
title: "Home Theater Speaker Placement: A Measured Setup Guide"
description: "A numbered placement protocol for a 5.1.2 room: listening triangle, centre height, subwoofer phasing and elevation angles, with the tolerances that actually matter."
slug: "home-theater-speaker-placement"
lang: "en"
translationGroup: "speaker-placement-hub"
translations: {}
status: published
publishedAt: "2025-11-04"
updatedAt: "2026-10-28"
reviewedAt: "2026-10-28"
author: "soundandroom-editors"
reviewer: "soundandroom-editors"
category: "system-building"
tags: ["speaker-placement", "dolby-atmos", "calibration", "room-acoustics", "system-building", "multichannel"]
series: "theater-build"
pillar: true
priority: 100
noindex: false
heroImage: ""
heroAlt: ""
ogImage: ""
answer: "Start with the listening seat, not the speakers. Form an equilateral triangle between the front left, front right and the main seat at roughly 22 to 30 degrees off-axis, fix the centre channel at ear height, angle height speakers 30 to 55 degrees above the listening plane, and add a second subwoofer when bass varies more than 6 dB between seats."
keyTakeaways:
  - "A 22 to 30 degree front-speaker angle is the starting point; shifting the seat 0.6 m changes the bass more than swapping speakers does."
  - "A centre channel tilted up from a low shelf lost 2 to 4 dB of dialogue presence at 2 kHz in our room measurements."
  - "Two subwoofers at opposing wall midpoints cut seat-to-seat bass variance from 11 dB to 4 dB in a 4.2 m by 5.6 m room."
  - "Up-firing Atmos modules fail above 3 m ceilings or textured plaster; in-ceiling drivers are the reliable option there."
faq:
  - q: "How far should front speakers be from the wall?"
    a: "Start at 0.3 to 0.6 m from the front wall. Closer than 0.3 m usually adds a 3 to 6 dB boundary boost around 80 to 150 Hz, which you can confirm with a measurement microphone."
  - q: "Should the centre channel sit above or below the screen?"
    a: "Either, as long as the driver aims at ear height. A centre below the screen should be tilted up so its tweeter points at the listeners' ears, not their chests."
  - q: "Do I need two subwoofers?"
    a: "Only if bass varies between seats. Measure at three seats: if the spread at 40 Hz exceeds 6 dB, a second subwoofer at the opposite wall midpoint is the cheapest fix."
  - q: "What angle should Atmos height speakers use?"
    a: "Dolby specifies 30 to 55 degrees of elevation from the listening position. At 45 degrees a 2.5 m ceiling puts the speaker roughly 2.5 m forward of the seat."
howTo:
  name: "Set up a 5.1.2 room from an empty floor"
  description: "End state: a calibrated layout with front channels matched within 1 dB and seat-to-seat bass variance under 6 dB."
  totalTime: "PT90M"
  steps:
    - name: "Fix the listening position first"
      text: "Place the main seat 38 to 45 percent of the room length from the front wall, not at the exact halfway point, to avoid the strongest axial null. If you plan to build the whole room, {{article:small-room-5-1-2-system-plan|start with a written plan}}."
    - name: "Build the front triangle"
      text: "Set left and right speakers at 22 to 30 degrees off-axis with tweeters at ear height, then measure both at the seat and match levels within 1 dB."
    - name: "Aim the centre channel"
      text: "Tilt the centre so the tweeter axis reaches ear height at the main seat; confirm with a 2 kHz test tone and a sound level meter."
    - name: "Place and phase the subwoofers"
      text: "Run the subwoofer crawl, then add a second unit at the opposite wall midpoint and adjust phase until the 40 to 80 Hz response is flattest across three seats. See {{article:subwoofer-room-calibration|how to calibrate a subwoofer}}."
    - name: "Verify the height layer"
      text: "Confirm the elevation angle is between 30 and 55 degrees, then play an Atmos object pan to check the height image does not collapse into the front stage. Background: {{article:dolby-atmos-height-channels-explained|height channels explained}}."
sources:
  - title: "Dolby Atmos Home Theater Installation Guidelines"
    url: "https://www.dolby.com/about/support/guide/speaker-setup-guides/"
    publisher: "Dolby Laboratories"
    date: "2025-06-01"
  - title: "ITU-R BS.775 multichannel reference layout"
    url: "https://www.itu.int/rec/R-REC-BS.775"
    publisher: "ITU"
entities: ["Room modes", "Bass management", "Signal chain"]
---

The most common home theater mistake is buying speakers before deciding where anyone will sit. The room decides the bass, the imaging and how much of your budget should go to acoustics rather than hardware. This guide is the hub of the {{article:dolby-atmos-height-channels-explained|home theater build path}}: a placement order we have measured in ordinary rooms, not a showroom.

## Why the seat comes first

In a 4.2 m by 5.6 m living room we measured the same loudspeakers at three seats. Moving the main seat 0.6 m forward changed the 60 Hz level by 7 dB; swapping the loudspeakers changed it by 2 dB. The seat is part of the system. Fix it at 38 to 45 percent of the room length from the front wall, which avoids the deepest axial null without forcing the sofa against a back wall.

## The front triangle

The left and right speakers and the main seat should form an equilateral triangle, with the speakers at roughly 22 to 30 degrees off-axis. Start with tweeters at ear height and the grilles flush with the cabinet face. Then measure both channels at the seat and match their levels within 1 dB. Level mismatch here is the usual cause of a "narrow" or lopsided image, and it is free to fix.

## Centre channel and dialogue

Dialogue lives in the centre, and centre clarity depends on aim. A centre placed on a low shelf and tilted up lost 2 to 4 dB of presence at 2 kHz in our measurements, exactly where consonants sit. Lift it to ear height or tilt it so the tweeter points at the listeners' ears. If the screen is low, a centre below the screen aimed upward beats a centre buried in a cabinet.

## The height layer

{{glossary:height-channels|Height channels}} add the vertical dimension of an object-based mix. Dolby's 30 to 55 degree elevation window matters more than the driver brand. In a 2.5 m ceiling, 45 degrees puts the speaker about 2.5 m forward of the seat, which is usually on the front wall or just forward of it. Above 3 m, or with a heavily textured ceiling, up-firing modules scatter instead of reflecting; in-ceiling drivers are the reliable choice.

## Bass between seats

This is where the plan usually breaks. We placed one subwoofer, measured three seats, and saw an 11 dB spread at 40 Hz. Adding a second subwoofer at the opposite wall midpoint and aligning phase brought that to 4 dB. If your room seats more than one person, treat the second subwoofer as part of the layout, not an upgrade. The mechanism is {{glossary:bass-management|bass management}} and {{glossary:room-acoustics|room modes}}, not the subwoofer's wattage.

## A failure worth keeping

On one pass we moved the left speaker 18 cm to "open up" the image. The 60 Hz dip got deeper, not shallower. The room had not changed; we had moved the speaker onto a different null. We remeasured, walked it back, and published the worse result, because the worse result is the more useful one. A guide that only reports success is a brochure.

## How we measured

A calibrated USB microphone at ear height, a sine sweep from 20 Hz to 20 kHz at a fixed level, 1/12 octave smoothing, and three seats averaged for the bass check. The short answer at the top is the conclusion; the numbers above are the evidence. When a result depends on the room, we say so instead of presenting it as a property of the speaker.
