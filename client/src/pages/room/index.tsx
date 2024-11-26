import { useCallStateHooks } from "@stream-io/video-react-sdk";


export const Room=() => {
    const {useParticipants,useCallCustomData,useCallCreatedBy}=useCallStateHooks();

    const custom=useCallCustomData();
    const participants=useParticipants();
    const createdBy=useCallCreatedBy();
    console.log("Custom data:", custom);

    return (
    <div className="room">
      <h2 className="title">{custom?.title || "No Title Available"}</h2>
      <h3 className="description">{custom?.description || "No Description Available"}</h3>
      <p className="participant-count">{participants.length} Participants</p>
    </div>
    );
};