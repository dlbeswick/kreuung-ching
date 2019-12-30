/// <reference path="shaper.ts" />
namespace AppChing {
  export abstract class Instrument {
    abstract noteOn(time:number, gain:number):void
    abstract noteOff(time:number):void
    abstract kill(time:number):void
    abstract connect(node:AudioNode|AudioParam):void
    abstract disconnect():void
  }

  // An instrument with a designated output node
  export abstract class InstrumentOutput extends Instrument {
    abstract output():AudioNode

    connect(node:AudioNode|AudioParam) {
      this.output().connect(node as any)
    }
    
    disconnect() {
      this.output().disconnect()
    }
  }

  export abstract class InstrumentSynced extends Instrument {
    abstract instruments(): Instrument[]
    
    noteOn(time:number, gain=1) {
      for (let i of this.instruments()) i.noteOn(time, gain)
    }
    
    noteOff(time) {
      for (let i of this.instruments()) i.noteOff(time)
    }
    
    kill(time) {
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

    connect(node:AudioNode|AudioParam) {
      for (let i of this.instruments()) i.connect(node)
    }
    
    disconnect() {
      for (let i of this.instruments()) i.disconnect()
    }
  }

  export abstract class InstrumentNodeFm extends InstrumentOutput {
    osc:OscillatorNode
    nodeGain:GainNode
    ctx:AudioContext
    
    output() { return this.nodeGain }
    
    constructor(audioCtx, type, freq, gain) {
      super()
      this.ctx = audioCtx
      this.nodeGain = audioCtx.createGain()
      this.nodeGain.gain.value = 0
      
      // 2018-12-31: iPad doesn't support node constructors, so use "create" functions.
      this.osc = audioCtx.createOscillator()
      this.osc.type = type
      this.osc.frequency.value = freq
      this.osc.connect(this.nodeGain)
      this.osc.start()
    }
  }
  
  export class InstrumentNodeFmLin extends InstrumentNodeFm {
    tAttack:number
    gain:number
    gSustain:number
    tDecay:number
    tRelease:number

    constructor(audioCtx, type, freq, gain, tAttack, tDecay, gSustain, tRelease) {
      super(audioCtx, type, freq, gain)

      this.tAttack = tAttack
      this.gSustain = gSustain
      this.tDecay = tDecay
      this.tRelease = tRelease
      this.gain = gain
    }

    noteOn(time, gainNoteOn=1) {
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
    
    noteOff(time) {
      this.nodeGain.gain.cancelScheduledValues(time)
      this.nodeGain.gain.linearRampToValueAtTime(0, time + this.tRelease)
    }
    
    kill(time) {
      this.nodeGain.gain.linearRampToValueAtTime(0, time + 0.0001)
    }
  }

  export class InstrumentNodeFmExp extends InstrumentNodeFm {
    cAttack:number
    tAttack:number
    gain:number
    gSustain:number
    cDecay:number
    cRelease:number

    output() { return this.nodeGain }
    
    constructor(audioCtx, type, freq, gain, tAttack, cAttack, cDecay, gSustain, cRelease) {
      super(audioCtx, type, freq, gain)

      this.cAttack = cAttack
      this.tAttack = tAttack
      this.gSustain = gSustain
      this.cDecay = cDecay
      this.cRelease = cRelease
      this.gain = gain
    }

    noteOn(time, gainNoteOn=1) {
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
    
    noteOff(time) {
      this.nodeGain.gain.cancelScheduledValues(time)
      this.nodeGain.gain.setTargetAtTime(0, time, this.cRelease)
    }
    
    kill(time) {
      this.nodeGain.gain.linearRampToValueAtTime(0, time + 0.0001)
    }
  }
  
  export class InstrumentFm extends InstrumentSynced {
    fmNodes:InstrumentNodeFm[]

    instruments() { return this.fmNodes }
    
    constructor(audioCtx:AudioContext, fmNodes:InstrumentNodeFm[], connections?:number[][], gain=1) {
      super()
      console.assert(fmNodes.length)
      
      this.fmNodes = fmNodes
      if (!connections) {
        for (let i = 0; i < fmNodes.length - 1; ++i) {
          fmNodes[i + 1].connect(fmNodes[i].osc.frequency)
        }
      } else {
        connections.forEach(c => fmNodes[c[0]].connect(fmNodes[c[1]].osc.frequency))
      }
    }
    
    connect(node:AudioNode|AudioParam) {
      this.fmNodes[0].connect(node)
    }
    
    disconnect() {
      this.fmNodes[0].disconnect()
    }
  }

  interface Detunable {
    // Note: generally only needed if system doesn't support constant source node.
    detune(val:number)
  }
  
  export class ParamsInstrumentDrumFm {
    freqStart=225
    freqEnd=80

    // Gives some 'wobble' to the drum sustain
    freqVary?:number
    magFreqVary?:number
    
    decay=0.7
    freqDecay=0.07
    attack=0.1
    type='sine'
    gain=1
    magStrike=50

    static make(params:any): ParamsInstrumentDrumFm {
      return {...new ParamsInstrumentDrumFm(), ...params}
    }
  }
  
  export class InstrumentDrumFm extends InstrumentFm implements Detunable {
    carrier:InstrumentNodeFm
    params:ParamsInstrumentDrumFm
    ctx:AudioContext

    // Note: ConstantSourceNode not available on iOS
    constructor(audioCtx:AudioContext, params:ParamsInstrumentDrumFm, tuning?:ConstantSourceNode) {
      const carrier = new InstrumentNodeFmLin(audioCtx, params.type, params.freqEnd, params.gain,
                                          params.attack, params.decay, 0, 0.0)

      if (tuning) {
        tuning.connect(carrier.osc.detune)
      }
      
      const freqStrike = params.freqStart/2
      const striker = new InstrumentNodeFmLin(audioCtx, 'square', freqStrike, params.magStrike, 0.0036, 0.05, 1, 0.0)

      const nodes = [carrier]
      if (params.freqVary) {
        nodes.push(new InstrumentNodeFmLin(audioCtx, 'sine', params.freqVary, params.magFreqVary, 0.036,
                                        params.decay*2, 1, 0.0))
      }
      nodes.push(striker)
      
      super(
        audioCtx,
        nodes, 
        (() => { if (params.freqVary) return [[1,0],[2,0]] ; else return undefined })()
      )

      this.ctx = audioCtx
      this.carrier = carrier
      this.params = params
    }

    noteOn(time:number, gain:number) {
      time = time || this.ctx.currentTime
      this.carrier.osc.frequency.setValueAtTime(this.params.freqStart, time)
      this.carrier.osc.frequency.exponentialRampToValueAtTime(this.params.freqEnd, time + this.params.freqDecay)
      super.noteOn(time, gain)
    }

    detune(val) {
      this.carrier.osc.detune.setTargetAtTime(val, 0, 0.01)
    }
  }

  export class InstrumentDrumGabber extends InstrumentOutput implements Detunable {
    gain:GainNode
    drum:InstrumentDrumFm
    
    constructor(audioCtx, params:ParamsInstrumentDrumFm, tuning?:ConstantSourceNode, overdrive=2) {
      super()
      
      this.gain = audioCtx.createGain()
      this.gain.gain.value = params.gain

      this.drum = new InstrumentDrumFm(audioCtx, {...params, gain: overdrive} as ParamsInstrumentDrumFm, tuning)
      
      const shaper = makeShaper(audioCtx, [this.drum], [], 1, 1, 1, '1x', 50)

      shaper.connect(this.gain)
    }

    noteOn(time:number, gain:number) {
      this.drum.noteOn(time, gain)
    }
    
    noteOff(time:number) {
      this.drum.noteOff(time)
    }

    kill(time:number) {
      this.drum.kill(time)
    }
    
    output() {
      return this.gain
    }
    
    detune(val) {
      this.drum.detune(val)
    }
  }
}
