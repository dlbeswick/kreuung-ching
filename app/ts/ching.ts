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

var device:any // cordova

namespace AppChing {
  const MSG = Messages.makeMultilingual([Messages.th, Messages.en])

  window.onerror = (message, source, lineno, colno, error) => {
    alert(message);
    document.getElementById("error").style.display = "block";
    document.getElementById("error").innerHTML = message + "<br/>" + "Line: " + lineno + "<br/>" + source;
    return true;
  }

  class AppChing {
    analyser = false;
    tick = 0;
    idxPattern = 0;
    tickStart = null;
    tickTimeLast = null;
    bpm = null;
    tickPeriod = null;
    currentTimeout = null;
    playing = false;
    setup = false;
    timings = [];
    drumPattern = "";
    drumPatternNext = "";
    eBpmJing = null;
  }

  const appChing = new AppChing();

  function bpmToTickPeriodMs(bpm) {
    return 60000.0 / bpm / 2
  }

  function getBpm(anyVal) {
    const numBpm = Number(anyVal);
    if (numBpm != NaN) {
      return numBpm;
    } else {
      return appChing.bpm;
    }
  }

  function onDrumPatternChange(value) {
    appChing.drumPatternNext = value.replace(/^#.*/gm,'').replace(/\s/g,'')
    console.debug("Drum:\n" + appChing.drumPatternNext)
  }

  function onBpmChange(bpm) {
    console.assert(Number(bpm) != NaN);

    appChing.bpm = bpm;
    const oldPeriod = appChing.tickPeriod;
    appChing.tickPeriod = bpmToTickPeriodMs(bpm);
    appChing.timings = []

    // Tick times are calculated relative to a start time as I believe this improves precision due to the lack of
    // accumlating error from repeated additions to the base time.
    //
    // Adjust the relative time as if the new tick period had been playing for 'current tick' ticks.
    // It's also important to include the fractional tick amount accumulated since the current tick began.
    // Note the "currently playing" tick is appChing.tick - 1.
    if (appChing.playing) {
      const now = window.performance.now()
      const elapsedTime = now - appChing.tickStart;
      const currentTickAtNewPeriod = elapsedTime / appChing.tickPeriod;
      const tickDiff = currentTickAtNewPeriod - ((appChing.tick - 1) + (now - appChing.tickTimeLast) / oldPeriod);
      appChing.tickStart += tickDiff * appChing.tickPeriod;
    }

    appChing.eBpmJing.value = appChing.bpm;
  }

  function bpmRamp(endBpm, time, onStop=null) {
    const startBpm = appChing.bpm;
    const updatesPerSec = 10;
    const updates = Math.floor(time * updatesPerSec);
    const increment = (endBpm - startBpm) / updates;

    const loop = (i) => {
      if (i == updates) {
        onBpmChange(endBpm);
        if (onStop) {
          window.setTimeout(() => { onStop(); onBpmChange(startBpm); }, 2000)
        }
      } else {
        onBpmChange(startBpm + (i/updates)**2 * (endBpm - startBpm));
        window.setTimeout(() => loop(i+1), 1000/updatesPerSec)
      }
    }

    loop(1)
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

  function setup(ePlay, eStop, eBpm, eAnalyser, eAnalyserOn, eAnalyserOff) {
    const eChingVises = [
      document.getElementById("ching-visualize-0"),
      document.getElementById("ching-visualize-1"),
      document.getElementById("ching-visualize-2"),
      document.getElementById("ching-visualize-3")
    ];

    const eHong = document.getElementById("hong") as HTMLFormElement

    let audioCtx = null
    try {
      audioCtx = new ((<any>window).AudioContext || (<any>window).webkitAudioContext)();
    } catch(e) {
      if (device.platform == 'browser') {
        throw MSG.errorAudioContextWeb(e)
      } else {
        throw MSG.errorAudioContextAndroid(e)
      }
    }

    const gainMaster = audioCtx.createGain();
    gainMaster.gain.value = 0.5;
    gainMaster.connect(audioCtx.destination);

    const chingFreq = 3200.0
    const chingFreq1 = 2900.0
    const closeFreq = 5400.0
    const chingGain = 0.1 // gain must be low to avoid triggering the waveshaper during sustain

    const makeChingOpen = (freq, gain, release) => {
      return new InstrumentNodeFmExp(audioCtx, 'sine', freq, gain*25, 0.0, 0.0, 0.01, gain, release)
    }
    
    const chingOpen = new InstrumentComposite(
      [
        makeChingOpen(chingFreq, chingGain*1, 0.8),
        makeChingOpen(chingFreq*0.9985, chingGain*0.25, 0.8),
        makeChingOpen(chingFreq1, chingGain*0.5, 0.7),
        makeChingOpen(chingFreq1*0.9985, chingGain*0.125, 0.7),
        makeChingOpen(chingFreq*2.586, chingGain*0.5, 0.4),
        makeChingOpen(chingFreq*2.586*0.9985, chingGain*0.125, 0.4),
        makeChingOpen(chingFreq1*2.586, chingGain*0.25, 0.3),
        makeChingOpen(chingFreq1*2.586*0.9985, chingGain*0.0625, 0.3),
      ]
    )

    const chingClosed = new InstrumentFm(
      audioCtx,
      [
        new InstrumentNodeFmLin(audioCtx, 'sine', closeFreq, 3, 0.0, 0.046, 0, 0.0),
        new InstrumentNodeFmLin(audioCtx, 'square', closeFreq / 31, 10000, 0.00036, 0.370, 0, 0.0),
        new InstrumentNodeFmLin(audioCtx, 'square', closeFreq / 31, 10000, 0.00036, 0.370, 0, 0.0)
      ]
    )

    const tuneGlong = (() => {
      try {
        let node = audioCtx.createConstantSource()
        node.offset.value = 0
        node.start()
        return node
      } catch(e) {
        // iOS doesn't have ConstantSourceNode
        return null
      }
    })();

    const drums = [
      new InstrumentDrumFm(
        audioCtx,
        ParamsInstrumentDrumFm.make(
          {freqStart: 250, freqEnd: 78, decay: 0.5, attack: 0.04}
        ),
        tuneGlong
      ),
      new InstrumentDrumFm(
        audioCtx,
        ParamsInstrumentDrumFm.make(
          {freqStart: 300, freqEnd: 216, decay: 0.210, attack: 0.02, freqDecay: 0.035}
        ),
        tuneGlong
      ),
      new InstrumentDrumFm(
        audioCtx,
        ParamsInstrumentDrumFm.make(
          {gain: 0.50, freqStart: 155, freqEnd: 120, decay: 0.05, attack: 0.0, magStrike: 2000}
        ),
        tuneGlong
      ),
      new InstrumentDrumFm(
        audioCtx,
        ParamsInstrumentDrumFm.make(
          {freqStart: 470, freqEnd: 456, decay: 0.05, attack: 0.02, magStrike: 250}
        ),
        tuneGlong
      ),
      new InstrumentDrumGabber(
        audioCtx,
        ParamsInstrumentDrumFm.make(
          {gain: 3, freqStart: 200, freqEnd: 38, decay: 0.625, attack: 0.04, magFreqVary:0.25, magStrike: 250}
        ),
        tuneGlong,
        2
      ),
      new InstrumentDrumGabber(
        audioCtx,
        ParamsInstrumentDrumFm.make(
          {gain: 3, freqStart: 200, freqEnd: 38, decay: 0.5, attack: 0.04, magFreqVary:0.25, magStrike: 250}
        ),
        tuneGlong,
        10
      ),
      new InstrumentDrumGabber(
        audioCtx,
        ParamsInstrumentDrumFm.make(
          {gain: 3, freqStart: 200, freqEnd: 38, decay: 0.5, attack: 0.04, magFreqVary:0.25, magStrike: 250}
        ),
        tuneGlong,
        3000
      )
    ]

    const gainGlong = audioCtx.createGain();
    drums.forEach(i => i.connect(gainGlong));
    gainGlong.connect(gainMaster);

    const instruments = Array.prototype.concat([chingOpen, chingClosed], drums)

    const gainChing = audioCtx.createGain()
    gainChing.connect(gainMaster)

    const distortionClosed = makeShaper(audioCtx, [chingClosed], [], 1, 1, 1, '4x', 100)
    distortionClosed.connect(gainChing)

    const gainChingOpen = audioCtx.createGain()
    gainChingOpen.connect(gainChing)
    gainChingOpen.gain.value = 4
    const distortionOpen = makeShaper(audioCtx, [chingOpen], [], 1, 1, 1, '4x', 100)
    distortionOpen.connect(gainChingOpen)
    
    const analyser = audioCtx.createAnalyser();
    try {
      analyser.fftSize = 2048;
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

    const doChingOpen = () => {
      chingOpen.noteOn(0, 1)
      // Once the open ching has finished decaying from the distortion phase, it must begin its release.
      chingOpen.noteOff(audioCtx.currentTime + 0.1)
    }
    const doChingClose = () => {
      chingClosed.noteOn(0, 1)
      chingOpen.kill(0)
    }

    const doPattern = (recurse=0) => {
      // TODO: replace with parser...
      if (appChing.drumPatternNext != null) {
        appChing.drumPattern = appChing.drumPatternNext;
        appChing.drumPatternNext = null;
      }
      const pattern = appChing.drumPattern
      if (recurse > 100) {
        onStop();
      } else if (pattern.length > 0) {
        const idxPattern = appChing.idxPattern % pattern.length
        const drumNum = Number(pattern[idxPattern])
        if (drumNum >= 0 && drumNum < drums.length) {
          drums[drumNum].noteOn(0, 1)
          appChing.idxPattern += 1;
        } else if (pattern.slice(idxPattern, idxPattern+3) == 'END') {
          bpmRamp(Math.min(40, appChing.bpm * 0.5), 10 + Math.min(appChing.bpm-70) / 25, onStop);
          appChing.idxPattern += 3;
          doPattern(recurse+1);
        } else if (pattern.slice(idxPattern, idxPattern+3) == 'BPM') {
          appChing.idxPattern += 3;

          const match = pattern.slice(appChing.idxPattern, pattern.length).match(/^\d+/)
          if (match) {
            bpmRamp(Number(match[0]), 0.5);
            appChing.idxPattern += match[0].length;
          } else {
            console.error("Bad BPM spec");
          }

          doPattern(recurse+1);
        } else {
          appChing.idxPattern += 1;
        }
      } else {
        appChing.idxPattern += 1;
      }
    }

    const onTick = () => {
      if (!appChing.playing) {
        return false;
      }

      appChing.tickTimeLast = window.performance.now()

      if (appChing.tick % 8 == 0) {
        doChingClose();
      } else if (appChing.tick % 8 == 4) {
        doChingOpen();
      }

      let currentTick = appChing.tick;
      window.setTimeout(
        () => {
          eHong.value = Math.floor(currentTick / 4) + 1;
          updateChingVis(eChingVises, Math.floor(currentTick / 2) % 4);
        },
        50 // TBD: let the user tune this -- no reliable latency measure is available
      )

      doPattern();

      appChing.tick += 1;

      appChing.currentTimeout = window.setTimeout(
        onTick,
        (appChing.tickStart + appChing.tickPeriod * appChing.tick) - appChing.tickTimeLast
      );

      if (appChing.timings.push(appChing.tickTimeLast) == 80) {
        const timings = appChing.timings;
        appChing.timings = []

        const diffs = [];
        for (i = 1; i < timings.length; ++i) {
          diffs.push(timings[i] - timings[i-1])
        }

        console.debug("Tick  : " + appChing.tick)
        console.debug("Ideal : " + appChing.tickPeriod)
        console.debug("Mean  : " + diffs.reduce((acc, v) => acc + v, 0) / diffs.length)

        diffs.sort()
        console.debug("Median: " + diffs[Math.floor(diffs.length/2)])
      }
    }

    const onPlay = () => {
      instruments.forEach(i => i.kill(0));

      onBpmChange(getBpm(eBpm.value));

      appChing.tick = 0;
      appChing.idxPattern = 0;
      appChing.playing = true;
      appChing.tickStart = window.performance.now();
      eStop.removeAttribute('disabled');
      ePlay.setAttribute('disabled',1);

      quietNoise.connect(gainMaster);

      if (appChing.analyser) {
        gainMaster.connect(analyser)
      }

      onTick();
    }

    const onStop = () => {
      appChing.playing = false;
      if (appChing.currentTimeout) {
        window.clearTimeout(appChing.currentTimeout);
        appChing.currentTimeout = null;
      }
      eStop.setAttribute('disabled',1);
      ePlay.removeAttribute('disabled');
      document.getElementById("play-delay").removeAttribute('disabled');
      quietNoise.disconnect();
    }

    const chup0 = () => { doChingClose(); appChing.currentTimeout = window.setTimeout(chup1, 200); }
    const chup1 = () => { doChingClose(); appChing.currentTimeout = window.setTimeout(chup2, 3000); }
    const chup2 = () => {
      doChingOpen();
      appChing.currentTimeout = window.setTimeout(onPlay, appChing.tickPeriod * 4);
    }

    ePlay.addEventListener("click", onPlay)
    document.getElementById("play-delay").addEventListener("click", e => {
      onStop();
      ePlay.setAttribute('disabled',1);
      eStop.removeAttribute('disabled');
      chup0();
    })

    eStop.addEventListener("click", onStop)

    eBpm.addEventListener("change", e => {
      onBpmChange(getBpm(e.target.value))
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
      eAnalyserOn.setAttribute('disabled',1);
      eAnalyserOff.removeAttribute('disabled');
      gainMaster.connect(analyser)
      window.requestAnimationFrame((time) => analyserDraw(time, analyser, eAnalyser.getContext('2d')))
    })
    eAnalyserOff.addEventListener("click", e => {
      appChing.analyser = false;
      eAnalyserOff.setAttribute('disabled',1);
      eAnalyserOn.removeAttribute('disabled');
      gainMaster.disconnect(analyser)
    })

    eAnalyserOff.setAttribute('disabled',1);

    document.getElementById("play-ching-closed").addEventListener("click", e => doChingClose() );
    document.getElementById("play-ching-open").addEventListener("click", e => doChingOpen() );
    document.getElementById("play-drum-0").addEventListener("click", e => drums[0].noteOn(0, 1) );
    document.getElementById("play-drum-1").addEventListener("click", e => drums[1].noteOn(0, 1) );
    document.getElementById("play-drum-2").addEventListener("click", e => drums[2].noteOn(0, 1) );
    document.getElementById("play-drum-3").addEventListener("click", e => drums[3].noteOn(0, 1) );

    [['vol-glong', gainGlong],
     ['vol-ching', gainChing]
    ].forEach(
     ([ctlId, gainCtl]) => handleSliderUpdate(
       document.getElementById(ctlId),
       (alpha, init) => {
         gainCtl.gain.cancelScheduledValues(audioCtx.currentTime)
         // max volume is 5, allowing distortion
         const vol = Math.pow(alpha, 5) * 5.0
         if (!init) {
           gainCtl.gain.setTargetAtTime(vol, audioCtx.currentTime, 0.2)
         } else {
           gainCtl.gain.value = vol
         }
       }
     )
    )

    handleSliderUpdate(
      document.getElementById('tune-glong'),
      (alpha, init) => {
        const val = -1000 + alpha * 2000.0;
        if (tuneGlong) {	
          tuneGlong.offset.cancelScheduledValues(audioCtx.currentTime);
          tuneGlong.offset.setTargetAtTime(val, audioCtx.currentTime, 0.01)
        }
        else {
          drums.forEach(i => i.detune(val))
        }
      }
    )
  }

  document.addEventListener("DOMContentLoaded", e => {
    const ePlay = document.getElementById("play") as HTMLFormElement
    const eStop = document.getElementById("stop") as HTMLFormElement
    const eBpm = document.getElementById("bpm") as HTMLFormElement
    appChing.eBpmJing = document.getElementById("bpm-jing") as HTMLFormElement

    // iPad needs to have its audio triggered from a user event. Run setup on any button, then re-trigger the
    // original click event.
    const setupFunc = (e) => {
      if (!appChing.setup) {
        appChing.setup = true;
        setup(
          ePlay,
          eStop,
          eBpm,
          document.getElementById("analyser"),
          document.getElementById("analyser-on"),
          document.getElementById("analyser-off"),
        );
        e.target.click();
      }
      e.target.removeEventListener("click", setupFunc);
    }

    {
      const buts = document.getElementsByTagName("button");
      for (let i=0; i < buts.length; ++i) {
        buts[i].addEventListener("click", setupFunc)
      }
    }

    eStop.setAttribute('disabled',"1");

    const funcBpmMod = (e) => {
      if (e.target.dataset.set) {
        appChing.bpm = Number(e.target.dataset.set);
      } else if (e.target.dataset.scale) {
        appChing.bpm *= Number(e.target.dataset.scale);
      } else {
        appChing.bpm += Number(e.target.dataset.increment);
      }
      eBpm.value = appChing.bpm;
      onBpmChange(appChing.bpm);
    }

    {
      const buts = document.getElementsByClassName("bpm-mod");
      for (let i=0; i < buts.length; ++i) {
        buts[i].addEventListener("click", funcBpmMod);
      }
    }

    onBpmChange(getBpm(eBpm.value));

    const ePatternDrum = document.getElementById("pattern-drum") as HTMLFormElement;
    ePatternDrum.addEventListener("change", e => onDrumPatternChange((e.target as HTMLFormElement).value));

    [
      ["pattern-none", ""],
      ["pattern-lao", pleyngDahmLao],
      ["pattern-khmen", pleyngDahmKhmen],
      ["pattern-omdeuk", pleyngKhmenOmDteuk],
      ["pattern-saiyork", pleyngKhmenSaiYork],
      ["pattern-porttisut", pleyngKhmenPortTiSut],
      ["pattern-jorakaehangyaow", pleyngJorakaeHangYaow],
      ["pattern-gabber", patternGabber]
    ].forEach(([id, pattern]) => {
      document.getElementById(id).addEventListener("click", e => {
        ePatternDrum.value = pattern;
        onDrumPatternChange(ePatternDrum.value);
      })
    })

    onDrumPatternChange(ePatternDrum.value);
  })
}
