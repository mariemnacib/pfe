// pages/api/auth/signout.js
import { getServerSession } from "next-auth/next";
import { authOptions } from "./[...nextauth]";

export default async function handler(req, res) {
  try {
    console.log("Custom signout API route called");
    const session = await getServerSession(req, res, authOptions);
    
    if (session) {
      console.log("Active session found during signout, clearing it");
    } else {
      console.log("No active session found during signout");
    }
    
    // Get all cookies from the request
    const cookies = req.headers.cookie?.split(';') || [];
    console.log("All cookies:", cookies);
    
    // Identify NextAuth cookies (they typically start with 'next-auth')
    const nextAuthCookies = cookies.filter(cookie => cookie.trim().startsWith('next-auth'));
    console.log("NextAuth cookies found:", nextAuthCookies);
    
    // Create an array of Set-Cookie headers to clear all NextAuth cookies
    // This includes both standard names and potential variations
    const cookiesToClear = [
      `next-auth.session-token=; Path=/; Expires=Thu, 01 Jan 1970 00:00:00 GMT; HttpOnly; SameSite=Lax`,
      `next-auth.csrf-token=; Path=/; Expires=Thu, 01 Jan 1970 00:00:00 GMT; HttpOnly; SameSite=Lax`,
      `next-auth.callback-url=; Path=/; Expires=Thu, 01 Jan 1970 00:00:00 GMT; HttpOnly; SameSite=Lax`,
      `__Secure-next-auth.session-token=; Path=/; Expires=Thu, 01 Jan 1970 00:00:00 GMT; HttpOnly; SameSite=Lax; Secure`,
      `__Secure-next-auth.csrf-token=; Path=/; Expires=Thu, 01 Jan 1970 00:00:00 GMT; HttpOnly; SameSite=Lax; Secure`,
      `__Secure-next-auth.callback-url=; Path=/; Expires=Thu, 01 Jan 1970 00:00:00 GMT; HttpOnly; SameSite=Lax; Secure`,
      `__Host-next-auth.csrf-token=; Path=/; Expires=Thu, 01 Jan 1970 00:00:00 GMT; HttpOnly; SameSite=Lax; Secure`,
    ];
    
    // Add any dynamically identified cookies from the request
    nextAuthCookies.forEach(cookie => {
      const cookieName = cookie.split('=')[0].trim();
      if (cookieName && !cookiesToClear.some(c => c.startsWith(cookieName))) {
        cookiesToClear.push(`${cookieName}=; Path=/; Expires=Thu, 01 Jan 1970 00:00:00 GMT; HttpOnly; SameSite=Lax`);
      }
    });
    
    console.log("Setting cookies to clear:", cookiesToClear);
    res.setHeader('Set-Cookie', cookiesToClear);
    
    console.log("Redirecting to signin page after cookie cleanup");
    res.redirect(307, "/signin?signout=true");
  } catch (error) {
    console.error("Error in signout handler:", error);
    res.redirect(307, "/signin?error=signout");
  }
}