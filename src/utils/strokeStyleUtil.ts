export const getStrokeStyle = (strokeStyle : string, strokeWidth  : number) => {
    switch (strokeStyle) {
        case 'dashed':
            return `${strokeWidth},${strokeWidth * 2}`
        case 'dotted':
            return `${strokeWidth / 5},${strokeWidth * 2}`
        default:
            return ''
    }
}