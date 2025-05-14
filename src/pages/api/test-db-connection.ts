import type { NextApiRequest, NextApiResponse } from 'next';
import dbConnect from '../../lib/mongodb';


export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    await dbConnect();
    res.status(200).json({ message: 'Successfully connected to MongoDB' });
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    res.status(500).json({ message: 'Failed to connect to MongoDB', error: errorMessage });
  }
}
