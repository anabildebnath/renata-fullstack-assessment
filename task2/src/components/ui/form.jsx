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

function FormModal({ isOpen, onClose, onSubmit, defaultValues = {} }) {
  const formMethods = useForm({
    defaultValues: {
      CustomerName: "",
      Division: "",
      Gender: "",
      MaritalStatus: "",
      Age: "",
      Income: "",
    }
  });

  // Reset form when modal opens with proper default values
  React.useEffect(() => {
    if (isOpen) {
      const formattedValues = {
        CustomerName: defaultValues.CustomerName || "",
        Division: defaultValues.Division || "",
        Gender: defaultValues.Gender === 'F' ? 'Female' : 
                defaultValues.Gender === 'M' ? 'Male' : 
                defaultValues.Gender || "",
        MaritalStatus: defaultValues.MaritalStatus || "",
        Age: defaultValues.Age || "",
        Income: defaultValues.Income || "",
      };
      
      formMethods.reset(formattedValues);
    }
  }, [isOpen]); // Only depend on isOpen

  const handleSubmit = (data) => {
    const submissionData = {
      ...data,
      Gender: data.Gender === 'Female' ? 'F' : 
              data.Gender === 'Male' ? 'M' : 
              data.Gender
    };
    
    onSubmit(submissionData);
    onClose();
  };

  const isEditing = defaultValues && Object.keys(defaultValues).length > 0;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <div
        className="dialog-backdrop"
        onClick={(e) => {
          if (e.target === e.currentTarget) {
            onClose(); // Close the form only when clicking outside the modal content
          }
        }}
      >
        <DialogContent
          className="popup-form relative"
          style={{
            backgroundColor: "#000000",
            color: "#ffffff",
            borderRadius: "8px",
            boxShadow: "0 4px 10px rgba(0, 0, 0, 0.8)",
            maxWidth: "600px",
            width: "100%",
          }}
          onClick={(e) => e.stopPropagation()} // Prevent closing when clicking inside the form
        >
          <DialogHeader>
            <DialogTitle>{isEditing ? "Edit Customer" : "Add Customer"}</DialogTitle>
          </DialogHeader>
          <button
            className="absolute top-2 right-2 text-white bg-red-500 rounded-full p-1 hover:bg-red-600"
            onClick={onClose} // Close the form when clicking the close button
          >
            ✕
          </button>
          <FormProvider {...formMethods}>
            <form
              onSubmit={formMethods.handleSubmit(handleSubmit)}
              className="space-y-4"
            >
              <FormItem>
                <FormLabel>Customer Name</FormLabel>
                <FormControl>
                  <input
                    type="text"
                    {...formMethods.register("CustomerName", { required: "Customer Name is required" })}
                    placeholder="Enter customer name"
                    className="input"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
              <FormItem>
                <FormLabel>Division</FormLabel>
                <FormControl>
                  <select
                    {...formMethods.register("Division", { required: "Division is required" })}
                    className="select"
                  >
                    <option value="">Select division</option>
                    <option value="Dhaka">Dhaka</option>
                    <option value="Chattogram">Chattogram</option>
                    <option value="Rajshahi">Rajshahi</option>
                    <option value="Khulna">Khulna</option>
                    <option value="Barishal">Barishal</option>
                    <option value="Sylhet">Sylhet</option>
                    <option value="Rangpur">Rangpur</option>
                    <option value="Mymensingh">Mymensingh</option>
                  </select>
                </FormControl>
                <FormMessage />
              </FormItem>
              <FormItem>
                <FormLabel>Gender</FormLabel>
                <FormControl>
                  <select
                    {...formMethods.register("Gender", { required: "Gender is required" })}
                    className="select"
                  >
                    <option value="">Select gender</option>
                    <option value="Female">Female</option>
                    <option value="Male">Male</option>
                    <option value="Other">Other</option>
                  </select>
                </FormControl>
                <FormMessage />
              </FormItem>
              <FormItem>
                <FormLabel>Marital Status</FormLabel>
                <FormControl>
                  <select
                    {...formMethods.register("MaritalStatus", { required: "Marital Status is required" })}
                    className="select"
                  >
                    <option value="">Select marital status</option>
                    <option value="Single">Single</option>
                    <option value="Married">Married</option>
                    <option value="Divorced">Divorced</option>
                  </select>
                </FormControl>
                <FormMessage />
              </FormItem>
              <FormItem>
                <FormLabel>Age</FormLabel>
                <FormControl>
                  <input
                    type="number"
                    {...formMethods.register("Age", {
                      required: "Age is required",
                      min: { value: 0, message: "Age must be at least 0" },
                      max: { value: 200, message: "Age must be at most 200" },
                    })}
                    placeholder="Enter age"
                    className="input"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
              <FormItem>
                <FormLabel>Income</FormLabel>
                <FormControl>
                  <input
                    type="number"
                    {...formMethods.register("Income", {
                      required: "Income is required",
                      min: { value: 0, message: "Income cannot be negative" },
                    })}
                    placeholder="Enter income"
                    className="input"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
              <div className="flex justify-end mt-4">
                <button type="submit" className="btn btn-primary">
                  {isEditing ? "Update" : "Submit"}
                </button>
              </div>
            </form>
          </FormProvider>
        </DialogContent>
      </div>
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
