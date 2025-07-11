"use client";
import { ContentItem } from "@/lib/types";
import React, { useCallback } from "react";
import { motion } from "framer-motion";
import {
  Heading1,
  Heading2,
  Heading3,
  Heading4,
  Title,
} from "@/components/editor/headings";
import { cn } from "@/lib/utils";
import DropZone from "./DropZone";
import Paragraph from "@/components/editor/Paragraph";
import Table from "@/components/editor/Table";
import ColumnComponent from "@/components/editor/ColumnComponent";
import ImageComponent from "@/components/editor/ImageComponent";
import BlockQuote from "@/components/editor/block-qoute";
import NumberedList, { BulletList, ToDoList } from "@/components/editor/numbered-list";
import CalloutBox from "@/components/editor/callout-box";
import CodeBlock from "@/components/editor/code-block";
import TableOfContents from "@/components/editor/table-of-contents";
import Divider from "@/components/editor/divider";
type Props = {
  content: ContentItem;
  onContentChange: (
    contentId: string,
    newContent: string | string[] | string[][]
  ) => void;
  isPreview?: boolean;
  isEditable?: boolean;
  slideId: string;
  index?: number;
};

const ContentRenderer: React.FC<Props> = React.memo(
  ({ content, onContentChange, slideId,  isEditable, isPreview }) => {
    const handleChange = useCallback(
      (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        onContentChange(content.id, e.target.value);
      },
      [content.id, onContentChange]
    );
    const animationProps = {
      initial: { opacity: 0, y: 20 },
      animate: { opacity: 1, y: 0 },
      transition: { duration: 0.5 },
    };
    const commonProps = {
      placeholder: content.placeholder,
      value: content.content as string,
      onchange: handleChange,
      isPreview: isPreview,
      className: content.className,
    };
    console.log(content.content);
    console.log(content.type);
    // WIP: Complete types
    switch (content.type) {
      case "heading1":
        return (
          <motion.div {...animationProps} className="w-full h-full">
            <Heading1 {...commonProps} />
          </motion.div>
        );
      case "heading2":
        return (
          <motion.div {...animationProps} className="w-full h-full">
            <Heading2 {...commonProps} />
          </motion.div>
        );
      case "heading3":
        return (
          <motion.div {...animationProps} className="w-full h-full">
            <Heading3 {...commonProps} />
          </motion.div>
        );
      case "heading4":
        return (
          <motion.div {...animationProps} className="w-full h-full">
            <Heading4 {...commonProps} />
          </motion.div>
        );
      case "title":
        return (
          <motion.div {...animationProps} className="w-full h-full">
            <Title {...commonProps} />
          </motion.div>
        );

      case "paragraph":
        return (
          <motion.div {...animationProps} className="w-full h-full">
            <Paragraph {...commonProps} />
          </motion.div>
        );

      case "bulletList":
        <motion.div {...animationProps} className="w-full h-full">
          <BulletList
            items={content.content as string[]}
            onChange={(newItems) => onContentChange(content.id, newItems)}
            className={content.className}
          />
        </motion.div>;

      case "todoList":
        <motion.div {...animationProps} className="w-full h-full">
          <ToDoList
            items={content.content as string[]}
            onChange={(newItems) => onContentChange(content.id, newItems)}
            className={content.className}
          />
        </motion.div>;

      case "table":
        return (
          <motion.div {...animationProps} className="w-full h-full">
            <Table
              content={content.content as string[][]}
              initialColSize={content.initialColumns}
              initialRowSize={content.initialRows}
              isPreview={isPreview}
              isEditable={isEditable}
              onChange={(newContent) =>
                onContentChange(
                  content.id,
                  newContent !== null ? newContent : ""
                )
              }
            />
          </motion.div>
        );

      case "resizable-column":
        if (Array.isArray(content.content)) {
          return (
            <motion.div className="w-full h-full" {...animationProps}>
              <ColumnComponent
                content={content.content as ContentItem[]}
                className={content.className}
                onContentChange={onContentChange}
                slideId={slideId}
                isPreview={isPreview}
                isEditable={isEditable}
              />
            </motion.div>
          );
        }
        return null;

      case "image":
        <motion.div className="w-full h-full" {...animationProps}>
          <ImageComponent
            src={content.content as string}
            alt={content.alt || "image"}
            className={content.className}
            isPreview={isPreview}
            contentId={content.id}
            onContentChange={onContentChange}
            isEditable={isEditable}
          />
        </motion.div>;

      case "blockquote":
        <motion.div
          className={cn("w-full h-full flex-col flex ", content.className)}
          {...animationProps}
        >
          <BlockQuote>
            <Paragraph {...commonProps} />
          </BlockQuote>
        </motion.div>;

      case 'calloutBox':
        return (
          <motion.div {...animationProps} className="w-full h-full">
            <CalloutBox type={content.callOutType || 'info'} className={content.className}>
             <Paragraph {...commonProps} />
            </CalloutBox>
          </motion.div>
        )

      case 'codeBlock':
        <motion.div {...animationProps} className="w-full h-full">
          <CodeBlock code={content.code} language={content.language} onChange={()=> {}}
          className={content.className} />
        </motion.div>
      case 'tableOfContents':
        <motion.div {...animationProps} className="w-full h-full">
          <TableOfContents items={content.content as string[]} onItemClick={(id)=> {
            console.log(`Navigate to section: ${id }`)
          }} className={content.className} />
        </motion.div>

      case 'divider':
        return (
          <motion.div {...animationProps} className="w-full h-full">
            <Divider className={content.className as string} />
          </motion.div>
        )

      case "numberedList":
        <motion.div {...animationProps} className="w-full h-full">
          <NumberedList
            items={content.content as string[]}
            onChange={(newItems) => onContentChange(content.id, newItems)}
            className={content.className}
          />
        </motion.div>;

      case "column":
        if (Array.isArray(content.content)) {
          return (
            <motion.div
              {...animationProps}
              className={cn("w-full h-full flex-col flex ", content.className)}
            >
              {content.content.length > 0 ? (
                (content.content as ContentItem[]).map(
                  (subItem: ContentItem, subIndex: number) => (
                    <React.Fragment key={subIndex}>
                      {!isPreview &&
                        !subItem.restrictToDrop &&
                        subIndex === 0 &&
                        isEditable && (
                          <DropZone
                            index={0}
                            parentId={content.id}
                            slideId={slideId}
                          />
                        )}
                      <MasterRecursiveComponent
                        content={subItem}
                        onContentChange={onContentChange}
                        isPreview={isPreview}
                        slideId={slideId}
                        index={subIndex}
                        isEditable={isEditable}
                      />
                      {!isPreview && !subItem.restrictToDrop && isEditable && (
                        <DropZone
                          index={subIndex + 1}
                          parentId={content.id}
                          slideId={slideId}
                        />
                      )}
                    </React.Fragment>
                  )
                )
              ) : isEditable ? (
                <DropZone index={0} parentId={content.id} slideId={slideId} />
              ) : null}
            </motion.div>
          );
        }
        return null;
      default:
        return null;
    }
  }
);
ContentRenderer.displayName = "ContentRenderer";

export const MasterRecursiveComponent: React.FC<Props> = React.memo(
  ({
    content,
    onContentChange,
    slideId,
    index,
    isEditable = true,
    isPreview = false,
  }) => {
    if (isPreview) {
      return (
        <ContentRenderer
          content={content}
          onContentChange={onContentChange}
          isPreview={isPreview}
          isEditable={isEditable}
          slideId={slideId}
          index={index}
        />
      );
    }
    return (
      <React.Fragment>
        <ContentRenderer
          content={content}
          onContentChange={onContentChange}
          isPreview={isPreview}
          isEditable={isEditable}
          slideId={slideId}
          index={index}
        />
      </React.Fragment>
    );
  }
);
MasterRecursiveComponent.displayName = "MasterRecursiveComponent";
