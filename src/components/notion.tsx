import React, { useState } from "react";

type NotionTokenConfigProps = {
  onSubmit: (key: string) => void;
};

export const NotionTokenConfig = ({ onSubmit }: NotionTokenConfigProps) => {
  const [notionToken, setNotionToken] = useState("");
  const [error, setError] = useState("");

  const handleTokenChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;
    setNotionToken(value);
    // token length 50 and first 7 characters are secret_
    if (value.length === 50 && value.slice(0, 7) === "secret_") {
      onSubmit(value);
      localStorage.setItem("notion-token", value);
    } else {
      setError("Invalid Notion API Key");
    }
  };

  return (
    <div className="flex flex-col items-center justify-center gap-12 px-4 py-16 ">
      <div className="flex flex-col items-center gap-4">
        <h1 className="text-4xl font-bold text-white">Notion Token</h1>
        <p className="max-w-sm text-center text-xl text-white">
          You can create an integration to get one{" "}
          <a
            href="https://www.notion.so/my-integrations"
            target="_blank"
            className="font-semibold underline"
          >
            here
          </a>
        </p>
      </div>
      <div className="flex flex-col items-center gap-4">
        <input
          className="rounded-full bg-white/10 px-10 py-3 font-semibold text-white no-underline transition hover:bg-white/20"
          type="text"
          value={notionToken}
          onChange={handleTokenChange}
        />
        {error && <p className="text-red-500">{error}</p>}
      </div>
    </div>
  );
};

type NotionPageConfigProps = {
  onSubmit: (key: string) => void;
};

export const NotionPageConfig = ({ onSubmit }: NotionPageConfigProps) => {
  const [pageId, setPageId] = useState("");
  const [error, setError] = useState("");

  const addDashesToPageID = (original: string) => {
    return original.replace(
      /(\w{8})(\w{4})(\w{4})(\w{4})(\w{12})/,
      "$1-$2-$3-$4-$5"
    );
  };

  const handlePageIdChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;
    setPageId(value);
    // token length 36 and four dashes
    if (value.length === 36 && value.split("-").length === 5) {
      onSubmit(value);
      localStorage.setItem("notion-page", value);
      // token length 32 without dashes
    } else if (value.length === 32) {
      const fixed = addDashesToPageID(value);
      onSubmit(fixed);
      localStorage.setItem("notion-page", fixed);
      // url
    } else {
      // check for url
      try {
        const url = new URL(value);
        const parsed = url.pathname.split("-").pop();
        if (parsed && parsed.length === 32) {
          const fixed = addDashesToPageID(parsed);
          onSubmit(fixed);
          localStorage.setItem("notion-page", fixed);
        } else {
          setError("Invalid Notion Page ID");
        }
      } catch (_) {
        setError("Invalid Notion Page ID");
      }
    }
  };

  return (
    <div className="flex flex-col items-center justify-center gap-12 px-4 py-16 ">
      <div className="flex flex-col items-center gap-4">
        <h1 className="text-4xl font-bold text-white">Notion Page ID</h1>
        <p className="max-w-sm text-center text-xl text-white">
          Paste the ID or URL of your{" "}
          <a
            href="https://notion.so"
            target="_blank"
            className="font-semibold underline"
          >
            Notion
          </a>{" "}
          To-do page
          <br />
          <br />
          <a className="text-lg">
            you also need to permission your integration as a Connection in page
            settings (...)
          </a>
        </p>
      </div>
      <div className="flex flex-col items-center gap-4">
        <input
          className="rounded-full bg-white/10 px-10 py-3 font-semibold text-white no-underline transition hover:bg-white/20"
          type="text"
          value={pageId}
          onChange={handlePageIdChange}
        />
        {error && <p className="text-red-500">{error}</p>}
      </div>
    </div>
  );
};
