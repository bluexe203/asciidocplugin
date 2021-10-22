# asciidocplugin

VSCode用のAsciidocプレビュー用のプラグインです。

オフラインでasciidocとmermaidの図表の描画を行います。

以下のバージョンのライブラリを利用しています。

[asciidoctor.js : 2.2.5](https://github.com/asciidoctor/asciidoctor.js/)

[mermaid : 8.13.3](https://github.com/mermaid-js/mermaid)

# 使い方

[asciidocplugin-0.0.2.vsix](https://github.com/bluexe203/asciidocplugin/releases/download/ver0.0.2/asciidocplugin-0.0.2.vsix)をインストールしてください。

asciidocのファイル(*.adoc)を開いて右上のPreview AsciiDocを押下するとプレビューが表示されます。

プレビュー画面はadocの変更の度に再レンダリングされます。

![](https://user-images.githubusercontent.com/87966746/138047517-e4614222-46b2-441d-9013-12af3fdbdc3f.png)

# mermaidの構文

以下の用に記載します。(korokiのmermaid用の構文と同じです。ブロックは"...."or"----")

```
[mermaid]
....
sequenceDiagram
	クライアント-->>サーバ:要求;
    サーバ-->>クライアント:応答;
....
```

