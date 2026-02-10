# Obsidian Link to New File

> Japanese documentation is available below. / 日本語ドキュメントは下部にあります。

## What is this?

An Obsidian plugin that creates and opens a new file from a wiki-link at the cursor position. If the linked file already exists, it simply opens it.

When a new file is created, the plugin automatically adds an `up` property in the frontmatter, linking back to the source file (e.g., a MOC file).

## Features

- Place your cursor on or right after a `[[wiki-link]]` and run the command
- If the linked file does not exist, it creates the file in the same folder as the current file
- The created file includes a frontmatter `up` property pointing back to the current file
- If the linked file already exists, it opens the file

## Example

In your MOC file `Index.md`, you write:

```
[[New Note]]
```

Place your cursor on `[[New Note]]` and run the command. A new file `New Note.md` is created in the same folder with:

```yaml
---
up:
  - "[[Index]]"
---
```

## Installation

### Using BRAT (Recommended)

1. Install the [BRAT](https://github.com/TfTHacker/obsidian42-brat) plugin
2. Open BRAT settings
3. Click "Add Beta Plugin"
4. Enter `noki1213/obsidian-link-to-new-file`
5. Click "Add Plugin"

### Manual Installation

1. Download `main.js` and `manifest.json` from the [latest release](https://github.com/noki1213/obsidian-link-to-new-file/releases/latest)
2. Create a folder `obsidian-link-to-new-file` in your vault's `.obsidian/plugins/` directory
3. Place `main.js` and `manifest.json` into the folder
4. Enable the plugin in Obsidian settings under Community Plugins

## Usage

1. Open a file (e.g., a MOC file)
2. Place your cursor on or right after a `[[wiki-link]]`
3. Open the command palette and run "Open or create linked file"
4. You can also assign a hotkey in Settings > Hotkeys

## Behavior

| Situation | Action |
|-----------|--------|
| Linked file does not exist | Creates the file in the same folder with `up` property, then opens it |
| Linked file exists | Opens the file |
| No link at cursor position | Shows a notice |

---

# Obsidian Link to New File（日本語）

## これは何？

カーソル位置のウィキリンクからファイルを作成して開く Obsidian プラグインです。リンク先のファイルが既に存在する場合は、そのファイルを開きます。

新しいファイルを作成するとき、frontmatter に `up` プロパティを自動で追加し、元のファイル（MOC など）へのリンクを設定します。

## 機能

- `[[ウィキリンク]]` の上、または直後にカーソルを置いてコマンドを実行
- リンク先のファイルが存在しない場合、現在のファイルと同じフォルダに新規作成
- 作成されたファイルの frontmatter に、現在のファイルへの `up` プロパティを自動追加
- リンク先のファイルが既に存在する場合は、そのファイルを開く

## 使用例

MOC ファイル `Index.md` に以下のように書きます：

```
[[新しいノート]]
```

`[[新しいノート]]` にカーソルを置いてコマンドを実行すると、同じフォルダに `新しいノート.md` が作成されます：

```yaml
---
up:
  - "[[Index]]"
---
```

## インストール

### BRAT を使う方法（推奨）

1. [BRAT](https://github.com/TfTHacker/obsidian42-brat) プラグインをインストール
2. BRAT の設定を開く
3. Add Beta Plugin をクリック
4. `noki1213/obsidian-link-to-new-file` を入力
5. Add Plugin をクリック

### 手動インストール

1. [最新リリース](https://github.com/noki1213/obsidian-link-to-new-file/releases/latest)から `main.js` と `manifest.json` をダウンロード
2. Vault の `.obsidian/plugins/` ディレクトリに `obsidian-link-to-new-file` フォルダを作成
3. `main.js` と `manifest.json` をそのフォルダに配置
4. Obsidian の設定 → コミュニティプラグインから有効にする

## 使い方

1. ファイル（MOC など）を開く
2. `[[ウィキリンク]]` の上、または直後にカーソルを置く
3. コマンドパレットを開いて「リンク先を開く / 存在しなければ作成して開く」を実行
4. ホットキーを設定する場合は、設定 → ホットキーから設定可能

## 動作一覧

| 状況 | 動き |
|------|------|
| リンク先が存在しない | 同じフォルダにファイルを作成し、`up` プロパティを追加して開く |
| リンク先が存在する | そのファイルを開く |
| カーソル位置にリンクがない | 通知で知らせる |
