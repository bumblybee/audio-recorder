const recordBtn = document.getElementById("record-btn");
const stopRecordBtn = document.getElementById("stop-record-btn");
const soundClips = document.getElementById("sound-clips");
const recordingText = document.getElementById("recording-text");
let rec;

if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
  console.log("getUserMedia supported");

  navigator.mediaDevices
    .getUserMedia({ audio: true, video: false })
    .then((stream) => {
      audioChunks = [];
      handleRecord(stream);

      recordBtn.addEventListener("click", () => {
        recordBtn.classList.add("clicked");
        recordBtn.style.backgroundColor = "#cc6969";
        recordBtn.disabled = true;
        recordingText.textContent = "Recording";
        stopRecordBtn.classList.remove("clicked");
        stopRecordBtn.style.backgroundColor = "#485fe4";
        rec.start();

        console.log(rec.state);
      });

      stopRecordBtn.addEventListener("click", () => {
        recordBtn.classList.remove("clicked");
        recordBtn.style.backgroundColor = "#ec1313";
        recordBtn.disabled = false;
        stopRecordBtn.style.backgroundColor = "#7092dd";
        stopRecordBtn.classList.add("clicked");
        recordingText.textContent = "";
        rec.stop();
        console.log(rec.state);
      });
    })
    .catch((err) => console.log(err));
}

const handleRecord = (stream) => {
  rec = new MediaRecorder(stream);

  rec.ondataavailable = (e) => {
    audioChunks.push(e.data);

    if (rec.state === "inactive") {
      const blob = new Blob(audioChunks, { type: "audio/mpeg-3" });
      createClips(blob);

      //   send data
    }
  };
};

//TODO: Break up
const createClips = (blob) => {
  const clipContainer = document.createElement("li");
  const buttonContainer = document.createElement("div");
  const clipLabel = document.createElement("p");
  const deleteBtn = document.createElement("button");
  const saveBtn = document.createElement("button");
  const player = document.createElement("audio");
  const clipName = prompt("Name your audio file");

  buttonContainer.style.display = "flex";
  clipContainer.classList.add("clip");
  player.setAttribute("controls", "");
  deleteBtn.innerHTML = "delete";
  saveBtn.innerHTML = "save";
  const label = `${clipName}.mp3`;
  clipLabel.innerHTML = label.replace(/ /g, "");

  clipContainer.appendChild(clipLabel);
  clipContainer.appendChild(player);

  soundClips.appendChild(clipContainer);
  clipContainer.appendChild(buttonContainer);
  buttonContainer.appendChild(deleteBtn);
  buttonContainer.appendChild(saveBtn);
  player.src = window.URL.createObjectURL(blob);

  deleteBtn.addEventListener("click", (e) => {
    clipContainer.remove();
  });
};

//send data function
