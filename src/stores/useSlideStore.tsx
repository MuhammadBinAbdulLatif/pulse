import { ContentItem, Slide, Theme } from '@/lib/types'
import { Project } from '@prisma/client'
import { v4 } from 'uuid'
import {create} from 'zustand'
import {persist} from 'zustand/middleware'
type SlideStore = {
    slides: Slide[]
    setSlides: (slides: Slide[])=> void
    project: Project | null
    setProject: (id: Project) => void
    currentTheme: Theme
    setCurrentTheme: (theme: Theme) => void
    currentSlide: number
    removeSlide: (id: string)=> void
    getOrderedSlides: ()=> Slide[]
    reorderSlides: (fromIndex:number, toIndex: number)=> void
    addSlideIndex: (slide: Slide, index: number)=> void,
    setCurrentSlide: (index: number)=> void
    updateContentItem: (slideId: string, contentId: string, newContent: string | string[] | string[][])=> void
    addComponentInSlide: (slideId: string, item: ContentItem, parentId: string,index: number)=> void
}
const defaultTheme: Theme = {
    name: "Default",
    fontFamily: "'Inter', sans-serif",
    fontColor: "#000000",
    backgroundColor: "#f0f0f0",
    slideBackgroundColor: "#ffffff",
    accentColor: "#3b82f6",
    navbarColor: "#ffffff",
    sidebarColor: "#f0f0f0",
    type: "light",
  }

export const useSlideStore = create(persist<SlideStore>((set,get)=> ({
    slides: [],
    setSlides: (slides: Slide[])=> {
        set({slides})
    } ,
    project: null,
    reorderSlides: (fromIndex: number, toIndex: number) => {
        set((state)=> {
            const newSlides = [...state.slides]
            const [removed] = newSlides.splice(fromIndex, 1)
            newSlides.splice(toIndex, 0, removed)
            return {
                slides: newSlides.map((slide,index)=> ({
                    ...slide,
                    slideOrder: index
                }))
            }
        })
    },
    getOrderedSlides: ()=> {
        const state = get()
        return [...state.slides].sort((a,b)=> a.slideOrder - b.slideOrder)
    },
    setProject: (project)=> set({project}),
    currentTheme: defaultTheme,
    setCurrentTheme: (theme: Theme)=> {
        set({currentTheme: theme})
    },
    removeSlide: (id:string)=> {
        set((state)=> ({
            slides: state.slides.filter((slide)=> slide.id !== id)
        }))
    },
    addSlideIndex: (slide:Slide, index: number)=> {
        set((state)=> {
            const newSlides = [...state.slides]
            newSlides.splice(index,0, {...slide, id:v4(),})
            newSlides.forEach((s, i)=> {
                s.slideOrder = i
            })
            return {slides: newSlides, currentSlide: index}
        } )
    },
    currentSlide: 0,
    setCurrentSlide: (index: number)=> {
        set({currentSlide: index})
    },
    addComponentInSlide: (slideId: string, item: ContentItem, parentId: string, index: number) => {
      set((state)=> {
        const updatedSlides = state.slides.map((slide)=>{
          if(slide.id === slideId){
            const updateContentItemRecursively = (content: ContentItem):ContentItem=> {
              if(content.id === parentId && Array.isArray(content.content)) {
                const updatedContent= [...content.content]
                updatedContent.splice(index, 0, item)
                return {
                ...content, 
                content: updatedContent as unknown as string[]
              }
              }
              return content
            }
            return {
              ...slide, 
              content: updateContentItemRecursively(slide.content)
            }
            
          }
          return slide
        })
        return {slides: updatedSlides}
      })
    },
    updateContentItem: (slideId: string, contentId: string, newContent: string | string[] | string[][]) =>
        set((state) => {
          const updateContentRecursively = (item: ContentItem): ContentItem => {

              if (item.id === contentId) {
                return { ...item, content: newContent };
              }
      
              if (
                Array.isArray(item.content) &&
                item.content.every((i) => typeof i !== 'string')
              ) {
                return {
                  ...item,
                  content: item.content.map((subItem)=> {
                    if (typeof subItem === 'string') {
                      return updateContentRecursively(subItem as ContentItem)
                    }
                    return subItem
                    
                  }) as ContentItem[]
                };
              }
      
              return item;
          };
      
          return {
            slides: state.slides.map((slide) => {
              return slide.id === slideId
                ? { ...slide, content: updateContentRecursively(slide.content) }
                : slide;
            }),
          };
        }),
}), {
    name: 'slides-storage',
     
}))