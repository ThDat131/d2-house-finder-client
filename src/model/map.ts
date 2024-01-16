export interface ViewPort {
    width: number | string
    height: number | string
    latitude: number
    longitude: number
    zoom: number
    maxZoom?: number
    minZoom?: number
    transitionDuration?: number
    transitionInterpolator: any
}
