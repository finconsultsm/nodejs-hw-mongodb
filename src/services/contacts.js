import { Contact } from '../db/models/contact.js';
import { calculatePaginationData } from '../utils/calculatePaginationData.js';

const SORT_ORDER = {
  ASC: 'asc',
  DESC: 'desc',
};

export const getContacts = async ({
  page = 1,
  perPage = 10,
  sortBy = 'name',
  sortOrder = SORT_ORDER.ASC,
  filter = {},
  userId,
}) => {
  const limit = perPage;
  const skip = (page - 1) * perPage;

  const contactsFilter = Contact.find();

  if (filter.type) {
    contactsFilter.where('contactType').equals(filter.type);
  }

  if (filter.isFavourite !== null) {
    contactsFilter.where('isFavourite').equals(filter.isFavourite);
  }

  contactsFilter.where('userId').equals(userId);

  const [count, data] = await Promise.all([
    Contact.find().merge(contactsFilter).countDocuments(),
    Contact.find()
      .merge(contactsFilter)
      .skip(skip)
      .limit(limit)
      .sort({
        [sortBy]: sortOrder,
      })
      .exec(),
  ]);

  const paginationInformation = calculatePaginationData(page, perPage, count);

  return { data, ...paginationInformation };
};

export const getContactById = async (id, userId) => {
  return await Contact.findOne({
    _id: id,
    userId,
  });
};
export const createContact = async (payload, userId) => {
  return await Contact.create({ ...payload, userId });
};

export const deleteContact = async (id, userId) => {
  return await Contact.findOneAndDelete({ _id: id, userId });
};

export const updateContact = async (id, payload, userId) => {
  return await Contact.findOneAndUpdate({ _id: id, userId }, payload, {
    new: true,
  });
};
