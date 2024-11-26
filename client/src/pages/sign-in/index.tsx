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
       <form onSubmit={handleSubmit(onsubmit)}>
        <div>
            <label>Username :</label>
            <input type="text"  {...register("username")}/>
            {errors.username && (<p style={{color:"red"}}>{errors.username.message}</p>)}
        </div>
        <div>
            <label>Name :</label>
            <input type="text" {...register("name")}/>
            {errors.name && (<p style={{color:"red"}}>{errors.name.message}</p>)}
        </div>
        <button type="submit"> Sign In </button>
       </form>
    </div>
   )
};