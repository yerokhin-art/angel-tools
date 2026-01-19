---
name: React Spectrum S2 Instructions
description: Using React Spectrum (S2) components from `@react-spectrum/s2`
applyTo: "**/*"
---

# React Spectrum (with Spectrum 2)

When implementing UI components in React, use the React Spectrum (S2) library to ensure that your components are accessible and follow Adobe's Spectrum 2 design system. Components should be imported from the `@react-spectrum/s2` package. Using the older `@adobe/react-spectrum` package (also called React Spectrum v3) should be avoided unless explicitly requested.

## Collection components

For dynamic collections, instead of using `Array.map`, use the following JSX-based interface, which maps over your data and applies a function for each item to render it.

```jsx
<Menu items={list.items}>
  {(item) => <MenuItem key={item.name}>{item.name}</MenuItem>}
</Menu>
```

## Pressable components

For pressable components such as Button, use `onPress` instead of `onClick`. Similarly, use `onPressStart`, `onPressEnd`, `onPressChange`, and `onPressUp` where appropriate.
Press event handlers are type `(e: PressEvent) => void` where `PressEvent` is defined as:

```ts
interface PressEvent {
  type: 'pressstart' | 'pressend' | 'pressup' | 'press';
  pointerType: 'mouse' | 'pen' | 'touch' | 'keyboard' | 'virtual';
  target: Element;
  shiftKey: boolean;
  ctrlKey: boolean;
  metaKey: boolean;
  altKey: boolean;
  x: number;
  y: number;
}
```

## Input components

For input field components such as TextField, the `onChange` event handler is type `(value: string) => void`.

## Other tips with components

### Virtualized collections

When using virtualized components such as `TableView` or `CardView`, ensure the height is constrained.

### Tooltips on elements

Tooltips need to be accessible to keyboard and screen reader users, so we want to ensure that they are only placed on focusable and hoverable elements. For example, plain text on a page isn't focusable, so keyboard and screen reader users would be unable to access the information in that tooltip.

If you need to display some additional context, consider using the `ContextualHelp` component.

### Typography

Note that the Text and Heading components are not general typography components, but instead are meant to be used WITHIN other components so default styles can be inherited (i.e. a Heading inside a Dialog or MenuItem). These components should not be used standalone. Spectrum 2 does not include specific components for typography. Instead, you can use the style macro to apply Spectrum typography to any HTML element or component.

## Styling

In `@react-spectrum/s2` package, there is a more flexible style macro. This offers additional Spectrum tokens, improves performance by generating CSS at build time rather than runtime, and works with any DOM element for use in custom components. Macros are a new bundler feature that enable functions to run at build time. The React Spectrum `style` macro uses this to generate CSS that can be applied to any DOM element or component. Import the `style` macro using the with `{type: 'macro'}` import attribute, and pass the result to the `styles` prop of any React Spectrum component to provide it with styles.

```jsx
import {style} from '@react-spectrum/s2/style' with {type: 'macro'};
import {ActionButton} from '@react-spectrum/s2';
<ActionButton styles={style({marginStart: 8})}>
  Edit
</ActionButton>
```

The `styles` prop accepts a limited set of CSS properties, including layout, spacing, sizing, and positioning. Other styles such as colors and internal padding cannot be customized within Spectrum components.

### Supported CSS properties on Spectrum components
- `margin`
- `marginStart`
- `marginEnd`
- `marginTop`
- `marginBottom`
- `marginX`
- `marginY`
- `width`
- `minWidth`
- `maxWidth`
- `flexGrow`
- `flexShrink`
- `flexBasis`
- `justifySelf`
- `alignSelf`
- `order`
- `gridArea`
- `gridRow`
- `gridRowStart`
- `gridRowEnd`
- `gridColumn`
- `gridColumnStart`
- `gridColumnEnd`
- `position`
- `zIndex`
- `top`
- `bottom`
- `inset`
- `insetX`
- `insetY`
- `insetStart`
- `insetEnd`

### UNSAFE Style Overrides

We highly discourage overriding the styles of React Spectrum components because it may break at any time when we change our implementation, making it difficult for you to update in the future. Consider using React Aria Components with our style macro to build a custom component with Spectrum styles instead.
That said, just like in React Spectrum v3, the `UNSAFE_className` and `UNSAFE_style` props are supported on Spectrum 2 components as last-resort escape hatches.

```jsx
/* YourComponent.tsx */
import {Button} from '@react-spectrum/s2';
import './YourComponent.css';
function YourComponent() {
  return <Button UNSAFE_className="your-unsafe-class">Button</Button>;
}
```

```css
/* YourComponent.css */
.your-unsafe-class {
  background: red;
}
```

Note that the style macro being passed to UNSAFE_className will result in a TypeScript error. This is not allowed because UNSAFE_className is appended to the component's own styles, not merged.

### CSS Resets

CSS resets are strongly discouraged. Global CSS selectors can unintentionally affect elements that were not intended to have their styles be modified, leading to style clashes. Since Spectrum 2 uses CSS Cascade Layers, global CSS outside a `@layer` will override S2's CSS.

### CSS optimization

The style macro relies on CSS bundling and minification to generate optimized output. When configuring your build tool, follow these best practices:
- Ensure that the styles are extracted into a CSS bundle and not injected at runtime by `<style>` elements.
- Use a CSS minifier such as Lightning CSS to deduplicate common rules used between components. Consider running this during development as well to reduce style duplication in developer tools for improved debugging.
- Configure your bundler to combine all CSS for S2 components and style macros into a single bundle instead of code splitting. Atomic CSS results in a lot of overlap between components. With code splitting, common rules are duplicated between bundles by default. To avoid this, load the CSS for all used S2 components in a single bundle. Because of the high degree of overlap between components, this initial bundle will be quite small.
