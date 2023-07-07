/*
	เครื่องฉิ่ง / Kreuung Ching
  This file is part of the Automatic Ching program for practicing
  Thai music.
  
  Copyright (C) 2019 David Beswick <dlbeswick@gmail.com>

  This program is free software: you can redistribute it and/or modify
  it under the terms of the GNU Affero General Public License as
  published by the Free Software Foundation, either version 3 of the
  License, or (at your option) any later version.

  This program is distributed in the hope that it will be useful,
  but WITHOUT ANY WARRANTY; without even the implied warranty of
  MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
  GNU Affero General Public License for more details.

  You should have received a copy of the GNU Affero General Public License
  along with this program.  If not, see <https://www.gnu.org/licenses/>.
*/

/**
 * Waveshaper from modified sigmoid curve.
 * This function can produce low-frequency artifacts that will need to be filtered away.
 *
 * "Factor" affects curve slope. Final factor value is interpolated from a and b from 0 to 1.
 * Choose equal factors for symmetric distortion (odd harmonics), or unequal for asymetric (even harmonics).
 */
import {
  Instrument
} from "./instrument.js";

export function makeShaper(audioCtx: AudioContext, inputs: Instrument[], filterOnlyInputs: Instrument[],
                           factorA=1, factorB=1, shift=1, oversample: OverSampleType = '4x', highpass=20) {
  
  const shaper = audioCtx.createWaveShaper()
  const curve = new Float32Array(44100)
  for (let i=0; i < 44100; ++i) {
    const x = i/44100.0
    const valA = -1.0 / (1.0 + Math.exp(shift - x * factorA))
    const valB = -1.0 / (1.0 + Math.exp(shift - x * factorB))
    curve[i] = valA + (valB - valA) * Math.pow(x,2)
  }
  shaper.curve = curve
  shaper.oversample = oversample
  
  const filter = audioCtx.createBiquadFilter()
  filter.type = 'highpass'
  filter.frequency.value = highpass
  shaper.connect(filter)

  for (let i of inputs) i.connect(shaper)
  for (let i of filterOnlyInputs) i.connect(filter)
  
  return filter
}
