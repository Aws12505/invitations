import * as React from "react";
import { cn } from "@/lib/utils";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

interface FormFieldProps extends React.InputHTMLAttributes<HTMLInputElement> {
    label: string;
    error?: string;
    required?: boolean;
    description?: string;
}

const FormField = React.forwardRef<HTMLInputElement, FormFieldProps>(
    ({ className, label, error, required, description, ...props }, ref) => {
        return (
            <div className="space-y-2">
                <Label htmlFor={props.id || props.name} className="text-sm font-medium">
                    {label}
                    {required && <span className="text-destructive ml-1">*</span>}
                </Label>
                <Input
                    className={cn(
                        error && "border-destructive focus-visible:ring-destructive",
                        className
                    )}
                    ref={ref}
                    {...props}
                />
                {description && (
                    <p className="text-xs text-muted-foreground">{description}</p>
                )}
                {error && (
                    <p className="text-xs text-destructive">{error}</p>
                )}
            </div>
        );
    }
);

FormField.displayName = "FormField";

export { FormField };
