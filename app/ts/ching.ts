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

import * as messages from "./messages.js"
import * as patterns from "./patterns.js"

import { Sample } from "./instrument.js"
import { GlongSet, GlongSetSampled, GlongSetSynthesized } from "./glongset.js"

import { assert } from "./lib/assert.js"
import { errorHandler } from "./lib/error_handler.js"

var cordova:any = (window as any).cordova
var device:any = (window as any).device

const MSG = messages.makeMultilingual([new messages.MessagesThai(), new messages.MessagesEnglish()])

const BEATS_PER_HONG = 2

window.onerror = errorHandler

export class DrumPattern {
  private pattern?:string
  private patternTickStart = 0
  private actionIdx = -1
  private lengthTicks:number
  private _tick:number = -1
  
  constructor(readonly actions:any[]) {
    this.lengthTicks = this.actions.reduce((acc, a) => acc + (a.length ?? 0), 0)
  }

  seek(tick:number) {
    tick = tick % this.lengthTicks
    this.actionIdx = 0
    this.pattern = null
    this._tick = 0
    let actionTick = 0
    // Move this logic to action classes...
    while (this.actionIdx < this.actions.length && this._tick != tick) {
      const action = this.actions[this.actionIdx]
      if (action.length) {
        if (tick < this._tick + action.length) {
          this.pattern = action.pattern.slice(tick - this._tick)
          this._tick = tick
          this.patternTickStart = this._tick
          break
        } else {
          this._tick += action.length
        }
      }
      ++this.actionIdx
    }
  }

  tick(app:AppChing) {
    if (!this.actions.length)
      return
    
    if (this.pattern && this._tick - this.patternTickStart < this.pattern.length) {
      const drum = Number(this.pattern[this._tick - this.patternTickStart])
      if (!Number.isNaN(drum)) {
        app.glongSet.glong(0, 1, drum)
      }
      this._tick = (this._tick + 1) % this.lengthTicks
    } else {
      const action = this.actions[this.actionIdx]
      switch (action.action) {
        case "drumpattern":
          this.pattern = action.pattern
          this.patternTickStart = this._tick
          break
        case "bpm":
          app.bpmRamp(action.bpm, this._tick == 0 ? 0 : Math.abs(action.bpm - app.bpm))
          break
        case "bpmFactor":
          const bpmNext = app.bpm * action.factor
          app.bpmRamp(bpmNext, this._tick == 0 ? 0 : Math.abs(bpmNext - app.bpm))
          break
        case "end":
          const bpmStart = this.bpm
          const bpmEnd = Math.min(45, this.bpm/2)
          const durHong = 2
          const a = ((bpmEnd/60)**2 - (bpmStart/60)**2) / 2 / (durHong * BEATS_PER_HONG)
          const t = ((bpmEnd/60) - (bpmStart/60)) / a
          app.bpmRamp(bpmEnd, t, () => app.onStop)
          break
      }
      this.actionIdx = (this.actionIdx + 1) % this.actions.length
      this.tick(app)
    }
  }
}

class AppChing {
  analyserActive = false
  tick = 0
  tickStart = null
  tickTimeLast = null
  bpm = null
  tickPeriod = null
  currentTimeout = null
  playing = false
  timings = undefined
  drumPattern?:DrumPattern
  drumPatternNext?:DrumPattern

  private glongSetDetune:number
  glongSet?:GlongSet
  
  private audioCtx?:AudioContext
  private analyser?:AnalyserNode
  private gainChing?:GainNode
  private gainGlong?:GainNode
  private gainMaster?:GainNode
  private quietNoise?:AudioBufferSourceNode
  
  constructor(
    private readonly eBpm:HTMLInputElement,
    private readonly eBpmJing:HTMLInputElement,
    private readonly tuneGlong:HTMLInputElement,
    private readonly eHong:HTMLInputElement,
    private readonly ePlay:HTMLButtonElement,
    private readonly eStop:HTMLButtonElement,
    private readonly ePlayDelay:HTMLButtonElement,
    private readonly eChingVises:HTMLElement[]
  ) {
    this.eStop.setAttribute('disabled',undefined)
  }
  
  debugTimings() {
    if (this.timings == undefined)
      this.timings = []
    else
      this.timings = undefined
  }
  
  async setup(
    eAnalyser:HTMLCanvasElement,
    eAnalyserOn:HTMLButtonElement,
    eAnalyserOff:HTMLButtonElement,
    eGlongSelect:HTMLSelectElement,
    ePlayChingClosed:HTMLButtonElement,
    ePlayChingOpen:HTMLButtonElement,
    ePlayGlongs:HTMLCollectionOf<Element>,
    bpmMods:HTMLCollectionOf<Element>,
    patternDrum:HTMLTextAreaElement,
    presetsDrumPattern:[HTMLElement,string][],
    gainGlong:HTMLElement,
    gainChing:HTMLElement
  ) {
    let audioCtx = null
    try {
      audioCtx = new ((<any>window).AudioContext || (<any>window).webkitAudioContext)()
    } catch(e) {
      if (device.platform == 'browser') {
        throw MSG.errorAudioContextWeb(e)
      } else {
        throw MSG.errorAudioContextAndroid(e)
      }
    }
    this.audioCtx = audioCtx
    
    this.gainMaster = audioCtx.createGain()
    this.gainMaster.gain.value = 0.5
    this.gainMaster.connect(audioCtx.destination)

    this.gainGlong = audioCtx.createGain()
    this.gainGlong.connect(this.gainMaster)

    this.gainChing = audioCtx.createGain()
    this.gainChing.connect(this.gainMaster)

    eGlongSelect.addEventListener("change", () => this.onGlongsetChange(eGlongSelect.value))
    await this.onGlongsetChange(eGlongSelect.value)

    handleSliderUpdate(this.tuneGlong, (alpha, init) => {
      this.glongSetDetune = -1000 + alpha * 2000.0
      this.glongSet.detune(this.glongSetDetune)
    })
    
    this.analyser = audioCtx.createAnalyser()
    try {
      this.analyser.fftSize = 2048
    } catch(e) {
      // iPhone has a max fft size 2048?
    }

    // Browsers can sometimes flip the audio output off during quiet periods, which is annoying on mobile.
    // Add a bit of inaudible noise to keep the channel open while playing is activated.
    const quietNoiseBuffer = audioCtx.createBuffer(1, audioCtx.sampleRate * 0.25, audioCtx.sampleRate);
    const quietNoiseBufferData = quietNoiseBuffer.getChannelData(0);
    for (var i = 0; i < quietNoiseBuffer.length; i+=audioCtx.sampleRate / 100) {
      quietNoiseBufferData[Math.floor(i)] = (-1 + Math.random() * 2) * 0.0001;
    }
    this.quietNoise = audioCtx.createBufferSource()
    this.quietNoise.buffer = quietNoiseBuffer
    this.quietNoise.loop = true
    this.quietNoise.loopEnd = 0.25
    this.quietNoise.start()

    this.bpm = Number(this.eBpm.value) || 70
    
    this.ePlay.addEventListener("click", this.onPlay.bind(this))
    this.ePlayDelay.addEventListener("click", this.onPlayDelay.bind(this))

    this.eStop.addEventListener("click", this.onStop.bind(this))

    this.eBpm.addEventListener("change", e => {
      this.onBpmChange(this.getBpm(this.eBpm.value))
      // re-calculate next tick time after bpm change
      if (appChing.playing && appChing.currentTimeout) {
        window.clearTimeout(appChing.currentTimeout)
        appChing.currentTimeout = window.setTimeout(
          this.onTick.bind(this),
          (appChing.tickStart + appChing.tickPeriod * appChing.tick) - window.performance.now()
        );
      }
    })

    eAnalyserOn.addEventListener("click", e => {
      this.analyserActive = true
      eAnalyserOn.setAttribute('disabled',undefined);
      eAnalyserOff.removeAttribute('disabled');
      this.gainMaster.connect(this.analyser)
      window.requestAnimationFrame((time) => analyserDraw(time, this.analyser, eAnalyser.getContext('2d')))
    })
    eAnalyserOff.addEventListener("click", e => {
      this.analyserActive = false
      eAnalyserOff.setAttribute('disabled',undefined);
      eAnalyserOn.removeAttribute('disabled');
      this.gainMaster.disconnect(this.analyser)
    })
    eAnalyserOff.setAttribute('disabled',undefined)

    ePlayChingOpen.addEventListener("click", e => this.glongSet.chup(0, 1) );
    ePlayChingClosed.addEventListener("click", e => this.glongSet.ching(0,1) );
    for (let i = 0; i < ePlayGlongs.length; ++i)
      ePlayGlongs[i].addEventListener("click", e => this.glongSet.glong(0, 1, i) );

    for (let [ctl, gain]
         of [[gainGlong, this.gainGlong],
             [gainChing, this.gainChing]] as [HTMLElement,GainNode][]) {
      handleSliderUpdate(
        ctl,
        (alpha, init) => {
          gain.gain.cancelScheduledValues(audioCtx.currentTime)
          // max volume is 5, allowing distortion
          // exponential is chosen so that 0.5**2.32193 == 1.0 (full volume on half-slider)
          const vol = Math.pow(alpha, 2.32193) * 5.0
          if (!init) {
            gain.gain.setTargetAtTime(vol, audioCtx.currentTime, 0.2)
          } else {
            gain.gain.value = vol
          }
        }
      )
    }

    patternDrum.addEventListener("change", () => this.onDrumPatternChange(patternDrum.value))
    
    for (let [element, pattern] of presetsDrumPattern) {
      element.addEventListener("click", () => {
        patternDrum.value = pattern
        this.onDrumPatternChange(patternDrum.value)
      })
    }

    this.onDrumPatternChange(patternDrum.value)
    
    for (let i=0; i < bpmMods.length; ++i) {
      bpmMods[i].addEventListener("click", e => this.onBpmMod(e))
    }
  }

  onPlayDelay() {
    this.onStop()
    this.ePlay.setAttribute('disabled',undefined)
    this.eStop.removeAttribute('disabled')
    const chup0 = () => {
      this.glongSet.kill()
      this.glongSet.chup(0, 1)
      this.currentTimeout = window.setTimeout(chup1, 200)
    }
    const chup1 = () => {
      this.glongSet.chup(0, 1)
      this.currentTimeout = window.setTimeout(chup2, this.tickPeriod * 8)
    }
    const chup2 = () => {
      this.glongSet.ching(0,1)
      this.currentTimeout = window.setTimeout(() => this.onPlay(), this.tickPeriod * 4)
    }
    chup0()
  }

  doPattern() {
    // TODO: replace with parser...
    if (this.drumPatternNext != null) {
      this.drumPattern = appChing.drumPatternNext
      this.drumPattern.seek(this.tick)
      this.drumPatternNext = null
    }
    this.drumPattern?.tick(this)
  }

  onPlay() {
    this.glongSet.kill()

    this.onBpmChange(this.getBpm(this.eBpm.value))

    this.tick = 0
    this.playing = true
    this.tickStart = window.performance.now()
    this.eStop.removeAttribute('disabled')
    this.ePlay.setAttribute('disabled',undefined)

    this.quietNoise.connect(this.gainMaster)

    if (this.analyserActive) {
      this.gainMaster.connect(this.analyser)
    }

    this.onTick()
  }

  onStop() {
    this.playing = false
    this.drumPattern?.seek(0)
    if (this.currentTimeout) {
      window.clearTimeout(this.currentTimeout)
      this.currentTimeout = null
    }
    this.eStop.setAttribute('disabled',undefined)
    this.ePlay.removeAttribute('disabled')
    this.ePlayDelay.removeAttribute('disabled')
    this.quietNoise.disconnect()
  }

  onTick():boolean {
    if (!this.playing) {
      return false
    }

    this.tickTimeLast = window.performance.now()

    if (this.tick % 8 == 0) {
      this.glongSet.chup(0, 1)
    } else if (this.tick % 8 == 4) {
      this.glongSet.ching(0,1)
    }

    let currentTick = this.tick
    window.setTimeout(
      () => {
        this.eHong.value = (Math.floor(currentTick / 4) + 1).toString();
        updateChingVis(this.eChingVises, Math.floor(currentTick / 2) % 4);
      },
      50 // TBD: let the user tune this -- no reliable latency measure is available
    )

    this.doPattern()

    this.tick += 1;

    this.currentTimeout = window.setTimeout(
      () => this.onTick(),
      (this.tickStart + this.tickPeriod * this.tick) - this.tickTimeLast
    );

    if (this.timings != undefined && this.timings.push(this.tickTimeLast) == 80) {
      const timings = this.timings
      this.timings = undefined

      const diffs = [];
      for (let i = 1; i < timings.length; ++i) {
        diffs.push(timings[i] - timings[i-1])
      }

      let report = "Tick #: " + this.tick + "\n"
      report += "Ideal tick period: " + this.tickPeriod + "\n"
      report += "Mean tick period: " + diffs.reduce((acc, v) => acc + v, 0) / diffs.length + "\n"

      diffs.sort()
      report += "Median tick period: " + diffs[Math.floor(diffs.length/2)]

      alert(report)
    }
    
    return true
  }
  
  async onGlongsetChange(nameSet:string) {
    let glongSet:GlongSet
    
    switch (nameSet) {
      case "sampled":
        glongSet = new GlongSetSampled(
          this.audioCtx,
          [
            new Sample("chup-0.flac", cordova),
            new Sample("chup-1.flac", cordova),
            new Sample("chup-2.flac", cordova)
          ],
          [
            new Sample("ching-0.flac", cordova),
            new Sample("ching-1.flac", cordova),
            new Sample("ching-2.flac", cordova)
          ],
          [
            [
              new Sample("sormchai-ctum-0.flac", cordova),
              new Sample("sormchai-ctum-1.flac", cordova),
              new Sample("sormchai-ctum-2.flac", cordova)
            ],
            [
              new Sample("sormchai-dting-0.flac", cordova),
              new Sample("sormchai-dting-1.flac", cordova),
              new Sample("sormchai-dting-2.flac", cordova)
            ],
            [
              new Sample("sormchai-jor-0.flac", cordova),
              new Sample("sormchai-jor-1.flac", cordova),
              new Sample("sormchai-jor-2.flac", cordova)
            ],
            [
              new Sample("sormchai-jorng-0.flac", cordova),
              new Sample("sormchai-jorng-1.flac", cordova),
              new Sample("sormchai-jorng-2.flac", cordova)
            ]
          ],
          0.75,
          1.0,
          1.0
        )
        
        break
      case "synthesized":
        glongSet = new GlongSetSynthesized(this.audioCtx)
        break
      default:
        throw MSG.errorGlongsetBad(nameSet)
    }

    await glongSet.init()

    // Drumsets should reset detune on set change
    this.tuneGlong.value = "50"

    // Note: Javascript promises are asyncronous but not concurrent, so this block will only ever be executed by one
    // process to completion. There is no danger here of loaded glongsets not having 'disconnect' called.
    if (this.glongSet) {
      this.glongSet.disconnect()
    }
    glongSet.connect(this.gainChing, this.gainGlong)
    this.glongSet = glongSet
  }
  
  onBpmChange(bpm) {
    assert(!Number.isNaN(Number(bpm)))

    this.bpm = bpm
    const oldPeriod = appChing.tickPeriod
    this.tickPeriod = bpmToTickPeriodMs(bpm)
    if (this.timings != undefined)
      this.timings = []

    // Tick times are calculated relative to a start time as I believe this improves precision due to the lack of
    // accumlating error from repeated additions to the base time.
    //
    // Adjust the relative time as if the new tick period had been playing for 'current tick' ticks.
    // It's also important to include the fractional tick amount accumulated since the current tick began.
    // Note the "currently playing" tick is appChing.tick - 1.
    if (this.playing) {
      const now = window.performance.now()
      const elapsedTime = now - this.tickStart
      const currentTickAtNewPeriod = elapsedTime / this.tickPeriod
      const tickDiff = currentTickAtNewPeriod - (Math.max(0, this.tick - 1) + (now - this.tickTimeLast) / oldPeriod)
      this.tickStart += tickDiff * this.tickPeriod
    }

    this.eBpmJing.value = this.bpm
  }
  
  bpmRamp(endBpm, time, onStop=null) {
    const startBpm = this.bpm
    const updatesPerSec = 10
    const updates = Math.max(Math.floor(time * updatesPerSec), 1)

    const loop = i => {
      if (i == updates) {
        this.onBpmChange(endBpm)
        if (onStop) {
          setTimeout(() => { onStop(); this.onBpmChange(startBpm) }, 2000)
        }
      } else {
        this.onBpmChange(startBpm + (i/updates) * (endBpm - startBpm))
        setTimeout(() => loop(i+1), 1000/updatesPerSec)
      }
    }

    loop(1)
  }
  
  getBpm(anyVal:number|string) {
    const numBpm = Number(anyVal);
    if (numBpm != NaN) {
      return numBpm;
    } else {
      return appChing.bpm;
    }
  }

  private onBpmMod(evt) {
    const e = evt.target
    if (e.dataset.set) {
      this.bpm = Number(e.dataset.set);
    } else if (e.dataset.scale) {
      this.bpm *= Number(e.dataset.scale);
    } else {
      this.bpm += Number(e.dataset.increment);
    }
    this.eBpm.value = this.bpm
    this.onBpmChange(this.bpm)
  }
  
  onDrumPatternChange(value) {
    const tokens = patterns.grammar.tokenize(value)
    const [semantics, state] = patterns.grammar.parse(tokens)
    if (state.error) {
	    throw new Error(state.error + "\n" + state.context())
    }
    
    appChing.drumPatternNext = new DrumPattern(semantics)
  }
}

// Export just for debugging convenience
export let appChing:AppChing

function bpmToTickPeriodMs(bpm) {
  return 60000.0 / bpm / 2
}

function analyserDraw(time, analyser, canvasCtx) {
  const updateFreq = (1/65) * 1000
  const bufferFft = new Float32Array(analyser.frequencyBinCount)

  const loop = (lastTime, time, bufferImgOld) => {
    const canvasWidth = canvasCtx.canvas.width
    const canvasHeight = canvasCtx.canvas.height

    analyser.getFloatFrequencyData(bufferFft)

    canvasCtx.putImageData(bufferImgOld, -1, 0)
    const bufferImg = canvasCtx.getImageData(0, 0, canvasWidth, canvasHeight)

    const dbMin = analyser.minDecibels
    const dbMax = analyser.maxDecibels
    const gainDb = 15
    const freqBinCount = analyser.frequencyBinCount
    const data = bufferImg.data
    const sampleRate = analyser.context.sampleRate
    var iImg = (canvasWidth - 1) * 4

    for (let y=0; y < canvasHeight; ++y) {
      const alpha = y/canvasHeight
      const iBin = Math.floor(Math.pow(1.0-alpha,3) * freqBinCount)
      const fVal = bufferFft[iBin] + gainDb
      const iIntensity = 255 * (Math.max(Math.min(fVal, dbMax), dbMin) - dbMin) / (dbMax - dbMin)

      data[iImg] = iIntensity
      data[iImg+1] = iIntensity
      data[iImg+2] = iIntensity

      iImg += canvasWidth * 4
    }

    canvasCtx.putImageData(bufferImg, 0, 0, canvasWidth-1, 0, canvasWidth, canvasHeight)

    if (appChing.analyserActive) {
      window.setTimeout(
        () => window.requestAnimationFrame(
          (timeNew) => loop(time, timeNew, bufferImg)
        ),
        Math.max((lastTime + updateFreq) - time, 0)
      );
    }
  }

  canvasCtx.fillRect(0, 0, 10000, 10000)

  loop(time, time, canvasCtx.getImageData(0, 0, canvasCtx.canvas.width, canvasCtx.canvas.height))
}

function handleSliderUpdate(ctl, onChange:(alpha: number, init: boolean) => void) {
  const min = 0
  const max = 100
  ctl.addEventListener("input", () => onChange((Number(ctl.value) - min) / (max - min), false))
  
  onChange((Number(ctl.value) - min) / (max - min), true)
}

function updateChingVis(eChingVises, phase) {
  for (let i = 0; i < eChingVises.length; ++i) {
    const e = eChingVises[i]
    if (phase == i) {
      e.style.backgroundColor = e.dataset.activeCol;
    } else {
      e.style.backgroundColor = 'white';
    }
  }
}

export function programStateSerialize() {
  const serialized = {"select":{}, "input":{}, "textarea": {}}
  
  {
    const ser = serialized["input"]
    const es = document.getElementsByTagName('input')
    for (let i = 0; i < es.length; ++i) {
      const e = es[i] as HTMLInputElement
      ser[e.id] = e.value
    }
  }
  
  {
    const ser = serialized["textarea"]
    const es = document.getElementsByTagName('textarea')
    for (let i = 0; i < es.length; ++i) {
      const e = es[i]
      assert(serialized[e.id] == undefined)
      ser[e.id] = e.textContent
    }
  }
  
  {
    const ser = serialized["select"]
    const es = document.getElementsByTagName('select')
    for (let i = 0; i < es.length; ++i) {
      const e = es[i] as HTMLSelectElement
      assert(ser[e.id] == undefined)
      ser[e.id] = e.selectedIndex
    }
  }
  
  window.localStorage.setItem("state", JSON.stringify(serialized))
}

export function programStateDeserialize() {
  // Note: onchange not necessary, as the user will always need to provide input to reinitialize the audiocontext.
  const serialized = JSON.parse(window.localStorage.getItem("state"))
  if (serialized) {
    {
      const ser = serialized["input"]
      const es = document.getElementsByTagName('input')
      for (let i = 0; i < es.length; ++i) {
        const e = es[i] as HTMLInputElement
        if (ser[e.id] != undefined) {
          e.value = ser[e.id]
        }
      }
    }
    
    {
      const ser = serialized["textarea"]
      const es = document.getElementsByTagName('textarea')
      for (let i = 0; i < es.length; ++i) {
        const e = es[i]
        if (ser[e.id] != undefined) {
          e.textContent = ser[e.id]
        }
      }
    }
    
    {
      const ser = serialized["select"]
      const es = document.getElementsByTagName('select')
      for (let i = 0; i < es.length; ++i) {
        const e = es[i] as HTMLSelectElement
        if (ser[e.id] != undefined) {
          e.selectedIndex = ser[e.id]
        }
      }
    }
  }
}

document.addEventListener("DOMContentLoaded", () => {
  document.addEventListener("pause", programStateSerialize)
  document.addEventListener("resume", programStateDeserialize)
  
  document.addEventListener("deviceready", () => {
    const allButtons = document.getElementsByTagName("button")
    
    const setupFunc = (e) => {
      assert(!appChing)
      if (!appChing) {
        appChing = new AppChing(
          document.getElementById("bpm") as HTMLInputElement,
          document.getElementById("bpm-jing") as HTMLInputElement,
          document.getElementById('tune-glong') as HTMLInputElement,
          document.getElementById("hong") as HTMLInputElement,
          document.getElementById("play") as HTMLButtonElement,
          document.getElementById("stop") as HTMLButtonElement,
          document.getElementById("play-delay") as HTMLButtonElement,
          [
            document.getElementById("ching-visualize-0"),
            document.getElementById("ching-visualize-1"),
            document.getElementById("ching-visualize-2"),
            document.getElementById("ching-visualize-3")
          ]
        )
        
        appChing.setup(
          document.getElementById("analyser") as HTMLCanvasElement,
          document.getElementById("analyser-on") as HTMLButtonElement,
          document.getElementById("analyser-off") as HTMLButtonElement,
          document.getElementById("glongset") as HTMLSelectElement,
          document.getElementById("play-ching-closed") as HTMLButtonElement,
          document.getElementById("play-ching-open") as HTMLButtonElement,
          document.getElementsByClassName("play-drum"),
          document.getElementsByClassName("bpm-mod"),
          document.getElementById("pattern-drum") as HTMLTextAreaElement,
          [
            [document.getElementById("pattern-none"), ""],
            [document.getElementById("pattern-lao"), patterns.pleyngDahmLao],
            [document.getElementById("pattern-khmen"), patterns.pleyngDahmKhmen],
            [document.getElementById("pattern-noyjaiyah"), patterns.dahmNoyJaiYah],
            [document.getElementById("pattern-omdeuk"), patterns.pleyngKhmenOmDteuk],
            [document.getElementById("pattern-gabber"), patterns.patternGabber]
          ],
          document.getElementById('vol-glong'),
          document.getElementById('vol-ching')
        ).then(() => {
          for (let i=0; i < allButtons.length; ++i) {
            allButtons[i].removeEventListener("click", setupFunc)
          }
          e.target.click()
        }).catch(errorHandler)
      }
    }

    // iPad needs to have its audio triggered from a user event. Run setup on any button, then re-trigger the
    // original click event.
    for (let i=0; i < allButtons.length; ++i) {
      allButtons[i].addEventListener("click", setupFunc)
    }
  })
})
