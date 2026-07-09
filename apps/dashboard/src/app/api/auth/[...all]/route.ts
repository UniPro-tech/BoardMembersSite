import { toNextJsHandler } from "better-auth/next-js";
import { auth } from "@/libs/auth"; // path to your auth file

export const { POST, GET } = toNextJsHandler(auth);
