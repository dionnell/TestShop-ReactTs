

export const formatCurrency = (value: number, currency: string = 'USD') => {
    return value.toLocaleString('es-CL',{
        style: 'currency',
        currency: currency,
    })
}