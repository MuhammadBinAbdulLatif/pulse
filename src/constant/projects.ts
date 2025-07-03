export const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

export const itemVariants =  {
    hidden: {
        y:20, opacity:0
    },
    visible: {
        y:0,
        opacity:1,
        transtion: {
            type: 'spring',
            stiffness: 100
        }
    }
}


export const CreatePageCard = [
{
  title: 'Use A',
highlightedText: 'Template' ,
description:" Write a prompt and leave everything else for us to handle" ,
type: "template" ,
},
{
  title: 'Generate with' ,
highlightedText: 'Creative AI' ,
description: 'Write a prompt and leave everything else for us to handle',
type: 'creative-ai' ,
highlight: true,
},
{
  title: 'Start from',
highlightedText: 'Scratch ' ,
description: 'write a prompt and leave everything else for us to handle',
type: 'create-scratch' 
}
]