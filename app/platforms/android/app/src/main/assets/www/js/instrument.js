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
System.register(["./shaper.js", "./lib/assert.js"], function (exports_1, context_1) {
    "use strict";
    var shaper_js_1, assert_js_1, Instrument, InstrumentOutput, InstrumentSynced, InstrumentComposite, InstrumentNodeFm, InstrumentNodeFmLin, InstrumentNodeFmExp, InstrumentFm, ParamsInstrumentDrumFm, InstrumentDrumFm, InstrumentDrumGabber, Sample, InstrumentSample;
    var __moduleName = context_1 && context_1.id;
    return {
        setters: [
            function (shaper_js_1_1) {
                shaper_js_1 = shaper_js_1_1;
            },
            function (assert_js_1_1) {
                assert_js_1 = assert_js_1_1;
            }
        ],
        execute: function () {/*
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
            Instrument = class Instrument {
            };
            exports_1("Instrument", Instrument);
            // An instrument with a designated output node
            InstrumentOutput = class InstrumentOutput extends Instrument {
                connect(node) {
                    this.output().connect(node);
                }
                disconnect() {
                    this.output().disconnect();
                }
            };
            exports_1("InstrumentOutput", InstrumentOutput);
            InstrumentSynced = class InstrumentSynced extends Instrument {
                noteOn(time, gain = 1) {
                    for (let i of this.instruments())
                        i.noteOn(time, gain);
                }
                noteOff(time) {
                    for (let i of this.instruments())
                        i.noteOff(time);
                }
                kill(time) {
                    for (let i of this.instruments())
                        i.kill(time);
                }
            };
            exports_1("InstrumentSynced", InstrumentSynced);
            // An instrument made up of a number of other instruments that are triggered in concert.
            InstrumentComposite = class InstrumentComposite extends InstrumentSynced {
                constructor(instruments) {
                    super();
                    this._instruments = instruments;
                }
                instruments() { return this._instruments; }
                connect(node) {
                    for (let i of this.instruments())
                        i.connect(node);
                }
                disconnect() {
                    for (let i of this.instruments())
                        i.disconnect();
                }
                detune(val) {
                    for (let i of this.instruments())
                        i.detune(val);
                }
            };
            exports_1("InstrumentComposite", InstrumentComposite);
            InstrumentNodeFm = class InstrumentNodeFm extends InstrumentOutput {
                constructor(audioCtx, type, freq, gain) {
                    super();
                    this.ctx = audioCtx;
                    this.nodeGain = audioCtx.createGain();
                    this.nodeGain.gain.value = 0;
                    // 2018-12-31: iPad doesn't support node constructors, so use "create" functions.
                    this.osc = audioCtx.createOscillator();
                    this.osc.type = type;
                    this.osc.frequency.value = freq;
                    this.osc.connect(this.nodeGain);
                    this.osc.start();
                }
                output() { return this.nodeGain; }
                detune(val) {
                    this.osc.detune.setTargetAtTime(val, 0, 0.01);
                }
            };
            exports_1("InstrumentNodeFm", InstrumentNodeFm);
            InstrumentNodeFmLin = class InstrumentNodeFmLin extends InstrumentNodeFm {
                constructor(audioCtx, type, freq, gain, tAttack, tDecay, gSustain, tRelease) {
                    super(audioCtx, type, freq, gain);
                    this.tAttack = tAttack;
                    this.gSustain = gSustain;
                    this.tDecay = tDecay;
                    this.tRelease = tRelease;
                    this.gain = gain;
                }
                noteOn(time, gainNoteOn = 1) {
                    const startTime = time || this.ctx.currentTime;
                    this.nodeGain.gain.cancelScheduledValues(startTime);
                    if (this.tAttack) {
                        this.nodeGain.gain.setValueAtTime(0, startTime);
                        this.nodeGain.gain.linearRampToValueAtTime(this.gain * gainNoteOn, startTime + this.tAttack);
                    }
                    else {
                        this.nodeGain.gain.setValueAtTime(this.gain * gainNoteOn, startTime);
                    }
                    this.nodeGain.gain.linearRampToValueAtTime(this.gSustain * gainNoteOn, startTime + this.tAttack + this.tDecay);
                }
                noteOff(time) {
                    this.nodeGain.gain.cancelScheduledValues(time);
                    this.nodeGain.gain.linearRampToValueAtTime(0, time + this.tRelease);
                }
                kill(time) {
                    this.nodeGain.gain.linearRampToValueAtTime(0, time + 0.0001);
                }
            };
            exports_1("InstrumentNodeFmLin", InstrumentNodeFmLin);
            // FM instrument with exponential volume envelope
            InstrumentNodeFmExp = class InstrumentNodeFmExp extends InstrumentNodeFm {
                constructor(audioCtx, type, freq, gain, tAttack, cAttack, cDecay, gSustain, cRelease) {
                    super(audioCtx, type, freq, gain);
                    this.cAttack = cAttack;
                    this.tAttack = tAttack;
                    this.gSustain = gSustain;
                    this.cDecay = cDecay;
                    this.cRelease = cRelease;
                    this.gain = gain;
                }
                output() { return this.nodeGain; }
                noteOn(time, gainNoteOn = 1) {
                    const startTime = time || this.ctx.currentTime;
                    this.nodeGain.gain.cancelScheduledValues(startTime);
                    if (this.tAttack) {
                        this.nodeGain.gain.setValueAtTime(0, startTime);
                        this.nodeGain.gain.setTargetAtTime(this.gain * gainNoteOn, startTime, this.cAttack);
                    }
                    else {
                        this.nodeGain.gain.setValueAtTime(this.gain * gainNoteOn, startTime);
                    }
                    this.nodeGain.gain.setTargetAtTime(this.gSustain * gainNoteOn, startTime + this.tAttack, this.cDecay);
                }
                noteOff(time) {
                    this.nodeGain.gain.cancelScheduledValues(time);
                    this.nodeGain.gain.setTargetAtTime(0, time, this.cRelease);
                }
                kill(time) {
                    this.nodeGain.gain.linearRampToValueAtTime(0, time + 0.0001);
                }
            };
            exports_1("InstrumentNodeFmExp", InstrumentNodeFmExp);
            InstrumentFm = class InstrumentFm extends InstrumentSynced {
                constructor(fmNodes, connections, gain = 1) {
                    super();
                    assert_js_1.assert(fmNodes.length);
                    this.fmNodes = fmNodes;
                    if (!connections) {
                        for (let i = 0; i < fmNodes.length - 1; ++i) {
                            fmNodes[i + 1].connect(fmNodes[i].osc.frequency);
                        }
                    }
                    else {
                        connections.forEach(c => fmNodes[c[0]].connect(fmNodes[c[1]].osc.frequency));
                    }
                }
                instruments() { return this.fmNodes; }
                connect(node) {
                    this.fmNodes[0].connect(node);
                }
                disconnect() {
                    this.fmNodes[0].disconnect();
                }
                detune(val) {
                    this.fmNodes[0].detune(val);
                }
            };
            exports_1("InstrumentFm", InstrumentFm);
            ParamsInstrumentDrumFm = class ParamsInstrumentDrumFm {
                constructor() {
                    this.freqStart = 225;
                    this.freqEnd = 80;
                    this.decay = 0.7;
                    this.freqDecay = 0.07;
                    this.attack = 0.1;
                    this.type = 'sine';
                    this.gain = 1;
                    this.magStrike = 50;
                }
                static make(params) {
                    return { ...new ParamsInstrumentDrumFm(), ...params };
                }
            };
            exports_1("ParamsInstrumentDrumFm", ParamsInstrumentDrumFm);
            InstrumentDrumFm = class InstrumentDrumFm extends InstrumentFm {
                constructor(audioCtx, params) {
                    const carrier = new InstrumentNodeFmLin(audioCtx, params.type, params.freqEnd, params.gain, params.attack, params.decay, 0, 0.0);
                    const freqStrike = params.freqStart / 2;
                    const striker = new InstrumentNodeFmLin(audioCtx, 'square', freqStrike, params.magStrike, 0.0036, 0.05, 1, 0.0);
                    const nodes = [carrier];
                    if (params.freqVary) {
                        nodes.push(new InstrumentNodeFmLin(audioCtx, 'sine', params.freqVary, params.magFreqVary, 0.036, params.decay * 2, 1, 0.0));
                    }
                    nodes.push(striker);
                    super(nodes, (() => { if (params.freqVary)
                        return [[1, 0], [2, 0]];
                    else
                        return undefined; })());
                    this.ctx = audioCtx;
                    this.carrier = carrier;
                    this.params = params;
                }
                noteOn(time, gain) {
                    time = time || this.ctx.currentTime;
                    this.carrier.osc.frequency.setValueAtTime(this.params.freqStart, time);
                    this.carrier.osc.frequency.exponentialRampToValueAtTime(this.params.freqEnd, time + this.params.freqDecay);
                    super.noteOn(time, gain);
                }
            };
            exports_1("InstrumentDrumFm", InstrumentDrumFm);
            InstrumentDrumGabber = class InstrumentDrumGabber extends InstrumentOutput {
                constructor(audioCtx, params, overdrive = 2) {
                    super();
                    this.gain = audioCtx.createGain();
                    this.gain.gain.value = params.gain;
                    this.drum = new InstrumentDrumFm(audioCtx, { ...params, gain: overdrive });
                    const shaper = shaper_js_1.makeShaper(audioCtx, [this.drum], [], 1, 1, 1, '1x', 50);
                    shaper.connect(this.gain);
                }
                noteOn(time, gain) {
                    this.drum.noteOn(time, gain);
                }
                noteOff(time) {
                    this.drum.noteOff(time);
                }
                kill(time) {
                    this.drum.kill(time);
                }
                output() {
                    return this.gain;
                }
                detune(val) {
                    this.drum.detune(val);
                }
            };
            exports_1("InstrumentDrumGabber", InstrumentDrumGabber);
            Sample = class Sample {
                constructor(url, cordova) {
                    this.cordova = cordova;
                    this.url = url;
                }
                data() {
                    assert_js_1.assert(this._data, "load not called");
                    return this._data;
                }
                async loadBrowser(url) {
                    const response = await fetch(url);
                    const reader = response.body.getReader();
                    let result = new Uint8Array();
                    while (true) {
                        let srr = await reader.read();
                        if (srr.done)
                            break;
                        else {
                            const next = new Uint8Array(result.length + srr.value.length);
                            next.set(result, 0);
                            next.set(srr.value, result.length);
                            result = next;
                        }
                    }
                    if (!response.ok) {
                        console.debug(this._data);
                        throw "Error getting sample at '" + response.url + "': " + response.status;
                    }
                    else {
                        return result.buffer;
                    }
                }
                load(ctx) {
                    let url;
                    let methodFetch;
                    if (this.cordova.platformId == 'browser') {
                        url = "data/" + this.url;
                        methodFetch = this.loadBrowser(url);
                    }
                    else {
                        url = this.cordova.file.applicationDirectory + "www/data/" + this.url;
                        methodFetch = new Promise((resolve, reject) => {
                            window.resolveLocalFileSystemURL(url, resolve, e => reject(['resolveLocalFileSystemURL', e]));
                        }).then(fileEntry => new Promise((resolve, reject) => {
                            fileEntry.file(resolve, reject);
                        })).then(file => new Promise((resolve, reject) => {
                            var reader = new FileReader();
                            reader.onload = (evt) => resolve(reader.result);
                            reader.onerror = e => reject(['readAsArrayBuffer', e]);
                            reader.readAsArrayBuffer(file);
                        }));
                    }
                    return methodFetch.then(buffer => new Promise((resolve, reject) => {
                        ctx.decodeAudioData(buffer, resolve, e => reject(['decodeAudioData', e]));
                    })).then(data => {
                        this._data = data;
                    }).catch(e => {
                        throw "Error getting sample at '" + url + "': " + JSON.stringify(e);
                    });
                }
            };
            exports_1("Sample", Sample);
            InstrumentSample = class InstrumentSample extends InstrumentOutput {
                constructor(ctx, sample) {
                    super();
                    this._detune = 0.0;
                    this.ctx = ctx;
                    this.sample = sample;
                    this.gain = this.ctx.createGain();
                }
                output() { return this.gain; }
                noteOn(time, gain) {
                    if (this.sample) {
                        if (this.node)
                            this.node.disconnect();
                        this.node = this.ctx.createBufferSource();
                        this.node.buffer = this.sample.data();
                        this.node.detune.value = this._detune;
                        this.node.connect(this.gain);
                        this.gain.gain.value = gain;
                        this.node.start(time);
                    }
                }
                noteOff(time) {
                    if (this.node) {
                        this.node.stop(time);
                    }
                }
                kill(time) {
                    this.noteOff(time);
                }
                detune(val) {
                    this._detune = val;
                }
            };
            exports_1("InstrumentSample", InstrumentSample);
        }
    };
});
