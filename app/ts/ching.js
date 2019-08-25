/*
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
'use strict';
var patternGabber = "023231010xx1515234x26231";
var pleyngDahmLao = "0x1x3x1x1xxx0x1x \n" +
    "0x1x3x1x1xxx0x1x \n" +
    "0x1x3x1x1xxx0x1x \n" +
    "0x1x3x131xxx0x1x \n" +
    "\n" +
    "0x1x3x1x1xxx0x1x \n" +
    "0x1x3x1x1xxx0x1x \n" +
    "0x1x3x1x1xxx0x1x \n" +
    "0x1x3x131x010x1x \n";
var pleyngDahmKhmen = "0xx23x1x0x1x01x2 \n" +
    "3xx23x2x3x2x3x1x \n" +
    "0xx23x1x0x1x01x2 \n" +
    "3xx232323x123101 \n" +
    "\n" +
    "0xx23x110x1x01x2 \n" +
    "3xx2323232323x11 \n" +
    "0xx23x11023101x2 \n" +
    "3xxxx23232323101 \n";
var pleyngJorakaeHangYaow = "# จระเข้หางยาว\n\
# This pattern is \n\
# currently only for \n\
# timing out the \n\
# length of the song \n\
xxxx xxxx xxxx xxxx\n\
xxxx xxxx xxxx xxxx\n\
xxxx xxxx xxxx xxxx\n\
xxxx xxxx xxxx xxxx\n\
xxxx xxxx xxxx xxxx\n\
xxxx xxxx xxxx xxxx\n\
xxxx xxxx xxxx xxxx\n\
xxxx xxxx xxxx xxxx\n\
xxxx xxxx xxxx xxxx\n\
xxxx xxxx xxxx xxxx\n\
xxxx xxxx xxxx xxxx\n\
xxxx xxxx xxxx xxxx\n\
xxxx xxxx xxxx xxxx\n\
xxxx xxxx xxxx xxxx\n\
xxxx xxxx xxxx xxxx\n\
xxxx xxxx xxxx xxxx\n\
xxxx xxxx xxxx xxxx\n\
xxxx xxxx xxxx xxxx\n\
xxxx xxxx xxxx xxxx\n\
xxxx xxxx xxxx xxxx\n\
xxxx xxxx xxxx xxxx\n\
xxxx xxxx xxxx xxxx\n\
xxxx xxxx xxxx xxxx\n\
xxxx xxxx xxxx xxxx\n\
xxxx xxxx xxxx xxxx\n\
xxxx xxxx xxxx xxxx\n\
xxxx xxxx xxxx xxxx\n\
xxxx xxxx xxxx xxxx\n\
xxxx xxxx xxxx xxxx\n\
xxxx xxxx xxxx xxxx\n\
xxxx xxxx xxxx xxxx\n\
xxxx xxxx xxxx xxxx\n\
xxxx xxxx xxxx xxxx\n\
xxxx xxxx xxxx xxxx\n\
xxxx xxxx xxxx xxxx\n\
xxxx xxxx xxxx xxxx\n\
xxxx xxxx xxxx xxxx\n\
xxxx xxxx xxxx xxxx\n\
xxxx xxxx xxxx xxxx\n\
xxxx xxxx xxxx xxxx\n\
xxxx xxxx xxxx xxxx\n\
xxxx xxxx xxxx xxxx\n\
xxxx xxxx xxxx xxxx\n\
xxxx xxxx xxxx xxxx\n\
xxxx xxxx xxxx xxxx\n\
xxxx xxxx xxxx xxxx\n\
xxxx xxxx xxxx xxxx\n\
END\n\
xxxx xxxx xxxx xxxx\n\
";
var pleyngKhmenPortTiSut = "# เขมรโพธิสัตว์ no intro\n\
# This pattern is \n\
# currently only for \n\
# timing out the \n\
# length of the song \n\
BPM75\n\
xxxxxxxx\n\
xxxxxxxx xxxxxxxx\n\
xxxxxxxx xxxxxxxx\n\
xxxxxxxx xxxxxxxx\n\
xxxxxxxx xxxxxxxx\n\
xxxxxxxx xxxxxxxx\n\
xxxxxxxx xxxxxxxx\n\
xxxxxxxx xxxxxxxx\n\
xxxxxxxx xxxxxxxx\n\
xxxxxxxx xxxxxxxx\n\
xxxxxxxx xxxxxxxx\n\
xxxxxxxx xxxxxxxx\n\
xxxxxxxx xxxxxxxx\n\
xxxxxxxx xxxxxxxx\n\
xxxxxxxx xxxxxxxx\n\
xxxxxxxx xxxxxxxx\n\
xxxxxxxx xxxxxxxx\n\
\n\
xxxxxxxx xxxxxxxx\n\
xxxxxxxx xxxxxxxx\n\
xxxxxxxx xxxxxxxx\n\
xxxxxxxx xxxxxxxx\n\
xxxxxxxx xxxxxxxx\n\
xxxxxxxx xxxxxxxx\n\
xxxxxxxx xxxxxxxx\n\
xxxxxxxx xxxxxxxx\n\
xxxxxxxx xxxxxxxx\n\
xxxxxxxx xxxxxxxx\n\
xxxxxxxx xxxxxxxx\n\
xxxxxxxx xxxxxxxx\n\
xxxxxxxx xxxxxxxx\n\
xxxxxxxx xxxxxxxx\n\
xxxxxxxx xxxxxxxx\n\
xxxxxxxx xxxxxxxx\n\
xxxxxxxx xxxxxxxx\n\
xxxxxxxx xxxxxxxx\n\
\n\
BPM90\n\
xxxxxxxx xxxxxxxx\n\
xxxxxxxx xxxxxxxx\n\
xxxxxxxx xxxxxxxx\n\
xxxxxxxx xxxxxxxx\n\
xxxxxxxx xxxxxxxx\n\
xxxxxxxx xxxxxxxx\n\
xxxxxxxx xxxxxxxx\n\
xxxxxxxx xxxxxxxx\n\
xxxxxxxx xxxxxxxx\n\
xxxxxxxx xxxxxxxx\n\
xxxxxxxx xxxxxxxx\n\
xxxxxxxx xxxxxxxx\n\
xxxxxxxx xxxxxxxx\n\
xxxxxxxx xxxxxxxx\n\
xxxxxxxx xxxxxxxx\n\
xxxxxxxx xxxxxxxx\n\
xxxxxxxx xxxxxxxx\n\
xxxxxxxx xxxxxxxx\n\
xxxxxxxx xxxxxxxx\n\
xxxxxxxx xxxxxxxx\n\
xxxxxxxx xxxxxxxx\n\
xxxxxxxx xxxxxxxx\n\
xxxxxxxx xxxxxxxx\n\
xxxxxxxx xxxxxxxx\n\
xxxxxxxx xxxxxxxx\n\
END\n\
xxxxxxxx xxxxxxxx\n\
";
var pleyngKhmenOmDteuk = "# เขมรอมตึ๊ก ท่อน ๑\n" +
    "# https://www.youtube.com/watch?v=cv5B4roT0Bo\n" +
    "xxxxxxxx \n" +
    "xxxxxxxx xx1101x2\n" +
    "3xx23x2x 3x2x3x1x\n" +
    "0xx23x1x 0x1x01x2\n" +
    "3xx23232 3x123101\n" +
    "0xx23x11 023101x2\n" +
    "3xx23232 32323x11\n" +
    "0xx23x11 023101x2\n" +
    "\n" +
    "3xxxx232 32323101\n" +
    "0xx23101 023101x2\n" +
    "3xx23232 32323101\n" +
    "0xx23101 023101x2\n" +
    "3xx23232 3x123x11\n" +
    "0xx23x11 023101x2\n" +
    "3xx23232 32323101\n" +
    "02323101 023101x2\n" +
    "\n" +
    "3xx23232 32323101\n" +
    "0xx23x11 023101x2\n" +
    "3xx23232 33123101\n" +
    "0xx23x1x 023101x2\n" +
    "3xx23232 3x123311\n" +
    "0xx23x11 023101x2\n" +
    "3xx23232 32323101\n" +
    "0xx23x11 023101x2\n" +
    "3xx23232 32323101\n" +
    "0xx23101 023101x2\n" +
    "3xx23232 32323101\n" +
    "02323101 023102x3\n" +
    "3xx23232 32323101\n" +
    "\n" +
    "0xx23101 023101x2\n" +
    "3xx23232 32323101\n" +
    "0xx23101 023101x2\n" +
    "3xx23232 3x123x11\n" +
    "0xx23x11 023101x2\n" +
    "3xx23232 32323101\n" +
    "02323101 023101x2\n" +
    "3xx23232 32323101\n" +
    "\n" +
    "0xx23101 023101x2\n" +
    "3xx23232 32323101\n" +
    "0xx23101 023101x2\n" +
    "3xx23232 3x123x11\n" +
    "0xx23x11 023101x2\n" +
    "3xx23232 32323101\n" +
    "02323101 023101x2\n" +
    "3xx23232 32323101\n" +
    "\n" +
    "0xx23x11 023101x2\n" +
    "3xx23232 33123101\n" +
    "0xx23x1x 023101x2\n" +
    "3xx23232 3x123311\n" +
    "0xx23x11 023101x2\n" +
    "3xx23232 32323101\n" +
    "0xx23x11 023101x2\n" +
    "3xx23232 32323101\n" +
    "0xx23101 023101x2\n" +
    "3xx23232 32323101\n" +
    "\n" +
    "END\n" +
    "02323101 023102x3\n" +
    "xxxxxxxx xxxxxxxx\n" +
    "\n";
var pleyngKhmenSaiYork = "\
# This pattern is \n\
# currently only for \n\
# timing out the \n\
# length of the song \n\
BPM65\n\
xxxxxxxx xxxxxxxx\n\
xxxxxxxx xxxxxxxx\n\
xxxxxxxx xxxxxxxx\n\
xxxxxxxx xxxxxxxx\n\
xxxxxxxx xxxxxxxx\n\
xxxxxxxx xxxxxxxx\n\
xxxxxxxx xxxxxxxx\n\
xxxxxxxx xxxxxxxx\n\
xxxxxxxx xxxxxxxx\n\
xxxxxxxx xxxxxxxx\n\
xxxxxxxx xxxxxxxx\n\
xxxxxxxx xxxxxxxx\n\
xxxxxxxx xxxxxxxx\n\
xxxxxxxx xxxxxxxx\n\
xxxxxxxx xxxxxxxx\n\
xxxxxxxx xxxxxxxx\n\
\n\
xxxxxxxx xxxxxxxx\n\
xxxxxxxx xxxxxxxx\n\
xxxxxxxx xxxxxxxx\n\
xxxxxxxx xxxxxxxx\n\
xxxxxxxx xxxxxxxx\n\
xxxxxxxx xxxxxxxx\n\
xxxxxxxx xxxxxxxx\n\
xxxxxxxx xxxxxxxx\n\
xxxxxxxx xxxxxxxx\n\
xxxxxxxx xxxxxxxx\n\
xxxxxxxx xxxxxxxx\n\
xxxxxxxx xxxxxxxx\n\
xxxxxxxx xxxxxxxx\n\
xxxxxxxx xxxxxxxx\n\
xxxxxxxx xxxxxxxx\n\
xxxxxxxx xxxxxxxx\n\
\n\
BPM80\n\
xxxxxxxx xxxxxxxx\n\
xxxxxxxx xxxxxxxx\n\
xxxxxxxx xxxxxxxx\n\
xxxxxxxx xxxxxxxx\n\
xxxxxxxx xxxxxxxx\n\
xxxxxxxx xxxxxxxx\n\
xxxxxxxx xxxxxxxx\n\
xxxxxxxx xxxxxxxx\n\
xxxxxxxx xxxxxxxx\n\
xxxxxxxx xxxxxxxx\n\
xxxxxxxx xxxxxxxx\n\
xxxxxxxx xxxxxxxx\n\
xxxxxxxx xxxxxxxx\n\
xxxxxxxx xxxxxxxx\n\
xxxxxxxx xxxxxxxx\n\
xxxxxxxx xxxxxxxx\n\
\n\
xxxxxxxx xxxxxxxx\n\
xxxxxxxx xxxxxxxx\n\
xxxxxxxx xxxxxxxx\n\
xxxxxxxx xxxxxxxx\n\
xxxxxxxx xxxxxxxx\n\
xxxxxxxx xxxxxxxx\n\
xxxxxxxx xxxxxxxx\n\
xxxxxxxx xxxxxxxx\n\
xxxxxxxx xxxxxxxx\n\
xxxxxxxx xxxxxxxx\n\
xxxxxxxx xxxxxxxx\n\
xxxxxxxx xxxxxxxx\n\
xxxxxxxx xxxxxxxx\n\
xxxxxxxx xxxxxxxx\n\
xxxxxxxx xxxxxxxx\n\
END\n\
xxxxxxxx xxxxxxxx\n\
xxxxxxxx xxxxxxxx\n\
";
window.onerror = function (message, source, lineno, colno, error) {
    alert(message);
    document.getElementById("error").style.display = "block";
    document.getElementById("error").innerHTML = message + "<br/>" + "Line: " + lineno + "<br/>" + source;
    return true;
};
function makeInstrument(audioCtx, nodes) {
    return {
        nodes: nodes,
        noteOn: function (gain) {
            if (gain === void 0) { gain = 1; }
            nodes.forEach(function (n) { return n.noteOn(audioCtx.currentTime, gain); });
        },
        noteOff: function () {
            nodes.forEach(function (n) { return n.noteOff(audioCtx.currentTime); });
        },
        kill: function () {
            nodes.forEach(function (n) { return n.kill(audioCtx.currentTime); });
        },
        connect: function (node) { throw "unimplemented"; }
    };
}
function makeFmInstrument(audioCtx, fmNodes, connections) {
    if (connections === void 0) { connections = null; }
    if (!connections) {
        for (var i = 0; i < fmNodes.length - 1; ++i) {
            fmNodes[i + 1].output.connect(fmNodes[i].osc.frequency);
        }
    }
    else {
        connections.forEach(function (c) { return fmNodes[c[0]].output.connect(fmNodes[c[1]].osc.frequency); });
    }
    return Object.assign(makeInstrument(audioCtx, fmNodes), {
        connect: function (node) {
            fmNodes[0].output.connect(node);
        },
        disconnect: function () {
            fmNodes[0].output.disconnect();
        }
    });
}
function makeFmNode(audioCtx, type, freq, gGain, tAttack, tDecay, gSustain, tRelease) {
    var gain = audioCtx.createGain();
    gain.gain.value = 0;
    // 2018-12-31: iPad doesn't support node constructors
    var osc = audioCtx.createOscillator();
    osc.type = type;
    osc.frequency.value = freq;
    osc.connect(gain);
    osc.start();
    return {
        osc: osc,
        output: gain,
        noteOn: function (time, gainNoteOn) {
            if (gainNoteOn === void 0) { gainNoteOn = 1; }
            gain.gain.cancelScheduledValues(time);
            var startTime = time;
            gain.gain.linearRampToValueAtTime(0, startTime);
            gain.gain.linearRampToValueAtTime(gGain * gainNoteOn, startTime + tAttack);
            gain.gain.linearRampToValueAtTime(gSustain * gainNoteOn, startTime + tAttack + tDecay);
        },
        noteOff: function (time) {
            gain.gain.cancelScheduledValues(time);
            gain.gain.linearRampToValueAtTime(0, time + tRelease);
        },
        kill: function (time) {
            gain.gain.linearRampToValueAtTime(0, time + 0.0001);
        }
    };
}
function makeDrum(audioCtx, params) {
    var p = Object.assign({
        freqStart: 225,
        freqEnd: 80,
        decay: 0.7,
        freqDecay: 0.07,
        attack: 0.1,
        type: 'sine',
        gain: 1,
        magStrike: 50,
        freqVary: 2.5,
        magFreqVary: 2.5
    }, params);
    var carrier = makeFmNode(audioCtx, p.type, p.freqEnd, p.gain, p.attack, p.decay, 0, 0.0);
    var freqStrike = p.freqStart / 2;
    var striker = makeFmNode(audioCtx, 'square', freqStrike, p.magStrike, 0.0036, 0.05, 1, 0.0);
    var result = makeFmInstrument(audioCtx, [
        carrier,
        // Give some 'wobble' to the drum
        makeFmNode(audioCtx, 'sine', p.freqVary, p.magFreqVary, 0.036, p.decay * 2, 1, 0.0),
        striker,
    ], [[1, 0], [2, 0]]);
    var superNoteOn = carrier.noteOn;
    carrier.noteOn = function (time, gainNoteOn) {
        if (gainNoteOn === void 0) { gainNoteOn = 1; }
        carrier.osc.frequency.setValueAtTime(p.freqStart, time);
        carrier.osc.frequency.exponentialRampToValueAtTime(p.freqEnd, time + p.freqDecay);
        superNoteOn(time, gainNoteOn);
    };
    return result;
}
function makeGabber(audioCtx, params) {
    var gain = audioCtx.createGain();
    gain.gain.value = params.gain || 1;
    var overdrive = params.overdrive || 2;
    params.gain = overdrive;
    var drum = makeDrum(audioCtx, params);
    var shaper = makeShaper(audioCtx, 5, 1, 1, '1x');
    var filter = audioCtx.createBiquadFilter();
    filter.type = 'highpass';
    filter.frequency.value = 10;
    drum.connect(shaper);
    shaper.connect(filter);
    filter.connect(gain);
    var drumOut = drum.nodes[0];
    var drumGain = drum.nodes[0].output.gain;
    drum.connect = function (node) { return gain.connect(node); };
    drum.disconnect = function () { return gain.disconnect(); };
    // This section could be used to experiment with different volume envelopes
    /*  drumOut.noteOn = (time, gainNoteOn=1) => {
        drumGain.cancelScheduledValues(time);
        const startTime = time + 0.01
        drumGain.linearRampToValueAtTime(overdrive * gainNoteOn, startTime);
        drumGain.setTargetAtTime(0.0, startTime, params.decay);
      }*/
    return drum;
}
/**
    * Waveshaper from modified sigmoid curve.
    * This function can produce low-frequency artifacts that will need to be filtered away.
    *
    * "Factor" affects curve slope. Final factor value is interpolated from a and b from 0 to 1.
    * Choose equal factors for symmetric distortion (odd harmonics), or unequal for assymetric (even harmonics).
    */
function makeShaper(audioCtx, factorA, factorB, shift, oversample) {
    if (factorA === void 0) { factorA = 1; }
    if (factorB === void 0) { factorB = 1; }
    if (shift === void 0) { shift = 1; }
    if (oversample === void 0) { oversample = '4x'; }
    var result = audioCtx.createWaveShaper();
    var curve = new Float32Array(44100);
    for (var i = 0; i < 44100; ++i) {
        var x = i / 44100.0;
        var valA = -1.0 / (1.0 + Math.exp(shift - x * factorA));
        var valB = -1.0 / (1.0 + Math.exp(shift - x * factorB));
        curve[i] = valA + (valB - valA) * Math.pow(x, 2);
    }
    result.curve = curve;
    result.oversample = oversample;
    return result;
}
var appChing = {
    analyser: false,
    tick: 0,
    idxPattern: 0,
    tickStart: null,
    tickTimeLast: null,
    bpm: null,
    tickPeriod: null,
    currentTimeout: null,
    playing: false,
    setup: false,
    timings: [],
    drumPattern: "",
    drumPatternNext: "",
    eBpmJing: null
};
function bpmToTickPeriodMs(bpm) {
    return 60000.0 / bpm / 2;
}
function getBpm(anyVal) {
    var numBpm = Number(anyVal);
    if (numBpm != NaN) {
        return numBpm;
    }
    else {
        return appChing.bpm;
    }
}
function onDrumPatternChange(value) {
    appChing.drumPatternNext = value.replace(/^#.*/gm, '').replace(/\s/g, '');
    console.debug("Drum:\n" + appChing.drumPatternNext);
}
function onBpmChange(bpm) {
    console.assert(Number(bpm) != NaN);
    appChing.bpm = bpm;
    var oldPeriod = appChing.tickPeriod;
    appChing.tickPeriod = bpmToTickPeriodMs(bpm);
    appChing.timings = [];
    // Tick times are calculated relative to a start time as I believe this improves precision due to the lack of
    // accumlating error from repeated additions to the base time.
    //
    // Adjust the relative time as if the new tick period had been playing for 'current tick' ticks.
    // It's also important to include the fractional tick amount accumulated since the current tick began.
    // Note the "currently playing" tick is appChing.tick - 1.
    if (appChing.playing) {
        var now = window.performance.now();
        var elapsedTime = now - appChing.tickStart;
        var currentTickAtNewPeriod = elapsedTime / appChing.tickPeriod;
        var tickDiff = currentTickAtNewPeriod - ((appChing.tick - 1) + (now - appChing.tickTimeLast) / oldPeriod);
        appChing.tickStart += tickDiff * appChing.tickPeriod;
    }
    appChing.eBpmJing.value = appChing.bpm;
}
function bpmRamp(endBpm, time, onStop) {
    if (onStop === void 0) { onStop = null; }
    var startBpm = appChing.bpm;
    var updatesPerSec = 10;
    var updates = Math.floor(time * updatesPerSec);
    var increment = (endBpm - startBpm) / updates;
    var loop = function (i) {
        if (i == updates) {
            onBpmChange(endBpm);
            if (onStop) {
                window.setTimeout(function () { onStop(); onBpmChange(startBpm); }, 2000);
            }
        }
        else {
            onBpmChange(startBpm + Math.pow((i / updates), 2) * (endBpm - startBpm));
            window.setTimeout(function () { return loop(i + 1); }, 1000 / updatesPerSec);
        }
    };
    loop(1);
}
function analyserDraw(time, analyser, canvasCtx) {
    var updateFreq = (1 / 65) * 1000;
    var loop = function (lastTime, time, analyser, canvasCtx, bufferImg, bufferFft) {
        var canvasWidth = canvasCtx.canvas.width;
        var canvasHeight = canvasCtx.canvas.height;
        analyser.getFloatFrequencyData(bufferFft);
        canvasCtx.putImageData(bufferImg, -1, 0);
        bufferImg = canvasCtx.getImageData(0, 0, canvasWidth, canvasHeight);
        var dbMin = analyser.minDecibels;
        var dbMax = analyser.maxDecibels;
        var gainDb = 15;
        var freqBinCount = analyser.frequencyBinCount;
        var data = bufferImg.data;
        var sampleRate = analyser.context.sampleRate;
        var iImg = (canvasWidth - 1) * 4;
        for (var y = 0; y < canvasHeight; ++y) {
            var alpha = y / canvasHeight;
            var iBin = Math.floor(Math.pow(1.0 - alpha, 3) * freqBinCount);
            var fVal = bufferFft[iBin] + gainDb;
            var iIntensity = 255 * (Math.max(Math.min(fVal, dbMax), dbMin) - dbMin) / (dbMax - dbMin);
            data[iImg] = iIntensity;
            data[iImg + 1] = iIntensity;
            data[iImg + 2] = iIntensity;
            iImg += canvasWidth * 4;
        }
        canvasCtx.putImageData(bufferImg, 0, 0, canvasWidth - 1, 0, canvasWidth, canvasHeight);
        if (appChing.analyser) {
            window.setTimeout(function () { return window.requestAnimationFrame(function (time) { return loop(time, time, analyser, canvasCtx, bufferImg, bufferFft); }); }, Math.max((lastTime + updateFreq) - time, 0));
        }
    };
    canvasCtx.fillRect(0, 0, 10000, 10000);
    loop(time, time, analyser, canvasCtx, canvasCtx.getImageData(0, 0, canvasCtx.canvas.width, canvasCtx.canvas.height), new Float32Array(analyser.frequencyBinCount));
}
function handleSliderUpdate(ctl, onChange) {
    var min = 0;
    var max = 100;
    var changeFunc = function () { return onChange((Number(ctl.value) - min) / (max - min)); };
    ctl.addEventListener("input", changeFunc);
    changeFunc();
}
function updateChingVis(eChingVises, phase) {
    for (var i = 0; i < eChingVises.length; ++i) {
        var e = eChingVises[i];
        if (phase == i) {
            e.style.backgroundColor = e.dataset.activeCol;
        }
        else {
            e.style.backgroundColor = 'white';
        }
    }
}
function setup(ePlay, eStop, eBpm, eAnalyser, eAnalyserOn, eAnalyserOff) {
    var eChingVises = [
        document.getElementById("ching-visualize-0"),
        document.getElementById("ching-visualize-1"),
        document.getElementById("ching-visualize-2"),
        document.getElementById("ching-visualize-3")
    ];
    var eHong = document.getElementById("hong");
    var chingFreq = 2500.0;
    var closeFreq = 5400.0;
    var AudioContext = window.AudioContext || window.webkitAudioContext;
    var audioCtx = new AudioContext();
    var gainMaster = audioCtx.createGain();
    gainMaster.gain.value = 0.5;
    gainMaster.connect(audioCtx.destination);
    var chingOpen = makeFmInstrument(audioCtx, [
        makeFmNode(audioCtx, 'sine', chingFreq, 1, 0.0, 1.6, 0, 0.0),
        makeFmNode(audioCtx, 'square', chingFreq * 1.2, 200, 0.00036, 1.670, 0, 0.0),
        makeFmNode(audioCtx, 'square', closeFreq, 10000, 0.00036, 0.026, 0, 0.0)
    ]);
    var chingClosed = makeFmInstrument(audioCtx, [
        makeFmNode(audioCtx, 'sine', closeFreq, 3, 0.0, 0.046, 0, 0.0),
        makeFmNode(audioCtx, 'square', closeFreq / 31, 10000, 0.00036, 0.370, 0, 0.0),
        makeFmNode(audioCtx, 'square', closeFreq / 31, 10000, 0.00036, 0.370, 0, 0.0)
    ]);
    var drums = [
        makeDrum(audioCtx, { freqStart: 250, freqEnd: 78, decay: 0.5, attack: 0.04 }),
        makeDrum(audioCtx, { freqStart: 300, freqEnd: 216, decay: 0.210, attack: 0.02, freqDecay: 0.035 }),
        makeDrum(audioCtx, { gain: 0.45, freqStart: 335, freqEnd: 320, decay: 0.05, attack: 0.0, magStrike: 1000 }),
        makeDrum(audioCtx, { freqStart: 470, freqEnd: 456, decay: 0.05, attack: 0.02, magStrike: 250 }),
        makeGabber(audioCtx, { gain: 3, overdrive: 2, freqStart: 200, freqEnd: 38, decay: 0.625, attack: 0.04, magFreqVary: 0.25,
            magStrike: 250 }),
        makeGabber(audioCtx, { gain: 3, overdrive: 10, freqStart: 200, freqEnd: 38, decay: 0.5, attack: 0.04, magFreqVary: 0.25,
            magStrike: 250 }),
        makeGabber(audioCtx, { gain: 3, overdrive: 30, freqStart: 200, freqEnd: 38, decay: 0.5, attack: 0.04, magFreqVary: 0.25,
            magStrike: 250 }),
    ];
    var instruments = Array.prototype.concat([chingOpen, chingClosed], drums);
    var gainGlong = audioCtx.createGain();
    drums.forEach(function (i) { return i.connect(gainGlong); });
    gainGlong.connect(gainMaster);
    var tuneGlong = (function () {
        try {
            var node_1 = audioCtx.createConstantSource();
            node_1.offset.value = 0;
            node_1.start();
            drums.forEach(function (i) { return node_1.connect(i.nodes[0].osc.detune); });
            return node_1;
        }
        catch (e) {
            // iOS doesn't have ConstantSourceNode
            return null;
        }
    })();
    var gainChing = audioCtx.createGain();
    gainChing.connect(gainMaster);
    var distortion = makeShaper(audioCtx, 10, 10, 5);
    var filter = audioCtx.createBiquadFilter();
    filter.type = 'highpass';
    filter.frequency.value = 1500;
    filter.connect(gainChing);
    distortion.connect(filter);
    chingOpen.connect(distortion);
    chingClosed.connect(distortion);
    var analyser = audioCtx.createAnalyser();
    try {
        analyser.fftSize = 2048;
    }
    catch (e) {
        // iPhone has a max fft size 2048?
    }
    // Browsers can sometimes flip the audio output off during quiet periods, which is annoying on mobile.
    // Add a bit of inaudible noise to keep the channel open while playing is activated.
    var quietNoiseBuffer = audioCtx.createBuffer(1, audioCtx.sampleRate * 0.25, audioCtx.sampleRate);
    var quietNoiseBufferData = quietNoiseBuffer.getChannelData(0);
    for (var i = 0; i < quietNoiseBuffer.length; i += audioCtx.sampleRate / 100) {
        quietNoiseBufferData[Math.floor(i)] = (-1 + Math.random() * 2) * 0.001;
    }
    var quietNoise = audioCtx.createBufferSource();
    quietNoise.buffer = quietNoiseBuffer;
    quietNoise.loop = true;
    quietNoise.loopEnd = 0.25;
    quietNoise.start();
    var doChingOpen = function (e) {
        chingClosed.noteOn(0.15);
        chingOpen.noteOn();
    };
    var doChingClose = function (e) {
        chingClosed.noteOn();
        chingOpen.noteOff();
    };
    var doPattern = function (recurse) {
        if (recurse === void 0) { recurse = 0; }
        // TODO: replace with parser...
        if (appChing.drumPatternNext != null) {
            appChing.drumPattern = appChing.drumPatternNext;
            appChing.drumPatternNext = null;
        }
        var pattern = appChing.drumPattern;
        if (recurse > 100) {
            onStop();
        }
        else if (pattern.length > 0) {
            var idxPattern = appChing.idxPattern % pattern.length;
            var drumNum = Number(pattern[idxPattern]);
            if (drumNum >= 0 && drumNum < drums.length) {
                drums[drumNum].noteOn();
                appChing.idxPattern += 1;
            }
            else if (pattern.slice(idxPattern, idxPattern + 3) == 'END') {
                bpmRamp(Math.min(40, appChing.bpm * 0.5), 10 + Math.min(appChing.bpm - 70) / 25, onStop);
                appChing.idxPattern += 3;
                doPattern(recurse + 1);
            }
            else if (pattern.slice(idxPattern, idxPattern + 3) == 'BPM') {
                appChing.idxPattern += 3;
                var match = pattern.slice(appChing.idxPattern, pattern.length).match(/^\d+/);
                if (match) {
                    bpmRamp(Number(match[0]), 0.5);
                    appChing.idxPattern += match[0].length;
                }
                else {
                    console.error("Bad BPM spec");
                }
                doPattern(recurse + 1);
            }
            else {
                appChing.idxPattern += 1;
            }
        }
        else {
            appChing.idxPattern += 1;
        }
    };
    var onTick = function () {
        if (!appChing.playing) {
            return false;
        }
        appChing.tickTimeLast = window.performance.now();
        if (appChing.tick % 8 == 0) {
            doChingClose();
        }
        else if (appChing.tick % 8 == 4) {
            doChingOpen();
        }
        var currentTick = appChing.tick;
        window.setTimeout(function () {
            eHong.value = Math.floor(currentTick / 4) + 1;
            updateChingVis(eChingVises, Math.floor(currentTick / 2) % 4);
        }, 50 // TBD: let the user tune this -- no reliable latency measure is available
        );
        doPattern();
        appChing.tick += 1;
        appChing.currentTimeout = window.setTimeout(onTick, (appChing.tickStart + appChing.tickPeriod * appChing.tick) - appChing.tickTimeLast);
        if (appChing.timings.push(appChing.tickTimeLast) == 80) {
            var timings = appChing.timings;
            appChing.timings = [];
            var diffs = [];
            for (i = 1; i < timings.length; ++i) {
                diffs.push(timings[i] - timings[i - 1]);
            }
            console.debug("Tick  : " + appChing.tick);
            console.debug("Ideal : " + appChing.tickPeriod);
            console.debug("Mean  : " + diffs.reduce(function (acc, v) { return acc + v; }, 0) / diffs.length);
            diffs.sort();
            console.debug("Median: " + diffs[Math.floor(diffs.length / 2)]);
        }
    };
    var onPlay = function () {
        instruments.forEach(function (i) { return i.kill(); });
        onBpmChange(getBpm(eBpm.value));
        appChing.tick = 0;
        appChing.idxPattern = 0;
        appChing.playing = true;
        appChing.tickStart = window.performance.now();
        eStop.removeAttribute('disabled');
        ePlay.setAttribute('disabled', 1);
        quietNoise.connect(gainMaster);
        if (appChing.analyser) {
            gainMaster.connect(analyser);
        }
        onTick();
    };
    var onStop = function () {
        appChing.playing = false;
        if (appChing.currentTimeout) {
            window.clearTimeout(appChing.currentTimeout);
            appChing.currentTimeout = null;
        }
        eStop.setAttribute('disabled', 1);
        ePlay.removeAttribute('disabled');
        document.getElementById("play-delay").removeAttribute('disabled');
        quietNoise.disconnect();
    };
    var chup0 = function () { doChingClose(); appChing.currentTimeout = window.setTimeout(chup1, 200); };
    var chup1 = function () { doChingClose(); appChing.currentTimeout = window.setTimeout(chup2, 3000); };
    var chup2 = function () {
        doChingOpen();
        appChing.currentTimeout = window.setTimeout(onPlay, appChing.tickPeriod * 4);
    };
    ePlay.addEventListener("click", onPlay);
    document.getElementById("play-delay").addEventListener("click", function (e) {
        onStop();
        ePlay.setAttribute('disabled', 1);
        eStop.removeAttribute('disabled');
        chup0();
    });
    eStop.addEventListener("click", onStop);
    eBpm.addEventListener("change", function (e) {
        onBpmChange(getBpm(e.target.value));
        // re-calculate next tick time after bpm change
        if (appChing.playing && appChing.currentTimeout) {
            window.clearTimeout(appChing.currentTimeout);
            appChing.currentTimeout = window.setTimeout(onTick, (appChing.tickStart + appChing.tickPeriod * appChing.tick) - window.performance.now());
        }
    });
    eAnalyserOn.addEventListener("click", function (e) {
        appChing.analyser = true;
        eAnalyserOn.setAttribute('disabled', 1);
        eAnalyserOff.removeAttribute('disabled');
        gainMaster.connect(analyser);
        window.requestAnimationFrame(function (time) { return analyserDraw(time, analyser, eAnalyser.getContext('2d')); });
    });
    eAnalyserOff.addEventListener("click", function (e) {
        appChing.analyser = false;
        eAnalyserOff.setAttribute('disabled', 1);
        eAnalyserOn.removeAttribute('disabled');
        gainMaster.disconnect(analyser);
    });
    document.getElementById("play-ching-closed").addEventListener("click", function (e) { return doChingClose(); });
    document.getElementById("play-ching-open").addEventListener("click", function (e) { return doChingOpen(); });
    document.getElementById("play-drum-0").addEventListener("click", function (e) { return drums[0].noteOn(); });
    document.getElementById("play-drum-1").addEventListener("click", function (e) { return drums[1].noteOn(); });
    document.getElementById("play-drum-2").addEventListener("click", function (e) { return drums[2].noteOn(); });
    document.getElementById("play-drum-3").addEventListener("click", function (e) { return drums[3].noteOn(); });
    [['vol-glong', gainGlong],
        ['vol-ching', gainChing]
    ].forEach(function (_a) {
        var ctlId = _a[0], gainCtl = _a[1];
        return handleSliderUpdate(document.getElementById(ctlId), function (alpha) {
            gainCtl.gain.cancelScheduledValues(audioCtx.currentTime);
            // max volume is 5, allowing distortion
            gainCtl.gain.setTargetAtTime(Math.pow(alpha, 5) * 5.0, audioCtx.currentTime, 0.2);
        });
    });
    handleSliderUpdate(document.getElementById('tune-glong'), function (alpha) {
        var val = -1000 + alpha * 2000.0;
        if (tuneGlong) {
            tuneGlong.offset.cancelScheduledValues(audioCtx.currentTime);
            tuneGlong.offset.setTargetAtTime(val, audioCtx.currentTime, 0.01);
        }
        else {
            drums.forEach(function (i) { return i.nodes[0].osc.detune.setTargetAtTime(val, audioCtx.currentTime, 0.01); });
        }
    });
}
document.addEventListener("DOMContentLoaded", function (e) {
    var ePlay = document.getElementById("play");
    var eStop = document.getElementById("stop");
    var eBpm = document.getElementById("bpm");
    appChing.eBpmJing = document.getElementById("bpm-jing");
    // iPad needs to have its audio triggered from a user event. Run setup on any button, then re-trigger the
    // original click event.
    var setupFunc = function (e) {
        if (!appChing.setup) {
            appChing.setup = true;
            setup(ePlay, eStop, eBpm, document.getElementById("analyser"), document.getElementById("analyser-on"), document.getElementById("analyser-off"));
            e.target.click();
        }
        e.target.removeEventListener("click", setupFunc);
    };
    Array.from(document.getElementsByTagName("button")).forEach(function (ctl) { return ctl.addEventListener("click", setupFunc); });
    eStop.setAttribute('disabled', 1);
    var funcBpmMod = function (e) {
        if (e.target.dataset.set) {
            appChing.bpm = Number(e.target.dataset.set);
        }
        else if (e.target.dataset.scale) {
            appChing.bpm *= Number(e.target.dataset.scale);
        }
        else {
            appChing.bpm += Number(e.target.dataset.increment);
        }
        eBpm.value = appChing.bpm;
        onBpmChange(appChing.bpm);
    };
    Array.from(document.getElementsByClassName("bpm-mod")).forEach(function (e) { return e.addEventListener("click", funcBpmMod); });
    onBpmChange(getBpm(eBpm.value));
    var ePatternDrum = document.getElementById("pattern-drum");
    ePatternDrum.addEventListener("change", function (e) { return onDrumPatternChange(e.target.value); });
    [
        ["pattern-none", ""],
        ["pattern-lao", pleyngDahmLao],
        ["pattern-khmen", pleyngDahmKhmen],
        ["pattern-omdeuk", pleyngKhmenOmDteuk],
        ["pattern-saiyork", pleyngKhmenSaiYork],
        ["pattern-porttisut", pleyngKhmenPortTiSut],
        ["pattern-jorakaehangyaow", pleyngJorakaeHangYaow],
        ["pattern-gabber", patternGabber]
    ].forEach(function (_a) {
        var id = _a[0], pattern = _a[1];
        document.getElementById(id).addEventListener("click", function (e) {
            ePatternDrum.value = pattern;
            onDrumPatternChange(ePatternDrum.value);
        });
    });
    onDrumPatternChange(ePatternDrum.value);
});
