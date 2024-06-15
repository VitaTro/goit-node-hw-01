// оголошую змінну, яка використовує модуль fs(система файлів).
// метод .promises дозволяє використовувати обіцянки для асинхронних операцій з файлами
const fs = require("fs").promises;

// треба для роботи з шляхами файлів
const path = require("node:path");

// const { nanoid } = require("nanoid");
const nanoid = async () => {
  const { nanoid } = await import("nanoid");
  return nanoid();
};
/*
 * Skomentuj i zapisz wartość
 * const contactsPath = ;
 */

// _dirname є глобальною змінною, за допомогою якої я можу прочитати всі файли з нашого каталогу(репо)
const contactsPath = path.format({
  root: "/ignored",
  dir: "db",
  base: "contacts.json",
});

// TODO: udokumentuj każdą funkcję
function listContacts() {
  // ...повертає всі контакти
  fs.readFile(contactsPath).then((contacts) =>
    console.table(JSON.parse(contacts))
  );
}

function getContactById(contactId) {
  // ...повертає об'єкт контакту з таким id.якщо не знайдено, то null
  fs.readFile(contactsPath)
    .then((contacts) =>
      JSON.parse(contacts).find((contact) => contact.id === contactId)
    )
    .then((contact) => console.table(contact));
}

async function removeContact(contactId) {
  // ...twój kod
  let content = null;
  await fs
    .readFile(contactsPath)
    .then((contacts) => JSON.parse(contacts))
    .then((contacts) => contacts.filter((contact) => contact.id !== contactId))
    .then((contacts) => (content = JSON.stringify(contacts)));
  await fs.writeFile(contactsPath, content);
  listContacts();
}

async function addContact(name, email, phone) {
  // ...повертає об'єкт доданого контакту
  let content = null;
  await fs
    .readFile(contactsPath)
    .then((contacts) => JSON.parse(contacts))
    .then((contacts) => {
      let id = Number(contacts[contacts.length - 1].id) + 1;
      let newContacts = [
        ...contacts,
        { id: id.toString(), name, email, phone },
      ];
      return newContacts;
    })
    .then((contacts) => (content = JSON.stringify(contacts)));
  await fs.writeFile(contactsPath, content);
  listContacts();
  // const contacts = await listContacts();
  // const newContact = {
  //   id: nanoid,
  //   ...data,
  // };
  // contacts.push(newContact);
  // await fs.writeFile(contactsPath, JSON.stringify(contacts, null, 2));
  // return newContact;
}

module.exports = {
  listContacts,
  addContact,
  removeContact,
  getContactById,
};
