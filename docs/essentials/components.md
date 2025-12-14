# Components

## Buttons Components

Create interactive button handlers:

```typescript
// components/confirm.ts
export default defineButtonComponent(
  {
    label: 'Confirm Ban'
    style: 'Danger'
  }
  async (interaction) => {
    await interaction.reply('User has been banned!')
  }
)
```

## Select Menu Components

Handle select menu interactions:

```typescript
// components/starter.ts
export default defineSelectMenuComponent(
  {
    placeholder: 'Make a selection!',
    options: [
      {
        label: 'Bulbasaur',
        description: 'The dual-type Grass/Poison Seed Pokémon.',
        value: 'bulbasaur'
      },
      {
        label: 'Charmander',
        description: 'The Fire-type Lizard Pokémon.',
        value: 'charmander'
      },
      {
        label: 'Squirtle',
        description: 'The Water-type Tiny Turtle Pokémon.',
        value: 'squirtle'
      }
    ]
  }
  async (interaction, selected) => {
    await interaction.reply(`You selected: ${selected[0]}`);
  }
);
```

## Modal Components

Handle form submissions:

```typescript
// components/my-modal.ts
export default defineModalComponent(
  {
    title: 'My Modal',
    inputs: {
      hobbiesInput: {
        label: "What's some of your favorite hobbies?",
        style: 'Short',
        placeholder: 'card games, films, books, etc.'
      }
    }
  },
  async (interaction) => {
    const hobbies = interaction.fields.getTextInputValue('hobbiesInput')
    await interaction.reply(`Your hobbies are: ${hobbies}`)
  }
)
```
