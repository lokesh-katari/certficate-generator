"use client"

import React from 'react';
import { useState, ChangeEvent, FormEvent ,useEffect} from 'react';
import interact from 'interactjs';  

interface Position{
  x:number,
  y:number
 }
export default function Home(jsonData:any) {
  let inputElement = <div id="var" className="draggable itemA" style={{marginTop:"10px"}}>name</div>
  const [uploadedImage, setUploadedImage] = useState<string>("");
  const [file, setFile] = useState<File | null>(null);
  const [input, setinput] = useState <Array<JSX.Element>>([inputElement])
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
    await getCor();
    if (!file) {
      console.error('No file selected');
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
   setinput([...input,newInput])
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
    <main>
   
      <form onSubmit={onSubmit}>
        <input
          type="file"
          name="file"
          onChange={onFileChange}
        />
        <button type="submit">Upload Image</button>
      </form>
      <button className='p-5 bg-slate-600 text-xl text-white' onClick={addInp}>+</button>
      <button className='p-5 bg-slate-600 text-xl text-white' onClick={remInp}>-</button>
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
        <button onClick={getCor}> click me to get cords</button>
    </main>
  );
}

