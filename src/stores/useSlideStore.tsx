import { Slide } from '@/lib/types'
import {create} from 'zustand'
import {persist} from 'zustand/middleware'
type SlideStore = {
    slides: Slide[]
    setSlides: (slides: Slide[])=> void
    

}

export const useSlideStore = create(persist<SlideStore>((set)=> ({
    slides: [],
    setSlides: (slides: Slide[])=> {
        set({slides})
    } 
}), {
    name: 'slides-storage',
     
}))