import { OutlineCard } from "@/lib/types";
import { create } from "zustand";
import {  persist } from "zustand/middleware";


type ScratchStore = {
    resetOutlines: ()=> void
    outlines: OutlineCard[]
    addOutline: (outline: OutlineCard)=> void
    addMultipleOutlines: (outlines: OutlineCard[]) => void
    
};

const useScratchStore = create<ScratchStore>()(
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
                outlines: [...state.outlines, outline]
            }))
        },
        currentAiPrompt: '',
        resetOutlines: ()=> {
          set(()=> ({
            outlines: []
          }))
        },
        

      }),
      {
        name: 'create-scratch',
      }
  )
);

export default useScratchStore;