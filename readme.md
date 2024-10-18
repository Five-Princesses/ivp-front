# ivp-front

This project follows Google's Commit Message Guide for commit conventions and adheres to the Airbnb JavaScript/TypeScript Style Guide.

- [Commit Message Convention](https://developers.google.com/blockly/guides/contribute/get-started/commits)
- [Airbnb JavaScript Style Guide](https://github.com/airbnb/javascript)

## Development Setup

### Install NVM

```bash
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.40.1/install.sh | bash
```

- [NVM Official Github Repo.](https://github.com/nvm-sh/nvm)
- [NVM Windows Releases](https://github.com/coreybutler/nvm-windows/releases)

### Verify NVM Installation

```bash
nvm -v
```

### Install Node.js

```bash
nvm install 18.18.0

nvm use 18.18.0
# Now using node v18.18.0 (npm v9.8.1)
nvm current
# v18.18.0
nvm alias default 18.18.0
# default -> 18.18.0 (-> v18.18.0)

```


### Install Code Formatters

- [Install ESLint](https://marketplace.visualstudio.com/items?itemName=dbaeumer.vscode-eslint)
- [Install Prettier](https://marketplace.visualstudio.com/items?itemName=esbenp.prettier-vscode)

### VSCode Settings

1. Press `Cmd (Ctrl) + Shift + P`, type _settings_, and select `Preferences: Open Settings (UI)`.

2. Search for `format on save` and enable that option. ([Stackoverflow Explanation with images](https://stackoverflow.com/a/54665086))

3. Search for `default formatter` and set it to `Prettier - Code formatter`. ([Stackoverflow Explanation with images](https://stackoverflow.com/a/73403989))

### Install Dependencies

```bash
npm install
```

### Run Vite Locally

```bash
npm run dev
# Visit localhost:3000
```
