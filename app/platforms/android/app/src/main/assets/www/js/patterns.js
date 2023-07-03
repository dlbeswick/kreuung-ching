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
System.register(["./lib/parser.js", "./lib/assert.js"], function (exports_1, context_1) {
    "use strict";
    var parser_js_1, assert_js_1, patternGabber, dahmNoyJaiYah, pleyngDahmLao, pleyngDahmKhmen, pleyngKhmenOmDteuk, SegmentAction, ActionWait, ActionBpm, ActionBpmAbsolute, ActionBpmFactor, ActionEnd, ActionChun, ActionDrumPattern, grammar;
    var __moduleName = context_1 && context_1.id;
    return {
        setters: [
            function (parser_js_1_1) {
                parser_js_1 = parser_js_1_1;
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
            exports_1("patternGabber", patternGabber = "023231010xx1515234x26231");
            exports_1("dahmNoyJaiYah", dahmNoyJaiYah = "x01xxxx0 1xx01xxx\n" +
                "x01xxxx0 1xx01xxx\n" +
                "x01xxxx0 1xx01xxx\n" +
                "x01xxxx0 1xx01xxx\n" +
                "x01xxxx0 1xx01xxx\n" +
                "x01xxxx0 1xx01xxx\n" +
                "x0101xx0 1xx01xxx\n" +
                "x01xxxx0 1xx01xxx\n");
            exports_1("pleyngDahmLao", pleyngDahmLao = "0x1x3x1x1xxx0x1x \n" +
                "0x1x3x1x1xxx0x1x \n" +
                "0x1x3x1x1xxx0x1x \n" +
                "0x1x3x131xxx0x1x \n" +
                "\n" +
                "0x1x3x1x1xxx0x1x \n" +
                "0x1x3x1x1xxx0x1x \n" +
                "0x1x3x1x1xxx0x1x \n" +
                "0x1x3x131x010x1x \n");
            exports_1("pleyngDahmKhmen", pleyngDahmKhmen = "0xx23x1x0x1x01x2 \n" +
                "3xx23x2x3x2x3x1x \n" +
                "0xx23x1x0x1x01x2 \n" +
                "3xx232323x123101 \n" +
                "\n" +
                "0xx23x110x1x01x2 \n" +
                "3xx2323232323x11 \n" +
                "0xx23x11023101x2 \n" +
                "3xxxx23232323101 \n");
            exports_1("pleyngKhmenOmDteuk", pleyngKhmenOmDteuk = "# เขมรอมตึ๊ก ท่อน ๑\n" +
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
                "\n");
            // Drum patterns are working as a state-machine -- one state for instantaneous actions like BPM changes and
            // one state for iterating through drum patterns, wait states, etc. This choice was made because I didn't want
            // to create one object per note during the parsing phase, to save memory.
            //
            // Instantaneous actions are processed before timespan actions.
            SegmentAction = class SegmentAction {
                constructor(span) {
                    this.instants = [];
                    this.span = span;
                }
            };
            exports_1("SegmentAction", SegmentAction);
            ActionWait = class ActionWait {
                constructor(_length) {
                    this._length = _length;
                }
                seek(tickRelative) {
                    assert_js_1.assert(tickRelative < this.length());
                    this._tick = tickRelative;
                }
                length() { return this._length; }
                tick(glongSet, bpm) {
                    return this._tick++ == bpm.ticksPerHong() * this.length();
                }
            };
            ActionBpm = class ActionBpm {
                constructor(time) {
                    this.time = time;
                }
                run(bpm, isFirstTick) {
                    var _a;
                    const bpmEnd = this.bpmEnd(bpm.bpm());
                    bpm.bpmRampHongs(bpmEnd, isFirstTick ? 0 : (_a = this.time) !== null && _a !== void 0 ? _a : 6);
                }
            };
            ActionBpmAbsolute = class ActionBpmAbsolute extends ActionBpm {
                constructor(bpm, time) {
                    super(time);
                    this.bpm = bpm;
                }
                bpmEnd(bpm) { return this.bpm; }
            };
            ActionBpmFactor = class ActionBpmFactor extends ActionBpm {
                constructor(factor, time) {
                    super(time);
                    this.factor = factor;
                }
                bpmEnd(bpm) { return bpm * this.factor; }
            };
            ActionEnd = class ActionEnd {
                constructor(time = 6) {
                    this.time = time;
                }
                run(bpm, isFirstTick) {
                    // Add a bit of hong of slowing (end on chup, default 6 hong)
                    bpm.end(this.time + 0.1);
                }
            };
            ActionChun = class ActionChun {
                constructor(chun) {
                    this.chun = chun;
                }
                run(bpm, isFirstTick) {
                    bpm.chunSet(this.chun);
                }
            };
            ActionDrumPattern = class ActionDrumPattern {
                constructor(pattern) {
                    this.pattern = pattern;
                    this.idx = 0;
                    this._length = pattern.replace(new RegExp(ActionDrumPattern.registers, 'g'), '').length;
                }
                seek(tickRelative) {
                    assert_js_1.assert(tickRelative < this._length);
                    this.idx = 0;
                    for (let tick = 0; tick != tickRelative; ++this.idx) {
                        if (!ActionDrumPattern.registers.exec(this.pattern[this.idx])) {
                            ++tick;
                        }
                    }
                }
                length() { return this._length; }
                tick(glongSet) {
                    var _a;
                    assert_js_1.assert(this.idx <= this.pattern.length);
                    if (this.idx == this.pattern.length) {
                        return true;
                    }
                    else {
                        const action = this.pattern[this.idx];
                        if (action == 'x') {
                            ++this.idx;
                        }
                        else {
                            const register = ActionDrumPattern.registers.exec((_a = this.pattern[this.idx + 1]) !== null && _a !== void 0 ? _a : '');
                            glongSet.glong(0, register && register[0] == '.' ? 0.1 + Math.random() * 0.1 : 1.0, Number(action));
                            this.idx += register ? 2 : 1;
                        }
                        return false;
                    }
                }
            };
            ActionDrumPattern.registers = /[^0-9x]/;
            exports_1("grammar", grammar = new parser_js_1.Grammar([
                new parser_js_1.TerminalRegex("REST", /^x/i, undefined, 'x'),
                new parser_js_1.TerminalRegex("SPACE", /^\s+/, undefined, ' '),
                new parser_js_1.TerminalRegex("DIGIT", /^\d/, 0),
                new parser_js_1.TerminalLit("PERIOD", "."),
                new parser_js_1.TerminalLit("PERCENT", "%"),
                new parser_js_1.TerminalLit("SLASH", "/"),
                new parser_js_1.TerminalRegex("BPM", /^BPM/i, undefined, 'BPM'),
                new parser_js_1.TerminalRegex("END", /^END/i, undefined, 'END'),
                new parser_js_1.TerminalRegex("WAIT", /^WAIT/i, undefined, 'WAIT'),
                new parser_js_1.TerminalRegex("CHUN", /^CHUN/i, undefined, 'CHUN'),
                new parser_js_1.TerminalRegex("COMMENT", /^#.*/, 0),
            ], [
                new parser_js_1.ParseRule('score', [
                    ['COMMENT'],
                    ['whitespace'],
                    ['drumpattern'],
                    ['bpm'],
                    ['end'],
                    ['chun'],
                    ['wait'],
                ], (nodes, ctx) => nodes[0].semantic(ctx)),
                new parser_js_1.ParseRule('whitespace', [
                    ['SPACE', 'whitespace'],
                    ['SPACE']
                ], (nodes) => null),
                new parser_js_1.ParseRule('number', [
                    ['DIGIT', 'number'],
                    ['DIGIT'],
                ], (nodes) => {
                    let digits = "";
                    while (true) {
                        digits += nodes[0].lexeme;
                        if (nodes.length == 2) {
                            nodes = nodes[1].nodes;
                        }
                        else {
                            return Number(digits);
                        }
                    }
                }),
                new parser_js_1.ParseRule('drumpattern', [
                    ['DIGIT', 'PERIOD', 'drumpattern'],
                    ['DIGIT', 'drumpattern'],
                    ['REST', 'drumpattern'],
                    ['whitespace', 'drumpattern'],
                    ['DIGIT', 'PERIOD'],
                    ['DIGIT'],
                    ['REST']
                ], (nodes, ctx) => {
                    var _a, _b;
                    let pattern = "";
                    while (true) {
                        for (const n of nodes)
                            pattern += (_a = n.lexeme) !== null && _a !== void 0 ? _a : '';
                        if (nodes[nodes.length - 1].nodes) {
                            nodes = nodes[nodes.length - 1].nodes;
                        }
                        else {
                            break;
                        }
                    }
                    const action = new ActionDrumPattern(pattern);
                    if ((_b = ctx[ctx.length - 1]) === null || _b === void 0 ? void 0 : _b.span)
                        ctx.push(new SegmentAction(action));
                    else
                        ctx[ctx.length - 1].span = action;
                }),
                new parser_js_1.ParseRule('bpm', [
                    ['BPM', 'number', 'PERCENT', 'SLASH', 'number'],
                    ['BPM', 'number', 'SLASH', 'number'],
                    ['BPM', 'number', 'PERCENT'],
                    ['BPM', 'number'],
                ], (nodes, ctx) => {
                    var _a;
                    if (ctx[ctx.length - 1].span)
                        ctx.push(new SegmentAction());
                    const value = nodes[1].semantic();
                    const time = (_a = nodes[nodes.length - 1]) === null || _a === void 0 ? void 0 : _a.semantic();
                    if (nodes.length == 2 || nodes.length == 4)
                        ctx[ctx.length - 1].instants.push(new ActionBpmAbsolute(value, time));
                    else
                        ctx[ctx.length - 1].instants.push(new ActionBpmFactor(value / 100, time));
                }),
                new parser_js_1.ParseRule('end', [['END', 'SLASH', 'number'],
                    ['END']], (nodes, ctx) => {
                    var _a;
                    if (ctx[ctx.length - 1].span)
                        ctx.push(new SegmentAction());
                    ctx[ctx.length - 1].instants.push(new ActionEnd((_a = nodes[2]) === null || _a === void 0 ? void 0 : _a.semantic()));
                }),
                new parser_js_1.ParseRule('chun', [['CHUN', 'number']], (nodes, ctx) => {
                    var _a;
                    if (ctx[ctx.length - 1].span)
                        ctx.push(new SegmentAction());
                    ctx[ctx.length - 1].instants.push(new ActionChun((_a = nodes[1]) === null || _a === void 0 ? void 0 : _a.semantic()));
                }),
                new parser_js_1.ParseRule('wait', [['WAIT', 'number']], (nodes, ctx) => {
                    const action = new ActionWait(nodes[1].semantic());
                    if (ctx[ctx.length - 1].span)
                        ctx.push(new SegmentAction(action));
                    else
                        ctx[ctx.length - 1].span = action;
                })
            ]));
        }
    };
});
