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

/// <reference path="glongset.ts" />
/// <reference path="instrument.ts" />
/// <reference path="messages.ts" />
/// <reference path="patterns.ts" />
/// <reference path="shaper.ts" />

var cordova:any // filled by cordova
var device:any // filled by cordova

namespace AppChing {
  const MSG = Messages.makeMultilingual([new Messages.MessagesThai(), new Messages.MessagesEnglish()])

  function errorHandler(message, source?, lineno?, colno?, error?) {
    alert(message)
    document.getElementById("error").style.display = "block"
    document.getElementById("error").innerHTML = message + "<br/>" + "Line: " + lineno + "<br/>" + source
    return true
  }
  
  window.onerror = errorHandler

  class AppChing {
    analyser = false
    tick = 0
    idxPattern = 0
    tickStart = null
    tickTimeLast = null
    bpm = null
    tickPeriod = null
    currentTimeout = null
    playing = false
    timings = undefined
    drumPattern = ""
    drumPatternNext = ""

    private glongSetDetune:number
    private glongSet?:GlongSet
    
    private audioCtx?:AudioContext
    private gainChing?:GainNode
    private gainGlong?:GainNode
    
    private eBpm:HTMLFormElement
    private eBpmJing:HTMLFormElement
    private tuneGlong:HTMLFormElement

    constructor(eBpm:HTMLFormElement, eBpmJing:HTMLFormElement, tuneGlong:HTMLFormElement) {
      this.eBpm = eBpm
      this.eBpmJing = eBpmJing
      this.tuneGlong = tuneGlong
    }
    
    debugTimings() {
      if (this.timings == undefined)
        this.timings = []
      else
        this.timings = undefined
    }
    
    async setup(
      ePlay:HTMLButtonElement,
      ePlayDelay:HTMLButtonElement,
      eStop:HTMLButtonElement,
      eAnalyser:HTMLCanvasElement,
      eAnalyserOn:HTMLButtonElement,
      eAnalyserOff:HTMLButtonElement,
      eChingVises:HTMLElement[],
      eHong:HTMLFormElement,
      eGlongSelect:HTMLSelectElement,
      ePlayChingClosed:HTMLButtonElement,
      ePlayChingOpen:HTMLButtonElement,
      ePlayGlongs:HTMLCollectionOf<Element>,
      bpmMods:HTMLCollectionOf<Element>,
      patternDrum:HTMLFormElement,
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

      for (let i=0; i < bpmMods.length; ++i) {
        bpmMods[i].addEventListener("click", e => this.onBpmMod(e))
      }

      const gainMaster = audioCtx.createGain();
      gainMaster.gain.value = 0.5;
      gainMaster.connect(audioCtx.destination);

      this.gainGlong = audioCtx.createGain()
      this.gainGlong.connect(gainMaster)

      this.gainChing = audioCtx.createGain()
      this.gainChing.connect(gainMaster)

      eGlongSelect.addEventListener("change", () => this.onGlongsetChange(eGlongSelect.value))
      await this.onGlongsetChange(eGlongSelect.value)

      handleSliderUpdate(this.tuneGlong, (alpha, init) => {
        this.glongSetDetune = -1000 + alpha * 2000.0
        this.glongSet.detune(this.glongSetDetune)
      })
      
      const analyser = audioCtx.createAnalyser()
      try {
        analyser.fftSize = 2048
      } catch(e) {
        // iPhone has a max fft size 2048?
      }

      // Browsers can sometimes flip the audio output off during quiet periods, which is annoying on mobile.
      // Add a bit of inaudible noise to keep the channel open while playing is activated.
      const quietNoiseBuffer = audioCtx.createBuffer(1, audioCtx.sampleRate * 0.25, audioCtx.sampleRate);
      const quietNoiseBufferData = quietNoiseBuffer.getChannelData(0);
      for (var i = 0; i < quietNoiseBuffer.length; i+=audioCtx.sampleRate / 100) {
        quietNoiseBufferData[Math.floor(i)] = (-1 + Math.random() * 2) * 0.001;
      }
      const quietNoise = audioCtx.createBufferSource();
      quietNoise.buffer = quietNoiseBuffer;
      quietNoise.loop = true;
      quietNoise.loopEnd = 0.25;
      quietNoise.start();

      const doPattern = (recurse=0) => {
        // TODO: replace with parser...
        if (this.drumPatternNext != null) {
          this.drumPattern = appChing.drumPatternNext;
          this.drumPatternNext = null;
        }
        const pattern = this.drumPattern
        if (recurse > 100) {
          onStop();
        } else if (pattern.length > 0) {
          const idxPattern = this.idxPattern % pattern.length
          const drumNum = Number(pattern[idxPattern])
          if (drumNum >= 0) {
            this.glongSet.glong(0, 1, drumNum)
            this.idxPattern += 1;
          } else if (pattern.slice(idxPattern, idxPattern+3) == 'END') {
            this.bpmRamp(Math.min(40, this.bpm * 0.5), 10 + Math.min(this.bpm-70) / 25, onStop);
            this.idxPattern += 3;
            doPattern(recurse+1);
          } else if (pattern.slice(idxPattern, idxPattern+3) == 'BPM') {
            this.idxPattern += 3;

            const match = pattern.slice(this.idxPattern, pattern.length).match(/^\d+/)
            if (match) {
              this.bpmRamp(Number(match[0]), 0.5);
              this.idxPattern += match[0].length;
            } else {
              console.error("Bad BPM spec");
            }

            doPattern(recurse+1);
          } else {
            this.idxPattern += 1;
          }
        } else {
          this.idxPattern += 1;
        }
      }

      const onTick = () => {
        if (!this.playing) {
          return false;
        }

        this.tickTimeLast = window.performance.now()

        if (this.tick % 8 == 0) {
          this.glongSet.chup(0, 1)
        } else if (this.tick % 8 == 4) {
          this.glongSet.ching(0,1)
        }

        let currentTick = this.tick;
        window.setTimeout(
          () => {
            eHong.value = Math.floor(currentTick / 4) + 1;
            updateChingVis(eChingVises, Math.floor(currentTick / 2) % 4);
          },
          50 // TBD: let the user tune this -- no reliable latency measure is available
        )

        doPattern();

        this.tick += 1;

        this.currentTimeout = window.setTimeout(
          onTick,
          (this.tickStart + this.tickPeriod * this.tick) - this.tickTimeLast
        );

        if (this.timings != undefined && this.timings.push(this.tickTimeLast) == 80) {
          const timings = this.timings
          this.timings = undefined

          const diffs = [];
          for (i = 1; i < timings.length; ++i) {
            diffs.push(timings[i] - timings[i-1])
          }

          let report = "Tick #: " + this.tick + "\n"
          report += "Ideal tick period: " + this.tickPeriod + "\n"
          report += "Mean tick period: " + diffs.reduce((acc, v) => acc + v, 0) / diffs.length + "\n"

          diffs.sort()
          report += "Median tick period: " + diffs[Math.floor(diffs.length/2)]

          alert(report)
        }
      }

      const onPlay = () => {
        this.glongSet.kill()

        this.onBpmChange(this.getBpm(this.eBpm.value));

        this.tick = 0;
        this.idxPattern = 0;
        this.playing = true;
        this.tickStart = window.performance.now();
        eStop.removeAttribute('disabled');
        ePlay.setAttribute('disabled',undefined);

        quietNoise.connect(gainMaster);

        if (this.analyser) {
          gainMaster.connect(analyser)
        }

        onTick();
      }

      const onStop = () => {
        this.playing = false;
        if (this.currentTimeout) {
          window.clearTimeout(this.currentTimeout);
          this.currentTimeout = null;
        }
        eStop.setAttribute('disabled',undefined);
        ePlay.removeAttribute('disabled');
        ePlayDelay.removeAttribute('disabled');
        quietNoise.disconnect();
      }

      ePlay.addEventListener("click", onPlay)
      ePlayDelay.addEventListener("click", e => {
        onStop()
        ePlay.setAttribute('disabled',undefined)
        eStop.removeAttribute('disabled')
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
          this.currentTimeout = window.setTimeout(onPlay, this.tickPeriod * 4)
        }
        chup0()
      })

      eStop.addEventListener("click", onStop)

      this.eBpm.addEventListener("change", e => {
        this.onBpmChange(this.getBpm(this.eBpm.value))
        // re-calculate next tick time after bpm change
        if (appChing.playing && appChing.currentTimeout) {
          window.clearTimeout(appChing.currentTimeout)
          appChing.currentTimeout = window.setTimeout(
            onTick,
            (appChing.tickStart + appChing.tickPeriod * appChing.tick) - window.performance.now()
          );
        }
      })

      eAnalyserOn.addEventListener("click", e => {
        appChing.analyser = true;
        eAnalyserOn.setAttribute('disabled',undefined);
        eAnalyserOff.removeAttribute('disabled');
        gainMaster.connect(analyser)
        window.requestAnimationFrame((time) => analyserDraw(time, analyser, eAnalyser.getContext('2d')))
      })
      eAnalyserOff.addEventListener("click", e => {
        appChing.analyser = false;
        eAnalyserOff.setAttribute('disabled',undefined);
        eAnalyserOn.removeAttribute('disabled');
        gainMaster.disconnect(analyser)
      })

      eAnalyserOff.setAttribute('disabled',undefined);

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
            const vol = Math.pow(alpha, 5) * 5.0
            if (!init) {
              gain.gain.setTargetAtTime(vol, audioCtx.currentTime, 0.2)
            } else {
              gain.gain.value = vol
            }
          }
        )
      }

      patternDrum.addEventListener("change", e => this.onDrumPatternChange(patternDrum.value))
      
      for (let [element, pattern] of presetsDrumPattern) {
        element.addEventListener("click", () => {
          patternDrum.value = pattern
          this.onDrumPatternChange(patternDrum.value)
        })
      }

      this.onDrumPatternChange(patternDrum.value)
    }

    async onGlongsetChange(nameSet:string) {
      let glongSet:GlongSet
      
      switch (nameSet) {
        case "sampled": {
          glongSet = new GlongSetSampled(
            this.audioCtx,
            [
              new Sample("chup-0.flac"),
              new Sample("chup-1.flac"),
              new Sample("chup-2.flac")
            ],
            [
              new Sample("ching-0.flac"),
              new Sample("ching-1.flac"),
              new Sample("ching-2.flac")
            ],
            [
              [
                new Sample("sormchai-ctum-0.flac"),
                new Sample("sormchai-ctum-1.flac"),
                new Sample("sormchai-ctum-2.flac")
              ],
              [
                new Sample("sormchai-dting-0.flac"),
                new Sample("sormchai-dting-1.flac"),
                new Sample("sormchai-dting-2.flac")
              ],
              [
                new Sample("sormchai-jor-0.flac"),
                new Sample("sormchai-jor-1.flac"),
                new Sample("sormchai-jor-2.flac")
              ],
              [
                new Sample("sormchai-jorng-0.flac"),
                new Sample("sormchai-jorng-1.flac"),
                new Sample("sormchai-jorng-2.flac")
              ]
            ]
          )
          
          break
        }
        case "synthesized": {
          glongSet = new GlongSetSynthesized(this.audioCtx)
          break
        }
        default: throw MSG.errorGlongsetBad(nameSet)
      }

      await glongSet.init()

      // Drumsets should reset detune on set change
      this.tuneGlong.value = 50
      
      if (this.glongSet) {
        this.glongSet.disconnect()
      }
      glongSet.connect(this.gainChing, this.gainGlong)
      this.glongSet = glongSet
    }
    
    onBpmChange(bpm) {
      console.assert(Number(bpm) != NaN)

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
        const tickDiff = currentTickAtNewPeriod - ((this.tick - 1) + (now - this.tickTimeLast) / oldPeriod)
        this.tickStart += tickDiff * this.tickPeriod
      }

      this.eBpmJing.value = this.bpm
    }
    
    bpmRamp(endBpm, time, onStop=null) {
      const startBpm = this.bpm
      const updatesPerSec = 10
      const updates = Math.floor(time * updatesPerSec)
      const increment = (endBpm - startBpm) / updates

      const loop = i => {
        if (i == updates) {
          this.onBpmChange(endBpm)
          if (onStop) {
            setTimeout(() => { onStop(); this.onBpmChange(startBpm) }, 2000)
          }
        } else {
          this.onBpmChange(startBpm + (i/updates)**2 * (endBpm - startBpm))
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
      appChing.drumPatternNext = value.replace(/^#.*/gm,'').replace(/\s/g,'')
      console.debug("Drum:\n" + appChing.drumPatternNext)
    }
  }

  // Export just for debugging convenience
  export let appChing:AppChing

  function bpmToTickPeriodMs(bpm) {
    return 60000.0 / bpm / 2
  }

  function analyserDraw(time, analyser, canvasCtx) {
    const updateFreq = (1/65) * 1000

    const loop = (lastTime, time, analyser, canvasCtx, bufferImg, bufferFft) => {
      const canvasWidth = canvasCtx.canvas.width;
      const canvasHeight = canvasCtx.canvas.height;

      analyser.getFloatFrequencyData(bufferFft);

      canvasCtx.putImageData(bufferImg, -1, 0);
      bufferImg = canvasCtx.getImageData(0, 0, canvasWidth, canvasHeight);

      const dbMin = analyser.minDecibels;
      const dbMax = analyser.maxDecibels;
      const gainDb = 15;
      const freqBinCount = analyser.frequencyBinCount;
      const data = bufferImg.data;
      const sampleRate = analyser.context.sampleRate;
      var iImg = (canvasWidth - 1) * 4;

      for (let y=0; y < canvasHeight; ++y) {
        const alpha = y/canvasHeight
        const iBin = Math.floor(Math.pow(1.0-alpha,3) * freqBinCount)
        const fVal = bufferFft[iBin] + gainDb;
        const iIntensity = 255 * (Math.max(Math.min(fVal, dbMax), dbMin) - dbMin) / (dbMax - dbMin);

        data[iImg] = iIntensity;
        data[iImg+1] = iIntensity;
        data[iImg+2] = iIntensity;

        iImg += canvasWidth * 4;
      }

      canvasCtx.putImageData(bufferImg, 0, 0, canvasWidth-1, 0, canvasWidth, canvasHeight);

      if (appChing.analyser) {
        window.setTimeout(
          () => window.requestAnimationFrame(
            (time) => loop(time, time, analyser, canvasCtx, bufferImg, bufferFft)
          ),
          Math.max((lastTime + updateFreq) - time, 0)
        );
      }
    }

    canvasCtx.fillRect(0, 0, 10000, 10000);

    loop(
      time,
      time,
      analyser,
      canvasCtx,
      canvasCtx.getImageData(0, 0, canvasCtx.canvas.width, canvasCtx.canvas.height),
      new Float32Array(analyser.frequencyBinCount)
    )
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

  document.addEventListener("DOMContentLoaded", () => {
    document.addEventListener("deviceready", () => {
      const ePlay = document.getElementById("play") as HTMLButtonElement
      const eStop = document.getElementById("stop") as HTMLButtonElement
      const eBpm = document.getElementById("bpm") as HTMLFormElement

      // iPad needs to have its audio triggered from a user event. Run setup on any button, then re-trigger the
      // original click event.
      const setupFunc = (e) => {
        if (!appChing) {
          appChing = new AppChing(
            eBpm,
            document.getElementById("bpm-jing") as HTMLFormElement,
            document.getElementById('tune-glong') as HTMLFormElement
          )
          
          appChing.setup(
            ePlay,
            document.getElementById("play-delay") as HTMLButtonElement,
            eStop,
            document.getElementById("analyser") as HTMLCanvasElement,
            document.getElementById("analyser-on") as HTMLButtonElement,
            document.getElementById("analyser-off") as HTMLButtonElement,
            [
              document.getElementById("ching-visualize-0"),
              document.getElementById("ching-visualize-1"),
              document.getElementById("ching-visualize-2"),
              document.getElementById("ching-visualize-3")
            ],
            document.getElementById("hong") as HTMLFormElement,
            document.getElementById("glongset") as HTMLSelectElement,
            document.getElementById("play-ching-closed") as HTMLButtonElement,
            document.getElementById("play-ching-open") as HTMLButtonElement,
            document.getElementsByClassName("play-drum"),
            document.getElementsByClassName("bpm-mod"),
            document.getElementById("pattern-drum") as HTMLFormElement,
            [
              [document.getElementById("pattern-none"), ""],
              [document.getElementById("pattern-lao"), pleyngDahmLao],
              [document.getElementById("pattern-khmen"), pleyngDahmKhmen],
              [document.getElementById("pattern-noyjaiyah"), dahmNoyJaiYah],
              [document.getElementById("pattern-omdeuk"), pleyngKhmenOmDteuk],
              [document.getElementById("pattern-gabber"), patternGabber]
            ],
            document.getElementById('vol-glong'),
            document.getElementById('vol-ching')
          ).then(() => {
            e.target.click()
            e.target.removeEventListener("click", setupFunc)
          }).catch(errorHandler)
        }
      }

      {
        const buts = document.getElementsByTagName("button");
        for (let i=0; i < buts.length; ++i) {
          buts[i].addEventListener("click", setupFunc)
        }
      }

      eStop.setAttribute('disabled',undefined);
    })
  })
}
