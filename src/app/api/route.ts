
import { NextRequest, NextResponse } from "next/server";
import sharp from "sharp";
import { NextApiResponse } from "next";
import { writeFile } from "fs/promises"; 
import path from "path";


// export const config = {
//   api: {
//     bodyParser: false,
//   },
// };

export async function POST(req:any,res : NextApiResponse){


  let reqBody = await req.json();
  console.log(reqBody);
  
  // let data =await reqBody.data.formData();
  
//   const data = await req.formData();
//   console.log(data);
  
// // console.log("this is data ",reqBody);

//     const file = data.get('file');
//     // const file2 = data.get('xcor');
//     console.log(file);
    
    if (!reqBody) {
        return NextResponse.json({ "message": "no image found", success: false })
    }
    // const byteData= await file.arrayBuffer();
    // const buffer= Buffer.from(byteData);
    // const filePath = path.join(process.cwd(), 'public',file.name);
    // // const path = `/public/${file.name}`
    // await writeFile(filePath, buffer);
    // let a=await overlayTextOnImage(filePath,50,50,"lokesh");
    // console.log(a);
    
    return NextResponse.json({"meesage":"file uploaded", success:true})

} 
