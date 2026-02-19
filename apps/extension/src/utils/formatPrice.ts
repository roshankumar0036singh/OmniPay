export const formatPrice = (amount: number, currency: string = "USD") => {
    return new Intl.NumberFormat("en-US", {
        style: "currency",
        currency,
    }).format(amount)
}

export const convertToUsd = (amount: number, rate: number) => {
    return amount * rate
}
