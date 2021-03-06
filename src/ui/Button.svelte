<script>
  import clsx from "clsx";
  import Icon from "@iconify/svelte";
  import Spinner from "./Spinner.svelte";

  export let block = false;
  export let disabled = false;
  export let icon = null;
  export let iconPos = "cover";
  export let loading = false;
  export let outline = false;
  export let shape = "default";
  export let size = "md";
  export let color = "primary";

  const { class: klass, style, ...props } = $$props;
</script>

<button
  {...$$restProps}
  type="button"
  class={clsx(
    {
      "w-full justify-center": block,
      "opacity-60 pointer-events-none": disabled,
      "flex-col pointer-events-none": loading,

      // To support different button sizes.
      "p-1.5 text-sm": size === "sm",
      "p-2 text-base": size === "md",
      "p-2.5 text-lg": size === "lg",

      "!px-2.5": size === "sm" && ["circle", "pill"].indexOf(shape) < 0,
      "!px-3": size === "md" && ["circle", "pill"].indexOf(shape) < 0,
      "!px-3.5": size === "lg" && ["circle", "pill"].indexOf(shape) < 0,

      // To support different button shapes.
      "px-6 rounded-full": size === "sm" && shape === "pill",
      "px-8 rounded-full": size === "md" && shape === "pill",
      "px-10 rounded-full": size === "lg" && shape === "pill",

      "rounded-sm": shape === "round",
      "flex items-center justify-center rounded-full align-bottom": shape === "circle",

      // Ensure size consistency when the shape is round.
      "h-8 w-8": size === "sm" && shape === "circle",
      "h-10 w-10": size === "md" && shape === "circle",
      "h-12 w-12": size === "lg" && shape === "circle",

      // Note: PurgeCSS won't work well with dynamic classes. Hence, the repeatitive class switching below.
      "bg-primary-500 hover:bg-primary-600": color === "primary" && !outline,
      "bg-secondary-500 hover:bg-secondary-600": color === "secondary" && !outline,
      "bg-danger-500 hover:bg-danger-600": color === "danger" && !outline,
      "bg-info-500 hover:bg-info-600": color === "info" && !outline,
      "bg-success-500 hover:bg-success-600": color === "success" && !outline,
      "bg-warning-500 hover:bg-warning-600": color === "warning" && !outline,

      // To support outline button.
      "bg-transparent border hover:!text-white": outline,
      "p-[0.3125rem]": size === "sm" && outline,
      "p-[0.4375rem]": size === "md" && outline,
      "p-[0.5625rem]": size === "lg" && outline,
      "border-primary-500 !text-primary-500 hover:bg-primary-600": color === "primary" && outline,
      "border-secondary-500 !text-secondary-500 hover:bg-secondary-600":
        color === "secondary" && outline,
      "border-danger-500 !text-danger-500 hover:bg-danger-600": color === "danger" && outline,
      "border-info-500 !text-info-500 hover:bg-info-600": color === "info" && outline,
      "border-success-500 !text-success-500 hover:bg-success-600": color === "success" && outline,
      "border-warning-500 !text-warning-500 hover:bg-warning-600": color === "warning" && outline,
    },
    "inline-flex items-center text-white text-center focus:outline-none",
    klass
  )}
  {style}
  on:click
  on:dblclick
>
  {#if loading}
    <Spinner {size} color={outline ? color : "white"} />

    <div class="opacity-0 inline h-0">
      {#if icon !== ""}
        {#if iconPos === "cover"}
          <Icon {icon} />
          <slot />
        {:else if iconPos === "leading"}
          <Icon {icon} />
          <slot />
        {:else if iconPos === "trailing"}
          <slot />
          <Icon {icon} />
        {/if}
      {:else}
        <slot />
      {/if}
    </div>
  {:else if icon}
    {#if iconPos === "cover"}
      <Icon {icon} />
    {:else if iconPos === "leading"}
      <Icon
        class={clsx({
          "mr-0.5": size === "sm",
          "mr-1": size === "md",
          "mr-1.5": size === "lg",
        })}
        {icon}
      />
      <slot />
    {:else if iconPos === "trailing"}
      <slot />
      <Icon
        class={clsx({
          "ml-0.5": size === "sm",
          "ml-1": size === "md",
          "ml-1.5": size === "lg",
        })}
        {icon}
      />
    {/if}
  {:else}
    <slot />
  {/if}
</button>
