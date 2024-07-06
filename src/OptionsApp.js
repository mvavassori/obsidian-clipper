/* global chrome */
import React, { useState, useEffect } from "react";

const OptionsApp = () => {
  const [vault, setVault] = useState("");
  const [folder, setFolder] = useState("");

  useEffect(() => {
    // Load the settings from browser storage
    chrome.storage.sync.get(["obsidianVault", "folderPath"], (result) => {
      if (result.obsidianVault) {
        setVault(result.obsidianVault);
      }
      if (result.folderPath) {
        setFolder(result.folderPath);
      }
    });
  }, []);

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

    // Save the settings to browser storage
    chrome.storage.sync.set(
      {
        obsidianVault: vault,
        folderPath: folder,
      },
      () => {
        // Optional: Show a success message or perform other actions
        alert(
          `Success!👌\n\nYour notes will be saved to the vault named "${vault}" using the format "${folder}".`
        );
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

    // Generate a test note based on the settings
    const title = "Obsidian Web Clipper Test Note";
    const content = `https://example.com\n\nThis is a test note generated by the Obsidian Web Clipper extension.`;

    // const folderPattern =
    //   /^(([\p{L}\p{Script=Hani}\p{Emoji}\s()\-_!@#$%^&()+={}[\];',~][\p{L}\p{Script=Hani}\p{Emoji}\s().\-_!@#$%^&()+={}[\];',~]*\/)*\{title\})$/u;

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
    )}&content=${encodeURIComponent(content)}`;
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
            <code className="bg-zinc-700 rounded-md px-0.5 text-gray-400">
              Folder Name/{"{title}"}
            </code>{" "}
            . Alternatively, simply use{" "}
            <code className="bg-zinc-700 rounded-md px-0.5 text-gray-400">
              {"{title}"}
            </code>{" "}
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
  );
};

export default OptionsApp;
