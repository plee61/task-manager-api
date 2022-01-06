const { calculateTip, fahrenheitToCelsius, celsiusToFahrenheit, add } = require("../src/math")

// test('test calculate test', ()=> {
//     const total = calculateTip(100, 0.1)
//     expect(total).toBe(110)
// }
// )
test('should convert 32F to 0c', ()=>{
    const convert = fahrenheitToCelsius(32)
    expect(convert).toBe(0)
})

test('should convert 0C to 32F', ()=>{
    const convert = celsiusToFahrenheit(0)
    expect(convert).toBe(32)
})
test('should add 3, 4', async ()=>{
    const addition = await add(3,4)
    expect(addition).toBe(7)
})