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
System.register(["./lib/assert.js", "./lib/parser.js"], function (exports_1, context_1) {
    "use strict";
    var assert_js_1, parser_js_1, time, replacer, log;
    var __moduleName = context_1 && context_1.id;
    function test() {
        const actionEnd = { action: "end" };
        const grammar = new parser_js_1.Grammar([
            new parser_js_1.TerminalLit("REST", "x"),
            new parser_js_1.TerminalRegex("SPACE", /^\s+/),
            new parser_js_1.TerminalRegex("DIGIT", /^\d/, 0),
            new parser_js_1.TerminalLit("DASH", "-"),
            new parser_js_1.TerminalLit("BPM", "BPM"),
            new parser_js_1.TerminalLit("END", "END")
        ], [
            new parser_js_1.ParseRule('score', [
                ['rest'],
                ['whitespace'],
                ['note-roowa'],
                ['note'],
                ['bpm'],
                ['end'],
            ], (nodes) => nodes[0].semantic()),
            new parser_js_1.ParseRule('whitespace', [
                ['SPACE', 'whitespace'],
                ['SPACE']
            ], (nodes) => null),
            new parser_js_1.ParseRule('rest', [
                ['REST', 'rest'],
                ['REST', 'whitespace', 'rest'],
                ['REST']
            ], (nodes) => {
                const action = { action: 'rest', ticks: 0 };
                while (true) {
                    action.ticks += 1;
                    if (nodes.length == 2) {
                        assert_js_1.assert(nodes[1].nodes);
                        nodes = nodes[1].nodes;
                    }
                    else if (nodes.length == 3) {
                        assert_js_1.assert(nodes[2].nodes);
                        nodes = nodes[2].nodes;
                    }
                    else {
                        return action;
                    }
                }
            }),
            new parser_js_1.ParseRule('number', [
                ['DIGIT', 'number'],
                ['DIGIT'],
            ], (nodes) => {
                let digits = "";
                while (true) {
                    digits += nodes[0].lexeme;
                    if (nodes.length == 2) {
                        assert_js_1.assert(nodes[1].nodes);
                        nodes = nodes[1].nodes;
                    }
                    else {
                        return Number(digits);
                    }
                }
            }),
            new parser_js_1.ParseRule('note-roowa+', [
                ['DASH', 'note-roowa+'],
                ['DASH']
            ], (nodes) => {
                let length = 0;
                while (true) {
                    length += 1;
                    if (nodes.length == 2) {
                        assert_js_1.assert(nodes[1].nodes);
                        nodes = nodes[1].nodes;
                    }
                    else {
                        return { tickRoowa: length };
                    }
                }
            }),
            new parser_js_1.ParseRule('note-roowa', [['note', 'note-roowa+']], (nodes) => Object.assign(nodes[0].semantic(), nodes[1].semantic())),
            new parser_js_1.ParseRule('note', [['DIGIT']], (nodes) => { return { action: "note", note: Number(nodes[0].lexeme) }; }),
            new parser_js_1.ParseRule('bpm', [['BPM', 'number']], (nodes) => { return { action: "bpm", bpm: nodes[1].semantic() }; }),
            new parser_js_1.ParseRule('end', [['END']], (nodes) => actionEnd)
        ]);
        const body = document.getElementsByTagName("pre")[0];
        const inputb = "\
BPM9999\n0xxxx  xxxx x231---- 0-231\n\
BPM70\n\
xxxx xxxx x231 0231\n\
END\n\
xxxx xxxx xxxx xxxx\
";
        const inputs = [
            [inputb, true],
            ["BPM70 BPM60 END", true],
            ["BPM 70 BPM60 END", false],
            ["BPM", false],
            ["BPM999xBPM888", true]
        ];
        inputs.forEach(([input, shouldSucceed]) => {
            log(input);
            const tokens = grammar.tokenize(input);
            log("Tokens:");
            log(tokens);
            log("");
            const [semantics, state] = grammar.parse(tokens[0], []);
            if (state.error) {
                log(state.error + "\n" + state.context());
                if (shouldSucceed) {
                    console.error("FAILED");
                }
                else {
                    log("OK");
                }
            }
            else {
                log("Semantics:");
                log(semantics, true);
                if (shouldSucceed) {
                    log("OK");
                }
                else {
                    console.error("FAILED");
                }
            }
        });
        window.setTimeout(() => profile(grammar), 1000);
    }
    function profile(grammar) {
        const inputb = "\
xxxx xxxx x231--- 0231-\n\
BPM70\n\
xxxx xxxx x231 0231\n\
END\n\
xxxx xxxx xxxx xxxx\
";
        const input = inputb.repeat(100);
        const tokens = grammar.tokenize(input);
        log('Input size ' + input.length);
        time('tokenize', () => grammar.tokenize(input));
        time('parse + semantic', () => grammar.parse(tokens[0], []));
    }
    function test2() {
        const actionEnd = { action: "end" };
        const grammar = new parser_js_1.Grammar([
            new parser_js_1.TerminalRegex("REST", /^x/i, undefined, 'x'),
            new parser_js_1.TerminalRegex("SPACE", /^\s+/),
            new parser_js_1.TerminalRegex("DIGIT", /^\d/, 0),
            new parser_js_1.TerminalLit("PERCENT", "%"),
            new parser_js_1.TerminalLit("SLASH", "/"),
            new parser_js_1.TerminalRegex("BPM", /^BPM/i),
            new parser_js_1.TerminalRegex("END", /^END/i)
        ], [
            new parser_js_1.ParseRule('score', [
                ['whitespace'],
                ['drumpattern'],
                ['bpm'],
                ['end'],
            ], (nodes) => nodes[0].semantic()),
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
                        assert_js_1.assert(nodes[1].nodes);
                        nodes = nodes[1].nodes;
                    }
                    else {
                        return Number(digits);
                    }
                }
            }),
            new parser_js_1.ParseRule('drumpattern', [
                ['DIGIT', 'drumpattern'],
                ['REST', 'drumpattern'],
                ['whitespace', 'drumpattern'],
                ['DIGIT'],
                ['REST']
            ], (nodes) => {
                var _a;
                let pattern = "";
                while (true) {
                    pattern += (_a = nodes[0].lexeme) !== null && _a !== void 0 ? _a : '';
                    if (nodes.length == 2) {
                        assert_js_1.assert(nodes[1].nodes);
                        nodes = nodes[1].nodes;
                    }
                    else {
                        break;
                    }
                }
                return { action: "drumpattern", pattern: pattern, length: pattern.length };
            }),
            new parser_js_1.ParseRule('bpm', [
                ['BPM', 'number', 'PERCENT', 'SLASH', 'number'],
                ['BPM', 'number', 'SLASH', 'number'],
                ['BPM', 'number', 'PERCENT'],
                ['BPM', 'number'],
            ], (nodes) => {
                const time = nodes.length > 3 ? nodes[nodes.length - 1].semantic() : 15;
                if (nodes.length == 2)
                    return { action: "bpm", bpm: nodes[1].semantic(), time: time };
                else
                    return { action: "bpmFactor", factor: nodes[1].semantic() / 100, time: time };
            }),
            new parser_js_1.ParseRule('end', [['END']], (_) => actionEnd)
        ]);
        const body = document.getElementsByTagName("pre")[0];
        const input = "\
BPM9999\n0xxxx  xxxx x231 0231\n\
BPM111%\n\
xxxx xxxx x22 333 4444\n\
BPM111%/30\n\
xxxx xxxx xxxx xxxx\
BPM80/60\n\
xxxx xxxx xxxx xxxx\
END\n\
xxxx xxxx xxxx xxxx\
";
        const tokens = grammar.tokenize(input);
        log("Tokens:");
        log(tokens);
        log("");
        const [semantics, state] = grammar.parse(tokens[0], []);
        if (state.error) {
            log(state.error + "\n" + state.context());
        }
        else {
            log("Semantics:");
            log(semantics, true);
        }
    }
    return {
        setters: [
            function (assert_js_1_1) {
                assert_js_1 = assert_js_1_1;
            },
            function (parser_js_1_1) {
                parser_js_1 = parser_js_1_1;
            }
        ],
        execute: function () {
            time = (desc, func) => {
                const start = window.performance.now();
                let i = 0;
                for (; i < 1000; ++i) {
                    func();
                    if (window.performance.now() - start > 5000) {
                        break;
                    }
                }
                const end = window.performance.now();
                const result = desc + " average over " + i + " runs: " + ((end - start) / (i + 1)) + " ms";
                console.debug(result);
                log(result);
            };
            replacer = (key, val) => {
                if (val != null && typeof val === "object" && typeof val.inspect === "function") {
                    return val.inspect();
                }
                else {
                    return val;
                }
            };
            log = (s, pretty = false) => {
                const body = document.getElementsByTagName("pre")[0];
                if (typeof s === 'string') {
                    body.textContent += s + "\n";
                }
                else {
                    if (pretty) {
                        body.textContent += JSON.stringify(s, replacer, 2) + "\n";
                    }
                    else {
                        body.textContent += JSON.stringify(s, replacer) + "\n";
                    }
                }
            };
            window.onerror = (a, b, c, d, e) => {
                document.getElementsByTagName("pre")[0].textContent += "\n" + a + "\nLine " + c + ":" + d + "\n";
            };
            //document.addEventListener("DOMContentLoaded", test)
            document.addEventListener("DOMContentLoaded", test2);
        }
    };
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicGFyc2VyX3Rlc3QuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi90cy9wYXJzZXJfdGVzdC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7Ozs7Ozs7Ozs7Ozs7Ozs7OztFQW1CRTs7Ozs7SUEyQ0YsU0FBUyxJQUFJO1FBQ1gsTUFBTSxTQUFTLEdBQUcsRUFBQyxNQUFNLEVBQUUsS0FBSyxFQUFDLENBQUE7UUFDakMsTUFBTSxPQUFPLEdBQUcsSUFBSSxtQkFBTyxDQUM1QjtZQUNFLElBQUksdUJBQVcsQ0FBQyxNQUFNLEVBQUUsR0FBRyxDQUFDO1lBQzVCLElBQUkseUJBQWEsQ0FBQyxPQUFPLEVBQUUsTUFBTSxDQUFDO1lBQ2xDLElBQUkseUJBQWEsQ0FBQyxPQUFPLEVBQUUsS0FBSyxFQUFFLENBQUMsQ0FBQztZQUNwQyxJQUFJLHVCQUFXLENBQUMsTUFBTSxFQUFFLEdBQUcsQ0FBQztZQUM1QixJQUFJLHVCQUFXLENBQUMsS0FBSyxFQUFFLEtBQUssQ0FBQztZQUM3QixJQUFJLHVCQUFXLENBQUMsS0FBSyxFQUFFLEtBQUssQ0FBQztTQUM5QixFQUNEO1lBQ0UsSUFBSSxxQkFBUyxDQUNkLE9BQU8sRUFDUDtnQkFDRSxDQUFDLE1BQU0sQ0FBQztnQkFDUixDQUFDLFlBQVksQ0FBQztnQkFDZCxDQUFDLFlBQVksQ0FBQztnQkFDZCxDQUFDLE1BQU0sQ0FBQztnQkFDUixDQUFDLEtBQUssQ0FBQztnQkFDUCxDQUFDLEtBQUssQ0FBQzthQUNSLEVBQ0QsQ0FBQyxLQUFLLEVBQUUsRUFBRSxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQyxRQUFRLEVBQUUsQ0FDNUI7WUFDRCxJQUFJLHFCQUFTLENBQ2QsWUFBWSxFQUNaO2dCQUNFLENBQUMsT0FBTyxFQUFFLFlBQVksQ0FBQztnQkFDdkIsQ0FBQyxPQUFPLENBQUM7YUFDVixFQUNELENBQUMsS0FBSyxFQUFFLEVBQUUsQ0FBQyxJQUFJLENBQ2I7WUFDRCxJQUFJLHFCQUFT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RUFBRSxRQUFRLEVBQUUsQ0FBQyxDQUFDLEdBQUcsSUFBSSxDQUFBO3FCQUMxRDt5QkFBTTt3QkFDTCxJQUFJLENBQUMsV0FBVyxJQUFJLElBQUksQ0FBQyxTQUFTLENBQUMsQ0FBQyxFQUFFLFFBQVEsQ0FBQyxHQUFHLElBQUksQ0FBQTtxQkFDdkQ7aUJBQ0M7WUFDSCxDQUFDLENBQUE7WUF3VEQsTUFBTSxDQUFDLE9BQU8sR0FBRyxDQUFDLENBQUMsRUFBQyxDQUFDLEVBQUMsQ0FBQyxFQUFDLENBQUMsRUFBQyxDQUFDLEVBQUUsRUFBRTtnQkFDN0IsUUFBUSxDQUFDLG9CQUFvQixDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLFdBQVcsSUFBSSxJQUFJLEdBQUcsQ0FBQyxHQUFJLFNBQVMsR0FBRyxDQUFDLEdBQUcsR0FBRyxHQUFHLENBQUMsR0FBRyxJQUFJLENBQUE7WUFDbkcsQ0FBQyxDQUFBO1lBRUQscURBQXFEO1lBQ3JELFFBQVEsQ0FBQyxnQkFBZ0IsQ0FBQyxrQkFBa0IsRUFBRSxLQUFLLENBQUMsQ0FBQSIsInNvdXJjZXNDb250ZW50IjpbIi8qXG5cdOC5gOC4hOC4o+C4t+C5iOC4reC4h+C4ieC4tOC5iOC4hyAvIEtyZXV1bmcgQ2hpbmdcbiAgVGhpcyBmaWxlIGlzIHBhcnQgb2YgdGhlIEF1dG9tYXRpYyBDaGluZyBwcm9ncmFtIGZvciBwcmFjdGljaW5nXG4gIFRoYWkgbXVzaWMuXG4gIFxuICBDb3B5cmlnaHQgKEMpIDIwMTkgRGF2aWQgQmVzd2ljayA8ZGxiZXN3aWNrQGdtYWlsLmNvbT5cblxuICBUaGlzIHByb2dyYW0gaXMgZnJlZSBzb2Z0d2FyZTogeW91IGNhbiByZWRpc3RyaWJ1dGUgaXQgYW5kL29yIG1vZGlmeVxuICBpdCB1bmRlciB0aGUgdGVybXMgb2YgdGhlIEdOVSBBZmZlcm8gR2VuZXJhbCBQdWJsaWMgTGljZW5zZSBhc1xuICBwdWJsaXNoZWQgYnkgdGhlIEZyZWUgU29mdHdhcmUgRm91bmRhdGlvbiwgZWl0aGVyIHZlcnNpb24gMyBvZiB0aGVcbiAgTGljZW5zZSwgb3IgKGF0IHlvdXIgb3B0aW9uKSBhbnkgbGF0ZXIgdmVyc2lvbi5cblxuICBUaGlzIHByb2dyYW0gaXMgZGlzdHJpYnV0ZWQgaW4gdGhlIGhvcGUgdGhhdCBpdCB3aWxsIGJlIHVzZWZ1bCxcbiAgYnV0IFdJVEhPVVQgQU5ZIFdBUlJBTlRZOyB3aXRob3V0IGV2ZW4gdGhlIGltcGxpZWQgd2FycmFudHkgb2ZcbiAgTUVSQ0hBTlRBQklMSVRZIG9yIEZJVE5FU1MgRk9SIEEgUEFSVElDVUxBUiBQVVJQT1NFLiAgU2VlIHRoZVxuICBHTlUgQWZmZXJvIEdlbmVyYWwgUHVibGljIExpY2Vuc2UgZm9yIG1vcmUgZGV0YWlscy5cblxuICBZb3Ugc2hvdWxkIGhhdmUgcmVjZWl2ZWQgYSBjb3B5IG9mIHRoZSBHTlUgQWZmZXJvIEdlbmVyYWwgUHVibGljIExpY2Vuc2VcbiAgYWxvbmcgd2l0aCB0aGlzIHByb2dyYW0uICBJZiBub3QsIHNlZSA8aHR0cHM6Ly93d3cuZ251Lm9yZy9saWNlbnNlcy8+LlxuKi9cblxuaW1wb3J0IHsgYXNzZXJ0IH0gZnJvbSAnLi9saWIvYXNzZXJ0LmpzJztcbmltcG9ydCB7IEdyYW1tYXIsIFBhcnNlUnVsZSwgVGVybWluYWxMaXQsIFRlcm1pbmFsUmVnZXggfSBmcm9tICcuL2xpYi9wYXJzZXIuanMnO1xuXG5jb25zdCB0aW1lID0gKGRlc2M6IHN0cmluZywgZnVuYzogKCkgPT4gdm9pZCkgPT4ge1xuICBjb25zdCBzdGFydCA9IHdpbmRvdy5wZXJmb3JtYW5jZS5ub3coKVxuICBsZXQgaSA9IDA7XG4gIGZvciAoOyBpIDwgMTAwMDsgKytpKSB7XG5cdGZ1bmMoKVxuXHRpZiAod2luZG93LnBlcmZvcm1hbmNlLm5vdygpIC0gc3RhcnQgPiA1MDAwKSB7XG5cdCAgYnJlYWs7XG5cdH1cbiAgfVxuICBjb25zdCBlbmQgPSB3aW5kb3cucGVyZm9ybWFuY2Uubm93KClcblxuICBjb25zdCByZXN1bHQgPSBkZXNjICsgXCIgYXZlcmFnZSBvdmVyIFwiICsgaSArIFwiIHJ1bnM6IFwiICsgKChlbmQgLSBzdGFydCkgLyAoaSsxKSkgKyBcIiBtc1wiXG4gIGNvbnNvbGUuZGVidWcocmVzdWx0KVxuICBsb2cocmVzdWx0KVxufVxuXG5jb25zdCByZXBsYWNlciA9IChrZXk6IHN0cmluZywgdmFsOiBhbnkpID0+IHtcbiAgaWYgKHZhbCAhPSBudWxsICYmIHR5cGVvZiB2YWwgPT09IFwib2JqZWN0XCIgJiYgdHlwZW9mIHZhbC5pbnNwZWN0ID09PSBcImZ1bmN0aW9uXCIpIHtcblx0cmV0dXJuIHZhbC5pbnNwZWN0KClcbiAgfSBlbHNlIHtcblx0cmV0dXJuIHZhbFxuICB9XG59XG5cbmNvbnN0IGxvZyA9IChzOiBhbnksIHByZXR0eT1mYWxzZSkgPT4ge1xuICBjb25zdCBib2R5ID0gZG9jdW1lbnQuZ2V0RWxlbWVudHNCeVRhZ05hbWUoXCJwcmVcIilbMF1cblxuICBpZiAodHlwZW9mIHMgPT09ICdzdHJpbmcnKSB7XG5cdGJvZHkudGV4dENvbnRlbnQgKz0gcyArIFwiXFxuXCJcbiAgfSBlbHNlIHtcblx0aWYgKHByZXR0eSkge1xuXHQgIGJvZHkudGV4dENvbnRlbnQgKz0gSlNPTi5zdHJpbmdpZnkocywgcmVwbGFjZXIsIDIpICsgXCJcXG5cIlxuXHR9IGVsc2Uge1xuXHQgIGJvZHkudGV4dENvbnRlbnQgKz0gSlNPTi5zdHJpbmdpZnkocywgcmVwbGFjZXIpICsgXCJcXG5cIlxuXHR9XG4gIH1cbn1cblxuZnVuY3Rpb24gdGVzdCgpIHtcbiAgY29uc3QgYWN0aW9uRW5kID0ge2FjdGlvbjogXCJlbmRcIn1cbiAgY29uc3QgZ3JhbW1hciA9IG5ldyBHcmFtbWFyKFxuXHRbXG5cdCAgbmV3IFRlcm1pbmFsTGl0KFwiUkVTVFwiLCBcInhcIiksXG5cdCAgbmV3IFRlcm1pbmFsUmVnZXgoXCJTUEFDRVwiLCAvXlxccysvKSxcblx0ICBuZXcgVGVybWluYWxSZWdleChcIkRJR0lUXCIsIC9eXFxkLywgMCksXG5cdCAgbmV3IFRlcm1pbmFsTGl0KFwiREFTSFwiLCBcIi1cIiksXG5cdCAgbmV3IFRlcm1pbmFsTGl0KFwiQlBNXCIsIFwiQlBNXCIpLFxuXHQgIG5ldyBUZXJtaW5hbExpdChcIkVORFwiLCBcIkVORFwiKVxuXHRdLFxuXHRbXG5cdCAgbmV3IFBhcnNlUnVsZShcblx0XHQnc2NvcmUnLFxuXHRcdFtcblx0XHQgIFsncmVzdCddLFxuXHRcdCAgWyd3aGl0ZXNwYWNlJ10sXG5cdFx0ICBbJ25vdGUtcm9vd2EnXSxcblx0XHQgIFsnbm90ZSddLFxuXHRcdCAgWydicG0nXSxcblx0XHQgIFsnZW5kJ10sXG5cdFx0XSxcblx0XHQobm9kZXMpID0+IG5vZGVzWzBdLnNlbWFudGljKClcblx0ICApLFxuXHQgIG5ldyBQYXJzZVJ1bGUoXG5cdFx0J3doaXRlc3BhY2UnLFxuXHRcdFtcblx0XHQgIFsnU1BBQ0UnLCAnd2hpdGVzcGFjZSddLFxuXHRcdCAgWydTUEFDRSddXG5cdFx0XSxcblx0XHQobm9kZXMpID0+IG51bGxcblx0ICApLFxuXHQgIG5ldyBQYXJzZVJ1bGUoXG5cdFx0J3Jlc3QnLFxuXHRcdFtcblx0XHQgIFsnUkVTVCcsICdyZXN0J10sXG5cdFx0ICBbJ1JFU1QnLCAnd2hpdGVzcGFjZScsICdyZXN0J10sXG5cdFx0ICBbJ1JFU1QnXVxuXHRcdF0sXG5cdFx0KG5vZGVzKSA9PiB7XG5cdFx0ICBjb25zdCBhY3Rpb24gPSB7YWN0aW9uOiAncmVzdCcsIHRpY2tzOiAwfVxuXHRcdCAgd2hpbGUgKHRydWUpIHtcblx0XHRcdGFjdGlvbi50aWNrcyArPSAxXG5cdFx0XHRpZiAobm9kZXMubGVuZ3RoID09IDIpIHtcbiAgICAgICAgICAgICAgYXNzZXJ0KG5vZGVzWzFdLm5vZGVzKVxuXHRcdFx0ICBub2RlcyA9IG5vZGVzWzFdLm5vZGVzXG5cdFx0XHR9IGVsc2UgaWYgKG5vZGVzLmxlbmd0aCA9PSAzKSB7XG4gICAgICAgICAgICAgIGFzc2VydChub2Rlc1syXS5ub2Rlcylcblx0XHRcdCAgbm9kZXMgPSBub2Rlc1syXS5ub2Rlc1xuXHRcdFx0fSBlbHNlIHtcblx0XHRcdCAgcmV0dXJuIGFjdGlvblxuXHRcdFx0fVxuXHRcdCAgfVxuXHRcdH1cblx0ICApLFxuXHQgIG5ldyBQYXJzZVJ1bGUoXG5cdFx0J251bWJlcicsXG5cdFx0W1xuXHRcdCAgWydESUdJVCcsICdudW1iZXInXSxcblx0XHQgIFsnRElHSVQnXSxcblx0XHRdLFxuXHRcdChub2RlcykgPT4ge1xuXHRcdCAgbGV0IGRpZ2l0cyA9IFwiXCJcblx0XHQgIHdoaWxlICh0cnVlKSB7XG5cdFx0XHRkaWdpdHMgKz0gbm9kZXNbMF0ubGV4ZW1lXG5cdFx0XHRpZiAobm9kZXMubGVuZ3RoID09IDIpIHtcbiAgICAgICAgICAgICAgYXNzZXJ0KG5vZGVzWzFdLm5vZGVzKVxuXHRcdFx0ICBub2RlcyA9IG5vZGVzWzFdLm5vZGVzXG5cdFx0XHR9IGVsc2Uge1xuXHRcdFx0ICByZXR1cm4gTnVtYmVyKGRpZ2l0cylcblx0XHRcdH1cblx0XHQgIH1cblx0XHR9XG5cdCAgKSxcblx0ICBuZXcgUGFyc2VSdWxlKFxuXHRcdCdub3RlLXJvb3dhKycsXG5cdFx0W1xuXHRcdCAgWydEQVNIJywgJ25vdGUtcm9vd2ErJ10sXG5cdFx0ICBbJ0RBU0gnXVxuXHRcdF0sXG5cdFx0KG5vZGVzKSA9PiB7XG5cdFx0ICBsZXQgbGVuZ3RoID0gMFxuXHRcdCAgd2hpbGUgKHRydWUpIHtcblx0XHRcdGxlbmd0aCArPSAxXG5cdFx0XHRpZiAobm9kZXMubGVuZ3RoID09IDIpIHtcbiAgICAgICAgICAgICAgYXNzZXJ0KG5vZGVzWzFdLm5vZGVzKVxuXHRcdFx0ICBub2RlcyA9IG5vZGVzWzFdLm5vZGVzXG5cdFx0XHR9IGVsc2Uge1xuXHRcdFx0ICByZXR1cm4ge3RpY2tSb293YTogbGVuZ3RofVxuXHRcdFx0fVxuXHRcdCAgfVxuXHRcdH1cblx0ICApLFxuXHQgIG5ldyBQYXJzZVJ1bGUoXG5cdFx0J25vdGUtcm9vd2EnLFxuXHRcdFtbJ25vdGUnLCAnbm90ZS1yb293YSsnXV0sXG5cdFx0KG5vZGVzKSA9PiBPYmplY3QuYXNzaWduKG5vZGVzWzBdLnNlbWFudGljKCksIG5vZGVzWzFdLnNlbWFudGljKCkpXG5cdCAgKSxcblx0ICBuZXcgUGFyc2VSdWxlKFxuXHRcdCdub3RlJyxcblx0XHRbWydESUdJVCddXSxcblx0XHQobm9kZXMpID0+IHsgcmV0dXJuIHthY3Rpb246IFwibm90ZVwiLCBub3RlOiBOdW1iZXIobm9kZXNbMF0ubGV4ZW1lKX0gfVxuXHQgICksXG5cdCAgbmV3IFBhcnNlUnVsZShcblx0XHQnYnBtJyxcblx0XHRbWydCUE0nLCAnbnVtYmVyJ11dLFxuXHRcdChub2RlcykgPT4geyByZXR1cm4ge2FjdGlvbjogXCJicG1cIiwgYnBtOiBub2Rlc1sxXS5zZW1hbnRpYygpfSB9XG5cdCAgKSxcblx0ICBuZXcgUGFyc2VSdWxlKFxuXHRcdCdlbmQnLFxuXHRcdFtbJ0VORCddXSxcblx0XHQobm9kZXMpID0+IGFjdGlvbkVuZFxuXHQgIClcblx0XVxuICApXG5cbiAgY29uc3QgYm9keSA9IGRvY3VtZW50LmdldEVsZW1lbnRzQnlUYWdOYW1lKFwicHJlXCIpWzBdXG5cbiAgY29uc3QgaW5wdXRiID0gXCJcXFxuQlBNOTk5OVxcbjB4eHh4ICB4eHh4IHgyMzEtLS0tIDAtMjMxXFxuXFxcbkJQTTcwXFxuXFxcbnh4eHggeHh4eCB4MjMxIDAyMzFcXG5cXFxuRU5EXFxuXFxcbnh4eHggeHh4eCB4eHh4IHh4eHhcXFxuXCJcbiAgXG4gIGNvbnN0IGlucHV0cyA9IFtcblx0W2lucHV0YiwgdHJ1ZV0sXG5cdFtcIkJQTTcwIEJQTTYwIEVORFwiLCB0cnVlXSxcblx0W1wiQlBNIDcwIEJQTTYwIEVORFwiLCBmYWxzZV0sXG5cdFtcIkJQTVwiLCBmYWxzZV0sXG5cdFtcIkJQTTk5OXhCUE04ODhcIiwgdHJ1ZV1cbiAgXSBhcyBjb25zdFxuXG4gIGlucHV0cy5mb3JFYWNoKChbaW5wdXQsIHNob3VsZFN1Y2NlZWRdKSA9PiB7XG5cdGxvZyhpbnB1dClcblxuXHRjb25zdCB0b2tlbnMgPSBncmFtbWFyLnRva2VuaXplKGlucHV0KVxuXHRcblx0bG9nKFwiVG9rZW5zOlwiKVxuXHRsb2codG9rZW5zKVxuXG5cdGxvZyhcIlwiKVxuXG5cdGNvbnN0IFtzZW1hbnRpY3MsIHN0YXRlXSA9IGdyYW1tYXIucGFyc2UodG9rZW5zWzBdLCBbXSlcblx0aWYgKHN0YXRlLmVycm9yKSB7XG5cdCAgbG9nKHN0YXRlLmVycm9yICsgXCJcXG5cIiArIHN0YXRlLmNvbnRleHQoKSlcblx0ICBpZiAoc2hvdWxkU3VjY2VlZCkge1xuXHRcdGNvbnNvbGUuZXJyb3IoXCJGQUlMRURcIilcblx0ICB9IGVsc2Uge1xuXHRcdGxvZyhcIk9LXCIpXG5cdCAgfVxuXHR9IGVsc2Uge1xuXHQgIGxvZyhcIlNlbWFudGljczpcIilcblx0ICBsb2coc2VtYW50aWNzLCB0cnVlKVxuXHQgIGlmIChzaG91bGRTdWNjZWVkKSB7XG5cdFx0bG9nKFwiT0tcIilcblx0ICB9IGVsc2Uge1xuXHRcdGNvbnNvbGUuZXJyb3IoXCJGQUlMRURcIilcblx0ICB9XG5cdH1cbiAgfSlcblxuICB3aW5kb3cuc2V0VGltZW91dCgoKSA9PiBwcm9maWxlKGdyYW1tYXIpLCAxMDAwKVxufVxuXG5mdW5jdGlvbiBwcm9maWxlKGdyYW1tYXI6IEdyYW1tYXIpIHtcbiAgY29uc3QgaW5wdXRiID0gXCJcXFxueHh4eCB4eHh4IHgyMzEtLS0gMDIzMS1cXG5cXFxuQlBNNzBcXG5cXFxueHh4eCB4eHh4IHgyMzEgMDIzMVxcblxcXG5FTkRcXG5cXFxueHh4eCB4eHh4IHh4eHggeHh4eFxcXG5cIlxuICBcbiAgY29uc3QgaW5wdXQgPSBpbnB1dGIucmVwZWF0KDEwMClcbiAgY29uc3QgdG9rZW5zID0gZ3JhbW1hci50b2tlbml6ZShpbnB1dClcbiAgbG9nKCdJbnB1dCBzaXplICcgKyBpbnB1dC5sZW5ndGgpXG4gIHRpbWUoJ3Rva2VuaXplJywgKCkgPT4gZ3JhbW1hci50b2tlbml6ZShpbnB1dCkpXG4gIHRpbWUoJ3BhcnNlICsgc2VtYW50aWMnLCAoKSA9PiBncmFtbWFyLnBhcnNlKHRva2Vuc1swXSwgW10pKVxufVxuXG5mdW5jdGlvbiB0ZXN0MigpIHtcbiAgY29uc3QgYWN0aW9uRW5kID0ge2FjdGlvbjogXCJlbmRcIn1cbiAgY29uc3QgZ3JhbW1hciA9IG5ldyBHcmFtbWFyKFxuXHRbXG5cdCAgbmV3IFRlcm1pbmFsUmVnZXgoXCJSRVNUXCIsIC9eeC9pLCB1bmRlZmluZWQsICd4JyksXG5cdCAgbmV3IFRlcm1pbmFsUmVnZXgoXCJTUEFDRVwiLCAvXlxccysvKSxcblx0ICBuZXcgVGVybWluYWxSZWdleChcIkRJR0lUXCIsIC9eXFxkLywgMCksXG5cdCAgbmV3IFRlcm1pbmFsTGl0KFwiUEVSQ0VOVFwiLCBcIiVcIiksXG5cdCAgbmV3IFRlcm1pbmFsTGl0KFwiU0xBU0hcIiwgXCIvXCIpLFxuXHQgIG5ldyBUZXJtaW5hbFJlZ2V4KFwiQlBNXCIsIC9eQlBNL2kpLFxuXHQgIG5ldyBUZXJtaW5hbFJlZ2V4KFwiRU5EXCIsIC9eRU5EL2kpXG5cdF0sXG5cdFtcblx0ICBuZXcgUGFyc2VSdWxlKFxuXHRcdCdzY29yZScsXG5cdFx0W1xuXHRcdCAgWyd3aGl0ZXNwYWNlJ10sXG5cdFx0ICBbJ2RydW1wYXR0ZXJuJ10sXG5cdFx0ICBbJ2JwbSddLFxuXHRcdCAgWydlbmQnXSxcblx0XHRdLFxuXHRcdChub2RlcykgPT4gbm9kZXNbMF0uc2VtYW50aWMoKVxuXHQgICksXG5cdCAgbmV3IFBhcnNlUnVsZShcblx0XHQnd2hpdGVzcGFjZScsXG5cdFx0W1xuXHRcdCAgWydTUEFDRScsICd3aGl0ZXNwYWNlJ10sXG5cdFx0ICBbJ1NQQUNFJ11cblx0XHRdLFxuXHRcdChub2RlcykgPT4gbnVsbFxuXHQgICksXG5cdCAgbmV3IFBhcnNlUnVsZShcblx0XHQnbnVtYmVyJyxcblx0XHRbXG5cdFx0ICBbJ0RJR0lUJywgJ251bWJlciddLFxuXHRcdCAgWydESUdJVCddLFxuXHRcdF0sXG5cdFx0KG5vZGVzKSA9PiB7XG5cdFx0ICBsZXQgZGlnaXRzID0gXCJcIlxuXHRcdCAgd2hpbGUgKHRydWUpIHtcblx0XHRcdGRpZ2l0cyArPSBub2Rlc1swXS5sZXhlbWVcblx0XHRcdGlmIChub2Rlcy5sZW5ndGggPT0gMikge1xuICAgICAgICAgICAgICBhc3NlcnQobm9kZXNbMV0ubm9kZXMpXG5cdFx0XHQgIG5vZGVzID0gbm9kZXNbMV0ubm9kZXNcblx0XHRcdH0gZWxzZSB7XG5cdFx0XHQgIHJldHVybiBOdW1iZXIoZGlnaXRzKVxuXHRcdFx0fVxuXHRcdCAgfVxuXHRcdH1cblx0ICApLFxuXHQgIG5ldyBQYXJzZVJ1bGUoXG5cdFx0J2RydW1wYXR0ZXJuJyxcblx0XHRbXG4gICAgICAgICAgWydESUdJVCcsICdkcnVtcGF0dGVybiddLFxuICAgICAgICAgIFsnUkVTVCcsICdkcnVtcGF0dGVybiddLFxuICAgICAgICAgIFsnd2hpdGVzcGFjZScsICdkcnVtcGF0dGVybiddLFxuICAgICAgICAgIFsnRElHSVQnXSxcbiAgICAgICAgICBbJ1JFU1QnXVxuICAgICAgICBdLFxuXHRcdChub2RlcykgPT4ge1xuICAgICAgICAgIGxldCBwYXR0ZXJuID0gXCJcIlxuXHRcdCAgd2hpbGUgKHRydWUpIHtcblx0XHRcdHBhdHRlcm4gKz0gbm9kZXNbMF0ubGV4ZW1lID8/ICcnXG5cdFx0XHRpZiAobm9kZXMubGVuZ3RoID09IDIpIHtcbiAgICAgICAgICAgICAgYXNzZXJ0KG5vZGVzWzFdLm5vZGVzKVxuXHRcdFx0ICBub2RlcyA9IG5vZGVzWzFdLm5vZGVzXG5cdFx0XHR9IGVsc2Uge1xuXHRcdFx0ICBicmVha1xuXHRcdFx0fVxuXHRcdCAgfVxuXG4gICAgICAgICAgcmV0dXJuIHsgYWN0aW9uOiBcImRydW1wYXR0ZXJuXCIsIHBhdHRlcm46IHBhdHRlcm4sIGxlbmd0aDogcGF0dGVybi5sZW5ndGggfVxuICAgICAgICB9XG5cdCAgKSxcblx0ICBuZXcgUGFyc2VSdWxlKFxuXHRcdCdicG0nLFxuXHRcdFtcblx0XHQgIFsnQlBNJywgJ251bWJlcicsICdQRVJDRU5UJywgJ1NMQVNIJywgJ251bWJlciddLFxuXHRcdCAgWydCUE0nLCAnbnVtYmVyJywgJ1NMQVNIJywgJ251bWJlciddLFxuXHRcdCAgWydCUE0nLCAnbnVtYmVyJywgJ1BFUkNFTlQnXSxcbiAgICAgICAgICBbJ0JQTScsICdudW1iZXInXSxcbiAgICAgICAgXSxcblx0XHQobm9kZXMpID0+IHtcbiAgICAgICAgICBjb25zdCB0aW1lID0gbm9kZXMubGVuZ3RoID4gMyA/IG5vZGVzW25vZGVzLmxlbmd0aC0xXS5zZW1hbnRpYygpIDogMTVcbiAgICAgICAgICBpZiAobm9kZXMubGVuZ3RoID09IDIpXG4gICAgICAgICAgICByZXR1cm4ge2FjdGlvbjogXCJicG1cIiwgYnBtOiBub2Rlc1sxXS5zZW1hbnRpYygpLCB0aW1lOiB0aW1lfVxuICAgICAgICAgIGVsc2VcbiAgICAgICAgICAgIHJldHVybiB7YWN0aW9uOiBcImJwbUZhY3RvclwiLCBmYWN0b3I6IChub2Rlc1sxXS5zZW1hbnRpYygpIGFzIG51bWJlcikgLyAxMDAsIHRpbWU6IHRpbWV9XG4gICAgICAgIH1cblx0ICApLFxuXHQgIG5ldyBQYXJzZVJ1bGUoXG5cdFx0J2VuZCcsXG5cdFx0W1snRU5EJ11dLFxuXHRcdChfKSA9PiBhY3Rpb25FbmRcblx0ICApXG5cdF1cbiAgKVxuXG4gIGNvbnN0IGJvZHkgPSBkb2N1bWVudC5nZXRFbGVtZW50c0J5VGFnTmFtZShcInByZVwiKVswXVxuXG4gIGNvbnN0IGlucHV0ID0gXCJcXFxuQlBNOTk5OVxcbjB4eHh4ICB4eHh4IHgyMzEgMDIzMVxcblxcXG5CUE0xMTElXFxuXFxcbnh4eHggeHh4eCB4MjIgMzMzIDQ0NDRcXG5cXFxuQlBNMTExJS8zMFxcblxcXG54eHh4IHh4eHggeHh4eCB4eHh4XFxcbkJQTTgwLzYwXFxuXFxcbnh4eHggeHh4eCB4eHh4IHh4eHhcXFxuRU5EXFxuXFxcbnh4eHggeHh4eCB4eHh4IHh4eHhcXFxuXCJcblxuICBjb25zdCB0b2tlbnMgPSBncmFtbWFyLnRva2VuaXplKGlucHV0KVxuICBcbiAgbG9nKFwiVG9rZW5zOlwiKVxuICBsb2codG9rZW5zKVxuXG4gIGxvZyhcIlwiKVxuXG4gIGNvbnN0IFtzZW1hbnRpY3MsIHN0YXRlXSA9IGdyYW1tYXIucGFyc2UodG9rZW5zWzBdLCBbXSlcbiAgaWYgKHN0YXRlLmVycm9yKSB7XG5cdGxvZyhzdGF0ZS5lcnJvciArIFwiXFxuXCIgKyBzdGF0ZS5jb250ZXh0KCkpXG4gIH0gZWxzZSB7XG5cdGxvZyhcIlNlbWFudGljczpcIilcblx0bG9nKHNlbWFudGljcywgdHJ1ZSlcbiAgfVxufVxuXG53aW5kb3cub25lcnJvciA9IChhLGIsYyxkLGUpID0+IHtcbiAgZG9jdW1lbnQuZ2V0RWxlbWVudHNCeVRhZ05hbWUoXCJwcmVcIilbMF0udGV4dENvbnRlbnQgKz0gXCJcXG5cIiArIGEgKyAgXCJcXG5MaW5lIFwiICsgYyArIFwiOlwiICsgZCArIFwiXFxuXCJcbn1cblxuLy9kb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKFwiRE9NQ29udGVudExvYWRlZFwiLCB0ZXN0KVxuZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcihcIkRPTUNvbnRlbnRMb2FkZWRcIiwgdGVzdDIpXG4iXX0=