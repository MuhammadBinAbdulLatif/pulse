import { Slide } from '@/lib/types'
import { Project } from '@prisma/client'
import {create} from 'zustand'
import {persist} from 'zustand/middleware'
type SlideStore = {
    slides: Slide[]
    setSlides: (slides: Slide[])=> void
    project: Project | null
    setProject: (id: Project) => void
    

}

export const useSlideStore = create(persist<SlideStore>((set)=> ({
    slides: [],
    setSlides: (slides: Slide[])=> {
        set({slides})
    } ,
    project: null,
    setProject: (project)=> set({project})
}), {
    name: 'slides-storage',
     
}))