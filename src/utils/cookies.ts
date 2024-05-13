import { Request, Response } from 'express';

// Function to set a cookie
export const setCookie = (
  res: Response,
  name: string,
  value: string,
  options: any = {},
) => {
  res.cookie(name, value, options);
};

// Function to get a cookie
export const getCookie = (req: Request, name: string) => {
  return req.cookies[name];
};

// Function to delete a cookie
export const deleteCookie = (res: Response, name: string) => {
  res.clearCookie(name);
};
// Function to set multiple cookies
export const setCookies = (
  res: Response,
  cookies: { [name: string]: string },
  options: any = {},
) => {
  Object.entries(cookies).forEach(([name, value]) => {
    res.cookie(name, value, options);
  });
};
