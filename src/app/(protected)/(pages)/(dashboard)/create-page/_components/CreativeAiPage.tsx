'use client'
import React, { useState } from 'react'
import { motion } from 'framer-motion';
import { containerVariants, itemVariants } from '@/constant/projects';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import useCreativeAiStore from '@/stores/useCreativeAiStore';
import { ChevronLeft, Loader2, RotateCwIcon } from 'lucide-react';
import CardList from './CardList';
import usePromptStore from '@/stores/usePromptStore';
import RecentPrompts from '@/components/ai/recent-prompts';
import { toast } from 'sonner';
import { generateCreativePrompt } from '@/actions/ai';
import { OutlineCard } from '@/lib/types';
import {v4 as uuidv4, v4} from 'uuid'
import { createProject } from '@/actions/project';
import { useRouter } from 'next/navigation';
import { useSlideStore } from '@/stores/useSlideStore';
type Props = {
    onBack: ()=> void;
}

const CreativeAiPage = ({onBack}: Props) => {
  const router = useRouter()
    const [editingCard, setEditingCard] = useState<null| string>(null)
    const [isGenerating, setIsGenerating] = useState(false)
    const [selectCard, setSelectedCard] = useState<string|null>(null)
    const[editText, setEditText] = useState<string>('')
     const {currentAiPrompt,setCurrentAiPrompt,outlines,resetOutlines, addMultipleOutlines, addOutline,} = useCreativeAiStore()
     const {prompts, addPrompt} = usePromptStore()
    const [noOfCards,setNoOfCards] = useState(0)
    const {setProject} = useSlideStore()
    const [isOutlineGenerating, setIsOutlineGenerating]  = useState(false)
    const handleGenerate = async ()=> {
      setIsGenerating(true)
      if(outlines.length  === 0 || noOfCards === 0){
        toast.error('Error', {
          description: 'The outlines should be at least 1 to generate slides'
        })
        setIsGenerating(false)
        return
      }
      try {
        const res = await createProject(currentAiPrompt, outlines.slice(0, noOfCards))
        if(res.status !==200 || !res.data){
          setIsGenerating(false)
          throw new Error('Unable to create project')
          
        }
        router.push(`/presentation/${res.data.id}/select-theme`)
        setProject(res.data)
        addPrompt({
          id: v4(),
          title: currentAiPrompt || outlines?.[0]?.title,
          outlines: outlines,
          createdAt: new Date().toISOString()
        })
        toast.success('Success', {
          description: 'Project created successfully!'
        })
        setCurrentAiPrompt('')
        resetOutlines()
      } catch (error) {
        console.log(error)
        toast.error('Error', {
          description: 'An unexpected error occurred. Please try again later'
        })
      } finally {
        setIsGenerating(false)
      }

    }
    const resetCards = ()=> {
        setEditingCard(null)
        setSelectedCard(null)
        setEditText('')
        setNoOfCards(0)
        resetOutlines()

    }
const generateOutline = async () => {
    if (!currentAiPrompt.trim()) {
        toast.error('Prompt is empty', {
            description: 'Please enter a topic to generate an outline.',
        });
        return;
    }
    if(noOfCards === 0) {
      toast.error('Error', {
        description: 'You must at least generate one card'
      })
      return;
    }

    setIsOutlineGenerating(true);
    try {
        const res = await generateCreativePrompt(currentAiPrompt, noOfCards);
        // Success Case: The server responded with the generated outline.
        if (res.status === 200 && res.data?.outlines) {
            // Transform the array of strings into an array of OutlineCard objects.
            const newOutlines: OutlineCard[] = res.data.outlines.map((title: string, index: number) => ({
                id: uuidv4(),
                title: title,
                order: index + 1,
            }));
            addMultipleOutlines(newOutlines);
            toast.success('Outline generated!', {
                description: `Successfully created ${newOutlines.length} outline points.`,
            });
        } else {
            // Error Case: The server handled the request but returned an error.
            // This could be a validation error (422) or a server error (500).
            toast.error(res.message || 'An unknown error occurred', {
                description: 'Please try adjusting your prompt or try again later.',
            });
        }
    } catch (error) {
        // Catastrophic Error: The API call itself failed (e.g., network issue).
        console.error("Failed to call generateCreativePrompt:", error);
        toast.error('Request Failed', {
            description: 'Could not connect to the server. Please check your connection.',
        });
    } finally {
        // This block runs regardless of success or failure, ensuring the
        // loading state is always turned off.
        setIsOutlineGenerating(false);
    }
};
    //WIP: const handleGenerate = ()=> {}   
  return (
    <motion.div className='space-y-6 w-full max-w-4xl px-4 mx-auto sm:px-6 lg:px-8' variants={containerVariants} initial='hidden' animate='visible'>
        <Button onClick={()=> onBack()} variant={'outline'} className='mb-4'>
          <ChevronLeft className='h-4 mr-2 w-4' />
            back
        </Button>
        <motion.div className='text-center space-y-2' variants={itemVariants}>
            <h1 className='text-4xl font-bold text-primary'>
                Generate with <span className='text-pulse'>Creative AI</span>
            </h1>
            <p className='text-secondary'>
                What would you like to build today
            </p>
            <motion.div className='bg-primary/10 p-4 rounded-xl' variants={itemVariants}>
            <div className='flex flex-col sm:flex-row justify-between gap-3 items-center rounded-xl bg-primary/10'>
                <Input className='text-base sm:text-xl border-0 focus-visible:ring-0 shadow-none p-0 bg-primary/10 flex-grow
                ' placeholder='Enter the prompt' required={true} value={currentAiPrompt} onChange={(e)=> setCurrentAiPrompt(e.target.value)} />
                <div className='flex items-center gap-2'>
  <select
    className='w-fit gap-2 font-semibold shadow-xl scroll-auto border border-border bg-background text-foreground rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-ring'
    value={noOfCards}
    onChange={(e) => setNoOfCards(parseInt(e.target.value))}
  >
    {Array.from({ length: 11 }, (_, idx) => idx).map((num) => (
      <option key={num} value={num} onClick={()=> setNoOfCards(num)}>
        {num === 0 ? 'No Card' : `${num} ${num === 1 ? 'Card' : 'Cards'}`}
      </option>
    ))}
  </select>
  <Button variant={'destructive'} onClick={resetCards}>
    <RotateCwIcon className='h-4 w-4' />
  </Button>
</div>
            </div>
            </motion.div>
        </motion.div>
        <div className='w-full flex flex-col justify-center items-center'>
            <Button className='font-medium text-lg flex gap-2 mb-4  items-center' onClick={generateOutline} disabled={isGenerating || isOutlineGenerating}>
                {isGenerating ? (
                    <Loader2 className='animate-spin' />
                ): outlines.length > 0 ? 'Regenerate outlines': 'Generate outlines'
                }
            </Button>
            <CardList addMultipleOutlines={addMultipleOutlines} editText={editText} editingCard={editingCard} outlines={outlines} addOutline={addOutline} setSelectedCard={setSelectedCard} selectedCard={selectCard} setEditText={setEditText} onCardSelect={setSelectedCard} onEditChange={setEditText} setEditingCard={setEditingCard} onCardDoubleClick={(title, id)=> {
                 setEditingCard(id)
                 setEditText(title)
            }}   />
        </div>
        {outlines.length > 0 && <Button className='w-full' disabled={isGenerating || isOutlineGenerating} onClick={handleGenerate}>
          {isGenerating ? <><Loader2 className='animate-spin mr-2' /></>: 'Generate'}
          </Button>}
          {prompts.length > 0 && <RecentPrompts />}
    </motion.div>
  )
}

export default CreativeAiPage