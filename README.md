# X Enhancer

A browser extension that allows you to customize your X (formerly Twitter) experience by hiding unwanted buttons from the sidebar. Compatible with Chrome, Edge, and Firefox.

## Table of Contents
1. [Installation](#installation)
2. [Features](#features)
3. [Development](#development)
5. [Contributing](#contributing)
6. [License](#license)

## Features

- Toggle specific sidebar buttons on/off
- Persistent settings across browser sessions
- Support for both X.com and Twitter.com domains
- Clean, minimal UI with dark mode support
- Cross-browser compatibility (Chrome, Edge, Firefox)

## Development

This project is built with:
- React + TypeScript
- Vite for bundling
- Shadcn UI components
- Tailwind CSS for styling
- WebExtension API (compatible with Chrome Extensions Manifest V3 and Firefox)


### Getting Started

1. Clone the repository:
```bash
git clone https://github.com/shanksxz/x-enhancer-extension.git
cd x-enhancer-extension
```

2. Install dependencies:
```bash
npm install
```

3. Build for production:
```bash
npm run build
```

### Loading the Extension

## Chrome/Edge
1. Build the project
2. Open Chrome/Edge and navigate to `chrome://extensions`
3. Enable "Developer mode"
4. Click "Load unpacked" and select the `dist` directory

## Firefox
1. Build the project
2. Open Firefox and navigate to `about:debugging`
3. Click "This Firefox" > "Load Temporary Add-on..."
4. Select the `dist/manifest.json` file

### Troubleshooting
if you encounter any issues:
- Check the browser's console for errors messages
- Ensure you have the latest version of the supported browsers
- For Firefox, make sure the browser_specific_settings in manifest.json includes a unique extension ID


## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
