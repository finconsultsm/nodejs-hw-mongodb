import express from 'express';
import cors from 'cors';
import pino from 'pino-http';
import { getContacts, getContactById } from './services/contacts.js';

const app = express();

const logger = pino();
app.use(logger);
app.use(cors());

// Handle non-existing routes
app.get('/contacts', async (req, res) => {
  const contacts = await getContacts();
  res.send({
    status: 200,
    message: 'Successfully found contacts!',
    data: contacts,
  });
});

app.use('/contacts/:contactId', async (req, res) => {
  const { contactId } = req.params;

  try {
    const contact = await getContactById(contactId);

    if (!contact) {
      res.status(404).send({
        message: 'Contact not found!',
      });
      return;
    }

    res.send({
      status: 200,
      message: `Successfully found contact with id ${contactId}!`,
      data: contact,
    });
  } catch (error) {
    res.status(400).send({
      message: 'Internal server error!',
      error: error,
    });
  }
});

app.use((req, res, next) => {
  res.status(404).json({ message: 'Not found' });
});

export function setupServer() {
  const PORT = process.env.PORT || 3000;
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
}
