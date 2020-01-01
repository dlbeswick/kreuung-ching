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
class Parseable {
  parserMatch(state) { throw "Implement parserMatch" }
}

class Token {
  constructor(terminal, lexeme) {
		this.terminal = terminal
		this.lexeme = lexeme
  }
}

class Terminal extends Parseable {
  constructor(name) {
		super()
		this.name = name
  }
  lexerMatch(s) { throw "Implement lexerMatch" }
}

class TerminalLit extends Terminal {
  constructor(name, lit) {
		super(name)
		this.lit = lit
		this.ast = new AstNode(null, null, lit)
		this.token = new Token(this, lit)
  }
  
  lexerMatch(s) {
		if (s.startsWith(this.lit)) {
			return [this.token, s.slice(this.lit.length)]
		} else {
			return null
		}
  }

  parserMatch(state) {
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
  constructor(name, regex, group=null) {
		super(name)
		this.regex = regex
		if (group == null) {
			this.optimizedToken = new Token(this, null)
			this.optimizedAst = new AstNode(null, null, null)
			this.group = 0
		} else {
			this.group = group
		}
  }

  lexerMatch(s) {
		const m = this.regex.exec(s)
		if (m == null) {
			return null
		} else {
			return [this.optimizedToken || new Token(this, m[this.group]), s.slice(m.length)]
		}
  }

  parserMatch(state) {
		const token = state.token
		if (token.terminal === this) {
			state.advance(1)
			return this.optimizedAst || new AstNode(null, null, token.lexeme)
		}
		
		return null
  }

  inspect() {
		return {regex: this.regex}
  }
}

class AstNode {
  constructor(rule, nodes, lexeme) {
		this.rule = rule
		this.nodes = nodes
		this.lexeme = lexeme
  }

  semantic()  {
		return this.rule.semantic(this.nodes)
  }

  inspect() {
		return {rule: this.rule && this.rule.name, nodes: this.nodes, lexeme: this.lexeme}
  }
}

class ParseRule extends Parseable {
	/**
		* @param alternatives A list of list of strings, matching rule names. Alternatives can be left-recursive with rules.
		* @param funcSemantic A function (astNodes) => <user data>
		*/
  constructor(name, alternatives, funcSemantic) {
		super()
		this.name = name
		this.alternatives = alternatives
		this.semantic = funcSemantic
  }

  resolveAlternatives(grammar) {
		this.alternativesResolved = this.alternatives.map(
			rhses => rhses.map(name => [name, grammar.getByName(name)])
		)

		return this.alternativesResolved.filter(o => o == null).map(
			([name, obj]) => "No such rule or terminal '" + name + "'"
		)
  }
  
  parserMatch(state) {
		for (let iAlternatives = 0; iAlternatives < this.alternatives.length; ++iAlternatives) {
			const rhs = this.alternativesResolved[iAlternatives]

			const result = []
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
				state.error = null
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
  constructor(tokens, idxToken=0) {
		this.tokens = tokens
		this.idxToken = idxToken
		this.error = null
		this.token = tokens[idxToken]
  }

  save() {
		return this.idxToken
  }
  
  restore(state) {
		this.idxToken = state
		this.token = this.tokens[this.idxToken]
  }
  
  advance(num) {
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
  constructor(terminals, rules) {
		this.terminals = terminals
		this.rules = rules
		this.rulesResolved = false
  }

  getByName(name) {
		return this.rules.find(r => r.name == name) || this.terminals.find(t => t.name == name)
  }
  
  tokenize(input) {
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
			
			throw "Unrecognized input at '" + input.slice(0, 50) + "...'"
		}

		return result
  }

  parse(tokens, debug=false) {
		if (!this.rulesResolved) {
			this.rules.forEach(r => r.resolveAlternatives(this))
			this.rulesResolved = true
		}

		const start = this.rules[0]
		const semantics = []
		const state = new ParseState(tokens, 0)
		
		while (!state.done()) {
			const ast = start.parserMatch(state)
			if (ast) {
				const semantic = ast.semantic()
				if (semantic != null) {
					semantics.push(semantic)
				}
			} else {
				if (debug) { 
					start.parserMatch(state)
				}
				return [null, state]
			}
		}

		return [semantics, state]
  }
}

export default Grammar;
export { Grammar, ParseRule, TerminalLit, TerminalRegex };
