---
layout: page
title: Multi-stage BJT Op-Amp Design
description: Design and simulation of a multi-stage BJT operational amplifier with gain, bandwidth, and stability optimization
img: assets/img/3.jpg
importance: 2
category: Circuit Design
---

## Overview

This project involves the design and simulation of a **multi-stage BJT (Bipolar Junction Transistor) operational amplifier** with specific performance targets for gain, bandwidth, and phase margin. The design process covers DC bias point analysis, small-signal modeling, frequency response optimization, and stability analysis.

## Design Specifications

| Parameter | Target |
|-----------|--------|
| Open-loop Gain | > 80 dB |
| Unity-gain Bandwidth | > 1 MHz |
| Phase Margin | > 60° |
| Slew Rate | > 1 V/us |
| Power Supply | +/-15 V |

## Circuit Architecture

The op-amp consists of three main stages:

1. **Differential Input Stage**: Long-tailed pair with active current mirror load for high CMRR
2. **Voltage Gain Stage**: Common-emitter amplifier with active load for high voltage gain
3. **Output Stage**: Class-AB push-pull output for low output impedance and high current drive

## Analysis Methods

- **DC Operating Point Analysis**: Ensuring all transistors operate in the active region
- **Small-Signal AC Analysis**: Bode plot for gain and phase response
- **Transient Analysis**: Step response and slew rate measurement
- **Monte Carlo Simulation**: Process variation sensitivity analysis

## Key Results

The design achieves the target specifications. Frequency compensation using Miller capacitance ensures dominant-pole behavior for stable closed-loop operation.

$$A_v = g_{m1} \cdot g_{m2} \cdot R_{out}$$

where $$g_m$$ is the transconductance of each stage.

## Tools Used

- **SPICE Simulation** (LTspice / Cadence Virtuoso)
- **MATLAB** for frequency response plotting and analysis
