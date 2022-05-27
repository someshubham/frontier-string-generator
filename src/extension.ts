// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import path = require("path");
import fs = require("fs");
import * as vscode from "vscode";

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {
  // Use the console to output diagnostic information (console.log) and errors (console.error)
  // This line of code will only be executed once when your extension is activated
  console.log('Congratulations, your extension "helloworld" is now active!');

  // The command has been defined in the package.json file
  // Now provide the implementation of the command with registerCommand
  // The commandId parameter must match the command field in package.json
  let disposable = vscode.commands.registerCommand(
    "frontier.generateString",
    async () => {
      // The code you place here will be executed every time your command is executed
      // Display a message box to the user

      const editor = vscode.window.activeTextEditor;

      // [frontierVariable] is the variable created inside new_frontier.dart
      var frontierVariable = "";
      // [frontierValue] is the string literal and the value for the en.json file
      var frontierValue = "";
      // [frontierKey] is the Key for the en.json file against which Value is stored
      var frontierKey = "";
      if (editor) {
        const document = editor.document;
        const selection = editor.selection;

        // Get the word within the selection
        var selectedPhrase = document.getText(selection);

        // Remove quotes if any from the string
        selectedPhrase = trimSelection(selectedPhrase);

        // Assign the selected phrase as the main value
        frontierValue = selectedPhrase;

        // Split the string into array so as to make a variable and a key
        const strs = selectedPhrase.split(" ");

        // Create a variable
        frontierVariable = makeFrontierVariable(strs);

        // Create a key
        frontierKey = makeFrontierKey(strs);

        editor.edit((editBuilder) => {
          editBuilder.replace(selection, frontierVariable);
        });
      }

      const newFrontierPath = vscode.Uri.file(
        "/Users/edith/Development/frontier-flutter/lib/src/new_frontier.dart"
      );
      fs.appendFileSync(
        newFrontierPath.fsPath,
        `\nstatic const String ${frontierVariable} = "${frontierKey}";`
      );

      const jsonPath = vscode.Uri.file(
        "/Users/edith/Development/frontier-flutter/assets/locale/en.json"
      );
      fs.appendFileSync(
        jsonPath.fsPath,
        `\n"${frontierKey}": "${frontierValue}",`
      );

      vscode.workspace.openTextDocument(newFrontierPath).then((doc) => {
        vscode.window.showTextDocument(doc, { preserveFocus: true });
      });
    }
  );

  context.subscriptions.push(disposable);
}

function trimSelection(phrase: string): string {
  return phrase.replace(/[`'"]+/g, "");
}

function makeFrontierVariable(strs: string[]): string {
  let frontierVariable: string = "NewFrontier.";
  for (var i = 0; i < strs.length; i++) {
    if (i === 2) {
      break;
    }
    if (i === 0) {
      frontierVariable = frontierVariable + strs[i].toLowerCase();
    } else {
      frontierVariable =
        frontierVariable + strs[i][0].toUpperCase() + strs[i].substring(1);
    }
  }
  frontierVariable = frontierVariable + "Text";
  return frontierVariable;
}

function makeFrontierKey(strs: string[]): string {
  return strs.map((s) => s.toLowerCase()).join("_");
}

// this method is called when your extension is deactivated
export function deactivate() {}
