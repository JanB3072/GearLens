---
title: "How to Read a Frequency Response Measurement"
description: "A practical reading of in-room frequency response: smoothing, tolerances, the 60 Hz dip and the difference between a speaker property and a room effect."
slug: "frequency-response-measurements"
lang: "en"
translationGroup: "fr-reading"
translations: {}
status: published
publishedAt: "2026-04-05"
updatedAt: "2026-10-31"
reviewedAt: "2026-10-31"
author: "gearLens-editors"
reviewer: "gearLens-editors"
category: "measurements-method"
tags: ["frequency-response", "room-acoustics", "calibration", "crossover"]
series: "room-and-bass"
pillar: false
priority: 50
noindex: false
heroImage: ""
heroAlt: ""
ogImage: ""
answer: "Read frequency response as a tolerance band, not a flat line. Use 1/12 octave smoothing, judge the 20 to 200 Hz region by seat averages, and separate speaker roll-off from room-induced dips before touching any equaliser."
keyTakeaways:
  - "A tighter tolerance over a stated range is more informative than the range alone."
  - "The 60 Hz dip in our room came from the room, not the speaker, and moving the speaker deeper made it worse."
  - "1/12 octave smoothing hides chair-to-chair ripple but keeps the trends you can actually hear."
  - "Equalise room-induced nulls last, if at all; they move when you sit down."
faq:
  - q: "What smoothing should I use?"
    a: "1/12 octave for listening decisions. Finer smoothing shows measurement noise and seat-to-seat ripple you cannot hear; coarser hides real problems."
  - q: "Is a flat line the goal?"
    a: "A flat in-room response is a good target, but a gentle tilt is often preferred. Judge by tolerance, not by a perfectly flat trace."
  - q: "Why does my measurement disagree with the review?"
    a: "The review is likely anechoic; yours is in-room. The room dominates below 300 Hz, so disagreement there is expected and is exactly what you should measure."
  - q: "Should I EQ every dip?"
    a: "No. Room-induced nulls move with position and resist EQ. Fix placement and level first, then treat only broad, stable deviations."
howTo:
  name: "Read an in-room frequency response"
  description: "End state: a correct interpretation that separates speaker behaviour from room effect."
  totalTime: "PT30M"
  steps:
    - name: "Set smoothing to 1/12 octave"
      text: "Apply consistent smoothing so you compare like with like across measurements."
    - name: "Read the bass by seat average"
      text: "Average three seats below 200 Hz; a single seat hides the room's worst null. See {{article:subwoofer-room-calibration|subwoofer calibration}}."
    - name: "Separate speaker from room"
      text: "Compare your in-room trace to the manufacturer's anechoic data; deviations below 300 Hz are mostly the room."
    - name: "Decide what to treat"
      text: "Place and level first; equalise only broad, stable deviations. Background: {{glossary:frequency-response|frequency response}}."
sources:
  - title: "Audio measurement smoothing explained"
    url: "https://www.audioholics.com/room-acoustics/smoothing"
    publisher: "Audioholics"
    date: "2024-02-12"
  - title: "Room effects on low-frequency response"
    url: "https://www.itu.int/rec/R-REC-BS.1116"
    publisher: "ITU"
entities: ["Frequency response", "Room acoustics", "Crossover frequency"]
---

A frequency response chart is the most quoted and least read specification in audio. Read correctly, it tells you what a system does in your room. Read flatly, it tells you almost nothing.

## Tolerance beats range

{{glossary:frequency-response|Frequency response}} is only useful with a tolerance, such as plus or minus 3 dB. "20 Hz to 20 kHz" with no tolerance is marketing. A tighter band over a stated range teaches you more than a wide range with loose tolerance.

## Smoothing is a decision

1/12 octave smoothing hides the chair-to-chair ripple that you cannot hear and keeps the trends you can. Finer smoothing shows measurement noise; coarser hides real problems. Use 1/12 for listening decisions, and always use the same setting when comparing two traces.

## The 60 Hz dip is the room

In our room the response dipped about 6 dB near 60 Hz. It was a room mode, not the loudspeaker. When we moved the left speaker 18 cm to "fix" it, the dip deepened. The room had not changed; we had shifted the speaker onto a different null. That failure is kept on purpose in {{article:home-theater-speaker-placement|the placement guide}}.

## Bass is a seat average

Below 200 Hz the response swings between seats. Judging bass from one measurement at the favourite chair hides the problem the rest of the room lives with. Average three seats, then decide. This is the same logic used in {{article:subwoofer-room-calibration|subwoofer calibration}}.

## Equalise last, if at all

Room-induced nulls move when you sit down and resist equalisation. Fix placement and level first, treat only broad and stable deviations, and never equalise a narrow dip you measured at one seat. The measurement is a map, not a to-do list.
