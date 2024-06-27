import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import {useForm,SubmitHandler} from "react-hook-form";

interface FormValues{
    username : string;
    name: string;
}


export const SignIn=() => {


    const schema=yup.object().shape({
        username : yup.string().matches(/^[a-zA-Z0-9_.@$]+$/,"Invalid User").required("Username is Required"),
        name: yup.string().required("Name is Required")
    })


    const {register,handleSubmit,formState:{errors}} = useForm<FormValues>({resolver:yupResolver(schema)});

    const onsubmit : SubmitHandler<FormValues>=(data,event) => {
        event?.preventDefault();
        const {username,name}=data;
        console.log(username,name)
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