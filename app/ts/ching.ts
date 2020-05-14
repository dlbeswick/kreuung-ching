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

import { BpmControl } from "./bpm.js"
import { GlongSet, GlongSetSampled, GlongSetSynthesized } from "./glongset.js"
import { Sample } from "./instrument.js"
import { SegmentAction } from "./patterns.js"

import { assert } from "./lib/assert.js"
import { errorHandler } from "./lib/error_handler.js"

import * as messages from "./messages.js"
import * as patterns from "./patterns.js"

var cordova:any = (window as any).cordova
var device:any = (window as any).device

const MSG = messages.makeMultilingual([new messages.MessagesThai(), new messages.MessagesEnglish()])

export function withElement<T extends HTMLElement>(id:string, klass:new() => T, func:(t:T) => void) {
  func(demandById(id, klass))
}

export function demandById<T extends HTMLElement=HTMLElement>(id:string, klass?:new() => T):T {
  const klass_:any = klass ?? HTMLElement
  
  const result = document.getElementById(id)
  if (result == undefined) {
    throw new Error(`Element '${id}' not found`)
  } else if (!(result instanceof klass_)) {
    throw new Error(`Element '${id}' is not '${klass}', but is '${result.constructor.name}'`)
  } else {
    return result as T
  }
}

window.onerror = errorHandler

export class DrumPattern {
  private segmentIdx = -1
  private lengthTicks:number
  
  constructor(private readonly segments:SegmentAction[]) {
    this.lengthTicks = segments.reduce((acc, sa) => acc + (sa.span ? sa.span.length() : 0), 0)
  }

  seek(app:AppChing, tick:number) {
    tick = this.lengthTicks ? tick % this.lengthTicks : 0
    
    for (this.segmentIdx = 0; this.segmentIdx < this.segments.length; ++this.segmentIdx) {
      const segment = this.segments[this.segmentIdx]
      
      if (app.bpmControl.playing)
        for (const i of segment.instants)
          i.run(app.bpmControl, this.segmentIdx == 0)
      
      if (segment.span) {
        if (tick < segment.span.length()) {
          segment.span.seek(tick)
          break
        } else {
          tick = Math.max(0, tick - segment.span.length())
        }
      }
    }
  }

  tick(app:AppChing) {
    if (this.lengthTicks == 0)
      return

    const segment = this.segments[this.segmentIdx]
    assert(segment)
    
    if (!segment.span || segment.span.tick(app.glongSet, app.bpmControl)) {
      this.segmentIdx = (this.segmentIdx + 1) % this.segments.length
      this.segments[this.segmentIdx].span?.seek(0)
      this.segments[this.segmentIdx].span?.tick(app.glongSet, app.bpmControl)
      for (const i of this.segments[this.segmentIdx].instants)
        i.run(app.bpmControl, (app.bpmControl.tick() % this.lengthTicks) == 0)
    }
  }
}

class AppChing {
  analyserActive = false
  drumPattern?:DrumPattern
  drumPatternNext?:DrumPattern
  readonly bpmControl:BpmControl

  private glongSetDetune:number
  glongSet?:GlongSet
  
  private audioCtx?:AudioContext
  private analyser?:AnalyserNode
  private gainChing?:GainNode
  private gainGlong?:GainNode
  private gainMaster?:GainNode
  private quietNoise?:AudioBufferSourceNode

  private chupChupTimeout?:number
  
  constructor(
    private readonly eBpm:HTMLInputElement,
    private readonly eBpmJing:HTMLInputElement,
    private readonly eChun:HTMLInputElement,
    private readonly eChunJing:HTMLInputElement,
    private readonly tuneGlong:HTMLInputElement,
    private readonly eHong:HTMLInputElement,
    private readonly ePlay:HTMLButtonElement,
    private readonly eStop:HTMLButtonElement,
    private readonly ePlayDelay:HTMLButtonElement,
    private readonly eChingVises:HTMLElement[],
    private readonly ePatternError:HTMLElement
  ) {
    this.eStop.setAttribute('disabled',undefined)
    this.bpmControl = new BpmControl(eBpmJing, eChunJing, this.onTick.bind(this), this.onStop.bind(this))
  }

  setupPreUserInteraction(
    patternDrum:HTMLTextAreaElement,
    presetsDrumPattern:[HTMLElement,string][]
  ) {
    const select = demandById("patterns-user", HTMLSelectElement)
    const del = demandById("pattern-del", HTMLButtonElement)

    del.addEventListener("click", () => {
      window.localStorage.removeItem(select.value)
      this.userPatternsUpdate()
      del.disabled = true
    })
    
    const dlg = demandById("dialog-save")
    const save = dlg.getElementsByClassName("save")[0] as HTMLButtonElement
    const input = dlg.getElementsByTagName("input")[0] as HTMLInputElement

    const onChange = () => { save.disabled = !input.value }
    input.addEventListener("input", onChange)

    demandById("pattern-save").addEventListener("click", () => {
      dlg.classList.add("modal-show")
      input.value = select.value ? select.selectedOptions[0].innerText : ''
      onChange()
    })

    dlg.getElementsByClassName("cancel")[0].addEventListener("click", () => dlg.classList.remove("modal-show"))

    save.addEventListener("click", () => {
      dlg.classList.remove("modal-show")
      this.onSavePattern(input.value, patternDrum.value)
      select.value = "pleyng-" + input.value
    })

    select.addEventListener(
      "change",
      () => {
        window.localStorage.setItem("selected-pleyng", select.value)
        patternDrum.value = window.localStorage.getItem(select.value)
        this.onDrumPatternChange(patternDrum.value)
        del.disabled = select.selectedIndex == 0
      }
    )

    this.userPatternsUpdate()

    select.value = window.localStorage.getItem("selected-pleyng") ?? ''
    del.disabled = select.selectedIndex == 0

    patternDrum.addEventListener("change", () => this.onDrumPatternChange(patternDrum.value))
    
    for (let [element, pattern] of presetsDrumPattern) {
      element.addEventListener("click", () => {
        patternDrum.value = pattern
        this.onDrumPatternChange(patternDrum.value)
        select.selectedIndex = 0
        del.disabled = true
      })
    }

    this.onDrumPatternChange(patternDrum.value)
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

    this.bpmControl.change(Number(this.eBpm.value) || 70)
    
    this.ePlay.addEventListener("click", this.onPlay.bind(this))
    this.ePlayDelay.addEventListener("click", this.onPlayDelay.bind(this))

    this.eStop.addEventListener("click", this.bpmControl.stop.bind(this.bpmControl))

    this.eChun.addEventListener("change", e => {
      this.bpmControl.chunSet(Number(this.eChun.value))
    })
    
    this.eBpm.addEventListener("change", e => {
      this.bpmControl.change(this.getBpm(this.eBpm.value))
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

    for (let i=0; i < bpmMods.length; ++i) {
      bpmMods[i].addEventListener("click", e => this.onBpmMod(e))
    }
  }

  userPatternsUpdate() {
    withElement("patterns-user", HTMLSelectElement, (select) => {
      const oldValue = select.value
      
      while (select.options.length > 1)
        select.remove(1)

      for (let i = 0; ; i++) {
        const key = window.localStorage.key(i)
        if (!key) {
          break
        } else if (key.startsWith("pleyng-")) {
          const opt = document.createElement("option")
          opt.innerText = key.slice(7)
          opt.value = key
          select.add(opt)
        }
      }

      select.value = oldValue
    })
  }
  
  onSavePattern(name:string, pattern:string) {
    window.localStorage.setItem("pleyng-" + name, pattern)
    this.userPatternsUpdate()
  }
    
  onPlayDelay() {
    this.bpmControl.stop()
    this.bpmControl.change(this.getBpm(this.eBpm.value))
    this.drumPattern?.seek(this, 0)
    this.ePlay.setAttribute('disabled',undefined)
    this.eStop.removeAttribute('disabled')
    const chup0 = () => {
      this.glongSet.kill()
      this.glongSet.chup(0, 1)
      this.chupChupTimeout = window.setTimeout(chup1, 200)
    }
    const chup1 = () => {
      this.glongSet.chup(0, 1)
      this.chupChupTimeout = window.setTimeout(chup2, this.bpmControl.msTickPeriod() * 8)
    }
    const chup2 = () => {
      this.glongSet.ching(0,1)
      this.chupChupTimeout = window.setTimeout(() => this.onPlay(), this.bpmControl.msTickPeriod() * 4)
    }
    chup0()
  }

  doPattern() {
    if (this.drumPatternNext != null) {
      this.drumPattern = appChing.drumPatternNext
      this.drumPattern.seek(this, Math.max(0, this.bpmControl.tick()-1))
      this.drumPatternNext = null
    }
    this.drumPattern?.tick(this)
  }

  onPlay() {
    this.glongSet.kill()

    this.bpmControl.stop()
    this.bpmControl.change(this.getBpm(this.eBpm.value))
    this.bpmControl.chunSet(Number(this.eChun.value))

    this.drumPattern?.seek(this, 0)
    this.bpmControl.play()
    this.eStop.removeAttribute('disabled')
    this.ePlay.setAttribute('disabled',undefined)

    this.quietNoise.connect(this.gainMaster)

    if (this.analyserActive) {
      this.gainMaster.connect(this.analyser)
    }
  }

  onStop() {
    window.clearTimeout(this.chupChupTimeout)
    this.chupChupTimeout = null
    this.eStop.disabled = true
    this.ePlay.disabled = false
    this.ePlayDelay.disabled = false
    this.quietNoise.disconnect()
  }

  onTick():boolean {
    const currentTick = this.bpmControl.tick() - 1
    const divisorChun = 2**(this.bpmControl.chun() + 1)
    
    if (currentTick % divisorChun == 0) {
      this.glongSet.chup(0, 1)
    } else if (currentTick % divisorChun == divisorChun/2) {
      this.glongSet.ching(0,1)
    }

    window.setTimeout(
      () => {
        this.eHong.value = (Math.floor(currentTick / 4) + 1).toString();
        updateChingVis(this.eChingVises, Math.floor(currentTick / 2) % 4);
      },
      50 // TBD: let the user tune this -- no reliable latency measure is available
    )

    this.doPattern()

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
  
  getBpm(anyVal:number|string) {
    const numBpm = Number(anyVal)
    if (numBpm != NaN) {
      return numBpm
    } else {
      return this.bpmControl.bpm()
    }
  }

  private onBpmMod(evt) {
    const e = evt.target
    let bpm:number
    if (e.dataset.set) {
      bpm = Number(e.dataset.set)
    } else if (e.dataset.scale) {
      bpm = this.bpmControl.bpm() * Number(e.dataset.scale)
    } else {
      bpm = this.bpmControl.bpm() + Number(e.dataset.increment)
    }
    this.eBpm.value = bpm.toString()
    this.bpmControl.change(bpm)
  }

  onDrumPatternChange(value) {
    const [tokens, error] = patterns.grammar.tokenize(value)
    if (error) {
      this.ePatternError.innerText = error
      this.ePatternError.classList.add("error-show")
      return
    }
    
    const [_, state, context] = patterns.grammar.parse(tokens, [new SegmentAction()])
    if (state.error) {
      this.ePatternError.innerText = state.error + "\n" + state.context()
      this.ePatternError.classList.add("error-show")
      return
    }
    
    this.ePatternError.classList.remove("error-show")
    this.drumPatternNext = new DrumPattern(context)
  }
}

// Export just for debugging convenience
export let appChing:AppChing

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

document.addEventListener("deviceready", () => {
  document.addEventListener("pause", programStateSerialize)
  document.addEventListener("resume", programStateDeserialize)
  
  const allButtons = document.getElementsByTagName("button")

  appChing = new AppChing(
    document.getElementById("bpm") as HTMLInputElement,
    document.getElementById("bpm-jing") as HTMLInputElement,
    document.getElementById("chun") as HTMLInputElement,
    document.getElementById("chun-jing") as HTMLInputElement,
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
    ],
    document.getElementById("pattern-error")
  )

  appChing.setupPreUserInteraction(
    demandById("pattern-drum", HTMLTextAreaElement),
    [
      [document.getElementById("pattern-none"), ""],
      [document.getElementById("pattern-lao"), patterns.pleyngDahmLao],
      [document.getElementById("pattern-khmen"), patterns.pleyngDahmKhmen],
      [document.getElementById("pattern-noyjaiyah"), patterns.dahmNoyJaiYah],
      [document.getElementById("pattern-omdeuk"), patterns.pleyngKhmenOmDteuk]
    ]
  )
  
  const setupFunc = (e) => {
    appChing.setup(
      document.getElementById("analyser") as HTMLCanvasElement,
      document.getElementById("analyser-on") as HTMLButtonElement,
      document.getElementById("analyser-off") as HTMLButtonElement,
      document.getElementById("glongset") as HTMLSelectElement,
      document.getElementById("play-ching-closed") as HTMLButtonElement,
      document.getElementById("play-ching-open") as HTMLButtonElement,
      document.getElementsByClassName("play-drum"),
      document.getElementsByClassName("bpm-mod"),
      document.getElementById('vol-glong'),
      document.getElementById('vol-ching')
    ).then(() => {
      for (let i=0; i < allButtons.length; ++i) {
        allButtons[i].removeEventListener("click", setupFunc)
      }
      e.target.click()
    }).catch(errorHandler)
  }

  // iPad needs to have its audio triggered from a user event. Run setup on any button, then re-trigger the
  // original click event.
  for (let i=0; i < allButtons.length; ++i) {
    allButtons[i].addEventListener("click", setupFunc)
  }
})
