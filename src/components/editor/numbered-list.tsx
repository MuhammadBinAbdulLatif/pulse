import { cn } from "@/lib/utils";
import { useSlideStore } from "@/stores/useSlideStore";
import React, { KeyboardEvent } from "react";

type Props = {
  items: string[];
  onChange: (newItems: string[]) => void;
  className?: string;
  isEditable?: boolean;
};
type ListItemProps = {
  item: string;
  index: number;
  onChange: (index: number, value: string) => void;
  onKeyDown: (e: KeyboardEvent<HTMLInputElement>, index: number) => void;
  isEditable: boolean;
  fontColor: string;
};
const ListItem: React.FC<ListItemProps> = ({
  fontColor,
  index,
  isEditable,
  item,
  onChange,
  onKeyDown,
}) => (
  <input
    type="text"
    value={item}
    onChange={(e) => isEditable && onChange(index, e.target.value)}
    onKeyDown={(e) => onKeyDown(e, index)}
    style={{ color: fontColor }}
  />
);

const NumberedList = ({
  items,
  onChange,
  className,
  isEditable = true,
}: Props) => {
  const { currentTheme } = useSlideStore();
  const handleChange = (index: number, value: string) => {
    if (isEditable) {
      const newItems = [...items];
      newItems[index] = value;
      onChange(newItems);
    }
  };
  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>, index: number) => {
    if (e.key === "Enter") {
      e.preventDefault();
      const newItems = [...items];
      newItems.splice(index + 1, 0, "");
      onChange(newItems);
      setTimeout(() => {
        const nextInput = document.querySelector(
          `li:nth-child(${index + 2}) input`
        ) as HTMLInputElement;
        if (nextInput) {
          nextInput.focus();
        }
      }, 0);
    } else if (
      e.key === "Backspace" &&
      items[index] === "" &&
      items.length > 1
    ) {
      e.preventDefault();
      const newItems = [...items];
      newItems.splice(index, 1);
      onChange(newItems);
    }
  };
  return (
    <ol
      className={cn("list-decimal list-inside space-y-1", className)}
      style={{ color: currentTheme.fontColor }}
    >
      {items.map((item, index) => (
        <li key={index}>
          <ListItem
            item={item}
            index={index}
            fontColor={currentTheme.fontColor}
            isEditable={isEditable || true}
            onChange={handleChange}
            onKeyDown={handleKeyDown}
          />
        </li>
      ))}
    </ol>
  );
};

export const BulletList: React.FC<Props> = ({
  items,
  onChange,
  className,
  isEditable = true,
}) => {
  const { currentTheme } = useSlideStore();
  const handleChange = (index: number, value: string) => {
    if (isEditable) {
      const newItems = [...items];
      newItems[index] = value;
      onChange(newItems);
    }
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>, index: number) => {
    if (e.key === "Enter") {
      e.preventDefault();
      const newItems = [...items];
      newItems.splice(index + 1, 0, "");
      onChange(newItems);
      setTimeout(() => {
        const nextInput = document.querySelector(
          `li:nth-child(${index + 2}) input`
        ) as HTMLInputElement;
        if (nextInput) {
          nextInput.focus();
        }
      }, 0);
    } else if (
      e.key === "Backspace" &&
      items[index] === "" &&
      items.length > 1
    ) {
      e.preventDefault();
      const newItems = [...items];
      newItems.splice(index, 1);
      onChange(newItems);
    }
  };

  return (
    <ul
      className={cn("list-disc pl-5 space-y-1", className)}
      style={{ color: currentTheme.fontColor }}
    >
      {items.map((item, index) => (
        <li key={index} className="pl-1 marker:text-current">
          <ListItem
            item={item}
            index={index}
            fontColor={currentTheme.fontColor}
            isEditable={isEditable || true}
            onChange={handleChange}
            onKeyDown={handleKeyDown}
          />
        </li>
      ))}
    </ul>
  );
};

export const ToDoList: React.FC<Props> = ({
  items,
  onChange,
  className,
  isEditable = true,
}) => {
  const { currentTheme } = useSlideStore();
  const toggleCheckbox = (index: number)=> {
    const newItems = [...items]
    newItems[index] = newItems[index].startsWith('[x] ') ? newItems[index].replace('[x] ', '[ ] '): newItems[index].replace('[ ] ', '[x] ')
    onChange(newItems)
  }

  const handleChange = (index:number, value: string)=> {
    if(isEditable) {
        const newItems = [...items]
    newItems[index] = newItems[index].startsWith('[ ] ') || value.startsWith('[x] ') ? value : `[ ] ${value}`
    onChange(newItems)

    }
  }
  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>, index: number) => {
    if (e.key === "Enter") {
      e.preventDefault();
      const newItems = [...items];
      newItems.splice(index + 1, 0, "");
      onChange(newItems);
      setTimeout(() => {
        const nextInput = document.querySelector(
          `li:nth-child(${index + 2}) input`
        ) as HTMLInputElement;
        if (nextInput) {
          nextInput.focus();
        }
      }, 0);
    } else if (
      e.key === "Backspace" &&
      items[index] === "" &&
      items.length > 1
    ) {
      e.preventDefault();
      const newItems = [...items];
      newItems.splice(index, 1);
      onChange(newItems);
    }
  };
  return (
    <ul
      className={cn("space-y-1 ", className)}
      style={{ color: currentTheme.fontColor }}
    >
      {items.map((item, index) => (
        <li key={index} className="flex items-center space-x-2">
          <input
            type="checkbox"
            checked={item.startsWith("[x] ")}
            onChange={() => toggleCheckbox(index)}
            className="form-checkbox"
            disabled={!isEditable}
          />
          <ListItem
            item={item.replace(/^\[[ x]\]/, "")}
            index={index}
            onChange={(index, value) =>
              handleChange(
                index,
                `${item.startsWith("[x] " )? "[x] " : "[ ] "}${value}`
              )
            }
            onKeyDown={handleKeyDown}
            isEditable={isEditable}
            fontColor={currentTheme.fontColor}
          />
        </li>
      ))}
    </ul>
  );
};

export default NumberedList;
