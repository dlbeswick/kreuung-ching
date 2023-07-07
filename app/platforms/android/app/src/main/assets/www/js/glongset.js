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
        execute: function () {
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZ2xvbmdzZXQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi90cy9nbG9uZ3NldC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7Ozs7Ozs7Ozs7Ozs7Ozs7OztFQW1CRTs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O1lBVUYsV0FBQSxNQUFzQixRQUFRO2dCQUs1QixLQUFLLENBQUMsSUFBSSxLQUFJLENBQUM7Z0JBRWYsSUFBSSxDQUFDLElBQVksRUFBRSxJQUFZO29CQUM3QixJQUFJLENBQUMsT0FBTyxFQUFFLENBQUMsTUFBTSxDQUFDLElBQUksRUFBRSxJQUFJLENBQUMsQ0FBQTtvQkFDakMsSUFBSSxDQUFDLFFBQVEsRUFBRSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQTtnQkFDNUIsQ0FBQztnQkFDRCxLQUFLLENBQUMsSUFBWSxFQUFFLElBQVk7b0JBQzlCLElBQUksQ0FBQyxRQUFRLEVBQUUsQ0FBQyxNQUFNLENBQUMsSUFBSSxFQUFFLElBQUksQ0FBQyxDQUFBO2dCQUNwQyxDQUFDO2dCQUNELEtBQUssQ0FBQyxJQUFZLEVBQUUsSUFBWSxFQUFFLEdBQVc7b0JBQzNDLGtCQUFNLENBQUMsR0FBRyxJQUFJLENBQUMsQ0FBQyxDQUFBO29CQUNoQixJQUFJLEdBQUcsR0FBRyxJQUFJLENBQUMsTUFBTSxFQUFFLENBQUMsTUFBTSxFQUFFO3dCQUM5QixxREFBcUQ7d0JBQ3JELFFBQVEsR0FBRyxFQUFFOzRCQUNYLEtBQUssQ0FBQztnQ0FDSixJQUFJLElBQUksQ0FBQyxNQUFNLEVBQUUsQ0FBQyxNQUFNLEdBQUcsQ0FBQztvQ0FDMUIsSUFBSSxDQUFDLE1BQU0sRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQTtnQ0FDMUIsTUFBSzs0QkFDUCxLQUFLLENBQUM7Z0NBQ0osSUFBSSxJQUFJLENBQUMsTUFBTSxFQUFFLENBQUMsTUFBTSxHQUFHLENBQUM7b0NBQzFCLElBQUksQ0FBQyxNQUFNLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUE7Z0NBQzFCLE1BQUs7eUJBQ1I7d0JBRUQsSUFBSSxDQUFDLE1BQU0sRUFBRSxDQUFDLEdBQUcsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxJQUFJLEVBQUUsSUFBSSxDQUFDLENBQUE7cUJBQ3RDO2dCQUNILENBQUM7Z0JBRUQsV0FBVztvQkFDVCxPQUFPLENBQUMsSUFBSSxDQUFDLFFBQVEsRUFBRSxFQUFFLElBQUksQ0FBQyxPQUFPLEVBQUUsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsTUFBTSxFQUFFLENBQUMsQ0FBQTtnQkFDaEUsQ0FBQztnQkFJRCxJQUFJO29CQUNGLEtBQUssSUFBSSxDQUFDLElBQUksSUFBSSxDQUFDLFdBQVcsRUFBRTt3QkFDOUIsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQTtnQkFDYixDQUFDO2dCQUNELE1BQU0sQ0FBQyxHQUFXO29CQUNoQixLQUFLLElBQUksQ0FBQyxJQUFJLElBQUksQ0FBQyxNQUFNLEVBQUU7d0JBQ3pCLENBQUMsQ0FBQyxNQUFNLENBQUMsR0FBRyxDQUFDLENBQUE7Z0JBQ2pCLENBQUM7YUFDRixDQUFBOztZQUVELHNCQUFBLE1BQWEsbUJBQW9CLFNBQVEsUUFBUTtnQkFPL0MsWUFBcUIsR0FBaUI7b0JBQ3BDLEtBQUssRUFBRSxDQUFBO29CQURZLFFBQUcsR0FBSCxHQUFHLENBQWM7b0JBR3BDLElBQUksQ0FBQyxHQUFHLEdBQUcsR0FBRyxDQUFBO29CQUVkLE1BQU0sU0FBUyxHQUFHLE1BQU0sQ0FBQTtvQkFDeEIsTUFBTSxVQUFVLEdBQUcsTUFBTSxDQUFBO29CQUN6QixNQUFNLFNBQVMsR0FBRyxNQUFNLENBQUE7b0JBQ3hCLE1BQU0sU0FBUyxHQUFHLEdBQUcsQ0FBQSxDQUFDLHFFQUFxRTtvQkFFM0YsTUFBTSxhQUFhLEdBQUcsQ0FBQyxJQUFZLEVBQUUsSUFBWSxFQUFFLE9BQWUsRUFBRSxFQUFFLENBQ3BFLElBQUksbUNBQW1CLENBQUMsR0FBRyxFQUFFLE1BQU0sRUFBRSxJQUFJLEVBQUUsSUFBSSxHQUFDLEVBQUUsRUFBRSxHQUFHLEVBQUUsR0FBRyxFQUFFLElBQUksRUFBRSxJQUFJLEVBQUUsT0FBTyxDQUFDLENBQUE7b0JBRXBGLElBQUksQ0FBQyxNQUFNLEdBQUcsSUFBSSxtQ0FBbUIsQ0FDbkM7d0JBQ0UsYUFBYSxDQUFDLFNBQVMsRUFBRSxTQUFTLEdBQUMsQ0FBQyxFQUFFLEdBQUcsQ0FBQzt3QkFDMUMsYUFBYSxDQUFDLFNBQVMsR0FBQyxNQUFNLEVBQUUsU0FBUyxHQUFDLElBQUksRUFBRSxHQUFHLENBQUM7d0JBQ3BELGFBQWEsQ0FBQyxVQUFVLEVBQUUsU0FBUyxHQUFDLEdBQUcsRUFBRSxHQUFHLENBQUM7d0JBQzdDLGFBQWEsQ0FBQyxVQUFVLEdBQUMsTUFBTSxFQUFFLFNBQVMsR0FBQyxLQUFLLEVBQUUsR0FBRyxDQUFDO3dCQUN0RCxhQUFhLENBQUMsU0FBUyxHQUFDLEtBQUssRUFBRSxTQUFTLEdBQUMsR0FBRyxFQUFFLEdBQUcsQ0FBQzt3QkFDbEQsYUFBYSxDQUFDLFNBQVMsR0FBQyxLQUFLLEdBQUMsTUFBTSxFQUFFLFNBQVMsR0FBQyxLQUFLLEVBQUUsR0FBRyxDQUFDO3dCQUMzRCxhQUFhLENBQUMsVUFBVSxHQUFDLEtBQUssRUFBRSxTQUFTLEdBQUMsSUFBSSxFQUFFLEdBQUcsQ0FBQzt3QkFDcEQsYUFBYSxDQUFDLFVBQVUsR0FBQyxLQUFLLEdBQUMsTUFBTSxFQUFFLFNBQVMsR0FBQyxNQUFNLEVBQUUsR0FBRyxDQUFDO3FCQUM5RCxDQUNGLENBQUE7b0JBRUQsSUFBSSxDQUFDLEtBQUssR0FBRyxJQUFJLDRCQUFZLENBQUM7d0JBQzVCLElBQUksbUNBQW1CLENBQUMsR0FBRyxFQUFFLE1BQU0sRUFBRSxTQUFTLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxLQUFLLEVBQUUsQ0FBQyxFQUFFLEdBQUcsQ0FBQzt3QkFDdEUsSUFBSSxtQ0FBbUIsQ0FBQyxHQUFHLEVBQUUsUUFBUSxFQUFF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QUUsQ0FBQTtvQkFDM0IsS0FBSyxJQUFJLENBQUMsSUFBSSxJQUFJLENBQUMsTUFBTSxFQUFFO3dCQUFFLENBQUMsQ0FBQyxVQUFVLEVBQUUsQ0FBQTtnQkFDN0MsQ0FBQzthQUNGLENBQUEiLCJzb3VyY2VzQ29udGVudCI6WyIvKlxuXHTguYDguITguKPguLfguYjguK3guIfguInguLTguYjguIcgLyBLcmV1dW5nIENoaW5nXG4gIFRoaXMgZmlsZSBpcyBwYXJ0IG9mIHRoZSBBdXRvbWF0aWMgQ2hpbmcgcHJvZ3JhbSBmb3IgcHJhY3RpY2luZ1xuICBUaGFpIG11c2ljLlxuICBcbiAgQ29weXJpZ2h0IChDKSAyMDE5IERhdmlkIEJlc3dpY2sgPGRsYmVzd2lja0BnbWFpbC5jb20+XG5cbiAgVGhpcyBwcm9ncmFtIGlzIGZyZWUgc29mdHdhcmU6IHlvdSBjYW4gcmVkaXN0cmlidXRlIGl0IGFuZC9vciBtb2RpZnlcbiAgaXQgdW5kZXIgdGhlIHRlcm1zIG9mIHRoZSBHTlUgQWZmZXJvIEdlbmVyYWwgUHVibGljIExpY2Vuc2UgYXNcbiAgcHVibGlzaGVkIGJ5IHRoZSBGcmVlIFNvZnR3YXJlIEZvdW5kYXRpb24sIGVpdGhlciB2ZXJzaW9uIDMgb2YgdGhlXG4gIExpY2Vuc2UsIG9yIChhdCB5b3VyIG9wdGlvbikgYW55IGxhdGVyIHZlcnNpb24uXG5cbiAgVGhpcyBwcm9ncmFtIGlzIGRpc3RyaWJ1dGVkIGluIHRoZSBob3BlIHRoYXQgaXQgd2lsbCBiZSB1c2VmdWwsXG4gIGJ1dCBXSVRIT1VUIEFOWSBXQVJSQU5UWTsgd2l0aG91dCBldmVuIHRoZSBpbXBsaWVkIHdhcnJhbnR5IG9mXG4gIE1FUkNIQU5UQUJJTElUWSBvciBGSVRORVNTIEZPUiBBIFBBUlRJQ1VMQVIgUFVSUE9TRS4gIFNlZSB0aGVcbiAgR05VIEFmZmVybyBHZW5lcmFsIFB1YmxpYyBMaWNlbnNlIGZvciBtb3JlIGRldGFpbHMuXG5cbiAgWW91IHNob3VsZCBoYXZlIHJlY2VpdmVkIGEgY29weSBvZiB0aGUgR05VIEFmZmVybyBHZW5lcmFsIFB1YmxpYyBMaWNlbnNlXG4gIGFsb25nIHdpdGggdGhpcyBwcm9ncmFtLiAgSWYgbm90LCBzZWUgPGh0dHBzOi8vd3d3LmdudS5vcmcvbGljZW5zZXMvPi5cbiovXG5cbmltcG9ydCB7XG4gIEluc3RydW1lbnQsIEluc3RydW1lbnRDb21wb3NpdGUsSW5zdHJ1bWVudERydW1GbSwgSW5zdHJ1bWVudERydW1HYWJiZXIsIEluc3RydW1lbnRGbSxcbiAgSW5zdHJ1bWVudE5vZGVGbUV4cCwgSW5zdHJ1bWVudE5vZGVGbUxpbiwgSW5zdHJ1bWVudFNhbXBsZSwgUGFyYW1zSW5zdHJ1bWVudERydW1GbSwgU2FtcGxlXG59IGZyb20gXCIuL2luc3RydW1lbnQuanNcIjtcbmltcG9ydCB7IG1ha2VTaGFwZXIgfSBmcm9tIFwiLi9zaGFwZXIuanNcIjtcbmltcG9ydCB7IGFzc2VydCB9IGZyb20gXCIuL2xpYi9hc3NlcnQuanNcIjtcbmltcG9ydCB7IFJhbmRMY2cgfSBmcm9tIFwiLi9saWIvcmFuZC5qc1wiO1xuXG5leHBvcnQgYWJzdHJhY3QgY2xhc3MgR2xvbmdTZXQge1xuICBhYnN0cmFjdCBjaGluZ0dldCgpOiBJbnN0cnVtZW50XG4gIGFic3RyYWN0IGNodXBHZXQoKTogSW5zdHJ1bWVudFxuICBhYnN0cmFjdCBnbG9uZ3MoKTogSW5zdHJ1bWVudFtdXG5cbiAgYXN5bmMgaW5pdCgpIHt9XG4gIFxuICBjaHVwKHRpbWU6IG51bWJlciwgZ2FpbjogbnVtYmVyKTogdm9pZCB7XG4gICAgdGhpcy5jaHVwR2V0KCkubm90ZU9uKHRpbWUsIGdhaW4pXG4gICAgdGhpcy5jaGluZ0dldCgpLmtpbGwodGltZSlcbiAgfVxuICBjaGluZyh0aW1lOiBudW1iZXIsIGdhaW46IG51bWJlcik6IHZvaWQge1xuICAgIHRoaXMuY2hpbmdHZXQoKS5ub3RlT24odGltZSwgZ2FpbilcbiAgfVxuICBnbG9uZyh0aW1lOiBudW1iZXIsIGdhaW46IG51bWJlciwgaWR4OiBudW1iZXIpOiB2b2lkIHtcbiAgICBhc3NlcnQoaWR4ID49IDApXG4gICAgaWYgKGlkeCA8IHRoaXMuZ2xvbmdzKCkubGVuZ3RoKSB7XG4gICAgICAvLyB0YmQ6IGVuY29kZSBtdXR1YWxseSBleGNsdXNpdmUgaW5zdHJ1bWVudHMgaW4gZGF0YVxuICAgICAgc3dpdGNoIChpZHgpIHtcbiAgICAgICAgY2FzZSAxOlxuICAgICAgICAgIGlmICh0aGlzLmdsb25ncygpLmxlbmd0aCA+IDIpXG4gICAgICAgICAgICB0aGlzLmdsb25ncygpWzJdLmtpbGwoMClcbiAgICAgICAgICBicmVha1xuICAgICAgICBjYXNlIDI6XG4gICAgICAgICAgaWYgKHRoaXMuZ2xvbmdzKCkubGVuZ3RoID4gMSlcbiAgICAgICAgICAgIHRoaXMuZ2xvbmdzKClbMV0ua2lsbCgwKVxuICAgICAgICAgIGJyZWFrXG4gICAgICB9XG4gICAgICBcbiAgICAgIHRoaXMuZ2xvbmdzKClbaWR4XS5ub3RlT24odGltZSwgZ2FpbilcbiAgICB9XG4gIH1cblxuICBpbnN0cnVtZW50cygpOiBJbnN0cnVtZW50W10ge1xuICAgIHJldHVybiBbdGhpcy5jaGluZ0dldCgpLCB0aGlzLmNodXBHZXQoKV0uY29uY2F0KHRoaXMuZ2xvbmdzKCkpXG4gIH1cblxuICBhYnN0cmFjdCBjb25uZWN0KGdhaW5DaGluZzogQXVkaW9Ob2RlLCBnYWluR2xvbmc6IEF1ZGlvTm9kZSk6IHZvaWRcbiAgYWJzdHJhY3QgZGlzY29ubmVjdCgpOiB2b2lkXG4gIGtpbGwoKSB7XG4gICAgZm9yIChsZXQgaSBvZiB0aGlzLmluc3RydW1lbnRzKCkpXG4gICAgICBpLmtpbGwoMClcbiAgfVxuICBkZXR1bmUodmFsOiBudW1iZXIpIHtcbiAgICBmb3IgKGxldCBpIG9mIHRoaXMuZ2xvbmdzKCkpXG4gICAgICBpLmRldHVuZSh2YWwpXG4gIH1cbn1cblxuZXhwb3J0IGNsYXNzIEdsb25nU2V0U3ludGhlc2l6ZWQgZXh0ZW5kcyBHbG9uZ1NldCB7XG4gIF9jaGluZzogSW5zdHJ1bWVudFxuICBfY2h1cDogSW5zdHJ1bWVudFxuICBkaXN0b3J0aW9uQ2h1cDogQXVkaW9Ob2RlXG4gIGdhaW5DaGluZzogR2Fpbk5vZGVcbiAgZHJ1bXM6IEluc3RydW1lbnRbXVxuICBcbiAgY29uc3RydWN0b3IocmVhZG9ubHkgY3R4OiBBdWRpb0NvbnRleHQpIHtcbiAgICBzdXBlcigpXG5cbiAgICB0aGlzLmN0eCA9IGN0eFxuICAgIFxuICAgIGNvbnN0IGNoaW5nRnJlcSA9IDMyMDAuMFxuICAgIGNvbnN0IGNoaW5nRnJlcTEgPSAyOTAwLjBcbiAgICBjb25zdCBjbG9zZUZyZXEgPSA1NDAwLjBcbiAgICBjb25zdCBjaGluZ0dhaW4gPSAwLjEgLy8gZ2FpbiBtdXN0IGJlIGxvdyB0byBhdm9pZCB0cmlnZ2VyaW5nIHRoZSB3YXZlc2hhcGVyIGR1cmluZyBzdXN0YWluXG4gICAgXG4gICAgY29uc3QgY2hpbmdIYXJtb25pYyA9IChmcmVxOiBudW1iZXIsIGdhaW46IG51bWJlciwgcmVsZWFzZTogbnVtYmVyKSA9PlxuICAgICAgbmV3IEluc3RydW1lbnROb2RlRm1FeHAoY3R4LCAnc2luZScsIGZyZXEsIGdhaW4qMjUsIDAuMCwgMC4wLCAwLjAyLCBnYWluLCByZWxlYXNlKVxuICAgIFxuICAgIHRoaXMuX2NoaW5nID0gbmV3IEluc3RydW1lbnRDb21wb3NpdGUoXG4gICAgICBbXG4gICAgICAgIGNoaW5nSGFybW9uaWMoY2hpbmdGcmVxLCBjaGluZ0dhaW4qMSwgMC44KSxcbiAgICAgICAgY2hpbmdIYXJtb25pYyhjaGluZ0ZyZXEqMC45OTg1LCBjaGluZ0dhaW4qMC4yNSwgMC44KSxcbiAgICAgICAgY2hpbmdIYXJtb25pYyhjaGluZ0ZyZXExLCBjaGluZ0dhaW4qMC41LCAwLjcpLFxuICAgICAgICBjaGluZ0hhcm1vbmljKGNoaW5nRnJlcTEqMC45OTg1LCBjaGluZ0dhaW4qMC4xMjUsIDAuNyksXG4gICAgICAgIGNoaW5nSGFybW9uaWMoY2hpbmdGcmVxKjIuNTg2LCBjaGluZ0dhaW4qMC41LCAwLjQpLFxuICAgICAgICBjaGluZ0hhcm1vbmljKGNoaW5nRnJlcSoyLjU4NiowLjk5ODUsIGNoaW5nR2FpbiowLjEyNSwgMC40KSxcbiAgICAgICAgY2hpbmdIYXJtb25pYyhjaGluZ0ZyZXExKjIuNTg2LCBjaGluZ0dhaW4qMC4yNSwgMC4zKSxcbiAgICAgICAgY2hpbmdIYXJtb25pYyhjaGluZ0ZyZXExKjIuNTg2KjAuOTk4NSwgY2hpbmdHYWluKjAuMDYyNSwgMC4zKSxcbiAgICAgIF1cbiAgICApXG4gICAgXG4gICAgdGhpcy5fY2h1cCA9IG5ldyBJbnN0cnVtZW50Rm0oW1xuICAgICAgbmV3IEluc3RydW1lbnROb2RlRm1MaW4oY3R4LCAnc2luZScsIGNsb3NlRnJlcSwgMywgMC4wLCAwLjA0NiwgMCwgMC4wKSxcbiAgICAgIG5ldyBJbnN0cnVtZW50Tm9kZUZtTGluKGN0eCwgJ3NxdWFyZScsIGNsb3NlRnJlcSAvIDMxLCAxMDAwMCwgMC4wMDAzNiwgMC4zNzAsIDAsIDAuMCksXG4gICAgICBuZXcgSW5zdHJ1bWVudE5vZGVGbUxpbihjdHgsICdzcXVhcmUnLCBjbG9zZUZyZXEgLyAzMSwgMTAwMDAsIDAuMDAwMzYsIDAuMzcwLCAwLCAwLjApXG4gICAgXSlcblxuICAgIHRoaXMuZGlzdG9ydGlvbkNodXAgPSBtYWtlU2hhcGVyKGN0eCwgW3RoaXMuX2NodXBdLCBbXSwgMSwgMSwgMSwgJzR4JywgMTAwKVxuICAgIFxuICAgIGNvbnN0IGRpc3RvcnRpb25PcGVuID0gbWFrZVNoYXBlcihjdHgsIFt0aGlzLl9jaGluZ10sIFtdLCAxLCAxLCAxLCAnNHgnLCAxMDApXG4gICAgXG4gICAgdGhpcy5nYWluQ2hpbmcgPSBjdHguY3JlYXRlR2FpbigpXG4gICAgdGhpcy5nYWluQ2hpbmcuZ2Fpbi52YWx1ZSA9IDRcbiAgICBkaXN0b3J0aW9uT3Blbi5jb25uZWN0KHRoaXMuZ2FpbkNoaW5nKVxuICAgIFxuICAgIHRoaXMuZHJ1bXMgPSBbXG4gICAgICBuZXcgSW5zdHJ1bWVudERydW1GbShcbiAgICAgICAgY3R4LFxuICAgICAgICBQYXJhbXNJbnN0cnVtZW50RHJ1bUZtLm1ha2UoXG4gICAgICAgICAge2ZyZXFTdGFydDogMjUwLCBmcmVxRW5kOiA3OCwgZGVjYXk6IDAuNSwgYXR0YWNrOiAwLjA0fVxuICAgICAgICApXG4gICAgICApLFxuICAgICAgbmV3IEluc3RydW1lbnREcnVtRm0oXG4gICAgICAgIGN0eCxcbiAgICAgICAgUGFyYW1zSW5zdHJ1bWVudERydW1GbS5tYWtlKFxuICAgICAgICAgIHtmcmVxU3RhcnQ6IDMwMCwgZnJlcUVuZDogMjE2LCBkZWNheTogMC4yMTAsIGF0dGFjazogMC4wMiwgZnJlcURlY2F5OiAwLjAzNX1cbiAgICAgICAgKVxuICAgICAgKSxcbiAgICAgIG5ldyBJbnN0cnVtZW50RHJ1bUZtKFxuICAgICAgICBjdHgsXG4gICAgICAgIFBhcmFtc0luc3RydW1lbnREcnVtRm0ubWFrZShcbiAgICAgICAgICB7Z2FpbjogMC41MCwgZnJlcVN0YXJ0OiAxNTUsIGZyZXFFbmQ6IDEyMCwgZGVjYXk6IDAuMDUsIGF0dGFjazogMC4wLCBtYWdTdHJpa2U6IDIwMDB9XG4gICAgICAgIClcbiAgICAgICksXG4gICAgICBuZXcgSW5zdHJ1bWVudERydW1GbShcbiAgICAgICAgY3R4LFxuICAgICAgICBQYXJhbXNJbnN0cnVtZW50RHJ1bUZtLm1ha2UoXG4gICAgICAgICAge2ZyZXFTdGFydDogNDcwLCBmcmVxRW5kOiA0NTYsIGRlY2F5OiAwLjA1LCBhdHRhY2s6IDAuMDIsIG1hZ1N0cmlrZTogMjUwfVxuICAgICAgICApXG4gICAgICApLFxuICAgICAgbmV3IEluc3RydW1lbnREcnVtR2FiYmVyKFxuICAgICAgICBjdHgsXG4gICAgICAgIFBhcmFtc0luc3RydW1lbnREcnVtRm0ubWFrZShcbiAgICAgICAgICB7Z2FpbjogMywgZnJlcVN0YXJ0OiAyMDAsIGZyZXFFbmQ6IDM4LCBkZWNheTogMC42MjUsIGF0dGFjazogMC4wNCwgbWFnRnJlcVZhcnk6MC4yNSwgbWFnU3RyaWtlOiAyNTB9XG4gICAgICAgICksXG4gICAgICAgIDJcbiAgICAgICksXG4gICAgICBuZXcgSW5zdHJ1bWVudERydW1HYWJiZXIoXG4gICAgICAgIGN0eCxcbiAgICAgICAgUGFyYW1zSW5zdHJ1bWVudERydW1GbS5tYWtlKFxuICAgICAgICAgIHtnYWluOiAzLCBmcmVxU3RhcnQ6IDIwMCwgZnJlcUVuZDogMzgsIGRlY2F5OiAwLjUsIGF0dGFjazogMC4wNCwgbWFnRnJlcVZhcnk6MC4yNSwgbWFnU3RyaWtlOiAyNTB9XG4gICAgICAgICksXG4gICAgICAgIDEwXG4gICAgICApLFxuICAgICAgbmV3IEluc3RydW1lbnREcnVtR2FiYmVyKFxuICAgICAgICBjdHgsXG4gICAgICAgIFBhcmFtc0luc3RydW1lbnREcnVtRm0ubWFrZShcbiAgICAgICAgICB7Z2FpbjogMywgZnJlcVN0YXJ0OiAyMDAsIGZyZXFFbmQ6IDM4LCBkZWNheTogMC41LCBhdHRhY2s6IDAuMDQsIG1hZ0ZyZXFWYXJ5OjAuMjUsIG1hZ1N0cmlrZTogMjUwfVxuICAgICAgICApLFxuICAgICAgICAzMDAwXG4gICAgICApXG4gICAgXVxuICB9XG5cbiAgY2hpbmdHZXQoKSB7IHJldHVybiB0aGlzLl9jaGluZyB9XG4gIGNodXBHZXQoKSB7IHJldHVybiB0aGlzLl9jaHVwIH1cbiAgZ2xvbmdzKCkgeyByZXR1cm4gdGhpcy5kcnVtcyB9XG5cbiAgY2hpbmcodGltZTogbnVtYmVyLCBnYWluOiBudW1iZXIpIHtcbiAgICBzdXBlci5jaGluZyh0aW1lLCBnYWluKVxuICAgIC8vIE9uY2UgdGhlIG9wZW4gY2hpbmcgaGFzIGZpbmlzaGVkIGRlY2F5aW5nIGZyb20gdGhlIGRpc3RvcnRpb24gcGhhc2UsIGl0IG11c3QgYmVnaW4gaXRzIHJlbGVhc2UuXG4gICAgdGhpcy5jaGluZ0dldCgpLm5vdGVPZmYoKHRpbWUgfHwgdGhpcy5jdHguY3VycmVudFRpbWUpICsgMC4xKVxuICB9XG4gIFxuICBjb25uZWN0KGdhaW5DaGluZzogQXVkaW9Ob2RlLCBnYWluR2xvbmc6IEF1ZGlvTm9kZSk6IHZvaWQge1xuICAgIGZvciAobGV0IGkgb2YgW3RoaXMuZGlzdG9ydGlvbkNodXAsIHRoaXMuZ2FpbkNoaW5nXSkgaS5jb25uZWN0KGdhaW5DaGluZylcbiAgICBmb3IgKGxldCBpIG9mIHRoaXMuZHJ1bXMpIGkuY29ubmVjdChnYWluR2xvbmcpXG4gIH1cblxuICBkaXNjb25uZWN0KCk6IHZvaWQge1xuICAgIGZvciAobGV0IGkgb2YgW3RoaXMuZGlzdG9ydGlvbkNodXAsIHRoaXMuZ2FpbkNoaW5nXSkgaS5kaXNjb25uZWN0KClcbiAgICBmb3IgKGxldCBpIG9mIHRoaXMuZHJ1bXMpIGkuZGlzY29ubmVjdCgpXG4gIH1cbn1cblxuZXhwb3J0IGNsYXNzIEdsb25nU2V0U2FtcGxlZCBleHRlbmRzIEdsb25nU2V0IHtcbiAgY2h1cHM6IFNhbXBsZVtdXG4gIGNoaW5nczogU2FtcGxlW11cbiAgc21wc0dsb25nOiBTYW1wbGVbXVtdXG4gIF9jaGluZzogSW5zdHJ1bWVudFNhbXBsZVxuICBfY2h1cDogSW5zdHJ1bWVudFNhbXBsZVxuICBfZ2xvbmdzOiBJbnN0cnVtZW50U2FtcGxlW11cbiAgdmFsc1JuZDogbnVtYmVyW10gPSBbXVxuICByYW5kOiBSYW5kTGNnID0gbmV3IFJhbmRMY2coKVxuICBjdHg6IEF1ZGlvQ29udGV4dFxuICBcbiAgY29uc3RydWN0b3IoY3R4OiBBdWRpb0NvbnRleHQsIGNodXBzOiBTYW1wbGVbXSwgY2hpbmdzOiBTYW1wbGVbXSwgZ2xvbmdzOiBTYW1wbGVbXVtdLCBjaHVwR2FpbjogbnVtYmVyPTEuMCxcbiAgICAgICAgICAgICAgY2hpbmdHYWluOiBudW1iZXI9MS4wLCBnbG9uZ0dhaW46IG51bWJlcj0xLjApIHtcbiAgICBzdXBlcigpXG4gICAgdGhpcy5jdHggPSBjdHhcbiAgICB0aGlzLl9jaGluZyA9IG5ldyBJbnN0cnVtZW50U2FtcGxlKGN0eClcbiAgICB0aGlzLl9jaHVwID0gbmV3IEluc3RydW1lbnRTYW1wbGUoY3R4KVxuICAgIHRoaXMuY2h1cHMgPSBjaHVwc1xuICAgIHRoaXMuY2hpbmdzID0gY2hpbmdzXG4gICAgdGhpcy5fZ2xvbmdzID0gZ2xvbmdzLm1hcChfID0+IG5ldyBJbnN0cnVtZW50U2FtcGxlKGN0eCkpXG4gICAgdGhpcy5zbXBzR2xvbmcgPSBnbG9uZ3NcblxuICAgIHRoaXMuX2NodXAuZ2Fpbi5nYWluLnZhbHVlID0gY2h1cEdhaW5cbiAgICB0aGlzLl9jaGluZy5nYWluLmdhaW4udmFsdWUgPSBjaGluZ0dhaW5cbiAgICBmb3IgKGxldCBnIG9mIHRoaXMuX2dsb25ncykgZy5nYWluLmdhaW4udmFsdWUgPSBnbG9uZ0dhaW5cbiAgfVxuXG4gIHNhbXBsZXMoKTogU2FtcGxlW10ge1xuICAgIHJldHVybiB0aGlzLmNodXBzLmNvbmNhdCh0aGlzLmNoaW5ncykuY29uY2F0KHRoaXMuc21wc0dsb25nLnJlZHVjZSgoYSxiKSA9PiBhLmNvbmNhdChiKSkpXG4gIH1cbiAgXG4gIGFzeW5jIGluaXQoKSB7XG4gICAgZm9yIChsZXQgcCBvZiB0aGlzLnNhbXBsZXMoKS5tYXAocyA9PiBzLmxvYWQodGhpcy5jdHgpKSkgYXdhaXQgcFxuICB9XG4gIFxuICBjaGluZ0dldCgpIHsgcmV0dXJuIHRoaXMuX2NoaW5nIH1cbiAgY2h1cEdldCgpIHsgcmV0dXJuIHRoaXMuX2NodXAgfVxuICBnbG9uZ3MoKSB7IHJldHVybiB0aGlzLl9nbG9uZ3MgfVxuXG4gIHByaXZhdGUgc2FtcGxlUmFuZG9tKHNtcHM6IFNhbXBsZVtdKTogU2FtcGxlIHtcbiAgICByZXR1cm4gc21wc1t0aGlzLnJhbmQuaXJhbmQoMCwgc21wcy5sZW5ndGgpXVxuICB9XG4gIFxuICBjaHVwKHRpbWU6IG51bWJlciwgZ2FpbjogbnVtYmVyKTogdm9pZCB7XG4gICAgdGhpcy5fY2h1cC5zYW1wbGUgPSB0aGlzLnNhbXBsZVJhbmRvbSh0aGlzLmNodXBzKVxuICAgIHN1cGVyLmNodXAodGltZSwgZ2FpbilcbiAgfVxuICBcbiAgY2hpbmcodGltZTogbnVtYmVyLCBnYWluOiBudW1iZXIpOiB2b2lkIHtcbiAgICB0aGlzLl9jaGluZy5zYW1wbGUgPSB0aGlzLnNhbXBsZVJhbmRvbSh0aGlzLmNoaW5ncylcbiAgICBzdXBlci5jaGluZyh0aW1lLCBnYWluKVxuICB9XG5cbiAgZ2xvbmcodGltZTogbnVtYmVyLCBnYWluOiBudW1iZXIsIGlkeDogbnVtYmVyKTogdm9pZCB7XG4gICAgYXNzZXJ0KGlkeCA+PSAwKVxuICAgIGlmIChpZHggPCB0aGlzLl9nbG9uZ3MubGVuZ3RoKSB7XG4gICAgICB0aGlzLl9nbG9uZ3NbaWR4XS5zYW1wbGUgPSB0aGlzLnNhbXBsZVJhbmRvbSh0aGlzLnNtcHNHbG9uZ1tpZHhdKVxuICAgICAgc3VwZXIuZ2xvbmcodGltZSwgZ2FpbiwgaWR4KVxuICAgIH1cbiAgfVxuICBcbiAgY29ubmVjdChnYWluQ2hpbmc6IEF1ZGlvTm9kZSwgZ2Fpbkdsb25nOiBBdWRpb05vZGUpOiB2b2lkIHtcbiAgICB0aGlzLmNoaW5nR2V0KCkuY29ubmVjdChnYWluQ2hpbmcpXG4gICAgdGhpcy5jaHVwR2V0KCkuY29ubmVjdChnYWluQ2hpbmcpXG4gICAgZm9yIChsZXQgZyBvZiB0aGlzLmdsb25ncygpKSBnLmNvbm5lY3QoZ2Fpbkdsb25nKVxuICB9XG5cbiAgZGlzY29ubmVjdCgpOiB2b2lkIHtcbiAgICB0aGlzLmNoaW5nR2V0KCkuZGlzY29ubmVjdCgpXG4gICAgdGhpcy5jaHVwR2V0KCkuZGlzY29ubmVjdCgpXG4gICAgZm9yIChsZXQgZyBvZiB0aGlzLmdsb25ncygpKSBnLmRpc2Nvbm5lY3QoKVxuICB9XG59XG4iXX0=