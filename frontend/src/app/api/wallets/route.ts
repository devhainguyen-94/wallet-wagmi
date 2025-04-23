import { NextResponse } from "next/server";
import { generatePrivateKey } from "@/utils/generatePrivateKey";

export async function POST() {
  const wallet = generatePrivateKey();
  return NextResponse.json(wallet);
}
