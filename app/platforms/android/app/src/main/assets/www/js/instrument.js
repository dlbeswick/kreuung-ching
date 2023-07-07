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
        execute: function () {
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
                constructor(ctx, type, freq) {
                    super();
                    this.ctx = ctx;
                    this.nodeGain = ctx.createGain();
                    this.nodeGain.gain.value = 0;
                    // 2018-12-31: iPad doesn't support node constructors, so use "create" functions.
                    this.osc = ctx.createOscillator();
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
                    super(audioCtx, type, freq);
                    this.gain = gain;
                    this.tAttack = tAttack;
                    this.tDecay = tDecay;
                    this.gSustain = gSustain;
                    this.tRelease = tRelease;
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
                    super(audioCtx, type, freq);
                    this.tAttack = tAttack;
                    this.cAttack = cAttack;
                    this.cDecay = cDecay;
                    this.gSustain = gSustain;
                    this.cRelease = cRelease;
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
                    this.magFreqVary = 0;
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
                    const shaper = shaper_js_1.makeShaper(audioCtx, [this.drum], [], 1, 1, 1, 'none', 50);
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
                    if (!response.body)
                        throw new Error("No response body for url " + url);
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
                async load(ctx) {
                    let url;
                    url = "data/" + this.url;
                    try {
                        const buffer = await this.loadBrowser(url);
                        this._data = await ctx.decodeAudioData(buffer);
                    }
                    catch (e) {
                        throw "Error getting sample at '" + url + "': " + JSON.stringify(e);
                    }
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5zdHJ1bWVudC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uL3RzL2luc3RydW1lbnQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7RUFtQkU7Ozs7Ozs7Ozs7Ozs7OztZQUtGLGFBQUEsTUFBc0IsVUFBVTthQU8vQixDQUFBOztZQUVELDhDQUE4QztZQUM5QyxtQkFBQSxNQUFzQixnQkFBaUIsU0FBUSxVQUFVO2dCQUd2RCxPQUFPLENBQUMsSUFBMEI7b0JBQ2hDLElBQUksQ0FBQyxNQUFNLEVBQUUsQ0FBQyxPQUFPLENBQUMsSUFBVyxDQUFDLENBQUE7Z0JBQ3BDLENBQUM7Z0JBRUQsVUFBVTtvQkFDUixJQUFJLENBQUMsTUFBTSxFQUFFLENBQUMsVUFBVSxFQUFFLENBQUE7Z0JBQzVCLENBQUM7YUFDRixDQUFBOztZQUVELG1CQUFBLE1BQXNCLGdCQUFpQixTQUFRLFVBQVU7Z0JBR3ZELE1BQU0sQ0FBQyxJQUFZLEVBQUUsSUFBSSxHQUFDLENBQUM7b0JBQ3pCLEtBQUssSUFBSSxDQUFDLElBQUksSUFBSSxDQUFDLFdBQVcsRUFBRTt3QkFBRSxDQUFDLENBQUMsTUFBTSxDQUFDLElBQUksRUFBRSxJQUFJLENBQUMsQ0FBQTtnQkFDeEQsQ0FBQztnQkFFRCxPQUFPLENBQUMsSUFBWTtvQkFDbEIsS0FBSyxJQUFJLENBQUMsSUFBSSxJQUFJLENBQUMsV0FBVyxFQUFFO3dCQUFFLENBQUMsQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLENBQUE7Z0JBQ25ELENBQUM7Z0JBRUQsSUFBSSxDQUFDLElBQVk7b0JBQ2YsS0FBSyxJQUFJLENBQUMsSUFBSSxJQUFJLENBQUMsV0FBVyxFQUFFO3dCQUFFLENBQUMsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUE7Z0JBQ2hELENBQUM7YUFDRixDQUFBOztZQUVELHdGQUF3RjtZQUN4RixzQkFBQSxNQUFhLG1CQUFvQixTQUFRLGdCQUFnQjtnQkFHdkQs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QkFDckMsSUFBSSxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFBO3dCQUM1QixJQUFJLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxLQUFLLEdBQUcsSUFBSSxDQUFBO3dCQUMzQixJQUFJLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsQ0FBQTtxQkFDdEI7Z0JBQ0gsQ0FBQztnQkFFRCxPQUFPLENBQUMsSUFBWTtvQkFDbEIsSUFBSSxJQUFJLENBQUMsSUFBSSxFQUFFO3dCQUNiLElBQUksQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFBO3FCQUNyQjtnQkFDSCxDQUFDO2dCQUVELElBQUksQ0FBQyxJQUFZO29CQUNmLElBQUksQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLENBQUE7Z0JBQ3BCLENBQUM7Z0JBRUQsTUFBTSxDQUFDLEdBQVc7b0JBQ2hCLElBQUksQ0FBQyxPQUFPLEdBQUcsR0FBRyxDQUFBO2dCQUNwQixDQUFDO2FBQ0YsQ0FBQSIsInNvdXJjZXNDb250ZW50IjpbIi8qXG5cdOC5gOC4hOC4o+C4t+C5iOC4reC4h+C4ieC4tOC5iOC4hyAvIEtyZXV1bmcgQ2hpbmdcbiAgVGhpcyBmaWxlIGlzIHBhcnQgb2YgdGhlIEF1dG9tYXRpYyBDaGluZyBwcm9ncmFtIGZvciBwcmFjdGljaW5nXG4gIFRoYWkgbXVzaWMuXG4gIFxuICBDb3B5cmlnaHQgKEMpIDIwMTkgRGF2aWQgQmVzd2ljayA8ZGxiZXN3aWNrQGdtYWlsLmNvbT5cblxuICBUaGlzIHByb2dyYW0gaXMgZnJlZSBzb2Z0d2FyZTogeW91IGNhbiByZWRpc3RyaWJ1dGUgaXQgYW5kL29yIG1vZGlmeVxuICBpdCB1bmRlciB0aGUgdGVybXMgb2YgdGhlIEdOVSBBZmZlcm8gR2VuZXJhbCBQdWJsaWMgTGljZW5zZSBhc1xuICBwdWJsaXNoZWQgYnkgdGhlIEZyZWUgU29mdHdhcmUgRm91bmRhdGlvbiwgZWl0aGVyIHZlcnNpb24gMyBvZiB0aGVcbiAgTGljZW5zZSwgb3IgKGF0IHlvdXIgb3B0aW9uKSBhbnkgbGF0ZXIgdmVyc2lvbi5cblxuICBUaGlzIHByb2dyYW0gaXMgZGlzdHJpYnV0ZWQgaW4gdGhlIGhvcGUgdGhhdCBpdCB3aWxsIGJlIHVzZWZ1bCxcbiAgYnV0IFdJVEhPVVQgQU5ZIFdBUlJBTlRZOyB3aXRob3V0IGV2ZW4gdGhlIGltcGxpZWQgd2FycmFudHkgb2ZcbiAgTUVSQ0hBTlRBQklMSVRZIG9yIEZJVE5FU1MgRk9SIEEgUEFSVElDVUxBUiBQVVJQT1NFLiAgU2VlIHRoZVxuICBHTlUgQWZmZXJvIEdlbmVyYWwgUHVibGljIExpY2Vuc2UgZm9yIG1vcmUgZGV0YWlscy5cblxuICBZb3Ugc2hvdWxkIGhhdmUgcmVjZWl2ZWQgYSBjb3B5IG9mIHRoZSBHTlUgQWZmZXJvIEdlbmVyYWwgUHVibGljIExpY2Vuc2VcbiAgYWxvbmcgd2l0aCB0aGlzIHByb2dyYW0uICBJZiBub3QsIHNlZSA8aHR0cHM6Ly93d3cuZ251Lm9yZy9saWNlbnNlcy8+LlxuKi9cblxuaW1wb3J0IHsgbWFrZVNoYXBlciB9IGZyb20gXCIuL3NoYXBlci5qc1wiO1xuaW1wb3J0IHsgYXNzZXJ0IH0gZnJvbSBcIi4vbGliL2Fzc2VydC5qc1wiO1xuXG5leHBvcnQgYWJzdHJhY3QgY2xhc3MgSW5zdHJ1bWVudCB7XG4gIGFic3RyYWN0IG5vdGVPbih0aW1lOiBudW1iZXIsIGdhaW46IG51bWJlcik6IHZvaWRcbiAgYWJzdHJhY3Qgbm90ZU9mZih0aW1lOiBudW1iZXIpOiB2b2lkXG4gIGFic3RyYWN0IGtpbGwodGltZTogbnVtYmVyKTogdm9pZFxuICBhYnN0cmFjdCBjb25uZWN0KG5vZGU6IEF1ZGlvTm9kZXxBdWRpb1BhcmFtKTogdm9pZFxuICBhYnN0cmFjdCBkaXNjb25uZWN0KCk6IHZvaWRcbiAgYWJzdHJhY3QgZGV0dW5lKHZhbDogbnVtYmVyKTogdm9pZFxufVxuXG4vLyBBbiBpbnN0cnVtZW50IHdpdGggYSBkZXNpZ25hdGVkIG91dHB1dCBub2RlXG5leHBvcnQgYWJzdHJhY3QgY2xhc3MgSW5zdHJ1bWVudE91dHB1dCBleHRlbmRzIEluc3RydW1lbnQge1xuICBhYnN0cmFjdCBvdXRwdXQoKTogQXVkaW9Ob2RlXG5cbiAgY29ubmVjdChub2RlOiBBdWRpb05vZGV8QXVkaW9QYXJhbSkge1xuICAgIHRoaXMub3V0cHV0KCkuY29ubmVjdChub2RlIGFzIGFueSlcbiAgfVxuICBcbiAgZGlzY29ubmVjdCgpIHtcbiAgICB0aGlzLm91dHB1dCgpLmRpc2Nvbm5lY3QoKVxuICB9XG59XG5cbmV4cG9ydCBhYnN0cmFjdCBjbGFzcyBJbnN0cnVtZW50U3luY2VkIGV4dGVuZHMgSW5zdHJ1bWVudCB7XG4gIGFic3RyYWN0IGluc3RydW1lbnRzKCk6IEluc3RydW1lbnRbXVxuICBcbiAgbm90ZU9uKHRpbWU6IG51bWJlciwgZ2Fpbj0xKSB7XG4gICAgZm9yIChsZXQgaSBvZiB0aGlzLmluc3RydW1lbnRzKCkpIGkubm90ZU9uKHRpbWUsIGdhaW4pXG4gIH1cbiAgXG4gIG5vdGVPZmYodGltZTogbnVtYmVyKSB7XG4gICAgZm9yIChsZXQgaSBvZiB0aGlzLmluc3RydW1lbnRzKCkpIGkubm90ZU9mZih0aW1lKVxuICB9XG4gIFxuICBraWxsKHRpbWU6IG51bWJlcikge1xuICAgIGZvciAobGV0IGkgb2YgdGhpcy5pbnN0cnVtZW50cygpKSBpLmtpbGwodGltZSlcbiAgfVxufVxuXG4vLyBBbiBpbnN0cnVtZW50IG1hZGUgdXAgb2YgYSBudW1iZXIgb2Ygb3RoZXIgaW5zdHJ1bWVudHMgdGhhdCBhcmUgdHJpZ2dlcmVkIGluIGNvbmNlcnQuXG5leHBvcnQgY2xhc3MgSW5zdHJ1bWVudENvbXBvc2l0ZSBleHRlbmRzIEluc3RydW1lbnRTeW5jZWQge1xuICBfaW5zdHJ1bWVudHM6IEluc3RydW1lbnRbXVxuXG4gIGNvbnN0cnVjdG9yKGluc3RydW1lbnRzOiBJbnN0cnVtZW50W10pIHtcbiAgICBzdXBlcigpXG4gICAgdGhpcy5faW5zdHJ1bWVudHMgPSBpbnN0cnVtZW50c1xuICB9XG5cbiAgaW5zdHJ1bWVudHMoKSB7IHJldHVybiB0aGlzLl9pbnN0cnVtZW50cyB9XG5cbiAgY29ubmVjdChub2RlOiBBdWRpb05vZGV8QXVkaW9QYXJhbSkge1xuICAgIGZvciAobGV0IGkgb2YgdGhpcy5pbnN0cnVtZW50cygpKSBpLmNvbm5lY3Qobm9kZSlcbiAgfVxuICBcbiAgZGlzY29ubmVjdCgpIHtcbiAgICBmb3IgKGxldCBpIG9mIHRoaXMuaW5zdHJ1bWVudHMoKSkgaS5kaXNjb25uZWN0KClcbiAgfVxuXG4gIGRldHVuZSh2YWw6IG51bWJlcikge1xuICAgIGZvciAobGV0IGkgb2YgdGhpcy5pbnN0cnVtZW50cygpKSBpLmRldHVuZSh2YWwpXG4gIH1cbn1cblxuZXhwb3J0IGFic3RyYWN0IGNsYXNzIEluc3RydW1lbnROb2RlRm0gZXh0ZW5kcyBJbnN0cnVtZW50T3V0cHV0IHtcbiAgb3NjOiBPc2NpbGxhdG9yTm9kZVxuICBub2RlR2FpbjogR2Fpbk5vZGVcbiAgXG4gIG91dHB1dCgpIHsgcmV0dXJuIHRoaXMubm9kZUdhaW4gfVxuICBcbiAgY29uc3RydWN0b3IocmVhZG9ubHkgY3R4OiBBdWRpb0NvbnRleHQsIHR5cGU6IE9zY2lsbGF0b3JUeXBlLCBmcmVxOiBudW1iZXIpIHtcbiAgICBzdXBlcigpXG4gICAgdGhpcy5ub2RlR2FpbiA9IGN0eC5jcmVhdGVHYWluKClcbiAgICB0aGlzLm5vZGVHYWluLmdhaW4udmFsdWUgPSAwXG4gICAgXG4gICAgLy8gMjAxOC0xMi0zMTogaVBhZCBkb2Vzbid0IHN1cHBvcnQgbm9kZSBjb25zdHJ1Y3RvcnMsIHNvIHVzZSBcImNyZWF0ZVwiIGZ1bmN0aW9ucy5cbiAgICB0aGlzLm9zYyA9IGN0eC5jcmVhdGVPc2NpbGxhdG9yKClcbiAgICB0aGlzLm9zYy50eXBlID0gdHlwZVxuICAgIHRoaXMub3NjLmZyZXF1ZW5jeS52YWx1ZSA9IGZyZXFcbiAgICB0aGlzLm9zYy5jb25uZWN0KHRoaXMubm9kZUdhaW4pXG4gICAgdGhpcy5vc2Muc3RhcnQoKVxuICB9XG5cbiAgZGV0dW5lKHZhbDogbnVtYmVyKSB7XG4gICAgdGhpcy5vc2MuZGV0dW5lLnNldFRhcmdldEF0VGltZSh2YWwsIDAsIDAuMDEpXG4gIH1cbn1cblxuZXhwb3J0IGNsYXNzIEluc3RydW1lbnROb2RlRm1MaW4gZXh0ZW5kcyBJbnN0cnVtZW50Tm9kZUZtIHtcblxuICBjb25zdHJ1Y3RvcihhdWRpb0N0eDogQXVkaW9Db250ZXh0LCB0eXBlOiBPc2NpbGxhdG9yVHlwZSwgZnJlcTogbnVtYmVyLCByZWFkb25seSBnYWluOiBudW1iZXIsXG4gICAgICAgICAgICAgIHJlYWRvbmx5IHRBdHRhY2s6IG51bWJlciwgcmVhZG9ubHkgdERlY2F5OiBudW1iZXIsIHJlYWRvbmx5IGdTdXN0YWluOiBudW1iZXIsXG4gICAgICAgICAgICAgIHJlYWRvbmx5IHRSZWxlYXNlOiBudW1iZXIpIHtcbiAgICBzdXBlcihhdWRpb0N0eCwgdHlwZSwgZnJlcSlcbiAgfVxuXG4gIG5vdGVPbih0aW1lOiBudW1iZXIsIGdhaW5Ob3RlT249MSkge1xuICAgIGNvbnN0IHN0YXJ0VGltZSA9IHRpbWUgfHwgdGhpcy5jdHguY3VycmVudFRpbWVcbiAgICB0aGlzLm5vZGVHYWluLmdhaW4uY2FuY2VsU2NoZWR1bGVkVmFsdWVzKHN0YXJ0VGltZSlcbiAgICBpZiAodGhpcy50QXR0YWNrKSB7XG4gICAgICB0aGlzLm5vZGVHYWluLmdhaW4uc2V0VmFsdWVBdFRpbWUoMCwgc3RhcnRUaW1lKVxuICAgICAgdGhpcy5ub2RlR2Fpbi5nYWluLmxpbmVhclJhbXBUb1ZhbHVlQXRUaW1lKHRoaXMuZ2FpbiAqIGdhaW5Ob3RlT24sIHN0YXJ0VGltZSArIHRoaXMudEF0dGFjaylcbiAgICB9IGVsc2Uge1xuICAgICAgdGhpcy5ub2RlR2Fpbi5nYWluLnNldFZhbHVlQXRUaW1lKHRoaXMuZ2FpbiAqIGdhaW5Ob3RlT24sIHN0YXJ0VGltZSlcbiAgICB9XG4gICAgdGhpcy5ub2RlR2Fpbi5nYWluLmxpbmVhclJhbXBUb1ZhbHVlQXRUaW1lKHRoaXMuZ1N1c3RhaW4gKiBnYWluTm90ZU9uLCBzdGFydFRpbWUgKyB0aGlzLnRBdHRhY2sgKyB0aGlzLnREZWNheSlcbiAgfVxuICBcbiAgbm90ZU9mZih0aW1lOiBudW1iZXIpIHtcbiAgICB0aGlzLm5vZGVHYWluLmdhaW4uY2FuY2VsU2NoZWR1bGVkVmFsdWVzKHRpbWUpXG4gICAgdGhpcy5ub2RlR2Fpbi5nYWluLmxpbmVhclJhbXBUb1ZhbHVlQXRUaW1lKDAsIHRpbWUgKyB0aGlzLnRSZWxlYXNlKVxuICB9XG4gIFxuICBraWxsKHRpbWU6IG51bWJlcikge1xuICAgIHRoaXMubm9kZUdhaW4uZ2Fpbi5saW5lYXJSYW1wVG9WYWx1ZUF0VGltZSgwLCB0aW1lICsgMC4wMDAxKVxuICB9XG59XG5cbi8vIEZNIGluc3RydW1lbnQgd2l0aCBleHBvbmVudGlhbCB2b2x1bWUgZW52ZWxvcGVcbmV4cG9ydCBjbGFzcyBJbnN0cnVtZW50Tm9kZUZtRXhwIGV4dGVuZHMgSW5zdHJ1bWVudE5vZGVGbSB7XG4gIGdhaW46IG51bWJlclxuXG4gIG91dHB1dCgpIHsgcmV0dXJuIHRoaXMubm9kZUdhaW4gfVxuICBcbiAgY29uc3RydWN0b3IoYXVkaW9DdHg6IEF1ZGlvQ29udGV4dCwgdHlwZTogT3NjaWxsYXRvclR5cGUsIGZyZXE6IG51bWJlciwgZ2FpbjogbnVtYmVyLCByZWFkb25seSB0QXR0YWNrOiBudW1iZXIsXG4gICAgICAgICAgICAgIHJlYWRvbmx5IGNBdHRhY2s6IG51bWJlciwgcmVhZG9ubHkgY0RlY2F5OiBudW1iZXIsIHJlYWRvbmx5IGdTdXN0YWluOiBudW1iZXIsXG4gICAgICAgICAgICAgIHJlYWRvbmx5IGNSZWxlYXNlOiBudW1iZXIpIHtcbiAgICBzdXBlcihhdWRpb0N0eCwgdHlwZSwgZnJlcSlcblxuICAgIHRoaXMuY0F0dGFjayA9IGNBdHRhY2tcbiAgICB0aGlzLnRBdHRhY2sgPSB0QXR0YWNrXG4gICAgdGhpcy5nU3VzdGFpbiA9IGdTdXN0YWluXG4gICAgdGhpcy5jRGVjYXkgPSBjRGVjYXlcbiAgICB0aGlzLmNSZWxlYXNlID0gY1JlbGVhc2VcbiAgICB0aGlzLmdhaW4gPSBnYWluXG4gIH1cblxuICBub3RlT24odGltZTogbnVtYmVyLCBnYWluTm90ZU9uPTEpIHtcbiAgICBjb25zdCBzdGFydFRpbWUgPSB0aW1lIHx8IHRoaXMuY3R4LmN1cnJlbnRUaW1lXG4gICAgdGhpcy5ub2RlR2Fpbi5nYWluLmNhbmNlbFNjaGVkdWxlZFZhbHVlcyhzdGFydFRpbWUpXG4gICAgaWYgKHRoaXMudEF0dGFjaykge1xuICAgICAgdGhpcy5ub2RlR2Fpbi5nYWluLnNldFZhbHVlQXRUaW1lKDAsIHN0YXJ0VGltZSlcbiAgICAgIHRoaXMubm9kZUdhaW4uZ2Fpbi5zZXRUYXJnZXRBdFRpbWUodGhpcy5nYWluICogZ2Fpbk5vdGVPbiwgc3RhcnRUaW1lLCB0aGlzLmNBdHRhY2spXG4gICAgfSBlbHNlIHtcbiAgICAgIHRoaXMubm9kZUdhaW4uZ2Fpbi5zZXRWYWx1ZUF0VGltZSh0aGlzLmdhaW4gKiBnYWluTm90ZU9uLCBzdGFydFRpbWUpXG4gICAgfVxuICAgIHRoaXMubm9kZUdhaW4uZ2Fpbi5zZXRUYXJnZXRBdFRpbWUodGhpcy5nU3VzdGFpbiAqIGdhaW5Ob3RlT24sIHN0YXJ0VGltZSArIHRoaXMudEF0dGFjaywgdGhpcy5jRGVjYXkpXG4gIH1cbiAgXG4gIG5vdGVPZmYodGltZTogbnVtYmVyKSB7XG4gICAgdGhpcy5ub2RlR2Fpbi5nYWluLmNhbmNlbFNjaGVkdWxlZFZhbHVlcyh0aW1lKVxuICAgIHRoaXMubm9kZUdhaW4uZ2Fpbi5zZXRUYXJnZXRBdFRpbWUoMCwgdGltZSwgdGhpcy5jUmVsZWFzZSlcbiAgfVxuICBcbiAga2lsbCh0aW1lOiBudW1iZXIpIHtcbiAgICB0aGlzLm5vZGVHYWluLmdhaW4ubGluZWFyUmFtcFRvVmFsdWVBdFRpbWUoMCwgdGltZSArIDAuMDAwMSlcbiAgfVxufVxuXG5leHBvcnQgY2xhc3MgSW5zdHJ1bWVudEZtIGV4dGVuZHMgSW5zdHJ1bWVudFN5bmNlZCB7XG4gIGZtTm9kZXM6IEluc3RydW1lbnROb2RlRm1bXVxuXG4gIGluc3RydW1lbnRzKCkgeyByZXR1cm4gdGhpcy5mbU5vZGVzIH1cbiAgXG4gIGNvbnN0cnVjdG9yKGZtTm9kZXM6IEluc3RydW1lbnROb2RlRm1bXSwgY29ubmVjdGlvbnM/OiBudW1iZXJbXVtdLCBnYWluPTEpIHtcbiAgICBzdXBlcigpXG4gICAgYXNzZXJ0KGZtTm9kZXMubGVuZ3RoKVxuICAgIFxuICAgIHRoaXMuZm1Ob2RlcyA9IGZtTm9kZXNcbiAgICBpZiAoIWNvbm5lY3Rpb25zKSB7XG4gICAgICBmb3IgKGxldCBpID0gMDsgaSA8IGZtTm9kZXMubGVuZ3RoIC0gMTsgKytpKSB7XG4gICAgICAgIGZtTm9kZXNbaSArIDFdLmNvbm5lY3QoZm1Ob2Rlc1tpXS5vc2MuZnJlcXVlbmN5KVxuICAgICAgfVxuICAgIH0gZWxzZSB7XG4gICAgICBjb25uZWN0aW9ucy5mb3JFYWNoKGMgPT4gZm1Ob2Rlc1tjWzBdXS5jb25uZWN0KGZtTm9kZXNbY1sxXV0ub3NjLmZyZXF1ZW5jeSkpXG4gICAgfVxuICB9XG4gIFxuICBjb25uZWN0KG5vZGU6IEF1ZGlvTm9kZXxBdWRpb1BhcmFtKSB7XG4gICAgdGhpcy5mbU5vZGVzWzBdLmNvbm5lY3Qobm9kZSlcbiAgfVxuICBcbiAgZGlzY29ubmVjdCgpIHtcbiAgICB0aGlzLmZtTm9kZXNbMF0uZGlzY29ubmVjdCgpXG4gIH1cblxuICBkZXR1bmUodmFsOiBudW1iZXIpIHtcbiAgICB0aGlzLmZtTm9kZXNbMF0uZGV0dW5lKHZhbClcbiAgfVxufVxuXG5leHBvcnQgY2xhc3MgUGFyYW1zSW5zdHJ1bWVudERydW1GbSB7XG4gIGZyZXFTdGFydD0yMjVcbiAgZnJlcUVuZD04MFxuXG4gIC8vIEdpdmVzIHNvbWUgJ3dvYmJsZScgdG8gdGhlIGRydW0gc3VzdGFpblxuICBmcmVxVmFyeT86IG51bWJlclxuICBtYWdGcmVxVmFyeSA9IDBcbiAgXG4gIGRlY2F5PTAuN1xuICBmcmVxRGVjYXk9MC4wN1xuICBhdHRhY2s9MC4xXG4gIHR5cGU6IE9zY2lsbGF0b3JUeXBlID0gJ3NpbmUnXG4gIGdhaW49MVxuICBtYWdTdHJpa2U9NTBcblxuICBzdGF0aWMgbWFrZShwYXJhbXM6IGFueSk6IFBhcmFtc0luc3RydW1lbnREcnVtRm0ge1xuICAgIHJldHVybiB7Li4ubmV3IFBhcmFtc0luc3RydW1lbnREcnVtRm0oKSwgLi4ucGFyYW1zfVxuICB9XG59XG5cbmV4cG9ydCBjbGFzcyBJbnN0cnVtZW50RHJ1bUZtIGV4dGVuZHMgSW5zdHJ1bWVudEZtIHtcbiAgY2FycmllcjogSW5zdHJ1bWVudE5vZGVGbVxuICBwYXJhbXM6IFBhcmFtc0luc3RydW1lbnREcnVtRm1cbiAgY3R4OiBBdWRpb0NvbnRleHRcbiAgXG4gIGNvbnN0cnVjdG9yKGF1ZGlvQ3R4OiBBdWRpb0NvbnRleHQsIHBhcmFtczogUGFyYW1zSW5zdHJ1bWVudERydW1GbSkge1xuICAgIGNvbnN0IGNhcnJpZXIgPSBuZXcgSW5zdHJ1bWVudE5vZGVGbUxpbihhdWRpb0N0eCwgcGFyYW1zLnR5cGUsIHBhcmFtcy5mcmVxRW5kLCBwYXJhbXMuZ2FpbixcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcGFyYW1zLmF0dGFjaywgcGFyYW1zLmRlY2F5LCAwLCAwLjApXG5cbiAgICBjb25zdCBmcmVxU3RyaWtlID0gcGFyYW1zLmZyZXFTdGFydC8yXG4gICAgY29uc3Qgc3RyaWtlciA9IG5ldyBJbnN0cnVtZW50Tm9kZUZtTGluKGF1ZGlvQ3R4LCAnc3F1YXJlJywgZnJlcVN0cmlrZSwgcGFyYW1zLm1hZ1N0cmlrZSwgMC4wMDM2LCAwLjA1LCAxLCAwLjApXG5cbiAgICBjb25zdCBub2RlcyA9IFtjYXJyaWVyXVxuICAgIGlmIChwYXJhbXMuZnJlcVZhcnkpIHtcbiAgICAgIG5vZGVzLnB1c2gobmV3IEluc3RydW1lbnROb2RlRm1MaW4oYXVkaW9DdHgsICdzaW5lJywgcGFyYW1zLmZyZXFWYXJ5LCBwYXJhbXMubWFnRnJlcVZhcnksIDAuMDM2LFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBwYXJhbXMuZGVjYXkqMiwgMSwgMC4wKSlcbiAgICB9XG4gICAgbm9kZXMucHVzaChzdHJpa2VyKVxuICAgIFxuICAgIHN1cGVyKFxuICAgICAgbm9kZXMsIFxuICAgICAgKCgpID0+IHsgaWYgKHBhcmFtcy5mcmVxVmFyeSkgcmV0dXJuIFtbMSwwXSxbMiwwXV0gOyBlbHNlIHJldHVybiB1bmRlZmluZWQgfSkoKVxuICAgIClcblxuICAgIHRoaXMuY3R4ID0gYXVkaW9DdHhcbiAgICB0aGlzLmNhcnJpZXIgPSBjYXJyaWVyXG4gICAgdGhpcy5wYXJhbXMgPSBwYXJhbXNcbiAgfVxuXG4gIG5vdGVPbih0aW1lOiBudW1iZXIsIGdhaW46IG51bWJlcikge1xuICAgIHRpbWUgPSB0aW1lIHx8IHRoaXMuY3R4LmN1cnJlbnRUaW1lXG4gICAgdGhpcy5jYXJyaWVyLm9zYy5mcmVxdWVuY3kuc2V0VmFsdWVBdFRpbWUodGhpcy5wYXJhbXMuZnJlcVN0YXJ0LCB0aW1lKVxuICAgIHRoaXMuY2Fycmllci5vc2MuZnJlcXVlbmN5LmV4cG9uZW50aWFsUmFtcFRvVmFsdWVBdFRpbWUodGhpcy5wYXJhbXMuZnJlcUVuZCwgdGltZSArIHRoaXMucGFyYW1zLmZyZXFEZWNheSlcbiAgICBzdXBlci5ub3RlT24odGltZSwgZ2FpbilcbiAgfVxufVxuXG5leHBvcnQgY2xhc3MgSW5zdHJ1bWVudERydW1HYWJiZXIgZXh0ZW5kcyBJbnN0cnVtZW50T3V0cHV0IHtcbiAgZ2FpbjogR2Fpbk5vZGVcbiAgZHJ1bTogSW5zdHJ1bWVudERydW1GbVxuICBcbiAgY29uc3RydWN0b3IoYXVkaW9DdHg6IEF1ZGlvQ29udGV4dCwgcGFyYW1zOiBQYXJhbXNJbnN0cnVtZW50RHJ1bUZtLCBvdmVyZHJpdmU9Mikge1xuICAgIHN1cGVyKClcbiAgICBcbiAgICB0aGlzLmdhaW4gPSBhdWRpb0N0eC5jcmVhdGVHYWluKClcbiAgICB0aGlzLmdhaW4uZ2Fpbi52YWx1ZSA9IHBhcmFtcy5nYWluXG5cbiAgICB0aGlzLmRydW0gPSBuZXcgSW5zdHJ1bWVudERydW1GbShhdWRpb0N0eCwgey4uLnBhcmFtcywgZ2Fpbjogb3ZlcmRyaXZlfSBhcyBQYXJhbXNJbnN0cnVtZW50RHJ1bUZtKVxuICAgIFxuICAgIGNvbnN0IHNoYXBlciA9IG1ha2VTaGFwZXIoYXVkaW9DdHgsIFt0aGlzLmRydW1dLCBbXSwgMSwgMSwgMSwgJ25vbmUnLCA1MClcblxuICAgIHNoYXBlci5jb25uZWN0KHRoaXMuZ2FpbilcbiAgfVxuXG4gIG5vdGVPbih0aW1lOiBudW1iZXIsIGdhaW46IG51bWJlcikge1xuICAgIHRoaXMuZHJ1bS5ub3RlT24odGltZSwgZ2FpbilcbiAgfVxuICBcbiAgbm90ZU9mZih0aW1lOiBudW1iZXIpIHtcbiAgICB0aGlzLmRydW0ubm90ZU9mZih0aW1lKVxuICB9XG5cbiAga2lsbCh0aW1lOiBudW1iZXIpIHtcbiAgICB0aGlzLmRydW0ua2lsbCh0aW1lKVxuICB9XG4gIFxuICBvdXRwdXQoKSB7XG4gICAgcmV0dXJuIHRoaXMuZ2FpblxuICB9XG4gIFxuICBkZXR1bmUodmFsOiBudW1iZXIpIHtcbiAgICB0aGlzLmRydW0uZGV0dW5lKHZhbClcbiAgfVxufVxuXG5leHBvcnQgY2xhc3MgU2FtcGxlIHtcbiAgdXJsOiBzdHJpbmdcbiAgcHJpdmF0ZSBfZGF0YT86IEF1ZGlvQnVmZmVyXG4gIFxuICBjb25zdHJ1Y3Rvcih1cmw6IHN0cmluZywgcmVhZG9ubHkgY29yZG92YTogYW55KSB7XG4gICAgdGhpcy51cmwgPSB1cmxcbiAgfVxuXG4gIGRhdGEoKTogQXVkaW9CdWZmZXIge1xuICAgIGFzc2VydCh0aGlzLl9kYXRhLCBcImxvYWQgbm90IGNhbGxlZFwiKVxuICAgIHJldHVybiB0aGlzLl9kYXRhXG4gIH1cblxuICBwcml2YXRlIGFzeW5jIGxvYWRCcm93c2VyKHVybDogc3RyaW5nKSB7XG4gICAgY29uc3QgcmVzcG9uc2UgPSBhd2FpdCBmZXRjaCh1cmwpXG4gICAgaWYgKCFyZXNwb25zZS5ib2R5KVxuICAgICAgdGhyb3cgbmV3IEVycm9yKFwiTm8gcmVzcG9uc2UgYm9keSBmb3IgdXJsIFwiICsgdXJsKVxuICAgIFxuICAgIGNvbnN0IHJlYWRlciA9IHJlc3BvbnNlLmJvZHkuZ2V0UmVhZGVyKClcbiAgICBsZXQgcmVzdWx0ID0gbmV3IFVpbnQ4QXJyYXkoKVxuICAgIFxuICAgIHdoaWxlICh0cnVlKSB7XG4gICAgICBsZXQgc3JyID0gYXdhaXQgcmVhZGVyLnJlYWQoKVxuICAgICAgaWYgKHNyci5kb25lKVxuICAgICAgICBicmVha1xuICAgICAgZWxzZSB7XG4gICAgICAgIGNvbnN0IG5leHQgPSBuZXcgVWludDhBcnJheShyZXN1bHQubGVuZ3RoICsgc3JyLnZhbHVlLmxlbmd0aClcbiAgICAgICAgbmV4dC5zZXQocmVzdWx0LCAwKVxuICAgICAgICBuZXh0LnNldChzcnIudmFsdWUsIHJlc3VsdC5sZW5ndGgpXG4gICAgICAgIHJlc3VsdCA9IG5leHRcbiAgICAgIH1cbiAgICB9XG4gICAgXG4gICAgaWYgKCFyZXNwb25zZS5vaykge1xuICAgICAgY29uc29sZS5kZWJ1Zyh0aGlzLl9kYXRhKVxuICAgICAgdGhyb3cgXCJFcnJvciBnZXR0aW5nIHNhbXBsZSBhdCAnXCIgKyByZXNwb25zZS51cmwgK1wiJzogXCIgKyByZXNwb25zZS5zdGF0dXNcbiAgICB9IGVsc2Uge1xuICAgICAgcmV0dXJuIHJlc3VsdC5idWZmZXJcbiAgICB9XG4gIH1cbiAgXG4gIGFzeW5jIGxvYWQoY3R4OiBBdWRpb0NvbnRleHQpIHtcbiAgICBsZXQgdXJsOiBzdHJpbmdcblxuICAgIHVybCA9IFwiZGF0YS9cIiArIHRoaXMudXJsXG5cbiAgICB0cnkge1xuICAgICAgY29uc3QgYnVmZmVyID0gYXdhaXQgdGhpcy5sb2FkQnJvd3Nlcih1cmwpXG4gICAgICB0aGlzLl9kYXRhID0gYXdhaXQgY3R4LmRlY29kZUF1ZGlvRGF0YShidWZmZXIpXG4gICAgfSBjYXRjaCAoZSkge1xuICAgICAgdGhyb3cgXCJFcnJvciBnZXR0aW5nIHNhbXBsZSBhdCAnXCIgKyB1cmwgKyBcIic6IFwiICsgSlNPTi5zdHJpbmdpZnkoZSlcbiAgICB9XG4gIH1cbn1cblxuZXhwb3J0IGNsYXNzIEluc3RydW1lbnRTYW1wbGUgZXh0ZW5kcyBJbnN0cnVtZW50T3V0cHV0IHtcbiAgZ2FpbjogR2Fpbk5vZGVcbiAgbm9kZT86IEF1ZGlvQnVmZmVyU291cmNlTm9kZVxuICBjdHg6IEF1ZGlvQ29udGV4dFxuICBzYW1wbGU/OiBTYW1wbGVcbiAgX2RldHVuZSA9IDAuMFxuICBcbiAgY29uc3RydWN0b3IoY3R4OiBBdWRpb0NvbnRleHQsIHNhbXBsZT86IFNhbXBsZSkge1xuICAgIHN1cGVyKClcbiAgICB0aGlzLmN0eCA9IGN0eFxuICAgIHRoaXMuc2FtcGxlID0gc2FtcGxlXG4gICAgdGhpcy5nYWluID0gdGhpcy5jdHguY3JlYXRlR2FpbigpXG4gIH1cblxuICBvdXRwdXQoKSB7IHJldHVybiB0aGlzLmdhaW4gfVxuXG4gIG5vdGVPbih0aW1lOiBudW1iZXIsIGdhaW46IG51bWJlcik6IHZvaWQge1xuICAgIGlmICh0aGlzLnNhbXBsZSkge1xuICAgICAgaWYgKHRoaXMubm9kZSlcbiAgICAgICAgdGhpcy5ub2RlLmRpc2Nvbm5lY3QoKVxuICAgICAgdGhpcy5ub2RlID0gdGhpcy5jdHguY3JlYXRlQnVmZmVyU291cmNlKClcbiAgICAgIHRoaXMubm9kZS5idWZmZXIgPSB0aGlzLnNhbXBsZS5kYXRhKClcbiAgICAgIHRoaXMubm9kZS5kZXR1bmUudmFsdWUgPSB0aGlzLl9kZXR1bmVcbiAgICAgIHRoaXMubm9kZS5jb25uZWN0KHRoaXMuZ2FpbilcbiAgICAgIHRoaXMuZ2Fpbi5nYWluLnZhbHVlID0gZ2FpblxuICAgICAgdGhpcy5ub2RlLnN0YXJ0KHRpbWUpXG4gICAgfVxuICB9XG4gIFxuICBub3RlT2ZmKHRpbWU6IG51bWJlcik6IHZvaWQge1xuICAgIGlmICh0aGlzLm5vZGUpIHtcbiAgICAgIHRoaXMubm9kZS5zdG9wKHRpbWUpXG4gICAgfVxuICB9XG4gIFxuICBraWxsKHRpbWU6IG51bWJlcik6IHZvaWQge1xuICAgIHRoaXMubm90ZU9mZih0aW1lKVxuICB9XG5cbiAgZGV0dW5lKHZhbDogbnVtYmVyKSB7XG4gICAgdGhpcy5fZGV0dW5lID0gdmFsXG4gIH1cbn1cbiJdfQ==