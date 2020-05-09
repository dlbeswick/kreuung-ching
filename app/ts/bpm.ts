import { assert } from "./lib/assert.js"

const BEATS_PER_HONG = 2

function bpmToTickPeriodMs(bpm) {
  return 60000.0 / bpm / 2
}

function bpmRampSeconds(bpmStart:number, bpmEnd:number, durHong:number) {
  // suvat...
  const a = (bpmEnd**2 - bpmStart**2) / 2 / (durHong * BEATS_PER_HONG)
  const durMins = (bpmEnd - bpmStart) / a
  return durMins * 60
}

export class BpmControl {
  private _bpm:number = 75
  private _msTickPeriod:number = bpmToTickPeriodMs(75)
  private timings = undefined
  private timeoutTick?:number
  private timeoutBpmRamp?:number
  private tickTimeLast?:number
  private _playing = false
  private ending = false
  private _tick = 0
  private tickStart = 0

  constructor(private readonly eBpmJing:HTMLInputElement,
              private readonly funcTick:() => void) {
  }
  
  change(bpm:number) {
    assert(!Number.isNaN(Number(bpm)))

    this._bpm = bpm
    const oldPeriod = this._msTickPeriod
    this._msTickPeriod = bpmToTickPeriodMs(bpm)

    // Reset timings if timing is activated
    if (this.timings != undefined)
      this.timings = []

    // Tick times are calculated relative to a start time as this improves precision due to the lack of
    // accumlating error from repeated additions to the base time.
    if (this._playing && this._tick != 0) {
      const thisTickTime = this.tickStart + oldPeriod * (this._tick-1)
      const newTickTime = thisTickTime + this._msTickPeriod
      this.tickStart = newTickTime - this._msTickPeriod * this._tick

      // re-calculate next tick time
      // Only re-trigger the tick if there's a sufficiently large delta, otherwise the asynchronous event may
      // be triggered even before the timeout is cleared, resulting in a double-trigger. For small deltas, the
      // difference isn't noticable anyway, and may even be wrong due to browser time precision fuzzing.
      const newNextTick = Math.max(0, newTickTime - window.performance.now())
      if (this.timeoutTick && newNextTick > 100) {
        window.clearTimeout(this.timeoutTick)
        this.timeoutTick = window.setTimeout(
          this.onTick.bind(this),
          newNextTick
        );
      }
    }
    
    this.eBpmJing.value = this._bpm.toString()
  }

  bpm() { return this._bpm }
  tick() { return this._tick }
  playing() { return this._playing }
  msTickPeriod() { return this._msTickPeriod }
  
  play() {
    this._tick = 0
    this._playing = true
    this.tickStart = window.performance.now()
    this.onTick()
  }

  stop() {
    this.ending = false
    this._playing = false
    for (const t of [this.timeoutTick, this.timeoutBpmRamp]) {
      window.clearTimeout(t)
    }
  }
  
  private onTick() {
    ++this._tick
    
    this.funcTick()

    this.tickTimeLast = window.performance.now()
    
    if (this.timings != undefined && this.timings.push(this.tickTimeLast) == 80) {
      const timings = this.timings
      this.timings = undefined

      const diffs = [];
      for (let i = 1; i < timings.length; ++i) {
        diffs.push(timings[i] - timings[i-1])
      }

      let report = "Tick #: " + this._tick + "\n"
      report += "Ideal tick period: " + this._msTickPeriod + "\n"
      report += "Mean tick period: " + diffs.reduce((acc, v) => acc + v, 0) / diffs.length + "\n"

      diffs.sort()
      report += "Median tick period: " + diffs[Math.floor(diffs.length/2)]

      alert(report)
    }
    
    this.timeoutTick = window.setTimeout(
      this.onTick.bind(this),
      (this.tickStart + this._msTickPeriod * this._tick) - this.tickTimeLast
    );
  }
    
  debugTimings() {
    if (this.timings == undefined)
      this.timings = []
    else
      this.timings = undefined
  }

  bpmRamp(bpmEnd, secTime, onStop=null) {
    window.clearTimeout(this.timeoutBpmRamp)
    
    const startBpm = this._bpm
    const updatesPerSec = 10
    const updates = Math.max(Math.floor(secTime * updatesPerSec), 1)

    const loop = i => {
      if (i == updates) {
        this.change(bpmEnd)
        if (onStop) {
          onStop()
        }
      } else {
        this.change(startBpm + (i/updates) * (bpmEnd - startBpm))
        this.timeoutBpmRamp = window.setTimeout(() => loop(i+1), 1000/updatesPerSec)
      }
    }

    loop(1)
  }

  bpmRampHongs(bpmEnd:number, hongs:number, onStop=null) {
    this.bpmRamp(
      bpmEnd,
      bpmRampSeconds(this._bpm, bpmEnd, hongs),
      onStop
    )
  }

  end(hongs:number) {
    if (!this.ending) {
      const bpmEnd = Math.min(45, this._bpm/2)
      this.bpmRampHongs(bpmEnd, hongs, this.stop.bind(this))
      this.ending = true
    }
  }
}
