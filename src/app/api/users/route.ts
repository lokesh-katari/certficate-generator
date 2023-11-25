import { writeFile } from "fs/promises";
import { NextApiResponse } from "next";
import sharp from "sharp";
import { NextResponse,NextRequest } from "next/server";
import path from "path";
import qr from "qrcode";
export async function POST(req:any){
    const data = await req.formData();
    const file = data.get('file');
    let file2 = data.get('cords');
    let parsedData = JSON.parse(file2);
    // console.log();
    if (!file) {
        return NextResponse.json({ "message": "no image found", success: false })
    }
    for(let i:number=0;i<parsedData.data.jsonData[0].length-1;i++){
      let jsonData = parsedData.data.jsonData[0][i]
    // console.log("this is josn",jsonData)
    
    let qrUrl = jsonData['Google Cloud Skills Boost Profile URL'];
    let name = jsonData['STUDENT NAME'];
    
    const byteData= await file.arrayBuffer();
    const buffer= Buffer.from(byteData);
    const filePath = path.join(process.cwd(), 'public',file.name);
    // const path = `/public/${file.name}`
    await writeFile(filePath, buffer);
    // let a=await overlayTextOnImage(filePath,"50","50","lokesh");
    // console.log(a);
    await overlayTextOnImage(filePath,parsedData.X,parsedData.Y,name,qrUrl);
    }
    return NextResponse.json({"meesage":"file uploaded", success:true})

}
const overlayTextOnImage = async (filePath:string, xPercentage:number, yPercentage:number, text:string,qrCodeUrl:any) => {
  try {
    console.log(xPercentage,yPercentage,qrCodeUrl);
    
    const svgImage = `
    <svg x="10%">
      <style>
      .title { fill: #001; font-size: 30px; font-weight: bold;}
      </style>
      <text x="50%" y="100%" text-anchor="middle" class="title">${text}</text>
    </svg>
    `;
   
    const qrCodeBuffer = await qr.toBuffer(qrCodeUrl, {
      errorCorrectionLevel: "H",
      scale: 2.0,
    });
    const qrCodeOverlay = {
      input: qrCodeBuffer,
      left:1008,
      top:88,
      gravity: "north",
    };
    const svgBuffer = Buffer.from(svgImage);
    const image = await sharp(filePath)
      .composite([
        {
          input: svgBuffer,
          top: yPercentage+75,
          left: xPercentage+75,
        },
        qrCodeOverlay,
      ])
      .toFile(`D:/Typescript/learnings/certficate-generator/public/images/${text}.png`);
    console.log(image);
  } catch (error) {
    console.error("Error overlaying text on image:", error);
    throw error;
  }
};
// const overlayTextOnImage = async (
//   imagePath:string,
//   xPercentage:number,
//   yPercentage:number,
//   text:string
// ) => {
//   try {
//     const svgImage = `
//     <svg xmlns="http://www.w3.org/2000/svg" >
//   <text x="50%" y="100%" dominant-baseline="middle" text-anchor="middle" fill="#000" font-size="30" font-family="Arial">
//     ${text}
//   </text>
// </svg>
//     `;
//     const svgBuffer = Buffer.from(svgImage);
//     console.log(xPercentage,yPercentage);
    
//     const image = await sharp(
//       imagePath
//     )
//       .composite([
//         {
//           input: svgBuffer,
//           top: yPercentage+75,
//           left: xPercentage+85,
//         },
//       ])
//       .toFile(`watermarked-${Date.now()}.png`);
//     console.log(image);
//   } catch (error) {
//     console.error("Error overlaying text on image:", error);
//     throw error;
//   }
// };