"use client"
import { useState, ChangeEvent, FormEvent } from "react";
import Papa from 'papaparse';
import { useRouter } from "next/navigation";
import Home from "./users/page";
// import { Router, useRouter } from "next/router";

export default function Home2() {
  const [file, setFile] = useState<File | null>(null);
 const [showComp,setshowComp] = useState<boolean>(false);
 const [jsonData, setjsonData] = useState<Array<object>>([])
 const router = useRouter();
  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (file) {
      try {
        // Read the contents of the CSV file
        const csvData = await readFile(file);

        // Parse the CSV data
        const jsonData = parseCSV(csvData);
        // console.log(jsonData);
        setjsonData(Array(jsonData))
        // Send the JSON data to your API
        const result = await sendJSONData(jsonData);

        console.log(result);

        if (result.success) {
          console.log('File uploaded successfully');
        }
      } catch (error) {
        console.error('Error processing file:', error);
      }
    }
  };
  
  const onFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    setFile(file || null);
  };
  
  const readFile = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target) {
          resolve(event.target.result as string);
        } else {
          reject(new Error('Error reading file'));
        }
      };
      reader.readAsText(file);
    });
  };
  
  const parseCSV = (csvData: string): any[] => {
    // Parse CSV to JSON using papaparse
    const result = Papa.parse(csvData, { header: true });
    return result.data;
  };
  
  const sendJSONData = async (jsonData: any[]): Promise<any> => {
    try {
      // const result = await fetch('/api', {
      //   method: 'POST',
      //   headers:{
      //     'Content-Type': 'application/json',
      //   },

      //   body: JSON.stringify(jsonData),
      // });
      setshowComp(true)
      // return await result.json();
    } catch (error) {
      throw new Error('Error uploading file:');
    }
  };

  return (
    <>
      <main>
      <h1>Upload CSV as JSON</h1>
      <form onSubmit={onSubmit}>
        <input type="file" name="file" onChange={onFileChange} />
        <button type="submit">Upload JSON</button>
      </form>
    </main>
    {showComp&&<>
     <h1>
      this is comp
     </h1>
    <Home jsonData={jsonData}/>
    </>
      
    }
    
    </>
  );
}
