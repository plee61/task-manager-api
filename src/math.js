const calculateTip = (total, tipPercent=.25) =>{
    tips = total * tipPercent
    return total + tips
}
const fahrenheitToCelsius = (temp) =>{
    return (temp - 32)/1.8
}

const celsiusToFahrenheit = (temp) =>{
    return (temp * 1.8) + 32
}
const add = async (a, b) => {
    return a + b
}
module.exports = {
    calculateTip,
    celsiusToFahrenheit,
    fahrenheitToCelsius,
    add
}
