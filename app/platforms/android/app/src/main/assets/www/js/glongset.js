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
System.register(["./instrument.js", "./shaper.js", "./lib/assert.js", "./lib/rand.js"], function (exports_1, context_1) {
    "use strict";
    var instrument_js_1, shaper_js_1, assert_js_1, rand_js_1, GlongSet, GlongSetSynthesized, GlongSetSampled;
    var __moduleName = context_1 && context_1.id;
    return {
        setters: [
            function (instrument_js_1_1) {
                instrument_js_1 = instrument_js_1_1;
            },
            function (shaper_js_1_1) {
                shaper_js_1 = shaper_js_1_1;
            },
            function (assert_js_1_1) {
                assert_js_1 = assert_js_1_1;
            },
            function (rand_js_1_1) {
                rand_js_1 = rand_js_1_1;
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
            GlongSet = class GlongSet {
                async init() { }
                chup(time, gain) {
                    this.chupGet().noteOn(time, gain);
                    this.chingGet().kill(time);
                }
                ching(time, gain) {
                    this.chingGet().noteOn(time, gain);
                }
                glong(time, gain, idx) {
                    assert_js_1.assert(idx >= 0);
                    if (idx < this.glongs().length) {
                        // tbd: encode mutually exclusive instruments in data
                        switch (idx) {
                            case 1:
                                if (this.glongs().length > 2)
                                    this.glongs()[2].kill(0);
                                break;
                            case 2:
                                if (this.glongs().length > 1)
                                    this.glongs()[1].kill(0);
                                break;
                        }
                        this.glongs()[idx].noteOn(time, gain);
                    }
                }
                instruments() {
                    return [this.chingGet(), this.chupGet()].concat(this.glongs());
                }
                kill() {
                    for (let i of this.instruments())
                        i.kill(0);
                }
                detune(val) {
                    for (let i of this.glongs())
                        i.detune(val);
                }
            };
            exports_1("GlongSet", GlongSet);
            GlongSetSynthesized = class GlongSetSynthesized extends GlongSet {
                constructor(ctx) {
                    super();
                    this.ctx = ctx;
                    const chingFreq = 3200.0;
                    const chingFreq1 = 2900.0;
                    const closeFreq = 5400.0;
                    const chingGain = 0.1; // gain must be low to avoid triggering the waveshaper during sustain
                    const chingHarmonic = (freq, gain, release) => new instrument_js_1.InstrumentNodeFmExp(ctx, 'sine', freq, gain * 25, 0.0, 0.0, 0.02, gain, release);
                    this._ching = new instrument_js_1.InstrumentComposite([
                        chingHarmonic(chingFreq, chingGain * 1, 0.8),
                        chingHarmonic(chingFreq * 0.9985, chingGain * 0.25, 0.8),
                        chingHarmonic(chingFreq1, chingGain * 0.5, 0.7),
                        chingHarmonic(chingFreq1 * 0.9985, chingGain * 0.125, 0.7),
                        chingHarmonic(chingFreq * 2.586, chingGain * 0.5, 0.4),
                        chingHarmonic(chingFreq * 2.586 * 0.9985, chingGain * 0.125, 0.4),
                        chingHarmonic(chingFreq1 * 2.586, chingGain * 0.25, 0.3),
                        chingHarmonic(chingFreq1 * 2.586 * 0.9985, chingGain * 0.0625, 0.3),
                    ]);
                    this._chup = new instrument_js_1.InstrumentFm([
                        new instrument_js_1.InstrumentNodeFmLin(ctx, 'sine', closeFreq, 3, 0.0, 0.046, 0, 0.0),
                        new instrument_js_1.InstrumentNodeFmLin(ctx, 'square', closeFreq / 31, 10000, 0.00036, 0.370, 0, 0.0),
                        new instrument_js_1.InstrumentNodeFmLin(ctx, 'square', closeFreq / 31, 10000, 0.00036, 0.370, 0, 0.0)
                    ]);
                    this.distortionChup = shaper_js_1.makeShaper(ctx, [this._chup], [], 1, 1, 1, '4x', 100);
                    const distortionOpen = shaper_js_1.makeShaper(ctx, [this._ching], [], 1, 1, 1, '4x', 100);
                    this.gainChing = ctx.createGain();
                    this.gainChing.gain.value = 4;
                    distortionOpen.connect(this.gainChing);
                    this.drums = [
                        new instrument_js_1.InstrumentDrumFm(ctx, instrument_js_1.ParamsInstrumentDrumFm.make({ freqStart: 250, freqEnd: 78, decay: 0.5, attack: 0.04 })),
                        new instrument_js_1.InstrumentDrumFm(ctx, instrument_js_1.ParamsInstrumentDrumFm.make({ freqStart: 300, freqEnd: 216, decay: 0.210, attack: 0.02, freqDecay: 0.035 })),
                        new instrument_js_1.InstrumentDrumFm(ctx, instrument_js_1.ParamsInstrumentDrumFm.make({ gain: 0.50, freqStart: 155, freqEnd: 120, decay: 0.05, attack: 0.0, magStrike: 2000 })),
                        new instrument_js_1.InstrumentDrumFm(ctx, instrument_js_1.ParamsInstrumentDrumFm.make({ freqStart: 470, freqEnd: 456, decay: 0.05, attack: 0.02, magStrike: 250 })),
                        new instrument_js_1.InstrumentDrumGabber(ctx, instrument_js_1.ParamsInstrumentDrumFm.make({ gain: 3, freqStart: 200, freqEnd: 38, decay: 0.625, attack: 0.04, magFreqVary: 0.25, magStrike: 250 }), 2),
                        new instrument_js_1.InstrumentDrumGabber(ctx, instrument_js_1.ParamsInstrumentDrumFm.make({ gain: 3, freqStart: 200, freqEnd: 38, decay: 0.5, attack: 0.04, magFreqVary: 0.25, magStrike: 250 }), 10),
                        new instrument_js_1.InstrumentDrumGabber(ctx, instrument_js_1.ParamsInstrumentDrumFm.make({ gain: 3, freqStart: 200, freqEnd: 38, decay: 0.5, attack: 0.04, magFreqVary: 0.25, magStrike: 250 }), 3000)
                    ];
                }
                chingGet() { return this._ching; }
                chupGet() { return this._chup; }
                glongs() { return this.drums; }
                ching(time, gain) {
                    super.ching(time, gain);
                    // Once the open ching has finished decaying from the distortion phase, it must begin its release.
                    this.chingGet().noteOff((time || this.ctx.currentTime) + 0.1);
                }
                connect(gainChing, gainGlong) {
                    for (let i of [this.distortionChup, this.gainChing])
                        i.connect(gainChing);
                    for (let i of this.drums)
                        i.connect(gainGlong);
                }
                disconnect() {
                    for (let i of [this.distortionChup, this.gainChing])
                        i.disconnect();
                    for (let i of this.drums)
                        i.disconnect();
                }
            };
            exports_1("GlongSetSynthesized", GlongSetSynthesized);
            GlongSetSampled = class GlongSetSampled extends GlongSet {
                constructor(ctx, chups, chings, glongs, chupGain = 1.0, chingGain = 1.0, glongGain = 1.0) {
                    super();
                    this.valsRnd = [];
                    this.rand = new rand_js_1.RandLcg();
                    this.ctx = ctx;
                    this._ching = new instrument_js_1.InstrumentSample(ctx);
                    this._chup = new instrument_js_1.InstrumentSample(ctx);
                    this.chups = chups;
                    this.chings = chings;
                    this._glongs = glongs.map(_ => new instrument_js_1.InstrumentSample(ctx));
                    this.smpsGlong = glongs;
                    this._chup.gain.gain.value = chupGain;
                    this._ching.gain.gain.value = chingGain;
                    for (let g of this._glongs)
                        g.gain.gain.value = glongGain;
                }
                samples() {
                    return this.chups.concat(this.chings).concat(this.smpsGlong.reduce((a, b) => a.concat(b)));
                }
                async init() {
                    for (let p of this.samples().map(s => s.load(this.ctx)))
                        await p;
                }
                chingGet() { return this._ching; }
                chupGet() { return this._chup; }
                glongs() { return this._glongs; }
                sampleRandom(smps) {
                    return smps[this.rand.irand(0, smps.length)];
                }
                chup(time, gain) {
                    this._chup.sample = this.sampleRandom(this.chups);
                    super.chup(time, gain);
                }
                ching(time, gain) {
                    this._ching.sample = this.sampleRandom(this.chings);
                    super.ching(time, gain);
                }
                glong(time, gain, idx) {
                    assert_js_1.assert(idx >= 0);
                    if (idx < this._glongs.length) {
                        this._glongs[idx].sample = this.sampleRandom(this.smpsGlong[idx]);
                        super.glong(time, gain, idx);
                    }
                }
                connect(gainChing, gainGlong) {
                    this.chingGet().connect(gainChing);
                    this.chupGet().connect(gainChing);
                    for (let g of this.glongs())
                        g.connect(gainGlong);
                }
                disconnect() {
                    this.chingGet().disconnect();
                    this.chupGet().disconnect();
                    for (let g of this.glongs())
                        g.disconnect();
                }
            };
            exports_1("GlongSetSampled", GlongSetSampled);
        }
    };
});
