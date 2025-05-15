import * as React from "react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"

export function InputForm() {
  return (
    <form className="flex flex-col gap-4 mt-4">
      <div>
        <Label htmlFor="header">Header</Label>
        <Input id="header" name="header" type="text" placeholder="Enter header" required />
      </div>
      <div>
        <Label htmlFor="type">Type</Label>
        <Input id="type" name="type" type="text" placeholder="Enter type" required />
      </div>
      <div>
        <Label htmlFor="status">Status</Label>
        <Input id="status" name="status" type="text" placeholder="Enter status" />
      </div>
      <div>
        <Label htmlFor="target">Target</Label>
        <Input id="target" name="target" type="text" placeholder="Enter target" />
      </div>
      <div>
        <Label htmlFor="limit">Limit</Label>
        <Input id="limit" name="limit" type="text" placeholder="Enter limit" />
      </div>
      <div>
        <Label htmlFor="reviewer">Reviewer</Label>
        <Input id="reviewer" name="reviewer" type="text" placeholder="Enter reviewer" />
      </div>
      <Button type="submit">Submit</Button>
    </form>
  )
}
