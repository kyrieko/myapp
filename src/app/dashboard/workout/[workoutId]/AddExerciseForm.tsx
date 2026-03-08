"use client"

import { useState } from "react"
import { Exercise } from "@/db/schema"
import { Button } from "@/components/ui/button"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command"
import { addExerciseAction } from "./actions"

interface AddExerciseFormProps {
  allExercises: Exercise[]
  workoutId: number
}

export function AddExerciseForm({ allExercises, workoutId }: AddExerciseFormProps) {
  const [open, setOpen] = useState(false)
  const [isPending, setIsPending] = useState(false)

  async function handleSelect(exerciseId: number) {
    setOpen(false)
    setIsPending(true)
    try {
      await addExerciseAction(workoutId, exerciseId)
    } finally {
      setIsPending(false)
    }
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button variant="outline" disabled={isPending}>
          {isPending ? "추가 중..." : "+ 운동 추가"}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-64 p-0">
        <Command>
          <CommandInput placeholder="운동 검색..." />
          <CommandList>
            <CommandEmpty>검색 결과 없음</CommandEmpty>
            <CommandGroup>
              {allExercises.map((exercise) => (
                <CommandItem
                  key={exercise.id}
                  value={exercise.name}
                  onSelect={() => handleSelect(exercise.id)}
                >
                  {exercise.name}
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  )
}
