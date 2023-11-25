import archiver from 'archiver';
import fs from 'fs';
import { NextApiRequest, NextApiResponse } from 'next';
import { NextResponse } from 'next/server';

export  async function GET(req: NextApiRequest, res: NextApiResponse) {
  
  const folderPath = 'D:/Typescript/learnings/certficate-generator/public/images';

  // Create a writable stream for the response
  const archive = archiver('zip', { zlib: { level: 9 } });
  const zipFilePath = `${folderPath}.zip`;
  const output = fs.createWriteStream(zipFilePath);
  archive.pipe(output);
  archive.directory(folderPath, false);
  archive.finalize();

  // Stream the zip file to the response
  const stream = fs.createReadStream(zipFilePath);
  res.status(200).send({
    headers: {
      'Content-Type': 'application/zip',
      'Content-Disposition': `attachment; filename=${zipFilePath}`,
    },
    body: stream,
  });

  // Delete the zip file after the response is sent
  stream.on('end', () => {
    fs.unlinkSync(zipFilePath);
  });
}
