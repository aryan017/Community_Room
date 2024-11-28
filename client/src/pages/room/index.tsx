import { OwnCapability, useCallStateHooks, useRequestPermission } from "@stream-io/video-react-sdk";
import {Controls} from "./controls";

export const Room=() => {
    const {useParticipants,useCallCustomData,useCallCreatedBy}=useCallStateHooks();

    const {hasPermission,requestPermission} =useRequestPermission(OwnCapability.SEND_AUDIO);

    const custom=useCallCustomData();
    const participants=useParticipants();
    const createdBy=useCallCreatedBy();
    console.log("Custom data:", custom);

    return (
    <div className="room">
      <h2 className="title">{custom?.title || "No Title Available"}</h2>
      <h3 className="description">{custom?.description || "No Description Available"}</h3>
      <p className="participant-count">{participants.length} Participants</p>
      {hasPermission  ? <Controls/> : <button onClick={requestPermission}>&#9995;</button>}
    </div>
    );
};