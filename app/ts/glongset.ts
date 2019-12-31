/// <reference path="instrument.ts" />
/// <reference path="shaper.ts" />
namespace AppChing {
  export abstract class GlongSet {
    abstract chingOpen():Instrument
    abstract chingClosed():Instrument
    abstract glongs():Instrument[]
    //abstract glong(idx:number):Instrument
    
    chup(time:number, gain:number):void {
      this.chingClosed().noteOn(time, gain)
      this.chingOpen().kill(time)
    }
    ching(time:number, gain:number):void {
      this.chingOpen().noteOn(time, gain)
    }
    glong(time:number, gain:number, idx:number):void {
      console.assert(idx >= 0)
      if (idx < this.glongs().length)
        this.glongs()[idx].noteOn(time, gain)
    }

    abstract connect(gainChing:AudioNode, gainGlong:AudioNode):void
    abstract disconnect():void
  }

  export class GlongSetSynthesized extends GlongSet {
    _chingOpen:Instrument
    _chingClosed:Instrument
    distortionOpen:AudioNode
    distortionClosed:AudioNode
    gainChingOpen:GainNode
    ctx:AudioContext
    
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
    }
    
    chingOpen() { return this._chingOpen }
    chingClosed() { return this._chingClosed }
    glongs() { return [] }

    ching(time, gain) {
      super.ching(time, gain)
      // Once the open ching has finished decaying from the distortion phase, it must begin its release.
      this.chingOpen().noteOff((time || this.ctx.currentTime) + 0.1)
    }
    
    connect(gainChing:AudioNode):void {
      this.distortionClosed.connect(gainChing)
      this.gainChingOpen.connect(gainChing)
    }

    disconnect():void {
      this.distortionClosed.disconnect()
      this.gainChingOpen.disconnect()
    }
  }

  export class GlongSetSampled extends GlongSet {
    chups:Sample[]
    chings:Sample[]
    smpsGlong:Sample[][]
    _chingOpen:InstrumentSample
    _chingClosed:InstrumentSample
    _glongs:InstrumentSample[]
    
    constructor(ctx:AudioContext, chups:Sample[], chings:Sample[], glongs:Sample[][]) {
      super()
      this._chingOpen = new InstrumentSample(ctx)
      this._chingClosed = new InstrumentSample(ctx)
      this.chups = chups
      this.chings = chings
      this._glongs = glongs.map(_ => new InstrumentSample(ctx))
      this.smpsGlong = glongs
    }

    chingOpen() { return this._chingOpen }
    chingClosed() { return this._chingClosed }
    glongs() { return this._glongs }
    
    chup(time:number, gain:number):void {
      this._chingClosed.sample = this.chups[Math.round(Math.random() * (this.chups.length-1))]
      super.chup(time, gain)
    }
    
    ching(time:number, gain:number):void {
      this._chingOpen.sample = this.chings[Math.round(Math.random() * (this.chings.length-1))]
      super.ching(time, gain)
    }

    glong(time:number, gain:number, idx:number):void {
      console.assert(idx >= 0)
      if (idx < this._glongs.length) {
        this._glongs[idx].sample = this.smpsGlong[idx][Math.round(Math.random() * (this.smpsGlong[idx].length-1))]
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
    }
  }
}
