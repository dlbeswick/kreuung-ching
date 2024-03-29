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

/*
Input size 6900
tokenize average over 1000 runs: 1.1668331668331668 ms
parse + semantic average over 490 runs: 10.189409368635438 ms
*/
const time = (desc, func) => {
	const start = window.performance.now()
	let i = 0;
	for (; i < 1000; ++i) {
		func()
		if (window.performance.now() - start > 5000) {
			break;
		}
	}
	const end = window.performance.now()

	const result = desc + " average over " + i + " runs: " + ((end - start) / (i+1)) + " ms"
	console.debug(result)
	log(result)
}

const replacer = (key, val) => {
	if (val != null && typeof val === "object" && typeof val.inspect === "function") {
		return val.inspect()
	} else {
		return val
	}
}

const log = (s,pretty=false) => {
	const body = document.getElementsByTagName("pre")[0]

	if (typeof s === 'string') {
		body.textContent += s + "\n"
	} else {
		if (pretty) {
			body.textContent += JSON.stringify(s, replacer, 2) + "\n"
		} else {
			body.textContent += JSON.stringify(s, replacer) + "\n"
		}
	}
}

class Token {
	constructor(terminal, lexeme) {
		this.terminal = terminal
		this.lexeme = lexeme
	}
}

class Terminal {
	constructor(name) {
		this.name = name
		this.isTerminal = true
	}
	lexerMatch(s) { throw "Implement lexerMatch" }
}

class TerminalLit extends Terminal {
	constructor(name, lit) {
		super(name)
		this.lit = lit
		this.ast = new AstNodeTerminal(lit)
		this.token = new Token(this, lit)
	}
	
	lexerMatch(s) {
		if (s.startsWith(this.lit)) {
			return [this.token, s.slice(this.lit.length)]
		} else {
			
			return null
		}
	}

	inspect() {
		return {lit: this.lit}
	}
}

class TerminalRegex extends Terminal {
	constructor(name, regex, group=null) {
		super(name)
		this.regex = regex
		if (group == null) {
			this.optimizedToken = new Token(this, null)
			this.ast = new AstNodeTerminal(null)
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
			return [this.optimizedToken || new Token(this, m[this.group]), s.slice(1)]
		}
	}

	inspect() {
		return {regex: this.regex}
	}
}

class AstNode {
}

class AstNodeTerminal extends AstNode {
	constructor(lexeme) {
		super()
		this.lexeme = lexeme
	}

	inspect() {
		return {lexeme: this.lexeme}
	}
}


class AstNodeRule extends AstNode {
	constructor(nodes, rule) {
		super()
		this.nodes = nodes
		this.rule = rule
	}

	semantic()  {
		return this.rule.semantic(this.nodes)
	}

	inspect() {
		return {rule: this.rule && this.rule.name, nodes: this.nodes}
	}
}

class ParseRule {
	constructor(name, alternatives, semantic) {
		this.name = name
		this.alternatives = alternatives
		this.funcSemantic = semantic
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
			
			for (let iRhs = 0; iRhs < rhs.length; ++iRhs) {
				if (!state.done()) {
					const rhsElement = rhs[iRhs][1]
					const stateOld = state.save()
					let astNode = null
					if (rhsElement.isTerminal) {
						if (state.token.terminal === rhsElement) {
							astNode = rhsElement.ast || new AstNodeTerminal(state.token.lexeme)
							state.advance(1)
						}
					} else {
						astNode = rhsElement.parserMatch(state)
					}
					if (astNode) {
						result.push(astNode)
					} else {
						state.restore(stateOld)
						matched = false
						break
					}
				} else {
					matched = false
				}
			}

			if (matched) {
				state.error = null
				return new AstNodeRule(result, this)
			}
		}

		state.error = "No rule matched token stream"
		return null
	}

	semantic(astNodes) {
		return this.funcSemantic(astNodes)
	}

	inspect() {
		return {"alternatives": this.alternatives.length + " entries"}
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
	constructor(terminals) {
		this.terminals = terminals
		this.rules = []
		this.rulesResolved = false
	}

	add(rule) {
		this.rules.push(rule)
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

	parse(tokens) {
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
//				start.parserMatch(state)
				return [null, state]
			}
		}

		return [semantics, state]
	}
}


function test() {
	// Ordering by most to least frequent tokens can improve tokenization time
	const grammar = new Grammar([
		new TerminalLit("REST", "x"),
		new TerminalRegex('SPACE', /^\s+/),
		new TerminalRegex("DIGIT", /^\d/, 0),
		new TerminalLit("BPM", "BPM"),
		new TerminalLit("END", "END")
	])

	grammar.add(
		new ParseRule(
			'score',
			[
				['whitespace'],
				['drum'],
				['bpm'],
				['end'],
				['rest'],
			],
			(nodes) => nodes[0].semantic()
		)
	)
	
	grammar.add(
		new ParseRule(
			'whitespace',
			[['SPACE']],
			(nodes) => null
		)
	)

	const actionRest = {action: "rest", ticks: 1}
	grammar.add(
		new ParseRule(
			'rest',
			[['REST']],
			(nodes) => actionRest
		)
	)
	
	grammar.add(
		new ParseRule(
			'number',
			[
				['DIGIT', 'number'],
				['DIGIT'],
			],
	    (nodes) => {
				if (nodes.length == 2) {
					return Number(nodes[0].lexeme + nodes[1].semantic())
				} else {
					return Number(nodes[0].lexeme)
				}
			}
		)
	)
	
	grammar.add(
		new ParseRule(
			'drum',
			[['DIGIT']],
			(nodes) => { return {action: "drum", instrument: Number(nodes[0].lexeme)} }
		)
	)
	
	grammar.add(
		new ParseRule(
			'bpm',
			[['BPM', 'number']],
			(nodes) => { return {action: "Set BPM", bpm: nodes[1].semantic()} }
		)
	)

	const actionEnd = {action: "END"}
	grammar.add(
		new ParseRule(
			'end',
			[['END']],
			(nodes) => actionEnd
		)
	)

	const body = document.getElementsByTagName("pre")[0]

	window.onerror = (a,b,c,d,e) => {
		body.textContent += "\n" + a +  "\nLine " + c + ":" + d + "\n"
	}

	const inputb = "\
xxxx xxxx x231 0231\n\
BPM70\n\
xxxx xxxx x231 0231\n\
END\n\
xxxx xxxx xxxx xxxx\
"
	
	const input = inputb

//	const input = "BPM70 BPM60 END"
	//	input = "BPM 70 BPM60 END"
//	input = "BPM"
	log(input)

	const tokens = grammar.tokenize(input)
	
	log("Tokens:")
	log(tokens)

	log("")

	const [semantics, state] = grammar.parse(tokens)
	if (state.error) {
		log(state.error + "\n" + state.context())
	} else {
		log("Semantics:")
		log(semantics, true)
	}

  profile(grammar)
}

function profile(grammar) {
  const inputb = "\
xxxx xxxx x231 0231\n\
BPM70\n\
xxxx xxxx x231 0231\n\
END\n\
xxxx xxxx xxxx xxxx\
"
  
  const input = inputb.repeat(100)
  const tokens = grammar.tokenize(input)
  log('Input size ' + input.length)
  time('tokenize', () => grammar.tokenize(input))
  time('parse + semantic', () => grammar.parse(tokens))
}

document.addEventListener("DOMContentLoaded", test)
