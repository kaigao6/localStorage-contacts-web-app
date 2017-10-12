document.addEventListener("DOMContentLoaded", init);
let contactList = [];

function init() {
    var localStorageExist = localStorage.getItem("gao00078");
    
    // add listener for save button'
    document.querySelector(".buttonSave").addEventListener("click", saveContact);
    
    // add listener for cancel button
    document.querySelector(".buttonCancel").addEventListener("click", cancelContact);
    
    // for fab
    document.querySelector(".fab").addEventListener("click", addNewContact);
    
    // Initialization for localStorage
    if (!localStorageExist) {
        // localStorage with a key does not exist
        
        let contact1 = {
            fullname: "Kai Gao", 
            email: "kai.g@school.org", 
            phone: "66666666"
        };
        
        
        
        
        contactList.push(contact1);
//        contactList.push(contact2);
        
        saveContactsToLocalStorage();
    } else {
        // localStorage exists    
        contactList = JSON.parse(localStorageExist);
    }
    
    displayContacts();
}

function addNewContact(ev) {
    
    // display the modal window and disable the background
    document.querySelector(".overlay").style.display = "block";
    document.querySelector(".modal").style.display = "block";
    
    // selecting input fields
    let nameInput = document.getElementById("name");
    let emailInput = document.getElementById("email");
    let phoneInput = document.getElementById("phone");
    
    // clear all the values of inputs
    nameInput.value = "";
    emailInput.value = "";
    phoneInput.value = "";
    
    // set saveBtn data-action with "add"
    let saveBtn = document.querySelector('.buttonSave');
    saveBtn.setAttribute('data-action', 'add');
}

function cancelContact(ev) {
    document.querySelector(".overlay").style.display = "none";
    document.querySelector(".modal").style.display = "none";
};

function saveContact(ev) {
    //prevent the form from submitting
    ev.preventDefault();    
    
    let saveBtn = document.querySelector('.buttonSave');
    let action = saveBtn.getAttribute("data-action");
    
    switch(action) {
        case "add":
            console.log('adding!');
            
            let temContact = {
                fullname: document.querySelector("#name").value, 
                email:    document.querySelector("#email").value, 
                phone:    document.querySelector("#phone").value
            };
            
            contactList.push(temContact);
            break;
            
        case "edit":
            console.log('editing!');
            
            // get the index from save button
            let editIndex = saveBtn.getAttribute('data-edit-index');
            contactList[editIndex].fullname = document.querySelector("#name").value;
            contactList[editIndex].email    = document.querySelector("#email").value; 
            contactList[editIndex].phone    = document.querySelector("#phone").value;
            console.log(contactList[editIndex]);
            
            break;
    }
    
    saveContactsToLocalStorage();
    document.querySelector(".overlay").style.display = "none";
    document.querySelector(".modal").style.display = "none";
    displayContacts();
}

function sortContactListByNames() {
        // sort the contacts by names alphabetically
    contactList.sort(function (a, b) {
        let nameA = a.fullname.toUpperCase(); //ignore upper and lowercase
        let nameB = b.fullname.toUpperCase();
        if (nameA < nameB) {
            return -1;
        }
        if (nameA > nameB) {
            return 1;
        }
        return 0; //names must be equal
    });
    saveContactsToLocalStorage();    
}

function displayContacts() {

    sortContactListByNames();
    
    
    let ul = document.querySelector(".contacts");
    ul.innerHTML = "";
    
    // make html elements for each contact to be displayed
    contactList.forEach(function (value) {
        
        // contact
        let li = document.createElement("li");
        li.className = "contact";
        
        // delete button
        let span = document.createElement("span");
        span.className = "delete";
        
        // fullname
        let h3 = document.createElement("h3");
        h3.textContent = value.fullname;
        
        // email
        let pe = document.createElement("p");
        pe.className = "email";
        pe.textContent = value.email;
        
        // phone
        let pp = document.createElement("p");
        pp.className = "phone";
        pp.textContent = value.phone;
        
        // append all the elements to li
        li.appendChild(span);
        li.appendChild(h3);
        li.appendChild(pe);
        li.appendChild(pp);
        
        // append the contact li to ul
        ul.appendChild(li);
    });
    
    // attach eventListeners to delete buttons
    let deleteButtons = document.querySelectorAll(".delete");
    deleteButtons.forEach(function (value) {
        value.addEventListener("click", deleteContact);
    });
    
    // attach eventListeners to edit buttons
    let editButtons = document.querySelectorAll(".contact h3 , .contact p");
    editButtons.forEach(function (value) {
        value.addEventListener("click", editContact);
    });
}

function editContact(ev) { //entrie event
    
    // show the edit modal window and disable the background
    document.querySelector(".overlay").style.display = "block";
    document.querySelector(".modal").style.display = "block";
    
    // find the index of clicked li element
    var clicked = ev.target;    
    var clickedLi = clicked.parentNode;    
    var clickedIndex = Array.from(clickedLi.parentNode.children).indexOf(clickedLi);
    
    document.getElementById("name").value = contactList[clickedIndex].fullname;
    document.getElementById("email").value = contactList[clickedIndex].email;
    document.getElementById("phone").value = contactList[clickedIndex].phone;
    
    // set save button data-action with 'edit'
    let saveBtn = document.querySelector('.buttonSave');
    saveBtn.setAttribute('data-action', 'edit');
    
    // pass the index to the save button
    saveBtn.setAttribute('data-edit-index', clickedIndex);
    


    
    
    
    
}

function deleteContact(ev) { //entrie event
    //currentTarget is span //get the listItem that was just clicked
    let li = ev.currentTarget.parentElement;
    //get the contact name in this listitem
    let contactName = li.querySelector("h3").textContent;
    let index = -1; //init to -1 = not found
    //save time by defining len in first part
    //lets find the index of the element that contains this contact name
    for (let i = 0, len = contactList.length; i < len; i++) {
        if (contactList[i].fullname == contactName) {
            index = i;
            break; //kick you out of your loop, does not work with forEach loop
        }
    }
    console.log("our index" + index);
    //if we found it remove it from the contacts list
    if (index > -1) {
        contactList.splice(index, 1); //removing that contact object
    } // but in Application localstorage there is still complete JSON string， where is contactList stored?
    console.log("The new contact list is: " + contactList);
    //Next remove the contact listitem from the ul
    li.parentElement.removeChild(li);
    //Finally save the contacts array to localstorage or remove the contacts key
    if (contactList.length > 0) {
        saveContactsToLocalStorage(); // we donot delete sth from localstorage, we set the whole thing again?
    }
    else {
        localStorage.removeItem("gao00078"); //refresh
    }
}

function saveContactsToLocalStorage() {
    localStorage.setItem("gao00078", JSON.stringify(contactList));
}