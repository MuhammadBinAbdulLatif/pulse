'use client'

import { useSlideStore } from "@/stores/useSlideStore";
import React, { useEffect, useState } from "react";
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from "../ui/resizable";

type Props = {
  content: string[][];
  onChange: (newContent: string[][]) => void;
  isPreview?: boolean;
  isEditable?: boolean;
  initialRowSize?: number;
  initialColSize?: number;
};

const Table = ({
  content,
  onChange,
  initialColSize,
  initialRowSize,
  isEditable,
  isPreview,
}: Props) => {

    const {currentTheme} = useSlideStore()
    const [colSize, setColSizes ] = useState<number[]>([])
    const [rowSizes, setRowSizes ] = useState<number[]>([])
    const [tableData, setTableData] = useState<string[][]>(()=> {
        if(content.length === 0 || content[0].length === 0){
            return Array(initialRowSize).fill(Array(initialColSize).fill(''))
        }
        return content
    })
    const handleResizeColumn = (index: number, newSize: number)=> {
        if(!isEditable) return 
        const newSizes  = [...colSize]
        newSizes[index] = newSize
        setColSizes(newSizes)
    }
    const updateCell = (rowIndex: number, colIndex: number, value: string)=> {
        if(!isEditable) return
        const newData = tableData.map((row,rIndex)=> rIndex === rowIndex ? row.map((cell, cIndex)=> (cIndex === colIndex ? value: cell)): row)
        setTableData(newData)
    }
    useEffect(()=> {
        setRowSizes(new Array(tableData.length).fill(100 / tableData.length))
        setColSizes(new Array(tableData[0].length).fill(100/tableData[0].length))
    }, [tableData])
    if(isPreview) {
        return (
            <div className="w-full overflow-x-auto text-xs">
    <table className="w-full">
        <thead>
            <tr>
                {tableData[0].map((cell, index)=> (
                    <th key={index} className="p-2 border" style={{width: `${colSize[index]}%`}}>
                        {cell || 'Type here'}
                    </th>
                ))}
            </tr>
        </thead>
        <tbody>
            {tableData.slice(1).map((row, rowIndex)=> (
                <tr key={rowIndex} style={{height: `${rowSizes[rowIndex + 1]}%`}}>
                    {row.map((cell, cellIndex)=> (
                        <td key={cellIndex} className="p-2 border">
                            {cell || 'Type here'}
                        </td>
                    ))}
                </tr>
            ))}
        </tbody>
    </table>
  </div>
        )
    }
  return (
    <div className="w-full h-full relative" style={{
        background: currentTheme.gradientBackground || currentTheme.backgroundColor, borderRadius: '8px'
    }}>
        <ResizablePanelGroup direction="vertical" className={`h-full w-full rounded-lg border ${
  initialColSize === 2
    ? 'min-h-[100px]'
    : initialColSize === 3
    ? 'min-h-[150px]'
    : initialColSize === 4
    ? 'min-h-[200px]'
    : 'min-h-[100px]'
}`} onLayout={(sizes)=> setRowSizes(sizes)}>
    {tableData.map((row,rowIndex)=> (
        <React.Fragment key={rowIndex}>
            {rowIndex > 0 && <ResizableHandle />}
            <ResizablePanelGroup direction="horizontal" onLayout={(sizes)=> setColSizes(sizes)}  className="h-full w-full">
                {row.map((cell, colIndex)=> (
                    <React.Fragment key={colIndex}>
                        {colIndex > 0 && <ResizableHandle />}
                        <ResizablePanel defaultSize={colSize[colIndex]} onResize={(size)=> handleResizeColumn(colIndex, size)} className="w-full h-full min-h-9">
                            <div className="relative w-full h-full min-h-3">
                                <input type="text" value={cell} onChange={(e)=> updateCell(rowIndex, colIndex, e.target.value)} className="w-full h-full p-4 bg-transparent focus:outline-none focus:ring-2 focus:ring-blue-500 rounded-md" style={{
                                    color: currentTheme.fontColor
                                }} placeholder="Type here" readOnly={!isEditable} />
                            </div>

                        </ResizablePanel>
                    </React.Fragment>
                ))}
            </ResizablePanelGroup>
        </React.Fragment>
    ))}
        </ResizablePanelGroup>
    </div>
  )
};

export default Table;
