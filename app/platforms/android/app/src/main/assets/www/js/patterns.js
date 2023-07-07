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
        execute: function () {
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
                    this._tick = 0;
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicGF0dGVybnMuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi90cy9wYXR0ZXJucy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7Ozs7Ozs7Ozs7Ozs7Ozs7OztFQW1CRTs7Ozs7Ozs7Ozs7Ozs7O1lBUUYsMkJBQWEsYUFBYSxHQUFDLDBCQUEwQixFQUFDO1lBRXRELDJCQUFhLGFBQWEsR0FDMUIscUJBQXFCO2dCQUNyQixxQkFBcUI7Z0JBQ3JCLHFCQUFxQjtnQkFDckIscUJBQXFCO2dCQUNyQixxQkFBcUI7Z0JBQ3JCLHFCQUFxQjtnQkFDckIscUJBQXFCO2dCQUNyQixxQkFBcUIsRUFBQTtZQUdyQiwyQkFBYSxhQUFhLEdBQ3hCLHFCQUFxQjtnQkFDckIscUJBQXFCO2dCQUNyQixxQkFBcUI7Z0JBQ3JCLHFCQUFxQjtnQkFDckIsSUFBSTtnQkFDSixxQkFBcUI7Z0JBQ3JCLHFCQUFxQjtnQkFDckIscUJBQXFCO2dCQUNyQixxQkFBcUIsRUFBRTtZQUV6Qiw2QkFBYSxlQUFlLEdBQzFCLHFCQUFxQjtnQkFDckIscUJBQXFCO2dCQUNyQixxQkFBcUI7Z0JBQ3JCLHFCQUFxQjtnQkFDckIsSUFBSTtnQkFDSixxQkFBcUI7Z0JBQ3JCLHFCQUFxQjtnQkFDckIscUJBQXFCO2dCQUNyQixxQkFBcUIsRUFBRTtZQUV6QixnQ0FBYSxrQkFBa0IsR0FBQyx1QkFBdUI7Z0JBQ3JELGlEQUFpRDtnQkFDakQsYUFBYTtnQkFDYixxQkFBcUI7Z0JBQ3JCLHFCQUFxQjtnQkFDckIscUJBQXFCO2dCQUNyQixxQkFBcUI7Z0JBQ3JCLHFCQUFxQjtnQkFDckIscUJBQXFCO2dCQUNyQixxQkFBcUI7Z0JBQ3JCLElBQUk7Z0JBQ0oscUJBQXFCO2dCQUNyQixxQkFBcUI7Z0JBQ3JCLHFCQUFxQjtnQkFDckIscUJBQXFCO2dCQUNyQixxQkFBcUI7Z0JBQ3JCLHFCQUFxQjtnQkFDckIscUJBQXFCO2dCQUNyQixxQkFBcUI7Z0JBQ3JCLElBQUk7Z0JBQ0os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QUMsQ0FBQyxJQUFJLEdBQUcsTUFBTSxDQUFBO2dCQUNuQyxDQUFDLENBQ0w7YUFDQyxDQUNGLEVBQUEiLCJzb3VyY2VzQ29udGVudCI6WyIvKlxuXHTguYDguITguKPguLfguYjguK3guIfguInguLTguYjguIcgLyBLcmV1dW5nIENoaW5nXG4gIFRoaXMgZmlsZSBpcyBwYXJ0IG9mIHRoZSBBdXRvbWF0aWMgQ2hpbmcgcHJvZ3JhbSBmb3IgcHJhY3RpY2luZ1xuICBUaGFpIG11c2ljLlxuICBcbiAgQ29weXJpZ2h0IChDKSAyMDE5IERhdmlkIEJlc3dpY2sgPGRsYmVzd2lja0BnbWFpbC5jb20+XG5cbiAgVGhpcyBwcm9ncmFtIGlzIGZyZWUgc29mdHdhcmU6IHlvdSBjYW4gcmVkaXN0cmlidXRlIGl0IGFuZC9vciBtb2RpZnlcbiAgaXQgdW5kZXIgdGhlIHRlcm1zIG9mIHRoZSBHTlUgQWZmZXJvIEdlbmVyYWwgUHVibGljIExpY2Vuc2UgYXNcbiAgcHVibGlzaGVkIGJ5IHRoZSBGcmVlIFNvZnR3YXJlIEZvdW5kYXRpb24sIGVpdGhlciB2ZXJzaW9uIDMgb2YgdGhlXG4gIExpY2Vuc2UsIG9yIChhdCB5b3VyIG9wdGlvbikgYW55IGxhdGVyIHZlcnNpb24uXG5cbiAgVGhpcyBwcm9ncmFtIGlzIGRpc3RyaWJ1dGVkIGluIHRoZSBob3BlIHRoYXQgaXQgd2lsbCBiZSB1c2VmdWwsXG4gIGJ1dCBXSVRIT1VUIEFOWSBXQVJSQU5UWTsgd2l0aG91dCBldmVuIHRoZSBpbXBsaWVkIHdhcnJhbnR5IG9mXG4gIE1FUkNIQU5UQUJJTElUWSBvciBGSVRORVNTIEZPUiBBIFBBUlRJQ1VMQVIgUFVSUE9TRS4gIFNlZSB0aGVcbiAgR05VIEFmZmVybyBHZW5lcmFsIFB1YmxpYyBMaWNlbnNlIGZvciBtb3JlIGRldGFpbHMuXG5cbiAgWW91IHNob3VsZCBoYXZlIHJlY2VpdmVkIGEgY29weSBvZiB0aGUgR05VIEFmZmVybyBHZW5lcmFsIFB1YmxpYyBMaWNlbnNlXG4gIGFsb25nIHdpdGggdGhpcyBwcm9ncmFtLiAgSWYgbm90LCBzZWUgPGh0dHBzOi8vd3d3LmdudS5vcmcvbGljZW5zZXMvPi5cbiovXG5cbmltcG9ydCB7IEJwbUNvbnRyb2wgfSBmcm9tICcuL2JwbS5qcyc7XG5pbXBvcnQgeyBHbG9uZ1NldCB9IGZyb20gXCIuL2dsb25nc2V0LmpzXCJcbmltcG9ydCB7IEdyYW1tYXIsIFBhcnNlUnVsZSwgVGVybWluYWxMaXQsIFRlcm1pbmFsUmVnZXggfSBmcm9tICcuL2xpYi9wYXJzZXIuanMnO1xuXG5pbXBvcnQgeyBhc3NlcnQgfSBmcm9tIFwiLi9saWIvYXNzZXJ0LmpzXCJcblxuZXhwb3J0IGNvbnN0IHBhdHRlcm5HYWJiZXI9XCIwMjMyMzEwMTB4eDE1MTUyMzR4MjYyMzFcIjtcblxuZXhwb3J0IGNvbnN0IGRhaG1Ob3lKYWlZYWg9XG5cIngwMXh4eHgwIDF4eDAxeHh4XFxuXCIrXG5cIngwMXh4eHgwIDF4eDAxeHh4XFxuXCIrXG5cIngwMXh4eHgwIDF4eDAxeHh4XFxuXCIrXG5cIngwMXh4eHgwIDF4eDAxeHh4XFxuXCIrXG5cIngwMXh4eHgwIDF4eDAxeHh4XFxuXCIrXG5cIngwMXh4eHgwIDF4eDAxeHh4XFxuXCIrXG5cIngwMTAxeHgwIDF4eDAxeHh4XFxuXCIrXG5cIngwMXh4eHgwIDF4eDAxeHh4XFxuXCJcblxuXG5leHBvcnQgY29uc3QgcGxleW5nRGFobUxhbz1cbiAgXCIweDF4M3gxeDF4eHgweDF4IFxcblwiICtcbiAgXCIweDF4M3gxeDF4eHgweDF4IFxcblwiICtcbiAgXCIweDF4M3gxeDF4eHgweDF4IFxcblwiICtcbiAgXCIweDF4M3gxMzF4eHgweDF4IFxcblwiICtcbiAgXCJcXG5cIiAgICAgICAgICAgICAgICAgICtcbiAgXCIweDF4M3gxeDF4eHgweDF4IFxcblwiICtcbiAgXCIweDF4M3gxeDF4eHgweDF4IFxcblwiICtcbiAgXCIweDF4M3gxeDF4eHgweDF4IFxcblwiICtcbiAgXCIweDF4M3gxMzF4MDEweDF4IFxcblwiIDtcblxuZXhwb3J0IGNvbnN0IHBsZXluZ0RhaG1LaG1lbj1cbiAgXCIweHgyM3gxeDB4MXgwMXgyIFxcblwiICtcbiAgXCIzeHgyM3gyeDN4MngzeDF4IFxcblwiICtcbiAgXCIweHgyM3gxeDB4MXgwMXgyIFxcblwiICtcbiAgXCIzeHgyMzIzMjN4MTIzMTAxIFxcblwiICtcbiAgXCJcXG5cIiAgICAgICAgICAgICAgICAgICtcbiAgXCIweHgyM3gxMTB4MXgwMXgyIFxcblwiICtcbiAgXCIzeHgyMzIzMjMyMzIzeDExIFxcblwiICtcbiAgXCIweHgyM3gxMTAyMzEwMXgyIFxcblwiICtcbiAgXCIzeHh4eDIzMjMyMzIzMTAxIFxcblwiIDtcblxuZXhwb3J0IGNvbnN0IHBsZXluZ0tobWVuT21EdGV1az1cIiMg4LmA4LiC4Lih4Lij4Lit4Lih4LiV4Li24LmK4LiBIOC4l+C5iOC4reC4mSDguZFcXG5cIiArXG4gIFwiIyBodHRwczovL3d3dy55b3V0dWJlLmNvbS93YXRjaD92PWN2NUI0cm9UMEJvXFxuXCIgK1xuICBcInh4eHh4eHh4IFxcblwiK1x0XG4gIFwieHh4eHh4eHggeHgxMTAxeDJcXG5cIitcbiAgXCIzeHgyM3gyeCAzeDJ4M3gxeFxcblwiK1xuICBcIjB4eDIzeDF4IDB4MXgwMXgyXFxuXCIrXG4gIFwiM3h4MjMyMzIgM3gxMjMxMDFcXG5cIitcbiAgXCIweHgyM3gxMSAwMjMxMDF4MlxcblwiK1xuICBcIjN4eDIzMjMyIDMyMzIzeDExXFxuXCIrXG4gIFwiMHh4MjN4MTEgMDIzMTAxeDJcXG5cIitcbiAgXCJcXG5cIiArXG4gIFwiM3h4eHgyMzIgMzIzMjMxMDFcXG5cIitcbiAgXCIweHgyMzEwMSAwMjMxMDF4MlxcblwiK1xuICBcIjN4eDIzMjMyIDMyMzIzMTAxXFxuXCIrXG4gIFwiMHh4MjMxMDEgMDIzMTAxeDJcXG5cIitcbiAgXCIzeHgyMzIzMiAzeDEyM3gxMVxcblwiK1xuICBcIjB4eDIzeDExIDAyMzEwMXgyXFxuXCIrXG4gIFwiM3h4MjMyMzIgMzIzMjMxMDFcXG5cIitcbiAgXCIwMjMyMzEwMSAwMjMxMDF4MlxcblwiK1xuICBcIlxcblwiICtcbiAgXCIzeHgyMzIzMiAzMjMyMzEwMVxcblwiK1xuICBcIjB4eDIzeDExIDAyMzEwMXgyXFxuXCIrXG4gIFwiM3h4MjMyMzIgMzMxMjMxMDFcXG5cIitcbiAgXCIweHgyM3gxeCAwMjMxMDF4MlxcblwiK1xuICBcIjN4eDIzMjMyIDN4MTIzMzExXFxuXCIrXG4gIFwiMHh4MjN4MTEgMDIzMTAxeDJcXG5cIitcbiAgXCIzeHgyMzIzMiAzMjMyMzEwMVxcblwiK1xuICBcIjB4eDIzeDExIDAyMzEwMXgyXFxuXCIrXG4gIFwiM3h4MjMyMzIgMzIzMjMxMDFcXG5cIitcbiAgXCIweHgyMzEwMSAwMjMxMDF4MlxcblwiK1xuICBcIjN4eDIzMjMyIDMyMzIzMTAxXFxuXCIrXG4gIFwiMDIzMjMxMDEgMDIzMTAyeDNcXG5cIitcbiAgXCIzeHgyMzIzMiAzMjMyMzEwMVxcblwiK1xuICBcIlxcblwiICtcbiAgXCIweHgyMzEwMSAwMjMxMDF4MlxcblwiK1xuICBcIjN4eDIzMjMyIDMyMzIzMTAxXFxuXCIrXG4gIFwiMHh4MjMxMDEgMDIzMTAxeDJcXG5cIitcbiAgXCIzeHgyMzIzMiAzeDEyM3gxMVxcblwiK1xuICBcIjB4eDIzeDExIDAyMzEwMXgyXFxuXCIrXG4gIFwiM3h4MjMyMzIgMzIzMjMxMDFcXG5cIitcbiAgXCIwMjMyMzEwMSAwMjMxMDF4MlxcblwiK1xuICBcIjN4eDIzMjMyIDMyMzIzMTAxXFxuXCIrXG4gIFwiXFxuXCIgK1xuICBcIjB4eDIzMTAxIDAyMzEwMXgyXFxuXCIrXG4gIFwiM3h4MjMyMzIgMzIzMjMxMDFcXG5cIitcbiAgXCIweHgyMzEwMSAwMjMxMDF4MlxcblwiK1xuICBcIjN4eDIzMjMyIDN4MTIzeDExXFxuXCIrXG4gIFwiMHh4MjN4MTEgMDIzMTAxeDJcXG5cIitcbiAgXCIzeHgyMzIzMiAzMjMyMzEwMVxcblwiK1xuICBcIjAyMzIzMTAxIDAyMzEwMXgyXFxuXCIrXG4gIFwiM3h4MjMyMzIgMzIzMjMxMDFcXG5cIitcbiAgXCJcXG5cIiArXG4gIFwiMHh4MjN4MTEgMDIzMTAxeDJcXG5cIitcbiAgXCIzeHgyMzIzMiAzMzEyMzEwMVxcblwiK1xuICBcIjB4eDIzeDF4IDAyMzEwMXgyXFxuXCIrXG4gIFwiM3h4MjMyMzIgM3gxMjMzMTFcXG5cIitcbiAgXCIweHgyM3gxMSAwMjMxMDF4MlxcblwiK1xuICBcIjN4eDIzMjMyIDMyMzIzMTAxXFxuXCIrXG4gIFwiMHh4MjN4MTEgMDIzMTAxeDJcXG5cIitcbiAgXCIzeHgyMzIzMiAzMjMyMzEwMVxcblwiK1xuICBcIjB4eDIzMTAxIDAyMzEwMXgyXFxuXCIrXG4gIFwiM3h4MjMyMzIgMzIzMjMxMDFcXG5cIitcbiAgXCJcXG5cIiArXG4gIFwiRU5EXFxuXCIrXG4gIFwiMDIzMjMxMDEgMDIzMTAyeDNcXG5cIitcbiAgXCJ4eHh4eHh4eCB4eHh4eHh4eFxcblwiK1xuICBcIlxcblwiO1xuXG4vLyBEcnVtIHBhdHRlcm5zIGFyZSB3b3JraW5nIGFzIGEgc3RhdGUtbWFjaGluZSAtLSBvbmUgc3RhdGUgZm9yIGluc3RhbnRhbmVvdXMgYWN0aW9ucyBsaWtlIEJQTSBjaGFuZ2VzIGFuZFxuLy8gb25lIHN0YXRlIGZvciBpdGVyYXRpbmcgdGhyb3VnaCBkcnVtIHBhdHRlcm5zLCB3YWl0IHN0YXRlcywgZXRjLiBUaGlzIGNob2ljZSB3YXMgbWFkZSBiZWNhdXNlIEkgZGlkbid0IHdhbnRcbi8vIHRvIGNyZWF0ZSBvbmUgb2JqZWN0IHBlciBub3RlIGR1cmluZyB0aGUgcGFyc2luZyBwaGFzZSwgdG8gc2F2ZSBtZW1vcnkuXG4vL1xuLy8gSW5zdGFudGFuZW91cyBhY3Rpb25zIGFyZSBwcm9jZXNzZWQgYmVmb3JlIHRpbWVzcGFuIGFjdGlvbnMuXG5leHBvcnQgY2xhc3MgU2VnbWVudEFjdGlvbiB7XG4gIGluc3RhbnRzOiBBY3Rpb25JbnN0YW50W10gPSBbXVxuICBzcGFuPzogQWN0aW9uVGltZXNwYW5cbiAgXG4gIGNvbnN0cnVjdG9yKHNwYW4/OiBBY3Rpb25UaW1lc3Bhbikge1xuICAgIHRoaXMuc3BhbiA9IHNwYW5cbiAgfVxufVxuXG5leHBvcnQgaW50ZXJmYWNlIEFjdGlvbkluc3RhbnQge1xuICBydW4oYnBtOiBCcG1Db250cm9sLCBpc0ZpcnN0VGljazogYm9vbGVhbik6IHZvaWRcbn1cblxuZXhwb3J0IGludGVyZmFjZSBBY3Rpb25UaW1lc3BhbiB7XG4gIHRpY2soZ2xvbmdTZXQ6IEdsb25nU2V0LCBicG06IEJwbUNvbnRyb2wpOiBib29sZWFuXG4gIHNlZWsodGlja1JlbGF0aXZlOiBudW1iZXIpOiB2b2lkXG4gIGxlbmd0aCgpOiBudW1iZXJcbn1cblxuY2xhc3MgQWN0aW9uV2FpdCBpbXBsZW1lbnRzIEFjdGlvblRpbWVzcGFuIHtcbiAgcHJpdmF0ZSBfdGljayA9IDBcbiAgY29uc3RydWN0b3IocHJpdmF0ZSByZWFkb25seSBfbGVuZ3RoOiBudW1iZXIpIHt9XG5cbiAgc2Vlayh0aWNrUmVsYXRpdmU6IG51bWJlcik6IHZvaWQge1xuICAgIGFzc2VydCh0aWNrUmVsYXRpdmUgPCB0aGlzLmxlbmd0aCgpKVxuICAgIHRoaXMuX3RpY2sgPSB0aWNrUmVsYXRpdmVcbiAgfVxuXG4gIGxlbmd0aCgpIHsgcmV0dXJuIHRoaXMuX2xlbmd0aCB9XG4gIFxuICB0aWNrKGdsb25nU2V0OiBHbG9uZ1NldCwgYnBtOiBCcG1Db250cm9sKTogYm9vbGVhbiB7XG4gICAgcmV0dXJuIHRoaXMuX3RpY2srKyA9PSBicG0udGlja3NQZXJIb25nKCkgKiB0aGlzLmxlbmd0aCgpXG4gIH1cbn1cblxuYWJzdHJhY3QgY2xhc3MgQWN0aW9uQnBtIGltcGxlbWVudHMgQWN0aW9uSW5zdGFudCB7XG4gIGNvbnN0cnVjdG9yKHByaXZhdGUgcmVhZG9ubHkgdGltZT86IG51bWJlcikge31cblxuICBhYnN0cmFjdCBicG1FbmQoYnBtOiBudW1iZXIpOiBudW1iZXJcbiAgXG4gIHJ1bihicG06IEJwbUNvbnRyb2wsIGlzRmlyc3RUaWNrOiBib29sZWFuKSB7XG4gICAgY29uc3QgYnBtRW5kID0gdGhpcy5icG1FbmQoYnBtLmJwbSgpKVxuICAgIGJwbS5icG1SYW1wSG9uZ3MoYnBtRW5kLCBpc0ZpcnN0VGljayA/IDAgOiB0aGlzLnRpbWUgPz8gNilcbiAgfVxufVxuXG5jbGFzcyBBY3Rpb25CcG1BYnNvbHV0ZSBleHRlbmRzIEFjdGlvbkJwbSB7XG4gIGNvbnN0cnVjdG9yKHByaXZhdGUgcmVhZG9ubHkgYnBtOiBudW1iZXIsIHRpbWU/OiBudW1iZXIpIHtcbiAgICBzdXBlcih0aW1lKVxuICB9XG5cbiAgYnBtRW5kKGJwbTogbnVtYmVyKTogbnVtYmVyIHsgcmV0dXJuIHRoaXMuYnBtIH1cbn1cblxuY2xhc3MgQWN0aW9uQnBtRmFjdG9yIGV4dGVuZHMgQWN0aW9uQnBtIHtcbiAgY29uc3RydWN0b3IocHJpdmF0ZSByZWFkb25seSBmYWN0b3I6IG51bWJlciwgdGltZT86IG51bWJlcikge1xuICAgIHN1cGVyKHRpbWUpXG4gIH1cblxuICBicG1FbmQoYnBtOiBudW1iZXIpOiBudW1iZXIgeyByZXR1cm4gYnBtICogdGhpcy5mYWN0b3IgfVxufVxuXG5jbGFzcyBBY3Rpb25FbmQgaW1wbGVtZW50cyBBY3Rpb25JbnN0YW50IHtcbiAgY29uc3RydWN0b3IocHJpdmF0ZSByZWFkb25seSB0aW1lOiBudW1iZXIgPSA2KSB7fVxuXG4gIHJ1bihicG06IEJwbUNvbnRyb2wsIGlzRmlyc3RUaWNrOiBib29sZWFuKSB7XG4gICAgLy8gQWRkIGEgYml0IG9mIGhvbmcgb2Ygc2xvd2luZyAoZW5kIG9uIGNodXAsIGRlZmF1bHQgNiBob25nKVxuICAgIGJwbS5lbmQodGhpcy50aW1lICsgMC4xKVxuICB9XG59XG5cbmNsYXNzIEFjdGlvbkNodW4gaW1wbGVtZW50cyBBY3Rpb25JbnN0YW50IHtcbiAgY29uc3RydWN0b3IocHJpdmF0ZSByZWFkb25seSBjaHVuOiBudW1iZXIpIHt9XG5cbiAgcnVuKGJwbTogQnBtQ29udHJvbCwgaXNGaXJzdFRpY2s6IGJvb2xlYW4pIHtcbiAgICBicG0uY2h1blNldCh0aGlzLmNodW4pXG4gIH1cbn1cblxuY2xhc3MgQWN0aW9uRHJ1bVBhdHRlcm4gaW1wbGVtZW50cyBBY3Rpb25UaW1lc3BhbiB7XG4gIHByaXZhdGUgcmVhZG9ubHkgX2xlbmd0aDogbnVtYmVyXG4gIHByaXZhdGUgaWR4OiBudW1iZXIgPSAwXG5cbiAgcHJpdmF0ZSBzdGF0aWMgcmVhZG9ubHkgcmVnaXN0ZXJzID0gL1teMC05eF0vXG4gIFxuICBjb25zdHJ1Y3Rvcihwcml2YXRlIHJlYWRvbmx5IHBhdHRlcm46IHN0cmluZykge1xuICAgIHRoaXMuX2xlbmd0aCA9IHBhdHRlcm4ucmVwbGFjZShuZXcgUmVnRXhwKEFjdGlvbkRydW1QYXR0ZXJuLnJlZ2lzdGVycywgJ2cnKSwnJykubGVuZ3RoICAgIFxuICB9XG5cbiAgc2Vlayh0aWNrUmVsYXRpdmU6IG51bWJlcik6IHZvaWQge1xuICAgIGFzc2VydCh0aWNrUmVsYXRpdmUgPCB0aGlzLl9sZW5ndGgpXG4gICAgdGhpcy5pZHggPSAwXG4gICAgZm9yIChsZXQgdGljayA9IDA7IHRpY2sgIT0gdGlja1JlbGF0aXZlOyArK3RoaXMuaWR4KSB7XG4gICAgICBpZiAoIUFjdGlvbkRydW1QYXR0ZXJuLnJlZ2lzdGVycy5leGVjKHRoaXMucGF0dGVyblt0aGlzLmlkeF0pKSB7XG4gICAgICAgICsrdGlja1xuICAgICAgfVxuICAgIH1cbiAgfVxuICBcbiAgbGVuZ3RoKCkgeyByZXR1cm4gdGhpcy5fbGVuZ3RoIH1cbiAgXG4gIHRpY2soZ2xvbmdTZXQ6IEdsb25nU2V0KTogYm9vbGVhbiB7XG4gICAgYXNzZXJ0KHRoaXMuaWR4IDw9IHRoaXMucGF0dGVybi5sZW5ndGgpXG4gICAgaWYgKHRoaXMuaWR4ID09IHRoaXMucGF0dGVybi5sZW5ndGgpIHtcbiAgICAgIHJldHVybiB0cnVlXG4gICAgfSBlbHNlIHtcbiAgICAgIGNvbnN0IGFjdGlvbiA9IHRoaXMucGF0dGVyblt0aGlzLmlkeF1cbiAgICAgIGlmIChhY3Rpb24gPT0gJ3gnKSB7XG4gICAgICAgICsrdGhpcy5pZHhcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGNvbnN0IHJlZ2lzdGVyID0gQWN0aW9uRHJ1bVBhdHRlcm4ucmVnaXN0ZXJzLmV4ZWModGhpcy5wYXR0ZXJuW3RoaXMuaWR4ICsgMV0gPz8gJycpXG4gICAgICAgIGdsb25nU2V0Lmdsb25nKDAsIHJlZ2lzdGVyICYmIHJlZ2lzdGVyWzBdID09ICcuJyA/IDAuMSArIE1hdGgucmFuZG9tKCkqMC4xIDogMS4wLCBOdW1iZXIoYWN0aW9uKSlcbiAgICAgICAgdGhpcy5pZHggKz0gcmVnaXN0ZXIgPyAyIDogMVxuICAgICAgfVxuICAgICAgcmV0dXJuIGZhbHNlXG4gICAgfSAgICBcbiAgfVxufVxuXG5leHBvcnQgY29uc3QgZ3JhbW1hciA9IG5ldyBHcmFtbWFyKFxuICBbXG5cdG5ldyBUZXJtaW5hbFJlZ2V4KFwiUkVTVFwiLCAvXngvaSwgdW5kZWZpbmVkLCAneCcpLFxuXHRuZXcgVGVybWluYWxSZWdleChcIlNQQUNFXCIsIC9eXFxzKy8sIHVuZGVmaW5lZCwgJyAnKSxcblx0bmV3IFRlcm1pbmFsUmVnZXgoXCJESUdJVFwiLCAvXlxcZC8sIDApLFxuXHRuZXcgVGVybWluYWxMaXQoXCJQRVJJT0RcIiwgXCIuXCIpLFxuXHRuZXcgVGVybWluYWxMaXQoXCJQRVJDRU5UXCIsIFwiJVwiKSxcblx0bmV3IFRlcm1pbmFsTGl0KFwiU0xBU0hcIiwgXCIvXCIpLFxuXHRuZXcgVGVybWluYWxSZWdleChcIkJQTVwiLCAvXkJQTS9pLCB1bmRlZmluZWQsICdCUE0nKSxcblx0bmV3IFRlcm1pbmFsUmVnZXgoXCJFTkRcIiwgL15FTkQvaSwgdW5kZWZpbmVkLCAnRU5EJyksXG5cdG5ldyBUZXJtaW5hbFJlZ2V4KFwiV0FJVFwiLCAvXldBSVQvaSwgdW5kZWZpbmVkLCAnV0FJVCcpLFxuXHRuZXcgVGVybWluYWxSZWdleChcIkNIVU5cIiwgL15DSFVOL2ksIHVuZGVmaW5lZCwgJ0NIVU4nKSxcblx0bmV3IFRlcm1pbmFsUmVnZXgoXCJDT01NRU5UXCIsIC9eIy4qLywgMCksXG4gIF0sXG4gIFtcblx0bmV3IFBhcnNlUnVsZShcblx0ICAnc2NvcmUnLFxuXHQgIFtcblx0XHRbJ0NPTU1FTlQnXSxcblx0XHRbJ3doaXRlc3BhY2UnXSxcblx0XHRbJ2RydW1wYXR0ZXJuJ10sXG5cdFx0WydicG0nXSxcblx0XHRbJ2VuZCddLFxuXHRcdFsnY2h1biddLFxuXHRcdFsnd2FpdCddLFxuXHQgIF0sXG5cdCAgKG5vZGVzLCBjdHgpID0+IG5vZGVzWzBdLnNlbWFudGljKGN0eClcblx0KSxcblx0bmV3IFBhcnNlUnVsZShcblx0ICAnd2hpdGVzcGFjZScsXG5cdCAgW1xuXHRcdFsnU1BBQ0UnLCAnd2hpdGVzcGFjZSddLFxuXHRcdFsnU1BBQ0UnXVxuXHQgIF0sXG5cdCAgKG5vZGVzKSA9PiBudWxsXG5cdCksXG5cdG5ldyBQYXJzZVJ1bGUoXG5cdCAgJ251bWJlcicsXG5cdCAgW1xuXHRcdFsnRElHSVQnLCAnbnVtYmVyJ10sXG5cdFx0WydESUdJVCddLFxuXHQgIF0sXG5cdCAgKG5vZGVzKSA9PiB7XG5cdFx0bGV0IGRpZ2l0cyA9IFwiXCJcblx0XHR3aGlsZSAodHJ1ZSkge1xuXHRcdCAgZGlnaXRzICs9IG5vZGVzWzBdLmxleGVtZVxuXHRcdCAgaWYgKG5vZGVzLmxlbmd0aCA9PSAyKSB7XG5cdFx0XHRub2RlcyA9IG5vZGVzWzFdLm5vZGVzIVxuXHRcdCAgfSBlbHNlIHtcblx0XHRcdHJldHVybiBOdW1iZXIoZGlnaXRzKVxuXHRcdCAgfVxuXHRcdH1cblx0ICB9XG5cdCksXG5cdG5ldyBQYXJzZVJ1bGUoXG5cdCAgJ2RydW1wYXR0ZXJuJyxcblx0ICBbXG4gICAgICAgIFsnRElHSVQnLCAnUEVSSU9EJywgJ2RydW1wYXR0ZXJuJ10sXG4gICAgICAgIFsnRElHSVQnLCAnZHJ1bXBhdHRlcm4nXSxcbiAgICAgICAgWydSRVNUJywgJ2RydW1wYXR0ZXJuJ10sXG4gICAgICAgIFsnd2hpdGVzcGFjZScsICdkcnVtcGF0dGVybiddLFxuICAgICAgICBbJ0RJR0lUJywgJ1BFUklPRCddLFxuICAgICAgICBbJ0RJR0lUJ10sXG4gICAgICAgIFsnUkVTVCddXG4gICAgICBdLFxuXHQgIChub2RlcywgY3R4KSA9PiB7XG4gICAgICAgIGxldCBwYXR0ZXJuID0gXCJcIlxuXHRcdHdoaWxlICh0cnVlKSB7XG4gICAgICAgICAgZm9yIChjb25zdCBuIG9mIG5vZGVzKVxuXHRcdCAgICBwYXR0ZXJuICs9IG4ubGV4ZW1lID8/ICcnXG5cdFx0ICBpZiAobm9kZXNbbm9kZXMubGVuZ3RoLTFdLm5vZGVzKSB7XG5cdFx0XHRub2RlcyA9IG5vZGVzW25vZGVzLmxlbmd0aC0xXS5ub2RlcyFcblx0XHQgIH0gZWxzZSB7XG5cdFx0XHRicmVha1xuXHRcdCAgfVxuXHRcdH1cblxuICAgICAgICBjb25zdCBhY3Rpb24gPSBuZXcgQWN0aW9uRHJ1bVBhdHRlcm4ocGF0dGVybilcbiAgICAgICAgaWYgKGN0eFtjdHgubGVuZ3RoLTFdPy5zcGFuKVxuICAgICAgICAgIGN0eC5wdXNoKG5ldyBTZWdtZW50QWN0aW9uKGFjdGlvbikpXG4gICAgICAgIGVsc2VcbiAgICAgICAgICBjdHhbY3R4Lmxlbmd0aC0xXS5zcGFuID0gYWN0aW9uXG4gICAgICB9XG5cdCksXG5cdG5ldyBQYXJzZVJ1bGUoXG5cdCAgJ2JwbScsXG5cdCAgW1xuXHRcdFsnQlBNJywgJ251bWJlcicsICdQRVJDRU5UJywgJ1NMQVNIJywgJ251bWJlciddLFxuXHRcdFsnQlBNJywgJ251bWJlcicsICdTTEFTSCcsICdudW1iZXInXSxcblx0XHRbJ0JQTScsICdudW1iZXInLCAnUEVSQ0VOVCddLFxuICAgICAgICBbJ0JQTScsICdudW1iZXInXSxcbiAgICAgIF0sXG5cdCAgKG5vZGVzLCBjdHgpID0+IHtcbiAgICAgICAgaWYgKGN0eFtjdHgubGVuZ3RoLTFdLnNwYW4pXG4gICAgICAgICAgY3R4LnB1c2gobmV3IFNlZ21lbnRBY3Rpb24oKSlcbiAgICAgICAgXG4gICAgICAgIGNvbnN0IHZhbHVlID0gbm9kZXNbMV0uc2VtYW50aWMoKVxuICAgICAgICBjb25zdCB0aW1lID0gbm9kZXNbbm9kZXMubGVuZ3RoLTFdPy5zZW1hbnRpYygpXG4gICAgICAgIGlmIChub2Rlcy5sZW5ndGggPT0gMiB8fCBub2Rlcy5sZW5ndGggPT0gNClcbiAgICAgICAgICBjdHhbY3R4Lmxlbmd0aC0xXS5pbnN0YW50cy5wdXNoKG5ldyBBY3Rpb25CcG1BYnNvbHV0ZSh2YWx1ZSwgdGltZSkpXG4gICAgICAgIGVsc2VcbiAgICAgICAgICBjdHhbY3R4Lmxlbmd0aC0xXS5pbnN0YW50cy5wdXNoKG5ldyBBY3Rpb25CcG1GYWN0b3IodmFsdWUgLyAxMDAsIHRpbWUpKVxuICAgICAgfVxuXHQpLFxuXHRuZXcgUGFyc2VSdWxlKFxuXHQgICdlbmQnLFxuXHQgIFtbJ0VORCcsICdTTEFTSCcsICdudW1iZXInXSxcbiAgICAgICBbJ0VORCddXSxcblx0ICAobm9kZXMsIGN0eDogU2VnbWVudEFjdGlvbltdKSA9PiB7XG4gICAgICAgIGlmIChjdHhbY3R4Lmxlbmd0aC0xXS5zcGFuKVxuICAgICAgICAgIGN0eC5wdXNoKG5ldyBTZWdtZW50QWN0aW9uKCkpXG4gICAgICAgIGN0eFtjdHgubGVuZ3RoLTFdLmluc3RhbnRzLnB1c2gobmV3IEFjdGlvbkVuZChub2Rlc1syXT8uc2VtYW50aWMoKSkpXG4gICAgICB9XG5cdCksXG5cdG5ldyBQYXJzZVJ1bGUoXG5cdCAgJ2NodW4nLFxuXHQgIFtbJ0NIVU4nLCAnbnVtYmVyJ11dLFxuXHQgIChub2RlcywgY3R4OiBTZWdtZW50QWN0aW9uW10pID0+IHtcbiAgICAgICAgaWYgKGN0eFtjdHgubGVuZ3RoLTFdLnNwYW4pXG4gICAgICAgICAgY3R4LnB1c2gobmV3IFNlZ21lbnRBY3Rpb24oKSlcbiAgICAgICAgY3R4W2N0eC5sZW5ndGgtMV0uaW5zdGFudHMucHVzaChuZXcgQWN0aW9uQ2h1bihub2Rlc1sxXT8uc2VtYW50aWMoKSkpXG4gICAgICB9XG5cdCksXG5cdG5ldyBQYXJzZVJ1bGUoXG5cdCAgJ3dhaXQnLFxuXHQgIFtbJ1dBSVQnLCAnbnVtYmVyJ11dLFxuXHQgIChub2RlcywgY3R4OiBTZWdtZW50QWN0aW9uW10pID0+IHtcbiAgICAgICAgY29uc3QgYWN0aW9uID0gbmV3IEFjdGlvbldhaXQobm9kZXNbMV0uc2VtYW50aWMoKSlcbiAgICAgICAgaWYgKGN0eFtjdHgubGVuZ3RoLTFdLnNwYW4pXG4gICAgICAgICAgY3R4LnB1c2gobmV3IFNlZ21lbnRBY3Rpb24oYWN0aW9uKSlcbiAgICAgICAgZWxzZVxuICAgICAgICAgIGN0eFtjdHgubGVuZ3RoLTFdLnNwYW4gPSBhY3Rpb25cbiAgICAgIH1cblx0KVxuICBdXG4pXG4iXX0=