import React, { useState } from "react";

type OpenAIConfigProps = {
  onSubmit: (key: string) => void;
};

export const OpenAIConfig = ({ onSubmit }: OpenAIConfigProps) => {
  const [openAIKey, setOpenAIKey] = useState("");
  const [error, setError] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;
    setOpenAIKey(value);
    // token length 51 and first 3 characters are sk-
    if (value.length === 51 && value.slice(0, 3) === "sk-") {
      onSubmit(value);
      localStorage.setItem("openai-api-key", value);
    } else {
      setError("Invalid OpenAI API Key");
    }
  };

  return (
    <div className="flex flex-col items-center justify-center gap-12 px-4 py-16 ">
      <div className="flex flex-col items-center gap-4">
        <h1 className="text-4xl font-bold text-white">OpenAI API Key</h1>
        <p className="text-lg text-white">
          You can find yours{" "}
          <a
            href="https://platform.openai.com/account/api-keys"
            target="_blank"
          >
            here
          </a>
        </p>
      </div>
      <div className="flex flex-col items-center gap-4">
        <input
          className="rounded-full bg-white/10 px-10 py-3 font-semibold text-white no-underline transition hover:bg-white/20"
          type="text"
          value={openAIKey}
          onChange={handleChange}
        />
        {error && <p className="text-red-500">{error}</p>}
      </div>
    </div>
  );
};

export const transcribeAudio = async (apiKey: string, file: Blob) => {
  console.log(file.type);
  const formData = new FormData();
  formData.append("file", file, "audio.mp4");
  formData.append("model", "whisper-1");

  try {
    const response = await fetch(
      "https://api.openai.com/v1/audio/transcriptions",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${apiKey}`,
        },
        body: formData,
      }
    );

    const json = (await response.json()) as { error: string; text: string };
    return json.text;
  } catch (error) {
    console.error("OpenAI Transcription Error", error);
  }
};
