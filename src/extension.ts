// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
const asciidoctor = require('asciidoctor')();
import * as fs from 'fs';
import * as path from 'path';

let _panelAlive = false;

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {

	// Use the console to output diagnostic information (console.log) and errors (console.error)
	// This line of code will only be executed once when your extension is activated
	//console.log('Congratulations, your extension "asciidocplugin" is now active!');
	const js = "" + fs.readFileSync(path.join(context.extensionPath, 'mermaid.min.js'));
	const css = "" + fs.readFileSync(path.join(context.extensionPath, 'mermaid.min.css'))
		+ fs.readFileSync(path.join(context.extensionPath, 'asciidoctor.css'));
	let webViewPanel: vscode.WebviewPanel | null = null;

	// The command has been defined in the package.json file
	// Now provide the implementation of the command with registerCommand
	// The commandId parameter must match the command field in package.json
	let disposable = vscode.commands.registerCommand('asciidocplugin.previewAsciiDoc', () => {
		// The code you place here will be executed every time your command is executed
		// Display a message box to the user

		if (!_panelAlive) {
			webViewPanel = vscode.window.createWebviewPanel(
				"AsciiDoc",
				"AsciiDoc Browser",
				vscode.ViewColumn.Beside,
				{
					enableScripts: true,
					enableFindWidget: true,
					//localResourceRoots: resource_root,
				}
			);

			if (webViewPanel) {
				webViewPanel.onDidDispose(() => {
					_panelAlive = false;
				});
			}

			vscode.workspace.onDidChangeTextDocument(event => {
				CreatePreviewHtml(context, webViewPanel, js, css);
			}, null, context.subscriptions);

			vscode.window.onDidChangeActiveTextEditor(event => {
				CreatePreviewHtml(context, webViewPanel, js, css);
			}, null, context.subscriptions);

			CreatePreviewHtml(context, webViewPanel, js, css);
			_panelAlive = true;
		}
	});

	context.subscriptions.push(disposable);
}

function CreatePreviewHtml(context: vscode.ExtensionContext, webViewPanel: vscode.WebviewPanel | null, js: string, css: string) {
	const editor = vscode.window.activeTextEditor;
	const content = editor?.document.getText().toString();

	if (content !== null && content !== undefined && webViewPanel !== null) {
		//webViewPanel.webview.html = "" + fs.readFileSync("z:\\test.html");
		const html = ConvertLink(asciidoctor.convert(ConvertMermaid(content)));
		webViewPanel.webview.html = `\
<!DOCTYPE html>\
<html lang="ja"><head><meta http-equiv="Content-Type" content="text/html; charset=UTF-8">\
<script>\
${js}\
</script>\
<style>\
${css}\
</style>\
<body>\
${html}\
</body>\
</html>`;
	}
}

// 日本語のhrefとIDをエスケープする(VSCodeのWebViewPanelは<a>でリンク先が日本語のIDにジャンプ出来ない？)
function ConvertLink(str: string): string {
	str = str.replace(/href\="\#_(.*)?"/g,function(match, args){
		console.log(args);
		return `href="#_${escape(args)}"`;
	});
	str = str.replace(/id\="_(.*)?"/g,function(match, args){
		return `id="_${escape(args)}"`;
	});
	return str;
}

// mermaidの記述をasciidocのPassThroughで囲む
function ConvertMermaid(str: string): string {
	var lines = str.split('\n');

	let ret = "";
	let state = 0;
	for (let i = 0; i < lines.length; i++) {
		const line = lines[i];
		if (line.indexOf("[mermaid]") === 0) {
			state++;
		}
		else if (line.indexOf("....") === 0 || line.indexOf("----") === 0) {
			switch (state) {
				case 1:
					ret += "\r\n++++";
					ret += "\r\n<div class=\"mermaid\">";
					state++;
					break;
				case 2:
					state = 0;
					ret += "\r\n</div>";
					ret += "\r\n++++\r\n";
					break;
			}
		}
		else {
			ret += line + "\n";
		}
	}
	return ret;
}

// this method is called when your extension is deactivated
export function deactivate() { }
