"use client";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ChevronLeft, Loader2, RotateCcw } from "lucide-react";
import useScratchStore from "@/stores/useScratchStore";
import { containerVariants, itemVariants } from "@/constant/projects";
import { Input } from "@/components/ui/input";
import CardList from "./CardList";
import { OutlineCard } from "@/lib/types";
import {v4 as uuidv4} from 'uuid'
import { toast } from "sonner";
import { createProject } from "@/actions/project";
import { useSlideStore } from "@/stores/useSlideStore";
type Props = {
  onBack: () => void;
};

const ScratchPage = ({ onBack }: Props) => {
  const { resetOutlines, outlines,addMultipleOutlines,addOutline } = useScratchStore();
  const router = useRouter();
  const [editingCard, setEditingCard] = useState<string | null>(null)
  const {setProject} = useSlideStore()
  const [selectCard, setSelectedCard] = useState<string | null>(null)
  const [addCardText, setAddCardText] = useState("");
  const [editingCardText, setEditingCardText] = useState("");
  const [isCreatig, setIsCreating] = useState(false) 
  const handleAddCard = () => {
    const newCard: OutlineCard = {
        id: uuidv4(),
        title: addCardText || 'New Section',
        order: outlines.length +1
    }
    setAddCardText('')
    addOutline(newCard)
  }
  const handleBack = () => {
    resetOutlines();
    onBack();
  };
  const resetCards = () => {
    setAddCardText('');
    setEditingCardText('');
    resetOutlines();
  }
  const handleGenerate = async()=> {
    setIsCreating(true)
    if(outlines.length === 0){
        toast.error('Error', {
            description: 'Please add at least one card to generate slides'
        })
        return
    }
    const res = await createProject(outlines?.[0]?.title, outlines)
    if(res.status !==200) {
        toast.error('Error', {
            description: res.error || 'Failed to create project'
        })
        return
    }
    if(res.data) {
        setProject(res.data)
        resetOutlines()
        toast.success('Success', {
            description: 'Project created successfully!'
        })
        router.push(`/presentation/${res.data.id}/select-theme`)

    } else {
        toast.error('Error', {
            description: 'Failed to create project'
        })
    } setIsCreating(false)

  }
  return (
    <motion.div
      className="space-y-6 w-full max-w-4xl mx-auto px-4 sm:px-6 lg:px-8"
      variants={containerVariants}
    >
      <Button onClick={handleBack} variant={"outline"} className="mb-4">
        <ChevronLeft className="mr-2 h-4 w-4" />
        Back
      </Button>
      <h1 className="text-2xl sm:text-3xl font-bold text-primary text-left">
        Prompt
      </h1>
      <motion.div
        className="bg-primary/10 p-4 rounded-xl"
        variants={itemVariants}
      >
        <div
          className="flex  sm:flew-row
         justify-between gap-3 items-center rounded-xl"
        >
          <Input
            className="text-base sm:text-xl border-0 focus-visible:ring-0 shadow-none p-0 bg-primary/10 flex-grow
                "
            placeholder="Enter the card title"
            required={true}
            value={addCardText}
            onChange={(e) => setAddCardText(e.target.value)}
          />
          <div className="flex items-center gap-3">
            <select
              value={outlines.length > 0 ? outlines.length.toString() : "0"}
              className="w-fit gap-2 font-semibold shadow-xl rounded-md border px-3 py-2 text-sm"
            >
              {outlines.length === 0 ? (
                <option value="0" className="font-semibold">
                  No cards
                </option>
              ) : (
                Array.from(
                  { length: outlines.length },
                  (_, idx) => idx + 1
                ).map((num) => (
                  <option
                    key={num}
                    value={num.toString()}
                    className="font-semibold"
                  >
                    {num} {num === 1 ? "Card" : "Cards"}
                  </option>
                ))
              )}
            </select>

            <Button
              variant={"destructive"}
              onClick={resetCards}
              aria-label="reset cards"
              size={"icon"}
            >
              <RotateCcw className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </motion.div>
      <CardList
        addMultipleOutlines={addMultipleOutlines}
        editText={editingCardText}
        editingCard={editingCard}
        outlines={outlines}
        addOutline={addOutline}
        setSelectedCard={setSelectedCard}
        selectedCard={selectCard}
        setEditText={setEditingCardText}
        onCardSelect={setSelectedCard}
        onEditChange={setEditingCardText}
        setEditingCard={setEditingCard}
        onCardDoubleClick={(title, id) => {
          setEditingCard(id);
          setEditingCardText(title);
        }}
      />

      <Button onClick={handleAddCard} variant={'outline'} className="w-full mt-4 bg-primary/90">
        Add card
      </Button>
      {outlines.length > 0 && (
        <Button className="w-full text-xl" variant={'default'} disabled={isCreatig} onClick={handleGenerate}>
            {isCreatig ? (
                <Loader2 className="animate-spin" />
            ): 'Create Project'}
        </Button>
      )}
    </motion.div>
  );
};

export default ScratchPage;
