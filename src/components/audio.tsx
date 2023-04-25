import React, { useState, useRef } from "react";

type AudioRecorderProps = {
  onAudioRecorded: (audio: Blob) => void;
};

const AudioRecorder = ({ onAudioRecorded }: AudioRecorderProps) => {
  const [isRecording, setIsRecording] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [recordedAudio, setRecordedAudio] = useState<Blob | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);

  function handleStartRecording() {
    try {
      navigator.mediaDevices
        .getUserMedia({ audio: true })
        .then((stream) => {
          const mimeType = MediaRecorder.isTypeSupported("audio/webm")
            ? "audio/webm"
            : "video/mp4";
          mediaRecorderRef.current = new MediaRecorder(stream, { mimeType });
          setIsRecording(true);
          mediaRecorderRef.current.addEventListener(
            "dataavailable",
            handleDataAvailable
          );
          mediaRecorderRef.current.start();
        })
        .catch((err) => {
          console.error("Failed to get user media", err);
        });
    } catch (err) {
      console.error("Failed to start recording", err);
    }
  }

  const handleStopRecording = () => {
    setIsLoading(true);
    setIsRecording(false);
    mediaRecorderRef.current?.stop();
  };

  function handleDataAvailable({ data }: BlobEvent) {
    // setRecordedAudio(
    //   new Blob([data], { type: mediaRecorderRef.current?.mimeType })
    // );
    onAudioRecorded(
      new Blob([data], { type: mediaRecorderRef.current?.mimeType })
    );
    mediaRecorderRef.current = null;
  }

  return (
    <div className="flex max-w-xs flex-col items-center gap-4 p-4 text-white">
      {isLoading ? (
        <div className="flex flex-col gap-4">
          <div className="loading-animation">
            <div />
            <div />
            <div />
            <div />
          </div>
          {recordedAudio && (
            <audio src={URL.createObjectURL(recordedAudio)} controls />
          )}
        </div>
      ) : isRecording ? (
        <div className="flex flex-col items-center gap-4">
          <div className="recording-animation" />
          <button
            className="flex max-w-xs flex-col gap-4 rounded-xl bg-white/10 p-4 font-semibold text-white hover:bg-white/20"
            onClick={handleStopRecording}
          >
            Push
          </button>
        </div>
      ) : (
        <button
          className="flex max-w-xs flex-col gap-4 rounded-xl bg-white/10 p-4 font-semibold text-white hover:bg-white/20"
          onClick={handleStartRecording}
        >
          Record
        </button>
      )}
    </div>
  );
};

export default AudioRecorder;
