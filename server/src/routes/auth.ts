import {Router,Request,Response} from "express";
import {client} from "../stream-client"

const router=Router();

router.post("/createUser", async (req : Request, res : Response) => {
   const {username,name,image} = req.body;
   if(!username || !name || !image){
    return res.status(400).json({messgae : "Required Fields are Empty"})
   }

   const newUser={
    id : username,
    role : "user",
    name,
    image
   }

   const user=await client.upsertUsers({
    users : {
        [newUser.id] : newUser,
    }
   })
   const iat=Math.floor(Date.now()/1000);
   const expiry=iat+24*60*60;
   const token=client.createToken(username,expiry);
   return res.status(200).json({token,username,name})
})

export default router;
