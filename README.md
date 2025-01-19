# X Enhancer
A browser extension to customize X (Twitter) by hiding unwanted UI elements.

## Features
- Hide specific sidebar buttons
- Remove right sidebar elements
- Dark mode support
- Settings sync across sessions
- Cross-browser compatibility


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

## Loading the Extension

### Chrome/Edge
1. Build the project
2. Open Chrome/Edge and navigate to `chrome://extensions`
3. Enable "Developer mode"
4. Click "Load unpacked" and select the `dist` directory

### Firefox
1. Build the project
2. Open Firefox and navigate to `about:debugging`
3. Click "This Firefox" > "Load Temporary Add-on..."
4. Select the `dist/manifest.json` file

## Troubleshooting
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
