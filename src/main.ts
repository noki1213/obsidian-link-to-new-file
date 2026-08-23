import { Plugin, MarkdownView, TFile, normalizePath, Notice } from "obsidian";

export default class LinkToNewFilePlugin extends Plugin {
	async onload() {
		// Register the command so it can run from the palette or a hotkey
		this.addCommand({
			id: "open-or-create-link",
			name: "リンク先を開く / 存在しなければ作成して開く",
			editorCallback: (editor, view) => {
				this.handleLink(view);
			},
		});
	}

	// Read the link name under the cursor
	private extractLinkAtCursor(editor: MarkdownView["editor"]): string | null {
		const cursor = editor.getCursor();
		const line = editor.getLine(cursor.line);

		// Find the [[...]] that contains the cursor, or the one just before it
		const regex = /\[\[([^\]]+)\]\]/g;
		let match;
		while ((match = regex.exec(line)) !== null) {
			const start = match.index;
			const end = start + match[0].length;

			// The cursor is inside the link, or immediately after it
			if (cursor.ch >= start && cursor.ch <= end) {
				// With a pipe (display name), keep only the file name part
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

		// Look up the current file (the map of content)
		const currentFile = view.file;
		if (!currentFile) {
			new Notice("現在のファイルが取得できません");
			return;
		}

		// Check whether the linked file already exists
		const existingFile = this.app.metadataCache.getFirstLinkpathDest(
			linkName,
			currentFile.path
		);

		if (existingFile) {
			// The file exists, so open it
			await this.app.workspace.getLeaf(false).openFile(existingFile);
			new Notice(`${existingFile.name} を開きました`);
		} else {
			// The file does not exist, so create it and open it
			await this.createAndOpenFile(linkName, currentFile);
		}
	}

	private async createAndOpenFile(linkName: string, mocFile: TFile) {
		// Create the file in the same folder as the map of content
		const folderPath = mocFile.parent?.path ?? "";
		const newFilePath = normalizePath(
			folderPath ? `${folderPath}/${linkName}.md` : `${linkName}.md`
		);

		// Name of the map of content, without the extension
		const mocName = mocFile.basename;

		// Build the frontmatter
		const content = `---\nup:\n  - "[[${mocName}]]"\n---\n`;

		// Create the file
		const newFile = await this.app.vault.create(newFilePath, content);

		// Open the file that was just created
		await this.app.workspace.getLeaf(false).openFile(newFile);
		new Notice(`${linkName}.md を作成しました`);
	}
}
