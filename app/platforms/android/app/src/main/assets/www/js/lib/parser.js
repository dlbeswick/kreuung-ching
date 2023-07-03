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
System.register([], function (exports_1, context_1) {
    "use strict";
    var Token, Terminal, TerminalLit, TerminalRegex, AstNode, ParseRule, ParseState, Grammar;
    var __moduleName = context_1 && context_1.id;
    return {
        setters: [],
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
                    this.ast = new AstNode(null, null, lit);
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
                    if (group == undefined) {
                        this.optimizedToken = new Token(this, optimizedValue);
                        this.optimizedAst = new AstNode(null, null, optimizedValue);
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
                        return this.optimizedAst || new AstNode(null, null, token.lexeme);
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
                            state.error = null;
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
                    return this.rules.find(r => r.name == name) || this.terminals.find(t => t.name == name);
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
