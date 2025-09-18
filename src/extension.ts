import * as vscode from 'vscode';
import * as path from 'path';
import * as fs from 'fs';

interface ComponentInfo {
    name: string;
    params: string[];
}

function parseComponentDef(content: string): ComponentInfo[] {
    // Matches: def ComponentName(param1, param2) {
    const regex = /def\s+([A-Z][a-zA-Z0-9_]*)\s*\(([^)]*)\)/g;
    const components: ComponentInfo[] = [];
    let match;
    while ((match = regex.exec(content))) {
        const name = match[1];
        const params = match[2].split(',').map(p => p.trim()).filter(Boolean);
        components.push({ name, params });
    }
    return components;
}

function getImportedComponents(document: vscode.TextDocument): { [name: string]: ComponentInfo } {
    const text = document.getText();
    const importRegex = /import\s+([.\w/\\-]+)\s+as\s+([A-Z][a-zA-Z0-9_]*)/g;
    const imports: { [name: string]: ComponentInfo } = {};
    let match;
    while ((match = importRegex.exec(text))) {
        let importPath = match[1];
        if (!importPath.endsWith('.gpml')) importPath += '.gpml';
        const absPath = path.resolve(path.dirname(document.uri.fsPath), importPath);
        if (fs.existsSync(absPath)) {
            const fileContent = fs.readFileSync(absPath, 'utf8');
            const comps = parseComponentDef(fileContent);
            for (const comp of comps) {
                imports[comp.name] = comp;
            }
        }
    }
    // Also parse this file for local components
    for (const comp of parseComponentDef(text)) {
        imports[comp.name] = comp;
    }
    return imports;
}

export function activate(context: vscode.ExtensionContext) {
    context.subscriptions.push(
        vscode.languages.registerCompletionItemProvider(
            { language: 'gpml', scheme: 'file' },
            {
                provideCompletionItems(
                    document: vscode.TextDocument,
                    position: vscode.Position,
                    token: vscode.CancellationToken,
                    context: vscode.CompletionContext
                ) {
                    const line = document.lineAt(position).text;
                    const wordRange = document.getWordRangeAtPosition(position, /[A-Za-z0-9_]+/);
                    const word = wordRange ? document.getText(wordRange) : '';
                    const components = getImportedComponents(document);
                    const completions: vscode.CompletionItem[] = [];

                    // Tag completion: <Component
                    if (/\<\w*$/.test(line.slice(0, position.character))) {
                        for (const compName in components) {
                            const item = new vscode.CompletionItem(compName, vscode.CompletionItemKind.Class);
                            item.detail = 'Component';
                            item.insertText = compName;
                            completions.push(item);
                        }
                    }

                    // Attribute completion: <Component |
                    const tagMatch = line.slice(0, position.character).match(/<([A-Z][A-Za-z0-9_]*)[^>]*$/);
                    if (tagMatch && components[tagMatch[1]]) {
                        for (const param of components[tagMatch[1]].params) {
                            const item = new vscode.CompletionItem(param, vscode.CompletionItemKind.Property);
                            item.detail = 'Component parameter';
                            item.insertText = param + '=""';
                            item.command = { command: 'editor.action.triggerSuggest', title: 'Re-trigger completions' };
                            completions.push(item);
                        }
                    }

                    return completions;
                }
            },
            '<', ' ', '\n' // Trigger on tag open, space, and newline
        )
    );
}

export function deactivate() {}
