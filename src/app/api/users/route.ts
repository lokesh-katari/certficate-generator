import { writeFile } from "fs/promises";
import { NextApiResponse } from "next";
import sharp from "sharp";
import { NextResponse,NextRequest } from "next/server";
import path from "path";
export async function POST(req:any){
    const data = await req.formData();
    const file = data.get('file');
    let file2 = data.get('cords');
    file2 = JSON.parse(file2)
    
    
    if (!file) {
        return NextResponse.json({ "message": "no image found", success: false })
    }
    const byteData= await file.arrayBuffer();
    const buffer= Buffer.from(byteData);
    const filePath = path.join(process.cwd(), 'public',file.name);
    // const path = `/public/${file.name}`
    await writeFile(filePath, buffer);
    // let a=await overlayTextOnImage(filePath,"50","50","lokesh");
    // console.log(a);
    await overlayTextOnImage(filePath,file2.X,file2.Y,"lokesh");
    return NextResponse.json({"meesage":"file uploaded", success:true})

}
const overlayTextOnImage = async (
  imagePath:string,
  xPercentage:number,
  yPercentage:number,
  text:string
) => {
  try {
    const svgImage = `
    <svg x="10%">
      <style>
      .title { fill: #001; font-size: 30px; font-weight: bold;}
      </style>
      <text x="50%" y="100%" text-anchor="middle" class="title">${text}</text>
    </svg>
    `;
    const svgBuffer = Buffer.from(svgImage);
    console.log(xPercentage,yPercentage);
    
    const image = await sharp(
      imagePath
    )
      .composite([
        {
          input: svgBuffer,
          top: yPercentage,
          left: xPercentage,
        },
      ])
      .toFile(`watermarked-${Date.now()}.png`);
    console.log(image);
  } catch (error) {
    console.error("Error overlaying text on image:", error);
    throw error;
  }
};