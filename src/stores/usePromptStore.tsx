import {  Prompt } from "@/lib/types";
import { create } from "zustand";
import { devtools, persist } from "zustand/middleware";

type page = 'create' | 'creative-ai' | 'create-scratch';

type PromptStore = {
  prompts: Prompt[]; // Changed to just Prompt[] as [] is redundant with Prompt[]
  page: page;
  setPage: (page: page) => void;
  addPrompt: (prompt: Prompt) => void;
  removePrompt: (id: string) => void; // Added removePrompt function
};

const usePromptStore = create<PromptStore>()(
  devtools(
    persist(
      (set) => ({
        page: 'create',
        setPage: (page: page) => set({ page }),
        prompts: [],
        addPrompt: (prompt: Prompt) => {
          set((state) => ({
            prompts: [prompt, ...state.prompts],
          }));
        },
        removePrompt: (id: string) => { // Implementation of removePrompt
          set((state) => ({
            prompts: state.prompts.filter((prompt) => prompt.id !== id),
          }));
        },
       
      }),
      {
        name: 'prompts',
      }
    )
  )
);

export default usePromptStore;