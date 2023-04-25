import { type NextPage } from "next";
import Head from "next/head";
import { NotionTokenConfig, NotionPageConfig } from "~/components/notion";
import { OpenAIConfig } from "~/components/openai";
import Uploader from "~/components/upload";
import { useEffect, useState } from "react";
import { ConfigField } from "~/components/layout";

const Home: NextPage = () => {
  const [editingKeys, setEditingKeys] = useState(false);
  const [openAIKey, setOpenAIKey] = useState("");
  const [notionToken, setNotionToken] = useState("");
  const [notionPage, setNotionPage] = useState("");

  useEffect(() => {
    // check localstorage for OpenAI API Key
    const existingOpenAIKey = localStorage.getItem("openai-api-key");
    if (existingOpenAIKey) {
      setOpenAIKey(existingOpenAIKey);
    }
    // and notion token
    const existingNotionToken = localStorage.getItem("notion-token");
    if (existingNotionToken) {
      setNotionToken(existingNotionToken);
    }
    // and notion page id
    const existingPageId = localStorage.getItem("notion-page");
    if (existingPageId) {
      setNotionPage(existingPageId);
    }
  }, []);

  return (
    <>
      <Head>
        <title>Push To Do</title>
        <meta name="description" content="Push To Do" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className="flex min-h-screen flex-col items-center justify-center bg-black">
        <div className="fixed left-0 top-0 z-10 w-full">
          <div className="flex h-full items-center justify-between px-4 py-4">
            <h1 className="p-4 text-2xl font-bold text-white">Push To Do</h1>
            {(openAIKey || notionToken || notionPage) && !editingKeys && (
              <button
                className="rounded-xl bg-white/10 p-4 font-semibold text-white no-underline transition hover:bg-white/20"
                onClick={() => setEditingKeys(true)}
              >
                Edit Config
              </button>
            )}
          </div>
        </div>
        <div className="container flex flex-col items-center justify-center gap-12 px-4 py-16 ">
          <div className="grid grid-cols-1 gap-4 md:gap-8">
            {editingKeys ? (
              <div className="flex flex-col items-center gap-6">
                {openAIKey && (
                  <ConfigField
                    label="OpenAI API Key"
                    value={openAIKey}
                    onDelete={() => {
                      localStorage.removeItem("openai-api-key");
                      setOpenAIKey("");
                      if (!notionPage && !notionToken) {
                        setEditingKeys(false);
                      }
                    }}
                  />
                )}
                {notionToken && (
                  <ConfigField
                    label="Notion Token"
                    value={notionToken}
                    onDelete={() => {
                      localStorage.removeItem("notion-token");
                      setNotionToken("");
                      if (!notionPage && !openAIKey) {
                        setEditingKeys(false);
                      }
                    }}
                  />
                )}
                {notionPage && (
                  <ConfigField
                    label="Notion Page"
                    value={notionPage}
                    onDelete={() => {
                      localStorage.removeItem("notion-page");
                      setNotionPage("");
                      if (!notionToken && !openAIKey) {
                        setEditingKeys(false);
                      }
                    }}
                  />
                )}
                <button
                  className="rounded-full bg-white/10 px-10 py-3 font-semibold text-white no-underline transition hover:bg-white/20"
                  onClick={() => setEditingKeys(false)}
                >
                  Done
                </button>
              </div>
            ) : !openAIKey ? (
              <OpenAIConfig
                onSubmit={(key: string) => {
                  setOpenAIKey(key);
                }}
              />
            ) : !notionToken ? (
              <NotionTokenConfig
                onSubmit={(token: string) => {
                  setNotionToken(token);
                }}
              />
            ) : !notionPage ? (
              <NotionPageConfig
                onSubmit={(id: string) => {
                  setNotionPage(id);
                }}
              />
            ) : (
              <Uploader
                openAIKey={openAIKey}
                notionToken={notionToken}
                notionPage={notionPage}
              />
            )}
          </div>
        </div>
      </main>
    </>
  );
};

export default Home;
