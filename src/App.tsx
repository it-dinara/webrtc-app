import { useEffect, useState, useRef } from "react";
import "./App.css";

const constraints = {
  video: true,
  audio: true,
};

function App() {
  const [stream, setStream] = useState<null | MediaStream>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const handleVideoStart = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia(constraints);
      setStream(stream);
    } catch (err) {
      console.log("error", err);
    }
  };

  const handleStopTracks = () => {
    stream?.getVideoTracks().forEach((track) => {
      track.stop();
    });
  };

  const handleVideoStop = () => {
    handleStopTracks();
    setStream(null);
  };

  useEffect(() => {
    if (!stream) {
      return;
    }
    const video = videoRef.current;
    if (video) {
      video.srcObject = stream;
      video.load();
    }
    return () => {
      handleStopTracks();
    };
  }, [stream]);

  const onToggleConnection = () => {
    if (stream) {
      handleVideoStop();
    } else {
      handleVideoStart();
    }
  };

  useEffect(() => {
    handleVideoStart();
  }, []);

  return (
    <>
      <video autoPlay playsInline muted ref={videoRef}></video>
      <button
        style={{ display: "block", margin: "10px auto 0" }}
        onClick={onToggleConnection}
      >
        {stream ? "stop camera" : "start camera"}
      </button>
    </>
  );
}

export default App;
