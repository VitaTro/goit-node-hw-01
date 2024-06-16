// оголошую змінну, яка використовує модуль fs(система файлів).
// метод .promises дозволяє використовувати обіцянки для асинхронних операцій з файлами
const fs = require("fs").promises;

// треба для роботи з шляхами файлів
const path = require("node:path");

const getNanoid = async () => {
  const { nanoid } = await import("nanoid");
  return nanoid();
};

const contactsPath = path.format({
  root: "/ignored",
  dir: "db",
  base: "contacts.json",
});

// ...повертає всі контакти
async function listContacts() {
  try {
    const contacts = await fs.readFile(contactsPath);
    console.table(JSON.parse(contacts));
  } catch (error) {
    console.error("Error reading contacts:", error);
  }
}

// ...повертає об'єкт контакту з таким id.якщо не знайдено, то null
async function getContactById(contactID) {
  try {
    const contacts = await fs.readFile(contactsPath);
    const contact = JSON.parse(contacts).find(
      (contact) => contact.id === contactID
    );
    console.table(contact);
  } catch (error) {
    console.error("Error getting contact:", error);
  }
}

//видаляє об'єкт за заданими параметрами
async function removeContact(contactID) {
  let content = null;
  await fs
    .readFile(contactsPath)
    .then((contacts) => JSON.parse(contacts))
    .then((contacts) => contacts.filter((contact) => contact.id !== contactID))
    .then((contacts) => (content = JSON.stringify(contacts)));
  await fs.writeFile(contactsPath, content);
  listContacts();
}

// ...повертає об'єкт доданого контакту
async function addContact(name, email, phone) {
  let content = null;
  const id = await getNanoid();
  await fs
    .readFile(contactsPath)
    .then((contacts) => JSON.parse(contacts))
    .then((contacts) => {
      // let id = nanoid();
      let newContacts = [...contacts, { id, name, email, phone }];
      return newContacts;
    })
    .then((contacts) => (content = JSON.stringify(contacts)));
  await fs.writeFile(contactsPath, content);
  listContacts();
}

module.exports = {
  listContacts,
  getContactById,
  removeContact,
  addContact,
};
