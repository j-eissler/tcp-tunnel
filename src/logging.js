function GetLoggingTime() {
    const today = new Date()
    return String(today.getHours()).padStart(2, '0')
        + ":"
        + String(today.getMinutes()).padStart(2, '0')
        + ":"
        + String(today.getSeconds()).padStart(2, '0')
        + ":"
        + String(today.getMilliseconds()).padStart(3, '0');
}

function log(message) {
    console.log(`${GetLoggingTime()} - ${message}`)
}

module.exports = log;