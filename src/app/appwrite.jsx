import { Client, Account } from "appwrite"; 

export const client = new Client(); 
 
console.log("Appwrite Endpoint:", process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT);
console.log("Project ID:", process.env.NEXT_PUBLIC_PROJECT_ID);

client
    .setEndpoint(process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT)
    .setProject(process.env.NEXT_PUBLIC_PROJECT_ID)

export const account = new Account(client); 

export {ID} from 'appwrite'