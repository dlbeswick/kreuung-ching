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

const patternGabber="023231010xx1515234x26231";

const pleyngDahmLao=
			"0x1x3x1x1xxx0x1x \n" +
			"0x1x3x1x1xxx0x1x \n" +
			"0x1x3x1x1xxx0x1x \n" +
			"0x1x3x131xxx0x1x \n" +
			"\n"                  +
			"0x1x3x1x1xxx0x1x \n" +
			"0x1x3x1x1xxx0x1x \n" +
			"0x1x3x1x1xxx0x1x \n" +
			"0x1x3x131x010x1x \n" ;

const pleyngDahmKhmen=
			"0xx23x1x0x1x01x2 \n" +
			"3xx23x2x3x2x3x1x \n" +
			"0xx23x1x0x1x01x2 \n" +
			"3xx232323x123101 \n" +
			"\n"                  +
			"0xx23x110x1x01x2 \n" +
			"3xx2323232323x11 \n" +
			"0xx23x11023101x2 \n" +
			"3xxxx23232323101 \n" ;
			
const pleyngJorakaeHangYaow="# จระเข้หางยาว\n\
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
"

const pleyngKhmenPortTiSut="# เขมรโพธิสัตว์ no intro\n\
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
"

const pleyngKhmenOmDteuk="# เขมรอมตึ๊ก ท่อน ๑\n" +
		"# https://www.youtube.com/watch?v=cv5B4roT0Bo\n" +
		"xxxxxxxx \n"+	
	  "xxxxxxxx xx1101x2\n"+
	  "3xx23x2x 3x2x3x1x\n"+
	  "0xx23x1x 0x1x01x2\n"+
	  "3xx23232 3x123101\n"+
	  "0xx23x11 023101x2\n"+
	  "3xx23232 32323x11\n"+
	  "0xx23x11 023101x2\n"+
	  "\n" +
	  "3xxxx232 32323101\n"+
	  "0xx23101 023101x2\n"+
	  "3xx23232 32323101\n"+
	  "0xx23101 023101x2\n"+
	  "3xx23232 3x123x11\n"+
	  "0xx23x11 023101x2\n"+
	  "3xx23232 32323101\n"+
	  "02323101 023101x2\n"+
	  "\n" +
	  "3xx23232 32323101\n"+
		"0xx23x11 023101x2\n"+
	  "3xx23232 33123101\n"+
	  "0xx23x1x 023101x2\n"+
	  "3xx23232 3x123311\n"+
	  "0xx23x11 023101x2\n"+
	  "3xx23232 32323101\n"+
	  "0xx23x11 023101x2\n"+
	  "3xx23232 32323101\n"+
	  "0xx23101 023101x2\n"+
	  "3xx23232 32323101\n"+
	  "02323101 023102x3\n"+
	  "3xx23232 32323101\n"+
	  "\n" +
	  "0xx23101 023101x2\n"+
	  "3xx23232 32323101\n"+
	  "0xx23101 023101x2\n"+
	  "3xx23232 3x123x11\n"+
	  "0xx23x11 023101x2\n"+
	  "3xx23232 32323101\n"+
	  "02323101 023101x2\n"+
	  "3xx23232 32323101\n"+
	  "\n" +
	  "0xx23101 023101x2\n"+
	  "3xx23232 32323101\n"+
	  "0xx23101 023101x2\n"+
	  "3xx23232 3x123x11\n"+
	  "0xx23x11 023101x2\n"+
	  "3xx23232 32323101\n"+
	  "02323101 023101x2\n"+
	  "3xx23232 32323101\n"+
	  "\n" +
	  "0xx23x11 023101x2\n"+
	  "3xx23232 33123101\n"+
	  "0xx23x1x 023101x2\n"+
	  "3xx23232 3x123311\n"+
	  "0xx23x11 023101x2\n"+
	  "3xx23232 32323101\n"+
	  "0xx23x11 023101x2\n"+
	  "3xx23232 32323101\n"+
	  "0xx23101 023101x2\n"+
	  "3xx23232 32323101\n"+
	  "\n" +
	  "END\n"+
	  "02323101 023102x3\n"+
	  "xxxxxxxx xxxxxxxx\n"+
	  "\n";

const pleyngKhmenSaiYork="\
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
"

window.onerror = (message, source, lineno, colno, error) => {
  alert(message);
  document.getElementById("error").style.display = "block";
  document.getElementById("error").innerHTML = message + "<br/>" + "Line: " + lineno + "<br/>" + source;
  return true;
}

function makeInstrument(audioCtx, nodes) {
  return {
		nodes: nodes,
		noteOn: (gain=1) => {
			nodes.forEach((n) => n.noteOn(audioCtx.currentTime, gain) );
		},
		noteOff: () => {
			nodes.forEach((n) => n.noteOff(audioCtx.currentTime));
		},
		kill: () => {
			nodes.forEach((n) => n.kill(audioCtx.currentTime));
		},
		connect: (node) => { throw "unimplemented" }
  }
}

function makeFmInstrument(audioCtx, fmNodes, connections=null) {
  if (!connections) {
		for (let i = 0; i < fmNodes.length - 1; ++i) {
			fmNodes[i + 1].output.connect(fmNodes[i].osc.frequency);
		}
  } else {
		connections.forEach(c => fmNodes[c[0]].output.connect(fmNodes[c[1]].osc.frequency))
  }

  return Object.assign(
		makeInstrument(audioCtx, fmNodes),
		{
			connect: (node) => {
				fmNodes[0].output.connect(node);
			},
			disconnect: () => {
				fmNodes[0].output.disconnect();
			}
		}
  )
}

function makeFmNode(audioCtx, type, freq, gGain, tAttack, tDecay, gSustain, tRelease) {
  const gain = audioCtx.createGain();
  gain.gain.value = 0;

  // 2018-12-31: iPad doesn't support node constructors
  const osc = audioCtx.createOscillator()
  osc.type = type;
  osc.frequency.value = freq;
  osc.connect(gain);
  osc.start();
  
  return {
		osc: osc,
		output: gain,
		noteOn: (time, gainNoteOn=1) => {
			gain.gain.cancelScheduledValues(time);
			const startTime = time
			gain.gain.linearRampToValueAtTime(0, startTime);
			gain.gain.linearRampToValueAtTime(gGain * gainNoteOn, startTime + tAttack);
			gain.gain.linearRampToValueAtTime(gSustain * gainNoteOn, startTime + tAttack + tDecay);
		},
		noteOff: (time) => {
			gain.gain.cancelScheduledValues(time);
			gain.gain.linearRampToValueAtTime(0, time + tRelease);
		},
		kill: (time) => {
			gain.gain.linearRampToValueAtTime(0, time + 0.0001);
		}
  }
}

function makeDrum(audioCtx, params) {
  const p = Object.assign(
		{
			freqStart: 225,
			freqEnd: 80,
			decay: 0.7,
			freqDecay: 0.07,
			attack: 0.1,
			type:'sine',
			gain:1,
			magStrike:50,
			freqVary:2.5,
			magFreqVary:2.5
		},
		params
  )
  
  const carrier = makeFmNode(audioCtx, p.type, p.freqEnd, p.gain, p.attack, p.decay, 0, 0.0);
  const freqStrike = p.freqStart/2
  const striker = makeFmNode(audioCtx, 'square', freqStrike, p.magStrike, 0.0036, 0.05, 1, 0.0)
  const result = makeFmInstrument(
		audioCtx,
		[
			carrier,
			// Give some 'wobble' to the drum
			makeFmNode(audioCtx, 'sine', p.freqVary, p.magFreqVary, 0.036, p.decay*2, 1, 0.0),
			striker,
		],
		[[1,0],[2,0]]
  );

  const superNoteOn = carrier.noteOn;
  carrier.noteOn = (time, gainNoteOn=1) => {
		carrier.osc.frequency.setValueAtTime(p.freqStart, time);
		carrier.osc.frequency.exponentialRampToValueAtTime(p.freqEnd, time + p.freqDecay);
		superNoteOn(time, gainNoteOn);
  }

  return result;
}

function makeGabber(audioCtx, params) {
  const gain = audioCtx.createGain();
  gain.gain.value = params.gain || 1;
  
  const overdrive = params.overdrive || 2;
  params.gain = overdrive;
  
  const drum = makeDrum(audioCtx, params);
  const shaper = makeShaper(audioCtx, 5, 1, 1, '1x');
  
  const filter = audioCtx.createBiquadFilter();
  filter.type = 'highpass';
  filter.frequency.value = 10;

  drum.connect(shaper);
  shaper.connect(filter);
  filter.connect(gain);

  const drumOut = drum.nodes[0];
  const drumGain = drum.nodes[0].output.gain;
  
  drum.connect = node => gain.connect(node);
  drum.disconnect = () => gain.disconnect();

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
function makeShaper(audioCtx, factorA=1, factorB=1, shift=1, oversample='4x') {
  const result = audioCtx.createWaveShaper();
  const curve = new Float32Array(44100);
  for (let i=0; i < 44100; ++i) {
		const x = i/44100.0;
		const valA = -1.0 / (1.0 + Math.exp(shift - x * factorA))
		const valB = -1.0 / (1.0 + Math.exp(shift - x * factorB))
		curve[i] = valA + (valB - valA) * Math.pow(x,2)
  }
  result.curve = curve;
  result.oversample = oversample;
  return result
}

const appChing = {
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
}

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

function handleSliderUpdate(ctl, onChange) {
  const min = 0
  const max = 100
  const changeFunc = () => onChange((Number(ctl.value) - min) / (max - min))
  ctl.addEventListener("input", changeFunc)
  changeFunc()
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
	
  const eHong = document.getElementById("hong")
  const chingFreq = 2500.0
  const closeFreq = 5400.0
  
  const AudioContext = window.AudioContext || window.webkitAudioContext;
  const audioCtx = new AudioContext();
  
  const gainMaster = audioCtx.createGain();
  gainMaster.gain.value = 0.5;
  gainMaster.connect(audioCtx.destination);
  
  const chingOpen = makeFmInstrument(
		audioCtx,
		[
			makeFmNode(audioCtx, 'sine', chingFreq, 1, 0.0, 1.6, 0, 0.0),
			makeFmNode(audioCtx, 'square', chingFreq * 1.2, 200, 0.00036, 1.670, 0, 0.0),
			makeFmNode(audioCtx, 'square', closeFreq, 10000, 0.00036, 0.026, 0, 0.0)
		]
  )

  const chingClosed = makeFmInstrument(
		audioCtx,
		[
			makeFmNode(audioCtx, 'sine', closeFreq, 3, 0.0, 0.046, 0, 0.0),
			makeFmNode(audioCtx, 'square', closeFreq / 31, 10000, 0.00036, 0.370, 0, 0.0),
			makeFmNode(audioCtx, 'square', closeFreq / 31, 10000, 0.00036, 0.370, 0, 0.0)
		]
  )

  const drums = [
		makeDrum(audioCtx, {freqStart: 250, freqEnd: 78, decay: 0.5, attack: 0.04}),
		makeDrum(audioCtx, {freqStart: 300, freqEnd: 216, decay: 0.210, attack: 0.02, freqDecay: 0.035}),
		makeDrum(audioCtx, {gain: 0.45, freqStart: 335, freqEnd: 320, decay: 0.05, attack: 0.0, magStrike: 1000}),
		makeDrum(audioCtx, {freqStart: 470, freqEnd: 456, decay: 0.05, attack: 0.02, magStrike: 250}),
		makeGabber(audioCtx,
							 {gain: 3, overdrive: 2, freqStart: 200, freqEnd: 38, decay: 0.625, attack: 0.04, magFreqVary:0.25,
								magStrike: 250}),
		makeGabber(audioCtx,
							 {gain: 3, overdrive: 10, freqStart: 200, freqEnd: 38, decay: 0.5, attack: 0.04, magFreqVary:0.25,
								magStrike: 250}),
		makeGabber(audioCtx,
							 {gain: 3, overdrive: 30, freqStart: 200, freqEnd: 38, decay: 0.5, attack: 0.04, magFreqVary:0.25,
								magStrike: 250}),
  ]

  const instruments = Array.prototype.concat([chingOpen, chingClosed], drums)

  const gainGlong = audioCtx.createGain();
  drums.forEach(i => i.connect(gainGlong));
  gainGlong.connect(gainMaster);

	const tuneGlong = (() => {
		try {
			let node = audioCtx.createConstantSource();
			node.offset.value = 0;
			node.start();
			drums.forEach(i => node.connect(i.nodes[0].osc.detune));
			return node;
		} catch(e) {
			// iOS doesn't have ConstantSourceNode
			return null;
		}
	})();
  
  const gainChing = audioCtx.createGain();
  gainChing.connect(gainMaster);
  
  const distortion = makeShaper(audioCtx, 10, 10, 5);

  const filter = audioCtx.createBiquadFilter();
  filter.type = 'highpass';
  filter.frequency.value = 1500;
  filter.connect(gainChing);

  distortion.connect(filter);

  chingOpen.connect(distortion);
  chingClosed.connect(distortion);

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
  
  const doChingOpen = (e) => {
		chingClosed.noteOn(0.15);
		chingOpen.noteOn();
  }
  const doChingClose = (e) => {
		chingClosed.noteOn();
		chingOpen.noteOff();
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
				drums[drumNum].noteOn();
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
		instruments.forEach(i => i.kill());
		
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

  document.getElementById("play-ching-closed").addEventListener("click", e => doChingClose() );
  document.getElementById("play-ching-open").addEventListener("click", e => doChingOpen() );
  document.getElementById("play-drum-0").addEventListener("click", e => drums[0].noteOn() );
  document.getElementById("play-drum-1").addEventListener("click", e => drums[1].noteOn() );
  document.getElementById("play-drum-2").addEventListener("click", e => drums[2].noteOn() );
  document.getElementById("play-drum-3").addEventListener("click", e => drums[3].noteOn() );

  [['vol-glong', gainGlong],
   ['vol-ching', gainChing]
  ].forEach(
	 ([ctlId, gainCtl]) => handleSliderUpdate(
	   document.getElementById(ctlId),
	   alpha => {
		   gainCtl.gain.cancelScheduledValues(audioCtx.currentTime);
		   // max volume is 5, allowing distortion
		   gainCtl.gain.setTargetAtTime(Math.pow(alpha, 5) * 5.0, audioCtx.currentTime, 0.2)
	   }
	 )
  )

	handleSliderUpdate(
	  document.getElementById('tune-glong'),
	  alpha => {
			const val = -1000 + alpha * 2000.0;
			if (tuneGlong) {	
				tuneGlong.offset.cancelScheduledValues(audioCtx.currentTime);
				tuneGlong.offset.setTargetAtTime(val, audioCtx.currentTime, 0.01)
			}
			else {
				drums.forEach(i => i.nodes[0].osc.detune.setTargetAtTime(val, audioCtx.currentTime, 0.01));
			}
		}
	)
}

document.addEventListener("DOMContentLoaded", e => {
  var ePlay = document.getElementById("play")
  var eStop = document.getElementById("stop")
  var eBpm = document.getElementById("bpm")
  appChing.eBpmJing = document.getElementById("bpm-jing")
  
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
  
  Array.from(document.getElementsByTagName("button")).forEach(ctl => ctl.addEventListener("click", setupFunc))
  
  eStop.setAttribute('disabled',1);

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
  
  Array.from(document.getElementsByClassName("bpm-mod")).forEach((e) => e.addEventListener("click", funcBpmMod));

  onBpmChange(getBpm(eBpm.value));

  const ePatternDrum = document.getElementById("pattern-drum");
  ePatternDrum.addEventListener("change", e => onDrumPatternChange(e.target.value));

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
