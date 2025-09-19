import { PayloadSchema } from "src/schema/payload.schema";

declare module 'express-serve-static-core' {
  interface Request {
    user?: PayloadSchema;
  }
}
