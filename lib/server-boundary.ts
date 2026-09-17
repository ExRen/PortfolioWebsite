import { cache } from "react";
import { createClient } from "@/lib/supabase/server";
// Deduped per request: one admin page load fans out to ~9 server actions that
// each call requireAdmin(). Without cache(), every call fires its own
// auth.getUser() token refresh on the same session → Supabase 409 conflicts.
async function _requireAdmin() { const supabase=await createClient(); const {data:{user}}=await supabase.auth.getUser(); if(!user) throw new Error("Unauthorized"); const {data,error}=await supabase.rpc("is_admin"); if(error||data!==true) throw new Error("Unauthorized"); return supabase; }
export const requireAdmin = cache(_requireAdmin);
export function cleanContact(input:{name?:unknown;email?:unknown;message?:unknown;locale?:unknown;honeypot?:unknown}) { const name=String(input.name??'').trim(),email=String(input.email??'').trim(),message=String(input.message??'').trim(),locale=input.locale==='id'?'id':'en'; if(input.honeypot||name.length<1||name.length>120||!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)||email.length>254||message.length<1||message.length>5000) throw new Error('Invalid contact input'); return {name,email,message,locale}; }
