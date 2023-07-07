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
System.register(["./bpm.js", "./glongset.js", "./instrument.js", "./patterns.js", "./lib/assert.js", "./lib/error_handler.js", "./messages.js"], function (exports_1, context_1) {
    "use strict";
    var bpm_js_1, glongset_js_1, instrument_js_1, patterns_js_1, assert_js_1, error_handler_js_1, messages, patterns, cordova, MSG, DrumPattern, AppChing, appChing;
    var __moduleName = context_1 && context_1.id;
    function device() { return window.device; }
    function* classDemandEach(name, cnstr) {
        const els = document.getElementsByClassName(name);
        if (els.length == 0)
            throw (`No elements with class '${name}'`);
        for (let i = 0; i < els.length; ++i) {
            assert_js_1.assert(els[i] instanceof cnstr);
            yield els[i];
        }
    }
    function withElement(id, klass, func) {
        func(demandById(id, klass));
    }
    exports_1("withElement", withElement);
    function demandById(id, klass) {
        const klass_ = klass !== null && klass !== void 0 ? klass : HTMLElement;
        const result = document.getElementById(id);
        if (result == undefined) {
            throw new Error(`Element '${id}' not found`);
        }
        else if (!(result instanceof klass_)) {
            throw new Error(`Element '${id}' is not '${klass}', but is '${result.constructor.name}'`);
        }
        else {
            return result;
        }
    }
    exports_1("demandById", demandById);
    function analyserDraw(time, analyser, canvasCtx) {
        const updateFreq = (1 / 65) * 1000;
        const bufferFft = new Float32Array(analyser.frequencyBinCount);
        const loop = (lastTime, time, bufferImgOld) => {
            const canvasWidth = canvasCtx.canvas.width;
            const canvasHeight = canvasCtx.canvas.height;
            analyser.getFloatFrequencyData(bufferFft);
            canvasCtx.putImageData(bufferImgOld, -1, 0);
            const bufferImg = canvasCtx.getImageData(0, 0, canvasWidth, canvasHeight);
            const dbMin = analyser.minDecibels;
            const dbMax = analyser.maxDecibels;
            const gainDb = 15;
            const freqBinCount = analyser.frequencyBinCount;
            const data = bufferImg.data;
            const sampleRate = analyser.context.sampleRate;
            var iImg = (canvasWidth - 1) * 4;
            for (let y = 0; y < canvasHeight; ++y) {
                const alpha = y / canvasHeight;
                const iBin = Math.floor(Math.pow(1.0 - alpha, 3) * freqBinCount);
                const fVal = bufferFft[iBin] + gainDb;
                const iIntensity = 255 * (Math.max(Math.min(fVal, dbMax), dbMin) - dbMin) / (dbMax - dbMin);
                data[iImg] = iIntensity;
                data[iImg + 1] = iIntensity;
                data[iImg + 2] = iIntensity;
                iImg += canvasWidth * 4;
            }
            canvasCtx.putImageData(bufferImg, 0, 0, canvasWidth - 1, 0, canvasWidth, canvasHeight);
            if (appChing.analyserActive) {
                window.setTimeout(() => window.requestAnimationFrame((timeNew) => loop(time, timeNew, bufferImg)), Math.max((lastTime + updateFreq) - time, 0));
            }
        };
        canvasCtx.fillRect(0, 0, 10000, 10000);
        loop(time, time, canvasCtx.getImageData(0, 0, canvasCtx.canvas.width, canvasCtx.canvas.height));
    }
    function handleSliderUpdate(ctl, onChange) {
        const min = 0;
        const max = 100;
        ctl.addEventListener("input", () => onChange((Number(ctl.value) - min) / (max - min), false));
        onChange((Number(ctl.value) - min) / (max - min), true);
    }
    function updateChingVis(eChingVises, phase) {
        var _a;
        for (let i = 0; i < eChingVises.length; ++i) {
            const e = eChingVises[i];
            if (phase == i) {
                e.style.backgroundColor = (_a = e.dataset.activeCol) !== null && _a !== void 0 ? _a : 'red';
            }
            else {
                e.style.backgroundColor = 'white';
            }
        }
    }
    function programStateSerialize() {
        const serialized = { "select": {}, "input": {}, "textarea": {} };
        {
            const ser = serialized["input"];
            const es = document.getElementsByTagName('input');
            for (let i = 0; i < es.length; ++i) {
                const e = es[i];
                ser[e.id] = e.value;
            }
        }
        {
            const ser = serialized["textarea"];
            const es = document.getElementsByTagName('textarea');
            for (let i = 0; i < es.length; ++i) {
                const e = es[i];
                assert_js_1.assert(serialized[e.id] == undefined);
                ser[e.id] = e.textContent;
            }
        }
        {
            const ser = serialized["select"];
            const es = document.getElementsByTagName('select');
            for (let i = 0; i < es.length; ++i) {
                const e = es[i];
                assert_js_1.assert(ser[e.id] == undefined);
                ser[e.id] = e.selectedIndex;
            }
        }
        window.localStorage.setItem("state", JSON.stringify(serialized));
    }
    exports_1("programStateSerialize", programStateSerialize);
    function programStateDeserialize() {
        // Note: most onchange not necessary, as the user will always need to provide input to reinitialize the
        // audiocontext.
        const state = window.localStorage.getItem("state");
        if (!state)
            return;
        const serialized = JSON.parse(state);
        if (serialized) {
            {
                const ser = serialized["input"];
                const es = document.getElementsByTagName('input');
                for (let i = 0; i < es.length; ++i) {
                    const e = es[i];
                    if (e && ser[e.id] != undefined) {
                        e.value = ser[e.id];
                    }
                }
            }
            {
                const ser = serialized["textarea"];
                const es = document.getElementsByTagName('textarea');
                for (let i = 0; i < es.length; ++i) {
                    const e = es[i];
                    if (e && ser[e.id] != undefined) {
                        e.textContent = ser[e.id];
                    }
                }
            }
            {
                const ser = serialized["select"];
                const es = document.getElementsByTagName('select');
                for (let i = 0; i < es.length; ++i) {
                    const e = es[i];
                    if (e && ser[e.id] != undefined) {
                        e.selectedIndex = ser[e.id];
                    }
                }
            }
        }
    }
    exports_1("programStateDeserialize", programStateDeserialize);
    return {
        setters: [
            function (bpm_js_1_1) {
                bpm_js_1 = bpm_js_1_1;
            },
            function (glongset_js_1_1) {
                glongset_js_1 = glongset_js_1_1;
            },
            function (instrument_js_1_1) {
                instrument_js_1 = instrument_js_1_1;
            },
            function (patterns_js_1_1) {
                patterns_js_1 = patterns_js_1_1;
                patterns = patterns_js_1_1;
            },
            function (assert_js_1_1) {
                assert_js_1 = assert_js_1_1;
            },
            function (error_handler_js_1_1) {
                error_handler_js_1 = error_handler_js_1_1;
            },
            function (messages_1) {
                messages = messages_1;
            }
        ],
        execute: function () {
            cordova = window.cordova;
            MSG = messages.makeMultilingual([new messages.MessagesThai(), new messages.MessagesEnglish()]);
            window.onerror = error_handler_js_1.errorHandler;
            DrumPattern = class DrumPattern {
                constructor(segments) {
                    this.segments = segments;
                    this.segmentIdx = -1;
                    this.lengthTicks = segments.reduce((acc, sa) => acc + (sa.span ? sa.span.length() : 0), 0);
                }
                seek(app, tick) {
                    tick = this.lengthTicks ? tick % this.lengthTicks : 0;
                    for (this.segmentIdx = 0; this.segmentIdx < this.segments.length; ++this.segmentIdx) {
                        const segment = this.segments[this.segmentIdx];
                        if (app.bpmControl.playing)
                            for (const i of segment.instants)
                                i.run(app.bpmControl, this.segmentIdx == 0);
                        if (segment.span) {
                            if (tick < segment.span.length()) {
                                segment.span.seek(tick);
                                break;
                            }
                            else {
                                tick = Math.max(0, tick - segment.span.length());
                            }
                        }
                    }
                }
                tick(app) {
                    var _a, _b;
                    if (this.lengthTicks == 0)
                        return;
                    const segment = this.segments[this.segmentIdx];
                    assert_js_1.assert(segment);
                    if (app.glongSet) {
                        if (!segment.span || segment.span.tick(app.glongSet, app.bpmControl)) {
                            this.segmentIdx = (this.segmentIdx + 1) % this.segments.length;
                            (_a = this.segments[this.segmentIdx].span) === null || _a === void 0 ? void 0 : _a.seek(0);
                            (_b = this.segments[this.segmentIdx].span) === null || _b === void 0 ? void 0 : _b.tick(app.glongSet, app.bpmControl);
                            for (const i of this.segments[this.segmentIdx].instants)
                                i.run(app.bpmControl, (app.bpmControl.tick() % this.lengthTicks) == 0);
                        }
                    }
                }
            };
            exports_1("DrumPattern", DrumPattern);
            AppChing = class AppChing {
                constructor(eBpm, eBpmJing, eChun, eChunJing, tuneGlong, eHong, ePlay, eStop, ePlayDelay, eChingVises, ePatternError) {
                    this.eBpm = eBpm;
                    this.eBpmJing = eBpmJing;
                    this.eChun = eChun;
                    this.eChunJing = eChunJing;
                    this.tuneGlong = tuneGlong;
                    this.eHong = eHong;
                    this.ePlay = ePlay;
                    this.eStop = eStop;
                    this.ePlayDelay = ePlayDelay;
                    this.eChingVises = eChingVises;
                    this.ePatternError = ePatternError;
                    this.analyserActive = false;
                    this.drumPattern = null;
                    this.drumPatternNext = null;
                    this.glongSetDetune = 0;
                    this.eStop.setAttribute('disabled', '');
                    this.bpmControl = new bpm_js_1.BpmControl(eBpmJing, eChunJing, this.onTick.bind(this), this.onStop.bind(this));
                }
                setupPreUserInteraction(patternDrum, presetsDrumPattern) {
                    var _a;
                    const select = demandById("patterns-user", HTMLSelectElement);
                    const del = demandById("pattern-del", HTMLButtonElement);
                    del.addEventListener("click", () => {
                        window.localStorage.removeItem(select.value);
                        this.userPatternsUpdate();
                        del.disabled = true;
                    });
                    const dlg = demandById("dialog-save");
                    const save = dlg.getElementsByClassName("save")[0];
                    const input = dlg.getElementsByTagName("input")[0];
                    const onChange = () => { save.disabled = !input.value; };
                    input.addEventListener("input", onChange);
                    demandById("pattern-save").addEventListener("click", () => {
                        dlg.classList.add("modal-show");
                        input.value = select.value ? select.selectedOptions[0].innerText : '';
                        onChange();
                    });
                    dlg.getElementsByClassName("cancel")[0].addEventListener("click", () => dlg.classList.remove("modal-show"));
                    save.addEventListener("click", () => {
                        dlg.classList.remove("modal-show");
                        this.onSavePattern(input.value, patternDrum.value);
                        select.value = "pleyng-" + input.value;
                    });
                    select.addEventListener("change", () => {
                        window.localStorage.setItem("selected-pleyng", select.value);
                        patternDrum.value = window.localStorage.getItem(select.value);
                        this.onDrumPatternChange(patternDrum.value);
                        del.disabled = select.selectedIndex == 0;
                    });
                    this.userPatternsUpdate();
                    select.value = (_a = window.localStorage.getItem("selected-pleyng")) !== null && _a !== void 0 ? _a : '';
                    del.disabled = select.selectedIndex == 0;
                    patternDrum.value = window.localStorage.getItem(select.value);
                    patternDrum.addEventListener("change", () => this.onDrumPatternChange(patternDrum.value));
                    for (let [element, pattern] of presetsDrumPattern) {
                        element.addEventListener("click", () => {
                            patternDrum.value = pattern;
                            this.onDrumPatternChange(patternDrum.value);
                            select.selectedIndex = 0;
                            del.disabled = true;
                        });
                    }
                    this.onDrumPatternChange(patternDrum.value);
                }
                async setup(eAnalyser, eAnalyserOn, eAnalyserOff, eGlongSelect, ePlayChingClosed, ePlayChingOpen, ePlayGlongs, bpmMods, gainGlong, gainChing) {
                    let audioCtx;
                    try {
                        audioCtx = new (window.AudioContext || window.webkitAudioContext)();
                    }
                    catch (e) {
                        if (device().platform == 'browser') {
                            throw MSG.errorAudioContextWeb(e);
                        }
                        else {
                            throw MSG.errorAudioContextAndroid(e);
                        }
                    }
                    this.audioCtx = audioCtx;
                    this.gainMaster = audioCtx.createGain();
                    this.gainMaster.gain.value = 0.5;
                    this.gainMaster.connect(audioCtx.destination);
                    this.gainGlong = audioCtx.createGain();
                    this.gainGlong.connect(this.gainMaster);
                    this.gainChing = audioCtx.createGain();
                    this.gainChing.connect(this.gainMaster);
                    eGlongSelect.addEventListener("change", () => this.onGlongsetChange(eGlongSelect.value));
                    await this.onGlongsetChange(eGlongSelect.value);
                    handleSliderUpdate(this.tuneGlong, (alpha, init) => {
                        this.glongSetDetune = -1000 + alpha * 2000.0;
                        assert_js_1.assert(this.glongSet);
                        this.glongSet.detune(this.glongSetDetune);
                    });
                    this.analyser = audioCtx.createAnalyser();
                    try {
                        this.analyser.fftSize = 2048;
                    }
                    catch (e) {
                        // iPhone has a max fft size 2048?
                    }
                    // Browsers can sometimes flip the audio output off during quiet periods, which is annoying on mobile.
                    // Add a bit of inaudible noise to keep the channel open while playing is activated.
                    const quietNoiseBuffer = audioCtx.createBuffer(1, audioCtx.sampleRate * 0.25, audioCtx.sampleRate);
                    const quietNoiseBufferData = quietNoiseBuffer.getChannelData(0);
                    for (var i = 0; i < quietNoiseBuffer.length; i += audioCtx.sampleRate / 100) {
                        quietNoiseBufferData[Math.floor(i)] = (-1 + Math.random() * 2) * 0.00001;
                    }
                    this.quietNoise = audioCtx.createBufferSource();
                    this.quietNoise.buffer = quietNoiseBuffer;
                    this.quietNoise.loop = true;
                    this.quietNoise.loopEnd = 0.25;
                    this.quietNoise.start();
                    this.bpmControl.change(Number(this.eBpm.value) || 70);
                    this.ePlay.addEventListener("click", this.onPlay.bind(this));
                    this.ePlayDelay.addEventListener("click", this.onPlayDelay.bind(this));
                    this.eStop.addEventListener("click", this.bpmControl.stop.bind(this.bpmControl));
                    this.eChun.addEventListener("change", e => {
                        this.bpmControl.chunSet(Number(this.eChun.value));
                    });
                    this.eBpm.addEventListener("change", e => {
                        this.bpmControl.change(this.getBpm(this.eBpm.value));
                    });
                    eAnalyserOn.addEventListener("click", e => {
                        this.analyserActive = true;
                        eAnalyserOn.setAttribute('disabled', '');
                        eAnalyserOff.removeAttribute('disabled');
                        assert_js_1.assert(this.gainMaster);
                        assert_js_1.assert(this.analyser);
                        this.gainMaster.connect(this.analyser);
                        window.requestAnimationFrame((time) => {
                            assert_js_1.assert(this.analyser);
                            const ctx = eAnalyser.getContext('2d');
                            assert_js_1.assert(ctx);
                            analyserDraw(time, this.analyser, ctx);
                        });
                    });
                    eAnalyserOff.addEventListener("click", e => {
                        this.analyserActive = false;
                        eAnalyserOff.setAttribute('disabled', '');
                        eAnalyserOn.removeAttribute('disabled');
                        if (this.gainMaster && this.analyser)
                            this.gainMaster.disconnect(this.analyser);
                    });
                    eAnalyserOff.setAttribute('disabled', '');
                    ePlayChingOpen.addEventListener("click", e => { var _a; return (_a = this.glongSet) === null || _a === void 0 ? void 0 : _a.chup(0, 1); });
                    ePlayChingClosed.addEventListener("click", e => { var _a; return (_a = this.glongSet) === null || _a === void 0 ? void 0 : _a.ching(0, 1); });
                    for (let i = 0; i < ePlayGlongs.length; ++i)
                        ePlayGlongs[i].addEventListener("click", e => { var _a; return (_a = this.glongSet) === null || _a === void 0 ? void 0 : _a.glong(0, 1, i); });
                    for (let [ctl, gain] of [[gainGlong, this.gainGlong], [gainChing, this.gainChing]]) {
                        handleSliderUpdate(ctl, (alpha, init) => {
                            gain.gain.cancelScheduledValues(audioCtx.currentTime);
                            // max volume is 5, allowing distortion
                            // exponential is chosen so that 0.5**2.32193 == 1.0 (full volume on half-slider)
                            const vol = Math.pow(alpha, 2.32193) * 5.0;
                            if (!init) {
                                gain.gain.setTargetAtTime(vol, audioCtx.currentTime, 0.2);
                            }
                            else {
                                gain.gain.value = vol;
                            }
                        });
                    }
                    for (let i = 0; i < bpmMods.length; ++i) {
                        bpmMods[i].addEventListener("click", e => this.onBpmMod(e));
                    }
                    for (const el of classDemandEach("chun-mod", HTMLButtonElement)) {
                        el.addEventListener("click", () => {
                            const val = Math.max(0, Number(this.eChun.value) + Number(el.dataset.mod));
                            this.eChun.value = val.toString();
                            this.bpmControl.chunSet(val);
                        });
                    }
                    const eDlgPatternHelp = demandById("dialog-pattern-help");
                    demandById("pattern-help").addEventListener("click", function () {
                        if (eDlgPatternHelp.classList.contains("split-show"))
                            eDlgPatternHelp.classList.remove("split-show");
                        else
                            eDlgPatternHelp.classList.add("split-show");
                    });
                }
                userPatternsUpdate() {
                    withElement("patterns-user", HTMLSelectElement, (select) => {
                        const oldValue = select.value;
                        while (select.options.length > 1)
                            select.remove(1);
                        for (let i = 0;; i++) {
                            const key = window.localStorage.key(i);
                            if (!key) {
                                break;
                            }
                            else if (key.startsWith("pleyng-")) {
                                const opt = document.createElement("option");
                                opt.innerText = key.slice(7);
                                opt.value = key;
                                select.add(opt);
                            }
                        }
                        select.value = oldValue;
                    });
                }
                onSavePattern(name, pattern) {
                    window.localStorage.setItem("pleyng-" + name, pattern);
                    this.userPatternsUpdate();
                }
                onPlayDelay() {
                    var _a;
                    this.bpmControl.stop();
                    this.bpmControl.change(this.getBpm(this.eBpm.value));
                    if (this.drumPatternNext != null)
                        this.drumPattern = this.drumPatternNext;
                    (_a = this.drumPattern) === null || _a === void 0 ? void 0 : _a.seek(this, 0);
                    this.ePlay.setAttribute('disabled', '');
                    this.eStop.removeAttribute('disabled');
                    const chup0 = () => {
                        var _a, _b;
                        (_a = this.glongSet) === null || _a === void 0 ? void 0 : _a.kill();
                        (_b = this.glongSet) === null || _b === void 0 ? void 0 : _b.chup(0, 1);
                        this.chupChupTimeout = window.setTimeout(chup1, 200);
                    };
                    const chup1 = () => {
                        var _a;
                        (_a = this.glongSet) === null || _a === void 0 ? void 0 : _a.chup(0, 1);
                        this.chupChupTimeout = window.setTimeout(chup2, this.bpmControl.msTickPeriod() * 8);
                    };
                    const chup2 = () => {
                        var _a;
                        (_a = this.glongSet) === null || _a === void 0 ? void 0 : _a.ching(0, 1);
                        this.chupChupTimeout = window.setTimeout(() => this.onPlay(), this.bpmControl.msTickPeriod() * 4);
                    };
                    chup0();
                }
                doPattern() {
                    var _a, _b;
                    if (this.drumPatternNext != null) {
                        this.drumPattern = appChing.drumPatternNext;
                        (_a = this.drumPattern) === null || _a === void 0 ? void 0 : _a.seek(this, Math.max(0, this.bpmControl.tick() - 1));
                        this.drumPatternNext = null;
                    }
                    (_b = this.drumPattern) === null || _b === void 0 ? void 0 : _b.tick(this);
                }
                onPlay() {
                    var _a, _b;
                    (_a = this.glongSet) === null || _a === void 0 ? void 0 : _a.kill();
                    this.bpmControl.stop();
                    this.bpmControl.change(this.getBpm(this.eBpm.value));
                    this.bpmControl.chunSet(Number(this.eChun.value));
                    (_b = this.drumPattern) === null || _b === void 0 ? void 0 : _b.seek(this, 0);
                    this.bpmControl.play();
                    this.eStop.removeAttribute('disabled');
                    this.ePlay.setAttribute('disabled', '');
                    assert_js_1.assert(this.gainMaster);
                    assert_js_1.assert(this.quietNoise);
                    this.quietNoise.connect(this.gainMaster);
                    if (this.analyserActive) {
                        assert_js_1.assert(this.analyser);
                        this.gainMaster.connect(this.analyser);
                    }
                }
                onStop() {
                    window.clearTimeout(this.chupChupTimeout);
                    this.chupChupTimeout = undefined;
                    this.eStop.disabled = true;
                    this.ePlay.disabled = false;
                    this.ePlayDelay.disabled = false;
                    assert_js_1.assert(this.quietNoise);
                    this.quietNoise.disconnect();
                }
                onTick() {
                    const currentTick = this.bpmControl.tick() - 1;
                    const divisorChun = 2 ** (this.bpmControl.chun + 1);
                    assert_js_1.assert(this.glongSet);
                    if (currentTick % divisorChun == 0) {
                        this.glongSet.chup(0, 1);
                    }
                    else if (currentTick % divisorChun == divisorChun / 2) {
                        this.glongSet.ching(0, 1);
                    }
                    window.setTimeout(() => {
                        this.eHong.value = (Math.floor(currentTick / 4) + 1).toString();
                        updateChingVis(this.eChingVises, Math.floor(currentTick / 2) % 4);
                    }, 50 // TBD: let the user tune this -- no reliable latency measure is available
                    );
                    this.doPattern();
                    return true;
                }
                async onGlongsetChange(nameSet) {
                    let glongSet;
                    assert_js_1.assert(this.audioCtx);
                    switch (nameSet) {
                        case "sampled":
                            glongSet = new glongset_js_1.GlongSetSampled(this.audioCtx, [
                                new instrument_js_1.Sample("chup-0.flac", cordova),
                                new instrument_js_1.Sample("chup-1.flac", cordova),
                                new instrument_js_1.Sample("chup-2.flac", cordova)
                            ], [
                                new instrument_js_1.Sample("ching-0.flac", cordova),
                                new instrument_js_1.Sample("ching-1.flac", cordova),
                                new instrument_js_1.Sample("ching-2.flac", cordova)
                            ], [
                                [
                                    new instrument_js_1.Sample("sormchai-ctum-0.flac", cordova),
                                    new instrument_js_1.Sample("sormchai-ctum-1.flac", cordova),
                                    new instrument_js_1.Sample("sormchai-ctum-2.flac", cordova)
                                ],
                                [
                                    new instrument_js_1.Sample("sormchai-dting-0.flac", cordova),
                                    new instrument_js_1.Sample("sormchai-dting-1.flac", cordova),
                                    new instrument_js_1.Sample("sormchai-dting-2.flac", cordova)
                                ],
                                [
                                    new instrument_js_1.Sample("sormchai-jor-0.flac", cordova),
                                    new instrument_js_1.Sample("sormchai-jor-1.flac", cordova),
                                    new instrument_js_1.Sample("sormchai-jor-2.flac", cordova)
                                ],
                                [
                                    new instrument_js_1.Sample("sormchai-jorng-0.flac", cordova),
                                    new instrument_js_1.Sample("sormchai-jorng-1.flac", cordova),
                                    new instrument_js_1.Sample("sormchai-jorng-2.flac", cordova)
                                ]
                            ], 0.75, 1.0, 1.0);
                            break;
                        case "synthesized":
                            glongSet = new glongset_js_1.GlongSetSynthesized(this.audioCtx);
                            break;
                        default:
                            throw MSG.errorGlongsetBad(nameSet);
                    }
                    await glongSet.init();
                    // Drumsets should reset detune on set change
                    this.tuneGlong.value = "50";
                    // Note: Javascript promises are asyncronous but not concurrent, so this block will only ever be executed by one
                    // process to completion. There is no danger here of loaded glongsets not having 'disconnect' called.
                    if (this.glongSet) {
                        this.glongSet.disconnect();
                    }
                    assert_js_1.assert(this.gainChing);
                    assert_js_1.assert(this.gainGlong);
                    glongSet.connect(this.gainChing, this.gainGlong);
                    this.glongSet = glongSet;
                }
                getBpm(anyVal) {
                    const numBpm = Number(anyVal);
                    if (numBpm != NaN) {
                        return numBpm;
                    }
                    else {
                        return this.bpmControl.bpm();
                    }
                }
                onBpmMod(evt) {
                    const e = evt.target;
                    assert_js_1.assert(e instanceof HTMLElement);
                    let bpm;
                    if (e.dataset.set) {
                        bpm = Number(e.dataset.set);
                    }
                    else if (e.dataset.scale) {
                        bpm = this.bpmControl.bpm() * Number(e.dataset.scale);
                    }
                    else {
                        bpm = this.bpmControl.bpm() + Number(e.dataset.increment);
                    }
                    this.eBpm.value = bpm.toString();
                    this.bpmControl.change(bpm);
                }
                onDrumPatternChange(value) {
                    const [tokens, error] = patterns.grammar.tokenize(value);
                    if (error) {
                        this.ePatternError.innerText = error;
                        this.ePatternError.classList.add("error-show");
                        return;
                    }
                    const [_, state, context] = patterns.grammar.parse(tokens, [new patterns_js_1.SegmentAction()]);
                    if (state.error) {
                        this.ePatternError.innerText = state.error + "\nat:\n" + state.context();
                        this.ePatternError.classList.add("error-show");
                        return;
                    }
                    this.ePatternError.classList.remove("error-show");
                    this.drumPatternNext = new DrumPattern(context);
                }
            };
            window.addEventListener("load", () => {
                document.addEventListener("deviceready", () => {
                    document.addEventListener("back", programStateSerialize);
                    document.addEventListener("pause", programStateSerialize);
                    document.addEventListener("resume", programStateDeserialize);
                    const errorEl = document.getElementById("error");
                    assert_js_1.assert(errorEl);
                    errorEl.addEventListener("click", function () { this.style.display = "none"; });
                    try {
                        programStateDeserialize();
                    }
                    catch (msg) {
                        error_handler_js_1.errorHandler("เจอปัญหาเมื่อโล๊ดสถานะโปรแกม: " + msg);
                    }
                    const allButtons = document.getElementsByTagName("button");
                    exports_1("appChing", appChing = new AppChing(demandById("bpm"), demandById("bpm-jing"), demandById("chun"), demandById("chun-jing"), demandById('tune-glong'), demandById("hong"), demandById("play"), demandById("stop"), demandById("play-delay"), [
                        demandById("ching-visualize-0"),
                        demandById("ching-visualize-1"),
                        demandById("ching-visualize-2"),
                        demandById("ching-visualize-3")
                    ], demandById("pattern-error")));
                    appChing.setupPreUserInteraction(demandById("pattern-drum", HTMLTextAreaElement), [
                        [demandById("pattern-none"), ""],
                        [demandById("pattern-lao"), patterns.pleyngDahmLao],
                        [demandById("pattern-khmen"), patterns.pleyngDahmKhmen],
                        [demandById("pattern-noyjaiyah"), patterns.dahmNoyJaiYah],
                        [demandById("pattern-omdeuk"), patterns.pleyngKhmenOmDteuk]
                    ]);
                    const setupAllButtons = () => {
                        // iPad needs to have its audio triggered from a user event. Run setup on any button. 
                        for (let i = 0; i < allButtons.length; ++i) {
                            allButtons[i].addEventListener("click", setupFunc);
                        }
                    };
                    const removeSetupAllButtons = () => {
                        for (let i = 0; i < allButtons.length; ++i) {
                            allButtons[i].removeEventListener("click", setupFunc);
                        }
                    };
                    const setupFunc = (e) => {
                        removeSetupAllButtons();
                        appChing.setup(demandById("analyser"), demandById("analyser-on"), demandById("analyser-off"), demandById("glongset"), demandById("play-ching-closed"), demandById("play-ching-open"), document.getElementsByClassName("play-drum"), document.getElementsByClassName("bpm-mod"), demandById('vol-glong'), demandById('vol-ching')).then(() => {
                            // Re-trigger the original click event as the setup function would have added new events.
                            assert_js_1.assert(e.target && e.target instanceof HTMLElement);
                            e.target.click();
                        }).catch(ex => {
                            e.preventDefault();
                            setupAllButtons();
                            error_handler_js_1.errorHandler(ex);
                        });
                    };
                    setupAllButtons();
                });
            });
        }
    };
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY2hpbmcuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi90cy9jaGluZy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7Ozs7Ozs7Ozs7Ozs7Ozs7OztFQW1CRTs7Ozs7SUFjRixTQUFTLE1BQU0sS0FBVSxPQUFRLE1BQWMsQ0FBQyxNQUFNLENBQUEsQ0FBQyxDQUFDO0lBSXhELFFBQVMsQ0FBQyxDQUFBLGVBQWUsQ0FBb0IsSUFBWSxFQUFFLEtBQWlCO1FBQzFFLE1BQU0sR0FBRyxHQUFHLFFBQVEsQ0FBQyxzQkFBc0IsQ0FBQyxJQUFJLENBQUMsQ0FBQTtRQUNqRCxJQUFJLEdBQUcsQ0FBQyxNQUFNLElBQUksQ0FBQztZQUNqQixNQUFLLENBQUMsMkJBQTJCLElBQUksR0FBRyxDQUFDLENBQUE7UUFFM0MsS0FBSyxJQUFJLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxHQUFHLEdBQUcsQ0FBQyxNQUFNLEVBQUUsRUFBRSxDQUFDLEVBQUU7WUFDbkMsa0JBQU0sQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLFlBQVksS0FBSyxDQUFDLENBQUE7WUFDL0IsTUFBTSxHQUFHLENBQUMsQ0FBQyxDQUFNLENBQUE7U0FDbEI7SUFDSCxDQUFDO0lBRUQsU0FBZ0IsV0FBVyxDQUF3QixFQUFVLEVBQUUsS0FBaUIsRUFBRSxJQUFtQjtRQUNuRyxJQUFJLENBQUMsVUFBVSxDQUFDLEVBQUUsRUFBRSxLQUFLLENBQUMsQ0FBQyxDQUFBO0lBQzdCLENBQUM7O0lBRUQsU0FBZ0IsVUFBVSxDQUFvQyxFQUFVLEVBQUUsS0FBa0I7UUFDMUYsTUFBTSxNQUFNLEdBQVEsS0FBSyxhQUFMLEtBQUssY0FBTCxLQUFLLEdBQUksV0FBVyxDQUFBO1FBRXhDLE1BQU0sTUFBTSxHQUFHLFFBQVEsQ0FBQyxjQUFjLENBQUMsRUFBRSxDQUFDLENBQUE7UUFDMUMsSUFBSSxNQUFNLElBQUksU0FBUyxFQUFFO1lBQ3ZCLE1BQU0sSUFBSSxLQUFLLENBQUMsWUFBWSxF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QUFBO2dCQUNuQixDQUFDLENBQUMsQ0FBQTtZQUNKLENBQUMsQ0FBQyxDQUFBIiwic291cmNlc0NvbnRlbnQiOlsiLypcblx04LmA4LiE4Lij4Li34LmI4Lit4LiH4LiJ4Li04LmI4LiHIC8gS3JldXVuZyBDaGluZ1xuICBUaGlzIGZpbGUgaXMgcGFydCBvZiB0aGUgQXV0b21hdGljIENoaW5nIHByb2dyYW0gZm9yIHByYWN0aWNpbmdcbiAgVGhhaSBtdXNpYy5cbiAgXG4gIENvcHlyaWdodCAoQykgMjAxOSBEYXZpZCBCZXN3aWNrIDxkbGJlc3dpY2tAZ21haWwuY29tPlxuXG4gIFRoaXMgcHJvZ3JhbSBpcyBmcmVlIHNvZnR3YXJlOiB5b3UgY2FuIHJlZGlzdHJpYnV0ZSBpdCBhbmQvb3IgbW9kaWZ5XG4gIGl0IHVuZGVyIHRoZSB0ZXJtcyBvZiB0aGUgR05VIEFmZmVybyBHZW5lcmFsIFB1YmxpYyBMaWNlbnNlIGFzXG4gIHB1Ymxpc2hlZCBieSB0aGUgRnJlZSBTb2Z0d2FyZSBGb3VuZGF0aW9uLCBlaXRoZXIgdmVyc2lvbiAzIG9mIHRoZVxuICBMaWNlbnNlLCBvciAoYXQgeW91ciBvcHRpb24pIGFueSBsYXRlciB2ZXJzaW9uLlxuXG4gIFRoaXMgcHJvZ3JhbSBpcyBkaXN0cmlidXRlZCBpbiB0aGUgaG9wZSB0aGF0IGl0IHdpbGwgYmUgdXNlZnVsLFxuICBidXQgV0lUSE9VVCBBTlkgV0FSUkFOVFk7IHdpdGhvdXQgZXZlbiB0aGUgaW1wbGllZCB3YXJyYW50eSBvZlxuICBNRVJDSEFOVEFCSUxJVFkgb3IgRklUTkVTUyBGT1IgQSBQQVJUSUNVTEFSIFBVUlBPU0UuICBTZWUgdGhlXG4gIEdOVSBBZmZlcm8gR2VuZXJhbCBQdWJsaWMgTGljZW5zZSBmb3IgbW9yZSBkZXRhaWxzLlxuXG4gIFlvdSBzaG91bGQgaGF2ZSByZWNlaXZlZCBhIGNvcHkgb2YgdGhlIEdOVSBBZmZlcm8gR2VuZXJhbCBQdWJsaWMgTGljZW5zZVxuICBhbG9uZyB3aXRoIHRoaXMgcHJvZ3JhbS4gIElmIG5vdCwgc2VlIDxodHRwczovL3d3dy5nbnUub3JnL2xpY2Vuc2VzLz4uXG4qL1xuXG5pbXBvcnQgeyBCcG1Db250cm9sIH0gZnJvbSBcIi4vYnBtLmpzXCJcbmltcG9ydCB7IEdsb25nU2V0LCBHbG9uZ1NldFNhbXBsZWQsIEdsb25nU2V0U3ludGhlc2l6ZWQgfSBmcm9tIFwiLi9nbG9uZ3NldC5qc1wiXG5pbXBvcnQgeyBTYW1wbGUgfSBmcm9tIFwiLi9pbnN0cnVtZW50LmpzXCJcbmltcG9ydCB7IFNlZ21lbnRBY3Rpb24gfSBmcm9tIFwiLi9wYXR0ZXJucy5qc1wiXG5cbmltcG9ydCB7IGFzc2VydCB9IGZyb20gXCIuL2xpYi9hc3NlcnQuanNcIlxuaW1wb3J0IHsgZXJyb3JIYW5kbGVyIH0gZnJvbSBcIi4vbGliL2Vycm9yX2hhbmRsZXIuanNcIlxuXG5pbXBvcnQgKiBhcyBtZXNzYWdlcyBmcm9tIFwiLi9tZXNzYWdlcy5qc1wiXG5pbXBvcnQgKiBhcyBwYXR0ZXJucyBmcm9tIFwiLi9wYXR0ZXJucy5qc1wiXG5cbnZhciBjb3Jkb3ZhOiBhbnkgPSAod2luZG93IGFzIGFueSkuY29yZG92YVxuZnVuY3Rpb24gZGV2aWNlKCk6IGFueSB7IHJldHVybiAod2luZG93IGFzIGFueSkuZGV2aWNlIH1cblxuY29uc3QgTVNHID0gbWVzc2FnZXMubWFrZU11bHRpbGluZ3VhbChbbmV3IG1lc3NhZ2VzLk1lc3NhZ2VzVGhhaSgpLCBuZXcgbWVzc2FnZXMuTWVzc2FnZXNFbmdsaXNoKCldKVxuXG5mdW5jdGlvbiAqY2xhc3NEZW1hbmRFYWNoPFQgZXh0ZW5kcyBFbGVtZW50PihuYW1lOiBzdHJpbmcsIGNuc3RyOiBuZXcoKSA9PiBUKSB7XG4gIGNvbnN0IGVscyA9IGRvY3VtZW50LmdldEVsZW1lbnRzQnlDbGFzc05hbWUobmFtZSlcbiAgaWYgKGVscy5sZW5ndGggPT0gMClcbiAgICB0aHJvdyhgTm8gZWxlbWVudHMgd2l0aCBjbGFzcyAnJHtuYW1lfSdgKVxuICBcbiAgZm9yIChsZXQgaSA9IDA7IGkgPCBlbHMubGVuZ3RoOyArK2kpIHtcbiAgICBhc3NlcnQoZWxzW2ldIGluc3RhbmNlb2YgY25zdHIpXG4gICAgeWllbGQgZWxzW2ldIGFzIFRcbiAgfVxufVxuXG5leHBvcnQgZnVuY3Rpb24gd2l0aEVsZW1lbnQ8VCBleHRlbmRzIEhUTUxFbGVtZW50PihpZDogc3RyaW5nLCBrbGFzczogbmV3KCkgPT4gVCwgZnVuYzoodDogVCkgPT4gdm9pZCkge1xuICBmdW5jKGRlbWFuZEJ5SWQoaWQsIGtsYXNzKSlcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGRlbWFuZEJ5SWQ8VCBleHRlbmRzIEhUTUxFbGVtZW50PUhUTUxFbGVtZW50PihpZDogc3RyaW5nLCBrbGFzcz86IG5ldygpID0+IFQpOiBUIHtcbiAgY29uc3Qga2xhc3NfOiBhbnkgPSBrbGFzcyA/PyBIVE1MRWxlbWVudFxuICBcbiAgY29uc3QgcmVzdWx0ID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoaWQpXG4gIGlmIChyZXN1bHQgPT0gdW5kZWZpbmVkKSB7XG4gICAgdGhyb3cgbmV3IEVycm9yKGBFbGVtZW50ICcke2lkfScgbm90IGZvdW5kYClcbiAgfSBlbHNlIGlmICghKHJlc3VsdCBpbnN0YW5jZW9mIGtsYXNzXykpIHtcbiAgICB0aHJvdyBuZXcgRXJyb3IoYEVsZW1lbnQgJyR7aWR9JyBpcyBub3QgJyR7a2xhc3N9JywgYnV0IGlzICcke3Jlc3VsdC5jb25zdHJ1Y3Rvci5uYW1lfSdgKVxuICB9IGVsc2Uge1xuICAgIHJldHVybiByZXN1bHQgYXMgVFxuICB9XG59XG5cbndpbmRvdy5vbmVycm9yID0gZXJyb3JIYW5kbGVyXG5cbmV4cG9ydCBjbGFzcyBEcnVtUGF0dGVybiB7XG4gIHByaXZhdGUgc2VnbWVudElkeCA9IC0xXG4gIHByaXZhdGUgbGVuZ3RoVGlja3M6IG51bWJlclxuICBcbiAgY29uc3RydWN0b3IocHJpdmF0ZSByZWFkb25seSBzZWdtZW50czogU2VnbWVudEFjdGlvbltdKSB7XG4gICAgdGhpcy5sZW5ndGhUaWNrcyA9IHNlZ21lbnRzLnJlZHVjZSgoYWNjLCBzYSkgPT4gYWNjICsgKHNhLnNwYW4gPyBzYS5zcGFuLmxlbmd0aCgpIDogMCksIDApXG4gIH1cblxuICBzZWVrKGFwcDogQXBwQ2hpbmcsIHRpY2s6IG51bWJlcikge1xuICAgIHRpY2sgPSB0aGlzLmxlbmd0aFRpY2tzID8gdGljayAlIHRoaXMubGVuZ3RoVGlja3MgOiAwXG4gICAgXG4gICAgZm9yICh0aGlzLnNlZ21lbnRJZHggPSAwOyB0aGlzLnNlZ21lbnRJZHggPCB0aGlzLnNlZ21lbnRzLmxlbmd0aDsgKyt0aGlzLnNlZ21lbnRJZHgpIHtcbiAgICAgIGNvbnN0IHNlZ21lbnQgPSB0aGlzLnNlZ21lbnRzW3RoaXMuc2VnbWVudElkeF1cbiAgICAgIFxuICAgICAgaWYgKGFwcC5icG1Db250cm9sLnBsYXlpbmcpXG4gICAgICAgIGZvciAoY29uc3QgaSBvZiBzZWdtZW50Lmluc3RhbnRzKVxuICAgICAgICAgIGkucnVuKGFwcC5icG1Db250cm9sLCB0aGlzLnNlZ21lbnRJZHggPT0gMClcbiAgICAgIFxuICAgICAgaWYgKHNlZ21lbnQuc3Bhbikge1xuICAgICAgICBpZiAodGljayA8IHNlZ21lbnQuc3Bhbi5sZW5ndGgoKSkge1xuICAgICAgICAgIHNlZ21lbnQuc3Bhbi5zZWVrKHRpY2spXG4gICAgICAgICAgYnJlYWtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICB0aWNrID0gTWF0aC5tYXgoMCwgdGljayAtIHNlZ21lbnQuc3Bhbi5sZW5ndGgoKSlcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIHRpY2soYXBwOiBBcHBDaGluZykge1xuICAgIGlmICh0aGlzLmxlbmd0aFRpY2tzID09IDApXG4gICAgICByZXR1cm5cblxuICAgIGNvbnN0IHNlZ21lbnQgPSB0aGlzLnNlZ21lbnRzW3RoaXMuc2VnbWVudElkeF1cbiAgICBhc3NlcnQoc2VnbWVudClcblxuICAgIGlmIChhcHAuZ2xvbmdTZXQpIHtcbiAgICAgIGlmICghc2VnbWVudC5zcGFuIHx8IHNlZ21lbnQuc3Bhbi50aWNrKGFwcC5nbG9uZ1NldCwgYXBwLmJwbUNvbnRyb2wpKSB7XG4gICAgICAgIHRoaXMuc2VnbWVudElkeCA9ICh0aGlzLnNlZ21lbnRJZHggKyAxKSAlIHRoaXMuc2VnbWVudHMubGVuZ3RoXG4gICAgICAgIHRoaXMuc2VnbWVudHNbdGhpcy5zZWdtZW50SWR4XS5zcGFuPy5zZWVrKDApXG4gICAgICAgIHRoaXMuc2VnbWVudHNbdGhpcy5zZWdtZW50SWR4XS5zcGFuPy50aWNrKGFwcC5nbG9uZ1NldCwgYXBwLmJwbUNvbnRyb2wpXG4gICAgICAgIGZvciAoY29uc3QgaSBvZiB0aGlzLnNlZ21lbnRzW3RoaXMuc2VnbWVudElkeF0uaW5zdGFudHMpXG4gICAgICAgICAgaS5ydW4oYXBwLmJwbUNvbnRyb2wsIChhcHAuYnBtQ29udHJvbC50aWNrKCkgJSB0aGlzLmxlbmd0aFRpY2tzKSA9PSAwKVxuICAgICAgfVxuICAgIH1cbiAgfVxufVxuXG5jbGFzcyBBcHBDaGluZyB7XG4gIGFuYWx5c2VyQWN0aXZlID0gZmFsc2VcbiAgZHJ1bVBhdHRlcm46IERydW1QYXR0ZXJufG51bGwgPSBudWxsXG4gIGRydW1QYXR0ZXJuTmV4dDogRHJ1bVBhdHRlcm58bnVsbCA9IG51bGxcbiAgcmVhZG9ubHkgYnBtQ29udHJvbDogQnBtQ29udHJvbFxuXG4gIHByaXZhdGUgZ2xvbmdTZXREZXR1bmU6IG51bWJlciA9IDBcbiAgZ2xvbmdTZXQ/OiBHbG9uZ1NldFxuICBcbiAgcHJpdmF0ZSBhdWRpb0N0eD86IEF1ZGlvQ29udGV4dFxuICBwcml2YXRlIGFuYWx5c2VyPzogQW5hbHlzZXJOb2RlXG4gIHByaXZhdGUgZ2FpbkNoaW5nPzogR2Fpbk5vZGVcbiAgcHJpdmF0ZSBnYWluR2xvbmc/OiBHYWluTm9kZVxuICBwcml2YXRlIGdhaW5NYXN0ZXI/OiBHYWluTm9kZVxuICBwcml2YXRlIHF1aWV0Tm9pc2U/OiBBdWRpb0J1ZmZlclNvdXJjZU5vZGVcblxuICBwcml2YXRlIGNodXBDaHVwVGltZW91dD86IG51bWJlclxuICBcbiAgY29uc3RydWN0b3IoXG4gICAgcHJpdmF0ZSByZWFkb25seSBlQnBtOiBIVE1MSW5wdXRFbGVtZW50LFxuICAgIHByaXZhdGUgcmVhZG9ubHkgZUJwbUppbmc6IEhUTUxJbnB1dEVsZW1lbnQsXG4gICAgcHJpdmF0ZSByZWFkb25seSBlQ2h1bjogSFRNTElucHV0RWxlbWVudCxcbiAgICBwcml2YXRlIHJlYWRvbmx5IGVDaHVuSmluZzogSFRNTElucHV0RWxlbWVudCxcbiAgICBwcml2YXRlIHJlYWRvbmx5IHR1bmVHbG9uZzogSFRNTElucHV0RWxlbWVudCxcbiAgICBwcml2YXRlIHJlYWRvbmx5IGVIb25nOiBIVE1MSW5wdXRFbGVtZW50LFxuICAgIHByaXZhdGUgcmVhZG9ubHkgZVBsYXk6IEhUTUxCdXR0b25FbGVtZW50LFxuICAgIHByaXZhdGUgcmVhZG9ubHkgZVN0b3A6IEhUTUxCdXR0b25FbGVtZW50LFxuICAgIHByaXZhdGUgcmVhZG9ubHkgZVBsYXlEZWxheTogSFRNTEJ1dHRvbkVsZW1lbnQsXG4gICAgcHJpdmF0ZSByZWFkb25seSBlQ2hpbmdWaXNlczogSFRNTEVsZW1lbnRbXSxcbiAgICBwcml2YXRlIHJlYWRvbmx5IGVQYXR0ZXJuRXJyb3I6IEhUTUxFbGVtZW50XG4gICkge1xuICAgIHRoaXMuZVN0b3Auc2V0QXR0cmlidXRlKCdkaXNhYmxlZCcsICcnKVxuICAgIHRoaXMuYnBtQ29udHJvbCA9IG5ldyBCcG1Db250cm9sKGVCcG1KaW5nLCBlQ2h1bkppbmcsIHRoaXMub25UaWNrLmJpbmQodGhpcyksIHRoaXMub25TdG9wLmJpbmQodGhpcykpXG4gIH1cblxuICBzZXR1cFByZVVzZXJJbnRlcmFjdGlvbihcbiAgICBwYXR0ZXJuRHJ1bTogSFRNTFRleHRBcmVhRWxlbWVudCxcbiAgICBwcmVzZXRzRHJ1bVBhdHRlcm46W0hUTUxFbGVtZW50LHN0cmluZ11bXVxuICApIHtcbiAgICBjb25zdCBzZWxlY3QgPSBkZW1hbmRCeUlkKFwicGF0dGVybnMtdXNlclwiLCBIVE1MU2VsZWN0RWxlbWVudClcbiAgICBjb25zdCBkZWwgPSBkZW1hbmRCeUlkKFwicGF0dGVybi1kZWxcIiwgSFRNTEJ1dHRvbkVsZW1lbnQpXG5cbiAgICBkZWwuYWRkRXZlbnRMaXN0ZW5lcihcImNsaWNrXCIsICgpID0+IHtcbiAgICAgIHdpbmRvdy5sb2NhbFN0b3JhZ2UucmVtb3ZlSXRlbShzZWxlY3QudmFsdWUpXG4gICAgICB0aGlzLnVzZXJQYXR0ZXJuc1VwZGF0ZSgpXG4gICAgICBkZWwuZGlzYWJsZWQgPSB0cnVlXG4gICAgfSlcbiAgICBcbiAgICBjb25zdCBkbGcgPSBkZW1hbmRCeUlkKFwiZGlhbG9nLXNhdmVcIilcbiAgICBjb25zdCBzYXZlID0gZGxnLmdldEVsZW1lbnRzQnlDbGFzc05hbWUoXCJzYXZlXCIpWzBdIGFzIEhUTUxCdXR0b25FbGVtZW50XG4gICAgY29uc3QgaW5wdXQgPSBkbGcuZ2V0RWxlbWVudHNCeVRhZ05hbWUoXCJpbnB1dFwiKVswXSBhcyBIVE1MSW5wdXRFbGVtZW50XG5cbiAgICBjb25zdCBvbkNoYW5nZSA9ICgpID0+IHsgc2F2ZS5kaXNhYmxlZCA9ICFpbnB1dC52YWx1ZSB9XG4gICAgaW5wdXQuYWRkRXZlbnRMaXN0ZW5lcihcImlucHV0XCIsIG9uQ2hhbmdlKVxuXG4gICAgZGVtYW5kQnlJZChcInBhdHRlcm4tc2F2ZVwiKS5hZGRFdmVudExpc3RlbmVyKFwiY2xpY2tcIiwgKCkgPT4ge1xuICAgICAgZGxnLmNsYXNzTGlzdC5hZGQoXCJtb2RhbC1zaG93XCIpXG4gICAgICBpbnB1dC52YWx1ZSA9IHNlbGVjdC52YWx1ZSA/IHNlbGVjdC5zZWxlY3RlZE9wdGlvbnNbMF0uaW5uZXJUZXh0IDogJydcbiAgICAgIG9uQ2hhbmdlKClcbiAgICB9KVxuXG4gICAgZGxnLmdldEVsZW1lbnRzQnlDbGFzc05hbWUoXCJjYW5jZWxcIilbMF0uYWRkRXZlbnRMaXN0ZW5lcihcImNsaWNrXCIsICgpID0+IGRsZy5jbGFzc0xpc3QucmVtb3ZlKFwibW9kYWwtc2hvd1wiKSlcblxuICAgIHNhdmUuYWRkRXZlbnRMaXN0ZW5lcihcImNsaWNrXCIsICgpID0+IHtcbiAgICAgIGRsZy5jbGFzc0xpc3QucmVtb3ZlKFwibW9kYWwtc2hvd1wiKVxuICAgICAgdGhpcy5vblNhdmVQYXR0ZXJuKGlucHV0LnZhbHVlLCBwYXR0ZXJuRHJ1bS52YWx1ZSlcbiAgICAgIHNlbGVjdC52YWx1ZSA9IFwicGxleW5nLVwiICsgaW5wdXQudmFsdWVcbiAgICB9KVxuXG4gICAgc2VsZWN0LmFkZEV2ZW50TGlzdGVuZXIoXG4gICAgICBcImNoYW5nZVwiLFxuICAgICAgKCkgPT4ge1xuICAgICAgICB3aW5kb3cubG9jYWxTdG9yYWdlLnNldEl0ZW0oXCJzZWxlY3RlZC1wbGV5bmdcIiwgc2VsZWN0LnZhbHVlKVxuICAgICAgICBwYXR0ZXJuRHJ1bS52YWx1ZSA9IHdpbmRvdy5sb2NhbFN0b3JhZ2UuZ2V0SXRlbShzZWxlY3QudmFsdWUpIVxuICAgICAgICB0aGlzLm9uRHJ1bVBhdHRlcm5DaGFuZ2UocGF0dGVybkRydW0udmFsdWUpXG4gICAgICAgIGRlbC5kaXNhYmxlZCA9IHNlbGVjdC5zZWxlY3RlZEluZGV4ID09IDBcbiAgICAgIH1cbiAgICApXG5cbiAgICB0aGlzLnVzZXJQYXR0ZXJuc1VwZGF0ZSgpXG5cbiAgICBzZWxlY3QudmFsdWUgPSB3aW5kb3cubG9jYWxTdG9yYWdlLmdldEl0ZW0oXCJzZWxlY3RlZC1wbGV5bmdcIikgPz8gJydcbiAgICBkZWwuZGlzYWJsZWQgPSBzZWxlY3Quc2VsZWN0ZWRJbmRleCA9PSAwXG4gICAgcGF0dGVybkRydW0udmFsdWUgPSB3aW5kb3cubG9jYWxTdG9yYWdlLmdldEl0ZW0oc2VsZWN0LnZhbHVlKSFcblxuICAgIHBhdHRlcm5EcnVtLmFkZEV2ZW50TGlzdGVuZXIoXCJjaGFuZ2VcIiwgKCkgPT4gdGhpcy5vbkRydW1QYXR0ZXJuQ2hhbmdlKHBhdHRlcm5EcnVtLnZhbHVlKSlcbiAgICBcbiAgICBmb3IgKGxldCBbZWxlbWVudCwgcGF0dGVybl0gb2YgcHJlc2V0c0RydW1QYXR0ZXJuKSB7XG4gICAgICBlbGVtZW50LmFkZEV2ZW50TGlzdGVuZXIoXCJjbGlja1wiLCAoKSA9PiB7XG4gICAgICAgIHBhdHRlcm5EcnVtLnZhbHVlID0gcGF0dGVyblxuICAgICAgICB0aGlzLm9uRHJ1bVBhdHRlcm5DaGFuZ2UocGF0dGVybkRydW0udmFsdWUpXG4gICAgICAgIHNlbGVjdC5zZWxlY3RlZEluZGV4ID0gMFxuICAgICAgICBkZWwuZGlzYWJsZWQgPSB0cnVlXG4gICAgICB9KVxuICAgIH1cblxuICAgIHRoaXMub25EcnVtUGF0dGVybkNoYW5nZShwYXR0ZXJuRHJ1bS52YWx1ZSlcbiAgfVxuICBcbiAgYXN5bmMgc2V0dXAoXG4gICAgZUFuYWx5c2VyOiBIVE1MQ2FudmFzRWxlbWVudCxcbiAgICBlQW5hbHlzZXJPbjogSFRNTEJ1dHRvbkVsZW1lbnQsXG4gICAgZUFuYWx5c2VyT2ZmOiBIVE1MQnV0dG9uRWxlbWVudCxcbiAgICBlR2xvbmdTZWxlY3Q6IEhUTUxTZWxlY3RFbGVtZW50LFxuICAgIGVQbGF5Q2hpbmdDbG9zZWQ6IEhUTUxCdXR0b25FbGVtZW50LFxuICAgIGVQbGF5Q2hpbmdPcGVuOiBIVE1MQnV0dG9uRWxlbWVudCxcbiAgICBlUGxheUdsb25nczogSFRNTENvbGxlY3Rpb25PZjxFbGVtZW50PixcbiAgICBicG1Nb2RzOiBIVE1MQ29sbGVjdGlvbk9mPEVsZW1lbnQ+LFxuICAgIGdhaW5HbG9uZzogSFRNTElucHV0RWxlbWVudCxcbiAgICBnYWluQ2hpbmc6IEhUTUxJbnB1dEVsZW1lbnRcbiAgKSB7XG4gICAgbGV0IGF1ZGlvQ3R4OiBBdWRpb0NvbnRleHRcbiAgICB0cnkge1xuICAgICAgYXVkaW9DdHggPSBuZXcgKCg8YW55PndpbmRvdykuQXVkaW9Db250ZXh0IHx8ICg8YW55PndpbmRvdykud2Via2l0QXVkaW9Db250ZXh0KSgpXG4gICAgfSBjYXRjaChlKSB7XG4gICAgICBpZiAoZGV2aWNlKCkucGxhdGZvcm0gPT0gJ2Jyb3dzZXInKSB7XG4gICAgICAgIHRocm93IE1TRy5lcnJvckF1ZGlvQ29udGV4dFdlYihlKVxuICAgICAgfSBlbHNlIHtcbiAgICAgICAgdGhyb3cgTVNHLmVycm9yQXVkaW9Db250ZXh0QW5kcm9pZChlKVxuICAgICAgfVxuICAgIH1cbiAgICB0aGlzLmF1ZGlvQ3R4ID0gYXVkaW9DdHhcbiAgICBcbiAgICB0aGlzLmdhaW5NYXN0ZXIgPSBhdWRpb0N0eC5jcmVhdGVHYWluKClcbiAgICB0aGlzLmdhaW5NYXN0ZXIuZ2Fpbi52YWx1ZSA9IDAuNVxuICAgIHRoaXMuZ2Fpbk1hc3Rlci5jb25uZWN0KGF1ZGlvQ3R4LmRlc3RpbmF0aW9uKVxuXG4gICAgdGhpcy5nYWluR2xvbmcgPSBhdWRpb0N0eC5jcmVhdGVHYWluKClcbiAgICB0aGlzLmdhaW5HbG9uZy5jb25uZWN0KHRoaXMuZ2Fpbk1hc3RlcilcblxuICAgIHRoaXMuZ2FpbkNoaW5nID0gYXVkaW9DdHguY3JlYXRlR2FpbigpXG4gICAgdGhpcy5nYWluQ2hpbmcuY29ubmVjdCh0aGlzLmdhaW5NYXN0ZXIpXG5cbiAgICBlR2xvbmdTZWxlY3QuYWRkRXZlbnRMaXN0ZW5lcihcImNoYW5nZVwiLCAoKSA9PiB0aGlzLm9uR2xvbmdzZXRDaGFuZ2UoZUdsb25nU2VsZWN0LnZhbHVlKSlcbiAgICBhd2FpdCB0aGlzLm9uR2xvbmdzZXRDaGFuZ2UoZUdsb25nU2VsZWN0LnZhbHVlKVxuXG4gICAgaGFuZGxlU2xpZGVyVXBkYXRlKHRoaXMudHVuZUdsb25nLCAoYWxwaGEsIGluaXQpID0+IHtcbiAgICAgIHRoaXMuZ2xvbmdTZXREZXR1bmUgPSAtMTAwMCArIGFscGhhICogMjAwMC4wXG5cbiAgICAgIGFzc2VydCh0aGlzLmdsb25nU2V0KVxuICAgICAgdGhpcy5nbG9uZ1NldC5kZXR1bmUodGhpcy5nbG9uZ1NldERldHVuZSlcbiAgICB9KVxuICAgIFxuICAgIHRoaXMuYW5hbHlzZXIgPSBhdWRpb0N0eC5jcmVhdGVBbmFseXNlcigpXG4gICAgdHJ5IHtcbiAgICAgIHRoaXMuYW5hbHlzZXIuZmZ0U2l6ZSA9IDIwNDhcbiAgICB9IGNhdGNoKGUpIHtcbiAgICAgIC8vIGlQaG9uZSBoYXMgYSBtYXggZmZ0IHNpemUgMjA0OD9cbiAgICB9XG5cbiAgICAvLyBCcm93c2VycyBjYW4gc29tZXRpbWVzIGZsaXAgdGhlIGF1ZGlvIG91dHB1dCBvZmYgZHVyaW5nIHF1aWV0IHBlcmlvZHMsIHdoaWNoIGlzIGFubm95aW5nIG9uIG1vYmlsZS5cbiAgICAvLyBBZGQgYSBiaXQgb2YgaW5hdWRpYmxlIG5vaXNlIHRvIGtlZXAgdGhlIGNoYW5uZWwgb3BlbiB3aGlsZSBwbGF5aW5nIGlzIGFjdGl2YXRlZC5cbiAgICBjb25zdCBxdWlldE5vaXNlQnVmZmVyID0gYXVkaW9DdHguY3JlYXRlQnVmZmVyKDEsIGF1ZGlvQ3R4LnNhbXBsZVJhdGUgKiAwLjI1LCBhdWRpb0N0eC5zYW1wbGVSYXRlKTtcbiAgICBjb25zdCBxdWlldE5vaXNlQnVmZmVyRGF0YSA9IHF1aWV0Tm9pc2VCdWZmZXIuZ2V0Q2hhbm5lbERhdGEoMCk7XG4gICAgZm9yICh2YXIgaSA9IDA7IGkgPCBxdWlldE5vaXNlQnVmZmVyLmxlbmd0aDsgaSs9YXVkaW9DdHguc2FtcGxlUmF0ZSAvIDEwMCkge1xuICAgICAgcXVpZXROb2lzZUJ1ZmZlckRhdGFbTWF0aC5mbG9vcihpKV0gPSAoLTEgKyBNYXRoLnJhbmRvbSgpICogMikgKiAwLjAwMDAxO1xuICAgIH1cbiAgICB0aGlzLnF1aWV0Tm9pc2UgPSBhdWRpb0N0eC5jcmVhdGVCdWZmZXJTb3VyY2UoKVxuICAgIHRoaXMucXVpZXROb2lzZS5idWZmZXIgPSBxdWlldE5vaXNlQnVmZmVyXG4gICAgdGhpcy5xdWlldE5vaXNlLmxvb3AgPSB0cnVlXG4gICAgdGhpcy5xdWlldE5vaXNlLmxvb3BFbmQgPSAwLjI1XG4gICAgdGhpcy5xdWlldE5vaXNlLnN0YXJ0KClcblxuICAgIHRoaXMuYnBtQ29udHJvbC5jaGFuZ2UoTnVtYmVyKHRoaXMuZUJwbS52YWx1ZSkgfHwgNzApXG4gICAgXG4gICAgdGhpcy5lUGxheS5hZGRFdmVudExpc3RlbmVyKFwiY2xpY2tcIiwgdGhpcy5vblBsYXkuYmluZCh0aGlzKSlcbiAgICB0aGlzLmVQbGF5RGVsYXkuYWRkRXZlbnRMaXN0ZW5lcihcImNsaWNrXCIsIHRoaXMub25QbGF5RGVsYXkuYmluZCh0aGlzKSlcblxuICAgIHRoaXMuZVN0b3AuYWRkRXZlbnRMaXN0ZW5lcihcImNsaWNrXCIsIHRoaXMuYnBtQ29udHJvbC5zdG9wLmJpbmQodGhpcy5icG1Db250cm9sKSlcblxuICAgIHRoaXMuZUNodW4uYWRkRXZlbnRMaXN0ZW5lcihcImNoYW5nZVwiLCBlID0+IHtcbiAgICAgIHRoaXMuYnBtQ29udHJvbC5jaHVuU2V0KE51bWJlcih0aGlzLmVDaHVuLnZhbHVlKSlcbiAgICB9KVxuICAgIFxuICAgIHRoaXMuZUJwbS5hZGRFdmVudExpc3RlbmVyKFwiY2hhbmdlXCIsIGUgPT4ge1xuICAgICAgdGhpcy5icG1Db250cm9sLmNoYW5nZSh0aGlzLmdldEJwbSh0aGlzLmVCcG0udmFsdWUpKVxuICAgIH0pXG5cbiAgICBlQW5hbHlzZXJPbi5hZGRFdmVudExpc3RlbmVyKFwiY2xpY2tcIiwgZSA9PiB7XG4gICAgICB0aGlzLmFuYWx5c2VyQWN0aXZlID0gdHJ1ZVxuICAgICAgZUFuYWx5c2VyT24uc2V0QXR0cmlidXRlKCdkaXNhYmxlZCcsICcnKVxuICAgICAgZUFuYWx5c2VyT2ZmLnJlbW92ZUF0dHJpYnV0ZSgnZGlzYWJsZWQnKVxuICAgICAgXG4gICAgICBhc3NlcnQodGhpcy5nYWluTWFzdGVyKVxuICAgICAgYXNzZXJ0KHRoaXMuYW5hbHlzZXIpXG4gICAgICB0aGlzLmdhaW5NYXN0ZXIuY29ubmVjdCh0aGlzLmFuYWx5c2VyKVxuXG4gICAgICB3aW5kb3cucmVxdWVzdEFuaW1hdGlvbkZyYW1lKCh0aW1lKSA9PiB7XG4gICAgICAgIGFzc2VydCh0aGlzLmFuYWx5c2VyKVxuICAgICAgICBcbiAgICAgICAgY29uc3QgY3R4ID0gZUFuYWx5c2VyLmdldENvbnRleHQoJzJkJylcbiAgICAgICAgYXNzZXJ0KGN0eClcbiAgICAgICAgXG4gICAgICAgIGFuYWx5c2VyRHJhdyh0aW1lLCB0aGlzLmFuYWx5c2VyLCBjdHgpXG4gICAgICB9KVxuICAgIH0pXG4gICAgXG4gICAgZUFuYWx5c2VyT2ZmLmFkZEV2ZW50TGlzdGVuZXIoXCJjbGlja1wiLCBlID0+IHtcbiAgICAgIHRoaXMuYW5hbHlzZXJBY3RpdmUgPSBmYWxzZVxuICAgICAgZUFuYWx5c2VyT2ZmLnNldEF0dHJpYnV0ZSgnZGlzYWJsZWQnLCcnKTtcbiAgICAgIGVBbmFseXNlck9uLnJlbW92ZUF0dHJpYnV0ZSgnZGlzYWJsZWQnKTtcblxuICAgICAgaWYgKHRoaXMuZ2Fpbk1hc3RlciAmJiB0aGlzLmFuYWx5c2VyKVxuICAgICAgICB0aGlzLmdhaW5NYXN0ZXIuZGlzY29ubmVjdCh0aGlzLmFuYWx5c2VyKVxuICAgIH0pXG4gICAgXG4gICAgZUFuYWx5c2VyT2ZmLnNldEF0dHJpYnV0ZSgnZGlzYWJsZWQnLCcnKVxuXG4gICAgZVBsYXlDaGluZ09wZW4uYWRkRXZlbnRMaXN0ZW5lcihcImNsaWNrXCIsIGUgPT4gdGhpcy5nbG9uZ1NldD8uY2h1cCgwLCAxKSApO1xuICAgIGVQbGF5Q2hpbmdDbG9zZWQuYWRkRXZlbnRMaXN0ZW5lcihcImNsaWNrXCIsIGUgPT4gdGhpcy5nbG9uZ1NldD8uY2hpbmcoMCwxKSApO1xuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgZVBsYXlHbG9uZ3MubGVuZ3RoOyArK2kpXG4gICAgICBlUGxheUdsb25nc1tpXS5hZGRFdmVudExpc3RlbmVyKFwiY2xpY2tcIiwgZSA9PiB0aGlzLmdsb25nU2V0Py5nbG9uZygwLCAxLCBpKSApO1xuXG4gICAgZm9yIChsZXQgW2N0bCwgZ2Fpbl0gb2YgW1tnYWluR2xvbmcsIHRoaXMuZ2Fpbkdsb25nXSwgW2dhaW5DaGluZywgdGhpcy5nYWluQ2hpbmddXSBhcyBjb25zdCkge1xuICAgICAgaGFuZGxlU2xpZGVyVXBkYXRlKFxuICAgICAgICBjdGwsXG4gICAgICAgIChhbHBoYSwgaW5pdCkgPT4ge1xuICAgICAgICAgIGdhaW4uZ2Fpbi5jYW5jZWxTY2hlZHVsZWRWYWx1ZXMoYXVkaW9DdHguY3VycmVudFRpbWUpXG4gICAgICAgICAgLy8gbWF4IHZvbHVtZSBpcyA1LCBhbGxvd2luZyBkaXN0b3J0aW9uXG4gICAgICAgICAgLy8gZXhwb25lbnRpYWwgaXMgY2hvc2VuIHNvIHRoYXQgMC41KioyLjMyMTkzID09IDEuMCAoZnVsbCB2b2x1bWUgb24gaGFsZi1zbGlkZXIpXG4gICAgICAgICAgY29uc3Qgdm9sID0gTWF0aC5wb3coYWxwaGEsIDIuMzIxOTMpICogNS4wXG4gICAgICAgICAgaWYgKCFpbml0KSB7XG4gICAgICAgICAgICBnYWluLmdhaW4uc2V0VGFyZ2V0QXRUaW1lKHZvbCwgYXVkaW9DdHguY3VycmVudFRpbWUsIDAuMilcbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgZ2Fpbi5nYWluLnZhbHVlID0gdm9sXG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICApXG4gICAgfVxuXG4gICAgZm9yIChsZXQgaT0wOyBpIDwgYnBtTW9kcy5sZW5ndGg7ICsraSkge1xuICAgICAgYnBtTW9kc1tpXS5hZGRFdmVudExpc3RlbmVyKFwiY2xpY2tcIiwgZSA9PiB0aGlzLm9uQnBtTW9kKGUpKVxuICAgIH1cblxuICAgIGZvciAoY29uc3QgZWwgb2YgY2xhc3NEZW1hbmRFYWNoKFwiY2h1bi1tb2RcIiwgSFRNTEJ1dHRvbkVsZW1lbnQpKSB7XG4gICAgICBlbC5hZGRFdmVudExpc3RlbmVyKFxuICAgICAgICBcImNsaWNrXCIsXG4gICAgICAgICgpID0+IHtcbiAgICAgICAgICBjb25zdCB2YWwgPSBNYXRoLm1heCgwLCBOdW1iZXIodGhpcy5lQ2h1bi52YWx1ZSkgKyBOdW1iZXIoZWwuZGF0YXNldC5tb2QpKVxuICAgICAgICAgIHRoaXMuZUNodW4udmFsdWUgPSB2YWwudG9TdHJpbmcoKVxuICAgICAgICAgIHRoaXMuYnBtQ29udHJvbC5jaHVuU2V0KHZhbClcbiAgICAgICAgfVxuICAgICAgKVxuICAgIH1cblxuICAgIGNvbnN0IGVEbGdQYXR0ZXJuSGVscCA9IGRlbWFuZEJ5SWQoXCJkaWFsb2ctcGF0dGVybi1oZWxwXCIpXG4gICAgZGVtYW5kQnlJZChcInBhdHRlcm4taGVscFwiKS5hZGRFdmVudExpc3RlbmVyKFwiY2xpY2tcIiwgZnVuY3Rpb24gKCkge1xuICAgICAgaWYgKGVEbGdQYXR0ZXJuSGVscC5jbGFzc0xpc3QuY29udGFpbnMoXCJzcGxpdC1zaG93XCIpKVxuICAgICAgICBlRGxnUGF0dGVybkhlbHAuY2xhc3NMaXN0LnJlbW92ZShcInNwbGl0LXNob3dcIilcbiAgICAgIGVsc2VcbiAgICAgICAgZURsZ1BhdHRlcm5IZWxwLmNsYXNzTGlzdC5hZGQoXCJzcGxpdC1zaG93XCIpXG4gICAgfSlcbiAgfVxuXG4gIHVzZXJQYXR0ZXJuc1VwZGF0ZSgpIHtcbiAgICB3aXRoRWxlbWVudChcInBhdHRlcm5zLXVzZXJcIiwgSFRNTFNlbGVjdEVsZW1lbnQsIChzZWxlY3QpID0+IHtcbiAgICAgIGNvbnN0IG9sZFZhbHVlID0gc2VsZWN0LnZhbHVlXG4gICAgICBcbiAgICAgIHdoaWxlIChzZWxlY3Qub3B0aW9ucy5sZW5ndGggPiAxKVxuICAgICAgICBzZWxlY3QucmVtb3ZlKDEpXG5cbiAgICAgIGZvciAobGV0IGkgPSAwOyA7IGkrKykge1xuICAgICAgICBjb25zdCBrZXkgPSB3aW5kb3cubG9jYWxTdG9yYWdlLmtleShpKVxuICAgICAgICBpZiAoIWtleSkge1xuICAgICAgICAgIGJyZWFrXG4gICAgICAgIH0gZWxzZSBpZiAoa2V5LnN0YXJ0c1dpdGgoXCJwbGV5bmctXCIpKSB7XG4gICAgICAgICAgY29uc3Qgb3B0ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcIm9wdGlvblwiKVxuICAgICAgICAgIG9wdC5pbm5lclRleHQgPSBrZXkuc2xpY2UoNylcbiAgICAgICAgICBvcHQudmFsdWUgPSBrZXlcbiAgICAgICAgICBzZWxlY3QuYWRkKG9wdClcbiAgICAgICAgfVxuICAgICAgfVxuXG4gICAgICBzZWxlY3QudmFsdWUgPSBvbGRWYWx1ZVxuICAgIH0pXG4gIH1cbiAgXG4gIG9uU2F2ZVBhdHRlcm4obmFtZTogc3RyaW5nLCBwYXR0ZXJuOiBzdHJpbmcpIHtcbiAgICB3aW5kb3cubG9jYWxTdG9yYWdlLnNldEl0ZW0oXCJwbGV5bmctXCIgKyBuYW1lLCBwYXR0ZXJuKVxuICAgIHRoaXMudXNlclBhdHRlcm5zVXBkYXRlKClcbiAgfVxuICAgIFxuICBvblBsYXlEZWxheSgpIHtcbiAgICB0aGlzLmJwbUNvbnRyb2wuc3RvcCgpXG4gICAgdGhpcy5icG1Db250cm9sLmNoYW5nZSh0aGlzLmdldEJwbSh0aGlzLmVCcG0udmFsdWUpKVxuICAgIFxuICAgIGlmICh0aGlzLmRydW1QYXR0ZXJuTmV4dCAhPSBudWxsKVxuICAgICAgdGhpcy5kcnVtUGF0dGVybiA9IHRoaXMuZHJ1bVBhdHRlcm5OZXh0XG4gICAgICBcbiAgICB0aGlzLmRydW1QYXR0ZXJuPy5zZWVrKHRoaXMsIDApXG4gICAgdGhpcy5lUGxheS5zZXRBdHRyaWJ1dGUoJ2Rpc2FibGVkJywnJylcbiAgICB0aGlzLmVTdG9wLnJlbW92ZUF0dHJpYnV0ZSgnZGlzYWJsZWQnKVxuICAgIGNvbnN0IGNodXAwID0gKCkgPT4ge1xuICAgICAgdGhpcy5nbG9uZ1NldD8ua2lsbCgpXG4gICAgICB0aGlzLmdsb25nU2V0Py5jaHVwKDAsIDEpXG4gICAgICB0aGlzLmNodXBDaHVwVGltZW91dCA9IHdpbmRvdy5zZXRUaW1lb3V0KGNodXAxLCAyMDApXG4gICAgfVxuICAgIGNvbnN0IGNodXAxID0gKCkgPT4ge1xuICAgICAgdGhpcy5nbG9uZ1NldD8uY2h1cCgwLCAxKVxuICAgICAgdGhpcy5jaHVwQ2h1cFRpbWVvdXQgPSB3aW5kb3cuc2V0VGltZW91dChjaHVwMiwgdGhpcy5icG1Db250cm9sLm1zVGlja1BlcmlvZCgpICogOClcbiAgICB9XG4gICAgY29uc3QgY2h1cDIgPSAoKSA9PiB7XG4gICAgICB0aGlzLmdsb25nU2V0Py5jaGluZygwLDEpXG4gICAgICB0aGlzLmNodXBDaHVwVGltZW91dCA9IHdpbmRvdy5zZXRUaW1lb3V0KCgpID0+IHRoaXMub25QbGF5KCksIHRoaXMuYnBtQ29udHJvbC5tc1RpY2tQZXJpb2QoKSAqIDQpXG4gICAgfVxuICAgIGNodXAwKClcbiAgfVxuXG4gIGRvUGF0dGVybigpIHtcbiAgICBpZiAodGhpcy5kcnVtUGF0dGVybk5leHQgIT0gbnVsbCkge1xuICAgICAgdGhpcy5kcnVtUGF0dGVybiA9IGFwcENoaW5nLmRydW1QYXR0ZXJuTmV4dFxuICAgICAgdGhpcy5kcnVtUGF0dGVybj8uc2Vlayh0aGlzLCBNYXRoLm1heCgwLCB0aGlzLmJwbUNvbnRyb2wudGljaygpLTEpKVxuICAgICAgdGhpcy5kcnVtUGF0dGVybk5leHQgPSBudWxsXG4gICAgfVxuICAgIHRoaXMuZHJ1bVBhdHRlcm4/LnRpY2sodGhpcylcbiAgfVxuXG4gIG9uUGxheSgpIHtcbiAgICB0aGlzLmdsb25nU2V0Py5raWxsKClcblxuICAgIHRoaXMuYnBtQ29udHJvbC5zdG9wKClcbiAgICB0aGlzLmJwbUNvbnRyb2wuY2hhbmdlKHRoaXMuZ2V0QnBtKHRoaXMuZUJwbS52YWx1ZSkpXG4gICAgdGhpcy5icG1Db250cm9sLmNodW5TZXQoTnVtYmVyKHRoaXMuZUNodW4udmFsdWUpKVxuXG4gICAgdGhpcy5kcnVtUGF0dGVybj8uc2Vlayh0aGlzLCAwKVxuICAgIHRoaXMuYnBtQ29udHJvbC5wbGF5KClcbiAgICB0aGlzLmVTdG9wLnJlbW92ZUF0dHJpYnV0ZSgnZGlzYWJsZWQnKVxuICAgIHRoaXMuZVBsYXkuc2V0QXR0cmlidXRlKCdkaXNhYmxlZCcsJycpXG5cbiAgICBhc3NlcnQodGhpcy5nYWluTWFzdGVyKVxuICAgIGFzc2VydCh0aGlzLnF1aWV0Tm9pc2UpXG4gICAgdGhpcy5xdWlldE5vaXNlLmNvbm5lY3QodGhpcy5nYWluTWFzdGVyKVxuXG4gICAgaWYgKHRoaXMuYW5hbHlzZXJBY3RpdmUpIHtcbiAgICAgIGFzc2VydCh0aGlzLmFuYWx5c2VyKVxuICAgICAgdGhpcy5nYWluTWFzdGVyLmNvbm5lY3QodGhpcy5hbmFseXNlcilcbiAgICB9XG4gIH1cblxuICBvblN0b3AoKSB7XG4gICAgd2luZG93LmNsZWFyVGltZW91dCh0aGlzLmNodXBDaHVwVGltZW91dClcbiAgICB0aGlzLmNodXBDaHVwVGltZW91dCA9IHVuZGVmaW5lZFxuICAgIHRoaXMuZVN0b3AuZGlzYWJsZWQgPSB0cnVlXG4gICAgdGhpcy5lUGxheS5kaXNhYmxlZCA9IGZhbHNlXG4gICAgdGhpcy5lUGxheURlbGF5LmRpc2FibGVkID0gZmFsc2VcblxuICAgIGFzc2VydCh0aGlzLnF1aWV0Tm9pc2UpXG4gICAgdGhpcy5xdWlldE5vaXNlLmRpc2Nvbm5lY3QoKVxuICB9XG5cbiAgb25UaWNrKCk6IGJvb2xlYW4ge1xuICAgIGNvbnN0IGN1cnJlbnRUaWNrID0gdGhpcy5icG1Db250cm9sLnRpY2soKSAtIDFcbiAgICBjb25zdCBkaXZpc29yQ2h1biA9IDIqKih0aGlzLmJwbUNvbnRyb2wuY2h1biArIDEpXG5cbiAgICBhc3NlcnQodGhpcy5nbG9uZ1NldClcbiAgICBcbiAgICBpZiAoY3VycmVudFRpY2sgJSBkaXZpc29yQ2h1biA9PSAwKSB7XG4gICAgICB0aGlzLmdsb25nU2V0LmNodXAoMCwgMSlcbiAgICB9IGVsc2UgaWYgKGN1cnJlbnRUaWNrICUgZGl2aXNvckNodW4gPT0gZGl2aXNvckNodW4vMikge1xuICAgICAgdGhpcy5nbG9uZ1NldC5jaGluZygwLDEpXG4gICAgfVxuXG4gICAgd2luZG93LnNldFRpbWVvdXQoXG4gICAgICAoKSA9PiB7XG4gICAgICAgIHRoaXMuZUhvbmcudmFsdWUgPSAoTWF0aC5mbG9vcihjdXJyZW50VGljayAvIDQpICsgMSkudG9TdHJpbmcoKTtcbiAgICAgICAgdXBkYXRlQ2hpbmdWaXModGhpcy5lQ2hpbmdWaXNlcywgTWF0aC5mbG9vcihjdXJyZW50VGljayAvIDIpICUgNCk7XG4gICAgICB9LFxuICAgICAgNTAgLy8gVEJEOiBsZXQgdGhlIHVzZXIgdHVuZSB0aGlzIC0tIG5vIHJlbGlhYmxlIGxhdGVuY3kgbWVhc3VyZSBpcyBhdmFpbGFibGVcbiAgICApXG5cbiAgICB0aGlzLmRvUGF0dGVybigpXG5cbiAgICByZXR1cm4gdHJ1ZVxuICB9XG4gIFxuICBhc3luYyBvbkdsb25nc2V0Q2hhbmdlKG5hbWVTZXQ6IHN0cmluZykge1xuICAgIGxldCBnbG9uZ1NldDogR2xvbmdTZXRcblxuICAgIGFzc2VydCh0aGlzLmF1ZGlvQ3R4KVxuICAgIFxuICAgIHN3aXRjaCAobmFtZVNldCkge1xuICAgICAgY2FzZSBcInNhbXBsZWRcIjpcbiAgICAgICAgZ2xvbmdTZXQgPSBuZXcgR2xvbmdTZXRTYW1wbGVkKFxuICAgICAgICAgIHRoaXMuYXVkaW9DdHgsXG4gICAgICAgICAgW1xuICAgICAgICAgICAgbmV3IFNhbXBsZShcImNodXAtMC5mbGFjXCIsIGNvcmRvdmEpLFxuICAgICAgICAgICAgbmV3IFNhbXBsZShcImNodXAtMS5mbGFjXCIsIGNvcmRvdmEpLFxuICAgICAgICAgICAgbmV3IFNhbXBsZShcImNodXAtMi5mbGFjXCIsIGNvcmRvdmEpXG4gICAgICAgICAgXSxcbiAgICAgICAgICBbXG4gICAgICAgICAgICBuZXcgU2FtcGxlKFwiY2hpbmctMC5mbGFjXCIsIGNvcmRvdmEpLFxuICAgICAgICAgICAgbmV3IFNhbXBsZShcImNoaW5nLTEuZmxhY1wiLCBjb3Jkb3ZhKSxcbiAgICAgICAgICAgIG5ldyBTYW1wbGUoXCJjaGluZy0yLmZsYWNcIiwgY29yZG92YSlcbiAgICAgICAgICBdLFxuICAgICAgICAgIFtcbiAgICAgICAgICAgIFtcbiAgICAgICAgICAgICAgbmV3IFNhbXBsZShcInNvcm1jaGFpLWN0dW0tMC5mbGFjXCIsIGNvcmRvdmEpLFxuICAgICAgICAgICAgICBuZXcgU2FtcGxlKFwic29ybWNoYWktY3R1bS0xLmZsYWNcIiwgY29yZG92YSksXG4gICAgICAgICAgICAgIG5ldyBTYW1wbGUoXCJzb3JtY2hhaS1jdHVtLTIuZmxhY1wiLCBjb3Jkb3ZhKVxuICAgICAgICAgICAgXSxcbiAgICAgICAgICAgIFtcbiAgICAgICAgICAgICAgbmV3IFNhbXBsZShcInNvcm1jaGFpLWR0aW5nLTAuZmxhY1wiLCBjb3Jkb3ZhKSxcbiAgICAgICAgICAgICAgbmV3IFNhbXBsZShcInNvcm1jaGFpLWR0aW5nLTEuZmxhY1wiLCBjb3Jkb3ZhKSxcbiAgICAgICAgICAgICAgbmV3IFNhbXBsZShcInNvcm1jaGFpLWR0aW5nLTIuZmxhY1wiLCBjb3Jkb3ZhKVxuICAgICAgICAgICAgXSxcbiAgICAgICAgICAgIFtcbiAgICAgICAgICAgICAgbmV3IFNhbXBsZShcInNvcm1jaGFpLWpvci0wLmZsYWNcIiwgY29yZG92YSksXG4gICAgICAgICAgICAgIG5ldyBTYW1wbGUoXCJzb3JtY2hhaS1qb3ItMS5mbGFjXCIsIGNvcmRvdmEpLFxuICAgICAgICAgICAgICBuZXcgU2FtcGxlKFwic29ybWNoYWktam9yLTIuZmxhY1wiLCBjb3Jkb3ZhKVxuICAgICAgICAgICAgXSxcbiAgICAgICAgICAgIFtcbiAgICAgICAgICAgICAgbmV3IFNhbXBsZShcInNvcm1jaGFpLWpvcm5nLTAuZmxhY1wiLCBjb3Jkb3ZhKSxcbiAgICAgICAgICAgICAgbmV3IFNhbXBsZShcInNvcm1jaGFpLWpvcm5nLTEuZmxhY1wiLCBjb3Jkb3ZhKSxcbiAgICAgICAgICAgICAgbmV3IFNhbXBsZShcInNvcm1jaGFpLWpvcm5nLTIuZmxhY1wiLCBjb3Jkb3ZhKVxuICAgICAgICAgICAgXVxuICAgICAgICAgIF0sXG4gICAgICAgICAgMC43NSxcbiAgICAgICAgICAxLjAsXG4gICAgICAgICAgMS4wXG4gICAgICAgIClcbiAgICAgICAgXG4gICAgICAgIGJyZWFrXG4gICAgICBjYXNlIFwic3ludGhlc2l6ZWRcIjpcbiAgICAgICAgZ2xvbmdTZXQgPSBuZXcgR2xvbmdTZXRTeW50aGVzaXplZCh0aGlzLmF1ZGlvQ3R4KVxuICAgICAgICBicmVha1xuICAgICAgZGVmYXVsdDpcbiAgICAgICAgdGhyb3cgTVNHLmVycm9yR2xvbmdzZXRCYWQobmFtZVNldClcbiAgICB9XG5cbiAgICBhd2FpdCBnbG9uZ1NldC5pbml0KClcblxuICAgIC8vIERydW1zZXRzIHNob3VsZCByZXNldCBkZXR1bmUgb24gc2V0IGNoYW5nZVxuICAgIHRoaXMudHVuZUdsb25nLnZhbHVlID0gXCI1MFwiXG5cbiAgICAvLyBOb3RlOiBKYXZhc2NyaXB0IHByb21pc2VzIGFyZSBhc3luY3Jvbm91cyBidXQgbm90IGNvbmN1cnJlbnQsIHNvIHRoaXMgYmxvY2sgd2lsbCBvbmx5IGV2ZXIgYmUgZXhlY3V0ZWQgYnkgb25lXG4gICAgLy8gcHJvY2VzcyB0byBjb21wbGV0aW9uLiBUaGVyZSBpcyBubyBkYW5nZXIgaGVyZSBvZiBsb2FkZWQgZ2xvbmdzZXRzIG5vdCBoYXZpbmcgJ2Rpc2Nvbm5lY3QnIGNhbGxlZC5cbiAgICBpZiAodGhpcy5nbG9uZ1NldCkge1xuICAgICAgdGhpcy5nbG9uZ1NldC5kaXNjb25uZWN0KClcbiAgICB9XG5cbiAgICBhc3NlcnQodGhpcy5nYWluQ2hpbmcpXG4gICAgYXNzZXJ0KHRoaXMuZ2Fpbkdsb25nKVxuICAgIFxuICAgIGdsb25nU2V0LmNvbm5lY3QodGhpcy5nYWluQ2hpbmcsIHRoaXMuZ2Fpbkdsb25nKVxuICAgIHRoaXMuZ2xvbmdTZXQgPSBnbG9uZ1NldFxuICB9XG4gIFxuICBnZXRCcG0oYW55VmFsOiBudW1iZXJ8c3RyaW5nKSB7XG4gICAgY29uc3QgbnVtQnBtID0gTnVtYmVyKGFueVZhbClcbiAgICBpZiAobnVtQnBtICE9IE5hTikge1xuICAgICAgcmV0dXJuIG51bUJwbVxuICAgIH0gZWxzZSB7XG4gICAgICByZXR1cm4gdGhpcy5icG1Db250cm9sLmJwbSgpXG4gICAgfVxuICB9XG5cbiAgcHJpdmF0ZSBvbkJwbU1vZChldnQ6IEV2ZW50KSB7XG4gICAgY29uc3QgZSA9IGV2dC50YXJnZXRcbiAgICBhc3NlcnQoZSBpbnN0YW5jZW9mIEhUTUxFbGVtZW50KVxuICAgIFxuICAgIGxldCBicG06IG51bWJlclxuICAgIGlmIChlLmRhdGFzZXQuc2V0KSB7XG4gICAgICBicG0gPSBOdW1iZXIoZS5kYXRhc2V0LnNldClcbiAgICB9IGVsc2UgaWYgKGUuZGF0YXNldC5zY2FsZSkge1xuICAgICAgYnBtID0gdGhpcy5icG1Db250cm9sLmJwbSgpICogTnVtYmVyKGUuZGF0YXNldC5zY2FsZSlcbiAgICB9IGVsc2Uge1xuICAgICAgYnBtID0gdGhpcy5icG1Db250cm9sLmJwbSgpICsgTnVtYmVyKGUuZGF0YXNldC5pbmNyZW1lbnQpXG4gICAgfVxuICAgIHRoaXMuZUJwbS52YWx1ZSA9IGJwbS50b1N0cmluZygpXG4gICAgdGhpcy5icG1Db250cm9sLmNoYW5nZShicG0pXG4gIH1cblxuICBvbkRydW1QYXR0ZXJuQ2hhbmdlKHZhbHVlOiBzdHJpbmcpIHtcbiAgICBjb25zdCBbdG9rZW5zLCBlcnJvcl0gPSBwYXR0ZXJucy5ncmFtbWFyLnRva2VuaXplKHZhbHVlKVxuICAgIGlmIChlcnJvcikge1xuICAgICAgdGhpcy5lUGF0dGVybkVycm9yLmlubmVyVGV4dCA9IGVycm9yXG4gICAgICB0aGlzLmVQYXR0ZXJuRXJyb3IuY2xhc3NMaXN0LmFkZChcImVycm9yLXNob3dcIilcbiAgICAgIHJldHVyblxuICAgIH1cbiAgICBcbiAgICBjb25zdCBbXywgc3RhdGUsIGNvbnRleHRdID0gcGF0dGVybnMuZ3JhbW1hci5wYXJzZSh0b2tlbnMsIFtuZXcgU2VnbWVudEFjdGlvbigpXSlcbiAgICBpZiAoc3RhdGUuZXJyb3IpIHtcbiAgICAgIHRoaXMuZVBhdHRlcm5FcnJvci5pbm5lclRleHQgPSBzdGF0ZS5lcnJvciArIFwiXFxuYXQ6XFxuXCIgKyBzdGF0ZS5jb250ZXh0KClcbiAgICAgIHRoaXMuZVBhdHRlcm5FcnJvci5jbGFzc0xpc3QuYWRkKFwiZXJyb3Itc2hvd1wiKVxuICAgICAgcmV0dXJuXG4gICAgfVxuICAgIFxuICAgIHRoaXMuZVBhdHRlcm5FcnJvci5jbGFzc0xpc3QucmVtb3ZlKFwiZXJyb3Itc2hvd1wiKVxuICAgIHRoaXMuZHJ1bVBhdHRlcm5OZXh0ID0gbmV3IERydW1QYXR0ZXJuKGNvbnRleHQpXG4gIH1cbn1cblxuLy8gRXhwb3J0IGp1c3QgZm9yIGRlYnVnZ2luZyBjb252ZW5pZW5jZVxuZXhwb3J0IGxldCBhcHBDaGluZzogQXBwQ2hpbmdcblxuZnVuY3Rpb24gYW5hbHlzZXJEcmF3KHRpbWU6IG51bWJlciwgYW5hbHlzZXI6IEFuYWx5c2VyTm9kZSwgY2FudmFzQ3R4OiBDYW52YXNSZW5kZXJpbmdDb250ZXh0MkQpIHtcbiAgY29uc3QgdXBkYXRlRnJlcSA9ICgxLzY1KSAqIDEwMDBcbiAgY29uc3QgYnVmZmVyRmZ0ID0gbmV3IEZsb2F0MzJBcnJheShhbmFseXNlci5mcmVxdWVuY3lCaW5Db3VudClcblxuICBjb25zdCBsb29wID0gKGxhc3RUaW1lOiBudW1iZXIsIHRpbWU6IG51bWJlciwgYnVmZmVySW1nT2xkOiBJbWFnZURhdGEpID0+IHtcbiAgICBjb25zdCBjYW52YXNXaWR0aCA9IGNhbnZhc0N0eC5jYW52YXMud2lkdGhcbiAgICBjb25zdCBjYW52YXNIZWlnaHQgPSBjYW52YXNDdHguY2FudmFzLmhlaWdodFxuXG4gICAgYW5hbHlzZXIuZ2V0RmxvYXRGcmVxdWVuY3lEYXRhKGJ1ZmZlckZmdClcblxuICAgIGNhbnZhc0N0eC5wdXRJbWFnZURhdGEoYnVmZmVySW1nT2xkLCAtMSwgMClcbiAgICBjb25zdCBidWZmZXJJbWcgPSBjYW52YXNDdHguZ2V0SW1hZ2VEYXRhKDAsIDAsIGNhbnZhc1dpZHRoLCBjYW52YXNIZWlnaHQpXG5cbiAgICBjb25zdCBkYk1pbiA9IGFuYWx5c2VyLm1pbkRlY2liZWxzXG4gICAgY29uc3QgZGJNYXggPSBhbmFseXNlci5tYXhEZWNpYmVsc1xuICAgIGNvbnN0IGdhaW5EYiA9IDE1XG4gICAgY29uc3QgZnJlcUJpbkNvdW50ID0gYW5hbHlzZXIuZnJlcXVlbmN5QmluQ291bnRcbiAgICBjb25zdCBkYXRhID0gYnVmZmVySW1nLmRhdGFcbiAgICBjb25zdCBzYW1wbGVSYXRlID0gYW5hbHlzZXIuY29udGV4dC5zYW1wbGVSYXRlXG4gICAgdmFyIGlJbWcgPSAoY2FudmFzV2lkdGggLSAxKSAqIDRcblxuICAgIGZvciAobGV0IHk9MDsgeSA8IGNhbnZhc0hlaWdodDsgKyt5KSB7XG4gICAgICBjb25zdCBhbHBoYSA9IHkvY2FudmFzSGVpZ2h0XG4gICAgICBjb25zdCBpQmluID0gTWF0aC5mbG9vcihNYXRoLnBvdygxLjAtYWxwaGEsMykgKiBmcmVxQmluQ291bnQpXG4gICAgICBjb25zdCBmVmFsID0gYnVmZmVyRmZ0W2lCaW5dICsgZ2FpbkRiXG4gICAgICBjb25zdCBpSW50ZW5zaXR5ID0gMjU1ICogKE1hdGgubWF4KE1hdGgubWluKGZWYWwsIGRiTWF4KSwgZGJNaW4pIC0gZGJNaW4pIC8gKGRiTWF4IC0gZGJNaW4pXG5cbiAgICAgIGRhdGFbaUltZ10gPSBpSW50ZW5zaXR5XG4gICAgICBkYXRhW2lJbWcrMV0gPSBpSW50ZW5zaXR5XG4gICAgICBkYXRhW2lJbWcrMl0gPSBpSW50ZW5zaXR5XG5cbiAgICAgIGlJbWcgKz0gY2FudmFzV2lkdGggKiA0XG4gICAgfVxuXG4gICAgY2FudmFzQ3R4LnB1dEltYWdlRGF0YShidWZmZXJJbWcsIDAsIDAsIGNhbnZhc1dpZHRoLTEsIDAsIGNhbnZhc1dpZHRoLCBjYW52YXNIZWlnaHQpXG5cbiAgICBpZiAoYXBwQ2hpbmcuYW5hbHlzZXJBY3RpdmUpIHtcbiAgICAgIHdpbmRvdy5zZXRUaW1lb3V0KFxuICAgICAgICAoKSA9PiB3aW5kb3cucmVxdWVzdEFuaW1hdGlvbkZyYW1lKFxuICAgICAgICAgICh0aW1lTmV3KSA9PiBsb29wKHRpbWUsIHRpbWVOZXcsIGJ1ZmZlckltZylcbiAgICAgICAgKSxcbiAgICAgICAgTWF0aC5tYXgoKGxhc3RUaW1lICsgdXBkYXRlRnJlcSkgLSB0aW1lLCAwKVxuICAgICAgKTtcbiAgICB9XG4gIH1cblxuICBjYW52YXNDdHguZmlsbFJlY3QoMCwgMCwgMTAwMDAsIDEwMDAwKVxuXG4gIGxvb3AodGltZSwgdGltZSwgY2FudmFzQ3R4LmdldEltYWdlRGF0YSgwLCAwLCBjYW52YXNDdHguY2FudmFzLndpZHRoLCBjYW52YXNDdHguY2FudmFzLmhlaWdodCkpXG59XG5cbmZ1bmN0aW9uIGhhbmRsZVNsaWRlclVwZGF0ZShjdGw6IEhUTUxJbnB1dEVsZW1lbnQsIG9uQ2hhbmdlOihhbHBoYTogbnVtYmVyLCBpbml0OiBib29sZWFuKSA9PiB2b2lkKSB7XG4gIGNvbnN0IG1pbiA9IDBcbiAgY29uc3QgbWF4ID0gMTAwXG4gIGN0bC5hZGRFdmVudExpc3RlbmVyKFwiaW5wdXRcIiwgKCkgPT4gb25DaGFuZ2UoKE51bWJlcihjdGwudmFsdWUpIC0gbWluKSAvIChtYXggLSBtaW4pLCBmYWxzZSkpXG4gIFxuICBvbkNoYW5nZSgoTnVtYmVyKGN0bC52YWx1ZSkgLSBtaW4pIC8gKG1heCAtIG1pbiksIHRydWUpXG59XG5cbmZ1bmN0aW9uIHVwZGF0ZUNoaW5nVmlzKGVDaGluZ1Zpc2VzOiBIVE1MRWxlbWVudFtdLCBwaGFzZTogbnVtYmVyKSB7XG4gIGZvciAobGV0IGkgPSAwOyBpIDwgZUNoaW5nVmlzZXMubGVuZ3RoOyArK2kpIHtcbiAgICBjb25zdCBlID0gZUNoaW5nVmlzZXNbaV1cbiAgICBpZiAocGhhc2UgPT0gaSkge1xuICAgICAgZS5zdHlsZS5iYWNrZ3JvdW5kQ29sb3IgPSBlLmRhdGFzZXQuYWN0aXZlQ29sID8/ICdyZWQnXG4gICAgfSBlbHNlIHtcbiAgICAgIGUuc3R5bGUuYmFja2dyb3VuZENvbG9yID0gJ3doaXRlJ1xuICAgIH1cbiAgfVxufVxuXG5leHBvcnQgZnVuY3Rpb24gcHJvZ3JhbVN0YXRlU2VyaWFsaXplKCkge1xuICBjb25zdCBzZXJpYWxpemVkID0ge1wic2VsZWN0XCI6IHt9LCBcImlucHV0XCI6IHt9LCBcInRleHRhcmVhXCI6IHt9fSBhcyBhbnlcbiAgXG4gIHtcbiAgICBjb25zdCBzZXI6IGFueSA9IHNlcmlhbGl6ZWRbXCJpbnB1dFwiXVxuICAgIGNvbnN0IGVzID0gZG9jdW1lbnQuZ2V0RWxlbWVudHNCeVRhZ05hbWUoJ2lucHV0JylcbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IGVzLmxlbmd0aDsgKytpKSB7XG4gICAgICBjb25zdCBlID0gZXNbaV0gYXMgSFRNTElucHV0RWxlbWVudFxuICAgICAgc2VyW2UuaWRdID0gZS52YWx1ZVxuICAgIH1cbiAgfVxuICBcbiAge1xuICAgIGNvbnN0IHNlcjogYW55ID0gc2VyaWFsaXplZFtcInRleHRhcmVhXCJdXG4gICAgY29uc3QgZXMgPSBkb2N1bWVudC5nZXRFbGVtZW50c0J5VGFnTmFtZSgndGV4dGFyZWEnKVxuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgZXMubGVuZ3RoOyArK2kpIHtcbiAgICAgIGNvbnN0IGUgPSBlc1tpXVxuICAgICAgYXNzZXJ0KHNlcmlhbGl6ZWRbZS5pZF0gPT0gdW5kZWZpbmVkKVxuICAgICAgc2VyW2UuaWRdID0gZS50ZXh0Q29udGVudFxuICAgIH1cbiAgfVxuICBcbiAge1xuICAgIGNvbnN0IHNlciA9IHNlcmlhbGl6ZWRbXCJzZWxlY3RcIl1cbiAgICBjb25zdCBlcyA9IGRvY3VtZW50LmdldEVsZW1lbnRzQnlUYWdOYW1lKCdzZWxlY3QnKVxuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgZXMubGVuZ3RoOyArK2kpIHtcbiAgICAgIGNvbnN0IGUgPSBlc1tpXSBhcyBIVE1MU2VsZWN0RWxlbWVudFxuICAgICAgYXNzZXJ0KHNlcltlLmlkXSA9PSB1bmRlZmluZWQpXG4gICAgICBzZXJbZS5pZF0gPSBlLnNlbGVjdGVkSW5kZXhcbiAgICB9XG4gIH1cbiAgXG4gIHdpbmRvdy5sb2NhbFN0b3JhZ2Uuc2V0SXRlbShcInN0YXRlXCIsIEpTT04uc3RyaW5naWZ5KHNlcmlhbGl6ZWQpKVxufVxuXG5leHBvcnQgZnVuY3Rpb24gcHJvZ3JhbVN0YXRlRGVzZXJpYWxpemUoKSB7XG4gIC8vIE5vdGU6IG1vc3Qgb25jaGFuZ2Ugbm90IG5lY2Vzc2FyeSwgYXMgdGhlIHVzZXIgd2lsbCBhbHdheXMgbmVlZCB0byBwcm92aWRlIGlucHV0IHRvIHJlaW5pdGlhbGl6ZSB0aGVcbiAgLy8gYXVkaW9jb250ZXh0LlxuICBjb25zdCBzdGF0ZSA9IHdpbmRvdy5sb2NhbFN0b3JhZ2UuZ2V0SXRlbShcInN0YXRlXCIpXG4gIGlmICghc3RhdGUpXG4gICAgcmV0dXJuXG4gIFxuICBjb25zdCBzZXJpYWxpemVkID0gSlNPTi5wYXJzZShzdGF0ZSlcbiAgaWYgKHNlcmlhbGl6ZWQpIHtcbiAgICB7XG4gICAgICBjb25zdCBzZXIgPSBzZXJpYWxpemVkW1wiaW5wdXRcIl1cbiAgICAgIGNvbnN0IGVzID0gZG9jdW1lbnQuZ2V0RWxlbWVudHNCeVRhZ05hbWUoJ2lucHV0JylcbiAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgZXMubGVuZ3RoOyArK2kpIHtcbiAgICAgICAgY29uc3QgZSA9IGVzW2ldIGFzIEhUTUxJbnB1dEVsZW1lbnRcbiAgICAgICAgaWYgKGUgJiYgc2VyW2UuaWRdICE9IHVuZGVmaW5lZCkge1xuICAgICAgICAgIGUudmFsdWUgPSBzZXJbZS5pZF1cbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cbiAgICBcbiAgICB7XG4gICAgICBjb25zdCBzZXIgPSBzZXJpYWxpemVkW1widGV4dGFyZWFcIl1cbiAgICAgIGNvbnN0IGVzID0gZG9jdW1lbnQuZ2V0RWxlbWVudHNCeVRhZ05hbWUoJ3RleHRhcmVhJylcbiAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgZXMubGVuZ3RoOyArK2kpIHtcbiAgICAgICAgY29uc3QgZSA9IGVzW2ldXG4gICAgICAgIGlmIChlICYmIHNlcltlLmlkXSAhPSB1bmRlZmluZWQpIHtcbiAgICAgICAgICBlLnRleHRDb250ZW50ID0gc2VyW2UuaWRdXG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG4gICAgXG4gICAge1xuICAgICAgY29uc3Qgc2VyID0gc2VyaWFsaXplZFtcInNlbGVjdFwiXVxuICAgICAgY29uc3QgZXMgPSBkb2N1bWVudC5nZXRFbGVtZW50c0J5VGFnTmFtZSgnc2VsZWN0JylcbiAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgZXMubGVuZ3RoOyArK2kpIHtcbiAgICAgICAgY29uc3QgZSA9IGVzW2ldIGFzIEhUTUxTZWxlY3RFbGVtZW50XG4gICAgICAgIGlmIChlICYmIHNlcltlLmlkXSAhPSB1bmRlZmluZWQpIHtcbiAgICAgICAgICBlLnNlbGVjdGVkSW5kZXggPSBzZXJbZS5pZF1cbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cbiAgfVxufVxuXG53aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcihcImxvYWRcIiwgKCkgPT4ge1xuICBkb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKFwiZGV2aWNlcmVhZHlcIiwgKCkgPT4ge1xuICAgIGRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoXCJiYWNrXCIsIHByb2dyYW1TdGF0ZVNlcmlhbGl6ZSlcbiAgICBkb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKFwicGF1c2VcIiwgcHJvZ3JhbVN0YXRlU2VyaWFsaXplKVxuICAgIGRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoXCJyZXN1bWVcIiwgcHJvZ3JhbVN0YXRlRGVzZXJpYWxpemUpXG4gICAgXG4gICAgY29uc3QgZXJyb3JFbCA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwiZXJyb3JcIilcbiAgICBhc3NlcnQoZXJyb3JFbClcbiAgICBlcnJvckVsLmFkZEV2ZW50TGlzdGVuZXIoXCJjbGlja1wiLCBmdW5jdGlvbiAoKSB7IHRoaXMuc3R5bGUuZGlzcGxheSA9IFwibm9uZVwiIH0pXG5cbiAgICB0cnkge1xuICAgICAgcHJvZ3JhbVN0YXRlRGVzZXJpYWxpemUoKVxuICAgIH0gY2F0Y2ggKG1zZykge1xuICAgICAgZXJyb3JIYW5kbGVyKFwi4LmA4LiI4Lit4Lib4Lix4LiN4Lir4Liy4LmA4Lih4Li34LmI4Lit4LmC4Lil4LmK4LiU4Liq4LiW4Liy4LiZ4Liw4LmC4Lib4Lij4LmB4LiB4LihOiBcIiArIG1zZylcbiAgICB9XG4gICAgXG4gICAgY29uc3QgYWxsQnV0dG9ucyA9IGRvY3VtZW50LmdldEVsZW1lbnRzQnlUYWdOYW1lKFwiYnV0dG9uXCIpXG5cbiAgICBhcHBDaGluZyA9IG5ldyBBcHBDaGluZyhcbiAgICAgIGRlbWFuZEJ5SWQoXCJicG1cIikgYXMgSFRNTElucHV0RWxlbWVudCxcbiAgICAgIGRlbWFuZEJ5SWQoXCJicG0tamluZ1wiKSBhcyBIVE1MSW5wdXRFbGVtZW50LFxuICAgICAgZGVtYW5kQnlJZChcImNodW5cIikgYXMgSFRNTElucHV0RWxlbWVudCxcbiAgICAgIGRlbWFuZEJ5SWQoXCJjaHVuLWppbmdcIikgYXMgSFRNTElucHV0RWxlbWVudCxcbiAgICAgIGRlbWFuZEJ5SWQoJ3R1bmUtZ2xvbmcnKSBhcyBIVE1MSW5wdXRFbGVtZW50LFxuICAgICAgZGVtYW5kQnlJZChcImhvbmdcIikgYXMgSFRNTElucHV0RWxlbWVudCxcbiAgICAgIGRlbWFuZEJ5SWQoXCJwbGF5XCIpIGFzIEhUTUxCdXR0b25FbGVtZW50LFxuICAgICAgZGVtYW5kQnlJZChcInN0b3BcIikgYXMgSFRNTEJ1dHRvbkVsZW1lbnQsXG4gICAgICBkZW1hbmRCeUlkKFwicGxheS1kZWxheVwiKSBhcyBIVE1MQnV0dG9uRWxlbWVudCxcbiAgICAgIFtcbiAgICAgICAgZGVtYW5kQnlJZChcImNoaW5nLXZpc3VhbGl6ZS0wXCIpLFxuICAgICAgICBkZW1hbmRCeUlkKFwiY2hpbmctdmlzdWFsaXplLTFcIiksXG4gICAgICAgIGRlbWFuZEJ5SWQoXCJjaGluZy12aXN1YWxpemUtMlwiKSxcbiAgICAgICAgZGVtYW5kQnlJZChcImNoaW5nLXZpc3VhbGl6ZS0zXCIpXG4gICAgICBdLFxuICAgICAgZGVtYW5kQnlJZChcInBhdHRlcm4tZXJyb3JcIilcbiAgICApXG5cbiAgICBhcHBDaGluZy5zZXR1cFByZVVzZXJJbnRlcmFjdGlvbihcbiAgICAgIGRlbWFuZEJ5SWQoXCJwYXR0ZXJuLWRydW1cIiwgSFRNTFRleHRBcmVhRWxlbWVudCksXG4gICAgICBbXG4gICAgICAgIFtkZW1hbmRCeUlkKFwicGF0dGVybi1ub25lXCIpLCBcIlwiXSxcbiAgICAgICAgW2RlbWFuZEJ5SWQoXCJwYXR0ZXJuLWxhb1wiKSwgcGF0dGVybnMucGxleW5nRGFobUxhb10sXG4gICAgICAgIFtkZW1hbmRCeUlkKFwicGF0dGVybi1raG1lblwiKSwgcGF0dGVybnMucGxleW5nRGFobUtobWVuXSxcbiAgICAgICAgW2RlbWFuZEJ5SWQoXCJwYXR0ZXJuLW5veWphaXlhaFwiKSwgcGF0dGVybnMuZGFobU5veUphaVlhaF0sXG4gICAgICAgIFtkZW1hbmRCeUlkKFwicGF0dGVybi1vbWRldWtcIiksIHBhdHRlcm5zLnBsZXluZ0tobWVuT21EdGV1a11cbiAgICAgIF1cbiAgICApXG5cbiAgICBjb25zdCBzZXR1cEFsbEJ1dHRvbnMgPSAoKSA9PiB7XG4gICAgICAvLyBpUGFkIG5lZWRzIHRvIGhhdmUgaXRzIGF1ZGlvIHRyaWdnZXJlZCBmcm9tIGEgdXNlciBldmVudC4gUnVuIHNldHVwIG9uIGFueSBidXR0b24uIFxuICAgICAgZm9yIChsZXQgaT0wOyBpIDwgYWxsQnV0dG9ucy5sZW5ndGg7ICsraSkge1xuICAgICAgICBhbGxCdXR0b25zW2ldLmFkZEV2ZW50TGlzdGVuZXIoXCJjbGlja1wiLCBzZXR1cEZ1bmMpXG4gICAgICB9XG4gICAgfVxuXG4gICAgY29uc3QgcmVtb3ZlU2V0dXBBbGxCdXR0b25zID0gKCkgPT4ge1xuICAgICAgZm9yIChsZXQgaT0wOyBpIDwgYWxsQnV0dG9ucy5sZW5ndGg7ICsraSkge1xuICAgICAgICBhbGxCdXR0b25zW2ldLnJlbW92ZUV2ZW50TGlzdGVuZXIoXCJjbGlja1wiLCBzZXR1cEZ1bmMpXG4gICAgICB9XG4gICAgfVxuICAgIFxuICAgIGNvbnN0IHNldHVwRnVuYyA9IChlOiBFdmVudCkgPT4ge1xuICAgICAgcmVtb3ZlU2V0dXBBbGxCdXR0b25zKClcbiAgICAgIFxuICAgICAgYXBwQ2hpbmcuc2V0dXAoXG4gICAgICAgIGRlbWFuZEJ5SWQoXCJhbmFseXNlclwiKSBhcyBIVE1MQ2FudmFzRWxlbWVudCxcbiAgICAgICAgZGVtYW5kQnlJZChcImFuYWx5c2VyLW9uXCIpIGFzIEhUTUxCdXR0b25FbGVtZW50LFxuICAgICAgICBkZW1hbmRCeUlkKFwiYW5hbHlzZXItb2ZmXCIpIGFzIEhUTUxCdXR0b25FbGVtZW50LFxuICAgICAgICBkZW1hbmRCeUlkKFwiZ2xvbmdzZXRcIikgYXMgSFRNTFNlbGVjdEVsZW1lbnQsXG4gICAgICAgIGRlbWFuZEJ5SWQoXCJwbGF5LWNoaW5nLWNsb3NlZFwiKSBhcyBIVE1MQnV0dG9uRWxlbWVudCxcbiAgICAgICAgZGVtYW5kQnlJZChcInBsYXktY2hpbmctb3BlblwiKSBhcyBIVE1MQnV0dG9uRWxlbWVudCxcbiAgICAgICAgZG9jdW1lbnQuZ2V0RWxlbWVudHNCeUNsYXNzTmFtZShcInBsYXktZHJ1bVwiKSxcbiAgICAgICAgZG9jdW1lbnQuZ2V0RWxlbWVudHNCeUNsYXNzTmFtZShcImJwbS1tb2RcIiksXG4gICAgICAgIGRlbWFuZEJ5SWQoJ3ZvbC1nbG9uZycpLFxuICAgICAgICBkZW1hbmRCeUlkKCd2b2wtY2hpbmcnKVxuICAgICAgKS50aGVuKCgpID0+IHtcbiAgICAgICAgLy8gUmUtdHJpZ2dlciB0aGUgb3JpZ2luYWwgY2xpY2sgZXZlbnQgYXMgdGhlIHNldHVwIGZ1bmN0aW9uIHdvdWxkIGhhdmUgYWRkZWQgbmV3IGV2ZW50cy5cbiAgICAgICAgYXNzZXJ0KGUudGFyZ2V0ICYmIGUudGFyZ2V0IGluc3RhbmNlb2YgSFRNTEVsZW1lbnQpXG4gICAgICAgIGUudGFyZ2V0LmNsaWNrKClcbiAgICAgIH0pLmNhdGNoKGV4ID0+IHtcbiAgICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpXG4gICAgICAgIHNldHVwQWxsQnV0dG9ucygpXG4gICAgICAgIGVycm9ySGFuZGxlcihleClcbiAgICAgIH0pXG4gICAgfVxuXG4gICAgc2V0dXBBbGxCdXR0b25zKClcbiAgfSlcbn0pXG4iXX0=