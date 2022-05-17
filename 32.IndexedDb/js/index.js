// IIFE - Immediately Invokable Function Expression
// Function Declaration
// Function Expression
// Arrow Function
// IIFE

// Syntax - IIFE
// (function() {
//     for( let i = 1; i <= 5; i++) {
//         console.log(i);
//     }
// })()

// ;(function() {
//     for( let i = 1; i <= 5; i++) {
//         console.log(i);
//     }
// })()

(function() {
    // Function body
    // 1. check if the IndexedDB is suppored by our browser
    if(!window.indexedDB) {
        console.log(`Your browser doesn't support indexedDB...`)
        return;
    }

    // 2. Open a database
    let request = indexedDB.open('Demo', 1); // Promise: success and error (IDBOpenDBRequest) object
    console.log(request);

    // 3. Create object store and index
    request.onupgradeneeded = (event) => {
        let db = event.target.result;

        // Creating 'Contacts' object store with autoIncrement id
        let store = db.createObjectStore('Contacts', { // firstName, lastName, email
            autoIncrement: true
        });

        // index as 'email' property
        let index = store.createIndex('email', 'email', {
            unique: true,
        });
    };

    // handle the error event
    request.onerror = (event) => {
        console.error(`Database error: ${event.target.errorCode}`);
    };
    // handle the success event
    request.onsuccess = (event) => {
        console.log(event);
        const db = event.target.result; // IDBDatabase

        // Insert Contacts
        // insertContact(db, {
        //     email: 'SkillSafari@edukeys.in',
        //     firstName: 'SkillSafari',
        //     lastName: 'EduKeys'
        // });

        // insertContact(db, {
        //     email: 'EduKeys@skillsafari.in',
        //     firstName: 'EduKeys',
        //     lastName: 'SkillSafari',
        // });

        // Get the contact by Key
        // getContactById(db, 2);

        // Get the contact by index (email)
        // getContactByIndex(db, 'SkillSafari@edukeys.in');

        // Get all the contacts
        // getAllContacts(db);

        // Delete a contact by Key
        deleteContactById(db, 2);
    }

    // 4. Insert data into object stores
    function insertContact(db, contact) {
        // create a new transaction
        let txn = db.transaction('Contacts', 'readwrite'); // IDBTransaction
        // get the 'Contacts' object store
        let store = txn.objectStore('Contacts'); // IDBObjectStore
        let query = store.put(contact); // Promise: success and error (IDBRequest)
        // handle success case
        query.onsuccess = function(event) {
            console.log(event)
        };
        // handle error case
        query.onerror = function(event) {
            console.log(event.target.errorCode);
        };
        // close the db once transaction completed
        txn.oncomplete = function() {
            db.close();
        };
    }

    // 5. Read data from objectStore by Key
    function getContactById(db, id) {
        // create a new transaction
        let txn = db.transaction('Contacts', 'readwrite'); // IDBTransaction
        // get the 'Contacts' object store
        let store = txn.objectStore('Contacts'); // IDBObjectStore
        let query = store.get(id); // IDBRequest
        console.log(query);
        // handle success case
        query.onsuccess = function(event) {
            if(!event.target.result) {
                console.log(`The contact with id: ${id} not found`);
            } else {
                console.table(event.target.result);
            }
        };
        // handle error case
        query.onerror = function(event) {
            console.log(event.target.errorCode);
        };
        // close the db once transaction completed
        txn.oncomplete = function() {
            db.close();
        };
    }

    // 6. Read data from objectStore by an index
    function getContactByIndex(db, email) {
        // create a new transaction
        let txn = db.transaction('Contacts', 'readwrite'); // IDBTransaction
        // get the 'Contacts' object store
        let store = txn.objectStore('Contacts'); // IDBObjectStore
        // get the index from the Object store
        let index = store.index('email');
        // query by indexes
        let query = index.get(email);
        // return the result object on success
        query.onsuccess = (event) => {
            console.table(event.target.result);
        };
        query.onerror = (event) => {
            console.log(event.target.errorCode);
        };
        // close the db connection
        txn.oncomplete = () => {
            db.close();
        }
    }


    // 7. Read all the data from the objectStore
    function getAllContacts(db) {
        // create a new transaction
        let txn = db.transaction('Contacts', 'readwrite'); // IDBTransaction
        // get the 'Contacts' object store
        let store = txn.objectStore('Contacts'); // IDBObjectStore
        store.openCursor().onsuccess = (event) => {
            let cursor = event.target.result;
            // console.log(cursor);
            if (cursor) {
                let contact = cursor.value;
                console.log(contact);
                // continue next record
                cursor.continue();
            }
        };
        txn.oncomplete = () => {
            db.close();
        }
    }

    // 8. Delete a data in the objectStore
    function deleteContactById(db, id) {
        // create a new transaction
        let txn = db.transaction('Contacts', 'readwrite'); // IDBTransaction
        // get the 'Contacts' object store
        let store = txn.objectStore('Contacts'); // IDBObjectStore
        let query = store.delete(id)
        query.onsuccess = (event) => {
            console.log(event);
        };
        query.onerror = (event) => {
            console.log(event.target.errorCode);
        };
        txn.oncomplete = () => {
            db.close();
        }
    }

})()