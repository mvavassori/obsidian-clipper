/* global chrome */
import React, { useState, useEffect } from "react";

const OptionsApp = () => {
  const [vault, setVault] = useState("");
  const [folder, setFolder] = useState("");
  const [showAdvancedFeatures, setShowAdvancedFeatures] = useState(false);
  const [noteContentFormat, setNoteContentFormat] = useState("");

  const defaultNoteContentFormat = "{url}\n\n{content}";

  useEffect(() => {
    // Load the settings from browser storage
    chrome.storage.sync.get(
      [
        "obsidianVault",
        "folderPath",
        "showAdvancedFeatures",
        "noteContentFormat",
      ],
      (result) => {
        if (result.obsidianVault) {
          setVault(result.obsidianVault);
        }
        if (result.folderPath) {
          setFolder(result.folderPath);
        }
        if (result.showAdvancedFeatures) {
          setShowAdvancedFeatures(result.showAdvancedFeatures);
        }
        if (result.noteContentFormat) {
          setNoteContentFormat(result.noteContentFormat);
        } else {
          // Set default note format if not found in storage
          setNoteContentFormat(defaultNoteContentFormat);
        }
      }
    );
  }, []);

  useEffect(() => {
    if (!showAdvancedFeatures) {
      setNoteContentFormat(defaultNoteContentFormat);
    }
  }, [showAdvancedFeatures]);

  const handleSave = () => {
    // Check if the required fields are empty
    if (vault.trim() === "" || folder.trim() === "") {
      alert(
        "Please provide a value for both Obsidian Vault Name and Clip Notes to fields."
      );
      return;
    }

    const invalidCharacterPattern = /[\\:*?"<>|]/;

    if (
      invalidCharacterPattern.test(vault) ||
      invalidCharacterPattern.test(folder)
    ) {
      alert(
        'Invalid character detected. Please avoid using the following characters in the Vault Name or Folder Path: /, \\, :, *, ?, ", <, >, |'
      );
      return;
    }

    // Check if the folder path matches the pattern
    // const folderPattern = /^(\{title\}|[\w\s]+\/\{title\})$/;
    // const folderPattern = /^([\w\s().]+\/)*\{title\}$/;
    // const folderPattern = /^([\p{L}\p{Script=Hani}\s().]+\/)*\{title\}$/u;
    // const folderPattern = /^([\p{L}\p{Script=Hani}\s().\-_!@#$%^&()+={}[\];',~]+\/)*\{title\}$/u;
    // const folderPattern = /^(([\p{L}\p{Script=Hani}\s()\-_!@#$%^&()+={}[\];',~][\p{L}\p{Script=Hani}\s().\-_!@#$%^&()+={}[\];',~]*\/)*\{title\})$/u;
    // const folderPattern = /^(([\p{L}\p{Script=Hani}\p{Emoji}\s()\-_!@#$%^&()+={}[\];',~][\p{L}\p{Script=Hani}\p{Emoji}\s().\-_!@#$%^&(`+={}[\];',~]*\/)*\{title\})$/u;
    const folderPattern =
      /^(([\p{L}\p{N}\p{Emoji}\p{Emoji_Component}\s()\-_!@#$%^&()+={}[\];',~][\p{L}\p{N}\p{Emoji}\p{Emoji_Component}\s().\-_!@#$%^&()+={}[\];',~]*\/)*\{title\})$/u;

    if (!folderPattern.test(folder.trim())) {
      alert(
        "Invalid folder format. Please use '{title}' or 'Folder Name/{title}' as the folder path."
      );
      return;
    }

    // if the user has enabled advanced features and the noteContentFormat is empty, send an alert and reset it to the default format
    if (showAdvancedFeatures && noteContentFormat === "") {
      alert(
        "If you want to use advanced features, please provide a note content format."
      );
      setNoteContentFormat(defaultNoteContentFormat);
      return;
    }

    // Determine the noteContentFormat to save
    const savedNoteContentFormat = showAdvancedFeatures
      ? noteContentFormat
      : defaultNoteContentFormat;

    // Save the settings to browser storage
    chrome.storage.sync.set(
      {
        obsidianVault: vault,
        folderPath: folder,
        showAdvancedFeatures: showAdvancedFeatures,
        noteContentFormat: savedNoteContentFormat,
      },
      () => {
        if (chrome.runtime.lastError) {
          console.error(`Error: ${chrome.runtime.lastError}`);
        } else {
          alert(
            `Success!👌\n\nYour notes will be saved to the vault named "${vault}" using the format "${folder}".`
          );
        }
      }
    );
  };

  const handleTest = () => {
    // Check if the required fields are empty
    if (vault.trim() === "" || folder.trim() === "") {
      alert(
        "Please provide a value for both Obsidian Vault Name and Clip Notes to fields."
      );
      return;
    }
    const invalidCharacterPattern = /[\\:*?"<>|]/;

    if (
      invalidCharacterPattern.test(vault) ||
      invalidCharacterPattern.test(folder)
    ) {
      alert(
        'Invalid character detected. Please avoid using the following characters in the Vault Name or Folder Path: /, \\, :, *, ?, ", <, >, |'
      );
      return;
    }

    // if the user has enabled advanced features and the noteContentFormat is empty, set it to the default format
    if (showAdvancedFeatures && noteContentFormat === "") {
      alert(
        "If you want to use advanced features, please provide a note content format."
      );
      setNoteContentFormat(defaultNoteContentFormat);
      return;
    }

    // Generate a test note based on the settings
    const title = "Obsidian Web Clipper Test Note";
    const url = "https://example.com";
    const content =
      "This is a test note generated by the Obsidian Web Clipper extension.";
    const date = new Date().toISOString().split("T")[0]; // Get current date in YYYY-MM-DD format

    let formattedContent;
    if (showAdvancedFeatures && noteContentFormat) {
      formattedContent = noteContentFormat
        .replace("{url}", url)
        .replace("{title}", title)
        .replace("{content}", content)
        .replace("{date}", date);
    } else {
      formattedContent = `${url}\n\n${content}`;
    }

    const folderPattern =
      /^(([\p{L}\p{N}\p{Emoji}\p{Emoji_Component}\s()\-_!@#$%^&()+={}[\];',~][\p{L}\p{N}\p{Emoji}\p{Emoji_Component}\s().\-_!@#$%^&()+={}[\];',~]*\/)*\{title\})$/u;

    if (!folderPattern.test(folder.trim())) {
      alert(
        "Invalid folder format. Please use '{title}' or 'Folder Name/{title}' as the folder path."
      );
      return;
    }

    let folderPath = folder.trim().replace("{title}", "");
    if (folderPath && !folderPath.endsWith("/")) {
      folderPath += "/";
    }

    const obsidianUri = `obsidian://new?vault=${encodeURIComponent(
      vault
    )}&file=${encodeURIComponent(
      folderPath + title
    )}&content=${encodeURIComponent(formattedContent)}`;
    // Check if vault is not empty before opening the URI
    if (vault.trim() !== "") {
      window.open(obsidianUri, "_blank");
    } else {
      alert("Please provide a valid Obsidian Vault Name.");
    }
  };

  return (
    <div className="bg-zinc-800 px-32 py-8 min-h-screen">
      <h1 className="text-6xl font-bold text-white">Obsidian Web Clipper</h1>
      <p className="text-gray-400 mt-8 text-xl">
        This is an unofficial web clipper for Obsidian that allows you to easily
        create notes within a popup and save them directly to your Obsidian
        vault. By default, the extension designates the webpage title as your
        note title, and saves the webpage link at the top of your note's
        content.
        <br />
        <br />
        This extension is free, open-source, and available on{" "}
        <a
          href="https://github.com/mvavassori/obsidian-web-clipper"
          target="_blank"
          rel="noopener noreferrer"
          className="text-indigo-500 hover:underline"
        >
          GitHub
        </a>
        . If you find this tool helpful and wish to support its development,
        you're welcome to make a donation through{" "}
        <a
          href="https://www.paypal.com/donate/?hosted_button_id=M8RTMTXKV46EC"
          target="_blank"
          rel="noopener noreferrer"
          className="text-indigo-500 hover:underline"
        >
          PayPal
        </a>
        .
      </p>
      <p className="mt-8 text-white text-3xl font-bold">Extension Options</p>
      <div className="my-8">
        <label className="text-white text-lg">
          Obsidian Vault Name{" "}
          <span className="text-gray-500 text-base">
            ( Enter the name of the Obsidian vault where you wish to save your
            clippings... )
          </span>
        </label>
        <input
          required
          className="w-full px-4 py-2 mt-2 rounded-md bg-zinc-700 text-white text-lg"
          type="text"
          placeholder="Obsidian Vault"
          value={vault}
          onChange={(e) => setVault(e.target.value)}
        />
      </div>
      <div className="my-8">
        <label className="text-white text-lg">
          Clip Notes to{" "}
          <span className="text-gray-500 text-base">
            ( Define the location for storing your notes by specifying the
            folder path using the format{" "}
            <span className="bg-zinc-700 rounded-md px-0.5 text-gray-400">
              Folder Name/{"{title}"}
            </span>{" "}
            . Alternatively, simply use{" "}
            <span className="bg-zinc-700 rounded-md px-0.5 text-gray-400">
              {"{title}"}
            </span>{" "}
            to save your notes directly with the same title as you input in the
            extension popup. )
          </span>
        </label>
        <input
          required
          className="w-full px-4 py-2 mt-2 rounded-md bg-zinc-700 text-white text-lg"
          type="text"
          placeholder="Browser Clippings/{title}"
          value={folder}
          onChange={(e) => setFolder(e.target.value)}
        />
      </div>
      <div className="mt-8">
        <label className="flex items-center text-white text-lg">
          <input
            type="checkbox"
            className="mr-2"
            checked={showAdvancedFeatures}
            onChange={(e) => setShowAdvancedFeatures(e.target.checked)}
          />
          Enable Advanced Note Content Formatting
        </label>
      </div>
      {showAdvancedFeatures && (
        <div className="my-4">
          <div className="text-gray-500 text-base">
            The available properties are{" "}
            <span className="bg-zinc-700 text-gray-400 px-0-5 rounded-md">
              {"{title}"}
            </span>
            ,{" "}
            <span className="bg-zinc-700 text-gray-400 px-0-5 rounded-md">
              {"{url}"}
            </span>
            ,{" "}
            <span className="bg-zinc-700 text-gray-400 px-0-5 rounded-md">
              {"{date}"}
            </span>
            , and{" "}
            <span className="bg-zinc-700 text-gray-400 px-0-5 rounded-md">
              {"{content}"}
            </span>
            . You can use any combination of these properties in your note
            content format.
          </div>

          <div
            className="flex mt-2 text-gray-500 text-base"
            style={{ gap: "16px" }}
          >
            <div className="w-1/2 rounded-md">
              <p className="text-gray-400">Example with default format:</p>
              <div className="border-2 border-zinc-700 rounded-md p-2">
                <pre className="whitespace-pre-wrap rounded-md">
                  {`{url}

{date}

{content}`}
                </pre>
              </div>
            </div>
            <div className="w-1/2 rounded-md">
              <p className="text-gray-400">Example with frontmatter format:</p>
              <div className="border-2 border-zinc-700 rounded-md p-2">
                <pre className="whitespace-pre-wrap">
                  {`---
url: {url}
date: {date}
---
{content}`}
                </pre>
              </div>
            </div>
          </div>

          <textarea
            className="w-full px-4 py-2 mt-8 rounded-md bg-zinc-700 text-white text-lg"
            rows="5"
            value={noteContentFormat}
            onChange={(e) => setNoteContentFormat(e.target.value)}
          />
        </div>
      )}
      <div className="flex mt-8">
        <button
          className="px-4 py-2 bg-indigo-500 hover:bg-indigo-600 active:bg-indigo-700 text-white rounded-md text-lg font-bold"
          type="button"
          onClick={handleTest}
        >
          Test Settings
        </button>
        <button
          className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 text-white rounded-md text-lg font-bold ml-4"
          type="button"
          onClick={handleSave}
        >
          Save Settings
        </button>
      </div>
    </div>
  );
};

export default OptionsApp;
