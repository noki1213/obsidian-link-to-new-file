import { Plugin, MarkdownView, TFile, normalizePath, Notice } from "obsidian";

export default class LinkToNewFilePlugin extends Plugin {
	async onload() {
		// コマンドを登録（コマンドパレットやホットキーから実行できる）
		this.addCommand({
			id: "open-or-create-link",
			name: "リンク先を開く / 存在しなければ作成して開く",
			editorCallback: (editor, view) => {
				this.handleLink(view);
			},
		});
	}

	// カーソル位置からリンク名を取得する
	private extractLinkAtCursor(editor: MarkdownView["editor"]): string | null {
		const cursor = editor.getCursor();
		const line = editor.getLine(cursor.line);

		// カーソル位置を含む、または直前の [[...]] を探す
		const regex = /\[\[([^\]]+)\]\]/g;
		let match;
		while ((match = regex.exec(line)) !== null) {
			const start = match.index;
			const end = start + match[0].length;

			// カーソルがリンクの中、または直後にある場合
			if (cursor.ch >= start && cursor.ch <= end) {
				// パイプ（表示名）がある場合は、ファイル名部分だけ取得
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

		// 現在のファイル（MOC）の情報を取得
		const currentFile = view.file;
		if (!currentFile) {
			new Notice("現在のファイルが取得できません");
			return;
		}

		// リンク先のファイルが存在するか確認
		const existingFile = this.app.metadataCache.getFirstLinkpathDest(
			linkName,
			currentFile.path
		);

		if (existingFile) {
			// ファイルが存在する → 開く
			await this.app.workspace.getLeaf(false).openFile(existingFile);
			new Notice(`${existingFile.name} を開きました`);
		} else {
			// ファイルが存在しない → 作成して開く
			await this.createAndOpenFile(linkName, currentFile);
		}
	}

	private async createAndOpenFile(linkName: string, mocFile: TFile) {
		// MOCと同じフォルダにファイルを作成
		const folderPath = mocFile.parent?.path ?? "";
		const newFilePath = normalizePath(
			folderPath ? `${folderPath}/${linkName}.md` : `${linkName}.md`
		);

		// MOCファイル名（拡張子なし）
		const mocName = mocFile.basename;

		// frontmatterを作成
		const content = `---\nup:\n  - "[[${mocName}]]"\n---\n`;

		// ファイルを作成
		const newFile = await this.app.vault.create(newFilePath, content);

		// 作成したファイルを開く
		await this.app.workspace.getLeaf(false).openFile(newFile);
		new Notice(`${linkName}.md を作成しました`);
	}
}
