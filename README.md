# Date input with a mask

✅ The input mask depends on the browser locale 

✅ The input mask prevents the user from entering anything that is not a valid date.

✅ The v-model binding should always be of this format: "YYYY-MM-DD"

✅ The component utilize Vue@3.x and it's composition API

✅ The component written in TypeScript

✅ The component SSR friendly

✅ Written at least 3 tests for the component

✅ Takes into account the leap year </br>
![1](https://github.com/SudarevAleksandr/12Go/assets/39745168/9a8b3974-eee4-4d00-9302-460dffa8a0b2)

✅ Supports insertion and convenient modification from anywhere
![2](https://github.com/SudarevAleksandr/12Go/assets/39745168/ac460b97-63f1-4bad-bdf2-b51aed703192)

## Usage


```js
<template>
    <DateInput v-model="date" clearable label="Date" minDate="1800-01-01" maxDate="2200-01-01" />
    <div>Output: {{ date }}</div>
</template>

<script lang="ts">
import DateInput from '@/components/atoms/dateInput/DateInput.vue'
export default {
  components: { Input, DateInput }
  data(): DataInterface {
    return {
      date: null,
    }
  },
}
</script>
```

# Base DateInput Props

- **v-model** _\*required_ `[string YYYY-MM-DD, null]`
  - The date you've been working
- **minDate** `[string YYYY-MM-DD]`
  - Minimum date to pass validation
- **maxDate** `[string YYYY-MM-DD]`
  - Maximum date to pass validation
- **label** `[string]`
  - The field name displayed above the field can be any length
- **clearable** `[boolean]`
  - Displays the button to clear the field. Default false
- **disabled** `[boolean]`
  - Edit field availability. Default false
- **loading** `[boolean]`
  - Loading display. With SSR, until the browser locales are received, the field is not available for input and the loading is displayed.


## Testing

Test file:   /components/atoms/dateInput/DateInput.test.ts

```bash
# npm
npm test

# yarn
yarn test
```



## Setup

Make sure to install the dependencies:

```bash
# npm
npm install

# pnpm
pnpm install

# yarn
yarn install

# bun
bun install
```

## Development Server

Start the development server on `http://localhost:3000`:

```bash
# npm
npm run dev

# pnpm
pnpm run dev

# yarn
yarn dev

# bun
bun run dev
```

## Production

Build the application for production:

```bash
# npm
npm run build

# pnpm
pnpm run build

# yarn
yarn build

# bun
bun run build
```

Locally preview production build:

```bash
# npm
npm run preview

# pnpm
pnpm run preview

# yarn
yarn preview

# bun
bun run preview
```

Check out the [deployment documentation](https://nuxt.com/docs/getting-started/deployment) for more information.
