/* eslint-disable @typescript-eslint/no-unused-vars */

import nextjs from 'next';
import { ParsedUrlQuery } from 'querystring';

declare global {
    namespace Express {
        interface Request {
            nextApp: ReturnType<typeof nextjs>;
        }

        interface Response {
            renderPage(pathname: string, query?: ParsedUrlQuery): void;
        }
    }
}
