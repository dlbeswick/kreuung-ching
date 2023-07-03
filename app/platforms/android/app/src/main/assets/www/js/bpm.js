System.register(["./lib/assert.js"], function (exports_1, context_1) {
    "use strict";
    var assert_js_1, BEATS_PER_HONG, BpmControl;
    var __moduleName = context_1 && context_1.id;
    function bpmToTickPeriodMs(bpm) {
        return 60000.0 / bpm / 2;
    }
    function bpmRampSeconds(bpmStart, bpmEnd, durHong) {
        // suvat...
        const a = (bpmEnd ** 2 - bpmStart ** 2) / 2 / (durHong * BEATS_PER_HONG);
        const durMins = (bpmEnd - bpmStart) / a;
        return durMins * 60;
    }
    return {
        setters: [
            function (assert_js_1_1) {
                assert_js_1 = assert_js_1_1;
            }
        ],
        execute: function () {
            exports_1("BEATS_PER_HONG", BEATS_PER_HONG = 2);
            BpmControl = class BpmControl {
                constructor(eBpmJing, eChunJing, funcTick, funcStop) {
                    this.eBpmJing = eBpmJing;
                    this.eChunJing = eChunJing;
                    this.funcTick = funcTick;
                    this.funcStop = funcStop;
                    this._bpm = 75;
                    this._msTickPeriod = bpmToTickPeriodMs(75);
                    this.timings = undefined;
                    this._playing = false;
                    this.ending = false;
                    this._tick = 0;
                    this.tickStart = 0;
                    this._chun = 2;
                }
                change(bpm) {
                    assert_js_1.assert(!Number.isNaN(Number(bpm)));
                    this._bpm = bpm;
                    const oldPeriod = this._msTickPeriod;
                    this._msTickPeriod = bpmToTickPeriodMs(bpm);
                    // Reset timings if timing is activated
                    if (this.timings != undefined)
                        this.timings = [];
                    if (this._playing && this._tick != 0) {
                        const thisTickTime = this.tickStart + oldPeriod * (this._tick - 1);
                        const newNextTickTime = thisTickTime + this._msTickPeriod;
                        this.tickStart = newNextTickTime - this._msTickPeriod * this._tick;
                        // re-calculate next tick time
                        // Only re-trigger the tick if it happens in the future and there's a sufficiently large delta.
                        // It can be jarring to re-calculate the tick time between close-together drum hits, but it's also not
                        // desirable to wait a long time for large increases in BPM value to take effect on the next tick.
                        const newNextTick = newNextTickTime - window.performance.now();
                        if (newNextTick > 500) {
                            window.clearTimeout(this.timeoutTick);
                            this.timeoutTick = window.setTimeout(this.onTick.bind(this), newNextTick);
                        }
                    }
                    this.eBpmJing.value = this._bpm.toString();
                }
                ticksPerBeat() { return 2; }
                ticksPerHong() { return BEATS_PER_HONG * this.ticksPerBeat(); }
                bpm() { return this._bpm; }
                tick() { return this._tick; }
                playing() { return this._playing; }
                msTickPeriod() { return this._msTickPeriod; }
                get chun() {
                    return this._chun;
                }
                chunSet(chun) {
                    this._chun = chun;
                    this.eChunJing.value = chun.toString();
                }
                play() {
                    this._tick = 0;
                    this._playing = true;
                    this.tickStart = window.performance.now();
                    this.onTick();
                }
                stop() {
                    this.ending = false;
                    this._playing = false;
                    for (const t of [this.timeoutTick, this.timeoutBpmRamp]) {
                        window.clearTimeout(t);
                    }
                    this.funcStop();
                }
                onTick() {
                    if (!this._playing)
                        return;
                    ++this._tick;
                    this.funcTick();
                    this.tickTimeLast = window.performance.now();
                    if (this.timings != undefined && this.timings.push(this.tickTimeLast) == 80) {
                        const timings = this.timings;
                        this.timings = undefined;
                        const diffs = [];
                        for (let i = 1; i < timings.length; ++i) {
                            diffs.push(timings[i] - timings[i - 1]);
                        }
                        let report = "Tick #: " + this._tick + "\n";
                        report += "Ideal tick period: " + this._msTickPeriod + "\n";
                        report += "Mean tick period: " + diffs.reduce((acc, v) => acc + v, 0) / diffs.length + "\n";
                        diffs.sort();
                        report += "Median tick period: " + diffs[Math.floor(diffs.length / 2)];
                        alert(report);
                    }
                    // Tick times are calculated relative to a start time. This improves precision as it avoids
                    // accumlating floating-point error from repeated additions to the base time.
                    this.timeoutTick = window.setTimeout(this.onTick.bind(this), (this.tickStart + this._msTickPeriod * this._tick) - this.tickTimeLast);
                }
                debugTimings() {
                    if (this.timings == undefined)
                        this.timings = [];
                    else
                        this.timings = undefined;
                }
                bpmRamp(bpmEnd, secTime, onStop = null) {
                    window.clearTimeout(this.timeoutBpmRamp);
                    const startBpm = this._bpm;
                    const updatesPerSec = 10;
                    const updates = Math.max(Math.floor(secTime * updatesPerSec), 1);
                    const loop = i => {
                        if (i == updates) {
                            this.change(bpmEnd);
                            if (onStop) {
                                onStop();
                            }
                        }
                        else {
                            this.change(startBpm + (i / updates) * (bpmEnd - startBpm));
                            this.timeoutBpmRamp = window.setTimeout(() => loop(i + 1), 1000 / updatesPerSec);
                        }
                    };
                    loop(1);
                }
                bpmRampHongs(bpmEnd, hongs, onStop = null) {
                    this.bpmRamp(bpmEnd, hongs == 0 ? 0 : bpmRampSeconds(this._bpm, bpmEnd, hongs), onStop);
                }
                end(hongs) {
                    if (!this.ending) {
                        const bpmEnd = Math.min(45, this._bpm / 2);
                        this.bpmRampHongs(bpmEnd, hongs, this.stop.bind(this));
                        this.ending = true;
                    }
                }
            };
            exports_1("BpmControl", BpmControl);
        }
    };
});
