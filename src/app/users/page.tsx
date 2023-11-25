"use client"

import React from 'react';
import { useState, ChangeEvent, FormEvent ,useEffect} from 'react';
import interact from 'interactjs';  
import { useRouter } from 'next/navigation';
import Download from '../download/page';
import CircularProgress from '@mui/material/CircularProgress';
import Box from '@mui/material/Box';

interface Position{
  x:number,
  y:number
 }
export default function Home(jsonData:any) {
  let router = useRouter();
  let inputElement = <div id="var" className="draggable itemA" style={{marginTop:"10px"}}>name</div>
  const [uploadedImage, setUploadedImage] = useState<string>("");
  const [file, setFile] = useState<File | null>(null);
  const [input, setinput] = useState <Array<JSX.Element>>([inputElement])
  const [loading, setloading] = useState <boolean>(false);
  const [openDownload,setopenDownload] = useState<boolean>(false);
  const [position,setPosition ] = useState<Position >({
    x:0,
    y:0
  })
  const calculatePercentage = (coordinate : number, imageSize :number):number => (coordinate / imageSize) * 100;
  const imageSize = {
    width: 1196,  // replace with the actual width of the image
    height: 924   // replace with the actual height of the image
  };
  const getCor = () => {
    const image: HTMLImageElement | null = document.getElementById('image') as HTMLImageElement;
    const overlay: HTMLElement | null = document.getElementById('var');
   
    if (image && overlay) {
      const rectImage = image.getBoundingClientRect();
      const rectDraggable = overlay.getBoundingClientRect();

      const relativeTop = rectDraggable.top - rectImage.top;
      const relativeLeft = rectDraggable.left - rectImage.left;
      const xPercentage = calculatePercentage(relativeLeft, 1196);
      const yPercentage = calculatePercentage(relativeTop, 924);
      setPosition({
        x:Math.round(relativeLeft),
        y:Math.round(relativeTop)
      })
       
      console.log(xPercentage,yPercentage);
      console.log('Relative Top:', relativeTop);
      console.log('Relative Left:', relativeLeft);
    }
  };
  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setloading(true)
    await getCor();
    if (!file) {
      console.error('No file selected');
      setloading(false)
      return;
    }

    console.log(file);
    let dataobj = {
      data:jsonData,
X:position.x,
Y:position.y
    }
    const data = new FormData();
    data.set('file', file);
    data.set('cords',JSON.stringify(dataobj))
    
console.log(data.get('file'));

    try {
      const result = await fetch('/api/users', {
        method: 'POST',
        body: data,
      });

      const parsedResult = await result.json();

      console.log(parsedResult);

      if (parsedResult.success) {
        alert('File uploaded successfully');
        // setopenDownload(true)
        
        // setopenDownload(true);
      }
    } catch (error) {
      console.error('Error uploading file:', error);
    }
  };

  const onFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      
      console.log("this is file change");
      
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onloadend = () => {
      
        const imageDataUrl = reader.result as string;
        // console.log(reader);
       
        
        setUploadedImage(imageDataUrl);
      };

    }
    setFile(file||null);
  };
  const addInp = ()=>{
    console.log("added input");
    
    
    let newInput =    <div id="var" className="draggable itemA" style={{marginTop:"10px"}}><input type='text' /></div>
  //  setinput([...input,newInput])
}
const remInp = () => {
  console.log("remove input");
  if (input.length > 0) {
    // Remove the last element from the state
    const updatedElements = [...input];
    updatedElements.pop();
    setinput(updatedElements);
  }
  
}
  useEffect(() => {
    
    const dragMoveListener = (event: any) => {
      const target = event.target;
      const x = (parseFloat(target.getAttribute('data-x')) || 0) + event.dx;
      const y = (parseFloat(target.getAttribute('data-y')) || 0) + event.dy;

      target.style.transform = `translate(${x}px, ${y}px)`;
      target.setAttribute('data-x', x);
      target.setAttribute('data-y', y);
    };

    const dragEndListener = (event: any) => {
      const target = event.target;

      // Your logic on drag end, if needed
    };

    interact('.draggable').draggable({
      inertia: true,
      autoScroll: true,
      modifiers: [
        interact.modifiers.restrictRect({
          restriction: "parent",
          endOnly: true,
        }),
      ],
      listeners: {
        move: dragMoveListener,
        end: dragEndListener,
      },
    });
  }, [])

  return (
   <div className='flex justify-center items-center flex-col mt-4'>



   
   <form onSubmit={onSubmit} className='gap-4'>
     <input className='bg-blue-400 rounded-2xl'
       type="file"
       name="file" 
       onChange={onFileChange}
     />
     <button type="submit" className='bg-blue-400 rounded-2xl mx-4 p-2'>Upload Image</button>
   </form>
  <div className='mt-4'>
  <button className='p-5 bg-slate-600 text-2xl text-white mx-6 rounded-xl' onClick={addInp}>+</button>
   <button className='p-5 bg-slate-600 text-2xl text-white rounded-xl' onClick={remInp}>-</button>
  </div>
   {
     input.map((element,index)=>{
      return React.cloneElement(element, { key: index })
     })
   }
   {/* <div id="var" className="draggable itemA" style={{marginTop:"10px"}}>

     <input type='text' />
   </div> */}
   {uploadedImage && (
       <img id="image" src={uploadedImage} className='interact dropzone' alt="Uploaded" style={{height:"50%",width:"50%"}} 
       
       />
     )}
     <button onClick={getCor}>click me to get cors</button>
  {/* {
   loading ?  <Download open={openDownload} /> :
   <Box sx={{ display: 'flex' ,height:'100vh',width:'100vw',justifyContent:'center',alignItems:'center'}}>
   <CircularProgress />
 </Box>
  } */}

   </div>
  );
}

