import { StreamVideo } from "@stream-io/video-react-sdk"
import { useUser } from "../../context/user-context";
import { Navigate, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import CryptoJS from "crypto-js";
import "./../../App.css"

interface NewRoom{
    name : string;
    description : string;
}

interface Room{
    id : string,
    title : string,
    description : string,
    participantsLength : number,
    createdBy : string
}

type customData = {
    title? : string;
    description? : string;
}

export const MainPage=() => {
    const {client,user,setCall,isLoadingClient}=useUser();

    const navigate=useNavigate();

    const hashRoomName=(roomName : string) : string => {
        const hash=CryptoJS.SHA256(roomName).toString(CryptoJS.enc.Base64);
        return hash.replace(/[^a-zA-Z0-9_-]/g,"")
    }

    const [newRoom,setNewRoom]=useState<NewRoom>({name : "",description : ""})

    const [availableRooms,setAvailableRooms]=useState<Room[]>([])
     
    useEffect(() => {
        if (client) fetchListOfRooms();
    },[client])

    const createRoom = async () => {
        const { name, description } = newRoom;
    
        //
        if (!client || !user || !name || !description) {
            console.error("Missing required parameters to create room");
            return;
        }
    
        try {

            
            const roomID = hashRoomName(name);
             
            

            const call = client.call("audio_room", roomID);
            

            
            await call.join({
                create: true,
                data: {
                    members: [{ user_id: user.username }],
                    custom: {
                        title: name,
                        description,
                    },
                },
            });
 
            console.log(description);
             
             const mediaStream = await navigator.mediaDevices.getUserMedia({ audio: true, video: false });

             
             await call.publishAudioStream(mediaStream);

            setCall(call);
    
            navigate("/room");
        } catch (error) {
            console.error("Failed to create or join the room:", error);
           
        }
    };

    const fetchListOfRooms=async () => {
        const callsQueryResponse=await client?.queryCalls({
            filter_conditions:{ongoing : true},
            limit : 4,
            watch : true, 
        })

        if (!callsQueryResponse) {
            alert("Error getting Calls")
        }else{

            const getCallInfo=async (call : Call) : Promise<Room> => {
                const callInfo=await call.get();
                const customData=callInfo.call.custom;
                const {title,description} =(customData || {}) as CustomCallData;
                const participantsLength=callInfo.members.length ?? 0;
                const createdBy=callInfo.call.created_by.name ?? "";
                const id=callInfo.call.id ?? "";
                return {
                    id,
                    title : title ?? "",
                    description : description ?? "",
                    participantsLength,
                    createdBy
                }
            }

            const roomPromises=await callsQueryResponse.calls.map((call) => 
            getCallInfo(call)
            )

            const rooms=await Promise.all(roomPromises)
            setAvailableRooms(rooms)
        }
    }

    if(isLoadingClient) return <h1>...</h1>;
     
    if(!isLoadingClient && !user || !isLoadingClient && !client) {
        return <Navigate to="sign-in"/>
    }

    return (
    <StreamVideo client={client!}>
    <div className="home">
        <h1>Welcome, {user?.name}</h1>
        <div className="form">
            <h2>Create Your own Room</h2>
            <input placeholder="Room Name ..." 
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                setNewRoom((prev) => ({ ...prev, name: e.target.value }))
              }/>
            <input placeholder="Room Description ..." 
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                setNewRoom((prev) => ({ ...prev, description: e.target.value }))
              }/>
            <button onClick={createRoom} style={{backgroundColor : "purple", color : "white"}}>Create Room</button>
        </div>
        {availableRooms.length !==0 ? 
        <>
        <h2>Available Rooms</h2> 
        <div className="grid">{availableRooms.map(
            (room) =>
             (<div className="card" key={room.id}>
                <h4>{room.title}</h4>
                <p>{room.description}</p>
                <p>Number Of Participants : {room.participantsLength}</p>
                <p>Created By : {room.createdBy}</p>
                <div className="shine"></div>
             </div>)
            )
            }
             </div>
        </>
        : <h2>No availableRooms at the Moment.. ^ _ ^ </h2>}
    </div>
    </StreamVideo>
    )
};