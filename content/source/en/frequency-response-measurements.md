---
title: "Reading a Frequency Response Chart Without Being Fooled"
description: "Why a range without a tolerance means nothing, how smoothing hides resonances, and the four chart features we check before publishing any speaker verdict."
slug: "frequency-response-measurements"
lang: "en"
translationGroup: "frequency-response-charts"
translations: {}
status: published
publishedAt: "2026-07-09"
updatedAt: "2026-10-16"
reviewedAt: "2026-10-16"
author: "daniel-ortiz"
reviewer: "maya-chen"
category: "measurements"
tags: ["frequency-response", "room-acoustics", "calibration"]
series: "room-acoustics"
pillar: false
priority: 55
noindex: false
heroImage: ""
heroAlt: ""
answer: "A frequency response figure is only meaningful with a tolerance, a measurement distance, an input level and a smoothing setting. '40 Hz to 20 kHz' without a ±3 dB window can hide a 10 dB rolloff. We read the on-axis curve, the listening-window average, the sound-power curve and the off-axis family together; a single smooth line can conceal a poor directivity match."
keyTakeaways:
  - "A ±3 dB window and a ±10 dB window describe very different speakers even when both quote 40 Hz to 20 kHz."
  - "One-third-octave smoothing can hide a 4 dB resonance that is clearly visible at 1/24-octave resolution."
  - "A flat on-axis curve with a 5 dB sound-power dip at 2 kHz usually sounds dull in a reflective room."
  - "Below 300 Hz the room dominates: an anechoic chart cannot predict the 45 Hz peak you will hear at your seat."
faq:
  - q: "What does ±3 dB mean on a speaker spec?"
    a: "It is the tolerance band around the average level across the quoted frequency range. Without it, a claimed 40 Hz extension may be 10 dB down at 40 Hz."
  - q: "Why do two reviews of the same speaker show different curves?"
    a: "Different measurement distance, gating, smoothing and room. Compare curves only when the method is stated and matched."
  - q: "Is a flat frequency response always best?"
    a: "On axis, generally close to flat is a good target. But a gently downward-sloping in-room response from bass to treble is often preferred in listening tests."
  - q: "Can I measure this at home?"
    a: "Yes, with a calibrated USB microphone and free sweep software. Use gating above 300 Hz and treat below 300 Hz as an in-room measurement."
howTo:
  name: "Audit a manufacturer frequency response claim"
  description: "A four-step check that turns a marketing line into a comparable specification."
  totalTime: "PT20M"
  steps:
    - name: "Find the tolerance"
      text: "Reject any range quoted without a ±dB window, a measurement distance and an input level."
    - name: "Check the smoothing"
      text: "Prefer 1/24-octave or unsmoothed data. One-third-octave smoothing conceals narrow resonances."
    - name: "Read the off-axis family"
      text: "Compare the listening window and sound power. A 5 dB divergence around the crossover predicts an uneven in-room sound."
    - name: "Separate anechoic from in-room"
      text: "Treat everything below 300 Hz as room-dependent and verify with a sweep at your own seat."
sources:
  - title: "CTA-2034 standard method of measurement for in-home loudspeakers"
    url: "https://www.cta.tech/"
    publisher: "Consumer Technology Association"
    date: "2015-01-01"
  - title: "Loudspeaker measurement primer"
    url: "https://www.audioholics.com/loudspeaker-design/loudspeaker-measurements"
    publisher: "Audioholics"
    date: "2023-04-02"
entities: ["Frequency Response", "Room Acoustics"]
claimReviewed: "A frequency range stated without a tolerance, distance and smoothing setting is not a comparable measurement."
breadcrumbLabel: "Reading response charts"
---

## Four numbers before one verdict

A spec sheet line like "40 Hz to 20 kHz" compresses four variables into none. The tolerance window, the measurement distance, the input level and the smoothing all change the result. We record all four in every test note, and we publish the listening-window average alongside the on-axis curve.

This matters for the comparisons elsewhere on the site: {{article:bookshelf-vs-tower-speakers|the bookshelf versus tower test}} and {{article:center-channel-dialogue-clarity|the dialogue measurements}} both depend on reading the curve correctly.

| Chart feature | What it predicts | Warning sign |
| --- | --- | --- |
| On-axis response | Tonal balance at one seat | Wide peak near 3 kHz |
| Listening window | Average over a small seating area | Diverges from on-axis by 3 dB |
| Sound power | Total radiated energy | 5 dB dip near the crossover |
| Early reflections | Room interaction | Step change above 1 kHz |

## Smoothing is a choice, not a fact

One-third-octave smoothing averages across a wide enough band to hide a 4 dB resonance at 1.4 kHz. We saw exactly that in a budget tower: the smoothed curve looked exemplary while the 1/24-octave trace showed a clearly audible nasal colouration. If a manufacturer only supplies heavily smoothed data, treat it as marketing art.

## A failure case worth knowing

Below 300 Hz, an anechoic chart cannot predict your room. A speaker with a textbook-flat anechoic bass produced an 8 dB peak at 46 Hz in our 3.0 m by 3.6 m test room because its woofer sat on an axial mode. The fix was placement, described in {{article:subwoofer-room-calibration|the calibration routine}}, not a different speaker.

## What to check before you buy

- The stated tolerance, not just the endpoints of the range.
- Measurement distance and input level, usually 1 m at 2.83 V.
- Whether the chart is gated, anechoic or in-room.
- Off-axis data: a single on-axis line is not enough to predict a sofa-sized listening area.
