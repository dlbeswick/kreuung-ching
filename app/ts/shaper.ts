namespace AppChing {
  /**
    * Waveshaper from modified sigmoid curve.
    * This function can produce low-frequency artifacts that will need to be filtered away.
    *
    * "Factor" affects curve slope. Final factor value is interpolated from a and b from 0 to 1.
    * Choose equal factors for symmetric distortion (odd harmonics), or unequal for asymetric (even harmonics).
    */
  export function makeShaper(audioCtx, inputs, filterOnlyInputs, factorA=1, factorB=1, shift=1, oversample='4x',
                             highpass=20) {
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
}
