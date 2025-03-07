import { Plugin, MarkdownView, FileView, Modal, Setting, App } from "obsidian";

class UrlInputModal extends Modal {
  constructor(app: App, onSubmit: (url: string) => void) {
    super(app);
    this.setTitle('Enter Background Image URL');
    let url = '';

    new Setting(this.contentEl)
      .setName('URL')
      .addText((text) =>
        text.onChange((value) => {
          url = value;
        }));

    new Setting(this.contentEl)
      .addButton((btn) =>
        btn
          .setButtonText('Submit')
          .setCta()
          .onClick(() => {
            this.close();
            onSubmit(url);
          }));
  }

  onClose() {
    this.contentEl.empty();
  }
}

export default class PageBackgroundCustomizer extends Plugin {
  getNoteContainer(): HTMLElement | null {
    let root = this.app.workspace.getActiveViewOfType(
      MarkdownView
    );
    if (!root) root = this.app.workspace.getActiveViewOfType(FileView) as any;
    return root ? root.containerEl.querySelector(".view-content") : null;
  }

  getBackgroundUrl(): string | undefined {
    const file = this.app.workspace.getActiveFile();
    if (file) {
      const metadata = this.app.metadataCache.getFileCache(file);
      return metadata?.frontmatter?.["page_background"];
    }
    return undefined;
  }

  applyBackgroundStyle() {
    const container = this.getNoteContainer();
    console.log("Applying background style to", container)
    const bgUrl = this.getBackgroundUrl();
    if (container && bgUrl) {
      container.style.backgroundImage = `url('${bgUrl}')`;
      container.style.backgroundSize = "cover";
    }
  }

  async onload() {
    console.log("Page Background Customizer loaded");
    
    this.addCommand({
      id: "set-page-background-image",
      name: "Set Page Background Image",
      callback: () => {
        new UrlInputModal(this.app, async (url) => {
          const file = this.app.workspace.getActiveFile();
          if (file) {
            await this.app.fileManager.processFrontMatter(file, (frontmatter) => {
              frontmatter["page_background"] = url;
            });
          }
        }).open();
      },
    });

    this.registerEvent(
      this.app.metadataCache.on("changed", (file) => {
        const activeFile = this.app.workspace.getActiveFile();
        if (activeFile && file.path === activeFile.path) {
          this.applyBackgroundStyle();
        }
      })
    );

    this.registerEvent(
      this.app.workspace.on("active-leaf-change", (_leaf) => {
        const activeFile = this.app.workspace.getActiveFile();
        if (activeFile) {
          this.applyBackgroundStyle();
        }
      })
    );

    this.applyBackgroundStyle();
  }

  onunload() {
    console.log("Page Background Customizer unloaded");
  }
}
