import * as vscode from 'vscode';
import * as path from 'path';
import { generateLQIP } from './lqipGenerator';

export function activate(context: vscode.ExtensionContext) {
    let disposable = vscode.commands.registerCommand('extension.generateLQIP', async (uri: vscode.Uri) => {
        let filePath: string;

        if (uri && uri.fsPath) {
            filePath = uri.fsPath;
        } else {
            const editor = vscode.window.activeTextEditor;
            if (editor) {
                filePath = editor.document.fileName;
            } else {
                vscode.window.showErrorMessage('No file selected');
                return;
            }
        }

        if (!filePath.match(/\.(jpg|jpeg|png|gif|webp)$/i)) {
            vscode.window.showErrorMessage('Selected file is not an image');
            return;
        }

        try {
            const lqipBase64 = await generateLQIP(filePath);
            
            const lqipFilePath = path.join(path.dirname(filePath), `${path.basename(filePath, path.extname(filePath))}.lqip`);
            
            await vscode.workspace.fs.writeFile(vscode.Uri.file(lqipFilePath), Buffer.from(lqipBase64));

            // Copy content to clipboard
            await vscode.env.clipboard.writeText(lqipBase64);

            const document = await vscode.workspace.openTextDocument(lqipFilePath);
            await vscode.window.showTextDocument(document);

            vscode.window.showInformationMessage('LQIP generated, saved, and copied to clipboard');
        } catch (error: unknown) {
            console.error('Error in extension.generateLQIP:', error);
            if (error instanceof Error) {
                vscode.window.showErrorMessage(`Error generating LQIP: ${error.message}`);
            } else {
                vscode.window.showErrorMessage('Error generating LQIP: Unknown error');
            }
        }
    });

    context.subscriptions.push(disposable);
}

export function deactivate() {}