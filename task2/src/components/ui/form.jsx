import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { Controller, FormProvider, useFormContext, useFormState, useForm } from "react-hook-form";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogClose } from "@/components/ui/dialog";

import { cn } from "@/lib/utils"
import { Label } from "@/components/ui/label"

const Form = FormProvider

const FormFieldContext = React.createContext({})

const FormField = (
  {
    ...props
  }
) => {
  return (
    <FormFieldContext.Provider value={{ name: props.name }}>
      <Controller {...props} />
    </FormFieldContext.Provider>
  );
}

const useFormField = () => {
  const fieldContext = React.useContext(FormFieldContext)
  const itemContext = React.useContext(FormItemContext)
  const { getFieldState } = useFormContext()
  const formState = useFormState({ name: fieldContext.name })
  const fieldState = getFieldState(fieldContext.name, formState)

  if (!fieldContext) {
    throw new Error("useFormField should be used within <FormField>")
  }

  const { id } = itemContext

  return {
    id,
    name: fieldContext.name,
    formItemId: `${id}-form-item`,
    formDescriptionId: `${id}-form-item-description`,
    formMessageId: `${id}-form-item-message`,
    ...fieldState,
  }
}

const FormItemContext = React.createContext({})

function FormItem({
  className,
  ...props
}) {
  const id = React.useId()

  return (
    <FormItemContext.Provider value={{ id }}>
      <div data-slot="form-item" className={cn("grid gap-2", className)} {...props} />
    </FormItemContext.Provider>
  );
}

function FormLabel({
  className,
  ...props
}) {
  const { error, formItemId } = useFormField()

  return (
    <Label
      data-slot="form-label"
      data-error={!!error}
      className={cn("data-[error=true]:text-destructive", className)}
      htmlFor={formItemId}
      {...props} />
  );
}

function FormControl({
  ...props
}) {
  const { error, formItemId, formDescriptionId, formMessageId } = useFormField()

  return (
    <Slot
      data-slot="form-control"
      id={formItemId}
      aria-describedby={
        !error
          ? `${formDescriptionId}`
          : `${formDescriptionId} ${formMessageId}`
      }
      aria-invalid={!!error}
      {...props} />
  );
}

function FormDescription({
  className,
  ...props
}) {
  const { formDescriptionId } = useFormField()

  return (
    <p
      data-slot="form-description"
      id={formDescriptionId}
      className={cn("text-muted-foreground text-sm", className)}
      {...props} />
  );
}

function FormMessage({
  className,
  ...props
}) {
  const { error, formMessageId } = useFormField()
  const body = error ? String(error?.message ?? "") : props.children

  if (!body) {
    return null
  }

  return (
    <p
      data-slot="form-message"
      id={formMessageId}
      className={cn("text-destructive text-sm", className)}
      {...props}>
      {body}
    </p>
  );
}

function FormModal({ isOpen, onClose, onSubmit }) {
  const formMethods = useForm(); // Initialize react-hook-form

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-lg mx-auto">
        <DialogHeader>
          <DialogTitle>Add New Item</DialogTitle>
          <DialogClose onClick={onClose} /> {/* Ensure this closes the modal */}
        </DialogHeader>
        <FormProvider {...formMethods}>
          <form
            onSubmit={formMethods.handleSubmit((data) => {
              onSubmit(data);
              onClose(); // Close the modal after submission
            })}
            className="space-y-4"
          >
            <FormItem>
              <FormLabel>Customer Name</FormLabel>
              <FormControl>
                <input
                  type="text"
                  {...formMethods.register("CustomerName")}
                  placeholder="Enter customer name"
                  className="input"
                />
              </FormControl>
            </FormItem>
            <FormItem>
              <FormLabel>Division</FormLabel>
              <FormControl>
                <input
                  type="text"
                  {...formMethods.register("Division")}
                  placeholder="Enter division"
                  className="input"
                />
              </FormControl>
            </FormItem>
            <FormItem>
              <FormLabel>Gender</FormLabel>
              <FormControl>
                <select
                  {...formMethods.register("Gender")}
                  className="select"
                >
                  <option value="">Select gender</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                </select>
              </FormControl>
            </FormItem>
            <FormItem>
              <FormLabel>Marital Status</FormLabel>
              <FormControl>
                <select
                  {...formMethods.register("MaritalStatus")}
                  className="select"
                >
                  <option value="">Select marital status</option>
                  <option value="Single">Single</option>
                  <option value="Married">Married</option>
                  <option value="Divorced">Divorced</option>
                </select>
              </FormControl>
            </FormItem>
            <FormItem>
              <FormLabel>Age</FormLabel>
              <FormControl>
                <input
                  type="number"
                  {...formMethods.register("Age")}
                  placeholder="Enter age"
                  className="input"
                />
              </FormControl>
            </FormItem>
            <FormItem>
              <FormLabel>Income</FormLabel>
              <FormControl>
                <input
                  type="number"
                  {...formMethods.register("Income")}
                  placeholder="Enter income"
                  className="input"
                />
              </FormControl>
            </FormItem>
            <div className="flex justify-end mt-4">
              <button type="submit" className="btn btn-primary">
                Submit
              </button>
            </div>
          </form>
        </FormProvider>
      </DialogContent>
    </Dialog>
  );
}

export {
  useFormField,
  Form,
  FormItem,
  FormLabel,
  FormControl,
  FormDescription,
  FormMessage,
  FormField,
  FormModal,
}
