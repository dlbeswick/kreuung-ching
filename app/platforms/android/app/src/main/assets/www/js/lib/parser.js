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
System.register(["./assert.js"], function (exports_1, context_1) {
    "use strict";
    var assert_js_1, Token, Terminal, TerminalLit, TerminalRegex, AstNode, ParseRule, ParseState, Grammar;
    var __moduleName = context_1 && context_1.id;
    return {
        setters: [
            function (assert_js_1_1) {
                assert_js_1 = assert_js_1_1;
            }
        ],
        execute: function () {
            Token = class Token {
                constructor(terminal, lexeme) {
                    this.terminal = terminal;
                    this.lexeme = lexeme;
                }
            };
            Terminal = class Terminal {
                constructor(name) {
                    this.name = name;
                }
            };
            TerminalLit = class TerminalLit extends Terminal {
                constructor(name, lit) {
                    super(name);
                    this.lit = lit;
                    this.lit = lit;
                    this.ast = new AstNode(undefined, undefined, lit);
                    this.token = new Token(this, lit);
                }
                lexerMatch(s) {
                    if (s.startsWith(this.lit)) {
                        return [this.token, s.slice(this.lit.length)];
                    }
                    else {
                        return null;
                    }
                }
                parserMatch(state) {
                    if (state.token.terminal === this) {
                        state.advance(1);
                        return this.ast;
                    }
                    else {
                        return null;
                    }
                }
                inspect() {
                    return { lit: this.lit };
                }
            };
            exports_1("TerminalLit", TerminalLit);
            TerminalRegex = class TerminalRegex extends Terminal {
                constructor(name, regex, group, optimizedValue) {
                    super(name);
                    this.regex = regex;
                    /**
                     * If group is null then the resulting lexeme isn't stored. This can reduce object construction costs during lexing
                     * for those tokens whose lexical content is usually unimportant, i.e. whitespace.
                     */
                    this.optimizedToken = undefined;
                    this.optimizedAst = undefined;
                    if (group == undefined) {
                        assert_js_1.assert(optimizedValue);
                        this.optimizedToken = new Token(this, optimizedValue);
                        this.optimizedAst = new AstNode(undefined, undefined, optimizedValue);
                        this.group = 0;
                    }
                    else {
                        this.group = group;
                    }
                }
                lexerMatch(s) {
                    const m = this.regex.exec(s);
                    return m ? [this.optimizedToken || new Token(this, m[this.group]), s.slice(m.index + m[0].length)] : null;
                }
                parserMatch(state) {
                    const token = state.token;
                    if (token.terminal === this) {
                        state.advance(1);
                        return this.optimizedAst || new AstNode(undefined, undefined, token.lexeme);
                    }
                    return null;
                }
                inspect() {
                    return { regex: this.regex };
                }
            };
            exports_1("TerminalRegex", TerminalRegex);
            AstNode = class AstNode {
                constructor(rule, nodes, lexeme) {
                    this.rule = rule;
                    this.nodes = nodes;
                    this.lexeme = lexeme;
                }
                semantic(context) {
                    var _a;
                    assert_js_1.assert(this.nodes);
                    return (_a = this.rule) === null || _a === void 0 ? void 0 : _a.semantic(this.nodes, context);
                }
                inspect() {
                    var _a;
                    return { rule: (_a = this.rule) === null || _a === void 0 ? void 0 : _a.name, nodes: this.nodes, lexeme: this.lexeme };
                }
            };
            ParseRule = class ParseRule {
                constructor(name, alternatives, semantic) {
                    this.name = name;
                    this.alternatives = alternatives;
                    this.semantic = semantic;
                }
                resolveAlternatives(grammar) {
                    this.alternativesResolved = this.alternatives.map(rhses => rhses.map(name => [name, grammar.getByName(name)]));
                    return this.alternativesResolved.filter(alts => alts.some(([_, a]) => !a)).map(([name, obj]) => "No such rule or terminal '" + name + "'");
                }
                parserMatch(state) {
                    for (let iAlternatives = 0; iAlternatives < this.alternatives.length; ++iAlternatives) {
                        const rhs = this.alternativesResolved[iAlternatives];
                        const result = [];
                        let matched = true;
                        const stateOld = state.save();
                        for (let iRhs = 0; iRhs < rhs.length; ++iRhs) {
                            if (!state.done()) {
                                const rhsElement = rhs[iRhs][1];
                                const astNode = rhsElement.parserMatch(state);
                                if (astNode) {
                                    result.push(astNode);
                                }
                                else {
                                    matched = false;
                                    break;
                                }
                            }
                            else {
                                matched = false;
                            }
                        }
                        if (matched) {
                            state.error = undefined;
                            return new AstNode(this, result);
                        }
                        else {
                            state.restore(stateOld);
                        }
                    }
                    state.error = "No rule matched token stream";
                    return null;
                }
                inspect() {
                    return { alternatives: this.alternatives.length + " entries" };
                }
            };
            exports_1("ParseRule", ParseRule);
            ParseState = class ParseState {
                constructor(tokens, idxToken = 0) {
                    this.tokens = tokens;
                    this.idxToken = idxToken;
                    this.token = tokens[idxToken];
                }
                save() {
                    return this.idxToken;
                }
                restore(state) {
                    this.idxToken = state;
                    this.token = this.tokens[this.idxToken];
                }
                advance(num) {
                    this.idxToken += num;
                    this.token = this.tokens[this.idxToken];
                }
                done() {
                    return this.idxToken >= this.tokens.length;
                }
                context() {
                    return this.tokens.slice(this.idxToken, this.idxToken + 50).map(t => t.lexeme).join("");
                }
            };
            Grammar = class Grammar {
                constructor(terminals, rules) {
                    this.terminals = terminals;
                    this.rules = rules;
                    /**
                     * Ordering by most to least frequent terminals to be found in expected input can reduce tokenization time.
                     */
                    this.rulesResolved = false;
                }
                getByName(name) {
                    const result = this.rules.find(r => r.name == name) || this.terminals.find(t => t.name == name);
                    assert_js_1.assert(result, 'Unknown grammar', name);
                    return result;
                }
                tokenize(input) {
                    let result = [];
                    nextInput: while (input) {
                        for (let iTerminals = 0; iTerminals < this.terminals.length; ++iTerminals) {
                            const terminal = this.terminals[iTerminals];
                            const m = terminal.lexerMatch(input);
                            if (m) {
                                const [token, nextinput] = m;
                                input = nextinput;
                                result.push(token);
                                continue nextInput;
                            }
                        }
                        return [result, "Unknown token at '" + input.slice(0, 50) + (input.length > 50 ? "...'" : '')];
                    }
                    return [result, null];
                }
                parse(tokens, context, debug = false) {
                    if (!this.rulesResolved) {
                        const result = this.rules.flatMap(r => r.resolveAlternatives(this));
                        if (result.length)
                            throw new Error("Rules resolution errors: " + result.join(", "));
                        this.rulesResolved = true;
                    }
                    const start = this.rules[0];
                    const semantics = [];
                    const state = new ParseState(tokens, 0);
                    while (!state.done()) {
                        const ast = start.parserMatch(state);
                        if (ast) {
                            const semantic = ast.semantic(context);
                            if (semantic != null) {
                                semantics.push(semantic);
                            }
                        }
                        else {
                            if (debug) {
                                start.parserMatch(state);
                            }
                            return [null, state, context];
                        }
                    }
                    return [semantics, state, context];
                }
            };
            exports_1("Grammar", Grammar);
            exports_1("default", Grammar);
        }
    };
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicGFyc2VyLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vdHMvbGliL3BhcnNlci50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7Ozs7Ozs7Ozs7Ozs7Ozs7OztFQW1CRTs7Ozs7Ozs7Ozs7O1lBWUYsUUFBQSxNQUFNLEtBQUs7Z0JBQ1QsWUFBcUIsUUFBa0IsRUFBVyxNQUFjO29CQUEzQyxhQUFRLEdBQVIsUUFBUSxDQUFVO29CQUFXLFdBQU0sR0FBTixNQUFNLENBQVE7Z0JBQ2hFLENBQUM7YUFDRixDQUFBO1lBRUQsV0FBQSxNQUFlLFFBQVE7Z0JBQ3JCLFlBQXFCLElBQVk7b0JBQVosU0FBSSxHQUFKLElBQUksQ0FBUTtnQkFDakMsQ0FBQzthQUlGLENBQUE7WUFFRCxjQUFBLE1BQU0sV0FBWSxTQUFRLFFBQVE7Z0JBSWhDLFlBQVksSUFBWSxFQUFXLEdBQVc7b0JBQzVDLEtBQUssQ0FBQyxJQUFJLENBQUMsQ0FBQTtvQkFEc0IsUUFBRyxHQUFILEdBQUcsQ0FBUTtvQkFFNUMsSUFBSSxDQUFDLEdBQUcsR0FBRyxHQUFHLENBQUE7b0JBQ2QsSUFBSSxDQUFDLEdBQUcsR0FBRyxJQUFJLE9BQU8sQ0FBQyxTQUFTLEVBQUUsU0FBUyxFQUFFLEdBQUcsQ0FBQyxDQUFBO29CQUNqRCxJQUFJLENBQUMsS0FBSyxHQUFHLElBQUksS0FBSyxDQUFDLElBQUksRUFBRSxHQUFHLENBQUMsQ0FBQTtnQkFDbkMsQ0FBQztnQkFFRCxVQUFVLENBQUMsQ0FBUztvQkFDbEIsSUFBSSxDQUFDLENBQUMsVUFBVSxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsRUFBRTt3QkFDMUIsT0FBTyxDQUFDLElBQUksQ0FBQyxLQUFLLEVBQUUsQ0FBQyxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUE7cUJBQzlDO3lCQUFNO3dCQUNMLE9BQU8sSUFBSSxDQUFBO3FCQUNaO2dCQUNILENBQUM7Z0JBRUQs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QUFJLENBQUMsUUFBUSxDQUFDLENBQUE7NkJBQ3pCO3lCQUNGOzZCQUFNOzRCQUNMLElBQUksS0FBSyxFQUFFO2dDQUNULEtBQUssQ0FBQyxXQUFXLENBQUMsS0FBSyxDQUFDLENBQUE7NkJBQ3pCOzRCQUNELE9BQU8sQ0FBQyxJQUFJLEVBQUUsS0FBSyxFQUFFLE9BQU8sQ0FBQyxDQUFBO3lCQUM5QjtxQkFDRjtvQkFFRCxPQUFPLENBQUMsU0FBUyxFQUFFLEtBQUssRUFBRSxPQUFPLENBQUMsQ0FBQTtnQkFDcEMsQ0FBQzthQUNGLENBQUE7O2lDQUVjLE9BQU8iLCJzb3VyY2VzQ29udGVudCI6WyIvKlxuICDguYDguITguKPguLfguYjguK3guIfguInguLTguYjguIcgLyBLcmV1dW5nIENoaW5nXG4gIFRoaXMgZmlsZSBpcyBwYXJ0IG9mIHRoZSBBdXRvbWF0aWMgQ2hpbmcgcHJvZ3JhbSBmb3IgcHJhY3RpY2luZ1xuICBUaGFpIG11c2ljLlxuICBcbiAgQ29weXJpZ2h0IChDKSAyMDE5IERhdmlkIEJlc3dpY2sgPGRsYmVzd2lja0BnbWFpbC5jb20+XG5cbiAgVGhpcyBwcm9ncmFtIGlzIGZyZWUgc29mdHdhcmU6IHlvdSBjYW4gcmVkaXN0cmlidXRlIGl0IGFuZC9vciBtb2RpZnlcbiAgaXQgdW5kZXIgdGhlIHRlcm1zIG9mIHRoZSBHTlUgQWZmZXJvIEdlbmVyYWwgUHVibGljIExpY2Vuc2UgYXNcbiAgcHVibGlzaGVkIGJ5IHRoZSBGcmVlIFNvZnR3YXJlIEZvdW5kYXRpb24sIGVpdGhlciB2ZXJzaW9uIDMgb2YgdGhlXG4gIExpY2Vuc2UsIG9yIChhdCB5b3VyIG9wdGlvbikgYW55IGxhdGVyIHZlcnNpb24uXG5cbiAgVGhpcyBwcm9ncmFtIGlzIGRpc3RyaWJ1dGVkIGluIHRoZSBob3BlIHRoYXQgaXQgd2lsbCBiZSB1c2VmdWwsXG4gIGJ1dCBXSVRIT1VUIEFOWSBXQVJSQU5UWTsgd2l0aG91dCBldmVuIHRoZSBpbXBsaWVkIHdhcnJhbnR5IG9mXG4gIE1FUkNIQU5UQUJJTElUWSBvciBGSVRORVNTIEZPUiBBIFBBUlRJQ1VMQVIgUFVSUE9TRS4gIFNlZSB0aGVcbiAgR05VIEFmZmVybyBHZW5lcmFsIFB1YmxpYyBMaWNlbnNlIGZvciBtb3JlIGRldGFpbHMuXG5cbiAgWW91IHNob3VsZCBoYXZlIHJlY2VpdmVkIGEgY29weSBvZiB0aGUgR05VIEFmZmVybyBHZW5lcmFsIFB1YmxpYyBMaWNlbnNlXG4gIGFsb25nIHdpdGggdGhpcyBwcm9ncmFtLiAgSWYgbm90LCBzZWUgPGh0dHBzOi8vd3d3LmdudS5vcmcvbGljZW5zZXMvPi5cbiovXG5cbi8qKlxuICogQSByZWN1cnNpdmUgZGVzY2VudCBwYXJzZXIuXG4gKi9cblxuaW1wb3J0IHsgYXNzZXJ0IH0gZnJvbSBcIi4vYXNzZXJ0LmpzXCJcblxuaW50ZXJmYWNlIFBhcnNlYWJsZTxUPiB7XG4gIHBhcnNlck1hdGNoKHN0YXRlOiBQYXJzZVN0YXRlKTogQXN0Tm9kZTxUPnxBc3ROb2RlPHN0cmluZz58bnVsbFxufVxuXG5jbGFzcyBUb2tlbiB7XG4gIGNvbnN0cnVjdG9yKHJlYWRvbmx5IHRlcm1pbmFsOiBUZXJtaW5hbCwgcmVhZG9ubHkgbGV4ZW1lOiBzdHJpbmcpIHtcbiAgfVxufVxuXG5hYnN0cmFjdCBjbGFzcyBUZXJtaW5hbCBpbXBsZW1lbnRzIFBhcnNlYWJsZTxzdHJpbmc+IHtcbiAgY29uc3RydWN0b3IocmVhZG9ubHkgbmFtZTogc3RyaW5nKSB7XG4gIH1cbiAgXG4gIGFic3RyYWN0IGxleGVyTWF0Y2goczogc3RyaW5nKTogW1Rva2VuLCBzdHJpbmddfG51bGxcbiAgYWJzdHJhY3QgcGFyc2VyTWF0Y2goc3RhdGU6IFBhcnNlU3RhdGUpOiBBc3ROb2RlPHN0cmluZz58bnVsbFxufVxuXG5jbGFzcyBUZXJtaW5hbExpdCBleHRlbmRzIFRlcm1pbmFsIHtcbiAgYXN0OiBBc3ROb2RlPHN0cmluZz5cbiAgdG9rZW46IFRva2VuXG4gIFxuICBjb25zdHJ1Y3RvcihuYW1lOiBzdHJpbmcsIHJlYWRvbmx5IGxpdDogc3RyaW5nKSB7XG4gICAgc3VwZXIobmFtZSlcbiAgICB0aGlzLmxpdCA9IGxpdFxuICAgIHRoaXMuYXN0ID0gbmV3IEFzdE5vZGUodW5kZWZpbmVkLCB1bmRlZmluZWQsIGxpdClcbiAgICB0aGlzLnRva2VuID0gbmV3IFRva2VuKHRoaXMsIGxpdClcbiAgfVxuICBcbiAgbGV4ZXJNYXRjaChzOiBzdHJpbmcpOiBbVG9rZW4sIHN0cmluZ118bnVsbCB7XG4gICAgaWYgKHMuc3RhcnRzV2l0aCh0aGlzLmxpdCkpIHtcbiAgICAgIHJldHVybiBbdGhpcy50b2tlbiwgcy5zbGljZSh0aGlzLmxpdC5sZW5ndGgpXVxuICAgIH0gZWxzZSB7XG4gICAgICByZXR1cm4gbnVsbFxuICAgIH1cbiAgfVxuXG4gIHBhcnNlck1hdGNoKHN0YXRlOiBQYXJzZVN0YXRlKTogQXN0Tm9kZTxzdHJpbmc+fG51bGwge1xuICAgIGlmIChzdGF0ZS50b2tlbi50ZXJtaW5hbCA9PT0gdGhpcykge1xuICAgICAgc3RhdGUuYWR2YW5jZSgxKVxuICAgICAgcmV0dXJuIHRoaXMuYXN0XG4gICAgfSBlbHNlIHtcbiAgICAgIHJldHVybiBudWxsXG4gICAgfVxuICB9XG5cbiAgaW5zcGVjdCgpIHtcbiAgICByZXR1cm4ge2xpdDogdGhpcy5saXR9XG4gIH1cbn1cblxuXG5jbGFzcyBUZXJtaW5hbFJlZ2V4IGV4dGVuZHMgVGVybWluYWwge1xuICAvKipcbiAgICogSWYgZ3JvdXAgaXMgbnVsbCB0aGVuIHRoZSByZXN1bHRpbmcgbGV4ZW1lIGlzbid0IHN0b3JlZC4gVGhpcyBjYW4gcmVkdWNlIG9iamVjdCBjb25zdHJ1Y3Rpb24gY29zdHMgZHVyaW5nIGxleGluZ1xuICAgKiBmb3IgdGhvc2UgdG9rZW5zIHdob3NlIGxleGljYWwgY29udGVudCBpcyB1c3VhbGx5IHVuaW1wb3J0YW50LCBpLmUuIHdoaXRlc3BhY2UuXG4gICAqL1xuXG4gIG9wdGltaXplZFRva2VuOiBUb2tlbnx1bmRlZmluZWQgPSB1bmRlZmluZWRcbiAgb3B0aW1pemVkQXN0OiBBc3ROb2RlPHN0cmluZz58dW5kZWZpbmVkID0gdW5kZWZpbmVkXG4gIGdyb3VwOiBudW1iZXJcbiAgXG4gIGNvbnN0cnVjdG9yKG5hbWU6IHN0cmluZywgcmVhZG9ubHkgcmVnZXg6IFJlZ0V4cCwgZ3JvdXA/OiBudW1iZXIsIG9wdGltaXplZFZhbHVlPzogc3RyaW5nKSB7XG4gICAgc3VwZXIobmFtZSlcbiAgICBpZiAoZ3JvdXAgPT0gdW5kZWZpbmVkKSB7XG4gICAgICBhc3NlcnQob3B0aW1pemVkVmFsdWUpXG4gICAgICB0aGlzLm9wdGltaXplZFRva2VuID0gbmV3IFRva2VuKHRoaXMsIG9wdGltaXplZFZhbHVlKVxuICAgICAgdGhpcy5vcHRpbWl6ZWRBc3QgPSBuZXcgQXN0Tm9kZTxzdHJpbmc+KHVuZGVmaW5lZCwgdW5kZWZpbmVkLCBvcHRpbWl6ZWRWYWx1ZSlcbiAgICAgIHRoaXMuZ3JvdXAgPSAwXG4gICAgfSBlbHNlIHtcbiAgICAgIHRoaXMuZ3JvdXAgPSBncm91cFxuICAgIH1cbiAgfVxuXG4gIGxleGVyTWF0Y2goczogc3RyaW5nKTogW1Rva2VuLCBzdHJpbmddfG51bGwge1xuICAgIGNvbnN0IG0gPSB0aGlzLnJlZ2V4LmV4ZWMocylcbiAgICByZXR1cm4gbSA/IFt0aGlzLm9wdGltaXplZFRva2VuIHx8IG5ldyBUb2tlbih0aGlzLCBtW3RoaXMuZ3JvdXBdKSwgcy5zbGljZShtLmluZGV4K21bMF0ubGVuZ3RoKV0gOiBudWxsXG4gIH1cblxuICBwYXJzZXJNYXRjaChzdGF0ZTogUGFyc2VTdGF0ZSk6IEFzdE5vZGU8c3RyaW5nPnxudWxsIHtcbiAgICBjb25zdCB0b2tlbiA9IHN0YXRlLnRva2VuXG4gICAgaWYgKHRva2VuLnRlcm1pbmFsID09PSB0aGlzKSB7XG4gICAgICBzdGF0ZS5hZHZhbmNlKDEpXG4gICAgICByZXR1cm4gdGhpcy5vcHRpbWl6ZWRBc3QgfHwgbmV3IEFzdE5vZGU8c3RyaW5nPih1bmRlZmluZWQsIHVuZGVmaW5lZCwgdG9rZW4ubGV4ZW1lKVxuICAgIH1cbiAgICBcbiAgICByZXR1cm4gbnVsbFxuICB9XG5cbiAgaW5zcGVjdCgpIHtcbiAgICByZXR1cm4ge3JlZ2V4OiB0aGlzLnJlZ2V4fVxuICB9XG59XG5cbmNsYXNzIEFzdE5vZGU8VD4ge1xuICBjb25zdHJ1Y3RvcihyZWFkb25seSBydWxlPzogUGFyc2VSdWxlPFQ+LCByZWFkb25seSBub2Rlcz86IChBc3ROb2RlPFQ+fEFzdE5vZGU8c3RyaW5nPilbXSwgcmVhZG9ubHkgbGV4ZW1lPzogc3RyaW5nKSB7XG4gIH1cblxuICBzZW1hbnRpYyhjb250ZXh0PzogYW55KTogVHx1bmRlZmluZWQgIHtcbiAgICBhc3NlcnQodGhpcy5ub2RlcylcbiAgICByZXR1cm4gdGhpcy5ydWxlPy5zZW1hbnRpYyh0aGlzLm5vZGVzLCBjb250ZXh0KVxuICB9XG5cbiAgaW5zcGVjdCgpIHtcbiAgICByZXR1cm4ge3J1bGU6IHRoaXMucnVsZT8ubmFtZSwgbm9kZXM6IHRoaXMubm9kZXMsIGxleGVtZTogdGhpcy5sZXhlbWV9XG4gIH1cbn1cblxuY2xhc3MgUGFyc2VSdWxlPFQ+IGltcGxlbWVudHMgUGFyc2VhYmxlPFQ+IHtcbiAgLyoqXG4gICAqIEBwYXJhbSBhbHRlcm5hdGl2ZXMgQSBsaXN0IG9mIGxpc3Qgb2Ygc3RyaW5ncywgbWF0Y2hpbmcgcnVsZSBuYW1lcy4gQWx0ZXJuYXRpdmVzIGNhbiBiZSBsZWZ0LXJlY3Vyc2l2ZSB3aXRoIHJ1bGVzLlxuICAgKiBAcGFyYW0gc2VtYW50aWMgQSBmdW5jdGlvbiAoYXN0Tm9kZXMpID0+IDxzZW1hbnRpYyBkYXRhPlxuICAgKi9cbiAgcHJpdmF0ZSBhbHRlcm5hdGl2ZXNSZXNvbHZlZD86IFtzdHJpbmcsIFBhcnNlUnVsZTxUPiB8IFRlcm1pbmFsXVtdW11cbiAgXG4gIGNvbnN0cnVjdG9yKHJlYWRvbmx5IG5hbWU6IHN0cmluZyxcbiAgICAgICAgICAgICAgcmVhZG9ubHkgYWx0ZXJuYXRpdmVzOiBzdHJpbmdbXVtdLFxuICAgICAgICAgICAgICByZWFkb25seSBzZW1hbnRpYzogKG46IChBc3ROb2RlPFQ+fEFzdE5vZGU8c3RyaW5nPilbXSwgY3R4PzogYW55KSA9PiBUKVxuICB7fVxuXG4gIHJlc29sdmVBbHRlcm5hdGl2ZXMoZ3JhbW1hcjogR3JhbW1hcikge1xuICAgIHRoaXMuYWx0ZXJuYXRpdmVzUmVzb2x2ZWQgPSB0aGlzLmFsdGVybmF0aXZlcy5tYXAoXG4gICAgICByaHNlcyA9PiByaHNlcy5tYXAobmFtZSA9PiBbbmFtZSwgZ3JhbW1hci5nZXRCeU5hbWUobmFtZSldKVxuICAgIClcblxuICAgIHJldHVybiB0aGlzLmFsdGVybmF0aXZlc1Jlc29sdmVkLmZpbHRlcihhbHRzID0+IGFsdHMuc29tZSgoW18sYV0pID0+ICFhKSkubWFwKFxuICAgICAgKFtuYW1lLCBvYmpdKSA9PiBcIk5vIHN1Y2ggcnVsZSBvciB0ZXJtaW5hbCAnXCIgKyBuYW1lICsgXCInXCJcbiAgICApXG4gIH1cbiAgXG4gIHBhcnNlck1hdGNoKHN0YXRlOiBQYXJzZVN0YXRlKTogQXN0Tm9kZTxUPnxBc3ROb2RlPHN0cmluZz58bnVsbCB7XG4gICAgZm9yIChsZXQgaUFsdGVybmF0aXZlcyA9IDA7IGlBbHRlcm5hdGl2ZXMgPCB0aGlzLmFsdGVybmF0aXZlcy5sZW5ndGg7ICsraUFsdGVybmF0aXZlcykge1xuICAgICAgY29uc3QgcmhzID0gdGhpcy5hbHRlcm5hdGl2ZXNSZXNvbHZlZCFbaUFsdGVybmF0aXZlc11cblxuICAgICAgY29uc3QgcmVzdWx0OiAoQXN0Tm9kZTxzdHJpbmc+fEFzdE5vZGU8VD4pW10gPSBbXVxuICAgICAgbGV0IG1hdGNoZWQgPSB0cnVlXG4gICAgICBjb25zdCBzdGF0ZU9sZCA9IHN0YXRlLnNhdmUoKVxuICAgICAgXG4gICAgICBmb3IgKGxldCBpUmhzID0gMDsgaVJocyA8IHJocy5sZW5ndGg7ICsraVJocykge1xuICAgICAgICBpZiAoIXN0YXRlLmRvbmUoKSkge1xuICAgICAgICAgIGNvbnN0IHJoc0VsZW1lbnQgPSByaHNbaVJoc11bMV1cbiAgICAgICAgICBjb25zdCBhc3ROb2RlID0gcmhzRWxlbWVudC5wYXJzZXJNYXRjaChzdGF0ZSlcbiAgICAgICAgICBpZiAoYXN0Tm9kZSkge1xuICAgICAgICAgICAgcmVzdWx0LnB1c2goYXN0Tm9kZSlcbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgbWF0Y2hlZCA9IGZhbHNlXG4gICAgICAgICAgICBicmVha1xuICAgICAgICAgIH1cbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBtYXRjaGVkID0gZmFsc2VcbiAgICAgICAgfVxuICAgICAgfVxuXG4gICAgICBpZiAobWF0Y2hlZCkge1xuICAgICAgICBzdGF0ZS5lcnJvciA9IHVuZGVmaW5lZFxuICAgICAgICByZXR1cm4gbmV3IEFzdE5vZGUodGhpcywgcmVzdWx0KVxuICAgICAgfSBlbHNlIHtcbiAgICAgICAgc3RhdGUucmVzdG9yZShzdGF0ZU9sZClcbiAgICAgIH1cbiAgICB9XG5cbiAgICBzdGF0ZS5lcnJvciA9IFwiTm8gcnVsZSBtYXRjaGVkIHRva2VuIHN0cmVhbVwiXG4gICAgcmV0dXJuIG51bGxcbiAgfVxuXG4gIGluc3BlY3QoKSB7XG4gICAgcmV0dXJuIHthbHRlcm5hdGl2ZXM6IHRoaXMuYWx0ZXJuYXRpdmVzLmxlbmd0aCArIFwiIGVudHJpZXNcIn1cbiAgfVxufVxuXG5jbGFzcyBQYXJzZVN0YXRlIHtcbiAgZXJyb3I/OiBzdHJpbmdcbiAgdG9rZW46IFRva2VuXG4gIFxuICBjb25zdHJ1Y3RvcihyZWFkb25seSB0b2tlbnM6IFRva2VuW10sIHByaXZhdGUgaWR4VG9rZW49MCkge1xuICAgIHRoaXMudG9rZW4gPSB0b2tlbnNbaWR4VG9rZW5dXG4gIH1cblxuICBzYXZlKCkge1xuICAgIHJldHVybiB0aGlzLmlkeFRva2VuXG4gIH1cbiAgXG4gIHJlc3RvcmUoc3RhdGU6IG51bWJlcikge1xuICAgIHRoaXMuaWR4VG9rZW4gPSBzdGF0ZVxuICAgIHRoaXMudG9rZW4gPSB0aGlzLnRva2Vuc1t0aGlzLmlkeFRva2VuXVxuICB9XG4gIFxuICBhZHZhbmNlKG51bTogbnVtYmVyKSB7XG4gICAgdGhpcy5pZHhUb2tlbiArPSBudW1cbiAgICB0aGlzLnRva2VuID0gdGhpcy50b2tlbnNbdGhpcy5pZHhUb2tlbl1cbiAgfVxuXG4gIGRvbmUoKSB7XG4gICAgcmV0dXJuIHRoaXMuaWR4VG9rZW4gPj0gdGhpcy50b2tlbnMubGVuZ3RoXG4gIH1cblxuICBjb250ZXh0KCkge1xuICAgIHJldHVybiB0aGlzLnRva2Vucy5zbGljZSh0aGlzLmlkeFRva2VuLCB0aGlzLmlkeFRva2VuICsgNTApLm1hcCh0ID0+IHQubGV4ZW1lKS5qb2luKFwiXCIpXG4gIH1cbn1cblxuY2xhc3MgR3JhbW1hciB7XG4gIC8qKlxuICAgKiBPcmRlcmluZyBieSBtb3N0IHRvIGxlYXN0IGZyZXF1ZW50IHRlcm1pbmFscyB0byBiZSBmb3VuZCBpbiBleHBlY3RlZCBpbnB1dCBjYW4gcmVkdWNlIHRva2VuaXphdGlvbiB0aW1lLlxuICAgKi9cbiAgcHJpdmF0ZSBydWxlc1Jlc29sdmVkID0gZmFsc2VcbiAgXG4gIGNvbnN0cnVjdG9yKHJlYWRvbmx5IHRlcm1pbmFsczogVGVybWluYWxbXSwgcmVhZG9ubHkgcnVsZXM6IFBhcnNlUnVsZTxhbnk+W10pIHtcbiAgfVxuXG4gIGdldEJ5TmFtZShuYW1lOiBzdHJpbmcpIHtcbiAgICBjb25zdCByZXN1bHQgPSB0aGlzLnJ1bGVzLmZpbmQociA9PiByLm5hbWUgPT0gbmFtZSkgfHwgdGhpcy50ZXJtaW5hbHMuZmluZCh0ID0+IHQubmFtZSA9PSBuYW1lKVxuICAgIGFzc2VydChyZXN1bHQsICdVbmtub3duIGdyYW1tYXInLCBuYW1lKVxuICAgIHJldHVybiByZXN1bHRcbiAgfVxuICBcbiAgdG9rZW5pemUoaW5wdXQ6IHN0cmluZyk6IFtUb2tlbltdLCBzdHJpbmd8bnVsbF0ge1xuICAgIGxldCByZXN1bHQgPSBbXVxuICAgIFxuICAgIG5leHRJbnB1dDogd2hpbGUgKGlucHV0KSB7XG4gICAgICBmb3IgKGxldCBpVGVybWluYWxzID0gMDsgaVRlcm1pbmFscyA8IHRoaXMudGVybWluYWxzLmxlbmd0aDsgKytpVGVybWluYWxzKSB7XG4gICAgICAgIGNvbnN0IHRlcm1pbmFsID0gdGhpcy50ZXJtaW5hbHNbaVRlcm1pbmFsc11cbiAgICAgICAgY29uc3QgbSA9IHRlcm1pbmFsLmxleGVyTWF0Y2goaW5wdXQpXG4gICAgICAgIGlmIChtKSB7XG4gICAgICAgICAgY29uc3QgW3Rva2VuLCBuZXh0aW5wdXRdID0gbVxuICAgICAgICAgIGlucHV0ID0gbmV4dGlucHV0XG4gICAgICAgICAgcmVzdWx0LnB1c2godG9rZW4pXG4gICAgICAgICAgY29udGludWUgbmV4dElucHV0XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIFxuICAgICAgcmV0dXJuIFtyZXN1bHQsIFwiVW5rbm93biB0b2tlbiBhdCAnXCIgKyBpbnB1dC5zbGljZSgwLCA1MCkgKyAoaW5wdXQubGVuZ3RoID4gNTAgPyBcIi4uLidcIiA6ICcnKV1cbiAgICB9XG5cbiAgICByZXR1cm4gW3Jlc3VsdCwgbnVsbF1cbiAgfVxuXG4gIHBhcnNlPFQ+KHRva2VuczogVG9rZW5bXSwgY29udGV4dDogVCwgZGVidWc9ZmFsc2UpOiBbYW55LFBhcnNlU3RhdGUsVF0ge1xuICAgIGlmICghdGhpcy5ydWxlc1Jlc29sdmVkKSB7XG4gICAgICBjb25zdCByZXN1bHQgPSB0aGlzLnJ1bGVzLmZsYXRNYXAociA9PiByLnJlc29sdmVBbHRlcm5hdGl2ZXModGhpcykpXG4gICAgICBpZiAocmVzdWx0Lmxlbmd0aClcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKFwiUnVsZXMgcmVzb2x1dGlvbiBlcnJvcnM6IFwiICsgcmVzdWx0LmpvaW4oXCIsIFwiKSlcbiAgICAgIHRoaXMucnVsZXNSZXNvbHZlZCA9IHRydWVcbiAgICB9XG5cbiAgICBjb25zdCBzdGFydCA9IHRoaXMucnVsZXNbMF1cbiAgICBjb25zdCBzZW1hbnRpY3MgPSBbXVxuICAgIGNvbnN0IHN0YXRlID0gbmV3IFBhcnNlU3RhdGUodG9rZW5zLCAwKVxuICAgIFxuICAgIHdoaWxlICghc3RhdGUuZG9uZSgpKSB7XG4gICAgICBjb25zdCBhc3QgPSBzdGFydC5wYXJzZXJNYXRjaChzdGF0ZSlcbiAgICAgIGlmIChhc3QpIHtcbiAgICAgICAgY29uc3Qgc2VtYW50aWMgPSBhc3Quc2VtYW50aWMoY29udGV4dClcbiAgICAgICAgaWYgKHNlbWFudGljICE9IG51bGwpIHtcbiAgICAgICAgICBzZW1hbnRpY3MucHVzaChzZW1hbnRpYylcbiAgICAgICAgfVxuICAgICAgfSBlbHNlIHtcbiAgICAgICAgaWYgKGRlYnVnKSB7IFxuICAgICAgICAgIHN0YXJ0LnBhcnNlck1hdGNoKHN0YXRlKVxuICAgICAgICB9XG4gICAgICAgIHJldHVybiBbbnVsbCwgc3RhdGUsIGNvbnRleHRdXG4gICAgICB9XG4gICAgfVxuXG4gICAgcmV0dXJuIFtzZW1hbnRpY3MsIHN0YXRlLCBjb250ZXh0XVxuICB9XG59XG5cbmV4cG9ydCBkZWZhdWx0IEdyYW1tYXI7XG5leHBvcnQgeyBHcmFtbWFyLCBQYXJzZVJ1bGUsIFRlcm1pbmFsTGl0LCBUZXJtaW5hbFJlZ2V4IH07XG4iXX0=