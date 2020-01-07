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

/// <reference path="instrument.ts" />
/// <reference path="shaper.ts" />
/// <reference path="lib/rand.ts" />

namespace AppChing {
  export abstract class GlongSet {
    abstract chingOpen():Instrument
    abstract chingClosed():Instrument
    abstract glongs():Instrument[]

    async init() {}
    
    chup(time:number, gain:number):void {
      this.chingClosed().noteOn(time, gain)
      this.chingOpen().kill(time)
    }
    ching(time:number, gain:number):void {
      this.chingOpen().noteOn(time, gain)
    }
    glong(time:number, gain:number, idx:number):void {
      assert(idx >= 0)
      if (idx < this.glongs().length) {
        // tbd: encode mutually exclusive instruments in data
        switch (idx) {
          case 1:
            if (this.glongs().length > 2)
              this.glongs()[2].kill(0)
            break
          case 2:
            if (this.glongs().length > 1)
              this.glongs()[1].kill(0)
            break
        }
        
        this.glongs()[idx].noteOn(time, gain)
      }
    }

    instruments():Instrument[] {
      return [this.chingOpen(), this.chingClosed()].concat(this.glongs())
    }

    abstract connect(gainChing:AudioNode, gainGlong:AudioNode):void
    abstract disconnect():void
    kill() {
      for (let i of this.instruments())
        i.kill(0)
    }
    detune(val:number) {
      for (let i of this.glongs())
        i.detune(val)
    }
  }

  export class GlongSetSynthesized extends GlongSet {
    _chingOpen:Instrument
    _chingClosed:Instrument
    distortionOpen:AudioNode
    distortionClosed:AudioNode
    gainChingOpen:GainNode
    ctx:AudioContext
    drums:Instrument[]
    
    constructor(ctx) {
      super()

      this.ctx = ctx
      
      const chingFreq = 3200.0
      const chingFreq1 = 2900.0
      const closeFreq = 5400.0
      const chingGain = 0.1 // gain must be low to avoid triggering the waveshaper during sustain
      
      const chingOpenHarmonic = (freq, gain, release) =>
        new InstrumentNodeFmExp(ctx, 'sine', freq, gain*25, 0.0, 0.0, 0.02, gain, release)
      
      this._chingOpen = new InstrumentComposite(
        [
          chingOpenHarmonic(chingFreq, chingGain*1, 0.8),
          chingOpenHarmonic(chingFreq*0.9985, chingGain*0.25, 0.8),
          chingOpenHarmonic(chingFreq1, chingGain*0.5, 0.7),
          chingOpenHarmonic(chingFreq1*0.9985, chingGain*0.125, 0.7),
          chingOpenHarmonic(chingFreq*2.586, chingGain*0.5, 0.4),
          chingOpenHarmonic(chingFreq*2.586*0.9985, chingGain*0.125, 0.4),
          chingOpenHarmonic(chingFreq1*2.586, chingGain*0.25, 0.3),
          chingOpenHarmonic(chingFreq1*2.586*0.9985, chingGain*0.0625, 0.3),
        ]
      )
      
      this._chingClosed = new InstrumentFm([
        new InstrumentNodeFmLin(ctx, 'sine', closeFreq, 3, 0.0, 0.046, 0, 0.0),
        new InstrumentNodeFmLin(ctx, 'square', closeFreq / 31, 10000, 0.00036, 0.370, 0, 0.0),
        new InstrumentNodeFmLin(ctx, 'square', closeFreq / 31, 10000, 0.00036, 0.370, 0, 0.0)
      ])

      this.distortionClosed = makeShaper(ctx, [this._chingClosed], [], 1, 1, 1, '4x', 100)
      
      const distortionOpen = makeShaper(ctx, [this._chingOpen], [], 1, 1, 1, '4x', 100)
      
      this.gainChingOpen = ctx.createGain()
      this.gainChingOpen.gain.value = 4
      distortionOpen.connect(this.gainChingOpen)
      
      this.drums = [
        new InstrumentDrumFm(
          ctx,
          ParamsInstrumentDrumFm.make(
            {freqStart: 250, freqEnd: 78, decay: 0.5, attack: 0.04}
          )
        ),
        new InstrumentDrumFm(
          ctx,
          ParamsInstrumentDrumFm.make(
            {freqStart: 300, freqEnd: 216, decay: 0.210, attack: 0.02, freqDecay: 0.035}
          )
        ),
        new InstrumentDrumFm(
          ctx,
          ParamsInstrumentDrumFm.make(
            {gain: 0.50, freqStart: 155, freqEnd: 120, decay: 0.05, attack: 0.0, magStrike: 2000}
          )
        ),
        new InstrumentDrumFm(
          ctx,
          ParamsInstrumentDrumFm.make(
            {freqStart: 470, freqEnd: 456, decay: 0.05, attack: 0.02, magStrike: 250}
          )
        ),
        new InstrumentDrumGabber(
          ctx,
          ParamsInstrumentDrumFm.make(
            {gain: 3, freqStart: 200, freqEnd: 38, decay: 0.625, attack: 0.04, magFreqVary:0.25, magStrike: 250}
          ),
          2
        ),
        new InstrumentDrumGabber(
          ctx,
          ParamsInstrumentDrumFm.make(
            {gain: 3, freqStart: 200, freqEnd: 38, decay: 0.5, attack: 0.04, magFreqVary:0.25, magStrike: 250}
          ),
          10
        ),
        new InstrumentDrumGabber(
          ctx,
          ParamsInstrumentDrumFm.make(
            {gain: 3, freqStart: 200, freqEnd: 38, decay: 0.5, attack: 0.04, magFreqVary:0.25, magStrike: 250}
          ),
          3000
        )
      ]
    }

    chingOpen() { return this._chingOpen }
    chingClosed() { return this._chingClosed }
    glongs() { return this.drums }

    ching(time, gain) {
      super.ching(time, gain)
      // Once the open ching has finished decaying from the distortion phase, it must begin its release.
      this.chingOpen().noteOff((time || this.ctx.currentTime) + 0.1)
    }
    
    connect(gainChing:AudioNode, gainGlong:AudioNode):void {
      for (let i of [this.distortionClosed, this.gainChingOpen]) i.connect(gainChing)
      for (let i of this.drums) i.connect(gainGlong)
    }

    disconnect():void {
      for (let i of [this.distortionClosed, this.gainChingOpen]) i.disconnect()
      for (let i of this.drums) i.disconnect()
    }
  }

  export class GlongSetSampled extends GlongSet {
    chups:Sample[]
    chings:Sample[]
    smpsGlong:Sample[][]
    _chingOpen:InstrumentSample
    _chingClosed:InstrumentSample
    _glongs:InstrumentSample[]
    valsRnd:number[] = []
    rand:Rand.RandLcg = new Rand.RandLcg()
    ctx:AudioContext
    
    constructor(ctx:AudioContext, chups:Sample[], chings:Sample[], glongs:Sample[][]) {
      super()
      this.ctx = ctx
      this._chingOpen = new InstrumentSample(ctx)
      this._chingClosed = new InstrumentSample(ctx)
      this.chups = chups
      this.chings = chings
      this._glongs = glongs.map(_ => new InstrumentSample(ctx))
      this.smpsGlong = glongs
    }

    samples():Sample[] {
      return this.chups.concat(this.chings).concat(this.smpsGlong.reduce((a,b) => a.concat(b)))
    }
    
    async init() {
      for (let p of this.samples().map(s => s.load(this.ctx))) await p
    }
    
    chingOpen() { return this._chingOpen }
    chingClosed() { return this._chingClosed }
    glongs() { return this._glongs }

    private sampleRandom(smps:Sample[]):Sample {
      return smps[this.rand.irand(0, smps.length)]
    }
    
    chup(time:number, gain:number):void {
      this._chingClosed.sample = this.sampleRandom(this.chups)
      super.chup(time, gain)
    }
    
    ching(time:number, gain:number):void {
      this._chingOpen.sample = this.sampleRandom(this.chings)
      super.ching(time, gain)
    }

    glong(time:number, gain:number, idx:number):void {
      assert(idx >= 0)
      if (idx < this._glongs.length) {
        this._glongs[idx].sample = this.sampleRandom(this.smpsGlong[idx])
        super.glong(time, gain, idx)
      }
    }
    
    connect(gainChing:AudioNode, gainGlong:AudioNode):void {
      this.chingOpen().connect(gainChing)
      this.chingClosed().connect(gainChing)
      for (let g of this.glongs()) g.connect(gainGlong)
    }

    disconnect():void {
      this.chingOpen().disconnect()
      this.chingClosed().disconnect()
      for (let g of this.glongs()) g.disconnect()
    }
  }
}
