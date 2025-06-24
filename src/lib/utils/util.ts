export function fromSui(amount: number) {
    return amount / 1_000_000_000;
}

export function toSui(amount: number) {
    return amount * 1_000_000_000
}

export function formatAddress(address: string, length = 6) {
    let start = address.substring(0, length)
    let end = address.substring(address.length - length)
    return `${start}****${end}`
}