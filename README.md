# GPML-VS

GPML Language Support for Visual Studio Code

## What is GPML?
GPML (GPU Markup Language) is a high-level, declarative language designed to build native GPU-accelerated applications. GPML source files are compiled to GPUI source code, enabling developers to create rich, high-performance user interfaces with ease.

The GPML-VS extension brings a modern, web-development-like experience to native app development:
- **Realtime Refresh in Dev Mode:** See your changes instantly, just like hot-reload in web development, but for native GPU-accelerated apps.
- **Familiar Markup Syntax:** Write UI layouts and logic in a readable, component-based format.
- **Native Performance:** All code compiles down to GPUI, leveraging the full power of the GPU.

## Features
- Syntax highlighting for `.gpml` files
- Language icon and extension branding
- Line comments with `//`
- Ready for future features: code snippets, autocompletion, error highlighting, and more

## Example
```gpml
import ./Card.gpml as Card // (as is not required)

<root>
    // Inline comments supported
    <Card title="Card Title" content="This is the content of the card." />

    <flex dir="horizontal" spacing=10>
        <button text="Button 1" />
        <button text="Button 2" />
        <button text="Button 3" />
    </flex>

    <p text="This is a sample text below the buttons." size=16 color="blue" />

    <div padding=10 backgroundColor="gray">
        <p text="This is a paragraph inside a div." size=14 color="black" />
    </div>

</root>
```

meanwhile in Card.gpml

```gpml
<Card>
    <title text="Card Title" />
    <content text="This is the content of the card." />
</Card>

export Card
```

## Vision
GPML aims to make native GPU-accelerated app development as fast and enjoyable as web development. With real-time feedback, a familiar markup style, and seamless compilation to GPUI, you can iterate quickly and deliver beautiful, high-performance apps.

## Usage
1. Install the extension in VS Code.
2. Open or create `.gpml` files to get syntax highlighting and language support.
3. In development mode, enjoy real-time refresh as you edit your UI.

## License
MIT