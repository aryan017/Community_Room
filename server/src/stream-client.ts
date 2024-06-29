import { StreamClient } from "@stream-io/node-sdk";
import dotenv from 'dotenv';

dotenv.config();

const ApiKey=process.env.KEY;
const ApiSecret=process.env.SECRET;

export const client=new StreamClient(String(ApiKey),String(ApiSecret));