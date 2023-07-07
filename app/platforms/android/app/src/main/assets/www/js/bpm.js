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
                bpmRamp(bpmEnd, secTime, onStop = () => { }) {
                    window.clearTimeout(this.timeoutBpmRamp);
                    const startBpm = this._bpm;
                    const updatesPerSec = 10;
                    const updates = Math.max(Math.floor(secTime * updatesPerSec), 1);
                    const loop = (i) => {
                        if (i == updates) {
                            this.change(bpmEnd);
                            onStop();
                        }
                        else {
                            this.change(startBpm + (i / updates) * (bpmEnd - startBpm));
                            this.timeoutBpmRamp = window.setTimeout(() => loop(i + 1), 1000 / updatesPerSec);
                        }
                    };
                    loop(1);
                }
                bpmRampHongs(bpmEnd, hongs, onStop = () => { }) {
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYnBtLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vdHMvYnBtLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7SUFJQSxTQUFTLGlCQUFpQixDQUFDLEdBQVc7UUFDcEMsT0FBTyxPQUFPLEdBQUcsR0FBRyxHQUFHLENBQUMsQ0FBQTtJQUMxQixDQUFDO0lBRUQsU0FBUyxjQUFjLENBQUMsUUFBZSxFQUFFLE1BQWEsRUFBRSxPQUFjO1FBQ3BFLFdBQVc7UUFDWCxNQUFNLENBQUMsR0FBRyxDQUFDLE1BQU0sSUFBRSxDQUFDLEdBQUcsUUFBUSxJQUFFLENBQUMsQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLE9BQU8sR0FBRyxjQUFjLENBQUMsQ0FBQTtRQUNwRSxNQUFNLE9BQU8sR0FBRyxDQUFDLE1BQU0sR0FBRyxRQUFRLENBQUMsR0FBRyxDQUFDLENBQUE7UUFDdkMsT0FBTyxPQUFPLEdBQUcsRUFBRSxDQUFBO0lBQ3JCLENBQUM7Ozs7Ozs7O1lBWEQsNEJBQWEsY0FBYyxHQUFHLENBQUMsRUFBQTtZQWEvQixhQUFBLE1BQWEsVUFBVTtnQkFhckIsWUFBNkIsUUFBeUIsRUFDekIsU0FBMEIsRUFDMUIsUUFBbUIsRUFDbkIsUUFBbUI7b0JBSG5CLGFBQVEsR0FBUixRQUFRLENBQWlCO29CQUN6QixjQUFTLEdBQVQsU0FBUyxDQUFpQjtvQkFDMUIsYUFBUSxHQUFSLFFBQVEsQ0FBVztvQkFDbkIsYUFBUSxHQUFSLFFBQVEsQ0FBVztvQkFmeEMsU0FBSSxHQUFVLEVBQUUsQ0FBQTtvQkFDaEIsa0JBQWEsR0FBVSxpQkFBaUIsQ0FBQyxFQUFFLENBQUMsQ0FBQTtvQkFDNUMsWUFBTyxHQUF1QixTQUFTLENBQUE7b0JBSXZDLGFBQVEsR0FBRyxLQUFLLENBQUE7b0JBQ2hCLFdBQU0sR0FBRyxLQUFLLENBQUE7b0JBQ2QsVUFBSyxHQUFHLENBQUMsQ0FBQTtvQkFDVCxjQUFTLEdBQUcsQ0FBQyxDQUFBO29CQUNiLFVBQUssR0FBRyxDQUFD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RSxLQUFLLEVBQUUsSUFBSSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQTt3QkFDdEQsSUFBSSxDQUFDLE1BQU0sR0FBRyxJQUFJLENBQUE7cUJBQ25CO2dCQUNILENBQUM7YUFDRixDQUFBIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgYXNzZXJ0IH0gZnJvbSBcIi4vbGliL2Fzc2VydC5qc1wiXG5cbmV4cG9ydCBjb25zdCBCRUFUU19QRVJfSE9ORyA9IDJcblxuZnVuY3Rpb24gYnBtVG9UaWNrUGVyaW9kTXMoYnBtOiBudW1iZXIpIHtcbiAgcmV0dXJuIDYwMDAwLjAgLyBicG0gLyAyXG59XG5cbmZ1bmN0aW9uIGJwbVJhbXBTZWNvbmRzKGJwbVN0YXJ0Om51bWJlciwgYnBtRW5kOm51bWJlciwgZHVySG9uZzpudW1iZXIpIHtcbiAgLy8gc3V2YXQuLi5cbiAgY29uc3QgYSA9IChicG1FbmQqKjIgLSBicG1TdGFydCoqMikgLyAyIC8gKGR1ckhvbmcgKiBCRUFUU19QRVJfSE9ORylcbiAgY29uc3QgZHVyTWlucyA9IChicG1FbmQgLSBicG1TdGFydCkgLyBhXG4gIHJldHVybiBkdXJNaW5zICogNjBcbn1cblxuZXhwb3J0IGNsYXNzIEJwbUNvbnRyb2wge1xuICBwcml2YXRlIF9icG06bnVtYmVyID0gNzVcbiAgcHJpdmF0ZSBfbXNUaWNrUGVyaW9kOm51bWJlciA9IGJwbVRvVGlja1BlcmlvZE1zKDc1KVxuICBwcml2YXRlIHRpbWluZ3M6IG51bWJlcltdfHVuZGVmaW5lZCA9IHVuZGVmaW5lZFxuICBwcml2YXRlIHRpbWVvdXRUaWNrPzpudW1iZXJcbiAgcHJpdmF0ZSB0aW1lb3V0QnBtUmFtcD86bnVtYmVyXG4gIHByaXZhdGUgdGlja1RpbWVMYXN0PzpudW1iZXJcbiAgcHJpdmF0ZSBfcGxheWluZyA9IGZhbHNlXG4gIHByaXZhdGUgZW5kaW5nID0gZmFsc2VcbiAgcHJpdmF0ZSBfdGljayA9IDBcbiAgcHJpdmF0ZSB0aWNrU3RhcnQgPSAwXG4gIHByaXZhdGUgX2NodW4gPSAyXG5cbiAgY29uc3RydWN0b3IocHJpdmF0ZSByZWFkb25seSBlQnBtSmluZzpIVE1MSW5wdXRFbGVtZW50LFxuICAgICAgICAgICAgICBwcml2YXRlIHJlYWRvbmx5IGVDaHVuSmluZzpIVE1MSW5wdXRFbGVtZW50LFxuICAgICAgICAgICAgICBwcml2YXRlIHJlYWRvbmx5IGZ1bmNUaWNrOigpID0+IHZvaWQsXG4gICAgICAgICAgICAgIHByaXZhdGUgcmVhZG9ubHkgZnVuY1N0b3A6KCkgPT4gdm9pZCkge1xuICB9XG4gIFxuICBjaGFuZ2UoYnBtOm51bWJlcikge1xuICAgIGFzc2VydCghTnVtYmVyLmlzTmFOKE51bWJlcihicG0pKSlcblxuICAgIHRoaXMuX2JwbSA9IGJwbVxuICAgIGNvbnN0IG9sZFBlcmlvZCA9IHRoaXMuX21zVGlja1BlcmlvZFxuICAgIHRoaXMuX21zVGlja1BlcmlvZCA9IGJwbVRvVGlja1BlcmlvZE1zKGJwbSlcblxuICAgIC8vIFJlc2V0IHRpbWluZ3MgaWYgdGltaW5nIGlzIGFjdGl2YXRlZFxuICAgIGlmICh0aGlzLnRpbWluZ3MgIT0gdW5kZWZpbmVkKVxuICAgICAgdGhpcy50aW1pbmdzID0gW11cblxuICAgIGlmICh0aGlzLl9wbGF5aW5nICYmIHRoaXMuX3RpY2sgIT0gMCkge1xuICAgICAgY29uc3QgdGhpc1RpY2tUaW1lID0gdGhpcy50aWNrU3RhcnQgKyBvbGRQZXJpb2QgKiAodGhpcy5fdGljay0xKVxuICAgICAgY29uc3QgbmV3TmV4dFRpY2tUaW1lID0gdGhpc1RpY2tUaW1lICsgdGhpcy5fbXNUaWNrUGVyaW9kXG4gICAgICB0aGlzLnRpY2tTdGFydCA9IG5ld05leHRUaWNrVGltZSAtIHRoaXMuX21zVGlja1BlcmlvZCAqIHRoaXMuX3RpY2tcblxuICAgICAgLy8gcmUtY2FsY3VsYXRlIG5leHQgdGljayB0aW1lXG4gICAgICAvLyBPbmx5IHJlLXRyaWdnZXIgdGhlIHRpY2sgaWYgaXQgaGFwcGVucyBpbiB0aGUgZnV0dXJlIGFuZCB0aGVyZSdzIGEgc3VmZmljaWVudGx5IGxhcmdlIGRlbHRhLlxuICAgICAgLy8gSXQgY2FuIGJlIGphcnJpbmcgdG8gcmUtY2FsY3VsYXRlIHRoZSB0aWNrIHRpbWUgYmV0d2VlbiBjbG9zZS10b2dldGhlciBkcnVtIGhpdHMsIGJ1dCBpdCdzIGFsc28gbm90XG4gICAgICAvLyBkZXNpcmFibGUgdG8gd2FpdCBhIGxvbmcgdGltZSBmb3IgbGFyZ2UgaW5jcmVhc2VzIGluIEJQTSB2YWx1ZSB0byB0YWtlIGVmZmVjdCBvbiB0aGUgbmV4dCB0aWNrLlxuICAgICAgY29uc3QgbmV3TmV4dFRpY2sgPSBuZXdOZXh0VGlja1RpbWUgLSB3aW5kb3cucGVyZm9ybWFuY2Uubm93KClcbiAgICAgIGlmIChuZXdOZXh0VGljayA+IDUwMCkge1xuICAgICAgICB3aW5kb3cuY2xlYXJUaW1lb3V0KHRoaXMudGltZW91dFRpY2spXG4gICAgICAgIHRoaXMudGltZW91dFRpY2sgPSB3aW5kb3cuc2V0VGltZW91dChcbiAgICAgICAgICB0aGlzLm9uVGljay5iaW5kKHRoaXMpLFxuICAgICAgICAgIG5ld05leHRUaWNrXG4gICAgICAgICk7XG4gICAgICB9XG4gICAgfVxuICAgIFxuICAgIHRoaXMuZUJwbUppbmcudmFsdWUgPSB0aGlzLl9icG0udG9TdHJpbmcoKVxuICB9XG5cbiAgdGlja3NQZXJCZWF0KCkgeyByZXR1cm4gMiB9XG4gIHRpY2tzUGVySG9uZygpIHsgcmV0dXJuIEJFQVRTX1BFUl9IT05HICogdGhpcy50aWNrc1BlckJlYXQoKSB9XG4gIGJwbSgpIHsgcmV0dXJuIHRoaXMuX2JwbSB9XG4gIHRpY2soKSB7IHJldHVybiB0aGlzLl90aWNrIH1cbiAgcGxheWluZygpIHsgcmV0dXJuIHRoaXMuX3BsYXlpbmcgfVxuICBtc1RpY2tQZXJpb2QoKSB7IHJldHVybiB0aGlzLl9tc1RpY2tQZXJpb2QgfVxuXG4gIGdldCBjaHVuKCkge1xuICAgIHJldHVybiB0aGlzLl9jaHVuXG4gIH1cblxuICBjaHVuU2V0KGNodW46bnVtYmVyKSB7XG4gICAgdGhpcy5fY2h1biA9IGNodW5cbiAgICB0aGlzLmVDaHVuSmluZy52YWx1ZSA9IGNodW4udG9TdHJpbmcoKVxuICB9XG4gIFxuICBwbGF5KCkge1xuICAgIHRoaXMuX3RpY2sgPSAwXG4gICAgdGhpcy5fcGxheWluZyA9IHRydWVcbiAgICB0aGlzLnRpY2tTdGFydCA9IHdpbmRvdy5wZXJmb3JtYW5jZS5ub3coKVxuICAgIHRoaXMub25UaWNrKClcbiAgfVxuXG4gIHN0b3AoKSB7XG4gICAgdGhpcy5lbmRpbmcgPSBmYWxzZVxuICAgIHRoaXMuX3BsYXlpbmcgPSBmYWxzZVxuICAgIGZvciAoY29uc3QgdCBvZiBbdGhpcy50aW1lb3V0VGljaywgdGhpcy50aW1lb3V0QnBtUmFtcF0pIHtcbiAgICAgIHdpbmRvdy5jbGVhclRpbWVvdXQodClcbiAgICB9XG4gICAgdGhpcy5mdW5jU3RvcCgpXG4gIH1cbiAgXG4gIHByaXZhdGUgb25UaWNrKCkge1xuICAgIGlmICghdGhpcy5fcGxheWluZylcbiAgICAgIHJldHVyblxuICAgIFxuICAgICsrdGhpcy5fdGlja1xuICAgIFxuICAgIHRoaXMuZnVuY1RpY2soKVxuXG4gICAgdGhpcy50aWNrVGltZUxhc3QgPSB3aW5kb3cucGVyZm9ybWFuY2Uubm93KClcbiAgICBcbiAgICBpZiAodGhpcy50aW1pbmdzICE9IHVuZGVmaW5lZCAmJiB0aGlzLnRpbWluZ3MucHVzaCh0aGlzLnRpY2tUaW1lTGFzdCkgPT0gODApIHtcbiAgICAgIGNvbnN0IHRpbWluZ3MgPSB0aGlzLnRpbWluZ3NcbiAgICAgIHRoaXMudGltaW5ncyA9IHVuZGVmaW5lZFxuXG4gICAgICBjb25zdCBkaWZmcyA9IFtdO1xuICAgICAgZm9yIChsZXQgaSA9IDE7IGkgPCB0aW1pbmdzLmxlbmd0aDsgKytpKSB7XG4gICAgICAgIGRpZmZzLnB1c2godGltaW5nc1tpXSAtIHRpbWluZ3NbaS0xXSlcbiAgICAgIH1cblxuICAgICAgbGV0IHJlcG9ydCA9IFwiVGljayAjOiBcIiArIHRoaXMuX3RpY2sgKyBcIlxcblwiXG4gICAgICByZXBvcnQgKz0gXCJJZGVhbCB0aWNrIHBlcmlvZDogXCIgKyB0aGlzLl9tc1RpY2tQZXJpb2QgKyBcIlxcblwiXG4gICAgICByZXBvcnQgKz0gXCJNZWFuIHRpY2sgcGVyaW9kOiBcIiArIGRpZmZzLnJlZHVjZSgoYWNjLCB2KSA9PiBhY2MgKyB2LCAwKSAvIGRpZmZzLmxlbmd0aCArIFwiXFxuXCJcblxuICAgICAgZGlmZnMuc29ydCgpXG4gICAgICByZXBvcnQgKz0gXCJNZWRpYW4gdGljayBwZXJpb2Q6IFwiICsgZGlmZnNbTWF0aC5mbG9vcihkaWZmcy5sZW5ndGgvMildXG5cbiAgICAgIGFsZXJ0KHJlcG9ydClcbiAgICB9XG5cbiAgICAvLyBUaWNrIHRpbWVzIGFyZSBjYWxjdWxhdGVkIHJlbGF0aXZlIHRvIGEgc3RhcnQgdGltZS4gVGhpcyBpbXByb3ZlcyBwcmVjaXNpb24gYXMgaXQgYXZvaWRzXG4gICAgLy8gYWNjdW1sYXRpbmcgZmxvYXRpbmctcG9pbnQgZXJyb3IgZnJvbSByZXBlYXRlZCBhZGRpdGlvbnMgdG8gdGhlIGJhc2UgdGltZS5cbiAgICB0aGlzLnRpbWVvdXRUaWNrID0gd2luZG93LnNldFRpbWVvdXQoXG4gICAgICB0aGlzLm9uVGljay5iaW5kKHRoaXMpLFxuICAgICAgKHRoaXMudGlja1N0YXJ0ICsgdGhpcy5fbXNUaWNrUGVyaW9kICogdGhpcy5fdGljaykgLSB0aGlzLnRpY2tUaW1lTGFzdFxuICAgICk7XG4gIH1cbiAgICBcbiAgZGVidWdUaW1pbmdzKCkge1xuICAgIGlmICh0aGlzLnRpbWluZ3MgPT0gdW5kZWZpbmVkKVxuICAgICAgdGhpcy50aW1pbmdzID0gW11cbiAgICBlbHNlXG4gICAgICB0aGlzLnRpbWluZ3MgPSB1bmRlZmluZWRcbiAgfVxuXG4gIGJwbVJhbXAoYnBtRW5kOiBudW1iZXIsIHNlY1RpbWU6IG51bWJlciwgb25TdG9wID0gKCkgPT4ge30pIHtcbiAgICB3aW5kb3cuY2xlYXJUaW1lb3V0KHRoaXMudGltZW91dEJwbVJhbXApXG4gICAgXG4gICAgY29uc3Qgc3RhcnRCcG0gPSB0aGlzLl9icG1cbiAgICBjb25zdCB1cGRhdGVzUGVyU2VjID0gMTBcbiAgICBjb25zdCB1cGRhdGVzID0gTWF0aC5tYXgoTWF0aC5mbG9vcihzZWNUaW1lICogdXBkYXRlc1BlclNlYyksIDEpXG5cbiAgICBjb25zdCBsb29wID0gKGk6IG51bWJlcikgPT4ge1xuICAgICAgaWYgKGkgPT0gdXBkYXRlcykge1xuICAgICAgICB0aGlzLmNoYW5nZShicG1FbmQpXG4gICAgICAgIG9uU3RvcCgpXG4gICAgICB9IGVsc2Uge1xuICAgICAgICB0aGlzLmNoYW5nZShzdGFydEJwbSArIChpL3VwZGF0ZXMpICogKGJwbUVuZCAtIHN0YXJ0QnBtKSlcbiAgICAgICAgdGhpcy50aW1lb3V0QnBtUmFtcCA9IHdpbmRvdy5zZXRUaW1lb3V0KCgpID0+IGxvb3AoaSsxKSwgMTAwMC91cGRhdGVzUGVyU2VjKVxuICAgICAgfVxuICAgIH1cblxuICAgIGxvb3AoMSlcbiAgfVxuXG4gIGJwbVJhbXBIb25ncyhicG1FbmQ6bnVtYmVyLCBob25nczpudW1iZXIsIG9uU3RvcD0oKSA9PiB7fSkge1xuICAgIHRoaXMuYnBtUmFtcChcbiAgICAgIGJwbUVuZCxcbiAgICAgIGhvbmdzID09IDAgPyAwIDogYnBtUmFtcFNlY29uZHModGhpcy5fYnBtLCBicG1FbmQsIGhvbmdzKSxcbiAgICAgIG9uU3RvcFxuICAgIClcbiAgfVxuXG4gIGVuZChob25nczpudW1iZXIpIHtcbiAgICBpZiAoIXRoaXMuZW5kaW5nKSB7XG4gICAgICBjb25zdCBicG1FbmQgPSBNYXRoLm1pbig0NSwgdGhpcy5fYnBtLzIpXG4gICAgICB0aGlzLmJwbVJhbXBIb25ncyhicG1FbmQsIGhvbmdzLCB0aGlzLnN0b3AuYmluZCh0aGlzKSlcbiAgICAgIHRoaXMuZW5kaW5nID0gdHJ1ZVxuICAgIH1cbiAgfVxufVxuIl19