import { Plugin, MarkdownView, TFile, normalizePath, Notice } from "obsidian";

export default class LinkToNewFilePlugin extends Plugin {
	async onload() {
		// Register the command (runnable from the command palette or a hotkey)
		this.addCommand({
			id: "open-or-create-link",
			name: "リンク先を開く / 存在しなければ作成して開く",
			editorCallback: (editor, view) => {
				this.handleLink(view);
			},
		});
	}

	// Get the link name from the cursor position
	private extractLinkAtCursor(editor: MarkdownView["editor"]): string | null {
		const cursor = editor.getCursor();
		const line = editor.getLine(cursor.line);

		// Find the [[...]] that contains, or immediately precedes, the cursor position
		const regex = /\[\[([^\]]+)\]\]/g;
		let match;
		while ((match = regex.exec(line)) !== null) {
			const start = match.index;
			const end = start + match[0].length;

			// When the cursor is inside a link, or right after one
			if (cursor.ch >= start && cursor.ch <= end) {
				// If there's a pipe (display name), take only the file name part
				const linkText = match[1];
				const pipeIndex = linkText.indexOf("|");
				return pipeIndex >= 0 ? linkText.substring(0, pipeIndex) : linkText;
			}
		}
		return null;
	}

	private async handleLink(view: MarkdownView) {
		const editor = view.editor;
		const linkName = this.extractLinkAtCursor(editor);

		if (!linkName) {
			new Notice("カーソル位置にリンクが見つかりません");
			return;
		}

		// Get info about the current file (the MOC)
		const currentFile = view.file;
		if (!currentFile) {
			new Notice("現在のファイルが取得できません");
			return;
		}

		// Check whether the linked file exists
		const existingFile = this.app.metadataCache.getFirstLinkpathDest(
			linkName,
			currentFile.path
		);

		if (existingFile) {
			// File exists → open it
			await this.app.workspace.getLeaf(false).openFile(existingFile);
			new Notice(`${existingFile.name} を開きました`);
		} else {
			// File doesn't exist → create it and open it
			await this.createAndOpenFile(linkName, currentFile);
		}
	}

	private async createAndOpenFile(linkName: string, mocFile: TFile) {
		// Create the file in the same folder as the MOC
		const folderPath = mocFile.parent?.path ?? "";
		const newFilePath = normalizePath(
			folderPath ? `${folderPath}/${linkName}.md` : `${linkName}.md`
		);

		// MOC file name (without extension)
		const mocName = mocFile.basename;

		// Create the frontmatter
		const content = `---\nup:\n  - "[[${mocName}]]"\n---\n`;

		// Create the file
		const newFile = await this.app.vault.create(newFilePath, content);

		// Open the created file
		await this.app.workspace.getLeaf(false).openFile(newFile);
		new Notice(`${linkName}.md を作成しました`);
	}
}
