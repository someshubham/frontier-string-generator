// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import { fstat } from 'fs';
import path = require('path');
import fs = require('fs');
import * as vscode from 'vscode';

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {
	
	// Use the console to output diagnostic information (console.log) and errors (console.error)
	// This line of code will only be executed once when your extension is activated
	console.log('Congratulations, your extension "helloworld" is now active!');

	// The command has been defined in the package.json file
	// Now provide the implementation of the command with registerCommand
	// The commandId parameter must match the command field in package.json
	let disposable = vscode.commands.registerCommand('frontier.generateString', async () => {
		// The code you place here will be executed every time your command is executed
		// Display a message box to the user
	

		const editor = vscode.window.activeTextEditor;
		var finalText = "NewFrontier.";
		var initialText = "";
		var keyText = "";
		if (editor) {
			const document = editor.document;
			const selection = editor.selection;

			// Get the word within the selection
			const word = document.getText(selection);
			initialText = word;
			const strs = word.split(' ');
			keyText = strs.join("_");
			for (var i = 0; i < strs.length; i++) {

				if (i === 2) {
					break;
				}

				if (i === 0) {
					finalText = finalText + strs[i].toLowerCase();
				} else {
					finalText = finalText + strs[i][0].toUpperCase() + strs[i].substring(1);
				}	
				
			}

			finalText = finalText + "Text";
					

			editor.edit(editBuilder => {
				editBuilder.replace(selection, finalText);
			});
		}


		const newFrontierPath = vscode.Uri.file("/Users/edith/Development/frontier-flutter/lib/src/new_frontier.dart");
		fs.appendFileSync(newFrontierPath.fsPath, `static const String ${finalText} = "${keyText}";`);
		

		const jsonPath = vscode.Uri.file("/Users/edith/Development/frontier-flutter/assets/locale/en.json");
		fs.appendFileSync(jsonPath.fsPath, `"${keyText}": "${initialText}",`);
		
		
		
		vscode.workspace.openTextDocument(newFrontierPath).then(doc => {
			vscode.window.showTextDocument(doc, { preserveFocus: true });
		
		});

		

		


		
	});

	

	context.subscriptions.push(disposable);
}

// this method is called when your extension is deactivated
export function deactivate() {}
