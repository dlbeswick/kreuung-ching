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

import { makeShaper } from "./shaper.js";
import { assert } from "./lib/assert.js";

export abstract class Instrument {
  abstract noteOn(time: number, gain: number): void
  abstract noteOff(time: number): void
  abstract kill(time: number): void
  abstract connect(node: AudioNode|AudioParam): void
  abstract disconnect(): void
  abstract detune(val: number): void
}

// An instrument with a designated output node
export abstract class InstrumentOutput extends Instrument {
  abstract output(): AudioNode

  connect(node: AudioNode|AudioParam) {
    this.output().connect(node as any)
  }
  
  disconnect() {
    this.output().disconnect()
  }
}

export abstract class InstrumentSynced extends Instrument {
  abstract instruments(): Instrument[]
  
  noteOn(time: number, gain=1) {
    for (let i of this.instruments()) i.noteOn(time, gain)
  }
  
  noteOff(time: number) {
    for (let i of this.instruments()) i.noteOff(time)
  }
  
  kill(time: number) {
    for (let i of this.instruments()) i.kill(time)
  }
}

// An instrument made up of a number of other instruments that are triggered in concert.
export class InstrumentComposite extends InstrumentSynced {
  _instruments: Instrument[]

  constructor(instruments: Instrument[]) {
    super()
    this._instruments = instruments
  }

  instruments() { return this._instruments }

  connect(node: AudioNode|AudioParam) {
    for (let i of this.instruments()) i.connect(node)
  }
  
  disconnect() {
    for (let i of this.instruments()) i.disconnect()
  }

  detune(val: number) {
    for (let i of this.instruments()) i.detune(val)
  }
}

export abstract class InstrumentNodeFm extends InstrumentOutput {
  osc: OscillatorNode
  nodeGain: GainNode
  
  output() { return this.nodeGain }
  
  constructor(readonly ctx: AudioContext, type: OscillatorType, freq: number) {
    super()
    this.nodeGain = ctx.createGain()
    this.nodeGain.gain.value = 0
    
    // 2018-12-31: iPad doesn't support node constructors, so use "create" functions.
    this.osc = ctx.createOscillator()
    this.osc.type = type
    this.osc.frequency.value = freq
    this.osc.connect(this.nodeGain)
    this.osc.start()
  }

  detune(val: number) {
    this.osc.detune.setTargetAtTime(val, 0, 0.01)
  }
}

export class InstrumentNodeFmLin extends InstrumentNodeFm {

  constructor(audioCtx: AudioContext, type: OscillatorType, freq: number, readonly gain: number,
              readonly tAttack: number, readonly tDecay: number, readonly gSustain: number,
              readonly tRelease: number) {
    super(audioCtx, type, freq)
  }

  noteOn(time: number, gainNoteOn=1) {
    const startTime = time || this.ctx.currentTime
    this.nodeGain.gain.cancelScheduledValues(startTime)
    if (this.tAttack) {
      this.nodeGain.gain.setValueAtTime(0, startTime)
      this.nodeGain.gain.linearRampToValueAtTime(this.gain * gainNoteOn, startTime + this.tAttack)
    } else {
      this.nodeGain.gain.setValueAtTime(this.gain * gainNoteOn, startTime)
    }
    this.nodeGain.gain.linearRampToValueAtTime(this.gSustain * gainNoteOn, startTime + this.tAttack + this.tDecay)
  }
  
  noteOff(time: number) {
    this.nodeGain.gain.cancelScheduledValues(time)
    this.nodeGain.gain.linearRampToValueAtTime(0, time + this.tRelease)
  }
  
  kill(time: number) {
    this.nodeGain.gain.linearRampToValueAtTime(0, time + 0.0001)
  }
}

// FM instrument with exponential volume envelope
export class InstrumentNodeFmExp extends InstrumentNodeFm {
  gain: number

  output() { return this.nodeGain }
  
  constructor(audioCtx: AudioContext, type: OscillatorType, freq: number, gain: number, readonly tAttack: number,
              readonly cAttack: number, readonly cDecay: number, readonly gSustain: number,
              readonly cRelease: number) {
    super(audioCtx, type, freq)

    this.cAttack = cAttack
    this.tAttack = tAttack
    this.gSustain = gSustain
    this.cDecay = cDecay
    this.cRelease = cRelease
    this.gain = gain
  }

  noteOn(time: number, gainNoteOn=1) {
    const startTime = time || this.ctx.currentTime
    this.nodeGain.gain.cancelScheduledValues(startTime)
    if (this.tAttack) {
      this.nodeGain.gain.setValueAtTime(0, startTime)
      this.nodeGain.gain.setTargetAtTime(this.gain * gainNoteOn, startTime, this.cAttack)
    } else {
      this.nodeGain.gain.setValueAtTime(this.gain * gainNoteOn, startTime)
    }
    this.nodeGain.gain.setTargetAtTime(this.gSustain * gainNoteOn, startTime + this.tAttack, this.cDecay)
  }
  
  noteOff(time: number) {
    this.nodeGain.gain.cancelScheduledValues(time)
    this.nodeGain.gain.setTargetAtTime(0, time, this.cRelease)
  }
  
  kill(time: number) {
    this.nodeGain.gain.linearRampToValueAtTime(0, time + 0.0001)
  }
}

export class InstrumentFm extends InstrumentSynced {
  fmNodes: InstrumentNodeFm[]

  instruments() { return this.fmNodes }
  
  constructor(fmNodes: InstrumentNodeFm[], connections?: number[][], gain=1) {
    super()
    assert(fmNodes.length)
    
    this.fmNodes = fmNodes
    if (!connections) {
      for (let i = 0; i < fmNodes.length - 1; ++i) {
        fmNodes[i + 1].connect(fmNodes[i].osc.frequency)
      }
    } else {
      connections.forEach(c => fmNodes[c[0]].connect(fmNodes[c[1]].osc.frequency))
    }
  }
  
  connect(node: AudioNode|AudioParam) {
    this.fmNodes[0].connect(node)
  }
  
  disconnect() {
    this.fmNodes[0].disconnect()
  }

  detune(val: number) {
    this.fmNodes[0].detune(val)
  }
}

export class ParamsInstrumentDrumFm {
  freqStart=225
  freqEnd=80

  // Gives some 'wobble' to the drum sustain
  freqVary?: number
  magFreqVary = 0
  
  decay=0.7
  freqDecay=0.07
  attack=0.1
  type: OscillatorType = 'sine'
  gain=1
  magStrike=50

  static make(params: any): ParamsInstrumentDrumFm {
    return {...new ParamsInstrumentDrumFm(), ...params}
  }
}

export class InstrumentDrumFm extends InstrumentFm {
  carrier: InstrumentNodeFm
  params: ParamsInstrumentDrumFm
  ctx: AudioContext
  
  constructor(audioCtx: AudioContext, params: ParamsInstrumentDrumFm) {
    const carrier = new InstrumentNodeFmLin(audioCtx, params.type, params.freqEnd, params.gain,
                                            params.attack, params.decay, 0, 0.0)

    const freqStrike = params.freqStart/2
    const striker = new InstrumentNodeFmLin(audioCtx, 'square', freqStrike, params.magStrike, 0.0036, 0.05, 1, 0.0)

    const nodes = [carrier]
    if (params.freqVary) {
      nodes.push(new InstrumentNodeFmLin(audioCtx, 'sine', params.freqVary, params.magFreqVary, 0.036,
                                         params.decay*2, 1, 0.0))
    }
    nodes.push(striker)
    
    super(
      nodes, 
      (() => { if (params.freqVary) return [[1,0],[2,0]] ; else return undefined })()
    )

    this.ctx = audioCtx
    this.carrier = carrier
    this.params = params
  }

  noteOn(time: number, gain: number) {
    time = time || this.ctx.currentTime
    this.carrier.osc.frequency.setValueAtTime(this.params.freqStart, time)
    this.carrier.osc.frequency.exponentialRampToValueAtTime(this.params.freqEnd, time + this.params.freqDecay)
    super.noteOn(time, gain)
  }
}

export class InstrumentDrumGabber extends InstrumentOutput {
  gain: GainNode
  drum: InstrumentDrumFm
  
  constructor(audioCtx: AudioContext, params: ParamsInstrumentDrumFm, overdrive=2) {
    super()
    
    this.gain = audioCtx.createGain()
    this.gain.gain.value = params.gain

    this.drum = new InstrumentDrumFm(audioCtx, {...params, gain: overdrive} as ParamsInstrumentDrumFm)
    
    const shaper = makeShaper(audioCtx, [this.drum], [], 1, 1, 1, 'none', 50)

    shaper.connect(this.gain)
  }

  noteOn(time: number, gain: number) {
    this.drum.noteOn(time, gain)
  }
  
  noteOff(time: number) {
    this.drum.noteOff(time)
  }

  kill(time: number) {
    this.drum.kill(time)
  }
  
  output() {
    return this.gain
  }
  
  detune(val: number) {
    this.drum.detune(val)
  }
}

export class Sample {
  url: string
  private _data?: AudioBuffer
  
  constructor(url: string, readonly cordova: any) {
    this.url = url
  }

  data(): AudioBuffer {
    assert(this._data, "load not called")
    return this._data
  }

  private async loadBrowser(url: string) {
    const response = await fetch(url)
    if (!response.body)
      throw new Error("No response body for url " + url)
    
    const reader = response.body.getReader()
    let result = new Uint8Array()
    
    while (true) {
      let srr = await reader.read()
      if (srr.done)
        break
      else {
        const next = new Uint8Array(result.length + srr.value.length)
        next.set(result, 0)
        next.set(srr.value, result.length)
        result = next
      }
    }
    
    if (!response.ok) {
      console.debug(this._data)
      throw "Error getting sample at '" + response.url +"': " + response.status
    } else {
      return result.buffer
    }
  }
  
  async load(ctx: AudioContext) {
    let url: string

    url = "data/" + this.url

    try {
      const buffer = await this.loadBrowser(url)
      this._data = await ctx.decodeAudioData(buffer)
    } catch (e) {
      throw "Error getting sample at '" + url + "': " + JSON.stringify(e)
    }
  }
}

export class InstrumentSample extends InstrumentOutput {
  gain: GainNode
  node?: AudioBufferSourceNode
  ctx: AudioContext
  sample?: Sample
  _detune = 0.0
  
  constructor(ctx: AudioContext, sample?: Sample) {
    super()
    this.ctx = ctx
    this.sample = sample
    this.gain = this.ctx.createGain()
  }

  output() { return this.gain }

  noteOn(time: number, gain: number): void {
    if (this.sample) {
      if (this.node)
        this.node.disconnect()
      this.node = this.ctx.createBufferSource()
      this.node.buffer = this.sample.data()
      this.node.detune.value = this._detune
      this.node.connect(this.gain)
      this.gain.gain.value = gain
      this.node.start(time)
    }
  }
  
  noteOff(time: number): void {
    if (this.node) {
      this.node.stop(time)
    }
  }
  
  kill(time: number): void {
    this.noteOff(time)
  }

  detune(val: number) {
    this._detune = val
  }
}
