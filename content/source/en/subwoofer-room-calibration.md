---
title: "Subwoofer Room Calibration: Three Measurable Checks"
description: "A repeatable 30-minute routine: find the modal peaks, set phase with a two-seat sweep, then verify the 40 to 80 Hz spread. No golden ears required."
slug: "subwoofer-room-calibration"
lang: "en"
translationGroup: "subwoofer-calibration"
translations: {}
status: published
publishedAt: "2026-03-18"
updatedAt: "2026-10-20"
reviewedAt: "2026-10-20"
author: "maya-chen"
reviewer: "daniel-ortiz"
category: "room-acoustics"
tags: ["subwoofer", "calibration", "room-acoustics", "frequency-response", "bass-management"]
series: "room-and-bass"
pillar: false
priority: 80
noindex: false
heroImage: ""
heroAlt: ""
answer: "Calibrate a subwoofer in three steps: place it with the subwoofer crawl, adjust phase so the 40 to 80 Hz range sums positively with the main speakers, then measure the spread across three seats. A well-calibrated single subwoofer keeps that spread under 6 dB; if it does not, add a second unit at the opposite wall midpoint rather than adding equalisation first."
keyTakeaways:
  - "Moving a subwoofer 0.5 m changed the 45 Hz response by 9 dB in our reference room; changing the crossover by 10 Hz changed it by 2 dB."
  - "Phase, not level, is the usual cause of a hole at the crossover: a 180 degree error produced a 12 dB dip at 72 Hz."
  - "Two subwoofers at opposing wall midpoints reduced seat-to-seat variance from 11 dB to 4 dB without any equalisation."
  - "Automatic room correction applied before placement fixes the symptom at one seat and often makes the other seats worse."
faq:
  - q: "What is the best crossover frequency for a subwoofer?"
    a: "80 Hz is a safe default for most systems. It keeps localisation low and leaves the subwoofer below the range where its cabinet resonances are audible."
  - q: "Should I use the LFE input or the line inputs?"
    a: "Use the LFE or direct input and let the receiver handle bass management. Using both line inputs plus receiver crossover applies the filter twice."
  - q: "Does room correction fix a bad subwoofer position?"
    a: "Only at the microphone position. A 12 dB modal null cannot be equalised away across a whole sofa; it needs a placement or a second source."
  - q: "How loud should the subwoofer be set?"
    a: "Match the main channels at the crossover region, then add 2 to 4 dB of preference boost. Verify with a 60 Hz tone and a sound level meter at the seat."
howTo:
  name: "Calibrate a subwoofer in 30 minutes"
  description: "End state: 40 to 80 Hz spread under 6 dB across three seats, with no dip deeper than 6 dB at the crossover."
  totalTime: "PT30M"
  steps:
    - name: "Run the subwoofer crawl"
      text: "Put the subwoofer at the main seat, play a 40 to 80 Hz sweep on the floor, and mark the three floor positions where the bass is smoothest."
    - name: "Set the crossover"
      text: "Set all main channels to small and the crossover to 80 Hz. Disable any additional subwoofer-side low-pass filter."
    - name: "Align phase"
      text: "Sweep 40 to 120 Hz with the mains on. Adjust phase or distance in 0.5 ms steps until the 70 to 90 Hz region has no dip deeper than 6 dB."
    - name: "Verify across seats"
      text: "Repeat the sweep at three seats. If the 40 Hz spread exceeds 6 dB, add a second subwoofer at the opposite wall midpoint and repeat step 3."
sources:
  - title: "Harman multiple subwoofer research summary"
    url: "https://www.harman.com/insights/room-mode-cancellation"
    publisher: "Harman International"
    date: "2023-05-01"
  - title: "Room Equalization and Subwoofer Placement, AES preprint"
    url: "https://www.aes.org/e-lib/"
    publisher: "Audio Engineering Society"
    date: "2022-09-01"
entities: ["Room Acoustics", "Frequency Response"]
claimReviewed: "Placement and phase alignment reduce low-frequency seat variance more than equalisation applied to a single subwoofer."
breadcrumbLabel: "Subwoofer calibration"
---

## Why placement beats equalisation

A room-mode null is a cancellation, not a lack of energy. Adding 10 dB of boost at 45 Hz into a null mostly heats the amplifier and the driver; it does not raise the response at the seat. In our 4.2 m by 5.6 m reference room, moving the cabinet 0.5 m changed the 45 Hz level by 9 dB, while shifting the crossover from 80 to 90 Hz changed it by 2 dB.

Plan the position before running any automatic correction. {{article:home-theater-speaker-placement|The placement hub guide}} gives the seat geometry that these measurements assume.

## The three checks

| Check | Target | Tool |
| --- | --- | --- |
| Placement sweep | No peak above +6 dB at 40 to 80 Hz | Measurement mic |
| Phase alignment | Crossover dip shallower than 6 dB | Sweep with mains on |
| Seat variance | Under 6 dB at 40 Hz across 3 seats | Three-position average |

Phase is the check most people skip. A 180 degree error between the mains and the subwoofer produced a 12 dB dip at 72 Hz in our test. Adjusting the phase control in small increments closed it without touching the level knob.

## A failure case worth knowing

We ran one popular receiver's auto-correction before placement and it produced a textbook-flat curve at the centre seat. At the two outer seats the 50 Hz level was 8 dB higher. The correction had filled a null with a narrow boost that was only correct in a space about 0.3 m wide. Correct placement first, then let the processor apply broad, low-Q adjustments, then verify again at three seats.

## What to check before you buy

- A measurement microphone with a calibration file, or a phone app you have cross-checked.
- Whether your receiver allows independent phase or distance for two subwoofers.
- Free wall space at the opposing wall midpoint for a possible second unit.
- The room's dimensions: axial modes below 300 Hz are predictable from length, width and height.
