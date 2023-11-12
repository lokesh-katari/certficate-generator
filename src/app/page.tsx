'use client'
import React, { ChangeEvent, useState,useEffect ,FormEvent} from 'react';
import Head from 'next/head';
import interact from 'interactjs';  
import Image from 'next/image';
import axios from 'axios'

interface Position{
 x:number,
 y:number
}
const Home: React.FC = () => {
  const [uploadedImage, setUploadedImage] = useState<string>("");
  const [position,setPosition ] = useState<Position >({
    x:0,
    y:0
  })
  const handleImageUpload = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files && e.target.files[0];
   
    console.log();
    if (file) {
      
      
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onloadend = () => {
      
        const imageDataUrl = reader.result as string;
        // console.log(reader);
       
        
        setUploadedImage(imageDataUrl);
      };

    }
  };
  const uploadToServer = async (event : any) => {
    // const body = new FormData();
    // body.append("file", uploadedImage);
    // body.append("x",position.x.toString());
    // body.append("y",position.y.toString());

  // // JSON.parse(body)
  // let body = JSON.stringify(uploadedImage)
  // console.log(body);
  

  console.log(uploadedImage);
  
    const {data} = await axios.post("/api",uploadedImage,{
      headers:{
        'Content-Type': 'application/json'
      }
    });
    console.log(data);
    
  };
  const calculatePercentage = (coordinate : number, imageSize :number):number => (coordinate / imageSize) * 100;
  const imageSize = {
    width: 1196,  // replace with the actual width of the image
    height: 924   // replace with the actual height of the image
  };
  // Assuming imageSize is the original size of the image
  const imageWidth = imageSize.width; // replace with actual image width
  const imageHeight = imageSize.height; // replace with actual image height
  
  // const elementX = 100; // replace with actual X coordinate of the HTML element
  // const elementY = 50; // replace with actual Y coordinate of the HTML element
  

  
  const getCor = () => {
    const image: HTMLImageElement | null = document.getElementById('image') as HTMLImageElement;
    const overlay: HTMLElement | null = document.getElementById('var');
   
    if (image && overlay) {
      const rectImage = image.getBoundingClientRect();
      const rectDraggable = overlay.getBoundingClientRect();

      const relativeTop = rectDraggable.top - rectImage.top;
      const relativeLeft = rectDraggable.left - rectImage.left;
      const xPercentage = calculatePercentage(relativeLeft, imageWidth);
      const yPercentage = calculatePercentage(relativeTop, imageHeight);
      setPosition({
        x:xPercentage,
        y:yPercentage
      })
       
      console.log(xPercentage,yPercentage);
      console.log('Relative Top:', relativeTop);
      console.log('Relative Left:', relativeLeft);
    }
  };
  
  
  
  
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
  


  //   interact("#dropzoneB").dropzone({
  //     accept: ".itemB",
  //     overlap: 0.75,
  //     ondragenter: onDragEnter,
  //     ondragleave: onDragLeave,
  //     ondrop: onDrop,
  //   });
  
  
  const [file, setFile] = useState<File | null>(null);

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (!file) {
      console.error('No file selected');
      return;
    }

    

    const data =  new FormData();
    data.set('file', file);
    // data.append('xcor',"90");
    console.log(data.get('file'));
    // const body={
      
    //   data:data,
    //   arr :[
    //     {
    //       xcor:"90",
    //       ycor:"90"
    //     }
    //   ]
    // }
    try {
      console.log("this is body",data);
      
      const result = await fetch('/api/', {
        method: 'POST',
        headers:{
          'Content-Type': 'application/json'
        },
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
    const selectedFile = e.target.files?.[0];
    setFile(selectedFile || null);
  };
 
  
 
  
  return (
    <>
    <div>
      <div id="var" className="draggable itemA" style={{marginTop:"150px"}}>AB</div>
    
    
    {/* <input type="file" accept="image/*" onChange={handleImageUpload} /> */}
    <form onSubmit={onSubmit}>
        <input
          type="file"
          name="file"
          onChange={onFileChange}
        />
        <button type="submit">Upload Image</button>
      </form>
    </div>
    {/* <YourComponent/> */}
      <Head>
        <title>Next.js Image Upload</title>
        <meta name="description" content="Image upload and display with Next.js" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
    <div className="container">
    {uploadedImage && (
          <Image id="image" src={uploadedImage} className='interact dropzone' alt="Uploaded"  width={500}
          height={500}
          />
        )}
      {/* <div id="dropzoneB" className="interact dropzone">Dropzone B</div> */}
      <button onClick={getCor}>click</button>
      <button onClick={uploadToServer}>click to upload</button>
    </div>

    
    </>
  );
};

export default Home;
