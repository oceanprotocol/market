// mocked, as this module makes Jest go all
// "Uncaught SyntaxError: Octal escape sequences are not allowed in strict mode"
export default jest.fn().mockImplementation(() => 'hello')
