import { Command as CommandPrimitive } from "cmdk"
import * as React from "react"

declare module "../components/ui/command" {
  interface CommandProps extends React.ComponentPropsWithoutRef<typeof CommandPrimitive> {}
  
  export const Command: React.ForwardRefExoticComponent<CommandProps>
  export const CommandInput: React.ForwardRefExoticComponent<CommandProps>
  export const CommandList: React.ForwardRefExoticComponent<CommandProps>
  export const CommandEmpty: React.ForwardRefExoticComponent<CommandProps>
  export const CommandGroup: React.ForwardRefExoticComponent<CommandProps>
  export const CommandItem: React.ForwardRefExoticComponent<CommandProps>
  export const CommandShortcut: React.ForwardRefExoticComponent<CommandProps>
} 