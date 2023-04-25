import React, { useState } from "react";
import AudioRecorder from "./audio";
import { transcribeAudio } from "./openai";

import { api } from "~/utils/api";

type UploaderProps = {
  openAIKey: string;
  notionToken: string;
  notionPage: string;
};

const Uploader = ({ openAIKey, notionToken, notionPage }: UploaderProps) => {
  const [transcription, setTranscription] = useState("");
  const [uploaded, setUploaded] = useState(false);
  const [error, setError] = useState("");
  const push = api.push.useMutation();

  const handleAudioRecorded = (audio: Blob) => {
    transcribeAudio(openAIKey, audio)
      .then((text) => {
        if (text) {
          setTranscription(text);
          push
            .mutateAsync({
              token: notionToken,
              page: notionPage,
              text,
            })
            .then(() => {
              setUploaded(true);
            })
            .catch((err) => {
              console.error("Failed to push audio", err);
              setError("Error uploading to Notion");
            });
        }
      })
      .catch((err) => {
        console.error("Failed to push audio", err);
        setError("Failed to get OpenAI transcription");
      });
  };

  return (
    <div>
      {transcription ? (
        <div className="flex max-w-sm flex-col items-center gap-4 p-4">
          <p className="text-center text-white">{transcription}</p>
          {error ? (
            <p className="text-red text-center font-semibold">{error}</p>
          ) : uploaded ? (
            <p className="text-center font-semibold text-white">
              Added to Notion!
            </p>
          ) : (
            <div className="loading-animation">
              <div />
              <div />
              <div />
              <div />
            </div>
          )}
          <button
            className="flex max-w-xs flex-col gap-4 rounded-xl bg-white/10 p-4 text-white hover:bg-white/20"
            onClick={() => {
              setTranscription("");
              setUploaded(false);
              setError("");
            }}
          >
            <p className="text-xl font-semibold">Dismiss</p>
          </button>
        </div>
      ) : (
        <AudioRecorder onAudioRecorded={handleAudioRecorded} />
      )}
    </div>
  );
};

export default Uploader;
