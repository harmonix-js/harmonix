# Components

## Buttons Components

Create interactive button handlers:

```typescript
// components/confirm.ts
import { defineButtonComponent } from 'harmonix'

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

Use the button in a command:

```typescript
// commands/moderation/ban.ts // [!code focus]
import { defineSlashCommand, useButton, createActionRow } from 'harmonix'

export default defineSlashCommand(
  {
    description: 'Select a member and ban them.',
    options: {
      target: {
        type: 'User',
        description: 'The member to ban',
        required: true
      },
      reason: {
        type: 'String',
        description: 'The reason for banning'
      }
    }
  },
  async (interaction, options) => {
    const reason = options.reason ?? 'No reason provided'
    const button = useButton('confirm') // [!code focus]
    const row = createActionRow(button) // [!code focus]

    await interaction.reply({
      // [!code focus]
      content: `Are you sure you want to ban ${option.target} for reason: ${reason}?`, // [!code focus]
      components: [row] // [!code focus]
    }) // [!code focus]
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

Use the select menu in a command:

```typescript
// commands/pokemon.ts
import { defineSlashCommand, useSelectMenu, createActionRow } from 'harmonix'

export default defineSlashCommand(
  {
    description: 'Choose your starter Pokémon!'
  },
  async (interaction) => {
    const selectMenu = useSelectMenu('starter') // [!code focus]
    const row = createActionRow(selectMenu) // [!code focus]

    await interaction.reply({
      // [!code focus]
      content: 'Choose your starter!', // [!code focus]
      components: [row] // [!code focus]
    }) // [!code focus]
  }
)
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

Use the modal in a command:

```typescript
// commands/hobbies.ts
import { defineSlashCommand, useModal } from 'harmonix'

export default defineSlashCommand(
  {
    description: 'Share your hobbies!'
  },
  async (interaction) => {
    const modal = useModal('my-modal') // [!code focus]

    await interaction.showModal(modal) // [!code focus]
  }
)
```
