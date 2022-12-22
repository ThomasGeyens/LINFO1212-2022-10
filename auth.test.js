const { checkUserInput } = require('./auth');

test('isValidUsername', () => {
    expect(checkUserInput.isValidUsername('abc')).toBe(false);
    expect(checkUserInput.isValidUsername('abcdef')).toBe(true);
});

test('isValidPassword', () => {
    expect(checkUserInput.isValidPassword('abcd')).toBe(false);
    expect(checkUserInput.isValidPassword('Abcdef123')).toBe(true);
});

test('isValidEmail', () => {
    expect(checkUserInput.isValidEmail('abcdef')).toBe(false);
    expect(checkUserInput.isValidEmail('abc@def.com')).toBe(true);
});
