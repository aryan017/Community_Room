import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import {useForm,SubmitHandler} from "react-hook-form";
import { PEOPLES_IMAGES } from "../../image";
import Cookies from "universal-cookie";
import { StreamVideoClient, User } from "@stream-io/video-react-sdk";
import { useUser } from "../../context/user-context";
import { useNavigate } from "react-router-dom";
import "./../../App.css"

interface FormValues{
    username : string;
    name: string;
}


export const SignIn=() => {
    const {setClient,setUser}=useUser();
    const cookies=new Cookies();
    const navigate=useNavigate();

    const schema=yup.object().shape({
        username : yup.string().matches(/^[a-zA-Z0-9_.@$]+$/,"Invalid User").required("Username is Required"),
        name: yup.string().required("Name is Required")
    })


    const {register,handleSubmit,formState:{errors}} = useForm<FormValues>({resolver:yupResolver(schema)});

    const onsubmit : SubmitHandler<FormValues>= async (data,event) => {
        event?.preventDefault();
        const {username,name}=data;
        const response= await fetch("http://localhost:3002/auth/createUser",{
            method : "POST",
            headers : {
                "content-type" : "application/json",
            },
            body : JSON.stringify({
                username, 
                name,
                image : PEOPLES_IMAGES[Math.floor(Math.random()*PEOPLES_IMAGES.length)]
            }) 
        })

        if(!response.ok){
            alert("Something went Wrong");
            return ;
        }

        const responseData=await response.json();

        console.log(responseData);

        const user : User={
            id : username,
            name
        }

        const myclient=new StreamVideoClient({
            apiKey : "q7gsrrvhj5nz",
            user,
            token : responseData.token,
        });

        

        const expires=new Date();
        expires.setDate(expires.getDate()+1);
        cookies.set("token",responseData.token,{expires});
        cookies.set("username",responseData.username,{expires});
        cookies.set("name",responseData.name,{expires});

        setClient(myclient)
        setUser({username,name});

        navigate("/")
    

    }

   return (
    <div className="sign-in">
        <h1>Welcome to Community Room</h1>
        <form 
  onSubmit={handleSubmit(onsubmit)} 
  style={{
    maxWidth: "400px",
    margin: "50px auto",
    padding: "20px",
    borderRadius: "10px",
    background: "linear-gradient(135deg, #1e1e2f 40%, #28293d)",
    boxShadow: "0 4px 10px rgba(0, 0, 0, 0.3)",
    fontFamily: "'Inter', sans-serif",
    color: "#f5f5f5"
  }}
>
  <div style={{ marginBottom: "20px" }}>
    <label 
      style={{
        display: "block",
        marginBottom: "8px",
        fontWeight: "600",
        fontSize: "1rem",
        color: "#a0a0ff"
      }}
    >
      Username:
    </label>
    <input
      type="text"
      {...register("username")}
      style={{
        width: "100%",
        padding: "10px",
        borderRadius: "5px",
        border: "1px solid #646cff",
        background: "#23253c",
        color: "#f5f5f5",
        fontSize: "1rem",
        outline: "none",
        transition: "border 0.3s ease"
      }}
      onFocus={(e) => ((e.target as HTMLButtonElement).style.border = "1px solid #535bf2")}
      onBlur={(e) => ((e.target as HTMLButtonElement).style.border = "1px solid #646cff")}
    />
    {errors.username && (
      <p style={{ color: "#ff6b6b", fontSize: "0.9rem", marginTop: "8px" }}>
        {errors.username.message}
      </p>
    )}
  </div>
  
  <div style={{ marginBottom: "20px" }}>
    <label 
      style={{
        display: "block",
        marginBottom: "8px",
        fontWeight: "600",
        fontSize: "1rem",
        color: "#a0a0ff"
      }}
    >
      Name:
    </label>
    <input
      type="text"
      {...register("name")}
      style={{
        width: "100%",
        padding: "10px",
        borderRadius: "5px",
        border: "1px solid #646cff",
        background: "#23253c",
        color: "#f5f5f5",
        fontSize: "1rem",
        outline: "none",
        transition: "border 0.3s ease"
      }}
      onFocus={(e) => ((e.target as HTMLButtonElement).style.border = "1px solid #535bf2")}
      onBlur={(e) => ((e.target as HTMLButtonElement).style.border = "1px solid #646cff")}
    />
    {errors.name && (
      <p style={{ color: "#ff6b6b", fontSize: "0.9rem", marginTop: "8px" }}>
        {errors.name.message}
      </p>
    )}
  </div>
  
  <button
    type="submit"
    style={{
      width: "100%",
      padding: "12px",
      borderRadius: "8px",
      border: "none",
      background: "linear-gradient(90deg, #646cff, #535bf2)",
      color: "#ffffff",
      fontWeight: "600",
      fontSize: "1rem",
      cursor: "pointer",
      boxShadow: "0 4px 6px rgba(0, 0, 0, 0.3)",
      transition: "all 0.3s ease"
    }}
    onMouseOver={(e) => ((e.target as HTMLButtonElement).style.transform = "scale(1.05)")}
    onMouseOut={(e) => ((e.target as HTMLButtonElement).style.transform = "scale(1)")}
  >
    Sign In
  </button>
</form>
    </div>
   )
};