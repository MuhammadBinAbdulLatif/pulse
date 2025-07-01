import {create} from 'zustand'
import {persist} from 'zustand/middleware'
type SlideStore = {
    slides: Slide[]
    setSlides: ()=> void
    

}

export const useSlideStore = create(persist(()=> ({})))