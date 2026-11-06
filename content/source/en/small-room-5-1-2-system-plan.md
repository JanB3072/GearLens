---
title: "A 5.1.2 System Plan for a Small Living Room"
description: "A room-first plan for a 5.1.2 system under 20 m2: budget split, channel order, wiring runs, subwoofer placement and the measurements that decide each step."
slug: "small-room-5-1-2-system-plan"
lang: "en"
translationGroup: "small-room-system-plan"
translations: {}
status: published
publishedAt: "2026-09-18"
updatedAt: "2026-11-06"
reviewedAt: "2026-11-06"
author: "maya-chen"
reviewer: "daniel-ortiz"
category: "system-building"
tags: ["system-building", "multichannel", "bass-management", "budget", "speaker-placement"]
series: "first-system"
pillar: false
priority: 60
noindex: false
heroImage: ""
heroAlt: ""
ogImage: ""
answer: "In a room under 20 m2, spend on layout and bass before channels. Fix the seat at 38 to 45 percent of room length, wire for 5.1.2 even if you buy 3.1 first, and reserve 25 to 30 percent of the budget for two subwoofers and measurement gear. The room sets the result; the receiver only reports it."
keyTakeaways:
  - "A 16 m2 room with a 2.4 m ceiling gave a 14 dB dip at 48 Hz at the centre seat; moving the sofa 0.7 m forward recovered 9 dB without buying anything."
  - "Running four height-channel cables during decoration costs about 15 m of cable. Retrofitting them afterwards meant lifting a 3.1 m cornice in our test flat."
  - "Two small subwoofers at opposing wall midpoints cut seat-to-seat variance from 11 dB to 4 dB; one larger subwoofer in the corner did not."
  - "An 80 Hz bass-management setting is a starting point, not a target. In this room 70 Hz measured 3 dB flatter at the crossover."
faq:
  - q: "Should I buy all 5.1.2 channels at once?"
    a: "No. Wire for all of them, then buy front left, right, centre and one subwoofer first. Add surrounds and height channels after the front stage measures within 1 dB."
  - q: "How much of the budget should go to speakers versus electronics?"
    a: "In a small room we put 45 to 50 percent into loudspeakers, 25 to 30 percent into two subwoofers and measurement, and the rest into the receiver and sources. Electronics depreciate faster than cabinets."
  - q: "Is a soundbar a valid 5.1.2 substitute under 20 m2?"
    a: "It is a valid space saving compromise, but it cannot fix seat-to-seat bass or a centre channel firing at your chest. Measure the 40 to 80 Hz spread before deciding."
  - q: "Do I need a dedicated room for height channels to work?"
    a: "No, but ceiling height and surface matter. Above 3 m or with textured plaster, up-firing modules lose the height image; in-ceiling or on-wall drivers are more predictable."
howTo:
  name: "Plan a 5.1.2 system in a small living room"
  description: "End state: a wired, measurable 5.1.2 layout with front channels matched within 1 dB and seat-to-seat bass variance under 6 dB."
  totalTime: "PT120M"
  steps:
    - name: "Record the room and fix the seat"
      text: "Measure length, width and ceiling height. Put the main seat at 38 to 45 percent of room length and mark it with tape before moving any furniture."
    - name: "Draw the channel map and cable runs"
      text: "Mark 22 to 30 degree front angles, 30 to 55 degree height elevation and two opposing wall midpoints for subwoofers. Route height and rear cables now."
    - name: "Buy and place the front three plus the first subwoofer"
      text: "Set tweeters at ear height, match left and right levels within 1 dB, then run a 40 Hz sweep at three seats."
    - name: "Add the second subwoofer and set the crossover"
      text: "Compare 60, 70, 80 and 90 Hz at the main seat. Keep the value with the smallest 60 to 100 Hz dip, then add surrounds and heights."
sources:
  - title: "Dolby Atmos Home Theater Installation Guidelines"
    url: "https://www.dolby.com/about/support/guide/speaker-setup-guides/"
    publisher: "Dolby Laboratories"
    date: "2025-06-01"
  - title: "ITU-R BS.775 multichannel reference layout"
    url: "https://www.itu.int/rec/R-REC-BS.775"
    publisher: "ITU"
    date: "2022-01-01"
entities: ["Signal chain", "Bass management", "Room modes", "Dolby Atmos"]
claimReviewed: "In small rooms, seat position and two subwoofers change the measured result more than adding channels or upgrading the receiver."
breadcrumbLabel: "Small-room 5.1.2 plan"
---

## The room decides the budget

A 4.0 m by 4.2 m room is not a small version of a dedicated cinema. The axial modes sit higher, the sofa is close to the rear wall and the ceiling is usually 2.4 m, which puts height channels inside the reflection path of the front speakers. We measured 14 dB of cancellation at 48 Hz with the sofa at the halfway point of a 4.0 m room. Sliding it 0.7 m forward recovered 9 dB. No component in the catalogue does that for the price of moving a sofa.

Start with {{article:home-theater-speaker-placement|the placement protocol}}. It fixes angles, heights and the seat before any purchase. This page decides what to buy, in what order, and which cables to bury while the walls are open.

## Budget split that survives a measurement

| Line item | Share of a 3,000 EUR budget | Why |
| --- | --- | --- |
| Front three loudspeakers | 45 to 50 percent | Dialogue and the front stage carry most of the soundtrack |
| Two subwoofers + measurement mic | 25 to 30 percent | Seat-to-seat bass variance is the largest measurable error |
| AV receiver | 15 to 20 percent | Buy for channels, room correction and pre-outs, not wattage claims |
| Cable, mounts, acoustic panels | 5 to 10 percent | Cheap during renovation, expensive afterwards |

For the front speakers, {{article:bookshelf-vs-tower-speakers|the bookshelf versus tower decision}} is mostly about bass extension and output, not cabinet size. In a 16 m2 room with two subwoofers handling everything under 80 Hz, a good standmount is usually the easier fit. Amplification questions belong in {{article:speaker-amplifier-matching|the matching guide}}; the short version is that sensitivity tells you the voltage requirement, not the current.

## Wire for the system you will own in two years

Run four height-channel cables, two rear surrounds and two subwoofer lines before decoration. In our test flat the cable itself cost about 12 EUR per run; retrofitting the same four height lines meant lifting a 3.1 m cornice and repainting. Label both ends and leave 1 m of slack at the receiver position.

Keep the signal chain boring: sources into the receiver, receiver pre-outs to the subwoofers, no inline processors until a measurement says you need one. The {{glossary:signal-chain|chain}} only needs as many boxes as it has jobs.

## Bass is a system decision, not a speaker decision

One subwoofer in the front corner produced an 11 dB spread at 40 Hz across three seats in this room. Two smaller units at opposing wall midpoints cut that to 4 dB. The mechanism is modal averaging. Then try {{article:subwoofer-room-calibration|the calibration routine}} and sweep 60, 70, 80 and 90 Hz crossovers. In this specific room 70 Hz measured 3 dB flatter through the crossover than the default 80 Hz. The {{glossary:lfe-channel|LFE channel}} is separate from that redirected bass, which is why "set speakers to small" is not the whole story.

## A failure case worth knowing

We tried to save a channel by using up-firing modules on a 3.05 m textured ceiling. The object pan collapsed into the front stage and no amount of level trimming restored it. Height channels in a small room work best when they are physically in or on the ceiling at a 30 to 55 degree elevation angle. If the landlord forbids that, spend the height-channel budget on a second subwoofer and acoustic treatment instead.

## Upgrade order after the first measurement

1. Front three matched within 1 dB at the main seat.
2. Second subwoofer, then crossover chosen from a sweep.
3. Surrounds at 90 to 110 degrees, slightly above ear height.
4. Height layer, verified with an object pan rather than a test tone.
5. Only then consider receiver or source changes, following {{article:two-channel-hifi-system-chain|the stereo chain guide}} if music matters as much as film.
