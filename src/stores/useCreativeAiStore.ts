import { OutlineCard } from "@/lib/types";
import { create } from "zustand";
import {  persist } from "zustand/middleware";


type CreativeAiStore = {
    outlines: OutlineCard[] | []
  addMultipleOutlines: (outlines: OutlineCard[])=> void
  currentAiPrompt: string
  setCurrentAiPrompt: (prompt: string)=> void
  addOutline: (outline: OutlineCard) => void
  resetOutlines: ()=> void
};

const useCreativeAiStore = create<CreativeAiStore>()(
    persist(
      (set) => ({
        outlines: [],
        addMultipleOutlines: (outlines: OutlineCard[])=> {
            set(()=> ({
                outlines: [...outlines]
            }))
        },
        addOutline: (outline: OutlineCard)=> {
            set((state)=> ({
                outlines: [outline, ...state.outlines]
            }))
        },
        currentAiPrompt: '',
        setCurrentAiPrompt: (prompt: string)=> {
            set(()=> ({
                currentAiPrompt: prompt
            }))
        },
        resetOutlines: ()=> {
          set(()=> ({
            outlines: []
          }))
        }
        

      }),
      {
        name: 'creative-ai',
      }
  )
);

export default useCreativeAiStore;