import { Button as ButtonPrimitive } from "@base-ui/react/button";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const buttonVariants = cva(
  [
    "group/button relative isolate inline-flex shrink-0 items-center justify-center",
    "overflow-hidden rounded-full border text-sm font-semibold whitespace-nowrap",
    "outline-none select-none",
    "transition-[box-shadow,background-color,color,border-color] duration-300",
    "focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#0874d1]",
    "active:translate-y-px disabled:pointer-events-none disabled:opacity-50",
    "aria-invalid:border-red-500 aria-invalid:ring-2 aria-invalid:ring-red-500/20",
    "[&_svg]:pointer-events-none [&_svg]:shrink-0",
    '[&_svg:not([class*="size-"])]:size-4',
    "after:pointer-events-none after:absolute after:inset-0 after:rounded-[inherit]",
    'after:border-2 after:border-transparent after:content-[""]',
    "after:[clip-path:inset(0_100%_0_0_round_999px)]",
    "after:transition-[clip-path] after:duration-500 after:ease-in-out",
    "hover:after:[clip-path:inset(0_0_0_0_round_999px)]",
    "motion-reduce:transition-none motion-reduce:after:transition-none",
  ].join(" "),
  {
    variants: {
      variant: {
        default: [
          "border-[#0874d1] bg-[#0874d1] text-white",
          "shadow-[0_5px_16px_rgba(8,116,209,0.16)]",
          "after:border-white",
          "hover:bg-[#0874d1]",
        ].join(" "),

        outline: [
          "border-white bg-white text-[#0874d1]",
          "shadow-[0_5px_16px_rgba(21,43,67,0.06)]",
          "after:border-[#064b91]",
          "hover:bg-white hover:text-[#0874d1]",
        ].join(" "),

        secondary: [
          "border-[#b8d8f4] bg-white text-[#152b43]",
          "shadow-[0_4px_12px_rgba(21,43,67,0.05)]",
          "after:border-[#064b91]",
          "hover:bg-white hover:text-[#152b43]",
        ].join(" "),

        ghost: [
          "border-transparent bg-transparent text-[#152b43]",
          "after:border-[#0874d1]",
          "hover:bg-[#eaf5ff] hover:text-[#0874d1]",
        ].join(" "),

        destructive: [
          "border-red-200 bg-red-50 text-red-700",
          "after:border-red-700",
          "hover:bg-red-50 hover:text-red-700",
        ].join(" "),

        link: [
          "h-auto rounded-none border-transparent bg-transparent p-0",
          "text-[#0874d1] underline-offset-4 after:hidden",
          "hover:bg-transparent hover:underline",
        ].join(" "),
      },

      size: {
        default: "h-12 gap-2 px-6",
        xs: "h-8 gap-1.5 px-3 text-xs",
        sm: "h-10 gap-2 px-4 text-[0.8rem]",
        lg: "h-14 gap-2.5 px-7 text-base",
        icon: "size-10 p-0",
        "icon-xs": "size-7 p-0",
        "icon-sm": "size-9 p-0",
        "icon-lg": "size-12 p-0",
      },
    },

    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
);

function Button({
  className,
  variant = "default",
  size = "default",
  ...props
}: ButtonPrimitive.Props & VariantProps<typeof buttonVariants>) {
  return (
    <ButtonPrimitive
      data-slot="button"
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  );
}

export { Button, buttonVariants };
