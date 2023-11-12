
import { NextRequest, NextResponse } from "next/server";
import sharp from "sharp";
import { NextApiResponse } from "next";
import { writeFile } from "fs/promises"; 
import path from "path";


export const config = {
  api: {
    bodyParser: false,
  },
};

export async function POST(req:any,res : NextApiResponse){


  // let reqBody = await req.json();
  // let data =await reqBody.data.formData();
  
  const data = await req.json();
  console.log(data);
  
// console.log("this is data ",reqBody);

    // const file = data.get('file');
    // const file2 = data.get('xcor');
    // console.log(file);
    
    // if (!file) {
    //     return NextResponse.json({ "message": "no image found", success: false })
    // }
    // const byteData= await file.arrayBuffer();
    // const buffer= Buffer.from(byteData);
    // const filePath = path.join(process.cwd(), 'public',file.name);
    // // const path = `/public/${file.name}`
    // await writeFile(filePath, buffer);
    // let a=await overlayTextOnImage(filePath,50,50,"lokesh");
    // console.log(a);
    
    return NextResponse.json({"meesage":"file uploaded", success:true})

} 
const overlayTextOnImage = async (
    imageBuffer :string,
    xPercentage :number,
    yPercentage :number,
    text:string
  ) => {
    try {
      ;const svgImage = `
      <svg x="10%">
        <style>
        .title { fill: #001; font-size: 30px; font-weight: bold;}
        </style>
        <text x="50%" y="100%" text-anchor="middle" class="title">${text}</text>
      </svg>
      `;
      const svgBuffer = Buffer.from(svgImage);
      const image = await sharp(
        imageBuffer
      )
        .composite([
          {
            input: svgBuffer,
            top: yPercentage,
            left: xPercentage,
          },
        ])
        .toFile("sammy-text-overlay1.png");
      console.log(image);
    } catch (error) {
      console.error("Error overlaying text on image:", error);
      throw error;
    }
  };