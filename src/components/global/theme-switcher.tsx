'use client'
import { Moon, Sun } from "lucide-react";
import * as SwitchPrimitives from "@radix-ui/react-switch";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useTheme } from "next-themes";
import React from "react"; // Import React for React.MouseEvent


export default function ThemeToggle() {
  const { theme, setTheme } = useTheme();

  const handleThemeToggle = () => {
    // Toggle between 'light' and 'dark' themes
    setTheme(theme === "dark" ? "light" : "dark");
  };

  return (
    <div className="px-2">
      <Tooltip>
        {/* Use asChild to pass props to the child */}
        <TooltipTrigger asChild>
          <SwitchPrimitives.Root
            checked={theme === "dark"}
            // Use onCheckedChange for SwitchPrimitives
            onCheckedChange={handleThemeToggle}
            className="peer inline-flex h-6 w-11 shrink-0 cursor-pointer items-center rounded-full border-2 border-transparent transition-colors focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:cursor-not-allowed disabled:opacity-50 data-[state=checked]:bg-blue-500 data-[state=unchecked]:bg-gray-300"
          >
            <SwitchPrimitives.Thumb className="pointer-events-none block h-5 w-5 rounded-full bg-background shadow-lg ring-0 transition-transform data-[state=checked]:translate-x-5 data-[state=unchecked]:translate-x-0 flex items-center justify-center">
              {theme === "dark" ? (
                <Moon className="size-8 text-gray-700" />
              ) : (
                <Sun className="size-8 text-yellow-500" />
              )}
            </SwitchPrimitives.Thumb>
          </SwitchPrimitives.Root>
        </TooltipTrigger>
        <TooltipContent>Toggle light/dark mode</TooltipContent>
      </Tooltip>
    </div>
  );
}