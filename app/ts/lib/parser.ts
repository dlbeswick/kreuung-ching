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

/**
 * A recursive descent parser.
 */

import { assert } from "./assert.js"

interface Parseable<T> {
  parserMatch(state: ParseState): AstNode<T>|AstNode<string>|null
}

class Token {
  constructor(readonly terminal: Terminal, readonly lexeme: string) {
  }
}

abstract class Terminal implements Parseable<string> {
  constructor(readonly name: string) {
  }
  
  abstract lexerMatch(s: string): [Token, string]|null
  abstract parserMatch(state: ParseState): AstNode<string>|null
}

class TerminalLit extends Terminal {
  ast: AstNode<string>
  token: Token
  
  constructor(name: string, readonly lit: string) {
    super(name)
    this.lit = lit
    this.ast = new AstNode(undefined, undefined, lit)
    this.token = new Token(this, lit)
  }
  
  lexerMatch(s: string): [Token, string]|null {
    if (s.startsWith(this.lit)) {
      return [this.token, s.slice(this.lit.length)]
    } else {
      return null
    }
  }

  parserMatch(state: ParseState): AstNode<string>|null {
    if (state.token.terminal === this) {
      state.advance(1)
      return this.ast
    } else {
      return null
    }
  }

  inspect() {
    return {lit: this.lit}
  }
}


class TerminalRegex extends Terminal {
  /**
   * If group is null then the resulting lexeme isn't stored. This can reduce object construction costs during lexing
   * for those tokens whose lexical content is usually unimportant, i.e. whitespace.
   */

  optimizedToken: Token|undefined = undefined
  optimizedAst: AstNode<string>|undefined = undefined
  group: number
  
  constructor(name: string, readonly regex: RegExp, group?: number, optimizedValue?: string) {
    super(name)
    if (group == undefined) {
      assert(optimizedValue)
      this.optimizedToken = new Token(this, optimizedValue)
      this.optimizedAst = new AstNode<string>(undefined, undefined, optimizedValue)
      this.group = 0
    } else {
      this.group = group
    }
  }

  lexerMatch(s: string): [Token, string]|null {
    const m = this.regex.exec(s)
    return m ? [this.optimizedToken || new Token(this, m[this.group]), s.slice(m.index+m[0].length)] : null
  }

  parserMatch(state: ParseState): AstNode<string>|null {
    const token = state.token
    if (token.terminal === this) {
      state.advance(1)
      return this.optimizedAst || new AstNode<string>(undefined, undefined, token.lexeme)
    }
    
    return null
  }

  inspect() {
    return {regex: this.regex}
  }
}

class AstNode<T> {
  constructor(readonly rule?: ParseRule<T>, readonly nodes?: (AstNode<T>|AstNode<string>)[], readonly lexeme?: string) {
  }

  semantic(context?: any): T|undefined  {
    assert(this.nodes)
    return this.rule?.semantic(this.nodes, context)
  }

  inspect() {
    return {rule: this.rule?.name, nodes: this.nodes, lexeme: this.lexeme}
  }
}

class ParseRule<T> implements Parseable<T> {
  /**
   * @param alternatives A list of list of strings, matching rule names. Alternatives can be left-recursive with rules.
   * @param semantic A function (astNodes) => <semantic data>
   */
  private alternativesResolved?: [string, ParseRule<T> | Terminal][][]
  
  constructor(readonly name: string,
              readonly alternatives: string[][],
              readonly semantic: (n: (AstNode<T>|AstNode<string>)[], ctx?: any) => T)
  {}

  resolveAlternatives(grammar: Grammar) {
    this.alternativesResolved = this.alternatives.map(
      rhses => rhses.map(name => [name, grammar.getByName(name)])
    )

    return this.alternativesResolved.filter(alts => alts.some(([_,a]) => !a)).map(
      ([name, obj]) => "No such rule or terminal '" + name + "'"
    )
  }
  
  parserMatch(state: ParseState): AstNode<T>|AstNode<string>|null {
    for (let iAlternatives = 0; iAlternatives < this.alternatives.length; ++iAlternatives) {
      const rhs = this.alternativesResolved![iAlternatives]

      const result: (AstNode<string>|AstNode<T>)[] = []
      let matched = true
      const stateOld = state.save()
      
      for (let iRhs = 0; iRhs < rhs.length; ++iRhs) {
        if (!state.done()) {
          const rhsElement = rhs[iRhs][1]
          const astNode = rhsElement.parserMatch(state)
          if (astNode) {
            result.push(astNode)
          } else {
            matched = false
            break
          }
        } else {
          matched = false
        }
      }

      if (matched) {
        state.error = undefined
        return new AstNode(this, result)
      } else {
        state.restore(stateOld)
      }
    }

    state.error = "No rule matched token stream"
    return null
  }

  inspect() {
    return {alternatives: this.alternatives.length + " entries"}
  }
}

class ParseState {
  error?: string
  token: Token
  
  constructor(readonly tokens: Token[], private idxToken=0) {
    this.token = tokens[idxToken]
  }

  save() {
    return this.idxToken
  }
  
  restore(state: number) {
    this.idxToken = state
    this.token = this.tokens[this.idxToken]
  }
  
  advance(num: number) {
    this.idxToken += num
    this.token = this.tokens[this.idxToken]
  }

  done() {
    return this.idxToken >= this.tokens.length
  }

  context() {
    return this.tokens.slice(this.idxToken, this.idxToken + 50).map(t => t.lexeme).join("")
  }
}

class Grammar {
  /**
   * Ordering by most to least frequent terminals to be found in expected input can reduce tokenization time.
   */
  private rulesResolved = false
  
  constructor(readonly terminals: Terminal[], readonly rules: ParseRule<any>[]) {
  }

  getByName(name: string) {
    const result = this.rules.find(r => r.name == name) || this.terminals.find(t => t.name == name)
    assert(result, 'Unknown grammar', name)
    return result
  }
  
  tokenize(input: string): [Token[], string|null] {
    let result = []
    
    nextInput: while (input) {
      for (let iTerminals = 0; iTerminals < this.terminals.length; ++iTerminals) {
        const terminal = this.terminals[iTerminals]
        const m = terminal.lexerMatch(input)
        if (m) {
          const [token, nextinput] = m
          input = nextinput
          result.push(token)
          continue nextInput
        }
      }
      
      return [result, "Unknown token at '" + input.slice(0, 50) + (input.length > 50 ? "...'" : '')]
    }

    return [result, null]
  }

  parse<T>(tokens: Token[], context: T, debug=false): [any,ParseState,T] {
    if (!this.rulesResolved) {
      const result = this.rules.flatMap(r => r.resolveAlternatives(this))
      if (result.length)
        throw new Error("Rules resolution errors: " + result.join(", "))
      this.rulesResolved = true
    }

    const start = this.rules[0]
    const semantics = []
    const state = new ParseState(tokens, 0)
    
    while (!state.done()) {
      const ast = start.parserMatch(state)
      if (ast) {
        const semantic = ast.semantic(context)
        if (semantic != null) {
          semantics.push(semantic)
        }
      } else {
        if (debug) { 
          start.parserMatch(state)
        }
        return [null, state, context]
      }
    }

    return [semantics, state, context]
  }
}

export default Grammar;
export { Grammar, ParseRule, TerminalLit, TerminalRegex };
