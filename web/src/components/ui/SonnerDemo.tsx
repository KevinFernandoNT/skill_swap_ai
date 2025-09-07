"use client"

import { toast } from "sonner"
import { Button } from "@/components/ui/button"

export function SonnerDemo() {
  return (
    <div className="space-y-4">
      <Button
        variant="outline"
        onClick={() =>
          toast("Event has been created", {
            description: "Sunday, December 03, 2023 at 9:00 AM",
            action: {
              label: "Undo",
              onClick: () => console.log("Undo"),
            },
          })
        }
      >
        Show Toast
      </Button>
      
      <Button
        variant="outline"
        onClick={() =>
          toast.success("Success!", {
            description: "Your action was completed successfully.",
          })
        }
      >
        Success Toast
      </Button>
      
      <Button
        variant="outline"
        onClick={() =>
          toast.error("Error occurred", {
            description: "Something went wrong. Please try again.",
          })
        }
      >
        Error Toast
      </Button>
      
      <Button
        variant="outline"
        onClick={() =>
          toast.info("Information", {
            description: "Here's some important information for you.",
          })
        }
      >
        Info Toast
      </Button>
    </div>
  )
}
