const getDateKey = require('../src/utils');
    
test('blah', () => {
    // setup
    const testDate = new Date(2024, 5, 9); // June 9, 2024
    const expectedOutput = "2024-06-09";

    // exercise
    const actualOutput = getDateKey(testDate);

    expect(actualOutput).toBe(expectedOutput);
});
