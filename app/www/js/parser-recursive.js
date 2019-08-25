/*
Input size 6900
tokenize average over 1000 runs: 3.241758241758242 ms
parse average over 2 runs: 2395.6666666666665 ms
semantic average over 9 runs: 542.1 ms
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

class Parseable {
	parserMatch(tokens) { throw "Implement parserMatch" }
	semantic(terminals) { throw "Implement semantic" }
}

class Token {
	constructor(terminal, lexeme) {
		this.terminal = terminal
		this.lexeme = lexeme
	}
}

class Terminal extends Parseable {
	constructor(terminals, name) {
		super()
		terminals.set(name, this)
		this.name = name
	}
	lexerMatch(s) { throw "Implement lexerMatch" }
}

class TerminalLit extends Terminal {
	constructor(terminals, name, lit) {
		super(terminals, name)
		this.lit = lit
	}
	
	lexerMatch(s) {
		if (s.startsWith(this.lit)) {
			return [new Token(this, this.lit), s.slice(this.lit.length)]
		} else {
			
			return null
		}
	}

	parserMatch(tokens) {
		if (tokens.length) {
			if (tokens[0].lexeme == this.lit) {
				return [new AstNode(null, null, tokens[0].lexeme), tokens.slice(1)]
			} else {
				return [null, tokens]
			}
		} else {
			return [null, tokens]
		}
	}
	
	semantic(astNodes) {
		return terminals[0].lexeme
	}
}

class TerminalRegex extends Terminal {
	constructor(terminals, name, regex) {
		super(terminals, name)
		this.regex = regex
	}

	lexerMatch(s) {
		const m = s.match(this.regex)
		if (m == null) {
			return null
		} else {
			return [new Token(this, m[0]), s.slice(m[0].length)]
		}
	}

	parserMatch(tokens) {
		if (tokens.length) {
			const m = tokens[0].lexeme.match(this.regex)
			if (m == null) {
				return [null, tokens]
			} else {
				return [new AstNode(null, null, m[0]), tokens.slice(1)]
			}
		} else {
			return [null, tokens]
		}
	}

	semantic(terminals) {
		return terminals[0].lexeme
	}
}

class AstNode {
	constructor(rule, nodes, lexeme) {
		this.rule = rule
		this.nodes = nodes
		this.lexeme = lexeme
	}

	semantic()  {
		if (this.rule) {
			return this.rule.semantic(this.nodes)
		} else {
			return null
		}
	}

	inspect() {
		return {rule: this.rule && this.rule.name, nodes: this.nodes, lexeme: this.lexeme}
	}
}

function getFlatSemantics(astNodes, result=[]) {
	astNodes.forEach(n => {
		const s = n.semantic()
		if (s != null) {
			result.push(s)
		}
	
		if (n.nodes != null) {
			getFlatSemantics(n.nodes, result)
		}
	})
	
	return result
}

function getFlatLexemes(astNodes, result=[]) {
	astNodes.forEach(n => {
		if (n.lexeme != null) {
			result.push(n.lexeme)
		}
	
		if (n.nodes != null) {
			getFlatLexemes(n.nodes, result)
		}
	})
	
	return result
}

class ParseRule extends Parseable {
	constructor(terminals, grammar, name, alternatives, semantic) {
		super()
		grammar.set(name, this)
		this.name = name
		this.terminals = terminals
		this.grammar = grammar
		this.alternatives = alternatives
		this.funcSemantic = semantic
	}

	parserMatch(tokens) {
		for (let iAlternatives = 0; iAlternatives < this.alternatives.length; ++iAlternatives) {
			const rhs = this.alternatives[iAlternatives]

			let iTokens = tokens
			const result = []
			let matched = true
			
			for (let i = 0; i < rhs.length; ++i) {
				if (iTokens[0]) {
					const rhsElement  = this.grammar.get(rhs[i]) || this.terminals.get(rhs[i])
					if (rhsElement == null) {
						throw "No such rule or terminal '" + rhs[i] + "'"
					}

					const [astNode, tokensNext] = rhsElement.parserMatch(iTokens)
					if (astNode) {
						iTokens = tokensNext
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
				return [new AstNode(this, result), iTokens, null]
			}
		}

		return [
			null,
			tokens,
			"Unexpected token or end of token stream at '" + tokens.map(t => t.lexeme).join("").slice(0,50) + "...'"
		]
	}

	semantic(astNodes) {
		return this.funcSemantic(astNodes)
	}

	inspect() {
		return {"alternatives": this.alternatives.length + " entries"}
	}
}

function tokenize(terminals, input) {
	let result = []
	let itTerminals = terminals.values()
		
	while (input) {
		const terminal = itTerminals.next().value
		if (!terminal) {
			throw "Unrecognized input at '" + input.slice(0, 50) + "...'"
		} else {
			const m = terminal.lexerMatch(input)
			if (m) {
				const [token, nextinput] = m
				itTerminals = terminals.values()
				input = nextinput
				result.push(token)
			}
		}
	}

	return result
}

function test() {
	const terminals = new Map()
	const tSPACE = new TerminalRegex(terminals, 'SPACE', /^\s+/)
	new TerminalLit(terminals, "BPM", "BPM")
	new TerminalLit(terminals, "END", "END")
	new TerminalRegex(terminals, "DIGIT", /^\d/)
	new TerminalLit(terminals, "REST", "x")

	const grammar = new Map()
	new ParseRule(
		terminals, grammar, 'whitespace',
		[['SPACE']],
		(nodes) => { return null }
	)
	new ParseRule(
		terminals, grammar, 'rest',
		[['REST']],
		(nodes) => { return {action: "rest", ticks: 1} }
	)
	new ParseRule(
		terminals, grammar, 'number',
		[
			['DIGIT', 'number'],
			['DIGIT'],
		],
	    (nodes) => Number(getFlatLexemes(nodes).join(""))
	)
	new ParseRule(
		terminals, grammar, 'drum',
		[['DIGIT']],
		(nodes) => { return {action: "drum", instrument: Number(nodes[0].lexeme)} }
	)
	new ParseRule(
		terminals, grammar, 'bpm',
		[['BPM', 'number']],
		(nodes) => { return {action: "Set BPM", bpm: nodes[1].semantic()} }
	)
	
	new ParseRule(
		terminals, grammar, 'end',
		[['END']],
		(nodes) => { return {action: "END"} }
	)
	new ParseRule(
		terminals, grammar, 'score',
		[
			['whitespace', 'score'],
			['whitespace'],
			['drum', 'score'],
			['drum'],
			['bpm', 'score'],
			['bpm'],
			['end', 'score'],
			['end'],
			['rest', 'score'],
			['rest'],
		],
		(nodes) => {
			if (nodes.length == 2) {
				return [nodes[0].semantic()].concat(nodes[1].semantic()).filter(v => v != null)
			} else {
				return [nodes[0].semantic()].filter(v => v != null)
			}
		}
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
	
	const input = inputb.repeat(1)

//	input = "BPM70 BPM60 END"
	//	input = "BPM 70 BPM60 END"
//	input = "BPM"
	log(input)

	const tokens = tokenize(terminals, input)
	
	log("Tokens:")
	log(tokens)

	log("")

	const [ast, remainingTokens, error] = grammar.get('score').parserMatch(tokens)
	if (error) {
		log(error)
	} else {
		log("AST:")
		log(ast)
		
		log("")
		
		log("Parsed:")

		log(ast.semantic(), true)
	}

  profile(grammar, terminals)
}

function profile(grammar, terminals) {
  const inputb = "\
xxxx xxxx x231 0231\n\
BPM70\n\
xxxx xxxx x231 0231\n\
END\n\
xxxx xxxx xxxx xxxx\
"
  
  const input = inputb.repeat(100)
  const tokens = tokenize(terminals, input)
  log('Input size ' + input.length)
  time('tokenize', () => tokenize(terminals, input))
  time('parse', () => grammar.get('score').parserMatch(tokens))
  const [ast, x, y] = grammar.get('score').parserMatch(tokens)
  time('semantic', () => ast.semantic())
}

document.addEventListener("DOMContentLoaded", test)
